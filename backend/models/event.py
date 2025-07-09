from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class EventCoordinates(BaseModel):
    lat: float
    lng: float

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    date: str
    time: str
    price: float
    currency: str = "DZD"
    image: str
    description: str
    coordinates: EventCoordinates
    category: str
    rating: float = 0.0
    attendees: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    title: str
    location: str
    date: str
    time: str
    price: float
    currency: str = "DZD"
    image: str
    description: str
    coordinates: EventCoordinates
    category: str

class EventUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    coordinates: Optional[EventCoordinates] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    attendees: Optional[int] = None