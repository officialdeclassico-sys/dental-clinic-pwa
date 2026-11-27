import React, { useEffect } from 'react';
import { ChevronLeft, FileText, Info, ShieldCheck } from 'lucide-react';

interface LegalDocumentPageProps {
  documentType: 'terms' | 'privacy';
  onBack: () => void;
}

const TERMS_PLACEHOLDER_SECTIONS = [
  {
    title: '1. Placeholder Scope & Patient Portal Use',
    body: 'This is placeholder text for the SmileCare Dental Clinic Terms & Conditions. Before public clinic launch, replace this placeholder with your clinic-approved patient portal terms covering appointment scheduling, queue previews, and account guidelines.',
  },
  {
    title: '2. Appointments & Scheduling Requests',
    body: 'Appointment requests submitted through this preview app are stored locally on your device for demonstration. Finalized clinic rules regarding arrival times, cancellations, and rescheduling windows should be inserted here prior to production release.',
  },
  {
    title: '3. Clinic Communication & Service Information',
    body: 'Treatment descriptions, durations, and informational content shown in the application are general patient guides and do not substitute for an in-person clinical dental examination.',
  },
];

const PRIVACY_PLACEHOLDER_SECTIONS = [
  {
    title: '1. Placeholder Privacy Notice',
    body: 'This is placeholder text for the SmileCare Dental Clinic Privacy Policy. Actual legal policy text approved by the clinic has not yet been supplied and must replace this placeholder before production use.',
  },
  {
    title: '2. Local Profile & Appointment Storage',
    body: 'During this preview phase, profile details (name, mobile number, and consent status), appointment records, and review drafts are stored locally in your browser via localStorage and IndexedDB without external server transmission.',
  },
  {
    title: '3. Managing or Clearing Your Data',
    body: 'You can clear your saved profile session at any time by tapping Logout on the Profile screen, which removes your locally stored profile session from this device.',
  },
];

export function LegalDocumentPage({ documentType, onBack }: LegalDocumentPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [documentType]);

  const isTerms = documentType === 'terms';
  const title = isTerms ? 'Terms & Conditions' : 'Privacy Policy';
  const sections = isTerms ? TERMS_PLACEHOLDER_SECTIONS : PRIVACY_PLACEHOLDER_SECTIONS;

  return (
    <div>
      {/* Header matching Profile and clinic subpages */}
      <header className="flex items-center gap-3 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Create Profile"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          {title}
        </h1>
      </header>

      <div className="mt-4 max-w-[760px] mx-auto space-y-3.5">
        {/* Clearly identified placeholder notice */}
        <section
          aria-label="Placeholder document notice"
          className="rounded-[18px] bg-[#E8F2FE] border border-white/95 shadow-[0_4px_12px_rgba(140,174,216,0.22)] p-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-[11px] bg-white/90 border border-white flex items-center justify-center text-[#0070FF] shrink-0">
            {isTerms ? (
              <FileText className="w-[18px] h-[18px]" strokeWidth={2.1} />
            ) : (
              <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={2.1} />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#0E1B3B]">
              <Info className="w-4 h-4 text-[#0070FF] shrink-0" />
              <span>Placeholder Document</span>
            </div>
            <p className="mt-1 text-[12.5px] font-medium text-[#3B4E75] leading-relaxed">
              This {title} view currently displays clearly marked placeholder content because
              clinic-approved legal text has not yet been supplied. Returning to the form will
              preserve your entered profile details.
            </p>
          </div>
        </section>

        {/* Placeholder sections */}
        {sections.map((section) => (
          <article key={section.title} className="neu-card rounded-[18px] p-4 sm:p-5">
            <h2 className="text-[15px] sm:text-[16px] font-extrabold text-[#0E1B3B]">
              {section.title}
            </h2>
            <p className="mt-1.5 text-[13px] sm:text-[13.5px] font-medium text-[#425478] leading-relaxed">
              {section.body}
            </p>
          </article>
        ))}

        <div className="pt-1">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto sm:min-w-[220px] h-[48px] px-6 rounded-[15px] neu-blue-btn text-[14.5px] font-bold text-white inline-flex items-center justify-center"
          >
            Back to Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}
