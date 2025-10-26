import './globals.css';
import type { ReactNode } from 'react';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import type { Metadata } from 'next';
import { SponsorBanner } from '@/components/sponsor-banner';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_APP_URL || 'https://docverse-psi.vercel.app').replace(
      /^http:/,
      'https:',
    ),
  ),
  title: {
    default: 'docverse - AI Document Creation Platform',
    template: '%s | docverse',
  },
  description: 'Create beautiful resumes, presentations, CVs and letters with AI',
  applicationName: 'docverse',
  referrer: 'strict-origin-when-cross-origin',
  keywords: [
    'ai',
    'resume',
    'presentation',
    'cv',
    'letter',
    'document',
    'generator',
    'nextjs',
    'supabase',
  ],
  authors: [{ name: 'docverse' }],
  creator: 'docverse',
  publisher: 'docverse',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'docverse - AI Document Creation Platform',
    description: 'Create beautiful resumes, presentations, CVs and letters with AI',
    siteName: 'docverse',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'docverse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'docverse - AI Document Creation Platform',
    description: 'Create beautiful resumes, presentations, CVs and letters with AI',
    images: ['/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'manifest', url: '/manifest.json' }],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://bxiieunzrcdbxqadapcl.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'docverse',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'Create beautiful resumes, presentations, CVs and letters with AI',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              url: (process.env.NEXT_PUBLIC_APP_URL || 'https://docverse-psi.vercel.app').replace(
                /^http:/,
                'https:',
              ),
            }),
          }}
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="docverse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </head>
      <body className={`${inter.className} ${poppins.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
        <SponsorBanner />
        <main id="main-content" role="main">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
