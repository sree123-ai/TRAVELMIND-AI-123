import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles, User, Mail, Phone, Lock, Globe } from 'lucide-react';

export const Signup = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Sreethu',
    email: 'sreethu@example.com',
    mobile: '9876543210',
    password: 'password123',
    confirmPassword: 'password123',
    preferredLanguage: currentLanguage // Auto-populated from Page 0!
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'preferredLanguage') {
      setLanguage(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    login({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      preferredLanguage: formData.preferredLanguage
    });

    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="parchment-panel max-w-lg w-full p-6 sm:p-8 animate-fade-in my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tourGold border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-tourOrange" />
            <span className="font-extrabold text-xs text-textBrown">TRAVELMIND AI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
            {t('signup_title')}
          </h2>
          <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
            {t('signup_subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-tourPink text-tourPink text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1">
              {t('full_name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-borderBrown absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-3d w-full pl-10 text-sm !py-2.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-borderBrown absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-3d w-full pl-10 text-sm !py-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1">
                {t('mobile_number')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-borderBrown absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-3d w-full pl-10 text-sm !py-2.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Preferred Language - Auto populated from Page 0! */}
          <div>
            <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-tourOrange" />
              <span>{t('preferred_language')} (Auto-selected from Page 0)</span>
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="input-3d w-full text-sm font-bold bg-cream-100 !py-2.5 cursor-pointer"
            >
              <option value="en">English (English)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ml">Malayalam (മലയാളം)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-borderBrown absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-3d w-full pl-10 text-sm !py-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1">
                {t('confirm_password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-borderBrown absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-3d w-full pl-10 text-sm !py-2.5"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-3d w-full py-3.5 bg-tourOrange text-white text-base font-extrabold flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t('register_btn')}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t-2 border-borderBrown/20 text-center">
          <p className="text-xs font-semibold text-textBrown">
            {t('already_have_account')}{' '}
            <Link to="/login" className="font-extrabold text-tourGreen hover:underline">
              {t('login_btn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
