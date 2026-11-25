'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const DESKTOP_MQ = '(min-width: 1025px)';
const LOOP_START_SEC = 8;
const LOOP_END_SEC = 13.95;

type VideoWithVFC = HTMLVideoElement & {
    requestVideoFrameCallback?: (cb: (now: DOMHighResTimeStamp, meta: { mediaTime: number }) => void) => number;
    cancelVideoFrameCallback?: (handle: number) => void;
};

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
        const vid = videoRef.current as VideoWithVFC | null;
        if (!vid) return;

        vid.defaultMuted = true;
        vid.muted = true;

        const tryPlay = () => {
            vid.play().catch(() => { });
        };

        const getLoopBounds = () => {
            const dur = Number.isFinite(vid.duration) && vid.duration > 0 ? vid.duration : 0;
            if (dur > LOOP_START_SEC + 0.5) {
                return {
                    start: LOOP_START_SEC,
                    end: Math.min(LOOP_END_SEC, dur - 0.05),
                };
            }
            return {
                start: 0,
                end: dur > 0.1 ? dur - 0.05 : LOOP_END_SEC,
            };
        };

        const loopBack = () => {
            const { start } = getLoopBounds();
            vid.currentTime = start;
            tryPlay();
        };

        const onEnded = () => {
            loopBack();
        };

        let vfcHandle: number | null = null;
        let disposed = false;
        const hasVFC = typeof vid.requestVideoFrameCallback === 'function';

        const scheduleVFC = () => {
            if (disposed || !vid.requestVideoFrameCallback) return;
            vfcHandle = vid.requestVideoFrameCallback((_now, meta) => {
                if (disposed) return;
                const { end } = getLoopBounds();
                const t = typeof meta?.mediaTime === 'number' ? meta.mediaTime : vid.currentTime;
                if (t >= end) {
                    loopBack();
                }
                scheduleVFC();
            });
        };

        const onTimeUpdate = () => {
            const { end } = getLoopBounds();
            if (vid.currentTime >= end) {
                loopBack();
            }
        };

        tryPlay();
        vid.addEventListener('canplay', tryPlay);
        vid.addEventListener('ended', onEnded);

        if (hasVFC) {
            scheduleVFC();
        } else {
            vid.addEventListener('timeupdate', onTimeUpdate);
        }

        return () => {
            disposed = true;
            vid.removeEventListener('canplay', tryPlay);
            vid.removeEventListener('ended', onEnded);
            if (hasVFC) {
                if (vfcHandle !== null && vid.cancelVideoFrameCallback) {
                    vid.cancelVideoFrameCallback(vfcHandle);
                }
            } else {
                vid.removeEventListener('timeupdate', onTimeUpdate);
            }
        };
    }, [isDesktop]);

    return (
        <div className={styles.heroVideoCol}>
            {isDesktop && (
                <video
                    ref={videoRef}
                    src="/assets/video/home-hero.mp4"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="/assets/hero/hero-backdrop-mobile.webp"
                    className={styles.heroVideoPlayer}
                />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/hero/hero-backdrop-mobile.webp"
                alt=""
                aria-hidden="true"
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="sync"
                className={styles.heroMobileImg}
            />
            <div className={styles.heroVideoOverlay} aria-hidden="true" />
        </div>
    );
}
