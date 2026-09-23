import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, Compass, User, LogOut, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langNames = {
    en: "English",
    ta: "தமிழ்",
    hi: "हिन्दी",
    te: "తెలుగు",
    ml: "മലയാളം",
    kn: "ಕನ್ನಡ"
  };

  return (
    <header className="sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between parchment-panel px-5 py-3 !border-2 !shadow-[0_6px_0_rgba(90,43,21,0.35)]">
        {/* Logo Badge */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-borderBrown shadow-[0_3px_0_#5A2B15] flex items-center justify-center overflow-hidden p-1 group-hover:scale-105 transition-transform">
            <img src="/assets/sih_logo.png" alt="TravelMind AI" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wide text-textBrownDark flex items-center gap-1">
                TRAVELMIND <span className="text-tourOrange">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-tourGreen text-white border border-borderBrown shadow-[0_2px_0_#5A2B15]">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-textBrown/75 font-semibold hidden sm:block">
              {t('app_tagline')}
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="btn-3d px-3 py-1.5 bg-tourGold text-textBrown text-xs sm:text-sm font-bold flex items-center gap-2 !rounded-xl !shadow-[0_4px_0_#5A2B15]"
              title={t('choose_language')}
            >
              <Globe className="w-4 h-4 text-borderBrown" />
              <span>{langNames[currentLanguage] || "English"}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 parchment-panel-solid p-2 z-50 animate-bounce-gentle !border-2 !shadow-[0_8px_0_#5A2B15]">
                {Object.entries(langNames).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-between my-0.5 ${
                      currentLanguage === code
                        ? 'bg-tourOrange text-white shadow-[0_2px_0_#5A2B15]'
                        : 'text-textBrown hover:bg-cream-200'
                    }`}
                  >
                    <span>{name}</span>
                    {currentLanguage === code && <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block font-bold text-sm text-textBrown bg-cream-200 px-3 py-1 rounded-xl border border-borderBrown">
                👋 {user.name || "Explorer"}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-3d px-3 py-1.5 bg-tourPink text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 !rounded-xl !shadow-[0_4px_0_#5A2B15]"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-3d px-3.5 py-1.5 bg-tourGreen text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 !rounded-xl !shadow-[0_4px_0_#5A2B15]"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('login_btn')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
