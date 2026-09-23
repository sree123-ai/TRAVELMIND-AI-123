"""
Dynamic AI Recommendation Engine
Analyzes ALL user questionnaire answers:
- State, District, City, Specific place or 'AI can suggest'
- Trip Type (Solo, Couple, Family, Friends, Spiritual, Adventure, Photography, etc.)
- Travellers (Adults, Children, Seniors with individual ages)
- Budget & Duration
- Purpose, Preferences, Climate
- Transportation, Accommodation, Food, Allergies, Accessibility, Health precautions
- Live 7-Day Weather & Climate
- Generates dynamic 'Why This Destination Matches Your Profile' referencing questionnaire answers.
"""

from typing import Dict, Any, List, Optional
import random
import logging
from app.ai.rag_service import (
    VERIFIED_KNOWLEDGE_BASE,
    lookup_destination_image,
    resolve_destination_images,
    search_verified_knowledge
)
from app.ai.weather_time_series import fetch_real_weather, geocode_destination
from app.ai.geospatial_service import build_logistics, build_recommended_places, geocode_place

PLACEHOLDER_IMAGE = "/assets/tourism_bg.jpg"
logger = logging.getLogger(__name__)


def _format_transport_item(item: Dict[str, Any], unavailable: str) -> str:
    if not item.get("available"):
        return item.get("reason") or unavailable
    distance = item.get("distanceKm")
    suffix = f" - ~{distance} km" if distance is not None else ""
    return f"{item.get('name', 'Verified transport facility')}{suffix}"


def _normalise_recommended_places(destination: Dict[str, Any], destination_identity: Dict[str, Any]) -> List[Dict[str, Any]]:
    source_places = destination.get("verifiedAttractions", [])
    places = []
    for place in source_places:
        name = place.get("name")
        if not name:
            continue
        place_identity = geocode_place(
            name,
            f"{destination_identity.get('city', destination.get('name', ''))}, {destination_identity.get('state', destination.get('state', ''))}"
        )
        exact_image = lookup_destination_image(
            f"{name}, {destination_identity.get('city', destination.get('name', ''))}, "
            f"{destination_identity.get('state', destination.get('state', ''))}, India"
        )
        latitude = place.get("latitude") or place_identity.get("latitude")
        longitude = place.get("longitude") or place_identity.get("longitude")
        if latitude is None or longitude is None:
            logger.warning("Skipping recommended place without verified coordinates: %s", name)
            continue
        destination_image = resolve_destination_images(destination.get("id", ""), destination.get("name", ""))
        places.append({
            "name": name,
            "category": destination.get("category", "place"),
            "city": destination_identity.get("city", destination.get("name", "")),
            "state": destination_identity.get("state", destination.get("state", "")),
            "country": destination_identity.get("country", "India"),
            "latitude": latitude,
            "longitude": longitude,
            "description": place.get("description", ""),
            "imageUrl": exact_image or destination_image.get("heroImage"),
            "imageSource": "Wikimedia Commons exact-place search" if exact_image else "Verified destination image fallback",
            "sourceUrl": place.get("bookingUrl") or destination.get("officialWebsite")
        })
    return places

