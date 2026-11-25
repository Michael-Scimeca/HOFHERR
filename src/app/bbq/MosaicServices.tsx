'use client';

import Link from 'next/link';
import styles from './MosaicServices.module.css';
import ParallaxImg from './ParallaxImg';

const SERVICE_IMAGES: Record<string, string> = {
    'Whole-Pig Roasts': '/assets/specials-pig-roast.jpg',
    'Concert Picnic Baskets': '/images/bbq/charcuterie.jpg',
    'Game Day & Tailgate': '/images/bbq/rib_tips.jpg',
    'Business Buffets': '/assets/catering-buffet.jpg',
    'Wild Game Processing': '/images/bbq/sausage.jpg',
    'Private Meat Sessions': '/assets/italian-beef.jpg',
    'Holiday & Event Roasts': '/images/bbq/brisket.jpg',
};

const SERVICE_TAGS: Record<string, string> = {
    'Whole-Pig Roasts': 'Full Service',
    'Concert Picnic Baskets': 'Events',
    'Game Day & Tailgate': 'Tailgate',
    'Business Buffets': 'Corporate',
    'Wild Game Processing': 'Specialty',
    'Private Meat Sessions': 'Exclusive',
    'Holiday & Event Roasts': 'Seasonal',
};

const FALLBACK_MOSAIC_SLOTS: ServiceItem[] = [
    { title: 'Business Buffets', emoji: '💼', linkLabel: 'Get Started', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Corporate Catering' },
    { title: 'Concert Picnic Baskets', emoji: '🧺', linkLabel: 'Order Yours', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Picnic Basket Order' },
    { title: 'Game Day & Tailgate', emoji: '🏈', linkLabel: 'Plan Your Spread', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Game Day Catering' },
    { title: 'Private Meat Sessions', emoji: '🕯️', linkLabel: 'Inquire', linkUrl: 'mailto:sean@hofherrmeatco.com?subject=Private Meat Session' },
    { title: 'Holiday & Event Roasts', emoji: '🎄', linkLabel: 'See Holiday Menus', linkUrl: '/catering/holidays' },
];

const FALLBACK_IMAGES = [
    '/assets/catering-buffet.jpg',
    '/images/bbq/charcuterie.jpg',
    '/images/bbq/rib_tips.jpg',
    '/assets/italian-beef.jpg',
    '/images/bbq/brisket.jpg',
];

function resolveServiceImage(title: string, slotIndex: number): string {
    if (SERVICE_IMAGES[title]) return SERVICE_IMAGES[title];
    const t = title.toLowerCase();
    if (t.includes('pig')) return '/assets/specials-pig-roast.jpg';
    if (t.includes('picnic') || t.includes('ravinia') || t.includes('concert')) return '/images/bbq/charcuterie.jpg';
    if (t.includes('game day') || t.includes('tailgate') || t.includes('watch')) return '/images/bbq/rib_tips.jpg';
    if (t.includes('business') || t.includes('corporate') || t.includes('buffet')) return '/assets/catering-buffet.jpg';
    if (t.includes('wild game') || t.includes('hunter') || t.includes('sausage')) return '/images/bbq/sausage.jpg';
    if (t.includes('private') || t.includes('session') || t.includes('dinner')) return '/assets/italian-beef.jpg';
    if (t.includes('holiday') || t.includes('roast')) return '/images/bbq/brisket.jpg';
    return FALLBACK_IMAGES[slotIndex % FALLBACK_IMAGES.length];
}

function resolveServiceTag(title: string): string | undefined {
    if (SERVICE_TAGS[title]) return SERVICE_TAGS[title];
    const t = title.toLowerCase();
    if (t.includes('pig')) return 'Full Service';
    if (t.includes('picnic') || t.includes('concert')) return 'Events';
    if (t.includes('game day') || t.includes('tailgate')) return 'Tailgate';
    if (t.includes('business') || t.includes('corporate') || t.includes('buffet')) return 'Corporate';
    if (t.includes('wild game')) return 'Specialty';
    if (t.includes('private') || t.includes('session')) return 'Exclusive';
    if (t.includes('holiday')) return 'Seasonal';
    return undefined;
}

interface ServiceItem {
    title: string;
    emoji?: string | null;
    description?: string | null;
    linkLabel?: string | null;
    linkUrl?: string | null;
}

interface Props { services: ServiceItem[] }

function MosaicCard({ svc, className, slotIndex }: { svc: ServiceItem; className: string; slotIndex: number }) {
    const img = resolveServiceImage(svc.title, slotIndex);
    const tag = resolveServiceTag(svc.title);
    const rawHref = svc.linkUrl || 'tel:8474416328';
    const href =
        rawHref === '/catering#inquire' || rawHref === '#quote'
            ? '/catering#build-your-package'
            : rawHref;
    const label = svc.linkLabel ?? 'Get a Quote';

    return (
        <a href={href} className={`${styles.card} ${className}`}>
            {/* Full-bleed photo */}
            <div className={styles.photoWrap}>
                <ParallaxImg src={img} alt={svc.title} className={styles.photo} />
            </div>

            {/* Gradient overlay + text */}
            <div className={styles.overlay}>
                {tag && <span className={styles.tag}>{tag}</span>}
                <div className={styles.cardBottom}>
                    {svc.emoji && <span className={styles.cardEmoji}>{svc.emoji}</span>}
                    <h3 className={styles.cardTitle}>{svc.title}</h3>
                    <span className={styles.cardCta}>{label} →</span>
                </div>
            </div>
        </a>
    );
}

export default function MosaicServices({ services }: Props) {
    const items: ServiceItem[] = [];
    const seen = new Set<string>();
    for (const svc of [...services, ...FALLBACK_MOSAIC_SLOTS]) {
        if (items.length >= 5) break;
        const key = svc.title.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        items.push(svc);
    }

    const [hero, s2, s3, s4, s5] = items;

    return (
        <div className={styles.mosaic}>
            {/* ── Top: hero 2×2 left + 2 stacked right ── */}
            <div className={styles.topGrid}>
                <MosaicCard svc={hero} className={styles.heroCard} slotIndex={0} />
                <MosaicCard svc={s2} className={styles.smallCard} slotIndex={1} />
                <MosaicCard svc={s3} className={styles.smallCard} slotIndex={2} />
            </div>

            {/* ── Bottom: 3 equal columns (2 services + Build Your Package CTA) ── */}
            <div className={styles.bottomGrid}>
                <MosaicCard svc={s4} className={styles.bottomCard} slotIndex={3} />
                <MosaicCard svc={s5} className={styles.bottomCard} slotIndex={4} />
                <div className={`${styles.card} ${styles.bottomCard} ${styles.ctaCard}`}>
                    <div className={styles.ctaOverlay}>
                        <h3 className={styles.ctaTitle}>Build Your Package</h3>
                        <p className={styles.ctaSub}>Pick your meats, sides, and event date for an instant catering estimate.</p>
                        <Link href="/catering#build-your-package" className={`btn btn-secondary ${styles.ctaBtn}`}>
                            Start Building
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
