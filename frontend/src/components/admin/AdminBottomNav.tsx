'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Layers,
  Users,
} from 'lucide-react';

interface AdminBottomNavProps {
  newLeadsCount?: number;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ newLeadsCount = 0 }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: Building },
    { label: 'Plots', href: '/admin/properties', icon: Layers },
    { label: 'Leads', href: '/admin/leads', icon: Users, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
  ];

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-4 gap-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'bg-brand-primary/20 text-brand-primaryLight font-black border border-brand-primary/30'
                  : 'text-slate-400 hover:text-slate-200 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-brand-primaryLight' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-white font-extrabold' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-primaryLight" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
