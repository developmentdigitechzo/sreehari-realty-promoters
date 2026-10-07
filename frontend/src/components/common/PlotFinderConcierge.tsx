'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  MapPin,
  Building,
  Car,
  CheckCircle2,
  Phone,
  MessageCircle,
  Minimize2,
  Maximize2,
  Layers,
  Trees,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  chips?: { label: string; action: () => void }[];
  projectCard?: {
    name: string;
    location: string;
    price: string;
    slug: string;
  };
}

export const PlotFinderConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phoneStep, setPhoneStep] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 89395 40008';
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  useEffect(() => {
    if (messages.length === 0) {
      initChat();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const initChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Vanakkam! 🙏 Welcome to Sree Hari Realty Promoters. We develop 100% DTCP & CMDA approved gated villa layouts across Chennai and Tamil Nadu.',
      },
      {
        sender: 'bot',
        text: 'Please select your preferred location to explore verified plots:',
        chips: [
          { label: '📍 Tambaram West', action: () => handleLocationSelect('Tambaram West') },
          { label: '📍 Guduvanchery', action: () => handleLocationSelect('Guduvanchery') },
          { label: '📍 Chengalpattu', action: () => handleLocationSelect('Chengalpattu') },
          { label: '📍 OMR / Thiruporur', action: () => handleLocationSelect('OMR') },
          { label: '✨ View All Plots', action: () => handleLocationSelect('All') },
        ],
      },
    ]);
  };

  const handleLocationSelect = (loc: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `I am interested in ${loc}` },
      {
        sender: 'bot',
        text: `Great choice! What is your comfortable investment or budget range for ${loc}?`,
        chips: [
          { label: '💰 Less than ₹25 Lakhs', action: () => handleBudgetSelect('Under ₹25L') },
          { label: '💰 ₹25L – ₹50 Lakhs', action: () => handleBudgetSelect('₹25L – ₹50L') },
          { label: '💰 ₹50L – ₹75 Lakhs', action: () => handleBudgetSelect('₹50L – ₹75L') },
          { label: '💎 Above ₹75 Lakhs', action: () => handleBudgetSelect('Above ₹75L') },
        ],
      },
    ]);
  };

  const handleBudgetSelect = (budget: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `My budget is ${budget}` },
      {
        sender: 'bot',
        text: 'Here are prime DTCP-approved layouts matching your criteria:',
        projectCard: {
          name: 'Sri Hari Green Enclave',
          location: 'Tambaram West, Chennai (Near 400ft ORR)',
          price: '₹32.40 Lakhs - ₹78 Lakhs (1200 - 2400 sq.ft)',
          slug: 'sri-hari-green-enclave',
        },
      },
      {
        sender: 'bot',
        text: 'Would you like to schedule a free chauffeured AC cab site visit or receive the master layout PDF?',
        chips: [
          {
            label: '🚗 Book Free AC Cab Site Visit',
            action: () => handleActionSelect('Book AC Cab Site Visit'),
          },
          {
            label: '💬 WhatsApp Price Sheet',
            action: () => handleActionSelect('WhatsApp Price Sheet'),
          },
          {
            label: '📞 Talk to Senior Advisor',
            action: () => handleActionSelect('Talk to Senior Advisor'),
          },
        ],
      },
    ]);
  };

  const handleActionSelect = (actionType: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: actionType },
      {
        sender: 'bot',
        text: 'Please enter your mobile number below so our senior site manager can coordinate your free cab visit and share the layout copy:',
      },
    ]);
    setPhoneStep(true);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;

    try {
      await api.submitLead({
        name: 'Concierge Assistant Visitor',
        phone: userPhone.trim(),
        source: 'WEBSITE_FORM',
        message: 'Lead captured via Smart Plot Finder Concierge Bot',
      });
    } catch (err) {}

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userPhone },
      {
        sender: 'bot',
        text: 'Thank you! 🎉 Our layout supervisor has received your request. We will contact you shortly. You can also connect immediately on WhatsApp below:',
        chips: [
          {
            label: 'Open WhatsApp Chat Now',
            action: () => {
              window.open(
                getWhatsAppLink(whatsappNum, `Hi Sree Hari Realty, I submitted my enquiry (${userPhone}) via the plot finder bot.`),
                '_blank'
              );
            },
          },
        ],
      },
    ]);
    setUserPhone('');
    setPhoneStep(false);
  };

  const handleCustomTextSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const lower = userText.toLowerCase();
    let reply =
      'Thank you for reaching out! Sree Hari Realty offers 100% DTCP & CMDA approved gated community villa plots with clear parent deeds, ready potable water, and up to 80% bank loans (SBI, HDFC, ICICI). Would you like to schedule a free doorstep AC cab site visit this weekend?';

    if (lower.includes('loan') || lower.includes('bank') || lower.includes('emi')) {
      reply =
        'Yes! All our projects have pre-approved bank loans up to 80% from State Bank of India (SBI), HDFC Bank, ICICI, and Axis Bank with attractive interest rates and fast processing.';
    } else if (lower.includes('tambaram') || lower.includes('green enclave')) {
      reply =
        'Sri Hari Green Enclave at Tambaram West is an exclusive 12-acre gated layout just 7 mins from Tambaram Railway Station and 3 mins to 400ft Outer Ring Road. Plots start from ₹32.40 Lakhs with 100% clear titles.';
    } else if (lower.includes('guduvanchery') || lower.includes('lotus')) {
      reply =
        'Lotus Gated County at Guduvanchery is an 18-acre landmark community near SRM University on GST Road, featuring 210 plots with 40ft paver roads and grand entrance arch.';
    } else if (lower.includes('chengalpattu') || lower.includes('emerald')) {
      reply =
        'Sri Hari Emerald Meadows at Chengalpattu Highway features 25 acres of eco-luxury villa plots and farmlands starting at ₹18 Lakhs.';
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'bot',
        text: reply,
        chips: [
          {
            label: '🚗 Book Free AC Cab Site Visit',
            action: () => handleActionSelect('Book AC Cab Site Visit'),
          },
          {
            label: '💬 WhatsApp Layout Plan',
            action: () => {
              window.open(
                getWhatsAppLink(whatsappNum, `Hi Sree Hari Realty, I am asking about: ${userText}`),
                '_blank'
              );
            },
          },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Concierge Launcher Icon */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#0c6a5d] via-[#108474] to-[#149b88] hover:opacity-95 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 active:scale-95 animate-pulse-glow"
            aria-label="Open Sree Hari Plot Finder Concierge"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-emerald-200 animate-bounce" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#e52e3d] rounded-full border-2 border-white animate-ping" />
              )}
            </div>
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider text-white">
              Plot Finder Concierge
            </span>
            <span className="text-[10px] bg-white text-[#108474] font-extrabold px-2 py-0.5 rounded-full hidden lg:inline shadow-sm">
              Online
            </span>
          </button>
        </div>
      )}

      {/* Floating Concierge Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[85vh] h-[540px] bg-white rounded-3xl shadow-2xl border border-[#108474]/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-slate-900">
          {/* Header Bar */}
          <div className="bg-[#071c19] text-white p-4 flex items-center justify-between border-b border-[#108474]/30 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#108474]/25 border border-[#108474]/40 text-emerald-300 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>Sree Hari Property Advisor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-emerald-300 font-medium">
                  DTCP Approved Gated Plots Advisor
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0fdfa]/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#108474] text-white rounded-tr-none font-semibold shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Project Card Preview (if attached) */}
                {msg.projectCard && (
                  <div className="w-full bg-white rounded-2xl p-3.5 border border-[#108474]/30 shadow-md space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase bg-[#f0fdfa] text-[#108474] border border-[#108474]/20 px-2 py-0.5 rounded-md">
                        DTCP Approved
                      </span>
                      <span className="text-xs font-black text-[#108474]">{msg.projectCard.price.split('(')[0]}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{msg.projectCard.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#108474] shrink-0" />
                      <span>{msg.projectCard.location}</span>
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/projects/${msg.projectCard.slug}`}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] text-white text-[11px] font-bold text-center transition-all active:scale-95"
                      >
                        Explore Layout
                      </Link>
                      <a
                        href={getWhatsAppLink(whatsappNum, `Hi Sree Hari Realty, send me layout map for ${msg.projectCard.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Clickable Quick Response Chips */}
                {msg.chips && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={chip.action}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0fdfa] text-slate-800 hover:text-[#108474] hover:border-[#108474]/40 font-bold text-[11px] border border-slate-200/90 shadow-sm transition-all active:scale-95 text-left"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Phone Lead Capture Input */}
          {phoneStep && (
            <form onSubmit={handlePhoneSubmit} className="p-3 bg-[#f0fdfa] border-t border-[#108474]/20 flex gap-2">
              <input
                type="tel"
                required
                autoFocus
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter 10-digit phone number..."
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#108474]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#108474] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#108474] hover:bg-[#0c6a5d] text-white text-xs font-bold rounded-xl active:scale-95 shrink-0"
              >
                Submit
              </button>
            </form>
          )}

          {/* Bottom Chat Input Bar */}
          <form onSubmit={handleCustomTextSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about plots, loans, or locations..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#108474] focus:bg-white text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#108474] hover:bg-[#0c6a5d] disabled:opacity-40 text-white transition-all active:scale-95 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
