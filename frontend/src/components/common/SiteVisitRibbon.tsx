'use client';

import React, { useState } from 'react';
import { Phone, Calendar, ArrowRight, X, Sparkles, Car } from 'lucide-react';
import { getTelLink } from '@/lib/utils';
import { EnquiryModal } from './EnquiryModal';

export const SiteVisitRibbon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';

  if (!isVisible) return null;

  return (
    <>
      <div className="relative z-30 bg-[#0066B3] bg-gradient-to-r from-[#005599] via-[#006BB8] to-[#004A85] text-white py-2 shadow-md overflow-hidden border-b border-white/10 select-none">
        {/* Subtle Road Track Background Lines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,rgba(255,255,255,0.06)_50px,rgba(255,255,255,0.06)_100px)] opacity-70 pointer-events-none" />

        {/* Dismiss Button on the Right */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/25 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Animated Moving Car + Call to Action Banner (Driving Right to Left) */}
        <div className="w-full overflow-hidden whitespace-nowrap cursor-pointer group">
          <div
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-4 animate-drive-right-to-left will-change-transform group-hover:[animation-play-state:paused]"
          >
            {/* Moving Car Graphic with Headlight Beam projecting forward to the Left */}
            <div className="relative flex items-center shrink-0">
              {/* Headlight beam illuminating forward to the LEFT */}
              <div className="w-14 sm:w-20 h-5 bg-gradient-to-l from-cyan-200/80 via-white/50 to-transparent blur-[3px] absolute -left-12 sm:-left-16 rounded-full pointer-events-none" />

              {/* Realistic Sleek SUV / Cab SVG Graphic (Facing LEFT) */}
              <div className="relative flex items-center justify-center filter drop-shadow-md">
                <svg
                  className="w-12 h-6 sm:w-14 sm:h-7 text-cyan-300"
                  viewBox="0 0 64 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Car Body */}
                  <path
                    d="M10 20L16 11C17.5 8.5 20.5 7 24 7H46C49 7 51.5 8.5 53 11L57 17C59 17.5 60 19 60 21V24H6V22C6 20 8 20 10 20Z"
                    fill="#38BDF8"
                  />
                  {/* Roof & Windows */}
                  <path
                    d="M18 12L23 8.5H45C47 8.5 48.5 9.5 49.5 11.5L52.5 16H14.5L18 12Z"
                    fill="#E0F2FE"
                  />
                  {/* Window Divider Pillar */}
                  <line x1="33" y1="8.5" x2="33" y2="16" stroke="#0369A1" strokeWidth="1.5" />
                  {/* Headlights (Glowing Yellow/White on the LEFT) */}
                  <ellipse cx="8" cy="21" rx="2" ry="2" fill="#FEF08A" />
                  {/* Taillights on the RIGHT */}
                  <ellipse cx="58" cy="20" rx="1.5" ry="1.5" fill="#EF4444" />
                  {/* Wheels */}
                  <circle cx="18" cy="24" r="5" fill="#0F172A" />
                  <circle cx="18" cy="24" r="2.5" fill="#94A3B8" />
                  <circle cx="48" cy="24" r="5" fill="#0F172A" />
                  <circle cx="48" cy="24" r="2.5" fill="#94A3B8" />
                </svg>
              </div>
            </div>

            {/* Clickable Banner Text matching Reference Image 1 */}
            <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm tracking-wide group-hover:text-amber-200 transition-colors">
              <span className="drop-shadow-sm">
                Click Here For Your Free Site Visit -- {phone}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-extrabold tracking-wider text-amber-200 border border-white/30 hidden sm:inline">
                Book Cab Now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Site Visit Booking Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
