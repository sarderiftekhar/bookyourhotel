export interface SearchParams {
  placeId?: string;
  location?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges?: number[];
  rooms: number;
  currency?: string;
  nationality?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  amenities?: string[];
  propertyType?: string[];
  boardType?: string[];
  sortBy?: string;
}

export interface SearchState extends SearchParams {
  filters: SearchFilters;
  page: number;
  resultsPerPage: number;
}
