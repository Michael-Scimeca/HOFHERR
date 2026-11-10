'use client';

import React, { useState } from 'react';
import styles from './pressKit.module.css';

type PressFilter = 'all' | 'logos' | 'boilerplate' | 'photos' | 'crew' | 'charts' | 'icons';
type StageBg = 'dark' | 'cream' | 'kraft';

type LogoAsset = {
    id: string;
    title: string;
    format: string;
    desc: string;
    src: string;
    downloadName: string;
    secondarySrc?: string;
    secondaryLabel?: string;
    secondaryDownloadName?: string;
    defaultBg?: StageBg;
};

type PhotoAsset = {
    id: string;
    title: string;
    format: string;
    caption: string;
    src: string;
    downloadName: string;
};

type CrewPortrait = {
    id: string;
    name: string;
    role: string;
    bio: string;
    src: string;
    downloadName: string;
};

type IconAsset = {
    id: string;
    name: string;
    src: string;
    downloadName: string;
};

const SHORT_BOILERPLATE =
    'Hofherr Meat Co. is Northfield and Winnetka’s premier craft butcher shop and smokehouse. Founded in 2014 by Chef Sean Hofherr—carrying forward 120+ years of family butchery heritage from Germany and Chicago’s South Side—every cut is hand-trimmed to order and traceable to Midwest family farms.';

const FULL_BOILERPLATE =
    'Founded in March 2014 by Chef & Master Butcher Sean Hofherr at 300 Happ Rd in Northfield, Illinois, Hofherr Meat Co. carries on a four-generation family legacy that began with a village butcher in Germany and took root on Chicago’s historic South Side stockyards in the early 1900s. After honing his craft at Keefer’s Restaurant in River North, apprenticing at Zier’s Prime Meats in Wilmette, and winning both the 2009 North Shore Chili Cookoff and 2010 Lake Bluff Ribfest, Sean built Hofherr Meat Co. around a simple rule: quality meats, no compromise. In 2024, Hofherr Meat Co. expanded with The Depot inside the historic Winnetka Elm Street Metra Train Station (754 Elm St), bringing artisan coffee, scratch pastries, rotisserie meats, and commuter grab-and-go provisions to the North Shore.';

const FACT_SHEET_TEXT = `HOFHERR MEAT CO. — OFFICIAL PRESS & MEDIA FACT SHEET
====================================================================

OFFICIAL NAME:
Hofherr Meat Co. (The Butcher Shop & The Depot)

FOUNDER & HEAD CHEF:
Sean Hofherr (4th-Generation Butcher · Member, Butcher's Guild & Illinois Barbecue Association)

LOCATIONS:
1. The Butcher Shop — 300 Happ Rd, Northfield, IL 60093
   Hours: Tue–Sat 10am–6pm · Sun 10am–4pm · Mon Closed
2. The Depot — 754 Elm St (Historic Elm St. Metra Station), Winnetka, IL 60093
   Hours: Mon–Fri Commuter Morning & Afternoon Service

PHONE & WEB:
Phone: (847) 441-MEAT / (847) 441-6328
Website: https://hofherrmeatco.com
Instagram: @hofherrmeatco

NOTABLE ACCOLADES & MEDIA:
• Featured on America's Test Kitchen "Proof" Podcast
• Winner — 2010 Lake Bluff Ribfest
• Winner — 2009 North Shore Chili Cookoff
• Top 3 — 2011 Des Plaines Rib, Chicken & Sausage Winter Burn Off
• Active Member — The Butcher's Guild & Illinois Barbecue Association

OFFICIAL BRAND COLOR PALETTE:
• Oxblood Crimson:    #8B0A10 (PMS 7622 C · CMYK 0/93/88/45)
• Hofherr Red:        #CC0E1D (PMS 186 C  · CMYK 0/93/86/20)
• Smokehouse Amber:   #F59B1A (PMS 1375 C · CMYK 0/37/89/4)
• Smokehouse Charcoal:#1C1614 (PMS Black 7 C · CMYK 0/21/29/89)
• Counter Cream:      #F3EAD8 (PMS 7527 C · CMYK 0/4/11/5)
• Classic Kraft:      #C8A47E (Unbleached 40# Natural Kraft)

SHORT PRESS BOILERPLATE (50 WORDS):
${SHORT_BOILERPLATE}

FULL EDITORIAL STORY (150 WORDS):
${FULL_BOILERPLATE}

PHOTO & MEDIA CREDIT LINE:
"Courtesy of Hofherr Meat Co. (Northfield & Winnetka, IL)"
`;

