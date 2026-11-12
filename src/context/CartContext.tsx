'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getAddToOrderAnimConfig, getFlyEasingString } from '@/lib/addToOrderAnimConfig';

export type CartItem = { name: string; price: string; qty: number; note: string; desc?: string };

type CartCtx = {
    count: number;
    setCount: (n: number) => void;
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (name: string) => void;
    changeQty: (name: string, delta: number) => void;
    /** Whether the global cart drawer is open (on pages outside /online-orders) */
    isCartOpen: boolean;
    /** Call to open the cart drawer on any page */
    openCart: () => void;
    /** Call to close the global cart drawer */
    closeCart: () => void;
    /** Register a custom drawer opener — called by /online-orders page on mount */
    registerCartOpener: (fn: (() => void) | null) => void;
    /** Trigger fly-to-cart animation from a source element or coordinates */
    triggerFlyAnimation: (source: { x: number; y: number }) => void;
};

const CartContext = createContext<CartCtx>({
    count: 0,
    setCount: () => { },
    items: [],
    addItem: () => { },
    removeItem: () => { },
    changeQty: () => { },
    isCartOpen: false,
    openCart: () => { },
    closeCart: () => { },
    registerCartOpener: () => { },
    triggerFlyAnimation: () => { },
});

const STORAGE_KEY = 'hofherr_cart';
const BUTCHER_KEY = 'hofherr_cart_butcher';

