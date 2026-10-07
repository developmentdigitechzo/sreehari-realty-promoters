'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Video,
  MessageCircle,
} from 'lucide-react';
import { EnquiryModal } from '../common/EnquiryModal';
import { getWhatsAppLink } from '@/lib/utils';

export const SellerPromotionSection: React.FC = () => {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const stats = [
    { value: '100%', label: 'Zero Listing Fees' },
    { value: '10,000+', label: 'Active Buyers & NRIs' },
    { value: '15+ Days', label: 'Average Closing Speed' },
    { value: '0%', label: 'Hidden Commissions' },
  ];

  const benefits = [
    {
      icon: Video,
      title: 'Free Drone Shoot & 4K Video Tour',
      description: 'We capture stunning aerial footage and layout maps for maximum buyer attraction.',
    },
    {
      icon: FileCheck,
      title: '100% Legal Document & Patta Assistance',
      description: 'Our senior advocates verify EC, parent deeds, and FMB sketches for faster closing.',
    },
    {
      icon: Users,
      title: 'Direct Reach to Genuine NRI & Local Buyers',
      description: 'Immediate distribution across our private investor network and WhatsApp channels.',
    },
  ];

  return (
    <>
      <section className="py-16 md:py-24 bg-[#FAF8F5] border-y border-amber-900/10 relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdfa] border border-[#108474]/30 text-[#108474] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#108474]" />
              <span>SELL YOUR LAND & PROPERTY WITH ZERO BROKERAGE</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-tight">
              Sell Your Property Faster to Genuine Buyers
            </h2>

            <p className="text-sm sm:text-base text-[#108474] font-black">
              List for Free & Connect with Thousands of Active Plot Seekers & NRIs
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Looking to sell your residential plot, agricultural farmland, layout parcel, or commercial land? Partner with Sree Hari Realty. We showcase your property with verified legal clarity, professional marketing, and zero upfront charges.
            </p>
          </div>

          {/* Integrated Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#108474]/15 shadow-sm text-center"
              >
                <div className="text-2xl sm:text-3xl font-black font-heading text-[#108474]">
                  {s.value}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* 3 Key Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-[#108474]/40 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] text-[#108474] flex items-center justify-center font-bold border border-[#108474]/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>

          {/* Action Callout Box */}
          <div className="bg-gradient-to-br from-[#071c19] via-[#0a2622] to-[#071c19] text-white rounded-3xl p-6 sm:p-10 border border-[#108474]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Ready to Sell Your Property in 15 Days?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Submit your property details in 60 seconds. Our senior land acquisition team will contact you with a fair market valuation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsSellModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#108474]/30 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#e52e3d]" />
                <span>List Property Free</span>
              </button>

              <a
                href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I want to sell/promote my land in Tamil Nadu.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Land Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sell Modal */}
      <EnquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        source="SELLER_DESK"
      />
    </>
  );
};
