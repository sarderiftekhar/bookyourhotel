import { NextRequest, NextResponse } from "next/server";
import { getBooking, getHotelDetails } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, lastName } = await request.json();

    if (!bookingId || !lastName) {
      return NextResponse.json(
        { error: "Booking ID and last name are required" },
        { status: 400 }
      );
    }

    const result = await getBooking(bookingId.trim());

    if (!result?.data) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify last name matches (case-insensitive)
    const booking = result.data as Record<string, unknown>;
    const bookingLastName = booking.lastName as string;
    if (
      !bookingLastName ||
      bookingLastName.toLowerCase().trim() !== lastName.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Fetch hotel details for location, address, contact info
    const hotelId = booking.hotelId as string | undefined;
    if (hotelId) {
      try {
        const hotelResult = await getHotelDetails(hotelId);
        if (hotelResult?.data) {
          const hotel = hotelResult.data as Record<string, unknown>;
          booking.hotelAddress = hotel.address;
          booking.hotelCity = hotel.city;
          booking.hotelCountry = hotel.country;
          booking.hotelPhone = hotel.telephone || hotel.phone;
          booking.hotelEmail = hotel.email;
          booking.hotelStarRating = hotel.starRating;
          booking.hotelLatitude = hotel.latitude;
          booking.hotelLongitude = hotel.longitude;
        }
      } catch (e) {
        console.warn("Failed to fetch hotel details for booking:", e);
        // Non-blocking — continue with booking data
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking lookup error:", error);
    return NextResponse.json(
      { error: "Failed to look up booking" },
      { status: 500 }
    );
  }
}
