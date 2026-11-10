'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './dev-nav.module.css';

/* Every page in src/app should be listed here. When you add a route, add it to a section below. */
const SECTIONS = [
    {
        label: 'Pages',
        links: [
            { href: '/', icon: '🏠', label: 'Home' },
            { href: '/our-story', icon: '📖', label: 'Our Story' },
            { href: '/selections', icon: '🥓', label: 'Selections' },
            { href: '/featured', icon: '⭐', label: 'Featured' },
            { href: '/visit', icon: '📍', label: 'Visit' },
            { href: '/jobs', icon: '💼', label: 'Jobs' },
            { href: '/faq', icon: '❓', label: 'FAQ' },
            { href: '/gift-cards', icon: '🎁', label: 'Gift Cards' },
            { href: '/sitemap-page', icon: '🗺️', label: 'Sitemap' },
        ],
    },
    {
        label: 'Content',
        links: [
            { href: '/specials', icon: '🔥', label: 'Specials' },
            { href: '/catering', icon: '🍖', label: 'Catering' },
            { href: '/bbq', icon: '🌡️', label: 'BBQ' },
            { href: '/cut-guide', icon: '🥩', label: 'Cut Guide' },
            { href: '/newsletter', icon: '✉️', label: 'Newsletter' },
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
            { href: '/online-orders?login=true', icon: '🔑', label: 'Sign In' },
            { href: '/online-orders?signup=true', icon: '📝', label: 'Sign Up' },
            { href: '/reset-password', icon: '🔐', label: 'Reset Password' },
            { href: '/verify-email', icon: '✅', label: 'Verify Email' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { href: '/privacy', icon: '📄', label: 'Privacy' },
            { href: '/terms', icon: '⚖️', label: 'Terms' },
        ],
    },
    {
        label: 'Admin',
        links: [
            { href: '/admin', icon: '📊', label: 'Admin (Dashboard)' },
            { href: '/admin/inventory', icon: '🗃️', label: 'Admin Inventory' },
            { href: '/admin/social', icon: '📣', label: 'Admin Social' },
            { href: '/admin/login', icon: '🔒', label: 'Admin Login' },
            { href: '/inventory', icon: '📦', label: 'Inventory Manager' },
            { href: '/studio', icon: '🎨', label: 'Studio' },
        ],
    },
    {
        label: 'Product Identity',
        links: [
            { href: '/product-identity', icon: '🏷️', label: 'Product Identity' },
            { href: '/product-identity/print', icon: '🖨️', label: 'Print Kit' },
            { href: '/product-identity/sizes', icon: '📐', label: 'Sizes' },
            { href: '/product-identity/sizes/print', icon: '🖨️', label: 'Sizes · Print' },
            { href: '/product-identity/social', icon: '📱', label: 'Social Kit' },
            { href: '/product-identity/social/admin', icon: '⚙️', label: 'Social · Admin' },
        ],
    },
    {
        label: 'Dev & Tests',
        links: [
            { href: '/roadmap', icon: '🧭', label: 'Roadmap' },
            { href: '/showcase', icon: '🎯', label: 'Showcase' },
            { href: '/design-system', icon: '🧩', label: 'Design System' },
            { href: '/pitch-deck', icon: '📈', label: 'Pitch Deck' },
            { href: '/fire-test', icon: '🔥', label: 'Fire Test' },
            { href: '/order-tracker-test', icon: '🚚', label: 'Order Tracker Test' },
            { href: '/debug-email/preview', icon: '📧', label: 'Email Templates' },
            { href: '/debug-email', icon: '🐞', label: 'Debug Email' },
        ],
    },
];

function isProtectedRoute(href: string): boolean {
    if (href === '/admin/login') return false;
    return (
        href === '/dashboard' ||
        href === '/inventory' ||
        href.startsWith('/admin') ||
        href.startsWith('/product-identity')
    );
}

const DevNav = () => {
    const [open, setOpen] = useState(false);
    const [godBusy, setGodBusy] = useState(false);
    const { data: session, update } = useSession();
    const router = useRouter();

    const isGodMode = Boolean(session?.user?.isAdmin);

    const handleToggleGodMode = async () => {
        setGodBusy(true);
        try {
            if (isGodMode) {
                await signOut({ redirect: false });
            } else {
                await signIn('credentials', {
                    email: 'godmode@hofherrmeats.com',
                    password: 'hofherr-dev-god-mode',
                    redirect: false,
                });
            }
            await update();
            router.refresh();
        } finally {
            setGodBusy(false);
        }
    };

    const handleLinkClick = async (e: React.MouseEvent, href: string) => {
        setOpen(false);
        if (!isGodMode && isProtectedRoute(href)) {
            e.preventDefault();
            setGodBusy(true);
            try {
                await signIn('credentials', {
                    email: 'godmode@hofherrmeats.com',
                    password: 'hofherr-dev-god-mode',
                    redirect: false,
                });
                await update();
                router.push(href);
                router.refresh();
            } finally {
                setGodBusy(false);
            }
        }
    };

    return (
        <div className={styles.floatingNav}>
            <div className={styles.floatingBar}>
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setOpen(o => !o)}
                    title="Dev Nav"
                >
                    <span className={styles.toggleIcon}>{open ? '✕' : '🧭'}</span>
                    <span className={styles.toggleLabel}>DEV</span>
                </button>
                <button
                    type="button"
                    className={`${styles.godBtn} ${isGodMode ? styles.godBtnActive : ''}`}
                    onClick={handleToggleGodMode}
                    disabled={godBusy}
                    title="Toggle God Mode (Bypass Login)"
                >
                    <span>⚡</span>
                    <span>{godBusy ? 'LOADING…' : isGodMode ? 'GOD MODE: ON' : 'GOD MODE'}</span>
                </button>
            </div>

            {open && (
                <div className={styles.panel} data-lenis-prevent>
                    <div className={styles.godBanner}>
                        <span>
                            {isGodMode
                                ? '⚡ God Mode Active — Full access to Admin & Dashboard'
                                : '🔒 Click God Mode or any Admin link to enter without login'}
                        </span>
                        <button
                            type="button"
                            className={`${styles.godBannerBtn} ${isGodMode ? styles.godBannerBtnActive : ''}`}
                            onClick={handleToggleGodMode}
                            disabled={godBusy}
                        >
                            {godBusy ? 'Wait…' : isGodMode ? 'Disable God Mode' : '⚡ Enable God Mode'}
                        </button>
                    </div>
                    {SECTIONS.map(section => (
                        <div key={section.label} className={styles.section}>
                            <div className={styles.sectionLabel}>{section.label}</div>
                            {section.links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={styles.navItem}
                                    onClick={e => handleLinkClick(e, link.href)}
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
