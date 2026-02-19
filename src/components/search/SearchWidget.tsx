"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Search } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import LocationAutocomplete from "./LocationAutocomplete";
import DateRangePicker from "./DateRangePicker";
import GuestSelector from "./GuestSelector";

interface SearchWidgetProps {
  compact?: boolean;
}

export default function SearchWidget({ compact = false }: SearchWidgetProps) {
  const tc = useTranslations("common");
  const router = useRouter();
  const {
    location,
    placeId,
    checkIn,
    checkOut,
    starRatings,
    hotelName,
    budget,
  } = useSearchStore();

  function handleSearch() {
    if (!location) return;

    const slug = location.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const params = new URLSearchParams({
      placeId: placeId,
      checkIn,
      checkOut,
    });
    if (starRatings.length) params.set("stars", starRatings.join(","));
    if (hotelName.trim()) params.set("hotelName", hotelName.trim());
    if (budget) params.set("budget", budget);

    router.push(`/hotels/${slug}?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div
      role="search"
      className={`bg-white rounded-full shadow-xl border border-border/40 ${compact ? "p-1" : "p-1.5 sm:p-2"} max-w-5xl mx-auto`}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Location */}
        <div className="flex-1 min-w-0 rounded-full bg-white hover:bg-bg-cream/50 transition-colors">
          <LocationAutocomplete />
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center">
          <div className="w-px h-8 bg-border/60" />
        </div>

        {/* Dates */}
        <div className="flex-1 min-w-0 rounded-full bg-white hover:bg-bg-cream/50 transition-colors mt-1 lg:mt-0">
          <DateRangePicker />
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center">
          <div className="w-px h-8 bg-border/60" />
        </div>

        {/* Guests */}
        <div className="lg:w-[260px] rounded-full bg-white hover:bg-bg-cream/50 transition-colors mt-1 lg:mt-0">
          <GuestSelector />
        </div>

        {/* Search Button */}
        <div className="mt-1 lg:mt-0 lg:ml-1 shrink-0">
          <button
            onClick={handleSearch}
            disabled={!location}
            className="w-full lg:w-auto h-full min-h-[48px] px-7 bg-accent hover:bg-accent-hover text-white font-bold rounded-full flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-base cursor-pointer shadow-lg shadow-accent/20"
          >
            <Search size={20} />
            <span>{tc("search")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
