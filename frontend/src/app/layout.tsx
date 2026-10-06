import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Sree Hari Realty Promoters',
    default: 'Sree Hari Realty Promoters - DTCP & RERA Approved Gated Community Plots',
  },
  description:
    'Sree Hari Realty Promoters is Chennai leading land promoter offering DTCP & RERA approved residential & commercial villa plots in prime gated communities.',
  keywords: [
    'Sree Hari Realty Promoters',
    'Plots in Chennai',
    'Gated Community Plots',
    'Land for sale Chennai',
    'DTCP approved plots',
    'RERA approved layouts',
    'Tambaram plots',
    'Guduvanchery villa plots',
    'Residential plots for sale',
  ],
  authors: [{ name: 'Sree Hari Realty Promoters' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sreeharirealty.com',
    siteName: 'Sree Hari Realty Promoters',
    title: 'Sree Hari Realty Promoters - Premium Land & Gated Community Plots',
    description:
      'Buy verified, DTCP & RERA approved gated community residential villa plots with sweet groundwater, wide roads, and immediate registration.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sree Hari Realty Promoters Gated Community Plots',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
