from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/providers", tags=["providers"])
security = HTTPBearer()

# Pydantic Models pour l'API Prestataires
class ProviderRegistration(BaseModel):
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
    quality_commitments: List[str]
    charte_accepted: bool
    commission_accepted: bool
    understands_commission: bool

class ProviderLogin(BaseModel):
    email: str
    password: str

class ProviderProfile(BaseModel):
    business_name: Optional[str] = None
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_description: Optional[str] = None
    specialties: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    experience: Optional[str] = None
    capacity: Optional[str] = None

class ProviderActivityCreate(BaseModel):
    title: str
    location: str
    price: float
    currency: str = "DZD"
    category: str
    duration: str
    max_participants: int
    language: List[str]
    description: str
    images: List[str] = []
    available_dates: List[str] = []

class ProviderDashboardStats(BaseModel):
    total_activities: int
    active_activities: int
    pending_activities: int
    total_bookings: int
    total_revenue: float
    monthly_revenue: float
    rating: float
    total_reviews: int
    commission_rate: float
    this_month_earnings: float

class BookingResponse(BaseModel):
    id: str
    activity_title: str
    client_name: str
    client_email: str
    booking_date: datetime
    service_date: datetime
    participants: int
    total_price: float
    provider_earnings: float
    eji_commission: float
    status: str
    payment_status: str

# Mock data pour les réservations
mock_bookings = [
    {
        "id": "booking_1",
        "activity_id": "1",
        "activity_title": "Visite Guidée de la Casbah",
        "provider_id": "1",
        "client_name": "Marie Dubois",
        "client_email": "marie.dubois@email.com",
        "booking_date": datetime(2025, 7, 8),
        "service_date": datetime(2025, 7, 15),
        "participants": 2,
        "total_price": 7000.0,
        "provider_earnings": 5950.0,
        "eji_commission": 1050.0,
        "status": "confirmed",
        "payment_status": "paid"
    },
    {
        "id": "booking_2",
        "activity_id": "1",
        "activity_title": "Visite Guidée de la Casbah",
        "provider_id": "1",
        "client_name": "Jean Martin",
        "client_email": "jean.martin@email.com",
        "booking_date": datetime(2025, 7, 9),
        "service_date": datetime(2025, 7, 20),
        "participants": 4,
        "total_price": 14000.0,
        "provider_earnings": 11900.0,
        "eji_commission": 2100.0,
        "status": "pending",
        "payment_status": "pending"
    }
]

# Déclaration globale des variables partagées
mock_providers = []
mock_activities = []

# Fonction pour initialiser les données partagées
def init_shared_data():
    global mock_providers, mock_activities
    try:
        from .admin import mock_providers as admin_providers, mock_activities as admin_activities
        mock_providers = admin_providers
        mock_activities = admin_activities
    except ImportError:
        # Fallback si admin.py n'est pas disponible
        mock_providers = []
        mock_activities = []

# Initialiser les données
init_shared_data()

# Authentication middleware pour prestataires
async def verify_provider_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifie le token d'authentification prestataire"""
    token = credentials.credentials
    # En production, vérifier le JWT token avec une vraie base de données
    # Format attendu: "provider_[id]_token"
    if not token.startswith("provider_") or not token.endswith("_token"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token d'authentification invalide"
        )
    
    provider_id = token.replace("provider_", "").replace("_token", "")
    provider = next((p for p in mock_providers if p["id"] == provider_id), None)
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Prestataire non trouvé"
        )
    
    if provider["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte prestataire non actif"
        )
    
    return {"user_id": provider_id, "role": "provider", "provider": provider}

# Endpoint d'inscription des prestataires
@router.post("/register")
async def register_provider(registration: ProviderRegistration):
    """Inscription d'un nouveau prestataire"""
    global mock_providers
    
    # Vérifier si l'email existe déjà
    existing_provider = next((p for p in mock_providers if p["email"] == registration.email), None)
    if existing_provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un prestataire avec cet email existe déjà"
        )
    
    # Définir la commission selon le type
    commission_rates = {
        "guide": 15.0,
        "restaurant": 12.0,
        "hotel": 10.0,
        "transport": 15.0,
        "artisan": 8.0,
        "events": 15.0
    }
    
    commission = commission_rates.get(registration.provider_type, 15.0)
    
    # Créer le nouveau prestataire
    new_provider = {
        "id": str(uuid.uuid4()),
        "provider_type": registration.provider_type,
        "business_name": registration.business_name,
        "owner_name": registration.owner_name,
        "email": registration.email,
        "phone": registration.phone,
        "city": registration.city,
        "address": registration.address,
        "status": "pending",  # En attente de validation
        "join_date": datetime.now(),
        "rating": 0.0,
        "total_bookings": 0,
        "total_revenue": 0.0,
        "last_activity": datetime.now(),
        "business_description": registration.business_description,
        "specialties": registration.specialties,
        "languages": registration.languages,
        "experience": registration.experience,
        "capacity": registration.capacity,
        "commission": commission,
        "quality_commitments": registration.quality_commitments,
        "charte_accepted": registration.charte_accepted,
        "commission_accepted": registration.commission_accepted,
        "documents_status": {}
    }
    
    mock_providers.append(new_provider)
    
    return {
        "message": "Inscription soumise avec succès",
        "provider_id": new_provider["id"],
        "status": "pending",
        "estimated_validation_time": "48 heures"
    }

