import { NextRequest, NextResponse } from "next/server";
import { confirmBooking } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.prebookId) {
      return NextResponse.json({ error: "prebookId is required" }, { status: 400 });
    }

    if (!body.transactionId) {
      return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }

    const result = await confirmBooking({
      prebookId: body.prebookId,
      holder: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
      payment: {
        method: "TRANSACTION_ID",
        transactionId: body.transactionId,
      },
      guests: [
        {
          occupancyNumber: 1,
          remarks: body.specialRequests || "",
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
      ],
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
