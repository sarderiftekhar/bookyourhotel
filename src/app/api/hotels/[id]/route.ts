import { NextRequest, NextResponse } from "next/server";
import { getHotelDetails } from "@/lib/liteapi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await getHotelDetails(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Hotel details error:", error);
    return NextResponse.json(
      { error: "Failed to get hotel details" },
      { status: 500 }
    );
  }
}
