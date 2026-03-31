'use client';

import { useState } from 'react';
import styles from './FooterMap.module.css';

/* ─── Location data ─── */
const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        short: 'Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd+Northfield+IL+60093&travelmode=driving',
    },
    {
        id: 'depot',
        label: 'The Depot',
        short: 'The Depot',
        address: '780 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=780+Elm+St+Winnetka+IL+60093&travelmode=driving',
    },
] as const;

export default function FooterMap() {
    const [active, setActive] = useState(0);
    const loc = LOCATIONS[active];

    return (
        <div className={styles.mapSection}>
            {/* Toggle pills */}
            <div className={styles.toggleBar}>
                {LOCATIONS.map((l, i) => (
                    <button
                        key={l.id}
                        className={`${styles.toggleBtn} ${i === active ? styles.toggleActive : ''}`}
                        onClick={() => setActive(i)}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Always-visible address */}
            <a href={loc.directionsUrl} target="_blank" rel="noreferrer" className={styles.addressBar}>
                <span className={styles.addressIcon}>📍</span>
                <span className={styles.addressText}>{loc.address}</span>
            </a>

            {/* Map container */}
            <div className={styles.mapWrap}>
                <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.8)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${loc.label}`}
                />

                {/* Directions CTA */}
                <a
                    href={loc.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.directionsBtn}
                >
                    📍 Get Directions to {loc.short}
                </a>
            </div>
        </div>
    );
}
