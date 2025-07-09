from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

# Pydantic Models pour l'API
class ProviderCreate(BaseModel):
    provider_type: str
    business_name: str
    owner_name: str
    email: str
    phone: str
    city: str
    address: Optional[str] = None
    business_description: str
    specialties: List[str]
    languages: List[str]
    experience: Optional[str] = None
    capacity: Optional[str] = None
    commission: float
    quality_commitments: List[str]
    charte_accepted: bool
    commission_accepted: bool

class ProviderUpdate(BaseModel):
    business_name: Optional[str] = None
    owner_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    business_description: Optional[str] = None
    specialties: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    status: Optional[str] = None

class ProviderResponse(BaseModel):
    id: str
    provider_type: str
    business_name: str
    owner_name: str
    email: str
    phone: str
    city: str
    address: Optional[str]
    status: str
    join_date: datetime
    rating: float
    total_bookings: int
    total_revenue: float
    last_activity: datetime
    business_description: str
    specialties: List[str]
    languages: List[str]
    commission: float
    documents_status: dict

class ActivityCreate(BaseModel):
    title: str
    provider_id: str
    type: str
    location: str
    price: float
    currency: str = "DZD"
    category: str
    duration: str
    max_participants: int
    language: List[str]
    description: str
    images: List[str] = []

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    max_participants: Optional[int] = None
    language: Optional[List[str]] = None
    description: Optional[str] = None
    status: Optional[str] = None

class ActivityResponse(BaseModel):
    id: str
    title: str
    provider: str
    provider_id: str
    type: str
    location: str
    price: float
    currency: str
    status: str
    created: datetime
    bookings: int
    revenue: float
    rating: float
    reviews: int
    quality_score: int
    commission: float
    provider_earnings: float
    eji_earnings: float
    category: str
    duration: str
    max_participants: int
    language: List[str]

class AdminStats(BaseModel):
    total_providers: int
    active_providers: int
    pending_providers: int
    suspended_providers: int
    total_activities: int
    active_activities: int
    pending_activities: int
    rejected_activities: int
    total_bookings: int
    total_revenue: float
    monthly_growth: float

# Mock Data Store (en production, ceci serait connecté à MongoDB)
mock_providers = [
    {
        "id": "1",
        "provider_type": "guide",
        "business_name": "Ahmed Bensaid",
        "owner_name": "Ahmed Bensaid",
        "email": "ahmed.bensaid@gmail.com",
        "phone": "+213 555 123 456",
        "city": "Alger",
        "address": "Casbah, Alger",
        "status": "active",
        "join_date": datetime(2024, 12, 15),
        "rating": 4.9,
        "total_bookings": 127,
        "total_revenue": 145000.0,
        "last_activity": datetime(2025, 7, 9),
        "business_description": "Guide expérimenté spécialisé dans l'histoire de la Casbah d'Alger",
        "specialties": ["Culture", "Histoire", "Photographie"],
        "languages": ["Français", "Arabe", "Anglais"],
        "commission": 15.0,
        "documents_status": {"id_card": "verified", "license": "verified", "insurance": "verified"}
    },
    {
        "id": "2",
        "provider_type": "restaurant",
        "business_name": "Restaurant Atlas",
        "owner_name": "Mohammed Aziz",
        "email": "contact@restaurant-atlas.dz",
        "phone": "+213 555 987 654",
        "city": "Alger",
        "address": "Centre-ville, Alger",
        "status": "pending",
        "join_date": datetime(2025, 7, 8),
        "rating": 0.0,
        "total_bookings": 0,
        "total_revenue": 0.0,
        "last_activity": datetime(2025, 7, 8),
        "business_description": "Restaurant traditionnel algérien au cœur d'Alger",
        "specialties": ["Cuisine Traditionnelle", "Gastronomie"],
        "languages": ["Français", "Arabe"],
        "commission": 12.0,
        "documents_status": {"business_license": "verified", "health_certificate": "pending", "insurance": "missing"}
    }
]

