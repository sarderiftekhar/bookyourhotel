"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Users, Coffee, BedDouble, ShieldCheck, ShieldX, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RoomCardProps {
  room: {
    offerId: string;
    roomName: string;
    boardName: string;
    currency: string;
    retailRate: number;
    maxOccupancy?: number;
    images?: string[];
    cancellationPolicy?: {
      refundableTag?: string;
    };
  };
  onSelect: (offerId: string) => void;
}

export default function RoomCard({ room, onSelect }: RoomCardProps) {
  const t = useTranslations("hotel");
  const isRefundable = room.cancellationPolicy?.refundableTag === "FREE_CANCELLATION" ||
    room.cancellationPolicy?.refundableTag === "REFUNDABLE";
  const hasImage = room.images && room.images[0];

  return (
    <div className="group bg-white rounded-xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Room Image */}
        {hasImage ? (
          <div className="relative w-full sm:w-52 h-44 sm:h-auto shrink-0">
            <Image
              src={room.images![0]}
              alt={room.roomName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          </div>
        ) : (
          <div className="hidden sm:flex w-14 shrink-0 items-center justify-center bg-accent/4 border-r border-border/50">
            <BedDouble size={22} className="text-accent/25" />
          </div>
        )}

        {/* Room Details */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          <div className="flex-1">
            {/* Room name */}
            <h4
              className="text-base font-bold text-text-primary mb-2.5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {room.roomName}
            </h4>

            {/* Features row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-secondary">
              {room.maxOccupancy && (
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-text-muted" />
                  {room.maxOccupancy} guest{room.maxOccupancy !== 1 ? "s" : ""}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Coffee size={14} className="text-text-muted" />
                {room.boardName || "Room Only"}
              </span>
            </div>

            {/* Cancellation badge */}
            <div className="mt-3">
              {isRefundable ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-green-50 px-2.5 py-1 rounded-full">
                  <ShieldCheck size={12} />
                  {t("freeCancellation")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning bg-amber-50 px-2.5 py-1 rounded-full">
                  <ShieldX size={12} />
                  {t("nonRefundable")}
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA row */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/40">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text-primary">
                  {formatCurrency(room.retailRate, room.currency)}
                </span>
                <span className="text-sm text-text-muted">/ night</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">includes taxes & fees</p>
            </div>
            <button
              onClick={() => onSelect(room.offerId)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-hover transition-all duration-200 cursor-pointer active:scale-95"
            >
              {t("selectRoom")}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
