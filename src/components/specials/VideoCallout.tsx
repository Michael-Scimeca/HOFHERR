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
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        vid.play().catch(() => {});
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* Static image in normal flow — guarantees the box always has height */}
            <img
                src={image}
                alt={alt}
                className={styles.posterImg}
            />
            {/* Video overlays the image */}
            <video
                ref={videoRef}
                src={video}
                poster={image}
                muted
                playsInline
                autoPlay
                loop
                className={styles.video}
            />
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
