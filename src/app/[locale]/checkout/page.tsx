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
import { ArrowLeft } from "lucide-react";
import { GuestInfo } from "@/types/booking";

export default function CheckoutPage() {
  const t = useTranslations("booking");
  const router = useRouter();
  const booking = useBookingStore();

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

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Prebook
      const prebookRes = await fetch("/api/booking/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: booking.offerId }),
      });

      const prebookData = await prebookRes.json();

      if (!prebookRes.ok || !prebookData.data) {
        throw new Error(prebookData.error || "Prebook failed");
      }

      const prebookId = prebookData.data.prebookId || prebookData.data.id;

      // Step 2: Book
      const bookRes = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prebookId,
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          specialRequests: guestInfo.specialRequests,
        }),
      });

      const bookData = await bookRes.json();

      if (!bookRes.ok || !bookData.data) {
        throw new Error(bookData.error || "Booking failed");
      }

      const bookingId = bookData.data.bookingId || bookData.data.id;

      // Navigate to confirmation
      router.push(`/booking/${bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            <GuestForm
              guestInfo={guestInfo}
              onChange={setGuestInfo}
              errors={errors}
            />

            <Elements stripe={getStripe()}>
              <PaymentForm />
            </Elements>

            {error && (
              <div className="p-4 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              loading={loading}
              size="lg"
              className="w-full"
            >
              {loading ? t("processing") : t("bookNow")}
            </Button>
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
