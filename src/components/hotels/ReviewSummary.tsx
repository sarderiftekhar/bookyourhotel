import { Star } from "lucide-react";
import { getStarRatingText } from "@/lib/utils";

interface ReviewSummaryProps {
  score: number;
  count: number;
}

export default function ReviewSummary({ score, count }: ReviewSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-accent text-white text-2xl font-bold w-14 h-14 rounded-xl flex items-center justify-center">
        {score.toFixed(1)}
      </div>
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(score)
                  ? "fill-star text-star"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
        </div>
        <p className="text-sm font-medium text-text-primary">
          {getStarRatingText(score)}
        </p>
        <p className="text-xs text-text-muted">
          Based on {count} review{count !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
