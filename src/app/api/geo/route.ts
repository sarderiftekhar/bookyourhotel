import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_TO_CURRENCY, DEFAULT_CURRENCY } from "@/lib/constants";

/**
 * GET /api/geo
 * Returns the user's detected country, city, coordinates, and mapped currency.
 *
 * Detection order:
 * 1. Vercel geo headers (x-vercel-ip-country, x-vercel-ip-city, x-vercel-ip-latitude, x-vercel-ip-longitude) — free, automatic on Vercel
 * 2. Cloudflare header (cf-ipcountry) — if behind Cloudflare
 * 3. Free IP geolocation API fallback (for local dev / non-Vercel hosts)
 */
export async function GET(request: NextRequest) {
  let country: string | null = null;
  let city: string | null = null;
  let lat: number | null = null;
  let lon: number | null = null;

  // 1. Vercel geo headers
  country = request.headers.get("x-vercel-ip-country");
  city = request.headers.get("x-vercel-ip-city");
  const vercelLat = request.headers.get("x-vercel-ip-latitude");
  const vercelLon = request.headers.get("x-vercel-ip-longitude");
  if (vercelLat) lat = parseFloat(vercelLat);
  if (vercelLon) lon = parseFloat(vercelLon);

  // 2. Cloudflare header
  if (!country) {
    country = request.headers.get("cf-ipcountry");
  }

  // 3. Fallback: free IP geolocation API (returns city + lat/lon too)
  if (!country || !city) {
    try {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip");

      // Use no-IP URL for localhost, private/LAN IPs — ip-api.com auto-detects from server's public IP
      const isPrivateIp = !ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("10.") || ip.startsWith("172.") || ip.startsWith("192.168.");
      const url = isPrivateIp
        ? `http://ip-api.com/json/?fields=countryCode,city,lat,lon`
        : `http://ip-api.com/json/${ip}?fields=countryCode,city,lat,lon`;

      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (!country) country = data.countryCode || null;
        if (!city) city = data.city || null;
        if (lat === null && data.lat) lat = data.lat;
        if (lon === null && data.lon) lon = data.lon;
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
    { country: countryCode, currency, city, lat, lon },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
