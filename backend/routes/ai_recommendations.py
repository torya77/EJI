from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

from ..models.tracking import (
    AIRecommendation,
    AIRecommendationRequest,
    AIPreferences,
    TravelAlbum,
    TripReelRequest
)

router = APIRouter(prefix="/ai-recommendations", tags=["ai-recommendations"])

# Mock databases
preferences_db = []
recommendations_db = []

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

def calculate_match_percentage(preferences: AIPreferences, destination: str) -> int:
    """Calculate match percentage based on user preferences"""
    score = 0
    max_score = 0
    
    # Travel style matching
    if destination == "djanet":
        if "adventure" in preferences.travel_style:
            score += 25
        if "photography" in preferences.travel_style:
            score += 20
        if "nature" in preferences.travel_style:
            score += 20
        max_score += 65
        
        # Interests
        if "nature" in preferences.interests:
            score += 15
        if "photography" in preferences.interests:
            score += 10
        max_score += 25
            
    elif destination == "alger":
        if "culture" in preferences.travel_style:
            score += 25
        if "history" in preferences.travel_style:
            score += 20
        if "architecture" in preferences.interests:
            score += 15
        if "food" in preferences.interests:
            score += 10
        max_score += 70
        
    elif destination == "combined":
        # Combined gets bonus for variety
        score += 20
        max_score += 30
        if len(preferences.travel_style) >= 3:
            score += 15
        if len(preferences.interests) >= 3:
            score += 15
        max_score += 30
    
    # Physical level matching
    if destination == "djanet" and preferences.physical_level in ["challenging", "extreme"]:
        score += 10
    elif destination == "alger" and preferences.physical_level in ["easy", "moderate"]:
        score += 10
    max_score += 10
    
    return min(100, int((score / max_score) * 100)) if max_score > 0 else 50

@router.post("/get-recommendations")
async def get_recommendations(
    request: AIRecommendationRequest,
    user: dict = Depends(get_user_from_token)
):
    """Get AI-powered travel recommendations"""
    
    # Store or update user preferences
    existing_prefs = None
    for prefs in preferences_db:
        if prefs.client_id == request.client_id:
            existing_prefs = prefs
            break
    
    if existing_prefs:
        # Update existing preferences
        for key, value in request.preferences.dict().items():
            if value:  # Only update non-empty values
                setattr(existing_prefs, key, value)
    else:
        # Create new preferences
        preferences_db.append(request.preferences)
    
    # Generate recommendations for each destination
    recommendations = []
    
    destinations = [
        ("djanet", "Aventure Saharienne - Djanet", 3, 450),
        ("alger", "Patrimoine Culturel - Alger", 2, 120),
        ("combined", "Circuit Complet Algérie", 5, 890)
    ]
    
    for dest_id, dest_name, duration, base_price in destinations:
        match_percentage = calculate_match_percentage(request.preferences, dest_id)
        
        # Adjust price based on preferences
        adjusted_price = base_price
        if request.preferences.accommodation_type == "luxury":
            adjusted_price = int(base_price * 1.5)
        elif request.preferences.accommodation_type == "comfort":
            adjusted_price = int(base_price * 1.2)
        elif request.preferences.accommodation_type == "camping":
            adjusted_price = int(base_price * 0.8)
        
        recommendation = AIRecommendation(
            id=str(uuid.uuid4()),
            client_id=request.client_id,
            destination=dest_id,
            itinerary_name=dest_name,
            description=f"Itinéraire personnalisé de {duration} jours adapté à vos préférences",
            duration_days=duration,
            estimated_price_eur=adjusted_price,
            match_percentage=match_percentage,
            daily_activities=[],
            included_services=[],
            highlights=[],
            cultural_notes=[],
            weather_considerations=[],
            photography_spots=[]
        )
        
        recommendations.append(recommendation)
        recommendations_db.append(recommendation)
    
    # Sort by match percentage
    recommendations.sort(key=lambda x: x.match_percentage, reverse=True)
    
    return {
        "recommendations": recommendations,
        "preferences_saved": True,
        "total_options": len(recommendations),
        "best_match": recommendations[0].destination if recommendations else None
    }

@router.get("/my-preferences")
async def get_my_preferences(user: dict = Depends(get_user_from_token)):
    """Get user's saved preferences"""
    
    for prefs in preferences_db:
        if prefs.client_id == user["user_id"]:
            return prefs
    
    # Return default preferences if none found
    return AIPreferences(
        client_id=user["user_id"],
        travel_style=["culture"],
        interests=["history"],
        budget_range="medium",
        group_size=2,
        duration_preference="flexible",
        physical_level="moderate",
        accommodation_type="standard"
    )