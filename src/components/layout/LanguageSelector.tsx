"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { LANGUAGES } from "@/lib/constants";
import { useEffect, useRef } from "react";

interface LanguageSelectorProps {
  onClose: () => void;
}

export default function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  function handleSelect(code: string) {
    router.replace(pathname, { locale: code as "en" | "es" | "fr" | "de" | "ar" });
    onClose();
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2 z-50"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-cream transition-colors ${
            locale === lang.code ? "text-accent font-medium" : "text-text-secondary"
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
