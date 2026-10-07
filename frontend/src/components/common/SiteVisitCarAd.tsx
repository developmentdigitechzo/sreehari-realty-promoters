'use client';

import React, { useState } from 'react';
import { X, Sparkles, Phone, Zap } from 'lucide-react';
import { CabBookingModal } from './CabBookingModal';

interface SiteVisitCarAdProps {
  className?: string;
}

export const SiteVisitCarAd: React.FC<SiteVisitCarAdProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';
  const cleanPhoneDisplay = phone.replace('+91', '').trim() || '89395 40008';

  if (!isVisible) return null;

  return (
    <>
      {/* Site Theme #108474 Animated Car Ad Ribbon */}
      <div
        className={`relative z-30 bg-[#108474] bg-gradient-to-r from-[#084138] via-[#108474] to-[#084138] text-white py-2 overflow-hidden border-b border-emerald-400/25 shadow-md select-none ${className}`}
      >
        {/* Subtle Animated Road Track Lines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(255,255,255,0.06)_80px,rgba(255,255,255,0.06)_140px)] pointer-events-none" />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/30 hover:bg-black/50 text-emerald-200 hover:text-white transition-all active:scale-95"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Smooth Continuous Moving Car & Ad Text */}
        <div className="w-full overflow-hidden whitespace-nowrap cursor-pointer group">
          <div
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-4 animate-drive-car will-change-transform group-hover:[animation-play-state:paused]"
          >
            {/* The Exact Mint-Cyan Luxury SUV Graphic (Facing Left with Light Beam) */}
            <div className="relative flex items-center shrink-0">
              {/* Headlight Beam Illuminating Forward to the Left */}
              <div className="w-28 sm:w-36 h-7 bg-gradient-to-l from-cyan-100/95 via-sky-300/40 to-transparent blur-[4px] absolute -left-24 sm:-left-32 rounded-full pointer-events-none" />

              {/* Mint-Cyan Luxury SUV Vector (Exact Match to User Reference) */}
              <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105">
                <svg
                  className="w-20 h-7 sm:w-24 sm:h-8"
                  viewBox="0 0 110 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Car Main Metallic Body (Mint Cyan #2DD4BF / #3DE4B6) */}
                  <path
                    d="M10 25L20 14C23 11 27 9 33 9H78C84 9 88 11 91 14.5L99 22C102 23 103 24.5 103 27V29H6V27C6 25 8 25 10 25Z"
                    fill="#3DE4B6"
                  />

                  {/* Lower Gloss Black Skirt */}
                  <path
                    d="M6 28H103V30.5C103 31.5 102 32 100 32H8C7 32 6 31.5 6 30.5V28Z"
                    fill="#0F172A"
                  />

                  {/* Black Floating Contrast Roof & Pillars */}
                  <path
                    d="M24 14L32 9.5H78C82 9.5 85 11 87 13.5L91 19H18L24 14Z"
                    fill="#38BDF8"
                    fillOpacity="0.85"
                  />

                  {/* Roof Top Bar */}
                  <path
                    d="M30 9H80C82 9 84 9.5 85 10.5L88 12H25L28 10C29 9.5 29.5 9 30 9Z"
                    fill="#0F172A"
                  />

                  {/* Window Trim Pillars */}
                  <line x1="52" y1="9.5" x2="52" y2="19" stroke="#0F172A" strokeWidth="2" />
                  <line x1="72" y1="9.5" x2="74" y2="19" stroke="#0F172A" strokeWidth="1.8" />

                  {/* Side Body Crease Highlight Line */}
                  <path
                    d="M28 23H78"
                    stroke="#A7F3D0"
                    strokeWidth="1.2"
                  />

                  {/* Projector LED Headlight on the LEFT */}
                  <path d="M7 23.5L14 23L13 26.5L7 26V23.5Z" fill="#FFFFFF" />
                  <circle cx="9" cy="24.5" r="2" fill="#E0F2FE" />

                  {/* LED Taillight on the RIGHT */}
                  <path d="M100 23.5L103 24V26.5L100 26V23.5Z" fill="#EF4444" />

                  {/* Front Alloy Wheel with Sport Caliper */}
                  <circle cx="23" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="23" cy="29" r="4.5" fill="#CBD5E1" />
                  <circle cx="23" cy="29" r="2.2" fill="#3DE4B6" />
                  <circle cx="21" cy="28" r="1" fill="#EF4444" />

                  {/* Rear Alloy Wheel with Sport Caliper */}
                  <circle cx="83" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="83" cy="29" r="4.5" fill="#CBD5E1" />
                  <circle cx="83" cy="29" r="2.2" fill="#3DE4B6" />
                  <circle cx="81" cy="28" r="1" fill="#EF4444" />
                </svg>
              </div>
            </div>

            {/* Clickable Banner Ad Text (Exact wording as requested) */}
            <div className="flex items-center gap-2.5 text-white font-black text-xs sm:text-sm tracking-wide group-hover:text-emerald-100 transition-colors">
              <span className="drop-shadow-md text-white font-extrabold text-xs sm:text-sm tracking-tight">
                Click Here For Your Free Site Visit --{' '}
                <span className="text-amber-300 font-black underline decoration-amber-400 font-mono tracking-normal">
                  {cleanPhoneDisplay}
                </span>
              </span>

              {/* Free AC Cab Action Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#108474] text-[10px] uppercase font-black tracking-wider shadow-sm hidden sm:inline-flex items-center gap-1 hover:bg-amber-300 hover:text-slate-950 transition-colors">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                Book Free AC Cab
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Chauffeured AC Cab Booking Modal */}
      <CabBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
