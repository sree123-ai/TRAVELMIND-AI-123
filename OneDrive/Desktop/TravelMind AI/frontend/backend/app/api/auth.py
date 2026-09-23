from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin, Token
from app.config import settings
import jwt

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_access_token(data: dict):
    to_encode = data.copy()
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register", response_model=Token)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        name=payload.name,
        email=payload.email,
        mobile=payload.mobile,
        hashed_password=f"hash_{payload.password}", # Mock secure hash
        preferred_language=payload.preferred_language or "en"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": new_user.email, "name": new_user.name})
    return Token(access_token=token, user_name=new_user.name, preferred_language=new_user.preferred_language)

@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Allow demo login if user does not exist yet
        return Token(
            access_token=create_access_token({"sub": payload.email, "name": "Traveller"}),
            user_name="Traveller",
            preferred_language="en"
        )
    
    token = create_access_token({"sub": user.email, "name": user.name})
    return Token(access_token=token, user_name=user.name, preferred_language=user.preferred_language)
