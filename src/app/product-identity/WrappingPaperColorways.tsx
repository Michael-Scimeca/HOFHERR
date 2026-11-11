'use client';

import React, { useState } from 'react';
import styles from './WrappingPaperColorways.module.css';

export interface WrappingColorway {
    id: string;
    name: string;
    subtitle: string;
    bg: string;
    primary: string;
    secondary: string;
    logoFill: string;
    gradient?: string;
    svgFile: string;
    jpgFile: string;
}

export const WRAPPING_COLORWAYS: WrappingColorway[] = [
    {
        id: '01-red-on-white',
        name: 'Red on Bleached White',
        subtitle: 'Classic clean butcher freezer paper with crisp crimson linocut print',
        bg: '#FAF8F5',
        primary: '#8B0A10',
        secondary: '#E85222',
        logoFill: '#8B0A10',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-01-red-on-white.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-01-red-on-white.jpg',
    },
    {
        id: '02-red-on-dark-red',
        name: 'Red on Dark Crimson',
        subtitle: 'Tone-on-tone oxblood butcher roll with vibrant scarlet lines & amber embers',
        bg: '#3B0508',
        primary: '#E0242B',
        secondary: '#F59B1A',
        logoFill: '#E0242B',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-02-red-on-dark-red.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-02-red-on-dark-red.jpg',
    },
    {
        id: '03-white-cream-on-crimson',
        name: 'Cream & Gold on Crimson',
        subtitle: 'Signature Hofherr Deep Crimson ground with parchment cream & warm amber gold',
        bg: '#8B0A10',
        primary: '#F5EADB',
        secondary: '#F59B1A',
        logoFill: '#F5EADB',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-03-white-cream-on-crimson.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-03-white-cream-on-crimson.jpg',
    },
    {
        id: '04-charcoal-on-white',
        name: 'Charcoal & Crimson on White',
        subtitle: 'Editorial newsprint aesthetic: stark charcoal contour line art with crimson flame pops',
        bg: '#FBFBFB',
        primary: '#1D1A18',
        secondary: '#8B0A10',
        logoFill: '#1D1A18',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-04-charcoal-on-white.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-04-charcoal-on-white.jpg',
    },
    {
        id: '05-crimson-on-amber',
        name: 'Crimson on Golden Amber',
        subtitle: 'Inspired directly by the store wall map coin medallions',
        bg: '#F59B1A',
        primary: '#8B0A10',
        secondary: '#D03910',
        logoFill: '#8B0A10',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-05-crimson-on-amber.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-05-crimson-on-amber.jpg',
    },
    {
        id: '06-stealth-black-on-charcoal',
        name: 'Stealth Black & Blood Red',
        subtitle: 'High-end Prime Reserve aesthetic with matte noir paper & blood orange flames',
        bg: '#141212',
        primary: '#332D2B',
        secondary: '#C8291A',
        logoFill: '#C8291A',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-06-stealth-black-on-charcoal.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-06-stealth-black-on-charcoal.jpg',
    },
    {
        id: '07-gold-on-obsidian',
        name: 'Gold & Ivory on Obsidian',
        subtitle: 'Ultra-luxury Wagyu reserve packaging with antique gold foil & bone white linocut',
        bg: '#181513',
        primary: '#D6A847',
        secondary: '#F2E8D2',
        logoFill: '#D6A847',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-07-gold-on-obsidian.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-07-gold-on-obsidian.jpg',
    },
    {
        id: '08-monochrome-oxblood-kraft',
        name: 'Monochrome Oxblood on Raw Kraft',
        subtitle: 'Authentic 100% recycled unbleached kraft paper with single-pass deep oxblood flexo ink',
        bg: '#BA9265',
        primary: '#5E060B',
        secondary: '#8B0A10',
        logoFill: '#5E060B',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-08-monochrome-oxblood-kraft.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-08-monochrome-oxblood-kraft.jpg',
    },
    {
        id: '09-vintage-newsprint',
        name: 'Rust & Slate on Vintage Newsprint',
        subtitle: '1920s heritage butcher shop parcel print with warm flour-sack gray-white ground',
        bg: '#ECE6D8',
        primary: '#7C2115',
        secondary: '#BF4922',
        logoFill: '#7C2115',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-09-vintage-newsprint.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-09-vintage-newsprint.jpg',
    },
    {
        id: '10-midnight-burgundy-electric',
        name: 'Electric Orange on Midnight Burgundy',
        subtitle: 'High-contrast nocturnal smokehouse vibe with blazing hot embers',
        bg: '#250409',
        primary: '#FF4500',
        secondary: '#FFAE19',
        logoFill: '#FFAE19',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-10-midnight-burgundy-electric.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-10-midnight-burgundy-electric.jpg',
    },
    {
        id: '11-depot-heritage-green',
        name: 'Depot Forest Green & Champagne Gold',
        subtitle: 'Winnetka Depot reserve edition with ambient champagne illumination (#142A1E)',
        bg: '#142A1E',
        primary: '#C4AE82',
        secondary: '#E85222',
        logoFill: '#C4AE82',
        gradient: 'linear-gradient(135deg, #ffffff14 0%, #0000 70%), radial-gradient(circle, #c4ae821f 0%, #0000 80%)',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-11-depot-heritage-green.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-11-depot-heritage-green.jpg',
    },
    {
        id: '12-depot-green-white-ink',
        name: 'Depot Heritage Green & Crisp White',
        subtitle: 'High-contrast stark chalk-white ink linocut icons on deep forest green kraft (#142A1E)',
        bg: '#142A1E',
        primary: '#FFFFFF',
        secondary: '#FAF8F5',
        logoFill: '#FFFFFF',
        svgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-12-depot-green-white-ink.svg',
        jpgFile: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-12-depot-green-white-ink.jpg',
    },
];

