export type LanguageCode = 'EN' | 'HI' | 'TE';

export type ShortcutId = 'about' | 'contact' | 'faqs' | 'reviews';
export type TreatmentId = 'general' | 'orthodontics' | 'implants' | 'cosmetic';
export type NavTabId = 'home' | 'appointments' | 'services' | 'profile';

export interface ClinicConfig {
  clinicName: string;
  location: string;
  branchName: string;
  initialServingNumber: number;
  defaultToken: string;
  offerPercentage: number;
  offerTag: string;
  offerDescription: string;
}

export const DEFAULT_CLINIC_CONFIG: ClinicConfig = {
  clinicName: 'SmileCare Dental Clinic',
  location: 'Banjara Hills, Hyderabad',
  branchName: 'Banjara Hills Branch',
  initialServingNumber: 14,
  defaultToken: 'A023',
  offerPercentage: 20,
  offerTag: 'New Patient Offer',
  offerDescription: 'on Dental Check-up',
};

export interface HeroBannerItem {
  id: string;
  image: string;
  imageAlt: string;
  actionType: 'book' | 'treatments' | 'orthodontics' | 'cosmetic';
  text: Record<
    LanguageCode,
    {
      headlineLine1: string;
      headlineLine2: string;
      description: string;
      ctaLabel: string;
    }
  >;
}

