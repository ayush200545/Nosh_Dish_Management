import asyncio
import json
from typing import List
from datetime import datetime, timedelta
import os
import shutil
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, status, UploadFile, File, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import boto3
from botocore.exceptions import NoCredentialsError
from database import get_db
from models import DishResponse, DishUpdate, UserCreate, DishCreate, DishFullUpdate, UserUpdate, UserResponse, Review, DishReorderItem
from auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, get_current_admin
from bson import ObjectId

app = FastAPI(title="Nosh Dish Management API")

S3_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
S3_REGION = os.getenv("AWS_REGION", "ap-south-1")
s3_client = boto3.client('s3', region_name=S3_REGION)

# Setup Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Global Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled Exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error. Please try again later."},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid Request Parameters", "errors": exc.errors()},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow Vercel domain
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.dish_viewers: dict[str, list[WebSocket]] = {}
        self.chat_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)

    # For Dish Viewers
    async def connect_dish(self, websocket: WebSocket, dish_id: str):
        await websocket.accept()
        if dish_id not in self.dish_viewers:
            self.dish_viewers[dish_id] = []
        self.dish_viewers[dish_id].append(websocket)
        await self.broadcast_viewers(dish_id)

    def disconnect_dish(self, websocket: WebSocket, dish_id: str):
        if dish_id in self.dish_viewers and websocket in self.dish_viewers[dish_id]:
            self.dish_viewers[dish_id].remove(websocket)
        # Cannot broadcast async here directly if it's not awaited, but we handle it in the endpoint

    async def broadcast_viewers(self, dish_id: str):
        if dish_id not in self.dish_viewers: return
        count = len(self.dish_viewers[dish_id])
        dead_connections = []
        for connection in self.dish_viewers[dish_id]:
            try:
                await connection.send_text(json.dumps({"type": "VIEWER_COUNT", "count": count}))
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect_dish(dead, dish_id)

    # For Live Chat
    async def connect_chat(self, websocket: WebSocket):
        await websocket.accept()
        self.chat_connections.append(websocket)

    def disconnect_chat(self, websocket: WebSocket):
        if websocket in self.chat_connections:
            self.chat_connections.remove(websocket)

    async def broadcast_chat(self, message: dict):
        dead_connections = []
        for connection in self.chat_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect_chat(dead)

manager = ConnectionManager()

@app.post("/api/v1/auth/register")
async def register(user_data: UserCreate):
    db = get_db()
    user = await db.users.find_one({"email": user_data.email})
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    
    await db.users.insert_one(user_dict)
    return {"message": "User registered successfully"}

@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"]}

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "server": "running"
    }

@app.get("/api/v1/dishes")
async def get_dishes(current_user = Depends(get_current_user)):
    db = get_db()
    cursor = db.dishes.find({}).sort("orderIndex", 1)
    dishes = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        dishes.append(document)
    return dishes

@app.patch("/api/v1/dishes/{dish_id}/toggle")
async def toggle_dish(dish_id: str, update_data: DishUpdate, current_admin = Depends(get_current_admin)):
    db = get_db()
    # Assuming dish_id is the custom "dishId" field (e.g. "DISH-001"), not the MongoDB ObjectId
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        try:
            obj_id = ObjectId(dish_id)
            dish = await db.dishes.find_one({"_id": obj_id})
        except Exception:
            pass

    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
        
    await db.dishes.update_one(
        {"dishId": dish_id},
        {"$set": {"isPublished": update_data.isPublished}}
    )
    
    action_type = "Published" if update_data.isPublished else "Unpublished"
    time_str = datetime.now().isoformat()
    
    event = {
        "type": "DISH_UPDATED",
        "dishId": dish_id,
        "isPublished": update_data.isPublished
    }
    
    activity = {
        "type": "ACTIVITY_LOG",
        "action": action_type,
        "dishName": dish.get("dishName"),
        "user": current_admin["email"],
        "timestamp": time_str
    }
    
    await db.activities.insert_one(activity)
    
    await manager.broadcast(event)
    activity["_id"] = str(activity["_id"])
    await manager.broadcast({"type": "NEW_ACTIVITY", "activity": activity})
    
    return {"message": "Dish status updated successfully"}

