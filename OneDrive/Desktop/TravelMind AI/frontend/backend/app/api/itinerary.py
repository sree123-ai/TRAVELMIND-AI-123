from fastapi import APIRouter, Body
from typing import Dict, Any
from app.ai.itinerary_engine import generate_dynamic_itinerary

router = APIRouter(prefix="/itinerary", tags=["AI Itinerary"])

@router.post("/generate")
def generate_itinerary(payload: Dict[str, Any] = Body(...)):
    """
    Generates dynamic day-by-day travel itinerary considering weather, budget, and party ages.
    """
    destination = payload.get("destination", {})
    trip_data = payload.get("trip_data", {})
    weather_data = payload.get("weather_data")
    custom_instruction = payload.get("custom_instruction")
    return generate_dynamic_itinerary(destination, trip_data, weather_data, custom_instruction)

@router.post("/regenerate")
def regenerate_itinerary(payload: Dict[str, Any] = Body(...)):
    """
    🔄 REGENERATE ITINERARY: Dynamically creates an updated itinerary based on user input.
    """
    destination = payload.get("destination", {})
    trip_data = payload.get("trip_data", {})
    weather_data = payload.get("weather_data")
    custom_instruction = payload.get("custom_instruction", "Fresh scheduling")
    return generate_dynamic_itinerary(destination, trip_data, weather_data, custom_instruction)
