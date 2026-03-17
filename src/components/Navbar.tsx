'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useCartCount } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
    { label: 'Specials', href: '/specials' },
    { label: 'BBQ', href: '/bbq' },
    { label: 'Catering', href: '/catering' },
    { label: 'Visit Us', href: '/visit' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Gift Cards', href: '/gift-cards' },
];

// ── Price helpers ─────────────────────────────────────────────────────────────
function parsePrice(price: string): number {
    const m = price.match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
}
function formatTotal(n: number): string {
    return '$' + n.toFixed(2);
}

// ── Cart Icon ─────────────────────────────────────────────────────────────────
function NavCartIcon() {
    const { count, openCart } = useCartCount();
    return (
        <button
            onClick={openCart}
            className={styles.cartIcon}
            aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}
            data-cart-icon
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && <span className={styles.cartBadge}>{count > 99 ? '99+' : count}</span>}
        </button>
    );
}

// ── Store hours ─────────────────────────────────────────────────────────────
const BUTCHER_SCHEDULE: Record<number, [number, number] | null> = {
    0: [600, 960],   // Sun 10am–4pm
    1: null,          // Mon Closed
    2: [600, 1080],  // Tue 10am–6pm
    3: [600, 1080],  // Wed 10am–6pm
    4: [600, 1080],  // Thu 10am–6pm
    5: [600, 1080],  // Fri 10am–6pm
    6: [600, 1020],  // Sat 10am–5pm
};

const DEPOT_SCHEDULE: Record<number, [number, number] | null> = {
    0: null,          // Sun Closed
    1: [630, 1080],  // Mon 10:30am–6pm
    2: [630, 1080],  // Tue 10:30am–6pm
    3: [630, 1080],  // Wed 10:30am–6pm
    4: [630, 1080],  // Thu 10:30am–6pm
    5: [630, 1080],  // Fri 10:30am–6pm
    6: null,          // Sat Closed
};

type StoreStatus = { status: 'open' | 'closing' | 'closed'; label: string; todayHours: string };

function fmtTime(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'pm' : 'am';
    const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return m === 0 ? `${hr}${ampm}` : `${hr}:${m.toString().padStart(2, '0')}${ampm}`;
}

function getStatusForSchedule(schedule: Record<number, [number, number] | null>, openLabel: string): StoreStatus {
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const hours = schedule[day];
    const todayHours = hours ? `${fmtTime(hours[0])}–${fmtTime(hours[1])}` : '';
    if (!hours) return { status: 'closed', label: 'Closed', todayHours };
    const [open, close] = hours;
    if (mins < open) return { status: 'closed', label: `Opens ${openLabel}`, todayHours };
    if (mins >= close) return { status: 'closed', label: 'Closed', todayHours };
    const left = close - mins;
    if (left <= 60) {
        const h = Math.floor(left / 60);
        const m = left % 60;
        const t = h > 0 ? `${h}h ${m}m` : `${m}m`;
        return { status: 'closing', label: `Closing in ${t}`, todayHours };
    }
    return { status: 'open', label: 'Open', todayHours };
}

