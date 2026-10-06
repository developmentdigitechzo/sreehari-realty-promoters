'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Layers,
  Trees,
  Car,
  Calendar,
  Building2,
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { LeadForm } from '../common/LeadForm';
import { EnquiryModal } from '../common/EnquiryModal';
import { getTelLink } from '@/lib/utils';

export const HomeHeroInteractive: React.FC = () => {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState(false);

  const quickLocations = [
    { label: 'All Locations', value: '' },
    { label: 'Tambaram West', value: 'Tambaram' },
    { label: 'Guduvanchery', value: 'Guduvanchery' },
    { label: 'Chengalpattu', value: 'Chengalpattu' },
    { label: 'OMR / Thiruporur', value: 'OMR' },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedLocation) query.set('search', selectedLocation);
    router.push(`/projects?${query.toString()}`);
  };

  const handleChipClick = (locVal: string) => {
    setSelectedLocation(locVal);
    const query = new URLSearchParams();
    if (locVal) query.set('search', locVal);
    router.push(`/projects?${query.toString()}`);
  };

  return (
    <>
      <section className="relative bg-slate-950 text-white overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-24">
        {/* Background Overlay & Gradient */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85"
            alt="Sree Hari Realty Gated Plot Community"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/90 to-slate-950 z-0" />

        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-brand-primaryLight text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>100% DTCP & RERA Approved Land</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15]">
                Own Prime Villa Land in Chennai with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-brand-primaryLight to-amber-300">
                  100% Clear Titles.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                Ready-to-construct gated community plots with 40ft blacktop tar roads, sweet potable water, solar
                street lights, 24/7 security, and instant bank loan approval up to 80%.
              </p>

              {/* Quick Location Chips (Mobile & Desktop) */}
              <div className="space-y-2">
                <div className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-primaryLight" />
                  <span>Popular Locations:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickLocations.map((loc) => (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() => handleChipClick(loc.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedLocation === loc.value
                          ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                          : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Search Widget */}
              <div className="bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xl">
                <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="sm:col-span-5 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primaryLight" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option value="">All Chennai Hubs</option>
                      <option value="Tambaram">Tambaram West</option>
                      <option value="Guduvanchery">Guduvanchery</option>
                      <option value="Chengalpattu">Chengalpattu</option>
                      <option value="OMR">OMR / Thiruporur</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option value="">Any Budget</option>
                      <option value="under30">Under ₹30 Lakhs</option>
                      <option value="30to60">₹30L – ₹60 Lakhs</option>
                      <option value="above60">Above ₹60 Lakhs</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/projects"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95"
                >
                  <span>View All Plots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSiteVisitModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Free Cab Visit</span>
                </button>

                <div className="w-full sm:w-auto">
                  <WhatsAppButton
                    label="WhatsApp Chat"
                    message="Hi Sree Hari Realty, I would like to check plot availability and schedule a free site visit."
                    className="w-full sm:w-auto justify-center"
                  />
                </div>
              </div>

              {/* Mobile Micro Trust Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] sm:text-[11px] font-semibold text-slate-300 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>DTCP / RERA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Instant Patta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>80% Bank Loan</span>
                </div>
              </div>
            </div>

            {/* Right Column: Embedded Lead Form on Desktop, Quick Feature Showcase Card on Mobile */}
            <div className="lg:col-span-5">
              {/* Desktop Form (hidden on mobile to keep mobile hero sleek) */}
              <div className="hidden lg:block">
                <LeadForm
                  title="Schedule a Free Site Visit"
                  subtitle="Complimentary AC cab pick-up & drop, price sheet, and layout PDF delivered instantly."
                  buttonText="Claim Free Site Visit"
                  className="bg-white text-slate-900 shadow-2xl border border-white/20"
                />
              </div>

              {/* Mobile Showcase Card (shows on mobile only) */}
              <div className="block lg:hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-primaryDark/30 border border-slate-800 p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Project Status
                  </span>
                  <span className="text-xs font-black text-amber-300">₹18L – ₹78L</span>
                </div>
                <h4 className="font-black text-base text-white">Sri Hari Green Enclave & Lotus County</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Ready-to-construct villa plots in Tambaram & Guduvanchery with instant registration.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <button
                    onClick={() => setIsSiteVisitModalOpen(true)}
                    className="text-amber-300 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <span>Book AC Cab Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-400">Zero Cost Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Site Visit Modal */}
      <EnquiryModal
        isOpen={isSiteVisitModalOpen}
        onClose={() => setIsSiteVisitModalOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
