"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { MapPin, Star, Route } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";

interface HomeHotelCardProps {
  hotel: {
    hotelId: string;
    name: string;
    starRating?: number;
    address?: string;
    city?: string;
    country?: string;
    main_photo?: string;
    minRate?: number;
    currency?: string;
    reviewScore?: number;
    reviewCount?: number;
    distanceFromCenter?: number;
  };
}

function getRatingLabel(score: number) {
  if (score >= 9) return "Wonderful";
  if (score >= 8.5) return "Fabulous";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Very Good";
  if (score >= 6) return "Good";
  return "Pleasant";
}

function getRatingColor(score: number) {
  if (score >= 9) return "bg-emerald-600";
  if (score >= 8) return "bg-blue-700";
  if (score >= 7) return "bg-blue-600";
  if (score >= 6) return "bg-sky-600";
  return "bg-gray-500";
}

export default function HomeHotelCard({ hotel }: HomeHotelCardProps) {
  const { checkIn, checkOut } = useSearchStore();

  const ratingLabel = hotel.reviewScore ? getRatingLabel(hotel.reviewScore) : "";
  const ratingColor = hotel.reviewScore ? getRatingColor(hotel.reviewScore) : "";

  return (
    <Link
      href={`/hotel/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`}
      className="group block shrink-0 w-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/30">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {hotel.main_photo ? (
            <Image
              src={hotel.main_photo}
              alt={hotel.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 via-accent/5 to-bg-cream flex items-center justify-center">
              <MapPin size={24} className="text-accent/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Star rating */}
          {hotel.starRating && hotel.starRating > 0 && (
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star key={i} size={13} className="fill-star text-star" />
              ))}
            </div>
          )}

          {/* Hotel name */}
          <h3
            className="text-base font-bold text-text-primary leading-snug line-clamp-1 group-hover:text-accent transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {hotel.name}
          </h3>

          {/* Location */}
          {(hotel.address || hotel.city) && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
              <MapPin size={12} className="text-accent shrink-0" />
              <span className="truncate">
                {hotel.city}
                {hotel.address ? `, ${hotel.address}` : ""}
              </span>
            </div>
          )}

          {/* Distance from center */}
          {hotel.distanceFromCenter !== undefined && hotel.distanceFromCenter > 0 && (
            <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
              <Route size={12} className="text-accent/60 shrink-0" />
              <span>{hotel.distanceFromCenter.toFixed(1)} mi from center</span>
            </div>
          )}

          {/* Bottom: Review + Price */}
          <div className="flex items-end justify-between mt-4 pt-3 border-t border-border/20">
            {/* Review score */}
            {hotel.reviewScore && hotel.reviewScore > 0 ? (
              <div className="flex items-center gap-2">
                <span className={`${ratingColor} text-white text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center`}>
                  {hotel.reviewScore.toFixed(1)}
                </span>
                <div>
                  <p className="text-xs font-semibold text-text-primary leading-tight">{ratingLabel}</p>
                  {hotel.reviewCount !== undefined && (
                    <p className="text-[10px] text-text-muted">
                      {hotel.reviewCount.toLocaleString()} reviews
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Price */}
            {hotel.minRate !== undefined && hotel.minRate > 0 && (
              <div className="text-right">
                <p className="text-lg font-bold text-text-primary leading-tight">
                  {formatCurrency(hotel.minRate, hotel.currency || "USD")}
                </p>
                <p className="text-[10px] text-text-muted">1 room x 1 night incl. taxes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomeHotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/30 animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-4" />
        <div className="flex justify-between items-end pt-3 border-t border-border/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-2 w-12 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-5 w-14 bg-gray-200 rounded mb-1 ml-auto" />
            <div className="h-2 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
