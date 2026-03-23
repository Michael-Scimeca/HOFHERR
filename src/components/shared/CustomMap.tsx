'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomMap.module.css';

interface CustomMapProps {
    lat: number;
    lng: number;
    label: string;
    address: string;
    zoom?: number;
    height?: string;
    className?: string;
    iconType?: 'butcher' | 'depot';
    hideBottomBar?: boolean;
}

/* ─── Pin SVGs per location type ─── */
function getPinHtml(type: 'butcher' | 'depot' = 'butcher'): string {
    if (type === 'depot') {
        // Train / depot icon
        return `<svg viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 0C9.85 0 0 9.85 0 22c0 15.4 22 38 22 38S44 37.4 44 22C44 9.85 34.15 0 22 0z" fill="#CC0E1D"/>
            <!-- Train body -->
            <rect x="12" y="11" width="20" height="14" rx="3" fill="#fff"/>
            <!-- Windows -->
            <rect x="14" y="13" width="6" height="5" rx="1" fill="#CC0E1D"/>
            <rect x="24" y="13" width="6" height="5" rx="1" fill="#CC0E1D"/>
            <!-- Base stripe -->
            <rect x="12" y="25" width="20" height="2" rx="1" fill="#fff" opacity="0.7"/>
            <!-- Wheels -->
            <circle cx="16" cy="30" r="2.5" fill="#fff"/>
            <circle cx="28" cy="30" r="2.5" fill="#fff"/>
        </svg>`;
    }
    // Butcher shop — cleaver icon
    return `<svg viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 0C9.85 0 0 9.85 0 22c0 15.4 22 38 22 38S44 37.4 44 22C44 9.85 34.15 0 22 0z" fill="#CC0E1D"/>
        <!-- Cleaver blade -->
        <rect x="14" y="12" width="16" height="12" rx="2" fill="#fff"/>
        <!-- Blade bevel -->
        <path d="M14 22 L30 22 L30 24 Z" fill="#F2F2F2" opacity="0.4"/>
        <!-- Handle -->
        <rect x="20" y="24" width="4" height="8" rx="1.5" fill="#fff"/>
        <!-- Rivet dots -->
        <circle cx="17" cy="15" r="1.2" fill="#CC0E1D"/>
        <circle cx="17" cy="19" r="1.2" fill="#CC0E1D"/>
    </svg>`;
}

export default function CustomMap({ 
    lat, 
    lng, 
    label, 
    address, 
    zoom = 15,
    height = '100%',
    className,
    iconType = 'butcher',
    hideBottomBar = false,
}: CustomMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        let cancelled = false;

        (async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            if (cancelled || !mapContainer.current) return;

            const map = L.map(mapContainer.current, {
                center: [lat, lng],
                zoom: zoom,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false,
                dragging: true,
                doubleClickZoom: true,
            });

            /* ── Stamen Toner tiles — pure B&W so CSS filter tints perfectly ── */
            L.tileLayer(
                'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
                { maxZoom: 19 }
            ).addTo(map);

            /* Add zoom control */
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            /* Custom SVG pin — varies by location type */
            const icon = L.divIcon({
                className: styles.customPin,
                html: getPinHtml(iconType),
                iconSize: [44, 60],
                iconAnchor: [22, 60],
                popupAnchor: [0, -60],
            });

            const marker = L.marker([lat, lng], { icon }).addTo(map);
            marker.bindPopup(
                `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#F2F2F2;padding:4px 0;">${label}</div>
                 <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#A8905F;text-decoration:underline;cursor:pointer;">${address}</a>`,
                { closeButton: false, className: styles.customPopup }
            );

            mapRef.current = map;
            markerRef.current = marker;

            setTimeout(() => map.invalidateSize(), 200);
        })();

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    /* Update on coordinate change */
    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker) return;

        map.flyTo([lat, lng], zoom, { duration: 1.2 });
        marker.setLatLng([lat, lng]);
        marker.setPopupContent(
            `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#ffffff;padding:4px 0;">${label}</div>
             <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:rgba(255,255,255,0.7);text-decoration:underline;cursor:pointer;">${address}</a>`
        );
    }, [lat, lng, label, address, zoom]);

    return (
        <div className={`${styles.container} ${className || ''}`} style={{ height }}>
            <div ref={mapContainer} className={styles.canvas} />
            <div className={styles.overlay} />
            {!hideBottomBar && (
                <div className={styles.bottomBar}>
                    <span className={styles.bottomLabel}>{label}</span>
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.bottomLink}
                    >
                        Get Map Direction
                    </a>
                </div>
            )}
        </div>
    );
}
