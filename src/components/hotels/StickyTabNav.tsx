"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface TabSection {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface StickyTabNavProps {
  activeSection: string;
  sections: TabSection[];
  lowestPrice: number;
  currency: string;
  onSelectRoom: () => void;
}

export default function StickyTabNav({
  activeSection,
  sections,
  lowestPrice,
  currency,
  onSelectRoom,
}: StickyTabNavProps) {
  const t = useTranslations("hotel");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect when the nav becomes sticky
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector(`[data-section="${activeSection}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeSection]);

  function handleClick(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* Sentinel element to detect when nav leaves viewport */}
      <div ref={sentinelRef} className="h-0" />

      <div
        className={`sticky top-[64px] sm:top-[72px] z-30 bg-white transition-shadow duration-200 ${
          isSticky ? "shadow-md border-b border-border" : "border-b border-border"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Scrollable tabs */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2"
          >
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  data-section={section.id}
                  onClick={() => handleClick(section.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-bg-cream hover:text-text-primary"
                  }`}
                >
                  <Icon size={15} />
                  <span>{t(section.label)}</span>
                  {section.count !== undefined && section.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-bg-cream text-text-muted"
                      }`}
                    >
                      {section.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA */}
          {lowestPrice > 0 && (
            <div className="hidden sm:flex items-center gap-3 shrink-0 pl-4">
              <div className="text-right">
                <p className="text-xs text-text-muted">{t("from")}</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(lowestPrice, currency)}
                  <span className="text-xs font-normal text-text-muted">{t("perNight")}</span>
                </p>
              </div>
              <button
                onClick={onSelectRoom}
                className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {t("selectRoom")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
