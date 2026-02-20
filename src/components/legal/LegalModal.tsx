"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function LegalModal({
  isOpen,
  onClose,
  title,
  children,
}: LegalModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      contentRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2
            className="text-xl sm:text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-bg-cream hover:bg-border flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-6 text-sm text-text-secondary leading-relaxed space-y-5"
        >
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-cream/50 shrink-0">
          <p className="text-xs text-text-muted text-center">
            Operated by Unique Evolution Limited &middot; Willett House, Queens
            Road West, London, United Kingdom
          </p>
        </div>
      </div>
    </div>
  );
}
