import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  TreatmentBraces3D,
  TreatmentCosmetic3D,
  TreatmentImplant3D,
  TreatmentTooth3D,
} from './DentalIllustrations';
import { LanguageCode, TreatmentId, TreatmentItem } from '../data/clinicData';

interface TreatmentsSectionProps {
  heading: string;
  viewAllLabel: string;
  treatments: TreatmentItem[];
  language: LanguageCode;
  onSelectTreatment: (id: TreatmentId) => void;
  onViewAll: () => void;
}

function getIllustration(id: TreatmentId) {
  switch (id) {
    case 'general':
      return <TreatmentTooth3D className="w-12 h-12 sm:w-14 sm:h-14 md:w-[68px] md:h-[68px] lg:w-[76px] lg:h-[76px]" />;
    case 'orthodontics':
      return <TreatmentBraces3D className="w-14 h-12 sm:w-16 sm:h-14 md:w-[78px] md:h-[68px] lg:w-[86px] lg:h-[76px]" />;
    case 'implants':
      return <TreatmentImplant3D className="w-12 h-12 sm:w-14 sm:h-14 md:w-[68px] md:h-[68px] lg:w-[76px] lg:h-[76px]" />;
    case 'cosmetic':
      return <TreatmentCosmetic3D className="w-14 h-12 sm:w-16 sm:h-14 md:w-[78px] md:h-[68px] lg:w-[86px] lg:h-[76px]" />;
  }
}

export function TreatmentsSection({
  heading,
  viewAllLabel,
  treatments,
  language,
  onSelectTreatment,
  onViewAll,
}: TreatmentsSectionProps) {
  return (
    <section aria-label={heading}>
      <div className="flex items-center justify-between mb-2.5 md:mb-3.5">
        <h2 className="text-[19px] sm:text-[21px] md:text-[23px] font-extrabold text-[#0E1B3B] tracking-tight leading-none">
          {heading}
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-0.5 text-[13.5px] sm:text-[14.5px] md:text-[15.5px] font-bold text-[#0070FF] hover:text-[#0052D4] whitespace-nowrap shrink-0 py-1 pl-2 rounded-[10px] neu-press-soft focus-visible:outline-2 focus-visible:outline-[#0070FF]"
        >
          <span>{viewAllLabel}</span>
          <ChevronRight className="w-4 h-4 md:w-[18px] md:h-[18px] -ml-0.5" strokeWidth={2.8} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-5">
        {treatments.map((item) => {
          const copy = item.text[language];
          const cardClass =
            item.variant === 'blue' ? 'neu-treatment-blue' : 'neu-treatment-purple';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTreatment(item.id)}
              className={`${cardClass} rounded-[18px] md:rounded-[22px] px-1 sm:px-2 md:px-4 py-3 sm:py-3.5 md:py-5 flex flex-col items-center justify-between min-h-[120px] sm:min-h-[138px] md:min-h-[172px] lg:min-h-[190px] text-center focus-visible:outline-2 focus-visible:outline-[#0E1B3B]`}
            >
              <div className="flex items-center justify-center h-12 sm:h-14 md:h-[70px] lg:h-[78px] w-full">
                {getIllustration(item.id)}
              </div>

              <div className="mt-1.5 md:mt-2.5 w-full">
                <span className="block text-[11.5px] sm:text-[13px] md:text-[15px] lg:text-[16px] font-extrabold text-white leading-[1.16] tracking-tight">
                  {copy.title}
                </span>
                {copy.subtitle && (
                  <span className="block text-[8.5px] sm:text-[10px] md:text-[11.5px] lg:text-[12px] font-semibold text-white/90 leading-[1.15] mt-0.5">
                    {copy.subtitle}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
