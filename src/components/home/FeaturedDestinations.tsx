"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FeaturedDestinations() {
  const t = useTranslations("home");
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  // Pick 2 featured destinations for the staggered cards
  const featured = FEATURED_DESTINATIONS.slice(0, 2);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column — About text */}
          <div ref={leftRef} className={leftVisible ? "animate-fade-up" : "scroll-hidden"}>
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
              About Us
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("featuredTitle")}
            </h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {t("featuredSubtitle")}
            </p>
            <Link
              href="/hotels/dubai"
              className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all duration-300 group"
            >
              Explore Destinations
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Right Column — Staggered image cards */}
          <div ref={rightRef} className={`relative ${rightVisible ? "animate-fade-up" : "scroll-hidden"}`} style={{ animationDelay: "0.15s" }}>
            <div className="grid grid-cols-2 gap-4">
              {/* Larger card — top left */}
              <Link
                href={`/hotels/${featured[0].slug}`}
                className="group relative overflow-hidden rounded-2xl h-72 sm:h-80 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <Image
                  src={featured[0].image}
                  alt={featured[0].name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                    <MapPin size={12} />
                    {featured[0].country}
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {featured[0].name}
                  </h3>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </Link>

              {/* Smaller card — offset down on right */}
              <Link
                href={`/hotels/${featured[1].slug}`}
                className="group relative overflow-hidden rounded-2xl h-72 sm:h-80 mt-8 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <Image
                  src={featured[1].image}
                  alt={featured[1].name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                    <MapPin size={12} />
                    {featured[1].country}
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {featured[1].name}
                  </h3>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
