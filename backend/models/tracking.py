from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ExcursionStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class GPSPoint(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    poi_name: Optional[str] = None  # Point of Interest name
    poi_type: Optional[str] = None  # casbah, tassili, oasis, etc.

class ExcursionPhoto(BaseModel):
    id: str = Field(..., description="Unique photo ID")
    base64_data: str  # Image en base64
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    caption: Optional[str] = None
    poi_tag: Optional[str] = None  # Tag du point d'intérêt

class ExcursionTracking(BaseModel):
    id: str = Field(..., description="Unique tracking ID")
    client_id: str
    provider_id: str
    excursion_type: str  # "djanet_sahara", "alger_casbah", "combined"
    status: ExcursionStatus = ExcursionStatus.PLANNED
    
    # Tracking data
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    gps_points: List[GPSPoint] = []
    photos: List[ExcursionPhoto] = []
    
    # Trip metrics
    total_distance_km: Optional[float] = None
    total_duration_hours: Optional[float] = None
    points_visited: List[str] = []  # POI names visited
    
    # Client info for family sharing
    emergency_contacts: List[Dict[str, str]] = []  # WhatsApp numbers
    family_share_enabled: bool = True
    
    # Generated content
    trip_reel_url: Optional[str] = None
    album_pdf_url: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AIPreferences(BaseModel):
    client_id: str
    travel_style: List[str] = []  # ["adventure", "culture", "photography", "relaxation"]
    interests: List[str] = []     # ["history", "nature", "food", "architecture"]
    budget_range: str = "medium"  # "low", "medium", "high", "luxury"
    group_size: int = 2
    duration_preference: str = "flexible"  # "short", "medium", "long", "flexible"
    physical_level: str = "moderate"  # "easy", "moderate", "challenging", "extreme"
    accommodation_type: str = "standard"  # "camping", "standard", "comfort", "luxury"
    previous_destinations: List[str] = []  # Track visited places

class AIRecommendation(BaseModel):
    id: str = Field(..., description="Unique recommendation ID")
    client_id: str
    
    # Recommendation details
    destination: str  # "djanet", "alger", "combined"
    itinerary_name: str
    description: str
    duration_days: int
    estimated_price_eur: float
    match_percentage: int  # 0-100 based on preferences
    
    # Detailed itinerary
    daily_activities: List[Dict[str, Any]] = []
    included_services: List[str] = []
    highlights: List[str] = []
    
    # Cultural adaptations
    cultural_notes: List[str] = []  # Islamic customs, Berber traditions
    weather_considerations: List[str] = []
    photography_spots: List[str] = []
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TravelAlbum(BaseModel):
    id: str = Field(..., description="Unique album ID")
    excursion_id: str
    client_id: str
    
    # Album content
    title: str
    cover_photo_base64: str
    photos: List[ExcursionPhoto]
    trip_stats: Dict[str, Any] = {}  # distance, duration, points visited
    
    # Generated files
    pdf_base64: Optional[str] = None
    video_reel_base64: Optional[str] = None
    
    # Sharing
    whatsapp_ready: bool = False
    instagram_story_ready: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Predefined Points of Interest for Algeria
ALGERIA_POIS = {
    "djanet": [
        {"name": "Tassili N'Ajjer", "lat": 24.5575, "lng": 9.4845, "type": "unesco_site"},
        {"name": "Tin Merzouga", "lat": 24.6161, "lng": 9.5647, "type": "sand_dunes"},
        {"name": "Aïn Amellal", "lat": 24.5897, "lng": 9.6234, "type": "oasis"},
        {"name": "Jabbaren", "lat": 24.6456, "lng": 9.3721, "type": "rock_art"},
        {"name": "Sefar", "lat": 24.5234, "lng": 9.4123, "type": "rock_formations"}
    ],
    "alger": [
        {"name": "Casbah d'Alger", "lat": 36.7797, "lng": 3.0597, "type": "unesco_site"},
        {"name": "Basilique Notre-Dame d'Afrique", "lat": 36.7886, "lng": 3.0391, "type": "religious"},
        {"name": "Jardin d'Essai du Hamma", "lat": 36.7311, "lng": 3.0739, "type": "garden"},
        {"name": "Palais des Raïs", "lat": 36.7703, "lng": 3.0542, "type": "palace"},
        {"name": "Musée National des Beaux-Arts", "lat": 36.7519, "lng": 3.0425, "type": "museum"},
        {"name": "Maqam Echahid", "lat": 36.7378, "lng": 3.0881, "type": "monument"}
    ]
}

class ExcursionTrackingResponse(BaseModel):
    tracking: ExcursionTracking
    current_weather: Optional[Dict[str, Any]] = None
    nearby_pois: List[Dict[str, Any]] = []
    family_notification_sent: bool = False

class TripReelRequest(BaseModel):
    excursion_id: str
    music_preference: str = "traditional"  # "traditional", "modern", "silent"
    duration_seconds: int = 30
    include_stats: bool = True

class AIRecommendationRequest(BaseModel):
    client_id: str
    preferences: AIPreferences
    current_location: Optional[str] = None
    travel_dates: Optional[Dict[str, str]] = None  # start_date, end_date