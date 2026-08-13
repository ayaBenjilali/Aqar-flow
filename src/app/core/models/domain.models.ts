export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';
export type UserRole = 'buyer' | 'agent' | 'company';
export type Permission =
  | 'browse:properties'
  | 'favorite:properties'
  | 'message:agents'
  | 'create:listings'
  | 'manage:leads'
  | 'manage:team'
  | 'view:analytics';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  companyId?: string;
  phone?: string;
  location: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface Property {
  id: string;
  title: string;
  titleEn: string;
  city: string;
  district: string;
  transaction: 'sale' | 'rent';
  type: 'apartment' | 'villa' | 'office' | 'shop' | 'land';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  parking: boolean;
  status: 'available' | 'reserved' | 'sold';
  featured: boolean;
  imageUrl: string;
  gallery: string[];
  description: string;
  amenities: string[];
  agentId: string;
  companyId: string;
  createdAt: string;
}

export interface PropertyFilters {
  query: string;
  city: string;
  transaction: '' | Property['transaction'];
  type: '' | Property['type'];
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  minArea: number | null;
  furnished: boolean | null;
  parking: boolean | null;
  status: '' | Property['status'];
  sort: 'latest' | 'priceAsc' | 'priceDesc' | 'areaDesc';
}

export interface Agent {
  id: string;
  name: string;
  verified: boolean;
  companyId: string;
  location: string;
  bio: string;
  specialties: string[];
  followers: number;
  avatarUrl: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  location: string;
  agents: number;
  listings: number;
  leads: number;
}

export interface FeedPost {
  id: string;
  authorId: string;
  kind: 'property' | 'insight' | 'announcement';
  text: string;
  imageUrl?: string;
  propertyId?: string;
  likes: number;
  comments: number;
  createdAt: string;
  following: boolean;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'viewing' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  propertyId: string;
  status: LeadStatus;
  source: 'feed' | 'search' | 'referral' | 'campaign';
  assignedAgentId: string;
  notes: string;
  nextFollowUp: string;
  history: string[];
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: UserRole;
  propertyId?: string;
  unread: number;
  lastMessage: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'me' | 'them';
  text: string;
  sentAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  kind: 'property' | 'message' | 'lead' | 'appointment' | 'feed';
}
