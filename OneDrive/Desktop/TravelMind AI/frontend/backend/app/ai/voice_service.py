"""
AI Voice Assistant Service
Handles speech-to-text, context-aware LLM voice chat reasoning,
text-to-speech synthesis metadata, action execution, and provider status.
"""

import os
import logging
from typing import Dict, Any, Optional
from app.config import settings
from app.ai.llm_service import llm_service

logger = logging.getLogger(__name__)

LANGUAGE_VOICE_MAP = {
    "en": {"code": "en-IN", "name": "English (India)", "fallback": "en-US"},
    "ta": {"code": "ta-IN", "name": "Tamil (India)", "fallback": "ta"},
    "hi": {"code": "hi-IN", "name": "Hindi (India)", "fallback": "hi"},
    "te": {"code": "te-IN", "name": "Telugu (India)", "fallback": "te"},
    "ml": {"code": "ml-IN", "name": "Malayalam (India)", "fallback": "ml"},
    "kn": {"code": "kn-IN", "name": "Kannada (India)", "fallback": "kn"}
}

class VoiceService:
    def __init__(self):
        self.enabled = settings.VOICE_ENABLED
        self.stt_provider = settings.VOICE_STT_PROVIDER
        self.tts_provider = settings.VOICE_TTS_PROVIDER
        self.api_key = settings.VOICE_API_KEY or settings.LLM_API_KEY

    def get_status(self) -> Dict[str, Any]:
        has_key = bool(self.api_key and len(self.api_key) > 5)
        return {
            "enabled": self.enabled,
            "stt_provider": "whisper_api" if has_key else "web_speech_api",
            "tts_provider": "openai_tts" if has_key else "web_speech_synthesis",
            "active_mode": "hybrid_live",
            "supportedLanguages": list(LANGUAGE_VOICE_MAP.keys()),
            "configured": True,
            "message": "AI Voice Assistant is active and ready for speech interaction."
        }

    def process_voice_turn(
        self,
        transcript: str,
        trip_context: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Receives transcribed user speech, passes through LLM with TripContext,
        extracts structured actions, and prepares speech synthesis payload.
        """
        if not transcript or not transcript.strip():
            return {
                "transcript": "",
                "message": "No speech was detected. Please tap the microphone and speak again.",
                "action": "NO_ACTION",
                "destination": {}
            }

        cleaned_text = transcript.strip()
        lang_meta = LANGUAGE_VOICE_MAP.get(language, LANGUAGE_VOICE_MAP["en"])

        # LLM reasoning with full trip context
        result = llm_service.extract_action_and_reply(
            user_message=cleaned_text,
            trip_context=trip_context,
            language=language
        )

        return {
            "transcript": cleaned_text,
            "message": result["message"],
            "action": result["action"],
            "destination": result["destination"],
            "voiceConfig": {
                "languageCode": lang_meta["code"],
                "pitch": 1.0,
                "rate": 1.0
            }
        }

voice_service = VoiceService()
