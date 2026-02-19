"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Star, X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  initialFilters?: Partial<FilterState>;
  hotelCount?: number;
  prices?: number[];
  currency?: string;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  starRatings: number[];
  boardTypes: string[];
  freeCancellation: boolean;
}

const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 10000,
  starRatings: [],
  boardTypes: [],
  freeCancellation: false,
};

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-[22px] h-[22px] rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
        checked
          ? "bg-accent shadow-md shadow-accent/30 scale-100"
          : "bg-white border-2 border-border group-hover:border-accent/50 group-hover:scale-105"
      }`}
    >
      <Check
        size={14}
        strokeWidth={3}
        className={`text-white transition-all duration-200 ${
          checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      />
    </span>
  );
}

/* ─── Budget Histogram Slider ─── */
const NUM_BUCKETS = 20;

function BudgetSlider({
  prices,
  currency,
  minValue,
  maxValue,
  onChange,
}: {
  prices: number[];
  currency: string;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  // Compute price bounds from data
  const sortedPrices = [...prices].filter((p) => p > 0).sort((a, b) => a - b);
  const dataMin = sortedPrices.length > 0 ? sortedPrices[0] : 0;
  const dataMax = sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1] : 1000;
  // Add 10% padding to max, ensure min != max
  const sliderMin = Math.floor(dataMin);
  const sliderMax = Math.max(Math.ceil(dataMax * 1.1), sliderMin + 10);

  const effectiveMin = minValue > 0 ? minValue : sliderMin;
  const effectiveMax = maxValue < 10000 ? maxValue : sliderMax;

  // Build histogram buckets
  const bucketSize = (sliderMax - sliderMin) / NUM_BUCKETS || 1;
  const buckets: number[] = Array(NUM_BUCKETS).fill(0);
  sortedPrices.forEach((p) => {
    const idx = Math.min(Math.floor((p - sliderMin) / bucketSize), NUM_BUCKETS - 1);
    if (idx >= 0) buckets[idx]++;
  });
  const maxBucket = Math.max(...buckets, 1);

  // Convert price to % position
  const toPercent = (val: number) => ((val - sliderMin) / (sliderMax - sliderMin)) * 100;
  const fromPercent = (pct: number) => Math.round(sliderMin + (pct / 100) * (sliderMax - sliderMin));

  const minPct = toPercent(effectiveMin);
  const maxPct = toPercent(effectiveMax);

  const handlePointerDown = useCallback((thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = thumb;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const price = Math.round(sliderMin + (pct / 100) * (sliderMax - sliderMin));

    if (dragging.current === "min") {
      const clamped = Math.min(price, effectiveMax - bucketSize);
      onChange(Math.max(clamped, sliderMin), effectiveMax >= sliderMax ? 10000 : effectiveMax);
    } else {
      const clamped = Math.max(price, effectiveMin + bucketSize);
      onChange(effectiveMin <= sliderMin ? 0 : effectiveMin, clamped >= sliderMax ? 10000 : clamped);
    }
  }, [effectiveMin, effectiveMax, sliderMin, sliderMax, bucketSize, onChange]);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const minLabel = effectiveMin <= sliderMin
    ? formatCurrency(sliderMin, currency)
    : formatCurrency(effectiveMin, currency);
  const maxLabel = effectiveMax >= sliderMax
    ? formatCurrency(sliderMax, currency) + "+"
    : formatCurrency(effectiveMax, currency);

  return (
    <div>
      {/* Price label */}
      <p className="text-sm font-medium text-accent mb-3">
        {minLabel} — {maxLabel}
      </p>

      {/* Histogram */}
      <div className="flex items-end gap-[2px] h-16 mb-2">
        {buckets.map((count, i) => {
          const bucketStart = sliderMin + i * bucketSize;
          const bucketEnd = bucketStart + bucketSize;
          const inRange = bucketEnd > effectiveMin && bucketStart < effectiveMax;
          const heightPct = count > 0 ? Math.max(8, (count / maxBucket) * 100) : 4;

          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-colors duration-150"
              style={{
                height: `${heightPct}%`,
                backgroundColor: inRange
                  ? "var(--color-accent-bright, #3ECEAD)"
                  : "var(--color-border, #e5e5e5)",
                opacity: inRange ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="relative h-6 cursor-pointer select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Background track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full bg-bg-cream" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-accent"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-accent shadow-lg cursor-grab active:cursor-grabbing active:scale-110 transition-transform hover:scale-110 z-10"
          style={{ left: `${minPct}%` }}
          onPointerDown={handlePointerDown("min")}
        />

        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-accent shadow-lg cursor-grab active:cursor-grabbing active:scale-110 transition-transform hover:scale-110 z-10"
          style={{ left: `${maxPct}%` }}
          onPointerDown={handlePointerDown("max")}
        />
      </div>
    </div>
  );
}

/* ─── Main Filter Component ─── */
export default function SearchFilters({ onFilterChange, onClose, initialFilters, hotelCount, prices: rawPrices, currency = "USD" }: SearchFiltersProps) {
  // Ensure prices is always a clean array of positive numbers
  const prices = (rawPrices || []).filter((p) => typeof p === "number" && p > 0 && isFinite(p));
  const hasPrices = prices.length > 0;
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [showAllBoard, setShowAllBoard] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters((prev) => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters?.starRatings?.length, initialFilters?.freeCancellation]);

  function updateFilters(partial: Partial<FilterState>) {
    const updated = { ...filters, ...partial };
    setFilters(updated);
    onFilterChange(updated);
  }

  function toggleStarRating(star: number) {
    const current = filters.starRatings;
    const updated = current.includes(star)
      ? current.filter((s) => s !== star)
      : [...current, star];
    updateFilters({ starRatings: updated });
  }

  function clearAll() {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  }

  const hasActiveFilters =
    filters.starRatings.length > 0 ||
    filters.boardTypes.length > 0 ||
    filters.freeCancellation ||
    filters.minPrice > 0 ||
    (filters.maxPrice < 10000);

  const boardTypes = ["Room Only", "Breakfast", "Half Board", "Full Board", "All Inclusive"];
  const visibleBoards = showAllBoard ? boardTypes : boardTypes.slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">
            {t("filterBy")}
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline cursor-pointer transition-colors"
              >
                {tc("clearAll")}
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="lg:hidden p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-cream cursor-pointer transition-all">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        {hotelCount !== undefined && (
          <p className="text-xs text-text-muted mt-1">
            {t("resultsCount", { count: hotelCount })}
          </p>
        )}
      </div>

      {/* Popular Filters */}
      <div className="bg-white rounded-3xl shadow-md p-5">
        <h4 className="text-sm font-bold text-text-primary mb-4">{t("popularFilters")}</h4>
        <div className="space-y-3.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox checked={filters.freeCancellation} />
            <input
              type="checkbox"
              checked={filters.freeCancellation}
              onChange={() => updateFilters({ freeCancellation: !filters.freeCancellation })}
              className="sr-only"
            />
            <span className="text-sm text-text-primary font-medium group-hover:text-accent transition-colors">
              {t("freeCancellationOption")}
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox checked={filters.boardTypes.includes("Breakfast")} />
            <input
              type="checkbox"
              checked={filters.boardTypes.includes("Breakfast")}
              onChange={() => {
                const current = filters.boardTypes;
                const updated = current.includes("Breakfast")
                  ? current.filter((b) => b !== "Breakfast")
                  : [...current, "Breakfast"];
                updateFilters({ boardTypes: updated });
              }}
              className="sr-only"
            />
            <span className="text-sm text-text-primary font-medium group-hover:text-accent transition-colors">
              {t("breakfastIncluded")}
            </span>
          </label>

          {[5, 4].map((star) => (
            <label key={star} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox checked={filters.starRatings.includes(star)} />
              <input
                type="checkbox"
                checked={filters.starRatings.includes(star)}
                onChange={() => toggleStarRating(star)}
                className="sr-only"
              />
              <span className="flex items-center gap-1.5">
                <span className="text-sm text-text-primary font-medium group-hover:text-accent transition-colors">{star}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: star }).map((_, i) => (
                    <Star key={i} size={13} className="fill-star text-star" />
                  ))}
                </div>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget / Price Range */}
      <div className="bg-white rounded-3xl shadow-md p-5">
        <h4 className="text-sm font-bold text-text-primary mb-3">{t("pricePerNight")}</h4>
        {hasPrices ? (
          <BudgetSlider
            prices={prices}
            currency={currency}
            minValue={filters.minPrice}
            maxValue={filters.maxPrice}
            onChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
          />
        ) : (
          /* Fallback to text inputs when no price data */
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
              <input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilters({ minPrice: Number(e.target.value) })}
                placeholder="0"
                className="w-full pl-7 pr-2 py-3 text-sm font-medium bg-bg-cream rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white border-0 transition-all"
              />
            </div>
            <span className="text-text-muted text-lg font-light">—</span>
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
              <input
                type="number"
                value={filters.maxPrice === 10000 ? "" : filters.maxPrice}
                onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 10000 })}
                placeholder={t("noLimit")}
                className="w-full pl-7 pr-2 py-3 text-sm font-medium bg-bg-cream rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white border-0 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Star Rating */}
      <div className="bg-white rounded-3xl shadow-md p-5">
        <h4 className="text-sm font-bold text-text-primary mb-4">{t("starRating")}</h4>
        <div className="flex flex-wrap gap-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const isActive = filters.starRatings.includes(star);
            return (
              <button
                key={star}
                onClick={() => toggleStarRating(star)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-accent text-white shadow-lg shadow-accent/30 scale-[1.02]"
                    : "bg-bg-cream text-text-primary border-2 border-transparent hover:border-accent/30 hover:bg-accent/5 hover:scale-[1.02]"
                }`}
              >
                {star}
                <Star size={14} className={isActive ? "fill-white text-white" : "fill-star text-star"} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Board Type / Meals */}
      <div className="bg-white rounded-3xl shadow-md p-5">
        <h4 className="text-sm font-bold text-text-primary mb-4">{t("mealPlan")}</h4>
        <div className="space-y-3.5">
          {visibleBoards.map((board) => (
            <label key={board} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox checked={filters.boardTypes.includes(board)} />
              <input
                type="checkbox"
                checked={filters.boardTypes.includes(board)}
                onChange={() => {
                  const current = filters.boardTypes;
                  const updated = current.includes(board)
                    ? current.filter((b) => b !== board)
                    : [...current, board];
                  updateFilters({ boardTypes: updated });
                }}
                className="sr-only"
              />
              <span className="text-sm text-text-primary font-medium group-hover:text-accent transition-colors">{board}</span>
            </label>
          ))}
        </div>
        {boardTypes.length > 3 && (
          <button
            onClick={() => setShowAllBoard(!showAllBoard)}
            className="flex items-center gap-1.5 mt-4 text-xs font-bold text-accent hover:text-accent-hover transition-all cursor-pointer hover:gap-2"
          >
            {showAllBoard ? (
              <>
                {tc("showLess")} <ChevronUp size={14} />
              </>
            ) : (
              <>
                {tc("showMore")} <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
