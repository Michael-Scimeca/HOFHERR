'use client';

import { useRef, useEffect, useState } from 'react';
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '120px 0px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        const vid = videoRef.current;
        if (!vid) return;
        vid.play().catch(() => { });
    }, [inView]);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            {inView ? (
                <video
                    ref={videoRef}
                    src={video}
                    poster={image}
                    preload="metadata"
                    muted
                    playsInline
                    autoPlay
                    loop
                    className={styles.video}
                />
            ) : (
                /* Static poster image keeps 4:3 height before video loads on scroll */
                <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    className={styles.posterImg}
                />
            )}
            {(title || sub) && (
                <div className={styles.overlay}>
                    {title && <div className={styles.title}>{title}</div>}
                    {sub && (
                        <div className={styles.sub}>
                            {
                                    sub.split('\n').filter(Boolean).map((line) => (
                                        <span key={line} className={styles.subLine}>{line}</span>
                                    ))
                                }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
