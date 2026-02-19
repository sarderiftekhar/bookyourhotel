"use client";

import { useMemo, useState } from "react";
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Wind,
  Tv,
  ShieldCheck,
  Coffee,
  Bath,
  Building,
  Baby,
  Accessibility,
  Leaf,
  Flame,
  ParkingCircle,
  Bike,
  ConciergeBell,
  Shirt,
  Gamepad2,
  HeartPulse,
  Sun,
  Umbrella,
  Dog,
  Gem,
  BedDouble,
  Cigarette,
  Zap,
  TreePine,
  Flower2,
  Globe,
  Phone,
  Luggage,
  DoorOpen,
  Users,
  Utensils,
  ChevronDown,
  Check,
  type LucideIcon,
} from "lucide-react";

interface AmenitiesListProps {
  amenities: string[];
  compact?: boolean;
}

interface CategoryDef {
  label: string;
  icon: LucideIcon;
  keywords: string[];
}

const CATEGORIES: Record<string, CategoryDef> = {
  wellness: {
    label: "Wellness & Spa",
    icon: HeartPulse,
    keywords: [
      "spa", "sauna", "steam room", "massage", "hammam", "beauty",
      "wellness", "pilates", "yoga", "hot tub", "jacuzzi", "turkish bath",
      "health club", "health or beauty",
    ],
  },
  pool_beach: {
    label: "Pool & Beach",
    icon: Waves,
    keywords: [
      "pool", "beach", "sun lounger", "pool umbrella", "beach umbrella",
      "beach towel", "cabana", "waterslide", "aqua", "private beach",
      "pool bar", "beach toy",
    ],
  },
  fitness: {
    label: "Fitness & Activities",
    icon: Dumbbell,
    keywords: [
      "fitness", "gym", "bicycle", "bike", "tennis", "golf", "diving",
      "scuba", "snorkeling", "kayak", "surfing", "hiking", "padel",
      "squash", "horse", "water sport", "games", "darts", "board game",
      "arcade", "billiard", "table tennis", "bowling",
    ],
  },
  dining: {
    label: "Food & Drink",
    icon: Utensils,
    keywords: [
      "restaurant", "breakfast", "bar", "snack", "café", "coffee shop",
      "minibar", "coffee", "dining", "meal", "kid meal", "room service",
      "vegan", "vegetarian", "organic food", "halal", "kosher", "kitchen",
      "fruit", "deli",
    ],
  },
  family: {
    label: "Family Friendly",
    icon: Baby,
    keywords: [
      "child", "kid", "baby", "family", "crib", "cot", "highchair",
      "playground", "children", "toy", "babysitting", "nursery",
    ],
  },
  parking: {
    label: "Parking & Transport",
    icon: ParkingCircle,
    keywords: [
      "parking", "garage", "shuttle", "airport transport", "car hire",
      "car rental", "electric car", "charging station", "valet",
      "limo", "town car", "ferry", "taxi",
    ],
  },
  internet: {
    label: "Internet & Media",
    icon: Wifi,
    keywords: [
      "wifi", "internet", "television", "tv", "computer", "streaming",
      "cable", "satellite", "newspaper",
    ],
  },
  services: {
    label: "Hotel Services",
    icon: ConciergeBell,
    keywords: [
      "concierge", "front desk", "24-hour", "express check", "luggage",
      "porter", "bellhop", "laundry", "dry cleaning", "ironing",
      "housekeeping", "wake-up", "fax", "photocopying", "multilingual",
      "wedding", "conference", "meeting room", "banquet", "ballroom",
      "reception hall", "invoice", "cashless", "currency exchange",
    ],
  },
  room_features: {
    label: "Room Features",
    icon: BedDouble,
    keywords: [
      "air conditioning", "heating", "safe", "deposit box",
      "soundproof", "balcony", "terrace", "wardrobe", "closet",
      "desk", "sofa", "seating", "view", "non-smoking", "smoking area",
      "outdoor furniture", "lower bathroom", "emergency cord",
    ],
  },
  accessibility: {
    label: "Accessibility",
    icon: Accessibility,
    keywords: [
      "wheelchair", "accessible", "disabled", "mobility", "visual aid",
      "hearing", "braille", "step-free", "grab rail",
    ],
  },
  safety: {
    label: "Safety & Hygiene",
    icon: ShieldCheck,
    keywords: [
      "security", "cctv", "fire", "smoke alarm", "first aid",
      "sanitize", "disinfect", "cleaning standard", "physical distancing",
      "hand sanitizer", "face mask", "screen", "barrier", "health check",
      "thermometer", "key access", "key card", "24-hour security",
      "stationery", "contactless",
    ],
  },
  eco: {
    label: "Sustainability",
    icon: Leaf,
    keywords: [
      "eco", "recycl", "renewable", "solar", "energy-saving", "led",
      "organic", "sustainable", "biodegradable", "compost", "reusable",
      "single-use plastic", "water-efficient", "double-glazing",
      "locally-sourced", "locally-owned", "local artist", "humane",
      "plant wall", "rooftop garden", "food waste", "community reinvest",
      "guest education", "ecosystem",
    ],
  },
  outdoors: {
    label: "Outdoors",
    icon: Sun,
    keywords: [
      "garden", "outdoor", "patio", "bbq", "barbecue",
      "picnic", "rooftop",
    ],
  },
  pets: {
    label: "Pets",
    icon: Dog,
    keywords: ["pet", "dog", "cat", "animal"],
  },
};

