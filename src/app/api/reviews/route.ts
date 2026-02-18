import { NextRequest, NextResponse } from "next/server";
import { getHotelReviews } from "@/lib/liteapi";

export async function GET(request: NextRequest) {
  const hotelId = request.nextUrl.searchParams.get("hotelId");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  if (!hotelId) {
    return NextResponse.json({ error: "hotelId is required" }, { status: 400 });
  }

  try {
    const result = await getHotelReviews(hotelId, limit, offset);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json(
      { error: "Failed to get reviews" },
      { status: 500 }
    );
  }
}
