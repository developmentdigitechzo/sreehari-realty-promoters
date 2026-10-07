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
  Download,
  Calendar,
  MessageCircle,
  Send,
  Building,
  UserCheck,
  TrendingUp,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Lead } from '@/types';
import { formatDate, getWhatsAppLink, getTelLink } from '@/lib/utils';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Note Modal State
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [updatingNote, setUpdatingNote] = useState(false);

  // WhatsApp Quick Send Modal State
  const [waModalLead, setWaModalLead] = useState<Lead | null>(null);
  const [waCustomMessage, setWaCustomMessage] = useState('');

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

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (confirm(`Delete enquiry from "${leadName}"? This action cannot be undone.`)) {
      try {
        const res = await api.deleteLead(leadId);
        if (res.success) {
          setLeads((prev) => prev.filter((l) => l.id !== leadId));
        } else {
          alert('Failed to delete lead: ' + res.message);
        }
      } catch (err) {
        alert('Failed to delete lead.');
      }
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

  const handleOpenWhatsAppModal = (lead: Lead) => {
    setWaModalLead(lead);
    const projName = lead.project_name || 'our gated community layouts';
    setWaCustomMessage(
      `Hello ${lead.name}, this is from Sree Hari Realty Promoters regarding your enquiry on ${projName}. We would like to share the complete layout plan, DTCP approval copy, and price sheet with you. Would this weekend be convenient for your free chauffeured AC cab site visit?`
    );
  };

  const handleSendWhatsApp = () => {
    if (!waModalLead) return;
    const link = getWhatsAppLink(waModalLead.phone, waCustomMessage);
    window.open(link, '_blank');
    // Auto update status to CONTACTED if it was NEW
    if (waModalLead.status === 'NEW') {
      handleStatusChange(waModalLead.id, 'CONTACTED');
    }
    setWaModalLead(null);
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['Buyer Name', 'Phone Number', 'Email', 'Interested Project', 'Lead Source', 'Status', 'Notes', 'Enquiry Date'];
    const rows = filteredLeads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.project_name || 'General Enquiry').replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.created_at).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sree_hari_realty_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Metrics
  const countNew = leads.filter((l) => l.status === 'NEW').length;
  const countContacted = leads.filter((l) => l.status === 'CONTACTED' || l.status === 'FOLLOW_UP').length;
  const countConverted = leads.filter((l) => l.status === 'CONVERTED').length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black font-heading text-slate-900">Leads CRM & Enquiries</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              {leads.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage buyer enquiries, 1-tap WhatsApp quotes, call follow-ups, and exports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-heading mt-0.5">{leads.length}</div>
        </div>
        <div className="bg-rose-50/70 p-3 sm:p-4 rounded-2xl border border-rose-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> New Pending
          </span>
          <div className="text-lg sm:text-2xl font-black text-rose-800 font-heading mt-0.5">{countNew}</div>
        </div>
        <div className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">In Follow-Up</span>
          <div className="text-lg sm:text-2xl font-black text-amber-800 font-heading mt-0.5">{countContacted}</div>
        </div>
        <div className="bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Converted</span>
          <div className="text-lg sm:text-2xl font-black text-emerald-800 font-heading mt-0.5">{countConverted}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by buyer name, phone, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
          />
        </div>

        {/* Horizontal scroll status chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Status:</span>
          {['ALL', 'NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading enquiries...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200/80">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No leads found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing your search keywords or status filter.</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Touch-Friendly Lead Cards (< md) */}
          <div className="md:hidden space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 transition-all"
              >
                {/* Header: Name, Project & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{lead.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-semibold text-brand-primary truncate max-w-[160px]">
                          {lead.project_name || 'General Enquiry'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`text-[11px] font-black px-2 py-1 rounded-lg border outline-none cursor-pointer ${
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
                    <option value="FOLLOW_UP">FOLLOW UP</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                {/* Message / Details if present */}
                {lead.message && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Buyer Message:</span>
                    {lead.message}
                  </div>
                )}

                {/* Note Preview if present */}
                {lead.notes && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 leading-relaxed flex items-start gap-1.5">
                    <Edit className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Internal Staff Note:</span>
                      {lead.notes}
                    </div>
                  </div>
                )}

                {/* Metadata info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="font-mono text-slate-600 font-semibold">{lead.phone}</span>
                  <span>{formatDate(lead.created_at)}</span>
                </div>

                {/* Touch Action Buttons (Large, 1-Tap) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => handleOpenWhatsAppModal(lead)}
                    className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </button>

                  <a
                    href={getTelLink(lead.phone)}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenNoteModal(lead)}
                      className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 border border-slate-200"
                      title="Add or edit internal follow-up note"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 active:scale-95 border border-rose-200"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Dense High-Productivity Table (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
                    <th className="py-3.5 px-5 text-right">1-Tap Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        {lead.notes && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 line-clamp-1 border border-amber-200">
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
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
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
                      <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                        {/* 1-Tap WhatsApp Button */}
                        <button
                          onClick={() => handleOpenWhatsAppModal(lead)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors active:scale-95"
                          title="Send WhatsApp Quote"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>

                        {/* 1-Tap Call */}
                        <a
                          href={getTelLink(lead.phone)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors active:scale-95"
                          title="Call Buyer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        {/* Add/Edit Note */}
                        <button
                          onClick={() => handleOpenNoteModal(lead)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors active:scale-95"
                          title="Add/Edit Follow-Up Note"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Note</span>
                        </button>

                        {/* Delete Lead */}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors active:scale-95"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 1-Tap WhatsApp Custom Quote Modal (Responsive Slide-up Bottom Sheet / Dialog) */}
      {waModalLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Send WhatsApp to {waModalLead.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{waModalLead.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setWaModalLead(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Personalized Message Template
              </label>
              <textarea
                rows={5}
                value={waCustomMessage}
                onChange={(e) => setWaCustomMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                Tapping "Launch WhatsApp Chat" will open your native WhatsApp app or WhatsApp Web directly with this message ready to send.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setWaModalLead(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Note Modal (Responsive Slide-up Bottom Sheet / Dialog) */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Follow-Up Note
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Buyer: {activeLead.name} ({activeLead.phone})</span>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-2">
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g., Customer requested 1200 sqft corner plot brochure. Scheduled AC cab site visit for Saturday 10:30 AM."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none leading-relaxed"
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-3.5 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingNote}
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-sm"
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
