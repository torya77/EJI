from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    avatar: str
    location: str
    join_date: datetime = Field(default_factory=datetime.utcnow)
    following: int = 0
    followers: int = 0
    posts: int = 0
    preferred_language: str = "fr"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: str
    avatar: str
    location: str
    preferred_language: str = "fr"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    location: Optional[str] = None
    following: Optional[int] = None
    followers: Optional[int] = None
    posts: Optional[int] = None
    preferred_language: Optional[str] = None