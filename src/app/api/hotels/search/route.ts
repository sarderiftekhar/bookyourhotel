import { NextRequest, NextResponse } from "next/server";
import { searchHotelRates, getHotelDetails } from "@/lib/liteapi";

interface RoomType {
  offerId: string;
  offerRetailRate?: { amount: number; currency: string };
  suggestedSellingPrice?: { amount: number; currency: string };
  rates: Array<{
    name: string;
    boardType: string;
    boardName: string;
    retailRate?: {
      total?: Array<{ amount: number; currency: string }>;
    };
    cancellationPolicies?: {
      refundableTag?: string;
    };
  }>;
}

interface RateResult {
  hotelId: string;
  name?: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  main_photo?: string;
  hotelImages?: string[];
  reviewScore?: number;
  reviewCount?: number;
  roomTypes: RoomType[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Build search params including new advanced filters
    const searchParams: Parameters<typeof searchHotelRates>[0] = {
      checkin: body.checkIn,
      checkout: body.checkOut,
      adults: body.adults || 2,
      children: body.children,
      currency: body.currency || "USD",
      guestNationality: body.nationality || "US",
      placeId: body.placeId,
      cityName: body.cityName,
      countryCode: body.countryCode,
      latitude: body.latitude,
      longitude: body.longitude,
      hotelIds: body.hotelIds,
      occupancies: body.occupancies || [
        { adults: body.adults || 2 },
      ],
      includeHotelData: true,
      timeout: 8,
      limit: body.limit || 100,
    };

    // Server-side filters (only add if provided)
    if (body.starRating?.length) {
      searchParams.starRating = body.starRating;
    }
    if (body.hotelName) {
      searchParams.hotelName = body.hotelName;
    }
    if (body.minRating) {
      searchParams.minRating = body.minRating;
    }
    if (body.minReviewsCount) {
      searchParams.minReviewsCount = body.minReviewsCount;
    }

    const result = await searchHotelRates(searchParams);

    if (!result.data || !Array.isArray(result.data)) {
      return NextResponse.json({ data: [] });
    }

    const ratesData = result.data as RateResult[];

    // Check if includeHotelData returned inline details
    const hasInlineDetails = ratesData.length > 0 && ratesData[0].name;

    let detailsMap = new Map<string, Record<string, unknown>>();

    if (!hasInlineDetails) {
      // Fallback: fetch hotel details in parallel
      const hotelIds = ratesData.map((h) => h.hotelId);
      const detailsResults = await Promise.allSettled(
        hotelIds.map((id) => getHotelDetails(id))
      );

      detailsResults.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value?.data) {
          detailsMap.set(hotelIds[i], res.value.data);
        }
      });
    }

    // Merge rates with hotel details
    const merged = ratesData.map((hotel) => {
      const details = hasInlineDetails
        ? (hotel as unknown as Record<string, unknown>)
        : (detailsMap.get(hotel.hotelId) || {});
      const cheapestRoom = hotel.roomTypes?.[0];
      const cheapestRate = cheapestRoom?.rates?.[0];
      const minPrice = cheapestRoom?.offerRetailRate?.amount
        ?? cheapestRate?.retailRate?.total?.[0]?.amount;

      return {
        hotelId: hotel.hotelId,
        name: (details.name as string) || "Unknown Hotel",
        starRating: details.starRating as number | undefined,
        address: details.address as string | undefined,
        city: details.city as string | undefined,
        country: details.country as string | undefined,
        latitude: details.latitude as number | undefined,
        longitude: details.longitude as number | undefined,
        main_photo: details.main_photo as string | undefined,
        hotelImages: details.hotelImages as string[] | undefined,
        reviewScore: details.reviewScore as number | undefined,
        reviewCount: details.reviewCount as number | undefined,
        minRate: minPrice,
        currency: cheapestRoom?.offerRetailRate?.currency
          ?? cheapestRate?.retailRate?.total?.[0]?.currency
          ?? body.currency
          ?? "USD",
        boardName: cheapestRate?.boardName,
        cancellationPolicy: cheapestRate?.cancellationPolicies?.refundableTag,
        roomCount: hotel.roomTypes?.length || 0,
      };
    });

    return NextResponse.json({ data: merged });
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json(
      { error: "Failed to search hotels" },
      { status: 500 }
    );
  }
}
