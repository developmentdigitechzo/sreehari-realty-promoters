'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BrandLogo } from '@/components/common/BrandLogo';
import { getTelLink } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@sreeharirealty.com';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const address =
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'No. 45, GST Main Road, Tambaram, Chennai, Tamil Nadu - 600045';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', subject: 'General Enquiry', message: '' });
      } else {
        setErrorMsg(res.message || 'Unable to submit enquiry at this time.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" />
          </div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight mt-2">
            Contact Sree Hari Realty Promoters
          </h1>
          <p className="text-sm text-slate-600 mt-3">
            Have questions about plot availability, site visits, or legal title copies? Our real estate specialists are
            ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-xl font-bold font-heading text-slate-900">Corporate Office</h3>

              <div className="space-y-5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Office Address</div>
                    <p className="mt-1 leading-relaxed text-slate-600">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Telephone / Mobile</div>
                    <a href={getTelLink(phone)} className="mt-1 block text-brand-primary font-semibold hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Enquiries</div>
                    <a href={`mailto:${email}`} className="mt-1 block text-slate-700 hover:underline">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Office Working Hours</div>
                    <p className="mt-1 text-slate-600">Monday – Sunday: 9:00 AM – 7:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-slate-100">
                <WhatsAppButton
                  label="Instant WhatsApp Chat"
                  message="Hi Sree Hari Realty, I have a query regarding your plot developments."
                  className="w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-1">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and our client manager will respond within 30 minutes.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-1 mb-4">
                    Thank you for reaching out. We have logged your enquiry and our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-800 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Free Site Visit Booking">Free Site Visit Booking</option>
                        <option value="Plot Availability Check">Plot Availability Check</option>
                        <option value="Bank Loan & Registration">Bank Loan & Registration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your enquiry, preferred location, or questions..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
