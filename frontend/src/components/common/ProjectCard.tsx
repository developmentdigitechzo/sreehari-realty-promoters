'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle, Trees, Layers, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { Project } from '@/types';
import { WhatsAppButton } from './WhatsAppButton';
import { EnquiryModal } from './EnquiryModal';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColors: Record<string, string> = {
    UPCOMING: 'bg-amber-500/10 text-amber-700 border-amber-300',
    ONGOING: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-300',
    SOLD_OUT: 'bg-slate-500/10 text-slate-700 border-slate-300',
  };

  const statusLabels: Record<string, string> = {
    UPCOMING: 'Upcoming Launch',
    ONGOING: 'Ready to Build',
    COMPLETED: 'Delivered',
    SOLD_OUT: 'Sold Out',
  };

  const whatsAppMsg = `Hi Sree Hari Realty, I am interested in "${project.name}" at ${project.location}. Please share available plot sizes, price sheet, and layout map.`;

  return (
    <>
      <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* Project Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={project.main_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                statusColors[project.status] || 'bg-white/90 text-slate-900 border-slate-200'
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>

          {/* Featured Tag */}
          {project.is_featured && (
            <div className="absolute top-3 right-3 bg-brand-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>FEATURED</span>
            </div>
          )}

          {/* Location & Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-[11px] text-slate-200 font-medium mb-0.5 drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-brand-primaryLight flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading text-white drop-shadow-md leading-tight line-clamp-1">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {project.tagline && (
              <p className="text-xs text-brand-primary font-bold mb-2 line-clamp-1">
                {project.tagline}
              </p>
            )}
            <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
              {project.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-2xl mb-3.5 text-xs border border-slate-100">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Total Extent</div>
                  <div className="font-bold text-slate-900 text-xs">{project.total_area || '10+ Acres'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Layout Plots</div>
                  <div className="font-bold text-slate-900 text-xs">{project.total_units || 'Gated Plots'}</div>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-1.5 mb-3.5">
                {project.highlights.slice(0, 2).map((hl: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-medium">{typeof hl === 'string' ? hl : hl.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Investment Range</span>
                <div className="text-base sm:text-lg font-black text-brand-primary font-heading">
                  {project.price_range || 'Call for Price'}
                </div>
              </div>
              {project.price_per_sqft && (
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Plot Rate</span>
                  <div className="text-xs font-bold text-slate-700">₹{project.price_per_sqft.toLocaleString('en-IN')} / sq.ft</div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
              <Link
                href={`/projects/${project.slug}`}
                className="col-span-7 flex items-center justify-center gap-1 bg-slate-950 hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-2 rounded-xl transition-colors active:scale-95 shadow-sm"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="col-span-3 border border-brand-primary/40 bg-rose-50/50 text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-bold py-2.5 px-1 rounded-xl transition-all active:scale-95 text-center"
              >
                Enquire
              </button>
              <div className="col-span-2">
                <WhatsAppButton variant="compact" message={whatsAppMsg} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
        source="PROJECT_PAGE"
      />
    </>
  );
};
