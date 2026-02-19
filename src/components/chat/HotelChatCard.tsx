"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { ChatHotel } from "@/store/chatStore";

export default function HotelChatCard({ hotel }: { hotel: ChatHotel }) {
  return (
    <Link
      href={`/hotel/${hotel.hotelId}` as "/hotel/[id]"}
      className="flex gap-3 bg-white rounded-xl p-2.5 shadow-sm border border-border hover:shadow-md hover:border-accent-bright/30 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-bg-cream">
        {hotel.main_photo ? (
          <Image
            src={hotel.main_photo}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
            No photo
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="text-sm font-semibold text-text-primary truncate leading-tight">
          {hotel.name}
        </h4>

        {/* Stars */}
        {hotel.starRating && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star key={i} size={10} className="fill-star text-star" />
            ))}
          </div>
        )}

        {/* Price & Rating */}
        <div className="flex items-center gap-2 mt-1.5">
          {hotel.minRate ? (
            <span className="text-xs font-bold text-accent">
              {hotel.currency} {hotel.minRate.toFixed(0)}
              <span className="font-normal text-text-muted">/night</span>
            </span>
          ) : (
            <span className="text-xs text-text-muted">Price N/A</span>
          )}
          {hotel.reviewScore && (
            <span className="text-[10px] font-semibold bg-accent text-white px-1.5 py-0.5 rounded">
              {hotel.reviewScore.toFixed(1)}
            </span>
          )}
        </div>

        {hotel.cancellationPolicy === "FREE_CANCELLATION" && (
          <span className="text-[10px] text-success font-medium mt-0.5 block">
            Free cancellation
          </span>
        )}
      </div>
    </Link>
  );
}
