'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import {
    loadGoogleMaps,
    createMapPinOverlay,
    type MapPinOverlayHandle,
} from '@/lib/googleMapsLoader';
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

/* ── Dark-themed map style ── */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6b6b6b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#333' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d8a' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#222' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#5a5a5a' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e2e1e' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#252525' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#333' }] },
];

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
    const mapRef = useRef<google.maps.Map | null>(null);
    const pinRef = useRef<MapPinOverlayHandle | null>(null);
    const infoRef = useRef<google.maps.InfoWindow | null>(null);

    const latestInitRef = useRef({ lat, lng, zoom, iconType, label, address });
    useEffect(() => {
        latestInitRef.current = { lat, lng, zoom, iconType, label, address };
    }, [lat, lng, zoom, iconType, label, address]);

    /* ── Init map ── */
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        let cancelled = false;

        loadGoogleMaps().then(() => {
            if (cancelled || !mapContainer.current) return;
            const init = latestInitRef.current;

            const map = new google.maps.Map(mapContainer.current, {
                center: { lat: init.lat, lng: init.lng },
                zoom: init.zoom,
                styles: MAP_STYLES,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
                scrollwheel: false,
            });

            const sz = init.iconType === 'depot' ? 72 : 56;
            const info = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, -sz),
                position: { lat: init.lat, lng: init.lng },
                content: `<div style="font-family:Inter,sans-serif;padding:8px 4px;">
                    <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${init.label}</div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(init.address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#c5a255;text-decoration:underline;">${init.address}</a>
                </div>`,
            });

            const pinOverlay = createMapPinOverlay({
                map,
                position: { lat: init.lat, lng: init.lng },
                title: init.label,
                iconUrl: init.iconType === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png',
                size: sz,
                onClick: () => {
                    const cur = latestInitRef.current;
                    const curSz = cur.iconType === 'depot' ? 72 : 56;
                    info.setOptions({ pixelOffset: new google.maps.Size(0, -curSz) });
                    info.setPosition({ lat: cur.lat, lng: cur.lng });
                    info.open({ map });
                },
            });

            mapRef.current = map;
            pinRef.current = pinOverlay;
            infoRef.current = info;
        });

        return () => {
            cancelled = true;
            pinRef.current?.destroy();
            mapRef.current = null;
            pinRef.current = null;
            infoRef.current = null;
        };
    }, []);

    /* ── Update on location switch ── */
    useEffect(() => {
        const map = mapRef.current;
        const pinOverlay = pinRef.current;
        const info = infoRef.current;
        if (!map || !pinOverlay) return;

        const sz = iconType === 'depot' ? 72 : 56;
        map.panTo({ lat, lng });
        pinOverlay.update({
            position: { lat, lng },
            title: label,
            iconUrl: iconType === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png',
            size: sz,
        });

        if (info) {
            info.setOptions({ pixelOffset: new google.maps.Size(0, -sz) });
            info.setPosition({ lat, lng });
            info.setContent(`<div style="font-family:Inter,sans-serif;padding:8px 4px;">
                <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${label}</div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#c5a255;text-decoration:underline;">${address}</a>
            </div>`);
        }
    }, [lat, lng, label, address, iconType]);

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ '--custom-map-h': height } as CSSProperties}
        >
            <div ref={mapContainer} className={styles.canvas} />
            {!hideBottomBar && (
                <div className={styles.bottomBar}>
                    <span className={styles.bottomLabel}>{label}</span>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bottomLink}
                    >
                        Get Directions
                    </a>
                </div>
            )}
        </div>
    );
}
