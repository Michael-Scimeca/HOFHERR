'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './AppBrandIdentitySection.module.css';

const AVATAR_OPTIONS = [
    {
        id: 'wrapping-paper',
        label: 'Wrapping Paper Seal',
        src: '/assets/identity/apps/ig-avatar-wrapping-paper.svg',
    },
    {
        id: 'crimson-stamp',
        label: 'Oxblood Crimson Stamp',
        src: '/assets/identity/hofherr-stamp-circular-crimson.svg',
    },
    {
        id: 'dark-stamp',
        label: 'Smokehouse Charcoal',
        src: '/assets/identity/hofherr-stamp-circular-dark.svg',
    },
    {
        id: 'app-icon',
        label: 'iOS / Android App Icon',
        src: '/assets/identity/hofherr-app-icon.svg',
    },
];

const FB_PROFILE_SETS = [
    {
        id: 'fb-profile-1',
        title: 'FB Profile Set 01 · Wrapping Paper & Bull Seal',
        spec: '1080 × 1080 px (Ø 880 Safe Circle) · Vector SVG',
        desc: 'Diagonal butcher wrapping paper ground with the circular Oxblood Crimson Flaming Bull medallion and stencil ribbon.',
        svg: '/assets/identity/apps/fb-profile-wrapping-paper.svg',
        printHref: '/product-identity/print?master=fb-profile-1&w=5.0&h=5.0&autoprint=1',
    },
    {
        id: 'fb-profile-2',
        title: 'FB Profile Set 02 · Oxblood Crimson Crest',
        spec: '1080 × 1080 px (Ø 880 Safe Circle) · Vector SVG',
        desc: 'High-contrast Oxblood Crimson (#8B0A10) circular badge with Counter Cream wordmark plate for small mobile comment avatars.',
        svg: '/assets/identity/apps/fb-profile-crimson-badge.svg',
        printHref: '/product-identity/print?master=fb-profile-2&w=5.0&h=5.0&autoprint=1',
    },
    {
        id: 'fb-profile-3',
        title: 'FB Profile Set 03 · Smokehouse Charcoal Seal',
        spec: '1080 × 1080 px (Ø 880 Safe Circle) · Vector SVG',
        desc: 'Dark Smokehouse Charcoal (#1C1614) & Smokehouse Amber (#F59B1A) ring lockup engineered for Facebook dark-mode feeds.',
        svg: '/assets/identity/apps/fb-profile-charcoal-seal.svg',
        printHref: '/product-identity/print?master=fb-profile-3&w=5.0&h=5.0&autoprint=1',
    },
];

const FB_HERO_SETS = [
    {
        id: 'fb-hero-1',
        title: 'FB Hero Set 01 · Butcher Wrapping Paper & 10-Dept Suite',
        spec: '1640 × 624 px (2× Retina Facebook Cover) · Safe-Zoned for Avatar Overlap',
        desc: 'Signature Hofherr Wrapping Paper background with bottom-left avatar overlap clearance, center-right smokehouse card, and 10-department ribbon.',
        svg: '/assets/identity/apps/fb-hero-cover-wrapping-paper.svg',
        printHref: '/product-identity/print?master=fb-hero-1&w=8.5&h=3.23&autoprint=1',
    },
    {
        id: 'fb-hero-2',
        title: 'FB Hero Set 02 · Oxblood Crimson & Charcoal Split Hero',
        spec: '1640 × 624 px (2× Retina Facebook Cover) · Desktop & Mobile Safe Band',
        desc: 'Diagonal crimson/charcoal split banner featuring the circular Flaming Bull seal and side-by-side Northfield & Winnetka hours cards.',
        svg: '/assets/identity/apps/fb-hero-cover-crimson-smokehouse.svg',
        printHref: '/product-identity/print?master=fb-hero-2&w=8.5&h=3.23&autoprint=1',
    },
    {
        id: 'fb-hero-3',
        title: 'FB Hero Set 03 · Two Locations Storefront Showcase',
        spec: '1640 × 624 px (2× Retina Facebook Cover) · 16:9 Front-Facing Storefronts',
        desc: 'Dual storefront showcase pairing the front-facing Northfield Butcher Shop (300 Happ Rd) and Winnetka Depot (754 Elm St) exteriors.',
        svg: '/assets/identity/apps/fb-hero-cover-two-locations.svg',
        printHref: '/product-identity/print?master=fb-hero-3&w=8.5&h=3.23&autoprint=1',
    },
];

