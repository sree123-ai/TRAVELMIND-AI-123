import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Compass, CheckCircle, CloudSun, MapPin, Layers } from 'lucide-react';

export const AIAnalysis = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { text: t('ai_status_1'), icon: '🧠' },
    { text: t('ai_status_2'), icon: '📍' },
    { text: t('ai_status_3'), icon: '🌦️' },
    { text: t('ai_status_4'), icon: '🚆' },
    { text: t('ai_status_5'), icon: '🎒' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/recommendations');
          }, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [navigate, stages.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="parchment-panel max-w-xl w-full p-8 sm:p-10 text-center animate-fade-in my-8">
        {/* Animated Tourism Compass / Radar */}
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-tourOrange animate-spin-slow" />
          <div className="w-24 h-24 rounded-full bg-white border-3 border-borderBrown shadow-[0_6px_0_#5A2B15] flex items-center justify-center text-4xl animate-bounce-gentle">
            {stages[currentStage].icon}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-textBrownDark tracking-tight">
          {t('ai_analyzing_title')}
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-borderBrown/20 rounded-full border-2 border-borderBrown overflow-hidden my-6 p-0.5">
          <div
            className="h-full bg-tourOrange rounded-full transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
          />
        </div>

        {/* Sequential Step Cards */}
        <div className="space-y-2.5 text-left max-w-md mx-auto">
          {stages.map((st, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                idx < currentStage
                  ? 'bg-green-100/90 border-tourGreen text-green-950 font-bold'
                  : idx === currentStage
                  ? 'bg-amber-100 border-tourOrange text-textBrown font-extrabold scale-102 shadow-[0_3px_0_#5A2B15]'
                  : 'bg-cream-100/60 border-borderBrown/30 text-textBrown/40'
              }`}
            >
              <span className="text-lg">{st.icon}</span>
              <span className="text-xs sm:text-sm flex-1">{st.text}</span>
              {idx < currentStage && <CheckCircle className="w-4 h-4 text-tourGreen" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