const LOGO_ASSETS: LogoAsset[] = [
    {
        id: 'primary-wordmark',
        title: 'Primary Hofherr Wordmark',
        format: 'VECTOR .SVG · INFINITE SCALE',
        desc: 'Official Hofherr Meat Co. stacked serif/stencil display wordmark for dark editorial backgrounds and mastheads.',
        src: '/assets/logo.svg',
        downloadName: 'hofherr-meat-co-wordmark.svg',
        defaultBg: 'dark',
    },
    {
        id: 'circular-stamp-color',
        title: 'Circular Scalloped Provenance Seal (Full Color)',
        format: 'VECTOR .SVG · 2-COLOR SPOT',
        desc: 'Official scalloped butcher seal with Flaming Bull crest, "HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018".',
        src: '/assets/identity/hofherr-stamp-circular.svg',
        downloadName: 'hofherr-stamp-circular.svg',
        defaultBg: 'cream',
    },
    {
        id: 'circular-stamp-crimson',
        title: 'Circular Scalloped Seal (Oxblood Crimson)',
        format: 'VECTOR .SVG · 1-COLOR OXBLOOD',
        desc: 'Single-ink Oxblood Crimson (#8B0A10) press seal for light paper stocks, menus, and partner co-branding.',
        src: '/assets/identity/hofherr-stamp-circular-crimson.svg',
        downloadName: 'hofherr-stamp-circular-crimson.svg',
        defaultBg: 'cream',
    },
    {
        id: 'circular-stamp-dark',
        title: 'Circular Scalloped Seal (Smokehouse Charcoal)',
        format: 'VECTOR .SVG · 1-COLOR CHARCOAL',
        desc: 'High-contrast monochrome charcoal (#1C1614) press seal for newsprint, black-and-white editorial, and engraving.',
        src: '/assets/identity/hofherr-stamp-circular-dark.svg',
        downloadName: 'hofherr-stamp-circular-dark.svg',
        defaultBg: 'cream',
    },
    {
        id: 'app-icon-emblem',
        title: 'Rounded-Square App & Social Avatar',
        format: 'VECTOR .SVG · 1024×1024 MASTER',
        desc: 'Official Oxblood Crimson & Smokehouse Amber Flaming Bull badge for digital directories, podcasts, and avatars.',
        src: '/assets/identity/hofherr-app-icon.svg',
        downloadName: 'hofherr-app-icon.svg',
        defaultBg: 'dark',
    },
    {
        id: 'master-10-emblem-suite',
        title: 'Master 10-Department Emblem Suite',
        format: 'VECTOR .SVG · ALL 10 EMBLEMS',
        desc: 'Complete vector production board containing the master favicon, app icon, rubber stamp, and all 10 department badges.',
        src: '/assets/identity/hofherr-master-emblem-suite.svg',
        downloadName: 'hofherr-master-emblem-suite.svg',
        defaultBg: 'dark',
    },
    {
        id: 'wrapping-paper-pattern',
        title: 'Signature Butcher Wrapping Paper Pattern',
        format: 'VECTOR .SVG + 300-DPI .JPG',
        desc: 'Seamless step-and-repeat 25-department woodcut flame pattern on Classic Kraft (#C8A47E) for editorial backgrounds.',
        src: '/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg?v=3',
        downloadName: 'hofherr-wrapping-paper-pattern.svg',
        secondarySrc: '/assets/identity/hofherr-wrapping-paper-print-hd.jpg',
        secondaryLabel: '↓ 300-DPI (.JPG)',
        secondaryDownloadName: 'hofherr-wrapping-paper-print-hd.jpg',
        defaultBg: 'kraft',
    },
    {
        id: 'storefront-decal-lockup',
        title: 'Arched Storefront & Hours Lockup',
        format: 'VECTOR .SVG · GOLD LEAF & CRIMSON',
        desc: 'Arched "HOFHERR MEAT CO. · THE BUTCHER SHOP" window graphic with flaming bull crest and Northfield hours.',
        src: '/assets/identity/hofherr-door-decal-hours.svg',
        downloadName: 'hofherr-door-decal-hours.svg',
        defaultBg: 'dark',
    },
];

