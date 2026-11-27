import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Headphones,
  LogOut,
  Phone,
  Smartphone,
  Star,
  User,
  X,
} from 'lucide-react';
import { CustomerProfile } from '../data/appointmentsRepository';
import { ProfileToothHeroIllustration } from './DentalIllustrations';
import { validateProfileFields } from './ProfileSubViews';
import { triggerErrorHaptic, triggerSuccessHaptic } from '../utils/haptics';

export interface ProfileDraftState {
  fullName: string;
  mobileNumber: string;
  consentAccepted: boolean;
}

interface ProfilePageProps {
  profile: CustomerProfile;
  draft: ProfileDraftState;
  onChangeDraft: (updater: (prev: ProfileDraftState) => ProfileDraftState) => void;
  onBack: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onCreateProfile: (input: { fullName: string; mobileNumber: string }) => void;
  onLogout: () => void;
  onOpenPersonalDetails: () => void;
  onOpenMyReviews: () => void;
  onOpenReminders: () => void;
  onOpenContactSupport: () => void;
  appDownloadUrl?: string;
}

function ProfileCardAvatarIcon() {
  return (
    <div className="w-[78px] h-[78px] rounded-full mx-auto bg-gradient-to-b from-[#FFFFFF] via-[#F2F7FF] to-[#D4E6FF] border-[3px] border-white/90 shadow-[0_6px_18px_rgba(0,44,128,0.28)] flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 64 64" fill="none" className="w-[54px] h-[54px] mt-2" aria-hidden="true">
        <defs>
          <linearGradient id="avatarSilhouetteGrad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D95FF" />
            <stop offset="100%" stopColor="#005DE8" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="21" r="10.5" fill="url(#avatarSilhouetteGrad)" />
        <path
          d="M12 56 C12 43.5, 20.5 36.5, 32 36.5 C43.5 36.5, 52 43.5, 52 56 Z"
          fill="url(#avatarSilhouetteGrad)"
        />
      </svg>
    </div>
  );
}

