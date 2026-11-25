'use client';

import { useEffect, useRef } from 'react';

interface ViewportVideoProps {
    src: string;
    className?: string;
    poster?: string;
}

/**
 * Ambient looping video that automatically pauses when scrolled out of view
 * or when the browser tab is hidden, freeing GPU video-decode resources on mobile.
 */
export default function ViewportVideo({ src, className, poster }: ViewportVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.defaultMuted = true;
        video.muted = true;

        let inView = false;

        const syncPlayState = () => {
            if (inView && !document.hidden) {
                void video.play().catch(() => {});
            } else if (!video.paused) {
                video.pause();
            }
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                inView = Boolean(entry?.isIntersecting);
                syncPlayState();
            },
            { rootMargin: '120px 0px' }
        );
        io.observe(video);

        document.addEventListener('visibilitychange', syncPlayState);

        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', syncPlayState);
            video.pause();
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={className}
            aria-hidden="true"
        />
    );
}

