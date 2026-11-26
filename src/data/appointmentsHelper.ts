import {
  AppointmentRecord,
  CustomerProfile,
  getSavedCustomerProfile,
} from './appointmentsRepository';

const STORAGE_APPOINTMENTS_KEY = 'smilecare_appointments_v1';

export function getAppointmentsSnapshot(): {
  profile: CustomerProfile;
  latestAppointment?: AppointmentRecord;
} {
  const profile = getSavedCustomerProfile();
  if (typeof window === 'undefined') {
    return { profile };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
    if (!raw) return { profile };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { profile };

    const records = parsed as AppointmentRecord[];
    // Prefer a real customer-booked completed appointment, then any customer-booked appointment,
    // then a completed sample appointment.
    const customerRealCompleted = records.find(
      (a) => !a.isSamplePreview && a.status === 'Completed'
    );
    const customerRealAny = records.find(
      (a) => !a.isSamplePreview && a.status !== 'Cancelled'
    );
    const fallbackCompleted = records.find((a) => a.status === 'Completed');

    return {
      profile,
      latestAppointment: customerRealCompleted ?? customerRealAny ?? fallbackCompleted,
    };
  } catch {
    return { profile };
  }
}
