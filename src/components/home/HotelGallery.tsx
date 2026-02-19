"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/* ─── slide data ─── */
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=85",
    alt: "Overwater bungalows in the Maldives with turquoise lagoon",
    heading: "Escape to Paradise",
    description:
      "Step into crystal-clear lagoons and overwater villas. The Maldives, Bora Bora, and beyond — your dream beach escape awaits.",
    cta: "Explore Beach Hotels",
    side: "left" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85",
    alt: "Luxury resort pool with palm trees at golden hour",
    heading: "Luxury Redefined",
    description:
      "Handpicked 5-star resorts with world-class service. From private pools to Michelin dining — every detail crafted for you.",
    cta: "Browse Luxury Stays",
    side: "right" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1600&q=85",
    alt: "Stunning tropical beach with palm trees and clear ocean",
    heading: "Sun, Sand & Serenity",
    description:
      "Golden sands, swaying palms, and endless horizons. Find the perfect beachfront hotel for your next unforgettable holiday.",
    cta: "Find Beach Resorts",
    side: "left" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=85",
    alt: "Elegant hotel room with ocean view and luxury furnishings",
    heading: "Unwind in Style",
    description:
      "Wake up to breathtaking ocean views from your private suite. Infinity pools, rooftop bars, and spa sanctuaries await.",
    cta: "View Resort Hotels",
    side: "right" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=85",
    alt: "Infinity pool overlooking tropical coastline at sunset",
    heading: "Your Dream Getaway",
    description:
      "From cliffside infinity pools to secluded island retreats — over 2 million hotels at prices you won't find anywhere else.",
    cta: "Start Your Journey",
    side: "left" as const,
  },
];

const INTERVAL = 5000;

export default function HotelGallery() {
  const { ref: scrollRef, isVisible } = useScrollAnimation();
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setPrevActive(active);
      setActive(idx);
      // Clear previous "leaving" state after transition completes
      setTimeout(() => setPrevActive(null), 1000);
    },
    [active]
  );

  /* auto-play */
  useEffect(() => {
    if (!isVisible) return;
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % SLIDES.length);
    }, INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, isVisible, goTo]);

  /* keyboard nav */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Only handle if section is visible in viewport
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo((active + 1) % SLIDES.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo((active - 1 + SLIDES.length) % SLIDES.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, goTo]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0f1c1a]"
      style={{ height: "clamp(500px, 80vh, 750px)" }}
    >
      {/* Invisible scroll trigger */}
      <div ref={scrollRef} className="absolute top-1/2 left-0 w-px h-px" />
      {/* ─── Slides ─── */}
      {SLIDES.map((slide, i) => {
        const isActive = i === active;
        const isLeaving = i === prevActive;
        const imageOnLeft = slide.side === "left";

        return (
          <div
            key={i}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: isActive ? 3 : isLeaving ? 2 : 1,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {/* ── Left Half ── */}
            <div
              className="skw-half skw-half--left"
              style={{
                transform: isActive
                  ? "translate3d(0,0,0)"
                  : isLeaving
                  ? "translate3d(0,0,0)"
                  : "translate3d(-32vh, 100%, 0)",
              }}
            >
              <div className="skw-skewed">
                <div
                  className={`skw-content skw-content--left ${
                    isLeaving ? "skw-content--leaving" : ""
                  }`}
                >
                  {imageOnLeft ? (
                    <div className="absolute inset-0">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        sizes="60vw"
                        priority={i < 2}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 sm:px-16 lg:px-24 text-center">
                      <h3
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {slide.heading}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
                        {slide.description}
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-accent-bright text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-accent-bright/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                      >
                        {slide.cta}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right Half ── */}
            <div
              className="skw-half skw-half--right"
              style={{
                transform: isActive
                  ? "translate3d(0,0,0)"
                  : isLeaving
                  ? "translate3d(0,0,0)"
                  : "translate3d(32vh, -100%, 0)",
              }}
            >
              <div className="skw-skewed skw-skewed--right">
                <div
                  className={`skw-content skw-content--right ${
                    isLeaving ? "skw-content--leaving" : ""
                  }`}
                >
                  {!imageOnLeft ? (
                    <div className="absolute inset-0">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        sizes="60vw"
                        priority={i < 2}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 sm:px-16 lg:px-24 text-center">
                      <h3
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {slide.heading}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
                        {slide.description}
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-accent-bright text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-accent-bright/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                      >
                        {slide.cta}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── Pagination dots ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === active
                ? "w-8 h-2.5 bg-accent-bright"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* ─── Scroll hint ─── */}
      <div className="absolute bottom-6 right-6 z-20 text-white/30 animate-bounce hidden lg:block">
        <ChevronDown size={20} />
      </div>

      {/* ─── Slide counter ─── */}
      <div className="absolute top-6 right-6 z-20 text-white/50 text-xs font-mono tracking-widest">
        {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
