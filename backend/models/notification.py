from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
    # Provider notifications
    NEW_BOOKING = "new_booking"
    BOOKING_CANCELLED = "booking_cancelled"  
    BOOKING_CONFIRMED = "booking_confirmed"
    PROVIDER_APPROVED = "provider_approved"
    PROVIDER_REJECTED = "provider_rejected"
    ACTIVITY_APPROVED = "activity_approved"
    ACTIVITY_REJECTED = "activity_rejected"
    PAYMENT_RECEIVED = "payment_received"
    REVIEW_RECEIVED = "review_received"
    
    # Admin notifications  
    NEW_PROVIDER_REGISTRATION = "new_provider_registration"
    NEW_ACTIVITY_SUBMISSION = "new_activity_submission"
    PROVIDER_NEEDS_APPROVAL = "provider_needs_approval"
    ACTIVITY_NEEDS_APPROVAL = "activity_needs_approval"
    SYSTEM_ALERT = "system_alert"

class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"
    URGENT = "urgent"

class NotificationStatus(str, Enum):
    UNREAD = "unread"
    READ = "read"
    ARCHIVED = "archived"

class NotificationBase(BaseModel):
    type: NotificationType
    title: str
    message: str
    priority: NotificationPriority = NotificationPriority.MEDIUM
    recipient_type: str  # "provider", "admin", "user"
    recipient_id: str
    sender_id: Optional[str] = None
    related_entity_type: Optional[str] = None  # "booking", "provider", "activity"
    related_entity_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}
    action_url: Optional[str] = None
    action_label: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    status: Optional[NotificationStatus] = None
    read_at: Optional[datetime] = None

class Notification(NotificationBase):
    id: str = Field(..., description="Unique notification ID")
    status: NotificationStatus = NotificationStatus.UNREAD
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class NotificationResponse(BaseModel):
    notifications: list[Notification]
    total: int
    unread_count: int
    page: int
    per_page: int

class NotificationStats(BaseModel):
    total_notifications: int
    unread_count: int
    read_count: int
    archived_count: int
    priority_breakdown: Dict[str, int]
    type_breakdown: Dict[str, int]