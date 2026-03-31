'use client';

import { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
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

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

/* Shared loader promise so Google Maps JS loads only once */
let loadPromise: Promise<void> | null = null;
let optionsSet = false;
function ensureLoaded(): Promise<void> {
    if (!loadPromise) {
        if (!optionsSet) {
            setOptions({ key: apiKey, v: 'weekly' });
            optionsSet = true;
        }
        loadPromise = importLibrary('maps').then(() => {});
    }
    return loadPromise!;
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
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const infoRef = useRef<google.maps.InfoWindow | null>(null);

    /* ── Init map ── */
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        let cancelled = false;

        ensureLoaded().then(() => {
            if (cancelled || !mapContainer.current) return;

            const map = new google.maps.Map(mapContainer.current, {
                center: { lat, lng },
                zoom,
                styles: MAP_STYLES,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
                scrollwheel: false,
            });

            const sz = iconType === 'depot' ? 72 : 56;
            const marker = new google.maps.Marker({
                map,
                position: { lat, lng },
                title: label,
                icon: {
                    url: iconType === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png',
                    scaledSize: new google.maps.Size(sz, sz),
                    anchor: new google.maps.Point(sz / 2, sz),
                },
            });

            const info = new google.maps.InfoWindow({
                content: `<div style="font-family:Inter,sans-serif;padding:8px 4px;">
                    <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${label}</div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#c5a255;text-decoration:underline;">${address}</a>
                </div>`,
            });

            marker.addListener('click', () => info.open({ anchor: marker, map }));

            mapRef.current = map;
            markerRef.current = marker;
            infoRef.current = info;
        });

        return () => {
            cancelled = true;
            if (markerRef.current) markerRef.current.setMap(null);
            mapRef.current = null;
            markerRef.current = null;
            infoRef.current = null;
        };
    }, []);

    /* ── Update on location switch ── */
    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        const info = infoRef.current;
        if (!map || !marker) return;

        map.panTo({ lat, lng });
        marker.setPosition({ lat, lng });
        marker.setTitle(label);

        const sz = iconType === 'depot' ? 72 : 56;
        marker.setIcon({
            url: iconType === 'depot' ? '/icons/depot-pin.png' : '/icons/butcher-pin.png',
            scaledSize: new google.maps.Size(sz, sz),
            anchor: new google.maps.Point(sz / 2, sz),
        });

        if (info) {
            info.setContent(`<div style="font-family:Inter,sans-serif;padding:8px 4px;">
                <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${label}</div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#c5a255;text-decoration:underline;">${address}</a>
            </div>`);
        }
    }, [lat, lng, label, address, iconType]);

    return (
        <div className={`${styles.container} ${className || ''}`} style={{ height }}>
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
