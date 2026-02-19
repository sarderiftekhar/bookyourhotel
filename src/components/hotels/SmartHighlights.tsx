"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { extractHighlights } from "@/lib/highlightExtractor";

interface SmartHighlightsProps {
  hotelName: string;
  description: string;
  facilities: string[];
  starRating: number;
  city: string;
}

export default function SmartHighlights({
  hotelName,
  description,
  facilities,
  starRating,
  city,
}: SmartHighlightsProps) {
  const t = useTranslations("hotel");

  const highlights = useMemo(
    () =>
      extractHighlights({
        hotelName,
        description,
        facilities,
        starRating,
        city,
      }),
    [hotelName, description, facilities, starRating, city]
  );

  if (highlights.length === 0) return null;

  return (
    <div>
      <h2
        className="text-xl font-bold text-text-primary mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("smartHighlights")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-xl bg-gradient-to-br from-accent-bright/30 via-accent-bright/10 to-star/20 p-[1px] transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              <div className="bg-white rounded-[11px] p-5 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/8 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-accent/15">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-text-primary mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
