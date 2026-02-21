"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    location: "London, UK",
    rating: 5,
    text: "Found the exact same hotel room for 30% less than what I was about to book on another site. BookYourHotel is my go-to now!",
    avatar: "SM",
    hotel: "The Ritz London",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  },
  {
    name: "Ahmed Khan",
    location: "Dubai, UAE",
    rating: 5,
    text: "The search is incredibly fast and the booking process was seamless. I saved over $200 on my family vacation to the Maldives.",
    avatar: "AK",
    hotel: "Jumeirah Beach Hotel",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
  },
  {
    name: "Marie Laurent",
    location: "Paris, France",
    rating: 5,
    text: "Love the price comparison feature. It's great to see all options in one place. The interface is beautiful and easy to use.",
    avatar: "ML",
    hotel: "Le Bristol Paris",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    text: "Booked a stunning ryokan through BookYourHotel at an unbeatable price. The whole experience from search to check-in was flawless.",
    avatar: "YT",
    hotel: "Aman Tokyo",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  },
  {
    name: "Carlos Rivera",
    location: "Barcelona, Spain",
    rating: 5,
    text: "I travel frequently for work and BookYourHotel consistently finds me the best deals. Already recommended it to my whole team.",
    avatar: "CR",
    hotel: "Hotel Arts Barcelona",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  },
  {
    name: "Elena Rossi",
    location: "Rome, Italy",
    rating: 5,
    text: "Incredible savings on a 5-star hotel in Santorini. The photos matched reality perfectly and check-in was a breeze.",
    avatar: "ER",
    hotel: "Belmond Hotel Caruso",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    name: "James Cooper",
    location: "Sydney, Australia",
    rating: 5,
    text: "Used BookYourHotel for our honeymoon trip across Southeast Asia. Every single booking was perfect and well below market price.",
    avatar: "JC",
    hotel: "Park Hyatt Sydney",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
  {
    name: "Fatima Al-Sayed",
    location: "Doha, Qatar",
    rating: 5,
    text: "The currency conversion feature is so convenient. I always know exactly what I'm paying. Customer support was also very responsive.",
    avatar: "FA",
    hotel: "The St. Regis Doha",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  },
  {
    name: "Thomas Berg",
    location: "Stockholm, Sweden",
    rating: 5,
    text: "Booked a last-minute trip to Iceland and found availability everywhere. The filtering options made it so easy to find what I needed.",
    avatar: "TB",
    hotel: "Grand Hotel Stockholm",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
  },
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "My family of six found the perfect suite at half the price we expected. BookYourHotel has become essential for our travel planning.",
    avatar: "PS",
    hotel: "Taj Mahal Palace",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  },
  {
    name: "Liam O'Brien",
    location: "Dublin, Ireland",
    rating: 5,
    text: "Spontaneous weekend getaway to Edinburgh sorted in minutes. Great selection of boutique hotels I wouldn't have found elsewhere.",
    avatar: "LO",
    hotel: "The Shelbourne Dublin",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  },
  {
    name: "Sofia Andersson",
    location: "Gothenburg, Sweden",
    rating: 5,
    text: "The mobile experience is flawless. I booked our entire Mediterranean cruise hotel stops from my phone while commuting.",
    avatar: "SA",
    hotel: "Hotel & Spa Nääs Fabriker",
    image: "https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800&q=80",
  },
  {
    name: "David Chen",
    location: "Vancouver, Canada",
    rating: 5,
    text: "Compared prices across 5 platforms before finding BookYourHotel. Consistently 15-25% cheaper for the same rooms. Never looking back.",
    avatar: "DC",
    hotel: "Fairmont Pacific Rim",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  },
  {
    name: "Amara Osei",
    location: "Accra, Ghana",
    rating: 5,
    text: "Finally a booking platform that works well for African destinations too. Found amazing deals in Cape Town and Marrakech.",
    avatar: "AO",
    hotel: "Kempinski Gold Coast",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  },
  {
    name: "Isabella Martinez",
    location: "Mexico City, Mexico",
    rating: 5,
    text: "The free cancellation policy gave me peace of mind. When my plans changed, I rebooked instantly with zero hassle.",
    avatar: "IM",
    hotel: "Four Seasons Mexico City",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  },
];

