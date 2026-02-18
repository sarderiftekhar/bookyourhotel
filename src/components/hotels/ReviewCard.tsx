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
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const name = review.guestName || "Guest";

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-text-primary text-sm">{name}</p>
            {review.date && (
              <span className="text-xs text-text-muted">{review.date}</span>
            )}
          </div>
          {review.country && (
            <p className="text-xs text-text-muted">{review.country}</p>
          )}
          {review.rating !== undefined && (
            <div className="flex items-center gap-0.5 mt-1">
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
          )}
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
