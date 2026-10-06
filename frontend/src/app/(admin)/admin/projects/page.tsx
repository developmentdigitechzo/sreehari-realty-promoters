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
} from 'lucide-react';
import { api } from '@/lib/api';
import { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
    highlightsStr: '',
    connectivityStr: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
      highlightsStr: 'DTCP & RERA Approved\n40ft Blacktop Roads\nSweet Ground Water',
      connectivityStr: 'Railway Station - 10 Mins\nAirport - 25 Mins',
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">Projects Management</h1>
          <p className="text-xs text-slate-500">Create, edit, and publish gated plotted communities.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Project Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Price Range</th>
                <th className="py-3.5 px-4">Extent / Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No projects found. Click "Add New Project" above to create one.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
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
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleVisibility(project)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border ${
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
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-bold font-heading text-slate-900">
                {editingProject ? `Edit "${editingProject.name}"` : 'Create New Plot Project'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sri Hari Green Enclave"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Premium CMDA Approved Plots at Tambaram West"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location / Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Tambaram West, Chennai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price Range</label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    placeholder="₹25 Lakhs - ₹55 Lakhs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Rate per Sq.Ft (₹)</label>
                  <input
                    type="number"
                    value={formData.price_per_sqft}
                    onChange={(e) => setFormData({ ...formData, price_per_sqft: Number(e.target.value) })}
                    placeholder="3200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Extent</label>
                  <input
                    type="text"
                    value={formData.total_area}
                    onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                    placeholder="12 Acres"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Units</label>
                  <input
                    type="text"
                    value={formData.total_units}
                    onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
                    placeholder="140 Plots"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white"
                  >
                    <option value="ONGOING">ONGOING</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="SOLD_OUT">SOLD_OUT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Main Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.main_image_url}
                  onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
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
                    placeholder="DTCP & RERA Approved&#10;40ft Blacktop Roads&#10;Sweet Ground Water"
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
                    placeholder="Tambaram Railway Hub - 7 Mins&#10;Outer Ring Road - 3 Mins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-brand-primary"
                  />
                  <span className="font-bold text-slate-700">Mark as Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="rounded text-brand-primary"
                  />
                  <span className="font-bold text-slate-700">Publish / Visible on Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold transition-all flex items-center gap-2"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
