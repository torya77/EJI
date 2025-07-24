from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict, Any
import uuid
import json
import base64
from datetime import datetime, timedelta
import math
import urllib.parse

from ..models.tracking import (
    ExcursionTracking,
    ExcursionTrackingResponse,
    GPSPoint,
    ExcursionPhoto,
    ExcursionStatus,
    AIRecommendation,
    AIRecommendationRequest,
    AIPreferences,
    TravelAlbum,
    TripReelRequest,
    ALGERIA_POIS
)

router = APIRouter(prefix="/tracking", tags=["excursion-tracking"])

# Mock database for tracking data
tracking_db = []
recommendations_db = []
albums_db = []

def get_user_from_token(authorization: str = None):
    """Extract user info from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        return {"user_id": "client_demo", "user_type": "client"}
    
    token = authorization.split(" ")[1]
    if token == "provider_1_token":
        return {"user_id": "provider_1", "user_type": "provider"}
    elif token == "admin_token_123":
        return {"user_id": "admin_1", "user_type": "admin"}
    else:
        return {"user_id": "client_demo", "user_type": "client"}

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two GPS points in kilometers"""
    R = 6371  # Earth's radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    
    a = (math.sin(dlat/2) * math.sin(dlat/2) + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlng/2) * math.sin(dlng/2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def find_nearby_pois(lat: float, lng: float, excursion_type: str, radius_km: float = 1.0) -> List[Dict]:
    """Find nearby Points of Interest"""
    if excursion_type.startswith("djanet"):
        pois = ALGERIA_POIS["djanet"]
    elif excursion_type.startswith("alger"):
        pois = ALGERIA_POIS["alger"]
    else:
        pois = ALGERIA_POIS["djanet"] + ALGERIA_POIS["alger"]
    
    nearby = []
    for poi in pois:
        distance = calculate_distance(lat, lng, poi["lat"], poi["lng"])
        if distance <= radius_km:
            nearby.append({
                **poi,
                "distance_km": round(distance, 2)
            })
    
    return sorted(nearby, key=lambda x: x["distance_km"])

@router.post("/start-excursion", response_model=ExcursionTrackingResponse)
async def start_excursion(
    excursion_type: str,
    client_name: str,
    provider_id: str = "provider_1",
    emergency_contacts: List[Dict[str, str]] = [],
    user: dict = Depends(get_user_from_token)
):
    """Start tracking a new excursion"""
    
    tracking_id = str(uuid.uuid4())
    
    tracking = ExcursionTracking(
        id=tracking_id,
        client_id=user["user_id"],
        provider_id=provider_id,
        excursion_type=excursion_type,
        status=ExcursionStatus.IN_PROGRESS,
        start_time=datetime.utcnow(),
        emergency_contacts=emergency_contacts,
        family_share_enabled=True
    )
    
    tracking_db.append(tracking)
    
    # Mock weather data
    current_weather = {
        "temperature": 28 if excursion_type.startswith("alger") else 35,
        "condition": "ensoleillé",
        "humidity": 45,
        "wind_speed": 12,
        "uv_index": 8 if excursion_type.startswith("djanet") else 6
    }
    
    return ExcursionTrackingResponse(
        tracking=tracking,
        current_weather=current_weather,
        nearby_pois=[],
        family_notification_sent=len(emergency_contacts) > 0
    )

@router.post("/add-gps-point/{tracking_id}")
async def add_gps_point(
    tracking_id: str,
    gps_point: GPSPoint,
    user: dict = Depends(get_user_from_token)
):
    """Add a GPS point to the tracking"""
    
    # Find tracking session
    tracking = None
    for t in tracking_db:
        if t.id == tracking_id and t.client_id == user["user_id"]:
            tracking = t
            break
    
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking session not found")
    
    # Check for nearby POIs
    nearby_pois = find_nearby_pois(
        gps_point.latitude, 
        gps_point.longitude, 
        tracking.excursion_type
    )
    
    # Auto-tag POI if very close (within 100m)
    if nearby_pois and nearby_pois[0]["distance_km"] < 0.1:
        poi = nearby_pois[0]
        gps_point.poi_name = poi["name"]
        gps_point.poi_type = poi["type"]
        
        # Add to visited points if not already there
        if poi["name"] not in tracking.points_visited:
            tracking.points_visited.append(poi["name"])
    
    # Add GPS point
    tracking.gps_points.append(gps_point)
    
    # Update total distance
    if len(tracking.gps_points) > 1:
        last_point = tracking.gps_points[-2]
        distance = calculate_distance(
            last_point.latitude, last_point.longitude,
            gps_point.latitude, gps_point.longitude
        )
        tracking.total_distance_km = (tracking.total_distance_km or 0) + distance
    
    tracking.updated_at = datetime.utcnow()
    
    return {
        "message": "GPS point added successfully",
        "nearby_pois": nearby_pois,
        "total_distance_km": tracking.total_distance_km,
        "points_visited": tracking.points_visited
    }

@router.get("/excursion/{tracking_id}", response_model=ExcursionTrackingResponse)
async def get_excursion_data(tracking_id: str, user: dict = Depends(get_user_from_token)):
    """Get current excursion data"""
    
    # Find tracking session
    tracking = None
    for t in tracking_db:
        if t.id == tracking_id:
            if t.client_id == user["user_id"] or t.provider_id == user["user_id"] or user["user_type"] == "admin":
                tracking = t
                break
    
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking session not found")
    
    # Get current location for weather and POIs
    current_weather = None
    nearby_pois = []
    
    if tracking.gps_points:
        last_point = tracking.gps_points[-1]
        
        # Mock weather based on location
        if tracking.excursion_type.startswith("djanet"):
            current_weather = {
                "temperature": 35,
                "condition": "ensoleillé",
                "humidity": 25,
                "wind_speed": 15,
                "uv_index": 9
            }
        else:  # Alger
            current_weather = {
                "temperature": 26,
                "condition": "partiellement nuageux",
                "humidity": 65,
                "wind_speed": 8,
                "uv_index": 6
            }
        
        nearby_pois = find_nearby_pois(
            last_point.latitude,
            last_point.longitude,
            tracking.excursion_type,
            radius_km=2.0
        )
    
    return ExcursionTrackingResponse(
        tracking=tracking,
        current_weather=current_weather,
        nearby_pois=nearby_pois,
        family_notification_sent=tracking.family_share_enabled
    )

@router.get("/family-share/{tracking_id}")
async def get_family_share_link(tracking_id: str, user: dict = Depends(get_user_from_token)):
    """Generate family sharing WhatsApp message"""
    
    # Find tracking session
    tracking = None
    for t in tracking_db:
        if t.id == tracking_id and t.client_id == user["user_id"]:
            tracking = t
            break
    
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking session not found")
    
    if not tracking.family_share_enabled:
        raise HTTPException(status_code=403, detail="Family sharing not enabled")
    
    # Generate WhatsApp message
    current_location = "Position en cours de mise à jour..."
    if tracking.gps_points:
        last_point = tracking.gps_points[-1]
        if last_point.poi_name:
            current_location = f"Actuellement à {last_point.poi_name}"
        else:
            current_location = f"Position: {last_point.latitude:.4f}, {last_point.longitude:.4f}"
    
    excursion_names = {
        "djanet_sahara": "Aventure Saharienne à Djanet",
        "alger_casbah": "Découverte de la Casbah d'Alger",
        "combined": "Circuit Complet Algérie"
    }
    
    start_time_str = tracking.start_time.strftime('%H:%M') if tracking.start_time else 'En cours'
    visited_places = ', '.join(tracking.points_visited) if tracking.points_visited else 'En exploration'
    
    message_lines = [
        "🇩🇿 *Mise à jour Excursion EJI*",
        "",
        f"🏛️ *Excursion:* {excursion_names.get(tracking.excursion_type, tracking.excursion_type)}",
        f"📍 *Position:* {current_location}",
        f"⏰ *Débutée:* {start_time_str}",
        f"📊 *Statut:* {tracking.status.value}",
        "",
        f"📸 *Photos prises:* {len(tracking.photos)}",
        f"🗺️ *Lieux visités:* {visited_places}",
        "",
        "✨ _Suivi automatique EJI - Découvrez l'Algérie en sécurité_"
    ]
    
    message = "\n".join(message_lines)
    encoded_message = urllib.parse.quote(message)
    
    return {
        "whatsapp_message": message,
        "share_url": f"https://wa.me/?text={encoded_message}",
        "emergency_contacts": tracking.emergency_contacts,
        "last_update": tracking.updated_at
    }