import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <BrandLogo size="lg" />
      </div>

      <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-4">
        <span className="text-5xl font-black font-heading text-brand-primary">404</span>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          The property, project, or page you are looking for might have been moved, renamed, or is temporarily
          unavailable.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-all shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Explore Plots</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
