from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.api import auth, questionnaire, destinations, weather, chatbot, recommendations, itinerary, voice, trip, destination_data

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI Tourism and Travel Planner API built for Smart India Hackathon (SIH 2026)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(questionnaire.router, prefix=settings.API_PREFIX)
app.include_router(destinations.router, prefix=settings.API_PREFIX)
app.include_router(weather.router, prefix=settings.API_PREFIX)
app.include_router(chatbot.router, prefix=settings.API_PREFIX)
app.include_router(recommendations.router, prefix=settings.API_PREFIX)
app.include_router(itinerary.router, prefix=settings.API_PREFIX)
app.include_router(voice.router, prefix=settings.API_PREFIX)
app.include_router(trip.router, prefix=settings.API_PREFIX)
app.include_router(destination_data.router, prefix=settings.API_PREFIX)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected",
        "llm_live": bool(settings.LLM_API_KEY and len(settings.LLM_API_KEY) > 5),
        "llm_provider": settings.LLM_PROVIDER,
        "voice_assistant_enabled": settings.VOICE_ENABLED,
        "weather_service": "Open-Meteo Real Meteorological Data",
        "google_maps_configured": bool(settings.GOOGLE_MAPS_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
