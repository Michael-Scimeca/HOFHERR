'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './CutCollector.module.css';
import {
    AnimalId,
    ANIMAL_IDS,
    COUNTER_CUT_DETAILS,
    CUT_MAP_DATA,
    CutDefinition,
    TOTAL_CUTS_COUNT,
} from '@/data/cutMap';
import {
    calculateCutProgress,
    CustomerOrder,
} from '@/lib/cutCollector';
import { useCartCount, CartItem } from '@/context/CartContext';

const CART_STORAGE_KEY_V1 = 'hofherr_cart';
const BUTCHER_CART_KEY_V1 = 'hofherr_cart_butcher';
const EMPTY_ORDERS: CustomerOrder[] = [];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatOrderDate(isoStr: string): string {
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return isoStr;
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

interface Props {
    orders?: CustomerOrder[];
    isAuthenticated?: boolean;
    userName?: string;
    isTestPage?: boolean;
}

export default function CutCollector({
    orders = EMPTY_ORDERS,
    isAuthenticated = true,
    userName = 'Guild Member',
}: Props) {
    const [selectedAnimalId, setSelectedAnimalId] = useState<AnimalId>('beef');
    const [selectedCutId, setSelectedCutId] = useState<string | null>(null);
    const [hoveredCutId, setHoveredCutId] = useState<string | null>(null);
    const [quickOrderCutId, setQuickOrderCutId] = useState<string | null>(null);
    const [featuredSteakProduct, setFeaturedSteakProduct] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!quickOrderCutId && !selectedCutId) return;

        const handlePointerDownOutside = (e: PointerEvent) => {
            const target = e.target as Element | null;
            if (!target) return;
            if (popoverRef.current && popoverRef.current.contains(target)) {
                return;
            }
            if (target.closest('[data-cut-interactive="true"]')) {
                return;
            }
            setSelectedCutId(null);
            setQuickOrderCutId(null);
            setFeaturedSteakProduct(null);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedCutId(null);
                setQuickOrderCutId(null);
                setFeaturedSteakProduct(null);
            }
        };

        document.addEventListener('pointerdown', handlePointerDownOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDownOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [quickOrderCutId, selectedCutId]);

    const {
        count: cartCount,
        items: cartItems,
        setCount: setCartCount,
        removeItem: removeCartItem,
        changeQty: changeCartQty,
        openCart,
        triggerFlyAnimation,
    } = useCartCount();

    const cartQtyByName = useMemo(() => {
        const map: Record<string, number> = {};
        for (const item of cartItems) {
            map[item.name] = (map[item.name] || 0) + item.qty;
        }
        return map;
    }, [cartItems]);

    const addCutProductToCart = useCallback(
        (productName: string, e?: React.MouseEvent<HTMLButtonElement>) => {
            const detail = COUNTER_CUT_DETAILS[productName] || {
                price: '$19.99/lb',
                desc: 'Hand-trimmed to order by Hofherr master butchers.',
            };
            try {
                const raw = localStorage.getItem(CART_STORAGE_KEY_V1);
                const existing: CartItem[] = raw ? JSON.parse(raw) : [];
                const idx = existing.findIndex((i) => i.name === productName);
                let updated: CartItem[];
                if (idx >= 0) {
                    updated = existing.map((item, index) =>
                        index === idx ? { ...item, qty: item.qty + 1 } : item
                    );
                } else {
                    updated = [
                        ...existing,
                        {
                            name: productName,
                            price: detail.price,
                            desc: detail.desc,
                            qty: 1,
                            note: '',
                        },
                    ];
                }
                localStorage.setItem(CART_STORAGE_KEY_V1, JSON.stringify(updated));
                localStorage.setItem(BUTCHER_CART_KEY_V1, JSON.stringify(updated));
                const nextCount = updated.reduce((sum, item) => sum + item.qty, 0);
                setCartCount(nextCount);
            } catch {
                // ignore storage errors
            }

            if (e) {
                const rect = e.currentTarget.getBoundingClientRect();
                triggerFlyAnimation({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        },
        [setCartCount, triggerFlyAnimation]
    );

    const stepCutProductQty = useCallback(
        (productName: string, delta: number) => {
            const currentQty = cartQtyByName[productName] || 0;
            if (currentQty + delta <= 0) {
                removeCartItem(productName);
                try {
                    const updated = cartItems.filter((i) => i.name !== productName);
                    localStorage.setItem(BUTCHER_CART_KEY_V1, JSON.stringify(updated));
                } catch {
                    // ignore
                }
            } else {
                changeCartQty(productName, delta);
                try {
                    const updated = cartItems.map((i) =>
                        i.name === productName ? { ...i, qty: i.qty + delta } : i
                    );
                    localStorage.setItem(BUTCHER_CART_KEY_V1, JSON.stringify(updated));
                } catch {
                    // ignore
                }
            }
        },
        [cartQtyByName, removeCartItem, changeCartQty, cartItems]
    );

    // Merge active cart items into effective orders so ordering lights up the cut immediately
    const effectiveOrders = useMemo(() => {
        const merged = [...orders];
        if (cartItems.length > 0) {
            merged.push({
                orderNumber: 'LIVE-CART-BAG',
                status: 'completed',
                createdAt: new Date().toISOString(),
                items: cartItems.map((item) => ({ name: item.name, qty: item.qty })),
            });
        }
        return merged;
    }, [orders, cartItems]);

    // Calculate progress strictly from qualifying completed orders
    const progress = useMemo(() => {
        return calculateCutProgress(effectiveOrders);
    }, [effectiveOrders]);

    const activeAnimal = CUT_MAP_DATA[selectedAnimalId];
    const activeAnimalProgress = progress.animals[selectedAnimalId];

    // Find currently selected cut definition (only updates on click/select, never on hover)
    const activeCutDef = useMemo(() => {
        return (
            activeAnimal.cuts.find((c) => c.id === selectedCutId) ||
            activeAnimal.cuts[0]
        );
    }, [activeAnimal, selectedCutId]);

    const activeCutKey = `${selectedAnimalId}:${activeCutDef.id}`;
    const isSelectedCutCollected = progress.collectedCutKeys.has(activeCutKey);
    const activeCutStats = progress.cutStats[activeCutKey];

    const quickOrderCutDef = useMemo(() => {
        if (!quickOrderCutId) return null;
        return activeAnimal.cuts.find((c) => c.id === quickOrderCutId) || null;
    }, [activeAnimal, quickOrderCutId]);

    const orderedProductsForPopover = useMemo(() => {
        if (!quickOrderCutDef) return [];
        if (featuredSteakProduct && quickOrderCutDef.products.includes(featuredSteakProduct)) {
            return [featuredSteakProduct];
        }
        return quickOrderCutDef.products;
    }, [quickOrderCutDef, featuredSteakProduct]);

    const pickedOrOrderedProducts = useMemo(() => {
        const pickedSet = new Set<string>();
        for (const order of effectiveOrders) {
            for (const item of order.items) {
                if (item.qty > 0) {
                    pickedSet.add(item.name);
                }
            }
        }
        if (featuredSteakProduct && activeCutDef.products.includes(featuredSteakProduct)) {
            pickedSet.add(featuredSteakProduct);
        }
        return activeCutDef.products.filter((prodName) => pickedSet.has(prodName));
    }, [activeCutDef, effectiveOrders, featuredSteakProduct]);

    // Keyboard navigation helper for SVG cuts
    const handleCutKeyDown = (e: React.KeyboardEvent, cut: CutDefinition) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedCutId(cut.id);
            setQuickOrderCutId(cut.id);
            setFeaturedSteakProduct(null);
        }
    };

    return (
        <section
            id="cut-collection"
            aria-labelledby="cut-collection-heading"
            className={styles.container}
        >
            {/* ── Top Header Card with Overall Score ── */}
            <div className={styles.headerCard}>
                <div className={styles.headerTop}>
                    <div className={styles.titleArea}>
                        <h2 id="cut-collection-heading" className={styles.title}>
                            {userName}&apos;s Cut Collection
                        </h2>
                        <p className={styles.subtitle}>
                            Every whole animal ordered at the counter or online unlocks on your guild chart. Complete every cut to claim the whole animal stamp.
                        </p>
                    </div>

                    <div className={styles.scoreBadge} aria-label={`${progress.totalCollected} of ${TOTAL_CUTS_COUNT} cuts collected`}>
                        <span className={styles.scoreCurrent}>{progress.totalCollected}</span>
                        <span className={styles.scoreTotal}>/ {TOTAL_CUTS_COUNT}</span>
                        <span className={styles.scoreLabel}>Cuts Collected</span>
                    </div>
                </div>

                <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={progress.overallPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Overall cuts progress">
                        <div
                            className={styles.progressBarFill}
                            style={{ '--progress-pct': `${progress.overallPercent}%` } as React.CSSProperties}
                        />
                    </div>
                    <div className={styles.progressMeta}>
                        <span>{progress.overallPercent}% Master Butcher Guild Completion</span>
                        <span>{TOTAL_CUTS_COUNT - progress.totalCollected} Cuts Remaining</span>
                    </div>
                </div>
            </div>

            {/* ── Signed-Out / Empty State Banners ── */}
            {!isAuthenticated && (
                <div className={styles.noticeBanner}>
                    <p className={styles.noticeText}>
                        <strong>Guest Preview:</strong> Sign in with your customer account to save your progress and see your real completed orders light up.
                    </p>
                    <Link href="/login" className={styles.noticeBtn}>
                        Sign In to Collect Cuts →
                    </Link>
                </div>
            )}

            {isAuthenticated && progress.qualifyingOrderCount === 0 && simulatedItems.length === 0 && (
                <div className={styles.noticeBanner}>
                    <p className={styles.noticeText}>
                        <strong>Start Your Collection:</strong> You haven&apos;t placed a qualifying butcher order yet. Choose any prime cut on online orders to light up your first cut!
                    </p>
                    <Link href="/online-orders" className={styles.noticeBtn}>
                        Explore Online Orders →
                    </Link>
                </div>
            )}

            {/* ── Animal Selector Tabs ── */}
            <div className={styles.tabsList} role="tablist" aria-label="Select Animal Anatomy">
                {ANIMAL_IDS.map((animalId) => {
                    const animal = CUT_MAP_DATA[animalId];
                    const animalProg = progress.animals[animalId];
                    const isActive = animalId === selectedAnimalId;

                    return (
                        <button
                            key={animalId}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`animal-panel-${animalId}`}
                            className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''} ${animalProg.isComplete ? styles.tabComplete : ''}`}
                            onClick={() => {
                                setSelectedAnimalId(animalId);
                                setSelectedCutId(null);
                                setHoveredCutId(null);
                                setQuickOrderCutId(null);
                                setFeaturedSteakProduct(null);
                            }}
                        >
                            <div className={styles.tabHeader}>
                                <span className={styles.tabName}>{animal.name}</span>
                                <span className={styles.tabBadge}>
                                    {animalProg.collectedCount}/{animalProg.totalCount}
                                </span>
                            </div>
                            <div className={styles.tabMiniTrack}>
                                <div
                                    className={styles.tabMiniFill}
                                    style={{ '--tab-mini-pct': `${animalProg.percent}%` } as React.CSSProperties}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── Main Stage Grid: Interactive Silhouette + Cut Details ── */}
            <div id={`animal-panel-${selectedAnimalId}`} role="tabpanel" className={styles.stageGrid}>
                {/* ── Left Column: Interactive Vector Silhouette ── */}
                <div className={styles.chartPanel}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitleRow}>
                            <div className={styles.chartTitleBadge}>
                                <h3 className={styles.chartAnimalTitle}>
                                    {activeAnimal.name} Cut Map
                                </h3>
                                <span className={styles.chartSubhead}>
                                    Anatomical Butcher Silhouette & Yield
                                </span>
                            </div>

                            <span
                                className={`${styles.chartStatusPill} ${activeAnimalProgress.isComplete ? styles.chartStatusPillComplete : ''}`}
                            >
                                {activeAnimalProgress.isComplete
                                    ? `★ ${activeAnimal.wholeTitle} Complete`
                                    : `${activeAnimalProgress.collectedCount} of ${activeAnimalProgress.totalCount} Cuts Ordered`}
                            </span>
                        </div>
                    </div>

                    <div
                        className={styles.svgStage}
                        onMouseLeave={() => {
                            setHoveredCutId(null);
                        }}
                    >
                            <svg
                                viewBox={activeAnimal.viewBox}
                                className={styles.svgGraphic}
                                role="img"
                                aria-label={`Interactive ${activeAnimal.name} Butcher Cut Silhouette`}
                            >
                                {activeAnimal.woodcutPath && (
                                    <image
                                        href="/assets/identity/cut-charts/flint-flame-butcher-guide-beef-clean.jpg"
                                        x="0"
                                        y="0"
                                        width="1200"
                                        height="896"
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                )}

                                {/* Interactive Primal Cut Shapes / Anatomical Overlays */}
                                <g className={activeAnimal.woodcutPath ? styles.interactiveCutsLayer : undefined}>
                                    {activeAnimal.cuts.map((cut) => {
                                        const key = `${selectedAnimalId}:${cut.id}`;
                                        const isCollected = progress.collectedCutKeys.has(key);
                                        const isSelected = cut.id === selectedCutId;
                                        const isHovered = cut.id === hoveredCutId;
                                        const isHighlighted = isSelected || isHovered;
                                        const isCompactLabel = cut.id === 'short-loin' || cut.id === 'sirloin' || cut.id === 'shank';

                                        return (
                                            <g
                                                key={cut.id}
                                                tabIndex={0}
                                                role="button"
                                                data-cut-interactive="true"
                                                aria-label={`${cut.name} (${activeAnimal.name}), ${isCollected ? 'Collected' : 'Uncollected'}`}
                                                className={styles.cutGroup}
                                                onClick={() => {
                                                    const isTogglingOff = quickOrderCutId === cut.id && !featuredSteakProduct;
                                                    setSelectedCutId(isTogglingOff ? null : cut.id);
                                                    setQuickOrderCutId(isTogglingOff ? null : cut.id);
                                                    setFeaturedSteakProduct(null);
                                                }}
                                                onMouseEnter={() => setHoveredCutId(cut.id)}
                                                onMouseLeave={() => setHoveredCutId(null)}
                                                onMouseOver={() => setHoveredCutId(cut.id)}
                                                onPointerEnter={() => setHoveredCutId(cut.id)}
                                                onPointerLeave={() => setHoveredCutId(null)}
                                                onPointerOver={() => setHoveredCutId(cut.id)}
                                                onFocus={() => setHoveredCutId(cut.id)}
                                                onBlur={() => setHoveredCutId(null)}
                                                onKeyDown={(e) => handleCutKeyDown(e, cut)}
                                            >
                                                <path
                                                    d={cut.svgPath}
                                                    onMouseEnter={() => setHoveredCutId(cut.id)}
                                                    onMouseLeave={() => setHoveredCutId(null)}
                                                    onMouseOver={() => setHoveredCutId(cut.id)}
                                                    onPointerEnter={() => setHoveredCutId(cut.id)}
                                                    onPointerLeave={() => setHoveredCutId(null)}
                                                    onPointerOver={() => setHoveredCutId(cut.id)}
                                                    className={
                                                        activeAnimal.woodcutPath
                                                            ? `${styles.woodcutCutOverlay} ${
                                                                  isCollected ? styles.woodcutCutOverlayCollected : ''
                                                              } ${isHighlighted ? styles.woodcutCutOverlayHighlighted : ''}`
                                                            : `${styles.cutPath} ${
                                                                  isCollected ? styles.cutPathCollected : ''
                                                              } ${isSelected ? styles.cutPathSelected : ''}`
                                                    }
                                                />
                                                {!activeAnimal.woodcutPath && (
                                                    <text
                                                        x={cut.labelX}
                                                        y={cut.labelY}
                                                        className={`${styles.cutLabel} ${isCollected ? styles.cutLabelCollected : ''}`}
                                                    >
                                                        {cut.name.toUpperCase()}
                                                    </text>
                                                )}
                                                {activeAnimal.woodcutPath && isCompactLabel && null}
                                            </g>
                                        );
                                    })}
                                </g>

                                {activeAnimal.woodcutPath && (
                                    <>
                                        {/* Master Flint & Flame Oxblood Linework & Dashed Dividers Overlay */}
                                        <path
                                            d={activeAnimal.woodcutPath}
                                            className={styles.woodcutMasterArt}
                                        />

                                        {/* Dynamic Primal Cut Labels Above Fills & Dividers */}
                                        <g className={styles.woodcutLabelsLayer}>
                                            {activeAnimal.cuts.map((cut) => {
                                                const key = `${selectedAnimalId}:${cut.id}`;
                                                const isCollected = progress.collectedCutKeys.has(key);
                                                const isSelected = cut.id === selectedCutId;
                                                const isHovered = cut.id === hoveredCutId;
                                                const isHighlighted = isSelected || isHovered;
                                                const isCompact = cut.id === 'short-loin' || cut.id === 'sirloin';
                                                const isShank = cut.id === 'shank';

                                                return (
                                                    <g key={`ff-label-${cut.id}`}>
                                                        <text
                                                            x={cut.labelX}
                                                            y={cut.labelY}
                                                            className={`${styles.woodcutCutLabel} ${
                                                                isCompact ? styles.woodcutCutLabelCompact : ''
                                                            } ${isShank ? styles.woodcutCutLabelSmall : ''} ${
                                                                isHighlighted || isCollected ? styles.woodcutCutLabelHighlighted : ''
                                                            }`}
                                                        >
                                                            {cut.id === 'short-loin' ? (
                                                                <>
                                                                    <tspan x={cut.labelX} dy="-8">SHORT</tspan>
                                                                    <tspan x={cut.labelX} dy="16">LOIN</tspan>
                                                                </>
                                                            ) : (
                                                                cut.name.toUpperCase()
                                                            )}
                                                        </text>
                                                        {isShank && (
                                                            <text
                                                                x={865}
                                                                y={506}
                                                                transform="rotate(-10 865 506)"
                                                                className={`${styles.woodcutCutLabel} ${styles.woodcutCutLabelSmall} ${
                                                                    isHighlighted || isCollected ? styles.woodcutCutLabelHighlighted : ''
                                                                }`}
                                                            >
                                                                SHANK
                                                            </text>
                                                        )}
                                                    </g>
                                                );
                                            })}
                                        </g>

                                        {/* Interactive Hotspots on Surrounding 8 Illustrated 3D Steaks */}
                                        <g className={styles.interactiveCutsLayer}>
                                            {[
                                                { id: 'rib', label: 'Ribeye Steak', featured: 'Boneless Ribeye', x: 30, y: 55, w: 340, h: 185 },
                                                { id: 'short-loin', label: 'T-Bone Steak', featured: 'T-Bone', x: 475, y: 50, w: 310, h: 165 },
                                                { id: 'short-loin', label: 'Porterhouse Steak', featured: 'Porterhouse', x: 880, y: 45, w: 280, h: 305 },
                                                { id: 'sirloin', label: 'Sirloin Steak', featured: 'Sirloin Steak', x: 15, y: 355, w: 230, h: 195 },
                                                { id: 'brisket', label: 'Brisket Roast', featured: 'Whole Brisket', x: 125, y: 520, w: 220, h: 145 },
                                                { id: 'chuck', label: 'Chuck Flat', featured: 'Flat Iron Steak', x: 20, y: 665, w: 280, h: 205 },
                                                { id: 'round', label: 'Round Roast', featured: 'Rump Roast', x: 965, y: 340, w: 215, h: 350 },
                                                { id: 'flank', label: 'Flank Steak', featured: 'Marinated Flank Steak', x: 900, y: 695, w: 280, h: 180 },
                                            ].map((spot) => (
                                                <rect
                                                    key={`steak-spot-${spot.id}-${spot.x}`}
                                                    x={spot.x}
                                                    y={spot.y}
                                                    width={spot.w}
                                                    height={spot.h}
                                                    rx="16"
                                                    data-cut-interactive="true"
                                                    className={styles.steakHotspot}
                                                    onClick={() => {
                                                        if (quickOrderCutId === spot.id && featuredSteakProduct === spot.featured) {
                                                            setSelectedCutId(null);
                                                            setQuickOrderCutId(null);
                                                            setFeaturedSteakProduct(null);
                                                        } else {
                                                            setSelectedCutId(spot.id);
                                                            setQuickOrderCutId(spot.id);
                                                            setFeaturedSteakProduct(spot.featured);
                                                        }
                                                    }}
                                                    onMouseEnter={() => setHoveredCutId(spot.id)}
                                                    onMouseLeave={() => setHoveredCutId(null)}
                                                />
                                            ))}
                                        </g>
                                    </>
                                )}

                                {/* Anatomical Leader Lines & Callout Badges */}
                                <g className={styles.calloutsLayer}>
                                    {activeAnimal.cuts.map((cut) => {
                                        if (!cut.callout) return null;
                                        const key = `${selectedAnimalId}:${cut.id}`;
                                        const isCollected = progress.collectedCutKeys.has(key);
                                        const isSelected = cut.id === selectedCutId;
                                        const isHovered = cut.id === hoveredCutId;
                                        const isLoinCallout = cut.id === 'short-loin';
                                        const isBellyCallout = cut.id === 'flank';
                                        const isHighlighted =
                                            isSelected ||
                                            isHovered ||
                                            (isLoinCallout && (hoveredCutId === 'sirloin' || selectedCutId === 'sirloin')) ||
                                            (isBellyCallout && (hoveredCutId === 'plate' || selectedCutId === 'plate'));

                                        const callout = cut.callout;
                                        const rectX = callout.rectX ?? (callout.x - 72);
                                        const rectY = callout.rectY ?? (callout.y - 14);
                                        const rectW = callout.w ?? 144;
                                        const rectH = callout.h ?? 28;
                                        const isWoodcut = Boolean(activeAnimal.woodcutPath);

                                        return (
                                            <g
                                                key={`callout-${cut.id}`}
                                                className={`${styles.calloutGroup} ${
                                                    isHighlighted ? styles.calloutGroupActive : ''
                                                } ${isCollected ? styles.calloutGroupCollected : ''}`}
                                                onClick={() => setSelectedCutId(cut.id)}
                                                onMouseEnter={() => setHoveredCutId(cut.id)}
                                                onMouseLeave={() => setHoveredCutId(null)}
                                                onPointerEnter={() => setHoveredCutId(cut.id)}
                                                onPointerLeave={() => setHoveredCutId(null)}
                                                role="button"
                                                tabIndex={-1}
                                                aria-hidden="true"
                                            >
                                                {/* Backing line for high contrast over woodcut etching */}
                                                {isWoodcut && (
                                                    <line
                                                        x1={callout.targetX}
                                                        y1={callout.targetY}
                                                        x2={callout.x}
                                                        y2={callout.y > 500 ? rectY : rectY + rectH}
                                                        className={styles.calloutLineBg}
                                                    />
                                                )}
                                                <line
                                                    x1={callout.targetX}
                                                    y1={callout.targetY}
                                                    x2={callout.x}
                                                    y2={isWoodcut ? (callout.y > 500 ? rectY : rectY + rectH) : callout.y}
                                                    className={`${styles.calloutLine} ${isHighlighted ? styles.calloutLineHighlighted : ''}`}
                                                />
                                                <circle
                                                    cx={callout.targetX}
                                                    cy={callout.targetY}
                                                    r={isWoodcut ? (isHighlighted ? 9 : 8) : 4.5}
                                                    className={isWoodcut ? styles.calloutHalo : styles.calloutPin}
                                                />
                                                {isWoodcut && (
                                                    <circle
                                                        cx={callout.targetX}
                                                        cy={callout.targetY}
                                                        r={isHighlighted ? 6.5 : 5.5}
                                                        className={`${styles.calloutPin} ${isHighlighted ? styles.calloutPinHighlighted : ''}`}
                                                    />
                                                )}
                                                <rect
                                                    x={rectX}
                                                    y={rectY}
                                                    width={rectW}
                                                    height={rectH}
                                                    rx={6}
                                                    className={`${styles.calloutBadgeBg} ${
                                                        isHighlighted ? styles.calloutBadgeBgHighlighted : ''
                                                    } ${isCollected ? styles.calloutBadgeBgCollected : ''}`}
                                                />
                                                <text
                                                    x={rectX + rectW / 2}
                                                    y={rectY + rectH / 2 + (isWoodcut ? 5 : 4)}
                                                    className={`${styles.calloutText} ${
                                                        isHighlighted ? styles.calloutTextHighlighted : ''
                                                    }`}
                                                    textAnchor="middle"
                                                >
                                                    {callout.label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </g>
                            </svg>

                            {/* On-Chart Quick-Order Popover Card */}
                            {quickOrderCutDef && (
                                <div
                                    ref={popoverRef}
                                    className={`${styles.quickOrderPopover} ${
                                        quickOrderCutDef.labelX > 650 ? styles.quickOrderPopoverLeft : ''
                                    }`}
                                    role="region"
                                    aria-label={`Quick order ${quickOrderCutDef.name} cuts`}
                                >
                                    <div className={styles.popoverHeader}>
                                        <div className={styles.popoverTitleGroup}>
                                            <span className={styles.popoverKicker}>
                                                {activeAnimal.name} · Instant Counter Order
                                            </span>
                                            <h4 className={styles.popoverTitle}>
                                                {featuredSteakProduct || `${quickOrderCutDef.name} Cuts`}
                                            </h4>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.popoverCloseBtn}
                                            onClick={() => {
                                                setSelectedCutId(null);
                                                setQuickOrderCutId(null);
                                                setFeaturedSteakProduct(null);
                                            }}
                                            aria-label="Close quick order menu"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className={styles.popoverProductsList}>
                                        {orderedProductsForPopover.map((prodName) => {
                                            const detail = COUNTER_CUT_DETAILS[prodName] || {
                                                price: '$19.99/lb',
                                                desc: 'Hand-trimmed by Hofherr master butchers.',
                                            };
                                            const inBagQty = cartQtyByName[prodName] || 0;

                                            return (
                                                <div
                                                    key={`popover-prod-${prodName}`}
                                                    className={`${styles.productRowCard} ${
                                                        inBagQty > 0 ? styles.productRowCardActive : ''
                                                    }`}
                                                >
                                                    <div className={styles.productInfoCol}>
                                                        <div className={styles.productTitleLine}>
                                                            <span className={styles.productNameText}>
                                                                {prodName}
                                                            </span>
                                                            <span className={styles.productPriceTag}>
                                                                {detail.price}
                                                            </span>
                                                        </div>
                                                        <span className={styles.productDescText}>
                                                            {detail.desc}
                                                        </span>
                                                    </div>

                                                    <div className={styles.productActionsCol}>
                                                        {inBagQty > 0 ? (
                                                            <div className={styles.qtyStepper}>
                                                                <button
                                                                    type="button"
                                                                    className={styles.qtyStepBtn}
                                                                    onClick={() => stepCutProductQty(prodName, -1)}
                                                                    aria-label={`Remove one ${prodName}`}
                                                                >
                                                                    −
                                                                </button>
                                                                <span className={styles.qtyStepValue}>
                                                                    {inBagQty}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className={styles.qtyStepBtn}
                                                                    onClick={(e) => addCutProductToCart(prodName, e)}
                                                                    aria-label={`Add one more ${prodName}`}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className={styles.quickOrderBtn}
                                                                onClick={(e) => addCutProductToCart(prodName, e)}
                                                            >
                                                                + Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className={styles.popoverFooter}>
                                        <Link
                                            href={`/online-orders?category=${selectedAnimalId}&search=${encodeURIComponent(quickOrderCutDef.products[0] || quickOrderCutDef.name)}`}
                                            className={styles.popoverFullMenuLink}
                                        >
                                            Full Butcher Counter →
                                        </Link>
                                        {cartCount > 0 && (
                                            <button
                                                type="button"
                                                className={styles.sideCheckoutBtn}
                                                onClick={() => openCart()}
                                            >
                                                Checkout ({cartCount}) →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Whole Animal Celebration Stamp */}
                            {activeAnimalProgress.isComplete && (
                                <div className={styles.stampOverlay} aria-hidden="true">
                                    <div className={styles.stampBadge}>
                                        ★ {activeAnimal.stampText} ★
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* ── Right Column: Selected Cut Details & Animal Checklist ── */}
                <aside className={styles.sideColumn} aria-label="Cut detail panel">
                    {/* Selected Cut Drawer Card */}
                    <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                            <h4 className={styles.detailCutName}>{activeCutDef.name}</h4>
                            {isSelectedCutCollected ? (
                                <span className={styles.badgeCollected}>✓ Collected</span>
                            ) : (
                                <span className={styles.badgeUncollected}>Uncollected</span>
                            )}
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Times Ordered</span>
                                <span className={styles.statValue}>
                                    {activeCutStats ? `${activeCutStats.count}×` : '0×'}
                                </span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Last Ordered</span>
                                <span className={styles.statValue}>
                                    {activeCutStats?.lastOrderedDate
                                        ? formatOrderDate(activeCutStats.lastOrderedDate)
                                        : 'Never'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.productsSection}>
                            <h5 className={styles.productsTitle}>Your Picked &amp; Ordered Cuts:</h5>
                            {pickedOrOrderedProducts.length > 0 ? (
                                <ul className={styles.productList}>
                                    {pickedOrOrderedProducts.map((prodName) => {
                                        const detail = COUNTER_CUT_DETAILS[prodName] || {
                                            price: '$19.99/lb',
                                            desc: 'Hand-trimmed by Hofherr master butchers.',
                                        };
                                        const inBagQty = cartQtyByName[prodName] || 0;

                                        return (
                                            <li
                                                key={prodName}
                                                className={`${styles.productRowCard} ${
                                                    inBagQty > 0 ? styles.productRowCardActive : ''
                                                }`}
                                            >
                                                <div className={styles.productInfoCol}>
                                                    <div className={styles.productTitleLine}>
                                                        <span className={styles.productNameText}>{prodName}</span>
                                                        <span className={styles.productPriceTag}>{detail.price}</span>
                                                    </div>
                                                    <span className={styles.productDescText}>{detail.desc}</span>
                                                </div>

                                                <div className={styles.productActionsCol}>
                                                    {inBagQty > 0 ? (
                                                        <div className={styles.qtyStepper}>
                                                            <button
                                                                type="button"
                                                                className={styles.qtyStepBtn}
                                                                onClick={() => stepCutProductQty(prodName, -1)}
                                                                aria-label={`Remove one ${prodName}`}
                                                            >
                                                                −
                                                            </button>
                                                            <span className={styles.qtyStepValue}>{inBagQty}</span>
                                                            <button
                                                                type="button"
                                                                className={styles.qtyStepBtn}
                                                                onClick={(e) => addCutProductToCart(prodName, e)}
                                                                aria-label={`Add one more ${prodName}`}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={styles.quickOrderBtn}
                                                            onClick={(e) => addCutProductToCart(prodName, e)}
                                                        >
                                                            + Order
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className={styles.emptyPickedNote}>
                                    No cuts picked from {activeCutDef.name} yet — click a cut or steak on the chart to pick &amp; order.
                                </p>
                            )}

                            {cartCount > 0 && (
                                <div className={styles.sideCheckoutBar}>
                                    <div className={styles.sideCheckoutMeta}>
                                        <span className={styles.sideCheckoutCount}>
                                            {cartCount} {cartCount === 1 ? 'Cut' : 'Cuts'} in Your Butcher Bag
                                        </span>
                                        <span className={styles.sideCheckoutSub}>
                                            Ready for pickup or counter checkout
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.sideCheckoutBtn}
                                        onClick={() => openCart()}
                                    >
                                        Checkout →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
