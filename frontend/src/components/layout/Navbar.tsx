'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, ShieldCheck, MapPin, ChevronRight, Calendar } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';
import { EnquiryModal } from '../common/EnquiryModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);

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
    { name: 'Plots & Layouts', href: '/projects' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Top Notification Bar */}
        <div className="bg-slate-950 text-white text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300 text-[10px] sm:text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> DTCP & RERA Approved
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline">100% Clear Titles</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              <a
                href={getTelLink(phone)}
                className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors font-bold"
              >
                <Phone className="w-3 h-3 text-brand-primaryLight" />
                <span>{phone}</span>
              </a>
              <span className="text-slate-700">|</span>
              <Link href="/admin/login" className="text-slate-400 hover:text-white transition-colors text-[10px] sm:text-[11px]">
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b ${
            isScrolled ? 'shadow-md py-2.5 sm:py-3 border-slate-200' : 'py-3 sm:py-4 border-slate-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <BrandLogo size="md" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-7 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors relative py-1 ${
                      isActive
                        ? 'text-brand-primary font-bold'
                        : 'text-slate-700 hover:text-brand-primary'
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
              <button
                onClick={() => setIsSiteVisitOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Book Site Visit</span>
              </button>

              <a
                href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I would like to schedule a site visit.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getTelLink(phone)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
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

          {/* Mobile Drawer Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                      pathname === link.href
                        ? 'bg-rose-50 text-brand-primary'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>

              {/* Free Site Visit Trigger */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSiteVisitOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Book Free AC Cab Site Visit</span>
              </button>

              {/* Quick Contact Buttons */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
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
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-primary text-white text-xs font-bold active:scale-95 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                📍 Tambaram West, Guduvanchery & Chengalpattu
              </div>
            </div>
          )}
        </nav>
      </header>

      <EnquiryModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
