import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBannerItem, LanguageCode } from '../data/clinicData';

interface HeroCarouselProps {
  banners: HeroBannerItem[];
  language: LanguageCode;
  onBannerAction: (actionType: HeroBannerItem['actionType']) => void;
}

export function HeroCarousel({ banners, language, onBannerAction }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [dragOffset, setDragOffset] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const total = banners.length;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReducedMotion || total <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isPaused, total]);

  const goToSlide = (idx: number) => {
    setActiveIndex(((idx % total) + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    setDragOffset(Math.max(-90, Math.min(90, delta)));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta <= -40) {
        goToSlide(activeIndex + 1);
      } else if (delta >= 40) {
        goToSlide(activeIndex - 1);
      }
    }
    touchStartX.current = null;
    setDragOffset(0);
    setIsPaused(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if ((e.target as HTMLElement).closest('button')) return;
    setIsPaused(true);
    pointerStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    setDragOffset(Math.max(-90, Math.min(90, delta)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    if (delta <= -45) {
      goToSlide(activeIndex + 1);
    } else if (delta >= 45) {
      goToSlide(activeIndex - 1);
    }
    pointerStartX.current = null;
    isDragging.current = false;
    setDragOffset(0);
    setIsPaused(false);
  };

  return (
    <section
      aria-label="Featured Dental Promotions"
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="relative rounded-[24px] overflow-hidden border border-white/85 shadow-[0_8px_22px_rgba(0,95,215,0.22)] bg-[#0066F5] select-none touch-pan-y group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {banners.map((banner) => {
            const copy = banner.text[language];
            const imageErrored = failedImages[banner.id];

            return (
              <div
                key={banner.id}
                className="w-full shrink-0 relative h-[212px] sm:h-[235px] md:h-[285px] lg:h-[330px] xl:h-[360px] overflow-hidden bg-gradient-to-br from-[#23A6FF] via-[#0B74FF] to-[#0050D6]"
              >
                {/* Right-aligned Dental Photo */}
                {!imageErrored && (
                  <img
                    src={banner.image}
                    alt={banner.imageAlt}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [banner.id]: true }))
                    }
                    className="absolute inset-y-0 right-0 w-[68%] sm:w-[60%] md:w-[56%] lg:w-[54%] h-full object-cover object-[center_22%] sm:object-[center_18%]"
                  />
                )}

                {/* Curved Electric-Blue Left Geometric Overlay matching reference */}
                <svg
                  viewBox="0 0 400 220"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id={`heroCurve-${banner.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#26AEFF" />
                      <stop offset="55%" stopColor="#0876FF" />
                      <stop offset="100%" stopColor="#0056E0" />
                    </linearGradient>
                  </defs>
                  {/* Primary curved wave covering left portion smoothly blending over photo */}
                  <path
                    d="M0 0 H244 C224 58, 224 148, 198 220 H0 Z"
                    fill={`url(#heroCurve-${banner.id})`}
                  />
                  {/* Soft translucent inner arc accent */}
                  <path
                    d="M110 0 C172 36, 198 112, 162 220 H0 V0 Z"
                    fill="#34B8FF"
                    fillOpacity="0.22"
                  />
                  {/* Subtle right-side curve transition tint */}
                  <path
                    d="M244 0 H266 C244 62, 240 148, 214 220 H198 C224 148, 224 58, 244 0 Z"
                    fill="#148CFF"
                    fillOpacity="0.45"
                  />
                </svg>

                {/* Left Text & Primary CTA */}
                <div className="relative z-10 h-full w-[64%] sm:w-[58%] md:w-[54%] pl-4 sm:pl-6 md:pl-9 lg:pl-11 pr-2 flex flex-col justify-center items-start">
                  <h2 className="text-[21px] sm:text-[25px] md:text-[31px] lg:text-[36px] font-extrabold text-white leading-[1.14] tracking-tight drop-shadow-[0_1px_2px_rgba(0,48,135,0.28)]">
                    <span className="block">{copy.headlineLine1}</span>
                    <span className="block">{copy.headlineLine2}</span>
                  </h2>

                  <p className="text-[11.5px] sm:text-[12.5px] md:text-[14.5px] lg:text-[15.5px] font-semibold text-white/95 mt-1.5 md:mt-2.5 leading-snug max-w-[240px] sm:max-w-[320px] md:max-w-[440px]">
                    {copy.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => onBannerAction(banner.actionType)}
                    className="mt-3 sm:mt-4 md:mt-5 neu-blue-btn neu-btn-md px-4.5 sm:px-5 md:px-7 py-2 md:py-2.5 text-[12.5px] sm:text-[13.5px] md:text-[15px] font-bold text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {copy.ctaLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Previous / Next Navigation Arrows (subtle on mobile, visible on hover/focus on larger screens) */}
        <button
          type="button"
          onClick={() => goToSlide(activeIndex - 1)}
          aria-label="Previous banner"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full neu-circle-btn text-[#0E1B3B] items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => goToSlide(activeIndex + 1)}
          aria-label="Next banner"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full neu-circle-btn text-[#0E1B3B] items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* 5 Pagination Indicators */}
      <div
        className="flex items-center justify-center gap-1.5 mt-2.5"
        role="tablist"
        aria-label="Banner slides"
      >
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`h-[7px] rounded-full neu-press-dot focus-visible:outline-2 focus-visible:outline-[#0070FF] ${
                isActive ? 'w-5 bg-[#1078FF]' : 'w-[7px] bg-[#B4CEF0] hover:bg-[#8AB6EC]'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
