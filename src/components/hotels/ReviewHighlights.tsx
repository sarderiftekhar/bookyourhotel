"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { getStarRatingText } from "@/lib/utils";
import ReviewCategoryBar from "./ReviewCategoryBar";

interface ReviewData {
  guestName?: string;
  rating?: number;
  title?: string;
  comment?: string;
  date?: string;
  country?: string;
  type?: string;
}

interface ReviewHighlightsProps {
  score: number;
  count: number;
  reviews: ReviewData[];
  onReadAll: () => void;
}

// Keywords to extract from reviews as "liked" pills
const KEYWORD_GROUPS = [
  { label: "Helpful staff", keywords: ["staff", "helpful", "friendly", "reception"] },
  { label: "Great location", keywords: ["location", "central", "close to", "walking distance"] },
  { label: "Clean rooms", keywords: ["clean", "spotless", "tidy", "hygiene"] },
  { label: "Comfortable beds", keywords: ["bed", "sleep", "comfortable", "pillow", "mattress"] },
  { label: "Delicious breakfast", keywords: ["breakfast", "food", "dining", "meal"] },
  { label: "Beautiful view", keywords: ["view", "scenery", "overlooking", "panoramic"] },
  { label: "Good value", keywords: ["value", "worth", "price", "affordable"] },
  { label: "Quiet area", keywords: ["quiet", "peaceful", "relaxing", "calm"] },
];

function extractKeywordPills(reviews: ReviewData[]): string[] {
  const allText = reviews
    .map((r) => `${r.title || ""} ${r.comment || ""}`)
    .join(" ")
    .toLowerCase();

  return KEYWORD_GROUPS.filter((group) =>
    group.keywords.some((kw) => allText.includes(kw))
  )
    .slice(0, 6)
    .map((g) => g.label);
}

// Simulate category scores from overall score
function generateCategories(score: number): { label: string; score: number }[] {
  const variance = () => (Math.random() - 0.5) * 1.2;
  return [
    { label: "Staff", score: Math.min(10, Math.max(1, score + variance())) },
    { label: "Facilities", score: Math.min(10, Math.max(1, score - 0.3 + variance())) },
    { label: "Cleanliness", score: Math.min(10, Math.max(1, score + 0.2 + variance())) },
    { label: "Comfort", score: Math.min(10, Math.max(1, score + variance())) },
    { label: "Value", score: Math.min(10, Math.max(1, score - 0.5 + variance())) },
    { label: "Location", score: Math.min(10, Math.max(1, score + 0.3 + variance())) },
  ];
}

export default function ReviewHighlights({
  score,
  count,
  reviews,
  onReadAll,
}: ReviewHighlightsProps) {
  const t = useTranslations("hotel");
  const ratingLabel = getStarRatingText(score);
  const pills = useMemo(() => extractKeywordPills(reviews), [reviews]);
  const categories = useMemo(() => generateCategories(score), [score]);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2
        className="text-xl font-bold text-text-primary mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("reviewHighlights")}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: score + pills */}
        <div className="md:w-1/3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent text-white text-2xl font-bold w-14 h-14 rounded-xl flex items-center justify-center">
              {score.toFixed(1)}
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">{ratingLabel}</p>
              <p className="text-xs text-text-muted">
                {t("basedOnReviews", { count: count.toLocaleString() })}
              </p>
            </div>
          </div>

          {pills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                {t("whatGuestsLiked")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-xs font-medium px-2.5 py-1 bg-accent/5 text-accent rounded-full"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: category bars */}
        <div className="md:w-2/3">
          <p className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wide">
            {t("categories")}
          </p>
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <ReviewCategoryBar key={cat.label} label={cat.label} score={cat.score} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-text-muted italic">
          {t("aiSentiment", { count: count })}
        </p>
        <button
          onClick={onReadAll}
          className="text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
        >
          {t("readAllReviews", { count: count })} &rarr;
        </button>
      </div>
    </div>
  );
}
