'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const DESKTOP_MQ = '(min-width: 1025px)';

export default function HeroBackdropVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_MQ);
        const sync = () => setIsDesktop(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;
        const vid = videoRef.current;
        if (!vid) return;
        vid.defaultMuted = true;
        vid.muted = true;
        const tryPlay = () => {
            vid.play().catch(() => {});
        };
        tryPlay();
        vid.addEventListener('canplay', tryPlay);
        return () => vid.removeEventListener('canplay', tryPlay);
    }, [isDesktop]);

    return (
        <div className={styles.heroVideoCol}>
            {isDesktop && (
                <video
                    ref={videoRef}
                    src="/assets/video/3.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/assets/hero/hero-backdrop-mobile.jpg"
                    className={styles.heroVideoPlayer}
                />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/hero/hero-backdrop-mobile.jpg"
                alt=""
                aria-hidden="true"
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="sync"
                className={styles.heroMobileImg}
            />
        </div>
    );
}