mock_activities = [
    {
        "id": "1",
        "title": "Visite Guidée de la Casbah",
        "provider": "Ahmed Bensaid",
        "provider_id": "1",
        "type": "Guide Local",
        "location": "Alger",
        "price": 3500.0,
        "currency": "DZD",
        "status": "active",
        "created": datetime(2025, 7, 8),
        "bookings": 45,
        "revenue": 157500.0,
        "rating": 4.9,
        "reviews": 23,
        "quality_score": 95,
        "commission": 15.0,
        "provider_earnings": 2975.0,
        "eji_earnings": 525.0,
        "category": "Culture",
        "duration": "3h",
        "max_participants": 8,
        "language": ["Français", "Arabe", "Anglais"]
    },
    {
        "id": "2",
        "title": "Excursion Sahara 3 jours",
        "provider": "Yacine Amellal",
        "provider_id": "3",
        "type": "Guide Local",
        "location": "Tamanrasset",
        "price": 45000.0,
        "currency": "DZD",
        "status": "pending_validation",
        "created": datetime(2025, 7, 9),
        "bookings": 0,
        "revenue": 0.0,
        "rating": 0.0,
        "reviews": 0,
        "quality_score": 0,
        "commission": 15.0,
        "provider_earnings": 38250.0,
        "eji_earnings": 6750.0,
        "category": "Aventure",
        "duration": "3 jours",
        "max_participants": 6,
        "language": ["Français", "Arabe", "Tamachek"]
    }
]

# Authentication middleware (simplifié pour le développement)
async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifie le token d'authentification admin"""
    token = credentials.credentials
    # En production, vérifier le JWT token avec une vraie base de données
    if token != "admin_token_123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token d'authentification invalide"
        )
    return {"user_id": "admin", "role": "admin"}

# Endpoints Admin - Statistiques
@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(user: dict = Depends(verify_admin_token)):
    """Récupère les statistiques admin"""
    total_providers = len(mock_providers)
    active_providers = len([p for p in mock_providers if p["status"] == "active"])
    pending_providers = len([p for p in mock_providers if p["status"] == "pending"])
    suspended_providers = len([p for p in mock_providers if p["status"] == "suspended"])
    
    total_activities = len(mock_activities)
    active_activities = len([a for a in mock_activities if a["status"] == "active"])
    pending_activities = len([a for a in mock_activities if a["status"] == "pending_validation"])
    rejected_activities = len([a for a in mock_activities if a["status"] == "rejected"])
    
    total_bookings = sum(a["bookings"] for a in mock_activities)
    total_revenue = sum(a["revenue"] for a in mock_activities)
    
    return AdminStats(
        total_providers=total_providers,
        active_providers=active_providers,
        pending_providers=pending_providers,
        suspended_providers=suspended_providers,
        total_activities=total_activities,
        active_activities=active_activities,
        pending_activities=pending_activities,
        rejected_activities=rejected_activities,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
        monthly_growth=15.3
    )

# Endpoints Admin - Prestataires
@router.get("/providers", response_model=List[ProviderResponse])
async def get_providers(
    status: Optional[str] = None,
    provider_type: Optional[str] = None,
    city: Optional[str] = None,
    user: dict = Depends(verify_admin_token)
):
    """Récupère la liste des prestataires avec filtres optionnels"""
    providers = mock_providers.copy()
    
    if status:
        providers = [p for p in providers if p["status"] == status]
    if provider_type:
        providers = [p for p in providers if p["provider_type"] == provider_type]
    if city:
        providers = [p for p in providers if p["city"] == city]
    
    return providers

