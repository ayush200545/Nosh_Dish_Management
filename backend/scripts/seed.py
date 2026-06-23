import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth import get_password_hash
from database import get_db

sample_dishes = [
    {
        "dishId": "DISH-001",
        "dishName": "Butter Chicken",
        "category": "North Indian",
        "imageUrl": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=300&auto=format&fit=crop",
        "isPublished": True
    },
    {
        "dishId": "DISH-002",
        "dishName": "Paneer Tikka",
        "category": "North Indian",
        "imageUrl": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=300&auto=format&fit=crop",
        "isPublished": False
    },
    {
        "dishId": "DISH-003",
        "dishName": "Pasta Alfredo",
        "category": "Italian",
        "imageUrl": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=300&auto=format&fit=crop",
        "isPublished": True
    },
    {
        "dishId": "DISH-004",
        "dishName": "Veg Biryani",
        "category": "Indian",
        "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=300&auto=format&fit=crop",
        "isPublished": True
    },
    {
        "dishId": "DISH-005",
        "dishName": "Hakka Noodles",
        "category": "Chinese",
        "imageUrl": "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop",
        "isPublished": False
    },
    {
        "dishId": "DISH-006",
        "dishName": "Dal Makhani",
        "category": "Indian",
        "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop",
        "isPublished": True
    }
]

async def seed_db():
    db = get_db()
    
    # Clear existing
    await db.dishes.delete_many({})
    print("Cleared existing dishes.")
    
    # Insert new
    result = await db.dishes.insert_many(sample_dishes)
    print(f"Inserted {len(result.inserted_ids)} dishes.")
    
    # Seed users
    await db.users.delete_many({})
    
    admin_user = {
        "email": "admin@nosh.com",
        "hashed_password": get_password_hash("Nosh@123456"),
        "name": "Nosh Admin",
        "role": "admin"
    }
    
    regular_user = {
        "email": "user@nosh.com",
        "hashed_password": get_password_hash("Nosh@123456"),
        "name": "Nosh User",
        "role": "user"
    }
    
    await db.users.insert_many([admin_user, regular_user])
    print("Inserted admin and regular user accounts.")

if __name__ == "__main__":
    asyncio.run(seed_db())
