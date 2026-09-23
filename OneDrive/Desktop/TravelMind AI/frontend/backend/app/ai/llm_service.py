import os
import json
import re
import logging
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER.lower()
        self.api_key = settings.LLM_API_KEY
        self.base_url = settings.LLM_BASE_URL or None
        self.model = settings.LLM_MODEL or "gpt-4o-mini"
        self._client = None

    def is_live(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    def _get_openai_client(self):
        if not self._client and self.api_key:
            try:
                from openai import OpenAI
                kwargs = {"api_key": self.api_key}
                if self.base_url:
                    kwargs["base_url"] = self.base_url
                self._client = OpenAI(**kwargs)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
        return self._client

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Optional[str]:
        if not self.is_live():
            return None
            
        try:
            client = self._get_openai_client()
            if not client:
                return None
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"LLM API execution error: {e}")
            return None

    def extract_action_and_reply(
        self,
        user_message: str,
        trip_context: Dict[str, Any],
        language: str = "en",
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Analyzes user message in the context of current trip,
        determines if a structured action is needed, and generates conversational reply.
        """
        text = user_message.lower().strip()
        destination = trip_context.get("destination") or {}
        dest_name = destination.get("name", "your selected destination")
        lat = destination.get("latitude")
        lon = destination.get("longitude")
        place_id = destination.get("placeId", "")

        # Detect action intent
        action = "NO_ACTION"
        action_payload = {}

        if any(k in text for k in ["maps", "map", "வரைபடம்", "नक्शा", "గూగుల్ మ్యాప్స్", "ഭൂപടം"]):
            action = "OPEN_MAPS"
            action_payload = {"destinationName": dest_name, "latitude": lat, "longitude": lon, "placeId": place_id}
        elif any(k in text for k in ["earth", "satellite", "భూమి", "பூமி", "उपग्रह"]):
            action = "OPEN_EARTH"
            action_payload = {"destinationName": dest_name, "latitude": lat, "longitude": lon}
        elif any(k in text for k in ["3d", "three d", "ත්‍රිමාණ"]):
            action = "OPEN_3D"
            action_payload = {"destinationName": dest_name, "latitude": lat, "longitude": lon, "placeId": place_id}
        elif any(k in text for k in ["regenerate itinerary", "change itinerary", "new itinerary", "itinerary change", "புதிய பயணத்திட்டம்"]):
            action = "REGENERATE_ITINERARY"
        elif any(k in text for k in ["suggest another", "different destination", "change destination", "another place", "வேறு இடம்", "दूसरा"]):
            action = "REGENERATE_DESTINATION"
        elif any(k in text for k in ["weather", "forecast", "rain", "rainy", "temperature", "வானிலை", "मौसम", "వాతావరణం"]):
            action = "SHOW_WEATHER"
        elif any(k in text for k in ["pack", "packing", "what to bring", "உடை", "सामान"]):
            action = "SHOW_PACKING"
        elif any(k in text for k in ["avoid", "danger", "precaution", "safety", "தவிர்க்க", "सुरक्षा"]):
            action = "SHOW_AVOID"
        elif any(k in text for k in ["show itinerary", "view itinerary", "schedule", "பயண திட்டம்"]):
            action = "SHOW_ITINERARY"

        # If live LLM is available, generate response through LLM
        if self.is_live():
            system_prompt = f"""You are TravelMind AI, an expert, enthusiastic, and highly personalized AI travel companion.
Current Trip Context:
- Active Language: {language}
- Current Destination: {dest_name} (State: {destination.get('state', 'India')})
- Budget: {trip_context.get('budget', 'Flexible')}
- Duration: {trip_context.get('duration', '3-5 Days')}
- Party: {len(trip_context.get('travellers', []))} travellers (Adults: {trip_context.get('adultsCount', 1)}, Children: {trip_context.get('childrenCount', 0)}, Seniors: {trip_context.get('seniorsCount', 0)})
- Purpose: {trip_context.get('purpose', 'Vacation')}
- Preferences: {', '.join(trip_context.get('preferences', []))}
- Live Weather: {trip_context.get('weather', {}).get('temperature', 'Pleasant')}, {trip_context.get('weather', {}).get('condition', '')}

Respond in the requested language: '{language}'. Be helpful, concise (2-4 sentences for voice clarity), and directly address the user's inquiry."""

            msgs = [{"role": "system", "content": system_prompt}]
            if history:
                for h in history[-4:]:
                    role = "user" if h.get("sender") == "user" else "assistant"
                    msgs.append({"role": role, "content": h.get("text", "")})
            msgs.append({"role": "user", "content": user_message})

            llm_reply = self.chat_completion(msgs, max_tokens=300)
            if llm_reply:
                return {
                    "message": llm_reply.strip(),
                    "action": action,
                    "destination": action_payload,
                    "live_llm": True
                }

        # Contextual grounded generation
        reply = self._generate_grounded_reply(text, dest_name, trip_context, language, action)
        return {
            "message": reply,
            "action": action,
            "destination": action_payload,
            "live_llm": False
        }

    def _generate_grounded_reply(
        self,
        query: str,
        dest_name: str,
        trip_context: Dict[str, Any],
        language: str,
        action: str
    ) -> str:
        lang = language.lower()
        weather = trip_context.get("weather", {})
        temp = weather.get("temperature", "20°C")
        cond = weather.get("condition", "pleasant")
        budget = trip_context.get("budget", "moderate")
        travellers = trip_context.get("travellers", [])
        has_child = any(t.get("age", 25) < 12 for t in travellers) or trip_context.get("childrenCount", 0) > 0

        # Language specific responses
        if lang == "ta":  # Tamil
            if action == "OPEN_MAPS":
                return f"{dest_name} இடத்தின் நேரடி வரைபடத்தை (Google Maps) இப்போது திறக்கிறேன்!"
            elif action == "OPEN_EARTH":
                return f"{dest_name} இடத்தின் நேரடி 3D செயற்கைக்கோள் பார்வையை (Google Earth) திறக்கிறேன்!"
            elif action == "OPEN_3D":
                return f"{dest_name} பகுதியின் 3D முப்பரிமாணக் காட்சியை திரையில் காட்டுகிறேன்."
            elif action == "SHOW_WEATHER":
                return f"{dest_name} பகுதியில் தற்போதைய வெப்பநிலை {temp} மற்றும் வானிலை {cond} ஆக உள்ளது. 7-நாள் கணிப்பைப் பார்க்கவும்."
            elif action == "SHOW_PACKING":
                return f"{dest_name} பயணத்திற்கு இலகுவான ஆடைகள், மாலைக் குளிருக்கான மேலாடை, மற்றும் நடைப்பயிற்சி காலணிகளை எடுத்துச் செல்ல பரிந்துரைக்கிறேன்."
            elif "child" in query or "குழந்தை" in query or has_child:
                return f"ஆம்! {dest_name} குழந்தைகளுக்கு மிகவும் பாதுகாப்பானது மற்றும் மகிழ்ச்சியளிக்கும் இடங்கள் உள்ளன."
            elif "cheap" in query or "குறை" in query or "budget" in query:
                return f"உங்கள் பட்ஜெட்டை மிச்சப்படுத்த பொதுப் போக்குவரத்து மற்றும் உள்ளூர் தங்குமிடங்களை திட்டமிட்டுள்ளோம்."
            return f"டிராவல்மைண்ட் AI உங்கள் பயணத் தேவைகளை கவனத்தில் கொண்டுள்ளது! {dest_name} பற்றிய மேலும் விவரங்களைக் கேளுங்கள்."

        elif lang == "hi":  # Hindi
            if action == "OPEN_MAPS":
                return f"{dest_name} का लाइव गूगल मैप्स खोला जा रहा है।"
            elif action == "OPEN_EARTH":
                return f"{dest_name} का 3D सैटेलाइट व्यू (गूगल अर्थ) खोला जा रहा है।"
            elif action == "SHOW_WEATHER":
                return f"{dest_name} में वर्तमान तापमान {temp} है और मौसम {cond} बना हुआ है।"
            elif "child" in query or "बच्च" in query:
                return f"{dest_name} बच्चों और पूरे परिवार के लिए सुरक्षित और आनंददायक है।"
            return f"ट्रैवलमाइंड AI आपके {dest_name} ट्रिप की हर ज़रूरत का ध्यान रखता है। मुझसे कुछ भी पूछें!"

        elif lang == "te":  # Telugu
            if action == "OPEN_MAPS":
                return f"{dest_name} కోసం గూగుల్ మ్యాప్స్ తెరుస్తున్నాము."
            elif action == "SHOW_WEATHER":
                return f"{dest_name} వద్ద ప్రస్తుత ఉష్ణోగ్రత {temp}, వాతావరణం {cond}."
            return f"ట్రావెల్‌మైండ్ AI మీ {dest_name} ప్రయాణాన్ని వ్యక్తిగతీకరిస్తుంది. మరింత సమాచారం అడగండి!"

        elif lang == "ml":  # Malayalam
            if action == "OPEN_MAPS":
                return f"{dest_name} ഗൂഗിൾ മാപ്പിൽ തുറക്കുന്നു."
            elif action == "SHOW_WEATHER":
                return f"{dest_name}-ൽ ഇപ്പോഴത്തെ താപനില {temp} ആണ്, കാലാവസ്ഥ {cond}."
            return f"ട്രാവൽമൈൻഡ് AI നിങ്ങളുടെ {dest_name} യാത്ര ഏറ്റവും മികച്ചതാക്കാൻ സഹായിക്കുന്നു."

        elif lang == "kn":  # Kannada
            if action == "OPEN_MAPS":
                return f"{dest_name} ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ."
            elif action == "SHOW_WEATHER":
                return f"{dest_name} ಪ್ರಸ್ತುತ ತಾಪಮಾನ {temp}, ಹವಾಮಾನ {cond}."
            return f"ಟ್ರಾವೆಲ್‌ಮೈಂಡ್ AI ನಿಮ್ಮ {dest_name} ಪ್ರವಾಸಕ್ಕೆ ಸದಾ ಸಿದ್ಧವಾಗಿದೆ."

        # Default English
        if action == "OPEN_MAPS":
            return f"Opening live Google Maps coordinates for {dest_name} right now!"
        elif action == "OPEN_EARTH":
            return f"Launching Google Earth 3D satellite view for {dest_name}!"
        elif action == "OPEN_3D":
            return f"Rendering the interactive 3D terrain and landmarks for {dest_name}."
        elif action == "SHOW_WEATHER":
            return f"Current temperature at {dest_name} is {temp} with {cond} conditions. Check the 7-day climate tab for daily forecasts."
        elif action == "SHOW_PACKING":
            return f"For {dest_name}, pack comfortable walking shoes, weather-appropriate layers, a compact umbrella, and any essential personal medications."
        elif action == "REGENERATE_ITINERARY":
            return f"Regenerating a fresh day-by-day itinerary for {dest_name} tailored to your current constraints."
        elif "cheap" in query or "budget" in query:
            return f"We have optimized your itinerary with government-certified transit and high-value homestays to comfortably stay within {budget}."
        elif "child" in query or "kids" in query or has_child:
            return f"{dest_name} features gentle terrain and family-friendly viewpoints suited for children. Rest stops have been scheduled."
        return f"TravelMind AI is tracking your trip to {dest_name}. I can adjust your budget, optimize daily timings, or open live navigation!"

llm_service = LLMService()
