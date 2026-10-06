'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  variant?: 'floating' | 'button' | 'compact';
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  message = 'Hi Sree Hari Realty, I am interested in your gated community plots. Please share more details.',
  variant = 'button',
  className = '',
  label = 'WhatsApp Us',
}) => {
  const link = getWhatsAppLink(phone, message);

  if (variant === 'floating') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sree Hari Realty on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group font-medium text-sm border-2 border-white/20"
      >
        <MessageCircle className="w-5 h-5 animate-pulse" />
        <span className="font-semibold">Chat on WhatsApp</span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200 ${className}`}
        title="WhatsApp Enquiry"
      >
        <MessageCircle className="w-4 h-4" />
      </a>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
};
