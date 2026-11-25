  phoneNumber: string;
  /** WhatsApp Business number with country code, digits only (e.g. "9198XXXXXXXX"). Supply before production launch. */
  whatsappNumber: string;
  whatsappPrefillMessage: string;
  /** Official clinic email address (e.g. "care@smilecareclinic.in"). Supply before production launch. */
  email: string;
  emailSubject: string;
  addressLine1: string;
  addressLine2: string;
  fullAddress: string;
  googleMapsDestination: string;
  googleMapsDirectionsBaseUrl: string;
  googleMapsSearchUrl: string;
  /** Official clinic social profile URLs. Supply before production launch; do not use generic homepages. */
  socialUrls: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
}

export const CLINIC_CONTACT_CONFIG: ClinicContactConfig = {
  phoneNumber: '',
  whatsappNumber: '',
  whatsappPrefillMessage:
    'Hello SmileCare Dental Clinic, I would like to know more about your dental services.',
  email: '',
  emailSubject: 'Enquiry – SmileCare Dental Clinic',
  addressLine1: 'Plot No. 12, Road No. 3, Banjara Hills,',
  addressLine2: 'Hyderabad – 500034',
  fullAddress: 'Plot No. 12, Road No. 3, Banjara Hills, Hyderabad – 500034',
  googleMapsDestination: 'Plot No. 12, Road No. 3, Banjara Hills, Hyderabad, 500034',
  googleMapsDirectionsBaseUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Plot%20No.%2012%2C%20Road%20No.%203%2C%20Banjara%20Hills%2C%20Hyderabad%2C%20500034',
  googleMapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=Plot%20No.%2012%2C%20Road%20No.%203%2C%20Banjara%20Hills%2C%20Hyderabad%2C%20500034',
  socialUrls: {
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
  },
};

export interface ClinicHourRow {
  day: string;
  hours: string;
}

export const CLINIC_HOURS: ClinicHourRow[] = [
  { day: 'Monday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Tuesday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Wednesday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Thursday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Friday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Saturday', hours: '09:00 AM – 08:00 PM' },
  { day: 'Sunday', hours: '10:00 AM – 02:00 PM' },
];

export type FaqCategory = 'All' | 'Appointments' | 'Clinic' | 'Treatments';

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  iconType: 'calendar' | 'tooth' | 'shield' | 'braces' | 'implant' | 'whitening';
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  'All',
  'Appointments',
  'Clinic',
  'Treatments',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-book-appointment',
    category: 'Appointments',
    iconType: 'calendar',
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment through the Book Appointment button on the home screen, or contact us directly via call or WhatsApp.',
  },
  {
    id: 'faq-working-hours',
    category: 'Clinic',
    iconType: 'tooth',
    question: 'What are your clinic working hours?',
    answer:
      'SmileCare Dental Clinic is open Monday to Saturday from 09:00 AM – 08:00 PM, and on Sunday from 10:00 AM – 02:00 PM.',
  },
  {
    id: 'faq-dental-insurance',
    category: 'Clinic',
    iconType: 'shield',
    question: 'Do you accept dental insurance?',
    answer:
      'Please contact our clinic reception via Call, WhatsApp, or Email with your insurance provider details so our team can confirm eligibility prior to your appointment.',
  },
  {
    id: 'faq-braces-aligners',
    category: 'Treatments',
    iconType: 'braces',
    question: 'Do you offer braces or aligners?',
    answer:
      'Yes, our Orthodontics treatments include both braces and clear aligners tailored to your smile alignment plan.',
  },
  {
    id: 'faq-dental-implants',
    category: 'Treatments',
    iconType: 'implant',
    question: 'How long do dental implants last?',
    answer:
      'Dental implants are designed as a durable, long-term tooth replacement option. Book a consultation with our dental specialists to assess your specific care plan.',
  },
  {
    id: 'faq-teeth-whitening',
    category: 'Treatments',
    iconType: 'whitening',
    question: 'Do you provide teeth whitening?',
    answer:
      'Yes, we provide teeth whitening and smile enhancement care under our Cosmetic Dentistry treatments.',
  },
];
