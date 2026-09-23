from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    mobile = Column(String(30), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    budget = Column(String(50), nullable=True)
    purpose = Column(String(80), nullable=True)
    climate = Column(String(50), nullable=True)
    duration = Column(String(50), nullable=True)
    transportation = Column(String(50), nullable=True)
    accommodation = Column(String(50), nullable=True)
    food = Column(String(50), nullable=True)
    preferences_json = Column(Text, nullable=True)
    travellers_json = Column(Text, nullable=True)
    allergies_json = Column(Text, nullable=True)
    additional_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=True)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
