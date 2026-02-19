"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, Users, Search, Loader2, Minus, Plus } from "lucide-react";
import { formatDate, getNightsCount } from "@/lib/utils";
import RoomTypeGroup from "./RoomTypeGroup";

interface RoomData {
  offerId: string;
  roomName: string;
  boardName: string;
  currency: string;
  retailRate: number;
  originalRate?: number;
  maxOccupancy?: number;
  images?: string[];
  cancellationPolicy?: {
    refundableTag?: string;
  };
}

interface RoomSectionProps {
  rooms: RoomData[];
  hotelImages: string[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  hotelName?: string;
  onSelectRoom: (offerId: string) => void;
  onSearchChange?: (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }) => Promise<void>;
}

export default function RoomSection({
  rooms,
  hotelImages,
  checkIn,
  checkOut,
  adults,
  children,
  hotelName,
  onSelectRoom,
  onSearchChange,
}: RoomSectionProps) {
  const t = useTranslations("hotel");
  const [breakfastFilter, setBreakfastFilter] = useState(false);
  const [cancellationFilter, setCancellationFilter] = useState(false);

  // Local form state
  const [formCheckIn, setFormCheckIn] = useState(checkIn);
  const [formCheckOut, setFormCheckOut] = useState(checkOut);
  const [formAdults, setFormAdults] = useState(adults);
  const [formChildren, setFormChildren] = useState(children);
  const [searching, setSearching] = useState(false);

  const nights = getNightsCount(checkIn, checkOut);

  // Group rooms by name
  const grouped = useMemo(() => {
    let filtered = [...rooms];

    if (breakfastFilter) {
      filtered = filtered.filter(
        (r) =>
          r.boardName.toLowerCase().includes("breakfast") ||
          r.boardName.toLowerCase().includes("bb")
      );
    }

    if (cancellationFilter) {
      filtered = filtered.filter(
        (r) =>
          r.cancellationPolicy?.refundableTag !== "NON_REFUNDABLE" &&
          r.cancellationPolicy?.refundableTag !== undefined
      );
    }

    const map = new Map<string, RoomData[]>();
    filtered.forEach((room) => {
      const key = room.roomName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(room);
    });

    return Array.from(map.entries());
  }, [rooms, breakfastFilter, cancellationFilter]);

  async function handleSearch() {
    if (!onSearchChange || searching) return;
    setSearching(true);
    try {
      await onSearchChange({
        checkIn: formCheckIn,
        checkOut: formCheckOut,
        adults: formAdults,
        children: formChildren,
      });
    } finally {
      setSearching(false);
    }
  }

  // Get today's date as min for date inputs
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2
        className="text-xl font-bold text-text-primary mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("chooseYourRoom")}
      </h2>

      {/* Inline search form */}
      <div className="mb-5 p-5 bg-bg-cream/80 rounded-xl border border-border/40">
        {hotelName && (
          <p className="text-sm text-text-secondary mb-4">
            {t("whenWouldYouStay", { name: hotelName })}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          {/* Check-in */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              {t("checkInDate")}
            </label>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="date"
                value={formCheckIn}
                min={today}
                onChange={(e) => {
                  setFormCheckIn(e.target.value);
                  // If check-out is before new check-in, auto-advance
                  if (e.target.value >= formCheckOut) {
                    const next = new Date(e.target.value);
                    next.setDate(next.getDate() + 1);
                    setFormCheckOut(next.toISOString().split("T")[0]);
                  }
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm text-text-primary bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              {t("checkOutDate")}
            </label>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="date"
                value={formCheckOut}
                min={formCheckIn > today ? formCheckIn : today}
                onChange={(e) => setFormCheckOut(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm text-text-primary bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Adults */}
          <div className="sm:w-32">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              {t("adultsLabel")}
            </label>
            <div className="flex items-center gap-0 bg-white border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setFormAdults((v) => Math.max(1, v - 1))}
                className="p-2.5 hover:bg-bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={formAdults <= 1}
              >
                <Minus size={14} className="text-text-secondary" />
              </button>
              <span className="flex-1 text-center text-sm font-medium text-text-primary">
                {formAdults}
              </span>
              <button
                onClick={() => setFormAdults((v) => Math.min(9, v + 1))}
                className="p-2.5 hover:bg-bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={formAdults >= 9}
              >
                <Plus size={14} className="text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="sm:w-32">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              {t("childrenLabel")}
            </label>
            <div className="flex items-center gap-0 bg-white border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setFormChildren((v) => Math.max(0, v - 1))}
                className="p-2.5 hover:bg-bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={formChildren <= 0}
              >
                <Minus size={14} className="text-text-secondary" />
              </button>
              <span className="flex-1 text-center text-sm font-medium text-text-primary">
                {formChildren}
              </span>
              <button
                onClick={() => setFormChildren((v) => Math.min(6, v + 1))}
                className="p-2.5 hover:bg-bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={formChildren >= 6}
              >
                <Plus size={14} className="text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={searching || !formCheckIn || !formCheckOut || formCheckIn >= formCheckOut}
            className="sm:w-auto px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            {searching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {t("checkAvailability")}
          </button>
        </div>

        {/* Current selection summary */}
        {nights > 0 && (
          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border/30 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} className="text-accent" />
              {formatDate(checkIn, "MMM dd")} — {formatDate(checkOut, "MMM dd")}
              <span className="text-text-muted">
                ({nights} night{nights !== 1 ? "s" : ""})
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-accent" />
              {adults} adult{adults !== 1 ? "s" : ""}
              {children > 0 && `, ${children} child${children !== 1 ? "ren" : ""}`}
            </span>
          </div>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setBreakfastFilter(!breakfastFilter)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border ${
            breakfastFilter
              ? "bg-accent text-white border-accent"
              : "bg-white text-text-secondary border-border hover:border-accent/30"
          }`}
        >
          {t("breakfastIncluded")}
        </button>
        <button
          onClick={() => setCancellationFilter(!cancellationFilter)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border ${
            cancellationFilter
              ? "bg-accent text-white border-accent"
              : "bg-white text-text-secondary border-border hover:border-accent/30"
          }`}
        >
          {t("freeCancellationFilter")}
        </button>
      </div>

      {/* Room groups */}
      {searching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-accent" />
        </div>
      ) : grouped.length > 0 ? (
        <div className="space-y-4">
          {grouped.map(([name, rates]) => (
            <RoomTypeGroup
              key={name}
              roomName={name}
              rates={rates}
              fallbackImages={hotelImages}
              onSelectRoom={onSelectRoom}
            />
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <p className="text-text-muted text-center py-8">
          {t("noRoomsMatchFilter")}
        </p>
      ) : (
        <p className="text-text-muted text-center py-8">
          {t("noRoomsAvailable")}
        </p>
      )}
    </div>
  );
}
