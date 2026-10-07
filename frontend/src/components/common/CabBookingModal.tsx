'use client';

import React, { useState, useEffect } from 'react';
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
  Coffee,
  FileCheck,
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
  // Popular default projects
  const availableProjects = [
    { id: '1', name: 'Sree Hari Grand City', location: 'Tambaram West' },
    { id: '2', name: 'Emerald Enclave', location: 'Guduvanchery' },
    { id: '3', name: 'Royal Palm Groves', location: 'Vandalur' },
    { id: '4', name: 'Green Meadows Farmland', location: 'Chengalpattu' },
    { id: 'all', name: 'Guided Multi-Site Tour (All Ongoing Projects)', location: 'Chennai Suburbs' },
  ];

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
  const [selectedProject, setSelectedProject] = useState(projectName || availableProjects[0].name);
  const [selectedDateOption, setSelectedDateOption] = useState<'today' | 'tomorrow' | 'saturday' | 'sunday' | 'custom'>('saturday');
  const [customDate, setCustomDate] = useState(getNextSaturday());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM');
  const [pickupHub, setPickupHub] = useState('Tambaram');
  const [customAddress, setCustomAddress] = useState('');
  const [passengers, setPassengers] = useState('3-4 Family Members');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [sendWhatsAppUpdates, setSendWhatsAppUpdates] = useState(true);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projectName) {
      setSelectedProject(projectName);
    }
  }, [projectName]);

  // Sync date when preset changes
  const handleDateOptionChange = (option: 'today' | 'tomorrow' | 'saturday' | 'sunday' | 'custom') => {
    setSelectedDateOption(option);
    if (option === 'today') setCustomDate(getTodayDate());
    else if (option === 'tomorrow') setCustomDate(getTomorrowDate());
    else if (option === 'saturday') setCustomDate(getNextSaturday());
    else if (option === 'sunday') setCustomDate(getNextSunday());
  };

  const getEffectiveDate = () => {
    if (selectedDateOption === 'today') return 'Today (' + getTodayDate() + ')';
    if (selectedDateOption === 'tomorrow') return 'Tomorrow (' + getTomorrowDate() + ')';
    if (selectedDateOption === 'saturday') return 'This Saturday (' + getNextSaturday() + ')';
    if (selectedDateOption === 'sunday') return 'This Sunday (' + getNextSunday() + ')';
    return customDate;
  };

  const popularHubs = [
    'Tambaram',
    'Velachery',
    'Guindy',
    'Airport / Pallavaram',
    'Porur',
    'Chromepet',
    'OMR / Sholinganallur',
    'Doorstep Home Pick-up',
  ];

  const timeSlots = [
    {
      time: '09:30 AM',
      period: 'Morning Tour',
      desc: 'Clear morning sunlight & fresh layout breeze',
      badge: 'Popular',
    },
    {
      time: '02:00 PM',
      period: 'Afternoon Tour',
      desc: 'Relaxed post-lunch visit with site consultant',
      badge: 'Available',
    },
    {
      time: '04:30 PM',
      period: 'Evening Golden Hour',
      desc: 'Pleasant evening ambience & clubhouse view',
      badge: 'High Demand',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!name.trim() || !phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter your full name and a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    const finalPickupLocation =
      pickupHub === 'Doorstep Home Pick-up' || customAddress.trim()
        ? `${pickupHub} - ${customAddress.trim() || 'Exact address to be coordinated on call'}`
        : pickupHub;

    const formattedMessage = [
      `🚕 FREE CHAUFFEURED AC CAB SITE VISIT BOOKING`,
      `• Destination Layout: ${selectedProject}`,
      `• Preferred Date: ${getEffectiveDate()}`,
      `• Time Slot: ${selectedTimeSlot}`,
      `• Pick-up Location: ${finalPickupLocation}`,
      `• Passenger Count: ${passengers}`,
      `• WhatsApp Updates: ${sendWhatsAppUpdates ? 'Enabled' : 'No'}`,
      specialRequest.trim() ? `• Special Notes: ${specialRequest.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await api.submitLead({
        name: name.trim(),
        phone: phone.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-[#0a4a40] via-[#108474] to-[#07362f] text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle Background Glow & Car Pattern */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-2 right-16 opacity-10 pointer-events-none">
            <Car className="w-36 h-36" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            aria-label="Close Cab Booking Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>VIP Chauffeur Service • 100% Free Doorstep Visit</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading tracking-tight text-white leading-tight">
            Book Your Free Chauffeured AC Cab
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg font-medium">
            Travel in luxury with your family to inspect our DTCP & RERA approved gated community layouts. Zero cost & zero obligation.
          </p>

          {/* 4 Feature Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/15 text-[11px] font-bold text-white/95">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <Navigation className="w-3 h-3" />
              </div>
              <span>Doorstep Pick & Drop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <Car className="w-3 h-3" />
              </div>
              <span>Sanitized AC Sedan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <FileCheck className="w-3 h-3" />
              </div>
              <span>Legal Expert Tour</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <Coffee className="w-3 h-3" />
              </div>
              <span>Refreshments Kit</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 md:p-7 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            /* Success State */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-[#108474] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-[#108474] rounded-full text-xs font-black tracking-widest uppercase mb-2">
                  Booking Confirmed • {bookingId}
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-heading">
                  Your Free AC Cab is Scheduled!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{name}</span>. Our fleet coordinator is assigning your chauffeur for{' '}
                  <span className="font-bold text-[#108474]">{selectedProject}</span>.
                </p>
              </div>

              {/* Reservation Boarding Pass Card */}
              <div className="bg-slate-50 border-2 border-dashed border-[#108474]/30 rounded-2xl p-4 sm:p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Destination</span>
                    <p className="text-sm font-black text-slate-900">{selectedProject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass Type</span>
                    <p className="text-xs font-bold text-[#108474]">VIP Chauffeured Pass</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Date & Slot</span>
                    <p className="font-bold text-slate-800">{getEffectiveDate()}</p>
                    <p className="text-[11px] font-semibold text-[#108474]">{selectedTimeSlot}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Pick-up Point</span>
                    <p className="font-bold text-slate-800 truncate">{pickupHub}</p>
                    <p className="text-[11px] text-slate-500">{passengers}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>Cab Fare & Tolls</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-black">
                    ₹0 (100% Complimentary)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppLink(
                    whatsappNum,
                    `Hello Sree Hari Realty, I just booked a Free AC Cab (Ref: ${bookingId}) for ${selectedProject} on ${getEffectiveDate()} at ${selectedTimeSlot}. Please share the driver details!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Receive Driver Details on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Destination Project Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>1. Select Layout to Visit</span>
                  <span className="text-[10px] font-bold text-[#108474] lowercase tracking-normal">
                    DTCP / CMDA Approved
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] appearance-none cursor-pointer transition-all shadow-sm"
                  >
                    {availableProjects.map((proj) => (
                      <option key={proj.id} value={proj.name}>
                        {proj.name} — {proj.location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. Date Selection with Quick Chips */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  2. Choose Preferred Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleDateOptionChange('today')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      selectedDateOption === 'today'
                        ? 'bg-[#108474] text-white border-[#108474] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateOptionChange('tomorrow')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      selectedDateOption === 'tomorrow'
                        ? 'bg-[#108474] text-white border-[#108474] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateOptionChange('saturday')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center relative ${
                      selectedDateOption === 'saturday'
                        ? 'bg-[#108474] text-white border-[#108474] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Saturday
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full">
                      Hot
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateOptionChange('sunday')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center relative ${
                      selectedDateOption === 'sunday'
                        ? 'bg-[#108474] text-white border-[#108474] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Sunday
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full">
                      Hot
                    </span>
                  </button>
                </div>

                {/* Date Input for Custom */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      min={getTodayDate()}
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setSelectedDateOption('custom');
                      }}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    Selected: <strong className="text-slate-800">{getEffectiveDate()}</strong>
                  </span>
                </div>
              </div>

              {/* 3. Time Slot Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  3. Select Chauffeur Pick-up Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-[#108474] bg-[#f0fdfa] ring-2 ring-[#108474]/20 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900">{slot.time}</span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-[#108474] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {slot.badge}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700">{slot.period}</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{slot.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Pick-up Point / Location */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  4. Your Pick-up Area / Hub
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {popularHubs.map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      onClick={() => setPickupHub(hub)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
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
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter landmark, apartment name, or street (e.g. Near Tambaram Rly Station)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                  />
                </div>
              </div>

              {/* 5. Passenger Count & Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    5. Passengers & Contact
                  </label>
                  <div className="flex gap-1.5 text-[11px]">
                    {['1-2 Persons', '3-4 Family Members', '5+ Group (SUV)'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPassengers(p)}
                        className={`px-2 py-0.5 rounded-lg font-bold border transition-all ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      WhatsApp / Mobile <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 rounded-r-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474]"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="cab-whatsapp-consent"
                    checked={sendWhatsAppUpdates}
                    onChange={(e) => setSendWhatsAppUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-[#108474] focus:ring-[#108474] accent-[#108474]"
                  />
                  <label htmlFor="cab-whatsapp-consent" className="text-[11px] font-medium text-slate-600 flex items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Send driver phone number & live vehicle tracker on WhatsApp</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA & Direct Desk Call */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-[#108474] hover:bg-[#0c6a5d] text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#108474]/30 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Scheduling Your Chauffeur...</span>
                    </>
                  ) : (
                    <>
                      <Car className="w-5 h-5 animate-pulse" />
                      <span>Confirm Free AC Cab Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium px-1 gap-1">
                  <span className="flex items-center gap-1 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    100% Free • Zero Obligation • Sanitized AC Cabs
                  </span>
                  <a
                    href={getTelLink(companyPhone)}
                    className="text-[#108474] hover:text-[#0c6a5d] font-bold underline underline-offset-2"
                  >
                    Need Urgent Cab? Call {companyPhone}
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
