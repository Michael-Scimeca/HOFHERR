'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
    getMobileBurnState,
    hydrateMobileBurnConfig,
    resetMobileBurnConfig,
    setMobileBurnScrub,
    subscribeMobileBurn,
    updateMobileBurnConfig,
    type MobileBurnConfig,
} from '@/lib/mobileBurnConfig';
import styles from './MobileMenuBurnHud.module.css';

interface SliderDef {
    key: keyof MobileBurnConfig;
    label: string;
    min: number;
    max: number;
    step: number;
    fmt: (v: number) => string;
}

const FLAME_SLIDERS: SliderDef[] = [
    { key: 'bandWidth', label: 'Fire Edge Width', min: 0.04, max: 0.35, step: 0.01, fmt: (v) => v.toFixed(2) },
    { key: 'edgeBlur', label: 'Glow Blur', min: 0, max: 24, step: 1, fmt: (v) => `${v}px` },
    { key: 'glowAlpha', label: 'Glow Intensity', min: 0, max: 1, step: 0.05, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'noiseScale', label: 'Turbulence Scale', min: 2, max: 14, step: 0.5, fmt: (v) => v.toFixed(1) },
    { key: 'noiseAmp', label: 'Edge Raggedness', min: 0, max: 0.3, step: 0.01, fmt: (v) => v.toFixed(2) },
    { key: 'fieldW', label: 'Flame Sharpness', min: 40, max: 180, step: 10, fmt: (v) => `${v}px` },
];

const TIMING_SLIDERS: SliderDef[] = [
    { key: 'sweepMs', label: 'Burn Duration', min: 200, max: 1600, step: 50, fmt: (v) => `${v}ms` },
    { key: 'closeSpeed', label: 'Close Speed', min: 0.5, max: 3, step: 0.1, fmt: (v) => `${v.toFixed(1)}×` },
    { key: 'fuseEndT', label: 'Fuse Fraction', min: 0.25, max: 0.95, step: 0.05, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'fusePower', label: 'Spark Accel', min: 1, max: 4, step: 0.1, fmt: (v) => v.toFixed(1) },
    { key: 'sparkSize', label: 'Spark Size', min: 0, max: 2.5, step: 0.1, fmt: (v) => `${v.toFixed(1)}×` },
];

const PATH_TEXT_SLIDERS: SliderDef[] = [
    { key: 'fuseToX', label: 'Fuse End X', min: 0, max: 1, step: 0.02, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'fuseToY', label: 'Fuse End Y', min: 0, max: 1, step: 0.02, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'textMs', label: 'Link Burn Time', min: 150, max: 900, step: 25, fmt: (v) => `${v}ms` },
    { key: 'textFlameBoost', label: 'Link Flame Boost', min: 0, max: 3, step: 0.1, fmt: (v) => `${v.toFixed(1)}×` },
];

export default function MobileMenuBurnHud() {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { config, scrubProgress } = useSyncExternalStore(
        subscribeMobileBurn,
        getMobileBurnState,
        getMobileBurnState,
    );

    useEffect(() => {
        hydrateMobileBurnConfig();
    }, []);

    const toggleMobileMenu = () => {
        setMobileBurnScrub(null);
        window.dispatchEvent(new CustomEvent('hofherr-open-mobile-menu'));
    };

    const replayBurn = () => {
        setMobileBurnScrub(null);
        window.dispatchEvent(new CustomEvent('hofherr-replay-mobile-burn'));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            // Clipboard unavailable
        }
    };

    if (!open) {
        return (
            <button
                type="button"
                className={styles.launcher}
                onClick={() => setOpen(true)}
                aria-label="Open Mobile Menu Burn Controls"
            >
                🔥 Menu Burn
            </button>
        );
    }

    const renderGroup = (title: string, sliders: SliderDef[]) => (
        <>
            <h3 className={styles.groupTitle}>{title}</h3>
            <div className={styles.sliderList}>
                {sliders.map((s) => {
                    const val = config[s.key];
                    const id = `mburn-${s.key}`;
                    return (
                        <div key={s.key} className={styles.sliderRow}>
                            <label htmlFor={id} className={styles.sliderLabel}>
                                <span>{s.label}</span>
                                <output className={styles.sliderVal}>{s.fmt(val)}</output>
                            </label>
                            <input
                                id={id}
                                type="range"
                                className={styles.range}
                                min={s.min}
                                max={s.max}
                                step={s.step}
                                value={val}
                                onChange={(e) => updateMobileBurnConfig({ [s.key]: parseFloat(e.target.value) })}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );

    return (
        <aside className={styles.panel} aria-label="Mobile Menu Burn Controls" data-lenis-prevent>
            <div className={styles.header}>
                <h2 className={styles.title}>🔥 Mobile Menu Burn</h2>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => {
                        setMobileBurnScrub(null);
                        setOpen(false);
                    }}
                    aria-label="Minimize Mobile Menu Burn Controls"
                >
                    ×
                </button>
            </div>

            <div className={styles.actionsRow}>
                <button type="button" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={toggleMobileMenu}>
                    Toggle Menu
                </button>
                <button type="button" className={styles.actionBtn} onClick={replayBurn}>
                    ↻ Replay Burn
                </button>
            </div>

            <div className={styles.scrubBox}>
                <div className={styles.scrubHeader}>
                    <span>
                        Freeze &amp; Scrub {scrubProgress === null ? '(Live)' : `${Math.round(scrubProgress * 100)}%`}
                    </span>
                    {scrubProgress !== null && (
                        <button type="button" className={styles.liveBtn} onClick={() => setMobileBurnScrub(null)}>
                            Resume Live
                        </button>
                    )}
                </div>
                <input
                    type="range"
                    aria-label="Scrub burn animation progress"
                    className={styles.range}
                    min={0}
                    max={1}
                    step={0.01}
                    value={scrubProgress ?? 0.45}
                    onChange={(e) => setMobileBurnScrub(parseFloat(e.target.value))}
                />
            </div>

            <div className={styles.body}>
                {renderGroup('Flame Edge & Glow', FLAME_SLIDERS)}
                {renderGroup('Timing & Spark', TIMING_SLIDERS)}
                {renderGroup('Fuse Path & Link Text', PATH_TEXT_SLIDERS)}
            </div>

            <div className={styles.footer}>
                <button type="button" className={styles.footerBtn} onClick={resetMobileBurnConfig}>
                    Reset
                </button>
                <button type="button" className={styles.footerBtn} onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy JSON'}
                </button>
            </div>
        </aside>
    );
}

