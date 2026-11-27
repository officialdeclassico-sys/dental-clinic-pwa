import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Image as ImageIcon,
  Loader2,
  SquarePlay,
  Star,
  X,
} from 'lucide-react';
import {
  MAX_REVIEW_CHARS,
  MAX_REVIEW_PHOTOS,
  ReviewRecord,
  compressImageFileToDataUrl,
  createReview,
  validateAndExtractVideoMeta,
} from '../data/reviewsRepository';
import { triggerErrorHaptic, triggerSuccessHaptic } from '../utils/haptics';

interface AddReviewPageProps {
  onBack: () => void;
  onReviewSubmitted: (newReview: ReviewRecord) => void;
}

export function AddReviewPage({ onBack, onReviewSubmitted }: AddReviewPageProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | undefined>(undefined);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [mediaBusy, setMediaBusy] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<ReviewRecord | null>(null);
  const submitLockRef = useRef<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Revoke object URL on unmount or video replacement
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handlePhotoFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setErrorMsg(null);
    const files = Array.from(fileList);

    if (imageUrls.length + files.length > MAX_REVIEW_PHOTOS) {
      triggerErrorHaptic();
      setErrorMsg(
        `You can upload up to ${MAX_REVIEW_PHOTOS} photos maximum (currently ${imageUrls.length} attached).`
      );
      e.target.value = '';
      return;
    }

    setMediaBusy(true);
    try {
      const processed: string[] = [];
      for (const file of files) {
        const compressed = await compressImageFileToDataUrl(file);
        processed.push(compressed);
      }
      setImageUrls((prev) => [...prev, ...processed]);
    } catch (err) {
      triggerErrorHaptic();
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to process selected photo(s).'
      );
    } finally {
      setMediaBusy(false);
      e.target.value = '';
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setMediaBusy(true);
    try {
      const meta = await validateAndExtractVideoMeta(file);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setVideoThumbnailUrl(meta.thumbnailDataUrl);
      setVideoDuration(meta.durationSeconds);
    } catch (err) {
      triggerErrorHaptic();
      setErrorMsg(err instanceof Error ? err.message : 'Invalid video selection.');
    } finally {
      setMediaBusy(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
    setErrorMsg(null);
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setVideoThumbnailUrl(undefined);
    setVideoDuration(0);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current || isSubmitting || mediaBusy) return;

    if (rating < 1 || rating > 5) {
      triggerErrorHaptic();
      setErrorMsg('Please select a star rating before submitting your review.');
      return;
    }
    if (reviewText.length > MAX_REVIEW_CHARS) {
      triggerErrorHaptic();
      setErrorMsg(
        `Your written review is ${reviewText.length} characters. Please keep it within ${MAX_REVIEW_CHARS} characters.`
      );
      return;
    }
    if (imageUrls.length > MAX_REVIEW_PHOTOS) {
      triggerErrorHaptic();
      setErrorMsg(`Maximum ${MAX_REVIEW_PHOTOS} photos are allowed.`);
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await createReview({
        rating,
        reviewText,
        imageUrls,
        videoFile,
        videoThumbnailUrl,
      });
      triggerSuccessHaptic();
      setSubmittedRecord(created);
      window.setTimeout(() => {
        onReviewSubmitted(created);
      }, 650);
    } catch (err) {
      triggerErrorHaptic();
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to submit your review. Please try again.'
      );
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const activeStarDisplay = hoverRating || rating;
  const charCount = reviewText.length;
  const overLimit = charCount > MAX_REVIEW_CHARS;

  return (
    <div>
      {/* Header: Back Chevron + "Add Review" */}
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Reviews"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          Add Review
        </h1>
      </header>

      <div className="mt-3">
        {submittedRecord ? (
          <div className="neu-card rounded-[24px] p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#D7F5E5] text-[#117A45] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-[19px] font-extrabold text-[#0E1B3B]">
              Review Submitted!
            </h2>
            <p className="text-[13px] font-medium text-[#425478]">
              Redirecting you back to Reviews...
            </p>
            <button
              type="button"
              onClick={() => onReviewSubmitted(submittedRecord)}
              className="neu-blue-btn neu-btn-md px-5 py-2.5 text-[13.5px] font-extrabold text-white"
            >
              View Reviews Now
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="neu-card rounded-[24px] p-4 sm:p-5 space-y-4"
          >
            {/* Rating Section */}
            <section aria-label="Your Rating" className="text-center pt-0.5">
              <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0E1B3B]">
                Your Rating
              </h2>

              <div
                className="mt-2.5 inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-[18px]"
                role="radiogroup"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const filled = starVal <= activeStarDisplay;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      role="radio"
                      aria-checked={rating === starVal}
                      aria-label={`Rate ${starVal} star${starVal === 1 ? '' : 's'}`}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(starVal);
                        setErrorMsg(null);
                      }}
                      className="p-0.5 rounded-xl neu-press-soft hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                    >
                      <Star
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                          filled
                            ? 'text-[#FFB800] fill-[#FFB800]'
                            : 'text-[#B9C7DB] fill-[#B9C7DB]'
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-[12.5px] font-medium text-[#425478]">
                {rating > 0
                  ? `${rating} out of 5 star${rating === 1 ? '' : 's'} selected`
                  : 'Tap a star to rate your experience'}
              </p>
            </section>

            <hr className="border-[#E1ECF9]" />

            {/* Written Review Section */}
            <section aria-label="Your Review">
              <label
                htmlFor="review-textarea"
                className="block text-[16px] sm:text-[17.5px] font-extrabold text-[#0E1B3B] mb-2"
              >
                Your Review
              </label>

              <textarea
                id="review-textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Share your experience..."
                className={`w-full rounded-[14px] bg-white border border-[#D4E2F4] shadow-[inset_1px_1px_4px_rgba(150,180,218,0.16)] p-3.5 text-[13.5px] font-medium text-[#0E1B3B] placeholder:text-[#7E92B2] resize-y min-h-[118px] focus:outline-2 focus:outline-[#0070FF] ${
                  overLimit ? 'border-[#D93838]' : ''
                }`}
              />

              <div className="mt-1 flex items-center justify-end">
                <span
                  className={`text-[12px] font-bold tabular-nums ${
                    overLimit ? 'text-[#C62828]' : 'text-[#53688E]'
                  }`}
                >
                  {charCount} / {MAX_REVIEW_CHARS}
                </span>
              </div>
            </section>

            <hr className="border-[#E1ECF9]" />

            {/* Add Media Section */}
            <section aria-label="Add Media Optional">
              <div className="mb-2.5 flex items-baseline gap-1.5">
                <h2 className="text-[16px] sm:text-[17.5px] font-extrabold text-[#0E1B3B]">
                  Add Media
                </h2>
                <span className="text-[13px] font-semibold text-[#5B7096]">
                  (Optional)
                </span>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handlePhotoFilesChange}
                className="hidden"
                aria-label="Upload photos"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/ogg"
                onChange={handleVideoFileChange}
                className="hidden"
                aria-label="Upload video"
              />

              <div className="grid grid-cols-2 gap-3">
                {/* Add Photos Tile */}
                <button
                  type="button"
                  disabled={mediaBusy || isSubmitting}
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-[15px] bg-[#F7FAFF] border-2 border-dashed border-[#B7CFE9] hover:border-[#0070FF] hover:bg-[#EFF6FF] neu-press-surface py-4 px-2 flex flex-col items-center justify-center text-center focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                >
                  <ImageIcon className="w-7 h-7 text-[#0070FF]" strokeWidth={1.9} />
                  <span className="mt-1.5 text-[13.5px] sm:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight">
                    Add Photos
                  </span>
                  <span className="mt-0.5 text-[11px] sm:text-[11.5px] font-medium text-[#53688E]">
                    Up to 5 images
                  </span>
                </button>

                {/* Add Video Tile */}
                <button
                  type="button"
                  disabled={mediaBusy || isSubmitting}
                  onClick={() => videoInputRef.current?.click()}
                  className="rounded-[15px] bg-[#F7FAFF] border-2 border-dashed border-[#B7CFE9] hover:border-[#0070FF] hover:bg-[#EFF6FF] neu-press-surface py-4 px-2 flex flex-col items-center justify-center text-center focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                >
                  <SquarePlay className="w-7 h-7 text-[#0070FF]" strokeWidth={1.9} />
                  <span className="mt-1.5 text-[13.5px] sm:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight">
                    Add Video
                  </span>
                  <span className="mt-0.5 text-[11px] sm:text-[11.5px] font-medium text-[#53688E]">
                    Up to 60 seconds
                  </span>
                </button>
              </div>

              {mediaBusy && (
                <div className="mt-2.5 flex items-center gap-2 text-[12px] font-bold text-[#0070FF]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing selected media...</span>
                </div>
              )}

              {/* Selected Photos Preview Strip */}
              {imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={`preview-img-${idx}`}
                      className="relative w-16 h-16 rounded-[11px] overflow-hidden bg-white border border-white shadow-[0_2px_8px_rgba(140,174,216,0.22)]"
                    >
                      <img
                        src={url}
                        alt={`Selected photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        aria-label={`Remove photo ${idx + 1}`}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-[#0E1B3B]/80 text-white flex items-center justify-center neu-press-soft"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Video Preview Card */}
              {videoPreviewUrl && (
                <div className="mt-3 rounded-[14px] bg-white/90 border border-white shadow-[0_2px_8px_rgba(140,174,216,0.22)] p-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-extrabold text-[#0E1B3B] truncate">
                      {videoFile?.name || 'Selected Video'} (
                      {Math.max(1, Math.round(videoDuration))}s)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      aria-label="Remove selected video"
                      className="inline-flex items-center gap-1 px-2.5 py-1 neu-btn-sm bg-[#FEECEC] text-[#B91C1C] text-[11px] font-bold shrink-0 neu-press-surface"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                  <video
                    src={videoPreviewUrl}
                    controls
                    playsInline
                    className="w-full max-h-[180px] rounded-[10px] bg-black"
                  />
                </div>
              )}
            </section>

            {/* Validation / Submission Errors */}
            {errorMsg && (
              <div
                role="alert"
                className="rounded-[13px] bg-[#FEECEC] border border-[#F5BDBD] px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] font-bold text-[#9F1D1D]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Review CTA */}
            <button
              type="submit"
              data-haptic="deferred"
              disabled={isSubmitting || mediaBusy}
              className="w-full neu-blue-btn neu-btn-lg py-3.5 px-6 text-[16px] font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
