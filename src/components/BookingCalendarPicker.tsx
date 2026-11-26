import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Info, Loader2 } from 'lucide-react';
import {
  BOOKING_API_CONFIG,
  TimeSlotOption,
  getOperatingWindowForDate,
} from '../data/appointmentsRepository';

interface BookingCalendarPickerProps {
  selectedDate: string;
  onSelectDate: (dateIso: string) => void;
  selectedSlot?: TimeSlotOption | null;
  onSelectSlot?: (slot: TimeSlotOption) => void;
  slots?: TimeSlotOption[];
  slotsLoading?: boolean;
  slotsError?: string | null;
  mode: 'date-only' | 'slot-only' | 'both';
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function BookingCalendarPicker({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  slots = [],
  slotsLoading = false,
  slotsError = null,
  mode,
}: BookingCalendarPickerProps) {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(
    () => toIsoDate(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  const initialDate = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [selectedDate, today]);

  const [viewMonth, setViewMonth] = useState<Date>(initialDate);

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonthStart = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const canGoPrev =
    viewMonth.getFullYear() > currentMonthStart.getFullYear() ||
    (viewMonth.getFullYear() === currentMonthStart.getFullYear() &&
      viewMonth.getMonth() > currentMonthStart.getMonth());

  const canGoNext =
    viewMonth.getFullYear() < maxMonthStart.getFullYear() ||
    (viewMonth.getFullYear() === maxMonthStart.getFullYear() &&
      viewMonth.getMonth() < maxMonthStart.getMonth());

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthLabel = viewMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const operatingWindow = selectedDate ? getOperatingWindowForDate(selectedDate) : null;

  return (
    <div className="space-y-3.5">
      {(mode === 'date-only' || mode === 'both') && (
        <div className="neu-card rounded-[20px] p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0070FF]" />
              <span className="text-[14.5px] sm:text-[15.5px] font-extrabold text-[#0E1B3B]">
                {monthLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                aria-label="Previous month"
                className="w-8 h-8 rounded-[10px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                aria-label="Next month"
                className="w-8 h-8 rounded-[10px] neu-card-interactive flex items-center justify-center text-[#0E1B3B] disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span
                key={d}
                className="text-[11px] font-bold text-[#425478] py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} aria-hidden="true" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const iso = toIsoDate(year, month, dayNum);
              const isPast = iso < todayIso;
              const isSelected = iso === selectedDate;
              const isToday = iso === todayIso;
              const hasWindow = Boolean(getOperatingWindowForDate(iso));
              const disabled = isPast || !hasWindow;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectDate(iso)}
                  aria-label={iso}
                  aria-pressed={isSelected}
                  className={`h-9 sm:h-10 rounded-[11px] text-[12.5px] sm:text-[13px] font-bold tabular-nums flex flex-col items-center justify-center ${
                    isSelected
                      ? 'neu-blue-btn text-white'
                      : disabled
                        ? 'text-[#9FB2CC] bg-[#EAF2FB]/60 cursor-not-allowed'
                        : isToday
                          ? 'bg-[#E8F2FE] border-2 border-[#0070FF] text-[#0070FF] neu-press-surface'
                          : 'bg-white/85 border border-white text-[#0E1B3B] hover:bg-[#EBF4FF] shadow-[0_2px_6px_rgba(140,174,216,0.18)] neu-press-surface'
                  }`}
                >
                  <span>{dayNum}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#DCE8F8] text-[11px] font-semibold text-[#425478]">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0070FF]" />
                Selected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#B8CEE9]" />
                Available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B9C9DE]" />
                Past
              </span>
            </div>
            {operatingWindow && (
              <span className="text-[#0E1B3B] font-bold">
                {operatingWindow.dayName}:{' '}
                {operatingWindow.dayName === 'Sunday'
                  ? '10:00 AM – 02:00 PM'
                  : '09:00 AM – 08:00 PM'}
              </span>
            )}
          </div>
        </div>
      )}

      {(mode === 'slot-only' || mode === 'both') && (
        <div className="neu-card rounded-[20px] p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0070FF]" />
              <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0E1B3B]">
                Available Time Slots
              </span>
            </div>
            {selectedDate && (
              <span className="text-[11.5px] font-bold text-[#0070FF] bg-[#E3F0FF] px-2.5 py-1 rounded-full tabular-nums">
                {selectedDate}
              </span>
            )}
          </div>

          {!BOOKING_API_CONFIG.isBackendConnected && (
            <div className="flex items-start gap-2 rounded-[12px] bg-[#E8F2FE] border border-[#C6DDF9] px-3 py-2 text-[11.5px] font-semibold text-[#1E3A6D]">
              <Info className="w-4 h-4 text-[#0070FF] shrink-0 mt-0.5" />
              <span>{BOOKING_API_CONFIG.apiStatusLabel}</span>
            </div>
          )}

          {slotsLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#425478]">
              <Loader2 className="w-6 h-6 text-[#0070FF] animate-spin" />
              <span className="text-[12.5px] font-semibold">Checking available slots...</span>
            </div>
          ) : slotsError ? (
            <div className="rounded-[14px] bg-[#FEECEC] border border-[#F8C2C2] p-3 text-[12.5px] font-bold text-[#9F1D1D]">
              {slotsError}
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-[14px] bg-white/85 border border-white p-4 text-center text-[12.5px] font-semibold text-[#425478]">
              No open slots are available for the selected date. Please choose another day.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isPicked = selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelectSlot?.(slot)}
                    className={`rounded-[13px] px-3 py-2.5 text-left ${
                      isPicked
                        ? 'neu-blue-btn text-white'
                        : !slot.available
                          ? 'bg-[#EAF1FA] text-[#90A4C0] border border-[#D7E3F3] cursor-not-allowed'
                          : 'bg-white/85 border border-white text-[#0E1B3B] hover:bg-[#EBF4FF] shadow-[0_2px_6px_rgba(140,174,216,0.18)] neu-press-surface'
                    }`}
                  >
                    <span className="block text-[13px] font-extrabold tabular-nums">
                      {slot.startTime}
                    </span>
                    <span
                      className={`block text-[10.5px] font-semibold mt-0.5 ${
                        isPicked
                          ? 'text-white/90'
                          : !slot.available
                            ? 'text-[#90A4C0]'
                            : 'text-[#425478]'
                      }`}
                    >
                      {slot.available ? `Ends ${slot.endTime}` : slot.reason ?? 'Unavailable'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
