import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  Building,
  Trees,
  Route,
  Clock,
  Compass,
  Download,
  Share2,
  CheckCircle2,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { PlotCard } from '@/components/common/PlotCard';
import { VisualPlotGrid } from '@/components/common/VisualPlotGrid';
import { LeadForm } from '@/components/common/LeadForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { MobileStickyBar } from '@/components/home/MobileStickyBar';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';

// Fallback project data if backend is offline during build
const fallbackProjects: Record<string, Partial<Project>> = {
  'sri-hari-green-enclave': {
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
    amenities: [
      { id: '1', name: '24/7 Gated Security & CCTV', category: 'SECURITY' },
      { id: '2', name: '40ft & 30ft Blacktop Roads', category: 'INFRASTRUCTURE' },
      { id: '3', name: 'Solar Street Lights', category: 'INFRASTRUCTURE' },
      { id: '4', name: 'Sweet Drinking Ground Water', category: 'UTILITIES' },
      { id: '5', name: 'Avenue Trees & Landscaped Parks', category: 'ENVIRONMENT' },
      { id: '6', name: 'Underground Drainage System', category: 'UTILITIES' },
    ],
    properties: [
      {
        id: 'p1',
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'p2',
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'p3',
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
};

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await api.getProjectBySlug(slug);
    if (res.success && res.data) {
      return res.data;
    }
  } catch (error) {
    console.error('Error fetching project by slug:', error);
  }

  if (fallbackProjects[slug]) {
    return fallbackProjects[slug] as Project;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) {
    return { title: 'Project Not Found | Sree Hari Realty Promoters' };
  }

  return {
    title: project.seo_title || `${project.name} | Gated Community Plots in ${project.location}`,
    description:
      project.seo_description ||
      `Buy DTCP & RERA approved residential plots in ${project.location} at ${project.name} by Sree Hari Realty Promoters.`,
    openGraph: {
      title: project.name,
      description: project.description,
      images: [{ url: project.main_image_url }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsAppMsg = `Hi Sree Hari Realty, I am interested in ${project.name} located at ${project.location}. Please send me the complete brochure, master plan, and pricing.`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-0">
      {/* Top Project Hero Section */}
      <section className="relative bg-slate-950 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <a href="/" className="hover:text-white">Home</a>
            <span>/</span>
            <a href="/projects" className="hover:text-white">Projects</a>
            <span>/</span>
            <span className="text-brand-primaryLight font-semibold">{project.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                  {project.status}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> DTCP & RERA Approved
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight">
                {project.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <MapPin className="w-4 h-4 text-brand-primaryLight flex-shrink-0" />
                <span>{project.address || project.location}</span>
              </div>

              {project.tagline && (
                <p className="text-sm font-semibold text-rose-300 italic">
                  "{project.tagline}"
                </p>
              )}

              {/* Quick Spec Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Extent</div>
                  <div className="text-base font-bold text-white font-heading">{project.total_area || '10+ Acres'}</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Plots</div>
                  <div className="text-base font-bold text-white font-heading">{project.total_units || '100+ Units'}</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting Price</div>
                  <div className="text-base font-bold text-amber-400 font-heading">{project.price_range || 'Call for Price'}</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Price / Sq.Ft</div>
                  <div className="text-base font-bold text-emerald-400 font-heading">
                    {project.price_per_sqft ? `₹${project.price_per_sqft}` : 'On Request'}
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mt-6">
                <img
                  src={project.main_image_url}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Sticky Enquiry Box */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <LeadForm
                projectId={project.id}
                projectName={project.name}
                source="PROJECT_PAGE"
                title={`Enquire for ${project.name}`}
                subtitle="Download brochure, plot map, and get a personalized price quotation."
                className="bg-white shadow-2xl border border-slate-200"
              />

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={getTelLink(phone)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-primaryLight" />
                  <span>Call Us</span>
                </a>
                <div className="flex-1">
                  <WhatsAppButton
                    label="WhatsApp"
                    message={whatsAppMsg}
                    className="w-full text-xs py-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Project Overview */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                <span>Project Overview</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Key Project Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Key Project Highlights & Approvals</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.highlights.map((hl: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {typeof hl === 'string' ? hl : hl.title}
                        </h4>
                        {hl.description && (
                          <p className="text-[11px] text-slate-500 mt-1 leading-normal">{hl.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Plot Inventory & Interactive Availability Matrix */}
            {project.properties && project.properties.length > 0 && (
              <VisualPlotGrid plots={project.properties} projectName={project.name} />
            )}

            {/* Gated Community Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Trees className="w-5 h-5 text-emerald-600" />
                  <span>Layout Amenities & Infrastructure</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 text-xs font-bold text-slate-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Connectivity Matrix */}
            {project.connectivity && project.connectivity.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Strategic Location & Travel Times</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.connectivity.map((conn: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{conn.title}</span>
                      <span className="font-black text-brand-primary font-heading px-2 py-0.5 bg-white rounded border border-slate-200">
                        {conn.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold font-heading text-white mb-2">Need a Layout Site Map?</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Connect directly with our senior site supervisor to receive high-resolution layout PDF and coordinate a
                weekend visit.
              </p>
              <WhatsAppButton
                label="Get Master Layout Plan"
                message={`Hi Sree Hari Realty, please send me the layout plan for ${project.name}.`}
                className="w-full text-xs"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Mobile Sticky Bar */}
      <MobileStickyBar phone={phone} />
    </div>
  );
}
