'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle, Trees, Layers, Sparkles } from 'lucide-react';
import { Project } from '@/types';
import { WhatsAppButton } from './WhatsAppButton';
import { EnquiryModal } from './EnquiryModal';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColors: Record<string, string> = {
    UPCOMING: 'bg-amber-100 text-amber-800 border-amber-300',
    ONGOING: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
    SOLD_OUT: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const statusLabels: Record<string, string> = {
    UPCOMING: 'Upcoming Launch',
    ONGOING: 'Ready to Build / Ongoing',
    COMPLETED: 'Completed & Delivered',
    SOLD_OUT: '100% Sold Out',
  };

  const whatsAppMsg = `Hi Sree Hari Realty, I would like to know more about "${project.name}" located at ${project.location}. Please share the layout plan and price sheet.`;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* Project Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={project.main_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                statusColors[project.status] || 'bg-slate-100 text-slate-800'
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>

          {/* Featured Tag */}
          {project.is_featured && (
            <div className="absolute top-4 right-4 bg-brand-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED</span>
            </div>
          )}

          {/* Location & Title Overlay */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium mb-1 drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-brand-primaryLight" />
              <span>{project.location}</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-white drop-shadow-md leading-tight">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {project.tagline && (
              <p className="text-xs text-brand-primary font-semibold mb-2 line-clamp-1">
                {project.tagline}
              </p>
            )}
            <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-xs">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-600 uppercase font-semibold">Total Area</div>
                  <div className="font-bold text-slate-900">{project.total_area || '10+ Acres'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-600 uppercase font-semibold">Units / Plots</div>
                  <div className="font-bold text-slate-900">{project.total_units || 'Gated Plots'}</div>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-1.5 mb-4">
                {project.highlights.slice(0, 2).map((hl: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{typeof hl === 'string' ? hl : hl.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Starting Price</span>
                <div className="text-lg font-black text-brand-primary font-heading">
                  {project.price_range || 'Call for Price'}
                </div>
              </div>
              {project.price_per_sqft && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-600">Rate</span>
                  <div className="text-xs font-semibold text-slate-700">₹{project.price_per_sqft} / sq.ft</div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-12 gap-2">
              <Link
                href={`/projects/${project.slug}`}
                className="col-span-7 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-brand-primary text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors group-hover:bg-slate-950"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="col-span-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-bold py-2.5 px-2 rounded-lg transition-colors"
                title="Enquire"
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