const PHOTO_ASSETS: PhotoAsset[] = [
    {
        id: 'northfield-counter',
        title: 'The Butcher Shop — Northfield Counter',
        format: 'HIGH-RES .JPG · STOREFRONT',
        caption: 'Custom-cut butcher case and counter at 300 Happ Rd, Northfield, IL. Credit: Courtesy of Hofherr Meat Co.',
        src: '/assets/Store-butcher.jpg',
        downloadName: 'hofherr-butcher-shop-northfield.jpg',
    },
    {
        id: 'winnetka-depot',
        title: 'The Depot — Historic Winnetka Metra Station',
        format: 'HIGH-RES .PNG · SECOND LOCATION',
        caption: 'Hofherr Meat Co. at The Depot inside the historic Elm Street Metra Station (754 Elm St, Winnetka).',
        src: '/shops/winnetka.png',
        downloadName: 'hofherr-the-depot-winnetka.png',
    },
    {
        id: 'shop-exterior',
        title: 'Northfield Storefront Exterior (Front View)',
        format: 'HIGH-RES .JPG · EXTERIOR (16:9)',
        caption: 'Front-facing exterior storefront at 300 Happ Rd, Suite 105, Northfield, IL. Credit: Courtesy of Hofherr Meat Co.',
        src: '/images/visit/northfield-storefront-front.jpg',
        downloadName: 'hofherr-northfield-exterior.jpg',
    },
    {
        id: 'shop-interior',
        title: 'Inside the Butcher Shop',
        format: 'HIGH-RES .JPG · INTERIOR',
        caption: 'Interior view of the Northfield butcher shop floor and dry-aged meat case.',
        src: '/assets/shop-interior.jpg',
        downloadName: 'hofherr-northfield-interior.jpg',
    },
    {
        id: 'pig-roast-spread',
        title: 'Whole-Hog BBQ & Pig Roast Catering',
        format: 'HIGH-RES .JPG · CULINARY / BBQ',
        caption: 'Signature whole-hog roast and smokehouse catering spread by Chef Sean Hofherr.',
        src: '/assets/pig-roast-spread.jpg',
        downloadName: 'hofherr-whole-hog-pig-roast.jpg',
    },
    {
        id: 'catering-buffet',
        title: 'Smokehouse & Event Catering Lineup',
        format: 'HIGH-RES .JPG · CATERING',
        caption: 'Full-service North Shore event catering buffet from Hofherr Meat Co.',
        src: '/assets/catering-buffet.jpg',
        downloadName: 'hofherr-catering-buffet.jpg',
    },
    {
        id: 'rotisserie-chickens',
        title: 'Pasture-Raised Spit-Roasted Chickens',
        format: 'HIGH-RES .JPG · SIGNATURE DISH',
        caption: 'Golden pasture-raised rotisserie chickens fresh off the spit.',
        src: '/assets/rotisserie-chickens.jpg',
        downloadName: 'hofherr-rotisserie-chickens.jpg',
    },
    {
        id: 'italian-beef',
        title: 'House-Roasted Chicago Italian Beef',
        format: 'HIGH-RES .JPG · SIGNATURE DISH',
        caption: 'Thin-sliced house-roasted Italian beef simmered in natural jus with hot giardiniera.',
        src: '/assets/italian-beef.jpg',
        downloadName: 'hofherr-chicago-italian-beef.jpg',
    },
    {
        id: 'packaging-suite-photo',
        title: 'Countertop Wrapping Paper & Packaging Suite',
        format: 'HIGH-RES .JPG · BRAND IDENTITY',
        caption: 'Custom printed butcher wrapping paper, die-cut department seals, and stamped kraft carryout bags.',
        src: '/assets/identity/packaging/butcher-complete-packaging-suite-10-icons.jpg',
        downloadName: 'hofherr-counter-packaging-suite.jpg',
    },
];

