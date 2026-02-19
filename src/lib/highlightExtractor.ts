import { MapPin, Building, Utensils, Waves, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HighlightCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ExtractParams {
  hotelName: string;
  description: string;
  facilities: string[];
  starRating: number;
  city: string;
}

const LOCATION_KEYWORDS = [
  "city center", "city centre", "downtown", "waterfront", "beachfront",
  "seafront", "harbour", "harbor", "marina", "old town", "historic",
  "central", "walking distance", "steps from", "minutes from",
  "close to", "near", "opposite", "overlooking", "heart of",
];

const LUXURY_KEYWORDS = [
  "luxury", "elegant", "boutique", "premium", "exclusive", "five-star",
  "5-star", "sophisticated", "refined", "opulent", "grand", "prestigious",
  "designer", "marble", "stylish", "contemporary", "modern", "spacious",
];

const DINING_KEYWORDS = [
  "restaurant", "dining", "breakfast", "brunch", "bar", "lounge",
  "fine dining", "rooftop bar", "cocktail", "cuisine", "chef",
  "michelin", "gourmet", "culinary", "afternoon tea",
];

const WELLNESS_KEYWORDS = [
  "spa", "wellness", "pool", "fitness", "gym", "sauna", "steam room",
  "massage", "jacuzzi", "yoga", "health club", "relaxation",
];

function matchKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

function buildDescription(text: string, keywords: string[], maxLen = 100): string {
  const lower = text.toLowerCase();
  const sentences = text.replace(/<[^>]*>/g, "").split(/[.!?]+/).filter((s) => s.trim().length > 20);

  for (const sentence of sentences) {
    const sentLower = sentence.toLowerCase();
    if (keywords.some((kw) => sentLower.includes(kw))) {
      const trimmed = sentence.trim();
      if (trimmed.length <= maxLen) return trimmed + ".";
      return trimmed.substring(0, maxLen).trim() + "...";
    }
  }

  return "";
}

export function extractHighlights({
  hotelName,
  description,
  facilities,
  starRating,
  city,
}: ExtractParams): HighlightCard[] {
  const plainDesc = description.replace(/<[^>]*>/g, "");
  const allText = `${plainDesc} ${facilities.join(" ")}`;
  const highlights: HighlightCard[] = [];

  // 1. Location highlight
  const locationScore = matchKeywords(allText, LOCATION_KEYWORDS);
  if (locationScore > 0 || city) {
    const desc =
      buildDescription(plainDesc, LOCATION_KEYWORDS) ||
      `Ideally situated in ${city || "the city"}, offering easy access to local attractions and transport.`;
    highlights.push({
      icon: MapPin,
      title: city ? `Great location in ${city}` : "Prime Location",
      description: desc,
    });
  }

  // 2. Accommodation / luxury highlight
  const luxuryScore = matchKeywords(allText, LUXURY_KEYWORDS);
  if (luxuryScore > 0 || starRating >= 4) {
    const desc =
      buildDescription(plainDesc, LUXURY_KEYWORDS) ||
      `${hotelName} offers ${starRating >= 4 ? "premium" : "comfortable"} accommodation with thoughtful amenities for a memorable stay.`;
    highlights.push({
      icon: Building,
      title: starRating >= 4 ? "Premium Accommodation" : "Comfortable Stay",
      description: desc,
    });
  }

  // 3. Dining or Wellness highlight (whichever is stronger)
  const diningScore = matchKeywords(allText, DINING_KEYWORDS);
  const wellnessScore = matchKeywords(allText, WELLNESS_KEYWORDS);

  if (diningScore >= wellnessScore && diningScore > 0) {
    const desc =
      buildDescription(plainDesc, DINING_KEYWORDS) ||
      "Enjoy exceptional dining options with a variety of cuisines and experiences.";
    highlights.push({
      icon: Utensils,
      title: "Dining & Drinks",
      description: desc,
    });
  } else if (wellnessScore > 0) {
    const desc =
      buildDescription(plainDesc, WELLNESS_KEYWORDS) ||
      "Relax and rejuvenate with wellness facilities designed for your comfort.";
    highlights.push({
      icon: Waves,
      title: "Wellness & Relaxation",
      description: desc,
    });
  }

  // If we have fewer than 3, add a generic one
  if (highlights.length < 3) {
    if (highlights.length < 3 && diningScore > 0 && !highlights.some((h) => h.title.includes("Dining"))) {
      highlights.push({
        icon: Utensils,
        title: "Dining & Drinks",
        description: buildDescription(plainDesc, DINING_KEYWORDS) || "On-site dining available for guests.",
      });
    }
    if (highlights.length < 3 && wellnessScore > 0 && !highlights.some((h) => h.title.includes("Wellness"))) {
      highlights.push({
        icon: Waves,
        title: "Wellness & Relaxation",
        description: buildDescription(plainDesc, WELLNESS_KEYWORDS) || "Wellness facilities available for guests.",
      });
    }
    if (highlights.length < 3) {
      highlights.push({
        icon: Heart,
        title: "Guest Favourite",
        description: `${hotelName} is a popular choice among travellers for its quality and service.`,
      });
    }
  }

  return highlights.slice(0, 3);
}
