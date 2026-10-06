import React from 'react';
import { ShieldCheck, Award, FileCheck, Landmark, CheckCircle2 } from 'lucide-react';

export const TrustCredentials: React.FC = () => {
  const credentials = [
    {
      title: 'DTCP & CMDA Sanctions',
      subtitle: '100% Government Approved Layouts with proper road widths & OSR reserves.',
      tag: 'Sanctioned',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
    },
    {
      title: 'Tamil Nadu RERA Regd.',
      subtitle: 'Statutory buyer protection and transparent milestone delivery.',
      tag: 'RERA Certified',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
    },
    {
      title: '30-Yr Clear Title Deeds',
      subtitle: 'Audited by senior property advocates with unencumbered parent documents.',
      tag: 'Legal Assured',
      icon: FileCheck,
      color: 'text-blue-400 bg-blue-950/60 border-blue-800/50',
    },
    {
      title: '80% Bank Loan Support',
      subtitle: 'Fast sanction with leading partner banks (SBI, HDFC, ICICI, LIC HFL).',
      tag: 'Bank Approved',
      icon: Landmark,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/50',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-950 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">
            Institutional Trust & Verification
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white mt-1.5 sm:mt-2">
            Why Sree Hari Realty Promoters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">
            We provide absolute legal certainty, clear titles, and immediate registration for every plot.
          </p>
        </div>

        {/* 2x2 Grid on Mobile, 4 Cols on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border ${cred.color} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                      {cred.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-heading text-white mb-1">{cred.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{cred.subtitle}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Verified Documents</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
