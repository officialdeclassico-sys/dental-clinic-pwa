import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Mail,
  Phone,
  SquarePen,
  Star,
  User,
} from 'lucide-react';
import {
  CustomerProfile,
  saveCustomerProfile,
} from '../data/appointmentsRepository';
import { ReviewRecord, formatRelativeDate } from '../data/reviewsRepository';

export function validateProfileFields(input: {
  fullName: string;
  mobileNumber: string;
}): { fullName?: string; mobileNumber?: string } {
  const errors: { fullName?: string; mobileNumber?: string } = {};
  const trimmedName = input.fullName.trim();
  const trimmedPhone = input.mobileNumber.trim();

  if (!trimmedName) {
    errors.fullName = 'Please enter your name.';
  }

  if (!trimmedPhone) {
    errors.mobileNumber = 'Please enter your mobile number.';
  } else if (!/^[+\d\s()-]+$/.test(trimmedPhone)) {
    errors.mobileNumber = 'Mobile number may only contain digits, spaces, +, -, or parentheses.';
  } else {
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      errors.mobileNumber = 'Please enter a valid mobile number (10 to 15 digits).';
    }
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/* 1. Personal Details Sub-View                                               */
/* -------------------------------------------------------------------------- */

interface PersonalDetailsViewProps {
  profile: CustomerProfile;
  onBack: () => void;
  onProfileUpdated: (updated: CustomerProfile) => void;
}

export function PersonalDetailsView({
  profile,
  onBack,
  onProfileUpdated,
}: PersonalDetailsViewProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    email?: string;
  }>({});
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    setFullName(profile.fullName);
    setMobileNumber(profile.mobileNumber);
    setEmail(profile.email);
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(false);

    const nextErrors: {
      fullName?: string;
      mobileNumber?: string;
      email?: string;
    } = validateProfileFields({ fullName, mobileNumber });

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const updated = saveCustomerProfile({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: trimmedEmail,
    });
    onProfileUpdated(updated);
    setSavedNotice(true);
  };

  return (
    <div>
      <header className="flex items-center gap-3 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Profile"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Personal Details
        </h1>
      </header>

      <div className="mt-4 max-w-[560px] mx-auto">
        {savedNotice && (
          <div
            role="status"
            className="mb-3 rounded-[15px] bg-[#D7F5E5] border border-[#A6E3C3] px-3.5 py-2.5 flex items-center gap-2 text-[12.5px] font-bold text-[#117A45]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Personal details updated and saved locally.</span>
          </div>
        )}

        <form onSubmit={handleSave} noValidate className="neu-card rounded-[20px] p-4 sm:p-5 space-y-3.5">
          <div>
            <label
              htmlFor="pd-full-name"
              className="block text-[12.5px] font-extrabold text-[#0E1B3B] mb-1.5"
            >
              Full Name
            </label>
            <div className="rounded-[14px] bg-white/95 border border-[#D8E5F6] px-3.5 h-[48px] flex items-center gap-2.5 focus-within:border-[#0070FF]">
              <User className="w-[18px] h-[18px] text-[#536585] shrink-0" />
              <input
                id="pd-full-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Enter your name"
                className="w-full bg-transparent text-[14px] font-semibold text-[#0E1B3B] placeholder:text-[#7A8BA8] focus:outline-none"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#C62828]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="pd-mobile"
              className="block text-[12.5px] font-extrabold text-[#0E1B3B] mb-1.5"
            >
              Mobile Number
            </label>
            <div className="rounded-[14px] bg-white/95 border border-[#D8E5F6] px-3.5 h-[48px] flex items-center gap-2.5 focus-within:border-[#0070FF]">
              <Phone className="w-[18px] h-[18px] text-[#536585] shrink-0" />
              <input
                id="pd-mobile"
                type="tel"
                inputMode="tel"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
                }}
                placeholder="Enter your mobile number"
                className="w-full bg-transparent text-[14px] font-semibold text-[#0E1B3B] placeholder:text-[#7A8BA8] focus:outline-none tabular-nums"
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#C62828]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.mobileNumber}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="pd-email"
              className="block text-[12.5px] font-extrabold text-[#0E1B3B] mb-1.5"
            >
              Email Address <span className="font-semibold text-[#5B7096]">(Optional)</span>
            </label>
            <div className="rounded-[14px] bg-white/95 border border-[#D8E5F6] px-3.5 h-[48px] flex items-center gap-2.5 focus-within:border-[#0070FF]">
              <Mail className="w-[18px] h-[18px] text-[#536585] shrink-0" />
              <input
                id="pd-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-[14px] font-semibold text-[#0E1B3B] placeholder:text-[#7A8BA8] focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#C62828]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[50px] rounded-[15px] neu-blue-btn text-[15px] font-bold text-white"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. My Reviews Sub-View                                                     */