const CREW_PORTRAITS: CrewPortrait[] = [
    {
        id: 'sean-hofherr',
        name: 'Sean Hofherr',
        role: 'Owner & Head Chef',
        bio: '4th-generation butcher, alum of Keefer’s Restaurant & Zier’s Prime Meats, winner of the 2009 North Shore Chili Cookoff and 2010 Lake Bluff Ribfest.',
        src: '/team/sean.jpg',
        downloadName: 'sean-hofherr-owner-head-chef.jpg',
    },
    {
        id: 'vincent-recaei',
        name: 'Vincent Recaei',
        role: 'Shop Manager',
        bio: 'Northfield native overseeing daily butcher shop operations, vendor relationships, and customer service alongside Sean.',
        src: '/team/vincent.jpg',
        downloadName: 'vincent-recaei-manager.jpg',
    },
    {
        id: 'emily-cushing',
        name: 'Emily Cushing',
        role: 'Craft Butcher',
        bio: 'UW–Platteville Meat Processing graduate specializing in whole-animal breakdown, custom cuts, and holiday roasts.',
        src: '/team/emily.jpg',
        downloadName: 'emily-cushing-butcher.jpg',
    },
    {
        id: 'dan-blair',
        name: 'Dan Blair',
        role: 'Craft Butcher',
        bio: 'Northfield native with decades of meat-counter expertise, custom trimming, and cooking guidance.',
        src: '/team/dan.jpg',
        downloadName: 'dan-blair-butcher.jpg',
    },
    {
        id: 'jamie-bisoulis',
        name: 'Jamie Bisoulis',
        role: 'Head Chef',
        bio: 'Founding kitchen team leader overseeing signature kettle soups, stocks, scratch sides, sauces, and prepared foods.',
        src: '/team/jamie.jpg',
        downloadName: 'jamie-bisoulis-head-chef.jpg',
    },
    {
        id: 'steve-soler',
        name: 'Steve Soler',
        role: 'Chef',
        bio: 'Culinary partner driving seasonal specials, catering menus, charcuterie, and comfort-food classics.',
        src: '/team/steve.jpg',
        downloadName: 'steve-soler-chef.jpg',
    },
];

const CHART_ASSETS: LogoAsset[] = [
    {
        id: 'cut-chart-poster',
        title: '24" × 36" Know Your Cuts & 10-Department Poster',
        format: '300-DPI PRINT .JPG + VECTOR EMBLEMS',
        desc: 'Full-bleed vintage linocut wall poster featuring the beef primal diagram and all 10 department badges.',
        src: '/assets/identity/print/cut-chart-poster-print.jpg?v=13',
        downloadName: 'hofherr-cut-chart-poster-24x36.jpg',
        defaultBg: 'cream',
    },
    {
        id: 'beef-cut-chart-svg',
        title: 'Beef Primal Cut Chart (Vector)',
        format: '100% VECTOR .SVG',
        desc: 'Scalable linocut steer diagram showing Chuck, Rib, Short Loin, Sirloin, Round, Brisket, Plate, Flank & Shank.',
        src: '/assets/social/cut-chart-beef.svg',
        downloadName: 'hofherr-cut-chart-beef.svg',
        defaultBg: 'dark',
    },
    {
        id: 'pork-cut-chart-svg',
        title: 'Heritage Pork Primal Cut Chart (Vector)',
        format: '100% VECTOR .SVG',
        desc: 'Scalable linocut heritage hog diagram showing Boston Butt, Picnic, Loin, Spare Ribs, Pork Belly & Ham.',
        src: '/assets/social/cut-chart-pork.svg',
        downloadName: 'hofherr-cut-chart-pork.svg',
        defaultBg: 'dark',
    },
    {
        id: 'lamb-cut-chart-svg',
        title: 'Pasture Lamb Primal Cut Chart (Vector)',
        format: '100% VECTOR .SVG',
        desc: 'Scalable linocut lamb diagram showing Shoulder, Rack, Loin, Leg, Breast & Foreshank.',
        src: '/assets/social/cut-chart-lamb.svg',
        downloadName: 'hofherr-cut-chart-lamb.svg',
        defaultBg: 'dark',
    },
    {
        id: 'chicken-cut-chart-svg',
        title: 'Pasture Poultry Cut Chart (Vector)',
        format: '100% VECTOR .SVG',
        desc: 'Scalable linocut rooster diagram showing Breast, Tenderloin, Wing, Thigh, Drumstick & Back.',
        src: '/assets/social/cut-chart-chicken.svg',
        downloadName: 'hofherr-cut-chart-chicken.svg',
        defaultBg: 'dark',
    },
];

