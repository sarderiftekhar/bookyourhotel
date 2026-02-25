"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useBookingStore } from "@/store/bookingStore";
import { isRefundablePolicy } from "@/lib/utils";
import GuestForm from "@/components/booking/GuestForm";
import LiteAPIPaymentForm from "@/components/booking/LiteAPIPayment";
import PriceBreakdown from "@/components/booking/PriceBreakdown";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check, Loader2, CreditCard, Mail, FileCheck } from "lucide-react";
import { GuestInfo } from "@/types/booking";

type Step = "guest" | "payment";

// Map LiteAPI error codes and HTTP statuses to user-friendly messages
function getBookingErrorMessage(data: { code?: number; httpStatus?: number; error?: string }): string {
  if (data.code) {
    switch (data.code) {
      case 2001:
        return "This room is no longer available. The rate may have expired. Please go back and select a different room.";
      case 2002:
        return "Missing booking information. Please check your details and try again.";
      case 2003:
        return "An unexpected error occurred while processing your booking. Please try again.";
      case 2004:
        return "This booking has already been processed. Please check your email for confirmation.";
      case 2005:
        return "This booking has already been completed. Please check your email for confirmation.";
      case 2006:
        return "The booking could not be completed. Please try again or select a different room.";
      case 2007:
        return "There was a problem processing your payment. Please check your payment details and try again.";
      case 2008:
        return "The payment method is not supported. Please use a different payment method.";
      case 2009:
        return "The booking request has expired. Please start the checkout process again.";
      case 2010:
        return "Insufficient funds on the card. Please use a different payment method.";
      case 2011:
        return "The card was declined. Please use a different card or payment method.";
      case 2012:
        return "Payment verification failed. Please check your card details and try again.";
      case 2013:
        return "Your booking was rejected by our verification system. Please use a valid, non-disposable email address (e.g. Gmail, Outlook) and try again.";
      case 2014:
        return "The prebook session has expired. Please go back and select the room again.";
      case 4290:
        return "Too many requests. Please wait a moment and try again.";
    }
  }

  if (data.httpStatus) {
    switch (data.httpStatus) {
      case 400:
        return "Invalid booking details. Please check your information and try again.";
      case 401:
        return "Authentication error. Please refresh the page and try again.";
      case 403:
        return "Your booking was rejected by our verification system. Please ensure you are using a valid email address and try again.";
      case 404:
        return "The selected room or rate was not found. It may no longer be available.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "The booking service is temporarily unavailable. Please try again in a few minutes.";
    }
  }

  return data.error || "Something went wrong. Please try again.";
}

