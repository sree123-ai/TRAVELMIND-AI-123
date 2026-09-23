import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchRecommendations } from '../services/api';
import { DestinationCard } from '../components/DestinationCard';
import { WeatherCard } from '../components/WeatherCard';
import { PackingSuggestions } from '../components/PackingSuggestions';
import { TravelDetails } from '../components/TravelDetails';
import { AgeSuitability } from '../components/AgeSuitability';
import { AIChatbot } from '../components/AIChatbot';
import { Sparkles, ShieldAlert, Calendar, MapPin, Users, IndianRupee, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const Recommendations = () => {
  const { t } = useLanguage();
  const { tripData } = useAuth();

  const [avoidOpen, setAvoidOpen] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      if (!tripData) {
        setError('Complete the questionnaire before viewing recommendations.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchRecommendations(tripData);
        if (active) {
          const results = Array.isArray(data) ? data : data.recommendations || [];
          setRecommendations(results);
          localStorage.setItem('travelmind_recommendations', JSON.stringify(results));
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load AI recommendations.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadRecommendations();
    return () => { active = false; };
  }, [tripData]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-black text-textBrownDark">Generating recommendations...</div>;
  }

  if (error || !recommendations.length) {
    return <div className="min-h-screen flex items-center justify-center p-6 text-center text-lg font-black text-textBrownDark">{error || 'No recommendations were found for this trip.'}</div>;
  }

  const primaryDest = recommendations[0];
  const travellers = tripData.travellers || [];
  const profileLocation = [tripData.district, tripData.state].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen py-6 px-4 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Title Banner */}
      <div className="parchment-panel p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tourGold border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] mb-2">
          <Sparkles className="w-4 h-4 text-tourOrange" />
          <span className="font-extrabold text-xs text-textBrown">AI REASONING ENGINE RESULTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-textBrownDark tracking-tight">
          ✨ {t('rec_heading')}
        </h1>
        <p className="text-xs sm:text-sm text-textBrown/80 font-bold max-w-2xl mx-auto mt-2">
          Personalized multi-criteria match based on your party age distribution, budget constraints, allergy safeguards, and climate preferences.
        </p>
      </div>

      {/* Section 1: YOUR TRIP PROFILE */}
      <div className="parchment-panel p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-textBrownDark flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-tourOrange" />
          <span>{t('trip_profile_title')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-cream-100 p-3 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]">
            <span className="text-xs font-bold text-textBrown/70 uppercase block">State / Region</span>
            <p className="font-black text-sm text-tourOrange mt-0.5">{profileLocation || 'Selected location'}</p>
          </div>

          <div className="bg-cream-100 p-3 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]">
            <span className="text-xs font-bold text-textBrown/70 uppercase block">Travellers</span>
            <p className="font-black text-sm text-tourGreen mt-0.5">
              {travellers.length || (tripData.adultsCount || 0) + (tripData.childrenCount || 0) + (tripData.seniorsCount || 0)} Persons
            </p>
          </div>

          <div className="bg-cream-100 p-3 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]">
            <span className="text-xs font-bold text-textBrown/70 uppercase block">Budget</span>
            <p className="font-black text-sm text-tourBlue mt-0.5">{tripData?.budget || tripData?.customBudget || 'Flexible'}</p>
          </div>

          <div className="bg-cream-100 p-3 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]">
            <span className="text-xs font-bold text-textBrown/70 uppercase block">Duration</span>
            <p className="font-black text-sm text-tourPurple mt-0.5">{tripData?.duration || 'Flexible'}</p>
          </div>

          <div className="bg-cream-100 p-3 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]">
            <span className="text-xs font-bold text-textBrown/70 uppercase block">Diet / Food</span>
            <p className="font-black text-sm text-tourPink mt-0.5">{tripData?.food || 'As selected'}</p>
          </div>
        </div>
      </div>

      {/* Section 2: AI ANALYSIS & REASONING */}
      <div className="parchment-panel p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-textBrownDark flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-tourGold fill-tourGold" />
          <span>🤖 {t('ai_analysis_title')}</span>
        </h2>
        <div className="bg-cream-100 p-4 rounded-xl border-2 border-borderBrown text-sm sm:text-base leading-relaxed space-y-2">
          <p>{primaryDest.aiReasoning || primaryDest.matchExplanation}</p>
          <p className="text-xs sm:text-sm text-textBrown/85">
            <strong>Matched questionnaire inputs:</strong> {tripData.preferences?.join(', ') || 'general sightseeing'}, {tripData.purpose || 'your travel purpose'}, {tripData.climate || 'your climate preference'}, and {tripData.duration || 'your selected duration'}.
          </p>
          <p className="text-xs sm:text-sm text-textBrown/85">
            <strong>Location:</strong> Recommendations are constrained to {profileLocation || 'your selected location'}.
          </p>
        </div>
      </div>

      {/* Section 3: THINGS TO AVOID & PRECAUTIONS (Collapsible) */}
      <div className="parchment-panel p-6 sm:p-8">
        <div
          onClick={() => setAvoidOpen(!avoidOpen)}
          className="flex items-center justify-between cursor-pointer"
        >
          <h2 className="text-xl sm:text-2xl font-black text-textBrownDark flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-tourPink" />
            <span>⚠️ {t('things_to_avoid_title')}</span>
          </h2>
          {avoidOpen ? <ChevronUp className="w-6 h-6 text-borderBrown" /> : <ChevronDown className="w-6 h-6 text-borderBrown" />}
        </div>

        {avoidOpen && (
          <div className="mt-4 space-y-2 text-xs sm:text-sm font-bold text-textBrown">
            <div className="p-3 bg-red-50 border-2 border-tourPink/40 rounded-xl">
              🚫 {primaryDest.thingsToAvoid?.[0] || 'Verify local access and safety guidance before travelling.'}
            </div>
            <div className="p-3 bg-red-50 border-2 border-tourPink/40 rounded-xl">
              🚫 {primaryDest.thingsToAvoid?.[1] || 'Check weather and local advisories before outdoor activities.'}
            </div>
            <div className="p-3 bg-red-50 border-2 border-tourPink/40 rounded-xl">
              🚫 {primaryDest.thingsToAvoid?.[2] || 'Use only designated and supervised visitor areas.'}
            </div>
            <p className="text-[11px] text-textBrown/70 italic font-semibold mt-2">
              *{t('medical_disclaimer')}
            </p>
          </div>
        )}
      </div>

      {/* Section 4: WEATHER OUTLOOK */}
      <div>
        <h2 className="text-2xl font-black text-textBrownDark mb-3">
          🌦️ {t('weather_title')} — {primaryDest.name}
        </h2>
        <WeatherCard weather={primaryDest.weather} />
      </div>

      {/* Section 5: TOP AI DESTINATION RECOMMENDATIONS */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-textBrownDark">
          🌟 {t('top_destinations_title')}
        </h2>

        {recommendations.map((dest, idx) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            rank={idx + 1}
          />
        ))}
      </div>

      {/* Section 6: PACKING SUGGESTIONS */}
      <PackingSuggestions items={primaryDest.packingSuggestions} />

      {/* Section 7: TRAVEL & LOGISTICS */}
      <TravelDetails travel={primaryDest.travelDetails} logistics={primaryDest.logistics} />

      {/* Section 8: AGE SUITABILITY */}
      <AgeSuitability ageInfo={primaryDest.ageSuitability} />

      {/* Section 9: AI ITINERARY CTA BANNER */}
      <div className="parchment-panel p-6 sm:p-8 text-center bg-gradient-to-r from-cream-100 via-amber-100 to-cream-200">
        <h3 className="text-2xl sm:text-3xl font-black text-textBrownDark mb-2">
          📅 {t('day_itinerary_title')}
        </h3>
        <p className="text-xs sm:text-sm text-textBrown/85 font-semibold max-w-lg mx-auto mb-5">
          View your complete hour-by-hour scheduled plan with optimal drive times, rest stops, and meal recommendations.
        </p>
        <Link
          to="/itinerary"
          className="btn-3d px-8 py-3.5 bg-tourOrange text-white text-base font-extrabold inline-flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          <span>{t('view_full_itinerary')}</span>
        </Link>
      </div>

      {/* Floating AI Tourism Chatbot */}
      <AIChatbot tripContext={tripData} />
    </div>
  );
};
