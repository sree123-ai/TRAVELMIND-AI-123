import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, MapPin, Compass } from 'lucide-react';

export const LanguageSelection = () => {
  const { setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const languageOptions = [
    { code: 'en', name: 'English', native: 'English', color: 'orange', flag: '🌍', greeting: 'Welcome to your AI Travel Journey' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', color: 'green', flag: '🛕', greeting: 'உங்கள் பயணத்தை இப்போதே தொடங்குங்கள்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', color: 'blue', flag: '🇮🇳', greeting: 'अपनी पसंदीदा यात्रा की योजना बनाएं' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', color: 'purple', flag: '🌿', greeting: 'మీ కలల ప్రయాణాన్ని ప్రారంభించండి' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', color: 'pink', flag: '🌴', greeting: 'നിങ്ങളുടെ സ്വപ്നയാത്ര ഇവിടെ തുടങ്ങുന്നു' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', color: 'cyan', flag: '🏰', greeting: 'ನಿಮ್ಮ ಕನಸಿನ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ' }
  ];

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="parchment-panel max-w-2xl w-full p-6 sm:p-10 text-center animate-fade-in my-8">
        {/* App Emblem */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-3xl bg-white border-3 border-borderBrown shadow-[0_5px_0_#5A2B15] flex items-center justify-center p-2">
            <img src="/assets/sih_logo.png" alt="TravelMind AI" className="w-full h-full object-contain" />
          </div>
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-tourGold text-textBrown border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] inline-block mb-3">
          Smart India Hackathon 2026
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-textBrownDark tracking-tight">
          TRAVELMIND <span className="text-tourOrange">AI</span>
        </h1>

        <p className="text-base sm:text-lg font-extrabold text-tourOrange mt-2">
          {t('choose_language')}
        </p>
        <p className="text-xs sm:text-sm text-textBrown/80 font-semibold max-w-md mx-auto mt-1 mb-8">
          {t('select_language_desc')}
        </p>

        {/* 6 Large Colorful 3D Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {languageOptions.map((lang) => {
            const colorClass = {
              orange: 'bg-tourOrange text-white hover:bg-[#e07b15]',
              green: 'bg-tourGreen text-white hover:bg-[#6cb122]',
              blue: 'bg-tourBlue text-white hover:bg-[#3497c7]',
              purple: 'bg-tourPurple text-white hover:bg-[#9637bc]',
              pink: 'bg-tourPink text-white hover:bg-[#d63573]',
              cyan: 'bg-tourCyan text-white hover:bg-[#259f9f]'
            }[lang.color];

            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`btn-3d p-4 rounded-2xl flex items-center justify-between transition-all group ${colorClass}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl bg-white/20 p-2 rounded-xl border border-white/30">
                    {lang.flag}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg leading-tight">{lang.native}</h3>
                    <p className="text-xs font-semibold opacity-90">{lang.name}</p>
                    <p className="text-[10px] opacity-80 mt-0.5">{lang.greeting}</p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 opacity-75 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              </button>
            );
          })}
        </div>

        {/* Direct Skip to Plan */}
        <div className="mt-8 pt-6 border-t-2 border-borderBrown/20 flex justify-center">
          <button
            onClick={() => navigate('/questionnaire')}
            className="text-xs sm:text-sm font-bold text-textBrown hover:text-tourOrange flex items-center gap-1.5 transition-colors"
          >
            <span>Skip directly to Travel Questionnaire</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
