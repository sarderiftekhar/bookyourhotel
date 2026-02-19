"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { detectCurrencyFromBrowser } from "@/lib/detectCurrency";

interface PreferencesState {
  currency: string;
  _hasUserChoice: boolean;
  setCurrency: (currency: string) => void;
  initCurrencyFromBrowser: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,
      _hasUserChoice: false,

      setCurrency: (currency) => set({ currency, _hasUserChoice: true }),

      initCurrencyFromBrowser: () => {
        if (get()._hasUserChoice) return;
        const detected = detectCurrencyFromBrowser();
        if (detected) {
          set({ currency: detected });
        }
      },
    }),
    { name: "bookyourhotel-preferences" }
  )
);
