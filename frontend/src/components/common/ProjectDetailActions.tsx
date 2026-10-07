'use client';

import React, { useState } from 'react';
import { Download, Car, MessageCircle, Phone } from 'lucide-react';
import { BrochureModal } from './BrochureModal';
import { EnquiryModal } from './EnquiryModal';
import { WhatsAppButton } from './WhatsAppButton';
import { getTelLink } from '@/lib/utils';

interface ProjectDetailActionsProps {
  projectId: string;
  projectName: string;
  brochureUrl?: string;
  location: string;
}

export const ProjectDetailActions: React.FC<ProjectDetailActionsProps> = ({
  projectId,
  projectName,
  brochureUrl,
  location,
}) => {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isCabVisitOpen, setIsCabVisitOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';
  const whatsAppMsg = `Hi Sree Hari Realty, I am interested in ${projectName} located at ${location}. Please send me the complete brochure, master plan, and pricing.`;

  return (
    <>
      <div className="space-y-3">
        {/* Big Brochure Download Button matching Infinium Altitude Reference (Image 3) */}
        <button
          type="button"
          onClick={() => setIsBrochureOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Project Brochure (PDF)</span>
        </button>

        {/* Action Row: Book Cab & Direct Call */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsCabVisitOpen(true)}
            className="py-3 px-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Book Free Cab</span>
          </button>

          <a
            href={getTelLink(phone)}
            className="py-3 px-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Site Head</span>
          </a>
        </div>
      </div>

      {/* Luxury Brochure Modal */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        projectId={projectId}
        projectName={projectName}
        brochureUrl={brochureUrl}
      />

      {/* Free AC Cab Visit Modal */}
      <EnquiryModal
        isOpen={isCabVisitOpen}
        onClose={() => setIsCabVisitOpen(false)}
        projectId={projectId}
        projectName={projectName}
        source="PROJECT_PAGE"
      />
    </>
  );
};
