'use client';

import React, { useState, useEffect } from 'react';
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
  Heart,
} from 'lucide-react';
import { Project } from '@/types';
import { WhatsAppButton } from './WhatsAppButton';
import { EnquiryModal } from './EnquiryModal';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Read initial like status from localStorage
  useEffect(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('user_liked_projects') || '[]');
      if (savedLikes.includes(project.id)) {
        setIsLiked(true);
      }
    } catch {
      // ignore
    }
  }, [project.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    try {
      const savedLikes: string[] = JSON.parse(localStorage.getItem('user_liked_projects') || '[]');
      if (newLikedState) {
        if (!savedLikes.includes(project.id)) savedLikes.push(project.id);
      } else {
        const idx = savedLikes.indexOf(project.id);
        if (idx !== -1) savedLikes.splice(idx, 1);
      }
      localStorage.setItem('user_liked_projects', JSON.stringify(savedLikes));
    } catch {
      // ignore
    }
  };

  const statusColors: Record<string, string> = {
    UPCOMING: 'bg-[#108474] text-white shadow-sm',
    ONGOING: 'bg-emerald-600 text-white shadow-sm',
    COMPLETED: 'bg-teal-700 text-white shadow-sm',
    SOLD_OUT: 'bg-slate-700 text-white shadow-sm',
  };

  const statusLabels: Record<string, string> = {
    UPCOMING: 'New Launch',
    ONGOING: 'Ready to Build',
    COMPLETED: 'Delivered',
    SOLD_OUT: 'Sold Out',
  };

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

  const servingLocations =
    connectivityList.map((c: any) => c.title || c).join(', ') ||
    'Outer Ring Road (ORR), GST Highway, Reputed Schools & Railway Hub';

  return (
    <>
      <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#108474]/40 transition-all duration-300 flex flex-col h-full text-slate-900">
        {/* 1. Project Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={project.main_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                statusColors[project.status] || 'bg-[#108474] text-white'
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>

          {/* Right Header: DTCP Tag + Like Heart Button Accessory (#e52e3d) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div className="bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#108474]/50 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>DTCP Approved</span>
            </div>

            {/* User Requested Accessory: Like / Heart Button in #e52e3d */}
            <button
              type="button"
              onClick={toggleLike}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 active:scale-75 shadow-md flex items-center justify-center ${
                isLiked
                  ? 'bg-[#e52e3d] text-white ring-2 ring-[#e52e3d]/40 scale-105'
                  : 'bg-white/90 text-slate-600 hover:text-[#e52e3d] hover:bg-white'
              }`}
              title={isLiked ? 'Remove from favorites' : 'Save to favorites'}
              aria-label="Like property"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  isLiked ? 'fill-white scale-110' : 'hover:scale-110'
                }`}
              />
            </button>
          </div>

          {/* Rate per sqft pill overlay */}
          {project.price_per_sqft && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#108474] text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md border border-[#108474]/20">
              ₹{project.price_per_sqft.toLocaleString('en-IN')}/sq.ft
            </div>
          )}
        </div>

        {/* 2. Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Project Title */}
            <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-[#108474] transition-colors leading-snug line-clamp-1">
              {project.name}
            </h3>

            {/* Price in Bold Theme Text */}
            <div className="text-lg font-black font-heading text-[#108474] mt-1 mb-3">
              {project.price_range || 'Call for Pricing'}
            </div>

            {/* Location with Pin */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 text-[#108474] shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>

            {/* Serving Locations / Key Landmarks */}
            <div className="flex items-start gap-2 text-xs text-slate-600 mb-3 bg-[#f0fdfa] p-2.5 rounded-2xl border border-[#108474]/15">
              <Navigation className="w-4 h-4 text-[#108474] shrink-0 mt-0.5" />
              <div className="line-clamp-2 leading-relaxed">
                <span className="font-bold text-slate-800">Serving Location: </span>
                {servingLocations}
              </div>
            </div>

            {/* Specs Rows with Vector Icons */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-700 border-t border-slate-100">
              {/* Land Extent */}
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#108474]/60 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {project.total_area || '10+ Acres Gated Community'}
                </span>
              </div>

              {/* Total Units */}
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#108474]/60 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {project.total_units || '100+ Layout Units'} (
                  {project.available_plots_count
                    ? `${project.available_plots_count} Plots Available`
                    : 'Immediate Registration'}
                  )
                </span>
              </div>

              {/* Plot Sizes & Types */}
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#108474]/60 shrink-0" />
                <span className="font-semibold text-slate-800">900 - 2400 sq.ft • East & North Facings</span>
              </div>
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-12 gap-2">
            {/* Book a site visit */}
            <button
              type="button"
              onClick={() => setIsSiteVisitOpen(true)}
              className="col-span-6 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border-2 border-[#108474] text-[#108474] hover:bg-[#108474] hover:text-white font-black text-xs transition-all active:scale-95"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book a site visit</span>
            </button>

            {/* View Details */}
            <Link
              href={`/projects/${project.slug}`}
              className="col-span-6 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-xs transition-all active:scale-95 shadow-sm"
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
