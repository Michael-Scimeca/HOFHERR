'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SizeStudio from './sizes/SizeStudio';
import ExtendedIdentityBoards from './ExtendedIdentityBoards';
import AppBrandIdentitySection from './AppBrandIdentitySection';
import SocialKit from './social/SocialKit';
import PressKitSection from './PressKitSection';
import PitchDeckClient from '../pitch-deck/PitchDeckClient';
import {
    SCALLOP_OUTER_PATH,
    STAMP_COW_CORAL_PATH,
    STAMP_COW_CRIMSON_PATH,
    VECTOR_ICON_PATHS,
} from './vectorIcons';

const PROVENANCE_TOP_GLYPHS: ArcGlyph[] = [
    { key: '0-dot', char: '•', transform: 'translate(342.97 742.62) rotate(-66.45)' },
    { key: '1-H', char: 'H', transform: 'translate(393.97 634.92) rotate(-54.89)' },
    { key: '2-O', char: 'O', transform: 'translate(448.07 557.01) rotate(-47.05)' },
    { key: '3-F', char: 'F', transform: 'translate(520.23 480.76) rotate(-39.2)' },
    { key: '4-H', char: 'H', transform: 'translate(585.41 426.88) rotate(-31.36)' },
    { key: '5-E', char: 'E', transform: 'translate(672.38 374.31) rotate(-23.52)' },
    { key: '6-R', char: 'R', transform: 'translate(756.11 337.76) rotate(-15.68)' },
    { key: '7-R', char: 'R', transform: 'translate(847.35 312.07) rotate(-7.84)' },
    { key: '8-M', char: 'M', transform: 'translate(1004.5183 296.7476) rotate(6.08)' },
    { key: '9-E', char: 'E', transform: 'translate(1123.9771 310.8446) rotate(14.9)' },
    { key: '10-A', char: 'A', transform: 'translate(1212.3058 334.2499) rotate(22.74)' },
    { key: '11-T', char: 'T', transform: 'translate(1302.7225 372.5286) rotate(30.58)' },
    { key: '12-C', char: 'C', transform: 'translate(1430.6441 456.0369) rotate(43.52)' },
    { key: '13-O', char: 'O', transform: 'translate(1497.323 518.5857) rotate(51.36)' },
    { key: '14-period', char: '.', transform: 'translate(1558.3485 597.1629) rotate(57.04)' },
    { key: '15-dot', char: '•', transform: 'translate(1610.9194 686.0188) rotate(66.45)' },
];

const PROVENANCE_BOTTOM_GLYPHS: ArcGlyph[] = [
    { key: '0-dot', char: '•', transform: 'translate(378.5612 1411.0395) rotate(58.4475) scale(.9838 .9996) skewX(-1.7384)' },
    { key: '1-N', char: 'N', transform: 'translate(449.8342 1519.9022) rotate(46.09)' },
    { key: '2-O', char: 'O', transform: 'translate(520.2569 1594.311) rotate(38.85)' },
    { key: '3-R', char: 'R', transform: 'translate(603.4403 1660.6418) rotate(30.59)' },
    { key: '4-T', char: 'T', transform: 'translate(695.5979 1713.9211) rotate(22.32)' },
    { key: '5-H', char: 'H', transform: 'translate(784.6427 1750.4426) rotate(14.05)' },
    { key: '6-F', char: 'F', transform: 'translate(894.77 1776.4484) rotate(5.79)' },
    { key: '7-I', char: 'I', transform: 'translate(996.425 1784.5423) rotate(-1.03)' },
    { key: '8-E', char: 'E', transform: 'translate(1060.9363 1783.6039) rotate(-7.85)' },
    { key: '9-L', char: 'L', transform: 'translate(1166.0812 1767.5803) rotate(-16.12)' },
    { key: '10-D', char: 'D', transform: 'translate(1258.353 1740.3824) rotate(-24.39)' },
    { key: '11-comma', char: ',', transform: 'translate(1350.4424 1696.6844) rotate(-30.38)' },
    { key: '12-I', char: 'I', transform: 'translate(1450.4551 1630.5027) rotate(-40.3)' },
    { key: '13-L', char: 'L', transform: 'translate(1502.9617 1586.5235) rotate(-48.15)' },
    { key: '14-dot', char: '•', transform: 'translate(1605.0531 1461.5493) rotate(-59.31)' },
];

type PaperStock = {
    id: string;
    name: string;
    bg: string;
    ink: string;
    spec: string;
};

type FlameSticker = {
    id: string;
    name: string;
    dept: string;
    src: string;
    sampleCut: string;
    sampleWeight: string;
    storageNote: string;
};

type StampPreset = {
    id: string;
    name: string;
    shape: 'circle' | 'rect';
    topText: string;
    centerTitle: string;
    bottomText: string;
    flankTop: string;
    flankBottom: string;
    defaultIconId: string;
};

type ArcGlyph = {
    key: string;
    char: string;
    transform: string;
};

function getCharAdvance(ch: string): number {
    if (ch === ' ') return 0.65;
    if (ch === '.' || ch === ',') return 0.45;
    if (ch === 'I' || ch === '1' || ch === '•') return 0.65;
    if (ch === 'M' || ch === 'W') return 1.25;
    return 1.0;
}

