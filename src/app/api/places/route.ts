import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/liteapi";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");

  if (!text || text.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    const result = await searchPlaces(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Places search error:", error);
    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 }
    );
  }
}
