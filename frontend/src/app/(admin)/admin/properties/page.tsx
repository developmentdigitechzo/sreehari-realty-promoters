'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Search,
  Loader2,
  X,
  AlertCircle,
  Building,
  CheckCircle2,
  Filter,
  Compass,
  Maximize2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Property, Project } from '@/types';
import { formatPrice } from '@/lib/utils';
import { VisualPlotGrid } from '@/components/common/VisualPlotGrid';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    plot_number: '',
    property_type: 'RESIDENTIAL_PLOT',
    area_sqft: 1200,
    dimensions: '30 x 40 ft',
    facing: 'East',
    price: 3600000,
    price_display: '₹36.00 Lakhs',
    status: 'AVAILABLE',
    is_featured: false,
    is_visible: true,
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, projRes] = await Promise.all([
        api.getProperties({ admin: true }),
        api.getProjects({ admin: true }),
      ]);

      if (propsRes.success && propsRes.data) {
        setProperties(propsRes.data);
      }
      if (projRes.success && projRes.data) {
        setProjects(projRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProperty(null);
    const nextPlotNum = properties.length + 1;
    setFormData({
      project_id: selectedProjectId !== 'ALL' ? selectedProjectId : projects[0]?.id || '',
      title: `Plot ${nextPlotNum} - East Facing Villa Plot`,
      plot_number: `${nextPlotNum}`,
      property_type: 'RESIDENTIAL_PLOT',
      area_sqft: 1200,
      dimensions: '30 x 40 ft',
      facing: 'East',
      price: 3840000,
      price_display: '₹38.40 Lakhs',
      status: 'AVAILABLE',
      is_featured: false,
      is_visible: true,
      description: 'Prime residential plot with DTCP approval and immediate registration.',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormData({
      project_id: prop.project_id || '',
      title: prop.title,
      plot_number: prop.plot_number || '',
      property_type: prop.property_type,
      area_sqft: prop.area_sqft,
      dimensions: prop.dimensions || '',
      facing: prop.facing || '',
      price: prop.price,
      price_display: prop.price_display || '',
      status: prop.status,
      is_featured: prop.is_featured,
      is_visible: prop.is_visible,
      description: prop.description || '',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleStatusChange = async (plotId: string, newStatus: string) => {
    try {
      const res = await api.updateProperty(plotId, { status: newStatus as any });
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === plotId ? { ...p, status: newStatus as any } : p))
        );
      }
    } catch (err) {
      alert('Failed to update plot status.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      project_id: formData.project_id || undefined,
      title: formData.title,
      plot_number: formData.plot_number || undefined,
      property_type: formData.property_type as any,
      area_sqft: Number(formData.area_sqft),
      dimensions: formData.dimensions || undefined,
      facing: formData.facing || undefined,
      price: Number(formData.price),
      price_display: formData.price_display || undefined,
      status: formData.status as any,
      is_featured: formData.is_featured,
      is_visible: formData.is_visible,
      description: formData.description || undefined,
    };

    try {
      if (editingProperty) {
        const res = await api.updateProperty(editingProperty.id, payload);
        if (res.success) {
          setModalOpen(false);
          fetchData();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await api.createProperty(payload);
        if (res.success) {
          setModalOpen(false);
          fetchData();
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to save plot. Check backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete plot "${title}"?`)) {
      try {
        await api.deleteProperty(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete plot.');
      }
    }
  };

  const displayedProperties = properties.filter((p) => {
    if (selectedProjectId !== 'ALL' && p.project_id !== selectedProjectId) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.plot_number && p.plot_number.includes(q)) ||
        (p.facing && p.facing.toLowerCase().includes(q)) ||
        (p.project_name && p.project_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeProjectObj = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">Plots Inventory & Matrix</h1>
          <p className="text-xs text-slate-500">Manage individual layout plots, facing, dimensions, pricing, and live availability.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Project Selector & Search */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0 max-w-full">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mr-1 flex-shrink-0">
            <Building className="w-3.5 h-3.5" /> Project:
          </span>
          <button
            onClick={() => setSelectedProjectId('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              selectedProjectId === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Projects ({properties.length})
          </button>
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                selectedProjectId === proj.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {proj.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search plot #, facing, price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* 1. VISUAL PLOT MATRIX (ADMIN MODE WITH 1-CLICK STATUS TOGGLE) */}
      <VisualPlotGrid
        plots={displayedProperties}
        projectName={activeProjectObj?.name || 'All Projects Inventory'}
        isAdmin={true}
        onStatusChange={handleStatusChange}
        onEditPlot={handleOpenEdit}
      />

      {/* 2. PLOTS MOBILE CARDS VIEW (Visible on `<md`) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Plot List ({displayedProperties.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
            <span className="text-xs">Loading plots...</span>
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No plots found for this selection.
          </div>
        ) : (
          displayedProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-black font-heading text-xs shadow-xs">
                    #{prop.plot_number || '—'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{prop.title}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold">{prop.project_name || 'Standalone Plot'}</span>
                  </div>
                </div>

                <select
                  value={prop.status}
                  onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                    prop.status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : prop.status === 'BOOKED'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>

              {/* Specs Pill Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Extent</span>
                  <div className="font-bold text-slate-800 mt-0.5">{prop.area_sqft} sq.ft</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Facing</span>
                  <div className="font-bold text-slate-800 mt-0.5 truncate">{prop.facing || 'East'}</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Price</span>
                  <div className="font-black text-brand-primary font-heading mt-0.5 truncate">
                    {prop.price_display || `₹${(prop.price / 100000).toFixed(2)}L`}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400">{prop.dimensions || 'Standard Rectangular'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prop)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prop.id, prop.title)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95"
                    title="Delete Plot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. PLOTS DESKTOP DATA TABLE (Visible on `md:block`) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Tabular Inventory View</h3>
          <span className="text-xs font-semibold text-slate-500">{displayedProperties.length} plots displayed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Plot Details</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Area & Dimensions</th>
                <th className="py-3.5 px-4">Facing</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
                    Loading plots...
                  </td>
                </tr>
              ) : displayedProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No plots found for this selection.
                  </td>
                </tr>
              ) : (
                displayedProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{prop.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Plot #{prop.plot_number || '—'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {prop.project_name || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-bold text-slate-900">{prop.area_sqft} Sq.Ft</div>
                      <div className="text-[10px] text-slate-400">{prop.dimensions || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{prop.facing || 'East'}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-primary font-heading">
                      {prop.price_display || `₹${(prop.price / 100000).toFixed(2)} Lakhs`}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          prop.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : prop.status === 'BOOKED'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="SOLD">SOLD</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="Edit Plot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Delete Plot"
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

      {/* Create / Edit Plot Modal (Mobile Fullscreen / Desktop Dialog) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {editingProperty ? `Edit Plot "${editingProperty.title}"` : 'Add New Plot to Inventory'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form id="plot-modal-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Parent Project *</label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white min-h-[44px]"
                    >
                      <option value="">-- Standalone Plot --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Plot Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.plot_number}
                      onChange={(e) => setFormData({ ...formData, plot_number: e.target.value })}
                      placeholder="14"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Plot Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Plot 14 - East Facing Villa Plot"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Area in Sq.Ft *</label>
                    <input
                      type="number"
                      required
                      value={formData.area_sqft}
                      onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                      placeholder="1200"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="30 x 40 ft"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Facing</label>
                    <select
                      value={formData.facing}
                      onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white min-h-[44px]"
                    >
                      <option value="East">East</option>
                      <option value="North">North</option>
                      <option value="West">West</option>
                      <option value="South">South</option>
                      <option value="North-East Corner">North-East Corner</option>
                      <option value="North-West Corner">North-West Corner</option>
                      <option value="South-East Corner">South-East Corner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Total Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="3840000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Price Label</label>
                    <input
                      type="text"
                      value={formData.price_display}
                      onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                      placeholder="₹38.40 Lakhs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Availability</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white min-h-[44px]"
                    >
                      <option value="AVAILABLE">AVAILABLE (🟢 Ready to book)</option>
                      <option value="BOOKED">BOOKED (🟡 Advance received)</option>
                      <option value="SOLD">SOLD (⚪ Registered)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional plot specifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
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
                form="plot-modal-form"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Plot...</span>
                  </>
                ) : (
                  <span>Save Plot</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
