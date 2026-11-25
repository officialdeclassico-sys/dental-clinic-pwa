# Dental Clinic PWA

A responsive, mobile-first Progressive Web App for dental clinic patient engagement, treatment discovery, live queue tracking, clinic information, and online appointment scheduling.

---

## Project Overview

Dental Clinic PWA provides patients with a unified mobile and tablet experience to browse dental treatments, check live queue status, learn about the clinic, view working hours and directions, search FAQs, and book or manage dental appointments through a guided 7-step booking workflow.

The frontend is built as a client-side Single Page Application (SPA) with local persistence (`localStorage`) for appointments, patient contact details, and reminder preferences, designed for easy integration with a clinic backend API.

---

## Key Features

- **Home Dashboard**: Promotional hero carousel, quick-access shortcut cards, live queue token status viewer/updater, featured treatments showcase, and new patient offer banner.
- **Multilingual UI Support**: Instant language switching (`EN`, `HI`, `TE`) across homepage labels, treatments, notifications, and modals.
- **Clinic Information Pages**:
  - **About Us**: Clinic overview, animated statistics, mission, vision, and key highlights.
  - **Contact Us**: Configurable call, WhatsApp, email, and social media actions, full 7-day clinic hours, and Google Maps directions/view links.
  - **FAQs**: Real-time question search, category filters (`All`, `Appointments`, `Clinic`, `Treatments`), expandable accordions, and direct support navigation.
- **Appointments Hub**:
  - Dedicated Appointments dashboard with quick CTA, shortcuts, nearest upcoming appointment card, and service quick-booking cards.
  - **7-Step Guided Booking Flow**: Treatment selection, clinic branch selection, dentist filtering, interactive monthly calendar (past dates blocked and aligned with operating hours), time slot conflict validation, patient details form with validation, and review/confirmation screen.
  - **My Appointments & History**: Upcoming bookings sorted chronologically, completed/cancelled visit history, and expandable full appointment details.
  - **Reminders**: Per-appointment reminder toggle and lead-time selector (`24h`, `2h`, `30m`) with Browser Notification API permission check and test trigger.
  - **Cancel & Reschedule**: Dedicated reschedule calendar/slot validation and explicit cancellation confirmation with optional reason recording.
- **Responsive Navigation**: Adaptive mobile and tablet layouts with hidden scrollbars and a fixed 4-tab bottom navigation bar (`Home`, `Appointments`, `Services`, `Profile`).

---

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React + custom inline SVG dental illustrations
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Persistence**: Browser `localStorage` (isolated in `src/data/appointmentsRepository.ts` for future API replacement)

---

## Project Folder Structure

```text
dental-clinic-pwa/
├── .env.example                      # Optional environment variable template
├── .gitignore                        # Git ignore rules for public repository
├── index.html                        # HTML entry point and font links
├── package.json                      # Project metadata, scripts, and dependencies
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite + Tailwind v4 + static asset copy plugin
└── src/
    ├── App.tsx                       # Root application shell and page stack navigation
    ├── index.css                     # Tailwind CSS v4 entry and neumorphic utilities
    ├── main.tsx                      # React DOM bootstrap
    ├── assets/
    │   └── images/                   # Local JPEG clinic and hero imagery
    ├── components/
    │   ├── AboutUsPage.tsx           # About Us view with animated stats
    │   ├── AppointmentSubViews.tsx   # My Appointments, History, Reminders, Cancel/Reschedule
    │   ├── AppointmentsPage.tsx      # Appointments dashboard view
    │   ├── BookingCalendarPicker.tsx # Interactive monthly calendar and time-slot grid
    │   ├── BookingFlowView.tsx       # 7-step appointment booking wizard & confirmation
    │   ├── BottomNav.tsx             # Fixed bottom navigation bar
    │   ├── ClinicHeader.tsx          # Header, notifications popover, language switcher
    │   ├── ContactUsPage.tsx         # Contact actions, clinic hours, and map links
    │   ├── DentalIllustrations.tsx   # Custom inline dental SVG graphics
    │   ├── FaqsPage.tsx              # Searchable and filterable FAQ accordions
    │   ├── HeroCarousel.tsx          # Auto-advancing promotional banner carousel
    │   ├── HomepageModals.tsx        # Queue token, treatment detail, and preview modals
    │   ├── LiveQueueCard.tsx         # Live token queue summary card
    │   ├── NewPatientOfferBanner.tsx # Promotional discount banner
    │   ├── ShortcutCards.tsx         # Quick navigation shortcuts
    │   └── TreatmentsSection.tsx     # Featured dental treatments grid
    └── data/
        ├── appointmentsRepository.ts # Booking data model, validation, and localStorage repository
        └── clinicData.ts             # Clinic UI copy, localized strings, hours, FAQs, contact config
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **Package Manager**: `npm` v9+ (or `bun` v1.1+)

---

## Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/dental-clinic-pwa.git
cd dental-clinic-pwa
```

