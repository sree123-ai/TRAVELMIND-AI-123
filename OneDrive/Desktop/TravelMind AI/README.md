# TRAVELMIND-AI: Personalized AI Tourism Platform

Built for **Smart India Hackathon (SIH 2026)** — Theme: Travel & Tourism.

TRAVELMIND-AI is a context-aware AI tourism and travel-planning application designed to replace generic travel lists with personalized itineraries tailored to multi-generational group ages, strict budgets, health/allergy constraints, and native language preferences.

---

## 🎨 Design System & UI/UX Direction

The frontend preserves an illustrated tropical tourism visual language:
- **Tourism Artwork Background**: High-resolution tropical landscape featuring ocean waves, coconut palm trees, mountains, waterfalls, ancient Indian temple gopuram, coastal fort, and striped lighthouse.
- **Centered Parchment Panels**: Warm cream glassmorphism (`rgba(255, 245, 216, 0.94)` with `3px solid #7A421F` borders and `0 10px 0 rgba(90,43,21,0.45)` shadow).
- **Physical 3D Buttons**: Thick brown borders (`#7A421F`), lower 3D shadow (`#5A2B15`), playful hover lifts, and tactile push-down click physics.
- **Color Palette**: Orange (`#F28A20`), Green (`#7BC52B`), Blue (`#3FA9DD`), Pink (`#E84383`), Purple (`#A946D1`), Cyan (`#2FB7B7`), Gold (`#F6C453`).
- **Typography**: Friendly rounded Google Fonts (`Fredoka`, `Nunito`, `Baloo 2`).

---

## 🌐 100% Multilingual Support

The entire application dynamically translates between 6 Indian and international languages:
1. **English**
2. **தமிழ் (Tamil)**
3. **हिन्दी (Hindi)**
4. **తెలుగు (Telugu)**
5. **മലയാളം (Malayalam)**
6. **ಕನ್ನಡ (Kannada)**

The chosen language persists across all pages, forms, recommendation explanations, and the interactive AI chatbot.

---

## 🚀 Application Flow & Architecture

```
Language Selection (Page 0)
         ↓
   Login / Signup
         ↓
12-Step AI Questionnaire
         ↓
    AI Analysis
         ↓
Destination Recommendations (Trip Profile, AI Reasoning, Weather, Top AI Cards, Packing, Travel Details, Age Suitability)
         ↓
  Destination Details & 3D Exploration
         ↓
AI Day-by-Day Itinerary
         ↓
   ✨ ASK AI Chatbot
```

### 12-Step Questionnaire Criteria
1. **Destination**: State, District/City, Specific Place (`Yes` / `No` / `AI Can Suggest` with `✨ LET AI SUGGEST`)
2. **Travel Group**: Adults (👨), Children (👧), Seniors (👴) with individual age tracking per person
3. **Budget**: 6 colored 3D buttons (`Below ₹5,000` to `₹50,000+` or `Custom`)
4. **Purpose**: Relaxation, Adventure, Spiritual, Historical, Nature, Family, Romantic, Photography, Food, Shopping, Entertainment, Other
5. **Preferences**: Multi-select tags (Beaches, Mountains, Waterfalls, Wildlife, Historical, Temples, Museums, Adventure, Nature, City)
6. **Health & Allergies**: No Allergy vs. Food, Dust, Pollen, Insect, Medication, Skin, Other (*with Medical Precaution Disclaimer*)
7. **Climate**: Cold, Cool, Moderate, Warm, No Preference
8. **Duration**: 1–2 Days, 3–5 Days, 6–7 Days, 1–2 Weeks, Custom
9. **Transportation**: Train, Bus, Flight, Car, Bike, No Preference
10. **Accommodation**: Budget, Standard, Premium, Luxury, Homestay, No Preference
11. **Food**: Vegetarian, Non-Vegetarian, Vegan, Jain, No Preference
12. **Final Notes**: Custom requests + `✨ GENERATE MY AI TRAVEL PLAN`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Python 3, FastAPI, SQLAlchemy, SQLite (default) / PostgreSQL (production)
- **AI & RAG Engine**: Multi-criteria constraint solver, grounded tourism facts repository (verified fees, timings, and official booking URLs)
- **External Integration Points**: OpenWeather API, Google Maps Platform 3D

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Launch Everything (Windows)
Double-click `start.bat` or run in PowerShell:
```powershell
./run_app.ps1
```

### 2. Manual Launch
#### Backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open browser at: [http://localhost:5173](http://localhost:5173)

---

## 🛡️ Anti-Hallucination & Verified Data Architecture

- **No Fabricated Facts**: Attraction entrance fees, operating hours, and booking links strictly point to official state tourism portals (e.g., Kerala Tourism, National Parks).
- **Graceful API Fallbacks**: When `WEATHER_API_KEY` or `VITE_GOOGLE_MAPS_API_KEY` are not set, the platform displays clean informative status indicators rather than breaking or faking data.
- **Medical Disclaimer**: Allergies and health inputs are handled strictly as general travel convenience precautions, not medical diagnoses.
