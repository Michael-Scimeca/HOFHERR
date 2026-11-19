import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, ROTISSERIE_STATUS_QUERY } from '@/sanity/queries';
import NewsletterInline from '@/components/NewsletterInline';
import SignatureDishesSection, {
    FALLBACK_SIGNATURES,
    mergeSignatureFallbacks,
    type SignatureProduct,
    type RotisserieStatus,
} from '@/components/SignatureDishesSection';

import styles from './page.module.css';

export const metadata: Metadata = {
    title: "Italian Beef, Rotisserie Chicken, BBQ & Pig Roasts | Hofherr Meat Co. Specials",
    description: "Hofherr Meat Co.'s signature offerings: world-famous Italian beef (featured on America's Test Kitchen & PBS Proof), daily pasture-raised rotisserie chicken dinners, award-winning BBQ catering, and whole-hog pig roasts. Northfield & Winnetka, IL.",
    keywords: ['Italian beef Northfield IL', 'rotisserie chicken Northfield', 'BBQ catering North Shore', 'pig roast Chicago', "America's Test Kitchen Italian beef", 'PBS Proof Hofherr', 'Hofherr Meat Co specials'],
    alternates: { canonical: 'https://hofherrmeatco.com/specials' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: "Italian Beef, Rotisserie Chicken, BBQ & Pig Roasts | Hofherr Meat Co.",
        description: "Italian beef (as featured on America's Test Kitchen), daily rotisserie chicken dinners, BBQ catering, and whole-hog pig roasts — the best of Hofherr Meat Co. North Shore, IL.",
        url: 'https://hofherrmeatco.com/specials',
        images: [{ url: '/OG/og-specials.jpg', width: 1200, height: 630, alt: 'Specials — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Hofherr Meat Co. Specials — Italian Beef, Chicken, BBQ & Pig Roasts",
        description: "Featured on America's Test Kitchen. Italian beef, rotisserie chicken, BBQ catering & whole-hog roasts. Northfield & Winnetka, IL.",
    },
};

export default async function SpecialsPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let signatures: SignatureProduct[] = FALLBACK_SIGNATURES;
    try {
        const [rawSigs] = await Promise.all([
            sanityClient.fetch(SIGNATURE_PRODUCTS_QUERY),
        ]);
        if (rawSigs?.length) {
            signatures = mergeSignatureFallbacks(rawSigs);
        }
    } catch {
        // Fall back to the static signatures above
    }

    // Rotisserie live stock status
    let rotisserie: RotisserieStatus | null = null;
    try {
        const rawRotisserie = await sanityClient.fetch(ROTISSERIE_STATUS_QUERY);
        if (rawRotisserie?.status) rotisserie = rawRotisserie;
    } catch {
        // No status to show
    }


    return (
        <main>

            {/* ── Hero ── */}
            <section id="specials-hero" aria-labelledby="specials-hero-heading" className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 id="specials-hero-heading" className={styles.headline}>
                        The Dishes That <em>Made Our Name</em>
                    </h1>
                    <p className={styles.sub}>
                        The dishes and services that define Hofherr Meat Co. — perfected over years and impossible to find anywhere else.
                    </p>
                </div>
            </section>

            {/* ── Specials (dynamic from Sanity) ── */}
            <SignatureDishesSection signatures={signatures} rotisserie={rotisserie} />

            {/* ── Pig roasts teaser (full section lives on /catering) ── */}
            <section id="pig-roasts" aria-labelledby="pig-roasts-heading" className="section-sm">
                <div className="container">
                    <div className={styles.pigRoastCtaSurface}>
                        <div className={styles.pigRoastCtaContent}>
                            <div className={styles.pigRoastCtaCopy}>
                                <h2 id="pig-roasts-heading" className={styles.pigRoastCtaTitle}>Hofherr Pig Roasts</h2>
                                <p className={styles.pigRoastCtaSub}>
                                    A fully roasted whole hog, carved in front of your guests. Full service for 50 or more guests.
                                </p>
                            </div>
                            <Link href="/catering#pig-roasts" className={`btn ${styles.pigRoastCtaBtn}`}>
                                See Pig Roasts →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            {/* ── Newsletter ── */}
            <section id="specials-newsletter" aria-labelledby="specials-newsletter-heading" className={styles.newsletter}>
                <div className={`container ${styles.newsletterInner}`}>
                    <div className={styles.nlLeft}>
                        <h2 id="specials-newsletter-heading" className={styles.nlTitle}>Never Miss a Special</h2>
                        <p className={styles.nlSub}>Get early access to seasonal offerings, holiday pre-orders, and new additions to our lineup every Tuesday morning.</p>
                    </div>
                    <div className={styles.nlRight}>
                        <NewsletterInline />
                    </div>
                </div>
            </section>

        </main>
    );
}