@router.get("/providers/{provider_id}", response_model=ProviderResponse)
async def get_provider(provider_id: str, user: dict = Depends(verify_admin_token)):
    """Récupère un prestataire par ID"""
    provider = next((p for p in mock_providers if p["id"] == provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")
    return provider

@router.put("/providers/{provider_id}", response_model=ProviderResponse)
async def update_provider(
    provider_id: str, 
    provider_update: ProviderUpdate,
    user: dict = Depends(verify_admin_token)
):
    """Met à jour un prestataire"""
    provider = next((p for p in mock_providers if p["id"] == provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")
    
    # Mise à jour des champs fournis
    update_data = provider_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in provider:
            provider[field] = value
    
    return provider

@router.put("/providers/{provider_id}/status")
async def update_provider_status(
    provider_id: str,
    status: str,
    reason: Optional[str] = None,
    user: dict = Depends(verify_admin_token)
):
    """Met à jour le statut d'un prestataire"""
    provider = next((p for p in mock_providers if p["id"] == provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")
    
    valid_statuses = ["active", "pending", "suspended", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    provider["status"] = status
    if reason:
        provider["rejection_reason"] = reason
    
    return {"message": f"Statut mis à jour: {status}", "provider_id": provider_id}

@router.delete("/providers/{provider_id}")
async def delete_provider(provider_id: str, user: dict = Depends(verify_admin_token)):
    """Supprime un prestataire"""
    global mock_providers
    provider = next((p for p in mock_providers if p["id"] == provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")
    
    mock_providers = [p for p in mock_providers if p["id"] != provider_id]
    return {"message": "Prestataire supprimé", "provider_id": provider_id}

# Endpoints Admin - Activités
@router.get("/activities", response_model=List[ActivityResponse])
async def get_activities(
    status: Optional[str] = None,
    provider_id: Optional[str] = None,
    category: Optional[str] = None,
    user: dict = Depends(verify_admin_token)
):
    """Récupère la liste des activités avec filtres optionnels"""
    activities = mock_activities.copy()
    
    if status:
        activities = [a for a in activities if a["status"] == status]
    if provider_id:
        activities = [a for a in activities if a["provider_id"] == provider_id]
    if category:
        activities = [a for a in activities if a["category"] == category]
    
    return activities

@router.get("/activities/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: str, user: dict = Depends(verify_admin_token)):
    """Récupère une activité par ID"""
    activity = next((a for a in mock_activities if a["id"] == activity_id), None)
    if not activity:
        raise HTTPException(status_code=404, detail="Activité non trouvée")
    return activity

@router.put("/activities/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: str,
    activity_update: ActivityUpdate,
    user: dict = Depends(verify_admin_token)
):
    """Met à jour une activité"""
    activity = next((a for a in mock_activities if a["id"] == activity_id), None)
    if not activity:
        raise HTTPException(status_code=404, detail="Activité non trouvée")
    
    # Mise à jour des champs fournis
    update_data = activity_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in activity:
            activity[field] = value
    
    # Recalcul des gains si le prix change
    if "price" in update_data:
        commission_rate = activity["commission"]
        eji_earnings = (activity["price"] * commission_rate) / 100
        provider_earnings = activity["price"] - eji_earnings
        activity["eji_earnings"] = eji_earnings
        activity["provider_earnings"] = provider_earnings
    
    return activity

@router.put("/activities/{activity_id}/status")
async def update_activity_status(
    activity_id: str,
    status: str,
    reason: Optional[str] = None,
    user: dict = Depends(verify_admin_token)
):
    """Met à jour le statut d'une activité"""
    activity = next((a for a in mock_activities if a["id"] == activity_id), None)
    if not activity:
        raise HTTPException(status_code=404, detail="Activité non trouvée")
    
    valid_statuses = ["active", "pending_validation", "rejected", "suspended", "inactive"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    activity["status"] = status
    if reason:
        activity["rejection_reason"] = reason
    
    return {"message": f"Statut mis à jour: {status}", "activity_id": activity_id}

@router.post("/activities", response_model=ActivityResponse)
async def create_activity(
    activity: ActivityCreate,
    user: dict = Depends(verify_admin_token)
):
    """Crée une nouvelle activité"""
    # Vérifier que le prestataire existe
    provider = next((p for p in mock_providers if p["id"] == activity.provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Prestataire non trouvé")
    
    # Calcul des gains
    eji_earnings = (activity.price * provider["commission"]) / 100
    provider_earnings = activity.price - eji_earnings
    
    new_activity = {
        "id": str(uuid.uuid4()),
        "title": activity.title,
        "provider": provider["business_name"],
        "provider_id": activity.provider_id,
        "type": provider["provider_type"],
        "location": activity.location,
        "price": activity.price,
        "currency": activity.currency,
        "status": "pending_validation",
        "created": datetime.now(),
        "bookings": 0,
        "revenue": 0.0,
        "rating": 0.0,
        "reviews": 0,
        "quality_score": 0,
        "commission": provider["commission"],
        "provider_earnings": provider_earnings,
        "eji_earnings": eji_earnings,
        "category": activity.category,
        "duration": activity.duration,
        "max_participants": activity.max_participants,
        "language": activity.language
    }
    
    mock_activities.append(new_activity)
    return new_activity

@router.delete("/activities/{activity_id}")
async def delete_activity(activity_id: str, user: dict = Depends(verify_admin_token)):
    """Supprime une activité"""
    global mock_activities
    activity = next((a for a in mock_activities if a["id"] == activity_id), None)
    if not activity:
        raise HTTPException(status_code=404, detail="Activité non trouvée")
    
    mock_activities = [a for a in mock_activities if a["id"] != activity_id]
    return {"message": "Activité supprimée", "activity_id": activity_id}