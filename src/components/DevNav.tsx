'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './dev-nav.module.css';

const SECTIONS = [
    {
        label: 'Pages',
        links: [
            { href: '/', icon: '🏠', label: 'Home' },
            { href: '/our-story', icon: '📖', label: 'Our Story' },
            { href: '/visit', icon: '📍', label: 'Visit' },
            { href: '/jobs', icon: '💼', label: 'Jobs' },
            { href: '/faq', icon: '❓', label: 'FAQ' },
            { href: '/gift-cards', icon: '🎁', label: 'Gift Cards' },
        ],
    },
    {
        label: 'Order Flow',
        links: [
            { href: '/online-orders', icon: '🛒', label: '1· Shop' },
            { href: '/online-orders?cart=open', icon: '🧺', label: '2· Cart' },
            { href: '/checkout', icon: '💳', label: '3· Checkout' },
            { href: '/order/success', icon: '✅', label: '4· Success' },
        ],
    },
    {
        label: 'Account',
        links: [
            { href: '/dashboard', icon: '👤', label: 'Dashboard' },
            { href: '/auth/signin', icon: '🔑', label: 'Sign In' },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/specials', icon: '🔥', label: 'Specials' },
            { href: '/catering', icon: '🍖', label: 'Catering' },
            { href: '/bbq', icon: '🌡️', label: 'BBQ' },
            { href: '/cut-guide', icon: '🥩', label: 'Cut Guide' },
        ],
    },
    {
        label: 'Admin',
        links: [
            { href: '/admin', icon: '📊', label: 'Admin' },
            { href: '/studio', icon: '🎨', label: 'Studio' },
        ],
    },
];

const DevNav = () => {
    const [open, setOpen] = useState(false);

    // Removed environment check per user request

    return (
        <div className={styles.floatingNav}>
            <button
                className={styles.toggleBtn}
                onClick={() => setOpen(o => !o)}
                title="Dev Nav"
            >
                <span style={{ fontSize: '16px' }}>{open ? '✕' : '🧭'}</span>
                <span className={styles.toggleLabel}>DEV</span>
            </button>

            {open && (
                <div className={styles.panel}>
                    {SECTIONS.map(section => (
                        <div key={section.label} className={styles.section}>
                            <div className={styles.sectionLabel}>{section.label}</div>
                            {section.links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={styles.navItem}
                                    onClick={() => setOpen(false)}
                                >
                                    <span className={styles.navIcon}>{link.icon}</span>
                                    <span className={styles.navLabel}>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DevNav;
