import { NextRequest, NextResponse } from "next/server";
import { searchHotelRates, getHotelDetails } from "@/lib/liteapi";
import { addDays, format } from "date-fns";

interface RoomType {
  offerId: string;
  offerRetailRate?: { amount: number; currency: string };
  suggestedSellingPrice?: { amount: number; currency: string };
  rates: Array<{
    retailRate?: { total?: Array<{ amount: number; currency: string }> };
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
  reviewScore?: number;
  reviewCount?: number;
  roomTypes: RoomType[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const countryCode = searchParams.get("countryCode");
    const currency = searchParams.get("currency") || "USD";
    const centerLat = searchParams.get("lat")
      ? parseFloat(searchParams.get("lat")!)
      : undefined;
    const centerLon = searchParams.get("lon")
      ? parseFloat(searchParams.get("lon")!)
      : undefined;

    if (!centerLat && !centerLon && !city && !countryCode) {
      return NextResponse.json({ data: [] });
    }

    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const dayAfter = format(addDays(new Date(), 2), "yyyy-MM-dd");

    // Prefer lat/lng search (more reliable than cityName which can be a neighborhood)
    const rateParams: Parameters<typeof searchHotelRates>[0] = {
      checkin: tomorrow,
      checkout: dayAfter,
      adults: 2,
      currency,
      guestNationality: "US",
      occupancies: [{ adults: 2 }],
      includeHotelData: true,
      timeout: 8,
      limit: 6,
    };

    if (centerLat && centerLon) {
      rateParams.latitude = centerLat;
      rateParams.longitude = centerLon;
    } else {
      rateParams.cityName = city || undefined;
      rateParams.countryCode = countryCode || undefined;
    }

    const result = await searchHotelRates(rateParams);

    if (!result.data || !Array.isArray(result.data)) {
      return NextResponse.json({ data: [] });
    }

    const ratesData = result.data as RateResult[];

    const hasInlineDetails =
      ratesData.length > 0 &&
      (ratesData[0].name ||
        (ratesData[0] as unknown as Record<string, unknown>).hotelName);

    let detailsMap = new Map<string, Record<string, unknown>>();

    if (!hasInlineDetails) {
      const hotelIds = ratesData.map((h) => h.hotelId);
      const detailResults = await Promise.allSettled(
        hotelIds.map((id) => getHotelDetails(id))
      );
      detailResults.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value?.data) {
          detailsMap.set(hotelIds[i], res.value.data);
        }
      });
    }

    const merged = ratesData.map((hotel) => {
      const details = hasInlineDetails
        ? (hotel as unknown as Record<string, unknown>)
        : detailsMap.get(hotel.hotelId) || {};

      const cheapestRoom = hotel.roomTypes?.[0];
      let minPrice: number | undefined =
        cheapestRoom?.offerRetailRate?.amount ??
        cheapestRoom?.suggestedSellingPrice?.amount ??
        cheapestRoom?.rates?.[0]?.retailRate?.total?.[0]?.amount;

      if (minPrice !== undefined) {
        minPrice = Number(minPrice);
        if (isNaN(minPrice) || minPrice <= 0) minPrice = undefined;
      }

      // Calculate distance from city center if coordinates available
      const loc = details.location as
        | { latitude?: number; longitude?: number; lat?: number; lng?: number }
        | undefined;
      const hotelLat =
        (details.latitude as number | undefined) ?? loc?.latitude ?? loc?.lat;
      const hotelLon =
        (details.longitude as number | undefined) ?? loc?.longitude ?? loc?.lng;

      let distanceFromCenter: number | undefined;
      if (centerLat && centerLon && hotelLat && hotelLon) {
        distanceFromCenter = haversineDistance(
          centerLat,
          centerLon,
          hotelLat,
          hotelLon
        );
      }

      return {
        hotelId: hotel.hotelId,
        name:
          (details.name as string) ||
          (details.hotelName as string) ||
          "Unknown Hotel",
        starRating: details.starRating as number | undefined,
        address: details.address as string | undefined,
        city: details.city as string | undefined,
        country: details.country as string | undefined,
        main_photo:
          (details.main_photo as string | undefined) ??
          (details.thumbnail as string | undefined),
        reviewScore:
          (details.rating as number | undefined) ??
          (details.reviewScore as number | undefined),
        reviewCount: details.reviewCount as number | undefined,
        minRate: minPrice,
        currency:
          cheapestRoom?.offerRetailRate?.currency ??
          cheapestRoom?.rates?.[0]?.retailRate?.total?.[0]?.currency ??
          currency,
        distanceFromCenter,
      };
    });

    const validHotels = merged.filter(
      (h) => h.name !== "Unknown Hotel" || h.main_photo
    );

    return NextResponse.json(
      { data: validHotels },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("[nearby] Error:", error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}

/** Haversine distance in miles between two lat/lon points */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
