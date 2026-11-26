import type { Metadata, Viewport } from "next";
import { Yanone_Kaffeesatz, Inter } from "next/font/google";
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
import PageTransition, { TransitionProvider } from "@/components/PageTransition";
import { auth } from "@/auth";
import ParallaxImages from "@/components/ParallaxImages";

import LazyGlobalCartDrawer from "@/components/LazyGlobalCartDrawer";
import LazyAuthModal from "@/components/LazyAuthModal";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
// ── Lazy-loaded heavy & interactive-only components (code-split from initial JS/CSS bundle) ──
const EmbersBackground = dynamic(() => import("@/components/EmbersBackground"));
const Preloader = dynamic(() => import("@/components/Preloader"));
const DevNav = process.env.NODE_ENV === "development" ? dynamic(() => import("@/components/DevNav")) : null;
const AddToOrderAnimStudio =
  process.env.NODE_ENV === "development" ? dynamic(() => import("@/components/AddToOrderAnimStudio")) : null;
const MobileMenuBurnHud =
  process.env.NODE_ENV === "development" ? dynamic(() => import("@/components/MobileMenuBurnHud")) : null;

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


function resolveMetadataBase(): URL {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "https://hofherrmeatco.com";
  try {
    return new URL(candidate);
  } catch {
    return new URL("https://hofherrmeatco.com");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Hofherr Meat Co. | Northfield's Premier Craft Butcher";
  const defaultDescription =
    "Craft butchery in Northfield & Winnetka, IL. Order hand-cut USDA Prime steaks, whole-hog roasts, Italian beef, and BBQ catering online.";
  const defaultOgDesc = "Northfield's Premier Craft Butcher & BBQ Pitmasters";
  const defaultKeywords = [
    "Hofherr Meat Co",
    "butcher shop Northfield IL",
    "craft butcher North Shore",
    "USDA Prime steaks",
    "Winnetka Depot",
    "BBQ catering Chicago North Shore",
    "whole pig roast",
    "house-made sausages",
  ];

  let cmsSeo: {
    seoTitle?: string;
    seoDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    seoKeywords?: string[];
    shopName?: string;
  } | null = null;

  try {
    cmsSeo = await getClient(false).fetch(
      `*[_type == "siteSettings"][0]{ seoTitle, seoDescription, ogTitle, ogDescription, seoKeywords, shopName }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    // Fall back cleanly to defaults if Sanity is unreachable
  }

  const siteName = cmsSeo?.shopName || "Hofherr Meat Co.";
  const title = cmsSeo?.seoTitle || defaultTitle;
  const description = cmsSeo?.seoDescription || defaultDescription;
  const ogTitle = cmsSeo?.ogTitle || title;
  const ogDescription = cmsSeo?.ogDescription || defaultOgDesc;
  const keywords =
    Array.isArray(cmsSeo?.seoKeywords) && cmsSeo.seoKeywords.length > 0
      ? cmsSeo.seoKeywords
      : defaultKeywords;

  return {
    title,
    description,
    keywords,
    metadataBase: resolveMetadataBase(),
    applicationName: siteName,
    authors: [{ name: siteName, url: "https://hofherrmeatco.com" }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      siteName,
      type: "website",
      locale: "en_US",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: "/OG/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} — Premium Butcher Shop, Northfield IL`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

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
    <html lang="en" className={`${yanone.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
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
          </>
        )}

        <EmbersBackground />
        <SiteSettingsProvider settings={settings}>
          <ClientProviders session={session}>
            <CartProvider>
              <TransitionProvider>
              <JsonLd settings={settings} />
              <SmoothScroll />
              <ScrollToTop />
              <Navbar />
              <LazyAuthModal />
              <LazyGlobalCartDrawer />
              <PageTransition>
                <div className="site-shell">
                  {children}
                </div>
                <Footer />
              </PageTransition>
              <Preloader />
              {DevNav && <DevNav />}
              {AddToOrderAnimStudio && <AddToOrderAnimStudio />}
              {MobileMenuBurnHud && <MobileMenuBurnHud />}
              <ParallaxImages />
              <ServiceWorkerRegistrar />
              </TransitionProvider>
            </CartProvider>
          </ClientProviders>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
