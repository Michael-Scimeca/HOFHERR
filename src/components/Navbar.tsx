'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSiteSettings, type StoreHourEntry } from '@/context/SiteSettingsContext';
import styles from './Navbar.module.css';
import NavCartIcon from './NavCartIcon';

const NAV_ITEMS = [
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

/**
 * Determines current store status based on Central Time
 */
function getShopStatus(hours: StoreHourEntry[], absoluteNow: Date) {
    if (!hours || hours.length === 0) return { status: 'closed', label: 'CLOSED' };

    try {
        // Robust timezone formatting for Chicago
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(absoluteNow);
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
    const user = session?.user;
    const { butcherHours, depotHours } = useSiteSettings();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

    // Sync time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
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

    // Debug exposed to window
    if (typeof window !== 'undefined') {
        (window as any).NAV_DEBUG = {
            currentTime: currentTime.toLocaleTimeString(),
            chicagoTime: new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', timeStyle: 'short' }).format(currentTime),
            butcher: butcherStatus,
            depot: depotStatus,
            rawHours: { butcher: butcherHours, depot: depotHours }
        };
    }

    const storePills = (
        <div className={styles.storeStatusWrap}>
            <Link
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
            </Link>
            <Link
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
            </Link>
        </div>
    );

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                {/* Logo */}
                <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                    <Image
                        src="/assets/logo.png"
                        alt="Hofherr Meat Co."
                        height={48}
                        width={48}
                        style={{ objectFit: 'contain', width: 'auto', height: '48px', filter: 'brightness(0) invert(1)' }}
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.nav} ref={navRef}>
                    {indicator && (
                        <span
                            className={styles.magicLine}
                            style={{ left: indicator.left, width: indicator.width }}
                        />
                    )}
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            ref={el => { if (el) linkRefs.current.set(item.label, el); }}
                            className={`${styles.navLink} ${isActive(item.href) ? styles.navActive : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side group */}
                <div className={styles.right}>
                    <div className={styles.rightActions}>
                        {!user ? (
                            <div className={styles.authPill}>
                                <Link href="/online-orders?login=true" className={styles.signInLink}>Sign In</Link>
                                <span className={styles.authDivider}>/</span>
                                <Link href="/online-orders?signup=true" className={styles.signInLink}>Sign Up</Link>
                            </div>
                        ) : (
                            <div className={styles.avatarDropdownWrap}>
                                <button className={styles.avatar} aria-label="My Dashboard">
                                    {user.image ? (
                                        <Image src={user.image} alt="Avatar" width={40} height={40} className={styles.avatarImg} />
                                    ) : (
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </button>
                                <div className={styles.avatarDropdown}>
                                    <Link href={user.isAdmin ? "/admin" : "/dashboard"} className={styles.avatarDropdownItem}>
                                        {user.isAdmin ? '🛡️ Admin Panel' : '📊 My Dashboard'}
                                    </Link>
                                    <button onClick={() => signOut()} className={styles.avatarDropdownItem} style={{ color: '#ef4444' }}>🚪 Sign Out</button>
                                </div>
                            </div>
                        )}

                        <Link href="/online-orders" className={styles.cta} onClick={() => setMobileOpen(false)}>Order Online</Link>

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
                    {/* Nav links */}
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className={styles.mobileSection}>
                            <Link
                                href={item.href}
                                className={`${styles.mobilePrimary} ${isActive(item.href) ? styles.mobileActive : ''}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}

                    {/* Store status in mobile menu */}
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

                    {/* CTA + Auth */}
                    <div className={styles.mobileCTA}>
                        {!user ? (
                            <div className={styles.mobileAuthGrid}>
                                <Link href="/online-orders?login=true" className={`btn btn-secondary ${styles.authGridBtn}`} onClick={() => setMobileOpen(false)}>Sign In</Link>
                                <Link href="/online-orders?signup=true" className={`btn btn-secondary ${styles.authGridBtn}`} onClick={() => setMobileOpen(false)}>Sign Up</Link>
                            </div>
                        ) : (
                            <Link href="/dashboard" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
