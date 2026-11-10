'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TransitionLink from './TransitionLink';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { openAuthModal } from '@/components/AuthModal';
import { useSiteSettings, type StoreHourEntry } from '@/context/SiteSettingsContext';
import styles from './Navbar.module.css';
import NavCartIcon from './NavCartIcon';

// ── Avatar with broken-image fallback ─────────────────────────────────────
function AvatarImage({ src, name }: { src: string; name: string }) {
    const [broken, setBroken] = useState(false);
    const [lastSrc, setLastSrc] = useState(src);
    if (src !== lastSrc) { setLastSrc(src); setBroken(false); }
    if (broken || !src) {
        return (
            <span className={styles.avatarFallbackLetter}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
            </span>
        );
    }
    return (
        <img src={src} alt="Avatar" width={40} height={40}
            className={styles.avatarImg} onError={() => setBroken(true)} />
    );
}

const NAV_ITEMS = [
    { label: 'Selections', href: '/selections' },
    { label: 'Specials', href: '/specials' },
    { label: 'BBQ', href: '/bbq' },
    { label: 'Catering', href: '/catering' },
    { label: 'Visit Us', href: '/visit' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Gift Cards', href: '/gift-cards' },
];

/**
 * Parses time string like "10:00 AM" into minutes from midnight
 */
const parseTime = (t: string) => {
    if (!t) return 0;
    // Remove space and lowercase
    const s = t.toLowerCase().replace(/\s+/g, '');
    const match = s.match(/^(\d+)(?::(\d+))?([ap]m)$/);
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const mins = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3];

    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return hours * 60 + mins;
};

const CHICAGO_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
});

/**
 * Determines current store status based on Central Time
 */
