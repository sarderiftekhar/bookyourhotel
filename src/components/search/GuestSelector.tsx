"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { generateGuestSummary } from "@/lib/utils";

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

  const summary = generateGuestSummary(adults, children, rooms);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-card text-text-primary hover:border-accent/50 transition-colors text-left"
      >
        <Users size={16} className="text-text-muted shrink-0" />
        <span className="truncate">{summary}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 bg-white rounded-lg shadow-lg border border-border p-4 w-64 right-0">
          <div className="space-y-4">
            {/* Adults */}
            <CounterRow
              label="Adults"
              value={adults}
              min={1}
              max={9}
              onChange={(v) => setGuests(v, children, [])}
            />
            {/* Children */}
            <CounterRow
              label="Children"
              value={children}
              min={0}
              max={6}
              onChange={(v) => setGuests(adults, v, [])}
            />
            {/* Rooms */}
            <CounterRow
              label="Rooms"
              value={rooms}
              min={1}
              max={9}
              onChange={(v) => setRooms(v)}
            />
          </div>
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
      <span className="text-sm text-text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
