'use client';

import { useRef, useState } from 'react';
import styles from '../app/our-story/page.module.css';

export default function HoverVideo({ src, caption, poster }: { src: string; caption: string; poster?: string }) {
    const ref = useRef<HTMLVideoElement>(null);
    const [ended, setEnded] = useState(false);

    return (
        <div
            className={styles.heritageItem}
            onMouseEnter={() => {
                if (!ended) ref.current?.play();
            }}
            onMouseLeave={() => {
                if (ref.current && !ended) {
                    ref.current.pause();
                }
            }}
        >
            <video
                ref={ref}
                className={styles.heritageImg}
                muted
                playsInline
                preload="metadata"
                src={src}
                poster={poster}
                onEnded={() => setEnded(true)}
                onLoadedMetadata={() => {
                    if (ref.current) ref.current.currentTime = 0.001;
                }}
                style={{ objectPosition: 'top' }}
            />
            <p className={styles.heritageCaption}>{caption}</p>
        </div>
    );
}
