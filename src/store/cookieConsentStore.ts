import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CookieConsentState {
  consent: "undecided" | "accepted" | "rejected";
  acceptAll: () => void;
  rejectAll: () => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      consent: "undecided",
      acceptAll: () => set({ consent: "accepted" }),
      rejectAll: () => set({ consent: "rejected" }),
    }),
    { name: "zzstay-cookie-consent" }
  )
);
