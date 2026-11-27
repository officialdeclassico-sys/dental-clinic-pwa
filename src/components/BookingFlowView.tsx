import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Loader2,
  MapPin,
  Sparkles,
  User,
  UserRound,
} from 'lucide-react';
import {
  AppointmentRecord,
  BOOKING_API_CONFIG,
  BOOKING_SERVICES,
  BookingTreatmentId,
  CLINIC_BRANCHES,
  CLINIC_DENTISTS,
  TimeSlotOption,
  createAppointment,
  fetchSlotAvailability,
  formatDisplayDateParts,
  getSavedCustomerProfile,
} from '../data/appointmentsRepository';
import { BookingCalendarPicker } from './BookingCalendarPicker';
import { ServiceCatalogItem } from '../data/servicesData';
import { triggerErrorHaptic, triggerLightHaptic, triggerSuccessHaptic } from '../utils/haptics';

interface BookingFlowViewProps {
  initialTreatmentId?: BookingTreatmentId;
  preselectedService?: ServiceCatalogItem | null;
  applyOffer?: boolean;
  onBack: () => void;
  onDoneToAppointments?: () => void;
  onViewMyAppointments: () => void;
  onBookingCreated: (record: AppointmentRecord) => void;
}

const STEP_LABELS = [
  'Treatment',
  'Branch',
  'Dentist',
  'Date',
  'Time Slot',
  'Details',
  'Review',
];

function getDefaultFutureDateIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function BookingFlowView({
  initialTreatmentId,
  preselectedService = null,
  applyOffer = false,
  onBack,
  onDoneToAppointments,
  onViewMyAppointments,
  onBookingCreated,
}: BookingFlowViewProps) {
  const [step, setStep] = useState<number>(preselectedService ? 4 : 1);
  const [treatmentId, setTreatmentId] = useState<BookingTreatmentId>(
    preselectedService?.bookingTreatmentId ?? initialTreatmentId ?? 'general'
  );
  const [branchId, setBranchId] = useState<string>(CLINIC_BRANCHES[0].branchId);
  const [dentistId, setDentistId] = useState<string>('any-available');
  const [appointmentDate, setAppointmentDate] = useState<string>(getDefaultFutureDateIso);
  const [slots, setSlots] = useState<TimeSlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption | null>(null);

  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reasonForVisit, setReasonForVisit] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    email?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const submitLockRef = useRef<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedRecord, setConfirmedRecord] = useState<AppointmentRecord | null>(null);

  // Scroll to top when entering booking flow or changing step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [step, confirmedRecord]);

  // Pre-populate saved customer profile once on mount
  useEffect(() => {
    const profile = getSavedCustomerProfile();
    if (profile.fullName) setFullName(profile.fullName);
    if (profile.mobileNumber) setMobileNumber(profile.mobileNumber);
    if (profile.email) setEmail(profile.email);
  }, []);

  // Sync treatment & initial step if preselected service changes on entry
  useEffect(() => {
    if (preselectedService) {
      setTreatmentId(preselectedService.bookingTreatmentId);
      setStep(4);
    } else if (initialTreatmentId) {
      setTreatmentId(initialTreatmentId);
    }
  }, [initialTreatmentId, preselectedService]);

  const selectedService = useMemo(() => {
    const base =
      BOOKING_SERVICES.find((s) => s.treatmentId === treatmentId) ?? BOOKING_SERVICES[0];
    if (
      preselectedService &&
      preselectedService.bookingTreatmentId === treatmentId
    ) {
      return {
        ...base,
        name: preselectedService.serviceName,
        durationMinutes: preselectedService.durationMinutes,
        subtitle: preselectedService.category,
      };
    }
    return base;
  }, [treatmentId, preselectedService]);

  const selectedBranch = useMemo(
    () => CLINIC_BRANCHES.find((b) => b.branchId === branchId) ?? CLINIC_BRANCHES[0],
    [branchId]
  );

  const availableDentists = useMemo(
    () =>
      CLINIC_DENTISTS.filter(
        (d) =>
          d.branchId === branchId &&
          (d.dentistId === 'any-available' || d.supportedTreatments.includes(treatmentId))
      ),
    [branchId, treatmentId]
  );

  // Reset dentist cleanly if treatment switched to one they don't support
  useEffect(() => {
    const stillValid = availableDentists.some((d) => d.dentistId === dentistId);
    if (!stillValid) {
      setDentistId('any-available');
    }
  }, [availableDentists, dentistId]);

  const selectedDentist = useMemo(
    () =>
      availableDentists.find((d) => d.dentistId === dentistId) ??
      availableDentists[0] ??
      CLINIC_DENTISTS[0],
    [availableDentists, dentistId]
  );

  // Load slot availability whenever date, dentist, or service duration changes
  useEffect(() => {
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);
    fetchSlotAvailability({
      dateIso: appointmentDate,
      dentistId,
      durationMinutes: selectedService.durationMinutes,
    })
      .then((result) => {
        if (cancelled) return;
        setSlots(result);
        setSelectedSlot((prev) => {
          if (prev && result.some((s) => s.startTime === prev.startTime && s.available)) {
            return prev;
          }
          return null;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setSlotsError('Unable to load slot availability. Please retry.');
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appointmentDate, dentistId, selectedService.durationMinutes]);

  const validateDetails = (): boolean => {
    const errors: { fullName?: string; mobileNumber?: string; email?: string } = {};
    if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter patient full name (at least 2 characters).';
    }
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address or leave blank.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (step === 5 && !selectedSlot) {
      triggerErrorHaptic();
      setSubmitError('Please select an available time slot to continue.');
      return;
    }
    if (step === 6 && !validateDetails()) {
      triggerErrorHaptic();
      return;
    }
    if (step < 7) {
      triggerLightHaptic();
      setStep((s) => s + 1);
    }
  };

  const handleStepBack = () => {
    setSubmitError(null);
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      onBack();
    }
  };

  const handleConfirmBooking = async () => {
    if (submitLockRef.current || isSubmitting) return;
    if (!selectedSlot) {
      triggerErrorHaptic();
      setSubmitError('Please choose an available time slot first.');
      setStep(5);
      return;
    }
    if (!validateDetails()) {
      triggerErrorHaptic();
      setStep(6);
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await createAppointment({
        branchId,
        treatmentId,
        treatmentNameOverride:
          preselectedService && preselectedService.bookingTreatmentId === treatmentId
            ? preselectedService.serviceName
            : undefined,
        dentistId,
        appointmentDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        patientName: fullName,
        patientPhone: mobileNumber,
        patientEmail: email,
        reasonForVisit,
      });
      triggerSuccessHaptic();
      setConfirmedRecord(created);
      onBookingCreated(created);
    } catch (err) {
      triggerErrorHaptic();
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not save your appointment. Please try another slot.'
      );
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // Confirmation Screen
  if (confirmedRecord) {
    const dateParts = formatDisplayDateParts(confirmedRecord.appointmentDate);
    const goAppointments = onDoneToAppointments ?? onBack;
    return (
      <div>
        <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
          <button
            type="button"
            onClick={goAppointments}
            aria-label="Back to Appointments"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            Booking Confirmation
          </h1>
        </header>

        <div className="mt-3 space-y-3.5 sm:space-y-4">
          <div className="neu-card rounded-[22px] p-5 sm:p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E3F0FF] flex items-center justify-center mx-auto text-[#0070FF]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="mt-3 text-[20px] font-extrabold text-[#0E1B3B]">
              Appointment Request Saved
            </h2>
            <p className="mt-1.5 text-[13px] font-medium text-[#425478] max-w-[380px] mx-auto leading-relaxed">
              Your slot request has been recorded with reference{' '}
              <span className="font-extrabold text-[#0E1B3B] tabular-nums">
                {confirmedRecord.appointmentId}
              </span>
              .
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#9A5B00] text-[12px] font-extrabold">
                <Clock className="w-3.5 h-3.5" />
                Status: {confirmedRecord.status}
              </span>
              {!BOOKING_API_CONFIG.isBackendConnected && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F2FE] text-[#1E3A6D] text-[11.5px] font-bold">
                  Saved Locally (Preview Mode)
                </span>
              )}
            </div>

            <div className="mt-5 rounded-[18px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.18)] p-4 text-left space-y-2.5">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EAF1FA]">
                <span className="text-[12px] font-bold text-[#425478]">Treatment</span>
                <span className="text-[13.5px] font-extrabold text-[#0E1B3B] text-right">
                  {confirmedRecord.treatmentName}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EAF1FA]">
                <span className="text-[12px] font-bold text-[#425478]">Dentist</span>
                <span className="text-[13.5px] font-extrabold text-[#0E1B3B] text-right">
                  {confirmedRecord.dentistName}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EAF1FA]">
                <span className="text-[12px] font-bold text-[#425478]">Date & Time</span>
                <span className="text-[13.5px] font-extrabold text-[#0070FF] text-right tabular-nums">
                  {dateParts.fullFormatted} • {confirmedRecord.startTime}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[12px] font-bold text-[#425478]">Clinic Branch</span>
                <div className="text-right">
                  <span className="block text-[13px] font-extrabold text-[#0E1B3B]">
                    {confirmedRecord.branchName}
                  </span>
                  <span className="block text-[11.5px] font-medium text-[#425478]">
                    {selectedBranch.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onViewMyAppointments}
                className="flex-1 neu-blue-btn rounded-[15px] py-3 px-4 text-[14px] font-extrabold text-white"
              >
                View My Appointments
              </button>
              <button
                type="button"
                onClick={goAppointments}
                className="sm:w-auto px-5 py-3 rounded-[15px] bg-white border border-[#D4E2F4] hover:bg-[#EFF6FF] text-[13.5px] font-bold text-[#0E1B3B] neu-press-surface"
              >
                Back to Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedDateParts = formatDisplayDateParts(appointmentDate);

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between gap-3 pt-3.5 md:pt-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={handleStepBack}
            aria-label="Back"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
              Book Appointment
            </h1>
            <p className="text-[11.5px] font-bold text-[#0070FF] mt-1">
              Step {step} of 7 • {STEP_LABELS[step - 1]}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-3 space-y-3.5">
        {/* Progress Bar */}
        <div className="neu-card rounded-[16px] p-3">
          <div className="grid grid-cols-7 gap-1.5">
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              const clickable = stepNum < step || (stepNum === 5 && Boolean(selectedSlot));
              return (
                <button
                  key={label}
                  type="button"
                  data-haptic="selection"
                  disabled={!clickable}
                  onClick={() => clickable && setStep(stepNum)}
                  title={label}
                  className="flex flex-col items-center gap-1 rounded-[8px] py-0.5 neu-press-soft disabled:cursor-default"
                >
                  <span
                    className={`w-full h-1.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#0070FF]'
                        : isDone
                          ? 'bg-[#64ACFF]'
                          : 'bg-[#D6E5F7]'
                    }`}
                  />
                  <span
                    className={`text-[9.5px] sm:text-[10.5px] font-bold truncate max-w-full ${
                      isActive ? 'text-[#0070FF]' : 'text-[#425478]'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {preselectedService && preselectedService.bookingTreatmentId === treatmentId && (
          <div
            data-testid="preselected-service-banner"
            className="rounded-[15px] bg-[#E9F3FF] border border-[#BDDCFF] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12.5px]"
          >
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#0070FF] uppercase tracking-wide">
                Selected Service
              </span>
              <span className="block font-extrabold text-[#0E1B3B] truncate">
                {selectedService.name} • {selectedService.durationMinutes} mins
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[12px] font-bold text-[#0070FF] hover:underline shrink-0 rounded-[8px] neu-press-soft px-1.5 py-0.5"
            >
              Change
            </button>
          </div>
        )}

        {applyOffer && (
          <div className="rounded-[15px] bg-[#E3F0FF] border border-[#BDDCFF] px-3.5 py-2.5 flex items-center gap-2 text-[12.5px] font-bold text-[#005CE6]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>New Patient Offer applied: Up to 20% OFF on Dental Check-up</span>
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            className="rounded-[15px] bg-[#FEECEC] border border-[#F5BDBD] px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] font-bold text-[#9F1D1D]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Step 1: Select Treatment */}
        {step === 1 && (
          <section className="neu-card rounded-[20px] p-4 space-y-2.5">
            <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">
              1. Select Dental Treatment
            </h2>
            <div className="space-y-2">
              {BOOKING_SERVICES.map((service) => {
                const selected = service.treatmentId === treatmentId;
                return (
                  <button
                    key={service.treatmentId}
                    type="button"
                    data-haptic="selection"
                    onClick={() => setTreatmentId(service.treatmentId)}
                    className={`w-full text-left rounded-[15px] p-3.5 border neu-press-surface flex items-center justify-between gap-3 ${
                      selected
                        ? 'bg-[#E8F2FE] border-2 border-[#0070FF]'
                        : 'bg-white/85 border-white hover:bg-[#F3F8FE] shadow-[0_2px_8px_rgba(140,174,216,0.18)]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[14px] font-extrabold text-[#0E1B3B]">
                        {service.name}
                      </span>
                      <span className="block text-[12px] font-medium text-[#425478] mt-0.5">
                        {service.subtitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-bold text-[#0070FF] bg-white px-2.5 py-1 rounded-full border border-[#D4E4F8]">
                        {service.durationMinutes} min
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          selected
                            ? 'bg-[#0070FF] border-[#0070FF] text-white'
                            : 'bg-white border-[#C5D8F0]'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 2: Select Branch */}
        {step === 2 && (
          <section className="neu-card rounded-[20px] p-4 space-y-2.5">
            <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">
              2. Select Clinic Branch
            </h2>
            <div className="space-y-2">
              {CLINIC_BRANCHES.map((branch) => {
                const selected = branch.branchId === branchId;
                return (
                  <button
                    key={branch.branchId}
                    type="button"
                    data-haptic="selection"
                    onClick={() => setBranchId(branch.branchId)}
                    className={`w-full text-left rounded-[15px] p-3.5 border neu-press-surface flex items-start justify-between gap-3 ${
                      selected
                        ? 'bg-[#E8F2FE] border-2 border-[#0070FF]'
                        : 'bg-white/85 border-white hover:bg-[#F3F8FE] shadow-[0_2px_8px_rgba(140,174,216,0.18)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-white border border-[#D5E4F7] flex items-center justify-center text-[#0070FF] shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[14.5px] font-extrabold text-[#0E1B3B]">
                          {branch.name}
                        </span>
                        <span className="flex items-start gap-1 text-[12px] font-medium text-[#425478] mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0070FF] shrink-0 mt-0.5" />
                          <span>{branch.address}</span>
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 mt-1 ${
                        selected
                          ? 'bg-[#0070FF] border-[#0070FF] text-white'
                          : 'bg-white border-[#C5D8F0]'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 3: Select Dentist */}
        {step === 3 && (
          <section className="neu-card rounded-[20px] p-4 space-y-2.5">
            <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">
              3. Select Dentist
            </h2>
            <p className="text-[12px] font-semibold text-[#425478]">
              Specialists available for {selectedService.name} at {selectedBranch.name}
            </p>
            <div className="space-y-2">
              {availableDentists.map((dentist) => {
                const selected = dentist.dentistId === dentistId;
                return (
                  <button
                    key={dentist.dentistId}
                    type="button"
                    data-haptic="selection"
                    onClick={() => setDentistId(dentist.dentistId)}
                    className={`w-full text-left rounded-[15px] p-3.5 border neu-press-surface flex items-center justify-between gap-3 ${
                      selected
                        ? 'bg-[#E8F2FE] border-2 border-[#0070FF]'
                        : 'bg-white/85 border-white hover:bg-[#F3F8FE] shadow-[0_2px_8px_rgba(140,174,216,0.18)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[12px] bg-white border border-[#D5E4F7] flex items-center justify-center text-[#0070FF] shrink-0">
                        <UserRound className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[14px] font-extrabold text-[#0E1B3B] truncate">
                          {dentist.name}
                        </span>
                        <span className="block text-[12px] font-medium text-[#425478] truncate">
                          {dentist.specialty}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                        selected
                          ? 'bg-[#0070FF] border-[#0070FF] text-white'
                          : 'bg-white border-[#C5D8F0]'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 4: Select Date */}
        {step === 4 && (
          <section className="space-y-2.5">
            <BookingCalendarPicker
              mode="date-only"
              selectedDate={appointmentDate}
              onSelectDate={(iso) => {
                setAppointmentDate(iso);
                setSelectedSlot(null);
              }}
            />
          </section>
        )}

        {/* Step 5: Select Time Slot */}
        {step === 5 && (
          <section className="space-y-2.5">
            <BookingCalendarPicker
              mode="slot-only"
              selectedDate={appointmentDate}
              onSelectDate={setAppointmentDate}
              slots={slots}
              slotsLoading={slotsLoading}
              slotsError={slotsError}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setSubmitError(null);
              }}
            />
          </section>
        )}

        {/* Step 6: Appointment Details */}
        {step === 6 && (
          <section className="neu-card rounded-[20px] p-4 space-y-3">
            <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">
              6. Patient Details
            </h2>

            <div>
              <label
                htmlFor="booking-full-name"
                className="block text-[12px] font-bold text-[#1A2B50] mb-1"
              >
                Full Name <span className="text-[#D93838]">*</span>
              </label>
              <input
                id="booking-full-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: undefined }));
                }}
                placeholder="Enter patient full name"
                className="w-full h-11 rounded-[12px] bg-white border border-[#D4E2F4] px-3.5 text-[13.5px] font-semibold text-[#0E1B3B] focus:outline-2 focus:outline-[#0070FF]"
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-[11.5px] font-bold text-[#C62828]">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-mobile"
                className="block text-[12px] font-bold text-[#1A2B50] mb-1"
              >
                Mobile Number <span className="text-[#D93838]">*</span>
              </label>
              <input
                id="booking-mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  if (fieldErrors.mobileNumber)
                    setFieldErrors((p) => ({ ...p, mobileNumber: undefined }));
                }}
                placeholder="e.g. +91 98490 12345"
                className="w-full h-11 rounded-[12px] bg-white border border-[#D4E2F4] px-3.5 text-[13.5px] font-semibold text-[#0E1B3B] focus:outline-2 focus:outline-[#0070FF]"
              />
              {fieldErrors.mobileNumber && (
                <p className="mt-1 text-[11.5px] font-bold text-[#C62828]">
                  {fieldErrors.mobileNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-email"
                className="block text-[12px] font-bold text-[#1A2B50] mb-1"
              >
                Email Address (Optional)
              </label>
              <input
                id="booking-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="patient@example.com"
                className="w-full h-11 rounded-[12px] bg-white border border-[#D4E2F4] px-3.5 text-[13.5px] font-semibold text-[#0E1B3B] focus:outline-2 focus:outline-[#0070FF]"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[11.5px] font-bold text-[#C62828]">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-notes"
                className="block text-[12px] font-bold text-[#1A2B50] mb-1"
              >
                Reason for Visit / Notes (Optional)
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="Describe any symptoms, preferences, or questions for the dentist..."
                className="w-full rounded-[12px] bg-white border border-[#D4E2F4] p-3 text-[13px] font-medium text-[#0E1B3B] focus:outline-2 focus:outline-[#0070FF]"
              />
            </div>
          </section>
        )}

        {/* Step 7: Review and Confirm */}
        {step === 7 && (
          <section className="neu-card rounded-[20px] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">
                7. Review & Confirm Appointment
              </h2>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#0070FF] hover:underline rounded-[8px] neu-press-soft px-1.5 py-0.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Details
              </button>
            </div>

            <div className="rounded-[16px] bg-white/85 border border-white shadow-[0_3px_10px_rgba(140,174,216,0.18)] divide-y divide-[#EAF1FA]">
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#425478]">Treatment</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[13px] font-extrabold text-[#0E1B3B] hover:text-[#0070FF] text-right rounded-[8px] neu-press-soft px-1.5 py-0.5"
                >
                  {selectedService.name} ({selectedService.durationMinutes} min)
                </button>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#425478]">Clinic Branch</span>
                <span className="text-[13px] font-extrabold text-[#0E1B3B] text-right">
                  {selectedBranch.name}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#425478]">Dentist</span>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[13px] font-extrabold text-[#0E1B3B] hover:text-[#0070FF] text-right rounded-[8px] neu-press-soft px-1.5 py-0.5"
                >
                  {selectedDentist.name}
                </button>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#425478]">Date & Time</span>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-[13px] font-extrabold text-[#0070FF] text-right tabular-nums rounded-[8px] neu-press-soft px-1.5 py-0.5"
                >
                  {formattedDateParts.fullFormatted} • {selectedSlot?.startTime ?? '—'}
                </button>
              </div>
              <div className="p-3 space-y-1">
                <span className="block text-[12px] font-bold text-[#425478]">Patient</span>
                <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#0E1B3B]">
                  <User className="w-3.5 h-3.5 text-[#0070FF]" />
                  <span>{fullName}</span>
                </div>
                <span className="block text-[12.5px] font-semibold text-[#1E3158] tabular-nums">
                  {mobileNumber}
                  {email.trim() ? ` • ${email.trim()}` : ''}
                </span>
                {reasonForVisit.trim() && (
                  <p className="text-[12px] text-[#425478] pt-0.5">
                    Notes: {reasonForVisit.trim()}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Navigation Footer Actions */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleStepBack}
            className="px-4 py-3 rounded-[15px] neu-card-interactive text-[13.5px] font-extrabold text-[#0E1B3B]"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 7 ? (
            <button
              type="button"
              data-haptic="deferred"
              onClick={handleNext}
              className="flex-1 neu-blue-btn rounded-[15px] py-3 px-5 text-[14.5px] font-extrabold text-white flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" strokeWidth={2.8} />
            </button>
          ) : (
            <button
              type="button"
              data-haptic="deferred"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="flex-1 neu-blue-btn rounded-[15px] py-3 px-5 text-[14.5px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
