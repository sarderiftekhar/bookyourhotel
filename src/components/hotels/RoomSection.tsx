"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, Users } from "lucide-react";
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
  onSelectRoom: (offerId: string) => void;
}

export default function RoomSection({
  rooms,
  hotelImages,
  checkIn,
  checkOut,
  adults,
  children,
  onSelectRoom,
}: RoomSectionProps) {
  const t = useTranslations("hotel");
  const [breakfastFilter, setBreakfastFilter] = useState(false);
  const [cancellationFilter, setCancellationFilter] = useState(false);

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

  return (
    <div>
      <h2
        className="text-xl font-bold text-text-primary mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("chooseYourRoom")}
      </h2>

      {/* Date / guest summary bar */}
      <div className="flex flex-wrap items-center gap-4 mb-5 p-4 bg-bg-cream rounded-xl text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <CalendarDays size={16} className="text-accent" />
          <span>
            {formatDate(checkIn, "MMM dd")} — {formatDate(checkOut, "MMM dd")}
          </span>
          <span className="text-text-muted">
            ({nights} night{nights !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Users size={16} className="text-accent" />
          <span>
            {adults} adult{adults !== 1 ? "s" : ""}
            {children > 0 && `, ${children} child${children !== 1 ? "ren" : ""}`}
          </span>
        </div>
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
      {grouped.length > 0 ? (
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
