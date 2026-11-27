import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, Headphones, Search, ShieldCheck, X } from 'lucide-react';
import { FAQ_CATEGORIES, FAQ_ITEMS, FaqCategory, FaqItem } from '../data/clinicData';

interface FaqsPageProps {
  onBack: () => void;
  onContactUs: () => void;
}

function FaqHeroTooth3D({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 140" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="faqToothGrad" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F2F7FF" />
          <stop offset="88%" stopColor="#CEE1FA" />
          <stop offset="100%" stopColor="#A9C7F2" />
        </radialGradient>
        <linearGradient id="faqPodiumTop" x1="25" y1="100" x2="125" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#58C6FF" />
          <stop offset="100%" stopColor="#1B8EFF" />
        </linearGradient>
        <linearGradient id="faqPodiumSide" x1="25" y1="114" x2="125" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E72EC" />
          <stop offset="50%" stopColor="#2EA5FF" />
          <stop offset="100%" stopColor="#0055D6" />
        </linearGradient>
        <linearGradient id="faqBubbleGrad" x1="88" y1="14" x2="132" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4BC3FF" />
          <stop offset="100%" stopColor="#0066F5" />
        </linearGradient>
      </defs>

      {/* Podium */}
      <path
        d="M27 110v10c0 6.6 21.5 12 48 12s48-5.4 48-12v-10H27Z"
        fill="url(#faqPodiumSide)"
      />
      <ellipse cx="75" cy="110" rx="48" ry="11.5" fill="url(#faqPodiumTop)" />
      <ellipse cx="75" cy="110" rx="33" ry="6.5" fill="#004EC9" fillOpacity="0.24" />

      {/* Three white burst lines */}
      <line x1="22" y1="36" x2="31" y2="41" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="16" y1="51" x2="27" y2="52" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="23" y1="65" x2="31" y2="61" stroke="white" strokeWidth="3.2" strokeLinecap="round" />

      {/* 3D Tooth */}
      <path
        d="M52 36c-10.5 0-18.5 8.5-18.5 19.8 0 10.6 4.8 19.5 7.4 31.8 2 9.6 4.3 22 11.2 22 5.6 0 7.9-10.8 11.2-19.2 1.9-4.9 5.3-7 8.7-7s6.8 2.1 8.7 7c3.3 8.4 5.6 19.2 11.2 19.2 6.9 0 9.2-12.4 11.2-22 2.6-12.3 7.4-21.2 7.4-31.8 0-11.3-8-19.8-18.5-19.8-6.8 0-11.6 3-15.6 5.1-3 1.6-5.8 1.6-8.8 0-4-2.1-8.8-5.1-15.6-5.1Z"
        fill="url(#faqToothGrad)"
      />
      <ellipse cx="49" cy="54" rx="5.2" ry="10.5" transform="rotate(-14 49 54)" fill="white" fillOpacity="0.82" />

      {/* Glossy ? Speech Bubble */}
      <circle cx="110" cy="38" r="24" fill="white" />
      <path d="M97 56l-5 11 13-5" fill="white" />
      <circle cx="110" cy="38" r="21" fill="url(#faqBubbleGrad)" />
      <path
        d="M104.2 31.8c0-3.2 2.6-5.6 6-5.6 3.3 0 5.8 2.1 5.8 5.1 0 2.4-1.5 3.8-3.6 5-1.5.9-2.2 1.7-2.2 3.3v1"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="110.2" cy="46.4" r="2" fill="white" />
    </svg>
  );
}

function ToothQuestionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.5 4.2C6.3 4.2 4.6 6 4.6 8.3c0 2.5 1.2 4.4 1.8 6.9.5 2 1 5.2 2.5 5.2 1.2 0 1.5-2.3 2.3-4.1.4-.8 1-1.2 1.8-1.2s1.4.4 1.8 1.2c.8 1.8 1.1 4.1 2.3 4.1 1.5 0 2-3.2 2.5-5.2.6-2.5 1.8-4.4 1.8-6.9 0-2.3-1.7-4.1-3.9-4.1-1.4 0-2.4.6-3.2 1.1-.6.4-1.8.4-2.4 0-.8-.5-1.8-1.1-3.2-1.1Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BracesQuestionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="6.5" width="16" height="11" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="10.2" width="3" height="3.6" rx="0.8" stroke="currentColor" strokeWidth="1.4" fill="white" />
      <rect x="14" y="10.2" width="3" height="3.6" rx="0.8" stroke="currentColor" strokeWidth="1.4" fill="white" />
    </svg>
  );
}

function ImplantQuestionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.5 4.2c-2 0-3.5 1.6-3.5 3.8 0 2 1 3.7 2.2 5 .6.6 1.5 1 2.5 1h4.6c1 0 1.9-.4 2.5-1 1.2-1.3 2.2-3 2.2-5 0-2.2-1.5-3.8-3.5-3.8-1.3 0-2.3.5-3 .9-.4.2-1 .2-1.4 0-.7-.4-1.7-.9-2.6-.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9.5 14v5.5a2.5 2.5 0 0 0 5 0V14" stroke="currentColor" strokeWidth="1.8" />
      <line x1="9.6" y1="16.4" x2="14.4" y2="17.2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="9.6" y1="18.6" x2="14.4" y2="19.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function WhiteningQuestionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.5 5.2C6.4 5.2 4.8 6.9 4.8 9c0 2.3 1.1 4.1 1.7 6.4.4 1.8.9 4.7 2.3 4.7 1.1 0 1.4-2.1 2.1-3.7.4-.7.9-1.1 1.6-1.1s1.2.4 1.6 1.1c.7 1.6 1 3.7 2.1 3.7 1.4 0 1.9-2.9 2.3-4.7.6-2.3 1.7-4.1 1.7-6.4 0-2.1-1.6-3.8-3.7-3.8-1.3 0-2.2.5-2.9 1-.6.3-1.6.3-2.2 0-.7-.5-1.6-1-2.9-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.5 3.5l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6.6-1.5Z" fill="currentColor" />
    </svg>
  );
}

function renderFaqIcon(iconType: FaqItem['iconType']) {
  switch (iconType) {
    case 'calendar':
      return <CalendarDays className="w-[22px] h-[22px]" strokeWidth={2} />;
    case 'tooth':
      return <ToothQuestionIcon className="w-[22px] h-[22px]" />;
    case 'shield':
      return <ShieldCheck className="w-[22px] h-[22px]" strokeWidth={2} />;
    case 'braces':
      return <BracesQuestionIcon className="w-[22px] h-[22px]" />;
    case 'implant':
      return <ImplantQuestionIcon className="w-[22px] h-[22px]" />;
    case 'whitening':
      return <WhiteningQuestionIcon className="w-[22px] h-[22px]" />;
  }
}

