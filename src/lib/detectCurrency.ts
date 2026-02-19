import { CURRENCIES, COUNTRY_TO_CURRENCY, LANG_TO_CURRENCY } from "./constants";

const supportedCodes = new Set<string>(CURRENCIES.map((c) => c.code));

/**
 * Detect the user's likely currency from their browser locale.
 * Uses navigator.language (e.g. "fr-FR", "ar-SA", "en-US", "ja")
 * and maps the country/language to a supported currency.
 * Returns null if no match found (caller should fall back to USD).
 */
export function detectCurrencyFromBrowser(): string | null {
  if (typeof navigator === "undefined") return null;

  const locale = navigator.language || navigator.languages?.[0];
  if (!locale) return null;

  const parts = locale.split("-");
  const lang = parts[0]?.toLowerCase();
  const country = parts[1]?.toUpperCase();

  // Try country code first (most accurate: "en-GB" → GBP, "fr-FR" → EUR)
  if (country) {
    const cur = COUNTRY_TO_CURRENCY[country];
    if (cur && supportedCodes.has(cur)) return cur;
  }

  // Fallback to language-only mapping (e.g. "ar" → AED, "ja" → JPY)
  if (lang) {
    const cur = LANG_TO_CURRENCY[lang];
    if (cur && supportedCodes.has(cur)) return cur;
  }

  return null;
}
