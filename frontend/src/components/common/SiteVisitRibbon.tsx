'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Calendar, ArrowRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { getTelLink } from '@/lib/utils';
import { EnquiryModal } from './EnquiryModal';

export const SiteVisitRibbon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carTypeIndex, setCarTypeIndex] = useState(0);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';

  // Luxury chauffeur fleet names
  const luxuryCars = [
    { name: 'Mercedes-Benz E-Class', tag: 'Luxury Chauffeur' },
    { name: 'Audi A6 Matrix', tag: 'Executive AC Cab' },
    { name: 'BMW 5 Series', tag: 'Doorstep Pick-Up' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarTypeIndex((prev) => (prev + 1) % luxuryCars.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Background with user requested #b45309 Luxury Amber-Bronze Gradient */}
      <div className="relative z-30 bg-[#b45309] bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#78350f] text-white py-2 shadow-lg overflow-hidden border-b border-amber-300/30 select-none">
        {/* Animated Gold Road Track Dashed Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(255,255,255,0.07)_60px,rgba(255,255,255,0.07)_120px)] opacity-80 pointer-events-none" />

        {/* Dismiss Button on the Right */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-amber-200 hover:text-white transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Slow Smooth Moving Convoy (Right to Left) */}
        <div className="w-full overflow-hidden whitespace-nowrap cursor-pointer group">
          <div
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-5 animate-drive-right-to-left will-change-transform group-hover:[animation-play-state:paused]"
          >
            {/* Ultra-Luxury Mercedes-Benz / Audi Sedan Graphic (Facing Left with Light Beam) */}
            <div className="relative flex items-center shrink-0">
              {/* Headlight beam illuminating forward to the LEFT */}
              <div className="w-20 sm:w-28 h-6 bg-gradient-to-l from-amber-100/90 via-yellow-200/40 to-transparent blur-[4px] absolute -left-16 sm:-left-24 rounded-full pointer-events-none" />

              {/* Luxury Mercedes / Audi Sedan Vector SVG */}
              <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                <svg
                  className="w-16 h-7 sm:w-20 sm:h-8"
                  viewBox="0 0 100 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Luxury Car Body Metallic Obsidian & Chrome */}
                  <path
                    d="M12 25L22 13C24.5 10 29 8 35 8H73C79 8 83 10 86 13.5L93 21C96 22 97 23.5 97 26V29H7V27C7 25 9.5 25 12 25Z"
                    fill="#1C1917"
                  />
                  {/* Lower Aero Skirt with Gold/Chrome Accent */}
                  <path
                    d="M7 28H97V30C97 31 96 31.5 95 31.5H9C8 31.5 7 31 7 30V28Z"
                    fill="#FDE68A"
                  />
                  {/* Luxury Tinted Glass Canopy */}
                  <path
                    d="M26 14L34 9.5H71C75 9.5 77.5 11 79.5 13.5L84.5 19H20.5L26 14Z"
                    fill="#38BDF8"
                    fillOpacity="0.85"
                  />
                  {/* Chrome Window Trim Pillars (Mercedes / Audi Executive Style) */}
                  <line x1="50" y1="9.5" x2="50" y2="19" stroke="#FEF08A" strokeWidth="1.8" />
                  <line x1="68" y1="9.5" x2="70" y2="19" stroke="#FEF08A" strokeWidth="1.5" />
                  
                  {/* Audi / Mercedes Matrix LED Headlights on the LEFT */}
                  <path d="M8 24L15 23.5L14 26.5L8 26V24Z" fill="#FEF08A" />
                  <circle cx="10" cy="25" r="1.5" fill="#FFFFFF" />

                  {/* Luxury LED Taillights on the RIGHT */}
                  <path d="M94 23.5L97 24V26.5L94 26V23.5Z" fill="#EF4444" />

                  {/* Front Wheel (Multi-Spoke Chrome Alloy) */}
                  <circle cx="25" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="25" cy="29" r="4.5" fill="#52525B" />
                  <circle cx="25" cy="29" r="2.2" fill="#FDE68A" />

                  {/* Rear Wheel (Multi-Spoke Chrome Alloy) */}
                  <circle cx="78" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="78" cy="29" r="4.5" fill="#52525B" />
                  <circle cx="78" cy="29" r="2.2" fill="#FDE68A" />
                </svg>
              </div>
            </div>

            {/* Clickable Luxury Banner Text with Company Helpline */}
            <div className="flex items-center gap-2.5 text-white font-black text-xs sm:text-sm tracking-wide group-hover:text-amber-100 transition-colors">
              <span className="bg-black/30 px-2 py-0.5 rounded-lg border border-amber-300/40 text-[10px] text-amber-200 uppercase font-black tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {luxuryCars[carTypeIndex].name}
              </span>

              <span className="drop-shadow-md text-amber-50">
                Click Here For Your Free AC Cab Site Visit -- <span className="text-yellow-200 font-mono underline decoration-amber-300 font-black">{phone}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[10px] uppercase font-black tracking-wider shadow-md hidden sm:inline">
                Book Free Cab
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
