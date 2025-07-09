from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class RestaurantCoordinates(BaseModel):
    lat: float
    lng: float

class Restaurant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    cuisine: str
    rating: float = 0.0
    price_range: str
    image: str
    description: str
    coordinates: RestaurantCoordinates
    specialties: List[str] = []
    hours: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RestaurantCreate(BaseModel):
    name: str
    location: str
    cuisine: str
    price_range: str
    image: str
    description: str
    coordinates: RestaurantCoordinates
    specialties: List[str] = []
    hours: str

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    coordinates: Optional[RestaurantCoordinates] = None
    specialties: Optional[List[str]] = None
    hours: Optional[str] = None