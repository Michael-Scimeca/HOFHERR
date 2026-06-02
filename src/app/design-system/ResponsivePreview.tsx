'use client';

import { useState } from 'react';
import styles from './responsive.module.css';

/* ── Device presets ── */
const devices = [
    { label: 'iPhone SE', width: 375, icon: '📱' },
    { label: 'iPhone 14', width: 390, icon: '📱' },
    { label: 'iPhone 14 Pro Max', width: 430, icon: '📱' },
    { label: 'iPad Mini', width: 768, icon: '📋' },
    { label: 'iPad Pro', width: 1024, icon: '📋' },
    { label: 'Desktop', width: 1440, icon: '🖥️' },
];

/* ── Pages to preview ── */
const pages = [
    { label: 'Homepage', path: '/' },
    { label: 'Online Orders', path: '/online-orders' },
    { label: 'BBQ', path: '/bbq' },
    { label: 'Catering', path: '/catering' },
    { label: 'Specials', path: '/specials' },
    { label: 'Our Story', path: '/our-story' },
    { label: 'Visit Us', path: '/visit' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Cut Guide', path: '/cut-guide' },
    { label: 'Jobs', path: '/jobs' },
];

export default function ResponsivePreview() {
    const [activeDevice, setActiveDevice] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const device = devices[activeDevice];
    const page = pages[activePage];

    return (
        <div className={styles.wrapper}>
            {/* ── Controls ── */}
            <div className={styles.controls}>
                {/* Device Selector */}
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>Device</span>
                    <div className={styles.deviceTabs}>
                        {devices.map((d, i) => (
                            <button
                                key={d.label}
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
                    <span className={styles.controlLabel}>Page</span>
                    <div className={styles.pageTabs}>
                        {pages.map((p, i) => (
                            <button
                                key={p.path}
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
                <span className={styles.viewportPath}>{page.path}</span>
            </div>

            {/* ── Preview Frame ── */}
            <div className={styles.frameWrapper}>
                <div
                    className={styles.frameContainer}
                    style={{ width: Math.min(device.width, 1100) }}
                >
                    <iframe
                        src={page.path}
                        className={styles.iframe}
                        title={`${page.label} at ${device.width}px`}
                        style={{
                            width: device.width,
                            height: 812,
                            transform: device.width > 1100
                                ? `scale(${1100 / device.width})`
                                : 'none',
                            transformOrigin: 'top left',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
