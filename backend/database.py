from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ.get('DB_NAME', 'eji_database')]

def get_database():
    return db

# Initialize collections and indexes
async def init_database():
    # Create indexes for better performance
    await db.events.create_index([("category", 1), ("date", 1)])
    await db.events.create_index([("title", "text"), ("description", "text")])
    
    await db.restaurants.create_index([("cuisine", 1), ("rating", -1)])
    await db.restaurants.create_index([("name", "text"), ("description", "text")])
    
    await db.products.create_index([("category", 1), ("rating", -1)])
    await db.products.create_index([("name", "text"), ("description", "text")])
    
    await db.posts.create_index([("timestamp", -1)])
    await db.users.create_index([("email", 1)], unique=True)
    
    print("Database initialized successfully")