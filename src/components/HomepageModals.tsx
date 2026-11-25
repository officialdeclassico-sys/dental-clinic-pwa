import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Phone, Star, Ticket, X } from 'lucide-react';
import {
  LanguageCode,
  NavTabId,
  ShortcutId,
  TreatmentId,
  TreatmentItem,
  UI_STRINGS,
} from '../data/clinicData';

export type ActiveModalState =
  | { type: 'none' }
  | { type: 'booking'; preselectedTreatment?: TreatmentId; applyOffer?: boolean }
  | { type: 'token' }
  | { type: 'treatment'; treatmentId: TreatmentId }
  | { type: 'viewAllTreatments' }
  | { type: 'shortcut'; shortcutId: ShortcutId }
  | { type: 'navPlaceholder'; tabId: Exclude<NavTabId, 'home'> };

interface HomepageModalsProps {
  modal: ActiveModalState;
  onClose: () => void;
  onOpenBooking: (treatmentId?: TreatmentId, applyOffer?: boolean) => void;
  onSelectTreatment: (id: TreatmentId) => void;
  language: LanguageCode;
  branchName: string;
  location: string;
  offerPercentage: number;
  servingNumber: number;
  userToken: string;
  onUpdateToken: (newToken: string) => void;
  onAdvanceQueue: () => void;
  treatments: TreatmentItem[];
}

function parseTokenNumber(token: string): number {
  const digits = token.replace(/\D/g, '');
  const parsed = parseInt(digits, 10);
  return Number.isNaN(parsed) ? 23 : parsed;
}

const TIME_SLOTS = ['10:30 AM', '12:00 PM', '03:30 PM', '05:15 PM', '07:00 PM'];

