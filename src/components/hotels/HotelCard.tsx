"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useSearchStore } from "@/store/searchStore";
import Badge from "@/components/ui/Badge";

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
  };
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const t = useTranslations("common");
  const { currency } = usePreferencesStore();
  const { checkIn, checkOut } = useSearchStore();

  const displayCurrency = hotel.currency || currency;

  return (
    <Link
      href={`/hotel/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`}
      className="group block"
    >
      <div className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
            {hotel.main_photo ? (
              <Image
                src={hotel.main_photo}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-bg-cream flex items-center justify-center">
                <span className="text-text-muted text-sm">No image</span>
              </div>
            )}
            {hotel.starRating && (
              <div className="absolute top-3 left-3 flex items-center gap-0.5 bg-white/90 rounded-full px-2 py-1">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-star text-star" />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h3
                className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {hotel.name}
              </h3>
              {(hotel.city || hotel.address) && (
                <div className="flex items-center gap-1 text-text-muted text-sm mb-2">
                  <MapPin size={14} />
                  {hotel.city}{hotel.country ? `, ${hotel.country.length <= 3 ? hotel.country.toUpperCase() : hotel.country}` : ""}
                </div>
              )}

              {/* Board type badge */}
              <div className="flex flex-wrap gap-2 mt-2">
                {hotel.boardName && (
                  <Badge>{hotel.boardName}</Badge>
                )}
                {hotel.cancellationPolicy === "FREE_CANCELLATION" && (
                  <Badge variant="success">Free Cancellation</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between mt-4 pt-3 border-t border-border/50">
              <div>
                {hotel.reviewScore && (
                  <div className="flex items-center gap-1.5">
                    <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
                      {hotel.reviewScore.toFixed(1)}
                    </span>
                    {hotel.reviewCount && (
                      <span className="text-xs text-text-muted">
                        ({hotel.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
              {hotel.minRate !== undefined && (
                <div className="text-right">
                  <div className="text-xs text-text-muted mb-0.5">from</div>
                  <div className="text-xl font-bold text-accent">
                    {formatCurrency(hotel.minRate, displayCurrency)}
                  </div>
                  <div className="text-xs text-text-muted">{t("perNight")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
