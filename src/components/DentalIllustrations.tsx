import React from 'react';

export function ClinicLogoToothIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.6 6.2C8.4 6.2 6 8.8 6 12.2c0 3.7 1.8 6.4 2.7 10.1.7 2.8 1.4 7.5 3.6 7.5 1.7 0 2.1-3.3 3.3-5.9.5-1.1 1.4-1.7 2.4-1.7s1.9.6 2.4 1.7c1.2 2.6 1.6 5.9 3.3 5.9 2.2 0 2.9-4.7 3.6-7.5.9-3.7 2.7-6.4 2.7-10.1 0-3.4-2.4-6-5.6-6-2 0-3.5.9-4.7 1.6-.9.5-2.5.5-3.4 0-1.2-.7-2.7-1.6-4.7-1.6Z"
        stroke="white"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3 13.8c1.3 1.4 3 2.1 4.7 2.1s3.4-.7 4.7-2.1"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TicketQueueIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ticketGrad" x1="6" y1="8" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#35BAFF" />
          <stop offset="100%" stopColor="#0066F5" />
        </linearGradient>
      </defs>
      <g transform="rotate(-14 22 22)">
        <path
          d="M5 13a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v5.2a3.8 3.8 0 0 0 0 7.6V31a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5.2a3.8 3.8 0 0 0 0-7.6V13Z"
          fill="url(#ticketGrad)"
        />
        <line x1="14" y1="13" x2="14" y2="31" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeDasharray="2.5 2.5" />
        <rect x="18" y="16.5" width="13" height="2.6" rx="1.3" fill="white" fillOpacity="0.92" />
        <rect x="18" y="21" width="13" height="2.6" rx="1.3" fill="white" fillOpacity="0.82" />
        <rect x="18" y="25.5" width="9" height="2.6" rx="1.3" fill="white" fillOpacity="0.72" />
      </g>
    </svg>
  );
}

export function TreatmentTooth3D({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="toothBody3D" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F3F7FF" />
          <stop offset="88%" stopColor="#D1E2FA" />
          <stop offset="100%" stopColor="#AFC9F2" />
        </radialGradient>
        <linearGradient id="toothHighlight" x1="18" y1="14" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="57" rx="14" ry="3" fill="#00368F" fillOpacity="0.24" />
      <path
        d="M21 12c-5.4 0-9.5 4.4-9.5 10.4 0 5.6 2.5 10.6 3.9 17.5 1.1 5.6 2.2 13.6 5.9 13.6 3 0 4.3-6.1 6-10.7 1-2.7 2.8-3.8 4.7-3.8s3.7 1.1 4.7 3.8c1.7 4.6 3 10.7 6 10.7 3.7 0 4.8-8 5.9-13.6 1.4-6.9 3.9-11.9 3.9-17.5 0-6-4.1-10.4-9.5-10.4-3.7 0-6.2 1.6-8.3 2.7-1.7.9-3.7.9-5.4 0-2.1-1.1-4.6-2.7-8.3-2.7Z"
        fill="url(#toothBody3D)"
      />
      <path
        d="M22.5 15.2c3.5 1.6 6.4 2.4 9.5 2.4s6-.8 9.5-2.4"
        stroke="#C5D9F7"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="20.5" cy="22" rx="3.4" ry="6.2" transform="rotate(-14 20.5 22)" fill="url(#toothHighlight)" />
    </svg>
  );
}

