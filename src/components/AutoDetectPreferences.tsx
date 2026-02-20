"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/preferencesStore";

export default function AutoDetectPreferences() {
  useEffect(() => {
    const store = usePreferencesStore.getState();
    // Instant: set currency from browser locale
    store.initCurrencyFromBrowser();
    // Then refine with IP-based geolocation (more accurate)
    store.initCurrencyFromGeo();
  }, []);

  return null;
}
