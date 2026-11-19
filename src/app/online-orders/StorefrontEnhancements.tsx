'use client';

import { useEffect, useState } from 'react';
import { CURATED_BUNDLES, type CuratedBundle } from './storefrontData';
import styles from './StorefrontEnhancements.module.css';

export interface ReorderItem {
    name: string;
    price: string;
    qty: number;
    note: string;
}

interface StorefrontEnhancementsProps {
    isLoggedIn: boolean;
    onAddItems: (items: ReorderItem[]) => void;
}

const RECENT_ORDERS_KEY = 'hofherr_recent_order_items_v1';

const SUBSCRIPTION_PLANS = [
    {
        id: 'monthly-steakhouse-box',
        badge: 'Monthly Club',
        price: '$189 / mo',
        title: 'Monthly Steakhouse Box',
        desc: '2× 45-Day Dry-Aged Prime Ribeyes, 2× Prime Filets, 2 lbs Marinated Skirt Steak & Beef Tallow — ready first Friday monthly.',
    },
    {
        id: 'biweekly-family-butcher-box',
        badge: 'Every 2 Weeks',
        price: '$135 / 2 wks',
        title: 'Family Butcher Box',
        desc: 'Berkshire Pork Chops, Ground Sirloin, House Bratwurst, Amish Chicken Breasts & Seasonal Cut — curated bi-weekly.',
    },
    {
        id: 'weekly-friday-rotisserie',
        badge: 'Every Friday',
        price: '$26 / wk',
        title: 'Friday Rotisserie Club',
        desc: 'Reserved hot-off-the-spit herb-brined Rotisserie Chicken + 2 house sides waiting for you every Friday — never sells out.',
    },
] as const;