export function ProfilePage({
  profile,
  draft,
  onChangeDraft,
  onBack,
  onOpenTerms,
  onOpenPrivacy,
  onCreateProfile,
  onLogout,
  onOpenPersonalDetails,
  onOpenMyReviews,
  onOpenReminders,
  onOpenContactSupport,
  appDownloadUrl,
}: ProfilePageProps) {
  const [errors, setErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    consent?: string;
  }>({});
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [profile.isLoggedIn]);

  useEffect(() => {
    if (!showLogoutDialog && !showDownloadDialog) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutDialog(false);
        setShowDownloadDialog(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showLogoutDialog, showDownloadDialog]);

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateProfileFields({
      fullName: draft.fullName,
      mobileNumber: draft.mobileNumber,
    });

    const nextErrors: {
      fullName?: string;
      mobileNumber?: string;
      consent?: string;
    } = { ...fieldErrors };

    if (!draft.consentAccepted) {
      nextErrors.consent =
        'Please agree to the Terms & Conditions and Privacy Policy to continue.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      triggerErrorHaptic();
      return;
    }

    triggerSuccessHaptic();
    onCreateProfile({
      fullName: draft.fullName.trim(),
      mobileNumber: draft.mobileNumber.trim(),
    });
  };

  const handleDownloadAppClick = () => {
    if (appDownloadUrl) {
      window.location.href = appDownloadUrl;
      return;
    }
    setShowDownloadDialog(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Screen 1 – Create Your Profile (Not Logged In)                           */
  /* ------------------------------------------------------------------------ */
  if (!profile.isLoggedIn) {
    return (
      <div>
        <header className="flex items-center gap-3 pt-3.5 md:pt-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Home"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            Profile
          </h1>
        </header>

        <div className="mt-2 sm:mt-4 max-w-[500px] mx-auto pb-2">
          {/* 3D Tooth Illustration */}
          <div className="flex justify-center">
            <ProfileToothHeroIllustration className="w-[158px] h-[158px] sm:w-[174px] sm:h-[174px]" />
          </div>

          <div className="text-center mt-1">
            <h2 className="text-[24px] sm:text-[27px] font-extrabold text-[#0E1B3B] tracking-tight leading-tight">
              Create Your Profile
            </h2>
            <p className="mt-1 text-[14px] sm:text-[15px] font-medium text-[#425478]">
              Enter your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmitCreate} noValidate className="mt-4 sm:mt-5 space-y-3">
            {/* Name Input Field */}
            <div>
              <label htmlFor="create-profile-name" className="sr-only">
                Full Name
              </label>
              <div
                className={`neu-card rounded-[15px] px-4 h-[52px] flex items-center gap-3 transition-colors ${
                  errors.fullName
                    ? '!border-[#E5484D]'
                    : 'focus-within:!border-[#0070FF]'
                }`}
              >
                <User className="w-5 h-5 text-[#536585] shrink-0" strokeWidth={1.9} />
                <input
                  id="create-profile-name"
                  type="text"
                  autoComplete="name"
                  value={draft.fullName}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeDraft((prev) => ({ ...prev, fullName: val }));
                    if (errors.fullName) {
                      setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-[14.5px] font-medium text-[#0E1B3B] placeholder:text-[#5B6C89] focus:outline-none"
                />
              </div>
              {errors.fullName && (
                <p
                  role="alert"
                  className="mt-1.5 px-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#C62828]"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Mobile Number Input Field */}
            <div>
              <label htmlFor="create-profile-mobile" className="sr-only">
                Mobile Number
              </label>
              <div
                className={`neu-card rounded-[15px] px-4 h-[52px] flex items-center gap-3 transition-colors ${
                  errors.mobileNumber
                    ? '!border-[#E5484D]'
                    : 'focus-within:!border-[#0070FF]'
                }`}
              >
                <Phone className="w-5 h-5 text-[#536585] shrink-0" strokeWidth={1.9} />
                <input
                  id="create-profile-mobile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={draft.mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeDraft((prev) => ({ ...prev, mobileNumber: val }));
                    if (errors.mobileNumber) {
                      setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
                    }
                  }}
                  placeholder="Enter your mobile number"
                  className="w-full bg-transparent text-[14.5px] font-medium text-[#0E1B3B] placeholder:text-[#5B6C89] focus:outline-none tabular-nums"
                />
              </div>
              {errors.mobileNumber && (
                <p
                  role="alert"
                  className="mt-1.5 px-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#C62828]"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.mobileNumber}</span>
                </p>
              )}
            </div>

            {/* Consent Checkbox Row */}
            <div>
              <div
                className={`neu-card rounded-[13px] px-2.5 sm:px-3.5 py-1.5 min-h-[40px] sm:min-h-[42px] flex items-center gap-1.5 sm:gap-2.5 ${
                  errors.consent ? '!border-[#E5484D]' : ''
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={draft.consentAccepted}
                  aria-label="Agree to Terms and Conditions and Privacy Policy"
                  onClick={() => {
                    onChangeDraft((prev) => ({
                      ...prev,
                      consentAccepted: !prev.consentAccepted,
                    }));
                    if (errors.consent) {
                      setErrors((prev) => ({ ...prev, consent: undefined }));
                    }
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 -ml-0.5 flex items-center justify-center shrink-0 rounded-[8px] neu-press-soft focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                >
                  <span
                    className={`w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] rounded-[5px] border-[1.7px] flex items-center justify-center transition-colors ${
                      draft.consentAccepted
                        ? 'bg-[#0070FF] border-[#0070FF] text-white'
                        : 'bg-white/75 border-[#425478]'
                    }`}
                  >
                    {draft.consentAccepted && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />}
                  </span>
                </button>

                <p className="text-[clamp(10px,2.8vw,13px)] font-medium text-[#3A4A6B] leading-none whitespace-nowrap">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-[#0070FF] underline font-semibold hover:text-[#0057D6] neu-press-soft rounded-[3px] py-1 inline align-baseline leading-none"
                  >
                    Terms &amp; Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="text-[#0070FF] underline font-semibold hover:text-[#0057D6] neu-press-soft rounded-[3px] py-1 inline align-baseline leading-none"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>

              {errors.consent && (
                <p
                  role="alert"
                  className="mt-1.5 px-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#C62828]"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Create Profile Primary CTA */}
            <div className="pt-1">
              <button
                type="submit"
                data-haptic="deferred"
                className="w-full h-[52px] rounded-[16px] neu-blue-btn text-[16px] font-bold text-white flex items-center justify-center"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Screen 2 – Logged-In Profile                                             */
  /* ------------------------------------------------------------------------ */
  const menuItems = [
    {
      id: 'personal-details',
      label: 'Personal Details',
      icon: User,
      onClick: onOpenPersonalDetails,
    },
    {
      id: 'my-reviews',
      label: 'My Reviews',
      icon: Star,
      onClick: onOpenMyReviews,
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      onClick: onOpenReminders,
    },
    {
      id: 'contact-support',
      label: 'Contact Support',
      icon: Headphones,
      onClick: onOpenContactSupport,
    },
  ];

  return (
    <div>
      <header className="flex items-center gap-3 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Home"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Profile
        </h1>
      </header>

      <div className="mt-3.5 sm:mt-4 max-w-[600px] mx-auto space-y-3 sm:space-y-3.5 pb-2">
        {/* Blue Gradient Profile Card */}
        <section
          aria-label="Logged in profile summary"
          className="relative rounded-[20px] sm:rounded-[22px] px-5 py-5 sm:py-6 text-center overflow-hidden bg-gradient-to-br from-[#23AEFF] via-[#0070FF] to-[#0050DB] border border-white/40 shadow-[0_10px_24px_rgba(0,102,245,0.28)]"
        >
          {/* Curved subtle decorative sweeps matching reference */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-12 w-56 h-56 rounded-full bg-white/10"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -bottom-16 w-60 h-60 rounded-full bg-[#66CBFF]/15"
          />

          <div className="relative z-10">
            <ProfileCardAvatarIcon />
            <h2 className="mt-2.5 text-[21px] sm:text-[23px] font-extrabold text-white tracking-tight leading-snug break-words">
              {profile.fullName}
            </h2>
            <p className="mt-0.5 text-[14px] sm:text-[15px] font-semibold text-white/95 tabular-nums">
              {profile.mobileNumber}
            </p>
          </div>
        </section>

        {/* 4 Profile Menu Rows */}
        <nav aria-label="Profile options" className="space-y-2.5 sm:space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="w-full neu-card-interactive rounded-[16px] px-4 py-3.5 min-h-[54px] flex items-center justify-between gap-3 text-left"
              >
                <span className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className="w-[22px] h-[22px] text-[#0070FF] shrink-0"
                    strokeWidth={1.9}
                  />
                  <span className="text-[15px] sm:text-[15.5px] font-bold text-[#0E1B3B] truncate">
                    {item.label}
                  </span>
                </span>
                <ChevronRight
                  className="w-[19px] h-[19px] text-[#0E1B3B] shrink-0"
                  strokeWidth={2.2}
                />
              </button>
            );
          })}
        </nav>

        {/* Bottom Equal-Width Dual Buttons: Download App | Logout */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleDownloadAppClick}
            className="w-full h-[50px] sm:h-[52px] rounded-[15px] neu-blue-btn px-2.5 sm:px-3.5 flex items-center justify-center gap-2 sm:gap-2.5 text-white font-bold text-[13.5px] sm:text-[15px] whitespace-nowrap"
          >
            <Download className="w-[18px] h-[18px] shrink-0" strokeWidth={2.1} />
            <span className="w-px h-5 bg-white/35 shrink-0" aria-hidden="true" />
            <span>Download App</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutDialog(true)}
            className="w-full h-[50px] sm:h-[52px] rounded-[15px] neu-blue-btn px-2.5 sm:px-3.5 flex items-center justify-center gap-2 sm:gap-2.5 text-white font-bold text-[13.5px] sm:text-[15px] whitespace-nowrap"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2.1} />
            <span className="w-px h-5 bg-white/35 shrink-0" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          onClick={() => setShowLogoutDialog(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1B3B]/45 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-[24px] bg-[#F4F9FF] border border-white/95 shadow-[0_20px_50px_rgba(14,27,59,0.3)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E5F0FE] flex items-center justify-center text-[#0070FF]">
                  <LogOut className="w-4 h-4" />
                </div>
                <h3
                  id="logout-dialog-title"
                  className="text-[17px] font-extrabold text-[#0E1B3B]"
                >
                  Confirm Logout
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutDialog(false)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13.5px] font-medium text-[#425478] leading-relaxed">
              Are you sure you want to log out? Your locally saved profile session for{' '}
              <span className="font-bold text-[#0E1B3B]">{profile.fullName}</span> will be cleared
              from this device.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutDialog(false)}
                className="h-[46px] rounded-[14px] bg-white border border-[#D4E2F4] hover:bg-[#EFF6FF] text-[14px] font-bold text-[#0E1B3B] neu-press-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                data-haptic="deferred"
                onClick={() => {
                  triggerSuccessHaptic();
                  setShowLogoutDialog(false);
                  onLogout();
                }}
                className="h-[46px] rounded-[14px] neu-blue-btn text-[14px] font-bold text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download App Unconfigured Notice Dialog */}
      {showDownloadDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-dialog-title"
          onClick={() => setShowDownloadDialog(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1B3B]/45 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-[24px] bg-[#F4F9FF] border border-white/95 shadow-[0_20px_50px_rgba(14,27,59,0.3)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E5F0FE] flex items-center justify-center text-[#0070FF]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3
                  id="download-dialog-title"
                  className="text-[17px] font-extrabold text-[#0E1B3B]"
                >
                  App Download Unavailable
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDownloadDialog(false)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13.5px] font-medium text-[#425478] leading-relaxed">
              A direct mobile app download link has not been configured yet. You can continue using
              all SmileCare Dental Clinic features directly in your browser.
            </p>

            <button
              type="button"
              onClick={() => setShowDownloadDialog(false)}
              className="w-full h-[46px] rounded-[14px] neu-blue-btn text-[14px] font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
