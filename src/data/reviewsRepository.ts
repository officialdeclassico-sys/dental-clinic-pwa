import { getAppointmentsSnapshot } from './appointmentsHelper';

export type ReviewStatus = 'Published' | 'Pending' | 'Hidden';
export type ReviewSortOption = 'most-recent' | 'highest-rated' | 'lowest-rated';

export interface ReviewRecord {
  reviewId: string;
  customerId: string;
  customerName: string;
  customerProfileImage?: string;
  appointmentId?: string;
  serviceName?: string;
  rating: number;
  reviewText: string;
  imageUrls: string[];
  videoUrl?: string;
  videoThumbnailUrl?: string;
  videoTitle?: string;
  createdAt: string; // ISO string
  status: ReviewStatus;
  isSamplePreview?: boolean;
}

export interface VideoReviewCardItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
  isPlaceholder: boolean;
  customerName?: string;
  rating?: number;
}

const STORAGE_REVIEWS_KEY = 'smilecare_reviews_v1';
const IDB_NAME = 'smilecare_media_v1';
const IDB_STORE = 'review_videos';

export const MAX_REVIEW_CHARS = 500;
export const MAX_REVIEW_PHOTOS = 5;
export const MAX_PHOTO_FILE_BYTES = 10 * 1024 * 1024; // 10MB raw before client compression
export const MAX_VIDEO_DURATION_SECONDS = 60;
export const MAX_VIDEO_FILE_BYTES = 50 * 1024 * 1024; // 50MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
];

/**
 * Placeholder video review cards shown until live clinic video URLs are supplied.
 * Clearly tagged `isPlaceholder: true` so they are never presented as real customer uploads.
 */
export const PLACEHOLDER_VIDEO_REVIEWS: VideoReviewCardItem[] = [
  {
    id: 'placeholder-vid-1',
    title: 'My Smile Journey ❤️',
    thumbnailUrl: '/src/assets/images/hero_banner_happy_smile_1795590336818.jpg',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-vid-2',
    title: 'Best Dental Clinic! 🙌',
    thumbnailUrl: '/src/assets/images/hero_banner_preventive_care_1795590488433.jpg',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-vid-3',
    title: 'Highly Recommended ⭐',
    thumbnailUrl: '/src/assets/images/hero_banner_cosmetic_whitening_1795590487728.jpg',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-vid-4',
    title: 'Clean & Modern',
    thumbnailUrl: '/src/assets/images/about_clinic_interior_1795594382732.jpg',
    isPlaceholder: true,
  },
];

function createSeededSampleReviews(): ReviewRecord[] {
  const now = Date.now();
  return [
    {
      reviewId: 'SAMPLE-REV-101',
      customerId: 'sample-cust-101',
      customerName: 'Rohit Sharma',
      customerProfileImage: '/src/assets/images/hero_banner_preventive_care_1795590488433.jpg',
      serviceName: 'General Dentistry',
      rating: 5,
      reviewText:
        'Excellent service! The staff is very friendly and the treatment was completely painless. Highly recommend SmileCare Dental Clinic.',
      imageUrls: [
        '/src/assets/images/about_clinic_interior_1795594382732.jpg',
        '/src/assets/images/contact_clinic_reception_1795595763612.jpg',
        '/src/assets/images/about_clinic_interior_1795594382732.jpg',
      ],
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Published',
      isSamplePreview: true,
    },
    {
      reviewId: 'SAMPLE-REV-102',
      customerId: 'sample-cust-102',
      customerName: 'Ananya Reddy',
      customerProfileImage: '/src/assets/images/hero_banner_happy_smile_1795590336818.jpg',
      serviceName: 'Cosmetic Dentistry',
      rating: 5,
      reviewText:
        "Very clean clinic and professional doctors. The whole experience was smooth and comfortable. I'm really happy with the results! 😊",
      imageUrls: [
        '/src/assets/images/offer_banner_dental_smile_1795590489434.jpg',
        '/src/assets/images/hero_banner_cosmetic_whitening_1795590487728.jpg',
      ],
      createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Published',
      isSamplePreview: true,
    },
    {
      reviewId: 'SAMPLE-REV-103',
      customerId: 'sample-cust-103',
      customerName: 'Karthik S',
      customerProfileImage: '/src/assets/images/hero_banner_orthodontics_aligners_1795590488865.jpg',
      serviceName: 'Dental Cleaning',
      rating: 5,
      reviewText:
        'Got my dental cleaning done here. Great care, minimal waiting time and transparent pricing. Will definitely visit again!',
      imageUrls: [],
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Published',
      isSamplePreview: true,
    },
    {
      reviewId: 'SAMPLE-REV-104',
      customerId: 'sample-cust-104',
      customerName: 'Meera Patel',
      customerProfileImage: '/src/assets/images/hero_banner_family_dental_1795590489580.jpg',
      serviceName: 'Orthodontics (Braces)',
      rating: 4,
      reviewText:
        'Great consultation for clear aligners. The doctor explained every stage clearly and answered all our questions patiently.',
      imageUrls: [],
      createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Published',
      isSamplePreview: true,
    },
  ];
}

