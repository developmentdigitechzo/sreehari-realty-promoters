import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteVisitRibbon } from '@/components/common/SiteVisitRibbon';
import { PlotFinderConcierge } from '@/components/common/PlotFinderConcierge';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Animated Chauffeured Site Visit Floating Ribbon (Image 1 Ref) */}
      <SiteVisitRibbon />

      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />

      {/* 2. Interactive Smart Plot Finder Concierge Bot (Image 4 Ref) */}
      <PlotFinderConcierge />
    </>
  );
}
