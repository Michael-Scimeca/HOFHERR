'use client';

import { useState, useCallback, useRef } from 'react';
import styles from './FooterMap.module.css';

const GOOGLE_MAPS_SANDBOX = 'allow-scripts allow-same-origin allow-popups';

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
    const readySentRef = useRef(false);
    const loc = LOCATIONS[active];

    const handleMapLoad = useCallback(() => {
        if (!readySentRef.current && typeof window !== 'undefined') {
            readySentRef.current = true;
            (window as unknown as { __hofherrMapReady?: boolean }).__hofherrMapReady = true;
            window.dispatchEvent(new CustomEvent('visit-map-ready'));
        }
    }, []);

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

            {/* Map container — both locations preloaded eagerly for instant display & switching */}
            <div className={styles.mapWrap}>
                {LOCATIONS.map((item, idx) => (
                    <iframe
                        key={item.id}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`}
                        className={`${styles.mapIframe} ${idx === active ? styles.mapIframeActive : styles.mapIframeHidden}`}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                        sandbox={GOOGLE_MAPS_SANDBOX}
                        title={`Map of ${item.label}`}
                        onLoad={idx === 0 ? handleMapLoad : undefined}
                    />
                ))}

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
