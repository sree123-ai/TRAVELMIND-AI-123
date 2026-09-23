import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ImageGallery } from '../components/ImageGallery';
import { WeatherCard } from '../components/WeatherCard';
import { PackingSuggestions } from '../components/PackingSuggestions';
import { TravelDetails } from '../components/TravelDetails';
import { AgeSuitability } from '../components/AgeSuitability';
import { DestinationMap } from '../components/DestinationMap';
import { AIChatbot } from '../components/AIChatbot';
import { ArrowLeft, Ticket, ExternalLink, Sparkles, MapPin, Clock } from 'lucide-react';

export const DestinationDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  const storedRecommendations = JSON.parse(localStorage.getItem('travelmind_recommendations') || '[]');
  const destination = storedRecommendations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-lg font-black text-textBrownDark">
        This recommendation is no longer available. Please generate recommendations again.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Nav Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/recommendations"
          className="btn-3d px-4 py-2 bg-cream-100 text-textBrown font-bold text-xs sm:text-sm flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations</span>
        </Link>

      </div>

      {/* Large Image Gallery Experience */}
      <div className="parchment-panel p-5 sm:p-7">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <span className="text-xs font-bold text-tourOrange uppercase tracking-wider block">
              {destination.state} • {destination.district}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-textBrownDark">
              {destination.name}
            </h1>
            <p className="text-sm font-bold text-textBrown/80">{destination.tagline}</p>
          </div>
          <div className="bg-tourGold text-textBrown font-extrabold px-3 py-1.5 rounded-xl border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] text-sm">
            {destination.matchScore}% Match for You
          </div>
        </div>

        <ImageGallery images={destination.galleryImages} destinationName={destination.name} />
      </div>

      {/* Description & AI Reasoning */}
      <div className="parchment-panel p-5 sm:p-7">
        <h3 className="text-xl font-extrabold text-textBrownDark mb-2">About {destination.name}</h3>
        <p className="text-textBrown/90 text-sm sm:text-base leading-relaxed">
          {destination.description}
        </p>

        <div className="mt-4 p-4 rounded-xl bg-amber-100/70 border-2 border-dashed border-borderBrown text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-extrabold text-textBrown mb-1">
            <Sparkles className="w-4 h-4 text-tourOrange" />
            <span>Why TravelMind AI Recommends It:</span>
          </div>
          <p className="text-textBrown/90">{destination.aiReasoning}</p>
        </div>
      </div>

      {/* Top Attractions with Verified Fees & Booking */}
      <div className="parchment-panel p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="w-6 h-6 text-tourGreen" />
          <h3 className="text-xl font-extrabold text-textBrownDark">
            🏛️ Top Attractions & Verified Official Booking
          </h3>
        </div>

        <div className="space-y-3.5">
          {(destination.attractions || []).map((att, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-cream-100 border-2 border-borderBrown shadow-[0_3px_0_#5A2B15] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-base font-extrabold text-textBrownDark">{att.name}</h4>
                <p className="text-xs text-textBrown/80 font-medium mt-0.5">{att.description}</p>
                <div className="flex flex-wrap gap-3 text-xs font-bold text-textBrown mt-2">
                  <span className="bg-cream-200 px-2.5 py-0.5 rounded border border-borderBrown/40">
                    🎟️ {att.fee}
                  </span>
                  <span className="bg-cream-200 px-2.5 py-0.5 rounded border border-borderBrown/40 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-tourOrange" /> {att.timing}
                  </span>
                </div>
              </div>

              <div>
                <a
                  href={att.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d px-4 py-2 bg-tourOrange text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Official Booking</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Matrix */}
      <WeatherCard weather={destination.weather} />

      <div className="parchment-panel p-5 sm:p-7">
        <h3 className="text-xl font-extrabold text-textBrownDark mb-4">Map — {destination.name}</h3>
        <DestinationMap destination={destination} />
      </div>

      {/* Travel Routes & Logistics */}
      <TravelDetails travel={destination.travelDetails} logistics={destination.logistics} />

      <div className="parchment-panel p-5 sm:p-7">
        <h3 className="text-xl font-extrabold text-textBrownDark mb-4">Recommended Places</h3>
        {destination.recommendedPlaces?.length ? (
          <div className="space-y-3">
            {destination.recommendedPlaces.map((place) => (
              <div key={`${place.name}-${place.latitude}-${place.longitude}`} className="bg-cream-100 p-4 rounded-xl border border-borderBrown/40">
                <h4 className="font-extrabold text-textBrownDark">{place.name}</h4>
                <p className="text-xs text-textBrown/80">{place.category} · {place.city}, {place.state}, {place.country}</p>
                <p className="text-sm text-textBrown/90 mt-1">{place.description}</p>
                <p className="text-[11px] text-textBrown/70 mt-1">Coordinates: {place.latitude}, {place.longitude}</p>
                {place.sourceUrl && <a className="text-xs font-bold text-tourOrange" href={place.sourceUrl} target="_blank" rel="noreferrer">View source</a>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-textBrown/80">No verified nearby places were returned by the geospatial provider.</p>
        )}
      </div>

      {/* Age Suitability */}
      <AgeSuitability ageInfo={destination.ageSuitability} />

      {/* Packing Suggestions */}
      <PackingSuggestions items={destination.packingSuggestions} />

      {/* Chatbot */}
      <AIChatbot tripContext={{ destination: destination.name }} />
    </div>
  );
};
