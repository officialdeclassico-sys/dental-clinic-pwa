import React from 'react';
import { TicketQueueIcon } from './DentalIllustrations';

interface LiveQueueCardProps {
  liveQueueLabel: string;
  liveTagLabel: string;
  branchName: string;
  nowServingLabel: string;
  servingNumber: number;
  yourTokenLabel: string;
  userToken: string;
  onTokenClick: () => void;
}

export function LiveQueueCard({
  liveQueueLabel,
  liveTagLabel,
  branchName,
  nowServingLabel,
  servingNumber,
  yourTokenLabel,
  userToken,
  onTokenClick,
}: LiveQueueCardProps) {
  const formattedServing = String(servingNumber).padStart(3, '0');

  return (
    <section
      aria-label={liveQueueLabel}
      className="neu-card rounded-[20px] md:rounded-[24px] px-3 sm:px-4 md:px-7 py-3 sm:py-3.5 md:py-4 flex items-center justify-between gap-2 sm:gap-3 md:gap-6"
    >
      {/* Left: Ticket Icon + Live Queue + Branch Name (no chevron, no info icon) */}
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1">
        <TicketQueueIcon className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-[14px] sm:text-[15px] md:text-[18px] font-extrabold text-[#0E1B3B] leading-tight whitespace-nowrap">
              {liveQueueLabel}
            </h2>
            <span className="inline-flex items-center gap-1 text-[9.5px] md:text-[10.5px] font-extrabold tracking-wide text-[#0066F5] bg-[#E2EEFD] px-1.5 md:px-2 py-0.5 rounded-full leading-none shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0070FF] animate-pulse" aria-hidden="true" />
              {liveTagLabel}
            </span>
          </div>
          <p className="text-[11px] sm:text-[12px] md:text-[13.5px] font-semibold text-[#3C4E73] leading-tight mt-0.5 truncate">
            {branchName}
          </p>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="w-[1px] h-10 md:h-12 bg-[#BDD0E8] shrink-0" aria-hidden="true" />

      {/* Middle: Now Serving */}
      <div className="flex flex-col items-center justify-center px-2 sm:px-4 md:px-8 shrink-0">
        <span className="text-[10.5px] sm:text-[11.5px] md:text-[13px] font-bold text-[#1D2D50] leading-tight whitespace-nowrap">
          {nowServingLabel}
        </span>
        <span className="text-[22px] sm:text-[24px] md:text-[28px] font-extrabold text-[#0070FF] leading-none tabular-nums mt-0.5">
          {formattedServing}
        </span>
      </div>

      {/* Hairline Divider */}
      <div className="w-[1px] h-10 md:h-12 bg-[#BDD0E8] shrink-0" aria-hidden="true" />

      {/* Right: Your Token Button (no info button) */}
      <div className="flex flex-col items-center justify-center pl-1 sm:pl-3 md:pl-6 shrink-0">
        <span className="text-[10.5px] sm:text-[11.5px] md:text-[13px] font-bold text-[#1D2D50] leading-tight whitespace-nowrap">
          {yourTokenLabel}
        </span>
        <button
          type="button"
          onClick={onTokenClick}
          className="mt-1 neu-blue-btn rounded-full px-3.5 sm:px-4 md:px-6 py-[5px] md:py-[7px] text-[13px] sm:text-[14px] md:text-[15px] font-extrabold text-white leading-none tracking-wide tabular-nums whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          {userToken}
        </button>
      </div>
    </section>
  );
}
