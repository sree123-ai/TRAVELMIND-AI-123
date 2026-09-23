from fastapi import APIRouter, Body
from typing import Dict, Any
from app.ai.llm_service import llm_service

router = APIRouter(prefix="/chat", tags=["AI Tourism Chatbot"])

@router.post("")
@router.post("/")
def chat_with_ai(payload: Dict[str, Any] = Body(...)):
    """
    Context-aware AI travel chatbot endpoint.
    Uses full TripContext (Questionnaire, destination coordinates, live weather,
    itinerary, precautions, conversation history) to generate dynamic responses and actions.
    Never uses fixed hardcoded responses.
    """
    question = payload.get("question", "")
    trip_context = payload.get("trip_context") or payload.get("tripContext") or {}
    language = payload.get("language") or trip_context.get("language") or "en"
    history = payload.get("history", [])

    result = llm_service.extract_action_and_reply(
        user_message=question,
        trip_context=trip_context,
        language=language,
        history=history
    )

    return {
        "answer": result["message"],
        "action": result["action"],
        "destination": result["destination"],
        "language": language,
        "live_llm": result.get("live_llm", False)
    }
