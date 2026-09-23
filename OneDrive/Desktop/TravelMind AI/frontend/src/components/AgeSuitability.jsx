import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AgeSuitability = ({ ageInfo }) => {
  const { t } = useLanguage();
  if (!ageInfo) return null;

  return (
    <div className="parchment-panel p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-tourGreen" />
        <h3 className="text-xl font-extrabold text-textBrownDark">
          👥 {t('age_suitability_title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-cream-100 p-4 rounded-xl border-2 border-borderBrown shadow-[0_3px_0_#5A2B15]">
          <span className="text-lg">👧</span>
          <h4 className="font-extrabold text-sm text-textBrown mt-1">Children</h4>
          <p className="text-xs text-textBrown/85 mt-1 font-semibold">{ageInfo.children}</p>
        </div>

        <div className="bg-cream-100 p-4 rounded-xl border-2 border-borderBrown shadow-[0_3px_0_#5A2B15]">
          <span className="text-lg">👨</span>
          <h4 className="font-extrabold text-sm text-textBrown mt-1">Adults</h4>
          <p className="text-xs text-textBrown/85 mt-1 font-semibold">{ageInfo.adults}</p>
        </div>

        <div className="bg-cream-100 p-4 rounded-xl border-2 border-borderBrown shadow-[0_3px_0_#5A2B15]">
          <span className="text-lg">👴</span>
          <h4 className="font-extrabold text-sm text-textBrown mt-1">Senior Citizens</h4>
          <p className="text-xs text-textBrown/85 mt-1 font-semibold">{ageInfo.seniors}</p>
        </div>
      </div>

      {ageInfo.cautions && (
        <div className="mt-4 p-3 bg-red-50 border-2 border-tourPink/50 rounded-xl text-xs text-textBrown flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-tourPink flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-tourPink">Caution for Travellers: </span>
            <span className="font-semibold">{ageInfo.cautions}</span>
          </div>
        </div>
      )}
    </div>
  );
};