const IG_HIGHLIGHTS = [
    { label: 'Specials', icon: '/assets/identity/stickers/sticker-cow.svg' },
    { label: 'Know Cuts', icon: '/assets/identity/stickers/sticker-pig.svg' },
    { label: 'The Depot', icon: '/assets/identity/stickers/sticker-chicken.svg' },
    { label: 'Whole Hog', icon: '/assets/identity/stickers/sticker-truck.svg' },
    { label: 'Dry-Aged', icon: '/assets/identity/stickers/sticker-lamb.svg' },
    { label: 'Deli & Soup', icon: '/assets/identity/stickers/sticker-soup.svg' },
    { label: 'Seafood', icon: '/assets/identity/stickers/sticker-seafood-lobster.svg' },
];

const IG_GRID_TILES = [
    {
        title: "This Week's Specials",
        img: '/assets/identity/social/social-example-1-this-weeks-specials.svg',
        href: '/product-identity/print?master=social-example-1&w=6.8&h=8.5&autoprint=1',
    },
    {
        title: 'New Cut: Picanha',
        img: '/assets/identity/social/social-example-2-new-cut-picanha.svg',
        href: '/product-identity/print?master=social-example-2&w=6.8&h=8.5&autoprint=1',
    },
    {
        title: 'Behind The Block',
        img: '/assets/identity/social/social-example-3-behind-the-block.svg',
        href: '/product-identity/print?master=social-example-3&w=5.0&h=8.9&autoprint=1',
    },
    {
        title: 'The Butcher Shop (16:9)',
        img: '/images/visit/northfield-storefront-front.jpg',
        href: '/product-identity#press-kit',
    },
    {
        title: 'Winnetka Depot (16:9)',
        img: '/shops/winnetka.png',
        href: '/product-identity#press-kit',
    },
    {
        title: 'Wrapping Paper Suite',
        img: '/assets/identity/wrapping-paper/butcher-wrapping-paper-roll-10-icons.jpg',
        href: '/product-identity#wrapping-paper',
    },
];

const APP_ASSET_CARDS = [
    {
        id: 'ig-kit-board',
        title: '01 · Instagram (@hofherrmeatco) Master Board',
        spec: '1600 × 1000 px · 10.00" × 6.25" Vector SVG · Profile + 9-Grid + Highlights',
        desc: 'Complete visual specification board for https://www.instagram.com/hofherrmeatco/ including circular avatar safe zones, bio lockup, 8 highlight covers, and 6-tile grid rhythm.',
        svg: '/assets/identity/apps/instagram-profile-kit-board.svg',
        printHref: '/product-identity/print?master=ig-kit-board&w=9.5&h=5.94&autoprint=1',
    },
    {
        id: 'ig-avatar-wrap',
        title: '02 · Wrapping Paper Social Avatar',
        spec: '1080 × 1080 px (Ø 880 px Circle Safe Zone) · 100% Vector SVG',
        desc: 'Universal profile picture for Instagram, TikTok, Facebook, YouTube, and Yelp featuring the diagonal butcher wrapping paper pattern and centered Flaming Bull seal.',
        svg: '/assets/identity/apps/ig-avatar-wrapping-paper.svg',
        printHref: '/product-identity/print?master=ig-avatar-wrap&w=5.0&h=5.0&autoprint=1',
    },
    {
        id: 'ig-link-bio',
        title: '03 · Instagram Link-in-Bio App Screen',
        spec: '1080 × 1920 px (9:16 Mobile Screen) · Butcher Wrapping Paper Theme',
        desc: 'Branded mobile landing screen linked from @hofherrmeatco bio routing followers directly to Northfield Butcher Shop orders, Winnetka Depot orders, weekly specials, and catering.',
        svg: '/assets/identity/apps/ig-link-in-bio-screen.svg',
        printHref: '/product-identity/print?master=ig-link-bio&w=5.0&h=8.89&autoprint=1',
    },
    {
        id: 'ordering-app-banner',
        title: '04 · Ordering App & Storefront Hero (16:9)',
        spec: '1600 × 900 px (16:9) · Toast / Yelp / DoorDash / Google Business',
        desc: '16:9 storefront banner in the Hofherr Wrapping Paper & 10-Department Emblem theme for online ordering apps, delivery apps, and business listings.',
        svg: '/assets/identity/apps/ordering-app-storefront-banner.svg',
        printHref: '/product-identity/print?master=ordering-app-banner&w=8.5&h=4.78&autoprint=1',
    },
];

