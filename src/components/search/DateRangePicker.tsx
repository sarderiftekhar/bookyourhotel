"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO, addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isBefore, isAfter, isToday } from "date-fns";
import { useSearchStore } from "@/store/searchStore";

export default function DateRangePicker() {
  const { checkIn, checkOut, setDates } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(parseISO(checkIn)));
  const wrapperRef = useRef<HTMLDivElement>(null);

  const checkInDate = useMemo(() => parseISO(checkIn), [checkIn]);
  const checkOutDate = useMemo(() => parseISO(checkOut), [checkOut]);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDayClick(day: Date) {
    if (isBefore(day, today) && !isToday(day)) return;

    if (selecting === "checkIn") {
      const newCheckIn = format(day, "yyyy-MM-dd");
      // If new check-in is after current check-out, auto set check-out to next day
      if (!isBefore(day, checkOutDate)) {
        setDates(newCheckIn, format(addDays(day, 1), "yyyy-MM-dd"));
      } else {
        setDates(newCheckIn, checkOut);
      }
      setSelecting("checkOut");
    } else {
      // Check-out must be after check-in
      if (!isAfter(day, checkInDate)) {
        // Treat as new check-in selection
        setDates(format(day, "yyyy-MM-dd"), format(addDays(day, 1), "yyyy-MM-dd"));
        setSelecting("checkOut");
      } else {
        setDates(checkIn, format(day, "yyyy-MM-dd"));
        setSelecting("checkIn");
        setIsOpen(false);
      }
    }
  }

  function prevMonth() {
    const prev = addMonths(viewMonth, -1);
    if (!isBefore(prev, startOfMonth(today))) {
      setViewMonth(prev);
    }
  }

  function nextMonth() {
    setViewMonth(addMonths(viewMonth, 1));
  }

  const month1 = viewMonth;
  const month2 = addMonths(viewMonth, 1);

  const displayCheckIn = format(checkInDate, "MMM dd");
  const displayCheckOut = format(checkOutDate, "MMM dd");

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); setSelecting("checkIn"); }}
        className="w-full flex items-center gap-2 px-3 py-3 text-sm bg-transparent text-text-primary text-left cursor-pointer"
      >
        <Calendar size={18} className="text-text-muted shrink-0" />
        <span className={checkIn ? "text-text-primary" : "text-text-muted"}>
          {displayCheckIn} — {displayCheckOut}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Mobile: full-screen overlay */}
          <div className="sm:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 pb-8 sm:absolute sm:inset-auto sm:top-full sm:mt-1 sm:rounded-xl sm:shadow-xl sm:border sm:border-border sm:p-5 sm:w-[620px] sm:left-1/2 sm:-translate-x-1/2 sm:pb-5">
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header with month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full hover:bg-bg-cream flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} className="text-text-secondary" />
              </button>
              <div className="flex gap-12 sm:gap-24">
                <h3 className="text-sm font-bold text-text-primary">
                  {format(month1, "MMMM yyyy")}
                </h3>
                <h3 className="hidden sm:block text-sm font-bold text-text-primary">
                  {format(month2, "MMMM yyyy")}
                </h3>
              </div>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-bg-cream flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={18} className="text-text-secondary" />
              </button>
            </div>

            <div className="flex gap-6">
              <MonthGrid
                month={month1}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                today={today}
                onDayClick={handleDayClick}
              />
              <MonthGrid
                month={month2}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                today={today}
                onDayClick={handleDayClick}
                className="hidden sm:block"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MonthGrid({
  month,
  checkInDate,
  checkOutDate,
  today,
  onDayClick,
  className = "",
}: {
  month: Date;
  checkInDate: Date;
  checkOutDate: Date;
  today: Date;
  onDayClick: (day: Date) => void;
  className?: string;
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
    <div className={`flex-1 ${className}`}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            const inMonth = isSameMonth(day, month);
            const isPast = isBefore(day, today) && !isToday(day);
            const isCheckIn = isSameDay(day, checkInDate);
            const isCheckOut = isSameDay(day, checkOutDate);
            const isInRange = isAfter(day, checkInDate) && isBefore(day, checkOutDate);
            const isTodayDay = isToday(day);

            if (!inMonth) {
              return <div key={di} className="h-9" />;
            }

            return (
              <button
                key={di}
                onClick={() => !isPast && onDayClick(day)}
                disabled={isPast}
                className={`h-9 text-sm flex items-center justify-center transition-colors cursor-pointer relative
                  ${isPast ? "text-text-muted/30 cursor-not-allowed" : ""}
                  ${isCheckIn ? "bg-accent text-white rounded-l-full font-bold" : ""}
                  ${isCheckOut ? "bg-accent text-white rounded-r-full font-bold" : ""}
                  ${isInRange ? "bg-accent/10" : ""}
                  ${!isCheckIn && !isCheckOut && !isInRange && !isPast ? "hover:bg-bg-cream rounded-full" : ""}
                  ${isTodayDay && !isCheckIn && !isCheckOut ? "font-bold text-accent" : ""}
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
