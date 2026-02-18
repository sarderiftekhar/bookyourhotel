"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Calendar, Users } from "lucide-react";
import { formatCurrency, formatDate, getNightsCount } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface PriceBreakdownProps {
  hotelName: string;
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalRate: number;
  cancellationPolicy: string;
  roomImage: string;
}

export default function PriceBreakdown({
  hotelName,
  roomName,
  boardName,
  checkIn,
  checkOut,
  currency,
  totalRate,
  cancellationPolicy,
  roomImage,
}: PriceBreakdownProps) {
  const t = useTranslations("booking");
  const nights = getNightsCount(checkIn, checkOut);
  const perNight = totalRate / (nights || 1);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-24">
      {/* Room Image */}
      {roomImage && (
        <div className="relative h-40">
          <Image
            src={roomImage}
            alt={roomName}
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <h3
            className="font-bold text-text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {hotelName}
          </h3>
          <p className="text-sm text-text-muted">{roomName}</p>
          {boardName && (
            <Badge className="mt-2">{boardName}</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-accent" />
            {formatDate(checkIn, "MMM dd")} — {formatDate(checkOut, "MMM dd")}
          </div>
          <span className="text-text-muted">
            ({nights} night{nights !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <h4 className="text-sm font-medium text-text-primary">{t("priceSummary")}</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {t("roomRate")} x {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="text-text-primary">
              {formatCurrency(perNight * nights, currency)}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-base font-bold text-text-primary">{t("total")}</span>
          <span className="text-xl font-bold text-accent">
            {formatCurrency(totalRate, currency)}
          </span>
        </div>

        {/* Cancellation Policy */}
        <div className="pt-2">
          <p className="text-xs text-text-muted">{t("cancellationPolicy")}:</p>
          <Badge
            variant={
              cancellationPolicy === "FREE_CANCELLATION" || cancellationPolicy === "REFUNDABLE"
                ? "success"
                : "warning"
            }
            className="mt-1"
          >
            {cancellationPolicy === "FREE_CANCELLATION" || cancellationPolicy === "REFUNDABLE"
              ? "Free Cancellation"
              : "Non-Refundable"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
