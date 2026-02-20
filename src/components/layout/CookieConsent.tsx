"use client";

import { useEffect, useState } from "react";
import { Cookie, Shield, X } from "lucide-react";
import { useCookieConsentStore } from "@/store/cookieConsentStore";
import { useLegalModalStore } from "@/store/legalModalStore";

export default function CookieConsent() {
  const { consent, acceptAll, rejectAll } = useCookieConsentStore();
  const openModal = useLegalModalStore((s) => s.openModal);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || consent !== "undecided" || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-hero-widget">
        {/* Header strip */}
        <div className="bg-accent px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Cookie size={18} />
            <span className="text-sm font-semibold">Cookie Preferences</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            We use cookies and similar technologies to enhance your browsing
            experience, remember your preferences (language, currency), and
            analyse site traffic. You can accept all cookies, reject
            non-essential ones, or learn more about how we use them.
          </p>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Shield size={12} className="shrink-0" />
            <span>
              Your data is protected under UK GDPR. Read our{" "}
              <button
                onClick={() => openModal("privacy")}
                className="text-accent underline hover:text-accent-hover transition-colors"
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                onClick={() => openModal("cookies")}
                className="text-accent underline hover:text-accent-hover transition-colors"
              >
                Cookie Policy
              </button>
              .
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={acceptAll}
              className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 bg-bg-cream hover:bg-border text-text-primary text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={() => openModal("cookies")}
              className="flex-1 border border-border hover:border-accent text-text-secondary hover:text-accent text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
