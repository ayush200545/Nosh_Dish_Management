from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    email: EmailStr
    hashed_password: str
    role: str # "admin" or "user"
    name: str
    profileImage: Optional[str] = None
    points: Optional[int] = 0
    badges: Optional[List[str]] = []
    cookedDishes: Optional[List[str]] = []

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "user"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profileImage: Optional[str] = None

class UserResponse(BaseModel):
    email: EmailStr
    name: str
    role: str
    profileImage: Optional[str] = None
    points: Optional[int] = 0
    badges: Optional[List[str]] = []
    cookedDishes: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class Review(BaseModel):
    user: str
    rating: int
    comment: str
    date: str

class DishCreate(BaseModel):
    dishName: str
    imageUrl: str
    category: str
    isPublished: bool = False
    description: Optional[str] = ""
    prepTime: Optional[str] = ""
    ingredients: Optional[List[str]] = []
    recipe: Optional[str] = ""
    orderIndex: Optional[int] = 0

class DishFullUpdate(BaseModel):
    dishName: Optional[str] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    isPublished: Optional[bool] = None
    description: Optional[str] = None
    prepTime: Optional[str] = None
    ingredients: Optional[List[str]] = None
    recipe: Optional[str] = None

class DishUpdate(BaseModel):
    isPublished: bool

class DishReorderItem(BaseModel):
    dishId: str
    orderIndex: int

class ActivityEvent(BaseModel):
    id: str = Field(alias="_id")
    action: str
    dishName: str
    time: str

class DishResponse(BaseModel):
    id: str = Field(alias="_id")
    dishId: str
    dishName: str
    imageUrl: str
    isPublished: bool
    category: Optional[str] = "Uncategorized"
    description: Optional[str] = ""
    prepTime: Optional[str] = ""
    ingredients: Optional[List[str]] = []
    recipe: Optional[str] = ""
    usageCount: Optional[int] = 0
    reviews: Optional[List[Review]] = []
    orderIndex: Optional[int] = 0
    
    class Config:
        populate_by_name = True

