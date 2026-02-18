import { NextRequest, NextResponse } from "next/server";
import { prebookRate } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 });
    }

    const result = await prebookRate(body.offerId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Prebook error:", error);
    return NextResponse.json(
      { error: "Failed to prebook" },
      { status: 500 }
    );
  }
}
