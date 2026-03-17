'use client';
import Link from 'next/link';
import styles from './CateringCTA.module.css';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export type CateringPackage = {
    name: string;
    description?: string;
    servings?: string;
    price: string;
    items?: string[];
    image?: string;
    isPopular?: boolean;
};

const SERVICES = [
    {
        emoji: '🐷',
        title: 'Pig Roasts',
        desc: 'We source, prep, cook & serve. The full experience — from farm to fire to your table. Perfect for backyard parties, anniversaries, and graduation blowouts.',
        detail: 'Serves 30–300+ guests',
        href: '/pig-roasts',
        cta: 'Learn More',
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
        href: '/rotisserie-catering',
        cta: 'View Packages',
    },
    {
        emoji: '📋',
        title: 'Get a Quote',
        desc: 'Not sure what you need? Tell us about your event and Sean will put together a custom package — usually same day.',
        detail: 'Free · No obligation',
        href: '#',
        cta: 'Request a Quote',
        openChat: true,
    },
];

function openQuoteChat() {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { subject: 'quote' } }));
}

export default function CateringCTA({ packages }: { packages?: CateringPackage[] }) {
    const s = useSiteSettings();
    const phoneHref = 'tel:' + s.phone.replace(/[^\d]/g, '');

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">Events &amp; Catering</div>
                    <h2 className={styles.title}>Feeding a <em>Crowd?</em></h2>
                    <p className={styles.sub}>
                        From backyard pig roasts to corporate BBQ spreads — Hofherr handles it all.
                        Custom menus, full-service setup, and food people actually talk about.
                    </p>
                </div>

                {/* CMS packages from Sanity (if any exist) */}
                {packages && packages.length > 0 && (
                    <div className={styles.grid}>
                        {packages.map(pkg => (
                            <div key={pkg.name} className={`${styles.card} ${pkg.isPopular ? styles.cardPopular : ''}`}>
                                {pkg.isPopular && <div className={styles.cardBadge}>⭐ Most Popular</div>}
                                <h3 className={styles.cardTitle}>{pkg.name}</h3>
                                {pkg.description && <p className={styles.cardDesc}>{pkg.description}</p>}
                                {pkg.servings && <div className={styles.cardDetail}>{pkg.servings}</div>}
                                <div className={styles.cardPrice}>{pkg.price}</div>
                                {pkg.items && pkg.items.length > 0 && (
                                    <ul className={styles.cardItems}>
                                        {pkg.items.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Fallback: hardcoded service cards */}
                {(!packages || packages.length === 0) && (
                    <div className={styles.grid}>
                        {SERVICES.map(svc => (
                            <div key={svc.title} className={styles.card}>
                                <div className={styles.cardEmoji}>{svc.emoji}</div>
                                <h3 className={styles.cardTitle}>{svc.title}</h3>
                                <p className={styles.cardDesc}>{svc.desc}</p>
                                <div className={styles.cardDetail}>{svc.detail}</div>
                                {svc.openChat ? (
                                    <button onClick={openQuoteChat} className={styles.cardLink}>{svc.cta}</button>
                                ) : (
                                    <Link href={svc.href} className={styles.cardLink}>{svc.cta}</Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.footer}>
                    <button onClick={openQuoteChat} className="btn btn-primary">Get a Free Quote</button>
                </div>
            </div>
        </section>
    );
}
