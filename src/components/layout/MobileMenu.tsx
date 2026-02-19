"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { X } from "lucide-react";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const t = useTranslations("nav");

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 border-0 cursor-default" onClick={onClose} />

      {/* Menu panel */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            <span className="text-accent">ZZ</span>Stay
          </span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          <Link
            href="/"
            onClick={onClose}
            className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors"
          >
            {t("contact")}
          </Link>
        </nav>
      </div>
    </div>
  );
}
