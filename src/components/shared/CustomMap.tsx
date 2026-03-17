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
}

export default function CustomMap({ 
    lat, 
    lng, 
    label, 
    address, 
    zoom = 15,
    height = '100%',
    className 
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

            /* Warm-toned Stadia Alidade Smooth tile layer */
            L.tileLayer(
                'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
                { maxZoom: 19 }
            ).addTo(map);

            /* Add zoom control */
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            /* Custom SVG pin marker */
            const icon = L.divIcon({
                className: styles.customPin,
                html: `<svg viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 36 20 36s20-22 20-36C40 8.954 31.046 0 20 0z" fill="#D14836"/>
                    <circle cx="20" cy="19" r="8" fill="#fff"/>
                    <circle cx="20" cy="19" r="4" fill="#D14836"/>
                </svg>`,
                iconSize: [40, 56],
                iconAnchor: [20, 56],
                popupAnchor: [0, -56],
            });

            const marker = L.marker([lat, lng], { icon }).addTo(map);
            marker.bindPopup(
                `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#2e2a25;padding:4px 0;">${label}</div>
                 <div style="font-size:12px;color:#6a6055;">${address}</div>`,
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
            `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#2e2a25;padding:4px 0;">${label}</div>
             <div style="font-size:12px;color:#6a6055;">${address}</div>`
        );
    }, [lat, lng, label, address, zoom]);

    return (
        <div className={`${styles.container} ${className || ''}`} style={{ height }}>
            <div ref={mapContainer} className={styles.canvas} />
            <div className={styles.overlay} />
        </div>
    );
}
