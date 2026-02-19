"use client";

import { useTranslations } from "next-intl";

interface ReviewFiltersProps {
  sortOrder: "newest" | "highest" | "lowest";
  travelerFilter: string | null;
  availableTypes: string[];
  onSortChange: (sort: "newest" | "highest" | "lowest") => void;
  onFilterChange: (type: string | null) => void;
}

export default function ReviewFilters({
  sortOrder,
  travelerFilter,
  availableTypes,
  onSortChange,
  onFilterChange,
}: ReviewFiltersProps) {
  const t = useTranslations("hotel");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-muted" htmlFor="review-sort">
          {t("newestFirst").split(" ")[0]}:
        </label>
        <select
          id="review-sort"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as "newest" | "highest" | "lowest")}
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="newest">{t("newestFirst")}</option>
          <option value="highest">{t("highestRated")}</option>
          <option value="lowest">{t("lowestRated")}</option>
        </select>
      </div>

      {/* Traveler type pills */}
      {availableTypes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onFilterChange(null)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              travelerFilter === null
                ? "bg-accent text-white"
                : "bg-bg-cream text-text-secondary hover:bg-border"
            }`}
          >
            {t("allTravelers")}
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(travelerFilter === type ? null : type)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer capitalize ${
                travelerFilter === type
                  ? "bg-accent text-white"
                  : "bg-bg-cream text-text-secondary hover:bg-border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