function getShopStatus(hours: StoreHourEntry[], absoluteNow: Date) {
    if (!hours || hours.length === 0) return { status: 'closed', label: 'CLOSED' };

    try {
        // Robust timezone formatting for Chicago
        const parts = CHICAGO_TIME_FORMATTER.formatToParts(absoluteNow);
        const getPart = (type: string) => parts.find(p => p.type === type)?.value;

        const dayName = getPart('weekday');
        const storeHour = parseInt(getPart('hour') || '0', 10);
        const storeMin = parseInt(getPart('minute') || '0', 10);
        const currentTotalMin = storeHour * 60 + storeMin;

        // Case-insensitive day match
        const today = hours.find(h => h.day.toLowerCase() === dayName?.toLowerCase());

        if (!today || today.isClosed || !today.open || !today.close) {
            return {
                status: 'closed',
                label: 'CLOSED',
                todayHours: today && today.open ? `${today.open}–${today.close}` : ''
            };
        }

        const openMin = parseTime(today.open);
        const closeMin = parseTime(today.close);

        if (currentTotalMin >= openMin && currentTotalMin < closeMin) {
            if (closeMin - currentTotalMin <= 30) {
                return { status: 'closing', label: 'CLOSING SOON', todayHours: `${today.open}–${today.close}` };
            }
            return { status: 'open', label: 'OPEN', todayHours: `${today.open}–${today.close}` };
        }

        return { status: 'closed', label: 'CLOSED', todayHours: `${today.open}–${today.close}` };
    } catch (e) {
        console.error('getShopStatus error:', e);
        return { status: 'closed', label: 'CLOSED' };
    }
}

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    /** Sign In / Sign Up open the auth modal over the current page instead of navigating.
        Modifier-clicks (new tab) fall through to the normal link. The links carry
        `data-no-transition` so PageTransition's global click handler leaves them alone. */
    const openAuthFromLink = (e: React.MouseEvent, mode: 'login' | 'register', closeMobile = false) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (closeMobile) setMobileOpen(false);
        openAuthModal(mode);
    };
    const user = session?.user;
    const { butcherHours, depotHours } = useSiteSettings();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [avatarOverride, setAvatarOverride] = useState<string | null>(null);

    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
    const [showOwnerPortal, setShowOwnerPortal] = useState(false);

    // Listen for Shift + H to toggle Owner Portal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.shiftKey && (e.key === 'H' || e.key === 'h')) {
                setShowOwnerPortal(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Sync time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Listen for avatar changes from the dashboard (real-time update) + hydrate from localStorage
    useEffect(() => {
        try {
            const stored = window.localStorage.getItem('hofherr_user_avatar_v1');
            if (stored) setAvatarOverride(stored);
        } catch {
            // ignore storage errors
        }
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.avatar !== undefined) {
                setAvatarOverride(detail.avatar);
                try {
                    window.localStorage.setItem('hofherr_user_avatar_v1', detail.avatar);
                } catch {
                    // ignore storage errors
                }
            }
        };
        window.addEventListener('avatar-updated', handler);
        return () => window.removeEventListener('avatar-updated', handler);
    }, []);

    // Handle scroll state
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    // Active nav indicator
    useEffect(() => {
        const activeItem = NAV_ITEMS.find((item) => pathname === item.href);
        if (activeItem) {
            const el = linkRefs.current.get(activeItem.label);
            if (el && navRef.current) {
                const navRect = navRef.current.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                setIndicator({
                    left: elRect.left - navRect.left,
                    width: elRect.width,
                });
            }
        } else {
            setIndicator(null);
        }
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    const butcherStatus = getShopStatus(butcherHours, currentTime);
    const depotStatus = getShopStatus(depotHours, currentTime);

    const storePills = (
        <div className={styles.storeStatusWrap}>
            <TransitionLink
                href="/online-orders?store=butcher"
                className={`${styles.storeStatus} ${styles[butcherStatus.status]}`}
            >
                <div className={styles.statusDot} />
                <span className={styles.statusStore}>Shop</span>
                <span className={styles.statusLabel}>{butcherStatus.label}</span>
                {butcherStatus.todayHours && (
                    <span className={styles.statusHours}>
                        <span className={styles.statusDivider}>|</span>
                        {butcherStatus.todayHours.replace(/:00/g, '').replace(/ /g, '').replace('–', '-')}
                    </span>
                )}
            </TransitionLink>
            <TransitionLink
                href="/online-orders?store=depot"
                className={`${styles.storeStatus} ${styles[depotStatus.status]}`}
            >
                <div className={styles.statusDot} />
                <span className={styles.statusStore}>Depot</span>
                <span className={styles.statusLabel}>{depotStatus.label}</span>
                {depotStatus.todayHours && (
                    <span className={styles.statusHours}>
                        <span className={styles.statusDivider}>|</span>
                        {depotStatus.todayHours.replace(/:00/g, '').replace(/ /g, '').replace('–', '-')}
                    </span>
                )}
            </TransitionLink>
        </div>
    );

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.inner}`}>
                {/* Logo */}
                <TransitionLink href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                    <Image
                        src="/assets/logo.svg"
                        alt="Hofherr Meat Co."
                        height={56}
                        width={180}
                        className={styles.logoImgMain}
                        priority
                        fetchPriority="high"
                    />
                </TransitionLink>

                {/* Desktop Nav */}
                <nav className={styles.nav} ref={navRef}>
                    {indicator && (
                        <span
                            className={`${styles.magicLine} ${styles.magicLineDynamic}`}
                            style={
                                {
                                    '--magic-left': `${indicator.left}px`,
                                    '--magic-width': `${indicator.width}px`,
                                } as React.CSSProperties
                            }
                        />
                    )}
                    {NAV_ITEMS.map((item) => (
                        <TransitionLink
                            key={item.label}
                            href={item.href}
                            ref={el => { if (el) linkRefs.current.set(item.label, el); }}
                            className={`${styles.navLink} ${isActive(item.href) ? styles.navActive : ''}`}
                        >
                            {item.label}
                        </TransitionLink>
                    ))}
                    {showOwnerPortal && (
                        <Link href="/admin" className={`${styles.navLink} ${styles.ownerPortalLink} ${isActive('/admin') ? styles.navActive : ''}`}>
                            Owner Portal
                        </Link>
                    )}
                </nav>

                {/* Right side group */}
                <div className={styles.right}>
                    <div className={styles.rightActions}>
                        {!user ? (
                            <div className={styles.authPill}>
                                <Link href="/online-orders?login=true" prefetch={false} data-no-transition className={styles.signInLink} onClick={(e) => openAuthFromLink(e, 'login')}>Sign In</Link>
                                <span className={styles.authDivider}>/</span>
                                <Link href="/online-orders?signup=true" prefetch={false} data-no-transition className={styles.signInLink} onClick={(e) => openAuthFromLink(e, 'register')}>Sign Up</Link>
                            </div>
                        ) : (
                            <div className={styles.avatarActionsRow}>
                                <TransitionLink
                                    href="/dashboard"
                                    className={styles.avatar}
                                    aria-label="Open My Dashboard"
                                >
                                    <AvatarImage
                                        src={
                                            avatarOverride ||
                                            user.avatar ||
                                            user.image ||
                                            '/assets/avatars/avatar-angus-bull.jpg'
                                        }
                                        name={user.name ?? ''}
                                    />
                                </TransitionLink>
                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className={styles.signOutInlineBtn}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}

                        <TransitionLink href="/online-orders" className={styles.cta} onClick={() => setMobileOpen(false)}>Order Online</TransitionLink>

                        <NavCartIcon />

                        <button
                            className={`${styles.hamburger} ${mobileOpen ? styles.active : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg viewBox="0 0 64 48">
                                <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
                                <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
                                <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
                            </svg>
                        </button>
                    </div>

                    <div className={styles.storeStatusOuter}>
                        <div className={styles.marqueeTrack}>
                            {storePills}
                            <div className={styles.mobileOnlyClone} aria-hidden="true">{storePills}</div>
                            <div className={styles.mobileOnlyClone} aria-hidden="true">{storePills}</div>
                            <div className={styles.mobileOnlyClone} aria-hidden="true">{storePills}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className={styles.mobile}>
                    {/* Top Group: Primary Links */}
                    <div className={styles.mobileTopGroup}>
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className={styles.mobileSection}>
                                <TransitionLink
                                    href={item.href}
                                    className={`${styles.mobilePrimary} ${isActive(item.href) ? styles.mobileActive : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </TransitionLink>
                            </div>
                        ))}
                        {showOwnerPortal && (
                            <div className={styles.mobileSection}>
                                <Link href="/admin" className={`${styles.mobilePrimary} ${styles.ownerPortalLink}`} onClick={() => setMobileOpen(false)}>
                                    Owner Portal
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Bottom Group: Store Status + CTA */}
                    <div className={styles.mobileBottomGroup}>
                        <div className={styles.mobileStoreStatus}>
                            <Link
                                href="/online-orders?store=butcher"
                                className={`${styles.storeStatus} ${styles[butcherStatus.status]}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                <div className={styles.statusDot} />
                                <span className={styles.statusStore}>Shop</span>
                                <span className={styles.statusLabel}>{butcherStatus.label}</span>
                                {butcherStatus.todayHours && (
                                    <span className={styles.statusHours}>
                                        <span className={styles.statusDivider}>|</span>
                                        {butcherStatus.todayHours.replace(/:00/g, '').replace(/ /g, '').replace('–', '-')}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/online-orders?store=depot"
                                className={`${styles.storeStatus} ${styles[depotStatus.status]}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                <div className={styles.statusDot} />
                                <span className={styles.statusStore}>Depot</span>
                                <span className={styles.statusLabel}>{depotStatus.label}</span>
                                {depotStatus.todayHours && (
                                    <span className={styles.statusHours}>
                                        <span className={styles.statusDivider}>|</span>
                                        {depotStatus.todayHours.replace(/:00/g, '').replace(/ /g, '').replace('–', '-')}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className={styles.mobileCTA}>
                            {!user ? (
                                <div className={styles.mobileAuthGrid}>
                                    <Link href="/online-orders?login=true" prefetch={false} data-no-transition className={`btn btn-secondary ${styles.authGridBtn}`} onClick={(e) => openAuthFromLink(e, 'login', true)}>Sign In</Link>
                                    <Link href="/online-orders?signup=true" prefetch={false} data-no-transition className={`btn btn-secondary ${styles.authGridBtn}`} onClick={(e) => openAuthFromLink(e, 'register', true)}>Sign Up</Link>
                                </div>
                            ) : (
                                <TransitionLink href="/dashboard" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Dashboard</TransitionLink>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
