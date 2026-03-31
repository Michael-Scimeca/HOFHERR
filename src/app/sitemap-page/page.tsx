import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Sitemap | Hofherr Meat Co.',
    description:
        'Complete visual sitemap of the Hofherr Meat Co. website — browse every page from ordering and catering to our story and gift cards.',
};

/* ── Site Structure Data ─────────────────────────────────────────────── */

type PageEntry = {
    name: string;
    path: string;
    icon: string;
    badge?: 'new' | 'internal';
};

type SiteSection = {
    title: string;
    icon: string;
    pages: PageEntry[];
};

const SITE_MAP: SiteSection[] = [
    {
        title: 'Shop & Order',
        icon: '🛒',
        pages: [
            { name: 'Order Online', path: '/online-orders', icon: '🥩' },
            { name: 'Weekly Specials', path: '/specials', icon: '🔥' },
            { name: 'Featured Products', path: '/featured', icon: '⭐' },
            { name: 'Gift Cards', path: '/gift-cards', icon: '🎁' },
        ],
    },
    {
        title: 'Catering & Events',
        icon: '🎉',
        pages: [
            { name: 'Catering Overview', path: '/catering', icon: '🍽️' },
            { name: 'BBQ Catering', path: '/bbq', icon: '🔥' },
        ],
    },
    {
        title: 'Explore',
        icon: '🧭',
        pages: [
            { name: 'Our Story', path: '/our-story', icon: '📖' },
            { name: 'Visit Us', path: '/visit', icon: '📍' },
            { name: 'Cut Guide', path: '/cut-guide', icon: '🔪' },
            { name: 'FAQ', path: '/faq', icon: '❓' },
            { name: 'Jobs & Careers', path: '/jobs', icon: '💼' },
        ],
    },
    {
        title: 'Account',
        icon: '👤',
        pages: [
            { name: 'Dashboard', path: '/dashboard', icon: '📊' },
            { name: 'Newsletter', path: '/newsletter', icon: '📬' },
        ],
    },
    {
        title: 'Legal & Admin',
        icon: '📋',
        pages: [
            { name: 'Privacy Policy', path: '/privacy', icon: '🔒' },
            { name: 'Terms of Service', path: '/terms', icon: '📄' },
            { name: 'Admin Panel', path: '/admin', icon: '⚙️', badge: 'internal' },
        ],
    },
];

const totalPages = SITE_MAP.reduce((sum, s) => sum + s.pages.length, 0) + 1; // +1 for Home

/* ── Component ───────────────────────────────────────────────────────── */

export default function SitemapPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.label}>Sitemap</div>
                    <h1 className={styles.title}>
                        Complete <span className={styles.titleAccent}>Site Map</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Every page on hofherrmeatco.com — from online ordering to our story, organized and easy to navigate.
                    </p>
                </header>

                {/* Root Node */}
                <div className={styles.rootNode}>
                    <Link href="/" className={styles.rootCard}>
                        <span className={styles.rootIcon}>🏠</span>
                        <div>
                            <div className={styles.rootLabel}>Hofherr Meat Co.</div>
                            <div className={styles.rootUrl}>hofherrmeatco.com</div>
                        </div>
                    </Link>
                    <div className={styles.trunk} />
                </div>

                {/* Sections */}
                <div className={styles.sections}>
                    {SITE_MAP.map((section) => (
                        <section key={section.title} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionIcon}>{section.icon}</span>
                                <h2 className={styles.sectionTitle}>{section.title}</h2>
                                <span className={styles.sectionCount}>
                                    {section.pages.length} page{section.pages.length !== 1 && 's'}
                                </span>
                            </div>

                            <div className={styles.pageGrid}>
                                {section.pages.map((page) => (
                                    <Link
                                        key={page.path}
                                        href={page.path}
                                        className={styles.pageCard}
                                    >
                                        <span className={styles.pageCardIcon}>{page.icon}</span>
                                        <div className={styles.pageCardInfo}>
                                            <span className={styles.pageCardName}>
                                                {page.name}
                                                {page.badge === 'new' && (
                                                    <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
                                                )}
                                                {page.badge === 'internal' && (
                                                    <span className={`${styles.badge} ${styles.badgeInternal}`}>Internal</span>
                                                )}
                                            </span>
                                            <span className={styles.pageCardPath}>{page.path}</span>
                                        </div>
                                        <span className={styles.pageCardArrow}>→</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{totalPages}</span>
                        <span className={styles.statLabel}>Total Pages</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{SITE_MAP.length}</span>
                        <span className={styles.statLabel}>Sections</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>2</span>
                        <span className={styles.statLabel}>Locations</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
