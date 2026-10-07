'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, Compass, MessageCircle, Phone, ArrowLeft, Building } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/projects?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/projects');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div className="mb-6">
        <BrandLogo size="lg" />
      </div>

      <div className="max-w-lg w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-5">
        <div className="space-y-2">
          <span className="text-6xl font-black font-heading text-brand-primary">404</span>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Looking for a Gated Plot or Layout?
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            The page you requested may have been moved or updated. Search our verified layout plots or return to our active listings below.
          </p>
        </div>

        {/* Search Bar on 404 Page */}
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by location (e.g. Tambaram, Guduvanchery)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Direct Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Building className="w-4 h-4" />
            <span>Explore Plots</span>
          </Link>
        </div>

        {/* Direct Contact Help */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
          <a
            href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I need help finding a plot on your website.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>
          <span className="text-slate-300">|</span>
          <a
            href={getTelLink(phone)}
            className="text-slate-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 text-brand-primary" />
            <span>Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
