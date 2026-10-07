import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, TrendingUp, Building2, Trees, Train } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export const LocationsExplorer: React.FC = () => {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const locations = [
    {
      name: 'Tambaram West & 400ft ORR',
      tagline: 'Chennai Fastest Growing Hub',
      price: 'From ₹32 Lakhs',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      highlights: ['7 Mins to Tambaram Station', 'Direct 400ft Outer Ring Road access', '22 Mins to Chennai Airport'],
      icon: Train,
      status: 'High Demand',
    },
    {
      name: 'Guduvanchery & GST Road',
      tagline: 'SRM & Mahindra City Belt',
      price: 'From ₹24 Lakhs',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      highlights: ['10 Mins to SRM University', 'Kilambakkam KCBT Terminus closeby', 'Massive rental & capital growth'],
      icon: Building2,
      status: 'Hot Investment',
    },
    {
      name: 'Chengalpattu Highway',
      tagline: 'Eco-Living & Farm Villa Plots',
      price: 'From ₹18 Lakhs',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      highlights: ['Scenic green mountain views', 'NH 32 6-lane national highway', '4x Appreciation in 5 Years'],
      icon: Trees,
      status: 'Upcoming Mega Hub',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#108474] uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-[#108474]" />
              <span>Strategic Growth Corridors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900">
              Prime Land Investment Corridors in Chennai
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
              Carefully chosen high-appreciation sectors backed by rapid government infrastructure, metro expansion, and
              SEZ commercial growth.
            </p>
          </div>

          <Link
            href="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#108474] hover:text-[#0c6a5d] transition-colors group"
          >
            <span>Browse All Corridors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {locations.map((loc, idx) => {
            const Icon = loc.icon;
            const waLink = getWhatsAppLink(
              whatsapp,
              `Hi Sree Hari Realty, I am interested in plots located in ${loc.name}. Please share available layout options.`
            );

            return (
              <div
                key={idx}
                className="group bg-white rounded-3xl border border-slate-200/80 hover:border-[#108474]/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Status Tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#108474] shadow-md border border-[#108474]/20">
                      {loc.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-emerald-300 drop-shadow">
                      {loc.tagline}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-white drop-shadow-md leading-tight">
                      {loc.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Connectivity Highlights</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {loc.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#108474] flex-shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Starting From</div>
                      <div className="text-base font-black text-[#108474] font-heading">{loc.price}</div>
                    </div>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] text-white text-xs font-bold transition-all shadow-md shadow-[#108474]/20 active:scale-95"
                    >
                      <span>Get Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
