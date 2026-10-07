'use client';

import React from 'react';
import { X } from 'lucide-react';
import { LeadForm } from './LeadForm';
import { LeadSource } from '@/types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  propertyTitle?: string;
  source?: LeadSource;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  propertyId,
  propertyTitle,
  source = 'WEBSITE_FORM',
}) => {
  if (!isOpen) return null;

  const isSeller = source === 'SELLER_DESK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-900/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Close Enquiry Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2">
          <LeadForm
            projectId={projectId}
            projectName={projectName}
            propertyId={propertyId}
            propertyTitle={propertyTitle}
            source={source}
            title={
              isSeller
                ? 'Sell / Promote Your Land with Zero Brokerage'
                : propertyTitle
                ? `Enquire for ${propertyTitle}`
                : projectName
                ? `Enquire for ${projectName}`
                : 'Schedule Free AC Cab Site Visit'
            }
            subtitle={
              isSeller
                ? 'Share your land/property details below. Our senior acquisition team will provide valuation and buyer matching.'
                : 'Enter your contact details to receive price breakup, layout map, and arrange a free cab site visit.'
            }
            buttonText={isSeller ? 'Submit Land for Free Listing' : 'Claim Free Site Visit'}
            className="border-0 shadow-none p-6"
            onSuccess={() => {
              setTimeout(() => {
                onClose();
              }, 2500);
            }}
          />
        </div>
      </div>
    </div>
  );
};
