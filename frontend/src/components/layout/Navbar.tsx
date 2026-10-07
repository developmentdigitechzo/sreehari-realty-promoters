'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Calendar,
  Sparkles,
  Home,
  Building,
  PlusCircle,
  UserCheck,
  Award,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';
import { EnquiryModal } from '../common/EnquiryModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Your Property', href: '/projects' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Top Notification Bar (Matching Thanjai Property's Luxury Top Bar) */}
        <div className="bg-[#1C1917] text-white text-xs py-1.5 px-3 sm:px-4 border-b border-amber-900/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 text-[10px] sm:text-xs font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                DTCP & RERA Approved
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-300">100% Clear Titles & Patta Support</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-amber-300 font-semibold">Free Chauffeured AC Cab Site Visit</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              <a
                href={getTelLink(phone)}
                className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors font-bold"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{phone}</span>
              </a>
              <span className="text-slate-700">|</span>
              <Link
                href="/admin/login"
                className="text-slate-400 hover:text-amber-400 transition-colors text-[10px] sm:text-[11px] font-semibold flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b ${
            isScrolled ? 'shadow-md py-2.5 sm:py-3 border-amber-900/10' : 'py-3 sm:py-4 border-amber-900/5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <BrandLogo size="md" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-bold transition-colors relative py-1 ${
                      isActive
                        ? 'text-brand-primary'
                        : 'text-slate-800 hover:text-brand-primary'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action CTAs (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Free Site Visit */}
              <button
                onClick={() => setIsSiteVisitOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200/80 transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Book Site Visit</span>
              </button>

              {/* WhatsApp Trigger */}
              <a
                href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I am interested in exploring your gated villa plots.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200/80 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {/* Sell / List Property CTA (Inspired by Thanjai Property's 'Add New Property' Button) */}
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-xs shadow-md shadow-brand-primary/20 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell / Promote Land</span>
              </button>
            </div>

            {/* Mobile Header Right Actions */}
            <div className="md:hidden flex items-center gap-2">
              <a
                href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I am interested in gated community plots.')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs active:scale-95"
                aria-label="WhatsApp Sree Hari Realty"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href={getTelLink(phone)}
                className="p-2 rounded-xl bg-brand-primary text-white text-xs active:scale-95"
                aria-label="Call Sree Hari Realty"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Dropdown (Dark Coffee Theme like Thanjai Property) */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1C1917] text-white border-b border-amber-900/30 px-5 pt-4 pb-7 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold ${
                      pathname === link.href
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>

              {/* Sell / Promote Property Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSellModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-brand-primary text-white font-black text-xs flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-brand-primary/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell Your Land / Promote Property</span>
              </button>

              {/* Free Site Visit Trigger */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSiteVisitOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Book Free AC Cab Site Visit</span>
              </button>

              {/* Quick Contact Buttons */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                <a
                  href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I would like to schedule a site visit.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={getTelLink(phone)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 text-white text-xs font-bold active:scale-95 shadow-sm border border-white/10"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Us</span>
                </a>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
                📍 Tambaram West, Guduvanchery, Chengalpattu & OMR
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Book Site Visit Modal */}
      <EnquiryModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        source="WEBSITE_FORM"
      />

      {/* Sell / Promote Land Modal */}
      <EnquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        source="SELLER_DESK"
      />
    </>
  );
};
