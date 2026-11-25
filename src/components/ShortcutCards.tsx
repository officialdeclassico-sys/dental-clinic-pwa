import React from 'react';
import { Phone, Star, User } from 'lucide-react';
import { ShortcutId } from '../data/clinicData';

interface ShortcutCardsProps {
  labels: Record<ShortcutId, string>;
  onSelectShortcut: (id: ShortcutId) => void;
}

function FaqBubbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] text-[#0070FF]"
      aria-hidden="true"
    >
      <path
        d="M12 3.2c4.97 0 9 3.62 9 8.08 0 4.46-4.03 8.08-9 8.08-1.36 0-2.66-.27-3.82-.76L4 20.3l1.18-3.68C3.81 15.2 3 13.32 3 11.28 3 6.82 7.03 3.2 12 3.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 9.2a2.25 2.25 0 0 1 4.35.75c0 1.35-2.15 1.8-2.15 3.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function ShortcutCards({ labels, onSelectShortcut }: ShortcutCardsProps) {
  const items: { id: ShortcutId; icon: React.ReactNode }[] = [
    {
      id: 'about',
      icon: <User className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />,
    },
    {
      id: 'contact',
      icon: <Phone className="w-[27px] h-[27px] md:w-[29px] md:h-[29px] text-[#0070FF]" strokeWidth={2} />,
    },
    {
      id: 'faqs',
      icon: <FaqBubbleIcon />,
    },
    {
      id: 'reviews',
      icon: <Star className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] text-[#0070FF]" strokeWidth={2} />,
    },
  ];

  return (
    <section aria-label="Clinic Shortcuts" className="grid grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectShortcut(item.id)}
          className="neu-card-interactive rounded-[18px] md:rounded-[22px] py-3.5 md:py-4.5 px-1 flex flex-col items-center justify-center gap-1.5 md:gap-2 min-h-[84px] sm:min-h-[88px] md:min-h-[104px] focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          {item.icon}
          <span className="text-[12px] sm:text-[13px] md:text-[14.5px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
            {labels[item.id]}
          </span>
        </button>
      ))}
    </section>
  );
}
