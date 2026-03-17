'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import styles from './HeroVideo.module.css';

/* ── Config ── */
const VIDEO_ID = 'Q1IwML8BKdU';
const START_SEC = 440;   // 7:20
const END_SEC = 740;     // 12:20
const DURATION = END_SEC - START_SEC;

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT: typeof YT;
    }
}

function fmt(sec: number) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HeroVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YT.Player | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [volume, setVolume] = useState(80);
    const [muted, setMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetHideTimer = useCallback(() => {
        setShowControls(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }, []);

    /* Poll: update progress + enforce boundaries */
    const startPolling = useCallback(() => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            const p = playerRef.current;
            if (!p?.getCurrentTime) return;
            const t = p.getCurrentTime();

            if (t >= END_SEC || t < START_SEC) {
                p.seekTo(START_SEC, true);
                p.pauseVideo();
                setIsPlaying(false);
                setProgress(1);
                setElapsed(DURATION);
                return;
            }

            const e = t - START_SEC;
            setElapsed(e);
            setProgress(Math.min(e / DURATION, 1));
        }, 200);
    }, []);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    /* Load YouTube IFrame API — only after user clicks poster */
    useEffect(() => {
        if (!hasStarted) return;
        const loadAndInit = () => {
            if (window.YT?.Player) {
                createPlayer();
            } else {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
                window.onYouTubeIframeAPIReady = createPlayer;
            }
        };

        function createPlayer() {
            if (!containerRef.current || playerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: VIDEO_ID,
                playerVars: {
                    start: START_SEC,
                    end: END_SEC,
                    rel: 0,
                    modestbranding: 1,
                    controls: 0,
                    showinfo: 0,
                    fs: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    playsinline: 1,
                    autoplay: 1,
                    enablejsapi: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (e: YT.PlayerEvent) => {
                        setReady(true);
                        e.target.setVolume(80);
                        e.target.seekTo(START_SEC, true);
                        e.target.playVideo();
                    },
                    onStateChange: (e: YT.OnStateChangeEvent) => {
                        const state = e.data;

                        if (state === window.YT.PlayerState.PLAYING) {
                            // Double-check we're in bounds on every play
                            const t = e.target.getCurrentTime();
                            if (t < START_SEC || t >= END_SEC) {
                                e.target.seekTo(START_SEC, true);
                            }
                            setIsPlaying(true);
                            startPolling();
                        } else if (state === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            stopPolling();
                        } else if (state === window.YT.PlayerState.ENDED) {
                            e.target.seekTo(START_SEC, true);
                            e.target.pauseVideo();
                            setIsPlaying(false);
                            setProgress(0);
                            setElapsed(0);
                            stopPolling();
                        }
                    },
                },
            });
        }

        loadAndInit();

        return () => {
            stopPolling();
            playerRef.current?.destroy();
            playerRef.current = null;
        };
    }, [hasStarted, startPolling, stopPolling]);

    /* Pause when clicking outside the video */
    const wrapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                playerRef.current?.pauseVideo();
                setExpanded(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ── Controls ── */
    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const p = playerRef.current;
        if (!p) return;

        if (isPlaying) {
            p.pauseVideo();
        } else {
            // Always ensure we're at the right position
            const t = p.getCurrentTime?.() ?? 0;
            if (t < START_SEC || t >= END_SEC) {
                p.seekTo(START_SEC, true);
            }
            p.playVideo();
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const bar = progressRef.current;
        const p = playerRef.current;
        if (!bar || !p) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const targetSec = START_SEC + ratio * DURATION;
        p.seekTo(targetSec, true);
        setProgress(ratio);
        setElapsed(ratio * DURATION);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const v = Number(e.target.value);
        setVolume(v);
        setMuted(v === 0);
        playerRef.current?.setVolume(v);
        playerRef.current?.unMute();
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const p = playerRef.current;
        if (!p) return;
        if (muted) {
            p.unMute();
            p.setVolume(volume || 80);
            setMuted(false);
        } else {
            p.mute();
            setMuted(true);
        }
    };

    return (
        <div className={styles.heroVideo}>
            <div
                ref={wrapRef}
                className={`${styles.videoWrap} ${expanded ? styles.expanded : ''}`}
                onMouseMove={resetHideTimer}
                onMouseEnter={resetHideTimer}
            >
                {/* Poster thumbnail (before first play) */}
                {!hasStarted && (
                    <>
                        <img
                            src="/images/poochie-pang-thumb.jpg"
                            alt="Poochie & Pang — eat Chicago"
                            className={styles.poster}
                        />
                        <button
                            className={styles.playBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                setHasStarted(true);
                            }}
                            aria-label="Play video"
                        >
                            <svg viewBox="0 0 24 24" fill="#fff" width="48" height="48">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </>
                )}

                {/* YouTube player (loads after first play click) */}
                {hasStarted && (
                    <>
                        <div ref={containerRef} className={styles.player} />
                        <div className={styles.clickLayer} onClick={togglePlay} />

                        {/* Center play button (when paused after initial play) */}
                        {ready && !isPlaying && (
                            <button className={styles.playBtn} onClick={togglePlay} aria-label="Play video">
                                <svg viewBox="0 0 24 24" fill="#fff" width="48" height="48">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        )}
                    </>
                )}

                {/* Bottom control bar */}
                {ready && (
                    <div className={`${styles.controlBar} ${showControls || !isPlaying ? styles.visible : ''}`}>
                        {/* Progress bar */}
                        <div ref={progressRef} className={styles.progressTrack} onClick={handleSeek}>
                            <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
                        </div>

                        {/* Controls row */}
                        <div className={styles.controlRow}>
                            <button className={styles.ctrlBtn} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                                {isPlaying ? (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <rect x="6" y="4" width="4" height="16" rx="1" />
                                        <rect x="14" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            <span className={styles.time}>{fmt(elapsed)} / {fmt(DURATION)}</span>

                            <div className={styles.spacer} />

                            <button className={styles.ctrlBtn} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                                {muted || volume === 0 ? (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                    </svg>
                                )}
                            </button>
                            <input
                                className={styles.volumeSlider}
                                type="range"
                                min="0"
                                max="100"
                                value={muted ? 0 : volume}
                                onChange={handleVolume}
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Volume"
                            />

                            {/* Expand */}
                            <button
                                className={styles.ctrlBtn}
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                aria-label={expanded ? 'Shrink video' : 'Expand video'}
                            >
                                {expanded ? (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="#fff" width="16" height="16">
                                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Show badge */}
                <div className={styles.timeBadge}>Poochie &amp; Pang · eat Chicago</div>
            </div>
        </div>
    );
}
