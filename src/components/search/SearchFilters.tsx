"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Star, X, CheckCircle } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  initialFilters?: Partial<FilterState>;
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

export default function SearchFilters({ onFilterChange, onClose, initialFilters }: SearchFiltersProps) {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Sync if initialFilters change (e.g., from URL params)
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

  return (
    <div className="bg-white rounded-lg border border-border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          {tc("filters")}
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs text-accent hover:underline">
              {tc("clearAll")}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 text-text-muted hover:text-text-primary">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Free Cancellation Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
              filters.freeCancellation ? "bg-accent" : "bg-border"
            }`}
            onClick={() => updateFilters({ freeCancellation: !filters.freeCancellation })}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                filters.freeCancellation ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={15} className="text-success" />
            <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
              Free Cancellation
            </span>
          </div>
        </label>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">{t("priceRange")}</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilters({ minPrice: Number(e.target.value) })}
            placeholder="Min"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <span className="text-text-muted">—</span>
          <input
            type="number"
            value={filters.maxPrice === 10000 ? "" : filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 10000 })}
            placeholder="Max"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">{t("starRating")}</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.starRatings.includes(star)}
                onChange={() => toggleStarRating(star)}
                className="rounded border-border text-accent focus:ring-accent/30"
              />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} size={14} className="fill-star text-star" />
                ))}
              </div>
              <span className="text-xs text-text-muted group-hover:text-text-secondary">
                {star} star{star !== 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Board Type */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Board Type</h4>
        <div className="space-y-2">
          {["Room Only", "Breakfast", "Half Board", "Full Board", "All Inclusive"].map(
            (board) => (
              <label key={board} className="flex items-center gap-2 cursor-pointer">
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
                  className="rounded border-border text-accent focus:ring-accent/30"
                />
                <span className="text-sm text-text-secondary">{board}</span>
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );
}
