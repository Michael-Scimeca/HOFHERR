'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroParallaxAssets.module.css';

const ASSETS = [
    { src: '/home-hero-assets/steak1.png',      cls: styles.a1, speed: 0.18 },
    { src: '/home-hero-assets/steak2.png',      cls: styles.a2, speed: 0.28 },
    { src: '/home-hero-assets/steak3blur.png',  cls: styles.a3, speed: 0.12 },
    { src: '/home-hero-assets/green.png',       cls: styles.a4, speed: 0.35 },
    { src: '/home-hero-assets/green2.png',      cls: styles.a5, speed: 0.22 },
    { src: '/home-hero-assets/green3.png',      cls: styles.a6, speed: 0.30 },
    { src: '/home-hero-assets/green4.png',      cls: styles.a7, speed: 0.15 },
    { src: '/home-hero-assets/salt1.png',       cls: styles.a8, speed: 0.20 },
    { src: '/home-hero-assets/salt2.png',       cls: styles.a9, speed: 0.25 },
];

export default function HeroParallaxAssets() {
    const refs = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                refs.current.forEach((el, i) => {
                    if (!el) return;
                    el.style.transform = `translateY(${y * ASSETS[i].speed}px)`;
                });
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    }, []);

    return (
        <div className={styles.root} aria-hidden="true">
            {ASSETS.map(({ src, cls }, i) => (
                <img
                    key={src}
                    ref={el => { refs.current[i] = el; }}
                    src={src}
                    alt=""
                    className={`${styles.asset} ${cls}`}
                    draggable={false}
                />
            ))}
        </div>
    );
}
