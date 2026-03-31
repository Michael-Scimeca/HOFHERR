import type { Metadata, Viewport } from "next";
import { Yanone_Kaffeesatz, Inter, Outfit } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { SiteSettingsProvider, DEFAULT_SETTINGS, type SiteSettings } from "@/context/SiteSettingsContext";
import { getClient } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { auth } from "@/auth";
import ParallaxImages from "@/components/ParallaxImages";

// ── Lazy-loaded heavy components (code-split from initial JS bundle) ──
const EmbersBackground = dynamic(() => import("@/components/EmbersBackground"));
const ChatWidgetWrapper = dynamic(() => import("@/components/ChatWidgetWrapper"));
const DevNav = dynamic(() => import("@/components/DevNav"));

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
  description: "Experience the finest local meats and expert butchery at Hofherr Meat Co. in Northfield, IL. Hand-cut steaks, whole-hog roasts, and premium catering.",
  metadataBase: new URL("https://hofherrmeatco.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
    description: "Northfield's Premier Craft Butcher & BBQ Pitmasters",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hofherr Meat Co storefront",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();
  const session = await auth();

  let settings: SiteSettings = DEFAULT_SETTINGS;

  try {
    const sanityClient = getClient(isDraft);
    const cms = await sanityClient.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } });

    if (cms) {
      const hasValidButcher = Array.isArray(cms.butcherHours) && cms.butcherHours.some((h: any) => h.open && h.close);
      const hasValidDepot = Array.isArray(cms.depotHours) && cms.depotHours.some((h: any) => h.open && h.close);

      // Build field-by-field — NO spread of cms, so null fields never overwrite defaults
      settings = {
        shopName: cms.shopName || DEFAULT_SETTINGS.shopName,
        phone: cms.phone || DEFAULT_SETTINGS.phone,
        email: cms.email || DEFAULT_SETTINGS.email,
        address: cms.address || DEFAULT_SETTINGS.address,
        instagram: cms.instagram || DEFAULT_SETTINGS.instagram,
        facebook: cms.facebook || DEFAULT_SETTINGS.facebook,
        yelp: cms.yelp || DEFAULT_SETTINGS.yelp,
        googleMaps: cms.googleMaps || DEFAULT_SETTINGS.googleMaps,
        announcement: cms.announcement || DEFAULT_SETTINGS.announcement,
        announcementActive: cms.announcementActive ?? DEFAULT_SETTINGS.announcementActive,
        announcementColor: cms.announcementColor || DEFAULT_SETTINGS.announcementColor,
        // Hours: only use CMS if valid, otherwise use hardcoded defaults
        butcherHours: hasValidButcher ? cms.butcherHours : DEFAULT_SETTINGS.butcherHours,
        depotHours: hasValidDepot ? cms.depotHours : DEFAULT_SETTINGS.depotHours,
      };
      console.log('[Layout] butcherHours from:', hasValidButcher ? 'CMS' : 'DEFAULTS', '| depotHours from:', hasValidDepot ? 'CMS' : 'DEFAULTS');
    }
  } catch (e) {
    console.warn('Site settings fetch failed, using defaults:', e);
  }

  return (
    <html lang="en" className={`${yanone.variable} ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <EmbersBackground />
        <SiteSettingsProvider settings={settings}>
          <ClientProviders session={session}>
            <CartProvider>
              <JsonLd />
              <SmoothScroll />
              <ScrollToTop />
              <Navbar />
              <PageTransition>
                <div style={{ minHeight: '100vh' }}>
                  {children}
                </div>
                <Footer />
              </PageTransition>
              <ChatWidgetWrapper />
              <DevNav />
              <ParallaxImages />

            </CartProvider>
          </ClientProviders>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
