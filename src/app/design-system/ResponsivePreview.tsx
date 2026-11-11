'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import styles from './responsive.module.css';

/* ── Device presets ── */
const devices = [
    { label: 'iPhone SE', width: 375, icon: '📱', category: 'mobile' },
    { label: 'iPhone 14', width: 390, icon: '📱', category: 'mobile' },
    { label: 'iPhone 14 Pro Max', width: 430, icon: '📱', category: 'mobile' },
    { label: 'iPad Mini', width: 768, icon: '📋', category: 'tablet' },
    { label: 'iPad Pro', width: 1024, icon: '📋', category: 'tablet' },
    { label: 'Desktop', width: 1440, icon: '🖥️', category: 'desktop' },
];

/* ── Pages to preview ── */
const pages = [
    { label: 'Homepage', path: '/', headline: 'Craft Butchery & Whole-Animal Provisions', tag: 'Premier North Shore Craft Butcher' },
    { label: 'Online Orders', path: '/online-orders', headline: 'Order Direct From the Butcher Case', tag: 'Northfield & Depot Pickup' },
    { label: 'BBQ', path: '/bbq', headline: 'Smoked Low & Slow Over Local Hardwood', tag: 'Daily Smokehouse Board' },
    { label: 'Catering', path: '/catering', headline: 'Catering & Whole Pig Roasts', tag: 'Events From 20 to 500+ Guests' },
    { label: 'Specials', path: '/specials', headline: 'Weekly Rotations & Seasonal Specials', tag: 'Limited Quantities Available' },
    { label: 'Our Story', path: '/our-story', headline: '120+ Years of Craft Butchery Heritage', tag: 'The Hofherr Legacy' },
    { label: 'Visit Us', path: '/visit', headline: 'Two Locations: Northfield & Winnetka', tag: 'The Shop & The Depot' },
    { label: 'FAQ', path: '/faq', headline: 'Frequently Asked Questions', tag: 'Cuts, Orders, Sourcing' },
    { label: 'Cut Guide', path: '/cut-guide', headline: 'Whole-Animal Anatomical Cut Guide', tag: 'Beef, Pork, Poultry' },
    { label: 'Gift Cards', path: '/gift-cards', headline: 'The Gift of Great Meat', tag: 'Physical & Instant eGift Cards' },
];