export const HERO_BANNERS: HeroBannerItem[] = [
  {
    id: 'banner-happy-smiles',
    image: `${import.meta.env.BASE_URL}src/assets/images/hero_banner_happy_smile_1795590336818.jpg`,
    imageAlt: 'Happy smiling patient reclining in a blue dental clinic chair',
    actionType: 'book',
    text: {
      EN: {
        headlineLine1: 'Healthy Smiles for a',
        headlineLine2: 'Happier You',
        description: 'General • Cosmetic • Orthodontic • Implants',
        ctaLabel: 'Book Appointment',
      },
      HI: {
        headlineLine1: 'स्वस्थ मुस्कान,',
        headlineLine2: 'खुशहाल जीवन',
        description: 'जनरल • कॉस्मेटिक • ऑर्थोडॉन्टिक • इम्प्लांट्स',
        ctaLabel: 'अपॉइंटमेंट बुक करें',
      },
      TE: {
        headlineLine1: 'ఆరోగ్యకరమైన చిరునవ్వు,',
        headlineLine2: 'ఆనందమైన జీవితం',
        description: 'జనరల్ • కాస్మెటిక్ • ఆర్థోడాంటిక్ • ఇంప్లాంట్స్',
        ctaLabel: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      },
    },
  },
  {
    id: 'banner-preventive',
    image: `${import.meta.env.BASE_URL}src/assets/images/hero_banner_preventive_care_1795590488433.jpg`,
    imageAlt: 'Friendly dentist holding a dental mirror in a bright clinic',
    actionType: 'treatments',
    text: {
      EN: {
        headlineLine1: 'Your Smile,',
        headlineLine2: 'Our Priority',
        description: 'Preventive Check-ups • Ultrasonic Cleaning • Digital X-Rays',
        ctaLabel: 'Explore Treatments',
      },
      HI: {
        headlineLine1: 'आपकी मुस्कान,',
        headlineLine2: 'हमारी प्राथमिकता',
        description: 'नियमित जांच • स्केलिंग और क्लीनिंग • डिजिटल एक्स-रे',
        ctaLabel: 'उपचार देखें',
      },
      TE: {
        headlineLine1: 'మీ చిరునవ్వు,',
        headlineLine2: 'మా ప్రాధాన్యత',
        description: 'ప్రివెంటివ్ చెకప్స్ • క్లీనింగ్ • డిజిటల్ ఎక్స్-రే',
        ctaLabel: 'చికిత్సలు చూడండి',
      },
    },
  },
  {
    id: 'banner-transform',
    image: '/src/assets/images/hero_banner_cosmetic_whitening_1795590487728.jpg',
    imageAlt: 'Confident woman showcasing a bright white cosmetic smile',
    actionType: 'cosmetic',
    text: {
      EN: {
        headlineLine1: 'Transform',
        headlineLine2: 'Your Smile',
        description: 'Laser Teeth Whitening • Porcelain Veneers • Smile Design',
        ctaLabel: 'Book Appointment',
      },
      HI: {
        headlineLine1: 'निखारें अपनी',
        headlineLine2: 'चमकती मुस्कान',
        description: 'लेज़र टीथ व्हाइटनिंग • विनीर्स • स्माइल डिज़ाइन',
        ctaLabel: 'अपॉइंटमेंट बुक करें',
      },
      TE: {
        headlineLine1: 'మీ చిరునవ్వును',
        headlineLine2: 'మరింత అందంగా మార్చండి',
        description: 'టీత్ వైటెనింగ్ • వెనీర్స్ • స్మైల్ డిజైన్',
        ctaLabel: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      },
    },
  },
  {
    id: 'banner-orthodontics',
    image: '/src/assets/images/hero_banner_orthodontics_aligners_1795590488865.jpg',
    imageAlt: 'Smiling patient holding a crystal-clear orthodontic aligner tray',
    actionType: 'orthodontics',
    text: {
      EN: {
        headlineLine1: 'Perfect Smiles',
        headlineLine2: 'Start Here',
        description: 'Clear Invisible Aligners • Ceramic & Self-Ligating Braces',
        ctaLabel: 'Explore Orthodontics',
      },
      HI: {
        headlineLine1: 'सही दांत, परफेक्ट',
        headlineLine2: 'मुस्कान यहीं से',
        description: 'क्लियर अलाइनर्स • सिरेमिक और मेटल ब्रेसेज़',
        ctaLabel: 'ऑर्थोडॉन्टिक्स देखें',
      },
      TE: {
        headlineLine1: 'అందమైన వరుస దంతాలు',
        headlineLine2: 'ఇక్కడే ప్రారంభం',
        description: 'క్లియర్ అలైన్సర్లు • సిరామిక్ & మెటల్ బ్రేసెస్',
        ctaLabel: 'ఆర్థోడాంటిక్స్ చూడండి',
      },
    },
  },
  {
    id: 'banner-family',
    image: '/src/assets/images/hero_banner_family_dental_1795590489580.jpg',
    imageAlt: 'Smiling mother and young child at SmileCare Dental Clinic',
    actionType: 'book',
    text: {
      EN: {
        headlineLine1: 'Complete Dental Care',
        headlineLine2: 'for Everyone',
        description: 'Gentle Pediatric Visits • Adult & Senior Family Dentistry',
        ctaLabel: 'Book Appointment',
      },
      HI: {
        headlineLine1: 'पूरे परिवार के लिए',
        headlineLine2: 'संपूर्ण दंत चिकित्सा',
        description: 'बच्चों, बड़ों और वरिष्ठ नागरिकों की विशेष देखभाल',
        ctaLabel: 'अपॉइंटमेंट बुक करें',
      },
      TE: {
        headlineLine1: 'కుటుంబం అంతటికీ',
        headlineLine2: 'సంపూర్ణ దంత సంరక్షణ',
        description: 'పిల్లలు, పెద్దలు మరియు వృద్ధుల దంత సంరక్షణ',
        ctaLabel: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      },
    },
  },
];

