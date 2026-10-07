'use client';

import React, { useState, useEffect } from 'react';
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
  Activity,
  Flame,
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { EnquiryModal } from '../common/EnquiryModal';
import { CabBookingModal } from '../common/CabBookingModal';
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

  // Dynamic Background Image Carousel (Inspired by Thanjai Property Reference)
  const bgSlides = [
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85',
      title: 'DTCP Gated Community Plots',
      tag: 'Tambaram & Guduvanchery',
    },
    {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
      title: 'Luxury Villa Communities',
      tag: 'Ready to Build Plots',
    },
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85',
      title: 'Green Farmlands & Agro Layouts',
      tag: 'Chengalpattu NH 32',
    },
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
      title: 'High-Footfall Commercial Frontage',
      tag: '400ft Outer Ring Road',
    },
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Background slide auto-transition every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % bgSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgSlides.length]);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'location' | 'type' | 'budget' | null>(null);

  // Dynamic Rotating Headline Text
  const rotatingWords = [
    'Fits Your Future.',
    'Builds Generational Wealth.',
    'Offers 100% Clear Titles.',
    'Grows with Rapid Appreciation.',
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsFading(false);
      }, 350);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

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
      <section className="relative bg-slate-950 text-white overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-26">
        {/* 1. Dynamic Multi-Slide Hero Background Image Method (Thanjai Property Reference - Bright & Clearly Visible) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {bgSlides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-90 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className={`w-full h-full object-cover origin-center brightness-95 ${
                    isActive ? 'scale-105 transition-transform duration-[8000ms] ease-out' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Cinematic Translucent Dark Overlay for Sharp Text Legibility without Hiding Photos */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-slate-950/85 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />

        {/* 2. Floating Ambient Glow Accents */}
        <div className="absolute top-8 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#108474]/20 rounded-full blur-[140px] pointer-events-none z-10 animate-float-orb-1" />
        <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#108474]/15 rounded-full blur-[140px] pointer-events-none z-10 animate-float-orb-2" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Live Activity Animated Ticker Pill with #108474 theme & #e52e3d accessory flame */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200 animate-float-slow shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#108474] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#108474]"></span>
              </span>
              <span>14 Gated Plots Booked This Week in Tambaram & Guduvanchery</span>
              <Flame className="w-3.5 h-3.5 text-[#e52e3d] animate-bounce" />
            </div>
          </div>

          {/* 3. Hero Text Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
            {/* Shimmering Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#108474]/20 border border-[#108474]/40 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 animate-shimmer-sweep pointer-events-none" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>SREE HARI REALTY • SINCE 2009 • TAMIL NADU</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            {/* Main Headline with Dynamic Animated Text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.12]">
              Find a Property That<br />
              <span
                className={`inline-block transition-all duration-300 transform text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-400 animate-text-gradient ${
                  isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover 100% DTCP & CMDA approved residential villa plots, commercial layouts, and nature farmlands across Chennai, Tambaram, Guduvanchery & Chengalpattu.
            </p>
          </div>

          {/* 4. Floating Luxury Property Search Panel */}
          <div className="max-w-5xl mx-auto transform transition-all duration-500 hover:shadow-2xl">
            <div className="bg-white rounded-3xl p-4 sm:p-6 sm:pb-7 shadow-2xl border border-[#108474]/20 text-slate-900 relative">
              {/* Top Bar: Eyebrow + Segmented Control Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#108474] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#e52e3d] animate-pulse" />
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
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 shrink-0 ${
                          isActive
                            ? 'bg-[#108474] text-white shadow-md scale-102'
                            : tab.isHighlight
                            ? 'text-[#e52e3d] hover:bg-rose-50'
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
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-all hover:border-[#108474]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#f0fdfa] text-[#108474] flex items-center justify-center shrink-0 border border-[#108474]/20">
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
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === 'location' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {locationsList.map((l) => (
                        <div
                          key={l.value}
                          onClick={() => {
                            setLocation(l.value);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                            location === l.value ? 'bg-[#f0fdfa] text-[#108474] font-black' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{l.label}</span>
                          {location === l.value && <Check className="w-4 h-4 text-[#108474]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 2: PROPERTY TYPE */}
                <div className="md:col-span-4 relative">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-all hover:border-[#108474]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#f0fdfa] text-[#108474] flex items-center justify-center shrink-0 border border-[#108474]/20">
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
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === 'type' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {typesList.map((t) => (
                        <div
                          key={t.value}
                          onClick={() => {
                            setPropertyType(t.value);
                            setOpenDropdown(null);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                            propertyType === t.value ? 'bg-[#f0fdfa] text-[#108474] font-black' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{t.label}</span>
                          {propertyType === t.value && <Check className="w-4 h-4 text-[#108474]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 3: BUDGET */}
                <div className="md:col-span-4 relative">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between transition-all hover:border-[#108474]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#f0fdfa] text-[#108474] flex items-center justify-center shrink-0 border border-[#108474]/20">
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
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'budget' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Budget Slider Dropdown */}
                  {openDropdown === 'budget' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Max Budget</span>
                        <span className="text-xs font-black text-[#108474]">{formatBudgetDisplay(budgetVal)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="10"
                        value={budgetVal}
                        onChange={(e) => setBudgetVal(parseInt(e.target.value))}
                        className="w-full accent-[#108474] cursor-pointer"
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
                        className="w-full py-2 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] text-white text-xs font-bold active:scale-95 transition-transform"
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
                      className="inline-flex items-center gap-1.5 text-[#108474] hover:text-[#0c6a5d] font-bold bg-[#f0fdfa] hover:bg-[#ccfbf1] px-3.5 py-2 rounded-2xl border border-[#108474]/30 active:scale-95 transition-all shadow-sm"
                    >
                      <Car className="w-4 h-4 text-[#108474] animate-bounce" />
                      <span>Book Free AC Cab Site Visit</span>
                    </button>
                  </div>

                  {/* Pulsing Glowing Search Submit Button with #108474 & #e52e3d accessory */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-sm flex items-center justify-center gap-2 animate-pulse-glow transition-all active:scale-95 cursor-pointer relative overflow-hidden group shadow-lg shadow-[#108474]/30"
                  >
                    <div className="absolute inset-0 animate-shimmer-sweep opacity-30 pointer-events-none" />
                    <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 5. Staggered Animated Category Discovery Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6">
              <Link
                href="/projects?type=RESIDENTIAL_PLOT"
                className="bg-white/5 hover:bg-white/12 backdrop-blur-md border border-white/10 hover:border-[#108474]/60 p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#108474]/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#108474] group-hover:text-white transition-all duration-300">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">Villa Plots</span>
                  <span className="text-[10px] text-slate-400">DTCP Approved</span>
                </div>
              </Link>

              <Link
                href="/projects?type=COMMERCIAL_PLOT"
                className="bg-white/5 hover:bg-white/12 backdrop-blur-md border border-white/10 hover:border-[#108474]/60 p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#108474]/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#108474] group-hover:text-white transition-all duration-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">Commercial</span>
                  <span className="text-[10px] text-slate-400">High Footfall</span>
                </div>
              </Link>

              <Link
                href="/projects?type=FARMLAND"
                className="bg-white/5 hover:bg-white/12 backdrop-blur-md border border-white/10 hover:border-[#108474]/60 p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#108474]/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#108474] group-hover:text-white transition-all duration-300">
                  <Trees className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">Farmlands</span>
                  <span className="text-[10px] text-slate-400">Green Retreats</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsSellModalOpen(true)}
                className="bg-[#108474]/20 hover:bg-[#108474]/30 backdrop-blur-md border border-[#108474]/50 hover:border-[#108474] p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#e52e3d] text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 font-bold shadow-md shadow-[#e52e3d]/30">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">Seller Desk</span>
                  <span className="text-[10px] text-emerald-300">List for Free</span>
                </div>
              </button>
            </div>

            {/* 6. Thanjai Property Style Hero Background Image Carousel Indicators */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {bgSlides.map((slide, sIdx) => {
                const isCurrent = sIdx === currentSlideIndex;
                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(sIdx)}
                    className={`group/dot relative flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-300 active:scale-95 ${
                      isCurrent
                        ? 'bg-[#108474] text-white shadow-md shadow-[#108474]/30 border border-emerald-300/40 scale-105'
                        : 'bg-black/30 hover:bg-black/50 text-slate-400 hover:text-white border border-white/10'
                    }`}
                    title={slide.title}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isCurrent ? 'bg-white' : 'bg-slate-400 group-hover/dot:bg-white'
                      }`}
                    />
                    <span className="text-[10px] font-bold hidden sm:inline truncate max-w-[120px]">
                      {slide.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Free Chauffeured AC Cab Site Visit Modal */}
      <CabBookingModal
        isOpen={isSiteVisitModalOpen}
        onClose={() => setIsSiteVisitModalOpen(false)}
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
