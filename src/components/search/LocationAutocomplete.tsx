"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchStore } from "@/store/searchStore";

interface PlaceResult {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  types: string[];
}

export default function LocationAutocomplete() {
  const { location, setLocation } = useSearchStore();
  const [query, setQuery] = useState(location);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(location);
  }, [location]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    async function fetchPlaces() {
      setLoading(true);
      try {
        const res = await fetch(`/api/places?text=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.data) {
          setResults(data.data.slice(0, 8));
          setIsOpen(true);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(place: PlaceResult) {
    setQuery(place.displayName);
    setLocation(place.displayName, place.placeId);
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value !== location) {
              setLocation("", "");
            }
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="City, hotel, or destination"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-bg-card text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-border max-h-60 overflow-y-auto">
          {results.map((place) => (
            <button
              key={place.placeId}
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-bg-cream transition-colors flex items-start gap-3 border-b border-border/50 last:border-0"
            >
              <MapPin size={14} className="text-accent mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-text-primary">{place.displayName}</div>
                {place.formattedAddress && (
                  <div className="text-xs text-text-muted">{place.formattedAddress}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-border p-4 text-center text-sm text-text-muted">
          Searching...
        </div>
      )}
    </div>
  );
}
