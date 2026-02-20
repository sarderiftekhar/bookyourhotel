"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  parseISO,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  isToday,
} from "date-fns";

interface DatePickerProps {
  value: string; // yyyy-MM-dd
  onChange: (date: string) => void;
  min?: string; // yyyy-MM-dd
  label?: string;
  /** Whether the trigger sits on a dark background */
  dark?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  min,
  label,
  dark,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(value ? parseISO(value) : new Date())
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedDate = useMemo(
    () => (value ? parseISO(value) : null),
    [value]
  );
  const minDate = useMemo(
    () => (min ? parseISO(min) : new Date()),
    [min]
  );
  const today = useMemo(() => new Date(), []);

  // Close on click-outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync viewMonth when value changes externally
  useEffect(() => {
    if (value) {
      setViewMonth(startOfMonth(parseISO(value)));
    }
  }, [value]);

  function handleDayClick(day: Date) {
    onChange(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  }

  const prevMonth = useCallback(() => {
    const prev = addMonths(viewMonth, -1);
    if (!isBefore(endOfMonth(prev), minDate)) {
      setViewMonth(prev);
    }
  }, [viewMonth, minDate]);

  const nextMonth = useCallback(() => {
    setViewMonth(addMonths(viewMonth, 1));
  }, [viewMonth]);

  const displayValue = selectedDate
    ? format(selectedDate, "MMM dd, yyyy")
    : "";

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors cursor-pointer text-left ${
          dark
            ? "bg-white border border-white/20 text-text-primary hover:border-white/40"
            : "bg-white border border-border text-text-primary hover:border-accent/30"
        }`}
      >
        <CalendarDays
          size={15}
          className="text-text-muted shrink-0"
        />
        <span className={!value ? "text-text-muted" : ""}>
          {displayValue || "Select date"}
        </span>
      </button>

      {/* Dropdown calendar */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="sm:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 pb-8 sm:absolute sm:inset-auto sm:top-full sm:mt-1.5 sm:rounded-xl sm:shadow-xl sm:border sm:border-border sm:p-4 sm:w-[310px] sm:left-0 sm:pb-4">
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 rounded-full hover:bg-bg-cream flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} className="text-text-secondary" />
              </button>
              <h3 className="text-sm font-bold text-text-primary">
                {format(viewMonth, "MMMM yyyy")}
              </h3>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-bg-cream flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={18} className="text-text-secondary" />
              </button>
            </div>

            {/* Calendar grid */}
            <CalendarGrid
              month={viewMonth}
              selectedDate={selectedDate}
              minDate={minDate}
              today={today}
              onDayClick={handleDayClick}
            />
          </div>
        </>
      )}
    </div>
  );
}

function CalendarGrid({
  month,
  selectedDate,
  minDate,
  today,
  onDayClick,
}: {
  month: Date;
  selectedDate: Date | null;
  minDate: Date;
  today: Date;
  onDayClick: (day: Date) => void;
}) {
  const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [month]);

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-text-muted py-1.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            const inMonth = isSameMonth(day, month);
            const isPast =
              (isBefore(day, today) && !isToday(day)) ||
              (isBefore(day, minDate) && !isSameDay(day, minDate));
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;
            const isTodayDay = isToday(day);

            if (!inMonth) {
              return <div key={di} className="h-10" />;
            }

            return (
              <button
                key={di}
                type="button"
                onClick={() => !isPast && onDayClick(day)}
                disabled={isPast}
                className={`h-10 w-full text-sm flex items-center justify-center transition-all cursor-pointer rounded-full
                  ${isPast ? "text-text-muted/30 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-accent text-white font-bold shadow-sm" : ""}
                  ${!isSelected && !isPast ? "hover:bg-accent/10" : ""}
                  ${isTodayDay && !isSelected ? "font-bold text-accent ring-1 ring-accent/30" : ""}
                `}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
