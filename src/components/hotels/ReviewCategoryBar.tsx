"use client";

interface ReviewCategoryBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

export default function ReviewCategoryBar({
  label,
  score,
  maxScore = 10,
}: ReviewCategoryBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary w-28 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-bg-cream overflow-hidden">
        <div
          className="h-full rounded-full bg-accent-bright transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-text-primary w-8 text-right">
        {score.toFixed(1)}
      </span>
    </div>
  );
}
