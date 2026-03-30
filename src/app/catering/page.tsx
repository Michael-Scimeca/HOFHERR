import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CATERING_EVENTS_QUERY } from '@/sanity/queries';
import CateringHub from './CateringHub';
import styles from './page.module.css';

// Email body generation moved to '@/app/api/email/template' module

export const metadata: Metadata = {
    title: 'Catering | Pig Roasts, BBQ & Events | Hofherr Meat Co. — Northfield, IL',
    description: 'Full-service event catering from Hofherr Meat Co. — whole pig roasts, competition BBQ, rotisserie chicken packages, and custom menus. Serving 20 to 500+ guests across Chicago\'s North Shore.',
    alternates: { canonical: 'https://hofherrmeatco.com/catering' },
    openGraph: {
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering, rotisserie packages & custom menus for any event. Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/OG/og-catering.png', width: 1200, height: 630 }],
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
        <div>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">Events &amp; Catering</div>
                    <h1 className={styles.headline}>
                        Feeding a <em>Crowd?</em>
                    </h1>
                    <p className={styles.sub}>
                        From backyard pig roasts to corporate BBQ spreads — Hofherr handles it all.
                        Custom menus, full-service setup, and food people actually talk about.
                    </p>
                    <div className={styles.heroBtns}>
                        <a href="#build-your-package" className="btn btn-primary">Build Your Package</a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>


            {/* ── How It Works ── */}
            <section className={styles.processSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>How It Works</h2>
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
            <section id="build-your-package" className={styles.pricingSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Build Your Package</h2>
                        <p className={styles.sectionSub}>Choose BBQ catering or a full pig roast, customize your options, and get an instant estimate.</p>
                    </div>
                    <CateringHub events={cateringEvents} calendarPricing={[]} />
                </div>
            </section>

            {/* ── Bottom Marquee Ticker ── */}
            <div className={styles.marqueeWrap}>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow1}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Pig Roasts <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> BBQ Catering <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Rotisserie <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Custom Platters <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow2}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Private Events <img src="/crowd-ticker/steak.jpg" alt="" className={styles.marqueeBullet} /> Corporate Dinners <img src="/crowd-ticker/steak.jpg" alt="" className={styles.marqueeBullet} /> Weddings <img src="/crowd-ticker/steak.jpg" alt="" className={styles.marqueeBullet} /> Backyard Parties <img src="/crowd-ticker/steak.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow3}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Smoked Brisket <img src="/crowd-ticker/chickeninticker.jpg" alt="" className={styles.marqueeBullet} /> Pulled Pork <img src="/crowd-ticker/chickeninticker.jpg" alt="" className={styles.marqueeBullet} /> Whole Hog <img src="/crowd-ticker/chickeninticker.jpg" alt="" className={styles.marqueeBullet} /> Charcuterie <img src="/crowd-ticker/chickeninticker.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow4}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Competition BBQ <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Farm to Fire <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Full Service <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Custom Menus <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Ready to Plan Your Event?</h2>
                    <p className={styles.ctaSub}>Tell us about your event and Sean will put together a custom package — usually same day.</p>
                    <div className={styles.ctaBtns}>
                        <a href="mailto:catering@hofherrmeatco.com?subject=Catering Quote Request" className="btn btn-primary">Get a Free Quote</a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
