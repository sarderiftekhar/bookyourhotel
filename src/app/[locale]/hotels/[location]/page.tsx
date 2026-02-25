"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Map, List, SlidersHorizontal, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useSearchStore } from "@/store/searchStore";
import { usePreferencesStore } from "@/store/preferencesStore";
import SearchWidget from "@/components/search/SearchWidget";
import SearchFilters, { FilterState } from "@/components/search/SearchFilters";
import HotelGrid from "@/components/hotels/HotelGrid";
import HotelMap from "@/components/hotels/HotelMap";
import Spinner, { LoadingOverlay } from "@/components/ui/Spinner";
import { isRefundablePolicy } from "@/lib/utils";
import { useParams } from "next/navigation";

interface HotelResult {
  hotelId: string;
  name: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  main_photo?: string;
  hotelImages?: string[];
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
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><Spinner size={56} /></div>}>
      <HotelsPageInner />
    </Suspense>
  );
}

function HotelsPageInner() {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const params = useParams();
  const location = decodeURIComponent((params.location as string) || "").replace(/-/g, " ");
  const { checkIn, checkOut, adults, children, rooms } = useSearchStore();
  const { currency } = usePreferencesStore();

  const HOTELS_PER_PAGE = 10;

  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("price_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 10000,
    starRatings: [],
    boardTypes: [],
    freeCancellation: false,
  });

  // Reset page when filters or sort change
  const resultKey = useMemo(() => {
    setCurrentPage(1);
    return `${filters.starRatings.join(",")}-${filters.boardTypes.join(",")}-${filters.freeCancellation}-${filters.minPrice}-${filters.maxPrice}-${sortBy}`;
  }, [filters, sortBy]);

  useEffect(() => {
    async function searchHotels() {
      setLoading(true);
      try {
        const placeId = searchParams.get("placeId") || "";
        const ci = searchParams.get("checkIn") || checkIn;
        const co = searchParams.get("checkOut") || checkOut;

        const starsParam = searchParams.get("stars");
        const hotelNameParam = searchParams.get("hotelName");
        const budgetParam = searchParams.get("budget");
        const starRatingFilter = starsParam
          ? starsParam.split(",").map(Number).filter((n) => n >= 1 && n <= 5)
          : undefined;

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
      if (filters.freeCancellation && !isRefundablePolicy(h.cancellationPolicy)) {
        return false;
      }
      if (filters.boardTypes.length > 0 && h.boardName && !filters.boardTypes.some((b) => h.boardName?.toLowerCase().includes(b.toLowerCase()))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aUnknown = a.name === "Unknown Hotel" || (!a.main_photo && !a.starRating);
      const bUnknown = b.name === "Unknown Hotel" || (!b.main_photo && !b.starRating);
      if (aUnknown && !bUnknown) return 1;
      if (!aUnknown && bUnknown) return -1;

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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / HOTELS_PER_PAGE));
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * HOTELS_PER_PAGE,
    currentPage * HOTELS_PER_PAGE
  );

  function goToPage(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Active filter chips
  const activeChips: { label: string; key: string; onRemove: () => void }[] = [];
  if (filters.freeCancellation) {
    activeChips.push({
      label: t("freeCancellationOption"),
      key: "fc",
      onRemove: () => setFilters({ ...filters, freeCancellation: false }),
    });
  }
  filters.starRatings.forEach((star) => {
    activeChips.push({
      label: `${star}★`,
      key: `star-${star}`,
      onRemove: () => setFilters({ ...filters, starRatings: filters.starRatings.filter((s) => s !== star) }),
    });
  });
  filters.boardTypes.forEach((board) => {
    activeChips.push({
      label: board,
      key: `board-${board}`,
      onRemove: () => setFilters({ ...filters, boardTypes: filters.boardTypes.filter((b) => b !== board) }),
    });
  });

  const mappableHotels = filteredHotels.filter((h) => h.latitude && h.longitude) as Array<{
    hotelId: string;
    name: string;
    latitude: number;
    longitude: number;
    minRate?: number;
    currency?: string;
  }>;

  const prices = hotels.map((h) => h.minRate).filter((p): p is number => p !== undefined && p > 0);

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      {/* Sticky Search Bar */}
      <div className="bg-white shadow-sm py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchWidget compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
          <Link href="/" className="hover:text-accent transition-colors">{t("breadcrumbHome")}</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary font-medium capitalize">{t("resultsTitle", { location })}</span>
        </nav>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
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
              className="px-5 py-2.5 text-sm font-medium bg-white rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/30 border-0 appearance-none cursor-pointer transition-shadow"
            >
              <option value="price_asc">{t("priceLowHigh")}</option>
              <option value="price_desc">{t("priceHighLow")}</option>
              <option value="rating_desc">{t("ratingHighLow")}</option>
              <option value="name_asc">{t("nameAZ")}</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-full shadow-md p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-all duration-200 cursor-pointer rounded-full ${viewMode === "list" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-accent hover:bg-bg-cream"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 transition-all duration-200 cursor-pointer rounded-full ${viewMode === "map" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-text-muted hover:text-accent hover:bg-bg-cream"}`}
              >
                <Map size={18} />
              </button>
            </div>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal size={16} />
              {tc("filters")}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-bold rounded-full shadow-md shadow-accent/20 transition-all hover:shadow-lg"
              >
                {chip.label}
                <button
                  onClick={chip.onRemove}
                  className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                const cleared: FilterState = { minPrice: 0, maxPrice: 10000, starRatings: [], boardTypes: [], freeCancellation: false };
                setFilters(cleared);
              }}
              className="text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
            >
              {tc("clearAll")}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            {/* Mini map preview */}
            {mappableHotels.length > 0 && viewMode === "list" && (
              <div className="mb-3 rounded-3xl overflow-hidden shadow-sm">
                <div className="h-[200px]">
                  <HotelMap hotels={mappableHotels} compact />
                </div>
                <button
                  onClick={() => setViewMode("map")}
                  className="w-full py-2.5 text-xs font-medium text-accent hover:text-accent-hover bg-white transition-colors cursor-pointer"
                >
                  {t("showOnMap")}
                </button>
              </div>
            )}

            <SearchFilters
              onFilterChange={setFilters}
              initialFilters={filters}
              hotelCount={filteredHotels.length}
              prices={prices}
              currency={currency}
            />
          </aside>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button type="button" aria-label="Close filters" className="fixed inset-0 bg-black/50 border-0 cursor-default" onClick={() => setShowFilters(false)} />
              <div className="fixed top-0 left-0 h-full w-80 bg-bg-cream overflow-y-auto p-4 rounded-r-3xl shadow-xl">
                <SearchFilters
                  onFilterChange={setFilters}
                  onClose={() => setShowFilters(false)}
                  initialFilters={filters}
                  hotelCount={filteredHotels.length}
                  prices={prices}
                  currency={currency}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {loading ? (
              <LoadingOverlay message={t("resultsTitle", { location })} />
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm animate-results-in">
                <p className="text-lg text-text-secondary mb-2">{t("noHotelsFound")}</p>
                <p className="text-sm text-text-muted">{t("adjustFilters")}</p>
              </div>
            ) : viewMode === "list" ? (
              <>
                <div key={`${resultKey}-${currentPage}`} className="animate-results-in">
                  <HotelGrid hotels={paginatedHotels} />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-md active:scale-95"
                    >
                      <ChevronLeft size={18} className="text-text-secondary" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (p === 1 || p === totalPages) return true;
                        if (Math.abs(p - currentPage) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, i) =>
                        item === "ellipsis" ? (
                          <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-text-muted text-sm">
                            &hellip;
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => goToPage(item as number)}
                            className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${
                              currentPage === item
                                ? "bg-accent text-white shadow-md shadow-accent/30"
                                : "text-text-secondary hover:bg-white hover:shadow-md"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-md active:scale-95"
                    >
                      <ChevronRight size={18} className="text-text-secondary" />
                    </button>

                    <span className="ml-3 text-xs text-text-muted">
                      {(currentPage - 1) * HOTELS_PER_PAGE + 1}–{Math.min(currentPage * HOTELS_PER_PAGE, filteredHotels.length)} of {filteredHotels.length}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[600px] rounded-3xl overflow-hidden shadow-sm">
                <HotelMap hotels={mappableHotels} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