const CATEGORY_ORDER = [
  "wellness", "pool_beach", "fitness", "dining", "family", "parking",
  "internet", "services", "room_features", "accessibility", "safety",
  "eco", "outdoors", "pets",
];

// Top amenities to highlight — pick max 8 from the hotel's list
const HIGHLIGHT_KEYWORDS = [
  "free wifi", "swimming pool", "pool", "spa", "fitness", "gym",
  "restaurant", "breakfast", "parking", "air conditioning", "room service",
  "beach", "sauna", "24-hour front desk", "concierge", "airport",
  "shuttle", "pet",
];

const AMENITY_ICON_MAP: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["wifi", "internet"], icon: Wifi },
  { keywords: ["parking", "garage", "valet"], icon: ParkingCircle },
  { keywords: ["pool", "swimming", "aqua"], icon: Waves },
  { keywords: ["gym", "fitness", "dumbbell"], icon: Dumbbell },
  { keywords: ["restaurant", "dining"], icon: UtensilsCrossed },
  { keywords: ["breakfast", "meal", "food"], icon: Utensils },
  { keywords: ["bar", "snack", "deli"], icon: Coffee },
  { keywords: ["air conditioning", "ac", "heating"], icon: Wind },
  { keywords: ["tv", "television"], icon: Tv },
  { keywords: ["safe", "deposit", "security", "cctv"], icon: ShieldCheck },
  { keywords: ["coffee", "minibar", "café"], icon: Coffee },
  { keywords: ["spa", "wellness", "beauty", "massage"], icon: Bath },
  { keywords: ["elevator", "lift"], icon: Building },
  { keywords: ["baby", "child", "kid", "crib", "toy"], icon: Baby },
  { keywords: ["wheelchair", "accessible", "disabled"], icon: Accessibility },
  { keywords: ["eco", "recycl", "sustain", "solar", "led"], icon: Leaf },
  { keywords: ["fire", "smoke", "first aid", "sanitize"], icon: ShieldCheck },
  { keywords: ["bicycle", "bike"], icon: Bike },
  { keywords: ["laundry", "dry clean", "ironing"], icon: Shirt },
  { keywords: ["garden", "outdoor", "patio"], icon: TreePine },
  { keywords: ["pet", "dog", "animal"], icon: Dog },
  { keywords: ["beach", "sun lounger", "umbrella"], icon: Umbrella },
  { keywords: ["sauna", "steam", "hammam", "turkish"], icon: Flame },
  { keywords: ["game", "arcade", "darts", "billiard"], icon: Gamepad2 },
  { keywords: ["24-hour", "front desk"], icon: DoorOpen },
  { keywords: ["concierge", "porter", "bellhop"], icon: ConciergeBell },
  { keywords: ["luggage", "storage"], icon: Luggage },
  { keywords: ["shuttle", "transport", "limo", "car hire", "taxi"], icon: Car },
  { keywords: ["electric car", "charging"], icon: Zap },
  { keywords: ["smoking"], icon: Cigarette },
  { keywords: ["meeting", "conference", "banquet", "ballroom"], icon: Users },
  { keywords: ["phone", "fax"], icon: Phone },
  { keywords: ["flower", "plant wall", "rooftop garden"], icon: Flower2 },
  { keywords: ["multilingual"], icon: Globe },
  { keywords: ["terrace"], icon: Sun },
  { keywords: ["room service"], icon: ConciergeBell },
];