@app.delete("/api/v1/dishes/{dish_id}")
async def delete_dish(dish_id: str, current_admin = Depends(get_current_admin)):
    db = get_db()

    # Try deleting by the custom dishId field first
    result = await db.dishes.delete_one({"dishId": dish_id})

    # If nothing was deleted, attempt to delete by MongoDB ObjectId (_id)
    if result.deleted_count == 0:
        try:
            obj_id = ObjectId(dish_id)
            result = await db.dishes.delete_one({"_id": obj_id})
        except Exception:
            pass

    print(f"DELETE request for dishId={dish_id}, deleted_count={result.deleted_count}")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dish not found")

    # Broadcast deletion so all clients refresh
    await manager.broadcast({"type": "DISH_DELETED", "dishId": dish_id})
    return {"message": "Dish deleted successfully", "deleted_count": result.deleted_count}

@app.post("/api/v1/upload")
async def upload_image(file: UploadFile = File(...), current_admin = Depends(get_current_admin)):
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"dishes/{ObjectId()}{file_extension}"
    
    try:
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            unique_filename,
            ExtraArgs={'ContentType': file.content_type}
        )
        s3_url = f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{unique_filename}"
        return {"imageUrl": s3_url, "url": s3_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 Upload Error: {str(e)}")

@app.patch("/api/v1/dishes/reorder")
async def reorder_dishes(items: List[DishReorderItem], current_admin = Depends(get_current_admin)):
    db = get_db()
    
    # Update all items
    for item in items:
        await db.dishes.update_one(
            {"dishId": item.dishId},
            {"$set": {"orderIndex": item.orderIndex}}
        )
    
    # Broadcast an event so clients refresh their lists
    await manager.broadcast({"type": "DISH_UPDATED"})
    return {"message": "Dishes reordered successfully"}

@app.post("/api/v1/dishes")
async def create_dish(dish_data: DishCreate, current_admin = Depends(get_current_admin)):
    db = get_db()
    
    # Generate unique dishId
    count = await db.dishes.count_documents({})
    dish_id = f"DISH-{count + 1:03d}"
    
    dish_dict = dish_data.dict()
    dish_dict["dishId"] = dish_id
    dish_dict["createdAt"] = datetime.now().isoformat()
    dish_dict["usageCount"] = 0
    dish_dict["reviews"] = []
    
    result = await db.dishes.insert_one(dish_dict)
    dish_dict["_id"] = str(result.inserted_id)
    
    activity = {
        "action": "Created",
        "dishName": dish_dict["dishName"],
        "user": current_admin["email"],
        "timestamp": datetime.now().isoformat()
    }
    await db.activities.insert_one(activity)
    activity["_id"] = str(activity["_id"])
    
    await manager.broadcast({"type": "DISH_CREATED", "dish": dish_dict})
    await manager.broadcast({"type": "NEW_ACTIVITY", "activity": activity})
    
    return dish_dict

@app.put("/api/v1/dishes/{dish_id}")
async def update_dish(dish_id: str, update_data: DishFullUpdate, current_admin = Depends(get_current_admin)):
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        try:
            obj_id = ObjectId(dish_id)
            dish = await db.dishes.find_one({"_id": obj_id})
        except Exception:
            pass

    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
        
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updatedAt"] = datetime.now().isoformat()
    
    await db.dishes.update_one({"dishId": dish_id}, {"$set": update_dict})
    
    updated_dish = await db.dishes.find_one({"dishId": dish_id})
    updated_dish["_id"] = str(updated_dish["_id"])
    
    activity = {
        "action": "Updated",
        "dishName": updated_dish["dishName"],
        "user": current_admin["email"],
        "timestamp": datetime.now().isoformat()
    }
    await db.activities.insert_one(activity)
    activity["_id"] = str(activity["_id"])
    
    await manager.broadcast({"type": "DISH_UPDATED", "dish": updated_dish})
    await manager.broadcast({"type": "NEW_ACTIVITY", "activity": activity})
    
    return updated_dish

@app.get("/api/v1/dishes/{dish_id}", response_model=DishResponse)
async def get_dish(dish_id: str):
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        try:
            obj_id = ObjectId(dish_id)
            dish = await db.dishes.find_one({"_id": obj_id})
        except Exception:
            pass

    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    dish["_id"] = str(dish["_id"])
    return dish

@app.post("/api/v1/dishes/{dish_id}/reviews")
async def add_review(dish_id: str, review: Review, current_user = Depends(get_current_user)):
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
        
    review_dict = review.dict()
    review_dict["date"] = datetime.now().isoformat()
    
    await db.dishes.update_one(
        {"dishId": dish_id},
        {"$push": {"reviews": review_dict}}
    )
    
    updated_dish = await db.dishes.find_one({"dishId": dish_id})
    updated_dish["_id"] = str(updated_dish["_id"])
    await manager.broadcast({"type": "DISH_UPDATED", "dish": updated_dish})
    
    return {"message": "Review added successfully", "review": review_dict}

@app.post("/api/v1/dishes/{dish_id}/cook")
async def cook_dish(dish_id: str, current_user = Depends(get_current_user)):
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
        
    await db.dishes.update_one(
        {"dishId": dish_id},
        {"$inc": {"usageCount": 1}}
    )
    
    user_email = current_user["email"]
    user_doc = await db.users.find_one({"email": user_email})
    
    cooked_dishes = user_doc.get("cookedDishes", [])
    if dish_id in cooked_dishes:
        raise HTTPException(status_code=400, detail="You have already cooked this dish")
        
    cooked_dishes.append(dish_id)
    new_points = user_doc.get("points", 0) + 10
    badges = user_doc.get("badges", [])
    
    new_badge = None
    if new_points >= 50 and "Novice Cook" not in badges:
        badges.append("Novice Cook")
        new_badge = "Novice Cook"
    elif new_points >= 100 and "Master Chef" not in badges:
        badges.append("Master Chef")
        new_badge = "Master Chef"
        
    await db.users.update_one(
        {"email": user_email},
        {"$set": {"points": new_points, "badges": badges, "cookedDishes": cooked_dishes}}
    )
    
    # Broadcast Social Activity
    activity = {
        "action": "Cooked",
        "dishName": dish["dishName"],
        "user": current_user.get("name", current_user["email"]),
        "timestamp": datetime.now().isoformat()
    }
    await db.activities.insert_one(activity)
    activity["_id"] = str(activity["_id"])
    
    updated_dish = await db.dishes.find_one({"dishId": dish_id})
    updated_dish["_id"] = str(updated_dish["_id"])
    
    await manager.broadcast({"type": "DISH_UPDATED", "dish": updated_dish})
    await manager.broadcast({"type": "NEW_ACTIVITY", "activity": activity})
    
    if new_badge:
        await manager.broadcast({
            "type": "USER_ACHIEVEMENT", 
            "user": current_user.get("name", current_user["email"]),
            "badge": new_badge
        })
    
    return {"message": "Dish cooked successfully", "usageCount": updated_dish.get("usageCount", 1), "newPoints": new_points, "newBadge": new_badge, "cookedDishes": cooked_dishes}

@app.delete("/api/v1/dishes/{dish_id}")
async def delete_dish(dish_id: str, current_admin = Depends(get_current_admin)):
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
        
    await db.dishes.delete_one({"dishId": dish_id})
    
    activity = {
        "action": "Deleted",
        "dishName": dish["dishName"],
        "user": current_admin["email"],
        "timestamp": datetime.now().isoformat()
    }
    await db.activities.insert_one(activity)
    activity["_id"] = str(activity["_id"])
    
    await manager.broadcast({"type": "DISH_DELETED", "dishId": dish_id})
    await manager.broadcast({"type": "NEW_ACTIVITY", "activity": activity})
    
    return {"message": "Dish deleted successfully"}

@app.get("/api/v1/activities")
async def get_activities(current_user = Depends(get_current_user)):
    db = get_db()
    cursor = db.activities.find({}).sort("timestamp", -1).limit(50)
    activities = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        activities.append(document)
    return activities

@app.websocket("/api/v1/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/api/v1/ws/viewing/{dish_id}")
async def websocket_viewing_endpoint(websocket: WebSocket, dish_id: str):
    await manager.connect_dish(websocket, dish_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_dish(websocket, dish_id)
        await manager.broadcast_viewers(dish_id)

chat_history = []

@app.websocket("/api/v1/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    await manager.connect_chat(websocket)
    # Send history to new user
    for msg in chat_history[-50:]:
        await websocket.send_text(json.dumps(msg))
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            # msg format: {"sender": "Admin", "text": "Hello!"}
            msg["type"] = "CHAT_MESSAGE"
            msg["timestamp"] = datetime.now().isoformat()
            chat_history.append(msg)
            await manager.broadcast_chat(msg)
    except WebSocketDisconnect:
        manager.disconnect_chat(websocket)



@app.get("/api/v1/users/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    return current_user

@app.put("/api/v1/users/me", response_model=UserResponse)
async def update_me(user_update: UserUpdate, current_user = Depends(get_current_user)):
    db = get_db()
    update_dict = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_dict:
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_dict}
        )
        
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    return updated_user