export default function StorefrontEnhancements({
    isLoggedIn,
    onAddItems,
}: StorefrontEnhancementsProps) {
    const [buyAgainItems, setBuyAgainItems] = useState<ReorderItem[]>([]);
    const [addedBundleId, setAddedBundleId] = useState<string | null>(null);
    const [addedReorderName, setAddedReorderName] = useState<string | null>(null);
    const [subLoadingId, setSubLoadingId] = useState<string | null>(null);
    const [subError, setSubError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadPreviousItems() {
            const collected: ReorderItem[] = [];
            const seen = new Set<string>();

            // 1. Pull real past orders from API when signed in
            if (isLoggedIn) {
                try {
                    const res = await fetch('/api/orders');
                    if (res.ok) {
                        const data = await res.json();
                        const orders = Array.isArray(data?.orders) ? data.orders : [];
                        for (const ord of orders) {
                            const items = Array.isArray(ord?.items) ? ord.items : [];
                            for (const it of items) {
                                if (!it?.name || seen.has(it.name)) continue;
                                seen.add(it.name);
                                collected.push({
                                    name: it.name,
                                    price: typeof it.price === 'string' ? it.price : '',
                                    qty: Math.max(1, Number(it.qty) || 1),
                                    note: typeof it.note === 'string' ? it.note : '',
                                });
                                if (collected.length >= 6) break;
                            }
                            if (collected.length >= 6) break;
                        }
                    }
                } catch {
                    // non-fatal
                }
            }

            // 2. Fallback / supplement from local recent order history
            if (collected.length < 4 && typeof window !== 'undefined') {
                try {
                    const raw = window.localStorage.getItem(RECENT_ORDERS_KEY);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            for (const it of parsed) {
                                if (!it?.name || seen.has(it.name)) continue;
                                seen.add(it.name);
                                collected.push({
                                    name: String(it.name),
                                    price: String(it.price ?? ''),
                                    qty: Math.max(1, Number(it.qty) || 1),
                                    note: String(it.note ?? ''),
                                });
                                if (collected.length >= 6) break;
                            }
                        }
                    }
                } catch {
                    // ignore malformed storage
                }
            }

            if (!cancelled) {
                setBuyAgainItems(collected);
            }
        }

        void loadPreviousItems();
        return () => {
            cancelled = true;
        };
    }, [isLoggedIn]);

    const handleBundleAdd = (bundle: CuratedBundle) => {
        onAddItems(bundle.items);
        setAddedBundleId(bundle.id);
        setTimeout(() => setAddedBundleId((prev) => (prev === bundle.id ? null : prev)), 1800);
    };

    const handleReorderAdd = (item: ReorderItem) => {
        onAddItems([item]);
        setAddedReorderName(item.name);
        setTimeout(() => setAddedReorderName((prev) => (prev === item.name ? null : prev)), 1600);
    };

    const handleSubscribe = async (planId: string) => {
        setSubError('');
        setSubLoadingId(planId);
        try {
            const res = await fetch('/api/subscriptions/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, storeId: 'butcher' }),
            });
            const data = await res.json();
            if (!res.ok || !data.url) {
                setSubError(data.error || 'Could not launch subscription checkout.');
            } else {
                window.location.href = data.url;
            }
        } catch {
            setSubError('Network error — please try again.');
        } finally {
            setSubLoadingId(null);
        }
    };

    return (
        <div className={styles.enhancementsWrap}>
            {buyAgainItems.length > 0 && (
                <section className={styles.block} aria-label="Order Again from Past Orders">
                    <div className={styles.blockHead}>
                        <h2 className={styles.blockTitle}>Buy Again · Your Usual Cuts</h2>
                        <span className={styles.blockSub}>
                            1-click reorder with your saved cut thickness &amp; butcher notes
                        </span>
                    </div>
                    <div className={styles.reorderStrip}>
                        {buyAgainItems.map((item) => (
                            <div key={item.name} className={styles.reorderCard}>
                                <div className={styles.reorderTop}>
                                    <span className={styles.reorderName}>{item.name}</span>
                                    {item.price && <span className={styles.reorderPrice}>{item.price}</span>}
                                </div>
                                {item.note && <p className={styles.reorderNote}>&ldquo;{item.note}&rdquo;</p>}
                                <button
                                    type="button"
                                    className={styles.reorderBtn}
                                    onClick={() => handleReorderAdd(item)}
                                >
                                    {addedReorderName === item.name
                                        ? '✓ Added to Order'
                                        : `+ Reorder (${item.qty})`}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className={styles.block} aria-label="1-Click Curated Butcher Bundles">
                <div className={styles.blockHead}>
                    <h2 className={styles.blockTitle}>1-Click Butcher Bundles</h2>
                    <span className={styles.blockSub}>
                        Curated cook-ready packs — add all cuts &amp; specs in one click
                    </span>
                </div>
                <div className={styles.bundleGrid}>
                    {CURATED_BUNDLES.map((bundle) => {
                        const isAdded = addedBundleId === bundle.id;
                        return (
                            <article key={bundle.id} className={styles.bundleCard}>
                                <div className={styles.bundleHead}>
                                    <span className={styles.bundleBadge}>{bundle.badge}</span>
                                    <span className={styles.bundleServes}>{bundle.serves}</span>
                                </div>
                                <h3 className={styles.bundleTitle}>{bundle.title}</h3>
                                <p className={styles.bundleDesc}>{bundle.description}</p>
                                <ul className={styles.bundleItems}>
                                    {bundle.items.map((it) => (
                                        <li key={it.name}>
                                            {it.qty}× {it.name} ({it.price})
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className={`${styles.bundleBtn} ${isAdded ? styles.bundleBtnDone : ''}`}
                                    onClick={() => handleBundleAdd(bundle)}
                                >
                                    {isAdded ? '✓ Bundle Added to Cart' : 'Add Full Bundle'}
                                </button>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className={styles.block} aria-label="Recurring Butcher Box Subscriptions">
                <div className={styles.blockHead}>
                    <h2 className={styles.blockTitle}>Recurring Butcher Boxes &amp; Clubs</h2>
                    <span className={styles.blockSub}>
                        Skip, pause, or cancel anytime · Priority dry-age vault &amp; Friday pickup access
                    </span>
                </div>
                {subError && (
                    <div className={styles.subError} role="alert">
                        {subError}
                    </div>
                )}
                <div className={styles.bundleGrid}>
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <article key={plan.id} className={styles.bundleCard}>
                            <div className={styles.bundleHead}>
                                <span className={styles.bundleBadge}>{plan.badge}</span>
                                <span className={styles.reorderPrice}>{plan.price}</span>
                            </div>
                            <h3 className={styles.bundleTitle}>{plan.title}</h3>
                            <p className={styles.bundleDesc}>{plan.desc}</p>
                            <button
                                type="button"
                                className={styles.reorderBtn}
                                disabled={subLoadingId === plan.id}
                                onClick={() => void handleSubscribe(plan.id)}
                            >
                                {subLoadingId === plan.id ? 'Opening Stripe…' : 'Subscribe Now →'}
                            </button>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

