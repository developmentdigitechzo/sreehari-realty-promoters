'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  X,
  LayoutDashboard,
  Building,
  Layers,
  Users,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Globe,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AdminMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; role?: string } | null;
}

export const AdminMobileDrawer: React.FC<AdminMobileDrawerProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('sreehari_admin_token');
    localStorage.removeItem('sreehari_admin_user');
    onClose();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects Management', href: '/admin/projects', icon: Building },
    { label: 'Plot Availability Grid', href: '/admin/properties', icon: Layers },
    { label: 'Leads CRM & Enquiries', href: '/admin/leads', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-slate-950 text-white h-full flex flex-col justify-between shadow-2xl border-l border-slate-800 p-5 z-10 animate-in slide-in-from-right duration-250">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <BrandLogo size="sm" isLight={true} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primaryDark text-white flex items-center justify-center font-bold font-heading text-sm shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@sreeharirealty.com'}</div>
                <div className="mt-1">
                  <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-amber-500/30">
                    {user?.role || 'SUPER_ADMIN'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-1 mt-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-800/80">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs font-bold active:scale-95 transition-transform"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
