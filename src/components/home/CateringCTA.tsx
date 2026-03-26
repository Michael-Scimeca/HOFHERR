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
        href: '/rotisserie-catering',
        cta: 'View Packages',
    },
    {
        emoji: '🥩',
        title: 'Custom Meat Platters',
        desc: 'Curated charcuterie boards, premium steak flights, and custom cut packages for dinner parties, holidays, and corporate entertaining.',
        detail: 'Any size group',
        href: '#',
        cta: 'Shop Cuts',
        openChat: true,
    },
];

function openQuoteChat() {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { subject: 'quote' } }));
}

export default function CateringCTA({ packages }: { packages?: CateringPackage[] }) {
    const s = useSiteSettings();

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.spread}>
                    {/* ── Left: Title + Hero Image ── */}
                    <div className={styles.leftCol}>
                        <div className={styles.label}>Events &amp; Catering</div>
                        <h2 className={styles.title}>
                            What We<br /><em>Offer</em>
                        </h2>
                        <p className={styles.sub}>
                            Full-service catering for events of every size — from intimate
                            dinners to 500+ guest blowouts. Hofherr handles it all.
                        </p>
                        <video
                            src="/video-clips/cutmeat.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className={styles.heroImage}
                        />
                    </div>

                    {/* ── Right: Stacked Services ── */}
                    <div className={styles.rightCol}>
                        {SERVICES.map(svc => (
                            <div key={svc.title} className={styles.serviceItem}>
                                <div className={styles.serviceEmoji}>{svc.emoji}</div>
                                <div className={styles.serviceContent}>
                                    <h3 className={styles.serviceTitle}>{svc.title}</h3>
                                    <p className={styles.serviceDesc}>{svc.desc}</p>
                                    <div className={styles.serviceDetail}>{svc.detail}</div>
                                    {svc.openChat ? (
                                        <button onClick={openQuoteChat} className={styles.serviceLink}>
                                            {svc.cta}
                                        </button>
                                    ) : (
                                        <Link href={svc.href} className={styles.serviceLink}>
                                            {svc.cta}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={openQuoteChat} className="btn btn-primary">Get a Free Quote</button>
                </div>
            </div>
        </section>
    );
}
