from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    avatar: str
    content: str
    image: Optional[str] = None
    location: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    comments: int = 0
    shares: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PostCreate(BaseModel):
    author: str
    avatar: str
    content: str
    image: Optional[str] = None
    location: Optional[str] = None

class PostUpdate(BaseModel):
    content: Optional[str] = None
    image: Optional[str] = None
    location: Optional[str] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None