/* -------------------------------------------------------------------------- */

interface MyReviewsViewProps {
  profile: CustomerProfile;
  reviews: ReviewRecord[];
  onBack: () => void;
  onAddReview: () => void;
  onViewAllReviews: () => void;
}

export function MyReviewsView({
  profile,
  reviews,
  onBack,
  onAddReview,
  onViewAllReviews,
}: MyReviewsViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const myReviews = useMemo(() => {
    const normalizedName = profile.fullName.trim().toLowerCase();
    return reviews.filter(
      (r) =>
        !r.isSamplePreview &&
        (r.customerId === profile.customerId ||
          (normalizedName && r.customerName.trim().toLowerCase() === normalizedName))
    );
  }, [reviews, profile]);

  return (
    <div>
      <header className="flex items-center justify-between gap-2 pt-3.5 md:pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Profile"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            My Reviews
          </h1>
        </div>

        <button
          type="button"
          onClick={onAddReview}
          className="neu-blue-btn rounded-full px-3.5 sm:px-4 py-2 text-[12.5px] sm:text-[13px] font-bold text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <SquarePen className="w-4 h-4" strokeWidth={2.2} />
          <span>Add Review</span>
        </button>
      </header>

      <div className="mt-4 max-w-[720px] mx-auto space-y-3">
        {myReviews.length === 0 ? (
          <div className="neu-card rounded-[20px] p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E5F0FE] border border-white mx-auto flex items-center justify-center text-[#0070FF]">
              <Star className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-[#0E1B3B]">No Reviews Submitted Yet</h2>
              <p className="mt-1 text-[13px] font-medium text-[#425478]">
                Reviews you publish while signed in as {profile.fullName} will appear here.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onAddReview}
                className="w-full sm:w-auto px-5 h-[46px] rounded-[14px] neu-blue-btn text-[14px] font-bold text-white"
              >
                Write a Review
              </button>
              <button
                type="button"
                onClick={onViewAllReviews}
                className="w-full sm:w-auto px-5 h-[46px] rounded-[14px] neu-card-interactive text-[14px] font-bold text-[#0E1B3B]"
              >
                Browse Clinic Reviews
              </button>
            </div>
          </div>
        ) : (
          <>
            {myReviews.map((review) => (
              <article key={review.reviewId} className="neu-card rounded-[20px] p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-[#0E1B3B]">
                      {review.serviceName || 'SmileCare Dental Visit'}
                    </h2>
                    <span className="text-[11.5px] font-semibold text-[#5B7096]">
                      {formatRelativeDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-4 h-4 ${
                          n <= review.rating
                            ? 'text-[#FFB800] fill-[#FFB800]'
                            : 'text-[#C8D7EA] fill-[#C8D7EA]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.reviewText && (
                  <p className="text-[13px] font-medium text-[#1A2B50] leading-relaxed">
                    {review.reviewText}
                  </p>
                )}
              </article>
            ))}

            <button
              type="button"
              onClick={onViewAllReviews}
              className="w-full h-[48px] rounded-[15px] neu-card-interactive text-[14px] font-bold text-[#0070FF]"
            >
              View All Clinic Reviews
            </button>
          </>
        )}
      </div>
    </div>
  );
}
