'use client';

import { useState } from 'react';
import styles from './AccordionServices.module.css';

const SERVICE_IMAGES: Record<string, string> = {
    'Whole-Pig Roasts': '/assets/specials-pig-roast.jpg',
    'Concert Picnic Baskets': '/images/bbq/charcuterie.jpg',
    'Game Day & Tailgate': '/images/bbq/rib_tips.jpg',
    'Business Buffets': '/assets/catering-buffet.jpg',
    'Wild Game Processing': '/images/bbq/sausage.jpg',
    'Private Meat Sessions': '/assets/italian-beef.jpg',
};

interface ServiceItem {
    title: string;
    emoji?: string | null;
    description?: string | null;
    linkLabel?: string | null;
    linkUrl?: string | null;
}

interface Props {
    services: ServiceItem[];
}

export default function AccordionServices({ services }: Props) {
    const [active, setActive] = useState(0);

    const toggle = (i: number) => setActive(prev => (prev === i ? -1 : i));

    return (
        <div className={styles.list}>
            {services.map((svc, i) => {
                const isActive = active === i;
                const img = SERVICE_IMAGES[svc.title];
                const num = `0${i + 1}`;

                return (
                    <div
                        key={i}
                        className={`${styles.row} ${isActive ? styles.active : ''}`}
                    >
                        {/* ── Header strip — always visible ── */}
                        <button
                            className={styles.header}
                            onClick={() => toggle(i)}
                            aria-expanded={isActive}
                        >
                            <div className={styles.titleRow}>
                                {svc.emoji && (
                                    <span className={styles.emoji} aria-hidden>{svc.emoji}</span>
                                )}
                                <span className={styles.title}>{svc.title}</span>
                            </div>

                            <span className={styles.caret} aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                                        className={isActive ? styles.caretVHide : styles.caretV} />
                                    <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </span>
                        </button>

                        {/* ── Expandable body ── */}
                        <div className={styles.body}>
                            <div className={styles.bodyInner}>

                                {/* Left: text */}
                                <div className={styles.bodyText}>
                                    {svc.description && (
                                        <p className={styles.desc}>{svc.description}</p>
                                    )}
                                    {svc.linkLabel && (
                                        <a
                                            href={svc.linkUrl || 'tel:8474416328'}
                                            className={styles.cta}
                                        >
                                            {svc.linkLabel}
                                        </a>
                                    )}
                                </div>

                                {/* Right: photo */}
                                {img && (
                                    <div className={styles.imgWrap}>
                                        <img
                                            src={img}
                                            alt={svc.title}
                                            className={styles.img}
                                        />
                                        <div className={styles.imgOverlay} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
