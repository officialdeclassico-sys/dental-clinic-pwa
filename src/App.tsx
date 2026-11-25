import React, { useCallback, useEffect, useState } from 'react';
import { AboutUsPage } from './components/AboutUsPage';
import {
  AppointmentHistoryView,
  CancelRescheduleView,
  MyAppointmentsView,
  RemindersView,
} from './components/AppointmentSubViews';
import { AppointmentsPage } from './components/AppointmentsPage';
import { BookingFlowView } from './components/BookingFlowView';
import { BottomNav } from './components/BottomNav';
import { ClinicHeader } from './components/ClinicHeader';
import { ContactUsPage } from './components/ContactUsPage';
import { FaqsPage } from './components/FaqsPage';
import { HeroCarousel } from './components/HeroCarousel';
import { ActiveModalState, HomepageModals } from './components/HomepageModals';
import { LiveQueueCard } from './components/LiveQueueCard';
import { NewPatientOfferBanner } from './components/NewPatientOfferBanner';
import { ShortcutCards } from './components/ShortcutCards';
import { TreatmentsSection } from './components/TreatmentsSection';
import {
  AppointmentRecord,
  BookingTreatmentId,
  fetchAppointments,
} from './data/appointmentsRepository';
import {
  ClinicNotification,
  DEFAULT_CLINIC_CONFIG,
  HERO_BANNERS,
  HeroBannerItem,
  INITIAL_NOTIFICATIONS,
  LanguageCode,
  NavTabId,
  ShortcutId,
  TREATMENTS,
  UI_STRINGS,
} from './data/clinicData';

type PageId =
  | 'home'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'appointments'
  | 'booking'
  | 'my-appointments'
  | 'appointment-history'
  | 'reminders'
  | 'cancel-reschedule';

const APPOINTMENT_PAGES: PageId[] = [
  'appointments',
  'booking',
  'my-appointments',
  'appointment-history',
  'reminders',
  'cancel-reschedule',
];

