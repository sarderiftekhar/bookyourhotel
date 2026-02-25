"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Printer, Home } from "lucide-react";
import { formatCurrency, formatDate, isRefundablePolicy } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface BookingSummaryProps {
  bookingId: string;
  hotelName: string;
  roomName: string;
  boardName?: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  email: string;
  phone?: string;
  currency: string;
  totalRate: number;
  hotelConfirmationCode?: string;
  cancellationPolicy?: string;
  guests?: number;
}

export default function BookingSummary({
  bookingId,
  hotelName,
  roomName,
  boardName,
  checkIn,
  checkOut,
  guestName,
  email,
  phone,
  currency,
  totalRate,
  hotelConfirmationCode,
  cancellationPolicy,
  guests,
}: BookingSummaryProps) {
  const t = useTranslations("booking");
  const isFreeCancellation = isRefundablePolicy(cancellationPolicy);

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
          {boardName && (
            <div>
              <p className="text-xs text-text-muted">Board</p>
              <p className="font-medium text-text-primary">{boardName}</p>
            </div>
          )}
          {guests !== undefined && guests > 0 && (
            <div>
              <p className="text-xs text-text-muted">Guests</p>
              <p className="font-medium text-text-primary">{guests} guest{guests !== 1 ? "s" : ""}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-text-muted">Check-in</p>
            <p className="font-medium text-text-primary">{formatDate(checkIn, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Check-out</p>
            <p className="font-medium text-text-primary">{formatDate(checkOut, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Guest</p>
            <p className="font-medium text-text-primary">{guestName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Email</p>
            <p className="font-medium text-text-primary">{email}</p>
          </div>
          {phone && (
            <div>
              <p className="text-xs text-text-muted">Phone</p>
              <p className="font-medium text-text-primary">{phone}</p>
            </div>
          )}
          {cancellationPolicy && (
            <div>
              <p className="text-xs text-text-muted">Cancellation</p>
              <Badge variant={isFreeCancellation ? "success" : "warning"} className="mt-1">
                {isFreeCancellation ? "Free Cancellation" : "Non-Refundable"}
              </Badge>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="font-bold text-text-primary">{t("total")}</span>
          <span className="text-xl font-bold text-accent">
            {formatCurrency(totalRate, currency)}
          </span>
        </div>

        {/* Confirmation email notice */}
        <div className="border-t border-border pt-4">
          <p className="text-xs text-text-muted leading-relaxed">
            A confirmation email has been sent to <strong className="text-text-primary">{email}</strong>.
            Please present your booking confirmation and a valid photo ID at check-in.
          </p>
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
