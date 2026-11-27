import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  BellOff,
  Calendar,
  CalendarX2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  History,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  User,
} from 'lucide-react';
import {
  AppointmentRecord,
  AppointmentStatus,
  BOOKING_SERVICES,
  ReminderLeadTime,
  TimeSlotOption,
  cancelAppointment,
  fetchSlotAvailability,
  formatDisplayDateParts,
  isUpcomingAppointment,
  rescheduleAppointment,
  sortAppointmentsNearestFirst,
  updateReminderPreference,
} from '../data/appointmentsRepository';
import { BookingCalendarPicker } from './BookingCalendarPicker';
import {
  triggerErrorHaptic,
  triggerSuccessHaptic,
} from '../utils/haptics';

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    Confirmed: 'bg-[#D7F5E5] text-[#117A45]',
    Pending: 'bg-[#FEF3C7] text-[#9A5B00]',
    Completed: 'bg-[#E3F0FF] text-[#005CE6]',
    Cancelled: 'bg-[#FEECEC] text-[#B91C1C]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 neu-btn-sm text-[11px] font-extrabold ${styles[status]}`}
    >
      {status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />}
      {status}
    </span>
  );
}

function AppointmentDetailPanel({ record }: { record: AppointmentRecord }) {
  const dateParts = formatDisplayDateParts(record.appointmentDate);
  return (
    <div className="mt-3 pt-3 border-t border-[#E1ECF9] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
      <div>
        <span className="text-[#425478] font-semibold">Reference ID: </span>
        <span className="font-extrabold text-[#0E1B3B] tabular-nums">{record.appointmentId}</span>
      </div>
      <div>
        <span className="text-[#425478] font-semibold">Branch: </span>
        <span className="font-bold text-[#0E1B3B]">{record.branchName}</span>
      </div>
      <div>
        <span className="text-[#425478] font-semibold">Schedule: </span>
        <span className="font-bold text-[#0E1B3B] tabular-nums">
          {dateParts.fullFormatted} ({record.startTime} – {record.endTime})
        </span>
      </div>
      <div>
        <span className="text-[#425478] font-semibold">Patient: </span>
        <span className="font-bold text-[#0E1B3B]">
          {record.patientName}
          {record.patientPhone ? ` (${record.patientPhone})` : ''}
        </span>
      </div>
      {record.reasonForVisit && (
        <div className="sm:col-span-2">
          <span className="text-[#425478] font-semibold">Reason: </span>
          <span className="font-medium text-[#0E1B3B]">{record.reasonForVisit}</span>
        </div>
      )}
      {record.cancellationReason && (
        <div className="sm:col-span-2 text-[#B91C1C]">
          <span className="font-bold">Cancellation Reason: </span>
          <span>{record.cancellationReason}</span>
        </div>
      )}
      <div className="sm:col-span-2 text-[11px] text-[#5B7096]">
        Booked on {new Date(record.bookingTimestamp).toLocaleString('en-US')} • Tenant{' '}
        {record.clinicTenantId}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. MY APPOINTMENTS VIEW                                                    */
/* -------------------------------------------------------------------------- */

interface MyAppointmentsViewProps {
  appointments: AppointmentRecord[];
  loading: boolean;
  onBack: () => void;
  onBookNew: () => void;
  onOpenCancelReschedule: (appointmentId: string) => void;
}

export function MyAppointmentsView({
  appointments,
  loading,
  onBack,
  onBookNew,
  onOpenCancelReschedule,
}: MyAppointmentsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const upcoming = useMemo(
    () => sortAppointmentsNearestFirst(appointments.filter(isUpcomingAppointment)),
    [appointments]
  );

  return (
    <div>
      <header className="flex items-center justify-between gap-3 pt-3.5 md:pt-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Appointments"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            My Appointments
          </h1>
        </div>
        <button
          type="button"
          onClick={onBookNew}
          className="neu-blue-btn rounded-[12px] px-3.5 py-2 text-[12px] sm:text-[13px] font-extrabold text-white"
        >
          + Book New
        </button>
      </header>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="neu-card rounded-[20px] p-8 flex flex-col items-center gap-2 text-[#425478]">
            <Loader2 className="w-7 h-7 text-[#0070FF] animate-spin" />
            <span className="text-[13px] font-semibold">Loading upcoming appointments...</span>
          </div>
        ) : upcoming.length === 0 ? (
          <div className="neu-card rounded-[20px] p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#E3F0FF] flex items-center justify-center mx-auto text-[#0070FF]">
              <Calendar className="w-7 h-7" />
            </div>
            <h2 className="text-[17px] font-extrabold text-[#0E1B3B]">No Upcoming Appointments</h2>
            <p className="text-[13px] font-medium text-[#425478] max-w-[340px] mx-auto">
              You do not have any upcoming dental visits scheduled right now.
            </p>
            <button
              type="button"
              onClick={onBookNew}
              className="neu-blue-btn rounded-[14px] px-5 py-2.5 text-[13.5px] font-extrabold text-white"
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          upcoming.map((apt) => {
            const parts = formatDisplayDateParts(apt.appointmentDate);
            const isExpanded = expandedId === apt.appointmentId;
            return (
              <article key={apt.appointmentId} className="neu-card rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="w-[58px] rounded-[13px] bg-[#E8F1FD] py-2 px-1 text-center shrink-0">
                    <span className="block text-[10.5px] font-bold text-[#1A2B50]">
                      {parts.weekday}
                    </span>
                    <span className="block text-[20px] font-extrabold text-[#0E1B3B] leading-tight tabular-nums">
                      {parts.day}
                    </span>
                    <span className="block text-[11px] font-bold text-[#1A2B50]">
                      {parts.month}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-[15px] font-extrabold text-[#0E1B3B] truncate">
                        {apt.treatmentName}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        {apt.isSamplePreview && (
                          <span className="px-2 py-0.5 rounded-[8px] bg-[#EDF3FB] border border-[#C8DAF0] text-[#425478] text-[10px] font-bold">
                            Sample Preview
                          </span>
                        )}
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-1 text-[12.5px] font-semibold text-[#1E3158]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0070FF] shrink-0" />
                        <span className="truncate">{apt.dentistName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-[#0070FF] shrink-0" />
                        <span>
                          {apt.startTime} – {apt.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0070FF] shrink-0" />
                        <span className="truncate">{apt.branchName}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenCancelReschedule(apt.appointmentId)}
                        className="px-3.5 py-1.5 neu-btn-sm bg-white border border-[#8BC0FB] hover:bg-[#EEF6FF] text-[#0070FF] text-[12px] font-bold neu-press-surface"
                      >
                        Reschedule / Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : apt.appointmentId)
                        }
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 neu-btn-sm bg-white border border-[#D4E2F4] hover:bg-[#F3F8FE] text-[#0E1B3B] text-[12px] font-bold neu-press-surface"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && <AppointmentDetailPanel record={apt} />}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. APPOINTMENT HISTORY VIEW                                                */
/* -------------------------------------------------------------------------- */

interface AppointmentHistoryViewProps {
  appointments: AppointmentRecord[];
  loading: boolean;
  onBack: () => void;
}

export function AppointmentHistoryView({
  appointments,
  loading,
  onBack,
}: AppointmentHistoryViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const historyItems = useMemo(
    () =>
      appointments
        .filter((a) => !isUpcomingAppointment(a))
        .sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate)),
    [appointments]
  );

  return (
    <div>
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Appointments"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Appointment History
        </h1>
      </header>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="neu-card rounded-[20px] p-8 flex flex-col items-center gap-2 text-[#425478]">
            <Loader2 className="w-7 h-7 text-[#0070FF] animate-spin" />
            <span className="text-[13px] font-semibold">Loading past visits...</span>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="neu-card rounded-[20px] p-6 text-center space-y-2.5">
            <div className="w-14 h-14 rounded-full bg-[#E3F0FF] flex items-center justify-center mx-auto text-[#0070FF]">
              <History className="w-7 h-7" />
            </div>
            <h2 className="text-[17px] font-extrabold text-[#0E1B3B]">No Past Appointments</h2>
            <p className="text-[13px] font-medium text-[#425478]">
              Completed and cancelled appointments will appear here.
            </p>
          </div>
        ) : (
          historyItems.map((apt) => {
            const parts = formatDisplayDateParts(apt.appointmentDate);
            const isExpanded = expandedId === apt.appointmentId;
            return (
              <article key={apt.appointmentId} className="neu-card rounded-[20px] p-3.5 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="w-[58px] rounded-[13px] bg-[#E8F1FD] py-2 px-1 text-center shrink-0">
                    <span className="block text-[10.5px] font-bold text-[#1A2B50]">
                      {parts.weekday}
                    </span>
                    <span className="block text-[20px] font-extrabold text-[#0E1B3B] leading-tight tabular-nums">
                      {parts.day}
                    </span>
                    <span className="block text-[11px] font-bold text-[#1A2B50]">
                      {parts.month}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-[15px] font-extrabold text-[#0E1B3B] truncate">
                        {apt.treatmentName}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        {apt.isSamplePreview && (
                          <span className="px-2 py-0.5 rounded-[8px] bg-[#EDF3FB] border border-[#C8DAF0] text-[#425478] text-[10px] font-bold">
                            Sample Preview
                          </span>
                        )}
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>

                    <p className="mt-1 text-[12.5px] font-semibold text-[#1E3158]">
                      {apt.dentistName} • {apt.startTime}
                    </p>
                    {apt.cancellationReason && (
                      <p className="mt-1 text-[12px] font-semibold text-[#B91C1C]">
                        Reason: {apt.cancellationReason}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : apt.appointmentId)
                      }
                      className="mt-2.5 inline-flex items-center gap-1 px-3.5 py-1.5 neu-btn-sm bg-white border border-[#D4E2F4] hover:bg-[#F3F8FE] text-[#0E1B3B] text-[12px] font-bold neu-press-surface"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'Appointment Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && <AppointmentDetailPanel record={apt} />}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. REMINDERS VIEW                                                          */
/* -------------------------------------------------------------------------- */

interface RemindersViewProps {
  appointments: AppointmentRecord[];
  onBack: () => void;
  onAppointmentsChanged: () => Promise<void>;
}

export function RemindersView({
  appointments,
  onBack,
  onAppointmentsChanged,
}: RemindersViewProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(
    () => {
      if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
      return window.Notification.permission;
    }
  );
  const [feedback, setFeedback] = useState<{ tone: 'info' | 'error' | 'ok'; text: string } | null>(
    null
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const upcoming = useMemo(
    () => sortAppointmentsNearestFirst(appointments.filter(isUpcomingAppointment)),
    [appointments]
  );

  const handleToggleReminder = async (apt: AppointmentRecord) => {
    setSavingId(apt.appointmentId);
    setFeedback(null);
    try {
      await updateReminderPreference({
        appointmentId: apt.appointmentId,
        reminderEnabled: !apt.reminderEnabled,
        reminderLeadTime: apt.reminderLeadTime,
      });
      await onAppointmentsChanged();
    } catch {
      triggerErrorHaptic();
    } finally {
      setSavingId(null);
    }
  };

  const handleChangeLeadTime = async (
    apt: AppointmentRecord,
    leadTime: ReminderLeadTime
  ) => {
    setSavingId(apt.appointmentId);
    setFeedback(null);
    try {
      await updateReminderPreference({
        appointmentId: apt.appointmentId,
        reminderEnabled: true,
        reminderLeadTime: leadTime,
      });
      await onAppointmentsChanged();
    } catch {
      triggerErrorHaptic();
    } finally {
      setSavingId(null);
    }
  };

  const handleEnableBrowserNotifications = async () => {
    setFeedback(null);
    if (typeof window === 'undefined' || !('Notification' in window)) {
      triggerErrorHaptic();
      setNotifPermission('unsupported');
      setFeedback({
        tone: 'error',
        text: 'Browser notifications are not supported on this device/browser.',
      });
      return;
    }
    try {
      const result = await window.Notification.requestPermission();
      setNotifPermission(result);
      if (result === 'granted') {
        triggerSuccessHaptic();
        setFeedback({
          tone: 'ok',
          text: 'Browser notifications enabled! You can send a test reminder below.',
        });
      } else {
        triggerErrorHaptic();
        setFeedback({
          tone: 'error',
          text:
            result === 'denied'
              ? 'Browser notifications are blocked in browser settings. Reminder preferences are still saved in-app.'
              : 'Permission prompt dismissed. Reminder preferences are saved in-app.',
        });
      }
    } catch {
      triggerErrorHaptic();
      setFeedback({
        tone: 'error',
        text: 'Could not request browser notification permission in this embedded view.',
      });
    }
  };

  const handleSendTestNotification = () => {
    setFeedback(null);
    if (typeof window === 'undefined' || !('Notification' in window)) {
      triggerErrorHaptic();
      setFeedback({
        tone: 'error',
        text: 'Browser notifications are unsupported here.',
      });
      return;
    }
    if (window.Notification.permission !== 'granted') {
      triggerErrorHaptic();
      setFeedback({
        tone: 'error',
        text: 'Browser permission is not granted yet. Enable notifications first.',
      });
      return;
    }
    try {
      const nextApt = upcoming[0];
      new window.Notification('SmileCare Appointment Reminder', {
        body: nextApt
          ? `${nextApt.treatmentName} on ${formatDisplayDateParts(nextApt.appointmentDate).fullFormatted} at ${nextApt.startTime}`
          : 'Your appointment reminders are active.',
      });
      triggerSuccessHaptic();
      setFeedback({ tone: 'ok', text: 'Test browser notification sent.' });
    } catch {
      triggerErrorHaptic();
      setFeedback({
        tone: 'error',
        text: 'The browser blocked showing a notification inside this frame.',
      });
    }
  };

  return (
    <div>
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Appointments"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Reminders
        </h1>
      </header>

      <div className="mt-3 space-y-3.5">
        {/* Browser Notification Status Card */}
        <section className="neu-card rounded-[20px] p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0070FF]" />
              <h2 className="text-[15.5px] font-extrabold text-[#0E1B3B]">
                Appointment Notification Alerts
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 neu-btn-sm bg-[#E8F1FD] text-[#1E3A6D] capitalize">
              {notifPermission === 'unsupported' ? 'Unsupported' : notifPermission}
            </span>
          </div>
          <p className="text-[12.5px] font-medium text-[#425478] leading-snug">
            Manage in-app reminder timing for each upcoming appointment. Enable browser notifications
            below when supported by your device.
          </p>

          <div className="flex flex-wrap gap-2">
            {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
              <button
                type="button"
                data-haptic="deferred"
                onClick={handleEnableBrowserNotifications}
                className="neu-blue-btn rounded-[12px] px-4 py-2 text-[12.5px] font-extrabold text-white"
              >
                Enable Browser Notifications
              </button>
            )}
            {notifPermission === 'granted' && (
              <button
                type="button"
                data-haptic="deferred"
                onClick={handleSendTestNotification}
                className="neu-blue-btn rounded-[12px] px-4 py-2 text-[12.5px] font-extrabold text-white"
              >
                Send Test Notification
              </button>
            )}
          </div>

          {feedback && (
            <div
              className={`rounded-[12px] px-3 py-2 text-[12px] font-bold ${
                feedback.tone === 'ok'
                  ? 'bg-[#D7F5E5] text-[#117A45]'
                  : feedback.tone === 'error'
                    ? 'bg-[#FEECEC] text-[#9F1D1D]'
                    : 'bg-[#E8F2FE] text-[#1E3A6D]'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </section>

        {/* Per-Appointment Reminder Controls */}
        {upcoming.length === 0 ? (
          <div className="neu-card rounded-[20px] p-6 text-center text-[13px] font-semibold text-[#425478]">
            No upcoming appointments to configure reminders for.
          </div>
        ) : (
          upcoming.map((apt) => {
            const parts = formatDisplayDateParts(apt.appointmentDate);
            const busy = savingId === apt.appointmentId;
            return (
              <article key={apt.appointmentId} className="neu-card rounded-[20px] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-extrabold text-[#0E1B3B]">
                        {apt.treatmentName}
                      </h3>
                      {apt.isSamplePreview && (
                        <span className="px-2 py-0.5 rounded-[8px] bg-[#EDF3FB] border border-[#C8DAF0] text-[#425478] text-[10px] font-bold">
                          Sample
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] font-semibold text-[#425478] mt-0.5 tabular-nums">
                      {parts.fullFormatted} • {apt.startTime} ({apt.dentistName})
                    </p>
                  </div>

                  <button
                    type="button"
                    data-haptic="checkbox"
                    disabled={busy}
                    onClick={() => handleToggleReminder(apt)}
                    aria-pressed={apt.reminderEnabled}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 neu-btn-sm text-[12px] font-extrabold ${
                      apt.reminderEnabled
                        ? 'neu-blue-btn text-white'
                        : 'bg-[#EDF3FB] border border-[#C8DAF0] text-[#425478] neu-press-surface'
                    }`}
                  >
                    {apt.reminderEnabled ? (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        On
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3.5 h-3.5" />
                        Off
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E1ECF9]">
                  <span className="text-[12px] font-bold text-[#1E3158] mr-1">Remind me:</span>
                  {(['24h', '2h', '30m'] as ReminderLeadTime[]).map((lead) => {
                    const label =
                      lead === '24h'
                        ? '24 hours before'
                        : lead === '2h'
                          ? '2 hours before'
                          : '30 mins before';
                    const active = apt.reminderEnabled && apt.reminderLeadTime === lead;
                    return (
                      <button
                        key={lead}
                        type="button"
                        data-haptic="selection"
                        disabled={busy}
                        onClick={() => handleChangeLeadTime(apt, lead)}
                        className={`px-3 py-1.5 neu-btn-sm text-[11.5px] font-bold ${
                          active
                            ? 'bg-[#0070FF] text-white shadow-[0_3px_8px_rgba(0,112,255,0.25)] neu-press-solid-blue'
                            : 'bg-[#F5FAFF] border border-[#C8DAF0] text-[#425478] hover:border-[#8BC0FB] neu-press-surface'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. CANCEL / RESCHEDULE VIEW                                                */
/* -------------------------------------------------------------------------- */

interface CancelRescheduleViewProps {
  appointments: AppointmentRecord[];
  initialAppointmentId?: string | null;
  onBack: () => void;
  onAppointmentsChanged: () => Promise<void>;
}

export function CancelRescheduleView({
  appointments,
  initialAppointmentId,
  onBack,
  onAppointmentsChanged,
}: CancelRescheduleViewProps) {
  const upcoming = useMemo(
    () => sortAppointmentsNearestFirst(appointments.filter(isUpcomingAppointment)),
    [appointments]
  );

  const [selectedId, setSelectedId] = useState<string | null>(initialAppointmentId ?? null);
  const [activeAction, setActiveAction] = useState<'reschedule' | 'cancel' | null>(
    initialAppointmentId ? 'reschedule' : null
  );

  const activeAppointment = useMemo(
    () => upcoming.find((a) => a.appointmentId === selectedId) ?? upcoming[0] ?? null,
    [upcoming, selectedId]
  );

  // Reschedule state
  const [newDate, setNewDate] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [newSlot, setNewSlot] = useState<TimeSlotOption | null>(null);

  // Cancel state
  const [cancelReason, setCancelReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (initialAppointmentId) {
      setSelectedId(initialAppointmentId);
      setActiveAction('reschedule');
    }
  }, [initialAppointmentId]);

  useEffect(() => {
    if (activeAppointment && !newDate) {
      setNewDate(activeAppointment.appointmentDate);
    }
  }, [activeAppointment, newDate]);

  useEffect(() => {
    if (!activeAppointment || activeAction !== 'reschedule' || !newDate) return;
    let cancelled = false;
    setSlotsLoading(true);
    const service = BOOKING_SERVICES.find(
      (s) => s.treatmentId === activeAppointment.treatmentId
    );
    fetchSlotAvailability({
      dateIso: newDate,
      dentistId: activeAppointment.dentistId,
      durationMinutes: service?.durationMinutes ?? 45,
      excludeAppointmentId: activeAppointment.appointmentId,
    })
      .then((res) => {
        if (cancelled) return;
        setSlots(res);
        setNewSlot((prev) =>
          prev && res.some((s) => s.startTime === prev.startTime && s.available) ? prev : null
        );
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeAppointment, activeAction, newDate]);

  const handleConfirmReschedule = async () => {
    if (!activeAppointment || !newSlot || submitting) return;
    setSubmitting(true);
    setActionMessage(null);
    try {
      await rescheduleAppointment({
        appointmentId: activeAppointment.appointmentId,
        appointmentDate: newDate,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      });
      await onAppointmentsChanged();
      triggerSuccessHaptic();
      setActionMessage({
        tone: 'ok',
        text: `Appointment rescheduled to ${formatDisplayDateParts(newDate).fullFormatted} at ${newSlot.startTime}.`,
      });
      setActiveAction(null);
      setNewSlot(null);
    } catch (err) {
      triggerErrorHaptic();
      setActionMessage({
        tone: 'error',
        text: err instanceof Error ? err.message : 'Unable to reschedule appointment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!activeAppointment || submitting) return;
    setSubmitting(true);
    setActionMessage(null);
    try {
      await cancelAppointment({
        appointmentId: activeAppointment.appointmentId,
        cancellationReason: cancelReason,
      });
      await onAppointmentsChanged();
      triggerSuccessHaptic();
      setActionMessage({
        tone: 'ok',
        text: 'Appointment has been cancelled and moved to Appointment History.',
      });
      setActiveAction(null);
      setCancelReason('');
      setSelectedId(null);
    } catch (err) {
      triggerErrorHaptic();
      setActionMessage({
        tone: 'error',
        text: err instanceof Error ? err.message : 'Unable to cancel appointment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Appointments"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Cancel / Reschedule
        </h1>
      </header>

      <div className="mt-3 space-y-3.5">
        {actionMessage && (
          <div
            role="status"
            className={`rounded-[15px] px-4 py-3 flex items-start gap-2 text-[13px] font-bold ${
              actionMessage.tone === 'ok'
                ? 'bg-[#D7F5E5] text-[#117A45] border border-[#A6E3C3]'
                : 'bg-[#FEECEC] text-[#9F1D1D] border border-[#F5BDBD]'
            }`}
          >
            {actionMessage.tone === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {upcoming.length === 0 ? (
          <div className="neu-card rounded-[20px] p-6 text-center space-y-2.5">
            <div className="w-14 h-14 rounded-full bg-[#E3F0FF] flex items-center justify-center mx-auto text-[#0070FF]">
              <CalendarX2 className="w-7 h-7" />
            </div>
            <h2 className="text-[17px] font-extrabold text-[#0E1B3B]">
              No Upcoming Appointments
            </h2>
            <p className="text-[13px] font-medium text-[#425478]">
              There are no active upcoming appointments to reschedule or cancel.
            </p>
          </div>
        ) : (
          <>
            {/* Appointment Selector List */}
            <div className="space-y-2.5">
              {upcoming.map((apt) => {
                const isSelected = activeAppointment?.appointmentId === apt.appointmentId;
                const parts = formatDisplayDateParts(apt.appointmentDate);
                return (
                  <div
                    key={apt.appointmentId}
                    className={`rounded-[20px] p-3.5 sm:p-4 transition-all ${
                      isSelected ? 'neu-card !border-[#0070FF]' : 'neu-card'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[15px] font-extrabold text-[#0E1B3B]">
                            {apt.treatmentName}
                          </h2>
                          {apt.isSamplePreview && (
                            <span className="px-2 py-0.5 rounded-[8px] bg-[#EDF3FB] border border-[#C8DAF0] text-[#425478] text-[10px] font-bold">
                              Sample Preview
                            </span>
                          )}
                        </div>
                        <p className="text-[12.5px] font-semibold text-[#1E3158] mt-1">
                          {apt.dentistName} • {parts.fullFormatted} at {apt.startTime}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(apt.appointmentId);
                          setNewDate(apt.appointmentDate);
                          setNewSlot(null);
                          setActiveAction('reschedule');
                          setActionMessage(null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-[12.5px] font-extrabold border ${
                          isSelected && activeAction === 'reschedule'
                            ? 'bg-[#0070FF] border-[#0070FF] text-white neu-press-solid-blue'
                            : 'bg-white border-[#BDDCFF] text-[#0070FF] hover:bg-[#EEF6FF] neu-press-surface'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reschedule
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(apt.appointmentId);
                          setActiveAction('cancel');
                          setActionMessage(null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-[12.5px] font-extrabold ${
                          isSelected && activeAction === 'cancel'
                            ? 'bg-[#C62828] text-white neu-press-solid-red'
                            : 'bg-[#FEECEC] text-[#B91C1C] hover:bg-[#FCDADA] neu-press-surface'
                        }`}
                      >
                        <CalendarX2 className="w-3.5 h-3.5" />
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reschedule Workflow Panel */}
            {activeAppointment && activeAction === 'reschedule' && (
              <section className="space-y-3 pt-1">
                <div className="rounded-[16px] bg-[#E8F2FE] border border-[#C6DDF9] px-4 py-3 flex items-start gap-2.5 text-[12.5px] text-[#1E3A6D]">
                  <Info className="w-4 h-4 text-[#0070FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">Rescheduling: </span>
                    <span>
                      {activeAppointment.treatmentName} with {activeAppointment.dentistName} (currently{' '}
                      {formatDisplayDateParts(activeAppointment.appointmentDate).fullFormatted} at{' '}
                      {activeAppointment.startTime})
                    </span>
                  </div>
                </div>

                <BookingCalendarPicker
                  mode="both"
                  selectedDate={newDate || activeAppointment.appointmentDate}
                  onSelectDate={(iso) => {
                    setNewDate(iso);
                    setNewSlot(null);
                  }}
                  slots={slots}
                  slotsLoading={slotsLoading}
                  selectedSlot={newSlot}
                  onSelectSlot={setNewSlot}
                />

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveAction(null)}
                    className="px-4 py-3 rounded-[14px] neu-card-interactive text-[13px] font-extrabold text-[#0E1B3B]"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    data-haptic="deferred"
                    disabled={!newSlot || submitting}
                    onClick={handleConfirmReschedule}
                    className="flex-1 neu-blue-btn rounded-[14px] py-3 px-4 text-[14px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>
                        {newSlot
                          ? `Confirm Reschedule (${newSlot.startTime})`
                          : 'Select a New Time Slot'}
                      </span>
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* Cancel Confirmation Workflow Panel */}
            {activeAppointment && activeAction === 'cancel' && (
              <section className="neu-card rounded-[20px] p-4 space-y-3 border border-[#F5BDBD]">
                <h3 className="text-[16px] font-extrabold text-[#9F1D1D]">
                  Confirm Appointment Cancellation
                </h3>
                <p className="text-[12.5px] font-medium text-[#425478]">
                  Are you sure you want to cancel your{' '}
                  <strong className="text-[#0E1B3B]">{activeAppointment.treatmentName}</strong>{' '}
                  appointment on{' '}
                  <strong className="text-[#0E1B3B]">
                    {formatDisplayDateParts(activeAppointment.appointmentDate).fullFormatted} at{' '}
                    {activeAppointment.startTime}
                  </strong>
                  ?
                </p>

                <div>
                  <label
                    htmlFor="cancel-reason-input"
                    className="block text-[12px] font-bold text-[#1A2B50] mb-1"
                  >
                    Reason for Cancellation (Optional)
                  </label>
                  <input
                    id="cancel-reason-input"
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict or feeling better"
                    className="w-full h-10 rounded-[12px] bg-white border border-[#D4E2F4] px-3 text-[13px] font-semibold text-[#0E1B3B] focus:outline-none focus:border-[#0070FF]"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveAction(null)}
                    className="px-4 py-2.5 rounded-[13px] bg-white border border-[#C8DAF0] text-[13px] font-bold text-[#0E1B3B] neu-press-surface"
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="button"
                    data-haptic="deferred"
                    disabled={submitting}
                    onClick={handleConfirmCancel}
                    className="flex-1 rounded-[13px] bg-[#C62828] hover:bg-[#B71C1C] py-2.5 px-4 text-[13.5px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-60 neu-press-solid-red"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <span>Confirm Cancellation</span>
                    )}
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
