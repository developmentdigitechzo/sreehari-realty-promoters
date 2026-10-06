'use client';

import React, { useState } from 'react';
import { Compass, Maximize2, Tag } from 'lucide-react';
import { Property } from '@/types';
import { WhatsAppButton } from './WhatsAppButton';
import { EnquiryModal } from './EnquiryModal';

interface PlotCardProps {
  plot: Property;
  projectName?: string;
}

export const PlotCard: React.FC<PlotCardProps> = ({ plot, projectName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusBadge = {
    AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    BOOKED: 'bg-amber-100 text-amber-800 border-amber-300',
    SOLD: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const statusLabel = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    SOLD: 'Sold Out',
  };

  const whatsAppMsg = `Hi Sree Hari Realty, I am interested in ${plot.title} (${plot.area_sqft} sq.ft, ${plot.facing || 'East'} facing) priced at ${plot.price_display || '₹' + plot.price}. Please share availability details.`;

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 font-heading bg-slate-100 px-2 py-0.5 rounded">
              Plot #{plot.plot_number || plot.title.slice(0, 10)}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                statusBadge[plot.status] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {statusLabel[plot.status] || plot.status}
            </span>
          </div>

          <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1">{plot.title}</h4>

          {/* Specs List */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> Area:
              </span>
              <span className="font-bold text-slate-800">{plot.area_sqft} Sq.Ft</span>
            </div>
            {plot.dimensions && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-slate-500" /> Dimensions:
                </span>
                <span className="font-semibold text-slate-700">{plot.dimensions}</span>
              </div>
            )}
            {plot.facing && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Compass className="w-3.5 h-3.5 text-slate-500" /> Facing:
                </span>
                <span className="font-semibold text-slate-700">{plot.facing}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="mb-2.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Investment</div>
            <div className="text-base font-black text-brand-primary font-heading">
              {plot.price_display || `₹${(plot.price / 100000).toFixed(2)} Lakhs`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={plot.status === 'SOLD'}
              className="flex-1 py-2 px-3 bg-brand-primary hover:bg-brand-primaryDark disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors text-center"
            >
              {plot.status === 'SOLD' ? 'Sold Out' : 'Book Site Visit'}
            </button>
            <WhatsAppButton
              variant="compact"
              message={whatsAppMsg}
              className="w-9 h-9"
            />
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyId={plot.id}
        propertyTitle={plot.title}
        projectName={projectName}
        source="PROPERTY_PAGE"
      />
    </>
  );
};
