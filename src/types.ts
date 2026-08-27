export type SxmLocation =
  | 'Simpson Bay' | 'Philipsburg' | 'Cole Bay' | 'Maho' | 'Cupecoy'
  | 'Pelican Key' | 'Indigo Bay' | 'Oyster Pond' | 'Dawn Beach' | 'Guana Bay'
  | 'Little Bay' | 'Point Blanche' | 'Cay Hill' | 'Dutch Quarter'
  | 'Marigot' | 'Grand Case' | 'Orient Bay' | 'Terres Basses'
  | 'Anse Marcel' | 'Cul-de-Sac' | "Friar's Bay" | 'Nettle Bay' | 'Baie Rouge';

export type IslandSide = 'Dutch' | 'French';

export type PropertyCategory =
  | 'Beachfront' | 'Villas' | 'Apartments' | 'Luxury' | 'Family' | 'Romantic';

export interface Host {
  name: string;
  avatar: string;
  joinedYear: number;
  isSuperhost: boolean;
}

export interface Review {
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export type ListingTier = 'external' | 'ota' | 'native';

export interface Property {
  id: string;
  title: string;
  location: SxmLocation;
  side: IslandSide;
  category: PropertyCategory;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  beds: number;
  baths: number;
  guests: number;
  description: string;
  amenities: string[];
  hasPool: boolean;
  isBeachfront: boolean;
  host: Host;
  reviews: Review[];
  isFeatured?: boolean;
  tier: ListingTier;
  externalUrl?: string;
  coords: { lat: number; lng: number };
}

export interface InquiryForm {
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}

export interface Filters {
  beds: number;
  minPrice: number;
  maxPrice: number;
  beachfrontOnly: boolean;
  poolOnly: boolean;
}