function readStoredReviews(): ReviewRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (!raw) {
      const seeded = createSeededSampleReviews();
      window.localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return createSeededSampleReviews();
  }
}

function writeStoredReviews(records: ReviewRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(records));
}

/* -------------------------------------------------------------------------- */
/* IndexedDB Video Persistence                                                */
/* -------------------------------------------------------------------------- */

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open media database'));
  });
}

export async function saveVideoBlobToIdb(key: string, blob: Blob): Promise<void> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(blob, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('Failed to save video file'));
    };
  });
}

export async function loadVideoObjectUrlFromIdb(key: string): Promise<string | null> {
  try {
    const db = await openMediaDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => {
        db.close();
        const blob = req.result;
        if (blob instanceof Blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Client Image Compression & Video Validation                                */
/* -------------------------------------------------------------------------- */

export async function compressImageFileToDataUrl(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported photo format (${file.name}). Use JPG, PNG, WEBP, or GIF.`);
  }
  if (file.size > MAX_PHOTO_FILE_BYTES) {
    throw new Error(`Photo "${file.name}" exceeds the 10 MB limit.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Unable to read "${file.name}".`));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`Invalid image file "${file.name}".`));
      img.onload = () => {
        const maxSide = 960;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function validateAndExtractVideoMeta(file: File): Promise<{
  durationSeconds: number;
  thumbnailDataUrl: string;
}> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Unsupported video format. Please upload MP4, WebM, MOV, or OGG.');
  }
  if (file.size > MAX_VIDEO_FILE_BYTES) {
    throw new Error('Video file is too large (maximum 50 MB).');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const cleanup = () => {
        video.removeAttribute('src');
        video.load();
      };

      video.onerror = () => {
        cleanup();
        reject(new Error('Could not read video metadata. Please choose another video file.'));
      };

      video.onloadedmetadata = () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          cleanup();
          reject(
            new Error(
              `Video is ${Math.ceil(duration)}s long. Maximum allowed duration is 60 seconds.`
            )
          );
          return;
        }
        // Seek slightly into video to grab a crisp frame thumbnail
        video.currentTime = Math.min(0.4, duration > 0 ? duration / 3 : 0);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const targetWidth = 420;
          const aspect =
            video.videoWidth > 0 && video.videoHeight > 0
              ? video.videoHeight / video.videoWidth
              : 1.25;
          canvas.width = targetWidth;
          canvas.height = Math.round(targetWidth * aspect);
          const ctx = canvas.getContext('2d');
          let thumb = '/src/assets/images/about_clinic_interior_1795594382732.jpg';
          if (ctx && video.videoWidth > 0) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            thumb = canvas.toDataURL('image/jpeg', 0.75);
          }
          const duration = Number.isFinite(video.duration) ? video.duration : 0;
          cleanup();
          resolve({ durationSeconds: duration, thumbnailDataUrl: thumb });
        } catch {
          const duration = Number.isFinite(video.duration) ? video.duration : 0;
          cleanup();
          resolve({
            durationSeconds: duration,
            thumbnailDataUrl: '/src/assets/images/about_clinic_interior_1795594382732.jpg',
          });
        }
      };

      video.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/* -------------------------------------------------------------------------- */
/* Repository API                                                             */
/* -------------------------------------------------------------------------- */

export async function fetchReviews(): Promise<ReviewRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return readStoredReviews().filter((r) => r.status === 'Published');
}

export function sortReviews(
  reviews: ReviewRecord[],
  sortBy: ReviewSortOption
): ReviewRecord[] {
  const copy = [...reviews];
  switch (sortBy) {
    case 'highest-rated':
      return copy.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'lowest-rated':
      return copy.sort((a, b) => {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'most-recent':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function calculateReviewStats(reviews: ReviewRecord[]): {
  averageRating: number;
  totalReviews: number;
} {
  const published = reviews.filter((r) => r.status === 'Published');
  const totalReviews = published.length;
  if (totalReviews === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }
  const sum = published.reduce((acc, item) => acc + item.rating, 0);
  const averageRating = Number((sum / totalReviews).toFixed(1));
  return { averageRating, totalReviews };
}

export function formatRelativeDate(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

export async function createReview(input: {
  rating: number;
  reviewText: string;
  imageUrls: string[];
  videoFile?: File | null;
  videoThumbnailUrl?: string;
}): Promise<ReviewRecord> {
  if (input.rating < 1 || input.rating > 5) {
    throw new Error('Please select a star rating between 1 and 5.');
  }
  const trimmedText = input.reviewText.trim();
  if (trimmedText.length > MAX_REVIEW_CHARS) {
    throw new Error(`Written review cannot exceed ${MAX_REVIEW_CHARS} characters.`);
  }
  if (input.imageUrls.length > MAX_REVIEW_PHOTOS) {
    throw new Error(`You can attach up to ${MAX_REVIEW_PHOTOS} images.`);
  }

  const { profile, latestAppointment } = getAppointmentsSnapshot();
  const existing = readStoredReviews();

  // Duplicate guard (prevent identical accidental double-submit within 15 seconds)
  const nowMs = Date.now();
  const duplicate = existing.find(
    (r) =>
      r.customerId === profile.customerId &&
      r.rating === input.rating &&
      r.reviewText === trimmedText &&
      nowMs - new Date(r.createdAt).getTime() < 15000
  );
  if (duplicate) {
    return duplicate;
  }

  const reviewId = `REV-${nowMs}-${Math.floor(100 + Math.random() * 900)}`;

  let storedVideoUrl: string | undefined;
  if (input.videoFile) {
    const idbKey = `video-${reviewId}`;
    await saveVideoBlobToIdb(idbKey, input.videoFile);
    storedVideoUrl = `idb://${idbKey}`;
  }

  const newRecord: ReviewRecord = {
    reviewId,
    customerId: profile.customerId,
    customerName: profile.fullName.trim() || 'SmileCare Patient',
    appointmentId: latestAppointment?.appointmentId,
    serviceName: latestAppointment?.treatmentName,
    rating: input.rating,
    reviewText: trimmedText,
    imageUrls: input.imageUrls,
    videoUrl: storedVideoUrl,
    videoThumbnailUrl: input.videoThumbnailUrl,
    videoTitle: trimmedText
      ? trimmedText.slice(0, 28) + (trimmedText.length > 28 ? '...' : '')
      : 'Patient Video Review',
    createdAt: new Date(nowMs).toISOString(),
    status: 'Published',
    isSamplePreview: false,
  };

  try {
    writeStoredReviews([newRecord, ...existing]);
  } catch {
    throw new Error(
      'Browser storage is full. Please upload fewer or smaller images and try again.'
    );
  }

  return newRecord;
}
