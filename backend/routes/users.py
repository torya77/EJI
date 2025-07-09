from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.user import User, UserCreate, UserUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
async def get_users(
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100)
):
    db = get_database()
    
    # Build query
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    users = await db.users.find(query).sort("name", 1).limit(limit).to_list(limit)
    return [User(**user) for user in users]

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    db = get_database()
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    db = get_database()
    user_dict = user.dict()
    new_user = User(**user_dict)
    await db.users.insert_one(new_user.dict())
    return new_user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    db = get_database()
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id})
    return User(**updated_user)

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    db = get_database()
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}