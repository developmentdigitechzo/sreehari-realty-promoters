'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { Project } from '@/types';
import { ProjectCard } from '../common/ProjectCard';

interface ProjectShowcaseTabsProps {
  initialProjects: Project[];
}

export const ProjectShowcaseTabs: React.FC<ProjectShowcaseTabsProps> = ({ initialProjects }) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const tabs = [
    { label: 'All Layouts', value: 'ALL' },
    { label: 'Ready to Build', value: 'ONGOING' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  const filtered = initialProjects.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Verified Gated Communities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Featured Land & Plot Developments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-xl">
              Handpicked gated communities with wide tar roads, landscaped parks, and DTCP & RERA government approvals.
            </p>
          </div>

          {/* Interactive Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto scrollbar-none self-start md:self-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? 'bg-white text-slate-950 shadow-md scale-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid with Mobile Snap-Scroll */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="w-[82vw] max-w-[340px] md:w-auto snap-center flex-shrink-0 md:flex-shrink"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Mobile Swipe Guidance */}
        <div className="md:hidden flex items-center justify-between mt-3 px-1 text-xs text-slate-500 font-semibold">
          <span>👈 Swipe cards horizontally 👉</span>
          <Link href="/projects" className="text-brand-primary font-bold inline-flex items-center gap-0.5">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Explore All Link */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-brand-primary text-white font-bold text-xs sm:text-sm transition-all shadow-md group active:scale-95"
          >
            <span>Explore All Layouts & Plots</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
