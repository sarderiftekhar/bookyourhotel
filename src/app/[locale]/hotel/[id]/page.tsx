"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { MapPin, Clock, Star } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import { usePreferencesStore } from "@/store/preferencesStore";
import HotelGallery from "@/components/hotels/HotelGallery";
import RoomCard from "@/components/hotels/RoomCard";
import AmenitiesList from "@/components/hotels/AmenitiesList";
import ReviewCard from "@/components/hotels/ReviewCard";
import ReviewSummary from "@/components/hotels/ReviewSummary";
import HotelMap from "@/components/hotels/HotelMap";
import Spinner from "@/components/ui/Spinner";

interface HotelData {
  id: string;
  name: string;
  hotelDescription: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  checkinTime: string;
  checkoutTime: string;
  facilities: string[];
  images: string[];
  reviewScore?: number;
  reviewCount?: number;
}

interface RoomData {
  offerId: string;
  roomName: string;
  boardName: string;
  currency: string;
  retailRate: number;
  maxOccupancy?: number;
  images?: string[];
  cancellationPolicy?: {
    refundableTag?: string;
  };
}

interface ReviewData {
  guestName?: string;
  rating?: number;
  title?: string;
  comment?: string;
  date?: string;
  country?: string;
}

export default function HotelDetailPage() {
  const t = useTranslations("hotel");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const { checkIn, checkOut, adults, children } = useSearchStore();
  const { currency } = usePreferencesStore();
  const { setSelectedRoom } = useBookingStore();

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "amenities" | "reviews" | "location">("overview");

  useEffect(() => {
    async function fetchHotel() {
      setLoading(true);
      try {
        // Fetch hotel details and reviews in parallel
        const [hotelRes, reviewsRes, ratesRes] = await Promise.all([
          fetch(`/api/hotels/${hotelId}`),
          fetch(`/api/reviews?hotelId=${hotelId}`),
          fetch("/api/hotels/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              checkIn: searchParams.get("checkIn") || checkIn,
              checkOut: searchParams.get("checkOut") || checkOut,
              adults,
              children,
              currency,
              hotelIds: [hotelId],
              occupancies: [{ adults }],
            }),
          }),
        ]);

        const hotelData = await hotelRes.json();
        const reviewsData = await reviewsRes.json();
        const ratesData = await ratesRes.json();

        if (hotelData.data) {
          const d = hotelData.data;
          setHotel({
            id: d.id || hotelId,
            name: d.name || "Hotel",
            hotelDescription: d.hotelDescription || d.description || "",
            starRating: d.starRating || 0,
            address: d.address || "",
            city: d.city || "",
            country: d.country || "",
            latitude: d.latitude || 0,
            longitude: d.longitude || 0,
            checkinTime: d.checkinTime || d.checkInTime || "15:00",
            checkoutTime: d.checkoutTime || d.checkOutTime || "11:00",
            facilities: d.facilities || d.amenities || [],
            images: d.images || [],
            reviewScore: d.reviewScore,
            reviewCount: d.reviewCount,
          });
        }

        if (reviewsData.data) {
          setReviews(Array.isArray(reviewsData.data) ? reviewsData.data : []);
        }

        if (ratesData.data && Array.isArray(ratesData.data) && ratesData.data.length > 0) {
          const hotelRates = ratesData.data[0] as Record<string, unknown>;
          const roomRates = (hotelRates.rooms || hotelRates.offers || []) as RoomData[];
          setRooms(Array.isArray(roomRates) ? roomRates : []);
        }
      } catch (error) {
        console.error("Failed to load hotel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [hotelId, currency]);

  function handleSelectRoom(offerId: string) {
    const room = rooms.find((r) => r.offerId === offerId);
    if (!room || !hotel) return;

    setSelectedRoom({
      offerId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomName: room.roomName,
      boardName: room.boardName,
      checkIn: searchParams.get("checkIn") || checkIn,
      checkOut: searchParams.get("checkOut") || checkOut,
      currency: room.currency,
      totalRate: room.retailRate,
      cancellationPolicy: room.cancellationPolicy?.refundableTag || "NON_REFUNDABLE",
      maxOccupancy: room.maxOccupancy || 2,
      roomImage: room.images?.[0] || hotel.images?.[0] || "",
    });

    router.push("/checkout");
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Hotel not found</p>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: t("overview") },
    { id: "rooms" as const, label: t("rooms") },
    { id: "amenities" as const, label: t("amenities") },
    { id: "reviews" as const, label: t("reviews") },
    { id: "location" as const, label: t("location") },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />

        {/* Hotel Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {hotel.starRating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-star text-star" />
                    ))}
                  </div>
                )}
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {hotel.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {t("checkInTime", { time: hotel.checkinTime })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {t("checkOutTime", { time: hotel.checkoutTime })}
                </div>
              </div>
            </div>

            {hotel.reviewScore !== undefined && hotel.reviewCount !== undefined && (
              <ReviewSummary score={hotel.reviewScore} count={hotel.reviewCount} />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="max-w-3xl">
            <div
              className="prose prose-sm text-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: hotel.hotelDescription }}
            />
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-4">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard key={room.offerId} room={room} onSelect={handleSelectRoom} />
              ))
            ) : (
              <p className="text-text-muted text-center py-8">
                No rooms available for the selected dates. Try different dates.
              </p>
            )}
          </div>
        )}

        {activeTab === "amenities" && (
          <AmenitiesList amenities={hotel.facilities} />
        )}

        {activeTab === "reviews" && (
          <div>
            {hotel.reviewScore !== undefined && hotel.reviewCount !== undefined && (
              <div className="mb-6">
                <ReviewSummary score={hotel.reviewScore} count={hotel.reviewCount} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <ReviewCard key={idx} review={review} />
                ))
              ) : (
                <p className="text-text-muted col-span-2 text-center py-8">
                  No reviews yet for this hotel.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "location" && hotel.latitude && hotel.longitude && (
          <div className="h-[400px] rounded-xl overflow-hidden">
            <HotelMap
              hotels={[{
                hotelId: hotel.id,
                name: hotel.name,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }]}
              center={{ lat: hotel.latitude, lng: hotel.longitude }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
