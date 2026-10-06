'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';
import { EnquiryModal } from '../common/EnquiryModal';

interface MobileStickyBarProps {
  phone?: string;
  whatsapp?: string;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210',
  whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
}) => {
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);

  const whatsappLink = getWhatsAppLink(
    whatsapp,
    'Hi Sree Hari Realty, I am browsing your plots on mobile and would like to receive the layout map and price details.'
  );

  return (
    <>
      {/* Mobile Sticky Bar - Visible only on mobile/tablet screens (md:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {/* Call CTA */}
          <a
            href={getTelLink(phone)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-slate-900 border border-slate-700/80 text-white active:scale-95 transition-transform shadow-sm"
          >
            <Phone className="w-4 h-4 text-brand-primaryLight mb-0.5" />
            <span className="text-[10px] font-extrabold tracking-tight">Call Us</span>
          </a>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-[#25D366] text-white active:scale-95 transition-transform shadow-md"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-extrabold tracking-tight">WhatsApp</span>
          </a>

          {/* Book Site Visit CTA */}
          <button
            type="button"
            onClick={() => setIsSiteVisitOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white active:scale-95 transition-transform shadow-md"
          >
            <div className="flex items-center gap-0.5 mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight">Free Visit</span>
          </button>
        </div>
      </div>

      <EnquiryModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
