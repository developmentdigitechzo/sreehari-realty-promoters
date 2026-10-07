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

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category: string;
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
  amenities?: Amenity[];
  gallery?: MediaImage[];
  properties?: Property[];
  available_plots_count?: number;
  total_plots_count?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'RESIDENTIAL_PLOT' | 'COMMERCIAL_PLOT' | 'VILLA_PLOT';
export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface Property {
  id: string;
  project_id?: string;
  project_name?: string;
  project_slug?: string;
  project_location?: string;
  project_city?: string;
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
  images?: MediaImage[];
  created_at: string;
  updated_at: string;
}

export type LeadSource = 'WEBSITE_FORM' | 'PROJECT_PAGE' | 'PROPERTY_PAGE' | 'WHATSAPP_CLICK' | 'DIRECT_CALL' | 'SELLER_DESK';
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalProperties: number;
  availableProperties: number;
  totalLeads: number;
  newLeads: number;
  recentLeads: Lead[];
  leadsByStatus: { status: string; count: string }[];
}