export function FaqsPage({ onBack, onContactUs }: FaqsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('All');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_ITEMS[0].id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleQuestion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Page Header */}
      <header className="flex items-center gap-3.5 pt-3.5 md:pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Home"
          className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.7} />
        </button>
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          FAQs
        </h1>
      </header>

      <div className="mt-3 space-y-3.5 sm:space-y-4">
        {/* Hero Banner */}
        <section
          aria-label="Frequently Asked Questions"
          className="relative rounded-[22px] md:rounded-[26px] border border-white/85 shadow-[0_8px_20px_rgba(0,95,215,0.22)] overflow-hidden h-[192px] sm:h-[224px] md:h-[260px] lg:h-[285px] bg-gradient-to-br from-[#28B0FF] via-[#0776FF] to-[#0055DF]"
        >
          {/* Curved Electric-Blue Left Wave */}
          <svg
            viewBox="0 0 400 220"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="faqHeroBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B9AFF" />
                <stop offset="65%" stopColor="#056FFF" />
                <stop offset="100%" stopColor="#0052DC" />
              </linearGradient>
            </defs>
            <path
              d="M0 0 H226 C248 64, 240 144, 188 220 H0 Z"
              fill="url(#faqHeroBlue)"
            />
            <path
              d="M226 0 H400 V220 H188 C240 144, 248 64, 226 0 Z"
              fill="#27ACFF"
              fillOpacity="0.28"
            />
          </svg>

          {/* Right 3D Tooth + ? Speech Bubble Illustration */}
          <div className="absolute inset-y-0 right-2 sm:right-6 md:right-10 flex items-center justify-center pointer-events-none">
            <FaqHeroTooth3D className="w-[144px] h-[134px] sm:w-[170px] sm:h-[158px] md:w-[205px] md:h-[190px]" />
          </div>

          <div className="relative z-10 h-full w-[64%] sm:w-[58%] md:w-[54%] pl-4 sm:pl-6 md:pl-9 pr-2 flex flex-col justify-center">
            <h2 className="text-[21px] sm:text-[26px] md:text-[31px] lg:text-[34px] font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-[0_1px_2px_rgba(0,48,135,0.28)]">
              <span className="block">Frequently</span>
              <span className="block">Asked</span>
              <span className="block">Questions</span>
            </h2>
            <p className="mt-2 md:mt-2.5 text-[11px] sm:text-[13px] md:text-[15px] font-medium text-white/95 leading-snug max-w-[215px] sm:max-w-[290px] md:max-w-[360px]">
              Find quick answers to common questions about our dental care, treatments and appointments.
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <div className="neu-card rounded-full px-4 h-12 md:h-13 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-[#0070FF] shrink-0" strokeWidth={2.3} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a question..."
            aria-label="Search a question"
            className="w-full bg-transparent text-[13.5px] sm:text-[14.5px] font-semibold text-[#0E1B3B] placeholder:text-[#5E7092] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#425478] hover:text-[#0E1B3B] neu-press-soft"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-0.5"
          role="tablist"
          aria-label="FAQ Categories"
        >
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`neu-btn-sm px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#0070FF] ${
                  isActive
                    ? 'neu-blue-btn text-white'
                    : 'neu-card-interactive text-[#1B2D52] hover:text-[#0070FF]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Accordion-Style Question Cards */}
        <section aria-label="FAQ Questions" className="space-y-2.5 sm:space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="neu-card rounded-[18px] p-5 text-center">
              <p className="text-[13.5px] font-bold text-[#0E1B3B]">
                No matching questions found.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-2.5 neu-blue-btn neu-btn-sm px-4 py-1.5 text-[12px] font-bold text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="neu-card rounded-[18px] md:rounded-[20px] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleQuestion(item.id)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 text-left neu-press-surface focus-visible:outline-2 focus-visible:outline-[#0070FF]"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] bg-gradient-to-br from-[#F8FBFF] to-[#EAF2FC] border-[1.5px] border-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.9),3px_4px_10px_rgba(140,174,216,0.28)] flex items-center justify-center text-[#0070FF] shrink-0">
                        {renderFaqIcon(item.iconType)}
                      </div>
                      <span className="text-[13.5px] sm:text-[15px] md:text-[16px] font-extrabold text-[#0E1B3B] leading-snug">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-[#0E1B3B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      strokeWidth={2.5}
                    />
                  </button>

                  {/* Smooth Expand / Collapse Body */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mx-3 sm:mx-4 border-t border-[#D3E3F7] pt-2.5 pb-3.5 text-[12.5px] sm:text-[13.5px] md:text-[14.5px] font-medium text-[#2A3E66] leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Contact Us Support Section */}
        <section
          aria-label="Need more help"
          className="neu-card rounded-[20px] md:rounded-[24px] p-3.5 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-gradient-to-br from-[#F8FBFF] to-[#EAF2FC] border-[1.5px] border-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.9),3px_4px_10px_rgba(140,174,216,0.28)] flex items-center justify-center text-[#0070FF] shrink-0">
              <Headphones className="w-6 h-6" strokeWidth={2.1} />
            </div>

            <div className="w-[1px] h-9 bg-[#C8DAEE] shrink-0" aria-hidden="true" />

            <div className="min-w-0">
              <h2 className="text-[14px] sm:text-[16px] md:text-[17.5px] font-extrabold text-[#0E1B3B] leading-tight">
                Still have a question?
              </h2>
              <p className="text-[11px] sm:text-[12.5px] md:text-[13.5px] font-medium text-[#2F436B] leading-snug mt-0.5">
                Get in touch with our team for further assistance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onContactUs}
            className="neu-blue-btn neu-btn-md px-4 sm:px-5 md:px-6 py-2 md:py-2.5 text-[12.5px] sm:text-[13.5px] md:text-[14.5px] font-bold text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
          >
            Contact Us
          </button>
        </section>
      </div>
    </div>
  );
}
