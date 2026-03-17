import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Catering | Hofherr Meat Co.',
    description:
        'Full-service catering from Hofherr Meat Co. — pig roasts, competition BBQ, rotisserie chicken packages, and custom menus for events of 20 to 500+ guests. Northfield & Winnetka, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/catering' },
    openGraph: {
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering, rotisserie packages & custom menus for any event.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const SERVICES = [
    {
        emoji: '🐷',
        title: 'Pig Roasts',
        desc: 'We source, prep, cook & serve. The full experience — from farm to fire to your table. Perfect for backyard parties, anniversaries, and graduation blowouts.',
        detail: 'Serves 30–300+ guests',
        href: '/specials#pig-roasts',
        cta: 'View Details',
    },
    {
        emoji: '🔥',
        title: 'BBQ Catering',
        desc: 'Competition-style BBQ for any event. Brisket, ribs, pulled pork, sausages — smoked low and slow, served hot. From 20 to 500+ guests.',
        detail: 'Custom menus available',
        href: '/bbq',
        cta: 'See the Menu',
    },
    {
        emoji: '🍗',
        title: 'Rotisserie Packages',
        desc: 'Whole birds, roasted to order on our floor-to-ceiling rotisserie. Bulk packages for events, corporate lunches, and weekend parties.',
        detail: 'Minimum 6 birds',
        href: '/specials',
        cta: 'View Packages',
    },
    {
        emoji: '🥩',
        title: 'Custom Meat Platters',
        desc: 'Curated charcuterie boards, premium steak flights, and custom cut packages for dinner parties, holidays, and corporate entertaining.',
        detail: 'Any size group',
        href: '/online-orders',
        cta: 'Shop Cuts',
    },
];

const PRICING = [
    { label: '1 Meat + 1 Side', price: '$16/person' },
    { label: 'Each Additional Meat', price: '+$4/person' },
    { label: 'Each Additional Side', price: '+$2/person' },
    { label: 'Add Charcuterie Platter', price: '+$4/person' },
    { label: 'Pimento Cheese Dip + Crackers', price: '$20/tray' },
    { label: 'Drop Off (within 5 miles)', price: '+$50' },
];

const PIG_PRICING = [
    { label: 'Just the Pig', price: '$30/person' },
    { label: 'Pig + 1 Side', price: '$32/person' },
    { label: 'Pig + 2 Sides', price: '$34/person' },
    { label: 'Pig + 3 Sides', price: '$36/person' },
    { label: '1 Add\'l Meat + 1 Side', price: '$36/person' },
    { label: '1 Add\'l Meat + 2 Sides', price: '$38/person' },
    { label: '1 Add\'l Meat + 3 Sides', price: '$40/person' },
];

export default function CateringPage() {
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
                        <a href="mailto:catering@hofherrmeatco.com?subject=Catering Quote Request" className="btn btn-primary">Get a Free Quote</a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>

            {/* ── Services Grid ── */}
            <section className={styles.servicesSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>What We Offer</h2>
                        <p className={styles.sectionSub}>Full-service catering for events of every size — from intimate dinners to 500+ guest blowouts.</p>
                    </div>
                    <div className={styles.grid}>
                        {SERVICES.map(svc => (
                            <div key={svc.title} className={styles.card}>
                                <div className={styles.cardEmoji}>{svc.emoji}</div>
                                <h3 className={styles.cardTitle}>{svc.title}</h3>
                                <p className={styles.cardDesc}>{svc.desc}</p>
                                <div className={styles.cardDetail}>{svc.detail}</div>
                                <Link href={svc.href} className={styles.cardLink}>{svc.cta}</Link>
                            </div>
                        ))}
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
                            <h3>Tell Us About Your Event</h3>
                            <p>Email or call with your date, guest count, and any dietary needs. We&apos;ll get back to you same day.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>2</div>
                            <h3>Custom Menu & Quote</h3>
                            <p>Sean puts together a tailored menu and transparent quote — no hidden fees, no surprises.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <h3>We Handle Everything</h3>
                            <p>Our team arrives with everything: food, setup, serving equipment, and cleanup. You just enjoy the party.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BBQ Pricing ── */}
            <section className={styles.pricingSection}>
                <div className="container">
                    <div className={styles.pricingGrid}>
                        <div className={styles.pricingCard}>
                            <h3 className={styles.pricingTitle}>BBQ Catering</h3>
                            <p className={styles.pricingNote}>20+ People · Pickup · Tax not included</p>
                            <p className={styles.pricingIncludes}>Includes paperware, cutlery, serving utensils, buns, condiments &amp; sauce.</p>
                            <div className={styles.priceRows}>
                                {PRICING.map(p => (
                                    <div key={p.label} className={styles.priceRow}>
                                        <span>{p.label}</span>
                                        <strong>{p.price}</strong>
                                    </div>
                                ))}
                            </div>
                            <a href="mailto:catering@hofherrmeatco.com?subject=BBQ Catering Quote" className="btn btn-primary">Get a BBQ Quote</a>
                        </div>
                        <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
                            <div className={styles.pricingBadge}>⭐ Full Service</div>
                            <h3 className={styles.pricingTitle}>Pig Roasts</h3>
                            <p className={styles.pricingNote}>50+ Guests · Per Person · Tax not included</p>
                            <p className={styles.pricingIncludes}>Includes fully cooked pig, buffet setup, chafing dishes, paper goods, condiments, event staff &amp; cleanup.</p>
                            <div className={styles.priceRows}>
                                {PIG_PRICING.map(p => (
                                    <div key={p.label} className={styles.priceRow}>
                                        <span>{p.label}</span>
                                        <strong>{p.price}</strong>
                                    </div>
                                ))}
                            </div>
                            <a href="mailto:catering@hofherrmeatco.com?subject=Pig Roast Inquiry" className="btn btn-primary">Reserve a Date</a>
                        </div>
                    </div>
                </div>
            </section>

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
