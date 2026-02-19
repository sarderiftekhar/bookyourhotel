"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/preferencesStore";

export default function AutoDetectPreferences() {
  useEffect(() => {
    usePreferencesStore.getState().initCurrencyFromBrowser();
  }, []);

  return null;
}