function useStoreStatuses() {
    const [butcher, setButcher] = useState<StoreStatus>(() => getStatusForSchedule(BUTCHER_SCHEDULE, '10am'));
    const [depot, setDepot] = useState<StoreStatus>(() => getStatusForSchedule(DEPOT_SCHEDULE, '10:30am'));
    useEffect(() => {
        const id = setInterval(() => {
            setButcher(getStatusForSchedule(BUTCHER_SCHEDULE, '10am'));
            setDepot(getStatusForSchedule(DEPOT_SCHEDULE, '10:30am'));
        }, 60_000);
        return () => clearInterval(id);
    }, []);
    return { butcher, depot };
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isTicker, setIsTicker] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const { butcher: butcherStatus, depot: depotStatus } = useStoreStatuses();
    const settings = useSiteSettings();
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

    /* ── User Session & Auto-Logout ── */
    const { data: session } = useSession();
    const user = session?.user || null;

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        if (pathname === '/dashboard') {
            window.location.href = '/online-orders';
        }
    };

    // 30-Minute Idle Auto-Logout
    useEffect(() => {
        if (!user) return;
        let idleTimer: ReturnType<typeof setTimeout>;
        const resetTimer = () => {
            clearTimeout(idleTimer);
            // 2 hours = 2 * 60 * 60 * 1000 = 7200000 ms
            idleTimer = setTimeout(() => {
                handleSignOut();
            }, 7200000);
        };
        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
        resetTimer();
        return () => {
            clearTimeout(idleTimer);
            events.forEach(e => window.removeEventListener(e, resetTimer));
        };
    }, [user, pathname]);

    /* ── Sliding underline ── */
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<Map<string, HTMLElement>>(new Map());
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

    useEffect(() => {
        const activeItem = NAV_ITEMS.find(item => isActive(item.href));
        if (!activeItem || !navRef.current) { setIndicator(null); return; }
        const el = linkRefs.current.get(activeItem.label);
        if (!el) { setIndicator(null); return; }
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicator({ left: elRect.left - navRect.left + 12, width: elRect.width - 24 });
    }, [pathname]);

    /* ── Scroll effect ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Close mobile menu on resize & detect ticker breakpoint ── */
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 1000) setMobileOpen(false);
            setIsTicker(window.innerWidth <= 480);
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    /* ── Dropdown helpers ── */
    const openDropdown = (label: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpenMenu(label);
    };
    const closeDropdown = () => {
        closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
    };

    /* ── Store status pill markup ── */
    const storePills = (
        <>
            <Link 
                href="/online-orders?store=butcher"
                className={`${styles.storeStatus} ${styles[butcherStatus.status]}`}
                style={{ textDecoration: 'none' }}
            >
                <span className={styles.statusDot} />
                <span className={styles.statusStore}>Shop</span>
                {butcherStatus.label}
                {butcherStatus.todayHours && <span className={styles.statusHours}>{butcherStatus.todayHours}</span>}
            </Link>
            <span className={styles.tickerSep}>·</span>
            <Link 
                href="/online-orders?store=depot"
                className={`${styles.storeStatus} ${styles[depotStatus.status]}`}
                style={{ textDecoration: 'none' }}
            >
                <span className={styles.statusDot} />
                <span className={styles.statusStore}>Depot</span>
                {depotStatus.label}
                {depotStatus.todayHours && <span className={styles.statusHours}>{depotStatus.todayHours}</span>}
            </Link>
            <span className={styles.tickerSep}>·</span>
        </>
    );

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <span>VIP Curbside Pick Up &amp; Delivery Available on Request - <Link href="/visit" className={styles.topBarLink}>Contact Us</Link></span>
                </div>
            </div>
            <div className={styles.inner}>

                {/* Logo */}
                <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                    <Image
                        src="/logo.png"
                        alt="Hofherr Meat Co."
                        height={48}
                        width={48}
                        style={{ objectFit: 'contain', width: 'auto', height: '48px' }}
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

                {/* Right side */}
                <div className={styles.right}>
                    {user && (
                        <div className={styles.avatarContainer} ref={avatarRef}>
                            {/* @ts-ignore - added isAdmin extension to user */}
                            <Link href={user.isAdmin ? "/admin" : "/dashboard"} className={styles.avatar} aria-label="My Dashboard">
                                {/* @ts-ignore - added avatar extension to user */}
                                {user.avatar ? (
                                    <Image 
                                        // @ts-ignore
                                        src={user.avatar} 
                                        alt="Avatar" 
                                        width={40} 
                                        height={40} 
                                        className={styles.avatarImg}
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : user.email?.includes('sean@') || user.email?.includes('admin@') ? (
                                    <Image 
                                        src="/sean-avatar.jpg" 
                                        alt="Sean" 
                                        width={40} 
                                        height={40} 
                                        className={styles.avatarImg}
                                    />
                                ) : (
                                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                )} 
                            </Link>
                        </div>
                    )}
                    {!user ? (
                        <div className={styles.authLinks}>
                            <Link href="/online-orders?login=true" className={styles.signInLink}>
                                Sign In
                            </Link>
                            <span className={styles.authDivider}>/</span>
                            <Link href="/online-orders?signup=true" className={styles.signInLink}>
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.authLinks}>
                            <button onClick={() => signOut()} className={styles.signInLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Sign Out
                            </button>
                        </div>
                    )}
                    <Link href="/online-orders" className={`${styles.cta} ${pathname === '/online-orders' ? styles.ctaActive : ''}`}>ORDER ONLINE</Link>

                    <NavCartIcon />
                    <button
                        className={styles.hamburger}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`${styles.bar} ${mobileOpen ? styles.bar1Open : ''}`} />
                        <span className={`${styles.bar} ${mobileOpen ? styles.bar2Open : ''}`} />
                        <span className={`${styles.bar} ${mobileOpen ? styles.bar3Open : ''}`} />
                    </button>
                </div>

                {/* Store status pills — ticker below 480px */}
                <div className={styles.storeStatusWrap}>
                    {isTicker ? (
                        <div className={styles.tickerTrack}>
                            {storePills}
                            {storePills}
                        </div>
                    ) : (
                        <>
                            <Link 
                                href="/online-orders?store=butcher"
                                className={`${styles.storeStatus} ${styles[butcherStatus.status]}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <span className={styles.statusDot} />
                                <span className={styles.statusStore}>Shop</span>
                                {butcherStatus.label}
                                {butcherStatus.todayHours && <span className={styles.statusHours}>{butcherStatus.todayHours}</span>}
                            </Link>
                            <Link 
                                href="/online-orders?store=depot"
                                className={`${styles.storeStatus} ${styles[depotStatus.status]}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <span className={styles.statusDot} />
                                <span className={styles.statusStore}>Depot</span>
                                {depotStatus.label}
                                {depotStatus.todayHours && <span className={styles.statusHours}>{depotStatus.todayHours}</span>}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className={styles.mobile}>
                    {NAV_ITEMS.map((item) => (
                        <div key={item.label} className={styles.mobileSection}>
                            <Link href={item.href} className={`${styles.mobilePrimary} ${isActive(item.href) ? styles.mobileActive : ''}`} onClick={() => setMobileOpen(false)}>
                                {item.label}
                            </Link>
                        </div>
                    ))}
                    <div className={styles.mobileCTA}>
                        <Link href="/online-orders" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                            Order Online
                        </Link>
                        {!user ? (
                            <div className={styles.mobileAuthGrid}>
                                <Link href="/online-orders?login=true" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                                    Sign In
                                </Link>
                                <Link href="/online-orders?signup=true" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <Link href="/dashboard" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                                My Dashboard
                            </Link>
                        )}
                        <a href="tel:8474416328" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            (847) 441-6328
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