/* ── Fly-to-cart animation helper ── */
function createFlyingDot(sx: number, sy: number) {
    const cfg = getAddToOrderAnimConfig();
    if (!cfg.flyEnabled) return;

    const launch = () => {
        const cartEl = document.querySelector('[data-cart-icon]') as HTMLElement | null;
        if (!cartEl) return;
        const cartRect = cartEl.getBoundingClientRect();
        const tx = cartRect.left + cartRect.width / 2 + (cfg.flyTargetOffsetX || 0);
        const ty = cartRect.top + cartRect.height / 2 + (cfg.flyTargetOffsetY || 0);

        const size = Math.max(24, cfg.flyIconSize || 84);
        const half = size / 2;
        const imgSrc = cfg.flyImageSrc || '/assets/item.png?v=2';
        const shadowBlur = Math.max(0, cfg.flyShadowBlur ?? 12);
        const shadowOp = Math.min(1, Math.max(0, cfg.flyShadowOpacity ?? 0.45));
        const glowR = Math.max(0, cfg.flyGlowRadius ?? 0);
        const glowColor = cfg.flyGlowColorHex || '#FF5014';

        const filterParts = [`drop-shadow(0 4px ${shadowBlur}px rgba(0,0,0,${shadowOp}))`];
        if (glowR > 0 || cfg.flyFlamesEnabled) {
            const r = Math.max(glowR, cfg.flyFlamesEnabled ? 12 : 0);
            filterParts.push(`drop-shadow(0 0 ${r}px ${glowColor})`);
        }

        const flameScale = Math.max(0.5, cfg.flyFlameSize ?? 1.15);
        const flameOp = Math.min(1, Math.max(0.2, (cfg.flyFlameIntensity ?? 1.4) * 0.65));
        const flameSvg = cfg.flyFlamesEnabled
            ? `<svg viewBox="0 0 120 140" width="${Math.round(size * flameScale)}" height="${Math.round(size * 1.2 * flameScale)}" style="position:absolute;left:50%;top:42%;transform:translate(-50%,-62%);pointer-events:none;opacity:${flameOp};filter:drop-shadow(0 0 10px #FF5014);">
                <defs>
                    <linearGradient id="hmcFlyFlameG" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stop-color="#CC0E1D" stop-opacity="0.95"/>
                        <stop offset="50%" stop-color="#FF5014" stop-opacity="0.9"/>
                        <stop offset="92%" stop-color="#FFD27D" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#FFF4D2" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <path fill="url(#hmcFlyFlameG)" d="M60 6 C72 28 96 42 94 74 C93 98 78 122 60 126 C42 122 27 98 26 74 C25 50 42 36 47 18 C51 32 56 36 60 6 Z"/>
                <path fill="#FFD27D" opacity="0.75" d="M60 34 C68 50 80 60 78 82 C76 98 68 112 60 116 C52 112 44 98 42 82 C41 64 52 52 60 34 Z"/>
            </svg>`
            : '';

        const dot = document.createElement('div');
        dot.innerHTML = `${flameSvg}<img src="${imgSrc}" alt="" width="${size}" height="${size}" style="position:relative;z-index:2;width:${size}px;height:${size}px;object-fit:contain;" />`;
        dot.style.cssText = `
            position: fixed;
            left: ${sx - half}px; top: ${sy - half}px;
            width: ${size}px; height: ${size}px;
            z-index: 99999;
            pointer-events: none;
            filter: ${filterParts.join(' ')};
            transition: none;
            will-change: transform, opacity;
        `;
        document.body.appendChild(dot);

        // Force reflow
        dot.getBoundingClientRect();

        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minMs = Math.max(150, cfg.flyMinMs || 700);
        const maxMs = Math.max(minMs, cfg.flyMaxMs || 900);
        const duration = Math.min(maxMs, Math.max(minMs, dist * 0.9));

        const arc = cfg.flyArcHeight ?? 65;
        const apexOffset = Math.min(0.85, Math.max(0.15, cfg.flyApexOffset ?? 0.42));
        const s0 = cfg.flyStartScale ?? 1.15;
        const sPeak = cfg.flyPeakScale ?? 1.4;
        const sEnd = cfg.flyEndScale ?? 0.34;
        const r0 = cfg.flyStartRotationDeg ?? -6;
        const rMid = cfg.flyMidRotationDeg ?? 8;
        const rEnd = cfg.flyEndRotationDeg ?? 18;
        const op0 = cfg.flyStartOpacity ?? 1;
        const opEnd = cfg.flyEndOpacity ?? 0.85;
        const plungePx = cfg.flyDropPlungePx ?? 22;
        const dropStyle = cfg.flyDropStyle || 'plunge-top';
        const easing = getFlyEasingString(cfg.flyEasing || 'gravity-drop');

        // Cart anticipation (mouth of bag widens slightly as item approaches)
        const antX = cfg.cartAnticipationScaleX ?? 1.14;
        const antY = cfg.cartAnticipationScaleY ?? 0.9;
        if (antX !== 1 || antY !== 1) {
            cartEl.animate(
                [
                    { transform: 'scale(1, 1)' },
                    { transform: `scale(${antX}, ${antY}) translateY(-2px)`, offset: 0.78 },
                    { transform: `scale(${antX}, ${antY}) translateY(-1px)` },
                ],
                { duration: Math.max(120, duration * 0.92), easing: 'ease-out' }
            );
        }

        // Optional ember & flame trail along the parabolic path
        if ((cfg.flyEmberTrail || cfg.flyFlamesEnabled) && (cfg.flyEmberCount ?? 10) > 0) {
            const count = Math.min(24, Math.max(2, cfg.flyEmberCount || 10));
            const isFlameTrail = Boolean(cfg.flyFlamesEnabled);
            for (let i = 1; i <= count; i++) {
                const t = (i / (count + 1)) * 0.9;
                window.setTimeout(() => {
                    const spark = document.createElement('div');
                    const curveLift = Math.sin(t * Math.PI) * arc;
                    const px = sx + dx * t + (Math.random() - 0.5) * 18;
                    const py = sy + dy * t - curveLift + (Math.random() - 0.5) * 18;
                    const sz = isFlameTrail ? 8 + Math.random() * 10 : 4 + Math.random() * 5;
                    spark.style.cssText = `
                        position: fixed;
                        left: ${px - sz / 2}px; top: ${py - sz / 2}px;
                        width: ${sz}px; height: ${isFlameTrail ? sz * 1.45 : sz}px;
                        border-radius: ${isFlameTrail ? '50% 50% 45% 45% / 65% 65% 35% 35%' : '999px'};
                        background: radial-gradient(circle, #FFF2B2 0%, #FFD27D 32%, #FF5014 68%, #CC0E1D 100%);
                        box-shadow: 0 0 ${isFlameTrail ? 14 : 8}px #FF5014;
                        z-index: 99998;
                        pointer-events: none;
                    `;
                    document.body.appendChild(spark);
                    const spAnim = spark.animate(
                        [
                            { transform: 'translate3d(0,0,0) scale(1)', opacity: 0.95 },
                            {
                                transform: `translate3d(${(Math.random() - 0.5) * 28}px, ${isFlameTrail ? -18 - Math.random() * 22 : 14 + Math.random() * 18}px, 0) scale(0.15)`,
                                opacity: 0,
                            },
                        ],
                        { duration: 380 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' }
                    );
                    spAnim.onfinish = () => spark.remove();
                }, duration * t);
            }
        }

        // Build keyframes based on selected drop style into the cart bag
        let keyframes: Keyframe[];
        if (dropStyle === 'plunge-top') {
            keyframes = [
                {
                    transform: `translate3d(0px, 0px, 0) scale(${s0}) rotate(${r0}deg)`,
                    opacity: String(op0),
                    offset: 0,
                },
                {
                    transform: `translate3d(${dx * apexOffset}px, ${dy * apexOffset - arc}px, 0) scale(${sPeak}) rotate(${rMid}deg)`,
                    opacity: '1',
                    offset: apexOffset,
                },
                {
                    transform: `translate3d(${dx}px, ${dy - plungePx}px, 0) scale(${Math.max(sEnd * 1.35, 0.45)}) rotate(${rEnd * 0.75}deg)`,
                    opacity: '1',
                    offset: 0.84,
                },
                {
                    transform: `translate3d(${dx}px, ${dy + 5}px, 0) scale(${sEnd}) rotate(${rEnd}deg)`,
                    opacity: String(opEnd),
                    offset: 1,
                },
            ];
        } else if (dropStyle === 'hover-sink') {
            keyframes = [
                {
                    transform: `translate3d(0px, 0px, 0) scale(${s0}) rotate(${r0}deg)`,
                    opacity: String(op0),
                    offset: 0,
                },
                {
                    transform: `translate3d(${dx * apexOffset}px, ${dy * apexOffset - arc}px, 0) scale(${sPeak}) rotate(${rMid}deg)`,
                    opacity: '1',
                    offset: Math.min(0.65, apexOffset),
                },
                {
                    transform: `translate3d(${dx}px, ${dy - plungePx * 1.25}px, 0) scale(${Math.max(sEnd * 1.5, 0.55)}) rotate(0deg)`,
                    opacity: '1',
                    offset: 0.74,
                },
                {
                    transform: `translate3d(${dx}px, ${dy - plungePx * 1.1}px, 0) scale(${Math.max(sEnd * 1.4, 0.5)}) rotate(${rEnd * 0.4}deg)`,
                    opacity: '1',
                    offset: 0.86,
                },
                {
                    transform: `translate3d(${dx}px, ${dy + 6}px, 0) scale(${sEnd * 0.75}) rotate(${rEnd}deg)`,
                    opacity: String(opEnd),
                    offset: 1,
                },
            ];
        } else if (dropStyle === 'slam-dunk') {
            keyframes = [
                {
                    transform: `translate3d(0px, 0px, 0) scale(${s0}) rotate(${r0}deg)`,
                    opacity: String(op0),
                    offset: 0,
                },
                {
                    transform: `translate3d(${dx * 0.65}px, ${dy * 0.35 - arc * 1.35}px, 0) scale(${sPeak * 1.12}) rotate(${rMid}deg)`,
                    opacity: '1',
                    offset: 0.68,
                },
                {
                    transform: `translate3d(${dx}px, ${dy + 8}px, 0) scale(${sEnd * 0.85}) rotate(${rEnd}deg)`,
                    opacity: String(opEnd),
                    offset: 1,
                },
            ];
        } else {
            // direct-center
            keyframes = [
                {
                    transform: `translate3d(0px, 0px, 0) scale(${s0}) rotate(${r0}deg)`,
                    opacity: String(op0),
                    offset: 0,
                },
                {
                    transform: `translate3d(${dx * apexOffset}px, ${dy * apexOffset - arc}px, 0) scale(${sPeak}) rotate(${rMid}deg)`,
                    opacity: '1',
                    offset: apexOffset,
                },
                {
                    transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sEnd}) rotate(${rEnd}deg)`,
                    opacity: String(opEnd),
                    offset: 1,
                },
            ];
        }

        const anim = dot.animate(keyframes, {
            duration,
            easing,
            fill: 'forwards',
        });

        anim.onfinish = () => {
            const holdMs = Math.max(0, cfg.flyDropHoldMs ?? 110);
            if (holdMs > 0) {
                const sinkAnim = dot.animate(
                    [
                        {
                            transform: `translate3d(${dx}px, ${dy + 4}px, 0) scale(${sEnd}) rotate(${rEnd}deg)`,
                            opacity: String(opEnd),
                        },
                        {
                            transform: `translate3d(${dx}px, ${dy + 14}px, 0) scale(${Math.max(0.05, sEnd * 0.25)}) rotate(${rEnd + 10}deg)`,
                            opacity: '0',
                        },
                    ],
                    { duration: holdMs, easing: 'ease-in', fill: 'forwards' }
                );
                sinkAnim.onfinish = () => dot.remove();
            } else {
                dot.remove();
            }

            // Flash ring around cart bag on catch
            if (cfg.cartFlashRing) {
                const ring = document.createElement('div');
                ring.style.cssText = `
                    position: fixed;
                    left: ${tx - 22}px; top: ${ty - 22}px;
                    width: 44px; height: 44px;
                    border-radius: 999px;
                    border: 2px solid ${cfg.borderColorHex || '#CC0E1D'};
                    box-shadow: 0 0 14px ${cfg.flyGlowColorHex || '#FF5014'};
                    z-index: 99997;
                    pointer-events: none;
                `;
                document.body.appendChild(ring);
                const rAnim = ring.animate(
                    [
                        { transform: 'scale(0.5)', opacity: 0.95 },
                        { transform: 'scale(1.85)', opacity: 0 },
                    ],
                    { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
                );
                rAnim.onfinish = () => ring.remove();
            }

            // Flame burst flare on cart bag catch
            if (cfg.cartFlamesBurst !== false && cfg.flyFlamesEnabled !== false) {
                for (let j = 0; j < 7; j++) {
                    const tongue = document.createElement('div');
                    const spreadX = (j - 3) * 7 + (Math.random() - 0.5) * 6;
                    const w = 8 + Math.random() * 6;
                    const h = 16 + Math.random() * 14;
                    tongue.style.cssText = `
                        position: fixed;
                        left: ${tx + spreadX - w / 2}px; top: ${ty - h * 0.6}px;
                        width: ${w}px; height: ${h}px;
                        border-radius: 50% 50% 40% 40% / 70% 70% 30% 30%;
                        background: linear-gradient(to top, #CC0E1D 0%, #FF5014 55%, #FFD27D 100%);
                        box-shadow: 0 0 10px #FF5014;
                        z-index: 99998;
                        pointer-events: none;
                    `;
                    document.body.appendChild(tongue);
                    const fAnim = tongue.animate(
                        [
                            { transform: 'translate3d(0, 4px, 0) scale(0.6)', opacity: 0.95 },
                            {
                                transform: `translate3d(${spreadX * 0.65}px, ${-18 - Math.random() * 18}px, 0) scale(1.15, 1.35)`,
                                opacity: 0.85,
                                offset: 0.45,
                            },
                            {
                                transform: `translate3d(${spreadX * 0.9}px, ${-34 - Math.random() * 16}px, 0) scale(0.2, 0.4)`,
                                opacity: 0,
                            },
                        ],
                        { duration: 380 + Math.random() * 160, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
                    );
                    fAnim.onfinish = () => tongue.remove();
                }
            }

            // Cart bag squash, stretch, and tilt catch reaction
            const bounceScale = cfg.cartBounceScale ?? 1.32;
            const sqX = cfg.cartSquashScaleX ?? 1.24;
            const sqY = cfg.cartSquashScaleY ?? 0.82;
            const tilt = cfg.cartTiltDeg ?? 8;
            const bounceMs = Math.max(150, cfg.cartBounceMs ?? 440);

            cartEl.animate(
                [
                    { transform: 'scale(1, 1) rotate(0deg)' },
                    { transform: `scale(${sqX}, ${sqY}) translateY(3px) rotate(${-tilt}deg)`, offset: 0.22 },
                    { transform: `scale(${Math.max(0.85, 2 - sqX * 0.85)}, ${bounceScale}) translateY(-3px) rotate(${tilt * 0.65}deg)`, offset: 0.52 },
                    { transform: `scale(${1 + (bounceScale - 1) * 0.25}, 0.94) rotate(${-tilt * 0.25}deg)`, offset: 0.78 },
                    { transform: 'scale(1, 1) rotate(0deg)' },
                ],
                { duration: bounceMs, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
            );

            // Pop the cart count badge if present
            const badgeEl = cartEl.querySelector('span');
            const badgeScale = cfg.cartBadgePopScale ?? 1.45;
            if (badgeEl && badgeScale > 1) {
                badgeEl.animate(
                    [
                        { transform: 'scale(1)' },
                        { transform: `scale(${badgeScale})` },
                        { transform: 'scale(0.92)' },
                        { transform: 'scale(1)' },
                    ],
                    { duration: Math.round(bounceMs * 0.85), easing: 'ease-out' }
                );
            }
        };
    };

    const delay = Math.max(0, cfg.flyDelayMs || 0);
    if (delay > 0) {
        window.setTimeout(launch, delay);
    } else {
        launch();
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const itemsRef = useRef<CartItem[]>([]);
    const openerRef = useRef<(() => void) | null>(null);

    // Sync items from localStorage whenever count changes, and initialize on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BUTCHER_KEY);
            const parsed: CartItem[] = saved ? JSON.parse(saved) : [];
            itemsRef.current = parsed;
            setItems(parsed);

            const actualCount = parsed.reduce((s, i) => s + i.qty, 0);
            if (actualCount !== count) {
                setCount(actualCount);
            }
        } catch {
            itemsRef.current = [];
            setItems([]);
        }
    }, [count, isCartOpen]);

    const persistCart = useCallback((updated: CartItem[]) => {
        itemsRef.current = updated;
        setItems(updated);
        try {
            const raw = JSON.stringify(updated);
            localStorage.setItem(STORAGE_KEY, raw);
            localStorage.setItem(BUTCHER_KEY, raw);
        } catch { }
        setCount(updated.reduce((s, i) => s + i.qty, 0));
    }, []);

    const addItem = useCallback((newItem: CartItem) => {
        const current = [...itemsRef.current];
        const existingIdx = current.findIndex(i => i.name === newItem.name);
        if (existingIdx >= 0) {
            current[existingIdx] = {
                ...current[existingIdx],
                qty: current[existingIdx].qty + (newItem.qty || 1),
                note: newItem.note || current[existingIdx].note,
            };
        } else {
            current.push({ ...newItem, qty: newItem.qty || 1 });
        }
        persistCart(current);
    }, [persistCart]);

    const removeItem = useCallback((name: string) => {
        const updated = itemsRef.current.filter(i => i.name !== name);
        persistCart(updated);
    }, [persistCart]);

    const changeQty = useCallback((name: string, delta: number) => {
        const updated = itemsRef.current.map(i =>
            i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i
        );
        persistCart(updated);
    }, [persistCart]);

    const registerCartOpener = useCallback((fn: (() => void) | null) => {
        openerRef.current = fn;
    }, []);

    const openCart = useCallback(() => {
        if (openerRef.current) {
            openerRef.current();
        } else {
            setIsCartOpen(true);
        }
    }, []);

    const closeCart = useCallback(() => {
        setIsCartOpen(false);
    }, []);

    const triggerFlyAnimation = useCallback((source: { x: number; y: number }) => {
        createFlyingDot(source.x, source.y);
    }, []);

    const contextValue = useMemo(() => ({
        count,
        setCount,
        items,
        addItem,
        removeItem,
        changeQty,
        isCartOpen,
        openCart,
        closeCart,
        registerCartOpener,
        triggerFlyAnimation,
    }), [count, items, addItem, removeItem, changeQty, isCartOpen, openCart, closeCart, registerCartOpener, triggerFlyAnimation]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export const useCartCount = () => useContext(CartContext);