export const OFFER_BANNER_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/offer_banner_dental_smile_1795590489434.jpg`;

export interface TreatmentItem {
  id: TreatmentId;
  variant: 'blue' | 'purple';
  duration: string;
  priceNote: string;
  text: Record<
    LanguageCode,
    {
      title: string;
      subtitle?: string;
      summary: string;
      highlights: string[];
    }
  >;
}

export const TREATMENTS: TreatmentItem[] = [
  {
    id: 'general',
    variant: 'blue',
    duration: '30 – 45 mins',
    priceNote: 'Consultation from ₹400',
    text: {
      EN: {
        title: 'General Dentistry',
        summary: 'Comprehensive oral examinations, ultrasonic scaling, cavity fillings, and root canal care.',
        highlights: ['Digital low-dose diagnostics', 'Painless composite fillings', 'Preventive gum care'],
      },
      HI: {
        title: 'जनरल डेंटिस्ट्री',
        summary: 'संपूर्ण दंत जांच, स्केलिंग, कैविटी फिलिंग और रूट कैनाल उपचार।',
        highlights: ['डिजिटल जांच', 'दर्द-रहित फिलिंग', 'मसूड़ों की देखभाल'],
      },
      TE: {
        title: 'జనరల్ డెంటిస్ట్రీ',
        summary: 'సంపూర్ణ దంత పరీక్షలు, క్లీనింగ్, క్యావిటీ ఫిల్లింగ్స్ మరియు రూట్ కెనాల్ చికిత్స.',
        highlights: ['డిజిటల్ ఎక్స్-రే', 'నొప్పిలేని ఫిల్లింగ్స్', 'చిగుళ్ల సంరక్షణ'],
      },
    },
  },
  {
    id: 'orthodontics',
    variant: 'purple',
    duration: '6 – 18 months plan',
    priceNote: '3D scan included',
    text: {
      EN: {
        title: 'Orthodontics',
        subtitle: '(Braces & Aligners)',
        summary: 'Custom clear aligners, ceramic braces, and precision bite correction with 3D smile previews.',
        highlights: ['3D intraoral digital scan', 'Clear invisible aligners', 'Flexible EMI plans'],
      },
      HI: {
        title: 'ऑर्थोडॉन्टिक्स',
        subtitle: '(ब्रेसेज़ और अलाइनर्स)',
        summary: 'कस्टम क्लियर अलाइनर्स, सिरेमिक ब्रेसेज़ और 3D स्माइल प्रीव्यू के साथ सुधार।',
        highlights: ['3D डिजिटल स्कैन', 'अदृश्य क्लियर अलाइनर्स', 'आसान किस्त विकल्प'],
      },
      TE: {
        title: 'ఆర్థోడాంటిక్స్',
        subtitle: '(బ్రేసెస్ & అలైన్సర్లు)',
        summary: '3D స్మైల్ ప్రివ్యూతో కస్టమ్ క్లియర్ అలైన్సర్లు మరియు సిరామిక్ బ్రేసెస్.',
        highlights: ['3D ఇంట్రాఓరల్ స్కాన్', 'ఇన్విజిబుల్ అలైన్సర్లు', 'సులభమైన EMI ప్లాన్లు'],
      },
    },
  },
  {
    id: 'implants',
    variant: 'blue',
    duration: '1 – 2 visits',
    priceNote: 'Lifetime warranty titanium',
    text: {
      EN: {
        title: 'Dental Implants',
        summary: 'Biocompatible titanium implants and natural ceramic crowns engineered for permanent comfort.',
        highlights: ['3D CBCT guided placement', 'Single & full-arch options', 'Natural tooth aesthetics'],
      },
      HI: {
        title: 'डेंटल इम्प्लांट्स',
        summary: 'स्थायी आराम के लिए बायोकम्पैटिबल टाइटेनियम इम्प्लांट और प्राकृतिक क्राउन।',
        highlights: ['3D गाइडेड प्लेसमेंट', 'सिंगल और फुल आर्च', 'प्राकृतिक लुक'],
      },
      TE: {
        title: 'డెంటల్ ఇంప్లాంట్స్',
        summary: 'శాశ్వత సౌకర్యం కోసం టైటానియం ఇంప్లాంట్లు మరియు సహజమైన సిరామిక్ క్రౌన్స్.',
        highlights: ['3D CBCT గైడెడ్', 'సింగిల్ & ఫుల్ ఆర్చ్', 'సహజమైన దంతాల రూపు'],
      },
    },
  },
  {
    id: 'cosmetic',
    variant: 'purple',
    duration: '45 – 60 mins',
    priceNote: 'Instant shade lift',
    text: {
      EN: {
        title: 'Cosmetic Dentistry',
        subtitle: '(Whitening & More)',
        summary: 'In-clinic laser whitening, ultra-thin porcelain veneers, and digital smile makeovers.',
        highlights: ['Up to 6 shades brighter', 'Enamel-safe desensitizer', 'Custom veneer artistry'],
      },
      HI: {
        title: 'कॉस्मेटिक डेंटिस्ट्री',
        subtitle: '(व्हाइटनिंग और अधिक)',
        summary: 'क्लिनिक लेज़र व्हाइटनिंग, अल्ट्रा-थिन विनीर्स और डिजिटल स्माइल मेकओवर।',
        highlights: ['6 शेड तक सफेदी', 'इनेमल-सुरक्षित उपचार', 'कस्टम विनीर्स'],
      },
      TE: {
        title: 'కాస్మెటిక్ డెంటిస్ట్రీ',
        subtitle: '(వైటెనింగ్ & మరిన్ని)',
        summary: 'లేజర్ టీత్ వైటెనింగ్, పోర్సిలైన్ వెనీర్స్ మరియు డిజిటల్ స్మైల్ మేకోవర్.',
        highlights: ['తక్షణ తెల్లదనం', 'ఎనామెల్‌కు సురక్షితం', 'కస్టమ్ వెనీర్స్'],
      },
    },
  },
];

export interface ClinicNotification {
  id: string;
  time: string;
  unread: boolean;
  text: Record<LanguageCode, { title: string; body: string }>;
}

export const INITIAL_NOTIFICATIONS: ClinicNotification[] = [
  {
    id: 'notif-1',
    time: '2m ago',
    unread: true,
    text: {
      EN: {
        title: 'Queue Moving Fast',
        body: 'Now serving token 014 at Banjara Hills Branch. Token A023 is estimated in ~25 mins.',
      },
      HI: {
        title: 'कतार तेजी से आगे बढ़ रही है',
        body: 'बंजारा हिल्स शाखा में टोकन 014 चल रहा है। टोकन A023 का अनुमानित समय ~25 मिनट है।',
      },
      TE: {
        title: 'క్యూ వేగంగా కదులుతోంది',
        body: 'బంజారా హిల్స్ బ్రాంచ్‌లో టోకెన్ 014 నడుస్తోంది. టోకెన్ A023 కు ~25 నిమిషాలు పట్టవచ్చు.',
      },
    },
  },
  {
    id: 'notif-2',
    time: '1h ago',
    unread: true,
    text: {
      EN: {
        title: 'New Patient Offer Active',
        body: 'Claim up to 20% OFF on your first comprehensive dental check-up & digital X-ray.',
      },
      HI: {
        title: 'नए मरीज़ का ऑफ़र सक्रिय',
        body: 'अपनी पहली संपूर्ण दंत जांच पर 20% तक की छूट प्राप्त करें।',
      },
      TE: {
        title: 'కొత్త పేషెంట్ ఆఫర్ సిద్ధంగా ఉంది',
        body: 'మీ మొదటి సంపూర్ణ దంత పరీక్షపై 20% వరకు తగ్గింపు పొందండి.',
      },
    },
  },
  {
    id: 'notif-3',
    time: 'Yesterday',
    unread: false,
    text: {
      EN: {
        title: 'Evening Clinic Hours Extended',
        body: 'Banjara Hills Branch is now open daily from 9:00 AM to 8:30 PM, including Sundays.',
      },
      HI: {
        title: 'क्लिनिक का समय बढ़ाया गया',
        body: 'बंजारा हिल्स शाखा अब रविवार सहित रोज़ सुबह 9:00 से रात 8:30 बजे तक खुली है।',
      },
      TE: {
        title: 'క్లినిక్ వేళలు పొడిగించబడ్డాయి',
        body: 'బంజారా హిల్స్ బ్రాంచ్ ఆదివారాలతో సహా ప్రతిరోజూ ఉదయం 9 నుండి రాత్రి 8:30 వరకు తెరిచి ఉంటుంది.',
      },
    },
  },
];

export const UI_STRINGS: Record<
  LanguageCode,
  {
    clinicName: string;
    location: string;
    branchName: string;
    shortcuts: Record<ShortcutId, string>;
    liveQueue: string;
    liveTag: string;
    nowServing: string;
    yourToken: string;
    ourTreatments: string;
    viewAll: string;
    offerTag: string;
    offerHeadlinePrefix: string;
    offerHeadlineSuffix: string;
    offerDescription: string;
    bookNow: string;
    nav: Record<NavTabId, string>;
    notificationsTitle: string;
    markAllRead: string;
    noNotifications: string;
    languageTitle: string;
    comingSoonBadge: string;
    close: string;
    tokenModalTitle: string;
    tokenStatusWaiting: string;
    tokenStatusNext: string;
    tokenStatusServing: string;
    tokenStatusCompleted: string;
    patientsAhead: string;
    estWait: string;
    configureTokenLabel: string;
    updateTokenBtn: string;
    simulateNextBtn: string;
    bookTitle: string;
    bookSubtitle: string;
    patientName: string;
    phoneNumber: string;
    preferredTreatment: string;
    preferredTime: string;
    confirmBooking: string;
    bookingConfirmedTitle: string;
    bookingConfirmedBody: string;
    bookThisTreatment: string;
  }
> = {
  EN: {
    clinicName: 'SmileCare Dental Clinic',
    location: 'Banjara Hills, Hyderabad',
    branchName: 'Banjara Hills Branch',
    shortcuts: {
      about: 'About Us',
      contact: 'Contact Us',
      faqs: 'FAQs',
      reviews: 'Reviews',
    },
    liveQueue: 'Live Queue',
    liveTag: 'LIVE',
    nowServing: 'Now Serving',
    yourToken: 'Your Token',
    ourTreatments: 'Our Treatments',
    viewAll: 'View All',
    offerTag: 'New Patient Offer',
    offerHeadlinePrefix: 'Up to',
    offerHeadlineSuffix: 'OFF',
    offerDescription: 'on Dental Check-up',
    bookNow: 'Book Now',
    nav: {
      home: 'Home',
      appointments: 'Appointments',
      services: 'Services',
      profile: 'Profile',
    },
    notificationsTitle: 'Clinic Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'You are all caught up.',
    languageTitle: 'Select Language',
    comingSoonBadge: 'Next Phase Preview',
    close: 'Close',
    tokenModalTitle: 'Live Queue & Token Status',
    tokenStatusWaiting: 'Waiting',
    tokenStatusNext: 'Up Next',
    tokenStatusServing: 'Now Serving',
    tokenStatusCompleted: 'Completed',
    patientsAhead: 'Patients Ahead',
    estWait: 'Est. Wait',
    configureTokenLabel: 'Configure Your Token',
    updateTokenBtn: 'Apply Token',
    simulateNextBtn: 'Advance Queue',
    bookTitle: 'Book Appointment',
    bookSubtitle: 'Banjara Hills, Hyderabad • Instant Slot Request',
    patientName: 'Full Name',
    phoneNumber: 'Mobile Number',
    preferredTreatment: 'Treatment',
    preferredTime: 'Preferred Time Slot',
    confirmBooking: 'Confirm Appointment',
    bookingConfirmedTitle: 'Appointment Request Received',
    bookingConfirmedBody: 'We have reserved your preferred slot and assigned your check-in reference.',
    bookThisTreatment: 'Book This Treatment',
  },
  HI: {
    clinicName: 'स्माइलकेयर डेंटल क्लिनिक',
    location: 'बंजारा हिल्स, हैदराबाद',
    branchName: 'बंजारा हिल्स शाखा',
    shortcuts: {
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      faqs: 'सवाल-जवाब',
      reviews: 'समीक्षाएं',
    },
    liveQueue: 'लाइव कतार',
    liveTag: 'लाइव',
    nowServing: 'अभी जारी',
    yourToken: 'आपका टोकन',
    ourTreatments: 'हमारे उपचार',
    viewAll: 'सभी देखें',
    offerTag: 'नए मरीज़ का ऑफ़र',
    offerHeadlinePrefix: 'अधिकतम',
    offerHeadlineSuffix: 'छूट',
    offerDescription: 'डेंटल चेक-अप पर',
    bookNow: 'अभी बुक करें',
    nav: {
      home: 'होम',
      appointments: 'अपॉइंटमेंट',
      services: 'सेवाएं',
      profile: 'प्रोफ़ाइल',
    },
    notificationsTitle: 'क्लिनिक सूचनाएं',
    markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
    noNotifications: 'कोई नई सूचना नहीं है।',
    languageTitle: 'भाषा चुनें',
    comingSoonBadge: 'अगले चरण का पूर्वावलोकन',
    close: 'बंद करें',
    tokenModalTitle: 'लाइव कतार और टोकन स्थिति',
    tokenStatusWaiting: 'प्रतीक्षा में',
    tokenStatusNext: 'अगला नंबर',
    tokenStatusServing: 'अभी चल रहा है',
    tokenStatusCompleted: 'पूर्ण हुआ',
    patientsAhead: 'आगे मरीज़',
    estWait: 'अनुमानित समय',
    configureTokenLabel: 'अपना टोकन बदलें',
    updateTokenBtn: 'टोकन सेट करें',
    simulateNextBtn: 'कतार आगे बढ़ाएं',
    bookTitle: 'अपॉइंटमेंट बुक करें',
    bookSubtitle: 'बंजारा हिल्स, हैदराबाद • त्वरित स्लॉट अनुरोध',
    patientName: 'पूरा नाम',
    phoneNumber: 'मोबाइल नंबर',
    preferredTreatment: 'उपचार',
    preferredTime: 'पसंदीदा समय',
    confirmBooking: 'अपॉइंटमेंट कन्फर्म करें',
    bookingConfirmedTitle: 'अपॉइंटमेंट अनुरोध प्राप्त हुआ',
    bookingConfirmedBody: 'हमने आपका पसंदीदा समय सुरक्षित कर लिया है।',
    bookThisTreatment: 'यह उपचार बुक करें',
  },
  TE: {
    clinicName: 'స్మైల్‌కేర్ డెంటల్ క్లినిక్',
    location: 'బంజారా హిల్స్, హైదరాబాద్',
    branchName: 'బంజారా హిల్స్ బ్రాంచ్',
    shortcuts: {
      about: 'మా గురించి',
      contact: 'సంప్రదించండి',
      faqs: 'ప్రశ్నలు',
      reviews: 'సమీక్షలు',
    },
    liveQueue: 'లైవ్ క్యూ',
    liveTag: 'లైవ్',
    nowServing: 'ప్రస్తుత నంబర్',
    yourToken: 'మీ టోకెన్',
    ourTreatments: 'మా చికిత్సలు',
    viewAll: 'అన్నీ చూడండి',
    offerTag: 'కొత్త పేషెంట్ ఆఫర్',
    offerHeadlinePrefix: 'గరిష్టంగా',
    offerHeadlineSuffix: 'తగ్గింపు',
    offerDescription: 'డెంటల్ చెకప్‌పై',
    bookNow: 'ఇప్పుడే బుక్ చేయండి',
    nav: {
      home: 'హోమ్',
      appointments: 'అపాయింట్‌మెంట్లు',
      services: 'సేవలు',
      profile: 'ప్రొఫైల్',
    },
    notificationsTitle: 'క్లినిక్ నోటిఫికేషన్లు',
    markAllRead: 'అన్నీ చదివినట్లు గుర్తించు',
    noNotifications: 'కొత్త నోటిఫికేషన్లు లేవు.',
    languageTitle: 'భాషను ఎంచుకోండి',
    comingSoonBadge: 'తదుపరి దశ ప్రివ్యూ',
    close: 'మూసివేయండి',
    tokenModalTitle: 'లైవ్ క్యూ & టోకెన్ స్థితి',
    tokenStatusWaiting: 'వేచి ఉన్నారు',
    tokenStatusNext: 'తదుపరి వంతు',
    tokenStatusServing: 'ప్రస్తుతం సేవలో',
    tokenStatusCompleted: 'పూర్తయింది',
    patientsAhead: 'ముందున్న వారు',
    estWait: 'అంచనా సమయం',
    configureTokenLabel: 'మీ టోకెన్ నంబర్ మార్చండి',
    updateTokenBtn: 'టోకెన్ అప్‌డేట్ చేయండి',
    simulateNextBtn: 'తదుపరి టోకెన్',
    bookTitle: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    bookSubtitle: 'బంజారా హిల్స్, హైదరాబాద్ • తక్షణ స్లాట్ అభ్యర్థన',
    patientName: 'పూర్తి పేరు',
    phoneNumber: 'మొబైల్ నంబర్',
    preferredTreatment: 'చికిత్స',
    preferredTime: 'అనుకూల సమయం',
    confirmBooking: 'అపాయింట్‌మెంట్ నిర్ధారించండి',
    bookingConfirmedTitle: 'అపాయింట్‌మెంట్ అభ్యర్థన అందింది',
    bookingConfirmedBody: 'మీ సమయ స్లాట్ రిజర్వ్ చేయబడింది మరియు రిఫరెన్స్ నంబర్ జారీ చేయబడింది.',
    bookThisTreatment: 'ఈ చికిత్సను బుక్ చేయండి',
  },
};

export interface ClinicContactConfig {
  /** Clinic telephone number in E.164 or local dial format (e.g. "+9140XXXXXXXX"). Supply before production launch. */
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
