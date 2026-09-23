import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, Sparkles } from 'lucide-react';

export const Login = () => {
  const { t, currentLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('traveller@travelmind.ai');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide your email/mobile and password');
      return;
    }
    // Simulate login
    login({
      name: identifier.split('@')[0] || "Explorer",
      email: identifier,
      preferredLanguage: currentLanguage
    });
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="parchment-panel max-w-md w-full p-6 sm:p-8 animate-fade-in my-8">
        {/* Title Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tourGold border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-tourOrange" />
            <span className="font-extrabold text-xs text-textBrown">TRAVELMIND AI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
            {t('login_title')}
          </h2>
          <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
            {t('login_subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-tourPink text-tourPink text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1.5">
              {t('email_or_mobile')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-borderBrown absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@domain.com or 9876543210"
                className="input-3d w-full pl-11 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-borderBrown absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-3d w-full pl-11 text-sm"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert("Password reset link sent to demo account.")}
              className="text-xs font-bold text-tourOrange hover:underline"
            >
              {t('forgot_password')}
            </button>
          </div>

          <button
            type="submit"
            className="btn-3d w-full py-3.5 bg-tourGreen text-white text-base font-extrabold flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-5 h-5" />
            <span>{t('login_btn')}</span>
          </button>
        </form>

        {/* Switch to Sign Up */}
        <div className="mt-6 pt-4 border-t-2 border-borderBrown/20 text-center">
          <p className="text-xs font-semibold text-textBrown">
            {t('no_account')}{' '}
            <Link to="/signup" className="font-extrabold text-tourOrange hover:underline">
              {t('register_btn')}
            </Link>
          </p>

          <Link
            to="/questionnaire"
            className="btn-3d w-full py-2.5 bg-tourGold text-textBrown text-xs sm:text-sm font-extrabold mt-3 flex items-center justify-center gap-1.5"
          >
            <span>Continue as Guest Traveller</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
