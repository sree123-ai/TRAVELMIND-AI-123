import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WeatherCard = ({ weather }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  if (!weather || !weather.temperature) {
    return (
      <div className="parchment-panel p-5 text-center text-textBrown">
        <p className="font-bold">⚠️ Weather temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="parchment-panel p-5 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-tourBlue/20 border-2 border-borderBrown flex items-center justify-center text-3xl shadow-[0_3px_0_#5A2B15]">
            {weather.icon || '🌤️'}
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-textBrownDark flex items-center gap-2">
              <span>{weather.temperature}</span>
              <span className="text-sm font-normal text-textBrown/80">({weather.condition})</span>
            </h4>
            <div className="flex items-center gap-4 text-xs font-bold text-textBrown mt-1">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-tourBlue" /> Humidity: {weather.humidity}
              </span>
              <span className="flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-tourCyan" /> Rain: {weather.rainProbability}
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-tourGreen" /> Wind: {weather.windSpeed}
              </span>
            </div>
          </div>
        </div>

        {weather.periods && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-3d px-3.5 py-1.5 bg-tourGold text-textBrown text-xs font-bold flex items-center gap-1 !rounded-xl"
          >
            <span>{expanded ? "Hide Details" : "🌦️ WEATHER DETAILS"}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expandable 4-Period Weather Matrix */}
      {expanded && weather.periods && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t-2 border-borderBrown/20">
          <div className="bg-cream-200/80 p-3 rounded-xl border border-borderBrown/30 text-center">
            <span className="text-xs font-extrabold text-tourOrange uppercase block">🌅 Morning</span>
            <p className="text-xs font-semibold text-textBrown mt-1">{weather.periods.morning}</p>
          </div>
          <div className="bg-cream-200/80 p-3 rounded-xl border border-borderBrown/30 text-center">
            <span className="text-xs font-extrabold text-tourGreen uppercase block">☀️ Afternoon</span>
            <p className="text-xs font-semibold text-textBrown mt-1">{weather.periods.afternoon}</p>
          </div>
          <div className="bg-cream-200/80 p-3 rounded-xl border border-borderBrown/30 text-center">
            <span className="text-xs font-extrabold text-tourPink uppercase block">🌇 Evening</span>
            <p className="text-xs font-semibold text-textBrown mt-1">{weather.periods.evening}</p>
          </div>
          <div className="bg-cream-200/80 p-3 rounded-xl border border-borderBrown/30 text-center">
            <span className="text-xs font-extrabold text-tourPurple uppercase block">🌙 Night</span>
            <p className="text-xs font-semibold text-textBrown mt-1">{weather.periods.night}</p>
          </div>
        </div>
      )}
    </div>
  );
};
