import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Calendar,
  CalendarPlus,
  CalendarX2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  Loader2,
  User,
} from 'lucide-react';
import {
  AppointmentRecord,
  BookingTreatmentId,
  formatDisplayDateParts,
  isUpcomingAppointment,
  sortAppointmentsNearestFirst,
} from '../data/appointmentsRepository';

const APPOINTMENTS_HERO_IMAGE =
  '/src/assets/images/about_clinic_interior_1795594382732.jpg';

interface AppointmentsPageProps {
  appointments: AppointmentRecord[];
  loading: boolean;
  onBack: () => void;
  onBookNew: (preselectedTreatment?: BookingTreatmentId) => void;
  onOpenMyAppointments: () => void;
  onOpenHistory: () => void;
  onOpenReminders: () => void;
  onOpenCancelReschedule: (appointmentId?: string) => void;
}

function ToothOutlineBlueIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function ToothSparkleIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M11 7.2c-2.8 0-4.9 2.2-4.9 5.1 0 3.1 1.5 5.5 2.2 8.7.6 2.5 1.2 6.4 3 6.4 1.5 0 1.9-2.8 2.9-5 .5-1 1.2-1.4 2.1-1.4s1.6.4 2.1 1.4c1 2.2 1.4 5 2.9 5 1.8 0 2.4-3.9 3-6.4.7-3.2 2.2-5.6 2.2-8.7 0-2.9-2.1-5.1-4.9-5.1-1.7 0-3 .7-4 1.3-.8.5-2.2.5-3 0-1-.6-2.3-1.3-4-1.3Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 3.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BracesOutlineIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="10" width="7.2" height="12" rx="3.2" stroke="currentColor" strokeWidth="2" />
      <rect x="12.4" y="10" width="7.2" height="12" rx="3.2" stroke="currentColor" strokeWidth="2" />
      <rect x="20.3" y="10" width="7.2" height="12" rx="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 16h26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="6.7" y="14.2" width="2.8" height="3.6" rx="0.8" fill="currentColor" />
      <rect x="14.6" y="14.2" width="2.8" height="3.6" rx="0.8" fill="currentColor" />
      <rect x="22.5" y="14.2" width="2.8" height="3.6" rx="0.8" fill="currentColor" />
    </svg>
  );
}

function ImplantOutlineIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.6 5.2c-2.2 0-3.8 1.6-3.8 3.9 0 2 1 3.7 1.6 5.4.4 1.1 1.4 1.8 2.6 1.8h8c1.2 0 2.2-.7 2.6-1.8.6-1.7 1.6-3.4 1.6-5.4 0-2.3-1.6-3.9-3.8-3.9-1.3 0-2.4.6-3.2 1.1-.7.4-1.7.4-2.4 0-.8-.5-1.9-1.1-3.2-1.1Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 16.5v2.2h7v-2.2M12.2 21h7.6M12.7 24h6.6M13.5 27h5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppointmentsPage({
  appointments,
  loading,
  onBack,
  onBookNew,
  onOpenMyAppointments,
  onOpenHistory,
  onOpenReminders,
  onOpenCancelReschedule,
}: AppointmentsPageProps) {
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const nearestUpcoming = useMemo(() => {
    const upcoming = sortAppointmentsNearestFirst(
      appointments.filter(isUpcomingAppointment)
    );
    return upcoming[0] ?? null;
  }, [appointments]);

  const dateParts = nearestUpcoming
    ? formatDisplayDateParts(nearestUpcoming.appointmentDate)
    : null;

  const serviceCards: {
    id: BookingTreatmentId;
    line1: string;
    line2: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'general',
      line1: 'General',
      line2: 'Dentistry',
      icon: <ToothSparkleIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" />,
    },
    {
      id: 'orthodontics',
      line1: 'Orthodontics',
      line2: '(Braces)',
      icon: <BracesOutlineIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" />,
    },
    {
      id: 'implants',
      line1: 'Dental',
      line2: 'Implants',
      icon: <ImplantOutlineIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" />,
    },
    {
      id: 'cosmetic',
      line1: 'Cosmetic',
      line2: 'Dentistry',
      icon: <ToothSparkleIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" />,
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
          Appointments
        </h1>
      </header>

      <div className="mt-3 space-y-3.5 sm:space-y-4 md:space-y-5">
        {/* Hero Banner */}
        <section
          aria-label="Book Your Dental Appointment"
          className="relative rounded-[22px] md:rounded-[26px] border border-white/85 shadow-[0_8px_20px_rgba(0,95,215,0.22)] overflow-hidden h-[194px] sm:h-[225px] md:h-[268px] lg:h-[300px] bg-gradient-to-br from-[#1FA2FF] via-[#0771FF] to-[#0052DC]"
        >
          {!heroImgError && (
            <img
              src={APPOINTMENTS_HERO_IMAGE}
              alt="Modern SmileCare dental clinic chair and treatment room"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
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
              <linearGradient id="apptHeroBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B9CFF" />
                <stop offset="60%" stopColor="#056FFF" />
                <stop offset="100%" stopColor="#0052DC" />
              </linearGradient>
            </defs>
            <path
              d="M0 0 H248 C215 62, 200 144, 175 220 H0 Z"
              fill="url(#apptHeroBlue)"
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
              <span className="block">Book Your</span>
              <span className="block">Dental</span>
              <span className="block">Appointment</span>
            </h2>
            <p className="mt-2 md:mt-3 text-[11.5px] sm:text-[13.5px] md:text-[15.5px] font-medium text-white/95 leading-snug max-w-[200px] sm:max-w-[280px] md:max-w-[340px]">
              Schedule a visit with our expert dental team.
            </p>
          </div>
        </section>

        {/* Primary CTA Button Bar */}
        <button
          type="button"
          onClick={() => onBookNew()}
          className="w-full neu-blue-btn neu-btn-lg px-5 sm:px-7 py-3.5 md:py-4 flex items-center justify-between gap-3 text-white focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <span className="flex items-center gap-3.5 sm:gap-4">
            <CalendarPlus className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" strokeWidth={2.1} />
            <span className="text-[17px] sm:text-[19px] md:text-[21px] font-extrabold tracking-tight">
              Book New Appointment
            </span>
          </span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" strokeWidth={2.8} />
        </button>

        {/* Four Shortcut Cards */}
        <section
          aria-label="Appointment Actions"
          className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4"
        >
          <button
            type="button"
            onClick={onOpenMyAppointments}
            className="neu-card-interactive rounded-[16px] md:rounded-[18px] px-1.5 sm:px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center min-h-[90px] sm:min-h-[104px]"
          >
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" strokeWidth={2} />
            <span className="mt-2 text-[10.5px] sm:text-[12px] md:text-[13.5px] font-extrabold text-[#0E1B3B] leading-[1.18]">
              My
              <br />
              Appointments
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="neu-card-interactive rounded-[16px] md:rounded-[18px] px-1.5 sm:px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center min-h-[90px] sm:min-h-[104px]"
          >
            <History className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" strokeWidth={2} />
            <span className="mt-2 text-[10.5px] sm:text-[12px] md:text-[13.5px] font-extrabold text-[#0E1B3B] leading-[1.18]">
              Appointment
              <br />
              History
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenReminders}
            className="neu-card-interactive rounded-[16px] md:rounded-[18px] px-1.5 sm:px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center min-h-[90px] sm:min-h-[104px]"
          >
            <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" strokeWidth={2} />
            <span className="mt-2 text-[10.5px] sm:text-[12px] md:text-[13.5px] font-extrabold text-[#0E1B3B] leading-[1.18]">
              Reminders
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCancelReschedule()}
            className="neu-card-interactive rounded-[16px] md:rounded-[18px] px-1.5 sm:px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center min-h-[90px] sm:min-h-[104px]"
          >
            <CalendarX2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#0070FF]" strokeWidth={2} />
            <span className="mt-2 text-[10.5px] sm:text-[12px] md:text-[13.5px] font-extrabold text-[#0E1B3B] leading-[1.18]">
              Cancel /
              <br />
              Reschedule
            </span>
          </button>
        </section>

        {/* Upcoming Appointment Section */}
        <section
          aria-label="Upcoming Appointment"
          className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[17px] sm:text-[19px] md:text-[21px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
              Upcoming Appointment
            </h2>
            <button
              type="button"
              onClick={onOpenMyAppointments}
              className="text-[13.5px] sm:text-[14.5px] font-bold text-[#0070FF] hover:underline rounded-[8px] neu-press-soft px-1.5 py-0.5"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="mt-3 rounded-[16px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.2)] p-5 flex items-center justify-center gap-2 text-[#425478]">
              <Loader2 className="w-5 h-5 text-[#0070FF] animate-spin" />
              <span className="text-[13px] font-semibold">Loading upcoming visit...</span>
            </div>
          ) : nearestUpcoming && dateParts ? (
            <div className="mt-3 rounded-[16px] md:rounded-[18px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.2)] p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-3.5">
              {/* Date Box */}
              <div className="w-[62px] sm:w-[72px] rounded-[13px] bg-[#E8F1FD] py-2 px-1.5 text-center shrink-0">
                <span className="block text-[11px] sm:text-[12px] font-bold text-[#1A2B50] leading-tight">
                  {dateParts.weekday}
                </span>
                <span className="block text-[22px] sm:text-[25px] font-extrabold text-[#0E1B3B] leading-tight tabular-nums my-0.5">
                  {dateParts.day}
                </span>
                <span className="block text-[11px] sm:text-[12px] font-bold text-[#1A2B50] leading-tight">
                  {dateParts.month}
                </span>
              </div>

              <div className="w-px self-stretch bg-[#E0EBF8] shrink-0" aria-hidden="true" />

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-[#0E1B3B]">
                  <ToothOutlineBlueIcon className="w-4 h-4 text-[#0070FF] shrink-0" />
                  <span className="text-[14px] sm:text-[15.5px] font-extrabold truncate">
                    {nearestUpcoming.treatmentName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1E3158]">
                  <User className="w-3.5 h-3.5 text-[#425478] shrink-0" />
                  <span className="text-[12px] sm:text-[13px] font-semibold truncate">
                    {nearestUpcoming.dentistName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1E3158]">
                  <Clock className="w-3.5 h-3.5 text-[#425478] shrink-0" />
                  <span className="text-[12px] sm:text-[13px] font-semibold tabular-nums">
                    {nearestUpcoming.startTime}
                  </span>
                </div>
              </div>

              {/* Status & Reschedule CTA */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 neu-btn-sm text-[11px] sm:text-[12px] font-extrabold ${
                      nearestUpcoming.status === 'Confirmed'
                        ? 'bg-[#D7F5E5] text-[#117A45]'
                        : 'bg-[#FEF3C7] text-[#9A5B00]'
                    }`}
                  >
                    {nearestUpcoming.status === 'Confirmed' && (
                      <span className="w-4 h-4 rounded-full bg-[#1CA861] text-white inline-flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" strokeWidth={3.2} />
                      </span>
                    )}
                    {nearestUpcoming.status}
                  </span>
                  {nearestUpcoming.isSamplePreview && (
                    <span className="text-[9.5px] font-bold text-[#5B7096] px-1.5">
                      Sample Preview
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCancelReschedule(nearestUpcoming.appointmentId)}
                  className="px-3 sm:px-3.5 py-1.5 neu-btn-sm bg-white border border-[#8BC0FB] hover:bg-[#EEF6FF] text-[#0070FF] text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_2px_6px_rgba(0,112,255,0.12)] neu-press-surface"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-[16px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.2)] p-4 text-center space-y-2.5">
              <p className="text-[13px] font-bold text-[#425478]">
                No upcoming appointments scheduled.
              </p>
              <button
                type="button"
                onClick={() => onBookNew()}
                className="neu-blue-btn neu-btn-md px-4 py-2 text-[12.5px] font-extrabold text-white"
              >
                Book New Appointment
              </button>
            </div>
          )}
        </section>

        {/* Our Dental Services Section */}
        <section
          aria-label="Our Dental Services"
          className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 md:p-5"
        >
          <h2 className="text-[17px] sm:text-[19px] md:text-[21px] font-extrabold text-[#0E1B3B] tracking-tight leading-none mb-3">
            Our Dental Services
          </h2>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {serviceCards.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onBookNew(service.id)}
                className="neu-card-interactive rounded-[16px] md:rounded-[18px] px-1 sm:px-2.5 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center min-h-[92px] sm:min-h-[108px]"
              >
                {service.icon}
                <span className="mt-2 text-[10.5px] sm:text-[12px] md:text-[13.5px] font-extrabold text-[#0E1B3B] leading-[1.18]">
                  {service.line1}
                  <br />
                  {service.line2}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
