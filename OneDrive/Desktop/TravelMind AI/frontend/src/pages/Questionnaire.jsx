import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { OptionButton } from '../components/OptionButton';
import { submitQuestionnaire } from '../services/api';
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, Plus, Trash2 } from 'lucide-react';

export const Questionnaire = () => {
  const { t, currentLanguage } = useLanguage();
  const { saveTripData } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 12;

  // Comprehensive Trip Form State
  const [formData, setFormData] = useState({
    // Step 1: Destination
    state: 'Kerala',
    district: 'Idukki / Munnar',
    hasSpecificPlace: 'AI Can Suggest',
    customDestination: '',

    // Step 2: Travellers & Ages
    adultsCount: 2,
    childrenCount: 1,
    seniorsCount: 0,
    travellers: [
      { id: 1, type: 'Adult', age: 28 },
      { id: 2, type: 'Adult', age: 26 },
      { id: 3, type: 'Child', age: 7 }
    ],

    // Step 3: Budget
    budget: '₹10,000 – ₹25,000',
    customBudget: '',

    // Step 4: Purpose
    purpose: '🏖️ Relaxation',

    // Step 5: Preferences (Multi-select)
    preferences: ['Mountains', 'Waterfalls', 'Nature'],

    // Step 6: Allergies & Health
    hasAllergy: 'No Allergy',
    allergyType: [],

    // Step 7: Climate
    climate: 'Cool (15°C – 22°C)',

    // Step 8: Duration
    duration: '3–5 Days (Short Break)',

    // Step 9: Transportation
    transportation: '🚆 Train',

    // Step 10: Accommodation
    accommodation: 'Standard 3-Star Hotels',

    // Step 11: Food
    food: 'Pure Vegetarian',

    // Step 12: Additional Wish
    additionalNotes: 'We want a peaceful and scenic vacation with gentle walking trails for the child.'
  });

  // Step 2 Traveller Age Handlers
  const handleUpdateAge = (id, newAge) => {
    setFormData((prev) => ({
      ...prev,
      travellers: prev.travellers.map((tr) => (tr.id === id ? { ...tr, age: Number(newAge) } : tr))
    }));
  };

  const handleAddTraveller = (type) => {
    const newId = formData.travellers.length + 1;
    const defaultAge = type === 'Child' ? 8 : type === 'Senior' ? 65 : 25;
    setFormData((prev) => ({
      ...prev,
      travellers: [...prev.travellers, { id: newId, type, age: defaultAge }]
    }));
  };

  const handleRemoveTraveller = (id) => {
    if (formData.travellers.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      travellers: prev.travellers.filter((tr) => tr.id !== id)
    }));
  };

  // Step 5 Multi-select Preference Toggle
  const togglePreference = (pref) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists ? prev.preferences.filter((p) => p !== pref) : [...prev.preferences, pref]
      };
    });
  };

  // Step 6 Multi-select Allergy Toggle
  const toggleAllergyType = (type) => {
    setFormData((prev) => {
      const exists = prev.allergyType.includes(type);
      return {
        ...prev,
        allergyType: exists ? prev.allergyType.filter((a) => a !== type) : [...prev.allergyType, type]
      };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    saveTripData(formData);
    await submitQuestionnaire(formData);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center">
      {/* Centered Cream Parchment Panel */}
      <div className="parchment-panel max-w-4xl w-full p-6 sm:p-10 my-4 flex flex-col justify-between min-h-[600px] animate-fade-in">
        {/* Top Header Badge & Stepper */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-borderBrown/20 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-borderBrown shadow-[0_3px_0_#5A2B15] flex items-center justify-center p-1">
                <img src="/assets/sih_logo.png" alt="TravelMind" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-black text-lg text-textBrownDark tracking-wide">
                  TRAVELMIND <span className="text-tourOrange">AI</span>
                </h2>
                <span className="text-[10px] uppercase font-bold text-tourGreen tracking-widest">
                  AI Tourism Engine
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-tourOrange uppercase">
                {t('step')} {step} {t('of')} {totalSteps}
              </span>
            </div>
          </div>

          <ProgressStepper currentStep={step} totalSteps={totalSteps} />
        </div>

        {/* Dynamic Question Body */}
        <div className="my-6">
          {/* STEP 1: DESTINATION */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q1_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q1_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1.5">
                    {t('state_label')}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-3d w-full"
                    placeholder="e.g. Kerala, Tamil Nadu, Karnataka"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-1.5">
                    {t('district_label')}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="input-3d w-full"
                    placeholder="e.g. Idukki, Wayanad, Nilgiris"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-extrabold text-textBrown uppercase tracking-wider mb-2">
                  {t('specific_place_q')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Yes', 'No', 'AI Can Suggest'].map((opt, i) => (
                    <OptionButton
                      key={opt}
                      label={opt === 'AI Can Suggest' ? t('opt_ai_suggest') : opt === 'Yes' ? t('opt_yes') : t('opt_no')}
                      color={i === 2 ? 'gold' : i === 0 ? 'orange' : 'cream'}
                      isSelected={formData.hasSpecificPlace === opt}
                      onClick={() => setFormData({ ...formData, hasSpecificPlace: opt })}
                    />
                  ))}
                </div>
              </div>

              {formData.hasSpecificPlace === 'AI Can Suggest' && (
                <div className="p-4 rounded-2xl bg-amber-100/80 border-2 border-dashed border-borderBrown text-center mt-3">
                  <p className="text-xs sm:text-sm font-bold text-textBrown mb-2">
                    🌟 TravelMind AI will analyze weather, crowds, and safety to find the top 3 optimal destinations for your group.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, hasSpecificPlace: 'AI Can Suggest', customDestination: '' });
                    }}
                    className="btn-3d px-5 py-2 bg-tourGold text-textBrown text-xs sm:text-sm font-extrabold !rounded-xl"
                  >
                    {t('let_ai_suggest_btn')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TRAVEL GROUP & INDIVIDUAL AGES */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q2_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q2_desc')}
                </p>
              </div>

              {/* Quick Group Add Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleAddTraveller('Adult')}
                  className="btn-3d p-3 bg-tourGreen text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> 👨 + Adult
                </button>
                <button
                  type="button"
                  onClick={() => handleAddTraveller('Child')}
                  className="btn-3d p-3 bg-tourOrange text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> 👧 + Child
                </button>
                <button
                  type="button"
                  onClick={() => handleAddTraveller('Senior')}
                  className="btn-3d p-3 bg-tourPurple text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> 👴 + Senior
                </button>
              </div>

              {/* Individual Ages List */}
              <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2">
                {formData.travellers.map((tr, index) => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-2xl bg-cream-100 border-2 border-borderBrown shadow-[0_3px_0_#5A2B15] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {tr.type === 'Child' ? '👧' : tr.type === 'Senior' ? '👴' : '👨'}
                      </span>
                      <div>
                        <span className="font-extrabold text-sm text-textBrown">
                          {t('traveller')} {index + 1} ({tr.type})
                        </span>
                        <p className="text-[11px] text-textBrown/70 font-semibold">
                          Age determines activity safety & permit eligibility
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs font-extrabold text-textBrown">{t('age_label')}:</label>
                        <input
                          type="number"
                          min="1"
                          max="110"
                          value={tr.age}
                          onChange={(e) => handleUpdateAge(tr.id, e.target.value)}
                          className="input-3d w-20 text-center font-bold text-sm !py-1"
                        />
                      </div>
                      {formData.travellers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTraveller(tr.id)}
                          className="p-1.5 text-tourPink hover:scale-110 transition-transform"
                          title="Remove Traveller"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q3_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q3_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { label: t('budget_below_5k'), val: 'Below ₹5,000', color: 'orange' },
                  { label: t('budget_5k_10k'), val: '₹5,000 – ₹10,000', color: 'green' },
                  { label: t('budget_10k_25k'), val: '₹10,000 – ₹25,000', color: 'blue' },
                  { label: t('budget_25k_50k'), val: '₹25,000 – ₹50,000', color: 'purple' },
                  { label: t('budget_50k_plus'), val: '₹50,000+', color: 'pink' },
                  { label: t('budget_custom'), val: 'Custom', color: 'cyan' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={item.label}
                    color={item.color}
                    isSelected={formData.budget === item.val}
                    onClick={() => setFormData({ ...formData, budget: item.val })}
                  />
                ))}
              </div>

              {formData.budget === 'Custom' && (
                <div className="mt-3">
                  <label className="block text-xs font-bold text-textBrown mb-1">
                    Enter Exact Amount per Person (₹):
                  </label>
                  <input
                    type="number"
                    value={formData.customBudget}
                    onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                    placeholder="e.g. 18500"
                    className="input-3d w-full max-w-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PURPOSE OF TRIP */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q4_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q4_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'purpose_relaxation', color: 'orange' },
                  { key: 'purpose_adventure', color: 'green' },
                  { key: 'purpose_spiritual', color: 'gold' },
                  { key: 'purpose_historical', color: 'blue' },
                  { key: 'purpose_nature', color: 'cyan' },
                  { key: 'purpose_family', color: 'purple' },
                  { key: 'purpose_romantic', color: 'pink' },
                  { key: 'purpose_photography', color: 'orange' },
                  { key: 'purpose_food', color: 'green' },
                  { key: 'purpose_shopping', color: 'gold' },
                  { key: 'purpose_entertainment', color: 'blue' },
                  { key: 'purpose_other', color: 'cyan' }
                ].map((item) => (
                  <OptionButton
                    key={item.key}
                    label={t(item.key)}
                    color={item.color}
                    isSelected={formData.purpose === t(item.key)}
                    onClick={() => setFormData({ ...formData, purpose: t(item.key) })}
                    className="!p-3 text-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: TRAVEL PREFERENCES (MULTI-SELECT) */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q5_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q5_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { key: 'pref_beaches', icon: '🏖️', val: 'Beaches', color: 'blue' },
                  { key: 'pref_mountains', icon: '⛰️', val: 'Mountains', color: 'green' },
                  { key: 'pref_waterfalls', icon: '🌊', val: 'Waterfalls', color: 'cyan' },
                  { key: 'pref_wildlife', icon: '🐘', val: 'Wildlife', color: 'orange' },
                  { key: 'pref_historical', icon: '🏰', val: 'Historical Places', color: 'purple' },
                  { key: 'pref_temples', icon: '🛕', val: 'Temples', color: 'gold' },
                  { key: 'pref_museums', icon: '🏛️', val: 'Museums', color: 'pink' },
                  { key: 'pref_adventure', icon: '🧗', val: 'Adventure Spots', color: 'green' },
                  { key: 'pref_nature', icon: '🌿', val: 'Nature', color: 'cyan' },
                  { key: 'pref_city', icon: '🏙️', val: 'City Attractions', color: 'orange' }
                ].map((item) => {
                  const isChecked = formData.preferences.includes(item.val);
                  return (
                    <OptionButton
                      key={item.val}
                      label={t(item.key)}
                      icon={item.icon}
                      color={item.color}
                      isSelected={isChecked}
                      onClick={() => togglePreference(item.val)}
                      className="!p-3 text-xs sm:text-sm"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: HEALTH / ALLERGIES */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q6_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q6_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <OptionButton
                  label={t('allergy_no')}
                  color="green"
                  isSelected={formData.hasAllergy === 'No Allergy'}
                  onClick={() => setFormData({ ...formData, hasAllergy: 'No Allergy', allergyType: [] })}
                />
                <OptionButton
                  label={t('allergy_yes')}
                  color="pink"
                  isSelected={formData.hasAllergy === 'Yes'}
                  onClick={() => setFormData({ ...formData, hasAllergy: 'Yes' })}
                />
              </div>

              {formData.hasAllergy === 'Yes' && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-extrabold text-textBrown uppercase">
                    Select Allergy Categories (Multi-select):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: 'allergy_food', val: 'Food Allergy' },
                      { key: 'allergy_dust', val: 'Dust Allergy' },
                      { key: 'allergy_pollen', val: 'Pollen Allergy' },
                      { key: 'allergy_insect', val: 'Insect Allergy' },
                      { key: 'allergy_medication', val: 'Medication Allergy' },
                      { key: 'allergy_skin', val: 'Skin Allergy' },
                      { key: 'allergy_other', val: 'Other' }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => toggleAllergyType(item.val)}
                        className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                          formData.allergyType.includes(item.val)
                            ? 'bg-tourPink text-white border-borderBrown shadow-[0_3px_0_#5A2B15]'
                            : 'bg-cream-100 text-textBrown border-borderBrown/60 hover:bg-cream-200'
                        }`}
                      >
                        <span>{t(item.key)}</span>
                        {formData.allergyType.includes(item.val) && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crucial Medical Disclaimer */}
              <div className="p-3.5 bg-amber-50 border-2 border-dashed border-borderBrown rounded-xl text-xs text-textBrown flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-tourOrange flex-shrink-0 mt-0.5" />
                <p className="font-semibold">
                  ⚠️ <span className="font-extrabold">{t('medical_disclaimer')}</span> We use your inputs exclusively to filter out high-pollen flower trails, dusty unpaved safaris, or allergen-heavy local food establishments.
                </p>
              </div>
            </div>
          )}

          {/* STEP 7: CLIMATE */}
          {step === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q7_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q7_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {[
                  { key: 'climate_cold', icon: '❄️', val: 'Cold', color: 'blue' },
                  { key: 'climate_cool', icon: '🍃', val: 'Cool', color: 'cyan' },
                  { key: 'climate_moderate', icon: '🌤️', val: 'Moderate', color: 'green' },
                  { key: 'climate_warm', icon: '☀️', val: 'Warm', color: 'orange' },
                  { key: 'climate_no_pref', icon: '🌈', val: 'No Preference', color: 'gold' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={t(item.key)}
                    icon={item.icon}
                    color={item.color}
                    isSelected={formData.climate === item.val}
                    onClick={() => setFormData({ ...formData, climate: item.val })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: DURATION */}
          {step === 8 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q8_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q8_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {[
                  { key: 'duration_1_2', val: '1–2 Days', color: 'orange' },
                  { key: 'duration_3_5', val: '3–5 Days', color: 'green' },
                  { key: 'duration_6_7', val: '6–7 Days', color: 'blue' },
                  { key: 'duration_1_2_weeks', val: '1–2 Weeks', color: 'purple' },
                  { key: 'duration_custom', val: 'Custom', color: 'gold' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={t(item.key)}
                    color={item.color}
                    isSelected={formData.duration === item.val}
                    onClick={() => setFormData({ ...formData, duration: item.val })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: TRANSPORTATION */}
          {step === 9 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q9_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q9_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { key: 'trans_train', val: 'Train', color: 'green' },
                  { key: 'trans_bus', val: 'Bus', color: 'orange' },
                  { key: 'trans_flight', val: 'Flight', color: 'blue' },
                  { key: 'trans_car', val: 'Car', color: 'purple' },
                  { key: 'trans_bike', val: 'Bike', color: 'pink' },
                  { key: 'trans_no_pref', val: 'No Preference', color: 'cyan' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={t(item.key)}
                    color={item.color}
                    isSelected={formData.transportation === item.val}
                    onClick={() => setFormData({ ...formData, transportation: item.val })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: ACCOMMODATION */}
          {step === 10 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q10_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q10_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {[
                  { key: 'acc_budget', val: 'Budget', color: 'orange' },
                  { key: 'acc_standard', val: 'Standard', color: 'green' },
                  { key: 'acc_premium', val: 'Premium', color: 'blue' },
                  { key: 'acc_luxury', val: 'Luxury', color: 'purple' },
                  { key: 'acc_homestay', val: 'Homestay', color: 'gold' },
                  { key: 'acc_no_pref', val: 'No Preference', color: 'cyan' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={t(item.key)}
                    color={item.color}
                    isSelected={formData.accommodation === item.val}
                    onClick={() => setFormData({ ...formData, accommodation: item.val })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 11: FOOD */}
          {step === 11 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q11_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q11_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { key: 'food_veg', icon: '🥗', val: 'Vegetarian', color: 'green' },
                  { key: 'food_nonveg', icon: '🍗', val: 'Non-Vegetarian', color: 'orange' },
                  { key: 'food_vegan', icon: '🥑', val: 'Vegan', color: 'cyan' },
                  { key: 'food_jain', icon: '🍲', val: 'Jain', color: 'gold' },
                  { key: 'food_no_pref', icon: '🍽️', val: 'No Preference', color: 'purple' }
                ].map((item) => (
                  <OptionButton
                    key={item.val}
                    label={t(item.key)}
                    icon={item.icon}
                    color={item.color}
                    isSelected={formData.food === item.val}
                    onClick={() => setFormData({ ...formData, food: item.val })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 12: FINAL WISHES & GENERATION */}
          {step === 12 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-textBrownDark">
                  {t('q12_title')}
                </h3>
                <p className="text-xs sm:text-sm text-textBrown/75 font-semibold mt-1">
                  {t('q12_desc')}
                </p>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder={t('q12_placeholder')}
                  className="input-3d w-full text-sm sm:text-base leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-100/90 border-2 border-borderBrown shadow-[0_4px_0_#5A2B15]">
                <h4 className="font-extrabold text-sm text-textBrownDark mb-1">
                  Ready to compute optimal travel plan!
                </h4>
                <p className="text-xs text-textBrown/80 font-semibold">
                  Click below to trigger our AI Reasoning, constraint solver, live weather synchronization, and day-by-day scheduler.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 border-t-2 border-borderBrown/20 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrev}
            className="btn-3d px-6 py-3 bg-cream-200 text-textBrown text-sm sm:text-base font-extrabold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back')}</span>
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-3d px-8 py-3 bg-tourOrange text-white text-sm sm:text-base font-extrabold flex items-center gap-2"
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="btn-3d px-8 py-4 bg-tourGold text-textBrown text-base sm:text-lg font-black flex items-center gap-2.5 animate-glow"
            >
              <Sparkles className="w-5 h-5 text-tourOrange fill-tourOrange" />
              <span>{t('finish')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
