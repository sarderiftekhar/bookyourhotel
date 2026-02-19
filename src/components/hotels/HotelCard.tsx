"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Star, Wifi, Heart } from "lucide-react";
import { formatCurrency, getStarRatingText } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useSearchStore } from "@/store/searchStore";

interface HotelCardProps {
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
    boardName?: string;
    cancellationPolicy?: string;
    description?: string;
  };
}

function getRatingColor(score: number) {
  if (score >= 8.5) return "bg-accent";
  if (score >= 7) return "bg-accent";
  if (score >= 5) return "bg-accent-light";
  return "bg-text-muted";
}

function getRatingLabel(score: number) {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Very Good";
  if (score >= 6) return "Good";
  return "Pleasant";
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const t = useTranslations("common");
  const ts = useTranslations("search");
  const { currency } = usePreferencesStore();
  const { checkIn, checkOut } = useSearchStore();

  const displayCurrency = hotel.currency || currency;
  const ratingLabel = hotel.reviewScore ? (getStarRatingText(hotel.reviewScore) || getRatingLabel(hotel.reviewScore)) : "";
  const isFreeCancellation = hotel.cancellationPolicy === "FREE_CANCELLATION";

  return (
    <Link
      href={`/hotel/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`}
      className="group block min-w-0"
    >
      <div className="bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row min-w-0">
          {/* Image */}
          <div className="relative w-full sm:w-52 lg:w-64 h-52 sm:h-auto sm:min-h-[220px] shrink-0 overflow-hidden">
            {hotel.main_photo ? (
              <Image
                src={hotel.main_photo}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-accent/10 via-accent/5 to-bg-cream flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin size={20} className="text-accent/40" />
                </div>
                <span className="text-text-muted/60 text-xs">{ts("photoUnavailable")}</span>
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer active:scale-95"
            >
              <Heart size={18} className="text-text-muted hover:text-red-400 transition-colors" />
            </button>

            {/* Free cancellation badge on image */}
            {isFreeCancellation && (
              <div className="absolute bottom-3 left-3 bg-success/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                {ts("freeCancellationLabel")}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              {/* Left: Hotel info */}
              <div className="flex-1 min-w-0">
                {/* Name + Stars */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3
                    className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-200 leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {hotel.name}
                  </h3>
                  {hotel.starRating && hotel.starRating > 0 && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-star text-star" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                {(hotel.city || hotel.address) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="truncate">
                      {hotel.address ? `${hotel.address}, ` : ""}
                      {hotel.city}
                      {hotel.country ? `, ${hotel.country}` : ""}
                    </span>
                    <span className="text-accent font-bold hover:underline ml-1 shrink-0 cursor-pointer">
                      {ts("showOnMap")}
                    </span>
                  </div>
                )}

                {/* Amenity tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/8 px-3 py-1.5 rounded-full">
                    <Wifi size={12} />
                    {ts("freeWifi")}
                  </span>
                  {hotel.boardName && hotel.boardName !== "Room Only" && (
                    <span className="text-xs font-medium text-text-primary bg-bg-cream px-3 py-1.5 rounded-full">
                      {hotel.boardName}
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                {hotel.description && (
                  <p className="text-sm text-text-secondary leading-relaxed mt-3 line-clamp-2">
                    {hotel.description}
                  </p>
                )}
              </div>

              {/* Right: Review score */}
              {hotel.reviewScore && hotel.reviewScore > 0 && (
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p className="text-xs font-bold text-text-primary">{ratingLabel}</p>
                      {hotel.reviewCount && (
                        <p className="text-[11px] text-text-muted font-medium">
                          {hotel.reviewCount.toLocaleString()} {ts("reviewsLabel")}
                        </p>
                      )}
                    </div>
                    <span className={`${getRatingColor(hotel.reviewScore)} text-white text-sm font-bold w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg`}>
                      {hotel.reviewScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: Price + CTA */}
            <div className="mt-auto pt-4 flex items-end justify-end gap-4 border-t border-border/30">
              {hotel.minRate !== undefined && hotel.minRate > 0 && (
                <div className="text-right">
                  <p className="text-xs text-text-muted">{ts("fromLabel")}</p>
                  <p className="text-2xl font-bold text-text-primary leading-tight">
                    {formatCurrency(hotel.minRate, displayCurrency)}
                  </p>
                  <p className="text-xs text-text-muted">{t("perNight")}</p>
                </div>
              )}
              <button
                onClick={(e) => e.preventDefault()}
                className="bg-accent hover:bg-accent-hover active:scale-95 text-white text-sm font-bold px-7 py-3 rounded-full transition-all duration-200 cursor-pointer shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
              >
                {ts("showPrices")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
