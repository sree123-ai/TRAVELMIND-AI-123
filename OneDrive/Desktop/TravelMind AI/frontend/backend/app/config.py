import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TRAVELMIND AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database: Supports PostgreSQL or SQLite local fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./travelmind.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "travelmind_super_secret_jwt_key_sih2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # External APIs
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    
    # LLM Settings
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")
    
    # Voice Settings
    VOICE_ENABLED: bool = os.getenv("VOICE_ENABLED", "true").lower() in ("true", "1", "yes")
    VOICE_STT_PROVIDER: str = os.getenv("VOICE_STT_PROVIDER", "browser_whisper")
    VOICE_TTS_PROVIDER: str = os.getenv("VOICE_TTS_PROVIDER", "browser_tts")
    VOICE_API_KEY: str = os.getenv("VOICE_API_KEY", "")
    VOICE_MODEL: str = os.getenv("VOICE_MODEL", "")
    VOICE_LANGUAGE: str = os.getenv("VOICE_LANGUAGE", "en")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
