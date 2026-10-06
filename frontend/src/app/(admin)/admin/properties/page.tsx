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
} from 'lucide-react';
import { api } from '@/lib/api';
import { Property, Project } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
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
    setFormData({
      project_id: projects[0]?.id || '',
      title: 'Plot 15 - East Facing Villa Plot',
      plot_number: '15',
      property_type: 'RESIDENTIAL_PLOT',
      area_sqft: 1200,
      dimensions: '30 x 40 ft',
      facing: 'East',
      price: 3840000,
      price_display: '₹38.40 Lakhs',
      status: 'AVAILABLE',
      is_featured: false,
      is_visible: true,
      description: 'Prime East facing plot opposite to central avenue park.',
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">Plots Inventory</h1>
          <p className="text-xs text-slate-500">Manage individual plots, facing, dimensions, pricing, and availability.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No plots registered yet. Click "Add New Plot" to add individual plots.
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
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
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          prop.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : prop.status === 'BOOKED'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        {prop.status}
                      </span>
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

      {/* Create / Edit Plot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-bold font-heading text-slate-900">
                {editingProperty ? `Edit Plot "${editingProperty.title}"` : 'Add New Plot to Inventory'}
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Parent Project *</label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Area in Sq.Ft *</label>
                  <input
                    type="number"
                    required
                    value={formData.area_sqft}
                    onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                    placeholder="1200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="30 x 40 ft"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Facing</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="3840000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price Label</label>
                  <input
                    type="text"
                    value={formData.price_display}
                    onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                    placeholder="₹38.40 Lakhs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Availability</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary bg-white"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="SOLD">SOLD</option>
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
                      <span>Saving Plot...</span>
                    </>
                  ) : (
                    <span>Save Plot</span>
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
