'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@sreeharirealty.com');
  const [password, setPassword] = useState('AdminPassword@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem('sreehari_admin_token', res.data.token);
        localStorage.setItem('sreehari_admin_user', JSON.stringify(res.data.user));
        router.push('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError('Unable to reach server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-950 text-white">
      <div className="w-full max-w-md">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <BrandLogo size="lg" isLight={true} />
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Administrative Access & Lead Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-6 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Authentication</span>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Seed helper info */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Default Development Admin: <br />
              <span className="text-slate-400 font-mono">admin@sreeharirealty.com</span> /{' '}
              <span className="text-slate-400 font-mono">AdminPassword@2026</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
