import { CLINIC_HOURS, DEFAULT_CLINIC_CONFIG, CLINIC_CONTACT_CONFIG } from './clinicData';

export type BookingTreatmentId =
  | 'general'
  | 'orthodontics'
  | 'implants'
  | 'cosmetic'
  | 'cleaning';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export type ReminderLeadTime = '24h' | '2h' | '30m';

export interface AppointmentRecord {
  appointmentId: string;
  customerId: string;
  clinicTenantId: string;
  branchId: string;
  branchName: string;
  treatmentId: BookingTreatmentId;
  treatmentName: string;
  dentistId: string;
  dentistName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "10:45 AM"
  status: AppointmentStatus;
  bookingTimestamp: string; // ISO string
  cancellationReason?: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  reasonForVisit?: string;
  reminderEnabled: boolean;
  reminderLeadTime: ReminderLeadTime;
  /** True when record is development/sample preview data rather than a customer booking */
  isSamplePreview?: boolean;
}

export interface CustomerProfile {
  customerId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
}

export interface ClinicBranchOption {
  branchId: string;
  name: string;
  address: string;
}

export interface BookingServiceOption {
  treatmentId: BookingTreatmentId;
  name: string;
  durationMinutes: number;
  subtitle: string;
}

export interface DentistOption {
  dentistId: string;
  name: string;
  specialty: string;
  branchId: string;
  supportedTreatments: BookingTreatmentId[];
}

