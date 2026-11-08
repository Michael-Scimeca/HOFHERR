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
};

const SERVICE_TAGS: Record<string, string> = {
    'Whole-Pig Roasts': 'Full Service',
    'Concert Picnic Baskets': 'Events',
    'Game Day & Tailgate': 'Tailgate',
    'Business Buffets': 'Corporate',
    'Wild Game Processing': 'Specialty',
    'Private Meat Sessions': 'Exclusive',
};

interface ServiceItem {
    title: string;
    emoji?: string | null;
    description?: string | null;
    linkLabel?: string | null;
    linkUrl?: string | null;
}

interface Props { services: ServiceItem[] }

function MosaicCard({ svc, className }: { svc: ServiceItem; className: string }) {
    const img = SERVICE_IMAGES[svc.title] ?? '/images/bbq/brisket.jpg';
    const tag = SERVICE_TAGS[svc.title];
    const href = svc.linkUrl || 'tel:8474416328';
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
    const items = services.slice(0, 5);

    // Pad to 5 if fewer services
    while (items.length < 5) items.push(items[0]);

    const [hero, s2, s3, s4, s5] = items;

    return (
        <div className={styles.mosaic}>
            {/* ── Top: hero 2×2 left + 2 stacked right ── */}
            <div className={styles.topGrid}>
                <MosaicCard svc={hero} className={styles.heroCard} />
                <MosaicCard svc={s2} className={styles.smallCard} />
                <MosaicCard svc={s3} className={styles.smallCard} />
            </div>

            {/* ── Bottom: 3 equal columns (2 services + Build Your Package CTA) ── */}
            <div className={styles.bottomGrid}>
                <MosaicCard svc={s4} className={styles.bottomCard} />
                <MosaicCard svc={s5} className={styles.bottomCard} />
                <div className={`${styles.card} ${styles.bottomCard} ${styles.ctaCard}`}>
                    <div className={styles.ctaOverlay}>
                        <h3 className={styles.ctaTitle}>Build Your Package</h3>
                        <p className={styles.ctaSub}>Pick your meats, sides, and event date for an instant catering estimate.</p>
                        <Link href="#quote" className={`btn btn-secondary ${styles.ctaBtn}`}>
                            Start Building
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
