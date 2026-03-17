import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import ChatWidgetWrapper from '@/components/ChatWidgetWrapper';
import ScrollToTop from '@/components/ScrollToTop';
import { CartProvider } from '@/context/CartContext';
import ClientProviders from '@/components/ClientProviders';
import { SiteSettingsProvider, DEFAULT_SETTINGS, type SiteSettings } from '@/context/SiteSettingsContext';
import { getClient } from '@/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const BASE_URL = 'https://hofherrmeatco.com';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export async function generateMetadata(): Promise<Metadata> {
  let sanitySeo = null;
  try {
    const { isEnabled: isDraft } = await draftMode();
    const sanityClient = getClient(isDraft);
    sanitySeo = await sanityClient.fetch(SITE_SETTINGS_QUERY);
  } catch (e) {
    console.warn('Failed to fetch SEO settings, using defaults:', e);
  }

  const title = sanitySeo?.seoTitle || 'Hofherr Meat Co. | Premium Butcher Shop — Northfield, IL';
  const description = sanitySeo?.seoDescription || 'Craft butchery since 1903. Custom cuts, dry-aged beef, rotisserie chicken, pig roasts, catering & The Depot grab-and-go. Two locations: Northfield & Winnetka, IL.';
  const ogImgUrl = sanitySeo?.ogImage || OG_IMAGE;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: '%s | Hofherr Meat Co.',
    },
    description: description,
    keywords: [
      'butcher shop', 'Northfield IL', 'Winnetka IL', 'custom cuts', 'dry aged beef',
      'rotisserie chicken', 'pig roast', 'catering', 'premium meat', 'butcher near me',
      'Chicago butcher', 'North Shore butcher', 'USDA prime beef', 'Italian beef',
      'Hofherr Meat', 'The Depot Winnetka', 'grab and go Winnetka',
    ],
    alternates: { canonical: BASE_URL },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      type: 'website', locale: 'en_US', url: BASE_URL, siteName: 'Hofherr Meat Co.',
      title: title,
      description: description,
      images: [{ url: ogImgUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', site: '@HofherrMeatCo', creator: '@HofherrMeatCo',
      title: title,
      description: description,
      images: [ogImgUrl],
    },
    applicationName: 'Hofherr Meat Co.',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Hofherr Meat Co.' },
    formatDetection: { telephone: true, address: true, email: true },
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  };
}

import DevNav from '@/components/DevNav';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode();

    // Fetch site settings from Sanity CMS (falls back to defaults on error)
    let settings: SiteSettings = DEFAULT_SETTINGS;
  try {
    const sanityClient = getClient(isDraft);
    const cms = await sanityClient.fetch(SITE_SETTINGS_QUERY);
    if (cms) {
      settings = {
        shopName: cms.shopName || DEFAULT_SETTINGS.shopName,
        phone: cms.phone || DEFAULT_SETTINGS.phone,
        email: cms.email || DEFAULT_SETTINGS.email,
        address: cms.address || DEFAULT_SETTINGS.address,
        butcherHours: cms.butcherHours?.length ? cms.butcherHours : DEFAULT_SETTINGS.butcherHours,
        depotHours: cms.depotHours?.length ? cms.depotHours : DEFAULT_SETTINGS.depotHours,
        instagram: cms.instagram || DEFAULT_SETTINGS.instagram,
        facebook: cms.facebook || DEFAULT_SETTINGS.facebook,
        yelp: cms.yelp || DEFAULT_SETTINGS.yelp,
        googleMaps: cms.googleMaps || DEFAULT_SETTINGS.googleMaps,
        announcement: cms.announcement || '',
        announcementActive: cms.announcementActive ?? false,
        announcementColor: cms.announcementColor || 'blue',
      };
    }
  } catch (e) {
    console.warn('Failed to fetch site settings, using defaults:', e);
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {/* UserWay Accessibility Widget */}
        <Script 
          src="https://cdn.userway.org/widget.js" 
          data-account="YOUR_USERWAY_ACCOUNT_ID" 
          strategy="lazyOnload" 
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <SiteSettingsProvider settings={settings}>
          <ClientProviders>
            <CartProvider>
              <JsonLd />
              <ScrollToTop />
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
              <ChatWidgetWrapper />
              {isDraft && <VisualEditing />}
              <DevNav />
            </CartProvider>
          </ClientProviders>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
