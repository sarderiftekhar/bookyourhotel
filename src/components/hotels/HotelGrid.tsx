"use client";

import HotelCard from "./HotelCard";
import { HotelCardSkeleton } from "@/components/ui/Skeleton";

interface HotelGridProps {
  hotels: Array<{
    hotelId: string;
    name: string;
    starRating?: number;
    address?: string;
    city?: string;
    country?: string;
    main_photo?: string;
    hotelImages?: string[];
    minRate?: number;
    currency?: string;
    reviewScore?: number;
    reviewCount?: number;
    boardName?: string;
    cancellationPolicy?: string;
  }>;
  loading?: boolean;
}

export default function HotelGrid({ hotels, loading }: HotelGridProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hotels.map((hotel, index) => (
        <div
          key={hotel.hotelId}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 10) * 0.08}s`, animationFillMode: "both" }}
        >
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
}
