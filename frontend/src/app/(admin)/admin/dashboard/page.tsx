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
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardStats, Lead } from '@/types';
import { formatDate } from '@/lib/utils';

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
      fetchStats();
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
      sublabel: `${stats?.activeProjects || 0} Ongoing / Visible`,
      icon: Building,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Total Plots Inventory',
      value: stats?.totalProperties || 0,
      sublabel: `${stats?.availableProperties || 0} Available for Sale`,
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Total Enquiries & Leads',
      value: stats?.totalLeads || 0,
      sublabel: `${stats?.newLeads || 0} Awaiting First Contact`,
      icon: Users,
      color: 'bg-rose-50 text-brand-primary border-rose-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time project inventory overview and prospective lead pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryDark transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Plot</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
                <div className="text-3xl font-black font-heading text-slate-900 mt-1">{card.value}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">{card.sublabel}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Leads Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold font-heading text-slate-900 text-base">Recent Incoming Enquiries</h3>
            <p className="text-[11px] text-slate-500">Latest enquiries received from website & project pages.</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Lead / Contact</th>
                <th className="py-3 px-4">Interested Project</th>
                <th className="py-3 px-4">Message / Source</th>
                <th className="py-3 px-4">Received On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-5">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-700">{lead.phone}</span>
                        {lead.email && <span>• {lead.email}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {lead.project_name || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="line-clamp-1 text-slate-600">{lead.message || '—'}</div>
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
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
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100"
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