function buildArcGlyphs(
    text: string,
    cx: number,
    cy: number,
    radius: number,
    totalSpreadDeg: number,
    isBottom: boolean
): ArcGlyph[] {
    const chars = Array.from(text);
    const advances = chars.map(getCharAdvance);
    const totalAdv = advances.reduce((a, b) => a + b, 0);
    const degPerUnit = totalSpreadDeg / totalAdv;
    let cursorDeg = -totalSpreadDeg / 2;
    const glyphs: ArcGlyph[] = [];

    chars.forEach((ch, i) => {
        const w = advances[i];
        const centerOffsetDeg = cursorDeg + (w * degPerUnit) / 2;
        cursorDeg += w * degPerUnit;
        if (ch === ' ') return;
        const angleDeg = isBottom ? 90 - centerOffsetDeg : -90 + centerOffsetDeg;
        const rad = (angleDeg * Math.PI) / 180;
        const x = (cx + radius * Math.cos(rad)).toFixed(2);
        const y = (cy + radius * Math.sin(rad)).toFixed(2);
        const rot = (isBottom ? angleDeg - 90 : angleDeg + 90).toFixed(2);
        glyphs.push({
            key: `${i}-${ch}`,
            char: ch,
            transform: `translate(${x}, ${y}) rotate(${rot})`,
        });
    });

    return glyphs;
}

const PAPER_STOCKS: PaperStock[] = [
    {
        id: 'kraft',
        name: 'Classic Butcher Kraft (#C8A47E)',
        bg: '#c8a47e',
        ink: '#8b0a10',
        spec: '40# Unbleached Natural Kraft Roll · 24" × 16" Seamless Print Sheet (300 DPI / Vector SVG)',
    },
    {
        id: 'peach',
        name: 'Steakhouse Peach Kraft (#D8A46F)',
        bg: '#d8a46f',
        ink: '#8b0a10',
        spec: '40# FDA Wet-Strength Treated Peach Paper · 18" & 24" Counter Rolls',
    },
    {
        id: 'amber',
        name: 'Smokehouse Golden Amber (#F59B1A)',
        bg: '#f59b1a',
        ink: '#8b0a10',
        spec: '35# Uncoated Dyed Butcher Wrap · Soy-Based Oxblood Crimson Ink',
    },
    {
        id: 'cream',
        name: 'Butcher Counter Cream (#F3EAD8)',
        bg: '#f3ead8',
        ink: '#8b0a10',
        spec: '40# Natural Unbleached Deli Wrap · Grease-Resistant Inner Sizing',
    },
];

export const FLAME_STICKERS: FlameSticker[] = [
    {
        id: 'cow',
        name: 'Prime Beef',
        dept: 'Dry-Aged & Steaks',
        src: '/assets/identity/stickers/sticker-cow.svg',
        sampleCut: '45-Day Dry-Aged Bone-In Ribeye',
        sampleWeight: '1.85 LB',
        storageNote: 'Keep Refrigerated · Let Rest 20 Min Before Searing',
    },
    {
        id: 'pig',
        name: 'Heritage Pork',
        dept: 'Chops, Belly & Roast',
        src: '/assets/identity/stickers/sticker-pig.svg',
        sampleCut: 'Berkshire Bone-In Double Pork Chop',
        sampleWeight: '1.40 LB',
        storageNote: 'Pasture-Raised Midwest Heritage Pork · Cut To Order',
    },
    {
        id: 'chicken',
        name: 'Poultry & Rotisserie',
        dept: 'Whole Birds & Wings',
        src: '/assets/identity/stickers/sticker-chicken.svg',
        sampleCut: 'Herb-Brined Whole Rotisserie Chicken',
        sampleWeight: '3.65 LB',
        storageNote: 'Spit-Roasted Fresh Daily · Northfield & Winnetka',
    },
    {
        id: 'lamb',
        name: 'Pasture Lamb',
        dept: 'Chops, Rack & Leg',
        src: '/assets/identity/stickers/sticker-lamb.svg',
        sampleCut: 'Frenched Domestic Rack of Lamb',
        sampleWeight: '2.10 LB',
        storageNote: 'Domestic Pasture-Raised · Trimmed & Frenched In-House',
    },
    {
        id: 'cheese',
        name: 'Artisanal Cheese',
        dept: 'Cave-Aged & Deli',
        src: '/assets/identity/stickers/sticker-cheese.svg',
        sampleCut: 'Aged Emmental Swiss Reserve Wedge',
        sampleWeight: '0.68 LB',
        storageNote: 'Hand-Cut From The Wheel · Wrap In Wax Paper After Opening',
    },
    {
        id: 'soup',
        name: 'Stocks & Soups',
        dept: 'Kettle Broth & Chili',
        src: '/assets/identity/stickers/sticker-soup.svg',
        sampleCut: '24-Hour Roasted Beef Marrow Bone Broth',
        sampleWeight: '32 OZ QT',
        storageNote: 'Simmered 24 Hours · Bring To Rolling Boil Before Serving',
    },
    {
        id: 'fish',
        name: 'Fresh Catch',
        dept: 'Fillets & Steaks',
        src: '/assets/identity/stickers/sticker-fish.svg',
        sampleCut: 'Faroe Island Center-Cut Salmon Fillet',
        sampleWeight: '1.15 LB',
        storageNote: 'Sushi-Grade Cold Chain · Keep On Ice At 34°F',
    },
    {
        id: 'seafood',
        name: 'Shellfish & Crab',
        dept: 'Shrimp, Crab & Lobster',
        src: '/assets/identity/stickers/sticker-seafood-lobster.svg',
        sampleCut: 'Wild Maine Lobster Tails & Gulf Shrimp',
        sampleWeight: '1.50 LB',
        storageNote: 'Wild-Caught · Keep Chilled Until Preparation',
    },
    {
        id: 'duck',
        name: 'Specialty Duck',
        dept: 'Magret Breast & Confit',
        src: '/assets/identity/stickers/sticker-duck.svg',
        sampleCut: 'Rohan Duck Breast · Scored Skin',
        sampleWeight: '0.95 LB',
        storageNote: 'Start Skin-Side Down In Cold Cast Iron Skillet',
    },
    {
        id: 'truck',
        name: 'Catering & Delivery',
        dept: 'Whole Hog & Event BBQ',
        src: '/assets/identity/stickers/sticker-truck.svg',
        sampleCut: 'Oak-Smoked Texas Brisket Catering Pack',
        sampleWeight: '6.50 LB',
        storageNote: 'Hot Insulated Delivery · North Shore & Chicagoland',
    },
];