export default function ResponsivePreview() {
    const [activeDevice, setActiveDevice] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const device = devices[activeDevice];
    const page = pages[activePage];

    const openExternal = () => {
        if (typeof window !== 'undefined') {
            window.open(page.path, '_blank', `noopener,noreferrer,width=${device.width},height=812,menubar=no,toolbar=no`);
        }
    };

    const isMobile = device.width < 600;
    const isTablet = device.width >= 600 && device.width < 1024;

    return (
        <div className={styles.wrapper}>
            {/* ── Controls ── */}
            <div className={styles.controls}>
                {/* Device Selector */}
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>Device Viewport</span>
                    <div className={styles.deviceTabs}>
                        {devices.map((d, i) => (
                            <button
                                key={d.label}
                                type="button"
                                className={`${styles.deviceTab} ${i === activeDevice ? styles.deviceTabActive : ''}`}
                                onClick={() => setActiveDevice(i)}
                            >
                                <span className={styles.deviceIcon}>{d.icon}</span>
                                <span className={styles.deviceName}>{d.label}</span>
                                <span className={styles.deviceWidth}>{d.width}px</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Page Selector */}
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>Target Route</span>
                    <div className={styles.pageTabs}>
                        {pages.map((p, i) => (
                            <button
                                key={p.path}
                                type="button"
                                className={`${styles.pageTab} ${i === activePage ? styles.pageTabActive : ''}`}
                                onClick={() => setActivePage(i)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Viewport Info Bar ── */}
            <div className={styles.viewportBar}>
                <span className={styles.viewportLabel}>
                    {device.icon} {device.label}
                </span>
                <span className={styles.viewportDimension}>{device.width}px × 812px</span>
                <span className={styles.viewportTag}>{device.category.toUpperCase()}</span>
                <div className={styles.viewportActions}>
                    <button type="button" onClick={openExternal} className={styles.launchBtn}>
                        Open {device.width}px Window ↗
                    </button>
                    <Link href={page.path} className={styles.directLink}>
                        Visit {page.path}
                    </Link>
                </div>
            </div>

            {/* ── High-Fidelity Static Responsive Stage ── */}
            <div className={styles.frameWrapper}>
                <div
                    className={styles.mockDeviceShell}
                    style={{ '--container-w': `${Math.min(device.width, 1080)}px` } as CSSProperties}
                >
                    {/* Simulated Status Bar */}
                    <div className={styles.mockStatusBar}>
                        <span className={styles.mockTime}>9:41</span>
                        <div className={styles.mockNotch} />
                        <span className={styles.mockSignals}>5G ▮▮▮ 100%</span>
                    </div>

                    {/* Simulated Browser URL Bar */}
                    <div className={styles.mockUrlBar}>
                        <span className={styles.mockLock}>🔒</span>
                        <span className={styles.mockUrlText}>hofherrmeatco.com{page.path}</span>
                        <button type="button" onClick={openExternal} className={styles.mockExternalIcon} title="Launch live browser preview">
                            ↗
                        </button>
                    </div>

                    {/* Static Component Render Mockup */}
                    <div className={styles.mockPageCanvas}>
                        {/* Mock Navbar */}
                        <div className={styles.mockNavbar}>
                            <span className={styles.mockLogoText}>HOFHERR MEAT CO.</span>
                            {isMobile ? (
                                <span className={styles.mockMenuIcon}>☰</span>
                            ) : (
                                <div className={styles.mockNavLinks}>
                                    <span>Butcher</span>
                                    <span>BBQ</span>
                                    <span>Catering</span>
                                    <span>Specials</span>
                                    <span className={styles.mockCartPill}>Cart (0)</span>
                                </div>
                            )}
                        </div>

                        {/* Mock Hero Section */}
                        <div className={styles.mockHero}>
                            <span className={styles.mockHeroKicker}>{page.tag}</span>
                            <h2 className={styles.mockHeroTitle}>{page.headline}</h2>
                            <p className={styles.mockHeroDesc}>
                                Hand-selected local livestock, artisan dry-aging, whole-hog catering, and house-made charcuterie. Serving Northfield and Winnetka with craft butchery since 2014.
                            </p>
                            <div className={styles.mockHeroCtaRow}>
                                <button type="button" onClick={openExternal} className={styles.mockPrimaryBtn}>
                                    Preview Live Route ({page.label}) →
                                </button>
                                <span className={styles.mockSecondaryMeta}>
                                    Breakpoint: {isMobile ? 'Mobile (<600px)' : isTablet ? 'Tablet (600–1023px)' : 'Desktop (≥1024px)'}
                                </span>
                            </div>
                        </div>

                        {/* Mock Layout Grid representing page content */}
                        <div className={styles.mockGridSection}>
                            <span className={styles.mockSectionHeading}>Featured Showcase ({device.width}px Grid)</span>
                            <div
                                className={styles.mockCardGrid}
                                style={{
                                    '--grid-cols': isMobile ? '1' : isTablet ? '2' : '3',
                                } as CSSProperties}
                            >
                                <div className={styles.mockCard}>
                                    <div className={styles.mockCardThumb} />
                                    <span className={styles.mockCardTitle}>Dry-Aged Bone-In Ribeye</span>
                                    <span className={styles.mockCardPrice}>$38.99 / lb · 45-Day Prime</span>
                                </div>
                                <div className={styles.mockCard}>
                                    <div className={styles.mockCardThumb} />
                                    <span className={styles.mockCardTitle}>Whole-Hog Catering Box</span>
                                    <span className={styles.mockCardPrice}>Feeds 30–50 · Smoked Low &amp; Slow</span>
                                </div>
                                {!isMobile && (
                                    <div className={styles.mockCard}>
                                        <div className={styles.mockCardThumb} />
                                        <span className={styles.mockCardTitle}>House Chi Vops Sausage</span>
                                        <span className={styles.mockCardPrice}>$14.50 / lb · Traditional Recipe</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mock Footer Note */}
                        <div className={styles.mockFooter}>
                            <span>Hofherr Meat Co. Design System · Verified Responsive Pattern</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
