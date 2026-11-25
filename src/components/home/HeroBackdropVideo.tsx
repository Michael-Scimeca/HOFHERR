'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const DESKTOP_MQ = '(min-width: 1025px)';
const LOOP_START_SEC = 8;
const LOOP_END_SEC = 13.95;
const OVERLAY_STORAGE_KEY = 'hofherr_hero_overlay_v1';
const DEFAULT_OVERLAY_COLOR = '#000000';
const DEFAULT_OVERLAY_OPACITY = 0.45;
const OVERLAY_PRESETS = [
    { label: 'Black', hex: '#000000' },
    { label: 'Charcoal', hex: '#14100e' },
    { label: 'Crimson', hex: '#2b0508' },
    { label: 'Depot', hex: '#0d1b13' },
] as const;

type VideoWithVFC = HTMLVideoElement & {
    requestVideoFrameCallback?: (cb: (now: DOMHighResTimeStamp, meta: { mediaTime: number }) => void) => number;
    cancelVideoFrameCallback?: (handle: number) => void;
};

export default function HeroBackdropVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [overlayColor, setOverlayColor] = useState(DEFAULT_OVERLAY_COLOR);
    const [overlayOpacity, setOverlayOpacity] = useState(DEFAULT_OVERLAY_OPACITY);
    const [tunerOpen, setTunerOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(OVERLAY_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as { color?: string; opacity?: number };
                if (typeof parsed.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(parsed.color)) {
                    setOverlayColor(parsed.color);
                }
                if (typeof parsed.opacity === 'number' && parsed.opacity >= 0 && parsed.opacity <= 1) {
                    setOverlayOpacity(parsed.opacity);
                }
            }
        } catch {
            /* ignore */
        }
    }, []);

    const persistOverlay = (color: string, opacity: number) => {
        try {
            localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify({ color, opacity }));
        } catch {
            /* ignore */
        }
    };

    const handleColorChange = (nextColor: string) => {
        setOverlayColor(nextColor);
        persistOverlay(nextColor, overlayOpacity);
    };

    const handleOpacityChange = (nextOpacity: number) => {
        setOverlayOpacity(nextOpacity);
        persistOverlay(overlayColor, nextOpacity);
    };

    const handleResetOverlay = () => {
        setOverlayColor(DEFAULT_OVERLAY_COLOR);
        setOverlayOpacity(DEFAULT_OVERLAY_OPACITY);
        persistOverlay(DEFAULT_OVERLAY_COLOR, DEFAULT_OVERLAY_OPACITY);
    };

    const handleCopyValues = () => {
        const text = `color: ${overlayColor}, opacity: ${overlayOpacity.toFixed(2)}`;
        void navigator.clipboard?.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

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
            vid.play().catch(() => {});
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

    const overlayVars = {
        '--hero-overlay-color': overlayColor,
        '--hero-overlay-opacity': String(overlayOpacity),
    } as React.CSSProperties;

    return (
        <>
            <div className={styles.heroVideoCol}>
                {isDesktop && (
                    <video
                        ref={videoRef}
                        src="/assets/video/home-hero.mp4"
                        autoPlay
                        muted
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
                <div
                    className={styles.heroVideoOverlay}
                    style={overlayVars}
                    aria-hidden="true"
                />
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div className={styles.overlayTunerWrap}>
                    {tunerOpen && (
                        <div className={styles.overlayTunerPanel} role="region" aria-label="Hero video overlay controls">
                            <div className={styles.overlayTunerHead}>
                                <span className={styles.overlayTunerTitle}>Hero Video Overlay</span>
                                <button
                                    type="button"
                                    className={styles.overlayTunerClose}
                                    onClick={() => setTunerOpen(false)}
                                    aria-label="Close overlay tuner"
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.overlayTunerRow}>
                                <label className={styles.overlayTunerLabel}>
                                    <span>Color</span>
                                    <div className={styles.overlayColorInputWrap}>
                                        <input
                                            type="color"
                                            value={overlayColor}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                            className={styles.overlayColorPicker}
                                        />
                                        <code className={styles.overlayCode}>{overlayColor}</code>
                                    </div>
                                </label>
                            </div>

                            <div className={styles.overlayPresets}>
                                {OVERLAY_PRESETS.map((p) => (
                                    <button
                                        key={p.hex}
                                        type="button"
                                        className={`${styles.overlayPresetBtn} ${overlayColor.toLowerCase() === p.hex ? styles.overlayPresetActive : ''}`}
                                        onClick={() => handleColorChange(p.hex)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <label className={styles.overlaySliderLabel}>
                                <span className={styles.overlaySliderTop}>
                                    <span>Opacity</span>
                                    <strong className={styles.overlayCode}>{Math.round(overlayOpacity * 100)}%</strong>
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={overlayOpacity}
                                    onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                                    className={styles.overlaySlider}
                                />
                            </label>

                            <div className={styles.overlayTunerActions}>
                                <button type="button" className={styles.overlayActionBtn} onClick={handleCopyValues}>
                                    {copied ? '✓ Copied' : 'Copy values'}
                                </button>
                                <button type="button" className={styles.overlayActionBtn} onClick={handleResetOverlay}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        className={styles.overlayTunerPill}
                        onClick={() => setTunerOpen((v) => !v)}
                        aria-expanded={tunerOpen}
                    >
                        🎨 Hero Overlay · {Math.round(overlayOpacity * 100)}%
                    </button>
                </div>
            )}
        </>
    );
}
