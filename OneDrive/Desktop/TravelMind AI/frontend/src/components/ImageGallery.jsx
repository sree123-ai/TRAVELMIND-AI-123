import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export const ImageGallery = ({ images = [], destinationName = "" }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);

  if (!images.length) return null;

  const currentImage = images[activeThumb] || images[0];
  const genericFallback = '/assets/tourism_bg.jpg';

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      {/* Main Image with Fullscreen Zoom Trigger */}
      <div className="relative rounded-2xl overflow-hidden border-3 border-borderBrown shadow-[0_6px_0_#5A2B15] h-72 sm:h-96 w-full group">
        <img
          src={currentImage}
          alt={destinationName}
          onError={(event) => { event.currentTarget.src = genericFallback; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => setLightboxIndex(activeThumb)}
          className="btn-3d absolute bottom-4 right-4 bg-white/90 text-textBrown px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5 !rounded-xl"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4 text-tourOrange" />
          <span>Full Screen</span>
        </button>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveThumb(idx)}
              className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeThumb === idx
                  ? 'border-tourOrange scale-105 ring-2 ring-tourGold shadow-[0_3px_0_#5A2B15]'
                  : 'border-borderBrown opacity-70 hover:opacity-100 shadow-[0_2px_0_#5A2B15]'
              }`}
            >
              <img src={img} alt={`${destinationName} thumbnail ${idx + 1}`} onError={(event) => { event.currentTarget.src = genericFallback; }} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button
              onClick={() => setLightboxIndex(null)}
              className="btn-3d absolute -top-12 right-0 bg-tourPink text-white p-2.5 !rounded-full !shadow-[0_3px_0_#5A2B15]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-h-[80vh] flex items-center justify-center">
              <img
                src={images[lightboxIndex]}
                alt={destinationName}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl border-3 border-white shadow-2xl object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="btn-3d absolute left-2 sm:left-4 bg-tourOrange text-white p-3 !rounded-full !shadow-[0_4px_0_#5A2B15]"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-3d absolute right-2 sm:right-4 bg-tourOrange text-white p-3 !rounded-full !shadow-[0_4px_0_#5A2B15]"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <p className="text-white text-center font-bold mt-4 text-sm">
              {destinationName} — Image {lightboxIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
