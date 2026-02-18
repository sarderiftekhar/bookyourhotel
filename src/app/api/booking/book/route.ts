import { NextRequest, NextResponse } from "next/server";
import { confirmBooking } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.prebookId) {
      return NextResponse.json({ error: "prebookId is required" }, { status: 400 });
    }

    const result = await confirmBooking({
      prebookId: body.prebookId,
      guestFirstName: body.firstName,
      guestLastName: body.lastName,
      guestEmail: body.email,
      phoneNumber: body.phone,
      remarks: body.specialRequests,
      paymentMethod: body.paymentMethod || "CREDIT_CARD",
      holderName: `${body.firstName} ${body.lastName}`,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to complete booking" },
      { status: 500 }
    );
  }
}
