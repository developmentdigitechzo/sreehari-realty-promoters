export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'SOLD_OUT';

export interface ProjectHighlight {
  title: string;
  description?: string;
}

export interface ProjectConnectivity {
  title: string;
  distance: string;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  location: string;
  address?: string;
  city: string;
  state: string;
  total_area?: string;
  total_units?: string;
  price_range?: string;
  price_per_sqft?: number;
  status: ProjectStatus;
  is_featured: boolean;
  is_visible: boolean;
  main_image_url: string;
  brochure_url?: string;
  highlights: ProjectHighlight[];
  connectivity: ProjectConnectivity[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  // Joins
  amenities?: Amenity[];
  images?: MediaImage[];
  properties_count?: number;
}

export type PropertyType = 'RESIDENTIAL_PLOT' | 'COMMERCIAL_PLOT' | 'VILLA_PLOT';
export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface Property {
  id: string;
  project_id?: string;
  project_name?: string;
  project_slug?: string;
  title: string;
  slug: string;
  plot_number?: string;
  property_type: PropertyType;
  area_sqft: number;
  dimensions?: string;
  facing?: string;
  price: number;
  price_display?: string;
  status: PropertyStatus;
  is_featured: boolean;
  is_visible: boolean;
  description?: string;
  main_image_url?: string;
  created_at: string;
  updated_at: string;
  images?: MediaImage[];
}

export interface MediaImage {
  id: string;
  project_id?: string;
  property_id?: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category: string;
}

export type LeadSource = 'WEBSITE_FORM' | 'PROJECT_PAGE' | 'PROPERTY_PAGE' | 'WHATSAPP_CLICK' | 'DIRECT_CALL';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'CONVERTED' | 'ARCHIVED';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  project_id?: string;
  project_name?: string;
  property_id?: string;
  property_title?: string;
  source: LeadSource;
  message?: string;
  status: LeadStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ContactStatus = 'UNREAD' | 'READ' | 'RESPONDED';

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
