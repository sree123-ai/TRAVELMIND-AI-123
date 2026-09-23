import logging
import math
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)
USER_AGENT = "TravelMind-AI/1.0 (travel planner)"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URLS = (
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
)
OSRM_URL = "https://router.project-osrm.org/route/v1/driving"


def _distance_km(origin: Tuple[float, float], target: Tuple[float, float]) -> float:
    lat1, lon1 = map(math.radians, origin)
    lat2, lon2 = map(math.radians, target)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    value = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(value))


def _place_point(element: Dict[str, Any]) -> Optional[Tuple[float, float]]:
    if element.get("lat") is not None and element.get("lon") is not None:
        return float(element["lat"]), float(element["lon"])
    center = element.get("center") or {}
    if center.get("lat") is not None and center.get("lon") is not None:
        return float(center["lat"]), float(center["lon"])
    return None


@lru_cache(maxsize=128)
def geocode_place(name: str, state: str = "", country: str = "India") -> Dict[str, Any]:
    queries = [
        ", ".join(part for part in (name, state, country) if part),
        ", ".join(part for part in (name, country) if part)
    ]
    for query in queries:
        try:
            response = requests.get(
                NOMINATIM_URL,
                params={"q": query, "format": "jsonv2", "addressdetails": 1, "limit": 1},
                headers={"User-Agent": USER_AGENT},
                timeout=10,
            )
            response.raise_for_status()
            results = response.json()
            if results:
                result = results[0]
                address = result.get("address", {})
                return {
                    "available": True,
                    "latitude": float(result["lat"]),
                    "longitude": float(result["lon"]),
                    "formattedAddress": result.get("display_name", query),
                    "city": address.get("city") or address.get("town") or address.get("municipality") or address.get("village") or name,
                    "state": address.get("state") or state,
                    "country": address.get("country") or country,
                    "osmType": result.get("osm_type"),
                    "osmId": result.get("osm_id"),
                }
        except (requests.RequestException, ValueError, KeyError, TypeError) as error:
            logger.warning("Nominatim failed for %s: %s", query, error)
    return {"available": False, "reason": "No verified geocoding result found"}


@lru_cache(maxsize=64)
def nearby_transport(latitude: float, longitude: float) -> Dict[str, Any]:
    """Fetch transport categories separately so large-city queries remain reliable."""
    queries = (
        ("airport", f"nwr(around:250000,{latitude},{longitude})[aeroway=aerodrome];"),
        ("railway", f"nwr(around:70000,{latitude},{longitude})[railway=station];"),
        ("bus", f"nwr(around:50000,{latitude},{longitude})[amenity=bus_station];"),
        ("public_transport", f"nwr(around:50000,{latitude},{longitude})[public_transport=station];"),
        ("taxi", f"nwr(around:30000,{latitude},{longitude})[amenity=taxi];"),
    )
    elements: List[Dict[str, Any]] = []
    provider_errors = []
    for category, selector in queries:
        query = f"[out:json][timeout:15];({selector});out center tags;"
        result = _query_overpass(query, f"{category} transport for {latitude},{longitude}", f"{category} provider unavailable")
        if result.get("available"):
            elements.extend(result.get("elements", []))
        else:
            provider_errors.append(result.get("reason", f"{category} provider unavailable"))
    if elements:
        return {"available": True, "elements": elements, "providerErrors": provider_errors}
    return {"available": False, "reason": "; ".join(provider_errors) or "Transport geospatial service unavailable"}


@lru_cache(maxsize=64)
def nearby_places(latitude: float, longitude: float) -> Dict[str, Any]:
    query = f"""
    [out:json][timeout:25];
    (
      nwr(around:30000,{latitude},{longitude})[tourism];
      nwr(around:30000,{latitude},{longitude})[historic];
      nwr(around:30000,{latitude},{longitude})[natural];
    );
    out center tags;
    """
    return _query_overpass(query, f"places for {latitude},{longitude}", "Places geospatial service unavailable")


def _query_overpass(query: str, label: str, failure_reason: str) -> Dict[str, Any]:
    last_error = None
    for endpoint in OVERPASS_URLS:
        try:
            response = requests.post(endpoint, data=query, headers={"User-Agent": USER_AGENT}, timeout=25)
            response.raise_for_status()
            return {"available": True, "elements": response.json().get("elements", [])}
        except (requests.RequestException, ValueError, TypeError) as error:
            last_error = error
            logger.warning("Overpass provider failed for %s at %s: %s", label, endpoint, error)
    return {"available": False, "reason": failure_reason, "providerError": str(last_error)}


