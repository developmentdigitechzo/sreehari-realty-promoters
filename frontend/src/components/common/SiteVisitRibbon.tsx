'use client';

import React, { useState } from 'react';
import { Car, Phone, Calendar, ArrowRight, X, Sparkles } from 'lucide-react';
import { getTelLink } from '@/lib/utils';
import { EnquiryModal } from './EnquiryModal';

export const SiteVisitRibbon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  if (!isVisible) return null;

  return (
    <>
      <div className="relative z-30 bg-gradient-to-r from-amber-600 via-brand-primary to-amber-700 text-white py-2.5 px-3 sm:px-4 shadow-md overflow-hidden border-y border-white/10">
        {/* Animated Background Road Lines Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.08)_40px,rgba(255,255,255,0.08)_80px)] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
          {/* Animated Car Icon & Heading */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {/* Moving Car Graphic with Headlight Beam */}
            <div className="relative flex items-center shrink-0">
              {/* Headlight beam glow */}
              <div className="w-6 sm:w-10 h-3 bg-gradient-to-r from-yellow-200/60 to-transparent blur-[3px] absolute -right-4 sm:-right-8" />
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                <Car className="w-4 h-4 text-amber-200 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-left">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Free AC Cab Site Visit
              </span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Doorstep Pick-up & Drop Across Chennai
              </span>
            </div>
          </div>

          {/* Action CTAs: Direct Call & Book Cab Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getTelLink(phone)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 text-amber-200 font-bold text-xs border border-white/20 transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{phone}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Book Free Cab</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
            </button>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg hover:bg-black/20 text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss Site Visit Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
