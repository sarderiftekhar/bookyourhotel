"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Search, ChevronDown } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import LocationAutocomplete from "./LocationAutocomplete";
import DateRangePicker from "./DateRangePicker";
import GuestSelector from "./GuestSelector";

const BUDGET_OPTIONS = [
  { value: "", label: "Any Budget" },
  { value: "0-100", label: "$0 – $100" },
  { value: "100-200", label: "$100 – $200" },
  { value: "200-400", label: "$200 – $400" },
  { value: "400-800", label: "$400 – $800" },
  { value: "800-10000", label: "$800+" },
];

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
    setBudget,
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

  if (compact) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4" onKeyDown={handleKeyDown}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
          {/* Location */}
          <div className="flex-1 min-w-0 sm:border-r sm:border-border/50 sm:pr-3">
            <label className="block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-widest px-1">
              Location
            </label>
            <LocationAutocomplete />
          </div>

          {/* Dates */}
          <div className="flex-1 min-w-0 sm:border-r sm:border-border/50 sm:px-3">
            <label className="block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-widest px-1">
              Dates
            </label>
            <DateRangePicker />
          </div>

          {/* Guests */}
          <div className="sm:w-44 sm:border-r sm:border-border/50 sm:px-3">
            <label className="block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-widest px-1">
              {tc("guests")}
            </label>
            <GuestSelector />
          </div>

          {/* Budget */}
          <div className="sm:w-40 sm:px-3">
            <label className="block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-widest px-1">
              Budget
            </label>
            <BudgetDropdown value={budget} onChange={setBudget} />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!location}
            className="sm:ml-2 h-11 px-6 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 text-sm"
          >
            <Search size={17} />
            <span className="sm:hidden">{tc("search")}</span>
          </button>
        </div>
      </div>
    );
  }

  // Hero search widget — clean single-row
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 max-w-5xl mx-auto border border-border/30" onKeyDown={handleKeyDown}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-0">
        {/* Location */}
        <div className="flex-1 min-w-0 lg:border-r lg:border-border/50 lg:pr-4">
          <label className="block text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-widest px-1">
            Location
          </label>
          <LocationAutocomplete />
        </div>

        {/* Dates */}
        <div className="flex-1 min-w-0 lg:border-r lg:border-border/50 lg:px-4">
          <label className="block text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-widest px-1">
            Dates
          </label>
          <DateRangePicker />
        </div>

        {/* Guests */}
        <div className="lg:w-44 lg:border-r lg:border-border/50 lg:px-4">
          <label className="block text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-widest px-1">
            {tc("guests")}
          </label>
          <GuestSelector />
        </div>

        {/* Budget */}
        <div className="lg:w-44 lg:pl-4">
          <label className="block text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-widest px-1">
            Budget
          </label>
          <BudgetDropdown value={budget} onChange={setBudget} />
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!location}
        className="mt-5 w-full h-12 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-[15px]"
      >
        <Search size={19} />
        Search Hotels
      </button>
    </div>
  );
}

function BudgetDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = BUDGET_OPTIONS.find((o) => o.value === value)?.label || "Any Budget";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-card text-text-primary hover:border-accent/50 transition-colors text-left"
      >
        <span className={value ? "text-text-primary" : "text-text-muted"}>{currentLabel}</span>
        <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-border overflow-hidden">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === option.value
                  ? "bg-accent text-white font-medium"
                  : "text-text-primary hover:bg-bg-cream"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