const WOODCUT_ICONS: IconAsset[] = [
    // 14 Butcher Shop Sidebar Icons (Exact Online-Orders Order)
    { id: 'cow', name: 'Beef', src: '/icons/cow.svg', downloadName: 'hofherr-icon-beef.svg' },
    { id: 'pig', name: 'Pork', src: '/icons/pig.svg', downloadName: 'hofherr-icon-pork.svg' },
    { id: 'chicken', name: 'Chicken', src: '/icons/chicken.svg', downloadName: 'hofherr-icon-chicken.svg' },
    { id: 'suage', name: 'Sausage', src: '/icons/suage.svg', downloadName: 'hofherr-icon-sausage.svg' },
    { id: 'hamcheese', name: 'Deli Meat & Cheese', src: '/icons/hamcheese.svg', downloadName: 'hofherr-icon-deli.svg' },
    { id: 'prepared', name: 'Prepared Foods', src: '/icons/prepared.svg', downloadName: 'hofherr-icon-prepared.svg' },
    { id: 'lamb', name: 'Lamb', src: '/icons/lamb.svg', downloadName: 'hofherr-icon-lamb.svg' },
    { id: 'fish', name: 'Seafood', src: '/icons/fish.svg', downloadName: 'hofherr-icon-seafood.svg' },
    { id: 'veal', name: 'Veal', src: '/icons/veal.svg', downloadName: 'hofherr-icon-veal.svg' },
    { id: 'turkey', name: 'Turkey', src: '/icons/turkey.svg', downloadName: 'hofherr-icon-turkey.svg' },
    { id: 'duck', name: 'Duck', src: '/icons/duck.svg', downloadName: 'hofherr-icon-duck.svg' },
    { id: 'game', name: 'Game', src: '/icons/game.svg', downloadName: 'hofherr-icon-game.svg' },
    { id: 'stocksoup', name: 'Soups & Stocks', src: '/icons/stocksoup.svg', downloadName: 'hofherr-icon-soups-stocks.svg' },
    { id: 'catering', name: 'Catering', src: '/icons/catering.svg', downloadName: 'hofherr-icon-catering.svg' },
    // 12 Winnetka Depot & Specialty Icons + 2 Map Pins
    { id: 'cheese', name: 'Artisanal Cheese', src: '/icons/cheese.svg', downloadName: 'hofherr-icon-cheese.svg' },
    { id: 'seafood-lobster', name: 'Shellfish & Crab', src: '/assets/identity/stickers/sticker-seafood-lobster.svg', downloadName: 'hofherr-icon-shellfish-lobster.svg' },
    { id: 'pastries', name: 'Pastries', src: '/icons/pastries.svg', downloadName: 'hofherr-icon-pastries.svg' },
    { id: 'hotbeverage', name: 'Hot Beverages', src: '/icons/hotbeverage.svg', downloadName: 'hofherr-icon-hot-beverage.svg' },
    { id: 'grabgo', name: 'Grab + Go Hot Foods', src: '/icons/grabgo.svg', downloadName: 'hofherr-icon-grab-and-go.svg' },
    { id: 'produce', name: 'Produce', src: '/icons/produce.svg', downloadName: 'hofherr-icon-produce.svg' },
    { id: 'dairy', name: 'Dairy, Eggs & Cheese', src: '/icons/dairy.svg', downloadName: 'hofherr-icon-dairy.svg' },
    { id: 'pantry', name: 'Pantry & More', src: '/icons/pantry.svg', downloadName: 'hofherr-icon-pantry.svg' },
    { id: 'bread', name: 'Bread & Bakery', src: '/icons/bread.svg', downloadName: 'hofherr-icon-bread.svg' },
    { id: 'coldbeverage', name: 'Cold Beverages', src: '/icons/coldbeverage.svg', downloadName: 'hofherr-icon-cold-beverage.svg' },
    { id: 'swag', name: 'HMC Swag', src: '/icons/swag.svg', downloadName: 'hofherr-icon-swag.svg' },
    { id: 'festival', name: 'Festival', src: '/icons/festival.svg', downloadName: 'hofherr-icon-festival.svg' },
    { id: 'butcher-pin', name: 'Butcher Map Pin', src: '/icons/butcher-pin.svg', downloadName: 'hofherr-icon-butcher-pin.svg' },
    { id: 'depot-pin', name: 'Depot Map Pin', src: '/icons/depot-pin.svg', downloadName: 'hofherr-icon-depot-pin.svg' },
];

