'use client';

import { useRef, useState, useEffect } from 'react';
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
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Autoplay muted prevented:", e));
        }
    }, []);

    return (
        <div className={styles.wrapper}>
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
