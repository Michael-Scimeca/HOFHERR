'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './FooterMap.module.css';

const GOOGLE_MAPS_SANDBOX = 'allow-scripts allow-same-origin allow-popups';

/* How the map avoids ever showing blank:
   - A static picture of the map is always there, so there is something to see the instant you
     scroll to the footer.
   - The live Google map only starts loading when the footer is getting close (it isn't needed
     before that, and two map embeds are heavy to load on every page).
   - Browsers don't draw an off-screen embed, so "loaded" doesn't mean its tiles are painted.
     The live map therefore stays invisible on top of the picture until it has loaded AND has
     been on screen long enough to draw, then fades in over the picture. */
const NEAR_MARGIN = '150% 0px';
const PAINT_DELAY_MS = 2000;

/* ─── Location data ─── */
const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        short: 'Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        preloaderSrc: '/assets/maps/footer-map-butcher-preloader.jpg',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd+Northfield+IL+60093&travelmode=driving',
    },
    {
        id: 'depot',
        label: 'The Depot',
        short: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        preloaderSrc: '/assets/maps/footer-map-depot-preloader.jpg',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St+Winnetka+IL+60093&travelmode=driving',
    },
] as const;

export default function FooterMap() {
    const [active, setActive] = useState(0);
    const [loadedMaps, setLoadedMaps] = useState<Record<string, boolean>>({});
    const [requestedMaps, setRequestedMaps] = useState<Record<string, boolean>>({});
    const [revealedMaps, setRevealedMaps] = useState<Record<string, boolean>>({});
    const [near, setNear] = useState(false);
    const [inView, setInView] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const readySentRef = useRef(false);
    const loc = LOCATIONS[active];

    // Watch for the footer map getting close to, and actually onto, the screen.
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            setNear(true);
            setInView(true);
            return;
        }
        const nearObserver = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setNear(true);
                    nearObserver.disconnect();
                }
            },
            { rootMargin: NEAR_MARGIN },
        );
        const viewObserver = new IntersectionObserver(
            (entries) => setInView(entries.some((e) => e.isIntersecting)),
            { threshold: 0.2 },
        );
        nearObserver.observe(el);
        viewObserver.observe(el);
        return () => {
            nearObserver.disconnect();
            viewObserver.disconnect();
        };
    }, []);

    // Start loading the live map for whichever location is showing, once the footer is close.
    useEffect(() => {
        if (!near) return;
        setRequestedMaps((prev) => (prev[loc.id] ? prev : { ...prev, [loc.id]: true }));
    }, [near, loc.id]);

    // Fade the live map in only after it has loaded and had time on screen to draw its tiles.
    const activeLoaded = Boolean(loadedMaps[loc.id]);
    const activeRevealed = Boolean(revealedMaps[loc.id]);
    useEffect(() => {
        if (!activeLoaded || activeRevealed || !inView) return;
        const id = loc.id;
        const timer = window.setTimeout(() => setRevealedMaps((prev) => ({ ...prev, [id]: true })), PAINT_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [activeLoaded, activeRevealed, inView, loc.id]);

    const handleMapLoad = useCallback((locationId: string, isFirst: boolean) => {
        setLoadedMaps((prev) => (prev[locationId] ? prev : { ...prev, [locationId]: true }));
        if (isFirst && !readySentRef.current && typeof window !== 'undefined') {
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
                        type="button"
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

            {/* Map container: the static picture is always underneath; the live map fades in on top */}
            <div className={styles.mapWrap} ref={wrapRef}>
                {LOCATIONS.map((item, idx) => {
                    const isActive = idx === active;
                    const isRevealed = Boolean(revealedMaps[item.id]);

                    return (
                        <div
                            key={item.id}
                            className={`${styles.mapLayer} ${isActive ? styles.mapLayerActive : styles.mapLayerHidden}`}
                        >
                            <img
                                src={item.preloaderSrc}
                                alt={`Map preview of ${item.label} — ${item.address}`}
                                loading="eager"
                                decoding="async"
                                className={styles.mapPreloaderImg}
                            />
                            {requestedMaps[item.id] && (
                                <iframe
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`}
                                    className={`${styles.mapIframe} ${isRevealed ? styles.mapIframeLoaded : styles.mapIframeLoading}`}
                                    allowFullScreen
                                    loading="eager"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    sandbox={GOOGLE_MAPS_SANDBOX}
                                    title={`Map of ${item.label}`}
                                    onLoad={() => handleMapLoad(item.id, idx === 0)}
                                />
                            )}
                        </div>
                    );
                })}

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
