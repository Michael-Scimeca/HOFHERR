'use client';

import styles from './MosaicServices.module.css';
import ParallaxImg from './ParallaxImg';

const SERVICE_IMAGES: Record<string, string> = {
    'Whole-Pig Roasts':       '/assets/specials-pig-roast.jpg',
    'Concert Picnic Baskets': '/images/bbq/charcuterie.jpg',
    'Game Day & Tailgate':    '/images/bbq/rib_tips.jpg',
    'Business Buffets':       '/assets/catering-buffet.jpg',
    'Wild Game Processing':   '/images/bbq/sausage.jpg',
    'Private Meat Sessions':  '/assets/italian-beef.jpg',
};

const SERVICE_TAGS: Record<string, string> = {
    'Whole-Pig Roasts':       'Full Service',
    'Concert Picnic Baskets': 'Events',
    'Game Day & Tailgate':    'Tailgate',
    'Business Buffets':       'Corporate',
    'Wild Game Processing':   'Specialty',
    'Private Meat Sessions':  'Exclusive',
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
    const img   = SERVICE_IMAGES[svc.title] ?? '/images/bbq/brisket.jpg';
    const tag   = SERVICE_TAGS[svc.title];
    const href  = svc.linkUrl || 'tel:8474416328';
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
    const items = services.slice(0, 6);

    // Pad to 6 if fewer services
    while (items.length < 6) items.push(items[0]);

    const [hero, s2, s3, s4, s5, s6] = items;

    return (
        <div className={styles.mosaic}>
            {/* ── Top: hero 2×2 left + 2 stacked right ── */}
            <div className={styles.topGrid}>
                <MosaicCard svc={hero} className={styles.heroCard} />
                <MosaicCard svc={s2}   className={styles.smallCard} />
                <MosaicCard svc={s3}   className={styles.smallCard} />
            </div>

            {/* ── Bottom: 3 equal columns ── */}
            <div className={styles.bottomGrid}>
                <MosaicCard svc={s4} className={styles.bottomCard} />
                <MosaicCard svc={s5} className={styles.bottomCard} />
                <MosaicCard svc={s6} className={styles.bottomCard} />
            </div>
        </div>
    );
}