export default function PressKitSection() {
    const [filter, setFilter] = useState<PressFilter>('all');
    const [stageBg, setStageBg] = useState<StageBg | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copyText = async (key: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1800);
        } catch {
            /* ignore clipboard errors */
        }
    };

    const downloadFactSheetFile = () => {
        const blob = new Blob([FACT_SHEET_TEXT], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hofherr-meat-co-press-fact-sheet.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const getStageClass = (defaultBg: StageBg = 'dark') => {
        const active = stageBg ?? defaultBg;
        if (active === 'cream') return styles.stageCream;
        if (active === 'kraft') return styles.stageKraft;
        return styles.stageDark;
    };

    const showBoilerplate = filter === 'all' || filter === 'boilerplate';
    const showLogos = filter === 'all' || filter === 'logos';
    const showPhotos = filter === 'all' || filter === 'photos';
    const showCrew = filter === 'all' || filter === 'crew';
    const showCharts = filter === 'all' || filter === 'charts';
    const showIcons = filter === 'all' || filter === 'icons';

    return (
        <section id="press-kit" aria-labelledby="press-kit-heading" className="section">
            <div className={`container ${styles.stack}`}>
                <div className={styles.topBar}>
                    <div className={styles.header}>
                        <h2 id="press-kit-heading" className={styles.sectionTitle}>
                            12 / Official Press &amp; Media Download Kit
                        </h2>
                        <p className={styles.sectionDesc}>
                            Self-serve press room for journalists, podcast producers, event partners, and designers.
                            Download official vector logos, scalloped provenance stamps, high-resolution storefront and
                            culinary photography, founder headshots, primal cut charts, and approved press boilerplates.
                        </p>
                    </div>
                    <div className={styles.topActions}>
                        <button type="button" onClick={downloadFactSheetFile} className={styles.primaryBtn}>
                            ⬇ Download Press Fact Sheet (.TXT)
                        </button>
                        <a
                            href="/assets/identity/hofherr-master-emblem-suite.svg"
                            download="hofherr-master-emblem-suite.svg"
                            className={styles.secondaryBtn}
                        >
                            ⬇ Master Logo &amp; 10-Emblem Suite (.SVG)
                        </a>
                        <button
                            type="button"
                            onClick={() => copyText('all-facts', FACT_SHEET_TEXT)}
                            className={styles.secondaryBtn}
                        >
                            {copiedKey === 'all-facts' ? '✓ Copied Full Press Kit Text' : '📋 Copy All Press Copy'}
                        </button>
                    </div>
                </div>

                {/* Filter Bar + Background Preview Toggle */}
                <div className={styles.filterRow}>
                    <div className={styles.filterTabs} role="tablist" aria-label="Press asset categories">
                        {(
                            [
                                { id: 'all', label: 'All Press Assets' },
                                { id: 'logos', label: 'Logos & Vector Seals (8)' },
                                { id: 'boilerplate', label: 'Boilerplate & Fact Sheet' },
                                { id: 'photos', label: 'Storefront & Food Photos (9)' },
                                { id: 'crew', label: 'Founder & Butcher Crew (6)' },
                                { id: 'charts', label: 'Cut Charts & Posters (5)' },
                                { id: 'icons', label: '25 Woodcut Flame Icons (.SVG)' },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFilter(tab.id)}
                                className={`${styles.filterBtn} ${filter === tab.id ? styles.filterBtnActive : ''}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.bgToggleGroup}>
                        <span className={styles.bgToggleLabel}>Logo Backdrop:</span>
                        <button
                            type="button"
                            onClick={() => setStageBg(null)}
                            className={`${styles.bgPill} ${stageBg === null ? styles.bgPillActive : ''}`}
                        >
                            Auto
                        </button>
                        <button
                            type="button"
                            onClick={() => setStageBg('dark')}
                            className={`${styles.bgPill} ${stageBg === 'dark' ? styles.bgPillActive : ''}`}
                        >
                            Charcoal
                        </button>
                        <button
                            type="button"
                            onClick={() => setStageBg('cream')}
                            className={`${styles.bgPill} ${stageBg === 'cream' ? styles.bgPillActive : ''}`}
                        >
                            Cream
                        </button>
                        <button
                            type="button"
                            onClick={() => setStageBg('kraft')}
                            className={`${styles.bgPill} ${stageBg === 'kraft' ? styles.bgPillActive : ''}`}
                        >
                            Kraft
                        </button>
                    </div>
                </div>

                {/* 1. Approved Press Boilerplate & Fast Facts */}
                {showBoilerplate && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>Approved Editorial Boilerplates &amp; Fast Facts</h3>
                            <p className={styles.subCaption}>
                                Ready-to-publish descriptions and verified shop details for articles, event programs, and podcast show notes
                            </p>
                        </div>
                        <div className={styles.bioGrid}>
                            <article className={styles.bioCard}>
                                <div className={styles.bioTop}>
                                    <span className={styles.bioMetaTag}>SHORT BIO · 50 WORDS</span>
                                    <h4 className={styles.bioCardTitle}>Standard Event &amp; Directory Blurb</h4>
                                    <p className={styles.bioBody}>{SHORT_BOILERPLATE}</p>
                                </div>
                                <div className={styles.cardActionRow}>
                                    <button
                                        type="button"
                                        onClick={() => copyText('short-bio', SHORT_BOILERPLATE)}
                                        className={styles.dlBtn}
                                    >
                                        {copiedKey === 'short-bio' ? '✓ Copied Short Bio' : '📋 Copy 50-Word Bio'}
                                    </button>
                                </div>
                            </article>

                            <article className={styles.bioCard}>
                                <div className={styles.bioTop}>
                                    <span className={styles.bioMetaTag}>FULL STORY · 150 WORDS</span>
                                    <h4 className={styles.bioCardTitle}>Editorial Heritage &amp; Founder Story</h4>
                                    <p className={styles.bioBody}>{FULL_BOILERPLATE}</p>
                                </div>
                                <div className={styles.cardActionRow}>
                                    <button
                                        type="button"
                                        onClick={() => copyText('full-bio', FULL_BOILERPLATE)}
                                        className={styles.dlBtn}
                                    >
                                        {copiedKey === 'full-bio' ? '✓ Copied Full Story' : '📋 Copy 150-Word Story'}
                                    </button>
                                </div>
                            </article>

                            <article className={styles.bioCard}>
                                <div className={styles.bioTop}>
                                    <span className={styles.bioMetaTag}>VERIFIED FACT SHEET</span>
                                    <h4 className={styles.bioCardTitle}>Locations, Accolades &amp; Media Credits</h4>
                                    <dl className={styles.factList}>
                                        <dt>Founder</dt>
                                        <dd>Sean Hofherr (Owner &amp; Head Chef)</dd>
                                        <dt>Butcher Shop</dt>
                                        <dd>300 Happ Rd, Northfield, IL · (847) 441-MEAT</dd>
                                        <dt>The Depot</dt>
                                        <dd>754 Elm St (Metra Station), Winnetka, IL</dd>
                                        <dt>Established</dt>
                                        <dd>March 2014 (Northfield) · 2024 (The Depot)</dd>
                                        <dt>Awards</dt>
                                        <dd>2010 Lake Bluff Ribfest · 2009 Chili Cookoff</dd>
                                        <dt>Photo Credit</dt>
                                        <dd>Courtesy of Hofherr Meat Co.</dd>
                                    </dl>
                                </div>
                                <div className={styles.cardActionRow}>
                                    <button type="button" onClick={downloadFactSheetFile} className={styles.dlBtn}>
                                        ⬇ Fact Sheet (.TXT)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => copyText('fact-sheet', FACT_SHEET_TEXT)}
                                        className={styles.dlBtnSecondary}
                                    >
                                        {copiedKey === 'fact-sheet' ? '✓ Copied' : '📋 Copy Facts'}
                                    </button>
                                </div>
                            </article>
                        </div>
                    </div>
                )}

                {/* 2. Official Logos, Wordmarks & Vector Seals */}
                {showLogos && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>Official Logos, Wordmarks &amp; Scalloped Seals</h3>
                            <p className={styles.subCaption}>
                                Master vector (.SVG) and high-resolution raster files — maintain clear space equal to the height of the &ldquo;H&rdquo; on all sides
                            </p>
                        </div>
                        <div className={styles.logoGrid}>
                            {LOGO_ASSETS.map((asset) => (
                                <article key={asset.id} className={styles.logoCard}>
                                    <div className={`${styles.logoStage} ${getStageClass(asset.defaultBg)}`}>
                                        <img src={asset.src} alt={asset.title} className={styles.logoImg} />
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.formatBadge}>{asset.format}</span>
                                        <h4 className={styles.cardTitle}>{asset.title}</h4>
                                        <p className={styles.cardDesc}>{asset.desc}</p>
                                    </div>
                                    <div className={styles.cardActionRow}>
                                        <a href={asset.src} download={asset.downloadName} className={styles.dlBtn}>
                                            ⬇ Download (.SVG)
                                        </a>
                                        {asset.secondarySrc && (
                                            <a
                                                href={asset.secondarySrc}
                                                download={asset.secondaryDownloadName}
                                                className={styles.dlBtnSecondary}
                                            >
                                                {asset.secondaryLabel}
                                            </a>
                                        )}
                                        <a
                                            href={asset.src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.dlBtnSecondary}
                                        >
                                            ↗ Open
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. High-Res Storefront, Culinary & Counter Photography */}
                {showPhotos && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>Storefront, Smokehouse &amp; Culinary Press Photography</h3>
                            <p className={styles.subCaption}>
                                Approved high-resolution photography cleared for editorial publication with credit: &ldquo;Courtesy of Hofherr Meat Co.&rdquo;
                            </p>
                        </div>
                        <div className={styles.photoGrid}>
                            {PHOTO_ASSETS.map((photo) => (
                                <article key={photo.id} className={styles.photoCard}>
                                    <div className={styles.photoFrame}>
                                        <img src={photo.src} alt={photo.title} className={styles.photoImg} />
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.formatBadge}>{photo.format}</span>
                                        <h4 className={styles.cardTitle}>{photo.title}</h4>
                                        <p className={styles.cardDesc}>{photo.caption}</p>
                                    </div>
                                    <div className={styles.cardActionRow}>
                                        <a href={photo.src} download={photo.downloadName} className={styles.dlBtn}>
                                            ⬇ Download Photo (.JPG)
                                        </a>
                                        <a
                                            href={photo.src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.dlBtnSecondary}
                                        >
                                            ↗ Full Size
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => copyText(photo.id, photo.caption)}
                                            className={styles.dlBtnSecondary}
                                        >
                                            {copiedKey === photo.id ? '✓ Copied' : '📋 Copy Caption'}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Founder & Butcher Crew Portraits */}
                {showCrew && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>Founder &amp; Butcher Crew Press Portraits</h3>
                            <p className={styles.subCaption}>
                                Official headshots and verified titles/bios for interviews, culinary panels, and feature profiles
                            </p>
                        </div>
                        <div className={styles.photoGrid}>
                            {CREW_PORTRAITS.map((member) => (
                                <article key={member.id} className={styles.photoCard}>
                                    <div className={styles.portraitFrame}>
                                        <img
                                            src={member.src}
                                            alt={`${member.name} — ${member.role}, Hofherr Meat Co.`}
                                            className={styles.photoImg}
                                        />
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.formatBadge}>{member.role}</span>
                                        <h4 className={styles.cardTitle}>{member.name}</h4>
                                        <p className={styles.cardDesc}>{member.bio}</p>
                                    </div>
                                    <div className={styles.cardActionRow}>
                                        <a href={member.src} download={member.downloadName} className={styles.dlBtn}>
                                            ⬇ Portrait (.JPG)
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                copyText(
                                                    member.id,
                                                    `${member.name}, ${member.role} at Hofherr Meat Co. — ${member.bio}`
                                                )
                                            }
                                            className={styles.dlBtnSecondary}
                                        >
                                            {copiedKey === member.id ? '✓ Copied Bio' : '📋 Copy Bio'}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Editorial Cut Charts & Poster Graphics */}
                {showCharts && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>Editorial Primal Cut Charts &amp; Wall Poster</h3>
                            <p className={styles.subCaption}>
                                Pure vector (.SVG) primal cut diagrams and 300-DPI poster artwork for culinary features and educational guides
                            </p>
                        </div>
                        <div className={styles.logoGrid}>
                            {CHART_ASSETS.map((chart) => (
                                <article key={chart.id} className={styles.logoCard}>
                                    <div className={`${styles.logoStage} ${getStageClass(chart.defaultBg)}`}>
                                        <img src={chart.src} alt={chart.title} className={styles.logoImg} />
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.formatBadge}>{chart.format}</span>
                                        <h4 className={styles.cardTitle}>{chart.title}</h4>
                                        <p className={styles.cardDesc}>{chart.desc}</p>
                                    </div>
                                    <div className={styles.cardActionRow}>
                                        <a href={chart.src} download={chart.downloadName} className={styles.dlBtn}>
                                            ⬇ Download ({chart.downloadName.endsWith('.svg') ? '.SVG' : '.JPG'})
                                        </a>
                                        <a
                                            href={chart.src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.dlBtnSecondary}
                                        >
                                            ↗ Open Full Size
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. Complete 25-Category Woodcut Flame Vector Icon Pack */}
                {showIcons && (
                    <div className={styles.subSection}>
                        <div className={styles.subHeader}>
                            <h3 className={styles.subTitle}>28 Official Woodcut Flame Department &amp; Category Icons (.SVG)</h3>
                            <p className={styles.subCaption}>
                                Two-tone Oxblood Crimson (#8B0A10) and Smokehouse Amber (#F59B1A) linocut vector icons for menus, maps, and press layouts
                            </p>
                        </div>
                        <div className={styles.iconPackGrid}>
                            {WOODCUT_ICONS.map((icon) => (
                                <div key={icon.id} className={styles.iconPackCard}>
                                    <img src={icon.src} alt={icon.name} className={styles.iconPackPreview} />
                                    <span className={styles.iconPackName}>{icon.name}</span>
                                    <a href={icon.src} download={icon.downloadName} className={styles.dlBtnSecondary}>
                                        ⬇ .SVG
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

