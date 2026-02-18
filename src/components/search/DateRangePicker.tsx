"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format, parseISO, addDays } from "date-fns";
import { useSearchStore } from "@/store/searchStore";

export default function DateRangePicker() {
  const { checkIn, checkOut, setDates } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");

  function handleCheckInChange(value: string) {
    const newCheckIn = value;
    const checkOutDate = parseISO(checkOut);
    const newCheckInDate = parseISO(newCheckIn);

    if (newCheckInDate >= checkOutDate) {
      const newCheckOut = format(addDays(newCheckInDate, 1), "yyyy-MM-dd");
      setDates(newCheckIn, newCheckOut);
    } else {
      setDates(newCheckIn, checkOut);
    }
  }

  function handleCheckOutChange(value: string) {
    setDates(checkIn, value);
  }

  const displayCheckIn = format(parseISO(checkIn), "MMM dd");
  const displayCheckOut = format(parseISO(checkOut), "MMM dd");

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-card text-text-primary hover:border-accent/50 transition-colors text-left"
      >
        <Calendar size={16} className="text-text-muted shrink-0" />
        <span>
          {displayCheckIn} — {displayCheckOut}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 bg-white rounded-lg shadow-lg border border-border p-4 w-72">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={format(addDays(parseISO(checkIn), 1), "yyyy-MM-dd")}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
