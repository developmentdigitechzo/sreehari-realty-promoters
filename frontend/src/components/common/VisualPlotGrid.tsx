'use client';

import React, { useState } from 'react';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { EnquiryModal } from './EnquiryModal';
import {
  Layers,
  MapPin,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  Calculator,
  X,
  Sparkles,
  Edit2,
  Lock,
} from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';

interface VisualPlotGridProps {
  plots: Property[];
  projectName?: string;
  isAdmin?: boolean;
  onStatusChange?: (plotId: string, newStatus: string) => Promise<void>;
  onEditPlot?: (plot: Property) => void;
}

export const VisualPlotGrid: React.FC<VisualPlotGridProps> = ({
  plots = [],
  projectName = 'Gated Community Layout',
  isAdmin = false,
  onStatusChange,
  onEditPlot,
}) => {
  const [selectedFacing, setSelectedFacing] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activePlot, setActivePlot] = useState<Property | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter plots
  const filteredPlots = plots.filter((plot) => {
    if (selectedFacing !== 'ALL' && !plot.facing?.toLowerCase().includes(selectedFacing.toLowerCase())) {
      return false;
    }
    if (selectedStatus !== 'ALL' && plot.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const countAvailable = plots.filter((p) => p.status === 'AVAILABLE').length;
  const countBooked = plots.filter((p) => p.status === 'BOOKED').length;
  const countSold = plots.filter((p) => p.status === 'SOLD').length;

  const handleAdminStatusToggle = async (plot: Property, newStatus: string) => {
    if (!onStatusChange) return;
    setUpdatingId(plot.id);
    try {
      await onStatusChange(plot.id, newStatus);
      if (activePlot?.id === plot.id) {
        setActivePlot({ ...activePlot, status: newStatus as any });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-1.5 border border-rose-100">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Layout Inventory Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
            Live Plot Availability & Layout Map
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any plot below to inspect dimensions, facing, exact price, or reserve instantly.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available ({countAvailable})</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Booked ({countBooked})</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Sold Out ({countSold})</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        {/* Facing Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Facing:
          </span>
          {['ALL', 'East', 'North', 'Corner'].map((facing) => (
            <button
              key={facing}
              type="button"
              onClick={() => setSelectedFacing(facing)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                selectedFacing === facing
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {facing === 'ALL' ? 'All Facings' : `${facing} Facing`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Status:</span>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Available Only', value: 'AVAILABLE' },
            { label: 'Booked', value: 'BOOKED' },
            { label: 'Sold', value: 'SOLD' },
          ].map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                selectedStatus === st.value
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Plot Grid */}
      {filteredPlots.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold">No plots match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredPlots.map((plot) => {
            const isAvail = plot.status === 'AVAILABLE';
            const isBooked = plot.status === 'BOOKED';
            const isSold = plot.status === 'SOLD';

            let cardBg = 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-400';
            let badgeColor = 'bg-slate-200 text-slate-600';

            if (isAvail) {
              cardBg =
                'bg-emerald-50/70 border-emerald-300/80 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-md';
              badgeColor = 'bg-emerald-600 text-white';
            } else if (isBooked) {
              cardBg =
                'bg-amber-50/70 border-amber-300/80 text-amber-950 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md';
              badgeColor = 'bg-amber-500 text-white';
            }

            return (
              <button
                key={plot.id}
                type="button"
                onClick={() => setActivePlot(plot)}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-32 active:scale-95 group ${cardBg}`}
              >
                {/* Top Row: Plot Number & Badge */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black font-heading tracking-tight">
                    #{plot.plot_number || plot.title.replace(/[^0-9]/g, '') || 'Plot'}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
                    {plot.status === 'AVAILABLE' ? 'OPEN' : plot.status}
                  </span>
                </div>

                {/* Middle: Dimensions & Facing */}
                <div className="my-auto">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {plot.area_sqft ? `${plot.area_sqft} sqft` : plot.dimensions || 'Villa Plot'}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate flex items-center gap-0.5 mt-0.5">
                    <Compass className="w-2.5 h-2.5 flex-shrink-0" />
                    <span>{plot.facing || 'East Facing'}</span>
                  </div>
                </div>

                {/* Bottom: Price */}
                <div className="pt-1.5 border-t border-black/5 w-full flex items-center justify-between">
                  <span className="text-xs font-black text-brand-primary font-heading">
                    {plot.price_display || (plot.price ? formatPrice(plot.price) : 'On Req')}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] text-slate-400 group-hover:text-slate-800">Edit</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Plot Inspection Modal */}
      {activePlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      activePlot.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : activePlot.status === 'BOOKED'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {activePlot.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{projectName}</span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900">
                  {activePlot.title || `Plot #${activePlot.plot_number}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePlot(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Plot Extent</span>
                <span className="font-bold text-slate-900 text-sm">{activePlot.area_sqft || 1200} Sq.Ft</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Dimensions</span>
                <span className="font-bold text-slate-900 text-sm">{activePlot.dimensions || '30 x 40 Ft'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Vaastu Facing</span>
                <span className="font-bold text-slate-900 text-sm">{activePlot.facing || 'East'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Property Type</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activePlot.property_type === 'COMMERCIAL_PLOT' ? 'Commercial Land' : 'Residential Villa Plot'}
                </span>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-950 to-rose-950 rounded-2xl text-white mb-5 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-200 tracking-wider block">
                  Total Plot Cost
                </span>
                <span className="text-2xl font-black text-amber-300 font-heading">
                  {activePlot.price_display || (activePlot.price ? formatPrice(activePlot.price) : 'Call for Quote')}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-300">
                <div className="font-bold text-white">80% Bank Loan</div>
                <div className="text-emerald-400 font-semibold">Immediate Registration</div>
              </div>
            </div>

            {/* Admin Controls (When rendered in Admin portal) */}
            {isAdmin ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 uppercase">Admin Quick Status Change:</div>
                <div className="grid grid-cols-3 gap-2">
                  {['AVAILABLE', 'BOOKED', 'SOLD'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingId === activePlot.id}
                      onClick={() => handleAdminStatusToggle(activePlot, st)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all active:scale-95 ${
                        activePlot.status === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {onEditPlot && (
                  <button
                    type="button"
                    onClick={() => {
                      onEditPlot(activePlot);
                      setActivePlot(null);
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Full Plot Details</span>
                  </button>
                )}
              </div>
            ) : (
              /* Public Visitor Actions */
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEnquiryModalOpen(true);
                  }}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve this Plot</span>
                </button>

                <WhatsAppButton
                  label="Enquire on WhatsApp"
                  message={`Hi Sree Hari Realty, I am interested in ${activePlot.title || `Plot #${activePlot.plot_number}`} in ${projectName}. Please share the exact price quote and parent documents.`}
                  className="w-full text-xs justify-center"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Public Lead Reservation Modal */}
      {activePlot && (
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          propertyId={activePlot.id}
          projectName={`${projectName} (${activePlot.title || `Plot #${activePlot.plot_number}`})`}
          source="PROPERTY_PAGE"
        />
      )}
    </div>
  );
};
