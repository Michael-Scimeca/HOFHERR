'use client';

export type FlyEasingPreset = 'smooth' | 'gravity-drop' | 'spring-snap' | 'linear' | 'ease-in-dip';
export type FlyDropStyle = 'plunge-top' | 'direct-center' | 'hover-sink' | 'slam-dunk';
export type BurnDirection = 'left-to-right' | 'right-to-left';

export interface AddToOrderAnimConfig {
    /* ── 1. Flying Item Image & Visuals ── */
    flyImageSrc: string;
    flyIconSize: number;
    flyShowModalPreview: boolean;
    flyFlamesEnabled: boolean;
    flyFlameIntensity: number;
    flyFlameSize: number;
    flyShadowBlur: number;
    flyShadowOpacity: number;
    flyGlowColorHex: string;
    flyGlowRadius: number;
    flyEmberTrail: boolean;
    flyEmberCount: number;

    /* ── 2. Flight Trajectory & Scale ── */
    flyEnabled: boolean;
    flyDelayMs: number;
    flyMinMs: number;
    flyMaxMs: number;
    flyArcHeight: number;
    flyApexOffset: number;
    flyEasing: FlyEasingPreset;
    flyStartScale: number;
    flyPeakScale: number;
    flyEndScale: number;
    flyStartRotationDeg: number;
    flyMidRotationDeg: number;
    flyEndRotationDeg: number;
    flyStartOpacity: number;
    flyEndOpacity: number;

    /* ── 3. Cart Bag Drop & Catch Physics ── */
    flyDropStyle: FlyDropStyle;
    flyTargetOffsetX: number;
    flyTargetOffsetY: number;
    flyDropPlungePx: number;
    flyDropHoldMs: number;
    cartFlamesBurst: boolean;
    cartAnticipationScaleX: number;
    cartAnticipationScaleY: number;
    cartBounceScale: number;
    cartSquashScaleX: number;
    cartSquashScaleY: number;
    cartTiltDeg: number;
    cartBounceMs: number;
    cartFlashRing: boolean;
    cartBadgePopScale: number;

    /* ── 4. Modal Burn-In / Burn-Out Transition ── */
    burnFlamesEnabled: boolean;
    burnInMs: number;
    burnOutMs: number;
    burnInDirection: BurnDirection;
    burnOutDirection: BurnDirection;
    burnMaskFeatherPct: number;
    overrun: number;
    flameBoost: number;
    flameHeight: number;
    flameRadius: number;
    flameFlickerSpeed: number;
    edgeRaggedness: number;
    borderWidth: number;
    borderColorHex: string;
    overlayFadeMs: number;
    overlayBlurPx: number;
}

export const PARCEL_IMAGE_OPTIONS: { label: string; src: string; badge: string }[] = [
    {
        label: 'Kraft Butcher Parcel',
        src: '/assets/item.png?v=2',
        badge: 'Default',
    },
    {
        label: 'Wax-Sealed Parcel',
        src: '/assets/process/craft-butcher-step-parcel.png',
        badge: 'Craft',
    },
    {
        label: 'Cleaver & Ribeye',
        src: '/assets/process/craft-butcher-step-cleaver.png',
        badge: 'Cut',
    },
    {
        label: 'Flint & Flame Cart',
        src: '/assets/process/flint-flame-step-cart.png',
        badge: 'Flame',
    },
    {
        label: 'Crimson Wax Stamp',
        src: '/assets/identity/hofherr-stamp-circular-crimson.svg',
        badge: 'Seal',
    },
    {
        label: 'Safety Seal Stamp',
        src: '/assets/identity/stickers/sticker-safetyseal.png',
        badge: 'Badge',
    },
];

export const ADD_TO_ORDER_ANIM_STORAGE_KEY = 'hofherr_add_to_order_anim_v3';
export const ADD_TO_ORDER_ANIM_EVENT = 'hofherr_add_to_order_anim_change';

