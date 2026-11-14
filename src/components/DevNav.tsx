'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { openAuthModal } from '@/components/AuthModal';
import { useCartCount } from '@/context/CartContext';
import { TOGGLE_ANIM_STUDIO_EVENT } from '@/lib/addToOrderAnimConfig';
import styles from './dev-nav.module.css';

type DevOverlayAction =
    | 'cart-filled'
    | 'cart-empty'
    | 'shop-item-modal'
    | 'shop-checkout-modal'
    | 'shop-restock-auth'
    | 'shop-restock-toast'
    | 'shop-max-stock-toast'
    | 'auth-login'
    | 'auth-register'
    | 'auth-forgot'
    | 'chat-general'
    | 'chat-quote'
    | 'cart-anim'
    | 'mobile-menu'
    | 'preloader-replay'
    | 'cut-popover'
    | 'admin-customer-modal'
    | 'admin-add-product-modal'
    | 'inventory-add-product-modal';

interface DevLinkItem {
    href: string;
    icon: string;
    label: string;
    action?: DevOverlayAction;
}

interface DevSection {
    label: string;
    category: 'modals' | 'pages' | 'sections';
    links: DevLinkItem[];
}

const SAMPLE_CART_ITEMS = [
    { name: 'New York Strip', price: '$42.99/lb', qty: 2, note: '' },
    { name: 'Al Pastor Sausage', price: '$13.99/lb', qty: 1, note: '' },
    { name: 'Smoked Pork Chops', price: '$16.99/lb', qty: 1, note: '' },
    { name: 'Bacon', price: '$14.99/lb', qty: 1, note: '' },
    { name: 'Porchetta', price: '$28.99/lb', qty: 2, note: '' },
    { name: 'Boneless Country Style Ribs', price: '$4.99/lb', qty: 1, note: '' },
    { name: 'Bone-In Pork Shoulder', price: '$7.99/lb', qty: 1, note: '' },
    { name: 'Boneless Pork Shoulder', price: '$8.99/lb', qty: 2, note: '' },
];

