'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Edit,
  Loader2,
  X,
  CheckCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Lead } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Note Modal State
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [updatingNote, setUpdatingNote] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        search: searchQuery || undefined,
      });

      if (res.success && res.data) {
        setLeads(res.data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
      );
    } catch (err) {
      alert('Failed to update lead status.');
    }
  };

  const handleOpenNoteModal = (lead: Lead) => {
    setActiveLead(lead);
    setNoteText(lead.notes || '');
  };

  const handleSaveNote = async () => {
    if (!activeLead) return;
    setUpdatingNote(true);
    try {
      await api.updateLead(activeLead.id, { notes: noteText });
      setLeads((prev) =>
        prev.map((l) => (l.id === activeLead.id ? { ...l, notes: noteText } : l))
      );
      setActiveLead(null);
    } catch (err) {
      alert('Failed to save note.');
    } finally {
      setUpdatingNote(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.project_name && lead.project_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">Leads & Enquiries</h1>
          <p className="text-xs text-slate-500">
            Track site visit requests, WhatsApp leads, and prospective land buyer enquiries.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by buyer name, phone number, email, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Status:</span>
          {['ALL', 'NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Prospective Buyer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Interested Project</th>
                <th className="py-3.5 px-4">Source & Message</th>
                <th className="py-3.5 px-4">Received On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary mx-auto mb-2" />
                    Loading enquiries...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No leads matching your current criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      {lead.notes && (
                        <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 line-clamp-1 border border-amber-200">
                          Note: {lead.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.email && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {lead.project_name || 'General Site Visit'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="line-clamp-2 text-slate-600 leading-normal">{lead.message || '—'}</div>
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-1">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          lead.status === 'NEW'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : lead.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : lead.status === 'FOLLOW_UP'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : lead.status === 'CONVERTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="FOLLOW_UP">FOLLOW_UP</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 border border-emerald-200"
                        title="Call Buyer"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <button
                        onClick={() => handleOpenNoteModal(lead)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200"
                        title="Add/Edit Internal Note"
                      >
                        <Edit className="w-3.5 h-3.5" /> Note
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Note Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Internal Note for {activeLead.name}
              </h3>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g., Called on 7th Oct. Customer interested in 1200 sqft corner plot. Scheduled Sunday cab visit."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingNote}
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold flex items-center gap-1.5"
              >
                {updatingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
