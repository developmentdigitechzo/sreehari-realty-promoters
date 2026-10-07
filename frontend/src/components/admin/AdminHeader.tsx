'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, Menu, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AdminMobileDrawer } from './AdminMobileDrawer';

export const AdminHeader: React.FC = () => {
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('sreehari_admin_user');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 py-3 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left Side: Brand on Mobile, Title on Desktop */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <BrandLogo size="sm" isLight={false} />
          </div>
          <div className="hidden md:block">
            <h2 className="text-base font-extrabold font-heading text-slate-900">
              Admin Management Console
            </h2>
            <p className="text-[11px] text-slate-500">Sree Hari Realty Promoters Plot ERP</p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Public Website Shortcut Button */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* User Profile Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-50 sm:border sm:border-slate-200/90 hover:bg-slate-100 transition-all active:scale-95 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{adminUser?.name || 'Admin'}</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300">
                  {adminUser?.role || 'SUPER_ADMIN'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 max-w-[140px] truncate">{adminUser?.email || 'admin@sreeharirealty.com'}</div>
            </div>
            <Menu className="w-4 h-4 text-slate-600 md:hidden ml-1" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AdminMobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={adminUser}
      />
    </>
  );
};
