import React from 'react';
import { Compass, Plane, Train, Bus, Car } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const formatFacility = (item, legacyValue, fallback) => {
  if (item?.available && item.name) {
    const distance = item.distanceKm != null ? ` - ~${item.distanceKm} km` : '';
    return `${item.name}${distance}`;
  }
  if (item?.reason) return fallback;
  return legacyValue && !legacyValue.toLowerCase().includes('information temporarily unavailable')
    ? legacyValue
    : fallback;
};

export const TravelDetails = ({ travel, logistics }) => {
  const { t } = useLanguage();
  const unavailable = 'Information temporarily unavailable';
  const details = travel || {};
  const transport = logistics || {};

  return (
    <div className="parchment-panel p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-6 h-6 text-tourBlue" />
        <h3 className="text-xl font-extrabold text-textBrownDark">
          🧭 {t('travel_details_title')}
        </h3>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-start gap-3 bg-cream-100 p-3 rounded-xl border border-borderBrown/40">
          <Plane className="w-5 h-5 text-tourBlue flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-textBrown">Nearest Airport: </span>
            <span className="font-medium text-textBrown/90">{formatFacility(transport.airport, details.nearestAirport, unavailable)}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cream-100 p-3 rounded-xl border border-borderBrown/40">
          <Train className="w-5 h-5 text-tourGreen flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-textBrown">Nearest Railway Station: </span>
            <span className="font-medium text-textBrown/90">{formatFacility(transport.railway, details.nearestRailway, unavailable)}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cream-100 p-3 rounded-xl border border-borderBrown/40">
          <Bus className="w-5 h-5 text-tourOrange flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-textBrown">Bus Connectivity: </span>
            <span className="font-medium text-textBrown/90">{formatFacility(transport.bus, details.busConnectivity, unavailable)}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cream-100 p-3 rounded-xl border border-borderBrown/40">
          <Car className="w-5 h-5 text-tourPurple flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-textBrown">Best Driving Route & Local Cabs: </span>
            <span className="font-medium text-textBrown/90">
              {transport.driving?.available
                ? `${transport.driving.distanceKm} km driving route, approximately ${transport.driving.durationMinutes} minutes`
                : details.bestRoute || transport.driving?.reason || unavailable}
              `. ${formatFacility(transport.localTransport, details.localTransport, unavailable)}`
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