export default function CheckoutPage() {
  const t = useTranslations("booking");
  const router = useRouter();
  const pathname = usePathname();
  const booking = useBookingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [step, setStep] = useState<Step>("guest");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+44 ",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Prebook data
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [prebookId, setPrebookId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  if (!mounted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!booking.offerId) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">No room selected. Please search for a hotel first.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  const isNonRefundable = !isRefundablePolicy(booking.cancellationPolicy);

  const BLOCKED_EMAIL_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
    "yopmail.com", "sharklasers.com", "guerrillamailblock.com", "grr.la",
    "dispostable.com", "trashmail.com", "maildrop.cc", "fakeinbox.com",
    "tempail.com", "temp-mail.org", "minutemail.com", "discard.email",
    "mailnesia.com", "guerrillamail.info", "guerrillamail.net", "guerrillamail.de",
  ];

  function validate(): boolean {
    const newErrors: Partial<Record<keyof GuestInfo, string>> = {};
    if (!guestInfo.firstName.trim()) newErrors.firstName = "Required";
    if (!guestInfo.lastName.trim()) newErrors.lastName = "Required";
    if (!guestInfo.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email))
      newErrors.email = "Invalid email";
    else {
      const domain = guestInfo.email.split("@")[1]?.toLowerCase();
      if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
        newErrors.email = "Please use a real email address (disposable emails are not accepted)";
      }
    }
    // Extract just the local number part for validation
    const phoneLocal = guestInfo.phone.replace(/^\+\d{1,4}\s*/, "").trim();
    if (!phoneLocal) newErrors.phone = "Required";
    else {
      const digits = phoneLocal.replace(/\D/g, "");
      if (digits.length < 6) newErrors.phone = "Phone number is too short";
      else if (digits.length > 15) newErrors.phone = "Phone number is too long";
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions before proceeding.");
    } else {
      setError(null);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && agreedToTerms;
  }

  async function handleProceedToPayment() {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const prebookRes = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: booking.offerId }),
      });

      const prebookData = await prebookRes.json();

      if (!prebookRes.ok || !prebookData.data) {
        throw new Error(getBookingErrorMessage(prebookData));
      }

      const id = prebookData.data.prebookId || prebookData.data.id;

      // SANDBOX MODE: Book directly without payment form
      if (prebookData.isSandbox) {
        const bookRes = await fetch("/api/booking/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prebookId: id,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            email: guestInfo.email,
            phone: guestInfo.phone,
            specialRequests: guestInfo.specialRequests,
          }),
        });

        const bookData = await bookRes.json();

        if (!bookRes.ok || !bookData.data) {
          throw new Error(getBookingErrorMessage(bookData));
        }

        const bookingId = bookData.data.bookingId || bookData.data.id;
        router.push(`/booking/${bookingId}`);
        return;
      }

      // PRODUCTION MODE: Show payment form (LiteAPI Payment SDK)
      const secret = prebookData.data.secretKey;
      const txnId = prebookData.data.transactionId;

      if (!secret) {
        throw new Error("Payment setup failed. Please try again.");
      }

      sessionStorage.setItem("byh_guest_info", JSON.stringify({
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        email: guestInfo.email,
        phone: guestInfo.phone,
        specialRequests: guestInfo.specialRequests,
      }));

      setPrebookId(id);
      setSecretKey(secret);
      setTransactionId(txnId);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const returnUrl = typeof window !== "undefined"
    ? `${window.location.origin}${pathname.replace("/checkout", "/booking/confirm")}`
    : "";

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => {
            if (step === "payment") {
              setStep("guest");
              setSecretKey(null);
            } else {
              router.back();
            }
          }}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1
          className="text-3xl font-bold text-text-primary mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("checkout")}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-medium ${step === "guest" ? "text-accent" : "text-text-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "payment" ? "bg-accent text-white" : step === "guest" ? "bg-accent text-white" : "bg-border text-text-muted"
            }`}>
              {step === "payment" ? <Check size={14} /> : "1"}
            </span>
            {t("guestDetails")}
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 text-sm font-medium ${step === "payment" ? "text-accent" : "text-text-muted"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === "payment" ? "bg-accent text-white" : "bg-border text-text-muted"
            }`}>
              2
            </span>
            {t("paymentDetails")}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {step === "guest" && (
              <>
                <GuestForm
                  guestInfo={guestInfo}
                  onChange={setGuestInfo}
                  errors={errors}
                  isNonRefundable={isNonRefundable}
                />

                {/* What happens next */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-4">What happens next?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CreditCard size={16} className="text-accent" />
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        After entering your details, you&apos;ll be taken to our secure payment page to complete your booking.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail size={16} className="text-accent" />
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        You&apos;ll receive a booking confirmation email with your reservation details and hotel confirmation code.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck size={16} className="text-accent" />
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        Present your booking confirmation (printed or digital) and a valid photo ID at the hotel front desk during check-in.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked && error?.includes("Terms")) setError(null);
                      }}
                      className="mt-1.5 w-5 h-5 rounded border-border text-accent focus:ring-accent/30 accent-(--color-accent) cursor-pointer"
                    />
                    <span className="text-sm text-text-secondary leading-relaxed">
                      I have read and agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-accent hover:underline font-medium">
                        Terms & Conditions
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy" target="_blank" className="text-accent hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      . I understand that my personal data will be processed in accordance with the privacy policy.
                      {isNonRefundable && (
                        <span className="text-warning font-medium">
                          {" "}I acknowledge this booking is non-refundable.
                        </span>
                      )}
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleProceedToPayment}
                  loading={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? t("processing") : t("proceedToPayment")}
                </Button>
              </>
            )}

            {step === "payment" && secretKey && prebookId && transactionId && (
              <>
                <LiteAPIPaymentForm
                  secretKey={secretKey}
                  transactionId={transactionId}
                  prebookId={prebookId}
                  returnUrl={returnUrl}
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Price Breakdown */}
          <div>
            <PriceBreakdown
              hotelName={booking.hotelName}
              hotelAddress={booking.hotelAddress}
              hotelCity={booking.hotelCity}
              hotelCountry={booking.hotelCountry}
              hotelStarRating={booking.hotelStarRating}
              hotelFacilities={booking.hotelFacilities}
              roomName={booking.roomName}
              boardName={booking.boardName}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              currency={booking.currency}
              totalRate={booking.totalRate}
              cancellationPolicy={booking.cancellationPolicy}
              cancellationDeadline={booking.cancellationDeadline}
              checkinTime={booking.checkinTime}
              checkoutTime={booking.checkoutTime}
              roomImage={booking.roomImage}
              adults={booking.adults}
              children={booking.children}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
