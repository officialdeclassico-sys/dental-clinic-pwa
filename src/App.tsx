import React, { useCallback, useEffect, useState } from 'react';
import { AboutUsPage } from './components/AboutUsPage';
import { AddReviewPage } from './components/AddReviewPage';
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
import { LegalDocumentPage } from './components/LegalDocumentPage';
import { LiveQueueCard } from './components/LiveQueueCard';
import { NewPatientOfferBanner } from './components/NewPatientOfferBanner';
import { ProfileDraftState, ProfilePage } from './components/ProfilePage';
import { MyReviewsView, PersonalDetailsView } from './components/ProfileSubViews';
import { ReviewsPage } from './components/ReviewsPage';
import { ServicesPage } from './components/ServicesPage';
import { ShortcutCards } from './components/ShortcutCards';
import { TreatmentsSection } from './components/TreatmentsSection';
import {
  AppointmentRecord,
  BookingTreatmentId,
  CustomerProfile,
  clearCustomerProfileSession,
  createProfileSession,
  fetchAppointments,
  getSavedCustomerProfile,
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
import { ReviewRecord, fetchReviews } from './data/reviewsRepository';
import { ServiceCatalogItem } from './data/servicesData';

type PageId =
  | 'home'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'reviews'
  | 'add-review'
  | 'services'
  | 'appointments'
  | 'booking'
  | 'my-appointments'
  | 'appointment-history'
  | 'reminders'
  | 'cancel-reschedule'
  | 'profile'
  | 'terms-document'
  | 'privacy-document'
  | 'personal-details'
  | 'my-reviews'
  | 'profile-reminders'
  | 'profile-contact';

const APPOINTMENT_PAGES: PageId[] = [
  'appointments',
  'booking',
  'my-appointments',
  'appointment-history',
  'reminders',
  'cancel-reschedule',
];

const PROFILE_PAGES: PageId[] = [
  'profile',
  'terms-document',
  'privacy-document',
  'personal-details',
  'my-reviews',
  'profile-reminders',
  'profile-contact',
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
  const [bookingService, setBookingService] = useState<ServiceCatalogItem | null>(null);
  const [bookingApplyOffer, setBookingApplyOffer] = useState<boolean>(false);
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [justPublishedReview, setJustPublishedReview] = useState<boolean>(false);

  // Profile state (persisted in localStorage) & draft state preserved across document views
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() =>
    getSavedCustomerProfile()
  );
  const [profileDraft, setProfileDraft] = useState<ProfileDraftState>({
    fullName: '',
    mobileNumber: '',
    consentAccepted: false,
  });

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

  const refreshReviews = useCallback(async () => {
    try {
      const list = await fetchReviews();
      setReviews(list);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAppointments();
    refreshReviews();
  }, [refreshAppointments, refreshReviews]);

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
    if (page !== 'reviews') {
      setJustPublishedReview(false);
    }
    setPageStack((prev) => [...prev, page]);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateBack = () => {
    setPageStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : ['home']));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const openBookingFlow = (
    treatmentId?: BookingTreatmentId,
    applyOffer = false,
    serviceItem: ServiceCatalogItem | null = null
  ) => {
    setBookingService(serviceItem);
    setBookingTreatment(serviceItem ? serviceItem.bookingTreatmentId : treatmentId);
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
    if (
      shortcutId === 'about' ||
      shortcutId === 'contact' ||
      shortcutId === 'faqs' ||
      shortcutId === 'reviews'
    ) {
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
    if (tabId === 'services') {
      setModal({ type: 'none' });
      setPageStack(['home', 'services']);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (tabId === 'profile') {
      setModal({ type: 'none' });
      setPageStack(['home', 'profile']);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setModal({ type: 'navPlaceholder', tabId });
  };

  const activeNavTab: NavTabId =
    modal.type === 'navPlaceholder'
      ? modal.tabId
      : PROFILE_PAGES.includes(currentPage)
        ? 'profile'
        : currentPage === 'services'
          ? 'services'
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
        ) : currentPage === 'reviews' ? (
          <ReviewsPage
            reviews={reviews}
            loading={reviewsLoading}
            justPublished={justPublishedReview}
            onDismissJustPublished={() => setJustPublishedReview(false)}
            onBack={navigateBack}
            onAddReview={() => navigateTo('add-review')}
          />
        ) : currentPage === 'add-review' ? (
          <AddReviewPage
            onBack={navigateBack}
            onReviewSubmitted={(newReview) => {
              setReviews((prev) => [
                newReview,
                ...prev.filter((r) => r.reviewId !== newReview.reviewId),
              ]);
              setJustPublishedReview(true);
              setPageStack((prev) => {
                const withoutAdd = prev.filter((p) => p !== 'add-review');
                if (withoutAdd[withoutAdd.length - 1] === 'reviews') {
                  return withoutAdd;
                }
                return [...withoutAdd, 'reviews'];
              });
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        ) : currentPage === 'services' ? (
          <ServicesPage
            onBack={navigateBack}
            onBookAppointment={(serviceItem) =>
              openBookingFlow(
                serviceItem?.bookingTreatmentId,
                false,
                serviceItem ?? null
              )
            }
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
            preselectedService={bookingService}
            applyOffer={bookingApplyOffer}
            onBack={navigateBack}
            onDoneToAppointments={() => {
              setPageStack(['home', 'appointments']);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            onBookingCreated={() => {
              refreshAppointments();
              setCustomerProfile(getSavedCustomerProfile());
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
        ) : currentPage === 'reminders' || currentPage === 'profile-reminders' ? (
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
        ) : currentPage === 'profile' ? (
          <ProfilePage
            profile={customerProfile}
            draft={profileDraft}
            onChangeDraft={setProfileDraft}
            onBack={navigateBack}
            onOpenTerms={() => navigateTo('terms-document')}
            onOpenPrivacy={() => navigateTo('privacy-document')}
            onCreateProfile={({ fullName, mobileNumber }) => {
              const created = createProfileSession({ fullName, mobileNumber });
              setCustomerProfile(created);
              setProfileDraft({
                fullName: '',
                mobileNumber: '',
                consentAccepted: false,
              });
            }}
            onLogout={() => {
              const cleared = clearCustomerProfileSession();
              setCustomerProfile(cleared);
              setProfileDraft({
                fullName: '',
                mobileNumber: '',
                consentAccepted: false,
              });
            }}
            onOpenPersonalDetails={() => navigateTo('personal-details')}
            onOpenMyReviews={() => navigateTo('my-reviews')}
            onOpenReminders={() => navigateTo('profile-reminders')}
            onOpenContactSupport={() => navigateTo('profile-contact')}
          />
        ) : currentPage === 'terms-document' ? (
          <LegalDocumentPage documentType="terms" onBack={navigateBack} />
        ) : currentPage === 'privacy-document' ? (
          <LegalDocumentPage documentType="privacy" onBack={navigateBack} />
        ) : currentPage === 'personal-details' ? (
          <PersonalDetailsView
            profile={customerProfile}
            onBack={navigateBack}
            onProfileUpdated={setCustomerProfile}
          />
        ) : currentPage === 'my-reviews' ? (
          <MyReviewsView
            profile={customerProfile}
            reviews={reviews}
            onBack={navigateBack}
            onAddReview={() => navigateTo('add-review')}
            onViewAllReviews={() => navigateTo('reviews')}
          />
        ) : currentPage === 'profile-contact' ? (
          <ContactUsPage onBack={navigateBack} />
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