export interface TimeSlotOption {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

/**
 * Isolated backend connection status.
 * Set `BOOKING_API_CONFIG.isBackendConnected` to true and implement network calls
 * in `appointmentsRepository.ts` when connecting a live clinic backend.
 */
export const BOOKING_API_CONFIG = {
  clinicTenantId: 'smilecare-hyd-01',
  isBackendConnected: false,
  apiStatusLabel: 'Local Preview Mode — Connect clinic booking API for live slot sync',
};

export const CLINIC_BRANCHES: ClinicBranchOption[] = [
  {
    branchId: 'branch-banjara-hills',
    name: DEFAULT_CLINIC_CONFIG.branchName,
    address: CLINIC_CONTACT_CONFIG.fullAddress,
  },
];

export const BOOKING_SERVICES: BookingServiceOption[] = [
  {
    treatmentId: 'general',
    name: 'General Dentistry',
    durationMinutes: 45,
    subtitle: 'Check-ups, fillings & root canal care',
  },
  {
    treatmentId: 'orthodontics',
    name: 'Orthodontics (Braces)',
    durationMinutes: 45,
    subtitle: 'Braces, aligners & bite correction',
  },
  {
    treatmentId: 'implants',
    name: 'Dental Implants',
    durationMinutes: 60,
    subtitle: 'Titanium implants & natural crowns',
  },
  {
    treatmentId: 'cosmetic',
    name: 'Cosmetic Dentistry',
    durationMinutes: 45,
    subtitle: 'Whitening, veneers & smile design',
  },
  {
    treatmentId: 'cleaning',
    name: 'Dental Cleaning',
    durationMinutes: 30,
    subtitle: 'Ultrasonic scaling & polishing',
  },
];

export const CLINIC_DENTISTS: DentistOption[] = [
  {
    dentistId: 'any-available',
    name: 'Any Available Dentist',
    specialty: 'Earliest available specialist',
    branchId: 'branch-banjara-hills',
    supportedTreatments: ['general', 'orthodontics', 'implants', 'cosmetic', 'cleaning'],
  },
  {
    dentistId: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'General & Preventive Dentistry',
    branchId: 'branch-banjara-hills',
    supportedTreatments: ['general', 'cleaning', 'cosmetic'],
  },
  {
    dentistId: 'dr-arjun-reddy',
    name: 'Dr. Arjun Reddy',
    specialty: 'Orthodontics & Aligners',
    branchId: 'branch-banjara-hills',
    supportedTreatments: ['orthodontics', 'general'],
  },
  {
    dentistId: 'dr-kavya-nair',
    name: 'Dr. Kavya Nair',
    specialty: 'Implantology & Cosmetic Care',
    branchId: 'branch-banjara-hills',
    supportedTreatments: ['implants', 'cosmetic', 'general'],
  },
];

const STORAGE_APPOINTMENTS_KEY = 'smilecare_appointments_v1';
const STORAGE_PROFILE_KEY = 'smilecare_customer_profile_v1';

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(base: Date, days: number): Date {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function createDevelopmentSampleAppointments(): AppointmentRecord[] {
  const today = new Date();
  const upcomingDate = formatIsoDate(addDays(today, 2));
  const pastCompletedDate = formatIsoDate(addDays(today, -14));
  const pastCancelledDate = formatIsoDate(addDays(today, -28));

  return [
    {
      appointmentId: 'SAMPLE-APT-101',
      customerId: 'guest-local',
      clinicTenantId: BOOKING_API_CONFIG.clinicTenantId,
      branchId: 'branch-banjara-hills',
      branchName: DEFAULT_CLINIC_CONFIG.branchName,
      treatmentId: 'cleaning',
      treatmentName: 'Dental Cleaning',
      dentistId: 'dr-priya-sharma',
      dentistName: 'Dr. Priya Sharma',
      appointmentDate: upcomingDate,
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      status: 'Confirmed',
      bookingTimestamp: new Date(today.getTime() - 86400000).toISOString(),
      patientName: 'Guest Patient',
      patientPhone: '',
      reminderEnabled: true,
      reminderLeadTime: '24h',
      isSamplePreview: true,
    },
    {
      appointmentId: 'SAMPLE-APT-094',
      customerId: 'guest-local',
      clinicTenantId: BOOKING_API_CONFIG.clinicTenantId,
      branchId: 'branch-banjara-hills',
      branchName: DEFAULT_CLINIC_CONFIG.branchName,
      treatmentId: 'general',
      treatmentName: 'General Dentistry',
      dentistId: 'dr-priya-sharma',
      dentistName: 'Dr. Priya Sharma',
      appointmentDate: pastCompletedDate,
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      status: 'Completed',
      bookingTimestamp: new Date(today.getTime() - 16 * 86400000).toISOString(),
      patientName: 'Guest Patient',
      patientPhone: '',
      reminderEnabled: false,
      reminderLeadTime: '24h',
      isSamplePreview: true,
    },
    {
      appointmentId: 'SAMPLE-APT-088',
      customerId: 'guest-local',
      clinicTenantId: BOOKING_API_CONFIG.clinicTenantId,
      branchId: 'branch-banjara-hills',
      branchName: DEFAULT_CLINIC_CONFIG.branchName,
      treatmentId: 'cosmetic',
      treatmentName: 'Cosmetic Dentistry',
      dentistId: 'dr-kavya-nair',
      dentistName: 'Dr. Kavya Nair',
      appointmentDate: pastCancelledDate,
      startTime: '04:00 PM',
      endTime: '04:45 PM',
      status: 'Cancelled',
      cancellationReason: 'Rescheduled due to travel',
      bookingTimestamp: new Date(today.getTime() - 32 * 86400000).toISOString(),
      patientName: 'Guest Patient',
      patientPhone: '',
      reminderEnabled: false,
      reminderLeadTime: '24h',
      isSamplePreview: true,
    },
  ];
}

function readStoredAppointments(): AppointmentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
    if (!raw) {
      const seeded = createDevelopmentSampleAppointments();
      window.localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return createDevelopmentSampleAppointments();
  }
}

function writeStoredAppointments(records: AppointmentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function getSavedCustomerProfile(): CustomerProfile {
  const fallback: CustomerProfile = {
    customerId: 'cust-local-001',
    fullName: '',
    mobileNumber: '',
    email: '',
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      customerId: parsed.customerId || fallback.customerId,
      fullName: parsed.fullName || '',
      mobileNumber: parsed.mobileNumber || '',
      email: parsed.email || '',
    };
  } catch {
    return fallback;
  }
}

export function saveCustomerProfile(profile: Partial<CustomerProfile>): CustomerProfile {
  const current = getSavedCustomerProfile();
  const updated: CustomerProfile = {
    customerId: profile.customerId ?? current.customerId,
    fullName: profile.fullName ?? current.fullName,
    mobileNumber: profile.mobileNumber ?? current.mobileNumber,
    email: profile.email ?? current.email,
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  }
  return updated;
}

export function parseTimeToMinutes(time12h: string): number {
  const match = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}

export function getOperatingWindowForDate(dateIso: string): {
  openMinutes: number;
  closeMinutes: number;
  dayName: string;
} | null {
  const [y, m, d] = dateIso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dateObj = new Date(y, m - 1, d);
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayName = dayNames[dateObj.getDay()];
  const row = CLINIC_HOURS.find((h) => h.day === dayName);
  if (!row) return null;

  const parts = row.hours.split('–').map((s) => s.trim());
  if (parts.length !== 2) return null;
  return {
    openMinutes: parseTimeToMinutes(parts[0]),
    closeMinutes: parseTimeToMinutes(parts[1]),
    dayName,
  };
}

export function sortAppointmentsNearestFirst(
  appointments: AppointmentRecord[]
): AppointmentRecord[] {
  return [...appointments].sort((a, b) => {
    if (a.appointmentDate !== b.appointmentDate) {
      return a.appointmentDate.localeCompare(b.appointmentDate);
    }
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  });
}

export function isUpcomingAppointment(record: AppointmentRecord): boolean {
  if (record.status === 'Cancelled' || record.status === 'Completed') {
    return false;
  }
  const todayIso = formatIsoDate(new Date());
  if (record.appointmentDate > todayIso) return true;
  if (record.appointmentDate < todayIso) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return parseTimeToMinutes(record.startTime) >= nowMinutes;
}

export async function fetchAppointments(): Promise<AppointmentRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return sortAppointmentsNearestFirst(readStoredAppointments());
}

