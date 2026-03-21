'use client';

import React from 'react';
import { useCartCount } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function NavCartIcon() {
    const { count, openCart } = useCartCount();

    return (
        <div className={styles.cartWrap}>
            <button 
                className={styles.cartIcon} 
                onClick={openCart}
                data-cart-icon
                aria-label={`Shopping Cart, ${count} items`}
            >
                <svg 
                    width="25" 
                    height="25" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {count > 0 && (
                    <span className={styles.cartBadge}>{count}</span>
                )}
            </button>
        </div>
    );
}
