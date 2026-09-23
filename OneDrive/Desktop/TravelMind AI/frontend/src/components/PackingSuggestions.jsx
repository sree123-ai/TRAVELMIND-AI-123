import React, { useState } from 'react';
import { CheckCircle2, Circle, Luggage, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PackingSuggestions = ({ items = [] }) => {
  const { t } = useLanguage();
  const [checked, setChecked] = useState({});

  const toggleCheck = (idx) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="parchment-panel p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Luggage className="w-6 h-6 text-tourOrange" />
        <h3 className="text-xl font-extrabold text-textBrownDark">
          🎒 {t('packing_suggestions_title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => toggleCheck(idx)}
            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
              checked[idx]
                ? 'bg-green-100/80 border-tourGreen text-green-900 shadow-[0_2px_0_#5A2B15]'
                : 'bg-cream-100 border-borderBrown text-textBrown hover:bg-cream-200 shadow-[0_2px_0_#5A2B15]'
            }`}
          >
            {checked[idx] ? (
              <CheckCircle2 className="w-5 h-5 text-tourGreen flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-borderBrown/50 flex-shrink-0" />
            )}
            <span className={`text-sm font-bold ${checked[idx] ? 'line-through opacity-70' : ''}`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Medication & Safety Notice */}
      <div className="mt-4 p-3 rounded-xl bg-amber-50 border-2 border-dashed border-borderBrown text-xs text-textBrown flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-tourOrange flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold">Health & Medication Note: </span>
          <span>Bring any personal medication as prescribed by your clinician. {t('medical_disclaimer')}</span>
        </div>
      </div>
    </div>
  );
};
