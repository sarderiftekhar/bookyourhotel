"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { FEATURED_DESTINATIONS } from "@/lib/constants";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AUTO_PLAY_INTERVAL = 5000;

// Unique images — completely different from the hero section
const DEST_IMAGES: Record<string, string> = {
  dubai: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
  london: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80",
  paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  "new-york": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  istanbul: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
};

const HEADLINES = [
  "Discover Excellence in Hospitality. Trusted Hotels You Can Rely\u00A0On",
  "Your Perfect Stay Awaits. Handpicked Hotels at Unbeatable\u00A0Prices",
  "Travel with Confidence. Premium Hotels, Effortless\u00A0Booking",
  "Where Every Journey Begins. World-Class Hotels, One\u00A0Click Away",
  "Explore the World in Comfort. Curated Stays for Every\u00A0Traveler",
  "Unforgettable Destinations. Exceptional Hotels, Extraordinary\u00A0Value",
];

const DEST_DESCRIPTIONS: Record<string, string> = {
  dubai: "Luxury towers, golden beaches, and world-class resorts await in the jewel of the Gulf.",
  london: "Historic charm meets modern elegance — boutique hotels to iconic five-star stays.",
  paris: "The City of Light offers romantic getaways, charming streets, and timeless luxury.",
  "new-york": "The city that never sleeps — vibrant neighborhoods, rooftop bars, and iconic skylines.",
  tokyo: "Ancient temples, neon-lit streets, and impeccable hospitality in every corner.",
  istanbul: "Where East meets West — bazaars, Bosphorus views, and centuries of culture.",
};

