"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus, ChevronDown } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

export default function GuestSelector() {
  const { adults, children, rooms, setGuests, setRooms } = useSearchStore();
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

  const summary = `${adults} adult${adults !== 1 ? "s" : ""} \u00B7 ${children} child${children !== 1 ? "ren" : ""} \u00B7 ${rooms} room${rooms !== 1 ? "s" : ""}`;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-3 text-sm bg-transparent text-text-primary text-left cursor-pointer"
      >
        <Users size={18} className="text-text-muted shrink-0" />
        <span className="truncate flex-1">{summary}</span>
        <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 bg-white rounded-xl shadow-xl border border-border p-5 w-72 right-0">
          <div className="space-y-5">
            <CounterRow
              label="Adults"
              value={adults}
              min={1}
              max={9}
              onChange={(v) => setGuests(v, children, [])}
            />
            <CounterRow
              label="Children"
              value={children}
              min={0}
              max={6}
              onChange={(v) => setGuests(adults, v, [])}
            />
            <CounterRow
              label="Rooms"
              value={rooms}
              min={1}
              max={9}
              onChange={(v) => setRooms(v)}
            />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-5 py-2.5 text-sm font-semibold text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function CounterRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <button
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