export const STAMP_PRESETS: StampPreset[] = [
    {
        id: 'provenance',
        name: 'Circular Butcher Provenance Seal',
        shape: 'circle',
        topText: '• HOFHERR MEAT CO. •',
        centerTitle: 'CUT TO ORDER',
        bottomText: '• NORTHFIELD, IL •',
        flankTop: 'EST.',
        flankBottom: '2018',
        defaultIconId: 'cow',
    },
    {
        id: 'prime',
        name: 'USDA Prime Rectangular Inspection',
        shape: 'rect',
        topText: 'USDA PRIME',
        centerTitle: '• HAND CUT •',
        bottomText: 'HOFHERR MEAT CO.',
        flankTop: 'EST.',
        flankBottom: '2018',
        defaultIconId: 'pig',
    },
    {
        id: 'depot',
        name: 'Winnetka Depot Commuter Pickup Stamp',
        shape: 'rect',
        topText: 'WINNETKA DEPOT',
        centerTitle: '• SAME-DAY PICKUP •',
        bottomText: '754 ELM ST · HOFHERR MEAT CO.',
        flankTop: '754',
        flankBottom: 'ELM ST',
        defaultIconId: 'soup',
    },
    {
        id: 'smokehouse',
        name: 'White Oak Pitmaster Seal',
        shape: 'circle',
        topText: '• HOFHERR SMOKEHOUSE •',
        centerTitle: 'WHITE OAK & CHERRY',
        bottomText: '• WHITE OAK & CHERRY •',
        flankTop: 'LOW &',
        flankBottom: 'SLOW',
        defaultIconId: 'chicken',
    },
];

const INK_PADS = [
    { id: 'crimson', label: 'Oxblood Crimson (#8B0A10)', hex: '#8b0a10' },
    { id: 'red', label: 'Hofherr Red (#CC0E1D)', hex: '#cc0e1d' },
    { id: 'charcoal', label: 'Smokehouse Charcoal (#1C1614)', hex: '#1c1614' },
];

