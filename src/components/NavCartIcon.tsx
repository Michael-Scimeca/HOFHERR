'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCartCount } from '@/context/CartContext';
import styles from './Navbar.module.css';

interface RemoveFeedback {
    id: number;
    delta: number;
    emptied: boolean;
}

export default function NavCartIcon() {
    const { count, badgeCount, openCart } = useCartCount();
    const prevCountRef = useRef<number>(badgeCount);
    const [removeFx, setRemoveFx] = useState<RemoveFeedback | null>(null);

    useEffect(() => {
        const prev = prevCountRef.current;
        prevCountRef.current = badgeCount;

        if (badgeCount < prev) {
            const delta = prev - badgeCount;
            const emptied = badgeCount === 0;
            const id = Date.now();
            setRemoveFx({ id, delta, emptied });
            const timer = window.setTimeout(() => {
                setRemoveFx(curr => (curr?.id === id ? null : curr));
            }, 620);
            return () => window.clearTimeout(timer);
        }
    }, [badgeCount]);

    const iconAnimClass = removeFx
        ? removeFx.emptied
            ? styles.cartBagEmptied
            : styles.cartBagRemoving
        : '';

    return (
        <div className={styles.cartWrap}>
            <button
                type="button"
                className={`${styles.cartIcon} ${iconAnimClass}`}
                onClick={openCart}
                data-cart-icon
                aria-label={`Shopping Cart, ${count} items`}
            >
                <svg
                    className={styles.cartBagSvg}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {badgeCount > 0 && (
                    <span className={styles.cartBadge}>{badgeCount}</span>
                )}
                {removeFx && (
                    <span
                        key={removeFx.id}
                        className={`${styles.cartRemoveFloat} ${removeFx.emptied ? styles.cartRemoveFloatEmpty : ''}`}
                        aria-hidden="true"
                    >
                        {removeFx.emptied ? 'Empty' : `−${removeFx.delta}`}
                    </span>
                )}
            </button>
        </div>
    );
}
