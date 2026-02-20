"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

const HOTEL_CHAINS = [
  { name: "Marriott", logo: "/images/hotel-chains/marriott.svg" },
  { name: "Hilton", logo: "/images/hotel-chains/hilton.svg" },
  { name: "Hyatt", logo: "/images/hotel-chains/hyatt.svg" },
  { name: "IHG", logo: "/images/hotel-chains/ihg.svg" },
  { name: "Accor", logo: "/images/hotel-chains/accor.svg" },
  { name: "Wyndham", logo: "/images/hotel-chains/wyndham.svg" },
  { name: "Best Western", logo: "/images/hotel-chains/bestwestern.svg" },
  { name: "Radisson", logo: "/images/hotel-chains/radisson.svg" },
  { name: "Four Seasons", logo: "/images/hotel-chains/fourseasons.svg" },
  { name: "Shangri-La", logo: "/images/hotel-chains/shangri-la.svg" },
];

export default function Newsletter() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  }

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div ref={ref} className={`text-center mb-16 ${isVisible ? "animate-fade-up" : "scroll-hidden"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
            Explore Hotels
            <ArrowRight size={12} />
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Discover top hotel options nearby
            <br />
            <span className="text-accent">Effortless hotel booking,</span> tailored for you
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mb-10 max-w-xl mx-auto">
            {t("newsletterSubtitle")}
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 py-4 px-8 bg-success/10 text-success rounded-full text-sm font-medium">
              <CheckCircle size={18} />
              Thank you for subscribing!
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="flex-1 px-6 py-3.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent shadow-sm"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                  Get started
                  <ArrowRight size={16} />
                </button>
              </form>
              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Pause or cancel anytime.
              </p>
            </div>
          )}
        </div>

        {/* Hotel Chain Logos Marquee */}
        <div className="relative overflow-hidden py-8 border-t border-border/50">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10" />

          <div className="flex animate-marquee">
            {["a", "b"].map((copy) =>
              HOTEL_CHAINS.map((chain) => (
                <div
                  key={`${copy}-${chain.name}`}
                  className="flex-none px-8 sm:px-12 flex items-center justify-center"
                >
                  <Image
                    src={chain.logo}
                    alt={chain.name}
                    width={140}
                    height={40}
                    className="h-8 sm:h-10 w-auto opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
