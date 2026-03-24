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
    // Always holds the LATEST iconType, even if map isn't loaded yet
    const iconTypeRef = useRef(iconType);
    iconTypeRef.current = iconType;

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        let cancelled = false;

        (async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            if (cancelled || !mapContainer.current) return;

            const map = L.map(mapContainer.current, {
                center: [lat, lng],
                zoom,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false,
                dragging: true,
                doubleClickZoom: true,
            });

            L.tileLayer(
                'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
                { maxZoom: 19 }
            ).addTo(map);

            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Use iconTypeRef.current so we get whatever the user has selected NOW
            // (they may have clicked a tab while leaflet was still loading)
            const makeIcon = (type: string) => {
                const url = type === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png';
                const sz = type === 'depot' ? 72 : 56;
                return L.divIcon({
                    className: '',
                    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:url('${url}') center/cover no-repeat;box-shadow:0 3px 10px rgba(0,0,0,0.5);border:3px solid #CC0E1D;"></div>`,
                    iconSize: [sz, sz],
                    iconAnchor: [sz / 2, sz],
                    popupAnchor: [0, -sz],
                });
            };

            const marker = L.marker([lat, lng], { icon: makeIcon(iconTypeRef.current) }).addTo(map);
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
                markerRef.current = null;
            }
        };
    }, []);

    // Fires when user switches tabs — updates icon, position, popup
    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker) return; // map not ready yet; init effect will use iconTypeRef.current

        (async () => {
            const L = (await import('leaflet')).default;
            const type = iconTypeRef.current;
            const url = type === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png';
            const sz = type === 'depot' ? 72 : 56;
            marker.setIcon(L.divIcon({
                className: '',
                html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:url('${url}') center/cover no-repeat;box-shadow:0 3px 10px rgba(0,0,0,0.5);border:3px solid #CC0E1D;"></div>`,
                iconSize: [sz, sz],
                iconAnchor: [sz / 2, sz],
                popupAnchor: [0, -sz],
            }));
            map.flyTo([lat, lng], zoom, { duration: 1.2 });
            marker.setLatLng([lat, lng]);
            marker.setPopupContent(
                `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#fff;padding:4px 0;">${label}</div>
                 <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:rgba(255,255,255,0.7);text-decoration:underline;cursor:pointer;">${address}</a>`
            );
        })();
    }, [lat, lng, label, address, zoom, iconType]);

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
