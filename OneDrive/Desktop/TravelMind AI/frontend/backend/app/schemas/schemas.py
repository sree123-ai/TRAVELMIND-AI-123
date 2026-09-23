from typing import List, Optional, Any
from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    mobile: Optional[str] = None
    password: str
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    preferred_language: str

class TravellerItem(BaseModel):
    id: int
    type: str
    age: int

class QuestionnaireRequest(BaseModel):
    state: Optional[str] = "Kerala"
    district: Optional[str] = "Munnar"
    hasSpecificPlace: Optional[str] = "AI Can Suggest"
    adultsCount: Optional[int] = 2
    childrenCount: Optional[int] = 1
    seniorsCount: Optional[int] = 0
    travellers: Optional[List[TravellerItem]] = []
    budget: Optional[str] = "₹10,000 – ₹25,000"
    customBudget: Optional[str] = ""
    purpose: Optional[str] = "Relaxation"
    preferences: Optional[List[str]] = []
    hasAllergy: Optional[str] = "No Allergy"
    allergyType: Optional[List[str]] = []
    climate: Optional[str] = "Cool"
    duration: Optional[str] = "3–5 Days"
    transportation: Optional[str] = "Train"
    accommodation: Optional[str] = "Standard"
    food: Optional[str] = "Vegetarian"
    additionalNotes: Optional[str] = ""

class ChatRequest(BaseModel):
    question: str
    trip_context: Optional[Any] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    answer: str
    language: str