export default function PopularDestinations() {
  const [cur, setCur] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = FEATURED_DESTINATIONS.length;
  const { ref: sectionRef, isVisible } = useScrollAnimation({ rootMargin: "0px 0px -60px 0px" });

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === cur) return;
      setIsTransitioning(true);
      setCur(index);
      setProgress(0);
      clearTimers();

      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    },
    [cur, isTransitioning, clearTimers]
  );

  const goNext = useCallback(() => {
    goTo((cur + 1) % total);
  }, [cur, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((cur - 1 + total) % total);
  }, [cur, total, goTo]);

  // Auto-play with progress bar
  useEffect(() => {
    if (isPaused || !isVisible || isTransitioning) {
      clearTimers();
      return;
    }

    setProgress(0);
    const progressStep = 100 / (AUTO_PLAY_INTERVAL / 20);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + progressStep, 100));
    }, 20);

    timerRef.current = setTimeout(() => {
      goTo((cur + 1) % total);
    }, AUTO_PLAY_INTERVAL);

    return clearTimers;
  }, [cur, isPaused, isVisible, isTransitioning, total, goTo, clearTimers]);

  const nextIdx = (cur + 1) % total;
  const nextDest = FEATURED_DESTINATIONS[nextIdx];

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
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left — Featured card with stacked crossfade */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-accent/5 group">
              {/* All images pre-rendered in a stack — opacity transitions only */}
              <div className="relative h-[380px] sm:h-[440px]">
                {FEATURED_DESTINATIONS.map((d, i) => (
                  <div
                    key={d.slug}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === cur ? 1 : 0, zIndex: i === cur ? 2 : 1 }}
                  >
                    <Image
                      src={DEST_IMAGES[d.slug] || d.image}
                      alt={d.name}
                      fill
                      className={`object-cover ${i === cur && !isTransitioning ? "dest-ken-burns" : ""}`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={i < 2}
                    />
                  </div>
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Card content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                {/* Country badge — crossfade */}
                <div className="relative h-7 mb-3">
                  {FEATURED_DESTINATIONS.map((d, i) => (
                    <span
                      key={`badge-${d.slug}`}
                      className="absolute left-0 top-0 inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10 transition-all duration-500"
                      style={{
                        opacity: i === cur ? 1 : 0,
                        transform: i === cur ? "translateY(0)" : "translateY(8px)",
                      }}
                    >
                      {d.country}
                    </span>
                  ))}
                </div>

                {/* Destination name — crossfade */}
                <div className="relative h-9 sm:h-10 mb-2">
                  {FEATURED_DESTINATIONS.map((d, i) => (
                    <h3
                      key={`name-${d.slug}`}
                      className="absolute left-0 top-0 text-2xl sm:text-3xl font-bold text-white transition-all duration-500 delay-75"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        opacity: i === cur ? 1 : 0,
                        transform: i === cur ? "translateY(0)" : "translateY(12px)",
                      }}
                    >
                      {d.name}
                    </h3>
                  ))}
                </div>

                {/* Description — crossfade */}
                <div className="relative h-10 sm:h-11">
                  {FEATURED_DESTINATIONS.map((d, i) => (
                    <p
                      key={`desc-${d.slug}`}
                      className="absolute left-0 top-0 text-white/70 text-sm leading-relaxed max-w-sm transition-all duration-500 delay-100"
                      style={{
                        opacity: i === cur ? 1 : 0,
                        transform: i === cur ? "translateY(0)" : "translateY(12px)",
                      }}
                    >
                      {DEST_DESCRIPTIONS[d.slug] || `Discover premium hotels and unique stays in ${d.name}.`}
                    </p>
                  ))}
                </div>

                {/* Bottom row: counter + nav arrows */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <Link
                    href={`/hotels/${FEATURED_DESTINATIONS[cur].slug}`}
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
                        onClick={goPrev}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
                        aria-label="Previous destination"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={goNext}
                        className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
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

          {/* Right — Rotating headline + secondary card */}
          <div className="flex flex-col justify-between h-full">
            {/* Rotating headline — smooth crossfade */}
            <div className="mb-8 lg:mb-10">
              <div className="relative min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] mb-5">
                {HEADLINES.map((headline, i) => (
                  <h2
                    key={i}
                    className="absolute inset-x-0 top-0 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-accent leading-tight"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      opacity: i === cur % HEADLINES.length ? 1 : 0,
                      transform: i === cur % HEADLINES.length ? "translateY(0)" : "translateY(16px)",
                      transitionDuration: "600ms",
                      transitionProperty: "opacity, transform",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {headline}
                  </h2>
                ))}
              </div>
              <Link
                href="/hotels/dubai"
                className="inline-flex items-center gap-2 border border-accent/25 text-accent text-sm font-medium rounded-full px-5 py-2.5 hover:bg-accent/10 transition-all duration-300 group"
              >
                View All Destinations
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Secondary "Up Next" preview — fixed layout */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-accent/8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent-bright text-base font-bold">*</span>
                <span className="text-accent text-xs uppercase tracking-wider font-semibold">Up Next</span>
              </div>

              <div className="flex gap-4 items-start">
                {/* Thumbnail image — stacked crossfade */}
                <Link
                  href={`/hotels/${nextDest.slug}`}
                  className="relative flex-none w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden group"
                >
                  {FEATURED_DESTINATIONS.map((d, i) => (
                    <div
                      key={`sec-${d.slug}`}
                      className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                      style={{ opacity: i === nextIdx ? 1 : 0, zIndex: i === nextIdx ? 2 : 1 }}
                    >
                      <Image
                        src={DEST_IMAGES[d.slug] || d.image}
                        alt={d.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="140px"
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                  {/* Name label on image */}
                  <div className="absolute bottom-2 left-2 right-2 z-10">
                    <div className="relative h-5">
                      {FEATURED_DESTINATIONS.map((d, i) => (
                        <span
                          key={`sec-name-${d.slug}`}
                          className="absolute left-0 bottom-0 text-white text-xs font-bold drop-shadow-md transition-all duration-500"
                          style={{
                            opacity: i === nextIdx ? 1 : 0,
                            transform: i === nextIdx ? "translateY(0)" : "translateY(4px)",
                          }}
                        >
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="relative min-h-[80px] sm:min-h-[72px]">
                    {FEATURED_DESTINATIONS.map((d, i) => (
                      <p
                        key={`info-${d.slug}`}
                        className="absolute inset-x-0 top-0 text-text-secondary text-sm leading-relaxed transition-all duration-500"
                        style={{
                          opacity: i === nextIdx ? 1 : 0,
                          transform: i === nextIdx ? "translateY(0)" : "translateY(6px)",
                        }}
                      >
                        {DEST_DESCRIPTIONS[d.slug] || `Discover premium hotels and unique stays in ${d.name}.`}
                      </p>
                    ))}
                  </div>
                  <Link
                    href={`/hotels/${nextDest.slug}`}
                    className="inline-flex items-center gap-1.5 text-accent text-sm font-medium mt-2 hover:gap-2.5 transition-all duration-300"
                  >
                    Explore
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots with animated fill bar */}
        <div className="flex items-center justify-center gap-2.5 mt-12">
          {FEATURED_DESTINATIONS.map((d, i) => (
            <button
              key={d.slug}
              onClick={() => goTo(i)}
              className="relative rounded-full overflow-hidden transition-all duration-500 h-2"
              style={{ width: i === cur ? 40 : 8 }}
              aria-label={`Go to ${d.name}`}
            >
              <div className="absolute inset-0 bg-accent/15 rounded-full" />
              {i === cur ? (
                <div
                  className="absolute inset-y-0 left-0 bg-accent rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%`, transition: "none" }}
                />
              ) : (
                <div className="absolute inset-0 bg-accent/20 rounded-full hover:bg-accent/40 transition-colors duration-200" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
