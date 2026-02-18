"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookingSummary from "@/components/booking/BookingSummary";
import Spinner from "@/components/ui/Spinner";

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/booking/${bookingId}`);
        const data = await res.json();
        if (data.data) {
          setBooking(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookingSummary
          bookingId={bookingId}
          hotelName={(booking?.hotelName as string) || "Hotel"}
          roomName={(booking?.roomName as string) || "Room"}
          checkIn={(booking?.checkIn as string) || ""}
          checkOut={(booking?.checkOut as string) || ""}
          guestName={`${(booking?.guestFirstName as string) || ""} ${(booking?.guestLastName as string) || ""}`.trim() || "Guest"}
          email={(booking?.guestEmail as string) || ""}
          currency={(booking?.currency as string) || "USD"}
          totalRate={(booking?.totalRate as number) || 0}
          hotelConfirmationCode={booking?.hotelConfirmationCode as string | undefined}
        />
      </div>
    </div>
  );
}
