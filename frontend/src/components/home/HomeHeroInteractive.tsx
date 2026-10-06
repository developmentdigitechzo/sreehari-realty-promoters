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
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { LeadForm } from '../common/LeadForm';
import { getTelLink } from '@/lib/utils';

export const HomeHeroInteractive: React.FC = () => {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';

  // Quick Filter State
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedLocation) query.set('search', selectedLocation);
    router.push(`/projects?${query.toString()}`);
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Graphic & Images */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=85"
          alt="Sree Hari Realty Land Project"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 z-0" />

      {/* Floating Accent Blur Circles */}
      <div className="absolute top-12 left-1/3 w-72 h-72 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-brand-primaryLight text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% DTCP & RERA Approved Plotted Communities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.15]">
              Own Prime Villa Land in Chennai with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-brand-primaryLight to-amber-300">
                100% Clear Titles.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              Explore high-growth gated community plots equipped with 40ft blacktop roads, sweet groundwater, solar
              lighting, 24/7 security, and instant bank loan approvals up to 80%.
            </p>

            {/* Quick Hero Filter Widget */}
            <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xl">
              <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                <div className="sm:col-span-5 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primaryLight" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="">All Locations</option>
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
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center gap-2"
              >
                <span>View Available Plots</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <WhatsAppButton
                label="WhatsApp Enquiry"
                message="Hi Sree Hari Realty, I would like to check plot availability and schedule a free site visit."
              />

              <a
                href={getTelLink(phone)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-slate-200 text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-brand-primaryLight" />
                <span>Call Us</span>
              </a>
            </div>

            {/* Mini Trust Micro-badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 max-w-lg text-[11px] font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>DTCP Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Instant Registry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>80% Bank Loan</span>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Widget Column */}
          <div className="lg:col-span-5">
            <LeadForm
              title="Schedule a Free Site Visit"
              subtitle="Complimentary AC cab pick-up & drop, price sheet, and layout PDF delivered instantly."
              buttonText="Claim Free Site Visit"
              className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
