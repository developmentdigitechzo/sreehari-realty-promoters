'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Layers,
  Users,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: Building },
    { label: 'Plots / Properties', href: '/admin/properties', icon: Layers },
    { label: 'Leads & Enquiries', href: '/admin/leads', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sreehari_admin_token');
    localStorage.removeItem('sreehari_admin_user');
    router.push('/admin/login');
  };

  return (
    <aside className="hidden md:flex w-64 bg-slate-950 text-slate-300 flex-col justify-between border-r border-slate-800 min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Logo Bar */}
        <div className="p-6 border-b border-slate-800">
          <BrandLogo size="sm" isLight={true} />
          <div className="mt-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded inline-block">
            Admin Control Panel
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
