'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type CartItem = { name: string; price: string; qty: number; note: string; desc?: string };

type CartCtx = {
    count: number;
    setCount: (n: number) => void;
    items: CartItem[];
    removeItem: (name: string) => void;
    changeQty: (name: string, delta: number) => void;
    /** Call to open the cart drawer (works on /online-orders; navigates there otherwise) */
    openCart: () => void;
    /** Register the drawer opener — called by /online-orders page on mount */
    registerCartOpener: (fn: () => void) => void;
    /** Trigger fly-to-cart animation from a source element or coordinates */
    triggerFlyAnimation: (source: { x: number; y: number }) => void;
};

const CartContext = createContext<CartCtx>({
    count: 0,
    setCount: () => { },
    items: [],
    removeItem: () => { },
    changeQty: () => { },
    openCart: () => { },
    registerCartOpener: () => { },
    triggerFlyAnimation: () => { },
});

const STORAGE_KEY = 'hofherr_cart';

/* ── Fly-to-cart animation helper ── */
function createFlyingDot(sx: number, sy: number) {
    const cartEl = document.querySelector('[data-cart-icon]');
    if (!cartEl) return;
    const cartRect = cartEl.getBoundingClientRect();
    const tx = cartRect.left + cartRect.width / 2;
    const ty = cartRect.top + cartRect.height / 2;

    const dot = document.createElement('div');
    dot.innerHTML = `<img src="/assets/item.png" alt="" width="40" height="40" style="width:40px;height:40px;object-fit:contain;" />`;
    dot.style.cssText = `
        position: fixed;
        left: ${sx}px; top: ${sy}px;
        width: 40px; height: 40px;
        z-index: 99999;
        pointer-events: none;
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));
        transition: none;
    `;
    document.body.appendChild(dot);

    // Force reflow then animate
    dot.getBoundingClientRect();

    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const duration = Math.min(900, Math.max(700, dist * 0.9));

    // Final position: center the icon on the cart bag (offset by half the icon size)
    const finalX = tx - 20;
    const finalY = ty - 17;

    const anim = dot.animate([
        { left: `${sx}px`, top: `${sy}px`, transform: 'scale(1.2)', opacity: '1' },
        { left: `${sx + dx * 0.4}px`, top: `${sy + dy * 0.4 - 50}px`, transform: 'scale(1.4)', opacity: '1', offset: 0.4 },
        { left: `${finalX}px`, top: `${finalY}px`, transform: 'scale(0.4)', opacity: '0.7' },
    ], {
        duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
    });

    anim.onfinish = () => {
        dot.remove();
        // Bounce the cart icon
        cartEl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.3)' },
            { transform: 'scale(0.9)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' },
        ], { duration: 400, easing: 'ease-out' });
    };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState<CartItem[]>([]);
    const openerRef = useRef<(() => void) | null>(null);

    // Sync items from localStorage whenever count changes, and initialize on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed: CartItem[] = saved ? JSON.parse(saved) : [];
            setItems(parsed);
            
            const actualCount = parsed.reduce((s, i) => s + i.qty, 0);
            if (actualCount !== count) {
                setCount(actualCount);
            }
        } catch {
            setItems([]);
        }
    }, [count]);

    const removeItem = useCallback((name: string) => {
        setItems(prev => {
            const updated = prev.filter(i => i.name !== name);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { }
            setCount(updated.reduce((s, i) => s + i.qty, 0));
            return updated;
        });
    }, []);

    const changeQty = useCallback((name: string, delta: number) => {
        setItems(prev => {
            const updated = prev.map(i =>
                i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i
            );
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { }
            setCount(updated.reduce((s, i) => s + i.qty, 0));
            return updated;
        });
    }, []);

    const registerCartOpener = useCallback((fn: () => void) => {
        openerRef.current = fn;
    }, []);

    const openCart = useCallback(() => {
        if (openerRef.current) {
            openerRef.current();
        } else {
            window.location.href = '/online-orders';
        }
    }, []);

    const triggerFlyAnimation = useCallback((source: { x: number; y: number }) => {
        createFlyingDot(source.x, source.y);
    }, []);

    return (
        <CartContext.Provider value={{ count, setCount, items, removeItem, changeQty, openCart, registerCartOpener, triggerFlyAnimation }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCartCount = () => useContext(CartContext);
