import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Globe, MapPin, Check } from 'lucide-react';
import { ClinicLogoToothIcon } from './DentalIllustrations';
import { ClinicNotification, LanguageCode } from '../data/clinicData';

interface ClinicHeaderProps {
  clinicName: string;
  location: string;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  notifications: ClinicNotification[];
  onMarkAllRead: () => void;
  onMarkNotificationRead: (id: string) => void;
  notificationsTitle: string;
  markAllReadLabel: string;
  noNotificationsLabel: string;
  languageTitle: string;
}

const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'EN', label: 'English', native: 'EN' },
  { code: 'HI', label: 'हिन्दी', native: 'HI' },
  { code: 'TE', label: 'తెలుగు', native: 'TE' },
];

export function ClinicHeader({
  clinicName,
  location,
  language,
  onLanguageChange,
  notifications,
  onMarkAllRead,
  onMarkNotificationRead,
  notificationsTitle,
  markAllReadLabel,
  noNotificationsLabel,
  languageTitle,
}: ClinicHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="relative z-30 flex items-center justify-between gap-2 md:gap-4 pt-3.5 md:pt-4 pb-2.5 md:pb-3">
      {/* Left: Logo + Vertical Hairline + Name & Location */}
      <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0 flex-1">
        <div className="w-12 h-12 md:w-[52px] md:h-[52px] rounded-[15px] md:rounded-[17px] neu-blue-logo flex items-center justify-center shrink-0">
          <ClinicLogoToothIcon className="w-7 h-7 md:w-[30px] md:h-[30px]" />
        </div>

        <div className="w-[1.5px] h-8 md:h-9 bg-[#0E1B3B]/35 rounded-full shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex flex-col justify-center">
          <h1 className="text-[15.5px] sm:text-[17px] md:text-[20px] font-extrabold text-[#0E1B3B] leading-tight tracking-tight truncate">
            {clinicName}
          </h1>
          <div className="flex items-center gap-1 mt-0.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0E1B3B] shrink-0" strokeWidth={2.3} />
            <span className="text-[12px] sm:text-[13px] md:text-[14px] font-semibold text-[#18294F] truncate">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Notification Bell & Language Selector */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Notifications Button & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setLangOpen(false);
            }}
            aria-label={notificationsTitle}
            aria-expanded={notifOpen}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full neu-circle-btn flex items-center justify-center relative focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <Bell className="w-[19px] h-[19px] text-[#0E1B3B]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span
                className="absolute top-[7px] right-[8px] w-2.5 h-2.5 rounded-full bg-[#0070FF] ring-2 ring-[#F4F8FE]"
                aria-label={`${unreadCount} unread notifications`}
              />
            )}
          </button>

          {notifOpen && (
            <div
              role="dialog"
              aria-label={notificationsTitle}
              className="absolute right-0 mt-2 w-[300px] sm:w-[340px] rounded-[20px] neu-card p-3.5 z-50"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-[#D2E2F5]">
                <span className="text-[13.5px] font-extrabold text-[#0E1B3B]">
                  {notificationsTitle}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-[11.5px] font-bold text-[#0070FF] hover:underline rounded-[8px] neu-press-soft px-1.5 py-0.5"
                  >
                    {markAllReadLabel}
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-2 max-h-[260px] overflow-y-auto pr-0.5">
                {notifications.length === 0 ? (
                  <p className="text-[12px] text-[#425478] py-4 text-center">
                    {noNotificationsLabel}
                  </p>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`w-full text-left rounded-[14px] p-2.5 border neu-press-surface ${
                        item.unread
                          ? 'bg-[#E8F2FE] border-[#BDDCFF]'
                          : 'bg-white/80 border-[#DCE8F8] hover:bg-[#F3F8FE]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12.5px] font-bold text-[#0E1B3B]">
                          {item.text[language].title}
                        </span>
                        <span className="text-[10.5px] font-semibold text-[#5A6E94] shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#35486E] mt-1 leading-snug">
                        {item.text[language].body}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector Pill */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => {
              setLangOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-label={languageTitle}
            aria-expanded={langOpen}
            className="h-10 sm:h-11 px-2.5 sm:px-3.5 rounded-full neu-circle-btn flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            <Globe className="w-[17px] h-[17px] text-[#0E1B3B] shrink-0" strokeWidth={2} />
            <span className="text-[12.5px] sm:text-[13.5px] font-extrabold text-[#0E1B3B] leading-none">
              {language}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#0E1B3B] transition-transform duration-150 ${
                langOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={2.5}
            />
          </button>

          {langOpen && (
            <div
              role="menu"
              aria-label={languageTitle}
              className="absolute right-0 mt-2 w-40 rounded-[18px] neu-card p-1.5 z-50"
            >
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-[#5A6E94]">
                {languageTitle}
              </div>
              {LANGUAGES.map((lang) => {
                const selected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-[12.5px] font-bold ${
                      selected
                        ? 'bg-[#0070FF] text-white neu-press-solid-blue'
                        : 'text-[#0E1B3B] hover:bg-[#E1EEFC] neu-press-surface'
                    }`}
                  >
                    <span>
                      {lang.label} ({lang.native})
                    </span>
                    {selected && <Check className="w-3.5 h-3.5" strokeWidth={2.8} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
