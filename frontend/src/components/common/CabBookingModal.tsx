'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  X,
  Car,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Loader2,
  Navigation,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';

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

  // Quick date calculations
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const getNextSaturday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  };
  const getNextSunday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (7 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  };

  // Form State
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDateOption, setSelectedDateOption] = useState<'today' | 'tomorrow' | 'saturday' | 'sunday' | 'custom'>('saturday');
  const [customDate, setCustomDate] = useState(getNextSaturday());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM');
  const [pickupHub, setPickupHub] = useState('Tambaram');
  const [customAddress, setCustomAddress] = useState('');
  const [passengers, setPassengers] = useState('3-4 Family');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sendWhatsAppUpdates, setSendWhatsAppUpdates] = useState(true);

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

    api.getProjects({ limit: 10 }).then((res) => {
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

  const handleDateOptionChange = (option: 'today' | 'tomorrow' | 'saturday' | 'sunday' | 'custom') => {
    setSelectedDateOption(option);
    if (option === 'today') setCustomDate(getTodayDate());
    else if (option === 'tomorrow') setCustomDate(getTomorrowDate());
    else if (option === 'saturday') setCustomDate(getNextSaturday());
    else if (option === 'sunday') setCustomDate(getNextSunday());
  };

  const getEffectiveDate = () => {
    if (selectedDateOption === 'today') return `Today (${getTodayDate()})`;
    if (selectedDateOption === 'tomorrow') return `Tomorrow (${getTomorrowDate()})`;
    if (selectedDateOption === 'saturday') return `Saturday (${getNextSaturday()})`;
    if (selectedDateOption === 'sunday') return `Sunday (${getNextSunday()})`;
    return customDate;
  };

  const popularHubs = [
    'Tambaram',
    'Velachery',
    'Guindy',
    'Airport',
    'Porur',
    'OMR',
    'Home Pick-up',
  ];

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

    const finalPickupLocation =
      pickupHub === 'Home Pick-up' || customAddress.trim()
        ? `${pickupHub} - ${customAddress.trim() || 'Doorstep address to be confirmed on call'}`
        : pickupHub;

    const formattedMessage = [
      `🚕 FREE CHAUFFEURED AC CAB SITE VISIT BOOKING`,
      `• Destination: ${selectedProject || 'Lotus Gated County'}`,
      `• Schedule: ${getEffectiveDate()} at ${selectedTimeSlot}`,
      `• Pick-up Location: ${finalPickupLocation}`,
      `• Passengers: ${passengers}`,
      `• WhatsApp Driver Alert: ${sendWhatsAppUpdates ? 'Yes' : 'No'}`,
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

  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 98765 43210';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 md:p-6 flex items-center justify-center min-h-screen animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[85vh]">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-[#0a483e] via-[#108474] to-[#0d594e] text-white px-4 sm:px-5 py-3.5 sm:py-4 shrink-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            aria-label="Close Cab Booking Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              100% Free VIP Doorstep Visit
            </span>
            <span className="text-[10px] font-bold text-emerald-200">• DTCP & CMDA Plots</span>
          </div>

          <h2 className="text-base sm:text-lg font-black font-heading tracking-tight text-white flex items-center gap-1.5">
            <Car className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Book Free Chauffeured AC Cab</span>
          </h2>
          <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5">
            Chauffeured AC sedan & guided layout tour with your family. Zero cost & zero obligation.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1">
          {submitted ? (
            /* Success State */
            <div className="text-center py-3 space-y-3 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-[#108474] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-[#108474] rounded-full text-[10px] font-black tracking-widest uppercase mb-1">
                  Confirmed • {bookingId}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  Your Free AC Cab is Scheduled!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Your chauffeur is assigned for{' '}
                  <strong className="text-[#108474]">{selectedProject}</strong>.
                </p>
              </div>

              {/* Reservation Pass Card */}
              <div className="bg-slate-50 border border-dashed border-[#108474]/30 rounded-xl p-3 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Layout</span>
                    <p className="font-black text-slate-900 text-xs">{selectedProject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Fare</span>
                    <p className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full text-[10px]">
                      ₹0 (Free)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Schedule</span>
                    <p className="font-bold text-slate-800">{getEffectiveDate()}</p>
                    <p className="font-semibold text-[#108474]">{selectedTimeSlot}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Pick-up</span>
                    <p className="font-bold text-slate-800 truncate">{pickupHub}</p>
                    <p className="text-slate-500">{passengers}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <a
                  href={getWhatsAppLink(
                    whatsappNum,
                    `Hello Sree Hari Realty, I just booked a Free AC Cab (Ref: ${bookingId}) for ${selectedProject} on ${getEffectiveDate()} at ${selectedTimeSlot}. Please share the driver details!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow transition-all active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Receive Driver Details on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Compact Booking Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Destination Project */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                  1. Layout to Visit
                </label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] appearance-none cursor-pointer transition-all shadow-sm"
                  >
                    {projectList.map((proj) => (
                      <option key={proj.id} value={proj.name}>
                        {proj.name} — {proj.location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. Date & Time Selection (Compact Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                    2. Preferred Date
                  </label>
                  <div className="grid grid-cols-4 gap-1 mb-1.5">
                    {[
                      { key: 'today', label: 'Today' },
                      { key: 'tomorrow', label: 'Tmrw' },
                      { key: 'saturday', label: 'Sat' },
                      { key: 'sunday', label: 'Sun' },
                    ].map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => handleDateOptionChange(d.key as any)}
                        className={`py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                          selectedDateOption === d.key
                            ? 'bg-[#108474] text-white border-[#108474]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <input
                      type="date"
                      min={getTodayDate()}
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setSelectedDateOption('custom');
                      }}
                      className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                    />
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                    3. Pick-up Time Slot
                  </label>
                  <div className="space-y-1">
                    {[
                      { time: '09:30 AM', label: 'Morning (09:30 AM)' },
                      { time: '02:00 PM', label: 'Afternoon (02:00 PM)' },
                      { time: '04:30 PM', label: 'Evening (04:30 PM)' },
                    ].map((t) => (
                      <button
                        key={t.time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(t.time)}
                        className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-[11px] font-bold transition-all flex items-center justify-between ${
                          selectedTimeSlot === t.time
                            ? 'border-[#108474] bg-[#f0fdfa] text-[#108474]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t.label}</span>
                        {selectedTimeSlot === t.time && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#108474]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Pick-up Area */}
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                  4. Pick-up Hub / Location
                </label>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {popularHubs.map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      onClick={() => setPickupHub(hub)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                        pickupHub === hub
                          ? 'bg-[#108474] text-white border-[#108474]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {hub}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter landmark or street (e.g. Near Tambaram Rly Station)"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                  />
                </div>
              </div>

              {/* 4. Contact Details & Passengers */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    5. Passengers & Contact
                  </label>
                  <div className="flex gap-1 text-[9px]">
                    {['1-2 Persons', '3-4 Family', '5+ Group'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPassengers(p)}
                        className={`px-1.5 py-0.5 rounded font-bold border transition-all ${
                          passengers === p
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                    />
                  </div>

                  <div className="flex">
                    <span className="inline-flex items-center px-2 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit Mobile *"
                      className="w-full px-2.5 py-1.5 rounded-r-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                    />
                  </div>
                </div>

                {/* WhatsApp toggle */}
                <div className="flex items-center gap-1.5 pt-1.5">
                  <input
                    type="checkbox"
                    id="cab-whatsapp-compact"
                    checked={sendWhatsAppUpdates}
                    onChange={(e) => setSendWhatsAppUpdates(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#108474] focus:ring-[#108474] accent-[#108474]"
                  />
                  <label htmlFor="cab-whatsapp-compact" className="text-[10px] text-slate-600 flex items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Send driver tracking & layout route map on WhatsApp</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-1 space-y-1.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-[#108474]/25 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scheduling Chauffeur...</span>
                    </>
                  ) : (
                    <>
                      <Car className="w-4 h-4" />
                      <span>Confirm Free AC Cab Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    100% Free • Zero Obligation
                  </span>
                  <a
                    href={getTelLink(companyPhone)}
                    className="text-[#108474] hover:text-[#0c6a5d] font-bold underline"
                  >
                    Need Urgent Cab? Call Us
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
