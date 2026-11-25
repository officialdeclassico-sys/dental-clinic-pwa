import React from 'react';
import { CalendarDays, Home, User } from 'lucide-react';
import { NavTabId } from '../data/clinicData';

interface BottomNavProps {
  activeTab: NavTabId;
  labels: Record<NavTabId, string>;
  onSelectTab: (tab: NavTabId) => void;
}

function ServicesToothNavIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" aria-hidden="true">
      <path
        d="M8.5 4.2C6.3 4.2 4.6 6 4.6 8.3c0 2.5 1.2 4.4 1.8 6.9.5 2 1 5.2 2.5 5.2 1.2 0 1.5-2.3 2.3-4.1.4-.8 1-1.2 1.8-1.2s1.4.4 1.8 1.2c.8 1.8 1.1 4.1 2.3 4.1 1.5 0 2-3.2 2.5-5.2.6-2.5 1.8-4.4 1.8-6.9 0-2.3-1.7-4.1-3.9-4.1-1.4 0-2.4.6-3.2 1.1-.6.4-1.8.4-2.4 0-.8-.5-1.8-1.1-3.2-1.1Z"
        stroke={active ? '#0070FF' : '#0E1B3B'}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 9.5c.8.8 1.7 1.2 2.4 1.2s1.6-.4 2.4-1.2"
        stroke={active ? '#0070FF' : '#0E1B3B'}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottomNav({ activeTab, labels, onSelectTab }: BottomNavProps) {
  const tabs: { id: NavTabId; renderIcon: (active: boolean) => React.ReactNode }[] = [
    {
      id: 'home',
      renderIcon: (active) => (
        <Home
          className={`w-[22px] h-[22px] ${active ? 'text-[#0070FF] fill-[#0070FF]' : 'text-[#0E1B3B]'}`}
          strokeWidth={1.9}
        />
      ),
    },
    {
      id: 'appointments',
      renderIcon: (active) => (
        <CalendarDays
          className={`w-[22px] h-[22px] ${active ? 'text-[#0070FF]' : 'text-[#0E1B3B]'}`}
          strokeWidth={1.9}
        />
      ),
    },
    {
      id: 'services',
      renderIcon: (active) => <ServicesToothNavIcon active={active} />,
    },
    {
      id: 'profile',
      renderIcon: (active) => (
        <User
          className={`w-[22px] h-[22px] ${active ? 'text-[#0070FF]' : 'text-[#0E1B3B]'}`}
          strokeWidth={1.9}
        />
      ),
    },
  ];

  return (
    <nav
      aria-label="Primary Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-white border-t border-[#DAE7F7] shadow-[0_-4px_18px_rgba(128,162,210,0.18)] pb-safe-nav"
    >
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-4 h-[62px] md:h-[68px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center gap-1 min-h-[48px] px-1 focus-visible:outline-2 focus-visible:outline-[#0070FF]"
            >
              {tab.renderIcon(isActive)}
              <span
                className={`text-[11px] md:text-[12px] leading-none whitespace-nowrap ${
                  isActive ? 'font-extrabold text-[#0070FF]' : 'font-bold text-[#0E1B3B]'
                }`}
              >
                {labels[tab.id]}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 w-12 md:w-16 h-[3px] rounded-t-full bg-[#0070FF]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
