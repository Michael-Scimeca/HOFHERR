'use client';

export type ContentBurnStyleId =
    | 'ember-smoke'
    | 'heat-melt'
    | 'ash-dissolve'
    | 'white-hot-flash'
    | 'smokehouse-veil';

export const CONTENT_BURN_STYLES: ReadonlyArray<{
    id: ContentBurnStyleId;
    label: string;
}> = [
        { id: 'ember-smoke', label: 'Ember Smoke' },
        { id: 'heat-melt', label: 'Heat Melt' },
        { id: 'ash-dissolve', label: 'Ash Scatter' },
        { id: 'white-hot-flash', label: 'White-Hot Flash' },
        { id: 'smokehouse-veil', label: 'Hickory Vapor' },
    ];

export type TransformPivotId = 'center' | 'top' | 'bottom' | 'left' | 'right';

export const TRANSFORM_PIVOTS: ReadonlyArray<{
    id: TransformPivotId;
    label: string;
    origin: string;
}> = [
    { id: 'center', label: 'Center', origin: '50% 45%' },
    { id: 'top', label: 'Top', origin: '50% 0%' },
    { id: 'bottom', label: 'Bottom', origin: '50% 100%' },
    { id: 'left', label: 'Left', origin: '0% 50%' },
    { id: 'right', label: 'Right', origin: '100% 50%' },
];

export type MeltDirectionId = 'down' | 'up' | 'none';

export const MELT_DIRECTIONS: ReadonlyArray<{
    id: MeltDirectionId;
    label: string;
}> = [
    { id: 'down', label: 'Melt Down ↓' },
    { id: 'up', label: 'Melt Up ↑' },
    { id: 'none', label: 'In Place' },
];

export interface PageTransitionRuntimeConfig {
    // Timing
    exitMs: number;
    enterMs: number;
    // Feature toggles
    enableFire: boolean;
    enableBurnMask: boolean;
    enableSmokeDissolve: boolean;
    enableMelt: boolean;
    enableCardGlide: boolean;
    sweepReverse: boolean;
    mirrorEnter: boolean;
    // WebGL Hickory Draft (smoke-32-chimney-updraft) shader uniforms
    heatBoost: number;
    bandScale: number;
    smokeScale: number;
    turbScale: number;
    sparkScale: number;
    flowSpeed: number;
    // Diagonal wipe mask controls
    maskAngleDeg: number;
    maskFeather: number;
    maskOffset: number;     // -40..+40 (%) shift mask earlier or later
    // Opacity / disappear curve controls
    fadeStartPct: number;   // 0..90 (%) when content begins fading out
    fadeEndPct: number;     // 10..100 (%) when content finishes disappearing
    fadeCurve: number;      // 0.4..3.5 (lower = disappears faster early, higher = holds then drops)
    // Content burn / up-in-smoke dissolve controls
    contentBurnStyle: ContentBurnStyleId;
    burnErode: number;      // 0..100 (%) organic jagged burn-hole erosion eating content away
    smokeWarp: number;
    smokeFreq: number;
    scorchAmount: number;
    emberFlash: number;
    smokeBlurPx: number;
    // Melt controls (stackable with burn & motion)
    meltDirection: MeltDirectionId;
    meltAmount: number;
    meltBlur: number;
    meltContrast: number;
    meltStretchY: number;
    meltDropPx: number;
    // Full directional page motion (Exit & Enter)
    transformPivot: TransformPivotId;
    exitSlideX: number;     // -30..+30 (%)
    exitSlideY: number;     // -120..+120 (px)
    exitTiltDeg: number;    // -12..+12 (deg)
    exitScalePct: number;   // -25..+25 (%)
    exitFade: number;       // 0..100 (%)
    enterSlideX: number;    // -30..+30 (%)
    enterSlideY: number;    // -120..+120 (px)
    enterTiltDeg: number;   // -12..+12 (deg)
    enterScalePct: number;  // -25..+25 (%)
    enterFade: number;      // 0..100 (%)
    // Live scrub (null = normal animated mode, 0..100 = frozen progress across exit 0..50 & enter 50..100)
    scrubPct: number | null;
}

