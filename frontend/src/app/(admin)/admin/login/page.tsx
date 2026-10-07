'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-slate-950 text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Tagline */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="lg" isLight={true} />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Administrative Access & Lead Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Authentication</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">v2.0 Mobile-Ready</span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-mono"
                  placeholder="admin@sreeharirealty.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-black text-xs sm:text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Accounts for Rapid Mobile Testing */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Tap Mobile Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@sreeharirealty.com', 'AdminPassword@2026')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 text-left transition-all active:scale-95"
              >
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Super Admin
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@sreehari...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('agent@sreeharirealty.com', 'AgentPassword@2026')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 text-left transition-all active:scale-95"
              >
                <div className="font-bold text-blue-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Sales Agent
                </div>
                <div className="text-[10px] text-slate-400 truncate">agent@sreehari...</div>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Site link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors underline font-medium"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
