'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useCartCount } from '@/context/CartContext';
import { Toggle } from '@/components/Toggle';
import {
    DEFAULT_ADD_TO_ORDER_ANIM_CONFIG,
    OPEN_TEST_MODAL_EVENT,
    PARCEL_IMAGE_OPTIONS,
    SYNC_LIVE_PRODUCT_EVENT,
    TEST_SAMPLE_PRODUCTS,
    TOGGLE_ANIM_STUDIO_EVENT,
    getAddToOrderAnimConfig,
    isPhotoFlyAsset,
    resetAddToOrderAnimConfig,
    resolveProductFlyImage,
    saveAddToOrderAnimConfig,
    subscribeAddToOrderAnimConfig,
    type AddToOrderAnimConfig,
    type BurnDirection,
    type FlyDropStyle,
    type FlyEasingPreset,
} from '@/lib/addToOrderAnimConfig';
import styles from './AddToOrderAnimStudio.module.css';

type StudioTab = 'product' | 'flight' | 'catch' | 'burn';

const GLOW_SWATCHES = ['#FF5014', '#CC0E1D', '#F59B1A', '#FFD27D', '#FFFFFF'];

const EASING_OPTIONS: { id: FlyEasingPreset; label: string }[] = [
    { id: 'gravity-drop', label: 'Gravity Drop' },
    { id: 'spring-snap', label: 'Spring Snap' },
    { id: 'smooth', label: 'Smooth Arc' },
    { id: 'ease-in-dip', label: 'Ease-In Dip' },
    { id: 'linear', label: 'Linear' },
];

const DROP_STYLE_OPTIONS: { id: FlyDropStyle; label: string }[] = [
    { id: 'plunge-top', label: 'Plunge Top' },
    { id: 'hover-sink', label: 'Hover & Sink' },
    { id: 'slam-dunk', label: 'Slam Dunk' },
    { id: 'direct-center', label: 'Direct Center' },
];

