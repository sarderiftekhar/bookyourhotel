export interface Hotel {
  id: string;
  name: string;
  hotelDescription: string;
  currency: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  zip: string;
  starRating: number;
  checkinTime: string;
  checkoutTime: string;
  facilities: string[];
  images: string[];
  rooms: Room[];
  main_photo: string;
  reviewScore?: number;
  reviewCount?: number;
}

export interface HotelSearchResult {
  id: string;
  name: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  main_photo: string;
  minRate: number;
  currency: string;
  reviewScore?: number;
  reviewCount?: number;
  rooms?: RoomRate[];
}

export interface Room {
  roomId: string;
  name: string;
  description: string;
  maxOccupancy: number;
  bedType: string;
  size?: string;
  images: string[];
  amenities: string[];
}

export interface RoomRate {
  offerId: string;
  roomName: string;
  boardName: string;
  boardCode: string;
  currency: string;
  retailRate: number;
  cancellationPolicy: CancellationPolicy;
  maxOccupancy: number;
  images: string[];
  amenities: string[];
}

export interface CancellationPolicy {
  cancelPolicyInfos: CancellationInfo[];
  refundableTag: string;
}

export interface CancellationInfo {
  cancelTime: string;
  amount: number;
  currency: string;
  type: string;
}

export interface Review {
  reviewId: string;
  guestName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  country?: string;
}

export interface Place {
  placeId: string;
  name: string;
  type: string;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}
