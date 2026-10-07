'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building,
  Layers,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Loader2,
  PlusCircle,
  Phone,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardStats, Lead } from '@/types';
import { formatDate, getWhatsAppLink, getTelLink } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentLeads: prev.recentLeads.map((l) =>
            l.id === leadId ? { ...l, status: newStatus as any } : l
          ),
        };
      });
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      sublabel: `${stats?.activeProjects || 0} Ongoing / Active`,
      icon: Building,
      badge: 'Active Layouts',
      color: 'from-blue-600 to-indigo-700',
      lightBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Plots Inventory',
      value: stats?.totalProperties || 0,
      sublabel: `${stats?.availableProperties || 0} Ready for Sale`,
      icon: Layers,
      badge: 'Available Plots',
      color: 'from-emerald-600 to-teal-700',
      lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Buyer Enquiries',
      value: stats?.totalLeads || 0,
      sublabel: `${stats?.newLeads || 0} New Pending Action`,
      icon: Users,
      badge: 'CRM Pipeline',
      color: 'from-rose-600 to-brand-primaryDark',
      lightBg: 'bg-rose-50 text-brand-primary border-rose-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
              Executive Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live ERP
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time gated layout inventory matrix and buyer pipeline overview.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/properties"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Plot</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
                    {card.value}
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${card.lightBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-600">{card.sublabel}</span>
                <span className="font-black text-slate-400 text-[10px] uppercase">{card.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Mobile Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:hidden">
        <Link
          href="/admin/leads"
          className="p-3 bg-white rounded-2xl border border-slate-200 text-center active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5 text-rose-600 mx-auto mb-1" />
          <div className="text-xs font-bold text-slate-800">Leads CRM</div>
          <div className="text-[10px] text-slate-400">{stats?.totalLeads || 0} Total</div>
        </Link>
        <Link
          href="/admin/properties"
          className="p-3 bg-white rounded-2xl border border-slate-200 text-center active:scale-95 transition-transform"
        >
          <Layers className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-xs font-bold text-slate-800">Plots Matrix</div>
          <div className="text-[10px] text-slate-400">{stats?.availableProperties || 0} Available</div>
        </Link>
        <Link
          href="/admin/projects"
          className="p-3 bg-white rounded-2xl border border-slate-200 text-center active:scale-95 transition-transform"
        >
          <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs font-bold text-slate-800">Projects</div>
          <div className="text-[10px] text-slate-400">{stats?.totalProjects || 0} Layouts</div>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="p-3 bg-white rounded-2xl border border-slate-200 text-center active:scale-95 transition-transform"
        >
          <ExternalLink className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs font-bold text-slate-800">Live Website</div>
          <div className="text-[10px] text-slate-400">View Public</div>
        </Link>
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold font-heading text-slate-900 text-base">Recent Incoming Enquiries</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {stats?.newLeads || 0} New
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Live enquiries captured from website & project pages.</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1 active:scale-95"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Cards View (Visible on `<md`) */}
        <div className="md:hidden divide-y divide-slate-100">
          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            stats.recentLeads.map((lead: Lead) => (
              <div key={lead.id} className="p-4 space-y-3 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{lead.name}</div>
                    <div className="text-[11px] font-semibold text-brand-primary">
                      {lead.project_name || 'General Layout Enquiry'}
                    </div>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                      lead.status === 'NEW'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : lead.status === 'CONTACTED'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
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
                </div>

                {lead.message && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    "{lead.message}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">{formatDate(lead.created_at)}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppLink(lead.phone, `Hello ${lead.name}, this is from Sree Hari Realty regarding your enquiry.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={getTelLink(lead.phone)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No leads received yet.
            </div>
          )}
        </div>

        {/* Desktop Table View (Visible on `md:block`) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Lead / Contact</th>
                <th className="py-3 px-4">Interested Project</th>
                <th className="py-3 px-4">Message / Source</th>
                <th className="py-3 px-4">Received On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">1-Tap Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-700">{lead.phone}</span>
                        {lead.email && <span>• {lead.email}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {lead.project_name || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="line-clamp-1 text-slate-600">{lead.message || '—'}</div>
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
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
                      <a
                        href={getWhatsAppLink(lead.phone, `Hello ${lead.name}, this is from Sree Hari Realty.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                      </a>
                      <a
                        href={getTelLink(lead.phone)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No leads received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