# Endpoint de connexion
@router.post("/login")
async def login_provider(login: ProviderLogin):
    """Connexion d'un prestataire"""
    # En production, vérifier le mot de passe hashé
    provider = next((p for p in mock_providers if p["email"] == login.email), None)
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    if provider["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Compte en statut: {provider['status']}. Contactez l'administration."
        )
    
    # Générer un token simplifié (en production, utiliser JWT)
    token = f"provider_{provider['id']}_token"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "provider_id": provider["id"],
        "business_name": provider["business_name"],
        "status": provider["status"]
    }

# Endpoints Dashboard Prestataire
@router.get("/me")
async def get_provider_profile(user: dict = Depends(verify_provider_token)):
    """Récupère le profil du prestataire connecté"""
    return user["provider"]

@router.put("/me")
async def update_provider_profile(
    profile_update: ProviderProfile,
    user: dict = Depends(verify_provider_token)
):
    """Met à jour le profil du prestataire"""
    provider = user["provider"]
    
    # Mise à jour des champs fournis
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in provider:
            provider[field] = value
    
    provider["last_activity"] = datetime.now()
    
    return {
        "message": "Profil mis à jour avec succès",
        "provider": provider
    }

@router.get("/dashboard/stats", response_model=ProviderDashboardStats)
async def get_provider_dashboard_stats(user: dict = Depends(verify_provider_token)):
    """Récupère les statistiques du dashboard prestataire"""
    provider_id = user["user_id"]
    provider = user["provider"]
    
    # Récupérer les activités du prestataire
    provider_activities = [a for a in mock_activities if a["provider_id"] == provider_id]
    
    total_activities = len(provider_activities)
    active_activities = len([a for a in provider_activities if a["status"] == "active"])
    pending_activities = len([a for a in provider_activities if a["status"] == "pending_validation"])
    
    total_bookings = sum(a["bookings"] for a in provider_activities)
    total_revenue = sum(a["revenue"] for a in provider_activities)
    
    # Calcul des gains du prestataire (après commission)
    provider_earnings = total_revenue * (100 - provider["commission"]) / 100
    
    return ProviderDashboardStats(
        total_activities=total_activities,
        active_activities=active_activities,
        pending_activities=pending_activities,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
        monthly_revenue=total_revenue * 0.3,  # Mock: 30% ce mois
        rating=provider["rating"],
        total_reviews=total_bookings,
        commission_rate=provider["commission"],
        this_month_earnings=provider_earnings * 0.3
    )

# Gestion des activités par le prestataire
@router.get("/activities")
async def get_provider_activities(user: dict = Depends(verify_provider_token)):
    """Récupère les activités du prestataire"""
    provider_id = user["user_id"]
    provider_activities = [a for a in mock_activities if a["provider_id"] == provider_id]
    return provider_activities

@router.post("/activities")
async def create_provider_activity(
    activity: ProviderActivityCreate,
    user: dict = Depends(verify_provider_token)
):
    """Crée une nouvelle activité"""
    global mock_activities
    
    provider_id = user["user_id"]
    provider = user["provider"]
    
    # Calcul des gains
    eji_earnings = (activity.price * provider["commission"]) / 100
    provider_earnings = activity.price - eji_earnings
    
    new_activity = {
        "id": str(uuid.uuid4()),
        "title": activity.title,
        "provider": provider["business_name"],
        "provider_id": provider_id,
        "type": provider["provider_type"],
        "location": activity.location,
        "price": activity.price,
        "currency": activity.currency,
        "status": "pending_validation",  # Soumis pour validation
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
        "language": activity.language,
        "description": activity.description,
        "images": activity.images,
        "available_dates": activity.available_dates
    }
    
    mock_activities.append(new_activity)
    
    return {
        "message": "Activité créée et soumise pour validation",
        "activity": new_activity,
        "validation_time": "24-48 heures"
    }

# Gestion des réservations
@router.get("/bookings", response_model=List[BookingResponse])
async def get_provider_bookings(
    status: Optional[str] = None,
    user: dict = Depends(verify_provider_token)
):
    """Récupère les réservations du prestataire"""
    provider_id = user["user_id"]
    
    provider_bookings = [b for b in mock_bookings if b["provider_id"] == provider_id]
    
    if status:
        provider_bookings = [b for b in provider_bookings if b["status"] == status]
    
    return provider_bookings

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status: str,
    user: dict = Depends(verify_provider_token)
):
    """Met à jour le statut d'une réservation"""
    provider_id = user["user_id"]
    
    booking = next((b for b in mock_bookings if b["id"] == booking_id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    if booking["provider_id"] != provider_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé à cette réservation")
    
    valid_statuses = ["confirmed", "cancelled", "completed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    booking["status"] = status
    
    return {
        "message": f"Réservation {status}",
        "booking_id": booking_id
    }