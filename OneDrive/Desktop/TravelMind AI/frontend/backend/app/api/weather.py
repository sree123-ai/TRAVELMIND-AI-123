from fastapi import APIRouter, Query
from app.ai.weather_time_series import fetch_real_weather

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/")
@router.get("")
@router.get("/current")
def get_current_weather(
    lat: float = Query(10.0889, description="Latitude"),
    lon: float = Query(77.0595, description="Longitude")
):
    """
    Real-time weather integration endpoint using Open-Meteo live API.
    Never fabricates missing weather.
    """
    return fetch_real_weather(lat, lon)

@router.get("/forecast")
def get_weather_forecast(
    lat: float = Query(10.0889, description="Latitude"),
    lon: float = Query(77.0595, description="Longitude")
):
    """
    7-Day daily forecast breakdown with day cards, rain chance, and temperatures.
    """
    data = fetch_real_weather(lat, lon)
    if not data.get("available"):
        return {"available": False, "message": "Forecast currently unavailable"}
    return {
        "available": True,
        "dailyForecast": data.get("dailyForecast", []),
        "lastUpdated": data.get("lastUpdated")
    }

@router.get("/timeseries")
def get_weather_timeseries(
    lat: float = Query(10.0889, description="Latitude"),
    lon: float = Query(77.0595, description="Longitude")
):
    """
    7-Day hourly time-series points for interactive temperature, rain, wind, and humidity graphing.
    """
    data = fetch_real_weather(lat, lon)
    if not data.get("available"):
        return {"available": False, "message": "Time-series data currently unavailable"}
    return {
        "available": True,
        "timeSeries": data.get("timeSeries", []),
        "lastUpdated": data.get("lastUpdated")
    }