export default function WrappingPaperColorways() {
    const [activeColorway, setActiveColorway] = useState<WrappingColorway>(WRAPPING_COLORWAYS[0]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>12 Butcher Wrapping Paper Colorway Variations</h3>
                <p className={styles.description}>
                    Explore 11 curated colorways for the Hofherr Meat Co. custom printed butcher wrapping paper — spanning bleached white freezer wraps, oxblood tone-on-tone rolls, gold-embossed obsidian reserve editions, raw vintage newsprint, and the new Winnetka Depot Heritage Green with ambient champagne glow.
                </p>
            </div>

            {/* Quick Horizontal Selector */}
            <div className={styles.tabsScroll} role="tablist" aria-label="Wrapping paper colorways">
                {WRAPPING_COLORWAYS.map((cw) => {
                    const isActive = activeColorway.id === cw.id;
                    return (
                        <button
                            key={cw.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveColorway(cw)}
                            className={`${styles.colorwayTab} ${isActive ? styles.colorwayTabActive : ''}`}
                        >
                            <span
                                className={styles.tabSwatch}
                                style={
                                    {
                                        '--tab-bg': cw.bg,
                                        '--tab-fg': cw.primary,
                                        '--tab-gradient': cw.gradient || 'none',
                                    } as React.CSSProperties
                                }
                            >
                                <span className={styles.tabSwatchDot} />
                            </span>
                            <span>{cw.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Interactive Showcase */}
            <div className={styles.showcaseGrid}>
                <div
                    className={styles.previewFrame}
                    style={{ '--preview-bg': activeColorway.bg } as React.CSSProperties}
                >
                    <img
                        src={activeColorway.jpgFile}
                        alt={`${activeColorway.name} custom butcher wrapping paper parcel print`}
                        className={styles.previewImg}
                    />
                </div>

                <div className={styles.detailsCol}>
                    <div>
                        <h4 className={styles.colorwayTitle}>{activeColorway.name}</h4>
                        <p className={styles.colorwaySubtitle}>{activeColorway.subtitle}</p>
                    </div>

                    <div className={styles.paletteTokens}>
                        <div className={styles.tokenRow}>
                            <span className={styles.tokenLabel}>Paper Stock Ground</span>
                            <div className={styles.tokenValueWrap}>
                                <span
                                    className={styles.tokenChip}
                                    style={
                                        {
                                            '--chip-color': activeColorway.bg,
                                            '--chip-gradient': activeColorway.gradient || 'none',
                                        } as React.CSSProperties
                                    }
                                />
                                <span className={styles.tokenCode}>{activeColorway.bg}</span>
                            </div>
                        </div>

                        <div className={styles.tokenRow}>
                            <span className={styles.tokenLabel}>Linocut Contour &amp; Logo</span>
                            <div className={styles.tokenValueWrap}>
                                <span
                                    className={styles.tokenChip}
                                    style={{ '--chip-color': activeColorway.primary } as React.CSSProperties}
                                />
                                <span className={styles.tokenCode}>{activeColorway.primary}</span>
                            </div>
                        </div>

                        <div className={styles.tokenRow}>
                            <span className={styles.tokenLabel}>Flame Fill Accent</span>
                            <div className={styles.tokenValueWrap}>
                                <span
                                    className={styles.tokenChip}
                                    style={{ '--chip-color': activeColorway.secondary } as React.CSSProperties}
                                />
                                <span className={styles.tokenCode}>{activeColorway.secondary}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.downloadRow}>
                        <a
                            href={activeColorway.svgFile}
                            download={`hofherr-wrap-${activeColorway.id}.svg`}
                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        >
                            ⬇ Download Vector .SVG
                        </a>
                        <a
                            href={activeColorway.jpgFile}
                            download={`hofherr-wrap-${activeColorway.id}.jpg`}
                            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                        >
                            ⬇ Print-Ready .JPG
                        </a>
                    </div>
                </div>
            </div>

            {/* 10-Up Grid Gallery */}
            <div className={styles.allGrid}>
                {WRAPPING_COLORWAYS.map((cw) => {
                    const isActive = activeColorway.id === cw.id;
                    return (
                        <button
                            key={cw.id}
                            type="button"
                            onClick={() => setActiveColorway(cw)}
                            className={`${styles.thumbCard} ${isActive ? styles.thumbCardActive : ''}`}
                        >
                            <div
                                className={styles.thumbImgWrap}
                                style={{ '--thumb-bg': cw.bg } as React.CSSProperties}
                            >
                                <img
                                    src={cw.jpgFile}
                                    alt={cw.name}
                                    className={styles.thumbImg}
                                    loading="lazy"
                                />
                            </div>
                            <div className={styles.thumbMeta}>
                                <span className={styles.thumbTitle}>{cw.name}</span>
                                <span className={styles.thumbSub}>{cw.subtitle}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