const PLATFORM_SPECS = [
    {
        name: 'Instagram (@hofherrmeatco)',
        handle: 'instagram.com/hofherrmeatco',
        specs: 'Avatar: 1080×1080 (Ø 880 safe) · Feed: 1080×1350 (4:5) · Reels/Stories: 1080×1920 (9:16) · 8 Department Highlight Covers.',
    },
    {
        name: 'Facebook Page & Events',
        handle: 'facebook.com/hofherrmeatco',
        specs: '3 Profile Picture Sets (1080×1080) + 3 Hero Cover Sets (1640×624 2× Retina with bottom-left avatar overlap clearance).',
    },
    {
        name: 'TikTok & YouTube Shorts',
        handle: '@hofherrmeatco',
        specs: 'Avatar: 1080×1080 · Vertical Video Cover: 1080×1920 with lower-third butcher stencil title bar and wrapping paper end-card.',
    },
    {
        name: 'Toast / Online Ordering App',
        handle: 'hofherrmeatco.com/online-orders',
        specs: '16:9 Front-Facing Storefront Heroes (Northfield Butcher Shop & Winnetka Depot) + 2× Wrapping Paper Parcel Icon (item.png).',
    },
    {
        name: 'Google Business & Apple Maps',
        handle: 'Northfield (300 Happ Rd) & Winnetka (754 Elm St)',
        specs: 'Cover: 1080×608 / 1600×900 (16:9) · Verified Front-Elevation Exterior Photos + 10-Department Product Showcase.',
    },
    {
        name: 'iOS / Android Home Screen PWA',
        handle: 'hofherr-app-icon.svg',
        specs: '1024×1024 Master Rounded-Square & Maskable App Icon in Oxblood Crimson (#8B0A10), Smokehouse Amber (#F59B1A) & Counter Cream.',
    },
];

const IG_BIO_TEXT = `🔥 Neighborhood butcher · cut to order since 2018
🥩 Dry-aged beef · heritage pork · whole-hog BBQ
📍 300 Happ Rd, Northfield + The Depot, Winnetka
👇 Order ahead for counter or train pickup`;

