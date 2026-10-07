'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Trees,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  Car,
  Compass,
  Building,
  Navigation,
} from 'lucide-react';
import { Project } from '@/types';
import { WhatsAppButton } from './WhatsAppButton';
import { EnquiryModal } from './EnquiryModal';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);

  const statusColors: Record<string, string> = {
    UPCOMING: 'bg-amber-500 text-white shadow-sm',
    ONGOING: 'bg-emerald-600 text-white shadow-sm',
    COMPLETED: 'bg-blue-600 text-white shadow-sm',
    SOLD_OUT: 'bg-slate-700 text-white shadow-sm',
  };

  const statusLabels: Record<string, string> = {
    UPCOMING: 'New Launch',
    ONGOING: 'Ready to Build',
    COMPLETED: 'Delivered',
    SOLD_OUT: 'Sold Out',
  };

  const whatsAppMsg = `Hi Sree Hari Realty, I am interested in "${project.name}" at ${project.location}. Please share available plot sizes, price sheet, and layout map.`;

  // Parse connectivity or highlights for serving locations text
  const connectivityList: any[] = Array.isArray(project.connectivity)
    ? project.connectivity
    : typeof project.connectivity === 'string'
    ? (() => {
        try {
          return JSON.parse(project.connectivity);
        } catch {
          return [];
        }
      })()
    : [];

  const servingLocations = connectivityList.map((c: any) => c.title || c).join(', ') ||
    'Outer Ring Road (ORR), GST Highway, Reputed Schools & Railway Hub';

  return (
    <>
      <div className="group bg-white rounded-3xl border border-amber-900/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full text-slate-900">
        {/* 1. Project Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={project.main_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Status Badge (Matching Reference Image 2 'New Launch' Style) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                statusColors[project.status] || 'bg-amber-600 text-white'
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>

          {/* Featured / DTCP Trust Tag */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-400/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>DTCP Approved</span>
            </div>
          </div>

          {/* Rate per sqft pill overlay */}
          {project.price_per_sqft && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md border border-slate-200">
              ₹{project.price_per_sqft.toLocaleString('en-IN')}/sq.ft
            </div>
          )}
        </div>

        {/* 2. Content Body (Matching Casagrand Structure from Reference Image 2) */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Project Title */}
            <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-1">
              {project.name}
            </h3>

            {/* Price in Bold Golden/Amber Text */}
            <div className="text-lg font-black font-heading text-amber-700 mt-1 mb-3">
              {project.price_range || 'Call for Pricing'}
            </div>

            {/* Location with Pin */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>

            {/* Serving Locations / Key Landmarks (Matching Reference Image 2) */}
            <div className="flex items-start gap-2 text-xs text-slate-600 mb-3 bg-[#FAF8F5] p-2.5 rounded-2xl border border-amber-900/10">
              <Navigation className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="line-clamp-2 leading-relaxed">
                <span className="font-bold text-slate-800">Serving Location: </span>
                {servingLocations}
              </div>
            </div>

            {/* Specs Rows with Vector Icons */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-700 border-t border-slate-100">
              {/* Land Extent */}
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{project.total_area || '10+ Acres Gated Community'}</span>
              </div>

              {/* Total Units */}
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {project.total_units || '100+ Layout Units'} ({project.available_plots_count ? `${project.available_plots_count} Plots Available` : 'Immediate Registration'})
                </span>
              </div>

              {/* Plot Sizes & Types */}
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">900 - 2400 sq.ft • East & North Facings</span>
              </div>
            </div>
          </div>

          {/* 3. Action Buttons Side-by-Side (Matching Reference Image 2) */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-12 gap-2">
            {/* Book a site visit (Bordered Button) */}
            <button
              type="button"
              onClick={() => setIsSiteVisitOpen(true)}
              className="col-span-6 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-black text-xs transition-all active:scale-95"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book a site visit</span>
            </button>

            {/* View Details (Solid Dark Button) */}
            <Link
              href={`/projects/${project.slug}`}
              className="col-span-6 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-brand-primary text-white font-black text-xs transition-all active:scale-95 shadow-sm"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Book Site Visit Modal */}
      <EnquiryModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        projectId={project.id}
        projectName={project.name}
        source="WEBSITE_FORM"
      />
    </>
  );
};