export default function Testimonials() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setActive(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const next = useCallback(() => {
    goTo(active < TESTIMONIALS.length - 1 ? active + 1 : 0);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo(active > 0 ? active - 1 : TESTIMONIALS.length - 1);
  }, [active, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Auto-scroll preview to keep active thumbnail centered
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;
    const thumb = container.children[active] as HTMLElement | undefined;
    if (!thumb) return;
    const containerW = container.offsetWidth;
    const thumbLeft = thumb.offsetLeft;
    const thumbW = thumb.offsetWidth;
    const scrollTarget = thumbLeft - containerW / 2 + thumbW / 2;
    container.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [active]);

  const scrollPreview = (direction: "left" | "right") => {
    const container = previewRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const current = TESTIMONIALS[active];

  return (
    <section className="py-16 sm:py-20 bg-accent relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-bright/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-bright/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none" />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-12 ${sectionVisible ? "animate-fade-up" : "scroll-hidden"}`}>
          <span className="inline-block px-4 py-1.5 bg-white/8 text-accent-bright text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full mb-4 border border-white/10">
            Testimonials
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Guests Say
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto">
            Real experiences from travellers who booked with us
          </p>
        </div>

        {/* Main testimonial — two-column with arch image */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${sectionVisible ? "animate-fade-up stagger-2" : "scroll-hidden"}`} style={{ animationFillMode: "both" }}>
          {/* Left — Arch-framed hotel image */}
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[380px]">
            {/* Border frame around the image */}
            <div className="rounded-t-full rounded-b-2xl p-[6px]" style={{ backgroundColor: "#024C61" }}>
              <div className="relative overflow-hidden rounded-t-full rounded-b-xl aspect-3/4">
                {TESTIMONIALS.map((t, i) => (
                  <div
                    key={t.name}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{
                      backgroundImage: `url(${t.image})`,
                      opacity: i === active ? 1 : 0,
                      transform: i === active ? "scale(1)" : "scale(1.05)",
                    }}
                  />
                ))}
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Hotel name tag */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3.5 py-2 shadow-lg">
                    <p className="text-[9px] text-text-muted font-medium uppercase tracking-wider">Stayed at</p>
                    <p className="text-xs font-bold text-text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                      {current.hotel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Testimonial content */}
          <div className="flex flex-col justify-center">
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-star text-star" />
              ))}
            </div>

            {/* Quote */}
            <div className="relative mb-6">
              {TESTIMONIALS.map((t, i) => (
                <p
                  key={t.name}
                  className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed transition-all duration-500 absolute top-0 left-0"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(12px)",
                    position: i === active ? "relative" : "absolute",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
              ))}
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-full bg-accent-bright/20 border-2 border-accent-bright/30 flex items-center justify-center text-accent-bright text-xs font-bold">
                {current.avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{current.name}</p>
                <p className="text-white/40 text-xs">{current.location}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight size={15} />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5 ml-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 bg-accent-bright"
                        : "w-1 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — scrollable preview strip with arrows */}
        <div className={`mt-10 relative max-w-[1400px] mx-auto ${sectionVisible ? "animate-fade-up stagger-3" : "scroll-hidden"}`} style={{ animationFillMode: "both" }}>
          {/* Layout: arrow | scrollable area | arrow */}
          <div className="flex items-center gap-2">
            {/* Left arrow */}
            <button
              onClick={() => scrollPreview("left")}
              className="flex-none w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
              aria-label="Scroll previews left"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Scrollable area with fade edges */}
            <div className="relative flex-1 min-w-0 overflow-hidden">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-accent via-accent/50 to-transparent z-5 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-accent via-accent/50 to-transparent z-5 pointer-events-none" />

              <div
                ref={previewRef}
                className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => goTo(i)}
                className={`group relative overflow-hidden rounded-lg flex-none w-[120px] sm:w-[140px] aspect-square transition-all duration-300 ${
                  i === active
                    ? "ring-2 ring-accent-bright ring-offset-1 ring-offset-accent scale-[1.03]"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${t.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="text-white text-[9px] font-semibold truncate">{t.name}</p>
                </div>
              </button>
            ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollPreview("right")}
              className="flex-none w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
              aria-label="Scroll previews right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