export async function fetchSlotAvailability(params: {
  dateIso: string;
  dentistId: string;
  durationMinutes: number;
  excludeAppointmentId?: string;
}): Promise<TimeSlotOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 140));
  const windowInfo = getOperatingWindowForDate(params.dateIso);
  if (!windowInfo) return [];

  const today = new Date();
  const todayIso = formatIsoDate(today);
  if (params.dateIso < todayIso) return [];

  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const existing = readStoredAppointments().filter(
    (apt) =>
      apt.appointmentDate === params.dateIso &&
      apt.status !== 'Cancelled' &&
      apt.appointmentId !== params.excludeAppointmentId
  );

  const slots: TimeSlotOption[] = [];
  for (
    let startMin = windowInfo.openMinutes;
    startMin + params.durationMinutes <= windowInfo.closeMinutes;
    startMin += 60
  ) {
    const startTime = formatMinutesToTime(startMin);
    const endTime = formatMinutesToTime(startMin + params.durationMinutes);

    const isPastToday = params.dateIso === todayIso && startMin <= nowMinutes + 30;
    const isBookedForDentist = existing.some(
      (apt) =>
        apt.startTime === startTime &&
        (params.dentistId === 'any-available'
          ? false
          : apt.dentistId === params.dentistId)
    );

    slots.push({
      startTime,
      endTime,
      available: !isPastToday && !isBookedForDentist,
      reason: isPastToday
        ? 'Passed'
        : isBookedForDentist
          ? 'Already booked'
          : undefined,
    });
  }

  return slots;
}