const SECTIONS: DevSection[] = [
    {
        label: 'Modals & Drawers · Order & Cart',
        category: 'modals',
        links: [
            { href: '/online-orders?devModal=cart-filled', icon: '🧺', label: 'Cart Drawer (Filled)', action: 'cart-filled' },
            { href: '/online-orders?devModal=cart-empty', icon: '🛒', label: 'Cart Drawer (Empty)', action: 'cart-empty' },
            { href: '/online-orders?devModal=item', icon: '🥩', label: 'Add-to-Order Item Modal', action: 'shop-item-modal' },
            { href: '/online-orders?devModal=checkout', icon: '💳', label: 'Checkout Modal (Pickup)', action: 'shop-checkout-modal' },
            { href: '/online-orders?devModal=restock-auth', icon: '🔔', label: 'Restock Alert Modal', action: 'shop-restock-auth' },
            { href: '/online-orders?devModal=restock-toast', icon: '✅', label: 'Restock Sent Toast', action: 'shop-restock-toast' },
            { href: '/online-orders?devModal=max-stock-toast', icon: '⚠️', label: 'Max Stock Alert Toast', action: 'shop-max-stock-toast' },
        ],
    },
    {
        label: 'Modals & Drawers · Auth & Global',
        category: 'modals',
        links: [
            { href: '#auth-login', icon: '🔑', label: 'Auth Modal (Sign In)', action: 'auth-login' },
            { href: '#auth-register', icon: '📝', label: 'Auth Modal (Sign Up)', action: 'auth-register' },
            { href: '#auth-forgot', icon: '🔐', label: 'Auth Modal (Forgot Pass)', action: 'auth-forgot' },
            { href: '#chat', icon: '💬', label: 'Butcher Chat Popup', action: 'chat-general' },
            { href: '#chat-quote', icon: '🍖', label: 'Catering Quote Chat', action: 'chat-quote' },
            { href: '#mobile-menu', icon: '📱', label: 'Mobile Fullscreen Drawer', action: 'mobile-menu' },
            { href: '#cart-anim', icon: '🎬', label: 'Cart Fly Anim Studio', action: 'cart-anim' },
            { href: '#preloader', icon: '🔥', label: 'Replay Fire Preloader', action: 'preloader-replay' },
        ],
    },
    {
        label: 'Modals & Popovers · Admin & Cuts',
        category: 'modals',
        links: [
            { href: '/test-cut-collection?devModal=popover', icon: '🔪', label: 'Cut Quick-Order Popover', action: 'cut-popover' },
            { href: '/admin?devModal=customer', icon: '👤', label: 'Admin Customer Modal', action: 'admin-customer-modal' },
            { href: '/admin/inventory?devModal=add', icon: '📦', label: 'Admin Add Product Modal', action: 'admin-add-product-modal' },
            { href: '/inventory?devModal=add', icon: '🗃️', label: 'Inventory Add Item Modal', action: 'inventory-add-product-modal' },
        ],
    },
    {
        label: 'Pages',
        category: 'pages',
        links: [
            { href: '/', icon: '🏠', label: 'Home' },
            { href: '/our-story', icon: '📖', label: 'Our Story' },
            { href: '/selections', icon: '🥓', label: 'Selections' },
            { href: '/featured', icon: '⭐', label: 'Featured' },
            { href: '/visit', icon: '📍', label: 'Visit' },
            { href: '/press', icon: '📰', label: 'Press' },
            { href: '/jobs', icon: '💼', label: 'Jobs' },
            { href: '/faq', icon: '❓', label: 'FAQ' },
            { href: '/gift-cards', icon: '🎁', label: 'Gift Cards' },
            { href: '/sitemap-page', icon: '🗺️', label: 'Sitemap' },
            { href: '/specials', icon: '🔥', label: 'Specials' },
            { href: '/catering', icon: '🍖', label: 'Catering' },
            { href: '/bbq', icon: '🌡️', label: 'BBQ' },
            { href: '/cut-guide', icon: '🥩', label: 'Cut Guide' },
            { href: '/recipes-test', icon: '🍳', label: 'Recipes Test' },
            { href: '/newsletter', icon: '✉️', label: 'Newsletter' },
        ],
    },
    {
        label: 'Order, Account & Legal',
        category: 'pages',
        links: [
            { href: '/online-orders', icon: '🛒', label: '1· Shop' },
            { href: '/checkout', icon: '💳', label: '2· Checkout Page' },
            { href: '/order/success', icon: '✅', label: '3· Order Success' },
            { href: '/dashboard', icon: '👤', label: 'Customer Dashboard' },
            { href: '/dashboard/cut-collector', icon: '🥩', label: 'Cut Collector' },
            { href: '/login', icon: '🔑', label: 'Login Page' },
            { href: '/register', icon: '📝', label: 'Register Page' },
            { href: '/reset-password', icon: '🔐', label: 'Reset Password' },
            { href: '/verify-email', icon: '✅', label: 'Verify Email' },
            { href: '/privacy', icon: '📄', label: 'Privacy' },
            { href: '/terms', icon: '⚖️', label: 'Terms' },
        ],
    },
    {
        label: 'Admin, Identity & Dev',
        category: 'pages',
        links: [
            { href: '/admin', icon: '📊', label: 'Admin Dashboard' },
            { href: '/admin/inventory', icon: '🗃️', label: 'Admin Inventory' },
            { href: '/admin/social', icon: '📣', label: 'Admin Social' },
            { href: '/admin/login', icon: '🔒', label: 'Admin Login' },
            { href: '/inventory', icon: '📦', label: 'Inventory Manager' },
            { href: '/studio', icon: '🎨', label: 'Sanity Studio' },
            { href: '/product-identity', icon: '🏷️', label: 'Product Identity' },
            { href: '/product-identity/print', icon: '🖨️', label: 'Print Kit' },
            { href: '/product-identity/sizes', icon: '📐', label: 'Sizes' },
            { href: '/product-identity/sizes/print', icon: '🖨️', label: 'Sizes · Print' },
            { href: '/product-identity/social', icon: '📱', label: 'Social Kit' },
            { href: '/product-identity/social/admin', icon: '⚙️', label: 'Social · Admin' },
            { href: '/modules', icon: '🧱', label: 'All Sections Gallery' },
            { href: '/greens-and-emblems', icon: '🟢', label: 'Greens & Emblems' },
            { href: '/design-system', icon: '🧩', label: 'Design System' },
            { href: '/showcase', icon: '🎯', label: 'Showcase' },
            { href: '/roadmap', icon: '🧭', label: 'Roadmap' },
            { href: '/pitch-deck', icon: '📈', label: 'Pitch Deck' },
            { href: '/fire-test', icon: '🔥', label: 'Fire Test' },
            { href: '/map-test', icon: '📍', label: 'Map Test' },
            { href: '/order-tracker-test', icon: '🚚', label: 'Order Tracker Test' },
            { href: '/test-cut-collection', icon: '🔪', label: 'Cut Collection Bench' },
            { href: '/debug-email/preview', icon: '📧', label: 'Email Templates' },
            { href: '/debug-email', icon: '🐞', label: 'Debug Email' },
        ],
    },
    {
        label: 'Section Modules (Library)',
        category: 'sections',
        links: [
            { href: '/modules', icon: '🧱', label: 'View All Section Modules' },
            { href: '/modules#mod-hero', icon: '🎬', label: 'Hero (Home)' },
            { href: '/modules#mod-seasonal-banner', icon: '🍀', label: 'SeasonalBanner' },
            { href: '/modules#mod-home-specials', icon: '🔥', label: 'Specials (Home)' },
            { href: '/modules#mod-process', icon: '👉', label: 'Process (How It Works)' },
            { href: '/modules#mod-awards', icon: '🏆', label: 'AwardsSection' },
            { href: '/modules#mod-trust-bar', icon: '🛡️', label: 'TrustBar' },
            { href: '/modules#mod-weekly-picks', icon: '🥩', label: 'WeeklyPicks' },
            { href: '/modules#mod-menu-highlights', icon: '📋', label: 'MenuHighlights' },
            { href: '/modules#mod-story-teaser', icon: '📖', label: 'StoryTeaser' },
            { href: '/modules#mod-sourcing-strip', icon: '🌾', label: 'SourcingStrip' },
            { href: '/modules#mod-home-cut-guide', icon: '🔪', label: 'CutGuide (Home)' },
            { href: '/modules#mod-recipe-teasers', icon: '🍳', label: 'RecipeTeasers' },
            { href: '/modules#mod-gallery-strip', icon: '🖼️', label: 'GalleryStrip' },
            { href: '/modules#mod-home-reviews', icon: '⭐', label: 'Reviews (Home)' },
            { href: '/modules#mod-order-cta-banner', icon: '📣', label: 'OrderCTABanner' },
            { href: '/modules#mod-catering-cta', icon: '🍖', label: 'CateringCTA' },
            { href: '/modules#mod-quotes-section', icon: '💬', label: 'QuotesSection' },
            { href: '/modules#mod-hiring-chatbox', icon: '💼', label: 'HiringChatbox' },
            { href: '/modules#mod-catering-hub', icon: '🧮', label: 'CateringHub' },
            { href: '/modules#mod-bbq-hub', icon: '🔥', label: 'BBQHub' },
            { href: '/modules#mod-catering-module', icon: '🐖', label: 'CateringModule (Pig)' },
        ],
    },
];

