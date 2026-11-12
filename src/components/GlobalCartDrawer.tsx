'use client';

import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartCount } from '@/context/CartContext';
import { usePageTransition } from '@/components/PageTransition';
import { BurnPanel } from '@/components/BurnModalShell';
import { lockScroll } from '@/lib/scrollLock';
import { estimateCartServings } from '@/lib/servings';
import styles from '@/app/online-orders/page.module.css';

const TAX_RATE = 0.0225;
const emptySubscribe = () => () => {};

const POPULAR_UPSELLS = [
    { name: 'Dry-Aged Ribeye', price: '$44.99/lb' },
    { name: 'House Bratwurst', price: '$8.99/lb' },
    { name: 'Beef Tallow', price: '$6.99/lb' },
    { name: 'Wagyu Beef Patties', price: '$18.99/lb' },
    { name: 'Pork Belly', price: '$9.99/lb' },
] as const;

function parseItemPrice(price: string | number): number {
    if (typeof price === 'number') return price;
    const m = String(price).match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : parseFloat(String(price)) || 0;
}

function fmtTotal(n: number): string {
    return '$' + n.toFixed(2);
}

export default function GlobalCartDrawer() {
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const {
        items: cart,
        addItem,
        removeItem,
        changeQty,
        isCartOpen,
        closeCart,
        triggerFlyAnimation,
    } = useCartCount();
    const { navigateTo } = usePageTransition();
    const { data: session } = useSession();
    const user = session?.user;

    const [orderNote, setOrderNote] = useState('');
    const [tipPercent, setTipPercent] = useState<number | null>(null);
    const [tipCustom, setTipCustom] = useState('');
    const [showTipCustom, setShowTipCustom] = useState(false);
    const [activeStore, setActiveStore] = useState<'butcher' | 'depot'>('butcher');
    const [isClosing, setIsClosing] = useState(false);
    const afterCloseActionRef = React.useRef<(() => void) | null>(null);

    const requestClose = React.useCallback((afterClose?: () => void) => {
        afterCloseActionRef.current = afterClose || null;
        setIsClosing(true);
    }, []);

    const handleBurnOutComplete = React.useCallback(() => {
        setIsClosing(false);
        closeCart();
        const nextAction = afterCloseActionRef.current;
        afterCloseActionRef.current = null;
        nextAction?.();
    }, [closeCart]);

    useEffect(() => {
        if (!isCartOpen) {
            setIsClosing(false);
            return;
        }
        try {
            const savedStore = localStorage.getItem('hofherr_active_store');
            if (savedStore === 'depot' || savedStore === 'butcher') {
                setActiveStore(savedStore);
            }
        } catch {
            // ignore storage errors
        }
    }, [isCartOpen]);

    useEffect(() => {
        if (!isCartOpen || isClosing) return;
        return lockScroll();
    }, [isCartOpen, isClosing]);

    const subtotal = useMemo(
        () => cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0),
        [cart]
    );

    const tipAmount = useMemo(() => {
        if (showTipCustom && tipCustom) return parseFloat(tipCustom) || 0;
        if (tipPercent !== null) return Math.round(subtotal * tipPercent) / 100;
        return 0;
    }, [subtotal, tipPercent, tipCustom, showTipCustom]);

    const upsells = useMemo(() => {
        const cartNames = new Set(cart.map(i => i.name));
        return POPULAR_UPSELLS.filter(p => !cartNames.has(p.name)).slice(0, 3);
    }, [cart]);

    const handleLogout = async () => {
        await signOut({ redirect: false });
    };

    if (!mounted || !isCartOpen) return null;

    const totalItemCount = cart.reduce((s, i) => s + i.qty, 0);
    const estLbs = cart
        .filter(i => String(i.price ?? '').includes('/lb'))
        .reduce((s, i) => s + i.qty, 0);

    return createPortal(
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
            data-pt-portal
            data-lenis-prevent={isClosing ? undefined : true}
            onClick={() => requestClose()}
        >
            <BurnPanel
                className={styles.drawer}
                closing={isClosing}
                onCloseComplete={handleBurnOutComplete}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.drawerPickupBanner}>
                    📍 Pickup at {activeStore === 'depot' ? 'The Depot' : 'The Butcher Shop'}
                </div>
                <div className={styles.drawerHead}>
                    <div className={styles.drawerHeadLeft}>
                        <img
                            src="/assets/item.png?v=2"
                            alt=""
                            width={160}
                            height={160}
                            className={styles.drawerParcelImg}
                        />
                        <div>
                            <h3>Your Order</h3>
                            {user?.name && (
                                <div className={styles.drawerUser}>
                                    <span>
                                        Logged in as <strong>{user.name}</strong>
                                    </span>
                                    <div className={styles.drawerUserLinks}>
                                        <Link
                                            href="/dashboard"
                                            onClick={e => {
                                                e.preventDefault();
                                                requestClose(() => navigateTo('/dashboard'));
                                            }}
                                        >
                                            My Dashboard
                                        </Link>
                                        <button type="button" onClick={handleLogout}>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => requestClose()}
                        aria-label="Close cart drawer"
                    >
                        ✕
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p className={styles.emptyCart}>Your cart is empty.</p>
                ) : (
                    <>
                        <div className={styles.drawerBody}>
                            <div className={styles.cartItems}>
                                <div className={`${styles.drawerSectionLabel} ${styles.drawerBasketLabel}`}>
                                    Your Basket
                                </div>
                                {cart.map(item => {
                                    const unit = parseItemPrice(item.price);
                                    const priceStr = String(item.price ?? '');
                                    const isPerLb = priceStr.includes('/lb');
                                    const lineEst = unit * item.qty;
                                    return (
                                        <div key={item.name} className={styles.cartItem}>
                                            <div className={styles.cartItemInfo}>
                                                <div className={styles.cartItemName}>{item.name}</div>
                                                <div className={styles.cartItemPrice}>
                                                    {item.price} × {item.qty}
                                                    {unit > 0 && (
                                                        <span className={styles.drawerLineEst}>
                                                            = {fmtTotal(lineEst)}
                                                            {isPerLb ? '/lb est.' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.note && (
                                                    <div className={styles.cartItemNote}>📝 {item.note}</div>
                                                )}
                                            </div>
                                            <div className={styles.cartItemControls}>
                                                <button
                                                    type="button"
                                                    className={styles.qtyBtn}
                                                    onClick={() => changeQty(item.name, -1)}
                                                >
                                                    −
                                                </button>
                                                <span className={styles.qtyNum}>{item.qty}</span>
                                                <button
                                                    type="button"
                                                    className={styles.qtyBtn}
                                                    onClick={() => changeQty(item.name, 1)}
                                                >
                                                    +
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={() => removeItem(item.name)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.drawerSection}>
                                <div className={styles.drawerSectionLabel}>📝 Order Note</div>
                                <textarea
                                    className={styles.drawerNote_input}
                                    placeholder="Any instructions for the whole order? (e.g. call before cutting, vacuum seal, etc.)"
                                    value={orderNote}
                                    onChange={e => setOrderNote(e.target.value)}
                                    rows={2}
                                    maxLength={300}
                                />
                            </div>

                            <div className={styles.drawerSection}>
                                <div className={styles.tipLabel}>💝 Add a Tip for Our Team</div>
                                <div className={styles.tipGrid}>
                                    {[0, 10, 15, 20].map(pct => (
                                        <button
                                            key={pct}
                                            type="button"
                                            className={`${styles.tipBtn} ${
                                                !showTipCustom && tipPercent === pct ? styles.tipBtnActive : ''
                                            }`}
                                            onClick={() => {
                                                setTipPercent(pct);
                                                setShowTipCustom(false);
                                                setTipCustom('');
                                            }}
                                        >
                                            {pct === 0 ? 'None' : `${pct}%`}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`${styles.tipBtn} ${showTipCustom ? styles.tipBtnActive : ''}`}
                                        onClick={() => {
                                            setShowTipCustom(true);
                                            setTipPercent(null);
                                        }}
                                    >
                                        Custom
                                    </button>
                                </div>
                                {showTipCustom && (
                                    <div className={styles.tipCustomRow}>
                                        <span className={styles.drawerTipPrefix}>$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.50"
                                            placeholder="0.00"
                                            className={styles.tipCustomInput}
                                            value={tipCustom}
                                            onChange={e => setTipCustom(e.target.value)}
                                        />
                                    </div>
                                )}
                                {tipAmount > 0 && (
                                    <div className={styles.tipAmount}>Tip: {fmtTotal(tipAmount)}</div>
                                )}
                            </div>

                            {upsells.length > 0 && (
                                <div className={styles.drawerSection}>
                                    <div
                                        className={`${styles.drawerSectionLabel} ${styles.drawerUpsellLabel}`}
                                    >
                                        ✨ Recommended Add-ons
                                    </div>
                                    <div className={styles.upsellList}>
                                        {upsells.map(p => (
                                            <div key={p.name} className={styles.upsellItem}>
                                                <div>
                                                    <div className={styles.upsellName}>{p.name}</div>
                                                    <div className={styles.upsellPrice}>{p.price}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.upsellAdd}
                                                    onClick={e => {
                                                        const btn = e.currentTarget;
                                                        const rect = btn.getBoundingClientRect();
                                                        triggerFlyAnimation({
                                                            x: rect.left + rect.width / 2,
                                                            y: rect.top + rect.height / 2,
                                                        });
                                                        addItem({
                                                            name: p.name,
                                                            price: p.price,
                                                            qty: 1,
                                                            note: '',
                                                        });
                                                    }}
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.drawerFoot}>
                            <div className={styles.drawerStats}>
                                <span>
                                    🥩 {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
                                </span>
                                <span>⚖️ ~{estLbs} lbs est.</span>
                                {(() => {
                                    const servings = estimateCartServings(cart);
                                    return servings ? <span>👥 {servings.label}</span> : null;
                                })()}
                            </div>
                            <div className={styles.drawerTotalRow}>
                                <span>Estimated Subtotal</span>
                                <strong>{fmtTotal(subtotal)}</strong>
                            </div>
                            <div className={styles.drawerTotalRow}>
                                <span>Estimated Tax</span>
                                <strong>{fmtTotal(subtotal * TAX_RATE)}</strong>
                            </div>
                            {tipAmount > 0 && (
                                <div className={styles.drawerTotalRow}>
                                    <span>Tip</span>
                                    <strong>{fmtTotal(tipAmount)}</strong>
                                </div>
                            )}
                            <div className={`${styles.drawerTotalRow} ${styles.drawerFinalTotal}`}>
                                <span>Estimated Total</span>
                                <strong>{fmtTotal(subtotal * (1 + TAX_RATE) + tipAmount)}</strong>
                            </div>
                            <p className={styles.drawerPriceNote}>
                                *Final total is determined by exact scale weight at pickup.
                                <br />
                                Prices are estimates. Final adjustment may occur based on actual weight.
                            </p>
                            <p className={styles.drawerNote}>
                                Secure checkout · Visa, Apple Pay, Google Pay, PayPal
                            </p>
                            <button
                                type="button"
                                className={styles.checkoutBtn}
                                onClick={() => {
                                    try {
                                        localStorage.setItem('hofherr_active_store', activeStore);
                                    } catch {}
                                    requestClose(() => navigateTo('/checkout'));
                                }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </BurnPanel>
        </div>,
        document.body
    );
}
