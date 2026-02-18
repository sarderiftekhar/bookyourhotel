"use client";

import { useEffect, useRef } from "react";
import { CURRENCIES } from "@/lib/constants";
import { usePreferencesStore } from "@/store/preferencesStore";

interface CurrencySelectorProps {
  onClose: () => void;
}

export default function CurrencySelector({ onClose }: CurrencySelectorProps) {
  const { currency, setCurrency } = usePreferencesStore();
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
    setCurrency(code);
    onClose();
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-50 max-h-80 overflow-y-auto"
    >
      {CURRENCIES.map((cur) => (
        <button
          key={cur.code}
          onClick={() => handleSelect(cur.code)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-cream transition-colors flex items-center justify-between ${
            currency === cur.code ? "text-accent font-medium" : "text-text-secondary"
          }`}
        >
          <span>
            {cur.symbol} {cur.name}
          </span>
          <span className="text-text-muted text-xs">{cur.code}</span>
        </button>
      ))}
    </div>
  );
}
