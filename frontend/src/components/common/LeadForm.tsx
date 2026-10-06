'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface LeadFormProps {
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  propertyTitle?: string;
  source?: 'WEBSITE_FORM' | 'PROJECT_PAGE' | 'PROPERTY_PAGE' | 'WHATSAPP_CLICK' | 'DIRECT_CALL';
  title?: string;
  subtitle?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  projectId,
  projectName,
  propertyId,
  propertyTitle,
  source = 'WEBSITE_FORM',
  title = 'Schedule a Free Site Visit',
  subtitle = 'Get price sheet, layout maps, and clear title documentation directly on WhatsApp & Email.',
  buttonText = 'Get Instant Details',
  className = '',
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your full name and valid phone number.');
      setLoading(false);
      return;
    }

    try {
      let customMessage = formData.message.trim();
      if (!customMessage) {
        if (propertyTitle) {
          customMessage = `Enquiry for Plot: ${propertyTitle}`;
        } else if (projectName) {
          customMessage = `Enquiry for Project: ${projectName}`;
        } else {
          customMessage = 'General Site Visit & Price Enquiry';
        }
      }

      const res = await api.submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        project_id: projectId,
        property_id: propertyId,
        source,
        message: customMessage,
      });

      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Unable to submit enquiry. Please try again or call us.');
      }
    } catch (err: any) {
      setErrorMsg('A network error occurred. Please check your connection or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-900 ${className}`}>
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="text-xl font-bold font-heading mb-1 text-emerald-950">Thank You!</h4>
        <p className="text-sm text-emerald-700 mb-4">
          Your enquiry for {projectName ? `"${projectName}"` : 'Sree Hari Realty plots'} has been received. Our dedicated sales manager will call you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 ${className}`}>
      {title && <h3 className="text-xl md:text-2xl font-bold font-heading text-slate-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-900 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium">
              +91
            </span>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="98765 43210"
              className="w-full px-4 py-3 rounded-r-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-900 text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ramesh@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-900 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Message / Requirements <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Looking for 1200 sqft East facing plot / weekend site visit..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-900 text-sm transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Details...</span>
            </>
          ) : (
            <>
              <span>{buttonText}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-600 mt-2">
          🔒 100% Privacy Guaranteed. No spam. Direct call from Sree Hari Realty team.
        </p>
      </form>
    </div>
  );
};
