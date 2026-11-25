import React, { useState } from 'react';
import { OFFER_BANNER_IMAGE } from '../data/clinicData';

interface NewPatientOfferBannerProps {
  offerTag: string;
  offerHeadlinePrefix: string;
  offerPercentage: number;
  offerHeadlineSuffix: string;
  offerDescription: string;
  bookNowLabel: string;
  onBookNow: () => void;
}

export function NewPatientOfferBanner({
  offerTag,
  offerHeadlinePrefix,
  offerPercentage,
  offerHeadlineSuffix,
  offerDescription,
  bookNowLabel,
  onBookNow,
}: NewPatientOfferBannerProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      aria-label={offerTag}
      className="neu-card rounded-[22px] md:rounded-[26px] overflow-hidden relative min-h-[164px] sm:min-h-[180px] md:min-h-[215px] lg:min-h-[240px] flex items-center"
    >
      {/* Right-aligned Dental Smile Image */}
      <div className="absolute inset-y-0 right-0 w-[52%] sm:w-[48%] md:w-[45%] h-full overflow-hidden">
        {!imgError ? (
          <img
            src={OFFER_BANNER_IMAGE}
            alt="Bright healthy smile at SmileCare Dental Clinic"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#27ADFF] to-[#005CE6]" />
        )}
      </div>

      {/* Curved Blue Wave Accent with White 4-point Sparkles */}
      <svg
        viewBox="0 0 420 180"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="offerWaveBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26AEFF" />
            <stop offset="100%" stopColor="#0066F5" />
          </linearGradient>
        </defs>
        <path
          d="M192 180 C212 108, 250 48, 286 0 H306 C268 58, 256 122, 272 180 Z"
          fill="url(#offerWaveBlue)"
        />
        <path
          d="M180 180 C198 112, 236 52, 274 0 H286 C250 48, 212 108, 192 180 Z"
          fill="#62C7FF"
          fillOpacity="0.45"
        />
        {/* Sparkles on the blue wave */}
        <path
          d="M254 114l2.4 6.6L263 123l-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4 2.4-6.6Z"
          fill="white"
        />
        <path
          d="M236 138l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6 1.6-4.4Z"
          fill="white"
        />
      </svg>

      {/* Left Promotional Copy & Book Now Button */}
      <div className="relative z-10 w-[62%] sm:w-[56%] md:w-[52%] px-4 sm:px-6 md:px-9 lg:px-11 py-4 sm:py-5 md:py-7 flex flex-col items-start justify-center">
        <span className="inline-block rounded-full px-3.5 md:px-4 py-1 md:py-1.5 text-[11.5px] sm:text-[12.5px] md:text-[13.5px] font-bold text-white bg-gradient-to-b from-[#23AAFF] to-[#0066F5] shadow-[0_3px_8px_rgba(0,102,255,0.28)]">
          {offerTag}
        </span>

        <h3 className="mt-2 md:mt-3 text-[22px] sm:text-[25px] md:text-[31px] lg:text-[35px] font-extrabold text-[#0E1B3B] leading-[1.12] tracking-tight">
          {offerHeadlinePrefix} {offerPercentage}% {offerHeadlineSuffix}
        </h3>

        <p className="text-[13.5px] sm:text-[15px] md:text-[17px] lg:text-[18.5px] font-bold text-[#142347] leading-snug mt-0.5 md:mt-1">
          {offerDescription}
        </p>

        <button
          type="button"
          onClick={onBookNow}
          className="mt-3 sm:mt-3.5 md:mt-4.5 neu-blue-btn rounded-full px-6.5 sm:px-7 md:px-9 py-2 md:py-2.5 text-[13.5px] sm:text-[14px] md:text-[15.5px] font-bold text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          {bookNowLabel}
        </button>
      </div>
    </section>
  );
}
