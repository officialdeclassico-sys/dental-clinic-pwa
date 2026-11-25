import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, Eye, ShieldCheck } from 'lucide-react';

const ABOUT_CLINIC_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/about_clinic_interior_1795594382732.jpg`;

interface AboutUsPageProps {
  onBack: () => void;
  visitId: number;
}

function PeopleOutlineIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="9.2" r="3.6" stroke="currentColor" strokeWidth="2.1" />
      <path
        d="M4.2 22c0-3.6 3-6.2 6.8-6.2s6.8 2.6 6.8 6.2"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="19.2" cy="10.2" r="2.8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19 16.5c2.8 0 5 1.9 5 4.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TargetArrowIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="15" cy="17" r="10.5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="15" cy="17" r="6.2" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="15" cy="17" r="2.2" fill="currentColor" />
      <path
        d="M15.6 16.4L26.5 5.5M26.5 5.5H21.8M26.5 5.5V10.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToothOutlineIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M9.4 4.8C6.9 4.8 5 6.8 5 9.5c0 2.9 1.4 5.1 2.1 8 .5 2.2 1.1 5.8 2.8 5.8 1.3 0 1.7-2.6 2.6-4.6.4-.9 1.1-1.3 1.9-1.3s1.5.4 1.9 1.3c.9 2 1.3 4.6 2.6 4.6 1.7 0 2.3-3.6 2.8-5.8.7-2.9 2.1-5.1 2.1-8 0-2.7-1.9-4.7-4.4-4.7-1.6 0-2.8.7-3.7 1.2-.7.4-1.9.4-2.6 0-.9-.5-2.1-1.2-3.7-1.2Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifiedBadgeIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 2.8l2.5 2 3.2-.2 1.2 3 2.9 1.4-.4 3.2 1.9 2.6-1.9 2.6.4 3.2-2.9 1.4-1.2 3-3.2-.2-2.5 2-2.5-2-3.2.2-1.2-3-2.9-1.4.4-3.2L2.7 14.8l1.9-2.6-.4-3.2 2.9-1.4 1.2-3 3.2.2L14 2.8Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 14.3l2.5 2.5 5.3-5.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandsHeartIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 14.5s-4.4-2.8-4.4-5.9c0-1.6 1.2-2.8 2.7-2.8.9 0 1.4.5 1.7 1 .3-.5.8-1 1.7-1 1.5 0 2.7 1.2 2.7 2.8 0 3.1-4.4 5.9-4.4 5.9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 14.2v4.6c0 1.2.6 2.3 1.7 3l3.6 2.1c.7.4 1.6.1 1.9-.6.3-.6.1-1.3-.4-1.7L8.4 19.3V15c0-.9-.7-1.6-1.6-1.6-.6 0-1.2.3-1.5.8l-.8 0Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5 14.2v4.6c0 1.2-.6 2.3-1.7 3l-3.6 2.1c-.7.4-1.6.1-1.9-.6-.3-.6-.1-1.3.4-1.7l2.9-2.3V15c0-.9.7-1.6 1.6-1.6.6 0 1.2.3 1.5.8l.8 0Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutUsPage({ onBack, visitId }: AboutUsPageProps) {
  const [imgError, setImgError] = useState(false);
  const [yearsCount, setYearsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const lastAnimatedVisitRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [visitId]);

  useEffect(() => {
    if (lastAnimatedVisitRef.current === visitId) {
      return;
    }
    lastAnimatedVisitRef.current = visitId;

    setYearsCount(0);
    setPatientsCount(0);
    setRatingCount(0);

    let rafId = 0;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const durationYears = 1450;
    const durationPatients = 1750;
    const durationRating = 1600;
    const staggerPatients = 100;
    const staggerRating = 200;

    const tick = (now: number) => {
      const elapsed = now - startTime;

      const pYears = Math.min(1, Math.max(0, elapsed / durationYears));
      const pPatients = Math.min(
        1,
        Math.max(0, (elapsed - staggerPatients) / durationPatients)
      );
      const pRating = Math.min(
        1,
        Math.max(0, (elapsed - staggerRating) / durationRating)
      );

      setYearsCount(Math.round(easeOutCubic(pYears) * 10));
      setPatientsCount(Math.round(easeOutCubic(pPatients) * 25000));
      setRatingCount(Number((easeOutCubic(pRating) * 4.9).toFixed(1)));

      if (pYears < 1 || pPatients < 1 || pRating < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setYearsCount(10);
        setPatientsCount(25000);
        setRatingCount(4.9);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [visitId]);

  return (
    <div>
      {/* Page Header */}
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Home"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          About Us
        </h1>
      </header>

      <div className="mt-3 space-y-3.5 sm:space-y-4 md:space-y-5">
      {/* Hero Banner */}
      <section
        aria-label="About SmileCare Dental Clinic"
        className="relative rounded-[22px] md:rounded-[26px] neu-hero-card overflow-hidden h-[194px] sm:h-[225px] md:h-[268px] lg:h-[300px] bg-gradient-to-br from-[#1FA2FF] via-[#0771FF] to-[#0052DC]"
      >
        {!imgError && (
          <img
            src={ABOUT_CLINIC_IMAGE}
            alt="Modern SmileCare Dental Clinic interior and treatment chair"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-y-0 right-0 w-[64%] sm:w-[58%] md:w-[55%] h-full object-cover object-center"
          />
        )}

        {/* Curved Electric-Blue Left Overlay matching reference */}
        <svg
          viewBox="0 0 400 220"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="aboutHeroBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1B9CFF" />
              <stop offset="60%" stopColor="#056FFF" />
              <stop offset="100%" stopColor="#0052DC" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 H248 C215 62, 200 144, 175 220 H0 Z"
            fill="url(#aboutHeroBlue)"
          />
          <path
            d="M248 0 H282 C250 56, 224 140, 198 220 H175 C200 144, 215 62, 248 0 Z"
            fill="#1D9DFF"
            fillOpacity="0.45"
          />
          <path
            d="M0 0 H198 C220 68, 206 148, 172 220 H0 Z"
            fill="#0A6CFF"
            fillOpacity="0.32"
          />
        </svg>

        <div className="relative z-10 h-full w-[62%] sm:w-[56%] md:w-[52%] pl-4 sm:pl-6 md:pl-9 pr-2 flex flex-col justify-center">
          <h2 className="text-[22px] sm:text-[26px] md:text-[32px] lg:text-[35px] font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-[0_1px_2px_rgba(0,48,135,0.28)]">
            <span className="block">About</span>
            <span className="block">SmileCare</span>
            <span className="block">Dental Clinic</span>
          </h2>
          <p className="mt-2 md:mt-3 text-[11.5px] sm:text-[13.5px] md:text-[15.5px] font-medium text-white/95 leading-snug max-w-[215px] sm:max-w-[290px] md:max-w-[360px]">
            Trusted Dental Care for Healthier, Happier Smiles
          </p>
        </div>
      </section>

      {/* Animated Statistics Card */}
      <section
        aria-label="Clinic Statistics"
        className="neu-card rounded-[20px] md:rounded-[24px] px-2 sm:px-4 md:px-6 py-4 md:py-5 grid grid-cols-3 items-center"
      >
        {/* Stat 1 */}
        <div className="flex flex-col items-center text-center px-1 border-r border-[#C8DAEE]">
          <Calendar className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF]" strokeWidth={2} />
          <span className="mt-2 text-[20px] sm:text-[23px] md:text-[26px] font-extrabold text-[#0E1B3B] leading-none tabular-nums">
            {yearsCount}+
          </span>
          <span className="mt-1.5 text-[11px] sm:text-[12.5px] md:text-[14px] font-semibold text-[#1E3158] leading-tight">
            Years of Care
          </span>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center text-center px-1 border-r border-[#C8DAEE]">
          <PeopleOutlineIcon className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF]" />
          <span className="mt-2 text-[20px] sm:text-[23px] md:text-[26px] font-extrabold text-[#0E1B3B] leading-none tabular-nums">
            {patientsCount.toLocaleString('en-US')}+
          </span>
          <span className="mt-1.5 text-[11px] sm:text-[12.5px] md:text-[14px] font-semibold text-[#1E3158] leading-tight">
            Happy Patients
          </span>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center text-center px-1">
          <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF]" strokeWidth={2} />
          <span className="mt-2 text-[20px] sm:text-[23px] md:text-[26px] font-extrabold text-[#0E1B3B] leading-none tabular-nums inline-flex items-center justify-center gap-0.5">
            <span>{ratingCount.toFixed(1)}</span>
            <span className="text-[17px] sm:text-[20px] md:text-[22px] text-[#0E1B3B]" aria-hidden="true">
              ★
            </span>
          </span>
          <span className="mt-1.5 text-[11px] sm:text-[12.5px] md:text-[14px] font-semibold text-[#1E3158] leading-tight">
            Patient Rating
          </span>
        </div>
      </section>

      {/* Our Mission Card */}
      <section
        aria-label="Our Mission"
        className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-5 flex items-center gap-3.5 sm:gap-4"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-[16px] neu-card flex items-center justify-center text-[#0070FF] shrink-0">
          <TargetArrowIcon className="w-8 h-8 md:w-9 md:h-9" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[16.5px] sm:text-[18px] md:text-[20px] font-extrabold text-[#0E1B3B] leading-tight">
            Our Mission
          </h2>
          <p className="mt-1 text-[12.5px] sm:text-[13.5px] md:text-[15px] font-medium text-[#1A2B50] leading-[1.42]">
            To provide high-quality, compassionate and advanced dental care for healthier, confident smiles.
          </p>
        </div>
      </section>

      {/* Our Vision Card */}
      <section
        aria-label="Our Vision"
        className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-5 flex items-center gap-3.5 sm:gap-4"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-[16px] neu-card flex items-center justify-center text-[#0070FF] shrink-0">
          <Eye className="w-8 h-8 md:w-9 md:h-9" strokeWidth={2.1} />
        </div>
        <div className="min-w-0">
          <h2 className="text-[16.5px] sm:text-[18px] md:text-[20px] font-extrabold text-[#0E1B3B] leading-tight">
            Our Vision
          </h2>
          <p className="mt-1 text-[12.5px] sm:text-[13.5px] md:text-[15px] font-medium text-[#1A2B50] leading-[1.42]">
            To be a trusted and leading dental care partner for individuals and families in Hyderabad.
          </p>
        </div>
      </section>

      {/* Why Choose Us? Section */}
      <section aria-label="Why Choose Us" className="pt-0.5">
        <div className="rounded-t-[20px] px-3.5 sm:px-4 pt-3 pb-2.5 bg-gradient-to-b from-[#EFF6FE] to-transparent">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4">
          <div className="neu-card rounded-[16px] md:rounded-[18px] px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 flex items-center gap-2.5 sm:gap-3">
            <ToothOutlineIcon className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF] shrink-0" />
            <span className="text-[12px] sm:text-[13.5px] md:text-[15px] font-extrabold text-[#0E1B3B] leading-tight">
              Expert Dentists
            </span>
          </div>

          <div className="neu-card rounded-[16px] md:rounded-[18px] px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 flex items-center gap-2.5 sm:gap-3">
            <VerifiedBadgeIcon className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF] shrink-0" />
            <span className="text-[12px] sm:text-[13.5px] md:text-[15px] font-extrabold text-[#0E1B3B] leading-tight">
              Advanced Technology
            </span>
          </div>

          <div className="neu-card rounded-[16px] md:rounded-[18px] px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 flex items-center gap-2.5 sm:gap-3">
            <HandsHeartIcon className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF] shrink-0" />
            <span className="text-[12px] sm:text-[13.5px] md:text-[15px] font-extrabold text-[#0E1B3B] leading-tight">
              Patient-Centric Care
            </span>
          </div>

          <div className="neu-card rounded-[16px] md:rounded-[18px] px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 flex items-center gap-2.5 sm:gap-3">
            <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-[#0070FF] shrink-0" strokeWidth={2.1} />
            <span className="text-[12px] sm:text-[13.5px] md:text-[15px] font-extrabold text-[#0E1B3B] leading-tight">
              Safe &amp; Hygienic
            </span>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
