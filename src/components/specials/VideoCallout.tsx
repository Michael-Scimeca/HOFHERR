'use client';

import { useRef, useEffect } from 'react';
import styles from './VideoCallout.module.css';

interface VideoCalloutProps {
    image: string;
    video: string;
    alt: string;
    title?: string | null;
    sub?: string | null;
}

export default function VideoCallout({ image, video, alt, title, sub }: VideoCalloutProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef   = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const vid  = videoRef.current;
        const wrap = wrapperRef.current;
        if (!vid || !wrap) return;

        // Autoplay
        vid.play().catch(e => console.error('Autoplay muted prevented:', e));

        // Parallax scroll
        let rafId: number;
        const update = () => {
            if (window.innerWidth <= 1024) {
                vid.style.transform = 'none';
                return;
            }
            const rect     = wrap.getBoundingClientRect();
            const vh       = window.innerHeight;
            const raw      = 1 - rect.bottom / (vh + rect.height);
            const progress = Math.max(0, Math.min(1, raw));
            const shift    = (progress - 0.5) * 30; // ±15%
            vid.style.transform = `translateY(${shift}%)`;
        };

        const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <video
                ref={videoRef}
                src={video}
                poster={image}
                muted
                playsInline
                autoPlay
                loop
                className={styles.video}
            >
                <img src={image} alt={alt} />
            </video>
            {(title || sub) && (
                <div className={styles.overlay}>
                    {title && <div className={styles.title}>{title}</div>}
                    {sub && (
                        <div className={styles.sub}>
                            {sub.split('\n').filter(Boolean).map((line, i) => (
                                <span key={i} className={styles.subLine}>{line}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
