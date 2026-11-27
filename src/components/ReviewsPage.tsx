import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Play,
  SquarePen,
  Star,
  Users,
  X,
} from 'lucide-react';
import {
  PLACEHOLDER_VIDEO_REVIEWS,
  ReviewRecord,
  ReviewSortOption,
  VideoReviewCardItem,
  calculateReviewStats,
  formatRelativeDate,
  loadVideoObjectUrlFromIdb,
  sortReviews,
} from '../data/reviewsRepository';
import { PaginationControls } from './PaginationControls';

interface ReviewsPageProps {
  reviews: ReviewRecord[];
  loading: boolean;
  justPublished?: boolean;
  onDismissJustPublished?: () => void;
  onBack: () => void;
  onAddReview: () => void;
}

const REVIEWS_PER_PAGE = 3;

const SORT_LABELS: Record<ReviewSortOption, string> = {
  'most-recent': 'Most Recent',
  'highest-rated': 'Highest Rated',
  'lowest-rated': 'Lowest Rated',
};

function ToothGlowSummaryIllustration() {
  return (
    <div className="relative w-[84px] h-[66px] sm:w-[106px] sm:h-[82px] flex items-center justify-center rounded-[16px] bg-radial from-[#CBE6FF] via-[#DCEEFF]/70 to-transparent overflow-hidden shrink-0">
      <svg viewBox="0 0 96 76" fill="none" className="w-[82px] h-[64px] sm:w-[96px] sm:h-[74px]" aria-hidden="true">
        <defs>
          <radialGradient id="revToothGrad" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="58%" stopColor="#EFF5FF" />
            <stop offset="100%" stopColor="#B8D4FA" />
          </radialGradient>
          <linearGradient id="revRingGrad" x1="8" y1="24" x2="88" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#52C5FF" />
            <stop offset="50%" stopColor="#0070FF" />
            <stop offset="100%" stopColor="#52C5FF" />
          </linearGradient>
        </defs>
        <ellipse cx="48" cy="66" rx="18" ry="4" fill="#6AA5EC" fillOpacity="0.32" />
        {/* Back orbit ring */}
        <path
          d="M12 36c-4-7 12-14 36-14s40 7 36 14"
          stroke="url(#revRingGrad)"
          strokeWidth="2.4"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
        {/* 3D Tooth */}
        <path
          d="M35.5 14c-6.2 0-11 5-11 11.8 0 6.4 2.8 12.1 4.4 20 1.3 6.4 2.6 15.6 6.8 15.6 3.4 0 4.9-6.9 6.9-12.2 1.2-3.1 3.2-4.3 5.4-4.3s4.2 1.2 5.4 4.3c2 5.3 3.5 12.2 6.9 12.2 4.2 0 5.5-9.2 6.8-15.6 1.6-7.9 4.4-13.6 4.4-20 0-6.8-4.8-11.8-11-11.8-4.2 0-7.1 1.8-9.5 3.1-1.9 1-4.1 1-6 0-2.4-1.3-5.3-3.1-9.5-3.1Z"
          fill="url(#revToothGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        {/* Front orbit ring */}
        <path
          d="M12 36c6 9 20 14 36 14s30-5 36-14"
          stroke="url(#revRingGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function StarRow({
  rating,
  sizeClass = 'w-4 h-4',
}: {
  rating: number;
  sizeClass?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sizeClass} ${
            n <= rounded
              ? 'text-[#FFB800] fill-[#FFB800]'
              : 'text-[#C8D7EA] fill-[#C8D7EA]'
          }`}
          strokeWidth={1.6}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'SP';
}

export function ReviewsPage({
  reviews,
  loading,
  justPublished = false,
  onDismissJustPublished,
  onBack,
  onAddReview,
}: ReviewsPageProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('most-recent');
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeVideo, setActiveVideo] = useState<VideoReviewCardItem | null>(null);
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string | null>(null);
  const [videoResolving, setVideoResolving] = useState<boolean>(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortMenuOpen) return;
    const handlePointer = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handlePointer);
    return () => window.removeEventListener('mousedown', handlePointer);
  }, [sortMenuOpen]);

  // Resolve IndexedDB or direct video URL when Video Viewer modal opens
  useEffect(() => {
    let revokedUrl: string | null = null;
    let cancelled = false;

    if (!activeVideo || !activeVideo.videoUrl || activeVideo.isPlaceholder) {
      setResolvedVideoSrc(null);
      setVideoResolving(false);
      return;
    }

    if (activeVideo.videoUrl.startsWith('idb://')) {
      const key = activeVideo.videoUrl.slice('idb://'.length);
      setVideoResolving(true);
      loadVideoObjectUrlFromIdb(key)
        .then((objUrl) => {
          if (cancelled) {
            if (objUrl) URL.revokeObjectURL(objUrl);
            return;
          }
          revokedUrl = objUrl;
          setResolvedVideoSrc(objUrl);
        })
        .finally(() => {
          if (!cancelled) setVideoResolving(false);
        });
    } else {
      setResolvedVideoSrc(activeVideo.videoUrl);
      setVideoResolving(false);
    }

    return () => {
      cancelled = true;
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [activeVideo]);

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

  const sortedReviews = useMemo(
    () => sortReviews(reviews, sortBy),
    [reviews, sortBy]
  );

  // Build video cards list: submitted patient videos first + placeholder video cards
  const videoCards: VideoReviewCardItem[] = useMemo(() => {
    const userVideos: VideoReviewCardItem[] = sortedReviews
      .filter((r) => Boolean(r.videoUrl))
      .map((r) => ({
        id: r.reviewId,
        title: r.videoTitle || 'Patient Video Review',
        thumbnailUrl:
          r.videoThumbnailUrl ||
          '/src/assets/images/about_clinic_interior_1795594382732.jpg',
        videoUrl: r.videoUrl,
        isPlaceholder: false,
        customerName: r.customerName,
        rating: r.rating,
      }));
    return [...userVideos, ...PLACEHOLDER_VIDEO_REVIEWS];
  }, [sortedReviews]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE));

  // Clamp page cleanly if reviews count changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  const handleSortSelect = (nextSort: ReviewSortOption) => {
    setSortBy(nextSort);
    setCurrentPage(1);
    setSortMenuOpen(false);
  };

  return (
    <div>
      {/* Header: Back Chevron + "Reviews" + Blue "Add Review" button */}
      <header className="flex items-center justify-between gap-2 pt-3.5 md:pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Home"
            className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
          </button>
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
            Reviews
          </h1>
        </div>

        <button
          type="button"
          onClick={onAddReview}
          className="neu-blue-btn neu-btn-md px-3.5 sm:px-4.5 py-2 text-[12.5px] sm:text-[13.5px] font-bold text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <SquarePen className="w-4 h-4" strokeWidth={2.2} />
          <span>Add Review</span>
        </button>
      </header>

      <div className="mt-3 space-y-3 sm:space-y-3.5">
        {justPublished && (
          <div
            role="status"
            className="rounded-[15px] bg-[#D7F5E5] border border-[#A6E3C3] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12.5px] font-bold text-[#117A45]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your review has been published.</span>
            </div>
            {onDismissJustPublished && (
              <button
                type="button"
                onClick={onDismissJustPublished}
                aria-label="Dismiss confirmation"
                className="p-0.5 rounded-full hover:bg-black/5 neu-press-soft"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Horizontal Customer Video Reviews Strip */}
        <section aria-label="Customer Video Reviews">
          <div className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-1 snap-x snap-mandatory touch-pan-x">
            {videoCards.map((vid) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => setActiveVideo(vid)}
                aria-label={`Play video review: ${vid.title}`}
                className="relative w-[106px] sm:w-[128px] md:w-[148px] h-[142px] sm:h-[168px] md:h-[192px] shrink-0 rounded-[15px] overflow-hidden neu-service-card bg-[#0E1B3B] snap-start group focus-visible:outline-2 focus-visible:outline-[#0070FF]"
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                />

                {/* Play Button Overlay */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 border border-white/40 flex items-center justify-center text-white shadow-md">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </span>
                </span>

                {/* Bottom Title Scrim */}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-7 pb-2 px-2 text-left">
                  <span className="block text-[11px] sm:text-[12px] font-bold text-white leading-[1.2] line-clamp-2">
                    {vid.title}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Customer Rating Summary Card */}
        <section
          aria-label="Customer Rating Summary"
          className="neu-card rounded-[20px] md:rounded-[24px] px-2.5 sm:px-4 md:px-5 py-3 sm:py-3.5 grid grid-cols-[84px_1fr_auto] sm:grid-cols-[110px_1fr_auto] items-center gap-2 sm:gap-4"
        >
          <ToothGlowSummaryIllustration />

          <div className="border-r border-[#C8DAEE] pr-2.5 sm:pr-5 flex flex-col items-center justify-center text-center">
            <span className="text-[11.5px] sm:text-[13px] font-bold text-[#1E3158] leading-tight">
              Customer Rating
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-0.5 leading-none">
              <span className="text-[28px] sm:text-[34px] font-extrabold text-[#0E1B3B] tabular-nums">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-[15px] sm:text-[17px] font-extrabold text-[#1E3158]">
                /5
              </span>
            </div>
            <div className="mt-1.5">
              <StarRow rating={stats.averageRating} sizeClass="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>

          <div className="pl-1 sm:pl-3 flex flex-col items-center justify-center text-center min-w-[76px] sm:min-w-[96px]">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#0070FF]" strokeWidth={2} />
            <span className="mt-1 text-[20px] sm:text-[24px] font-extrabold text-[#0E1B3B] leading-none tabular-nums">
              {stats.totalReviews.toLocaleString('en-US')}
            </span>
            <span className="mt-1 text-[11px] sm:text-[12px] font-bold text-[#1E3158] leading-tight whitespace-nowrap">
              Total Reviews
            </span>
          </div>
        </section>

        {/* Filter & Sorting Row */}
        <section
          aria-label="Review Filters"
          className="flex items-center justify-between gap-2 relative z-20"
        >
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="neu-blue-btn neu-btn-md px-4 py-2 text-[12px] sm:text-[13px] font-extrabold text-white whitespace-nowrap tabular-nums"
          >
            All Reviews ({stats.totalReviews.toLocaleString('en-US')})
          </button>

          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setSortMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
              className="neu-card-interactive neu-btn-md px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-extrabold text-[#0E1B3B] inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{SORT_LABELS[sortBy]}</span>
              <ChevronDown className="w-4 h-4 text-[#0E1B3B]" strokeWidth={2.5} />
            </button>

            {sortMenuOpen && (
              <div
                role="listbox"
                aria-label="Sort reviews by"
                className="absolute right-0 mt-1.5 w-44 rounded-[16px] bg-[#F4F9FF] border border-white/95 shadow-[0_14px_34px_rgba(14,27,59,0.24)] p-1.5 z-30"
              >
                {(Object.keys(SORT_LABELS) as ReviewSortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={sortBy === option}
                    onClick={() => handleSortSelect(option)}
                    className={`w-full text-left px-3 py-2 rounded-[11px] text-[12.5px] font-bold neu-press-surface ${
                      sortBy === option
                        ? 'bg-[#E6F0FF] text-[#0070FF]'
                        : 'text-[#0E1B3B] hover:bg-[#F3F8FE]'
                    }`}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Customer Review Cards */}
        <section aria-label="Customer Written Reviews" className="space-y-3">
          {loading ? (
            <div className="neu-card rounded-[20px] p-8 flex flex-col items-center gap-2 text-[#425478]">
              <Loader2 className="w-6 h-6 text-[#0070FF] animate-spin" />
              <span className="text-[13px] font-semibold">Loading reviews...</span>
            </div>
          ) : paginatedReviews.length === 0 ? (
            <div className="neu-card rounded-[20px] p-6 text-center space-y-2.5">
              <h2 className="text-[16px] font-extrabold text-[#0E1B3B]">No Reviews Yet</h2>
              <p className="text-[13px] text-[#425478]">
                Be the first patient to share your dental clinic experience.
              </p>
              <button
                type="button"
                onClick={onAddReview}
                className="neu-blue-btn neu-btn-md px-5 py-2.5 text-[13px] font-extrabold text-white"
              >
                Write First Review
              </button>
            </div>
          ) : (
            paginatedReviews.map((review) => {
              const avatarFailed = failedAvatars[review.reviewId];
              return (
                <article
                  key={review.reviewId}
                  className="neu-card rounded-[20px] p-3.5 sm:p-4"
                >
                  {/* Profile + Name/Date + Right-aligned Stars */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#DCE8F8]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {review.customerProfileImage && !avatarFailed ? (
                        <img
                          src={review.customerProfileImage}
                          alt={review.customerName}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedAvatars((prev) => ({
                              ...prev,
                              [review.reviewId]: true,
                            }))
                          }
                          className="w-10 h-10 rounded-full object-cover object-top border border-[#DCE8F8] shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#27ADFF] to-[#0066F5] text-white font-extrabold text-[13px] flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(review.customerName)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-[#0E1B3B] leading-tight truncate">
                          {review.customerName}
                        </h2>
                        <span className="block text-[11.5px] font-semibold text-[#5B7096] leading-tight mt-0.5">
                          {formatRelativeDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <StarRow rating={review.rating} sizeClass="w-4 h-4 sm:w-[17px] sm:h-[17px]" />
                    </div>
                  </div>

                  {/* Written Review */}
                  {review.reviewText && (
                    <p className="mt-2.5 text-[12.5px] sm:text-[13.5px] font-medium text-[#1A2B50] leading-[1.48] whitespace-pre-line break-words">
                      {review.reviewText}
                    </p>
                  )}

                  {/* Customer-uploaded Images */}
                  {review.imageUrls.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {review.imageUrls.map((imgUrl, idx) => (
                        <button
                          key={`${review.reviewId}-img-${idx}`}
                          type="button"
                          onClick={() => setPreviewPhotoUrl(imgUrl)}
                          aria-label={`View uploaded review photo ${idx + 1}`}
                          className="w-[86px] sm:w-[104px] h-[64px] sm:h-[76px] rounded-[11px] overflow-hidden border border-white shadow-[0_2px_8px_rgba(140,174,216,0.26)] hover:opacity-95 neu-press-surface focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                        >
                          <img
                            src={imgUrl}
                            alt={`${review.customerName} photo ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Attached Video Quick Trigger when review also includes video */}
                  {review.videoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveVideo({
                          id: review.reviewId,
                          title: review.videoTitle || 'Patient Video Review',
                          thumbnailUrl:
                            review.videoThumbnailUrl ||
                            '/src/assets/images/about_clinic_interior_1795594382732.jpg',
                          videoUrl: review.videoUrl,
                          isPlaceholder: false,
                          customerName: review.customerName,
                          rating: review.rating,
                        })
                      }
                      className="mt-2.5 inline-flex items-center gap-1.5 neu-btn-sm bg-[#EEF5FF] border border-white hover:bg-[#E1EEFF] shadow-[0_2px_6px_rgba(140,174,216,0.2)] px-3.5 py-1.5 text-[11.5px] font-bold text-[#0070FF] neu-press-surface"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#0070FF]" />
                      <span>Play Attached Video</span>
                    </button>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* Compact Pagination */}
        {totalPages > 0 && !loading && sortedReviews.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            navAriaLabel="Reviews Pagination"
            className="pt-0.5 pb-1 flex items-center justify-center gap-3"
          />
        )}
      </div>

      {/* Video Viewer Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video Review Viewer"
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1B3B]/75 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-[22px] bg-[#F4F9FF] border border-white/95 shadow-[0_20px_50px_rgba(14,27,59,0.34)] p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[15.5px] font-extrabold text-[#0E1B3B] truncate">
                  {activeVideo.title}
                </h3>
                {activeVideo.customerName && (
                  <p className="text-[12px] font-semibold text-[#425478]">
                    By {activeVideo.customerName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video viewer"
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeVideo.isPlaceholder ? (
              <div className="space-y-2.5">
                <div className="relative rounded-[16px] overflow-hidden bg-[#0E1B3B] aspect-[9/12] max-h-[55vh] mx-auto">
                  <img
                    src={activeVideo.thumbnailUrl}
                    alt={activeVideo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-5 text-center text-white">
                    <span className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center mb-2.5">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </span>
                    <span className="text-[13.5px] font-extrabold">
                      Placeholder Video Thumbnail
                    </span>
                    <span className="mt-1 text-[11.5px] text-white/90 leading-snug">
                      No clinic video file is linked to this sample card yet. Add a real
                      video via Add Review to play live video here.
                    </span>
                  </div>
                </div>
              </div>
            ) : videoResolving ? (
              <div className="py-14 flex flex-col items-center gap-2 text-[#425478]">
                <Loader2 className="w-7 h-7 text-[#0070FF] animate-spin" />
                <span className="text-[13px] font-semibold">Loading video...</span>
              </div>
            ) : resolvedVideoSrc ? (
              <video
                src={resolvedVideoSrc}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[62vh] rounded-[15px] bg-black"
              />
            ) : (
              <div className="rounded-[15px] bg-white border border-[#DCE8F8] p-5 text-center text-[13px] font-semibold text-[#425478]">
                Video file could not be loaded from browser storage.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {previewPhotoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review Photo Preview"
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1B3B]/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-[20px] bg-[#F4F9FF] border border-white/95 shadow-[0_20px_50px_rgba(14,27,59,0.34)] p-2"
          >
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              aria-label="Close photo preview"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/65 text-white flex items-center justify-center neu-press-soft"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewPhotoUrl}
              alt="Customer review photo enlargement"
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain rounded-[14px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
