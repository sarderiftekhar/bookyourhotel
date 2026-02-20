"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Elements } from "@stripe/react-stripe-js";
import { useBookingStore } from "@/store/bookingStore";
import { getStripe } from "@/lib/stripe";
import GuestForm from "@/components/booking/GuestForm";
import PaymentForm from "@/components/booking/PaymentForm";
import PriceBreakdown from "@/components/booking/PriceBreakdown";
import Button from "@/components/ui/Button";
import { ArrowLeft, Check } from "lucide-react";
import { GuestInfo } from "@/types/booking";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

type Step = "guest" | "payment";

export default function CheckoutPage() {
  const t = useTranslations("booking");
  const router = useRouter();
  const booking = useBookingStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState<Step>("guest");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prebook data
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [prebookId, setPrebookId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Redirect if no room selected
  if (!booking.offerId) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">No room selected. Please search for a hotel first.</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof GuestInfo, string>> = {};
    if (!guestInfo.firstName.trim()) newErrors.firstName = "Required";
    if (!guestInfo.lastName.trim()) newErrors.lastName = "Required";
    if (!guestInfo.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email))
      newErrors.email = "Invalid email";
    if (!guestInfo.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleProceedToPayment() {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      // Prebook to get payment details
      const prebookRes = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: booking.offerId }),
      });

      const prebookData = await prebookRes.json();

      if (!prebookRes.ok || !prebookData.data) {
        throw new Error(prebookData.error || "Failed to prepare booking");
      }

      const id = prebookData.data.prebookId || prebookData.data.id;
      const secret = prebookData.data.secretKey;
      const txnId = prebookData.data.transactionId;

      if (!secret) {
        throw new Error("Payment setup failed. Please try again.");
      }

      setPrebookId(id);
      setClientSecret(secret);
      setTransactionId(txnId);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSuccess() {
    // Payment confirmed via Stripe, now finalize booking
    setError(null);

    try {
      const bookRes = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prebookId,
          transactionId,
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email,
          specialRequests: guestInfo.specialRequests,
        }),
      });

      const bookData = await bookRes.json();

      if (!bookRes.ok || !bookData.data) {
        throw new Error(bookData.error || "Booking failed");
      }

      const bookingId = bookData.data.bookingId || bookData.data.id;

      // Save to booking history if logged in
      if (user) {
        try {
          const supabase = createClient();
          await supabase.from("booking_history").insert({
            user_id: user.id,
            liteapi_booking_id: bookingId,
            hotel_id: booking.hotelId,
            hotel_name: booking.hotelName,
            hotel_image: booking.roomImage,
            room_name: booking.roomName,
            check_in: booking.checkIn,
            check_out: booking.checkOut,
            currency: booking.currency,
            total_rate: booking.totalRate,
            status: "confirmed",
            guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            guest_email: guestInfo.email,
          });
        } catch {
          // Don't block booking confirmation if history save fails
        }
      }

      // Navigate to confirmation
      router.push(`/booking/${bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => {
            if (step === "payment") {
              setStep("guest");
              setClientSecret(null);
            } else {
              router.back();
            }
          }}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-6"
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
                />

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

            {step === "payment" && clientSecret && (
              <Elements
                stripe={getStripe()}
                options={{ clientSecret }}
              >
                <PaymentForm
                  clientSecret={clientSecret}
                  onPaymentSuccess={handlePaymentSuccess}
                  loading={loading}
                  setLoading={setLoading}
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
                    {error}
                  </div>
                )}
              </Elements>
            )}
          </div>

          {/* Right: Price Breakdown */}
          <div>
            <PriceBreakdown
              hotelName={booking.hotelName}
              roomName={booking.roomName}
              boardName={booking.boardName}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              currency={booking.currency}
              totalRate={booking.totalRate}
              cancellationPolicy={booking.cancellationPolicy}
              roomImage={booking.roomImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