export default function ProductIdentityClient() {
    const [activePaper, setActivePaper] = useState<PaperStock>(PAPER_STOCKS[0]);
    const [showTwine, setShowTwine] = useState<boolean>(false);
    const [selectedSticker, setSelectedSticker] = useState<FlameSticker>(FLAME_STICKERS[0]);
    const [stickerShape, setStickerShape] = useState<'circle' | 'rounded'>('circle');
    const [deliStore, setDeliStore] = useState<'butcher' | 'depot'>('butcher');
    const [activeStamp, setActiveStamp] = useState<StampPreset>(STAMP_PRESETS[0]);
    const [stampIconId, setStampIconId] = useState<string>('cow');
    const [activeInk, setActiveInk] = useState(INK_PADS[0]);

    const currentStampPaths = VECTOR_ICON_PATHS[stampIconId] || VECTOR_ICON_PATHS.cow;
    const isProvenance = activeStamp.id === 'provenance';
    const topArcGlyphs = isProvenance
        ? PROVENANCE_TOP_GLYPHS
        : buildArcGlyphs(activeStamp.topText, 1000, 1000, 672, 138, false);
    const bottomArcGlyphs = isProvenance
        ? PROVENANCE_BOTTOM_GLYPHS
        : buildArcGlyphs(activeStamp.bottomText, 1000, 1000, 672, 128, true);

    return (
        <main className={styles.page}>
            {/* ── Open Hero Header (No Content-Boxing, No Preceding Pill Badge) ── */}
            <header className={styles.hero}>
                <div className={styles.heroBackdrop}>
                    <img
                        src="/assets/identity/butcher-complete-packaging-suite-v5.jpg?v=4"
                        alt="Hofherr Meat Co. complete product identity packaging suite on walnut butcher block"
                        className={styles.heroBackdropImg}
                    />
                    <div className={styles.heroScrim} />
                </div>

                <div className={`container ${styles.heroInner}`}>
                    <h1 className={styles.heroTitle}>
                        Product Identity &amp; <span className={styles.heroTitleAccent}>Counter Packaging</span>
                    </h1>
                    <p className={styles.heroLead}>
                        Every cut that leaves the block carries our physical signature: custom step-and-repeat
                        butcher wrapping paper, die-cut flame-linocut department stickers, tamper-evident scale
                        seals, and hand-pressed crimson rubber ink stamps across Northfield and The Depot in Winnetka.
                    </p>
                    <nav className={styles.heroNav} aria-label="Product identity sections">
                            <Link href="/product-identity#press-kit" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                                <span className={styles.heroNavIndex}>⬇</span>
                                Press &amp; Media Download Kit
                        </Link>
                        <Link href="/product-identity/sizes" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                            <span className={styles.heroNavIndex}>📐</span>
                            Print Sizes Editor
                        </Link>
                        <Link href="/product-identity/print" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                            <span className={styles.heroNavIndex}>🖨</span>
                            1:1 True-Size Print Kit (PDF)
                        </Link>
                        <Link href="/product-identity#cuts" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                            <span className={styles.heroNavIndex}>✦</span>
                            Know Your Cuts &amp; Social Studio
                        </Link>
                        <Link href="/admin/social" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                            <span className={styles.heroNavIndex}>⚙</span>
                            Admin Auto-Post &amp; Verification
                    </Link>
                    <a href="#wrapping-paper" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>01</span>
                        Butcher Wrapping Paper
                    </a>
                    <a href="#stickers" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>02</span>
                        Die-Cut Stickers &amp; Deli Seals
                    </a>
                    <a href="#stamps" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>03</span>
                        Rubber Ink Stamps
                    </a>
                    <a href="#packaging-suite" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>04</span>
                        Complete Counter Suite
                    </a>
                        <Link href="/product-identity#retail-packaging" className={styles.heroNavLink}>
                            <span className={styles.heroNavIndex}>05</span>
                            Retail &amp; Cold Case
                    </Link>
                    <Link href="/product-identity#carryout-gifting" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>06</span>
                        Carry-Out &amp; Gifting
                    </Link>
                    <Link href="/product-identity#signage" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>07</span>
                        In-Store Signage
                    </Link>
                    <Link href="/product-identity#uniforms-stationery" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>08</span>
                        Uniforms &amp; Stationery
                    </Link>
                    <Link href="/product-identity#digital" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>09</span>
                        Digital &amp; Social
                    </Link>
                    <Link href="/product-identity#app-identity" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                        <span className={styles.heroNavIndex}>09B</span>
                        Instagram (@hofherrmeatco) &amp; Apps
                    </Link>
                    <Link href="/product-identity#brand-standards" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>10</span>
                        Brand Standards
                    </Link>
                    <Link href="/product-identity#cuts" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>11</span>
                        Cut Charts, Social &amp; Auto-Post
                    </Link>
                    <Link href="/product-identity#press-kit" className={styles.heroNavLink}>
                        <span className={styles.heroNavIndex}>12</span>
                        Press &amp; Media Kit
                    </Link>
                    <a href="#pitch-deck" className={`${styles.heroNavLink} ${styles.heroNavLinkPrimary}`}>
                        <span className={styles.heroNavIndex}>13</span>
                        Review Audit &amp; Growth Pitch Deck
                    </a>
            </nav>
        </div>
            </header>

        {/* ── Print Sizes Editor: edit, compare and print every printable item at any size ── */}
        <SizeStudio embedded />

            {/* ── 01 / Butcher Wrapping Paper System ── */}
            <section id="wrapping-paper" aria-labelledby="wrapping-paper-heading" className="section">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="wrapping-paper-heading" className={styles.sectionTitle}>
                            01 / Custom Butcher Wrapping Paper
                        </h2>
                        <p className={styles.sectionDesc}>
                            Printed in a two-tone crimson-maroon (<code>#8B0A10</code>) and warm amber (<code>#F59B1A</code>)
                            linocut register on 40# wet-strength butcher paper. The step-and-repeat pattern alternates the
                            Hofherr Meat Co. stencil wordmark with our wood-fired department emblems so every wrapped parcel
                            is unmistakably Hofherr from any fold angle.
                        </p>
                    </div>

                    <div className={styles.splitGrid}>
                        <div className={styles.studioBoard}>
                            <div className={styles.studioImageWrap}>
                                <img
                                    src="/assets/identity/butcher-wrapping-paper-roll-v5.jpg"
                                    alt="Hofherr Meat Co. custom printed butcher wrapping paper on cast iron dispenser with twine-wrapped cuts"
                                    className={styles.studioImage}
                                />
                            </div>
                            <div className={styles.studioMeta}>
                                <span className={styles.studioLabel}>Board 01 · Counter Roll &amp; Twine Parcel</span>
                                <span className={styles.studioCaption}>{activePaper.spec}</span>
                            </div>
                        </div>

                        <div className={styles.controlPanel}>
                            <div className={styles.controlGroup}>
                                <h3 className={styles.controlHeading}>Select Paper Stock</h3>
                                <div className={styles.buttonRow}>
                                    {PAPER_STOCKS.map((stock) => (
                                        <button
                                            key={stock.id}
                                            type="button"
                                            onClick={() => setActivePaper(stock)}
                                            className={`${styles.pillBtn} ${activePaper.id === stock.id ? styles.pillBtnActive : ''}`}
                                            style={{ '--swatch-bg': stock.bg } as React.CSSProperties}
                                        >
                                            <span className={styles.swatchDot} />
                                            {stock.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.controlGroup}>
                                <h3 className={styles.controlHeading}>Parcel Finishing &amp; Print Files</h3>
                                <div className={styles.buttonRow}>
                                    <button
                                        type="button"
                                        onClick={() => setShowTwine(false)}
                                        className={`${styles.pillBtn} ${!showTwine ? styles.pillBtnActive : ''}`}
                                    >
                                        Flat Unfolded Vector Sheet
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowTwine(true)}
                                        className={`${styles.pillBtn} ${showTwine ? styles.pillBtnActive : ''}`}
                                    >
                                        With Hemp Twine &amp; Center Seal
                                    </button>
                                </div>
                                <div className={styles.downloadRow}>
                                        <Link
                                        href="/product-identity/print?sheet=wrap&autoprint=1"
                                        className={styles.downloadBtn}
                                    >
                                        🖨 Print 1:1 Swatch (7.50&quot;×4.75&quot;) &amp; Freezer Plate (7.50&quot;×4.40&quot;)
                                </Link>
                                <a
                                    href="/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg"
                                    download="hofherr-wrapping-paper-pattern.svg"
                                    className={styles.downloadBtn}
                                >
                                    ⬇ 24.00&quot;×16.00&quot; Vector Sheet (.SVG)
                                </a>
                                <a
                                    href="/assets/identity/hofherr-wrapping-paper-ink-only-10-icons.svg"
                                    download="hofherr-wrapping-paper-ink-only.svg"
                                    className={styles.downloadBtn}
                                >
                                    ⬇ Spot-Color Ink Plates (.SVG)
                                </a>
                                <a
                                    href="/assets/identity/hofherr-wrapping-paper-tile-10-icons.svg"
                                    download="hofherr-wrapping-paper-tile.svg"
                                    className={styles.downloadBtn}
                                >
                                    ⬇ 5.00&quot;×6.00&quot; Repeat Tile (.SVG)
                                </a>
                                <a
                                    href="/assets/identity/hofherr-wrapping-paper-print-10-icons-7200x4800.png"
                                    download="hofherr-wrapping-paper-print-7200x4800.png"
                                    className={styles.downloadBtn}
                                >
                                    ⬇ 24.00&quot;×16.00&quot; @ 300-DPI Print (.PNG)
                                </a>
                            </div>
                        </div>

                        {/* Live Pure-Vector Butcher Sheet Simulator */}
                        <div
                            className={styles.paperSheetStage}
                            style={
                                {
                                    '--paper-bg': activePaper.bg,
                                    '--paper-ink': activePaper.ink,
                                } as React.CSSProperties
                            }
                        >
                            <img
                                src="/assets/identity/hofherr-wrapping-paper-ink-only-10-icons.svg?v=2"
                                alt="Hofherr Meat Co. true vector step-and-repeat butcher wrapping paper pattern"
                                className={styles.paperVectorSheet}
                            />

                            {showTwine && (
                                <>
                                    <div className={styles.twineHorizontal} />
                                    <div className={styles.twineVertical} />
                                    <div className={styles.twineSealBadge}>
                                        <img
                                            src={selectedSticker.src}
                                            alt={selectedSticker.name}
                                            className={styles.dieCutImg}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                </div>
            </section>

        {/* ── 02 / Die-Cut Stickers & Tamper-Evident Deli Seals ── */}
        <section id="stickers" aria-labelledby="stickers-heading" className="section">
            <div className={`container ${styles.sectionStack}`}>
                <div className={styles.sectionHeader}>
                    <h2 id="stickers-heading" className={styles.sectionTitle}>
                        02 / Die-Cut Flame Stickers &amp; Counter Seals
                    </h2>
                    <p className={styles.sectionDesc}>
                        Each department has its own woodcut flame emblem — from Prime Beef, Heritage Pork, and
                        Spit-Roasted Chicken to Cave-Aged Swiss Cheese and 24-Hour Kettle Bone Broth. Click any
                        department sticker below to preview how it seals a custom-cut counter label.
                    </p>
                </div>

                {/* 10-Sticker Interactive Department Grid */}
                <div className={styles.stickerCatalogGrid}>
                    {FLAME_STICKERS.map((sticker) => (
                        <button
                            key={sticker.id}
                            type="button"
                            onClick={() => setSelectedSticker(sticker)}
                            className={`${styles.stickerCard} ${selectedSticker.id === sticker.id ? styles.stickerCardActive : ''}`}
                            style={
                                {
                                    '--sticker-radius': stickerShape === 'circle' ? '999px' : '18px',
                                } as React.CSSProperties
                            }
                        >
                            <div className={styles.dieCutPreview}>
                                <img
                                    src={sticker.src}
                                    alt={sticker.name}
                                    className={styles.dieCutImg}
                                />
                            </div>
                            <span className={styles.stickerName}>{sticker.name}</span>
                            <span className={styles.stickerDept}>{sticker.dept} · Ø 3.00&quot;</span>
                        </button>
                    ))}
                </div>

                <div className={styles.splitGrid}>
                    <div className={styles.studioBoard}>
                        <div className={styles.studioImageWrap}>
                            <img
                                src="/assets/identity/butcher-deli-stickers-sheet-v4.jpg?v=2"
                                alt="Hofherr Meat Co. 10 true-SVG die-cut flame-linocut stickers, patterned butcher parcel with circular Flame-Cow seal, and tamper-evident deli scale labels on dark slate"
                                className={styles.studioImage}
                            />
                        </div>
                        <div className={styles.studioMeta}>
                            <span className={styles.studioLabel}>Board 02 · Matte Vinyl Die-Cuts (Ø 3.00&quot;) &amp; Scale Labels (4.00&quot;×3.00&quot;)</span>
                            <span className={styles.studioCaption}>Freezer-Grade Adhesive · Kiss-Cut &amp; Roll Format</span>
                        </div>
                    </div>

                    <div className={styles.controlPanel}>
                        <div className={styles.controlGroup}>
                            <h3 className={styles.controlHeading}>Sticker Die-Cut Format &amp; Counter Location</h3>
                            <div className={styles.buttonRow}>
                                <button
                                    type="button"
                                    onClick={() => setStickerShape('circle')}
                                    className={`${styles.pillBtn} ${stickerShape === 'circle' ? styles.pillBtnActive : ''}`}
                                >
                                    3.00&quot;×3.00&quot; Circular Coin Seal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStickerShape('rounded')}
                                    className={`${styles.pillBtn} ${stickerShape === 'rounded' ? styles.pillBtnActive : ''}`}
                                >
                                    3.00&quot;×3.00&quot; Contour Badge Cut
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliStore('butcher')}
                                    className={`${styles.pillBtn} ${deliStore === 'butcher' ? styles.pillBtnActive : ''}`}
                                >
                                    Northfield Butcher Shop
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliStore('depot')}
                                    className={`${styles.pillBtn} ${deliStore === 'depot' ? styles.pillBtnActive : ''}`}
                                >
                                    Winnetka Depot
                                </button>
                            </div>
                            <div className={styles.downloadRow}>
                                    <Link
                                        href="/product-identity/print?sheet=stickers&autoprint=1"
                                    className={styles.downloadBtn}
                                >
                                    🖨 Print 3.00&quot;×3.00&quot; Stickers (1:1)
                                    </Link>
                            <Link
                                href="/product-identity/print?sheet=scale-labels&autoprint=1"
                                className={styles.downloadBtn}
                            >
                                🖨 Print 4.00&quot;×3.00&quot; Scale Labels (1:1)
                        </Link>
                        <a
                            href="/assets/identity/hofherr-die-cut-stickers-10-icons.svg"
                            download="hofherr-die-cut-stickers-10-icons.svg"
                            className={styles.downloadBtn}
                        >
                            ⬇ 10-Icon Die-Cut Sheet (19.00&quot;×8.50&quot; .SVG)
                        </a>
                        <a
                            href={selectedSticker.src}
                            download={`hofherr-sticker-${selectedSticker.id}.svg`}
                            className={styles.downloadBtn}
                        >
                            ⬇ {selectedSticker.name} Ø 3.00&quot; Sticker (.SVG)
                        </a>
                    </div>
                </div>

                {/* Live Deli Scale Label Preview */}
                <div className={styles.deliLabelCard}>
                    <div className={styles.deliLabelHeader}>
                        <div className={styles.deliLabelBrand}>
                            <span className={styles.deliLabelShop}>HOFHERR MEAT CO.</span>
                            <span className={styles.deliLabelLoc}>
                                {deliStore === 'butcher'
                                    ? 'THE BUTCHER SHOP · 300 HAPP RD · NORTHFIELD, IL'
                                    : 'THE DEPOT · 754 ELM ST · WINNETKA METRA STATION'}
                            </span>
                        </div>
                        <div className={styles.deliLabelSeal}>
                            <img
                                src={selectedSticker.src}
                                alt={selectedSticker.name}
                                className={styles.dieCutImg}
                            />
                        </div>
                    </div>

                    <div className={styles.deliLabelFields}>
                        <div className={`${styles.deliField} ${styles.deliFieldFull}`}>
                            <span className={styles.deliFieldKey}>Cut / Selection</span>
                            <span className={styles.deliFieldVal}>{selectedSticker.sampleCut}</span>
                        </div>
                        <div className={styles.deliField}>
                            <span className={styles.deliFieldKey}>Department</span>
                            <span className={styles.deliFieldVal}>{selectedSticker.name}</span>
                        </div>
                        <div className={styles.deliField}>
                            <span className={styles.deliFieldKey}>Net Weight</span>
                            <span className={styles.deliFieldVal}>{selectedSticker.sampleWeight}</span>
                        </div>
                        <div className={styles.deliField}>
                            <span className={styles.deliFieldKey}>Packed On</span>
                            <span className={styles.deliFieldVal}>FRESH TODAY</span>
                        </div>
                        <div className={styles.deliField}>
                            <span className={styles.deliFieldKey}>Cut By</span>
                            <span className={styles.deliFieldVal}>SEAN H. · MASTER BUTCHER</span>
                        </div>
                    </div>

                    <div className={styles.deliLabelFooter}>
                        <span>{selectedSticker.storageNote}</span>
                        <span>LABEL SIZE: 4.00&quot; W × 3.00&quot; H · (847) 441-MEAT</span>
                    </div>
                </div>
            </div>
                    </div>
                </div>
            </section>

        {/* ── 03 / Custom Rubber Ink Stamps ── */}
        <section id="stamps" aria-labelledby="stamps-heading" className="section">
            <div className={`container ${styles.sectionStack}`}>
                <div className={styles.sectionHeader}>
                    <h2 id="stamps-heading" className={styles.sectionTitle}>
                        03 / Turned-Wood &amp; Brass Rubber Stamps
                    </h2>
                    <p className={styles.sectionDesc}>
                        Kraft takeaway bags, catering boxes, and butcher parcels receive a hand-pressed rubber stamp
                        at checkout. The natural paper grain breaks up the solid crimson ink just enough to echo our
                        distressed woodblock illustration style.
                    </p>
                </div>

                <div className={styles.splitGrid}>
                    <div className={styles.studioBoard}>
                        <div className={styles.studioImageWrap}>
                            <img
                                src="/assets/identity/butcher-rubber-stamp-system.jpg?v=2"
                                alt="Turned walnut and brass rubber butcher stamps with crimson ink pad and hand-stamped impressions on kraft paper"
                                className={styles.studioImage}
                            />
                        </div>
                        <div className={styles.studioMeta}>
                            <span className={styles.studioLabel}>Board 03 · Turned Walnut &amp; Brass Rocker Stamps</span>
                            <span className={styles.studioCaption}>Laser-Engraved Natural Red Rubber · Waterproof Oil-Based Ink</span>
                        </div>
                    </div>

                    <div className={styles.controlPanel}>
                        <div className={styles.controlGroup}>
                            <h3 className={styles.controlHeading}>Select Rubber Stamp Die</h3>
                            <div className={styles.buttonRow}>
                                {STAMP_PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveStamp(preset);
                                            setStampIconId(preset.defaultIconId);
                                        }}
                                        className={`${styles.pillBtn} ${activeStamp.id === preset.id ? styles.pillBtnActive : ''}`}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3 className={styles.controlHeading}>Center Woodcut Emblem &amp; Ink Pad</h3>
                            <div className={styles.buttonRow}>
                                {FLAME_STICKERS.map((sticker) => (
                                    <button
                                        key={sticker.id}
                                        type="button"
                                        onClick={() => setStampIconId(sticker.id)}
                                        className={`${styles.pillBtn} ${stampIconId === sticker.id ? styles.pillBtnActive : ''}`}
                                    >
                                        {sticker.name}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.buttonRow}>
                                {INK_PADS.map((ink) => (
                                    <button
                                        key={ink.id}
                                        type="button"
                                        onClick={() => setActiveInk(ink)}
                                        className={`${styles.pillBtn} ${activeInk.id === ink.id ? styles.pillBtnActive : ''}`}
                                        style={{ '--swatch-bg': ink.hex } as React.CSSProperties}
                                    >
                                        <span className={styles.swatchDot} />
                                        {ink.label}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.downloadRow}>
                                    <Link
                                        href="/product-identity/print?sheet=stamps&autoprint=1"
                                    className={styles.downloadBtn}
                                >
                                    🖨 Print Ø 2.00&quot;, Ø 3.00&quot; &amp; 2.50&quot;×1.10&quot; Stamp Dies (1:1)
                            </Link>
                            <a
                                href="/assets/identity/hofherr-stamp-circular.svg"
                                download="hofherr-stamp-circular.svg"
                                className={styles.downloadBtn}
                            >
                                ⬇ Ø 3.00&quot; (3.00&quot;×3.00&quot;) Circular Scalloped Stamp (.SVG)
                            </a>
                            <a
                                href="/assets/identity/hofherr-stamp-usda-prime.svg"
                                download="hofherr-stamp-usda-prime.svg"
                                className={styles.downloadBtn}
                            >
                                ⬇ 2.50&quot;×1.10&quot; USDA Prime Rectangular Stamp (.SVG)
                            </a>
                        </div>
                    </div>

                    {/* Live Kraft Paper Vector Stamp Impression Preview */}
                    <div
                        className={styles.stampCanvasStage}
                        style={
                            {
                                '--stamp-ink': activeInk.hex,
                            } as React.CSSProperties
                        }
                    >
                        {activeStamp.shape === 'circle' ? (
                            <svg
                                viewBox="0 0 2000 2000"
                                className={styles.stampVectorCircle}
                                role="img"
                                aria-label={`${activeStamp.name} rubber stamp impression`}
                            >
                                <defs>
                                    <mask id="stamp-scallop-ring-mask" x="14" y="14" width="1972" height="1972" maskUnits="userSpaceOnUse">
                                        <path d={SCALLOP_OUTER_PATH} fill="#ffffff" />
                                        <circle cx="1000" cy="1000" r="874" fill="#000000" />
                                    </mask>
                                </defs>

                                {/* 76-Tooth Scalloped Outer Seal Ring */}
                                <path
                                    d={SCALLOP_OUTER_PATH}
                                    fill={activeInk.hex}
                                    mask="url(#stamp-scallop-ring-mask)"
                                />

                                {/* Concentric Inner Seal Ring */}
                                <circle
                                    cx="1000"
                                    cy="1000"
                                    r="832"
                                    fill="none"
                                    stroke={activeInk.hex}
                                    strokeWidth="28"
                                    strokeMiterlimit="16"
                                />

                                {/* Curved Top Arc Typography */}
                                {topArcGlyphs.map((glyph) => (
                                    <text
                                        key={`top-${glyph.key}`}
                                        transform={glyph.transform}
                                        textAnchor={isProvenance ? undefined : 'middle'}
                                        dominantBaseline={isProvenance ? undefined : 'central'}
                                        fill={activeInk.hex}
                                        className={styles.stampSvgArcText}
                                    >
                                        <tspan x="0" y="0">{glyph.char}</tspan>
                                    </text>
                                ))}

                                {/* Curved Bottom Arc Typography */}
                                {bottomArcGlyphs.map((glyph) => (
                                    <text
                                        key={`bot-${glyph.key}`}
                                        transform={glyph.transform}
                                        textAnchor={isProvenance ? undefined : 'middle'}
                                        dominantBaseline={isProvenance ? undefined : 'central'}
                                        fill={activeInk.hex}
                                        className={styles.stampSvgArcBottomText}
                                    >
                                        <tspan x="0" y="0">{glyph.char}</tspan>
                                    </text>
                                ))}

                                {/* Left Flank: EST. 2018 */}
                                <g>
                                    <text
                                        transform="translate(240.39 996.01) rotate(-8)"
                                        fill={activeInk.hex}
                                        className={styles.stampSvgFlankText}
                                    >
                                        <tspan x="0" y="0">{activeStamp.flankTop}</tspan>
                                    </text>
                                    <text
                                        transform="translate(241.0249 1092.8677) rotate(-8)"
                                        fill={activeInk.hex}
                                        className={styles.stampSvgFlankText}
                                    >
                                        <tspan x="0" y="0">{activeStamp.flankBottom}</tspan>
                                    </text>
                                </g>

                                {/* Right Flank: EST. 2018 */}
                                <g>
                                    <text
                                        transform="translate(1558.7474 991.6016) rotate(-8)"
                                        fill={activeInk.hex}
                                        className={styles.stampSvgFlankText}
                                    >
                                        <tspan x="0" y="0">{activeStamp.flankTop}</tspan>
                                    </text>
                                    <text
                                        transform="translate(1559.3834 1088.4556) rotate(-8)"
                                        fill={activeInk.hex}
                                        className={styles.stampSvgFlankText}
                                    >
                                        <tspan x="0" y="0">{activeStamp.flankBottom}</tspan>
                                    </text>
                                </g>

                                {/* Open-Linework Two-Tone Woodcut Center Emblem */}
                                {stampIconId === 'cow' ? (
                                    <g>
                                        <path
                                            d={STAMP_COW_CORAL_PATH}
                                            fill="#e85222"
                                            fillRule="evenodd"
                                            opacity="0.88"
                                        />
                                        <path
                                            d={STAMP_COW_CRIMSON_PATH}
                                            fill={activeInk.hex}
                                            fillRule="evenodd"
                                        />
                                    </g>
                                ) : (
                                    <g transform="translate(188.05, 166.38) scale(1.5844)">
                                        <path
                                            d={currentStampPaths.coralPath}
                                            fill="#e85222"
                                            fillRule="evenodd"
                                            opacity="0.88"
                                        />
                                        <path
                                            d={currentStampPaths.crimsonPath}
                                            fill={activeInk.hex}
                                            fillRule="evenodd"
                                        />
                                    </g>
                                )}
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 640 280"
                                className={styles.stampVectorRect}
                                role="img"
                                aria-label={`${activeStamp.name} rubber stamp impression`}
                            >
                                <rect
                                    x="14"
                                    y="14"
                                    width="612"
                                    height="252"
                                    rx="18"
                                    ry="18"
                                    fill="none"
                                    stroke={activeInk.hex}
                                    strokeWidth="10"
                                />
                                <rect
                                    x="28"
                                    y="28"
                                    width="584"
                                    height="224"
                                    rx="10"
                                    ry="10"
                                    fill="none"
                                    stroke={activeInk.hex}
                                    strokeWidth="3.5"
                                />
                                <text
                                    x="320"
                                    y="98"
                                    textAnchor="middle"
                                    fill={activeInk.hex}
                                    className={styles.stampRectTopText}
                                >
                                    {activeStamp.topText}
                                </text>
                                <text
                                    x="320"
                                    y="166"
                                    textAnchor="middle"
                                    fill={activeInk.hex}
                                    className={styles.stampRectMidText}
                                >
                                    {activeStamp.centerTitle}
                                </text>
                                <text
                                    x="320"
                                    y="226"
                                    textAnchor="middle"
                                    fill={activeInk.hex}
                                    className={styles.stampRectBotText}
                                >
                                    {activeStamp.bottomText}
                                </text>
                            </svg>
                        )}
                    </div>
                </div>
            </div>
                </div>
            </section>

        {/* ── 04 / Complete Packaging Suite & Production Specs ── */}
        <section id="packaging-suite" aria-labelledby="packaging-suite-heading" className="section">
            <div className={`container ${styles.sectionStack}`}>
                <div className={styles.sectionHeader}>
                    <h2 id="packaging-suite-heading" className={styles.sectionTitle}>
                        04 / Complete Countertop Packaging Suite
                    </h2>
                    <p className={styles.sectionDesc}>
                        Viewed together on the block, the wrapping paper, die-cut department seals, and hand-stamped
                        kraft takeaway bags hold a single cohesive visual register from the butcher counter to the
                        customer&apos;s kitchen.
                    </p>
                </div>

                <div className={styles.studioBoard}>
                    <div className={styles.studioImageWrap}>
                        <img
                            src="/assets/identity/butcher-complete-packaging-suite-v5.jpg?v=4"
                            alt="Complete Hofherr Meat Co. countertop packaging suite with patterned butcher paper, die-cut stickers, and stamped kraft takeaway bag"
                            className={styles.studioImage}
                        />
                    </div>
                    <div className={styles.studioMeta}>
                        <span className={styles.studioLabel}>Board 04 · Full Packaging System Assembly</span>
                        <span className={styles.studioCaption}>
                            Wrapping Paper + Die-Cut Department Seals + Stamped Kraft Carryout Bag
                        </span>
                    </div>
                </div>

                <div className={styles.stampSpecList}>
                    <div className={styles.specCard}>
                        <span className={styles.specCode}>SPEC 01 · WRAPPING PAPER</span>
                        <h3 className={styles.specName}>40# Peach &amp; Unbleached Butcher Roll</h3>
                        <p className={styles.specDetail}>
                            FDA food-contact compliant wet-strength butcher paper. Printed flexographically in two
                            spot colors: Oxblood Crimson (<code>#8B0A10</code>) and Smokehouse Amber (<code>#F59B1A</code>)
                            on 18&quot; and 24&quot; counter rolls with a 6&quot; diagonal step-and-repeat grid.
                        </p>
                    </div>

                    <div className={styles.specCard}>
                        <span className={styles.specCode}>SPEC 02 · STICKERS &amp; SEALS</span>
                        <h3 className={styles.specName}>Cold-Temp Matte Vinyl &amp; Scale Labels</h3>
                        <p className={styles.specDetail}>
                            3&quot; circular and contour die-cut stickers printed on 70# matte weatherproof stock
                            with freezer-grade cold-temp adhesive (rated down to -20°F) so seals never lift on
                            chilled butcher paper or vacuum-sealed cuts.
                        </p>
                    </div>

                    <div className={styles.specCard}>
                        <span className={styles.specCode}>SPEC 03 · RUBBER STAMPS</span>
                        <h3 className={styles.specName}>55-Shore Laser-Cut Red Rubber</h3>
                        <p className={styles.specDetail}>
                            Deep-relief 2.3mm laser-engraved natural red rubber mounted on turned American walnut
                            handles and curved brass rocker mounts for uneven meat parcels, paired with fast-drying
                            waterproof pigment ink pads.
                        </p>
                    </div>
                </div>
            </div>
            </section>

        {/* ── 05–10 / Extended identity system (images via Gemini Nano Banana) ── */}
        <ExtendedIdentityBoards />

        {/* ── 09B / Instagram (@hofherrmeatco) & Multi-App Brand Identity System (#app-identity) ── */}
        <AppBrandIdentitySection />

        {/* ── 11 / Merged Social Media Kit, Cut Charts (#cuts), Print & Auto-Post Verification Studio ── */}
        <SocialKit embedded />

        {/* ── 12 / Official Press & Media Download Kit (#press-kit) ── */}
        <PressKitSection />

        {/* ── 13 / Yelp & Facebook Review Audit & Strategic Growth Pitch Deck (#pitch-deck) ── */}
        <PitchDeckClient embedded />
        </main>
    );
}
