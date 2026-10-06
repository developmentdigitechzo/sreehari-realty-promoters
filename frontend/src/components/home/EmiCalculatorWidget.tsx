'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { EnquiryModal } from '../common/EnquiryModal';

export const EmiCalculatorWidget: React.FC = () => {
  const [areaSqft, setAreaSqft] = useState<number>(1200);
  const [ratePerSqft, setRatePerSqft] = useState<number>(2800);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Interest rate assumption for plot loans: ~8.65%
  const annualInterestRate = 8.65;

  const totalPlotCost = areaSqft * ratePerSqft;
  const downPaymentAmount = (totalPlotCost * downPaymentPct) / 100;
  const loanAmount = totalPlotCost - downPaymentAmount;

  // Monthly EMI calculation formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = annualInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const monthlyEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Plot EMI & Budget Estimator</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-slate-900">
              Calculate Your Monthly Investment
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize plot dimensions and calculate realistic bank loan EMIs with leading partner banks (SBI, HDFC, ICICI).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold self-start md:self-auto">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Up to 80% Bank Loan Approved</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Area (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Plot Area Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider">Plot Extent</span>
                <span className="text-sm font-black text-brand-primary font-heading px-3 py-1 bg-rose-50 rounded-lg border border-rose-100">
                  {areaSqft.toLocaleString()} Sq.Ft
                </span>
              </div>
              <input
                type="range"
                min="600"
                max="3000"
                step="50"
                value={areaSqft}
                onChange={(e) => setAreaSqft(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>600 sqft (Compact)</span>
                <span>1200 sqft (Standard Villa)</span>
                <span>3000 sqft (Luxury Estate)</span>
              </div>
            </div>

            {/* 2. Rate per Sqft Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider">Estimated Rate / Sq.Ft</span>
                <span className="text-sm font-black text-slate-900 font-heading px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                  ₹{ratePerSqft.toLocaleString()} / sq.ft
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="4500"
                step="50"
                value={ratePerSqft}
                onChange={(e) => setRatePerSqft(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹1,500/sqft (Chengalpattu)</span>
                <span>₹2,600/sqft (Guduvanchery)</span>
                <span>₹3,800+/sqft (Tambaram)</span>
              </div>
            </div>

            {/* 3. Down Payment & Tenure Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Down Payment ({downPaymentPct}%)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPct(pct)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        downPaymentPct === pct
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Loan Tenure ({tenureYears} Yrs)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTenureYears(yr)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        tenureYears === yr
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Estimated Monthly EMI
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-heading mt-1">
                ₹{monthlyEmi.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-300">/ month</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Plot Investment:</span>
                <span className="font-bold text-white text-sm">{formatPrice(totalPlotCost)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Initial Down Payment ({downPaymentPct}%):</span>
                <span className="font-semibold text-emerald-400">{formatPrice(downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Bank Loan Sanction ({(100 - downPaymentPct)}%):</span>
                <span className="font-semibold text-white">{formatPrice(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Indicative Interest Rate:</span>
                <span className="font-semibold text-amber-300">8.65% p.a.</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Get Bank Loan Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Free doorstep document collection & fast bank sanction</span>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="WEBSITE_FORM"
      />
    </>
  );
};
