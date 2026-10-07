import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlotFinderConcierge } from '@/components/common/PlotFinderConcierge';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />

      {/* 2. Interactive Smart Plot Finder Concierge Bot (Image 4 Ref) */}
      <PlotFinderConcierge />
    </>
  );
}
