from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    currency: str = "DZD"
    image: str
    description: str
    category: str
    seller: str
    location: str
    rating: float = 0.0
    in_stock: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    price: float
    currency: str = "DZD"
    image: str
    description: str
    category: str
    seller: str
    location: str
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    seller: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = None
    in_stock: Optional[bool] = None