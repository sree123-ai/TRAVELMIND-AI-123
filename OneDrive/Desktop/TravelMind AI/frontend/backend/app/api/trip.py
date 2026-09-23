from fastapi import APIRouter, Body
from typing import Dict, Any
from app.ai.recommendation_engine import generate_personalized_recommendations
from app.ai.weather_time_series import fetch_real_weather
from app.ai.itinerary_engine import generate_dynamic_itinerary

router = APIRouter(prefix="/trip", tags=["Trip Analysis Engine"])

@router.post("/analyze")
def analyze_trip(trip_data: Dict[str, Any] = Body(...)):
    """
    Core AI Analysis pipeline:
    1. Evaluates questionnaire constraints and demographic party ages
    2. Dynamically queries RAG verified knowledge
    3. Fetches live 7-day weather and hourly time-series from Open-Meteo
    4. Formulates dynamic itinerary calibrated to climate and party needs
    5. Returns unified TripContext package
    """
    # 1. Generate dynamic recommendations
    recommendations = generate_personalized_recommendations(trip_data)
    
    primary_destination = recommendations[0] if recommendations else {}
    lat = primary_destination.get("latitude", 10.0889)
    lon = primary_destination.get("longitude", 77.0595)

    # 2. Real weather and 7-day forecast
    weather_data = fetch_real_weather(lat, lon)
    primary_destination["weather"] = weather_data

    # 3. Dynamic itinerary
    itinerary = generate_dynamic_itinerary(
        destination=primary_destination,
        trip_data=trip_data,
        weather_data=weather_data
    )

    return {
        "status": "success",
        "tripData": trip_data,
        "recommendations": recommendations,
        "selectedDestination": primary_destination,
        "weather": weather_data,
        "itinerary": itinerary,
        "analysisComplete": True
    }
