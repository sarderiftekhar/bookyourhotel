"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, X, Bed } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchStore } from "@/store/searchStore";

interface PlaceResult {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  types: string[];
}

const TRENDING = [
  { name: "London", country: "United Kingdom" },
  { name: "Paris", country: "France" },
  { name: "Dubai", country: "United Arab Emirates" },
  { name: "New York", country: "United States" },
  { name: "Tokyo", country: "Japan" },
];

export default function LocationAutocomplete() {
  const { location, placeId, setLocation } = useSearchStore();
  const [query, setQuery] = useState(location);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLocationRef = useRef(location);
  // Track whether the user actively changed the query (typed, not just page load)
  const userTypedRef = useRef(false);

  // Sync query from store when location changes externally
  if (location !== prevLocationRef.current) {
    prevLocationRef.current = location;
    if (query !== location) {
      setQuery(location);
    }
  }

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    // Don't fetch if the user hasn't actively typed
    if (!userTypedRef.current) return;

    async function fetchPlaces() {
      setLoading(true);
      try {
        const res = await fetch(`/api/places?text=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.data) {
          setResults(data.data.slice(0, 8));
          // Only open dropdown if user is actively typing
          if (userTypedRef.current) {
            setIsOpen(true);
          }
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
    userTypedRef.current = false;
    setQuery(place.displayName);
    setLocation(place.displayName, place.placeId);
    setResults([]);
    setIsOpen(false);
  }

  function handleTrending(name: string) {
    userTypedRef.current = false;
    setQuery(name);
    setLocation(name, "");
    setResults([]);
    setIsOpen(false);
  }

  function handleClear() {
    userTypedRef.current = false;
    setQuery("");
    setLocation("", "");
    setResults([]);
    inputRef.current?.focus();
  }

  // Only show trending when user focuses an empty/short input
  const showTrending = isOpen && results.length === 0 && !loading && debouncedQuery.length < 2;
  // Only show results dropdown when open AND user actively typed
  const showResults = isOpen && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Bed size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            userTypedRef.current = true;
            setQuery(val);
            setLocation(val, "");
          }}
          onFocus={() => {
            // Only show dropdown on focus if the input is empty/short (for trending)
            // or if there are already results from active typing
            if (query.length < 2 || results.length > 0) {
              setIsOpen(true);
            }
            // If the input has a value from a previous selection, don't reopen
            // the dropdown — the user already picked a place
            if (query.length >= 2 && placeId) {
              setIsOpen(false);
            }
          }}
          placeholder="Where are you going?"
          className="w-full pl-10 pr-9 py-3 text-sm border-0 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-text-muted/20 hover:bg-text-muted/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={12} className="text-text-secondary" />
          </button>
        )}
      </div>

      {/* Trending destinations */}
      {showTrending && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 sm:w-full bg-white rounded-xl shadow-xl border border-border max-h-72 overflow-y-auto">
          <p className="px-4 pt-3 pb-1.5 text-xs font-bold text-text-primary">
            Trending destinations
          </p>
          {TRENDING.map((t) => (
            <button
              key={t.name}
              onClick={() => handleTrending(t.name)}
              className="w-full text-left px-4 py-2.5 hover:bg-bg-cream transition-colors flex items-center gap-3"
            >
              <MapPin size={16} className="text-accent shrink-0" />
              <div>
                <div className="text-sm font-medium text-text-primary">{t.name}</div>
                <div className="text-xs text-text-muted">{t.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Search results */}
      {showResults && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 sm:w-full bg-white rounded-xl shadow-xl border border-border max-h-72 overflow-y-auto">
          {results.map((place) => (
            <button
              key={place.placeId}
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-2.5 hover:bg-bg-cream transition-colors flex items-center gap-3 border-b border-border/30 last:border-0"
            >
              <MapPin size={16} className="text-accent shrink-0" />
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

      {loading && userTypedRef.current && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 sm:w-full bg-white rounded-xl shadow-xl border border-border p-4 text-center text-sm text-text-muted">
          Searching...
        </div>
      )}
    </div>
  );
}
