'use client';

export interface MobileBurnConfig {
    sweepMs: number;
    closeSpeed: number;
    fuseEndT: number;
    fusePower: number;
    bandWidth: number;
    edgeBlur: number;
    glowAlpha: number;
    noiseScale: number;
    noiseAmp: number;
    fieldW: number;
    fuseToX: number;
    fuseToY: number;
    sparkSize: number;
    textMs: number;
    textFlameBoost: number;
}

export const DEFAULT_MOBILE_BURN_CONFIG: MobileBurnConfig = {
    sweepMs: 600,
    closeSpeed: 1.7,
    fuseEndT: 0.6,
    fusePower: 2.6,
    bandWidth: 0.15,
    edgeBlur: 8,
    glowAlpha: 0.6,
    noiseScale: 6,
    noiseAmp: 0.12,
    fieldW: 80,
    fuseToX: 0.06,
    fuseToY: 0.8,
    sparkSize: 1.0,
    textMs: 450,
    textFlameBoost: 1.5,
};

export const MOBILE_BURN_STORAGE_KEY = 'hofherr_mobile_burn_cfg_v1';

export interface MobileBurnControlState {
    config: MobileBurnConfig;
    /** When non-null (0..1), freezes the burn animation at that exact normalized timeline position. */
    scrubProgress: number | null;
}

let state: MobileBurnControlState = {
    config: { ...DEFAULT_MOBILE_BURN_CONFIG },
    scrubProgress: null,
};

let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((fn) => fn());
}

export function hydrateMobileBurnConfig(): void {
    if (hydrated || typeof window === 'undefined') return;
    hydrated = true;
    try {
        const raw = window.localStorage.getItem(MOBILE_BURN_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<MobileBurnConfig>;
        state = {
            ...state,
            config: { ...DEFAULT_MOBILE_BURN_CONFIG, ...parsed },
        };
        notify();
    } catch {
        // Ignore malformed localStorage
    }
}

export function getMobileBurnState(): MobileBurnControlState {
    return state;
}

export function updateMobileBurnConfig(patch: Partial<MobileBurnConfig>): void {
    const nextConfig: MobileBurnConfig = { ...state.config, ...patch };
    state = { ...state, config: nextConfig };
    try {
        window.localStorage.setItem(MOBILE_BURN_STORAGE_KEY, JSON.stringify(nextConfig));
    } catch {
        // Ignore storage errors
    }
    notify();
}

export function setMobileBurnScrub(progress: number | null): void {
    state = { ...state, scrubProgress: progress };
    notify();
}

export function resetMobileBurnConfig(): void {
    state = { config: { ...DEFAULT_MOBILE_BURN_CONFIG }, scrubProgress: null };
    try {
        window.localStorage.removeItem(MOBILE_BURN_STORAGE_KEY);
    } catch {
        // Ignore storage errors
    }
    notify();
}

export function subscribeMobileBurn(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

