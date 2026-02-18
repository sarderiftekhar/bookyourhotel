import { Star } from "lucide-react";

interface RatingProps {
  score: number;
  maxScore?: number;
  showValue?: boolean;
  size?: number;
}

export default function Rating({ score, maxScore = 5, showValue = true, size = 16 }: RatingProps) {
  const stars = Array.from({ length: maxScore }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(score)
              ? "fill-star text-star"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-text-secondary">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}
