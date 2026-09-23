from fastapi import APIRouter, Body
from typing import Dict, Any, List
from app.ai.recommendation_engine import generate_personalized_recommendations

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

@router.post("/")
@router.post("")
def get_recommendations(trip_data: Dict[str, Any] = Body(...)):
    """
    Generates dynamic AI recommendations directly from the user questionnaire.
    Zero hardcoded fixed production lists.
    """
    return generate_personalized_recommendations(trip_data)

@router.post("/regenerate")
def regenerate_recommendations(payload: Dict[str, Any] = Body(...)):
    """
    ✨ SUGGEST AGAIN: Generates genuinely new recommendations under the same constraints.
    """
    trip_data = payload.get("trip_data", payload)
    exclude_ids = payload.get("exclude_ids", [])
    return generate_personalized_recommendations(trip_data, regenerate=True, exclude_ids=exclude_ids)