export function HomepageModals({
  modal,
  onClose,
  onOpenBooking,
  onSelectTreatment,
  language,
  branchName,
  location,
  offerPercentage,
  servingNumber,
  userToken,
  onUpdateToken,
  onAdvanceQueue,
  treatments,
}: HomepageModalsProps) {
  const t = UI_STRINGS[language];

  const [tokenInput, setTokenInput] = useState(userToken);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentId>('general');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);

  useEffect(() => {
    setTokenInput(userToken);
  }, [userToken]);

  useEffect(() => {
    if (modal.type === 'booking') {
      setSelectedTreatment(modal.preselectedTreatment ?? 'general');
      setBookingConfirmed(null);
    }
  }, [modal]);

  useEffect(() => {
    if (modal.type === 'none') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal.type, onClose]);

  if (modal.type === 'none') return null;

  const userTokenNumeric = parseTokenNumber(userToken);
  const aheadCount = Math.max(0, userTokenNumeric - servingNumber);
  const estWaitMins = aheadCount * 4;

  let queueStatusLabel = t.tokenStatusWaiting;
  let queueStatusTone = 'bg-[#E2EEFD] text-[#0066F5]';
  if (userTokenNumeric < servingNumber) {
    queueStatusLabel = t.tokenStatusCompleted;
    queueStatusTone = 'bg-[#E3F5EC] text-[#117A45]';
  } else if (userTokenNumeric === servingNumber) {
    queueStatusLabel = t.tokenStatusServing;
    queueStatusTone = 'bg-[#0070FF] text-white';
  } else if (aheadCount <= 2) {
    queueStatusLabel = t.tokenStatusNext;
    queueStatusTone = 'bg-[#EFE6FD] text-[#6B21D6]';
  }

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = tokenInput.trim().toUpperCase();
    if (!cleaned) return;
    const normalized = /^[A-Z]?\d{1,3}$/.test(cleaned)
      ? cleaned.match(/^[A-Z]/)
        ? `${cleaned[0]}${cleaned.slice(1).padStart(3, '0')}`
        : `A${cleaned.padStart(3, '0')}`
      : cleaned.slice(0, 6);
    onUpdateToken(normalized);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingConfirmed(refCode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0E1B3B]/45 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[460px] rounded-t-[26px] sm:rounded-[26px] bg-[#F4F8FE] border border-white shadow-[0_-8px_32px_rgba(14,27,59,0.22)] p-5 pb-6 max-h-[86vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#C4D6ED] mx-auto mb-3 sm:hidden" aria-hidden="true" />

        {/* 1. Token Status & Config Modal */}
        {modal.type === 'token' && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#0070FF]" />
                <h3 className="text-[17px] font-extrabold text-[#0E1B3B]">{t.tokenModalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[12.5px] font-semibold text-[#425478] mt-1">{branchName}</p>

            <div className="mt-4 rounded-[18px] bg-white border border-[#DCE8F8] p-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="block text-[11px] font-bold text-[#425478]">{t.nowServing}</span>
                <span className="block text-[22px] font-extrabold text-[#0070FF] tabular-nums mt-0.5">
                  {String(servingNumber).padStart(3, '0')}
                </span>
              </div>
              <div className="border-x border-[#E2ECF9]">
                <span className="block text-[11px] font-bold text-[#425478]">{t.yourToken}</span>
                <span className="block text-[22px] font-extrabold text-[#0E1B3B] tabular-nums mt-0.5">
                  {userToken}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-[#425478]">{t.estWait}</span>
                <span className="block text-[20px] font-extrabold text-[#0E1B3B] tabular-nums mt-0.5">
                  {aheadCount === 0 ? '0m' : `${estWaitMins}m`}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#E8F2FE] px-3.5 py-2.5">
              <span className="text-[12.5px] font-bold text-[#0E1B3B]">
                {t.patientsAhead}: <span className="tabular-nums text-[#0070FF]">{aheadCount}</span>
              </span>
              <span className={`text-[11.5px] font-extrabold px-2.5 py-1 rounded-full ${queueStatusTone}`}>
                {queueStatusLabel}
              </span>
            </div>

            <form onSubmit={handleTokenSubmit} className="mt-4">
              <label
                htmlFor="token-config-input"
                className="block text-[12px] font-bold text-[#1A2B50] mb-1.5"
              >
                {t.configureTokenLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="token-config-input"
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="A023"
                  className="flex-1 h-10 rounded-[12px] bg-white border border-[#C6DAF3] px-3 text-[13.5px] font-bold text-[#0E1B3B] focus:outline-2 focus:outline-[#0070FF]"
                />
                <button
                  type="submit"
                  className="neu-blue-btn rounded-[12px] px-4 h-10 text-[12.5px] font-bold text-white whitespace-nowrap"
                >
                  {t.updateTokenBtn}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {['A014', 'A016', 'A023', 'A028'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTokenInput(preset);
                      onUpdateToken(preset);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold border ${
                      userToken === preset
                        ? 'bg-[#0070FF] text-white border-[#0070FF]'
                        : 'bg-white text-[#1A2B50] border-[#D0E1F5]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onAdvanceQueue}
                  className="ml-auto px-3 py-1 rounded-full text-[11.5px] font-bold bg-[#E2EEFD] text-[#0066F5] hover:bg-[#D2E4FB]"
                >
                  {t.simulateNextBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. Appointment Booking Modal */}
        {modal.type === 'booking' && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#0E1B3B]">{t.bookTitle}</h3>
                <p className="text-[12px] font-semibold text-[#425478]">{t.bookSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modal.applyOffer && (
              <div className="mt-3 rounded-[14px] bg-[#E3F0FF] border border-[#BDDCFF] px-3.5 py-2 text-[12px] font-bold text-[#005CE6]">
                {t.offerTag}: {t.offerHeadlinePrefix} {offerPercentage}% {t.offerHeadlineSuffix} {t.offerDescription}
              </div>
            )}

            {bookingConfirmed ? (
              <div className="mt-5 rounded-[18px] bg-white border border-[#D4E6FA] p-5 text-center">
                <CheckCircle2 className="w-11 h-11 text-[#0070FF] mx-auto" />
                <h4 className="text-[16px] font-extrabold text-[#0E1B3B] mt-2.5">
                  {t.bookingConfirmedTitle}
                </h4>
                <p className="text-[12.5px] text-[#425478] mt-1 leading-relaxed">
                  {t.bookingConfirmedBody}
                </p>
                <div className="mt-3 inline-block rounded-full bg-[#E3F0FF] px-4 py-1.5 text-[13px] font-extrabold text-[#0070FF] tabular-nums">
                  Ref: {bookingConfirmed} • {selectedSlot}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 w-full neu-blue-btn rounded-full py-2.5 text-[13.5px] font-bold text-white"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1A2B50] mb-1">
                    {t.preferredTreatment}
                  </label>
                  <select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value as TreatmentId)}
                    className="w-full h-10 rounded-[12px] bg-white border border-[#C6DAF3] px-3 text-[13px] font-bold text-[#0E1B3B]"
                  >
                    {treatments.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {tr.text[language].title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1A2B50] mb-1">
                    {t.preferredTime}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold border ${
                          selectedSlot === slot
                            ? 'bg-[#0070FF] text-white border-[#0070FF]'
                            : 'bg-white text-[#1A2B50] border-[#D0E1F5]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1A2B50] mb-1">
                      {t.patientName}
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full h-10 rounded-[12px] bg-white border border-[#C6DAF3] px-3 text-[13px] font-semibold text-[#0E1B3B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#1A2B50] mb-1">
                      {t.phoneNumber}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 12345"
                      className="w-full h-10 rounded-[12px] bg-white border border-[#C6DAF3] px-3 text-[13px] font-semibold text-[#0E1B3B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full neu-blue-btn rounded-full py-2.5 text-[13.5px] font-bold text-white mt-2"
                >
                  {t.confirmBooking}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. Single Treatment Detail Placeholder */}
        {modal.type === 'treatment' && (() => {
          const item = treatments.find((tr) => tr.id === modal.treatmentId) ?? treatments[0];
          const copy = item.text[language];
          return (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0070FF] bg-[#E3F0FF] px-2.5 py-1 rounded-full">
                  {t.comingSoonBadge}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.close}
                  className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-[19px] font-extrabold text-[#0E1B3B] mt-3">
                {copy.title} {copy.subtitle ?? ''}
              </h3>
              <p className="text-[13px] text-[#3B4E75] mt-1.5 leading-relaxed">{copy.summary}</p>

              <div className="mt-3 flex items-center gap-3 text-[12px] font-bold text-[#1E3158]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0070FF]" />
                  {item.duration}
                </span>
                <span>•</span>
                <span>{item.priceNote}</span>
              </div>

              <ul className="mt-3 space-y-1.5 bg-white rounded-[16px] p-3.5 border border-[#DCE8F8]">
                {copy.highlights.map((hl) => (
                  <li key={hl} className="text-[12.5px] font-semibold text-[#1A2B50] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0070FF] shrink-0" />
                    {hl}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onOpenBooking(item.id)}
                className="mt-4 w-full neu-blue-btn rounded-full py-2.5 text-[13.5px] font-bold text-white"
              >
                {t.bookThisTreatment}
              </button>
            </div>
          );
        })()}

        {/* 4. View All Treatments Listing Placeholder */}
        {modal.type === 'viewAllTreatments' && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#0E1B3B]">{t.ourTreatments}</h3>
                <p className="text-[11.5px] font-bold text-[#0070FF]">{t.comingSoonBadge}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {treatments.map((tr) => {
                const copy = tr.text[language];
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => onSelectTreatment(tr.id)}
                    className="w-full text-left rounded-[16px] bg-white border border-[#DCE8F8] p-3.5 hover:border-[#0070FF] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-extrabold text-[#0E1B3B]">
                        {copy.title} {copy.subtitle ?? ''}
                      </span>
                      <span className="text-[11px] font-bold text-[#0070FF] shrink-0">{tr.duration}</span>
                    </div>
                    <p className="text-[12px] text-[#425478] mt-1 leading-snug">{copy.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Shortcut Placeholder Modal */}
        {modal.type === 'shortcut' && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0070FF] bg-[#E3F0FF] px-2.5 py-1 rounded-full">
                {t.comingSoonBadge}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-[19px] font-extrabold text-[#0E1B3B] mt-3">
              {t.shortcuts[modal.shortcutId]}
            </h3>

            <div className="mt-3 rounded-[16px] bg-white border border-[#DCE8F8] p-4 text-[13px] text-[#35486E] space-y-2 leading-relaxed">
              {modal.shortcutId === 'about' && (
                <>
                  <p className="font-bold text-[#0E1B3B]">{t.clinicName}</p>
                  <p>
                    Led by experienced dental specialists in {location}, offering painless root
                    canals, digital orthodontics, and implant care in a calm modern facility.
                  </p>
                </>
              )}
              {modal.shortcutId === 'contact' && (
                <>
                  <p className="flex items-center gap-2 font-bold text-[#0E1B3B]">
                    <MapPin className="w-4 h-4 text-[#0070FF]" />
                    Road No. 12, {location}
                  </p>
                  <p className="flex items-center gap-2 font-semibold">
                    <Phone className="w-4 h-4 text-[#0070FF]" />
                    +91 40 2335 8890 • Daily 9:00 AM – 8:30 PM
                  </p>
                </>
              )}
              {modal.shortcutId === 'faqs' && (
                <>
                  <p className="font-bold text-[#0E1B3B]">Do you accept walk-in patients?</p>
                  <p>
                    Yes! Track the Live Queue right from the homepage or reserve a priority slot in
                    under 30 seconds.
                  </p>
                </>
              )}
              {modal.shortcutId === 'reviews' && (
                <>
                  <p className="flex items-center gap-1.5 font-extrabold text-[#0E1B3B]">
                    <Star className="w-4 h-4 text-[#0070FF] fill-[#0070FF]" />
                    4.9 / 5.0 Verified Patient Rating (640+ Reviews)
                  </p>
                  <p>
                    “Spotless clinic, zero wait surprises thanks to the live token tracker, and super
                    gentle dental care.” — Priya R., Hyderabad
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full neu-blue-btn rounded-full py-2.5 text-[13.5px] font-bold text-white"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* 6. Bottom Navigation Tab Placeholder Modal */}
        {modal.type === 'navPlaceholder' && (
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0070FF] bg-[#E3F0FF] px-2.5 py-1 rounded-full">
                {t.comingSoonBadge}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="w-9 h-9 rounded-full neu-circle-btn flex items-center justify-center text-[#0E1B3B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#0070FF]" />
              <h3 className="text-[19px] font-extrabold text-[#0E1B3B]">{t.nav[modal.tabId]}</h3>
            </div>

            <p className="mt-2 text-[13px] text-[#3B4E75] leading-relaxed">
              The dedicated {t.nav[modal.tabId]} screen is planned for the next phase. You can book
              an appointment or explore treatments directly from the homepage right now.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="flex-1 neu-blue-btn rounded-full py-2.5 text-[13px] font-bold text-white"
              >
                {t.bookNow}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-white border border-[#C9DCF4] text-[13px] font-bold text-[#0E1B3B]"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