export default function AppBrandIdentitySection() {
    const [activeAvatar, setActiveAvatar] = useState(AVATAR_OPTIONS[0]);
    const [kraftMode, setKraftMode] = useState(false);
    const [bioCopied, setBioCopied] = useState(false);
    const [activeFbProfile, setActiveFbProfile] = useState(FB_PROFILE_SETS[0]);
    const [activeFbHero, setActiveFbHero] = useState(FB_HERO_SETS[0]);

    const copyIgBio = async () => {
        try {
            await navigator.clipboard.writeText(
                `Hofherr Meat Co. · Butcher & Smokehouse\n${IG_BIO_TEXT}\nhttps://hofherrmeatco.com/online-orders`
            );
            setBioCopied(true);
            setTimeout(() => setBioCopied(false), 1800);
        } catch {
            /* ignore */
        }
    };

    return (
        <section id="app-identity" aria-labelledby="app-identity-heading" className="section">
            <div className={`container ${styles.stack}`}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <h2 id="app-identity-heading" className={styles.sectionTitle}>
                                09B / Instagram (@hofherrmeatco), Facebook &amp; App Brand Identity System
                            </h2>
                            <p className={styles.sectionDesc}>
                                Unified brand identity for{' '}
                                <a
                                    href="https://www.instagram.com/hofherrmeatco/?hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <strong>instagram.com/hofherrmeatco</strong>
                                </a>
                                , <strong>Facebook Page Profile Pictures &amp; Hero Covers</strong>, TikTok, Yelp, Google
                                Business, Toast online ordering, and iOS/Android home-screen apps — pairing the{' '}
                                <strong>Butcher Wrapping Paper</strong> register with the{' '}
                                <strong>10-Department Woodcut Flame Emblem</strong> system.
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <a
                                href="https://www.instagram.com/hofherrmeatco/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.primaryBtn}
                            >
                                ↗ Open @hofherrmeatco on Instagram
                            </a>
                            <a
                                href="#facebook-sets"
                                className={styles.secondaryBtn}
                            >
                                ↓ Jump to Facebook Profile &amp; Hero Sets
                            </a>
                            <Link
                                href="/product-identity/print?master=ig-kit-board&w=9.5&h=5.94&autoprint=1"
                                className={styles.secondaryBtn}
                            >
                                🖨 Print 1:1 App Identity Proof
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Dedicated Facebook Profile Picture & Hero Cover Sets + Live Simulator ── */}
                <div id="facebook-sets" className={styles.fbBlock}>
                    <div className={styles.fbBlockHead}>
                        <div>
                            <h3 className={styles.fbBlockTitle}>
                                Facebook Page Profile Picture &amp; Hero Cover Image Sets (facebook.com/hofherrmeatco)
                            </h3>
                            <p className={styles.fbBlockDesc}>
                                Three matched sets of <strong>1080 × 1080 Facebook Profile Pictures</strong> (with Ø 880 circle
                                crop safe zone) and <strong>1640 × 624 2× Retina Facebook Hero Covers</strong> (engineered so
                                the bottom-left desktop avatar overlap and mobile side crops never cover headlines or hours).
                                Click any set below to test the combination live, download the vector <code>.SVG</code>, or
                                print a 1:1 proof.
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <a
                                href={activeFbHero.svg}
                                download={`${activeFbHero.id}.svg`}
                                className={styles.primaryBtn}
                            >
                                ↓ Active FB Hero (.SVG)
                            </a>
                            <a
                                href={activeFbProfile.svg}
                                download={`${activeFbProfile.id}.svg`}
                                className={styles.secondaryBtn}
                            >
                                ↓ Active FB Profile Pic (.SVG)
                            </a>
                            <Link href={activeFbHero.printHref} className={styles.secondaryBtn}>
                                🖨 Print Active FB Hero 1:1
                            </Link>
                        </div>
                    </div>

                    {/* Interactive Facebook Page Header Preview */}
                    <div className={styles.fbPageFrame}>
                        <div className={styles.fbCoverStage}>
                            <img
                                src={activeFbHero.svg}
                                alt={activeFbHero.title}
                                className={styles.fbCoverImg}
                            />
                        </div>
                        <div className={styles.fbProfileBar}>
                            <div className={styles.fbProfileLeft}>
                                <div className={styles.fbProfilePicWrap}>
                                    <img
                                        src={activeFbProfile.svg}
                                        alt={activeFbProfile.title}
                                        className={styles.fbProfilePicImg}
                                    />
                                </div>
                                <div className={styles.fbPageMeta}>
                                    <h4 className={styles.fbPageName}>Hofherr Meat Co.</h4>
                                    <span className={styles.fbPageSub}>
                                        Butcher Shop · Caterer · Northfield &amp; Winnetka, IL · 4.9 ★
                                    </span>
                                </div>
                            </div>
                            <div className={styles.fbCtaGroup}>
                                <Link href="/online-orders" className={styles.primaryBtn}>
                                    🥩 Order Online (hofherrmeatco.com)
                                </Link>
                                <a href="tel:8474416328" className={styles.secondaryBtn}>
                                    📞 Call (847) 441-MEAT
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 3 Facebook Hero Cover Image Sets */}
                    <h4 className={styles.fbSubHeading}>
                        Facebook Hero / Cover Image Sets — 1640 × 624 px (Click to Preview Above, Download or Print 1:1)
                    </h4>
                    <div className={styles.fbSetsGrid}>
                        {FB_HERO_SETS.map((hero) => (
                            <article
                                key={hero.id}
                                className={`${styles.fbSetCard} ${activeFbHero.id === hero.id ? styles.fbSetCardActive : ''}`}
                            >
                                <div className={styles.fbHeroThumbWrap}>
                                    <img src={hero.svg} alt={hero.title} className={styles.fbCoverImg} />
                                </div>
                                <h5 className={styles.assetTitle}>{hero.title}</h5>
                                <span className={styles.assetSpec}>{hero.spec}</span>
                                <p className={styles.assetDesc}>{hero.desc}</p>
                                <div className={styles.assetActions}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveFbHero(hero)}
                                        className={`${styles.chipBtn} ${activeFbHero.id === hero.id ? styles.chipBtnActive : ''}`}
                                    >
                                        {activeFbHero.id === hero.id ? '✓ Active in Preview' : 'Preview on FB Page'}
                                    </button>
                                    <Link href={hero.printHref} className={styles.primaryBtn}>
                                        🖨 Print 1:1
                                    </Link>
                                    <a href={hero.svg} download={`${hero.id}.svg`} className={styles.secondaryBtn}>
                                        ↓ Vector (.SVG)
                                    </a>
                                    <a
                                        href={hero.svg}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.secondaryBtn}
                                    >
                                        ↗ Full Size
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* 3 Facebook Profile Picture Sets */}
                    <h4 className={styles.fbSubHeading}>
                        Facebook Profile Picture Sets — 1080 × 1080 px Circular Safe-Zone (Click to Preview Above, Download or Print 1:1)
                    </h4>
                    <div className={styles.fbSetsGrid}>
                        {FB_PROFILE_SETS.map((prof) => (
                            <article
                                key={prof.id}
                                className={`${styles.fbSetCard} ${activeFbProfile.id === prof.id ? styles.fbSetCardActive : ''}`}
                            >
                                <div className={styles.fbAvatarThumbWrap}>
                                    <img src={prof.svg} alt={prof.title} className={styles.fbProfilePicImg} />
                                </div>
                                <h5 className={styles.assetTitle}>{prof.title}</h5>
                                <span className={styles.assetSpec}>{prof.spec}</span>
                                <p className={styles.assetDesc}>{prof.desc}</p>
                                <div className={styles.assetActions}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveFbProfile(prof)}
                                        className={`${styles.chipBtn} ${activeFbProfile.id === prof.id ? styles.chipBtnActive : ''}`}
                                    >
                                        {activeFbProfile.id === prof.id ? '✓ Active in Preview' : 'Preview on FB Page'}
                                    </button>
                                    <Link href={prof.printHref} className={styles.primaryBtn}>
                                        🖨 Print 1:1
                                    </Link>
                                    <a href={prof.svg} download={`${prof.id}.svg`} className={styles.secondaryBtn}>
                                        ↓ Vector (.SVG)
                                    </a>
                                    <a
                                        href={prof.svg}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.secondaryBtn}
                                    >
                                        ↗ Full Size
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className={styles.simGrid}>
                    {/* Left Column: Live Interactive Instagram App Mockup */}
                    <div className={`${styles.igPhone} ${kraftMode ? styles.igPhoneKraft : ''}`}>
                        <div className={styles.igTopBar}>
                            <span className={styles.igHandle}>
                                hofherrmeatco
                                <span className={styles.igVerified} title="Verified Craft Butcher">
                                    ✓
                                </span>
                            </span>
                            <a
                                href="https://www.instagram.com/hofherrmeatco/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.igExternalLink}
                            >
                                Live IG ↗
                            </a>
                        </div>

                        <div className={styles.igProfileHeader}>
                            <div className={styles.igAvatarRing}>
                                <img
                                    src={activeAvatar.src}
                                    alt={`@hofherrmeatco avatar — ${activeAvatar.label}`}
                                    className={styles.igAvatarImg}
                                />
                            </div>
                            <div className={styles.igStats}>
                                <div>
                                    <span className={styles.igStatVal}>412</span>
                                    <span className={styles.igStatLabel}>posts</span>
                                </div>
                                <div>
                                    <span className={styles.igStatVal}>4.8K</span>
                                    <span className={styles.igStatLabel}>followers</span>
                                </div>
                                <div>
                                    <span className={styles.igStatVal}>385</span>
                                    <span className={styles.igStatLabel}>following</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.igBioBox}>
                            <span className={styles.igBioName}>Hofherr Meat Co. · Butcher &amp; Smokehouse</span>
                            <span className={styles.igBioCategory}>Meat Shop · Caterer · North Shore, IL</span>
                            <p className={styles.igBioText}>{IG_BIO_TEXT}</p>
                            <Link href="/online-orders" className={styles.igBioLink}>
                                🔗 hofherrmeatco.com/online-orders
                            </Link>
                        </div>

                        <div className={styles.igActionRow}>
                            <a
                                href="https://www.instagram.com/hofherrmeatco/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.igFollowBtn}
                            >
                                Follow @hofherrmeatco
                            </a>
                            <Link href="/online-orders" className={styles.igOrderBtn}>
                                Order Pickup
                            </Link>
                            <button type="button" className={styles.igCopyBioBtn} onClick={copyIgBio}>
                                {bioCopied ? '✓ Bio Copied' : 'Copy Bio'}
                            </button>
                        </div>

                        <div className={styles.igHighlightsRow} aria-label="Instagram Story Highlights">
                            {IG_HIGHLIGHTS.map((h) => (
                                <div key={h.label} className={styles.igHighlightItem}>
                                    <div className={styles.igHighlightCircle}>
                                        <img src={h.icon} alt={h.label} className={styles.igHighlightImg} />
                                    </div>
                                    <span className={styles.igHighlightLabel}>{h.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.igFeedGrid}>
                            {IG_GRID_TILES.map((tile) => (
                                <Link key={tile.title} href={tile.href} className={styles.igFeedTile}>
                                    <img src={tile.img} alt={tile.title} className={styles.igFeedTileImg} />
                                    <span className={styles.igFeedTileBadge}>{tile.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Interactive Controls + Printable/Downloadable App Assets */}
                    <div className={styles.rightCol}>
                        <div className={styles.controlBar}>
                            <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>Avatar Lockup:</span>
                                {AVATAR_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setActiveAvatar(opt)}
                                        className={`${styles.chipBtn} ${activeAvatar.id === opt.id ? styles.chipBtnActive : ''}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>App Skin:</span>
                                <button
                                    type="button"
                                    onClick={() => setKraftMode(false)}
                                    className={`${styles.chipBtn} ${!kraftMode ? styles.chipBtnActive : ''}`}
                                >
                                    Dark Charcoal UI
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setKraftMode(true)}
                                    className={`${styles.chipBtn} ${kraftMode ? styles.chipBtnActive : ''}`}
                                >
                                    Wrapping Paper UI
                                </button>
                            </div>
                        </div>

                        <div className={styles.assetCardsGrid}>
                            {APP_ASSET_CARDS.map((card) => (
                                <article key={card.id} className={styles.assetCard}>
                                    <div className={styles.assetPreviewWrap}>
                                        <img src={card.svg} alt={card.title} className={styles.assetPreviewImg} />
                                    </div>
                                    <h3 className={styles.assetTitle}>{card.title}</h3>
                                    <span className={styles.assetSpec}>{card.spec}</span>
                                    <p className={styles.assetDesc}>{card.desc}</p>
                                    <div className={styles.assetActions}>
                                        <Link href={card.printHref} className={styles.primaryBtn}>
                                            🖨 Print 1:1
                                        </Link>
                                        <a href={card.svg} download={`${card.id}.svg`} className={styles.secondaryBtn}>
                                            ↓ Vector (.SVG)
                                        </a>
                                        <a
                                            href={card.svg}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.secondaryBtn}
                                        >
                                            ↗ View Full
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6-Platform App Specification Grid */}
                <div className={styles.platformGrid}>
                    {PLATFORM_SPECS.map((p) => (
                        <div key={p.name} className={styles.platformCard}>
                            <h3 className={styles.platformName}>{p.name}</h3>
                            <span className={styles.platformHandle}>{p.handle}</span>
                            <p className={styles.platformSpecs}>{p.specs}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