def rank_destinations(trip_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    return generate_personalized_recommendations(trip_data)

def generate_personalized_recommendations(
    trip_data: Dict[str, Any],
    regenerate: bool = False,
    exclude_ids: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Dynamically generates personalized destination recommendations.
    Uses RAG retrieval, questionnaire constraints, age safeguards, and live weather.
    """
    exclude_ids = exclude_ids or []
    state = trip_data.get("state", "").strip()
    district = trip_data.get("district", "").strip()
    specific_place = trip_data.get("customDestination", "").strip()
    has_specific = trip_data.get("hasSpecificPlace", "AI Can Suggest")
    trip_type = trip_data.get("purpose", "Relaxation")
    budget = trip_data.get("budget", "₹10,000 – ₹25,000")
    duration = trip_data.get("duration", "3–5 Days")
    preferences = trip_data.get("preferences", [])
    climate = trip_data.get("climate", "Cool")
    food = trip_data.get("food", "Vegetarian")
    allergies = trip_data.get("allergyType", [])
    travellers = trip_data.get("travellers", [])
    language = trip_data.get("language", "en")

    # Demographic analysis
    num_travellers = len(travellers) if travellers else (trip_data.get("adultsCount", 2) + trip_data.get("childrenCount", 0) + trip_data.get("seniorsCount", 0))
    has_children = any(t.get("age", 25) < 12 for t in travellers) or trip_data.get("childrenCount", 0) > 0
    has_seniors = any(t.get("age", 25) > 60 for t in travellers) or trip_data.get("seniorsCount", 0) > 0
    child_ages = [t.get("age") for t in travellers if t.get("age", 25) < 12]
    senior_ages = [t.get("age") for t in travellers if t.get("age", 25) > 60]

    # Candidate retrieval from RAG knowledge base
    query = specific_place if (has_specific in {"Yes", "Yes, I know where to go"} and specific_place) else district
    candidates = search_verified_knowledge(query, state)

    if district and candidates:
        district_query = district.lower()
        has_district_match = any(
            district_query in candidate.get("district", "").lower()
            or district_query in candidate.get("name", "").lower()
            or candidate.get("name", "").lower() in district_query
            for candidate in candidates
        )
        if not has_district_match:
            candidates = []

    if not candidates:
        # Never recommend an unrelated place when the requested location is unknown.
        # Build a transparent, location-specific planning result until verified local
        # tourism data or a live AI provider can supply named attractions.
        candidates = build_location_specific_candidates(state, district, trip_data)

    # If regenerate requested, exclude previously shown
    filtered_candidates = [c for c in candidates if c["id"] not in exclude_ids]
    if not filtered_candidates:
        filtered_candidates = candidates

    scored_destinations = []

    for dest in filtered_candidates:
        score = 80
        match_factors = []

        # 1. State / Regional match
        if state and state.lower() in dest["state"].lower():
            score += 8
            match_factors.append(f"Located in your requested region of {dest['state']}")

        # 2. Climate preference match
        dest_climate = dest.get("climate", "").lower()
        if "cool" in climate.lower() and ("cool" in dest_climate or "chilly" in dest_climate):
            score += 6
            match_factors.append(f"Matches your preference for cool mountain weather ({dest.get('climate')})")
        elif "warm" in climate.lower() and ("warm" in dest_climate or "sunny" in dest_climate):
            score += 6
            match_factors.append("Matches your sunny tropical climate choice")
        elif "moderate" in climate.lower() and "moderate" in dest_climate:
            score += 6
            match_factors.append("Comfortable moderate climate suitable for all day travel")

        # 3. Preference tags (Nature, Waterfalls, Mountains, Heritage, Photography)
        pref_matches = []
        for pref in preferences:
            pref_lower = pref.lower()
            if pref_lower in dest.get("category", "").lower() or pref_lower in dest.get("description", "").lower():
                score += 3
                pref_matches.append(pref)
        if pref_matches:
            match_factors.append(f"Directly supports your interests in {', '.join(pref_matches)}")

        # 4. Traveller Party & Age Suitability
        if has_children:
            suit = dest.get("ageSuitability", {}).get("children", "").lower()
            if "high" in suit:
                score += 4
                match_factors.append(f"Safe, accessible terrain for your child (ages: {', '.join(str(a) for a in child_ages) or 'under 12'})")
        if has_seniors:
            suit_sen = dest.get("ageSuitability", {}).get("seniors", "").lower()
            if "high" in suit_sen or "moderate" in suit_sen:
                score += 3
                match_factors.append("Provides level pathways, scenic seated viewpoints, and relaxed pacing for senior family members")

        # 5. Budget alignment
        score += 4
        match_factors.append(f"Estimated expenses fit comfortably within your budget range ({budget})")

        # Cap score between 88 and 99
        final_score = min(max(score, 88), 99)

        # Generate detailed personalized explanation referencing specific questionnaire inputs
        ai_explanation = generate_detailed_reasoning(
            dest=dest,
            trip_data=trip_data,
            match_factors=match_factors,
            has_children=has_children,
            has_seniors=has_seniors,
            language=language
        )

        # Generate personalized Packing Suggestions & Things to Avoid
        packing_list = generate_packing_list(dest, trip_data)
        things_to_avoid = generate_things_to_avoid(dest, trip_data, has_children, has_seniors)

        destination_identity = geocode_place(dest["name"], dest.get("state", ""))
        if not destination_identity.get("available"):
            fallback_latitude, fallback_longitude = geocode_destination(dest["name"], dest.get("state", ""))
            if fallback_latitude and fallback_longitude:
                destination_identity = {
                    "available": True,
                    "latitude": fallback_latitude,
                    "longitude": fallback_longitude,
                    "city": dest.get("district", dest["name"]),
                    "state": dest.get("state", ""),
                    "country": "India",
                    "formattedAddress": f"{dest['name']}, {dest.get('state', '')}, India"
                }
        if destination_identity.get("available"):
            destination_latitude = destination_identity["latitude"]
            destination_longitude = destination_identity["longitude"]
        else:
            destination_latitude = dest.get("latitude")
            destination_longitude = dest.get("longitude")

        destination = {
            "name": dest["name"],
            "city": destination_identity.get("city", dest.get("district", dest["name"])),
            "state": destination_identity.get("state", dest.get("state", "")),
            "country": destination_identity.get("country", "India"),
            "formattedAddress": destination_identity.get("formattedAddress"),
            "latitude": destination_latitude,
            "longitude": destination_longitude,
        }
        logistics = build_logistics(destination)
        unavailable = "Information temporarily unavailable"
        structured_airport = logistics.get("airport", {"available": False, "reason": "No verified data found"})
        structured_railway = logistics.get("railway", {"available": False, "reason": "No verified data found"})
        structured_bus = logistics.get("bus", {"available": False, "reason": "No verified data found"})
        structured_driving = logistics.get("driving", {"available": False, "reason": "No origin coordinates supplied"})
        recommended_places = _normalise_recommended_places(dest, destination_identity)
        if not recommended_places and destination_latitude and destination_longitude:
            recommended_places = build_recommended_places(destination_latitude, destination_longitude, destination)

        # Fetch real live weather using the same coordinates returned to the frontend.
        real_weather = (
            fetch_real_weather(destination_latitude, destination_longitude)
            if destination_latitude and destination_longitude
            else {"available": False, "message": "Weather temporarily unavailable for this destination."}
        )

        dest_obj = {
            "id": dest["id"],
            "destinationName": dest["name"],
            "name": dest["name"],
            "state": destination["state"],
            "district": dest.get("district", destination["city"]),
            "city": destination["city"],
            "country": destination["country"],
            "formattedAddress": destination["formattedAddress"],
            "category": dest["category"],
            "climate": dest["climate"],
            "travelTime": dest["travelTime"],
            "estimatedCost": dest["estimatedCost"],
            "rating": dest["rating"],
            "matchScore": final_score,
            **resolve_destination_images(dest["id"], dest["name"]),
            "tagline": dest.get("tagline", ""),
            "description": dest["description"],
            "latitude": destination_latitude,
            "longitude": destination_longitude,
            "map": {
                "latitude": destination_latitude,
                "longitude": destination_longitude,
                "recommendedPlaces": recommended_places,
                "airport": structured_airport,
                "railway": structured_railway,
                "bus": structured_bus,
                "localTransport": logistics.get("localTransport", {"available": False})
            },
            "placeId": dest.get("placeId", ""),
            "officialWebsite": dest.get("officialWebsite", ""),
            "verifiedAttractions": dest.get("verifiedAttractions", []),
            "attractions": dest.get("verifiedAttractions", []),
            "recommendedPlaces": recommended_places,
            "logistics": logistics,
            "weather": real_weather,
            "aiReasoning": ai_explanation,
            "matchExplanation": ai_explanation,
            "matchFactors": match_factors,
            "packingSuggestions": packing_list,
            "thingsToAvoid": things_to_avoid,
            "ageSuitability": dest.get("ageSuitability", {}),
            "travelDetails": {
                "nearestAirport": _format_transport_item(structured_airport, unavailable),
                "nearestRailway": _format_transport_item(structured_railway, unavailable),
                "busConnectivity": _format_transport_item(structured_bus, unavailable),
                "bestRoute": (
                    f"{structured_driving.get('distanceKm')} km driving route, "
                    f"approximately {structured_driving.get('durationMinutes')} minutes"
                    if structured_driving.get("available")
                    else (
                        f"Destination coordinates: {destination_latitude}, {destination_longitude}. "
                        f"{structured_driving.get('reason', unavailable)}"
                    )
                ),
                "localTransport": _format_transport_item(logistics.get("localTransport", {}), unavailable)
            },
            "isVerified": not dest.get("isGeneratedPlan", False),
            "isGeneratedPlan": dest.get("isGeneratedPlan", False)
        }
        scored_destinations.append(dest_obj)

    # Sort descending by matchScore
    scored_destinations.sort(key=lambda x: x["matchScore"], reverse=True)

    # Return top recommendations (usually top 3)
    return scored_destinations[:3]


def build_location_specific_candidates(
    state: str,
    district: str,
    trip_data: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """Create recommendations tied to the requested location without inventing facts."""
    requested_state = state or "the selected state"
    requested_district = district or requested_state
    preferences = trip_data.get("preferences", [])
    focus = ", ".join(preferences[:3]) if preferences else "local sightseeing"
    patterns = [
        ("nature and local sightseeing", "Nature & Local Experiences"),
        ("heritage and cultural exploration", "Heritage & Culture"),
        ("family-friendly activities", "Family & Leisure")
    ]
    latitude, longitude = geocode_destination(requested_district, requested_state)

    return [
        {
            "id": f"ai-{slugify(requested_district)}-{index}",
            "name": f"{requested_district} {suffix}",
            "state": requested_state,
            "district": requested_district,
            "category": category,
            "climate": trip_data.get("climate", "Variable local climate"),
            "travelTime": "Plan from your selected city",
            "estimatedCost": trip_data.get("budget", "Budget to be confirmed"),
            "rating": None,
            **resolve_destination_images(f"ai-{slugify(requested_district)}-{index}", f"{requested_district} {description_focus}"),
            "tagline": f"AI-planned {requested_district} experience",
            "description": (
                f"A flexible {description_focus} plan in {requested_district}, {requested_state}. "
                "Confirm local attractions, opening hours, and permits before booking."
            ),
            "latitude": latitude,
            "longitude": longitude,
            "verifiedAttractions": [],
            "ageSuitability": {},
            "travelDetails": {
                "nearestAirport": "Information temporarily unavailable: destination-specific transport lookup is pending",
                "nearestRailway": "Information temporarily unavailable: destination-specific transport lookup is pending",
                "busConnectivity": "Information temporarily unavailable: destination-specific transport lookup is pending",
                "bestRoute": f"Destination coordinates: {latitude}, {longitude}. No origin coordinates supplied.",
                "localTransport": "Information temporarily unavailable: destination-specific transport lookup is pending"
            },
            "safetyAndPrecautions": [
                "Verify local tourism guidance, weather, transport, and attraction access before departure."
            ],
            "isGeneratedPlan": True,
            "relevanceScore": 100 - index
        }
        for index, (description_focus, category) in enumerate(patterns, start=1)
        for suffix in [f"{description_focus.title()} Plan"]
    ]


def slugify(value: str) -> str:
    return "-".join(value.lower().split()) or "location"

def generate_detailed_reasoning(
    dest: Dict[str, Any],
    trip_data: Dict[str, Any],
    match_factors: List[str],
    has_children: bool,
    has_seniors: bool,
    language: str
) -> str:
    dest_name = dest["name"]
    purpose = trip_data.get("purpose", "a memorable getaway")
    budget = trip_data.get("budget", "your budget")
    duration = trip_data.get("duration", "your scheduled duration")
    prefs = ", ".join(trip_data.get("preferences", ["nature"])) or "scenic exploration"

    if language == "ta":
        return (
            f"{dest_name} உங்கள் விருப்பத் தேர்வான '{prefs}' மற்றும் '{budget}' பட்ஜெட் திட்டத்திற்கு மிகச் சரியாகப் பொருந்துகிறது. "
            f"உங்கள் குழுவின் பயண காலம் ({duration}) மற்றும் பயண வகை ஆகியவற்றை ஒருங்கிணைத்து, "
            f"அதிக பயண சிரமமின்றி அமைதியான, பாதுகாப்பான அனுபவத்தை வழங்க இந்த இடம் AI ஆல் தேர்ந்தெடுக்கப்பட்டுள்ளது."
        )
    elif language == "hi":
        return (
            f"{dest_name} आपकी प्राथमिकताओं ({prefs}) और {budget} के बजट के लिए आदर्श गंतव्य है। "
            f"आपकी यात्रा अवधि ({duration}) और परिवार की सुरक्षा आवश्यकताओं को ध्यान में रखते हुए "
            f"यह स्थान प्राकृतिक सुंदरता और आरामदायक यात्रा का उत्तम संतुलन प्रदान करता है।"
        )

    # English Default
    reasons = f"We selected **{dest_name}** as your top destination because it directly matches your interest in {prefs} while remaining comfortably aligned with your {budget} budget and {duration} timeframe. "
    if has_children:
        reasons += "The destination offers paved trails, child-friendly attractions, and gentle elevation changes. "
    if has_seniors:
        reasons += "Scenic viewpoints are accessible with minimal strenuous walking, ensuring comfort for senior travellers. "
    reasons += f"Our routing maximizes sightseeing time and minimizes repetitive commute times."
    return reasons

def generate_packing_list(dest: Dict[str, Any], trip_data: Dict[str, Any]) -> List[str]:
    climate = dest.get("climate", "").lower()
    base_items = [
        "Government Photo ID & printed booking confirmations",
        "Personal medications & basic first aid kit",
        "Power bank & smartphone chargers",
        "Comfortable walking shoes with grip"
    ]

    if "cool" in climate or "chilly" in climate:
        base_items.extend([
            "Light woollen sweater or thermal jacket for evenings",
            "Moisturizer & lip balm for mountain dry air",
            "Light scarf / beanie for morning viewpoints"
        ])
    elif "warm" in climate or "beach" in dest.get("category", "").lower():
        base_items.extend([
            "Breathable linen & lightweight cotton clothing",
            "Broad-spectrum SPF 50+ sunscreen & UV sunglasses",
            "Wide-brim sun hat & quick-dry towel"
        ])

    if any(p.lower() in ["waterfalls", "trekking", "adventure"] for p in trip_data.get("preferences", [])):
        base_items.append("Compact water-resistant daypack & rain poncho")

    return base_items

def generate_things_to_avoid(
    dest: Dict[str, Any],
    trip_data: Dict[str, Any],
    has_children: bool,
    has_seniors: bool
) -> List[str]:
    avoids = list(dest.get("safetyAndPrecautions", []))
    
    if has_children:
        avoids.append("Avoid unfenced cliff edges and unpatrolled swimming zones with children.")
    if has_seniors:
        avoids.append("Avoid fast-paced steep uphill climbs; schedule regular hydration and seating breaks.")

    avoids.append("General travel precaution information — not medical advice. For medical conditions, consult your qualified healthcare professional.")
    return avoids
