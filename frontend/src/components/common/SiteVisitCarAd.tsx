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
      {/* Site Theme Solid #108474 Animated Car Ad Ribbon */}
      <div
        className={`relative z-30 bg-[#108474] text-white py-2 overflow-hidden border-b border-[#0d6d5f] shadow-md select-none ${className}`}
      >
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
            {/* The Photorealistic Mint-Cyan Luxury SUV Graphic (Facing Left with Light Beam) */}
            <div className="relative flex items-center shrink-0">
              {/* Volumetric LED Light Beam Illuminating Forward to the Left */}
              <div className="w-32 sm:w-44 h-8 bg-gradient-to-l from-white/95 via-cyan-200/50 to-transparent blur-[3px] absolute -left-28 sm:-left-40 rounded-full pointer-events-none" />

              {/* Real Photorealistic Luxury SUV Cutout Image */}
              <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/images/real-luxury-cab.png"
                  alt="Real Luxury Site Visit AC Cab"
                  className="h-8 sm:h-9 w-auto object-contain select-none pointer-events-none"
                  draggable={false}
                />
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
