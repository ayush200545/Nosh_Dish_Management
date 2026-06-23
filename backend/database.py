import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL")
if not MONGODB_URI:
    # Use a dummy local fallback for development if not provided, though it's recommended to set it
    MONGODB_URI = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGODB_URI)
db = client.nosh_management

def get_db():
    return db
