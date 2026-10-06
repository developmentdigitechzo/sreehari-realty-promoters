import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Trees,
  Route,
  Building,
  ArrowRight,
  Phone,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ProjectCard } from '@/components/common/ProjectCard';
import { LeadForm } from '@/components/common/LeadForm';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { getTelLink } from '@/lib/utils';
import { Project } from '@/types';

// Fallback projects in case backend is loading or during SSG build
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
];

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await api.getProjects({ featured: true });
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

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85"
            alt="Sree Hari Realty Promoters Land Development"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-brand-primaryLight text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Gated Community Plots in Chennai</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Invest in Your Dream Land. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-brand-primaryLight to-amber-300">
                  Ready to Build Villa Plots
                </span>{' '}
                with 100% Clear Titles.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Sree Hari Realty Promoters brings you DTCP & CMDA approved gated plotted communities in high-growth
                corridors. Equipped with 40ft blacktop roads, solar street lights, abundant groundwater, and instant bank
                loan approvals.
              </p>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DTCP & RERA Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Immediate Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Up to 80% Bank Loan</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-brand-primary/40 flex items-center gap-2"
                >
                  <span>Explore Available Plots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <WhatsAppButton
                  label="Enquire on WhatsApp"
                  message="Hi Sree Hari Realty, I would like to check plot availability and schedule a free site visit."
                />

                <a
                  href={getTelLink(phone)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-slate-200 hover:text-white font-semibold text-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-brand-primaryLight" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>

            {/* Right Quick Site-Visit Form */}
            <div className="lg:col-span-5">
              <LeadForm
                title="Book a Free Site Visit"
                subtitle="Get free cab pick-up & drop, project brochure, and price quote directly to your phone."
                buttonText="Claim Free Site Visit"
                className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & APPROVAL METRICS BAR */}
      <section className="bg-slate-900 text-white border-y border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-black text-amber-400 font-heading">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Clear Legal Parent Titles</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-heading">DTCP / RERA</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Government Approved Layouts</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-black text-brand-primaryLight font-heading">80% Loan</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Leading Bank Tie-ups (SBI/HDFC)</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-black text-blue-400 font-heading">Ready to Build</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Surrounded by Occupied Homes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SHOWCASE */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>Featured Communities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900">
                Flagship Plot Projects
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Explore handpicked gated layout developments located in prime Chennai corridors with rapid capital
                appreciation.
              </p>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primaryDark transition-colors group"
            >
              <span>View All Projects & Plots</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS / WHY BUY LAND WITH SREE HARI REALTY */}
      <section className="py-16 lg:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              The Sree Hari Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 mt-2">
              Why Smart Investors Choose Our Gated Plots
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              We eliminate uncertainty from land purchasing with transparent legal vetting and world-class infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-primary/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-brand-primary mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">100% Legal Title Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every project is verified with 30-year encumbrance-free legal parent documents, approved by DTCP and
                registered with RERA.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">Developed Gated Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enjoy 30 & 40ft wide blacktop tar roads, grand entrance arch, compound walls, solar street lights, and
                landscaped avenue trees.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500/30 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">High Appreciation Corridors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategically positioned along Outer Ring Road, GST Highway, and OMR growth corridors with proximity to
                schools, IT parks, and transit hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GATED COMMUNITY AMENITIES SHOWCASE */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Premium Specifications</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white mt-2">
              Modern Amenities in Every Layout
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed to give your family a secure, nature-friendly, and comfortable living environment from day one.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: '24/7 Security & CCTV', desc: 'Gated boundary with guard post' },
              { title: '40ft Blacktop Roads', desc: 'Heavy-duty asphalt tar roads' },
              { title: 'Solar Street Lights', desc: 'Eco-friendly automatic lighting' },
              { title: 'Sweet Potable Water', desc: 'High ground water table' },
              { title: 'Avenue Plantation', desc: 'Lush greenery and tree-lined walkways' },
              { title: 'Children Play Area', desc: 'Dedicated park and leisure space' },
              { title: 'Underground Drainage', desc: 'Proper storm water channel system' },
              { title: 'Immediate EB Connection', desc: 'Electricity poles and transformer' },
            ].map((amenity, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-primary/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/20 text-brand-primaryLight flex items-center justify-center mb-3">
                  <Trees className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">{amenity.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FREE SITE VISIT & FINAL ENQUIRY CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-rose-900 via-brand-primaryDark to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Complimentary Service
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white">
                Book a Free Weekend Site Visit with Pick-up & Drop
              </h2>
              <p className="text-sm text-rose-100 max-w-lg leading-relaxed">
                Experience the location in person. Our property specialist will guide you through the layout,
                demonstrate plot dimensions, provide legal copies, and assist with bank loan calculations.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={getTelLink(phone)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-primaryDark font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {phone}</span>
                </a>
                <WhatsAppButton
                  label="Book Site Visit on WhatsApp"
                  message="Hi Sree Hari Realty, I want to book a free weekend site visit for your plots."
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <LeadForm
                title="Instant Callback Request"
                subtitle="Leave your contact number for immediate pricing & layout assistance."
                className="bg-white text-slate-900"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
