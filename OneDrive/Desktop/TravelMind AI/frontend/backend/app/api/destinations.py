from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.ai.rag_service import VERIFIED_KNOWLEDGE_BASE, retrieve_verified_destination, search_verified_knowledge

router = APIRouter(prefix="/destinations", tags=["Destinations"])

@router.get("")
@router.get("/")
def get_destinations(query: Optional[str] = Query(None), state: Optional[str] = Query(None)):
    """
    Returns verified grounded destination facts.
    """
    if query or state:
        return search_verified_knowledge(query or "", state)
    return list(VERIFIED_KNOWLEDGE_BASE.values())

@router.get("/{dest_id}")
def get_destination_by_id(dest_id: str):
    """
    Retrieves verified facts, attractions, entry fees, and coordinates for a destination.
    """
    dest = retrieve_verified_destination(dest_id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found in verified database")
    return dest
