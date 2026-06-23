import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def run():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.nosh_management
    dishes = await db.dishes.find().to_list(10)
    for d in dishes:
        print(d)

asyncio.run(run())