export async function createAppointment(input: {
  branchId: string;
  treatmentId: BookingTreatmentId;
  dentistId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  reasonForVisit?: string;
}): Promise<AppointmentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const existing = readStoredAppointments();
  const duplicateConflict = existing.some(
    (apt) =>
      apt.appointmentDate === input.appointmentDate &&
      apt.startTime === input.startTime &&
      apt.status !== 'Cancelled' &&
      (input.dentistId === 'any-available'
        ? false
        : apt.dentistId === input.dentistId)
  );

  if (duplicateConflict) {
    throw new Error('This dentist and time slot was just booked. Please select another slot.');
  }

  const branch =
    CLINIC_BRANCHES.find((b) => b.branchId === input.branchId) ?? CLINIC_BRANCHES[0];
  const service =
    BOOKING_SERVICES.find((s) => s.treatmentId === input.treatmentId) ??
    BOOKING_SERVICES[0];
  const dentist =
    CLINIC_DENTISTS.find((d) => d.dentistId === input.dentistId) ??
    CLINIC_DENTISTS[0];

  const profile = saveCustomerProfile({
    fullName: input.patientName.trim(),
    mobileNumber: input.patientPhone.trim(),
    email: input.patientEmail?.trim() ?? '',
  });

  const newRecord: AppointmentRecord = {
    appointmentId: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
    customerId: profile.customerId,
    clinicTenantId: BOOKING_API_CONFIG.clinicTenantId,
    branchId: branch.branchId,
    branchName: branch.name,
    treatmentId: service.treatmentId,
    treatmentName: service.name,
    dentistId: dentist.dentistId,
    dentistName: dentist.name,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    endTime: input.endTime,
    status: BOOKING_API_CONFIG.isBackendConnected ? 'Confirmed' : 'Pending',
    bookingTimestamp: new Date().toISOString(),
    patientName: input.patientName.trim(),
    patientPhone: input.patientPhone.trim(),
    patientEmail: input.patientEmail?.trim() || undefined,
    reasonForVisit: input.reasonForVisit?.trim() || undefined,
    reminderEnabled: true,
    reminderLeadTime: '24h',
    isSamplePreview: false,
  };

  const next = sortAppointmentsNearestFirst([...existing, newRecord]);
  writeStoredAppointments(next);
  return newRecord;
}

export async function rescheduleAppointment(input: {
  appointmentId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
}): Promise<AppointmentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const existing = readStoredAppointments();
  const target = existing.find((a) => a.appointmentId === input.appointmentId);
  if (!target) {
    throw new Error('Appointment could not be found.');
  }

  const conflict = existing.some(
    (apt) =>
      apt.appointmentId !== input.appointmentId &&
      apt.appointmentDate === input.appointmentDate &&
      apt.startTime === input.startTime &&
      apt.status !== 'Cancelled' &&
      (target.dentistId === 'any-available'
        ? false
        : apt.dentistId === target.dentistId)
  );
  if (conflict) {
    throw new Error('Selected slot is no longer available for this dentist.');
  }

  const updated: AppointmentRecord = {
    ...target,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    endTime: input.endTime,
  };

  const next = sortAppointmentsNearestFirst(
    existing.map((a) => (a.appointmentId === input.appointmentId ? updated : a))
  );
  writeStoredAppointments(next);
  return updated;
}

export async function cancelAppointment(input: {
  appointmentId: string;
  cancellationReason?: string;
}): Promise<AppointmentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 260));
  const existing = readStoredAppointments();
  const target = existing.find((a) => a.appointmentId === input.appointmentId);
  if (!target) {
    throw new Error('Appointment could not be found.');
  }

  const updated: AppointmentRecord = {
    ...target,
    status: 'Cancelled',
    cancellationReason: input.cancellationReason?.trim() || 'Cancelled by patient',
    reminderEnabled: false,
  };

  const next = sortAppointmentsNearestFirst(
    existing.map((a) => (a.appointmentId === input.appointmentId ? updated : a))
  );
  writeStoredAppointments(next);
  return updated;
}

export async function updateReminderPreference(input: {
  appointmentId: string;
  reminderEnabled: boolean;
  reminderLeadTime: ReminderLeadTime;
}): Promise<AppointmentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 140));
  const existing = readStoredAppointments();
  const target = existing.find((a) => a.appointmentId === input.appointmentId);
  if (!target) {
    throw new Error('Appointment could not be found.');
  }

  const updated: AppointmentRecord = {
    ...target,
    reminderEnabled: input.reminderEnabled,
    reminderLeadTime: input.reminderLeadTime,
  };

  const next = existing.map((a) =>
    a.appointmentId === input.appointmentId ? updated : a
  );
  writeStoredAppointments(next);
  return updated;
}

export function formatDisplayDateParts(dateIso: string): {
  weekday: string;
  day: string;
  month: string;
  fullFormatted: string;
} {
  const [y, m, d] = dateIso.split('-').map(Number);
  const dateObj = new Date(y, (m || 1) - 1, d || 1);
  return {
    weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
    day: String(dateObj.getDate()).padStart(2, '0'),
    month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
    fullFormatted: dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}
