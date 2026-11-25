import React, { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_CONTACT_CONFIG, CLINIC_HOURS, ClinicContactConfig } from '../data/clinicData';

const CONTACT_RECEPTION_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/contact_clinic_reception_1795595763612.jpg`;

interface ContactUsPageProps {
  onBack: () => void;
  config?: ClinicContactConfig;
}

function WhatsAppOutlineIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 3.5c5.8 0 10.5 4.6 10.5 10.3 0 5.7-4.7 10.3-10.5 10.3-1.8 0-3.5-.5-5-1.3l-4.5 1.4 1.4-4.3c-.9-1.6-1.4-3.4-1.4-5.3C3.5 8.1 8.2 3.5 14 3.5Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8 9.9c-.3-.6-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.2-1.3 3s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.5 3.1 1.2 3.8 1 4.5.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.2.1-.5 0-.7-.1-.2-.8-1.9-1.1-2.6Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
    </svg>
  );
}

function DirectionsDiamondIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect
        x="14"
        y="2.2"
        width="16.6"
        height="16.6"
        rx="3.4"
        transform="rotate(45 14 2.2)"
        fill="#0070FF"
      />
      <path
        d="M11.2 17.5v-3.8c0-.9.7-1.6 1.6-1.6h4.2"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 9.6l2.6 2.5-2.6 2.5"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FoldedMapPinIllustration({ className = 'w-16 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 64" fill="none" className={className} aria-hidden="true">
      {/* Folded Map Panels */}
      <path d="M10 24L30 18V54L10 60V24Z" fill="#CFE9FF" stroke="#9ACAF8" strokeWidth="1.2" />
      <path d="M30 18L56 25V61L30 54V18Z" fill="#E3F4EC" stroke="#A4DEC8" strokeWidth="1.2" />
      <path d="M56 25L78 18V54L56 61V25Z" fill="#CBE8FF" stroke="#9ACAF8" strokeWidth="1.2" />
      {/* Map Roads */}
      <path d="M12 36L28 31L54 42L76 34" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M40 21L38 56" stroke="#7CC4FF" strokeWidth="2.4" strokeLinecap="round" />
      {/* Pin Shadow */}
      <ellipse cx="44" cy="40" rx="6" ry="2.2" fill="#0E1B3B" fillOpacity="0.18" />
      {/* Location Pin */}
      <path
        d="M44 7c-6.3 0-11.4 5-11.4 11.2 0 7.7 11.4 20.3 11.4 20.3s11.4-12.6 11.4-20.3C55.4 12 50.3 7 44 7Z"
        fill="#FF3B6B"
      />
      <circle cx="44" cy="18" r="4.3" fill="white" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="igGrad" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="30%" stopColor="#FA7E1E" />
          <stop offset="60%" stopColor="#D62976" />
          <stop offset="85%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="30" height="30" rx="8.5" fill="url(#igGrad)" />
      <rect x="9" y="9" width="18" height="18" rx="5.2" stroke="white" strokeWidth="2.2" />
      <circle cx="18" cy="18" r="4.2" stroke="white" strokeWidth="2.2" />
      <circle cx="23.6" cy="12.4" r="1.3" fill="white" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="#1877F2" />
      <path
        d="M20.2 29V19.6h3.1l.5-3.6h-3.6v-2.3c0-1 .3-1.8 1.8-1.8h1.9V8.7c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8V16h-3.1v3.6h3.1V29h3.8Z"
        fill="white"
      />
    </svg>
  );
}

function YouTubeIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="7.5" width="31" height="21" rx="6.5" fill="#FF0000" />
      <path d="M15 13.5l8.5 4.5-8.5 4.5v-9Z" fill="white" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="30" height="30" rx="6.5" fill="#0A66C2" />
      <circle cx="11.3" cy="11.6" r="2.1" fill="white" />
      <rect x="9.5" y="15.3" width="3.6" height="11.2" rx="0.7" fill="white" />
      <path
        d="M16.2 15.3h3.4v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6v6h-3.6v-5.3c0-1.3 0-2.9-1.8-2.9-1.8 0-2.1 1.4-2.1 2.8v5.4h-3.6V15.3h-.3Z"
        fill="white"
      />
    </svg>
  );
}

export function ContactUsPage({
  onBack,
  config = CLINIC_CONTACT_CONFIG,
}: ContactUsPageProps) {
  const [imgError, setImgError] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [missingSettingNotice, setMissingSettingNotice] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (
      typeof navigator !== 'undefined' &&
      'geolocation' in navigator &&
      'permissions' in navigator
    ) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          if (status.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setUserCoords({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
              },
              () => {
                // Fallback to Google Maps current-location prompt
              },
              { timeout: 3000, maximumAge: 60000 }
            );
          }
        })
        .catch(() => {
          // Permissions API unavailable; Google Maps handles origin automatically
        });
    }
  }, []);

  const directionsUrl = userCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        `${userCoords.lat},${userCoords.lng}`
      )}&destination=${encodeURIComponent(config.googleMapsDestination)}`
    : config.googleMapsDirectionsBaseUrl;

  const cleanPhone = config.phoneNumber.trim();
  const cleanWhatsapp = config.whatsappNumber.replace(/[^\d]/g, '');
  const cleanEmail = config.email.trim();

  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(config.whatsappPrefillMessage)}`
    : '';
  const mailtoUrl = cleanEmail
    ? `mailto:${cleanEmail}?subject=${encodeURIComponent(config.emailSubject)}`
    : '';

  const showConfigNotice = (settingPath: string, label: string) => {
    setMissingSettingNotice(
      `${label} is not configured yet. Supply CLINIC_CONTACT_CONFIG.${settingPath} in src/data/clinicData.ts to enable this action.`
    );
  };

  const socialItems: {
    id: keyof ClinicContactConfig['socialUrls'];
    label: string;
    url: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'instagram',
      label: 'Instagram',
      url: config.socialUrls.instagram.trim(),
      icon: <InstagramIcon className="w-9 h-9 md:w-10 md:h-10" />,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      url: config.socialUrls.facebook.trim(),
      icon: <FacebookIcon className="w-9 h-9 md:w-10 md:h-10" />,
    },
    {
      id: 'youtube',
      label: 'YouTube',
      url: config.socialUrls.youtube.trim(),
      icon: <YouTubeIcon className="w-9 h-9 md:w-10 md:h-10" />,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: config.socialUrls.linkedin.trim(),
      icon: <LinkedInIcon className="w-9 h-9 md:w-10 md:h-10" />,
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Contact Us
        </h1>
      </header>

      <div className="mt-3 space-y-3.5 sm:space-y-4 md:space-y-5">
        {/* Hero Banner */}
        <section
          aria-label="Get in Touch with SmileCare"
          className="relative rounded-[22px] md:rounded-[26px] neu-hero-card overflow-hidden h-[190px] sm:h-[222px] md:h-[264px] lg:h-[296px] bg-gradient-to-br from-[#1FA2FF] via-[#0771FF] to-[#0052DC]"
        >
          {!imgError && (
            <img
              src={CONTACT_RECEPTION_IMAGE}
              alt="SmileCare Dental Clinic reception area"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="absolute inset-y-0 right-0 w-[60%] sm:w-[56%] md:w-[53%] h-full object-cover object-center"
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
              <linearGradient id="contactHeroBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B9CFF" />
                <stop offset="60%" stopColor="#056FFF" />
                <stop offset="100%" stopColor="#0052DC" />
              </linearGradient>
            </defs>
            <path
              d="M0 0 H248 C216 62, 200 144, 174 220 H0 Z"
              fill="url(#contactHeroBlue)"
            />
            <path
              d="M248 0 H282 C250 56, 224 140, 198 220 H174 C200 144, 216 62, 248 0 Z"
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
            <h2 className="text-[21px] sm:text-[26px] md:text-[31px] lg:text-[34px] font-extrabold text-white leading-[1.13] tracking-tight drop-shadow-[0_1px_2px_rgba(0,48,135,0.28)]">
              <span className="block">Get in Touch</span>
              <span className="block">with SmileCare</span>
            </h2>
            <p className="mt-2 md:mt-3 text-[11.5px] sm:text-[13.5px] md:text-[15.5px] font-medium text-white/95 leading-snug max-w-[215px] sm:max-w-[290px] md:max-w-[360px]">
              We’re here to help you with appointments, queries and all your dental care needs.
            </p>
          </div>
        </section>

        {/* Configuration notice (only shown if owner has not supplied an external contact setting yet) */}
        {missingSettingNotice && (
          <div
            role="status"
            className="rounded-[16px] bg-[#EEF5FE] border border-[#BFD8F7] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12px] font-semibold text-[#162952]"
          >
            <span>{missingSettingNotice}</span>
            <button
              type="button"
              onClick={() => setMissingSettingNotice(null)}
              className="text-[11.5px] font-extrabold text-[#0070FF] shrink-0 px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Four Contact Action Cards */}
        <section aria-label="Quick Contact Actions" className="grid grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-5">
          {cleanPhone ? (
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => setMissingSettingNotice(null)}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <Phone className="w-[27px] h-[27px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                Call Us
              </span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => showConfigNotice('phoneNumber', 'Clinic phone number')}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <Phone className="w-[27px] h-[27px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                Call Us
              </span>
            </button>
          )}

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMissingSettingNotice(null)}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <WhatsAppOutlineIcon className="w-[28px] h-[28px] md:w-[31px] md:h-[31px] text-[#0070FF]" />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                WhatsApp
              </span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => showConfigNotice('whatsappNumber', 'WhatsApp business number')}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <WhatsAppOutlineIcon className="w-[28px] h-[28px] md:w-[31px] md:h-[31px] text-[#0070FF]" />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                WhatsApp
              </span>
            </button>
          )}

          {mailtoUrl ? (
            <a
              href={mailtoUrl}
              onClick={() => setMissingSettingNotice(null)}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <Mail className="w-[27px] h-[27px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                Email Us
              </span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => showConfigNotice('email', 'Clinic email address')}
              className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              <Mail className="w-[27px] h-[27px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />
              <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
                Email Us
              </span>
            </button>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMissingSettingNotice(null)}
            className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] md:min-h-[100px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <DirectionsDiamondIcon className="w-[28px] h-[28px] md:w-[31px] md:h-[31px]" />
            <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
              Directions
            </span>
          </a>
        </section>

        {/* Clinic Address Card + View on Map */}
        <section
          aria-label="Clinic Address"
          className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-3 md:gap-5"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-[14px] neu-card flex items-center justify-center text-[#0070FF] shrink-0">
              <MapPin className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] sm:text-[17.5px] md:text-[19px] font-extrabold text-[#0E1B3B] leading-tight">
                Clinic Address
              </h2>
              <p className="mt-1 text-[12px] sm:text-[13px] md:text-[14.5px] font-medium text-[#1A2B50] leading-snug">
                {config.addressLine1}
                <br />
                {config.addressLine2}
              </p>
            </div>
          </div>

          <div className="w-[1px] h-16 bg-[#C8DAEE] shrink-0" aria-hidden="true" />

          <div className="flex flex-col items-center justify-center shrink-0">
            <FoldedMapPinIllustration className="w-[74px] h-[50px] sm:w-[82px] sm:h-[54px] -mb-1" />
            <a
              href={config.googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-blue-btn rounded-full px-3.5 sm:px-4.5 py-1.5 text-[11.5px] sm:text-[12.5px] font-bold text-white whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              View on Map
            </a>
          </div>
        </section>

        {/* Clinic Hours Card (7-row compact vertical list) */}
        <section
          aria-label="Clinic Hours"
          className="neu-card rounded-[22px] md:rounded-[26px] p-3.5 sm:p-4 md:p-5"
        >
          <div className="flex items-center gap-2.5 px-1">
            <Clock className="w-6 h-6 text-[#0070FF] shrink-0" strokeWidth={2.2} />
            <h2 className="text-[17px] sm:text-[19px] md:text-[21px] font-extrabold text-[#0E1B3B] leading-tight">
              Clinic Hours
            </h2>
          </div>

          <div className="mt-3 space-y-2">
            {CLINIC_HOURS.map((row) => (
              <div
                key={row.day}
                className="rounded-full bg-gradient-to-b from-[#F9FCFF] to-[#EEF5FD] border border-white/90 shadow-[0_2px_6px_rgba(145,177,218,0.28),_inset_0_1px_0_rgba(255,255,255,0.95)] px-3.5 sm:px-4.5 py-2 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 w-[44%] min-w-0">
                  <CalendarDays className="w-4 h-4 text-[#0070FF] shrink-0" strokeWidth={2.1} />
                  <span className="text-[12.5px] sm:text-[13.5px] md:text-[14.5px] font-bold text-[#0E1B3B] truncate">
                    {row.day}
                  </span>
                </div>

                <div className="w-[1px] h-4 bg-[#7AA6E0]/60 shrink-0" aria-hidden="true" />

                <span className="text-[12px] sm:text-[13.5px] md:text-[14.5px] font-semibold text-[#16274C] tabular-nums whitespace-nowrap text-right flex-1">
                  {row.hours}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Follow Us on Social Media */}
        <section
          aria-label="Follow Us on Social Media"
          className="neu-card rounded-[22px] md:rounded-[26px] p-3.5 sm:p-4 md:p-5"
        >
          <h2 className="text-[17px] sm:text-[19px] md:text-[21px] font-extrabold text-[#0E1B3B] leading-tight px-1">
            Follow Us on Social Media
          </h2>

          <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
            {socialItems.map((social) =>
              social.url ? (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMissingSettingNotice(null)}
                  className="neu-card-interactive rounded-[16px] md:rounded-[20px] py-3 sm:py-3.5 px-1 flex flex-col items-center justify-center gap-1.5 min-h-[82px] md:min-h-[96px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                >
                  {social.icon}
                  <span className="text-[11px] sm:text-[12.5px] md:text-[14px] font-bold text-[#0E1B3B] leading-tight whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ) : (
                <button
                  key={social.id}
                  type="button"
                  onClick={() =>
                    showConfigNotice(`socialUrls.${social.id}`, `${social.label} profile URL`)
                  }
                  className="neu-card-interactive rounded-[16px] md:rounded-[20px] py-3 sm:py-3.5 px-1 flex flex-col items-center justify-center gap-1.5 min-h-[82px] md:min-h-[96px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                >
                  {social.icon}
                  <span className="text-[11px] sm:text-[12.5px] md:text-[14px] font-bold text-[#0E1B3B] leading-tight whitespace-nowrap">
                    {social.label}
                  </span>
                </button>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