2. Install dependencies:

```bash
npm install
```

*(If using Bun: `bun install`)*

---

## Local Development Instructions

Start the local development server (configured on port `3000`):

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

To run TypeScript type checking:

```bash
npm run lint
```

---

## Production Build Instructions

Generate an optimized production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Environment Variable Configuration

This application currently runs purely on the client side and does **not** require any environment variables or API keys to build or run locally.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DISABLE_HMR` | No | `false` | Optional build/dev flag read by `vite.config.ts` to disable Hot Module Replacement (`true` disables HMR and file watching). |

If you want to customize environment settings locally:

```bash
cp .env.example .env
```

> **Security Note**: Never commit `.env` files or store private credentials, API secrets, or database tokens in frontend `VITE_*` variables. Any `VITE_*` variable is bundled into client-side JavaScript and visible to end users.

### Clinic Configuration Before Launch

Before deploying for an individual clinic, update the placeholder contact channels and clinic details in:

- `src/data/clinicData.ts` (`CLINIC_CONTACT_CONFIG` for phone number, WhatsApp number, email, address, and social URLs)
- `src/data/appointmentsRepository.ts` (`BOOKING_API_CONFIG` when connecting a live clinic backend API instead of local preview storage)

---

## Deployment Instructions

Because `npm run build` produces a static Single Page Application in `dist/`, you can deploy it to any static hosting provider:

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` directory using your preferred platform:
   - **Vercel**: Framework preset `Vite`, build command `npm run build`, output directory `dist`.
   - **Netlify**: Build command `npm run build`, publish directory `dist`.
   - **Cloudflare Pages**: Build command `npm run build`, build output directory `dist`.
   - **GitHub Pages**: Serve the built `dist/` folder via GitHub Actions.

---

## PWA Capabilities and Installation Status

### Currently Implemented
- **Responsive Mobile-First & Tablet Layout**: Fluid adaptive layout with `viewport-fit=cover` in `index.html` and safe-area padding (`env(safe-area-inset-bottom)`) on the fixed bottom navigation bar.
- **Native-Style Touch Scrolling**: Overscroll containment and hidden browser scrollbars without restricting vertical scrolling.
- **Client-Side Persistence**: Appointments, patient profile fields, and reminder preferences persist across sessions via `localStorage`.
- **Browser Notification Alerts**: Interactive notification permission requests and test alerts in the Reminders view using the standard Web Notifications API.

### Not Yet Implemented (Required for Full Browser Installability)
- **Web App Manifest** (`manifest.webmanifest` / `manifest.json` linked from `index.html`)
- **Service Worker** (e.g., via `vite-plugin-pwa` for offline precaching and asset caching)
- **PWA App Icons** (`192x192`, `512x512`, maskable icon, and `180x180` PNG `apple-touch-icon.png`)
- **In-App Install Prompt** (`beforeinstallprompt` handler)

Once a Web App Manifest, PNG icons, and a Service Worker are added and served over HTTPS, browsers on Android, iOS Safari (*Share -> Add to Home Screen*), and desktop Chrome/Edge can install the app to the home screen.
