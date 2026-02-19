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

    // Check if rates response includes inline hotel data
    const hasInlineDetails = ratesData.length > 0 && (
      ratesData[0].name ||
      (ratesData[0] as unknown as Record<string, unknown>).hotelName
    );

    let detailsMap = new Map<string, Record<string, unknown>>();

    if (!hasInlineDetails) {
      // Fallback: fetch hotel details in parallel (batched to avoid 429 rate limits)
      const hotelIds = ratesData.map((h) => h.hotelId);
      const BATCH_SIZE = 5;
      const BATCH_DELAY = 200; // ms between batches

      for (let i = 0; i < hotelIds.length; i += BATCH_SIZE) {
        if (i > 0) {
          await new Promise((r) => setTimeout(r, BATCH_DELAY));
        }
        const batch = hotelIds.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.allSettled(
          batch.map((id) => getHotelDetails(id))
        );

        batchResults.forEach((res, j) => {
          if (res.status === "fulfilled" && res.value?.data) {
            detailsMap.set(batch[j], res.value.data);
          } else if (res.status === "rejected") {
            console.warn(`[search] Failed to fetch details for ${batch[j]}:`, res.reason?.message || res.reason);
          }
        });
      }

      console.log(`[search] Fetched details for ${detailsMap.size}/${hotelIds.length} hotels`);
    }

    // Merge rates with hotel details
    const merged = ratesData.map((hotel) => {
      const details = hasInlineDetails
        ? (hotel as unknown as Record<string, unknown>)
        : (detailsMap.get(hotel.hotelId) || {});
      const cheapestRoom = hotel.roomTypes?.[0];
      const cheapestRate = cheapestRoom?.rates?.[0];

      // Try multiple price locations — LiteAPI response structure varies
      let minPrice: number | undefined =
        cheapestRoom?.offerRetailRate?.amount
        ?? cheapestRoom?.suggestedSellingPrice?.amount
        ?? cheapestRate?.retailRate?.total?.[0]?.amount;

      // If no price from first room, scan all rooms for lowest price
      if (minPrice === undefined && hotel.roomTypes?.length > 1) {
        for (const room of hotel.roomTypes) {
          const price = room.offerRetailRate?.amount
            ?? room.suggestedSellingPrice?.amount
            ?? room.rates?.[0]?.retailRate?.total?.[0]?.amount;
          if (price !== undefined && (minPrice === undefined || price < minPrice)) {
            minPrice = price;
          }
        }
      }

      // Ensure it's a valid number
      if (minPrice !== undefined) {
        minPrice = Number(minPrice);
        if (isNaN(minPrice) || minPrice <= 0) minPrice = undefined;
      }

      // Extract lat/lng from the 'location' object if present
      const loc = details.location as { latitude?: number; longitude?: number; lat?: number; lng?: number } | undefined;

      return {
        hotelId: hotel.hotelId,
        name: (details.name as string) || (details.hotelName as string) || "Unknown Hotel",
        starRating: (details.starRating as number | undefined),
        address: (details.address as string | undefined),
        city: (details.city as string | undefined),
        country: (details.country as string | undefined),
        latitude: (details.latitude as number | undefined) ?? loc?.latitude ?? loc?.lat,
        longitude: (details.longitude as number | undefined) ?? loc?.longitude ?? loc?.lng,
        main_photo: (details.main_photo as string | undefined) ?? (details.thumbnail as string | undefined),
        hotelImages: (details.hotelImages as string[] | undefined),
        reviewScore: (details.rating as number | undefined) ?? (details.reviewScore as number | undefined),
        reviewCount: (details.reviewCount as number | undefined),
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
