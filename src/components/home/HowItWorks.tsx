"use client";

import { useTranslations } from "next-intl";
import { Search, GitCompare, CreditCard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HowItWorks() {
  const t = useTranslations("home");
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      description: t("step1Desc"),
      number: "01",
    },
    {
      icon: GitCompare,
      title: t("step2Title"),
      description: t("step2Desc"),
      number: "02",
    },
    {
      icon: CreditCard,
      title: t("step3Title"),
      description: t("step3Desc"),
      number: "03",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center mb-16 ${headerVisible ? "animate-fade-up" : "scroll-hidden"}`}>
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
            Simple Process
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("howItWorksTitle")}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`group text-center ${
                gridVisible ? `animate-fade-up stagger-${index + 1}` : "scroll-hidden"
              }`}
              style={{ animationFillMode: "both" }}
            >
              {/* Icon with teal tint background */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <step.icon size={32} className="text-accent" />
              </div>

              {/* Step number */}
              <span className="text-accent/30 text-xs font-bold tracking-widest mb-3 block">
                STEP {step.number}
              </span>

              <h3
                className="text-xl font-bold text-text-primary mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
