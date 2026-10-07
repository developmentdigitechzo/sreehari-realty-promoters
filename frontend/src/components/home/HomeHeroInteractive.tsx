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
  Building,
  Home,
  Check,
  PlusCircle,
  TrendingUp,
  Compass,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { EnquiryModal } from '../common/EnquiryModal';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';

export const HomeHeroInteractive: React.FC = () => {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  // Search State
  const [activeTab, setActiveTab] = useState<'BUY' | 'PLOTS' | 'COMMERCIAL' | 'FARMLAND' | 'SELL'>('BUY');
  const [location, setLocation] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [budgetVal, setBudgetVal] = useState(0); // 0 = Any, in lakhs

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'location' | 'type' | 'budget' | null>(null);

  // Modals
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const locationsList = [
    { value: 'all', label: 'All Tamil Nadu Locations' },
    { value: 'Tambaram', label: 'Tambaram West, Chennai' },
    { value: 'Guduvanchery', label: 'Guduvanchery, GST Road' },
    { value: 'Chengalpattu', label: 'Chengalpattu NH 32' },
    { value: 'OMR', label: 'OMR / Thiruporur IT Corridor' },
    { value: 'Padappai', label: 'Padappai - Sriperumbudur' },
    { value: 'Kanchipuram', label: 'Kanchipuram Highway' },
  ];

  const typesList = [
    { value: 'all', label: 'All Property Types' },
    { value: 'RESIDENTIAL_PLOT', label: 'Residential Villa Plots' },
    { value: 'COMMERCIAL_PLOT', label: 'Commercial Frontage Plots' },
    { value: 'FARMLAND', label: 'Farm Land & Agro Plots' },
    { value: 'GATED_COMMUNITY', label: 'Gated Villa Communities' },
  ];

  const handleTabClick = (tab: 'BUY' | 'PLOTS' | 'COMMERCIAL' | 'FARMLAND' | 'SELL') => {
    setActiveTab(tab);
    if (tab === 'SELL') {
      setIsSellModalOpen(true);
      return;
    }
    if (tab === 'PLOTS') setPropertyType('RESIDENTIAL_PLOT');
    else if (tab === 'COMMERCIAL') setPropertyType('COMMERCIAL_PLOT');
    else if (tab === 'FARMLAND') setPropertyType('FARMLAND');
    else setPropertyType('all');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location !== 'all') query.set('search', location);
    if (propertyType !== 'all') query.set('type', propertyType);
    if (budgetVal > 0) query.set('max_price', (budgetVal * 100000).toString());
    router.push(`/projects?${query.toString()}`);
  };

  const formatBudgetDisplay = (val: number) => {
    if (val === 0) return 'Any Price';
    if (val < 100) return `Upto ₹${val} Lakhs`;
    return `Upto ₹${(val / 100).toFixed(1)} Crore`;
  };

  return (
    <>
      <section className="relative bg-[#120B05] text-white overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        {/* Background Overlay & Warm Glows (matching Thanjai Property's Luxury Canvas) */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="Sree Hari Realty Gated Community Plots"
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#120B05]/85 via-[#1C1917]/90 to-[#120B05] z-0" />

        {/* Ambient Warm Golden & Terracotta Glows */}
        <div className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-primary/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. Hero Text Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SREE HARI REALTY • SINCE 2009 • TAMIL NADU</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.12]">
              Find a Property That<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400">
                Fits Your Future.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover 100% DTCP & CMDA approved residential villa plots, commercial layouts, and nature farmlands across Chennai, Tambaram, Guduvanchery & Chengalpattu.
            </p>
          </div>

          {/* 2. Floating Luxury Property Search Panel (Direct Thanjai Property Design) */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-4 sm:p-6 sm:pb-7 shadow-2xl border border-amber-900/10 text-slate-900 relative">
              {/* Top Bar: Eyebrow + Segmented Control Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>FIND YOUR PERFECT PROPERTY</span>
                </div>

                {/* Segmented Control Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto scrollbar-none">
                  {[
                    { id: 'BUY', label: 'BUY', icon: Home },
                    { id: 'PLOTS', label: 'PLOTS', icon: Layers },
                    { id: 'COMMERCIAL', label: 'COMMERCIAL', icon: Building2 },
                    { id: 'FARMLAND', label: 'FARMLAND', icon: Trees },
                    { id: 'SELL', label: 'SELL', icon: PlusCircle, isHighlight: true },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabClick(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shrink-0 ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : tab.isHighlight
                            ? 'text-brand-primary hover:bg-rose-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unified Horizontal Search Form */}
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Field 1: LOCATION */}
                <div className="md:col-span-4 relative">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          LOCATION
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[180px] block">
                          {locationsList.find((l) => l.value === location)?.label}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === 'location' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 space-y-1 animate-in fade-in">
                      {locationsList.map((l) => (
                        <div
                          key={l.value}
                          onClick={() => {
                            setLocation(l.value);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                            location === l.value ? 'bg-amber-50 text-amber-900' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{l.label}</span>
                          {location === l.value && <Check className="w-4 h-4 text-amber-700" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 2: PROPERTY TYPE */}
                <div className="md:col-span-4 relative">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-brand-primary flex items-center justify-center shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          PROPERTY TYPE
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[180px] block">
                          {typesList.find((t) => t.value === propertyType)?.label}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === 'type' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 space-y-1 animate-in fade-in">
                      {typesList.map((t) => (
                        <div
                          key={t.value}
                          onClick={() => {
                            setPropertyType(t.value);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                            propertyType === t.value ? 'bg-rose-50 text-brand-primary' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{t.label}</span>
                          {propertyType === t.value && <Check className="w-4 h-4 text-brand-primary" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 3: BUDGET */}
                <div className="md:col-span-4 relative">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          BUDGET RANGE
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[180px] block">
                          {formatBudgetDisplay(budgetVal)}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'budget' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Budget Slider Dropdown */}
                  {openDropdown === 'budget' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Max Budget</span>
                        <span className="text-xs font-black text-brand-primary">{formatBudgetDisplay(budgetVal)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={budgetVal}
                        onChange={(e) => setBudgetVal(parseInt(e.target.value))}
                        className="w-full accent-brand-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Any</span>
                        <span>₹25L</span>
                        <span>₹50L</span>
                        <span>₹1Cr</span>
                        <span>₹2Cr+</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="w-full py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold active:scale-95"
                      >
                        Apply Budget
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Submit Buttons */}
                <div className="md:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  {/* Free AC Cab Site Visit quick trigger */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsSiteVisitModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 active:scale-95"
                    >
                      <Car className="w-4 h-4 text-amber-600" />
                      <span>Book Free AC Cab Site Visit</span>
                    </button>
                  </div>

                  {/* Big Search Submit Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Category Discovery Pills (Below Search Card) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6">
              <Link
                href="/projects?type=RESIDENTIAL_PLOT"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Villa Plots</span>
                  <span className="text-[10px] text-slate-400">DTCP Approved</span>
                </div>
              </Link>

              <Link
                href="/projects?type=COMMERCIAL_PLOT"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Commercial</span>
                  <span className="text-[10px] text-slate-400">High Footfall</span>
                </div>
              </Link>

              <Link
                href="/projects?type=FARMLAND"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Trees className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Farmlands</span>
                  <span className="text-[10px] text-slate-400">Green Retreats</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsSellModalOpen(true)}
                className="bg-amber-500/15 hover:bg-amber-500/25 backdrop-blur-md border border-amber-500/30 p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 group text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform font-bold">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-amber-300 block">Seller Desk</span>
                  <span className="text-[10px] text-amber-200/80">List for Free</span>
                </div>
              </button>
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

      {/* Sell / Promote Property Modal */}
      <EnquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        source="SELLER_DESK"
      />
    </>
  );
};
