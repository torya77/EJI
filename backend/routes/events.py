from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.event import Event, EventCreate, EventUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from datetime import datetime

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[Event])
async def get_events(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "date",
    limit: int = Query(default=50, le=100)
):
    db = get_database()
    
    # Build query
    query = {}
    if category and category != "all":
        query["category"] = {"$regex": category, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Build sort
    sort_options = {
        "date": ("date", 1),
        "price": ("price", 1),
        "rating": ("rating", -1),
        "popularity": ("attendees", -1)
    }
    sort_field, sort_order = sort_options.get(sort_by, ("date", 1))
    
    events = await db.events.find(query).sort(sort_field, sort_order).limit(limit).to_list(limit)
    return [Event(**event) for event in events]

@router.get("/{event_id}", response_model=Event)
async def get_event(event_id: str):
    db = get_database()
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event(**event)

@router.post("/", response_model=Event)
async def create_event(event: EventCreate):
    db = get_database()
    event_dict = event.dict()
    new_event = Event(**event_dict)
    await db.events.insert_one(new_event.dict())
    return new_event

@router.put("/{event_id}", response_model=Event)
async def update_event(event_id: str, event_update: EventUpdate):
    db = get_database()
    update_data = {k: v for k, v in event_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.events.update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    updated_event = await db.events.find_one({"id": event_id})
    return Event(**updated_event)

@router.delete("/{event_id}")
async def delete_event(event_id: str):
    db = get_database()
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

@router.post("/{event_id}/book")
async def book_event(event_id: str):
    db = get_database()
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Increment attendees count
    await db.events.update_one(
        {"id": event_id},
        {"$inc": {"attendees": 1}}
    )
    
    return {"message": "Event booked successfully", "event_id": event_id}