import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CATERING_EVENTS_QUERY } from '@/sanity/queries';
import CateringHub from './CateringHub';
import CateringHeroButtons from './CateringHeroButtons';
import styles from './page.module.css';

// Email body generation moved to '@/app/api/email/template' module

export const metadata: Metadata = {
    title: 'Catering | Pig Roasts, BBQ & Events | Hofherr Meat Co. — Northfield, IL',
    description: 'Full-service event catering from Hofherr Meat Co. — whole pig roasts, competition BBQ, rotisserie chicken packages, and custom menus. Serving 20 to 500+ guests across Chicago\'s North Shore.',
    alternates: { canonical: 'https://hofherrmeatco.com/catering' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering, rotisserie packages & custom menus for any event. Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/OG/og-catering.jpg', width: 1200, height: 630, alt: 'Catering — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering & custom event menus. 20–500+ guests. Chicago North Shore.',
    },
};







export default async function CateringPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    // Catering events
    type CateringEventData = { _id: string; date: string; eventType: string; status: string };
    let cateringEvents: CateringEventData[] = [];
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        cateringEvents = await sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr });
    } catch {
        // No events to show
    }

    return (
        <main>
            {/* ── Hero ── */}
                <section id="catering-hero" aria-labelledby="catering-hero-heading" className={styles.hero}>
                    <div className={`container ${styles.heroInner}`}>
                            <h1 id="catering-hero-heading" className={styles.headline}>
                                Feeding a <em>Crowd?</em>
                            </h1>
                            <p className={styles.sub}>
                                From backyard pig roasts to corporate BBQ spreads — Hofherr handles it all.
                                Custom menus, full-service setup, and food people actually talk about.
                            </p>
                            <CateringHeroButtons />
                    </div>
                </section>

                {/* ── How It Works ── */}
                    <section id="how-it-works" aria-labelledby="how-it-works-heading" className={`${styles.processSection} ${styles.processWithBg}`}>
                        <div className={styles.sectionBgMedia} aria-hidden="true" />
                        <div className={`container ${styles.processContent}`}>
                            <div className={styles.sectionHeader}>
                                <h2 id="how-it-works-heading" className={styles.sectionTitle}>How It Works</h2>
                            </div>
                            <div className={styles.steps}>
                                <div className={styles.step}>
                                    <div className={styles.stepNum}>1</div>
                                    <h3>Build Your Package</h3>
                                    <p>Choose your event type, pick your meats &amp; sides, and get an instant estimate — all right here on the page.</p>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNum}>2</div>
                                    <h3>Pick a Date</h3>
                                    <p>Select your event date on our live availability calendar. We require a minimum of 4 days notice.</p>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNum}>3</div>
                                    <h3>We Handle Everything</h3>
                                    <p>Submit your inquiry and Sean confirms within 24 hours. We arrive with food, setup, serving, and cleanup.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Interactive Catering Calculator ── */}
                        <section id="build-your-package" aria-labelledby="build-your-package-heading" className={styles.pricingSection}>
                            <div className="container">
                                <div className={styles.sectionHeader}>
                                    <h2 id="build-your-package-heading" className={styles.sectionTitle}>Build Your Package</h2>
                                    <p className={styles.sectionSub}>Choose BBQ catering or a full pig roast, customize your options, and get an instant estimate.</p>
                                </div>
                                <CateringHub events={cateringEvents} calendarPricing={[]} />
                            </div>
                        </section>
        </main>
    );
}
