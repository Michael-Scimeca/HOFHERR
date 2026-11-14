'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './FooterMap.module.css';
import {
    loadGoogleMaps,
    onGoogleMapsAuthFailure,
    createMapPinOverlay,
    GOOGLE_MAPS_KEY,
    type MapPinOverlayHandle,
} from '@/lib/googleMapsLoader';
import { HOFHERR_MAP_STYLE } from '@/lib/mapTheme';

const GOOGLE_MAPS_SANDBOX = 'allow-scripts allow-same-origin allow-popups';

/* Preload the brand-themed Google Map well ahead of the footer so tiles and custom pins
   are already rendered on the #0b0b0b canvas by the time the user scrolls down — without
   showing any legacy Google Maps preloader screenshot or artificial delay. */
const NEAR_MARGIN = '250% 0px';

/* ─── Location data ─── */
const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        short: 'Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        pin: '/icons/butcher-pin.png',
        pinSize: 56,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd+Northfield+IL+60093&travelmode=driving',
    },
    {
        id: 'depot',
        label: 'The Depot',
        short: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        pin: '/icons/depot-pin.png',
        pinSize: 72,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St+Winnetka+IL+60093&travelmode=driving',
    },
] as const;

/* ─── Brand-themed live map (Google Maps JS + HOFHERR_MAP_STYLE from src/lib/mapTheme.ts) ─── */
export interface ThemedMapProps {
    lat: number;
    lng: number;
    label: string;
    pin: string;
    pinSize: number;
    directionsUrl: string;
    className: string;
    onReady: () => void;
    onFail: () => void;
}

function mountThemedGoogleMap(
    container: HTMLDivElement,
    { lat, lng, label, pin, pinSize, directionsUrl, onReady, onFail }: Omit<ThemedMapProps, 'className'>
): () => void {
    let cancelled = false;
    let pinOverlay: MapPinOverlayHandle | null = null;
    let tilesListener: google.maps.MapsEventListener | null = null;

    loadGoogleMaps()
        .then(() => {
            if (cancelled) return;

            const map = new google.maps.Map(container, {
                center: { lat, lng },
                zoom: 15,
                styles: HOFHERR_MAP_STYLE,
                backgroundColor: '#0b0b0b',
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
                gestureHandling: 'cooperative',
                keyboardShortcuts: false,
            });

            pinOverlay = createMapPinOverlay({
                map,
                position: { lat, lng },
                title: `${label} — get directions`,
                iconUrl: pin,
                size: pinSize,
                onClick: () => window.open(directionsUrl, '_blank', 'noopener,noreferrer'),
            });

            tilesListener = google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
                if (!cancelled) onReady();
            });
        })
        .catch(() => {
            if (!cancelled) onFail();
        });

    return () => {
        cancelled = true;
        pinOverlay?.destroy();
        tilesListener?.remove();
    };
}

export function ThemedMap({ lat, lng, label, pin, pinSize, directionsUrl, className, onReady, onFail }: ThemedMapProps) {
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!el.current) return;
        return mountThemedGoogleMap(el.current, {
            lat,
            lng,
            label,
            pin,
            pinSize,
            directionsUrl,
            onReady,
            onFail,
        });
        // Location never changes for a mounted map — one instance per location.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={el} className={className} aria-label={`Map of ${label}`} role="region" />;
}

export default function FooterMap() {
    const [active, setActive] = useState(0);
    const [loadedMaps, setLoadedMaps] = useState<Record<string, boolean>>({});
    const [requestedMaps, setRequestedMaps] = useState<Record<string, boolean>>({});
    const [near, setNear] = useState(false);
    /* Themed map needs a working Google Maps key; without one (or if Google rejects it) fall back to the plain embed. */
    const [useThemedMap, setUseThemedMap] = useState(Boolean(GOOGLE_MAPS_KEY));
    const wrapRef = useRef<HTMLDivElement>(null);
    const readySentRef = useRef(false);
    const loc = LOCATIONS[active];

    // Watch for the footer map getting within NEAR_MARGIN so tiles are warm before scrolling into view.
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            setNear(true);
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
        nearObserver.observe(el);
        return () => {
            nearObserver.disconnect();
        };
    }, []);

    useEffect(() => onGoogleMapsAuthFailure(() => setUseThemedMap(false)), []);

    // Start loading the live themed map once the footer approaches, and warm both locations.
    useEffect(() => {
        if (!near) return;
        setRequestedMaps((prev) =>
            prev.butcher && prev.depot ? prev : { ...prev, butcher: true, depot: true }
        );
    }, [near]);

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
                {LOCATIONS.map((l, i) => {
                    const isDepot = l.id === 'depot';
                    const isActive = i === active;
                    return (
                        <button
                            key={l.id}
                            type="button"
                            className={`${styles.toggleBtn} ${isDepot ? styles.toggleBtnDepot : ''} ${isActive ? (isDepot ? styles.toggleActiveDepot : styles.toggleActive) : ''}`}
                            onClick={() => setActive(i)}
                        >
                            {l.label}
                        </button>
                    );
                })}
            </div>

            {/* Always-visible address */}
            <a href={loc.directionsUrl} target="_blank" rel="noreferrer" className={styles.addressBar}>
                <span className={styles.addressIcon}>📍</span>
                <span className={styles.addressText}>{loc.address}</span>
            </a>

            {/* Map container: renders only the Hofherr brand-themed map over #0b0b0b */}
            <div className={styles.mapWrap} ref={wrapRef}>
                {LOCATIONS.map((item, idx) => {
                    const isActive = idx === active;
                    const isLoaded = Boolean(loadedMaps[item.id]);

                    return (
                        <div
                            key={item.id}
                            className={`${styles.mapLayer} ${isActive ? styles.mapLayerActive : styles.mapLayerHidden}`}
                        >
                            {requestedMaps[item.id] && useThemedMap && (
                                <ThemedMap
                                    lat={item.lat}
                                    lng={item.lng}
                                    label={item.label}
                                    pin={item.pin}
                                    pinSize={item.pinSize}
                                    directionsUrl={item.directionsUrl}
                                    className={`${styles.mapThemed} ${isLoaded ? styles.mapIframeLoaded : styles.mapIframeLoading}`}
                                    onReady={() => handleMapLoad(item.id, idx === 0)}
                                    onFail={() => setUseThemedMap(false)}
                                />
                            )}
                            {requestedMaps[item.id] && !useThemedMap && (
                                <iframe
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`}
                                    className={`${styles.mapIframe} ${isLoaded ? styles.mapIframeLoaded : styles.mapIframeLoading}`}
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
