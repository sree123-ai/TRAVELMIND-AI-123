from fastapi import APIRouter, Query

from app.ai.geospatial_service import build_logistics, build_recommended_places, geocode_place
from app.ai.weather_time_series import fetch_real_weather

router = APIRouter(prefix="/destination", tags=["Destination Data"])


def _destination_identity(destination_name: str, state: str = ""):
    return geocode_place(destination_name, state)


@router.get("/{destination_name}/logistics")
def get_destination_logistics(destination_name: str, state: str = Query("")):
    identity = _destination_identity(destination_name, state)
    if not identity.get("available"):
        return {"available": False, "reason": "No verified destination coordinates found"}
    destination = {"name": destination_name, **identity}
    return {
        "destination": destination,
        "logistics": build_logistics(destination),
    }


@router.get("/{destination_name}/weather")
def get_destination_weather(destination_name: str, state: str = Query("")):
    identity = _destination_identity(destination_name, state)
    if not identity.get("available"):
        return {"available": False, "reason": "No verified destination coordinates found"}
    return fetch_real_weather(identity["latitude"], identity["longitude"])


@router.get("/{destination_name}/recommendations")
def get_destination_places(destination_name: str, state: str = Query("")):
    identity = _destination_identity(destination_name, state)
    if not identity.get("available"):
        return {"available": False, "reason": "No verified destination coordinates found", "places": []}
    destination = {"name": destination_name, **identity}
    return {
        "available": True,
        "destination": destination,
        "places": build_recommended_places(identity["latitude"], identity["longitude"], destination),
    }
