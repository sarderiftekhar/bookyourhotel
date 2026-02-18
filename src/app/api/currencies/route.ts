import { NextResponse } from "next/server";
import { getCurrencies } from "@/lib/liteapi";

export async function GET() {
  try {
    const result = await getCurrencies();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Currencies error:", error);
    return NextResponse.json(
      { error: "Failed to get currencies" },
      { status: 500 }
    );
  }
}
