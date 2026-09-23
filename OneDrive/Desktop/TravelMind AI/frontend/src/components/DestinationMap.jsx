import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const destinationMarker = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const DestinationMap = ({ destination }) => {
  const latitude = Number(destination?.map?.latitude ?? destination?.latitude);
  const longitude = Number(destination?.map?.longitude ?? destination?.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) && (latitude !== 0 || longitude !== 0);
  const mapData = destination?.map || {};
  const markers = [
    { key: 'destination', name: destination?.name, latitude, longitude, type: 'Destination' },
    ...(mapData.recommendedPlaces || []).map((place, index) => ({ ...place, key: `place-${index}`, type: place.category || 'Recommended place' })),
    ...(mapData.airport?.available ? [{ ...mapData.airport, key: 'airport', type: 'Airport' }] : []),
    ...(mapData.railway?.available ? [{ ...mapData.railway, key: 'railway', type: 'Railway station' }] : []),
    ...(mapData.bus?.available ? [{ ...mapData.bus, key: 'bus', type: 'Bus station' }] : [])
  ].filter((marker) => Number.isFinite(Number(marker.latitude)) && Number.isFinite(Number(marker.longitude)));

  if (!hasCoordinates) {
    return (
      <div className="parchment-panel p-5 text-center text-textBrown">
        <MapPin className="w-7 h-7 mx-auto mb-2 text-tourOrange" />
        <p className="font-bold">Map temporarily unavailable for this destination.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border-3 border-borderBrown shadow-[0_5px_0_#5A2B15] h-64 sm:h-72 w-full">
      <MapContainer center={[latitude, longitude]} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.key} position={[Number(marker.latitude), Number(marker.longitude)]} icon={destinationMarker}>
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
