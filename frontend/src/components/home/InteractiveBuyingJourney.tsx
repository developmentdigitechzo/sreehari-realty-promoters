import React from 'react';
import { Compass, Car, FileCheck2, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const InteractiveBuyingJourney: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Select Plot & Facing',
      description: 'Choose your desired plot size (900 – 3000 sqft) and preferred Vaastu facing (East, North, Corner).',
      icon: Compass,
      badge: 'DTCP / CMDA Approved',
      color: 'from-rose-500 to-brand-primary',
    },
    {
      number: '02',
      title: 'Free Cab Site Visit',
      description: 'We arrange complimentary AC cab pick-up & drop from your doorstep for an escorted layout tour.',
      icon: Car,
      badge: 'Zero Obligation',
      color: 'from-amber-500 to-amber-600',
    },
    {
      number: '03',
      title: 'Legal Vetting & Bank Loan',
      description: 'Review 30-year parent title documents with bank approval up to 80% with SBI, HDFC & LIC HFL.',
      icon: FileCheck2,
      badge: '100% Clear Title',
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '04',
      title: 'Instant Registration',
      description: 'Get immediate sub-division patta and hassle-free registration completed directly in your name.',
      icon: Award,
      badge: 'Same-Day Handover',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smooth & Safe Land Buying Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
            How It Works: 4 Simple Steps to Own Your Land
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            From initial site exploration to government registration, we manage the entire legal and logistical journey.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/70 hover:border-brand-primary/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Step Number Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-heading text-slate-500 group-hover:text-amber-400 transition-colors">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                    {step.badge}
                  </span>
                </div>

                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold font-heading text-white mb-2 group-hover:text-brand-primaryLight transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  {step.description}
                </p>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-primaryLight group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xl"
          >
            <span>Book Your Free Chauffeured Site Visit</span>
            <Car className="w-4 h-4 text-amber-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};