export function TreatmentBraces3D({ className = 'w-14 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 56" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gumTop" x1="36" y1="8" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9BB3" />
          <stop offset="100%" stopColor="#F06A8E" />
        </linearGradient>
        <linearGradient id="gumBot" x1="36" y1="28" x2="36" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EC678B" />
          <stop offset="100%" stopColor="#FF9FB7" />
        </linearGradient>
        <linearGradient id="toothWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE6F8" />
        </linearGradient>
      </defs>
      <ellipse cx="36" cy="51" rx="22" ry="3" fill="#460F99" fillOpacity="0.28" />
      {/* Gums */}
      <rect x="8" y="10" width="56" height="36" rx="18" fill="url(#gumTop)" />
      <path d="M9 28c0 9.5 11.5 18 27 18s27-8.5 27-18H9Z" fill="url(#gumBot)" />
      {/* Upper Teeth */}
      {[12, 20, 28.5, 36.5, 45, 53].map((x, i) => (
        <rect
          key={`u-${i}`}
          x={x}
          y={16.5}
          width={i === 2 || i === 3 ? 7.2 : 6.4}
          height={10.5}
          rx={2.2}
          fill="url(#toothWhite)"
        />
      ))}
      {/* Lower Teeth */}
      {[13, 21, 29, 37, 45, 53].map((x, i) => (
        <rect
          key={`l-${i}`}
          x={x}
          y={29}
          width={6.4}
          height={9.8}
          rx={2.2}
          fill="url(#toothWhite)"
        />
      ))}
      {/* Archwires */}
      <path d="M13 21.5h46" stroke="#B6C4D8" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 33.8h44" stroke="#B6C4D8" strokeWidth="1.3" strokeLinecap="round" />
      {/* Brackets */}
      {[14.2, 22, 30.8, 38.8, 47, 54.8].map((x, i) => (
        <g key={`bu-${i}`}>
          <rect x={x} y={19.8} width="2.8" height="3.4" rx="0.7" fill="#7D90AC" stroke="#E8EFF9" strokeWidth="0.6" />
          <rect x={x} y={32.1} width="2.8" height="3.4" rx="0.7" fill="#7D90AC" stroke="#E8EFF9" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

export function TreatmentImplant3D({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="implantCrown" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#EEF4FF" />
          <stop offset="100%" stopColor="#C1D6F5" />
        </radialGradient>
        <linearGradient id="titaniumScrew" x1="22" y1="34" x2="42" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#859BB8" />
          <stop offset="40%" stopColor="#E4ECF8" />
          <stop offset="75%" stopColor="#94AAC6" />
          <stop offset="100%" stopColor="#657B99" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="58" rx="11" ry="2.6" fill="#00368F" fillOpacity="0.25" />
      {/* Crown */}
      <path
        d="M23 11c-4.4 0-7.8 3.6-7.8 8.3 0 4.5 2 8.2 4.6 11.4 1.3 1.6 3.5 2.5 5.9 2.5h12.6c2.4 0 4.6-.9 5.9-2.5 2.6-3.2 4.6-6.9 4.6-11.4 0-4.7-3.4-8.3-7.8-8.3-3.1 0-5.4 1.3-7.2 2.2-1.1.6-2.5.6-3.6 0-1.8-.9-4.1-2.2-7.2-2.2Z"
        fill="url(#implantCrown)"
      />
      {/* Abutment collar */}
      <rect x="25" y="32.5" width="14" height="4.5" rx="1.5" fill="url(#titaniumScrew)" />
      {/* Threaded screw post */}
      <path
        d="M24.5 37h15l-1.5 14.2c-.2 2.2-2.2 3.8-4.5 3.8h-3c-2.3 0-4.3-1.6-4.5-3.8L24.5 37Z"
        fill="url(#titaniumScrew)"
      />
      {[39.5, 43, 46.5, 50].map((y, idx) => (
        <line
          key={y}
          x1={24.5 + idx * 0.5}
          y1={y}
          x2={39.5 - idx * 0.5}
          y2={y + 1.1}
          stroke="#596E8D"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function TreatmentCosmetic3D({ className = 'w-14 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 60" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="cosmeticTooth" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F8FF" />
          <stop offset="100%" stopColor="#CFD7F7" />
        </radialGradient>
      </defs>
      <ellipse cx="36" cy="54" rx="14" ry="2.8" fill="#460F99" fillOpacity="0.25" />
      {/* Back orbit arc */}
      <path
        d="M11 26c-4-5 7-11 25-11s29 6 25 11"
        stroke="white"
        strokeWidth="1.8"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      {/* Tooth */}
      <path
        d="M26 14c-4.8 0-8.6 3.9-8.6 9.3 0 5 2.2 9.4 3.5 15.6 1 5 2 12.1 5.3 12.1 2.7 0 3.8-5.4 5.4-9.5.9-2.4 2.5-3.4 4.4-3.4s3.5 1 4.4 3.4c1.6 4.1 2.7 9.5 5.4 9.5 3.3 0 4.3-7.1 5.3-12.1 1.3-6.2 3.5-10.6 3.5-15.6 0-5.4-3.8-9.3-8.6-9.3-3.3 0-5.6 1.4-7.5 2.4-1.5.8-3.5.8-5 0-1.9-1-4.2-2.4-7.5-2.4Z"
        fill="url(#cosmeticTooth)"
      />
      {/* Front orbit swoosh */}
      <path
        d="M11 26c4 6.5 16 10 25 10s21-3.5 25-10"
        stroke="white"
        strokeWidth="2.4"
        strokeOpacity="0.92"
        strokeLinecap="round"
      />
      {/* Sparkles */}
      <path d="M55 11l1.4 3.6L60 16l-3.6 1.4L55 21l-1.4-3.6L50 16l3.6-1.4L55 11Z" fill="white" />
      <path d="M18 11l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" fill="white" fillOpacity="0.92" />
      <path d="M54 36l0.9 2.2 2.2 0.9-2.2 0.9-0.9 2.2-0.9-2.2-2.2-0.9 2.2-0.9 0.9-2.2Z" fill="white" fillOpacity="0.88" />
    </svg>
  );
}
