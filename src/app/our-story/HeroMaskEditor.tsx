'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './HeroMaskEditor.module.css';

interface MaskSettings {
    fadeStart: number;   // % where the bottom fade to transparent begins (e.g., 65%)
    fadeEnd: number;     // % where it reaches 100% transparent (e.g., 100%)
    overlap: number;     // px overlap of the heritage gallery below (e.g., 30px)
    videoOpacity: number;// background video opacity (e.g., 0.25)
}

const STORAGE_KEY = 'hofherr_our_story_mask_v1';

const DEFAULTS: MaskSettings = {
    fadeStart: 68,
    fadeEnd: 100,
    overlap: 30,
    videoOpacity: 0.25,
};

export default function HeroMaskEditor() {
    const [open, setOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [settings, setSettings] = useState<MaskSettings>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) return { ...DEFAULTS, ...JSON.parse(saved) };
            } catch {
                // ignore storage errors
            }
        }
        return DEFAULTS;
    });

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--story-mask-start', `${settings.fadeStart}%`);
        root.style.setProperty('--story-mask-end', `${settings.fadeEnd}%`);
        root.style.setProperty('--story-gallery-overlap', `-${settings.overlap}px`);
        root.style.setProperty('--story-video-opacity', `${settings.videoOpacity}`);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // ignore storage errors
        }
    }, [settings]);

    useEffect(() => {
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        };
    }, []);

    const update = (key: keyof MaskSettings, value: number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const reset = () => {
        setSettings(DEFAULTS);
    };

    const copyCss = () => {
        const css = `/* Our Story Hero Mask & Overlap */
--story-mask-start: ${settings.fadeStart}%;
--story-mask-end: ${settings.fadeEnd}%;
--story-gallery-overlap: -${settings.overlap}px;
--story-video-opacity: ${settings.videoOpacity};`;
        navigator.clipboard.writeText(css).then(() => {
            setCopied(true);
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
        });
    };

    if (typeof document === 'undefined') return null;

    if (!open) {
        return createPortal(
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setOpen(true)}
            >
                🎛️ Hero Mask UI
            </button>,
            document.body
        );
    }

    return createPortal(
        <aside className={styles.panel} aria-label="Hero Mask Controls">
            <div className={styles.header}>
                <span className={styles.title}>🎛️ Hero Mask &amp; Overlap</span>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => setOpen(false)}
                    aria-label="Minimize mask controls"
                >
                    ✕
                </button>
            </div>

            <div className={styles.controlGroup}>
                <div className={styles.labelRow}>
                    <label htmlFor="mask-fade-start">Fade Start</label>
                    <span className={styles.val}>{settings.fadeStart}%</span>
                </div>
                <input
                    id="mask-fade-start"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={settings.fadeStart}
                    onChange={e => update('fadeStart', Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            <div className={styles.controlGroup}>
                <div className={styles.labelRow}>
                    <label htmlFor="mask-fade-end">Fade End (Transparent)</label>
                    <span className={styles.val}>{settings.fadeEnd}%</span>
                </div>
                <input
                    id="mask-fade-end"
                    type="range"
                    min={20}
                    max={100}
                    step={1}
                    value={settings.fadeEnd}
                    onChange={e => update('fadeEnd', Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            <div className={styles.controlGroup}>
                <div className={styles.labelRow}>
                    <label htmlFor="mask-overlap">Image Overlap</label>
                    <span className={styles.val}>-{settings.overlap}px</span>
                </div>
                <input
                    id="mask-overlap"
                    type="range"
                    min={-100}
                    max={220}
                    step={2}
                    value={settings.overlap}
                    onChange={e => update('overlap', Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            <div className={styles.controlGroup}>
                <div className={styles.labelRow}>
                    <label htmlFor="mask-video-opacity">Video Brightness</label>
                    <span className={styles.val}>{Math.round(settings.videoOpacity * 100)}%</span>
                </div>
                <input
                    id="mask-video-opacity"
                    type="range"
                    min={0.05}
                    max={0.8}
                    step={0.01}
                    value={settings.videoOpacity}
                    onChange={e => update('videoOpacity', Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.resetBtn} onClick={reset}>
                    Reset
                </button>
                <button type="button" className={styles.copyBtn} onClick={copyCss}>
                    {copied ? '✓ Copied CSS' : 'Copy Values'}
                </button>
            </div>
        </aside>,
        document.body
    );
}
