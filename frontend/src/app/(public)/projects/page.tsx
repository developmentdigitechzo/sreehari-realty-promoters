'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Layers, MapPin, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { ProjectCard } from '@/components/common/ProjectCard';
import { MobileStickyBar } from '@/components/home/MobileStickyBar';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, [selectedStatus]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProjects({
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        search: searchQuery || undefined,
      });

      if (res.success && res.data) {
        setProjects(res.data);
      } else {
        setError(res.message || 'Unable to load projects at this moment.');
      }
    } catch (err: any) {
      setError('Network error occurred while fetching projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      (p.tagline && p.tagline.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Gated Plotted Communities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Explore DTCP & RERA Approved Plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3">
            Browse verified residential and commercial land developments across Chennai, Guduvanchery, Tambaram, and
            Chengalpattu.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 mb-8 sm:mb-10">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by project name, location (e.g. Tambaram)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 hidden sm:inline">Status:</span>
              {[
                { label: 'All Layouts', value: 'ALL' },
                { label: 'Ongoing', value: 'ONGOING' },
                { label: 'Upcoming', value: 'UPCOMING' },
                { label: 'Completed', value: 'COMPLETED' },
              ].map((status) => (
                <button
                  type="button"
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    selectedStatus === status.value
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Loading approved plot projects...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-rose-800 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or resetting the status filters.
            </p>
            <button
              onClick={() => {
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      <MobileStickyBar />
    </div>
  );
}
