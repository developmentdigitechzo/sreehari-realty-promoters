'use client';

import React, { useState } from 'react';
import { X, Download, CheckCircle2, Loader2, Sparkles, FileText, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { BrandLogo } from './BrandLogo';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectId?: string;
  brochureUrl?: string;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectId,
  brochureUrl,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        project_id: projectId,
        source: 'PROJECT_PAGE',
        message: `Requested Brochure & Layout Plan for "${projectName}"`,
      });

      if (res.success) {
        setSubmitted(true);
        // If brochure URL exists, trigger download or open in new tab
        if (brochureUrl) {
          window.open(brochureUrl, '_blank');
        }
      } else {
        setErrorMsg(res.message || 'Failed to process request. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-amber-900/15 p-6 sm:p-9 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
          aria-label="Close Brochure Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest & Subtitle */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
              SREE HARI REALTY PROMOTERS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading uppercase tracking-tight text-amber-900">
            DOWNLOAD THE PROJECT BROCHURE
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Get a detailed overview of <span className="font-bold text-slate-900">{projectName}</span>, including DTCP approval copies, plot dimensions, price breakup, and location advantages.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-emerald-200 shadow-sm space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900">Brochure Download Ready!</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              We have generated your layout brochure for <span className="font-bold text-slate-900">{projectName}</span>. A copy has also been sent to your WhatsApp number.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* 3-Column Luxury Inputs matching Reference Image 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name*"
                  className="w-full px-3.5 py-3 rounded-xl border border-amber-900/20 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm font-medium"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number*"
                  className="w-full px-3.5 py-3 rounded-xl border border-amber-900/20 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm font-medium font-mono"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email id"
                  className="w-full px-3.5 py-3 rounded-xl border border-amber-900/20 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Centered Submit Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Brochure...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 pt-1 font-medium">
              🔒 100% Privacy Protected • Instant Layout PDF & DTCP Approval Copy
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
