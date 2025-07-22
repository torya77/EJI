from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

from ..models.notification import (
    Notification, 
    NotificationCreate, 
    NotificationUpdate, 
    NotificationResponse,
    NotificationStats,
    NotificationType,
    NotificationPriority,
    NotificationStatus
)

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Mock database for notifications
notifications_db = []

def generate_sample_notifications():
    """Generate sample notifications for development"""
    sample_notifications = [
        {
            "id": str(uuid.uuid4()),
            "type": NotificationType.NEW_BOOKING,
            "title": "Nouvelle réservation",
            "message": "Sarah Martin a réservé votre visite guidée de la Casbah pour le 25 juillet 2025",
            "priority": NotificationPriority.HIGH,
            "recipient_type": "provider",
            "recipient_id": "provider_1",
            "sender_id": "user_sarah",
            "related_entity_type": "booking",
            "related_entity_id": "booking_001",
            "metadata": {"booking_date": "2025-07-25", "amount": 1800, "guests": 2},
            "action_url": "/provider-dashboard?tab=bookings",
            "action_label": "Voir la réservation",
            "status": NotificationStatus.UNREAD,
            "created_at": datetime.utcnow() - timedelta(minutes=30)
        },
        {
            "id": str(uuid.uuid4()),
            "type": NotificationType.PROVIDER_APPROVED,
            "title": "Profil approuvé",
            "message": "Félicitations ! Votre profil de prestataire a été approuvé par l'équipe EJI",
            "priority": NotificationPriority.HIGH,
            "recipient_type": "provider",
            "recipient_id": "provider_1", 
            "sender_id": "admin",
            "related_entity_type": "provider",
            "related_entity_id": "provider_1",
            "metadata": {"approval_date": "2025-07-20"},
            "action_url": "/provider-dashboard",
            "action_label": "Voir le tableau de bord",
            "status": NotificationStatus.READ,
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "read_at": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "id": str(uuid.uuid4()),
            "type": NotificationType.PAYMENT_RECEIVED,
            "title": "Paiement reçu",
            "message": "Vous avez reçu un paiement de 1,530 DZD pour la visite guidée (Commission EJI: 270 DZD)",
            "priority": NotificationPriority.MEDIUM,
            "recipient_type": "provider",
            "recipient_id": "provider_1",
            "related_entity_type": "payment",
            "related_entity_id": "payment_001",
            "metadata": {"amount": 1530, "commission": 270, "total": 1800},
            "action_url": "/provider-dashboard?tab=analytics",
            "action_label": "Voir les revenus",
            "status": NotificationStatus.UNREAD,
            "created_at": datetime.utcnow() - timedelta(hours=6)
        },
        {
            "id": str(uuid.uuid4()),
            "type": NotificationType.NEW_PROVIDER_REGISTRATION,
            "title": "Nouveau prestataire",
            "message": "Restaurant Atlas s'est inscrit et attend votre approbation",
            "priority": NotificationPriority.MEDIUM,
            "recipient_type": "admin",
            "recipient_id": "admin_1",
            "sender_id": "provider_new",
            "related_entity_type": "provider",
            "related_entity_id": "provider_pending_001",
            "metadata": {"provider_type": "restaurant", "city": "Alger"},
            "action_url": "/admin/providers?filter=pending",
            "action_label": "Approuver le prestataire",
            "status": NotificationStatus.UNREAD,
            "created_at": datetime.utcnow() - timedelta(minutes=15)
        },
        {
            "id": str(uuid.uuid4()),
            "type": NotificationType.REVIEW_RECEIVED,
            "title": "Nouvel avis client",
            "message": "Marie Dubois a laissé un avis 5 étoiles pour votre excursion au Sahara",
            "priority": NotificationPriority.LOW,
            "recipient_type": "provider", 
            "recipient_id": "provider_1",
            "sender_id": "user_marie",
            "related_entity_type": "review",
            "related_entity_id": "review_001",
            "metadata": {"rating": 5, "activity": "Excursion Sahara"},
            "action_url": "/provider-dashboard?tab=services",
            "action_label": "Voir l'avis",
            "status": NotificationStatus.UNREAD,
            "created_at": datetime.utcnow() - timedelta(days=1)
        }
    ]
    
    # Convert to Notification objects
    for notif_data in sample_notifications:
        notification = Notification(**notif_data)
        notifications_db.append(notification)

# Initialize sample data
if not notifications_db:
    generate_sample_notifications()

# Helper functions
def get_user_role_from_token(token: str) -> tuple[str, str]:
    """Extract user role and ID from token - simplified for development"""
    if token == "admin_token_123":
        return "admin", "admin_1"
    elif token == "provider_1_token":
        return "provider", "provider_1"
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

# Dependencies
async def get_current_user(authorization: str = Depends(lambda: None)):
    """Get current user from token"""
    # For development, we'll use a simple token system
    # In production, this would verify JWT tokens properly
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    token = authorization.split(" ")[1]
    return get_user_role_from_token(token)

