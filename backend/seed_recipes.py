import asyncio
import urllib.request
import json
import uuid
from motor.motor_asyncio import AsyncIOMotorClient

async def run_seed():
    print("Connecting to MongoDB...")
    import os
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://mongo:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.nosh_management

    print("Fetching recipes from DummyJSON...")
    req = urllib.request.Request(
        'https://dummyjson.com/recipes?limit=30', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    recipes = data.get("recipes", [])
    print(f"Fetched {len(recipes)} recipes. Processing...")

    for r in recipes:
        dish_id = f"DISH-{str(uuid.uuid4())[:8].upper()}"
        
        # Format instructions as markdown
        recipe_md = "\n".join([f"{idx + 1}. {step}" for idx, step in enumerate(r.get("instructions", []))])

        dish = {
            "dishId": dish_id,
            "dishName": r.get("name", "Unknown Dish"),
            "imageUrl": r.get("image", ""),
            "category": r.get("cuisine", "Uncategorized"),
            "isPublished": True,
            "description": f"A delightful {r.get('difficulty', 'Easy').lower()} {r.get('cuisine', '')} dish with {r.get('caloriesPerServing', 0)} calories per serving. Serves {r.get('servings', 1)}.",
            "prepTime": f"{r.get('prepTimeMinutes', 0) + r.get('cookTimeMinutes', 0)} mins",
            "ingredients": r.get("ingredients", []),
            "recipe": recipe_md,
            "usageCount": 0,
            "reviews": [],
            "orderIndex": r.get("id", 0)
        }
        
        # Check if already exists by name to avoid duplicates
        existing = await db.dishes.find_one({"dishName": dish["dishName"]})
        if not existing:
            await db.dishes.insert_one(dish)
            print(f"Inserted: {dish['dishName']} ({dish['category']})")
        else:
            print(f"Skipped existing: {dish['dishName']}")

    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(run_seed())
