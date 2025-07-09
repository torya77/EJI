from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.restaurant import Restaurant, RestaurantCreate, RestaurantUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from datetime import datetime

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

@router.get("/", response_model=List[Restaurant])
async def get_restaurants(
    cuisine: Optional[str] = None,
    price_range: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "rating",
    limit: int = Query(default=50, le=100)
):
    db = get_database()
    
    # Build query
    query = {}
    if cuisine and cuisine != "all":
        query["cuisine"] = {"$regex": cuisine, "$options": "i"}
    if price_range and price_range != "all":
        query["price_range"] = price_range
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"cuisine": {"$regex": search, "$options": "i"}}
        ]
    
    # Build sort
    sort_options = {
        "rating": ("rating", -1),
        "name": ("name", 1),
        "location": ("location", 1)
    }
    sort_field, sort_order = sort_options.get(sort_by, ("rating", -1))
    
    restaurants = await db.restaurants.find(query).sort(sort_field, sort_order).limit(limit).to_list(limit)
    return [Restaurant(**restaurant) for restaurant in restaurants]

@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    db = get_database()
    restaurant = await db.restaurants.find_one({"id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return Restaurant(**restaurant)

@router.post("/", response_model=Restaurant)
async def create_restaurant(restaurant: RestaurantCreate):
    db = get_database()
    restaurant_dict = restaurant.dict()
    new_restaurant = Restaurant(**restaurant_dict)
    await db.restaurants.insert_one(new_restaurant.dict())
    return new_restaurant

@router.put("/{restaurant_id}", response_model=Restaurant)
async def update_restaurant(restaurant_id: str, restaurant_update: RestaurantUpdate):
    db = get_database()
    update_data = {k: v for k, v in restaurant_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.restaurants.update_one(
        {"id": restaurant_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    updated_restaurant = await db.restaurants.find_one({"id": restaurant_id})
    return Restaurant(**updated_restaurant)

@router.delete("/{restaurant_id}")
async def delete_restaurant(restaurant_id: str):
    db = get_database()
    result = await db.restaurants.delete_one({"id": restaurant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return {"message": "Restaurant deleted successfully"}

@router.post("/{restaurant_id}/reserve")
async def reserve_table(restaurant_id: str):
    db = get_database()
    restaurant = await db.restaurants.find_one({"id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return {"message": "Table reserved successfully", "restaurant_id": restaurant_id}