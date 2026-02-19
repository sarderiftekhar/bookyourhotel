"use client";

import { useState, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function PopularDestinations() {
  const [cur, setCur] = useState(0);
  const total = FEATURED_DESTINATIONS.length;
  const { ref: sectionRef, isVisible } = useScrollAnimation({ rootMargin: "0px 0px -60px 0px" });

  const next = useCallback(() => setCur((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCur((p) => (p - 1 + total) % total), [total]);

  const dest = FEATURED_DESTINATIONS[cur];
  // Next destination for the secondary preview
  const nextDest = FEATURED_DESTINATIONS[(cur + 1) % total];

  return (
    <section className="py-20 sm:py-28 bg-[#E6F5F2] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div
        ref={sectionRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-up" : "scroll-hidden"}`}
      >
        {/* Top row: label + category tags */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-bright/20 flex items-center justify-center">
              <MapPin size={14} className="text-accent-bright" />
            </div>
            <span className="text-accent/60 text-sm font-medium uppercase tracking-widest">
              Popular Destinations
            </span>
          </div>
          <div className="flex items-center gap-2">
            {["All", "Europe", "Asia", "Americas"].map((tag) => (
              <button
                key={tag}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  tag === "All"
                    ? "bg-accent text-white"
                    : "border border-accent/20 text-accent/60 hover:bg-accent/10 hover:text-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — Featured card with slider */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-accent/5 group">
              {/* Main image */}
              <div className="relative h-[380px] sm:h-[440px] overflow-hidden">
                <Image
                  key={dest.slug}
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              {/* Card content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10">
                    {dest.country}
                  </span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {dest.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                  Discover premium hotels and unique stays in {dest.name}. From luxury resorts to boutique hideaways.
                </p>

                {/* Bottom row: counter + nav arrows */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <Link
                    href={`/hotels/${dest.slug}`}
                    className="inline-flex items-center gap-2 text-white text-sm font-medium hover:gap-3 transition-all duration-300"
                  >
                    See Details
                    <ArrowRight size={14} />
                  </Link>
                  <div className="flex items-center gap-4">
                    <span className="text-white/40 text-sm tabular-nums">
                      <span className="text-white font-semibold">{cur + 1}</span> / {total}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prev}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                        aria-label="Previous destination"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={next}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                        aria-label="Next destination"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Headline + secondary card */}
          <div className="flex flex-col justify-between h-full">
            {/* Headline */}
            <div className="mb-8 lg:mb-10">
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-accent leading-tight mb-5"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Discover Excellence in Hospitality. Trusted Hotels You Can Rely&nbsp;On
              </h2>
              <Link
                href="/hotels/dubai"
                className="inline-flex items-center gap-2 border border-accent/25 text-accent text-sm font-medium rounded-full px-5 py-2.5 hover:bg-accent/10 transition-all duration-300 group"
              >
                View All Destinations
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Secondary preview card */}
            <div className="flex gap-5 items-stretch">
              {/* Small image */}
              <Link
                href={`/hotels/${nextDest.slug}`}
                className="relative flex-none w-36 sm:w-44 rounded-2xl overflow-hidden group"
              >
                <div className="relative h-full min-h-[180px]">
                  <Image
                    key={nextDest.slug}
                    src={nextDest.image}
                    alt={nextDest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="180px"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white text-sm font-bold">{nextDest.name}</span>
                  </div>
                </div>
              </Link>

              {/* Info text */}
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent-bright text-lg">*</span>
                    <span className="text-accent/40 text-xs uppercase tracking-wider font-medium">Up Next</span>
                  </div>
                  <p className="text-accent/50 text-sm leading-relaxed">
                    Our top-tier hotels offer a comprehensive range of services, including premium amenities, personalized concierge, and 24/7 guest support.
                  </p>
                </div>
                <Link
                  href={`/hotels/${nextDest.slug}`}
                  className="mt-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-bright transition-all duration-300 shrink-0"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {FEATURED_DESTINATIONS.map((d, i) => (
            <button
              key={d.slug}
              onClick={() => setCur(i)}
              className={`rounded-full transition-all duration-300 ${
                i === cur
                  ? "w-8 h-2 bg-accent"
                  : "w-2 h-2 bg-accent/20 hover:bg-accent/40"
              }`}
              aria-label={`Go to ${FEATURED_DESTINATIONS[i].name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
