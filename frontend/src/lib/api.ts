import { ApiResponse, Project, Property, Amenity, Lead, DashboardStats } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get admin token if stored in browser
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('sreehari_admin_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Network error: Unable to connect to server',
      error,
    };
  }
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<any>('/auth/me'),

  // Projects
  getProjects: (params: { status?: string; featured?: boolean; search?: string; admin?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.featured) query.set('featured', 'true');
    if (params.search) query.set('search', params.search);
    if (params.admin) query.set('admin', 'true');
    return request<Project[]>(`/projects?${query.toString()}`);
  },
  getProjectBySlug: (slug: string) => request<Project>(`/projects/${slug}`),
  createProject: (data: Partial<Project>) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    request<{ id: string; name: string }>(`/projects/${id}`, {
      method: 'DELETE',
    }),

  // Properties / Plots
  getProperties: (params: { project_id?: string; status?: string; type?: string; admin?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.project_id) query.set('project_id', params.project_id);
    if (params.status) query.set('status', params.status);
    if (params.type) query.set('type', params.type);
    if (params.admin) query.set('admin', 'true');
    return request<Property[]>(`/properties?${query.toString()}`);
  },
  getPropertyBySlug: (slug: string) => request<Property>(`/properties/${slug}`),
  createProperty: (data: Partial<Property>) =>
    request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProperty: (id: string, data: Partial<Property>) =>
    request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProperty: (id: string) =>
    request<{ id: string; title: string }>(`/properties/${id}`, {
      method: 'DELETE',
    }),

  // Amenities
  getAmenities: () => request<Amenity[]>('/amenities'),
  createAmenity: (data: { name: string; icon?: string; category?: string }) =>
    request<Amenity>('/amenities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Leads
  submitLead: (data: {
    name: string;
    phone: string;
    email?: string;
    project_id?: string;
    property_id?: string;
    source?: string;
    message?: string;
  }) =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getLeads: (params: { status?: string; project_id?: string; search?: string; page?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.project_id) query.set('project_id', params.project_id);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page.toString());
    return request<{ leads: Lead[]; total: number; page: number; limit: number }>(`/leads?${query.toString()}`);
  },
  updateLead: (id: string, data: { status?: string; notes?: string }) =>
    request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Contact
  submitContact: (data: { name: string; phone: string; email: string; subject?: string; message: string }) =>
    request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dashboard Stats
  getDashboardStats: () => request<DashboardStats>('/dashboard/stats'),
};
