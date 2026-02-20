import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_TO_CURRENCY, DEFAULT_CURRENCY } from "@/lib/constants";

/**
 * GET /api/geo
 * Returns the user's detected country and mapped currency.
 *
 * Detection order:
 * 1. Vercel geo headers (x-vercel-ip-country) — free, automatic on Vercel
 * 2. Cloudflare header (cf-ipcountry) — if behind Cloudflare
 * 3. Free IP geolocation API fallback (for local dev / non-Vercel hosts)
 */
export async function GET(request: NextRequest) {
  let country: string | null = null;

  // 1. Vercel geo header
  country = request.headers.get("x-vercel-ip-country");

  // 2. Cloudflare header
  if (!country) {
    country = request.headers.get("cf-ipcountry");
  }

  // 3. Fallback: free IP geolocation API
  if (!country) {
    try {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip");

      // Use ip-api.com (free, no key needed, 45 req/min)
      const url = ip && ip !== "::1" && ip !== "127.0.0.1"
        ? `http://ip-api.com/json/${ip}?fields=countryCode`
        : `http://ip-api.com/json/?fields=countryCode`;

      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        country = data.countryCode || null;
      }
    } catch {
      // Silently fail — will use default currency
    }
  }

  const countryCode = country?.toUpperCase() || null;
  const currency = countryCode
    ? COUNTRY_TO_CURRENCY[countryCode] || DEFAULT_CURRENCY
    : DEFAULT_CURRENCY;

  return NextResponse.json(
    { country: countryCode, currency },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