# Routes
@router.get("/", response_model=NotificationResponse)
async def get_notifications(
    current_user: tuple = Depends(get_current_user),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[NotificationStatus] = None,
    priority: Optional[NotificationPriority] = None,
    type: Optional[NotificationType] = None,
    unread_only: bool = False
):
    """Get notifications for the current user"""
    user_role, user_id = current_user
    
    # Filter notifications for current user
    user_notifications = [
        n for n in notifications_db 
        if n.recipient_type == user_role and n.recipient_id == user_id
    ]
    
    # Apply filters
    filtered_notifications = user_notifications
    
    if status:
        filtered_notifications = [n for n in filtered_notifications if n.status == status]
    
    if priority:
        filtered_notifications = [n for n in filtered_notifications if n.priority == priority]
    
    if type:
        filtered_notifications = [n for n in filtered_notifications if n.type == type]
    
    if unread_only:
        filtered_notifications = [n for n in filtered_notifications if n.status == NotificationStatus.UNREAD]
    
    # Sort by creation date (newest first)
    filtered_notifications.sort(key=lambda x: x.created_at, reverse=True)
    
    # Pagination
    total = len(filtered_notifications)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_notifications = filtered_notifications[start:end]
    
    # Count unread
    unread_count = len([n for n in user_notifications if n.status == NotificationStatus.UNREAD])
    
    return NotificationResponse(
        notifications=paginated_notifications,
        total=total,
        unread_count=unread_count,
        page=page,
        per_page=per_page
    )

@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(current_user: tuple = Depends(get_current_user)):
    """Get notification statistics for the current user"""
    user_role, user_id = current_user
    
    # Filter notifications for current user
    user_notifications = [
        n for n in notifications_db 
        if n.recipient_type == user_role and n.recipient_id == user_id
    ]
    
    # Calculate stats
    total = len(user_notifications)
    unread_count = len([n for n in user_notifications if n.status == NotificationStatus.UNREAD])
    read_count = len([n for n in user_notifications if n.status == NotificationStatus.READ])
    archived_count = len([n for n in user_notifications if n.status == NotificationStatus.ARCHIVED])
    
    # Priority breakdown
    priority_breakdown = {}
    for priority in NotificationPriority:
        priority_breakdown[priority.value] = len([n for n in user_notifications if n.priority == priority])
    
    # Type breakdown
    type_breakdown = {}
    for notif_type in NotificationType:
        count = len([n for n in user_notifications if n.type == notif_type])
        if count > 0:  # Only include types that have notifications
            type_breakdown[notif_type.value] = count
    
    return NotificationStats(
        total_notifications=total,
        unread_count=unread_count,
        read_count=read_count,
        archived_count=archived_count,
        priority_breakdown=priority_breakdown,
        type_breakdown=type_breakdown
    )

@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    notification_id: str,
    update_data: NotificationUpdate,
    current_user: tuple = Depends(get_current_user)
):
    """Update a notification (mark as read, archived, etc.)"""
    user_role, user_id = current_user
    
    # Find notification
    notification = None
    for n in notifications_db:
        if n.id == notification_id and n.recipient_type == user_role and n.recipient_id == user_id:
            notification = n
            break
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Update notification
    if update_data.status:
        notification.status = update_data.status
        if update_data.status == NotificationStatus.READ and not notification.read_at:
            notification.read_at = datetime.utcnow()
    
    return notification

@router.put("/mark-all-read")
async def mark_all_read(current_user: tuple = Depends(get_current_user)):
    """Mark all notifications as read for the current user"""
    user_role, user_id = current_user
    
    updated_count = 0
    current_time = datetime.utcnow()
    
    for notification in notifications_db:
        if (notification.recipient_type == user_role and 
            notification.recipient_id == user_id and 
            notification.status == NotificationStatus.UNREAD):
            notification.status = NotificationStatus.READ
            notification.read_at = current_time
            updated_count += 1
    
    return {"message": f"Marked {updated_count} notifications as read"}

@router.post("/", response_model=Notification)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: tuple = Depends(get_current_user)
):
    """Create a new notification (admin only)"""
    user_role, user_id = current_user
    
    if user_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create notifications")
    
    # Create notification
    notification = Notification(
        id=str(uuid.uuid4()),
        **notification_data.dict(),
        sender_id=user_id,
        created_at=datetime.utcnow()
    )
    
    notifications_db.append(notification)
    return notification

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: tuple = Depends(get_current_user)
):
    """Delete a notification"""
    user_role, user_id = current_user
    
    # Find and remove notification
    for i, notification in enumerate(notifications_db):
        if (notification.id == notification_id and 
            notification.recipient_type == user_role and 
            notification.recipient_id == user_id):
            del notifications_db[i]
            return {"message": "Notification deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Notification not found")