export default function AddToOrderAnimStudio() {
    const pathname = usePathname();
    const { triggerFlyAnimation } = useCartCount();
    const cfg = useSyncExternalStore(
        subscribeAddToOrderAnimConfig,
        getAddToOrderAnimConfig,
        () => DEFAULT_ADD_TO_ORDER_ANIM_CONFIG
    );

    const isShopPage = pathname === '/online-orders';
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<StudioTab>('product');
    const [sampleIdx, setSampleIdx] = useState(0);
    const [liveProduct, setLiveProduct] = useState<{
        name: string;
        price?: string;
        desc?: string;
        imageSrc?: string;
        categoryIcon?: string;
    } | null>(null);
    const [useLiveProduct, setUseLiveProduct] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const onToggle = () => {
            setOpen(prev => !prev);
        };
        const onSyncLive = (ev: Event) => {
            const detail = (
                ev as CustomEvent<{
                    name?: string;
                    price?: string;
                    desc?: string;
                    imageSrc?: string;
                    categoryIcon?: string;
                }>
            ).detail;
            if (!detail?.name) return;
            setLiveProduct({
                name: detail.name,
                price: detail.price,
                desc: detail.desc,
                imageSrc: detail.imageSrc,
                categoryIcon: detail.categoryIcon,
            });
            setUseLiveProduct(true);
        };
        window.addEventListener(TOGGLE_ANIM_STUDIO_EVENT, onToggle);
        window.addEventListener(SYNC_LIVE_PRODUCT_EVENT, onSyncLive);
        return () => {
            window.removeEventListener(TOGGLE_ANIM_STUDIO_EVENT, onToggle);
            window.removeEventListener(SYNC_LIVE_PRODUCT_EVENT, onSyncLive);
        };
    }, []);

    const updateCfg = <K extends keyof AddToOrderAnimConfig>(key: K, value: AddToOrderAnimConfig[K]) => {
        saveAddToOrderAnimConfig({
            ...cfg,
            [key]: value,
        });
    };

    const fallbackSample = TEST_SAMPLE_PRODUCTS[sampleIdx] || TEST_SAMPLE_PRODUCTS[0];
    const activeSample =
        useLiveProduct && liveProduct
            ? {
                  name: liveProduct.name,
                  price: liveProduct.price || 'Live Item',
                  desc: liveProduct.desc || '',
                  categoryIcon: liveProduct.categoryIcon || '',
                  imageSrc: liveProduct.imageSrc,
              }
            : fallbackSample;
    const resolvedPreviewSrc = resolveProductFlyImage(
        {
            itemName: activeSample.name,
            imageSrc: activeSample.imageSrc,
            categoryIcon: activeSample.categoryIcon,
        },
        cfg
    );

    const handleTestFlyCenter = () => {
        const cx = typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.5) : 500;
        const cy = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.58) : 460;
        triggerFlyAnimation({
            x: cx,
            y: cy,
            itemName: activeSample.name,
            imageSrc: activeSample.imageSrc,
            categoryIcon: activeSample.categoryIcon,
            isStudioTest: true,
        });
    };

    const handleTestFlyFromButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        triggerFlyAnimation({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            itemName: activeSample.name,
            imageSrc: activeSample.imageSrc,
            categoryIcon: activeSample.categoryIcon,
            isStudioTest: true,
        });
    };

    const handleTestModal = () => {
        window.dispatchEvent(
            new CustomEvent(OPEN_TEST_MODAL_EVENT, {
                detail: activeSample,
            })
        );
    };

    const handleCopyJson = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            // ignore clipboard errors
        }
    };

    if (!open) {
        return null;
    }

    const isPreviewPhoto = isPhotoFlyAsset(resolvedPreviewSrc);

    const previewVars = {
        '--studio-glow': cfg.flyGlowColorHex || '#FF5014',
        '--studio-icon-sz': `${Math.min(60, Math.max(28, Math.round(cfg.flyIconSize * 0.48)))}px`,
    } as React.CSSProperties;

    return (
        <aside className={styles.panel} aria-label="Add to Cart Animation Studio" data-lenis-prevent>
            <div className={styles.header}>
                <div className={styles.headerTitleWrap}>
                    <span>🛒</span>
                    <h2 className={styles.headerTitle}>Add-to-Cart Anim Studio</h2>
                </div>
                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => resetAddToOrderAnimConfig()}
                        title="Reset all animation settings to defaults"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setOpen(false)}
                        title="Close studio"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* ── Sticky Live Preview & Test Bar ── */}
            <div className={styles.testStage} style={previewVars}>
                <div className={styles.stageTopRow}>
                    <div className={styles.previewBox} title="Live Flying Item Preview">
                        {cfg.flyFlamesEnabled && <div className={styles.previewFlameAura} />}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={resolvedPreviewSrc}
                            alt=""
                            className={`${styles.previewImg} ${isPreviewPhoto ? styles.previewImgPhoto : ''}`}
                        />
                    </div>
                    <div className={styles.stageControls}>
                        <span className={styles.stageLabel}>Preview &amp; Live Sync Product</span>
                        <select
                            className={styles.sampleSelect}
                            value={useLiveProduct && liveProduct ? 'live' : String(sampleIdx)}
                            onChange={e => {
                                if (e.target.value === 'live') {
                                    setUseLiveProduct(true);
                                } else {
                                    setUseLiveProduct(false);
                                    setSampleIdx(Number(e.target.value));
                                }
                            }}
                            aria-label="Select sample product to test fly animation"
                        >
                            {liveProduct && (
                                <option value="live">
                                    Live Clicked: {liveProduct.name}
                                    {liveProduct.price ? ` (${liveProduct.price})` : ''}
                                </option>
                            )}
                            {TEST_SAMPLE_PRODUCTS.map((item, idx) => (
                                <option key={item.name} value={String(idx)}>
                                    {item.name} ({item.price})
                                </option>
                            ))}
                        </select>
                        <span className={styles.modeBadge}>
                            {cfg.flyImageMode === 'auto-product'
                                ? `Auto Medallion → ${resolvedPreviewSrc}`
                                : cfg.flyImageMode === 'auto-photo'
                                  ? `Auto Cut Photo → ${resolvedPreviewSrc}`
                                  : `Fixed Icon → ${cfg.flyImageSrc}`}
                        </span>
                    </div>
                </div>

                <div className={styles.testBtnRow}>
                    <button
                        type="button"
                        className={styles.testFlyPrimary}
                        onClick={handleTestFlyCenter}
                        title="Launch flying item from modal center to navbar cart icon"
                    >
                        🚀 Test Fly (Modal)
                    </button>
                    <button
                        type="button"
                        className={styles.testFlySecondary}
                        onClick={handleTestFlyFromButton}
                        title="Launch flying item from this button to navbar cart icon"
                    >
                        🎯 Fly From Here
                    </button>
                    {isShopPage && (
                        <button
                            type="button"
                            className={styles.testFlySecondary}
                            onClick={handleTestModal}
                            title="Open real Add-to-Order modal for selected test product"
                        >
                            🔥 Modal
                        </button>
                    )}
                </div>
            </div>

            {/* ── Section Tabs ── */}
            <div className={styles.tabs} role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'product'}
                    className={`${styles.tabBtn} ${tab === 'product' ? styles.tabBtnActive : ''}`}
                    onClick={() => setTab('product')}
                >
                    1· Product
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'flight'}
                    className={`${styles.tabBtn} ${tab === 'flight' ? styles.tabBtnActive : ''}`}
                    onClick={() => setTab('flight')}
                >
                    2· Flight
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'catch'}
                    className={`${styles.tabBtn} ${tab === 'catch' ? styles.tabBtnActive : ''}`}
                    onClick={() => setTab('catch')}
                >
                    3· Catch
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'burn'}
                    className={`${styles.tabBtn} ${tab === 'burn' ? styles.tabBtnActive : ''}`}
                    onClick={() => setTab('burn')}
                >
                    4· Burn
                </button>
            </div>

            {/* ── Scrollable Controls Body ── */}
            <div className={styles.body}>
                {tab === 'product' && (
                    <>
                        <div className={styles.group}>
                            <span className={styles.groupTitle}>What Flies Into Cart</span>
                            <div className={styles.segmentedThree}>
                                <button
                                    type="button"
                                    className={`${styles.segBtn} ${cfg.flyImageMode === 'auto-product' ? styles.segBtnActive : ''}`}
                                    onClick={() => updateCfg('flyImageMode', 'auto-product')}
                                >
                                    🥩 Auto Icon
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.segBtn} ${cfg.flyImageMode === 'auto-photo' ? styles.segBtnActive : ''}`}
                                    onClick={() => updateCfg('flyImageMode', 'auto-photo')}
                                >
                                    📸 Cut Photo
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.segBtn} ${cfg.flyImageMode === 'custom-icon' ? styles.segBtnActive : ''}`}
                                    onClick={() => updateCfg('flyImageMode', 'custom-icon')}
                                >
                                    📦 Fixed Icon
                                </button>
                            </div>
                        </div>

                        <div className={styles.group}>
                            <span className={styles.groupTitle}>
                                {cfg.flyImageMode === 'custom-icon'
                                    ? 'Choose Flying Artwork'
                                    : 'Or Click Any Icon Below to Pin Fixed'}
                            </span>
                            <div className={styles.thumbGrid}>
                                {PARCEL_IMAGE_OPTIONS.map(opt => {
                                    const isSelected =
                                        cfg.flyImageMode === 'custom-icon' && cfg.flyImageSrc === opt.src;
                                    return (
                                        <button
                                            key={opt.src}
                                            type="button"
                                            className={`${styles.thumbCard} ${isSelected ? styles.thumbCardActive : ''}`}
                                            onClick={() => {
                                                saveAddToOrderAnimConfig({
                                                    ...cfg,
                                                    flyImageMode: 'custom-icon',
                                                    flyImageSrc: opt.src,
                                                });
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={opt.src} alt={opt.label} className={styles.thumbImg} />
                                            <span className={styles.thumbLabel}>{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {cfg.flyImageMode === 'custom-icon' && (
                            <div className={styles.group}>
                                <span className={styles.groupTitle}>Custom Asset Path</span>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={cfg.flyImageSrc}
                                    onChange={e => updateCfg('flyImageSrc', e.target.value)}
                                    placeholder="/assets/item.png?v=2"
                                    aria-label="Custom flying image path"
                                />
                            </div>
                        )}

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Flying Icon Size</span>
                                <span className={styles.sliderVal}>{cfg.flyIconSize}px</span>
                            </div>
                            <input
                                type="range"
                                min={36}
                                max={180}
                                step={2}
                                value={cfg.flyIconSize}
                                onChange={e => updateCfg('flyIconSize', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>1-Click Row Add (Skip Modal)</span>
                            <Toggle
                                size="sm"
                                checked={cfg.quickAddDirect}
                                onChange={val => updateCfg('quickAddDirect', val)}
                                label="1-Click Row Add (Skip Modal)"
                                hideLabel
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Show Product Preview in Modal</span>
                            <Toggle
                                size="sm"
                                checked={cfg.flyShowModalPreview}
                                onChange={val => updateCfg('flyShowModalPreview', val)}
                                label="Show Product Preview in Modal"
                                hideLabel
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Flames Behind Flying Item</span>
                            <Toggle
                                size="sm"
                                checked={cfg.flyFlamesEnabled}
                                onChange={val => updateCfg('flyFlamesEnabled', val)}
                                label="Flames Behind Flying Item"
                                hideLabel
                            />
                        </div>

                        {cfg.flyFlamesEnabled && (
                            <>
                                <div className={styles.sliderRow}>
                                    <div className={styles.sliderTop}>
                                        <span>Flame Size</span>
                                        <span className={styles.sliderVal}>{cfg.flyFlameSize.toFixed(2)}×</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0.6}
                                        max={2.2}
                                        step={0.05}
                                        value={cfg.flyFlameSize}
                                        onChange={e => updateCfg('flyFlameSize', Number(e.target.value))}
                                        className={styles.rangeInput}
                                    />
                                </div>

                                <div className={styles.sliderRow}>
                                    <div className={styles.sliderTop}>
                                        <span>Flame Intensity</span>
                                        <span className={styles.sliderVal}>{cfg.flyFlameIntensity.toFixed(2)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0.3}
                                        max={2.2}
                                        step={0.05}
                                        value={cfg.flyFlameIntensity}
                                        onChange={e => updateCfg('flyFlameIntensity', Number(e.target.value))}
                                        className={styles.rangeInput}
                                    />
                                </div>
                            </>
                        )}

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Ember Spark Trail</span>
                            <Toggle
                                size="sm"
                                checked={cfg.flyEmberTrail}
                                onChange={val => updateCfg('flyEmberTrail', val)}
                                label="Ember Spark Trail"
                                hideLabel
                            />
                        </div>

                        {cfg.flyEmberTrail && (
                            <div className={styles.sliderRow}>
                                <div className={styles.sliderTop}>
                                    <span>Ember Spark Count</span>
                                    <span className={styles.sliderVal}>{cfg.flyEmberCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={24}
                                    step={1}
                                    value={cfg.flyEmberCount}
                                    onChange={e => updateCfg('flyEmberCount', Number(e.target.value))}
                                    className={styles.rangeInput}
                                />
                            </div>
                        )}

                        <div className={styles.group}>
                            <span className={styles.groupTitle}>Glow Color &amp; Radius ({cfg.flyGlowRadius}px)</span>
                            <div className={styles.swatchRow}>
                                {GLOW_SWATCHES.map(hex => (
                                    <button
                                        key={hex}
                                        type="button"
                                        style={{ '--swatch-bg': hex } as React.CSSProperties}
                                        className={`${styles.swatchBtn} ${cfg.flyGlowColorHex === hex ? styles.swatchBtnActive : ''}`}
                                        onClick={() => updateCfg('flyGlowColorHex', hex)}
                                        aria-label={`Set glow color ${hex}`}
                                    />
                                ))}
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={36}
                                step={1}
                                value={cfg.flyGlowRadius}
                                onChange={e => updateCfg('flyGlowRadius', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>
                    </>
                )}

                {tab === 'flight' && (
                    <>
                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Enable Fly-to-Cart Animation</span>
                            <Toggle
                                size="sm"
                                checked={cfg.flyEnabled}
                                onChange={val => updateCfg('flyEnabled', val)}
                                label="Enable Fly-to-Cart Animation"
                                hideLabel
                            />
                        </div>

                        <div className={styles.group}>
                            <span className={styles.groupTitle}>Flight Easing Curve</span>
                            <div className={styles.presetPills}>
                                {EASING_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        className={`${styles.presetPill} ${cfg.flyEasing === opt.id ? styles.presetPillActive : ''}`}
                                        onClick={() => updateCfg('flyEasing', opt.id)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Arc Lift Height</span>
                                <span className={styles.sliderVal}>{cfg.flyArcHeight}px</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={340}
                                step={5}
                                value={cfg.flyArcHeight}
                                onChange={e => updateCfg('flyArcHeight', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Arc Peak Position</span>
                                <span className={styles.sliderVal}>{Math.round(cfg.flyApexOffset * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min={0.15}
                                max={0.85}
                                step={0.02}
                                value={cfg.flyApexOffset}
                                onChange={e => updateCfg('flyApexOffset', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Min Flight Duration</span>
                                <span className={styles.sliderVal}>{cfg.flyMinMs}ms</span>
                            </div>
                            <input
                                type="range"
                                min={250}
                                max={2000}
                                step={25}
                                value={cfg.flyMinMs}
                                onChange={e => updateCfg('flyMinMs', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Max Flight Duration</span>
                                <span className={styles.sliderVal}>{cfg.flyMaxMs}ms</span>
                            </div>
                            <input
                                type="range"
                                min={400}
                                max={2600}
                                step={25}
                                value={cfg.flyMaxMs}
                                onChange={e => updateCfg('flyMaxMs', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Start Scale</span>
                                <span className={styles.sliderVal}>{cfg.flyStartScale.toFixed(2)}×</span>
                            </div>
                            <input
                                type="range"
                                min={0.4}
                                max={2.2}
                                step={0.05}
                                value={cfg.flyStartScale}
                                onChange={e => updateCfg('flyStartScale', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Mid-Flight Peak Scale</span>
                                <span className={styles.sliderVal}>{cfg.flyPeakScale.toFixed(2)}×</span>
                            </div>
                            <input
                                type="range"
                                min={0.5}
                                max={2.6}
                                step={0.05}
                                value={cfg.flyPeakScale}
                                onChange={e => updateCfg('flyPeakScale', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Landing Scale (Into Bag)</span>
                                <span className={styles.sliderVal}>{cfg.flyEndScale.toFixed(2)}×</span>
                            </div>
                            <input
                                type="range"
                                min={0.1}
                                max={1.2}
                                step={0.02}
                                value={cfg.flyEndScale}
                                onChange={e => updateCfg('flyEndScale', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Landing Rotation</span>
                                <span className={styles.sliderVal}>{cfg.flyEndRotationDeg}°</span>
                            </div>
                            <input
                                type="range"
                                min={-90}
                                max={90}
                                step={2}
                                value={cfg.flyEndRotationDeg}
                                onChange={e => updateCfg('flyEndRotationDeg', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>
                    </>
                )}

                {tab === 'catch' && (
                    <>
                        <div className={styles.group}>
                            <span className={styles.groupTitle}>Bag Entry Style</span>
                            <div className={styles.presetPills}>
                                {DROP_STYLE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        className={`${styles.presetPill} ${cfg.flyDropStyle === opt.id ? styles.presetPillActive : ''}`}
                                        onClick={() => updateCfg('flyDropStyle', opt.id)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Target Offset X</span>
                                <span className={styles.sliderVal}>{cfg.flyTargetOffsetX}px</span>
                            </div>
                            <input
                                type="range"
                                min={-40}
                                max={40}
                                step={1}
                                value={cfg.flyTargetOffsetX}
                                onChange={e => updateCfg('flyTargetOffsetX', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Target Offset Y</span>
                                <span className={styles.sliderVal}>{cfg.flyTargetOffsetY}px</span>
                            </div>
                            <input
                                type="range"
                                min={-40}
                                max={40}
                                step={1}
                                value={cfg.flyTargetOffsetY}
                                onChange={e => updateCfg('flyTargetOffsetY', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Bag Plunge Depth</span>
                                <span className={styles.sliderVal}>{cfg.flyDropPlungePx}px</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={60}
                                step={2}
                                value={cfg.flyDropPlungePx}
                                onChange={e => updateCfg('flyDropPlungePx', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Flame Burst on Catch</span>
                            <Toggle
                                size="sm"
                                checked={cfg.cartFlamesBurst}
                                onChange={val => updateCfg('cartFlamesBurst', val)}
                                label="Flame Burst on Catch"
                                hideLabel
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Impact Flash Ring</span>
                            <Toggle
                                size="sm"
                                checked={cfg.cartFlashRing}
                                onChange={val => updateCfg('cartFlashRing', val)}
                                label="Impact Flash Ring"
                                hideLabel
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Cart Bag Bounce Scale</span>
                                <span className={styles.sliderVal}>{cfg.cartBounceScale.toFixed(2)}×</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={2}
                                step={0.05}
                                value={cfg.cartBounceScale}
                                onChange={e => updateCfg('cartBounceScale', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Badge Pop Scale</span>
                                <span className={styles.sliderVal}>{cfg.cartBadgePopScale.toFixed(2)}×</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={2.2}
                                step={0.05}
                                value={cfg.cartBadgePopScale}
                                onChange={e => updateCfg('cartBadgePopScale', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>
                    </>
                )}

                {tab === 'burn' && (
                    <>
                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Modal Burn Flames</span>
                            <Toggle
                                size="sm"
                                checked={cfg.burnFlamesEnabled}
                                onChange={val => updateCfg('burnFlamesEnabled', val)}
                                label="Modal Burn Flames"
                                hideLabel
                            />
                        </div>

                        <div className={styles.toggleRow}>
                            <span className={styles.toggleRowLabel}>Burn Modal on &ldquo;Add to Order&rdquo;</span>
                            <Toggle
                                size="sm"
                                checked={cfg.burnOutOnConfirm}
                                onChange={val => updateCfg('burnOutOnConfirm', val)}
                                label="Burn Modal on Add to Order"
                                hideLabel
                            />
                        </div>

                        <div className={styles.group}>
                            <span className={styles.groupTitle}>Burn-In Direction</span>
                            <div className={styles.segmented}>
                                {(['left-to-right', 'right-to-left'] as BurnDirection[]).map(dir => (
                                    <button
                                        key={dir}
                                        type="button"
                                        className={`${styles.segBtn} ${cfg.burnInDirection === dir ? styles.segBtnActive : ''}`}
                                        onClick={() => updateCfg('burnInDirection', dir)}
                                    >
                                        {dir === 'left-to-right' ? '→ Left to Right' : '← Right to Left'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Burn-In Speed</span>
                                <span className={styles.sliderVal}>{cfg.burnInMs}ms</span>
                            </div>
                            <input
                                type="range"
                                min={250}
                                max={1600}
                                step={25}
                                value={cfg.burnInMs}
                                onChange={e => updateCfg('burnInMs', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Burn-Out Speed</span>
                                <span className={styles.sliderVal}>{cfg.burnOutMs}ms</span>
                            </div>
                            <input
                                type="range"
                                min={250}
                                max={1600}
                                step={25}
                                value={cfg.burnOutMs}
                                onChange={e => updateCfg('burnOutMs', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Flame Boost</span>
                                <span className={styles.sliderVal}>{cfg.flameBoost.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min={0.5}
                                max={2.5}
                                step={0.05}
                                value={cfg.flameBoost}
                                onChange={e => updateCfg('flameBoost', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.sliderRow}>
                            <div className={styles.sliderTop}>
                                <span>Backdrop Blur</span>
                                <span className={styles.sliderVal}>{cfg.overlayBlurPx}px</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={18}
                                step={1}
                                value={cfg.overlayBlurPx}
                                onChange={e => updateCfg('overlayBlurPx', Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className={styles.footerNote}>
                <span>Saved live to browser</span>
                <button type="button" className={styles.iconBtn} onClick={handleCopyJson}>
                    {copied ? 'Copied ✓' : 'Copy JSON'}
                </button>
            </div>
        </aside>
    );
}
