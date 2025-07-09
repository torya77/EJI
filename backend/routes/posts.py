from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.post import Post, PostCreate, PostUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/", response_model=List[Post])
async def get_posts(
    author: Optional[str] = None,
    limit: int = Query(default=50, le=100)
):
    db = get_database()
    
    # Build query
    query = {}
    if author:
        query["author"] = {"$regex": author, "$options": "i"}
    
    posts = await db.posts.find(query).sort("timestamp", -1).limit(limit).to_list(limit)
    return [Post(**post) for post in posts]

@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: str):
    db = get_database()
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return Post(**post)

@router.post("/", response_model=Post)
async def create_post(post: PostCreate):
    db = get_database()
    post_dict = post.dict()
    new_post = Post(**post_dict)
    await db.posts.insert_one(new_post.dict())
    return new_post

@router.put("/{post_id}", response_model=Post)
async def update_post(post_id: str, post_update: PostUpdate):
    db = get_database()
    update_data = {k: v for k, v in post_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    updated_post = await db.posts.find_one({"id": post_id})
    return Post(**updated_post)

@router.delete("/{post_id}")
async def delete_post(post_id: str):
    db = get_database()
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

@router.post("/{post_id}/like")
async def like_post(post_id: str):
    db = get_database()
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment likes count
    await db.posts.update_one(
        {"id": post_id},
        {"$inc": {"likes": 1}}
    )
    
    return {"message": "Post liked successfully", "post_id": post_id}

@router.post("/{post_id}/unlike")
async def unlike_post(post_id: str):
    db = get_database()
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Decrement likes count
    await db.posts.update_one(
        {"id": post_id},
        {"$inc": {"likes": -1}}
    )
    
    return {"message": "Post unliked successfully", "post_id": post_id}