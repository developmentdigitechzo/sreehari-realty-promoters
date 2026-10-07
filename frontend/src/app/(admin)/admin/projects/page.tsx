'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Building,
  FileText,
  ShieldCheck,
  MapPin,
  Maximize2,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { ImageUploadWidget } from '@/components/common/ImageUploadWidget';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    location: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    total_area: '',
    total_units: '',
    price_range: '',
    price_per_sqft: 0,
    status: 'ONGOING',
    is_featured: false,
    is_visible: true,
    main_image_url: '',
    brochure_url: '',
    highlightsStr: '',
    connectivityStr: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setCurrentUser(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects({ admin: true });
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      location: '',
      address: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      total_area: '10 Acres',
      total_units: '100 Plots',
      price_range: '₹25 Lakhs - ₹60 Lakhs',
      price_per_sqft: 2500,
      status: 'ONGOING',
      is_featured: false,
      is_visible: true,
      main_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      brochure_url: '',
      highlightsStr: '100% DTCP & RERA Approved\n40ft Heavy-Duty Blacktop Roads\nSweet Ground Water Table',
      connectivityStr: 'Railway Hub - 7 Mins\nOuter Ring Road - 3 Mins\nInternational Airport - 22 Mins',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      tagline: project.tagline || '',
      description: project.description,
      location: project.location,
      address: project.address || '',
      city: project.city || 'Chennai',
      state: project.state || 'Tamil Nadu',
      total_area: project.total_area || '',
      total_units: project.total_units || '',
      price_range: project.price_range || '',
      price_per_sqft: project.price_per_sqft || 0,
      status: project.status,
      is_featured: project.is_featured,
      is_visible: project.is_visible,
      main_image_url: project.main_image_url,
      brochure_url: project.brochure_url || '',
      highlightsStr: project.highlights
        ? project.highlights.map((h: any) => (typeof h === 'string' ? h : h.title)).join('\n')
        : '',
      connectivityStr: project.connectivity
        ? project.connectivity.map((c: any) => `${c.title} - ${c.distance}`).join('\n')
        : '',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const highlights = formData.highlightsStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title) => ({ title }));

    const connectivity = formData.connectivityStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('-');
        return {
          title: parts[0]?.trim() || line,
          distance: parts[1]?.trim() || '',
        };
      });

    const payload = {
      name: formData.name,
      tagline: formData.tagline || undefined,
      description: formData.description,
      location: formData.location,
      address: formData.address || undefined,
      city: formData.city,
      state: formData.state,
      total_area: formData.total_area || undefined,
      total_units: formData.total_units || undefined,
      price_range: formData.price_range || undefined,
      price_per_sqft: Number(formData.price_per_sqft) || undefined,
      status: formData.status as any,
      is_featured: formData.is_featured,
      is_visible: formData.is_visible,
      main_image_url: formData.main_image_url,
      brochure_url: formData.brochure_url || undefined,
      highlights,
      connectivity,
    };

    try {
      if (editingProject) {
        const res = await api.updateProject(editingProject.id, payload);
        if (res.success) {
          setModalOpen(false);
          fetchProjects();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await api.createProject(payload);
        if (res.success) {
          setModalOpen(false);
          fetchProjects();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to save project. Check backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"? This action cannot be undone.`)) {
      try {
        await api.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      await api.updateProject(project.id, { is_visible: !project.is_visible });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
  });

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || !currentUser;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">Projects Management</h1>
            {currentUser && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                {currentUser.role}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Create, edit, and publish gated plotted layout communities.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
          {filteredProjects.length} Projects
        </div>
      </div>

      {/* Mobile Card List (Visible on `<md`) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
            <span className="text-xs">Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No projects found matching your search.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={project.main_image_url}
                  alt={project.name}
                  className="w-20 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase border ${
                        project.status === 'ONGOING'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : project.status === 'UPCOMING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {project.status}
                    </span>
                    {project.is_featured && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-1 truncate">{project.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>

              {/* Price & Specs Bar */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Price Range</span>
                  <div className="font-black text-brand-primary font-heading mt-0.5 truncate">
                    {project.price_range || 'Call for price'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Extent / Units</span>
                  <div className="font-bold text-slate-700 mt-0.5 truncate">
                    {project.total_area || '—'} • {project.total_units || '—'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleVisibility(project)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
                    project.is_visible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {project.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{project.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {project.brochure_url && (
                    <a
                      href={project.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                      title="View Brochure PDF"
                    >
                      <FileText className="w-4 h-4 text-brand-primary" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id, project.name)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Projects Table (Visible on `md:block`) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Project Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Price Range</th>
                <th className="py-3.5 px-4">Extent / Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Brochure</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
                    Loading projects...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No projects found. Click "Add New Project" above to create one.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.main_image_url}
                          alt={project.name}
                          className="w-12 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{project.name}</div>
                          <div className="text-[11px] text-slate-400">{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{project.location}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-primary font-heading">
                      {project.price_range || 'Call for price'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{project.total_area || '—'}</div>
                      <div className="text-[10px] text-slate-400">{project.total_units || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          project.status === 'ONGOING'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : project.status === 'UPCOMING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {project.brochure_url ? (
                        <a
                          href={project.brochure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleVisibility(project)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-all ${
                          project.is_visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {project.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.is_visible ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(project.id, project.name)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Project Modal (Mobile Fullscreen / Desktop Dialog) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {editingProject ? `Edit "${editingProject.name}"` : 'Create New Plotted Community'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form id="project-modal-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Sri Hari Green Enclave"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Premium CMDA Approved Plots at Tambaram West"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the gated layout, road widths, water, and approvals..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Location / Area *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Tambaram West, Chennai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Price Range</label>
                    <input
                      type="text"
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                      placeholder="₹25 Lakhs - ₹55 Lakhs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Rate per Sq.Ft (₹)</label>
                    <input
                      type="number"
                      value={formData.price_per_sqft}
                      onChange={(e) => setFormData({ ...formData, price_per_sqft: Number(e.target.value) })}
                      placeholder="3200"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Total Extent</label>
                    <input
                      type="text"
                      value={formData.total_area}
                      onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                      placeholder="12 Acres"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Total Units</label>
                    <input
                      type="text"
                      value={formData.total_units}
                      onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
                      placeholder="140 Plots"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white min-h-[44px]"
                    >
                      <option value="ONGOING">ONGOING (Ready to build)</option>
                      <option value="UPCOMING">UPCOMING (Pre-launch)</option>
                      <option value="COMPLETED">COMPLETED (Delivered)</option>
                      <option value="SOLD_OUT">SOLD_OUT</option>
                    </select>
                  </div>
                </div>

                {/* Media Upload 1: Main Project Showcase Image */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <ImageUploadWidget
                    label="Main Showcase Image"
                    value={formData.main_image_url}
                    onChange={(url) => setFormData({ ...formData, main_image_url: url })}
                    required
                    helpText="Upload a high quality photo of the project entrance, layout roads, or landscape."
                  />
                </div>

                {/* Media Upload 2: Master Layout Plan / Brochure PDF */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <ImageUploadWidget
                    label="Master Layout Plan / Brochure (PDF or Image)"
                    value={formData.brochure_url}
                    onChange={(url) => setFormData({ ...formData, brochure_url: url })}
                    acceptPdf={true}
                    helpText="Upload official DTCP layout map or brochure PDF for buyer download."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Key Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.highlightsStr}
                      onChange={(e) => setFormData({ ...formData, highlightsStr: e.target.value })}
                      placeholder="100% DTCP & RERA Approved&#10;40ft Blacktop Roads&#10;Sweet Ground Water"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Connectivity / Landmarks (Name - Distance per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.connectivityStr}
                      onChange={(e) => setFormData({ ...formData, connectivityStr: e.target.value })}
                      placeholder="Railway Hub - 7 Mins&#10;Outer Ring Road - 3 Mins"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded text-brand-primary w-4 h-4"
                    />
                    <span className="font-bold text-slate-700">Mark as Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="rounded text-brand-primary w-4 h-4"
                    />
                    <span className="font-bold text-slate-700">Publish / Visible on Website</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 sticky bottom-0 z-10 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 font-bold active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-modal-form"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <span>Save Project</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
