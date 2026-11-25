'use client';

import dynamic from 'next/dynamic';
import { useCartCount } from '@/context/CartContext';

const GlobalCartDrawer = dynamic(() => import('@/components/GlobalCartDrawer'), {
    ssr: false,
});

/**
 * Only loads GlobalCartDrawer (and its 104KB online-orders stylesheet)
 * once the visitor actually opens the cart drawer.
 */
export default function LazyGlobalCartDrawer() {
    const { isCartOpen } = useCartCount();
    if (!isCartOpen) return null;
    return <GlobalCartDrawer />;
}
