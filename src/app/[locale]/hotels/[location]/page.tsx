"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Map, List, SlidersHorizontal, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { usePreferencesStore } from "@/store/preferencesStore";
import SearchWidget from "@/components/search/SearchWidget";
import SearchFilters, { FilterState } from "@/components/search/SearchFilters";
import HotelGrid from "@/components/hotels/HotelGrid";
import HotelMap from "@/components/hotels/HotelMap";
import Spinner from "@/components/ui/Spinner";
import { useParams } from "next/navigation";

interface HotelResult {
  hotelId: string;
  name: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  main_photo?: string;
  minRate?: number;
  currency?: string;
  reviewScore?: number;
  reviewCount?: number;
  boardName?: string;
  cancellationPolicy?: string;
  latitude?: number;
  longitude?: number;
}

export default function HotelsPage() {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const params = useParams();
  const location = decodeURIComponent((params.location as string) || "").replace(/-/g, " ");
  const { checkIn, checkOut, adults, children, rooms } = useSearchStore();
  const { currency } = usePreferencesStore();

  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("price_asc");
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 10000,
    starRatings: [],
    boardTypes: [],
    freeCancellation: false,
  });

  useEffect(() => {
    async function searchHotels() {
      setLoading(true);
      try {
        const placeId = searchParams.get("placeId") || "";
        const ci = searchParams.get("checkIn") || checkIn;
        const co = searchParams.get("checkOut") || checkOut;

        // Read advanced filters from URL params
        const starsParam = searchParams.get("stars");
        const hotelNameParam = searchParams.get("hotelName");
        const budgetParam = searchParams.get("budget");
        const starRatingFilter = starsParam
          ? starsParam.split(",").map(Number).filter((n) => n >= 1 && n <= 5)
          : undefined;

        // Pre-populate sidebar filters from URL params
        const filterUpdates: Partial<FilterState> = {};
        if (starRatingFilter?.length) {
          filterUpdates.starRatings = starRatingFilter;
        }
        if (budgetParam) {
          const [minStr, maxStr] = budgetParam.split("-");
          const min = parseInt(minStr, 10);
          const max = parseInt(maxStr, 10);
          if (!isNaN(min)) filterUpdates.minPrice = min;
          if (!isNaN(max)) filterUpdates.maxPrice = max;
        }
        if (Object.keys(filterUpdates).length > 0) {
          setFilters((prev) => ({ ...prev, ...filterUpdates }));
        }

        const requestBody: Record<string, unknown> = {
          checkIn: ci,
          checkOut: co,
          adults,
          children,
          rooms,
          currency,
          placeId: placeId || undefined,
          cityName: placeId ? undefined : location,
          occupancies: [{ adults, children: children > 0 ? Array(children).fill(8) : undefined }],
        };

        // Server-side filters
        if (starRatingFilter?.length) {
          requestBody.starRating = starRatingFilter;
        }
        if (hotelNameParam) {
          requestBody.hotelName = hotelNameParam;
        }

        const res = await fetch("/api/hotels/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (data.data && Array.isArray(data.data)) {
          setHotels(data.data as HotelResult[]);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }

    searchHotels();
  }, [location, currency]);

  // Apply filters and sorting
  const filteredHotels = hotels
    .filter((h) => {
      if (filters.starRatings.length > 0 && h.starRating && !filters.starRatings.includes(h.starRating)) {
        return false;
      }
      if (h.minRate !== undefined) {
        if (h.minRate < filters.minPrice) return false;
        if (filters.maxPrice < 10000 && h.minRate > filters.maxPrice) return false;
      }
      if (filters.freeCancellation && h.cancellationPolicy !== "FREE_CANCELLATION") {
        return false;
      }
      if (filters.boardTypes.length > 0 && h.boardName && !filters.boardTypes.some((b) => h.boardName?.toLowerCase().includes(b.toLowerCase()))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.minRate || 0) - (b.minRate || 0);
        case "price_desc":
          return (b.minRate || 0) - (a.minRate || 0);
        case "rating_desc":
          return (b.reviewScore || 0) - (a.reviewScore || 0);
        case "name_asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      {/* Sticky Search Bar */}
      <div className="bg-white border-b border-border shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchWidget compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-bold text-text-primary capitalize"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("resultsTitle", { location })}
            </h1>
            {!loading && (
              <p className="text-sm text-text-muted mt-1">
                {t("resultsCount", { count: filteredHotels.length })}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="price_asc">{t("priceLowHigh")}</option>
              <option value="price_desc">{t("priceHighLow")}</option>
              <option value="rating_desc">{t("ratingHighLow")}</option>
              <option value="name_asc">{t("nameAZ")}</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-accent text-white" : "bg-white text-text-secondary hover:bg-bg-cream"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 ${viewMode === "map" ? "bg-accent text-white" : "bg-white text-text-secondary hover:bg-bg-cream"}`}
              >
                <Map size={18} />
              </button>
            </div>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg bg-white hover:bg-bg-cream"
            >
              <SlidersHorizontal size={16} />
              {tc("filters")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <SearchFilters onFilterChange={setFilters} initialFilters={filters} />
          </aside>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="fixed top-0 left-0 h-full w-80 bg-white overflow-y-auto p-4">
                <SearchFilters
                  onFilterChange={setFilters}
                  onClose={() => setShowFilters(false)}
                  initialFilters={filters}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size={32} />
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-text-secondary mb-2">{t("noHotelsFound")}</p>
                <p className="text-sm text-text-muted">{t("adjustFilters")}</p>
              </div>
            ) : viewMode === "list" ? (
              <HotelGrid hotels={filteredHotels} />
            ) : (
              <div className="h-[600px] rounded-xl overflow-hidden">
                <HotelMap
                  hotels={filteredHotels.filter((h) => h.latitude && h.longitude) as Array<{
                    hotelId: string;
                    name: string;
                    latitude: number;
                    longitude: number;
                    minRate?: number;
                    currency?: string;
                  }>}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