function isProtectedRoute(href: string): boolean {
    if (href === '/admin/login') return false;
    return (
        href === '/dashboard' ||
        href.startsWith('/dashboard/') ||
        href === '/inventory' ||
        href.startsWith('/inventory?') ||
        href.startsWith('/admin') ||
        href.startsWith('/product-identity')
    );
}

const DevNav = () => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'modals' | 'pages' | 'sections'>('all');
    const [godBusy, setGodBusy] = useState(false);
    const { data: session, update } = useSession();
    const { items: cartItems, addItem, removeItem, openCart } = useCartCount();
    const pathname = usePathname();
    const router = useRouter();

    const isGodMode = Boolean(session?.user?.isAdmin);
    const visibleSections = SECTIONS.filter(section => filter === 'all' || section.category === filter);

    const ensureGodModeAndNavigate = async (targetHref: string) => {
        if (!isGodMode && isProtectedRoute(targetHref)) {
            setGodBusy(true);
            try {
                await signIn('credentials', {
                    email: 'godmode@hofherrmeats.com',
                    password: 'hofherr-dev-god-mode',
                    redirect: false,
                });
                await update();
                router.push(targetHref);
                router.refresh();
            } finally {
                setGodBusy(false);
            }
        } else {
            router.push(targetHref);
        }
    };

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

    const handleOverlayAction = async (link: DevLinkItem) => {
        setOpen(false);
        switch (link.action) {
            case 'cart-filled': {
                if (pathname === '/online-orders') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-shop-overlay', { detail: { kind: 'cart-filled' } }));
                } else {
                    if (cartItems.length === 0) {
                        SAMPLE_CART_ITEMS.forEach(item => addItem(item));
                    }
                    openCart();
                }
                return;
            }
            case 'cart-empty': {
                if (pathname === '/online-orders') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-shop-overlay', { detail: { kind: 'cart-empty' } }));
                } else {
                    cartItems.forEach(item => removeItem(item.name));
                    openCart();
                }
                return;
            }
            case 'shop-item-modal':
            case 'shop-checkout-modal':
            case 'shop-restock-auth':
            case 'shop-restock-toast':
            case 'shop-max-stock-toast': {
                const kindMap: Record<string, string> = {
                    'shop-item-modal': 'item',
                    'shop-checkout-modal': 'checkout',
                    'shop-restock-auth': 'restock-auth',
                    'shop-restock-toast': 'restock-toast',
                    'shop-max-stock-toast': 'max-stock-toast',
                };
                if (pathname === '/online-orders') {
                    window.dispatchEvent(
                        new CustomEvent('hofherr-dev-shop-overlay', { detail: { kind: kindMap[link.action] } })
                    );
                } else {
                    router.push(link.href);
                }
                return;
            }
            case 'auth-login':
                openAuthModal('login', true);
                return;
            case 'auth-register':
                openAuthModal('register', true);
                return;
            case 'auth-forgot':
                openAuthModal('forgot', true);
                return;
            case 'chat-general':
                window.dispatchEvent(new CustomEvent('open-chat'));
                return;
            case 'chat-quote':
                window.dispatchEvent(new CustomEvent('open-chat', { detail: { subject: 'quote' } }));
                return;
            case 'cart-anim':
                window.dispatchEvent(new CustomEvent(TOGGLE_ANIM_STUDIO_EVENT));
                return;
            case 'mobile-menu':
                window.dispatchEvent(new CustomEvent('hofherr-open-mobile-menu'));
                return;
            case 'preloader-replay':
                window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { replay: true } }));
                return;
            case 'cut-popover':
                if (pathname === '/test-cut-collection' || pathname === '/dashboard/cut-collector') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-cut-popover'));
                } else {
                    router.push(link.href);
                }
                return;
            case 'admin-customer-modal':
                if (pathname === '/admin') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-admin-modal'));
                } else {
                    await ensureGodModeAndNavigate(link.href);
                }
                return;
            case 'admin-add-product-modal':
                if (pathname === '/admin/inventory') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-add-product-modal'));
                } else {
                    await ensureGodModeAndNavigate(link.href);
                }
                return;
            case 'inventory-add-product-modal':
                if (pathname === '/inventory') {
                    window.dispatchEvent(new CustomEvent('hofherr-dev-add-product-modal'));
                } else {
                    await ensureGodModeAndNavigate(link.href);
                }
                return;
        }
    };

    const handleLinkClick = async (e: React.MouseEvent, link: DevLinkItem) => {
        setOpen(false);
        if (!isGodMode && isProtectedRoute(link.href)) {
            e.preventDefault();
            await ensureGodModeAndNavigate(link.href);
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
                <button
                    type="button"
                    className={styles.godBtn}
                    onClick={() => window.dispatchEvent(new CustomEvent(TOGGLE_ANIM_STUDIO_EVENT))}
                    title="Open Add-to-Cart Animation Preview & Test UI"
                >
                    <span>🛒</span>
                    <span>CART ANIM</span>
                </button>
            </div>

            {open && (
                <div className={styles.panel} data-lenis-prevent>
                    <div className={styles.godBanner}>
                        <div className={styles.bannerControls}>
                            <div className={styles.filterGroup} role="group" aria-label="Filter dev navigation">
                                <button
                                    type="button"
                                    className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.filterBtn} ${filter === 'modals' ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter('modals')}
                                >
                                    Modals &amp; Drawers
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.filterBtn} ${filter === 'pages' ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter('pages')}
                                >
                                    Pages
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.filterBtn} ${filter === 'sections' ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter('sections')}
                                >
                                    Sections
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`${styles.godBannerBtn} ${isGodMode ? styles.godBannerBtnActive : ''}`}
                            onClick={handleToggleGodMode}
                            disabled={godBusy}
                        >
                            {godBusy ? 'Wait…' : isGodMode ? 'Disable God Mode' : '⚡ Enable God Mode'}
                        </button>
                    </div>
                    {visibleSections.map(section => (
                        <div key={section.label} className={styles.section}>
                            <div className={styles.sectionLabel}>{section.label}</div>
                            {section.links.map(link =>
                                link.action ? (
                                    <button
                                        key={`${section.label}-${link.label}`}
                                        type="button"
                                        className={styles.navItem}
                                        onClick={() => handleOverlayAction(link)}
                                    >
                                        <span className={styles.navIcon}>{link.icon}</span>
                                        <span className={styles.navLabel}>{link.label}</span>
                                    </button>
                                ) : (
                                    <Link
                                        key={`${section.label}-${link.label}`}
                                        href={link.href}
                                        className={styles.navItem}
                                        onClick={e => handleLinkClick(e, link)}
                                    >
                                        <span className={styles.navIcon}>{link.icon}</span>
                                        <span className={styles.navLabel}>{link.label}</span>
                                    </Link>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DevNav;
