'use client';

import React from 'react';
import { X } from 'lucide-react';
import { LeadForm } from './LeadForm';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  propertyTitle?: string;
  source?: 'PROJECT_PAGE' | 'PROPERTY_PAGE' | 'WEBSITE_FORM';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
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
            title={propertyTitle ? `Enquire for ${propertyTitle}` : projectName ? `Enquire for ${projectName}` : 'Request Brochure & Callback'}
            subtitle="Enter your contact details to receive price breakup, layout map, and arrange a free cab site visit."
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
