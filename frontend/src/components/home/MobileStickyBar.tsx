'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
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
    'Hi Sree Hari Realty, I am browsing your website on mobile and want to enquire about available gated community plots.'
  );

  return (
    <>
      {/* Mobile Sticky Bar - Visible only on mobile/small screens (md:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {/* Call CTA */}
          <a
            href={getTelLink(phone)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900 border border-slate-700/80 text-white active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4 text-brand-primaryLight mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Call Now</span>
          </a>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366] text-white active:scale-95 transition-transform shadow-md"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
          </a>

          {/* Book Site Visit CTA */}
          <button
            onClick={() => setIsSiteVisitOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white active:scale-95 transition-transform shadow-md"
          >
            <Calendar className="w-4 h-4 text-amber-300 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Site Visit</span>
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
