"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Printer, Home } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import Button from "@/components/ui/Button";

interface BookingSummaryProps {
  bookingId: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email: string;
  currency: string;
  totalRate: number;
  hotelConfirmationCode?: string;
}

export default function BookingSummary({
  bookingId,
  hotelName,
  roomName,
  checkIn,
  checkOut,
  guestName,
  email,
  currency,
  totalRate,
  hotelConfirmationCode,
}: BookingSummaryProps) {
  const t = useTranslations("booking");

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <CheckCircle size={64} className="mx-auto text-success" />
      </div>

      <h1
        className="text-3xl font-bold text-text-primary mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("confirmationTitle")}
      </h1>
      <p className="text-text-secondary mb-8">{t("confirmationSubtitle")}</p>

      {/* Booking Details Card */}
      <div className="bg-white rounded-xl border border-border p-6 text-left space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">{t("bookingRef")}</p>
            <p className="font-bold text-accent text-lg">{bookingId}</p>
          </div>
          {hotelConfirmationCode && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">{t("hotelConfirmation")}</p>
              <p className="font-bold text-text-primary">{hotelConfirmationCode}</p>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted">Hotel</p>
            <p className="font-medium text-text-primary">{hotelName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Room</p>
            <p className="font-medium text-text-primary">{roomName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Check-in</p>
            <p className="font-medium text-text-primary">{formatDate(checkIn)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Check-out</p>
            <p className="font-medium text-text-primary">{formatDate(checkOut)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Guest</p>
            <p className="font-medium text-text-primary">{guestName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Email</p>
            <p className="font-medium text-text-primary">{email}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="font-bold text-text-primary">{t("total")}</span>
          <span className="text-xl font-bold text-accent">
            {formatCurrency(totalRate, currency)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer size={16} className="mr-2" />
          {t("printBooking")}
        </Button>
        <Link href="/">
          <Button>
            <Home size={16} className="mr-2" />
            {t("backToHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
