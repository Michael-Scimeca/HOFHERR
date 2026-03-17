'use client';

import React from 'react';
import Link from 'next/link';
import styles from './dev-nav.module.css';

const DevNav = () => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return null;

    const links = [
        { href: '/', icon: '🏠', label: 'Home' },
        { href: '/online-orders', icon: '🛒', label: 'Shop' },
        { href: '/dashboard', icon: '👤', label: 'Dashboard' },
        { href: '/admin', icon: '📊', label: 'Admin' },
        { href: '/order/success', icon: '✅', label: 'Success' },
    ];

    return (
        <div className={styles.floatingNav}>
            <div className={styles.label}>Dev Tool</div>
            {links.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navItem}>
                    <span className={styles.navIcon}>{link.icon}</span>
                    <span className={styles.tooltip}>{link.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default DevNav;