export default function App() {
  const [config] = useState(DEFAULT_CLINIC_CONFIG);
  const [language, setLanguage] = useState<LanguageCode>('EN');
  const [notifications, setNotifications] = useState<ClinicNotification[]>(INITIAL_NOTIFICATIONS);
  const [servingNumber, setServingNumber] = useState<number>(config.initialServingNumber);
  const [userToken, setUserToken] = useState<string>(config.defaultToken);
  const [modal, setModal] = useState<ActiveModalState>({ type: 'none' });
  const [pageStack, setPageStack] = useState<PageId[]>(['home']);
  const [aboutVisitId, setAboutVisitId] = useState<number>(0);

  // Appointments state
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [bookingTreatment, setBookingTreatment] = useState<BookingTreatmentId | undefined>(
    undefined
  );
  const [bookingApplyOffer, setBookingApplyOffer] = useState<boolean>(false);
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);

  const currentPage = pageStack[pageStack.length - 1] ?? 'home';
  const t = UI_STRINGS[language];

  const refreshAppointments = useCallback(async () => {
    try {
      const list = await fetchAppointments();
      setAppointments(list);
    } finally {
      setAppointmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  // Simulated real-time queue progression (loops cleanly in realistic range)
  useEffect(() => {
    const interval = window.setInterval(() => {
      setServingNumber((prev) => (prev >= 24 ? config.initialServingNumber : prev + 1));
    }, 15000);
    return () => window.clearInterval(interval);
  }, [config.initialServingNumber]);

  const navigateTo = (page: PageId) => {
    setModal({ type: 'none' });
    if (page === 'about') {
      setAboutVisitId((prev) => prev + 1);
    }
    setPageStack((prev) => [...prev, page]);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateBack = () => {
    setPageStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : ['home']));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const openBookingFlow = (treatmentId?: BookingTreatmentId, applyOffer = false) => {
    setBookingTreatment(treatmentId);
    setBookingApplyOffer(applyOffer);
    navigateTo('booking');
  };

  const handleBannerAction = (actionType: HeroBannerItem['actionType']) => {
    switch (actionType) {
      case 'book':
        openBookingFlow(undefined, false);
        break;
      case 'treatments':
        setModal({ type: 'viewAllTreatments' });
        break;
      case 'orthodontics':
        setModal({ type: 'treatment', treatmentId: 'orthodontics' });
        break;
      case 'cosmetic':
        openBookingFlow('cosmetic', false);
        break;
    }
  };

  const handleSelectShortcut = (shortcutId: ShortcutId) => {
    if (shortcutId === 'about' || shortcutId === 'contact' || shortcutId === 'faqs') {
      navigateTo(shortcutId);
      return;
    }
    setModal({ type: 'shortcut', shortcutId });
  };

  const handleNavSelect = (tabId: NavTabId) => {
    if (tabId === 'home') {
      setModal({ type: 'none' });
      setPageStack(['home']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'appointments') {
      setModal({ type: 'none' });
      setPageStack(['home', 'appointments']);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setModal({ type: 'navPlaceholder', tabId });
  };

  const activeNavTab: NavTabId =
    modal.type === 'navPlaceholder'
      ? modal.tabId
      : APPOINTMENT_PAGES.includes(currentPage)
        ? 'appointments'
        : 'home';

  return (
    <div className="app-container min-h-screen w-full overflow-x-clip bg-[#E6F1FC] text-[#0E1B3B] flex flex-col">
      <main className="app-scroll-container w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 main-bottom-clearance flex-1">
        {currentPage === 'about' ? (
          <AboutUsPage visitId={aboutVisitId} onBack={navigateBack} />
        ) : currentPage === 'contact' ? (
          <ContactUsPage onBack={navigateBack} />
        ) : currentPage === 'faqs' ? (
          <FaqsPage
            onBack={navigateBack}
            onContactUs={() => navigateTo('contact')}
          />
        ) : currentPage === 'appointments' ? (
          <AppointmentsPage
            appointments={appointments}
            loading={appointmentsLoading}
            onBack={navigateBack}
            onBookNew={(treatment) => openBookingFlow(treatment, false)}
            onOpenMyAppointments={() => navigateTo('my-appointments')}
            onOpenHistory={() => navigateTo('appointment-history')}
            onOpenReminders={() => navigateTo('reminders')}
            onOpenCancelReschedule={(id) => {
              setRescheduleTargetId(id ?? null);
              navigateTo('cancel-reschedule');
            }}
          />
        ) : currentPage === 'booking' ? (
          <BookingFlowView
            initialTreatmentId={bookingTreatment}
            applyOffer={bookingApplyOffer}
            onBack={navigateBack}
            onDoneToAppointments={() => {
              setPageStack(['home', 'appointments']);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onBookingCreated={() => {
              refreshAppointments();
            }}
            onViewMyAppointments={() => {
              setPageStack(['home', 'appointments', 'my-appointments']);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        ) : currentPage === 'my-appointments' ? (
          <MyAppointmentsView
            appointments={appointments}
            loading={appointmentsLoading}
            onBack={navigateBack}
            onBookNew={() => openBookingFlow(undefined, false)}
            onOpenCancelReschedule={(id) => {
              setRescheduleTargetId(id);
              navigateTo('cancel-reschedule');
            }}
          />
        ) : currentPage === 'appointment-history' ? (
          <AppointmentHistoryView
            appointments={appointments}
            loading={appointmentsLoading}
            onBack={navigateBack}
          />
        ) : currentPage === 'reminders' ? (
          <RemindersView
            appointments={appointments}
            onBack={navigateBack}
            onAppointmentsChanged={refreshAppointments}
          />
        ) : currentPage === 'cancel-reschedule' ? (
          <CancelRescheduleView
            appointments={appointments}
            initialAppointmentId={rescheduleTargetId}
            onBack={navigateBack}
            onAppointmentsChanged={refreshAppointments}
          />
        ) : (
          <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
            <ClinicHeader
              clinicName={language === 'EN' ? config.clinicName : t.clinicName}
              location={language === 'EN' ? config.location : t.location}
              language={language}
              onLanguageChange={setLanguage}
              notifications={notifications}
              onMarkAllRead={() =>
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
              }
              onMarkNotificationRead={(id) =>
                setNotifications((prev) =>
                  prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
                )
              }
              notificationsTitle={t.notificationsTitle}
              markAllReadLabel={t.markAllRead}
              noNotificationsLabel={t.noNotifications}
              languageTitle={t.languageTitle}
            />

            <HeroCarousel
              banners={HERO_BANNERS}
              language={language}
              onBannerAction={handleBannerAction}
            />

            <ShortcutCards
              labels={t.shortcuts}
              onSelectShortcut={handleSelectShortcut}
            />

            <LiveQueueCard
              liveQueueLabel={t.liveQueue}
              liveTagLabel={t.liveTag}
              branchName={language === 'EN' ? config.branchName : t.branchName}
              nowServingLabel={t.nowServing}
              servingNumber={servingNumber}
              yourTokenLabel={t.yourToken}
              userToken={userToken}
              onTokenClick={() => setModal({ type: 'token' })}
            />

            <TreatmentsSection
              heading={t.ourTreatments}
              viewAllLabel={t.viewAll}
              treatments={TREATMENTS}
              language={language}
              onSelectTreatment={(treatmentId) => setModal({ type: 'treatment', treatmentId })}
              onViewAll={() => setModal({ type: 'viewAllTreatments' })}
            />

            <NewPatientOfferBanner
              offerTag={language === 'EN' ? config.offerTag : t.offerTag}
              offerHeadlinePrefix={t.offerHeadlinePrefix}
              offerPercentage={config.offerPercentage}
              offerHeadlineSuffix={t.offerHeadlineSuffix}
              offerDescription={
                language === 'EN' ? config.offerDescription : t.offerDescription
              }
              bookNowLabel={t.bookNow}
              onBookNow={() => openBookingFlow(undefined, true)}
            />
          </div>
        )}
      </main>

      <BottomNav
        activeTab={activeNavTab}
        labels={t.nav}
        onSelectTab={handleNavSelect}
      />

      <HomepageModals
        modal={modal}
        onClose={() => setModal({ type: 'none' })}
        onOpenBooking={(treatmentId, applyOffer) =>
          openBookingFlow(treatmentId, Boolean(applyOffer))
        }
        onSelectTreatment={(treatmentId) => setModal({ type: 'treatment', treatmentId })}
        language={language}
        branchName={language === 'EN' ? config.branchName : t.branchName}
        location={language === 'EN' ? config.location : t.location}
        offerPercentage={config.offerPercentage}
        servingNumber={servingNumber}
        userToken={userToken}
        onUpdateToken={setUserToken}
        onAdvanceQueue={() =>
          setServingNumber((prev) => (prev >= 30 ? config.initialServingNumber : prev + 1))
        }
        treatments={TREATMENTS}
      />
    </div>
  );
}
