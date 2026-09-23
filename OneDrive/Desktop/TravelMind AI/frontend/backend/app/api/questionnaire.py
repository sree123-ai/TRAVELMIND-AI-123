import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Trip
from app.schemas.schemas import QuestionnaireRequest
from app.ai.recommendation_engine import generate_personalized_recommendations

router = APIRouter(prefix="/trip", tags=["Trip Questionnaire"])

@router.post("/questionnaire")
def save_questionnaire(payload: QuestionnaireRequest, db: Session = Depends(get_db)):
    new_trip = Trip(
        state=payload.state,
        district=payload.district,
        budget=payload.budget,
        purpose=payload.purpose,
        climate=payload.climate,
        duration=payload.duration,
        transportation=payload.transportation,
        accommodation=payload.accommodation,
        food=payload.food,
        preferences_json=json.dumps(payload.preferences or []),
        travellers_json=json.dumps([t.dict() for t in payload.travellers or []]),
        allergies_json=json.dumps(payload.allergyType or []),
        additional_notes=payload.additionalNotes
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return {"success": True, "trip_id": new_trip.id}
