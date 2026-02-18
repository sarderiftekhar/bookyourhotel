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
  Sparkles,
  Building,
} from "lucide-react";

interface AmenitiesListProps {
  amenities: string[];
  maxDisplay?: number;
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi,
  internet: Wifi,
  parking: Car,
  pool: Waves,
  swimming: Waves,
  gym: Dumbbell,
  fitness: Dumbbell,
  restaurant: UtensilsCrossed,
  dining: UtensilsCrossed,
  "air conditioning": Wind,
  ac: Wind,
  tv: Tv,
  television: Tv,
  safe: ShieldCheck,
  coffee: Coffee,
  minibar: Coffee,
  spa: Bath,
  laundry: Sparkles,
  elevator: Building,
  lift: Building,
};

function getAmenityIcon(amenity: string): React.ElementType {
  const lower = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Sparkles;
}

export default function AmenitiesList({ amenities, maxDisplay }: AmenitiesListProps) {
  const displayItems = maxDisplay ? amenities.slice(0, maxDisplay) : amenities;
  const remaining = maxDisplay ? amenities.length - maxDisplay : 0;

  return (
    <div className="flex flex-wrap gap-3">
      {displayItems.map((amenity, index) => {
        const Icon = getAmenityIcon(amenity);
        return (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-bg-cream rounded-lg text-sm text-text-secondary"
          >
            <Icon size={16} className="text-accent shrink-0" />
            <span>{amenity}</span>
          </div>
        );
      })}
      {remaining > 0 && (
        <div className="flex items-center px-3 py-2 bg-bg-cream rounded-lg text-sm text-accent font-medium">
          +{remaining} more
        </div>
      )}
    </div>
  );
}
