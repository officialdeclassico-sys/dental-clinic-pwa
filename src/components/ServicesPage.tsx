import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ServiceCatalogItem,
  TRUST_FEATURES,
  getSortedServicesCatalog,
} from '../data/servicesData';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import { PaginationControls } from './PaginationControls';

interface ServicesPageProps {
  onBack: () => void;
  onBookAppointment: (service?: ServiceCatalogItem) => void;
}

const SERVICES_PER_PAGE = 6;
const HERO_TOOTH_SHIELD_SRC = '/src/assets/services/hero-tooth-shield.svg';
const CONSULT_DOCTOR_SRC = '/src/assets/images/hero_banner_preventive_care_1795590488433.jpg';

function ToothSparkleBlueIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M9.4 5C7 5 5.2 6.9 5.2 9.4c0 2.7 1.3 4.8 2 7.5.5 2.1 1 5.5 2.7 5.5 1.3 0 1.6-2.4 2.5-4.3.4-.9 1-1.3 1.8-1.3s1.4.4 1.8 1.3c.9 1.9 1.2 4.3 2.5 4.3 1.7 0 2.2-3.4 2.7-5.5.7-2.7 2-4.8 2-7.5 0-2.5-1.8-4.4-4.2-4.4-1.5 0-2.6.6-3.5 1.2-.7.4-1.9.4-2.6 0C12 5.6 10.9 5 9.4 5Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.4 3l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CardMirrorCornerAccent() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="pointer-events-none absolute bottom-1 right-3 w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_2px_4px_rgba(14,27,59,0.3)]"
      aria-hidden="true"
    >
      <path d="M27 28L44 45" stroke="#9AA9BE" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M27 28L44 45" stroke="#EEF4FA" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="19" r="12" fill="#B6C4D6" />
      <circle cx="19" cy="19" r="9.4" fill="#E3EEF9" />
      <path d="M13 14.5c2-2.5 5-3.5 8-2.8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ServicesPage({ onBack, onBookAppointment }: ServicesPageProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTrustId, setActiveTrustId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCatalogItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const allServices = useMemo(() => getSortedServicesCatalog(), []);
  const totalPages = Math.max(1, Math.ceil(allServices.length / SERVICES_PER_PAGE));

  const visibleServices = useMemo(() => {
    const start = (currentPage - 1) * SERVICES_PER_PAGE;
    return allServices.slice(start, start + SERVICES_PER_PAGE);
  }, [allServices, currentPage]);

  const trustNoteMap: Record<string, string> = {
    experts: 'Qualified dental specialists across general, cosmetic, orthodontic & implant care.',
    hygienic: 'Strict 7-step sterilization and medical-grade hygiene protocols for every patient.',
    technology: 'Digital X-rays, 3D intraoral scanning and gentle precision instruments.',
    personalized: 'Custom treatment plans tailored to your comfort, schedule and smile goals.',
  };

  const renderTrustIcon = (id: string) => {
    switch (id) {
      case 'experts':
        return <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.1} />;
      case 'hygienic':
        return <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.1} />;
      case 'technology':
        return <ToothSparkleBlueIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" />;
      case 'personalized':
      default:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070FF]" strokeWidth={2.1} />;
    }
  };

  return (
    <div>
      {/* Header: Back Chevron + "Services" */}
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
          Services
        </h1>
      </header>

      <div className="mt-3 space-y-3 sm:space-y-3.5 md:space-y-4">
        {/* Featured Treatment Banner */}
        <section
          aria-label="Complete Dental Care Featured Banner"
          className="relative rounded-[20px] md:rounded-[24px] border border-white/90 shadow-[0_6px_18px_rgba(128,166,214,0.28)] overflow-hidden bg-gradient-to-r from-[#E4F1FF] via-[#9AD2FF] to-[#0074FF] min-h-[152px] sm:min-h-[178px] md:min-h-[196px] flex items-center"
        >
          <div className="relative z-10 w-[62%] sm:w-[58%] px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-[19px] sm:text-[24px] md:text-[28px] font-extrabold text-[#0E1B3B] leading-[1.12] tracking-tight">
              Complete
              <br />
              Dental Care
              <br />
              for a Healthier,
              <br />
              Brighter Smile
            </h2>

            <button
              type="button"
              onClick={() => onBookAppointment(undefined)}
              className="mt-3 sm:mt-4 neu-blue-btn neu-btn-md px-4 py-2 sm:px-5 sm:py-2.5 text-[12px] sm:text-[13.5px] font-extrabold text-white inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-white"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.3} />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-[46%] sm:w-[44%] flex items-end justify-end pr-1 sm:pr-4">
            <img
              src={HERO_TOOTH_SHIELD_SRC}
              alt="3D glowing tooth with protective dental shield"
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[188px] object-contain object-right-bottom"
            />
          </div>
        </section>

        {/* Four Compact Raised Neumorphic Trust Feature Buttons */}
        <section aria-label="Clinic Trust Features">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {TRUST_FEATURES.map((feat) => {
              const isSelected = activeTrustId === feat.id;
              return (
                <button
                  key={feat.id}
                  type="button"
                  data-haptic="selection"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setActiveTrustId((prev) => (prev === feat.id ? null : feat.id))
                  }
                  className={`neu-card-interactive rounded-[15px] sm:rounded-[18px] px-1 py-2.5 sm:px-2 sm:py-3 flex flex-col items-center justify-center text-center min-h-[76px] sm:min-h-[88px] focus-visible:outline-2 focus-visible:outline-[#0070FF] ${
                    isSelected ? 'ring-2 ring-[#0070FF] bg-[#EDF5FF]' : ''
                  }`}
                >
                  {renderTrustIcon(feat.id)}
                  <span className="mt-1.5 text-[10px] sm:text-[12px] font-extrabold text-[#0E1B3B] leading-[1.18]">
                    {feat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTrustId && trustNoteMap[activeTrustId] && (
            <p className="mt-2 rounded-[14px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.2)] px-3.5 py-2.5 text-[12px] font-semibold text-[#1E3158]">
              {trustNoteMap[activeTrustId]}
            </p>
          )}
        </section>

        {/* Our Services Grid */}
        <section aria-label="Our Services" className="space-y-2.5 sm:space-y-3">
          <h2 className="text-[19px] sm:text-[21px] md:text-[23px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            Our Services
          </h2>

          <div
            data-testid="services-grid"
            className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5"
          >
            {visibleServices.map((service) => {
              const imgFailed = failedImages[service.serviceId];
              return (
                <button
                  key={service.serviceId}
                  type="button"
                  data-testid={`service-card-${service.serviceId}`}
                  onClick={() => setSelectedService(service)}
                  className={`relative rounded-[16px] sm:rounded-[20px] h-[98px] sm:h-[118px] md:h-[128px] overflow-hidden neu-service-card ${service.cardGradientClass} flex items-stretch text-left focus-visible:outline-2 focus-visible:outline-[#0070FF]`}
                >
                  {/* Left Visual Preview fading seamlessly into the card gradient */}
                  <div className="relative w-[49%] h-full shrink-0 overflow-hidden service-card-img-fade">
                    {!imgFailed ? (
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [service.serviceId]: true,
                          }))
                        }
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/25" />
                    )}
                    {service.showDentalMirrorOverlay && !imgFailed && (
                      <CardMirrorCornerAccent />
                    )}
                  </div>

                  {/* Right Service Title + Bottom-Right Rounded-Square Chevron */}
                  <div className="relative z-10 flex-1 flex flex-col justify-between p-2.5 sm:p-3.5 pl-0.5 sm:pl-1">
                    <span className="text-[12.5px] sm:text-[14.5px] md:text-[15.5px] font-extrabold text-white leading-[1.18] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] line-clamp-3">
                      {service.serviceName}
                    </span>

                    <div className="flex justify-end">
                      <span
                        className="neu-service-chevron w-6 h-6 sm:w-7 sm:h-7 neu-icon-square bg-white text-[#0E1B3B] shadow-[0_2px_6px_rgba(14,27,59,0.22)] flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.8} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Compact Rounded-Square Pagination matching Reviews */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            navAriaLabel="Services Pagination"
            pageLabelPrefix="Services page"
            inactiveDotClassName="bg-[#B7CEE8] hover:bg-[#7BA9E2]"
          />
        </section>

        {/* Bottom Consultation Banner */}
        <section
          aria-label="Personalized Consultation Banner"
          className="relative rounded-[20px] md:rounded-[24px] border border-white/90 shadow-[0_6px_18px_rgba(128,166,214,0.28)] overflow-hidden bg-gradient-to-r from-[#F0F7FF] via-[#DCEEFF] to-[#98D2FF] min-h-[126px] sm:min-h-[144px] flex items-stretch"
        >
          <div className="relative w-[36%] sm:w-[32%] shrink-0 overflow-hidden service-card-img-fade">
            <img
              src={CONSULT_DOCTOR_SRC}
              alt="Smiling dental specialist ready to help you choose a treatment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[72%_18%]"
            />
          </div>

          <div className="relative z-10 flex-1 py-3.5 pr-4 pl-2 sm:py-4 sm:pr-6 flex flex-col justify-center">
            <h3 className="text-[14px] sm:text-[16.5px] font-extrabold text-[#0E1B3B] leading-[1.22]">
              Not Sure Which Treatment You Need?
            </h3>
            <p className="mt-1 text-[11px] sm:text-[12.5px] font-medium text-[#1E3158] leading-[1.3]">
              Book a consultation with our experts for a personalized treatment plan.
            </p>
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => onBookAppointment(undefined)}
                className="neu-blue-btn neu-btn-md px-4 py-2 text-[12px] sm:text-[13px] font-extrabold text-white inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0070FF]"
              >
                <Calendar className="w-3.5 h-3.5" strokeWidth={2.3} />
                <span>Consult Now</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Reusable Responsive Service Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookAppointment={(service) => onBookAppointment(service)}
      />
    </div>
  );
}
