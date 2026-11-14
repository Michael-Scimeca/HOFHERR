'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
    loadGoogleMaps,
    createMapPinOverlay,
    GOOGLE_MAPS_KEY,
    type MapPinOverlayHandle,
} from '@/lib/googleMapsLoader';
import { HOFHERR_MAP_STYLE, MAP_TOKENS } from '@/lib/mapTheme';
import styles from './page.module.css';

const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        icon: '/icons/butcher-pin.png',
        size: 56,
    },
    {
        id: 'depot',
        label: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        icon: '/icons/depot-pin.png',
        size: 72,
    },
] as const;

const SWATCHES: { name: string; hex: string; use: string }[] = [
    { name: '--red', hex: MAP_TOKENS.red, use: 'Accents' },
    { name: '--red-dark', hex: MAP_TOKENS.redDark, use: 'Water labels' },
    { name: '--gold', hex: MAP_TOKENS.gold, use: 'Expressways' },
    { name: '--gold-dark', hex: MAP_TOKENS.goldDark, use: 'Highways, rail, borders' },
    { name: '--gold-light', hex: MAP_TOKENS.goldLight, use: 'Highway labels' },
    { name: '--light', hex: MAP_TOKENS.light, use: 'Town names' },
    { name: '--text-3', hex: MAP_TOKENS.text3, use: 'Labels' },
    { name: '--dark', hex: MAP_TOKENS.dark, use: 'Land, label halo' },
];

const apiKey = GOOGLE_MAPS_KEY;

export default function MapTestClient() {
    const el = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [themed, setThemed] = useState(true);
    const [active, setActive] = useState<string>('both');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(
        apiKey ? null : 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set — add it to .env.local and restart the dev server.',
    );

    useEffect(() => {
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        };
    }, []);

    /* ── Init ── */
    useEffect(() => {
        if (!el.current || mapRef.current) return;
        let cancelled = false;
        const overlays: MapPinOverlayHandle[] = [];

        loadGoogleMaps()
            .then(() => {
                if (cancelled || !el.current) return;

                const map = new google.maps.Map(el.current, {
                    center: { lat: 42.106, lng: -87.7537 },
                    zoom: 14,
                    styles: HOFHERR_MAP_STYLE,
                    backgroundColor: '#0b0b0b',
                    disableDefaultUI: true,
                    zoomControl: true,
                    zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
                });

                const info = new google.maps.InfoWindow();
                LOCATIONS.forEach((loc) => {
                    const pinOverlay = createMapPinOverlay({
                        map,
                        position: { lat: loc.lat, lng: loc.lng },
                        title: loc.label,
                        iconUrl: loc.icon,
                        size: loc.size,
                        onClick: () => {
                            info.setOptions({
                                pixelOffset: new google.maps.Size(0, -loc.size),
                            });
                            info.setPosition({ lat: loc.lat, lng: loc.lng });
                            info.setContent(
                                `<div style="font-family:var(--font-body),sans-serif;padding:8px 4px;">
                                    <div style="font-size:13px;font-weight:700;color:${MAP_TOKENS.light};margin-bottom:4px;">${loc.label}</div>
                                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:${MAP_TOKENS.goldLight};text-decoration:underline;">${loc.address}</a>
                                </div>`,
                            );
                            info.open({ map });
                        },
                    });
                    overlays.push(pinOverlay);
                });

                mapRef.current = map;
            })
            .catch((e) => setError(String(e?.message || e)));

        return () => {
            cancelled = true;
            overlays.forEach((o) => o.destroy());
        };
    }, []);

    /* ── Theme toggle ── */
    useEffect(() => {
        mapRef.current?.setOptions({ styles: themed ? HOFHERR_MAP_STYLE : [] });
    }, [themed]);

    /* ── Location focus ── */
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        if (active === 'both') {
            map.panTo({ lat: 42.106, lng: -87.7537 });
            map.setZoom(14);
        } else {
            const loc = LOCATIONS.find((l) => l.id === active);
            if (!loc) return;
            map.panTo({ lat: loc.lat, lng: loc.lng });
            map.setZoom(16);
        }
    }, [active]);

    const copyJson = async () => {
        await navigator.clipboard.writeText(JSON.stringify(HOFHERR_MAP_STYLE, null, 2));
        setCopied(true);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopied(false), 1600);
    };

    return (
        <main className={styles.page}>
            <div ref={el} className={styles.map} />

            <aside className={styles.panel}>
                <p className={styles.eyebrow}>Dev · Map Test</p>
                <h1 className={styles.title}>Hofherr Map Theme</h1>

                <div className={styles.group}>
                    <span className={styles.groupLabel}>Style</span>
                    <div className={styles.segment}>
                        <button type="button" className={themed ? styles.on : ''} onClick={() => setThemed(true)}>Brand</button>
                        <button type="button" className={!themed ? styles.on : ''} onClick={() => setThemed(false)}>Google default</button>
                    </div>
                </div>

                <div className={styles.group}>
                    <span className={styles.groupLabel}>Focus</span>
                    <div className={styles.segment}>
                        <button type="button" className={active === 'both' ? styles.on : ''} onClick={() => setActive('both')}>Both</button>
                        {LOCATIONS.map((l) => (
                            <button type="button" key={l.id} className={active === l.id ? styles.on : ''} onClick={() => setActive(l.id)}>
                                {l.id === 'butcher' ? 'Butcher Shop' : 'Depot'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.group}>
                    <span className={styles.groupLabel}>Tokens used</span>
                    <ul className={styles.swatches}>
                        {SWATCHES.map((s) => (
                            <li key={s.name}>
                                <i style={{ '--swatch-bg': s.hex } as CSSProperties} />
                                <code>{s.name}</code>
                                <span>{s.use}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type="button" className={styles.copy} onClick={copyJson}>
                    {copied ? 'Copied' : 'Copy Snazzy Maps JSON'}
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </aside>
        </main>
    );
}
