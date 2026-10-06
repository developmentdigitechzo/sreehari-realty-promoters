'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Project } from '@/types';
import { ProjectCard } from '../common/ProjectCard';

interface ProjectShowcaseTabsProps {
  initialProjects: Project[];
}

export const ProjectShowcaseTabs: React.FC<ProjectShowcaseTabsProps> = ({ initialProjects }) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const tabs = [
    { label: 'All Featured', value: 'ALL' },
    { label: 'Ready & Ongoing', value: 'ONGOING' },
    { label: 'Upcoming Launches', value: 'UPCOMING' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  const filtered = initialProjects.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Verified Gated Communities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Featured Land & Plot Developments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
              Explore handpicked layout developments with wide tar roads, landscaped parks, and clear government approvals.
            </p>
          </div>

          {/* Interactive Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
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
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Mobile Swipe Guidance Note */}
        <div className="md:hidden text-center mt-3 text-[11px] font-semibold text-slate-400">
          👉 Swipe left/right to browse all layouts
        </div>

        {/* Explore All Link */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-brand-primary text-white font-bold text-xs sm:text-sm transition-all shadow-md group"
          >
            <span>Explore All Projects & Available Plots</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