def _named_transport(elements: List[Dict[str, Any]], origin: Tuple[float, float], kind: str, radius_km: float) -> Optional[Dict[str, Any]]:
    matches = []
    for element in elements:
        tags = element.get("tags", {})
        point = _place_point(element)
        name = tags.get("name")
        if not point or not name:
            continue
        if kind == "airport" and tags.get("aeroway") != "aerodrome":
            continue
        if kind == "railway" and tags.get("railway") != "station":
            continue
        if kind == "bus" and not (tags.get("amenity") == "bus_station" or tags.get("public_transport") == "station"):
            continue
        if kind == "taxi" and tags.get("amenity") != "taxi":
            continue
        distance = _distance_km(origin, point)
        if distance <= radius_km:
            matches.append((distance, name, point, tags))
    if not matches:
        return None
    distance, name, point, tags = min(matches, key=lambda item: item[0])
    return {
        "available": True,
        "name": name,
        "distanceKm": round(distance, 1),
        "latitude": point[0],
        "longitude": point[1],
        "operator": tags.get("operator"),
    }


def _category(tags: Dict[str, str]) -> str:
    return tags.get("tourism") or tags.get("historic") or tags.get("natural") or "place"


def build_recommended_places(latitude: float, longitude: float, destination: Dict[str, Any], limit: int = 5) -> List[Dict[str, Any]]:
    result = nearby_places(latitude, longitude)
    if not result.get("available"):
        return []
    places = []
    seen = set()
    for element in result.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name")
        point = _place_point(element)
        if not name or not point or name.lower() in seen:
            continue
        seen.add(name.lower())
        places.append({
            "name": name,
            "category": _category(tags),
            "city": destination.get("city", destination.get("name", "")),
            "state": destination.get("state", ""),
            "country": destination.get("country", "India"),
            "latitude": point[0],
            "longitude": point[1],
            "description": tags.get("description") or f"Verified OpenStreetMap place record near {destination.get('name', 'the destination')}.",
            "imageUrl": None,
            "imageSource": None,
            "sourceUrl": f"https://www.openstreetmap.org/{element.get('type', 'node')}/{element.get('id')}"
        })
        if len(places) >= limit:
            break
    return places


def build_logistics(destination: Dict[str, Any], origin: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    latitude = destination.get("latitude")
    longitude = destination.get("longitude")
    if latitude is None or longitude is None:
        return {"available": False, "reason": "Destination coordinates are unavailable"}
    origin_point = (float(latitude), float(longitude))
    transport = nearby_transport(float(latitude), float(longitude))
    elements = transport.get("elements", []) if transport.get("available") else []
    airport = _named_transport(elements, origin_point, "airport", 150)
    railway = _named_transport(elements, origin_point, "railway", 150)
    bus = _named_transport(elements, origin_point, "bus", 50)
    taxi = _named_transport(elements, origin_point, "taxi", 30)

    driving: Dict[str, Any] = {"available": False, "reason": "No origin coordinates supplied"}
    if origin and origin.get("latitude") is not None and origin.get("longitude") is not None:
        try:
            origin_lat = float(origin["latitude"])
            origin_lon = float(origin["longitude"])
            route = requests.get(
                f"{OSRM_URL}/{origin_lon},{origin_lat};{longitude},{latitude}",
                params={"overview": "false"},
                headers={"User-Agent": USER_AGENT},
                timeout=15,
            )
            route.raise_for_status()
            route_data = route.json().get("routes", [])
            if route_data:
                driving = {
                    "available": True,
                    "distanceKm": round(route_data[0]["distance"] / 1000, 1),
                    "durationMinutes": round(route_data[0]["duration"] / 60),
                    "routeAvailable": True,
                }
        except (requests.RequestException, ValueError, KeyError, TypeError) as error:
            logger.warning("OSRM route failed: %s", error)
            driving = {"available": False, "reason": "Driving route service unavailable"}

    provider_error = transport.get("reason") if not transport.get("available") else None
    return {
        "available": True,
        "destination": destination,
        "airport": airport or {"available": False, "reason": provider_error or "No verified airport found"},
        "railway": railway or {"available": False, "reason": provider_error or "No verified railway station found"},
        "bus": bus or {"available": False, "reason": provider_error or "No verified bus station found"},
        "driving": driving,
        "localTransport": taxi or {"available": False, "reason": provider_error or "No verified taxi stand found"},
    }
