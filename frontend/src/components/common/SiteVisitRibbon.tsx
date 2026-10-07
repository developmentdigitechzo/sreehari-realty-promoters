'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Calendar, ArrowRight, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { getTelLink } from '@/lib/utils';
import { EnquiryModal } from './EnquiryModal';

interface CarModel {
  name: string;
  category: string;
  badge: string;
  bodyColor: string;
  accentColor: string;
  glassColor: string;
  wheelAccent: string;
  glowColor: string;
  beamGradient: string;
}

export const SiteVisitRibbon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carTypeIndex, setCarTypeIndex] = useState(0);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';

  // Luxury Fleet inspired by G Square Housing & Premium Real Estate Site Visit Cabs
  const luxuryCars: CarModel[] = [
    {
      name: 'G-Square Eco EV Cab',
      category: '100% Electric Luxury Cab',
      badge: 'Zero Emission',
      bodyColor: '#FFFFFF',
      accentColor: '#10B981', // Emerald EV Accent
      glassColor: '#38BDF8',
      wheelAccent: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      beamGradient: 'from-emerald-200/90 via-teal-200/40 to-transparent',
    },
    {
      name: 'Mercedes-Benz E-Class',
      category: 'Executive Luxury Chauffeur',
      badge: 'VIP Chauffeur',
      bodyColor: '#18181B', // Obsidian Black
      accentColor: '#FBBF24', // Gold Chrome
      glassColor: '#60A5FA',
      wheelAccent: '#FBBF24',
      glowColor: 'rgba(251, 191, 36, 0.3)',
      beamGradient: 'from-amber-100/90 via-yellow-200/40 to-transparent',
    },
    {
      name: 'Audi A6 Matrix LED',
      category: 'Executive AC Cab',
      badge: 'Doorstep Pick-Up',
      bodyColor: '#E2E8F0', // Platinum Silver
      accentColor: '#38BDF8', // Matrix Blue
      glassColor: '#0284C7',
      wheelAccent: '#94A3B8',
      glowColor: 'rgba(56, 189, 248, 0.35)',
      beamGradient: 'from-cyan-100/90 via-sky-200/40 to-transparent',
    },
    {
      name: 'BMW 5 Series',
      category: 'Premium Site Visit Sedan',
      badge: 'AC Cab Direct',
      bodyColor: '#1E3A8A', // Deep Sapphire Blue
      accentColor: '#60A5FA',
      glassColor: '#38BDF8',
      wheelAccent: '#CBD5E1',
      glowColor: 'rgba(96, 165, 250, 0.35)',
      beamGradient: 'from-blue-100/90 via-indigo-200/40 to-transparent',
    },
  ];

  // Rotate car every 6.5 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCarTypeIndex((prev) => (prev + 1) % luxuryCars.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [luxuryCars.length]);

  if (!isVisible) return null;

  const currentCar = luxuryCars[carTypeIndex];

  return (
    <>
      {/* Background with user requested #green (G Square Housing inspired rich emerald-green gradient) */}
      <div className="relative z-30 bg-[#047857] bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white py-2 shadow-lg overflow-hidden border-b border-emerald-400/30 select-none">
        {/* Animated Green/Emerald Road Track Dashed Effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(255,255,255,0.06)_60px,rgba(255,255,255,0.06)_120px)] opacity-90 pointer-events-none" />

        {/* Subtle glowing ambient line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

        {/* Dismiss Button on the Right */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-emerald-200 hover:text-white transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Slow Smooth Moving Convoy (Right to Left across full width) */}
        <div className="w-full overflow-hidden whitespace-nowrap cursor-pointer group">
          <div
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-5 animate-drive-right-to-left will-change-transform group-hover:[animation-play-state:paused]"
          >
            {/* Dynamic Changing Car Graphic (Facing Left with glowing Light Beam) */}
            <div className="relative flex items-center shrink-0">
              {/* Headlight beam illuminating forward to the LEFT */}
              <div
                className={`w-24 sm:w-32 h-6 bg-gradient-to-l ${currentCar.beamGradient} blur-[5px] absolute -left-20 sm:-left-28 rounded-full pointer-events-none transition-all duration-700`}
              />

              {/* Changing Luxury Car Vector SVG */}
              <div
                className="relative flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-105"
              >
                <svg
                  className="w-16 h-7 sm:w-20 sm:h-8 transition-colors duration-700"
                  viewBox="0 0 100 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Car Main Metallic Body (Dynamic Color) */}
                  <path
                    d="M12 25L22 13C24.5 10 29 8 35 8H73C79 8 83 10 86 13.5L93 21C96 22 97 23.5 97 26V29H7V27C7 25 9.5 25 12 25Z"
                    fill={currentCar.bodyColor}
                    className="transition-colors duration-700"
                  />

                  {/* Lower Aero Skirt with Accent Color */}
                  <path
                    d="M7 28H97V30C97 31 96 31.5 95 31.5H9C8 31.5 7 31 7 30V28Z"
                    fill={currentCar.accentColor}
                    className="transition-colors duration-700"
                  />

                  {/* Luxury Glass Canopy */}
                  <path
                    d="M26 14L34 9.5H71C75 9.5 77.5 11 79.5 13.5L84.5 19H20.5L26 14Z"
                    fill={currentCar.glassColor}
                    fillOpacity="0.88"
                    className="transition-colors duration-700"
                  />

                  {/* Window Trim Pillars */}
                  <line x1="50" y1="9.5" x2="50" y2="19" stroke={currentCar.accentColor} strokeWidth="1.8" />
                  <line x1="68" y1="9.5" x2="70" y2="19" stroke={currentCar.accentColor} strokeWidth="1.5" />

                  {/* G Square / Brand Door Decal Accent Line */}
                  <path
                    d="M32 23.5H68"
                    stroke={currentCar.accentColor}
                    strokeWidth="1.5"
                    strokeDasharray="2 1"
                  />

                  {/* Matrix LED Headlights on the LEFT */}
                  <path d="M8 24L15 23.5L14 26.5L8 26V24Z" fill="#FFFFFF" />
                  <circle cx="10" cy="25" r="1.8" fill="#67E8F9" />

                  {/* LED Taillights on the RIGHT */}
                  <path d="M94 23.5L97 24V26.5L94 26V23.5Z" fill="#EF4444" />

                  {/* Front Wheel (Multi-Spoke Alloy with Dynamic Accent) */}
                  <circle cx="25" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="25" cy="29" r="4.5" fill="#3F3F46" />
                  <circle cx="25" cy="29" r="2.2" fill={currentCar.wheelAccent} className="transition-colors duration-700" />

                  {/* Rear Wheel (Multi-Spoke Alloy with Dynamic Accent) */}
                  <circle cx="78" cy="29" r="6.5" fill="#0A0A0A" />
                  <circle cx="78" cy="29" r="4.5" fill="#3F3F46" />
                  <circle cx="78" cy="29" r="2.2" fill={currentCar.wheelAccent} className="transition-colors duration-700" />
                </svg>
              </div>
            </div>

            {/* Clickable G Square Style Banner Text with Dynamic Car Badge & Phone */}
            <div className="flex items-center gap-2.5 text-white font-black text-xs sm:text-sm tracking-wide group-hover:text-emerald-100 transition-colors">
              {/* Dynamic Car Model Badge */}
              <span className="bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-emerald-300/40 text-[10px] text-emerald-200 uppercase font-black tracking-wider flex items-center gap-1 shadow-sm transition-all duration-500">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                {currentCar.name}
              </span>

              {/* Main Call to Action matching G Square Housing Pattern */}
              <span className="drop-shadow-md text-emerald-50">
                Click Here For Your Free Site Visit --{' '}
                <span className="text-lime-300 font-mono underline decoration-emerald-300 font-black">
                  {phone}
                </span>
              </span>

              {/* Free AC Cab Action Pill */}
              <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-950 text-[10px] uppercase font-black tracking-wider shadow-md hidden sm:inline-flex items-center gap-1 hover:bg-lime-300 transition-colors">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                Book Free AC Cab
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
