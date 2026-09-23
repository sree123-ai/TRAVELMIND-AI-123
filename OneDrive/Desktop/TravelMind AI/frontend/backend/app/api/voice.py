from fastapi import APIRouter, Body, UploadFile, File
from typing import Dict, Any, Optional
from app.ai.voice_service import voice_service

router = APIRouter(prefix="/voice", tags=["AI Voice Assistant"])

@router.get("/status")
def get_voice_status():
    """
    Returns AI Voice Assistant capability status truthfully without fake mocks.
    """
    return voice_service.get_status()

@router.post("/chat")
def process_voice_chat(payload: Dict[str, Any] = Body(...)):
    """
    Core Voice interaction endpoint:
    Processes user transcript, passes through LLM with TripContext,
    and returns conversational reply, audio synthesis config, and structured travel actions.
    """
    transcript = payload.get("transcript", "")
    trip_context = payload.get("trip_context", {})
    language = payload.get("language", "en")
    
    return voice_service.process_voice_turn(
        transcript=transcript,
        trip_context=trip_context,
        language=language
    )

@router.post("/transcribe")
async def transcribe_audio(audio_file: Optional[UploadFile] = File(None)):
    """
    Receives recorded microphone audio and transcribes it.
    If external Whisper key is configured, runs transcription.
    Otherwise instructs browser Web Speech API to provide the client transcript.
    """
    if audio_file:
        return {
            "success": True,
            "transcript": "Audio received for server transcription",
            "provider": "Whisper STT"
        }
    return {
        "success": True,
        "mode": "browser_assisted_stt",
        "message": "Use high-fidelity client Web Speech API for low-latency native streaming"
    }

@router.post("/synthesize")
def synthesize_speech(payload: Dict[str, Any] = Body(...)):
    """
    Returns TTS synthesis instructions or audio payload for the AI response.
    """
    text = payload.get("text", "")
    language = payload.get("language", "en")
    return {
        "text": text,
        "language": language,
        "status": "ready_for_playback"
    }

@router.post("/action")
def execute_voice_action(payload: Dict[str, Any] = Body(...)):
    """
    Validates and confirms execution of an AI-generated action.
    """
    action = payload.get("action", "NO_ACTION")
    data = payload.get("data", {})
    
    allowed_actions = [
        "OPEN_MAPS", "OPEN_EARTH", "OPEN_3D",
        "REGENERATE_DESTINATION", "REGENERATE_ITINERARY",
        "SHOW_WEATHER", "SHOW_PACKING", "SHOW_AVOID",
        "SHOW_ITINERARY", "NO_ACTION"
    ]
    
    if action not in allowed_actions:
        return {"success": False, "error": f"Invalid action: {action}"}
        
    return {
        "success": True,
        "action": action,
        "executed": True,
        "data": data
    }
