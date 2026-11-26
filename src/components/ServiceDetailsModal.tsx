import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  CalendarCheck2,
  Check,
  Clock,
  X,
} from 'lucide-react';
import { ServiceCatalogItem } from '../data/servicesData';

interface ServiceDetailsModalProps {
  service: ServiceCatalogItem | null;
  onClose: () => void;
  onBookAppointment: (service: ServiceCatalogItem) => void;
}

function ToothBadgeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.5 4.2C6.3 4.2 4.6 6 4.6 8.3c0 2.5 1.2 4.4 1.8 6.9.5 2 1 5.2 2.5 5.2 1.2 0 1.5-2.3 2.3-4.1.4-.8 1-1.2 1.8-1.2s1.4.4 1.8 1.2c.8 1.8 1.1 4.1 2.3 4.1 1.5 0 2-3.2 2.5-5.2.6-2.5 1.8-4.4 1.8-6.9 0-2.3-1.7-4.1-3.9-4.1-1.4 0-2.4.6-3.2 1.1-.6.4-1.8.4-2.4 0-.8-.5-1.8-1.1-3.2-1.1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DentalMirrorAccent() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="pointer-events-none absolute -bottom-1 -right-1 w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_3px_6px_rgba(14,27,59,0.28)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mirrorRim" x1="10" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F8FC" />
          <stop offset="50%" stopColor="#99A9BE" />
          <stop offset="100%" stopColor="#E6EEF7" />
        </linearGradient>
        <linearGradient id="mirrorGlass" x1="12" y1="10" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#D7E6F7" />
          <stop offset="100%" stopColor="#B8CEE8" />
        </linearGradient>
      </defs>
      <path d="M36 37L60 61" stroke="#9AA9BE" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M36 37L60 61" stroke="#E9F0F8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="25" cy="25" r="16.5" fill="url(#mirrorRim)" />
      <circle cx="25" cy="25" r="13.2" fill="url(#mirrorGlass)" />
      <path d="M17 19c2.5-3.5 7-5 11.5-4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ServiceDetailsModal({
  service,
  onClose,
  onBookAppointment,
}: ServiceDetailsModalProps) {
  const [imgError, setImgError] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);
  const restoreScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setImgError(false);
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [service?.serviceId]);

  // Critical background scroll lock + exact scroll position preservation
  useEffect(() => {
    if (!service) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevHtmlOverscroll = htmlEl.style.overscrollBehavior;
    const prevBodyPosition = bodyEl.style.position;
    const prevBodyTop = bodyEl.style.top;
    const prevBodyLeft = bodyEl.style.left;
    const prevBodyRight = bodyEl.style.right;
    const prevBodyWidth = bodyEl.style.width;
    const prevBodyOverflow = bodyEl.style.overflow;

    htmlEl.style.overflow = 'hidden';
    htmlEl.style.overscrollBehavior = 'none';
    bodyEl.style.position = 'fixed';
    bodyEl.style.top = `-${scrollY}px`;
    bodyEl.style.left = '0';
    bodyEl.style.right = '0';
    bodyEl.style.width = '100%';
    bodyEl.style.overflow = 'hidden';

    const restore = () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      htmlEl.style.overscrollBehavior = prevHtmlOverscroll;
      bodyEl.style.position = prevBodyPosition;
      bodyEl.style.top = prevBodyTop;
      bodyEl.style.left = prevBodyLeft;
      bodyEl.style.right = prevBodyRight;
      bodyEl.style.width = prevBodyWidth;
      bodyEl.style.overflow = prevBodyOverflow;
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    };

    restoreScrollRef.current = restore;

    return () => {
      if (restoreScrollRef.current) {
        restoreScrollRef.current();
        restoreScrollRef.current = null;
      }
    };
  }, [service]);

  // Escape key closes modal on desktop
  useEffect(() => {
    if (!service) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  const handleBackdropTouchOrWheel = (e: React.TouchEvent | React.WheelEvent) => {
    if (e.target === overlayRef.current) {
      e.preventDefault();
    }
  };

  const handleBookClick = () => {
    const selected = service;
    onClose();
    onBookAppointment(selected);
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-details-title"
      data-testid="service-details-backdrop"
      onClick={onClose}
      onWheel={handleBackdropTouchOrWheel}
      onTouchMove={handleBackdropTouchOrWheel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09152E]/62 backdrop-blur-[2px] p-3 sm:p-5 lg:p-6 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-[calc(0.75rem+env(safe-area-inset-top,0px))] overscroll-none touch-none"
    >
      <div
        data-testid="service-details-modal"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-[366px] sm:max-w-[520px] lg:max-w-[588px] max-h-[calc(100dvh-1.75rem)] sm:max-h-[calc(100dvh-3rem)] rounded-[26px] sm:rounded-[30px] bg-gradient-to-b from-[#F8FBFF] to-[#EAF3FE] border-[1.5px] border-white/95 shadow-[0_22px_50px_rgba(9,21,46,0.38)] flex flex-col overflow-hidden touch-auto"
      >
        {/* Top-Right Circular Close Button (Single close button only) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close service details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full neu-circle-btn flex items-center justify-center text-[#0057E0] hover:text-[#0040B0] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>

        {/* Scrollable Inner Content */}
        <div
          ref={modalBodyRef}
          data-testid="service-details-scroll-body"
          className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4 space-y-3.5 sm:space-y-4"
        >
          {/* Top Section: Treatment Image (Left) + Title & Category Badge (Right) */}
          <div className="grid grid-cols-[128px_1fr] sm:grid-cols-[188px_1fr] lg:grid-cols-[204px_1fr] items-center gap-3 sm:gap-4 pr-7 sm:pr-9">
            <div className="relative h-[96px] sm:h-[132px] lg:h-[142px] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white border-[1.5px] border-white shadow-[0_4px_12px_rgba(130,166,212,0.28)] shrink-0">
              {!imgError ? (
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#52BFFF] to-[#0066F5] text-white font-extrabold text-[12px] text-center p-2">
                  {service.serviceName}
                </div>
              )}
              {service.showDentalMirrorOverlay && !imgError && <DentalMirrorAccent />}
            </div>

            <div className="min-w-0 space-y-2">
              <h2
                id="service-details-title"
                className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#0E1B3B] leading-[1.16] tracking-tight"
              >
                {service.serviceName}
              </h2>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FF] border border-white/95 shadow-[0_2px_8px_rgba(130,166,212,0.22)] px-3 py-1 max-w-full">
                <ToothBadgeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0066F5] shrink-0" />
                <span className="text-[11.5px] sm:text-[13px] font-bold text-[#005CE6] truncate">
                  {service.category}
                </span>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-[13px] sm:text-[14.5px] font-medium text-[#1A2B50] leading-[1.45]">
            {service.description}
          </p>

          {/* 3 Raised Neumorphic Info Tiles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="neu-card rounded-[15px] sm:rounded-[18px] px-1.5 py-2.5 sm:px-3 sm:py-3 flex flex-col items-center justify-center text-center min-h-[78px] sm:min-h-[88px]">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.2} />
              <span className="mt-1 text-[10.5px] sm:text-[12px] font-semibold text-[#425478] leading-tight">
                Duration
              </span>
              <span className="mt-0.5 text-[12px] sm:text-[14px] font-extrabold text-[#0E1B3B] leading-tight">
                {service.duration}
              </span>
            </div>

            <div className="neu-card rounded-[15px] sm:rounded-[18px] px-1.5 py-2.5 sm:px-3 sm:py-3 flex flex-col items-center justify-center text-center min-h-[78px] sm:min-h-[88px]">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.2} />
              <span className="mt-1 text-[10.5px] sm:text-[12px] font-semibold text-[#425478] leading-tight">
                Sessions
              </span>
              <span className="mt-0.5 text-[12px] sm:text-[14px] font-extrabold text-[#0E1B3B] leading-tight">
                {service.sessions}
              </span>
            </div>

            <div className="neu-card rounded-[15px] sm:rounded-[18px] px-1.5 py-2.5 sm:px-3 sm:py-3 flex flex-col items-center justify-center text-center min-h-[78px] sm:min-h-[88px]">
              <CalendarCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.2} />
              <span className="mt-1 text-[10.5px] sm:text-[12px] font-semibold text-[#425478] leading-tight">
                Recommended
              </span>
              <span className="mt-0.5 text-[11.5px] sm:text-[13.5px] font-extrabold text-[#0E1B3B] leading-tight">
                {service.recommendedFrequency}
              </span>
            </div>
          </div>

          {/* What's Included? Section */}
          <section
            aria-label="What's Included"
            className="neu-card rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 space-y-2"
          >
            <h3 className="text-[15px] sm:text-[17px] font-extrabold text-[#0E1B3B]">
              What&rsquo;s Included?
            </h3>

            <ul className="space-y-1.5 sm:space-y-2">
              {service.whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="rounded-[12px] bg-[#F5FAFF] border border-white/90 shadow-[0_2px_6px_rgba(140,174,216,0.16)] px-3 py-2 flex items-center gap-2.5"
                >
                  <span
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#0070FF] text-white flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3.2} />
                  </span>
                  <span className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#1A2B50] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sticky/Pinned Accessible Primary Action Footer (No second Close button) */}
        {service.bookingEnabled && (
          <div className="shrink-0 px-4 pb-4 pt-1.5 sm:px-6 sm:pb-5 sm:pt-2 bg-gradient-to-t from-[#EAF3FE] via-[#EAF3FE]/95 to-transparent">
            <button
              type="button"
              onClick={handleBookClick}
              className="w-full neu-blue-btn rounded-full py-3 sm:py-3.5 px-6 text-[15px] sm:text-[16.5px] font-extrabold text-white flex items-center justify-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
              <span>Book Appointment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
