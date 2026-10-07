import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, ArrowRight, Sparkles, Building2, PlusCircle } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { getTelLink, getWhatsAppLink } from '@/lib/utils';

export const Footer: React.FC = () => {
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@sreeharirealty.com';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const address =
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'No. 45, GST Main Road, Tambaram, Chennai, Tamil Nadu - 600045';

  return (
    <footer className="bg-[#120B05] text-slate-300 border-t border-amber-900/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <BrandLogo size="lg" isLight={true} />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Sree Hari Realty Promoters is a trusted real estate promoter and land development firm specializing in premium, DTCP & CMDA approved gated community plots, villa layouts, and farmlands with 100% clear titles.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-amber-950/40 p-3 rounded-2xl border border-amber-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Legal Clear Title & Patta Assurance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#149b88] mb-4 font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#108474]" /> Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#108474]" /> Find Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#108474]" /> Our Story & Legacy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#108474]" /> Contact & AC Cab Visit
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#108474]" /> Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#149b88] mb-4 font-heading">
              Key Growth Corridors
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#108474] flex-shrink-0" />
                <span>Tambaram West & 400ft ORR</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#108474] flex-shrink-0" />
                <span>Guduvanchery & GST Highway</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#108474] flex-shrink-0" />
                <span>Chengalpattu & Mahindra World City</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#108474] flex-shrink-0" />
                <span>OMR IT Highway & Thiruporur</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#108474] flex-shrink-0" />
                <span>Thanjavur & Central Tamil Nadu</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#149b88] mb-4 font-heading">
              Direct Helpline
            </h4>
            <div className="space-y-3 text-xs text-slate-400 font-medium">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#108474] flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e52e3d] flex-shrink-0" />
                <a href={getTelLink(phone)} className="hover:text-white transition-colors font-bold text-slate-200">
                  {phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <a
                  href={getWhatsAppLink(whatsappNum, 'Hi Sree Hari Realty, I am interested in your gated plots.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-bold text-emerald-400"
                >
                  WhatsApp: +{whatsappNum}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#108474] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-900/20 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 font-medium">
          <p>© {new Date().getFullYear()} Sree Hari Realty Promoters. Since 2009. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            DTCP, CMDA & RERA Approved Residential & Commercial Plot Developments across Tamil Nadu.
          </p>
        </div>
      </div>
    </footer>
  );
};
