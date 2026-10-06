import React from 'react';
import { ShieldCheck, Award, FileCheck, Landmark, CheckCircle2, Clock } from 'lucide-react';

export const TrustCredentials: React.FC = () => {
  const credentials = [
    {
      title: 'DTCP & CMDA Sanctions',
      subtitle: '100% Government Approved Layouts with proper road widths and OSR reserves.',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
    },
    {
      title: 'Tamil Nadu RERA Registered',
      subtitle: 'Complete transparency with statutory buyer protection and clear project schedules.',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
    },
    {
      title: '30-Year Clear Legal Pedigree',
      subtitle: 'Audited by senior property advocates with unencumbered parent title deeds.',
      icon: FileCheck,
      color: 'text-blue-400 bg-blue-950/60 border-blue-800/50',
    },
    {
      title: '80% Bank Loan Tie-Ups',
      subtitle: 'Fast sanction with leading public & private banks (SBI, HDFC, ICICI, LIC HFL).',
      icon: Landmark,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/50',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-slate-950 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Institutional Trust & Verification
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white mt-2">
            Why Sree Hari Realty Promoters is Chennai's Trusted Choice
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            We provide absolute legal certainty and on-time delivery across every plot project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${cred.color} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white mb-2">{cred.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{cred.subtitle}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified & Approved</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
