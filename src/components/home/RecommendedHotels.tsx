"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import HomeHotelCard, { HomeHotelCardSkeleton } from "./HomeHotelCard";

interface Hotel {
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
}

export default function RecommendedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = usePreferencesStore();
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  useEffect(() => {
    let cancelled = false;

    async function fetchHotels() {
      try {
        const res = await fetch(`/api/hotels/recommended?currency=${currency}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json.data?.length) {
          setHotels(json.data);
        }
      } catch {
        // Silently fail — section just won't show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHotels();
    return () => { cancelled = true; };
  }, [currency]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 380;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  // Don't render if no hotels and done loading
  if (!loading && hotels.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-up" : "scroll-hidden"}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Recommended hotels
          </h2>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border/50 hover:border-accent/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={18} className="text-text-secondary" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border/50 hover:border-accent/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={18} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <HomeHotelCardSkeleton />
                </div>
              ))
            : hotels.map((hotel) => (
                <div
                  key={hotel.hotelId}
                  className="shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <HomeHotelCard hotel={hotel} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
