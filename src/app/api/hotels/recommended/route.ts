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
  main_photo?: string;
  reviewScore?: number;
  reviewCount?: number;
  roomTypes: RoomType[];
}

// Popular cities to pull recommended hotels from
const RECOMMENDED_CITIES = [
  { cityName: "Tokyo", countryCode: "JP" },
  { cityName: "Dubai", countryCode: "AE" },
  { cityName: "Paris", countryCode: "FR" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "USD";

    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const dayAfter = format(addDays(new Date(), 2), "yyyy-MM-dd");

    // Search 3 popular cities in parallel, limit 3 hotels each
    const cityResults = await Promise.allSettled(
      RECOMMENDED_CITIES.map((city) =>
        searchHotelRates({
          checkin: tomorrow,
          checkout: dayAfter,
          adults: 2,
          currency,
          guestNationality: "US",
          cityName: city.cityName,
          countryCode: city.countryCode,
          occupancies: [{ adults: 2 }],
          includeHotelData: true,
          timeout: 8,
          limit: 3,
        })
      )
    );

    const allHotels: RateResult[] = [];
    for (const result of cityResults) {
      if (result.status === "fulfilled" && result.value?.data) {
        const data = result.value.data as RateResult[];
        allHotels.push(...data.slice(0, 3));
      }
    }

    // Check if inline details are included
    const hasInlineDetails =
      allHotels.length > 0 &&
      (allHotels[0].name ||
        (allHotels[0] as unknown as Record<string, unknown>).hotelName);

    let detailsMap = new Map<string, Record<string, unknown>>();

    if (!hasInlineDetails) {
      const hotelIds = allHotels.map((h) => h.hotelId);
      const detailResults = await Promise.allSettled(
        hotelIds.map((id) => getHotelDetails(id))
      );
      detailResults.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value?.data) {
          detailsMap.set(hotelIds[i], res.value.data);
        }
      });
    }

    const merged = allHotels.map((hotel) => {
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
    console.error("[recommended] Error:", error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
