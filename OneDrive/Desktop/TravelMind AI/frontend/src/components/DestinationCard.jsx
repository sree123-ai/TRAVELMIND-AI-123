import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, IndianRupee, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DestinationMap } from './DestinationMap';

export const DestinationCard = ({ destination, rank = 1 }) => {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState(destination.heroImage);
  const [galleryImages, setGalleryImages] = useState(destination.galleryImages || [destination.heroImage]);
  const medals = ["🥇", "🥈", "🥉"];
  const medal = medals[rank - 1] || "✨";

  return (
    <div className="parchment-panel p-5 sm:p-7 flex flex-col lg:flex-row gap-6 items-stretch transition-transform hover:-translate-y-1">
      {/* Hero Thumbnail / Gallery Preview */}
      <div className="lg:w-2/5 flex flex-col">
        <div className="relative rounded-2xl overflow-hidden border-3 border-borderBrown shadow-[0_5px_0_#5A2B15] h-60 sm:h-72 w-full group">
          <img
            src={heroImage}
            alt={destination.name}
            onError={() => setHeroImage(destination.fallbackImage || '/assets/tourism_bg.jpg')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-tourGold text-textBrown font-extrabold text-sm px-3 py-1 rounded-full border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] flex items-center gap-1">
            <span>{medal}</span>
            <span>{destination.category}</span>
          </div>

          <div className="absolute top-3 right-3 bg-tourGreen text-white font-extrabold text-xs px-2.5 py-1 rounded-full border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{destination.matchScore}% AI Match</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs flex justify-between items-center">
            <span className="flex items-center gap-1 font-bold">
              <Star className="w-4 h-4 text-tourGold fill-tourGold" /> {destination.rating} ({destination.reviewsCount}+ reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-tourOrange" /> {destination.state}
            </span>
          </div>
        </div>

        {/* Mini Thumbnails */}
        {galleryImages && galleryImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="h-14 rounded-xl overflow-hidden border-2 border-borderBrown shadow-[0_2px_0_#5A2B15]"
              >
                <img
                  src={img}
                  alt={`${destination.name} thumbnail ${idx + 1}`}
                  onError={() => setGalleryImages([destination.fallbackImage || '/assets/tourism_bg.jpg'])}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <DestinationMap destination={destination} />
        </div>
      </div>

      {/* Destination Meta & Content */}
      <div className="lg:w-3/5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                {destination.name}
              </h3>
              <p className="text-tourOrange font-bold text-sm">{destination.tagline}</p>
            </div>
            <div className="bg-cream-200 border-2 border-borderBrown rounded-xl px-3 py-1 font-bold text-sm text-textBrown shadow-[0_2px_0_#5A2B15] flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-tourGreen" />
              <span>{destination.estimatedCost}</span>
            </div>
          </div>

          <p className="text-textBrown/85 text-sm sm:text-base mt-3 leading-relaxed">
            {destination.description}
          </p>

          {/* AI Reasoning Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-100/70 border-2 border-dashed border-borderBrown text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-extrabold text-textBrown mb-1">
              <Sparkles className="w-4 h-4 text-tourOrange" />
              <span>Why AI Recommends It:</span>
            </div>
            <p className="text-textBrown/90 italic">{destination.aiReasoning}</p>
          </div>

          {/* Highlights & Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-xs font-bold px-3 py-1 bg-tourBlue/20 text-tourBlue border border-tourBlue/40 rounded-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {destination.travelTime}
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-tourGreen/20 text-green-700 border border-tourGreen/40 rounded-lg">
              🌤️ {destination.climate}
            </div>
            {destination.bestFor && destination.bestFor.map((item, i) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-cream-200 border border-borderBrown/30 rounded-lg text-textBrown">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t-2 border-borderBrown/20 flex flex-wrap items-center gap-3">
          <Link
            to={`/destination/${destination.id}`}
            className="btn-3d px-5 py-2.5 bg-tourOrange text-white text-sm sm:text-base font-bold flex-1 sm:flex-none"
          >
            {t('view_details')}
          </Link>

        </div>
      </div>
    </div>
  );
};
