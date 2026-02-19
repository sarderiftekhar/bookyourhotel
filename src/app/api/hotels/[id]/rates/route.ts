import { NextRequest, NextResponse } from "next/server";
import { searchHotelRates } from "@/lib/liteapi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sp = request.nextUrl.searchParams;

  const checkIn = sp.get("checkIn");
  const checkOut = sp.get("checkOut");
  const adults = parseInt(sp.get("adults") || "2", 10);
  const children = parseInt(sp.get("children") || "0", 10);
  const currency = sp.get("currency") || "USD";

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn and checkOut are required" },
      { status: 400 }
    );
  }

  try {
    const result = await searchHotelRates({
      checkin: checkIn,
      checkout: checkOut,
      adults,
      currency,
      guestNationality: "US",
      hotelIds: [id],
      occupancies: [{ adults, children: children > 0 ? Array(children).fill(8) : undefined }],
      timeout: 10,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Hotel rates error:", error);
    return NextResponse.json(
      { error: "Failed to get hotel rates" },
      { status: 500 }
    );
  }
}
