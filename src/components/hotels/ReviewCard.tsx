import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface ReviewCardProps {
  review: {
    guestName?: string;
    rating?: number;
    title?: string;
    comment?: string;
    date?: string;
    country?: string;
    type?: string;
  };
}

function getRatingColor(score: number) {
  if (score >= 8) return "bg-green-600";
  if (score >= 6) return "bg-yellow-500";
  if (score >= 4) return "bg-orange-500";
  return "bg-red-500";
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const name = review.guestName || "Guest";
  // LiteAPI uses 1-10 scale
  const isScale10 = review.rating !== undefined && review.rating > 5;

  return (
    <div className="bg-white rounded-lg border border-border p-5 transition-all duration-200 hover:shadow-sm hover:border-border-dark/10">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary text-sm">{name}</p>
              {(review.country || review.type) && (
                <p className="text-xs text-text-muted">
                  {[review.country, review.type].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {review.date && (
                <span className="text-xs text-text-muted">{review.date}</span>
              )}
              {review.rating !== undefined && (
                isScale10 ? (
                  <span className={`${getRatingColor(review.rating)} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                    {review.rating.toFixed(1)}
                  </span>
                ) : (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.round(review.rating || 0)
                            ? "fill-star text-star"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {review.title && (
        <p className="font-medium text-text-primary text-sm mb-1">
          {review.title}
        </p>
      )}
      {review.comment && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}