export const DEFAULT_PAGE_TRANSITION_CONFIG: PageTransitionRuntimeConfig = {
    exitMs: 350,
    enterMs: 300,
    enableFire: true,
    enableBurnMask: true,
    enableSmokeDissolve: true,
    enableMelt: false,
    enableCardGlide: true,
    sweepReverse: false,
    mirrorEnter: true,
    heatBoost: 0.36,
    bandScale: 0.58,
    smokeScale: 1.15,
    turbScale: 1.30,
    sparkScale: 0.0,
    flowSpeed: 0.30,
    maskAngleDeg: 35,
    maskFeather: 10,
    maskOffset: 0,
    fadeStartPct: 40,
    fadeEndPct: 58,
    fadeCurve: 3.1,
    contentBurnStyle: 'ember-smoke',
    burnErode: 85,
    smokeWarp: 36,
    smokeFreq: 3.5,
    scorchAmount: 95,
    emberFlash: 60,
    smokeBlurPx: 5.5,
    meltDirection: 'down',
    meltAmount: 80,
    meltBlur: 1.2,
    meltContrast: 4.5,
    meltStretchY: 8,
    meltDropPx: 28,
    transformPivot: 'center',
    exitSlideX: 0,
    exitSlideY: -40,
    exitTiltDeg: 0.0,
    exitScalePct: 0,
    exitFade: 50,
    enterSlideX: 0,
    enterSlideY: 40,
    enterTiltDeg: 0.0,
    enterScalePct: 0,
    enterFade: 50,
    scrubPct: null,
};

const STORAGE_KEY = 'hofherr_hickory_draft_cfg_v3';
const CHANGE_EVENT = 'hofherr-pt-style-change';
const STORE_VERSION = 6;

type GlobalPtStore = {
    version?: number;
    config: PageTransitionRuntimeConfig;
    hydrated: boolean;
};

function getGlobalStore(): GlobalPtStore | null {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as { __hofherrPtStyleStore?: GlobalPtStore };
    if (!w.__hofherrPtStyleStore || w.__hofherrPtStyleStore.version !== STORE_VERSION) {
        w.__hofherrPtStyleStore = {
            version: STORE_VERSION,
            config: { ...DEFAULT_PAGE_TRANSITION_CONFIG },
            hydrated: false,
        };
    }
    return w.__hofherrPtStyleStore;
}

function notify() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    }
}

export function hydratePageTransitionConfig(): void {
    const store = getGlobalStore();
    if (!store || store.hydrated) return;
    store.hydrated = true;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<PageTransitionRuntimeConfig>;
        const validBurn = CONTENT_BURN_STYLES.some((s) => s.id === parsed.contentBurnStyle)
            ? parsed.contentBurnStyle!
            : DEFAULT_PAGE_TRANSITION_CONFIG.contentBurnStyle;
        const validPivot = TRANSFORM_PIVOTS.some((p) => p.id === parsed.transformPivot)
            ? parsed.transformPivot!
            : DEFAULT_PAGE_TRANSITION_CONFIG.transformPivot;
        const validMeltDir = MELT_DIRECTIONS.some((m) => m.id === parsed.meltDirection)
            ? parsed.meltDirection!
            : DEFAULT_PAGE_TRANSITION_CONFIG.meltDirection;
        store.config = {
            ...DEFAULT_PAGE_TRANSITION_CONFIG,
            ...parsed,
            contentBurnStyle: validBurn,
            transformPivot: validPivot,
            meltDirection: validMeltDir,
            scrubPct: null,
        };
        notify();
    } catch {
        // Ignore malformed localStorage
    }
}

export function getPageTransitionConfig(): PageTransitionRuntimeConfig {
    const store = getGlobalStore();
    return store ? store.config : DEFAULT_PAGE_TRANSITION_CONFIG;
}

export function updatePageTransitionConfig(patch: Partial<PageTransitionRuntimeConfig>): void {
    const store = getGlobalStore();
    if (!store) return;
    store.config = { ...store.config, ...patch };
    try {
        const { scrubPct: _omit, ...persistable } = store.config;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
        // Ignore storage errors
    }
    notify();
}

export function resetPageTransitionConfig(): void {
    const store = getGlobalStore();
    if (!store) return;
    store.config = { ...DEFAULT_PAGE_TRANSITION_CONFIG };
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore
    }
    notify();
}

export function subscribePageTransitionConfig(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => { };
    window.addEventListener(CHANGE_EVENT, listener);
    return () => window.removeEventListener(CHANGE_EVENT, listener);
}