export const DEFAULT_ADD_TO_ORDER_ANIM_CONFIG: AddToOrderAnimConfig = {
    /* 1. Image & Visuals */
    flyImageSrc: '/assets/item.png?v=2',
    flyIconSize: 116,
    flyShowModalPreview: true,
    flyFlamesEnabled: true,
    flyFlameIntensity: 1.4,
    flyFlameSize: 1.15,
    flyShadowBlur: 12,
    flyShadowOpacity: 0.45,
    flyGlowColorHex: '#FF5014',
    flyGlowRadius: 14,
    flyEmberTrail: true,
    flyEmberCount: 10,

    /* 2. Trajectory & Scale */
    flyEnabled: true,
    flyDelayMs: 0,
    flyMinMs: 700,
    flyMaxMs: 1650,
    flyArcHeight: 170,
    flyApexOffset: 0.42,
    flyEasing: 'gravity-drop',
    flyStartScale: 1.15,
    flyPeakScale: 1.7,
    flyEndScale: 0.34,
    flyStartRotationDeg: -6,
    flyMidRotationDeg: 8,
    flyEndRotationDeg: 18,
    flyStartOpacity: 1,
    flyEndOpacity: 0.85,

    /* 3. Cart Bag Drop & Catch */
    flyDropStyle: 'plunge-top',
    flyTargetOffsetX: 0,
    flyTargetOffsetY: -4,
    flyDropPlungePx: 22,
    flyDropHoldMs: 110,
    cartFlamesBurst: true,
    cartAnticipationScaleX: 1.14,
    cartAnticipationScaleY: 0.9,
    cartBounceScale: 1.5,
    cartSquashScaleX: 1.24,
    cartSquashScaleY: 0.82,
    cartTiltDeg: 8,
    cartBounceMs: 440,
    cartFlashRing: true,
    cartBadgePopScale: 1.45,

    /* 4. Modal Burn-In / Burn-Out */
    burnFlamesEnabled: true,
    burnInMs: 700,
    burnOutMs: 820,
    burnInDirection: 'left-to-right',
    burnOutDirection: 'left-to-right',
    burnMaskFeatherPct: 10,
    overrun: 1.22,
    flameBoost: 1.5,
    flameHeight: 0.46,
    flameRadius: 0.056,
    flameFlickerSpeed: 1,
    edgeRaggedness: 0.14,
    borderWidth: 2,
    borderColorHex: '#CC0E1D',
    overlayFadeMs: 320,
    overlayBlurPx: 6,
};

let cachedRaw: string | null = null;
let cachedConfig: AddToOrderAnimConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;

export function getAddToOrderAnimConfig(): AddToOrderAnimConfig {
    if (typeof window === 'undefined') return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
    try {
        const raw = window.localStorage.getItem(ADD_TO_ORDER_ANIM_STORAGE_KEY);
        if (!raw) {
            cachedRaw = null;
            cachedConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
            return cachedConfig;
        }
        if (raw === cachedRaw) return cachedConfig;
        const parsed = JSON.parse(raw) as Partial<AddToOrderAnimConfig>;
        cachedRaw = raw;
        cachedConfig = { ...DEFAULT_ADD_TO_ORDER_ANIM_CONFIG, ...parsed };
        return cachedConfig;
    } catch {
        return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
    }
}

export function saveAddToOrderAnimConfig(next: AddToOrderAnimConfig): void {
    if (typeof window === 'undefined') return;
    try {
        const raw = JSON.stringify(next);
        window.localStorage.setItem(ADD_TO_ORDER_ANIM_STORAGE_KEY, raw);
        cachedRaw = raw;
        cachedConfig = next;
        window.dispatchEvent(new CustomEvent(ADD_TO_ORDER_ANIM_EVENT, { detail: next }));
    } catch {
        // ignore storage quota errors
    }
}

export function resetAddToOrderAnimConfig(): AddToOrderAnimConfig {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(ADD_TO_ORDER_ANIM_STORAGE_KEY);
            cachedRaw = null;
            cachedConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
            window.dispatchEvent(
                new CustomEvent(ADD_TO_ORDER_ANIM_EVENT, { detail: DEFAULT_ADD_TO_ORDER_ANIM_CONFIG })
            );
        } catch {
            // ignore
        }
    }
    return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
}

export function subscribeAddToOrderAnimConfig(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(ADD_TO_ORDER_ANIM_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
        window.removeEventListener(ADD_TO_ORDER_ANIM_EVENT, handler);
        window.removeEventListener('storage', handler);
    };
}

export function hexToRgbTuple(hex: string): [number, number, number] {
    const clean = hex.replace('#', '').trim();
    if (clean.length === 6) {
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
            return [r, g, b];
        }
    }
    return [204, 14, 29];
}

export function getFlyEasingString(preset: FlyEasingPreset): string {
    switch (preset) {
        case 'gravity-drop':
            return 'cubic-bezier(0.32, 0.04, 0.68, 0.98)';
        case 'spring-snap':
            return 'cubic-bezier(0.22, 1.18, 0.36, 1)';
        case 'ease-in-dip':
            return 'cubic-bezier(0.5, -0.15, 0.7, 0.95)';
        case 'linear':
            return 'linear';
        case 'smooth':
        default:
            return 'cubic-bezier(0.4, 0, 0.2, 1)';
    }
}
