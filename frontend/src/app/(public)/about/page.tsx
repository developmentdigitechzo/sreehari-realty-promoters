import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Award, Users, HeartHandshake, CheckCircle2, Target, Eye } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BrandLogo } from '@/components/common/BrandLogo';

export const metadata: Metadata = {
  title: 'About Us | Sree Hari Realty Promoters',
  description:
    'Learn about Sree Hari Realty Promoters - dedicated to providing verified DTCP & RERA approved gated plotted communities in Chennai with 100% legal clarity and fair pricing.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            Our Heritage & Commitment
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mt-2">
            Pioneering Transparent & Secure Land Developments
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            At Sree Hari Realty Promoters, we believe that purchasing land should be a proud, secure, and rewarding
            milestone. We specialize in transforming strategic parcels of land into fully-developed gated plotted
            communities with legal transparency and top infrastructure.
          </p>
        </div>

        {/* Brand Story Banner */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-brand-primary">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Clear Titles. Prime Corridors. Enduring Value.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded with the goal of bringing uncompromised honesty and institutional discipline to the plotted
              development sector, Sree Hari Realty Promoters meticulously screens every parcel of land through a stringent
              legal audit before development begins.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Strict 30-year legal parent document verification with leading property advocates.',
                'Mandatory DTCP / CMDA and Tamil Nadu RERA layout sanctions.',
                'On-ground development with asphalt blacktop roads, solar lighting, and security infrastructure.',
                'Immediate sub-division and registry documentation ready for instant owner handover.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
              alt="Sree Hari Realty Land Project"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/30 text-brand-primaryLight flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To empower home buyers and smart land investors with fully-sanctioned, ready-to-construct plots that yield
              high capital appreciation while delivering serene and secure gated environments.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To be Chennai and Tamil Nadu's most reputable and customer-recommended land promotion enterprise, celebrated
              for legal integrity, infrastructure excellence, and transparent client relations.
            </p>
          </div>
        </div>

        {/* Action Callout */}
        <div className="text-center py-10 bg-gradient-to-r from-rose-900 to-slate-950 text-white rounded-3xl p-8">
          <h3 className="text-2xl font-bold font-heading mb-2">Looking for Verified Land in Prime Chennai?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Speak directly with our senior property counselors to find the ideal plot suited to your investment budget.
          </p>
          <div className="flex justify-center">
            <WhatsAppButton
              label="Talk to our Founders on WhatsApp"
              message="Hi Sree Hari Realty, I would like to know more about your company and current plot projects."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
