'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HeroParallaxAssets.module.css';
import { assetEditorBus } from './HeroAssetEditor';

const SRCS = [
    '/home-hero-assets/steak1.png',
    '/home-hero-assets/steak2.png',
    '/home-hero-assets/steak3blur.png',
    '/home-hero-assets/green.png',
    '/home-hero-assets/green2.png',
    '/home-hero-assets/green3.png',
    '/home-hero-assets/green4.png',
    '/home-hero-assets/salt1.png',
    '/home-hero-assets/salt2.png',
];

const SPEEDS = [0.02, 0.025, 0.018, 0.022, 0.02, 0.023, 0.019, 0.021, 0.024];
const ROT_SPEEDS = [0.005, -0.004, 0.003, -0.005, 0.004, -0.003, 0.005, -0.004, 0.003]; // degrees per pixel of scroll (very gentle)

export const ASSET_DEFAULTS = [
    { top: 30, left: 50, rotate: 0, scale: 1.0, opacity: 1.00, width: 120, zIndex: 0 },
    { top: 35, left: 50, rotate: 0,  scale: 1.0, opacity: 0.90, width: 110,  zIndex: 0 },
    { top: 40, left: 50, rotate: 0,   scale: 1.0, opacity: 0.70, width: 100,  zIndex: 0 },
    { top: 40.9, left: 31.4, rotate: 48,  scale: 3.3, opacity: 1.00, width: 42,  zIndex: 0 },
    { top: 27.3, left: 34.3, rotate: 5,   scale: 1.0, opacity: 0.88, width: 85,  zIndex: 0 },
    { top: 45.6, left: 38.5, rotate: -8,  scale: 1.0, opacity: 0.80, width: 60,  zIndex: 0 },
    { top: 32.7, left: 19.5, rotate: -34.8, scale: 1.0, opacity: 0.75, width: 35,  zIndex: 0 },
    { top: 35.8, left: 40.2, rotate: 8,   scale: 1.0, opacity: 0.70, width: 75,  zIndex: 0 },
    { top: 46.6, left: 42.3, rotate: -5,  scale: 1.0, opacity: 0.75, width: 38,  zIndex: 0 },
];

export type Asset = typeof ASSET_DEFAULTS[0];

const STORAGE_KEY = 'hofherr_asset_editor';

export default function HeroParallaxAssets() {
    const scrollRefs = useRef<(HTMLImageElement | null)[]>([]);

    const [assets, setAssets] = useState<Asset[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) return JSON.parse(saved);
            } catch {}
        }
        return assetEditorBus.current ?? ASSET_DEFAULTS.map(d => ({ ...d }));
    });

    useEffect(() => {
        const handler = (a: Asset[]) => setAssets(a);
        assetEditorBus.listeners.add(handler);
        return () => { assetEditorBus.listeners.delete(handler); };
    }, []);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                scrollRefs.current.forEach((el, i) => {
                    if (!el) return;
                    const a = assets[i];
                    const extraRotate = y * ROT_SPEEDS[i];
                    el.style.transform = `rotate(${a.rotate + extraRotate}deg) scale(${a.scale}) translateY(${y * SPEEDS[i]}px)`;
                });
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    }, [assets]);

    return (
        // Spans the full hero section — positioned relative to the hero `position:relative` parent
        <div
            data-asset-editor-root
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            {SRCS.map((src, i) => {
                const a = assets[i];
                const imgStyle: React.CSSProperties = {
                    position: 'absolute',
                    top: `${a.top}%`,
                    left: `${a.left}%`,
                    width: `${a.width}px`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    willChange: 'transform',
                    opacity: a.opacity,
                    ...(i === 2 ? { filter: 'blur(4px)' } : {}),
                    ...(a.zIndex !== undefined ? { zIndex: a.zIndex } : {}),
                };
                return (
                    <img
                        key={src}
                        ref={el => { scrollRefs.current[i] = el; }}
                        src={src}
                        alt=""
                        draggable={false}
                        className={styles.asset}
                        style={imgStyle}
                    />
                );
            })}
        </div>

    );
}
