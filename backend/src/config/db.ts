import { Pool, QueryResult, QueryResultRow } from 'pg';
import { ENV } from './env.js';
import bcrypt from 'bcryptjs';
import { User, Project, Property, Amenity, Lead, ContactEnquiry } from '../types/index.js';

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2500,
});

let isPostgresConnected = false;

// In-memory fallback data store for local development when PostgreSQL is not running
export const memoryStore: {
  users: User[];
  projects: Project[];
  properties: Property[];
  amenities: Amenity[];
  leads: Lead[];
  contact_enquiries: ContactEnquiry[];
} = {
  users: [
    {
      id: 'u-1',
      name: 'Sree Hari Admin',
      email: 'admin@sreeharirealty.com',
      password_hash: bcrypt.hashSync('AdminPassword@2026', 10),
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  amenities: [
    { id: 'a-1', name: 'Gated Community with 24/7 Security', icon: 'ShieldCheck', category: 'SECURITY' },
    { id: 'a-2', name: 'Grand Arch Entrance & CCTV', icon: 'DoorOpen', category: 'SECURITY' },
    { id: 'a-3', name: '30 & 40 Feet Blacktop Roads', icon: 'Route', category: 'INFRASTRUCTURE' },
    { id: 'a-4', name: 'Solar Street Lights', icon: 'Sun', category: 'INFRASTRUCTURE' },
    { id: 'a-5', name: 'Avenue Plantation & Landscaped Parks', icon: 'Trees', category: 'ENVIRONMENT' },
    { id: 'a-6', name: 'Sweet Potable Ground Water', icon: 'Droplet', category: 'UTILITIES' },
    { id: 'a-7', name: 'Rainwater Harvesting System', icon: 'CloudRain', category: 'UTILITIES' },
    { id: 'a-8', name: 'Underground Drainage & Electricity', icon: 'Zap', category: 'UTILITIES' },
    { id: 'a-9', name: 'Children Play Area & Walking Track', icon: 'Smile', category: 'LIFESTYLE' },
    { id: 'a-10', name: '100% Clear Title & Immediate Registration', icon: 'FileCheck', category: 'LEGAL' },
    { id: 'a-11', name: 'DTCP & RERA Approved Layout', icon: 'Award', category: 'LEGAL' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Sri Hari Green Enclave',
      slug: 'sri-hari-green-enclave',
      tagline: 'Premium CMDA & RERA Approved Residential Villa Plots at Tambaram West',
      description:
        'Sri Hari Green Enclave is an exclusive 12-acre gated community featuring 140 well-planned residential plots surrounded by lush greenery. Designed for peace of mind and rapid appreciation, the project boasts wide 40ft blacktop tar roads, avenue trees, 24/7 security guard post, solar lighting, and immediate DTCP/RERA approvals ready for home construction.',
      location: 'Tambaram West, Chennai',
      address: 'Near 400ft Outer Ring Road Junction, Tambaram West, Chennai, Tamil Nadu - 600045',
      city: 'Chennai',
      state: 'Tamil Nadu',
      total_area: '12 Acres',
      total_units: '140 Plots',
      price_range: '₹32 Lakhs - ₹78 Lakhs',
      price_per_sqft: 3200,
      status: 'ONGOING',
      is_featured: true,
      is_visible: true,
      main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      brochure_url: '',
      highlights: [
        { title: 'DTCP & RERA Approved', description: '100% legal clarity with clear parent documents and fast bank loan tie-ups.' },
        { title: 'Prime Connectivity', description: 'Just 7 minutes from Tambaram Railway Hub & GST Road.' },
        { title: 'Elevated Land', description: 'Non-flood prone high-elevation land with crystal clear potable water.' },
        { title: 'Ready to Construct', description: 'Surrounded by 500+ occupied independent houses and reputed schools.' },
      ],
      connectivity: [
        { title: 'Tambaram Railway Station', distance: '7 Mins' },
        { title: 'Outer Ring Road (ORR)', distance: '3 Mins' },
        { title: 'Chennai International Airport', distance: '22 Mins' },
        { title: 'Delhi Public School & Sairam Group', distance: '5 Mins' },
      ],
      seo_title: 'Sri Hari Green Enclave - Premium Plots in Tambaram West Chennai',
      seo_description: 'Buy ready-to-construct CMDA & RERA approved residential plots in Tambaram West, Chennai by Sree Hari Realty Promoters.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      name: 'Lotus Gated County',
      slug: 'lotus-gated-county',
      tagline: 'Luxury Gated Villa Plots with Grand Entrance Arch at Guduvanchery',
      description:
        'Lotus Gated County is a landmark 18-acre gated plotted community nestled in the booming corridor of Guduvanchery near SRM University. With 200+ residential plots, dedicated parks, children play zones, and underground utilities, it represents the ideal blend of high-growth investment and serene lifestyle.',
      location: 'Guduvanchery, GST Road, Chennai',
      address: 'Kayarambedu Road, Off GST Road, Guduvanchery, Chennai, Tamil Nadu - 603202',
      city: 'Chennai',
      state: 'Tamil Nadu',
      total_area: '18 Acres',
      total_units: '210 Plots',
      price_range: '₹24 Lakhs - ₹55 Lakhs',
      price_per_sqft: 2600,
      status: 'ONGOING',
      is_featured: true,
      is_visible: true,
      main_image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      brochure_url: '',
      highlights: [
        { title: 'Grand Clubhouse Zone', description: 'Designed community space for wellness, walking, and festive gatherings.' },
        { title: 'Close to SRM & Mahindra World City', description: 'High rental and appreciation potential driven by tech workforce.' },
        { title: 'Ready Bank Approvals', description: 'Bank loans approved up to 80% with SBI, HDFC, and LIC HFL.' },
      ],
      connectivity: [
        { title: 'Guduvanchery Bus Terminus', distance: '5 Mins' },
        { title: 'SRM University & Hospital', distance: '10 Mins' },
        { title: 'Mahindra World City SEZ', distance: '15 Mins' },
        { title: 'Kilambakkam KCBT Bus Hub', distance: '12 Mins' },
      ],
      seo_title: 'Lotus Gated County - Gated Community Plots in Guduvanchery Chennai',
      seo_description: 'Invest in gated community residential plots in Guduvanchery, GST Road.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'proj-3',
      name: 'Sri Hari Emerald Meadows',
      slug: 'sri-hari-emerald-meadows',
      tagline: 'Eco-Luxury Nature Plots & Farm Villas at Chengalpattu Highway',
      description:
        'Sri Hari Emerald Meadows offers expansive layout plots from 1200 sqft to 3000 sqft surrounded by lush mango groves and scenic hill views. Perfect for both weekend resort living and long-term capital appreciation.',
      location: 'Chengalpattu, Tamil Nadu',
      address: 'Near Old GST Highway, Chengalpattu, Tamil Nadu - 603001',
      city: 'Chengalpattu',
      state: 'Tamil Nadu',
      total_area: '25 Acres',
      total_units: '180 Plots',
      price_range: '₹18 Lakhs - ₹42 Lakhs',
      price_per_sqft: 1750,
      status: 'UPCOMING',
      is_featured: true,
      is_visible: true,
      main_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      brochure_url: '',
      highlights: [
        { title: 'Pure Organic Living', description: 'Over 200 fruit-bearing trees and landscaped greenery throughout the layout.' },
        { title: 'Rapid Industrial Growth', description: 'Close to Chengalpattu Medical College and auto hubs.' },
      ],
      connectivity: [
        { title: 'Chengalpattu Junction Railway', distance: '10 Mins' },
        { title: 'National Highway NH 32', distance: '4 Mins' },
      ],
      seo_title: 'Sri Hari Emerald Meadows - Nature & Farm Villa Plots Chengalpattu',
      seo_description: 'Discover eco-friendly land & villa plots at Chengalpattu by Sree Hari Realty Promoters.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'proj-4',
      name: 'Vedic Temple City Layout',
      slug: 'vedic-temple-city-layout',
      tagline: 'Fully Sold Out Gated Layout Near Thiruporur Murugan Temple',
      description:
        'A flagship landmark project by Sree Hari Realty Promoters completed ahead of schedule, with all 95 plots registered and over 35 villas built by happy owners.',
      location: 'OMR - Thiruporur, Chennai',
      address: 'Near Thiruporur Main Temple, OMR IT Highway, Chennai, Tamil Nadu - 603110',
      city: 'Chennai',
      state: 'Tamil Nadu',
      total_area: '8 Acres',
      total_units: '95 Plots',
      price_range: '₹22 Lakhs - ₹50 Lakhs',
      price_per_sqft: 2200,
      status: 'COMPLETED',
      is_featured: false,
      is_visible: true,
      main_image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      brochure_url: '',
      highlights: [
        { title: '100% Sold Out & Handed Over', description: 'Vibrant living community with families already residing.' },
      ],
      connectivity: [
        { title: 'OMR IT Corridor', distance: '2 Mins' },
        { title: 'Siruseri SIPCOT IT Park', distance: '18 Mins' },
      ],
      seo_title: 'Vedic Temple City Layout - Completed Plot Project Thiruporur OMR',
      seo_description: 'Completed and delivered gated plot project by Sree Hari Realty Promoters in Thiruporur, OMR.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  properties: [
    {
      id: 'prop-1',
      project_id: 'proj-1',
      title: 'Plot 14 - East Facing Villa Plot',
      slug: 'sri-hari-green-enclave-plot-14',
      plot_number: '14',
      property_type: 'RESIDENTIAL_PLOT',
      area_sqft: 1200,
      dimensions: '30 x 40 ft',
      facing: 'East',
      price: 3840000,
      price_display: '₹38.40 Lakhs',
      status: 'AVAILABLE',
      is_featured: true,
      is_visible: true,
      description: 'Prime East-facing residential plot located on a 30ft blacktop road right across the landscaped central park.',
      main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prop-2',
      project_id: 'proj-1',
      title: 'Plot 27 - North Corner Commercial/Residential Plot',
      slug: 'sri-hari-green-enclave-plot-27',
      plot_number: '27',
      property_type: 'COMMERCIAL_PLOT',
      area_sqft: 1800,
      dimensions: '36 x 50 ft',
      facing: 'North-East Corner',
      price: 5760000,
      price_display: '₹57.60 Lakhs',
      status: 'AVAILABLE',
      is_featured: false,
      is_visible: true,
      description: 'Prominent corner plot on 40ft double road junction with high visibility and immense appreciation scope.',
      main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prop-3',
      project_id: 'proj-1',
      title: 'Plot 05 - North Facing Compact Plot',
      slug: 'sri-hari-green-enclave-plot-05',
      plot_number: '05',
      property_type: 'RESIDENTIAL_PLOT',
      area_sqft: 900,
      dimensions: '30 x 30 ft',
      facing: 'North',
      price: 2880000,
      price_display: '₹28.80 Lakhs',
      status: 'BOOKED',
      is_featured: false,
      is_visible: true,
      description: 'Ideal compact residential plot for independent single-floor or duplex villa.',
      main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Karthik Subramanian',
      phone: '9840123456',
      email: 'karthik.subramanian@gmail.com',
      project_id: 'proj-1',
      property_id: 'prop-1',
      source: 'WEBSITE_FORM',
      message: 'Interested in a 1200 sqft East facing plot at Sri Hari Green Enclave. Looking for immediate registration.',
      status: 'NEW',
      notes: 'Customer interested in immediate registration & bank loan.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'lead-2',
      name: 'Suresh Kumar',
      phone: '9884567890',
      email: 'suresh.k@outlook.com',
      project_id: 'proj-2',
      property_id: undefined,
      source: 'WHATSAPP_CLICK',
      message: 'Please send brochure and price sheet for Lotus Gated County.',
      status: 'CONTACTED',
      notes: 'Shared brochure on WhatsApp. Scheduled Sunday cab visit.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  contact_enquiries: [
    {
      id: 'c-1',
      name: 'Rajesh Raman',
      phone: '9840998877',
      email: 'rajesh.raman@gmail.com',
      subject: 'Site Visit Enquiry',
      message: 'I would like to schedule a site visit this Saturday for 2 plots in Tambaram.',
      status: 'UNREAD',
      created_at: new Date().toISOString(),
    },
  ],
};

export const checkPostgresConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isPostgresConnected = true;
    return true;
  } catch (error) {
    isPostgresConnected = false;
    return false;
  }
};

export const db = {
  isPostgres: () => isPostgresConnected,
  query: async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
    if (isPostgresConnected) {
      try {
        return await pool.query<T>(text, params);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED' || err.code === '57P01') {
          isPostgresConnected = false;
        } else {
          throw err;
        }
      }
    }

    // Return empty mock query result when PostgreSQL is offline
    return {
      rows: [] as T[],
      command: 'MOCK',
      rowCount: 0,
      oid: 0,
      fields: [],
    };
  },
  getClient: () => pool.connect(),
};
