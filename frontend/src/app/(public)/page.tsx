import React from 'react';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { HomeHeroInteractive } from '@/components/home/HomeHeroInteractive';
import { TrustCredentials } from '@/components/home/TrustCredentials';
import { ProjectShowcaseTabs } from '@/components/home/ProjectShowcaseTabs';
import { EmiCalculatorWidget } from '@/components/home/EmiCalculatorWidget';
import { InteractiveBuyingJourney } from '@/components/home/InteractiveBuyingJourney';
import { LocationsExplorer } from '@/components/home/LocationsExplorer';
import { MobileStickyBar } from '@/components/home/MobileStickyBar';
import { Trees, ShieldCheck, Route, Sun, Droplet, Smile, Phone, Car } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { LeadForm } from '@/components/common/LeadForm';
import { getTelLink } from '@/lib/utils';

// Default fallback projects with rich metadata
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Sri Hari Green Enclave',
    slug: 'sri-hari-green-enclave',
    tagline: 'Premium CMDA & RERA Approved Residential Villa Plots at Tambaram West',
    description:
      'Exclusive 12-acre gated community featuring 140 well-planned residential plots surrounded by lush greenery. Wide 40ft blacktop roads, solar street lighting, 24/7 security guard post, and immediate DTCP/RERA approvals.',
    location: 'Tambaram West, Chennai',
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
      { title: 'DTCP & RERA Approved', description: '100% legal clarity with clear parent documents.' },
      { title: '7 Mins from Tambaram Station', description: 'Immediate connectivity to GST Road and 400ft ORR.' },
      { title: 'Elevated Land', description: 'Non-flood prone high-elevation land with sweet drinking water.' },
    ],
    connectivity: [
      { title: 'Tambaram Railway Station', distance: '7 Mins' },
      { title: 'Outer Ring Road (ORR)', distance: '3 Mins' },
      { title: 'Chennai Airport', distance: '22 Mins' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lotus Gated County',
    slug: 'lotus-gated-county',
    tagline: 'Luxury Gated Villa Plots with Grand Entrance Arch at Guduvanchery',
    description:
      'Landmark 18-acre gated plotted community nestled in the booming corridor of Guduvanchery near SRM University. 200+ residential plots, dedicated parks, children play zones, and underground utilities.',
    location: 'Guduvanchery, GST Road, Chennai',
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
    highlights: [
      { title: 'Grand Clubhouse Zone', description: 'Designed community space for wellness and gatherings.' },
      { title: 'Close to SRM & Mahindra City', description: 'High rental and appreciation potential.' },
    ],
    connectivity: [
      { title: 'Guduvanchery Bus Terminus', distance: '5 Mins' },
      { title: 'SRM University', distance: '10 Mins' },
      { title: 'Mahindra World City', distance: '15 Mins' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sri Hari Emerald Meadows',
    slug: 'sri-hari-emerald-meadows',
    tagline: 'Eco-Luxury Nature Plots & Farm Villas at Chengalpattu Highway',
    description:
      'Expansive layout plots from 1200 sqft to 3000 sqft surrounded by lush mango groves and scenic hill views. Perfect for both weekend resort living and long-term capital appreciation.',
    location: 'Chengalpattu, Tamil Nadu',
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
    highlights: [
      { title: 'Pure Organic Living', description: 'Over 200 fruit-bearing trees and landscaped greenery.' },
      { title: 'Rapid Industrial Growth', description: 'Close to Chengalpattu Medical College & Auto Hubs.' },
    ],
    connectivity: [
      { title: 'Chengalpattu Railway', distance: '10 Mins' },
      { title: 'National Highway NH 32', distance: '4 Mins' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Vedic Temple City Layout',
    slug: 'vedic-temple-city-layout',
    tagline: 'Fully Sold Out Gated Layout Near Thiruporur Murugan Temple',
    description:
      'Completed and delivered gated plot project by Sree Hari Realty Promoters in Thiruporur, OMR.',
    location: 'OMR - Thiruporur, Chennai',
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
    highlights: [{ title: '100% Sold Out & Delivered', description: 'Families already residing in independent villas.' }],
    connectivity: [{ title: 'OMR IT Corridor', distance: '2 Mins' }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await api.getProjects();
    if (res.success && res.data && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.error('Error fetching featured projects:', error);
  }
  return initialProjects;
}

export default async function HomePage() {
  const projects = await getFeaturedProjects();
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* 1. CREATIVE INTERACTIVE HERO SECTION */}
      <HomeHeroInteractive />

      {/* 2. GOVERNMENT TRUST & LEGAL VERIFICATION METRICS */}
      <TrustCredentials />

      {/* 3. TABBED PROJECT SHOWCASE (MOBILE SNAP-SCROLL + DESKTOP GRID) */}
      <ProjectShowcaseTabs initialProjects={projects} />

      {/* 4. PLOT EMI & INVESTMENT BUDGET CALCULATOR */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmiCalculatorWidget />
        </div>
      </section>

      {/* 5. 4-STEP PLOTTED LAND BUYING JOURNEY */}
      <InteractiveBuyingJourney />

      {/* 6. PRIME GROWTH CORRIDORS EXPLORER */}
      <LocationsExplorer />

      {/* 7. MASTER GATED AMENITIES SHOWCASE */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
            <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">
              Standard Community Features
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white mt-1 sm:mt-2">
              World-Class Gated Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">
              Every layout by Sree Hari Realty Promoters is built with complete infrastructure ready for immediate villa construction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { title: '24/7 Gated Security', desc: 'Guard post & CCTV surveillance', icon: ShieldCheck, color: 'text-emerald-400' },
              { title: '40ft Blacktop Roads', desc: 'Heavy duty asphalt tar roads', icon: Route, color: 'text-amber-400' },
              { title: 'Solar Street Lights', desc: 'Eco-friendly automatic illumination', icon: Sun, color: 'text-yellow-400' },
              { title: 'Sweet Ground Water', desc: 'Abundant potable water table', icon: Droplet, color: 'text-blue-400' },
              { title: 'Avenue Plantation', desc: 'Tree-lined walkways & gardens', icon: Trees, color: 'text-emerald-400' },
              { title: 'Children Play Area', desc: 'Parks & jogging tracks', icon: Smile, color: 'text-rose-400' },
              { title: 'Compound Perimeter', desc: '100% fenced secure boundary', icon: ShieldCheck, color: 'text-purple-400' },
              { title: 'Immediate EB & Patta', desc: 'Fast utility & name transfer', icon: ShieldCheck, color: 'text-brand-primaryLight' },
            ].map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-primary/50 transition-all hover:bg-slate-800"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-2.5 sm:mb-3">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${amenity.color}`} />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">{amenity.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">{amenity.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FREE CHAUFFEURED SITE VISIT FINAL INVITATION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-rose-950 via-brand-primaryDark to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest">
                Complimentary Buyer Service
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white leading-tight">
                Book a Free Weekend Site Visit with Doorstep AC Cab Pick-Up
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 max-w-lg leading-relaxed">
                Experience our prime locations in person. Our layout supervisor will guide you through plot dimensions,
                demonstrate road widths, provide legal parent document copies, and calculate exact bank loan EMIs.
              </p>
              <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-4">
                <a
                  href={getTelLink(phone)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-primaryDark font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-lg active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {phone}</span>
                </a>
                <WhatsAppButton
                  label="Book Visit on WhatsApp"
                  message="Hi Sree Hari Realty, I want to book a free weekend site visit for your gated community plots."
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <LeadForm
                title="Instant Site Visit Request"
                subtitle="Leave your contact number for immediate cab scheduling & price quote."
                className="bg-white text-slate-900 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. MOBILE STICKY BOTTOM ACTION BAR (ANDROID & IOS OPTIMIZED) */}
      <MobileStickyBar phone={phone} whatsapp={whatsappNum} />
    </div>
  );
}
