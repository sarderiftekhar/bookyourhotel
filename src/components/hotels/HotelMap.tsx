"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface HotelMarker {
  hotelId: string;
  name: string;
  latitude: number;
  longitude: number;
  minRate?: number;
  currency?: string;
}

interface HotelMapProps {
  hotels: HotelMarker[];
  center?: { lat: number; lng: number };
  onHotelClick?: (hotelId: string) => void;
}

export default function HotelMap({ hotels, center, onHotelClick }: HotelMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    import("mapbox-gl").then((mapboxgl) => {
      (mapboxgl as unknown as { accessToken: string }).accessToken = token;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: center
          ? [center.lng, center.lat]
          : hotels.length > 0
          ? [hotels[0].longitude, hotels[0].latitude]
          : [0, 20],
        zoom: 12,
      });

      map.addControl(new mapboxgl.default.NavigationControl(), "top-right");

      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    import("mapbox-gl").then((mapboxgl) => {
      const map = mapRef.current!;

      // Remove existing markers
      document.querySelectorAll(".hotel-marker").forEach((el) => el.remove());

      hotels.forEach((hotel) => {
        if (!hotel.latitude || !hotel.longitude) return;

        const el = document.createElement("div");
        el.className = "hotel-marker";
        el.style.cssText = `
          background: #00332E;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        el.textContent = hotel.minRate
          ? formatCurrency(hotel.minRate, hotel.currency || "USD")
          : hotel.name.substring(0, 15);

        el.addEventListener("click", () => {
          onHotelClick?.(hotel.hotelId);
        });

        new mapboxgl.default.Marker({ element: el })
          .setLngLat([hotel.longitude, hotel.latitude])
          .setPopup(
            new mapboxgl.default.Popup({ offset: 25 }).setHTML(
              `<strong style="font-size:13px">${hotel.name}</strong>`
            )
          )
          .addTo(map);
      });

      // Fit bounds if multiple hotels
      if (hotels.length > 1) {
        const bounds = new mapboxgl.default.LngLatBounds();
        hotels.forEach((h) => {
          if (h.latitude && h.longitude) {
            bounds.extend([h.longitude, h.latitude]);
          }
        });
        map.fitBounds(bounds, { padding: 60 });
      }
    });
  }, [hotels, mapLoaded, onHotelClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full min-h-[400px] rounded-xl overflow-hidden"
    />
  );
}
