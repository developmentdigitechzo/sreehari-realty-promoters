'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const token = localStorage.getItem('sreehari_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primaryLight" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans antialiased text-slate-900 selection:bg-rose-500 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
