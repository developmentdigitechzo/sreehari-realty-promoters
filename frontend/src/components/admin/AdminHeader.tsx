'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Bell } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

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
    <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-base font-bold font-heading text-slate-800">
          Management Console
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {adminUser?.name || 'Sree Hari Admin'}
            </div>
            <div className="text-[10px] text-slate-500">{adminUser?.email || 'admin@sreeharirealty.com'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