function getAmenityIcon(amenity: string): LucideIcon {
  const lower = amenity.toLowerCase();
  for (const entry of AMENITY_ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.icon;
  }
  return Gem;
}

function categorizeAmenities(amenities: string[]) {
  const unique = [...new Set(amenities)];

  // Pick top highlights (max 8)
  const highlights: string[] = [];
  for (const a of unique) {
    if (highlights.length >= 8) break;
    const lower = a.toLowerCase();
    if (HIGHLIGHT_KEYWORDS.some((kw) => lower.includes(kw))) {
      highlights.push(a);
    }
  }

  // Assign each amenity to a category
  const grouped: Record<string, string[]> = {};
  const assigned = new Set<string>();

  for (const catKey of CATEGORY_ORDER) {
    const cat = CATEGORIES[catKey];
    grouped[catKey] = [];
    for (const a of unique) {
      if (assigned.has(a)) continue;
      const lower = a.toLowerCase();
      if (cat.keywords.some((kw) => lower.includes(kw))) {
        grouped[catKey].push(a);
        assigned.add(a);
      }
    }
  }

  // Unassigned → "General"
  const general: string[] = [];
  for (const a of unique) {
    if (!assigned.has(a)) general.push(a);
  }

  const categories: { key: string; label: string; icon: LucideIcon; items: string[] }[] = [];
  for (const catKey of CATEGORY_ORDER) {
    if (grouped[catKey] && grouped[catKey].length > 0) {
      categories.push({
        key: catKey,
        label: CATEGORIES[catKey].label,
        icon: CATEGORIES[catKey].icon,
        items: grouped[catKey],
      });
    }
  }
  if (general.length > 0) {
    categories.push({ key: "general", label: "General", icon: Building, items: general });
  }

  return { highlights, categories };
}

function CategorySection({ cat }: { cat: { key: string; label: string; icon: LucideIcon; items: string[] } }) {
  const [expanded, setExpanded] = useState(true);
  const CatIcon = cat.icon;

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-bg-cream/50 hover:bg-bg-cream transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center">
            <CatIcon size={18} className="text-accent" />
          </div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            {cat.label}
          </h3>
          <span className="text-xs text-text-muted bg-white px-2 py-0.5 rounded-full">
            {cat.items.length}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {cat.items.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2.5 py-1.5">
              <Check size={14} className="text-accent-light shrink-0" />
              <span className="text-sm text-text-secondary">{amenity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AmenitiesList({ amenities, compact }: AmenitiesListProps) {
  const { highlights, categories } = useMemo(() => categorizeAmenities(amenities), [amenities]);

  if (amenities.length === 0) {
    return (
      <p className="text-text-muted text-center py-8">
        No amenity information available for this hotel.
      </p>
    );
  }

  // Compact mode — just the highlight grid (used on overview tab)
  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {highlights.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 px-4 py-3.5 bg-accent/4 border border-accent/10 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <span className="text-sm font-medium text-text-primary leading-tight">{amenity}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top highlights — key amenities at a glance */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {highlights.map((amenity) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div
                key={amenity}
                className="flex items-center gap-3 px-4 py-3.5 bg-accent/4 border border-accent/10 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-accent" />
                </div>
                <span className="text-sm font-medium text-text-primary leading-tight">{amenity}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Category sections */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategorySection key={cat.key} cat={cat} />
        ))}
      </div>
    </div>
  );
}
