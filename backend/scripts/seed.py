import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth import get_password_hash
from database import get_db

sample_dishes = [
    {
        "dishName": "Jeera Rice",
        "dishId": "1",
        "category": "North Indian",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg",
        "isPublished": True
    },
    {
        "dishName": "Paneer Tikka",
        "dishId": "2",
        "category": "North Indian",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg",
        "isPublished": True
    },
    {
        "dishName": "Rabdi",
        "dishId": "3",
        "category": "Dessert",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg",
        "isPublished": True
    },
    {
        "dishName": "Chicken Biryani",
        "dishId": "4",
        "category": "Mughlai",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg",
        "isPublished": True
    },
    {
        "dishName": "Alfredo Pasta",
        "dishId": "5",
        "category": "Italian",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg",
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
