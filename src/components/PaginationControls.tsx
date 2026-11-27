import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  navAriaLabel: string;
  pageLabelPrefix?: string;
  className?: string;
  inactiveDotClassName?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  navAriaLabel,
  pageLabelPrefix = 'Page',
  className = 'pt-0.5 flex items-center justify-center gap-3',
  inactiveDotClassName = 'bg-[#AFC8E8] hover:bg-[#7BA9E2]',
}: PaginationControlsProps) {
  return (
    <nav aria-label={navAriaLabel} className={className}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-label="Previous page"
        className="w-9 h-9 rounded-[11px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[#0070FF]"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const active = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              data-haptic="selection"
              onClick={() => onPageChange(pageNum)}
              aria-label={`${pageLabelPrefix} ${pageNum}`}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full neu-press-dot ${
                active
                  ? 'w-2.5 h-2.5 bg-[#0070FF]'
                  : `w-2 h-2 ${inactiveDotClassName}`
              }`}
            />
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-label="Next page"
        className="w-9 h-9 rounded-[11px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[#0070FF]"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </nav>
  );
}
