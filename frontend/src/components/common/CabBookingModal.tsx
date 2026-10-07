'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  X,
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Loader2,
  Navigation,
  Coffee,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';
import { BrandLogo } from './BrandLogo';

interface CabBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  location?: string;
}

export const CabBookingModal: React.FC<CabBookingModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  location,
}) => {
  const pathname = usePathname();

  // Core project listings
  const [projectList, setProjectList] = useState<Array<{ id: string; name: string; location: string }>>([
    { id: '1', name: 'Lotus Gated County', location: 'Tambaram - Padappai Road' },
    { id: '2', name: 'Sri Hari Green Enclave', location: 'Tambaram West' },
    { id: '3', name: 'Emerald Enclave', location: 'Guduvanchery' },
    { id: '4', name: 'Royal Palm Groves', location: 'Vandalur' },
    { id: '5', name: 'Green Meadows Farmland', location: 'Chengalpattu' },
    { id: 'all', name: 'Explore All Layouts (Guided Multi-Site Tour)', location: 'Chennai Suburbs' },
  ]);

  // Form State
  const [selectedProject, setSelectedProject] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM (Morning)');
  const [pickupLocation, setPickupLocation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passengers, setPassengers] = useState('2-4 Members');

  // Submission State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-detect project from prop or URL
  useEffect(() => {
    let activeName = projectName;

    if (!activeName && pathname && pathname.startsWith('/projects/')) {
      const slug = pathname.replace('/projects/', '').replace(/\/$/, '');
      if (slug) {
        activeName = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    api.getProjects({}).then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const dbList = res.data.map((p) => ({
          id: p.id,
          name: p.name,
          location: p.location || p.city || 'Chennai',
        }));

        if (activeName && !dbList.some((p) => p.name.toLowerCase() === activeName!.toLowerCase())) {
          dbList.unshift({ id: 'custom', name: activeName, location: location || 'Prime Location' });
        }
        dbList.push({ id: 'all', name: 'Explore All Layouts (Guided Multi-Site Tour)', location: 'Chennai Suburbs' });
        setProjectList(dbList);
      }
    }).catch(() => {});

    if (activeName) {
      setSelectedProject(activeName);
    } else {
      setSelectedProject('Lotus Gated County');
    }
  }, [projectName, pathname, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim() || !cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter your full name and a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    const formattedMessage = [
      `🚕 FREE CHAUFFEURED AC CAB SITE VISIT BOOKING`,
      `• Destination Layout: ${selectedProject || 'Lotus Gated County'}`,
      `• Preferred Date: ${preferredDate}`,
      `• Preferred Time: ${preferredTime}`,
      `• Pick-up Location: ${pickupLocation.trim() || 'Doorstep Pickup (Coordinate on call)'}`,
      `• Passengers: ${passengers}`,
    ].join('\n');

    try {
      const res = await api.submitLead({
        name: name.trim(),
        phone: cleanPhone,
        project_id: projectId,
        source: projectId ? 'PROJECT_PAGE' : 'WEBSITE_FORM',
        message: formattedMessage,
      });

      if (res.success) {
        const randomRef = 'SHR-CAB-' + Math.floor(1000 + Math.random() * 9000);
        setBookingId(randomRef);
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Unable to schedule cab right now. Please call our hotline.');
      }
    } catch (err: any) {
      setErrorMsg('Network issue. Please call our dispatch desk directly.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918939540008';
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center min-h-screen animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          {/* Left Visual Sidebar (Desktop) */}
          <div className="md:col-span-5 bg-[#108474] text-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                100% Free VIP Service
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-heading text-white leading-tight mb-2">
                Book Free AC Cab Site Visit
              </h3>

              <p className="text-xs text-emerald-100 leading-relaxed font-medium mb-6">
                Travel in luxury with your family to inspect our DTCP & CMDA approved gated community layouts with clear parent titles.
              </p>

              {/* 4 Feature Items */}
              <div className="space-y-3.5 text-xs font-semibold text-white/95">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-emerald-200">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span>Doorstep Pick-Up & Drop</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-emerald-200">
                    <Car className="w-4 h-4" />
                  </div>
                  <span>Sanitized Chauffeured AC Sedan</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-emerald-200">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span>Guided Legal & Layout Tour</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-emerald-200">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <span>Welcome Kit & Refreshments</span>
                </div>
              </div>
            </div>

            {/* Helpline at bottom */}
            <div className="pt-6 border-t border-white/20 mt-6 text-[11px] text-emerald-100">
              <span className="block font-medium">Direct Cab Hotline:</span>
              <a href={getTelLink(companyPhone)} className="text-sm font-black text-amber-300 hover:underline">
                {companyPhone}
              </a>
            </div>
          </div>

          {/* Right Neat Form (Spacious & Clean) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {submitted ? (
              /* Neat Success State */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-[#108474] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-[#108474] rounded-full text-xs font-black tracking-widest uppercase mb-1.5">
                    Booking Confirmed • {bookingId}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    Free AC Cab Scheduled!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Thank you, <strong className="text-slate-900">{name}</strong>. Our site coordinator will call you to confirm chauffeur pickup for <strong className="text-[#108474]">{selectedProject}</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Layout:</span>
                    <span className="font-bold text-slate-900">{selectedProject}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Date & Slot:</span>
                    <span className="font-bold text-slate-900">{preferredDate} • {preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fare:</span>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      ₹0 (100% Free)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={getWhatsAppLink(
                      whatsappNum,
                      `Hello Sree Hari Realty, I booked a Free AC Cab (Ref: ${bookingId}) for ${selectedProject} on ${preferredDate} at ${preferredTime}. Please share driver details!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Get Driver Details on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Neat Standard Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900 font-heading">
                    Schedule Your Visit
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your details to arrange doorstep AC cab pickup.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] transition-all"
                    />
                  </div>
                </div>

                {/* 2. Mobile Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] transition-all"
                    />
                  </div>
                </div>

                {/* 3. Project / Layout to Visit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Layout to Visit
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] appearance-none cursor-pointer transition-all"
                    >
                      {projectList.map((proj) => (
                        <option key={proj.id} value={proj.name}>
                          {proj.name} ({proj.location})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Pick-up Landmark / Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pick-up Area / Landmark
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Tambaram / Velachery / Home address"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] transition-all"
                    />
                  </div>
                </div>

                {/* 5. Date & Time Slot in 2 Equal Columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="date"
                        min={todayStr}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Time Slot
                    </label>
                    <div className="relative">
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] appearance-none cursor-pointer"
                      >
                        <option value="10:00 AM (Morning)">10:00 AM (Morning)</option>
                        <option value="02:00 PM (Afternoon)">02:00 PM (Afternoon)</option>
                        <option value="04:30 PM (Evening)">04:30 PM (Evening)</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#108474]/25 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Booking...</span>
                      </>
                    ) : (
                      <>
                        <Car className="w-4 h-4" />
                        <span>Confirm Free AC Cab Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Free Doorstep Cab • Zero Obligation</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
