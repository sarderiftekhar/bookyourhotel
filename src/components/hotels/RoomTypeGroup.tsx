"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Users, Check, X, Bed } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

interface RoomTypeGroupProps {
  roomName: string;
  rates: RoomData[];
  fallbackImages: string[];
  onSelectRoom: (offerId: string) => void;
}

export default function RoomTypeGroup({
  roomName,
  rates,
  fallbackImages,
  onSelectRoom,
}: RoomTypeGroupProps) {
  const t = useTranslations("hotel");
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const images = rates[0]?.images?.length ? rates[0].images : fallbackImages.slice(0, 3);
  const hasMultipleImages = images.length > 1;
  const maxOccupancy = rates[0]?.maxOccupancy;

  // Deduplicate rates — group identical boardName + cancellation + price
  const uniqueRates = deduplicateRates(rates);
  const visibleRates = expanded ? uniqueRates : uniqueRates.slice(0, 3);
  const hasMore = uniqueRates.length > 3;

  // Best (lowest) price for the header
  const bestRate = rates.reduce((min, r) => (r.retailRate < min.retailRate ? r : min), rates[0]);
  const bestDiscount =
    bestRate.originalRate && bestRate.originalRate > bestRate.retailRate
      ? Math.round((1 - bestRate.retailRate / bestRate.originalRate) * 100)
      : 0;

  function prevImage() {
    setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage() {
    setImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header: image + room info side by side */}
      <div className="flex flex-col sm:flex-row">
        {/* Image — fixed aspect ratio, not stretching */}
        <div className="sm:w-56 md:w-64 shrink-0 relative">
          <div className="aspect-[4/3] relative overflow-hidden bg-bg-cream">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]}
                alt={roomName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                <Bed size={24} className="text-text-muted/40" />
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded">
                  {imgIdx + 1}/{images.length}
                </div>
              </>
            )}

            {bestDiscount > 0 && (
              <div className="absolute top-2 left-2 text-xs font-bold text-white bg-success px-2 py-0.5 rounded">
                {bestDiscount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Room info header */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
          <h3
            className="text-base font-bold text-text-primary mb-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {roomName}
          </h3>
          <div className="flex items-center flex-wrap gap-3 text-xs text-text-muted">
            {maxOccupancy && (
              <span className="flex items-center gap-1">
                <Users size={13} />
                {t("maxGuests", { count: maxOccupancy })}
              </span>
            )}
          </div>

          {/* Quick price preview */}
          <div className="mt-3 flex items-end gap-2">
            <span className="text-xs text-text-muted">{t("from")}</span>
            <span className="text-xl font-bold text-text-primary leading-none">
              {formatCurrency(bestRate.retailRate, bestRate.currency)}
            </span>
            <span className="text-xs text-text-muted">{t("perNight")}</span>
          </div>
        </div>
      </div>

      {/* Rate options — clean table-style rows below the header */}
      <div className="border-t border-border">
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 gap-y-0 text-xs text-text-muted px-4 sm:px-5 py-2 bg-bg-cream/60 font-medium uppercase tracking-wide">
          <span>Option</span>
          <span className="hidden sm:block">Policy</span>
          <span className="text-right">Price</span>
          <span></span>
        </div>

        {visibleRates.map((rate, idx) => {
          const isRefundable =
            rate.cancellationPolicy?.refundableTag !== "NON_REFUNDABLE" &&
            rate.cancellationPolicy?.refundableTag !== undefined;
          const discount =
            rate.originalRate && rate.originalRate > rate.retailRate
              ? Math.round((1 - rate.retailRate / rate.originalRate) * 100)
              : 0;

          return (
            <div
              key={rate.offerId || idx}
              className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-4 sm:px-5 py-3 ${
                idx < visibleRates.length - 1 ? "border-b border-border/50" : ""
              } hover:bg-bg-cream/30 transition-colors`}
            >
              {/* Board type */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{rate.boardName}</p>
                {/* Show cancellation on mobile (hidden on sm+) */}
                <div className="sm:hidden mt-0.5">
                  {isRefundable ? (
                    <span className="flex items-center gap-1 text-xs text-success font-medium">
                      <Check size={11} />
                      {t("freeCancellation")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <X size={11} />
                      {t("nonRefundable")}
                    </span>
                  )}
                </div>
              </div>

              {/* Cancellation policy — desktop */}
              <div className="hidden sm:block shrink-0">
                {isRefundable ? (
                  <span className="flex items-center gap-1 text-xs text-success font-medium">
                    <Check size={12} />
                    {t("freeCancellation")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <X size={12} />
                    {t("nonRefundable")}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                {discount > 0 && (
                  <span className="text-[11px] text-text-muted line-through mr-1">
                    {formatCurrency(rate.originalRate!, rate.currency)}
                  </span>
                )}
                <p className="text-base font-bold text-text-primary">
                  {formatCurrency(rate.retailRate, rate.currency)}
                </p>
                <p className="text-[10px] text-text-muted">{t("includesTaxes")}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelectRoom(rate.offerId)}
                className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {t("chooseRoom")}
              </button>
            </div>
          );
        })}

        {/* Show more / less toggle */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer border-t border-border/50"
          >
            {expanded
              ? t("showLess")
              : `+${uniqueRates.length - 3} more options`}
          </button>
        )}
      </div>
    </div>
  );
}

/** Deduplicate rates with identical boardName + cancellation + price */
function deduplicateRates(rates: RoomData[]): RoomData[] {
  const seen = new Set<string>();
  const result: RoomData[] = [];

  for (const rate of rates) {
    const key = `${rate.boardName}|${rate.cancellationPolicy?.refundableTag}|${rate.retailRate}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(rate);
    }
  }

  // Sort by price ascending
  result.sort((a, b) => a.retailRate - b.retailRate);
  return result;
}
