export type FlameSlot = {
    enabled: boolean;
    presetId: string;
    label: string;
    posX: number;
    posY: number;
    scale: number;
    magnitude: number;
    lacunarity: number;
    gain: number;
    hue: number;
    hueBase: number;
    intensity: number;
    width: number;
    speed: number;
    idle: number;
    flareRise: number;
    flareHold: number;
    flareDecay: number;
    flareEndHeight: number;
    flarePeakHeight: number;
    flareBelly: number;
    flareSpeedBoost: number;
    flareDelay: number;
    emberRate: number;
    emberLift: number;
    emberSize: number;
};

export type FlameSettings = FlameSlot & {
    showAll5: boolean;
    selectedIndex: number;
    autoLoopBurst?: boolean;
    flames: FlameSlot[];
};

export const FLAME_STORAGE_KEY = 'hofherr_flame_settings_v15';

export const FIVE_FLAME_DEFAULTS: FlameSlot[] = [
    {
        enabled: true,
        presetId: 'smokehouse_torch',
        label: '01 Smokehouse Torch',
        posX: 0,
        posY: -1.60,
        scale: 0.72,
        magnitude: 2.8,
        lacunarity: 2.7,
        gain: 0.50,
        hue: 28,
        hueBase: 4,
        intensity: 9.8,
        width: 0.88,
        speed: 1.4,
        idle: 0.22,
        flareRise: 0.12,
        flareHold: 0.08,
        flareDecay: 0.95,
        flareEndHeight: 0,
        flarePeakHeight: 0.74,
        flareBelly: 0.18,
        flareSpeedBoost: 1.8,
        flareDelay: 0,
        emberRate: 1.4,
        emberLift: 1.2,
        emberSize: 0.8,
    },
    {
        enabled: true,
        presetId: 'grease_flash',
        label: '02 Grease Flash',
        posX: 0,
        posY: -1.54,
        scale: 0.56,
        magnitude: 4.0,
        lacunarity: 2.7,
        gain: 0.56,
        hue: 21,
        hueBase: 14,
        intensity: 12.5,
        width: 0.78,
        speed: 1.5,
        idle: 0.46,
        flareRise: 0.08,
        flareHold: 0.02,
        flareDecay: 0.62,
        flareEndHeight: 0,
        flarePeakHeight: 0.52,
        flareBelly: 0.18,
        flareSpeedBoost: 3.2,
        flareDelay: 0,
        emberRate: 2.2,
        emberLift: 1.3,
        emberSize: 0.9,
    },
    {
        enabled: true,
        presetId: 'pit_roar',
        label: '03 Pit Roar',
        posX: 0,
        posY: -1.66,
        scale: 0.60,
        magnitude: 3.2,
        lacunarity: 3.5,
        gain: 0.50,
        hue: 36,
        hueBase: 0,
        intensity: 9.5,
        width: 0.95,
        speed: 1.0,
        idle: 0.44,
        flareRise: 0.16,
        flareHold: 0.08,
        flareDecay: 1.15,
        flareEndHeight: 0,
        flarePeakHeight: 0.50,
        flareBelly: 0.25,
        flareSpeedBoost: 2.2,
        flareDelay: 0,
        emberRate: 2.0,
        emberLift: 1.0,
        emberSize: 1.05,
    },
    {
        enabled: true,
        presetId: 'torch_jet',
        label: '04 Torch Jet',
        posX: 0,
        posY: -1.66,
        scale: 0.56,
        magnitude: 1.6,
        lacunarity: 2.9,
        gain: 0.58,
        hue: 48,
        hueBase: 18,
        intensity: 13.0,
        width: 0.55,
        speed: 2.2,
        idle: 0.50,
        flareRise: 0.06,
        flareHold: 0.06,
        flareDecay: 0.52,
        flareEndHeight: 0,
        flarePeakHeight: 0.56,
        flareBelly: 0.12,
        flareSpeedBoost: 3.5,
        flareDelay: 0,
        emberRate: 1.4,
        emberLift: 1.4,
        emberSize: 0.85,
    },
    {
        enabled: true,
        presetId: 'hearth_swell',
        label: '05 Hearth Swell',
        posX: 0,
        posY: -1.66,
        scale: 0.56,
        magnitude: 2.1,
        lacunarity: 2.3,
        gain: 0.46,
        hue: 26,
        hueBase: 0,
        intensity: 8.5,
        width: 1.0,
        speed: 0.85,
        idle: 0.42,
        flareRise: 0.22,
        flareHold: 0.12,
        flareDecay: 1.35,
        flareEndHeight: 0.14,
        flarePeakHeight: 0.48,
        flareBelly: 0.22,
        flareSpeedBoost: 1.8,
        flareDelay: 0,
        emberRate: 1.5,
        emberLift: 0.85,
        emberSize: 1.1,
    },
];

export const DEFAULT_FLAME_SETTINGS: FlameSettings = {
    ...FIVE_FLAME_DEFAULTS[0],
    showAll5: false,
    selectedIndex: 0,
    flames: FIVE_FLAME_DEFAULTS.map(f => ({ ...f })),
};

export const FLARE_PRESETS = [
    { id: 'custom', label: '⛽ Gas Burst', desc: '80ms flare up · 100ms peak hold · 950ms die down to 22%', flareRise: 0.08, flareHold: 0.10, flareDecay: 0.95, flareEndHeight: 0.22, flarePeakHeight: 0.80, flareBelly: 0.05, flareSpeedBoost: 1.0 },
    { id: 'snap', label: '💥 Big Whoosh', desc: '180ms big fuel surge · 60ms peak · 1150ms die down', flareRise: 0.18, flareHold: 0.06, flareDecay: 1.15, flareEndHeight: 0, flarePeakHeight: 1.42, flareBelly: 0.60, flareSpeedBoost: 2.8 },
    { id: 'flash', label: '⚡ Flash Igniter', desc: '80ms instant flash · 20ms peak · 500ms fast die down', flareRise: 0.08, flareHold: 0.02, flareDecay: 0.50, flareEndHeight: 0, flarePeakHeight: 1.38, flareBelly: 0.30, flareSpeedBoost: 3.4 },
    { id: 'whoosh', label: '🔥 Double Surge', desc: '160ms surge · 120ms hold · 1350ms slow burn down', flareRise: 0.16, flareHold: 0.12, flareDecay: 1.35, flareEndHeight: 0, flarePeakHeight: 1.25, flareBelly: 0.50, flareSpeedBoost: 2.2 },
    { id: 'simmer', label: '🪵 Gas → Coals', desc: '140ms gas burst · 40ms peak · 850ms settle to 16% low coals', flareRise: 0.14, flareHold: 0.04, flareDecay: 0.85, flareEndHeight: 0.16, flarePeakHeight: 1.26, flareBelly: 0.42, flareSpeedBoost: 2.2 },
] as const;

export const FLARE_SLIDERS: { key: keyof FlameSlot; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
    { key: 'flareRise', label: 'Flare Up', min: 0.04, max: 0.5, step: 0.02, fmt: v => `${Math.round(v * 1000)}ms` },
    { key: 'flareHold', label: 'Peak Hold', min: 0.0, max: 1.0, step: 0.02, fmt: v => `${Math.round(v * 1000)}ms` },
    { key: 'flareDecay', label: 'Die Down', min: 0.15, max: 2.0, step: 0.05, fmt: v => `${Math.round(v * 1000)}ms` },
    { key: 'flareEndHeight', label: 'End State', min: 0, max: 0.6, step: 0.02, fmt: v => v <= 0.01 ? '0% (Out)' : `${Math.round(v * 100)}%` },
    { key: 'flarePeakHeight', label: 'Burst Jump', min: 0.8, max: 2.0, step: 0.05, fmt: v => `${Math.round(v * 100)}%` },
    { key: 'flareBelly', label: 'Belly Swell', min: 0, max: 1.0, step: 0.05, fmt: v => `${Math.round(v * 100)}%` },
    { key: 'flareSpeedBoost', label: 'Updraft Rush', min: 0.5, max: 4.5, step: 0.1, fmt: v => `${v.toFixed(1)}×` },
    { key: 'flareDelay', label: 'Burst Delay', min: 0, max: 0.6, step: 0.02, fmt: v => `${Math.round(v * 1000)}ms` },
];

/**
 * Ten flame types. magnitude/lacunarity/gain/hue/intensity/width/speed/idle map directly to sliders.
 */
export const PRESETS = [
    { id: 'hearth', label: 'Hearth', magnitude: 1.3, lacunarity: 2.0, gain: 0.5, hue: 36, intensity: 9, width: 1, speed: 1, hueBase: 0, idle: 0.38 },
    { id: 'roast', label: 'Pig roast', magnitude: 2.2, lacunarity: 2.4, gain: 0.55, hue: 48, intensity: 11, width: 1.1, speed: 1.1, hueBase: 0, idle: 0.5 },
    { id: 'coals', label: 'Coals', magnitude: 0.6, lacunarity: 1.8, gain: 0.4, hue: 18, intensity: 7, width: 1.1, speed: 0.5, hueBase: 0, idle: 0.16 },
    { id: 'campfire', label: 'Campfire', magnitude: 1.8, lacunarity: 2.2, gain: 0.5, hue: 40, intensity: 10, width: 1.05, speed: 1.2, hueBase: 4, idle: 0.6 },
    { id: 'candle', label: 'Candle', magnitude: 0.25, lacunarity: 1.6, gain: 0.35, hue: 52, intensity: 14, width: 0.32, speed: 0.6, hueBase: 20, idle: 0.55 },
    { id: 'gas', label: 'Gas grill', magnitude: 0.45, lacunarity: 2.6, gain: 0.45, hue: 195, intensity: 12, width: 1.1, speed: 2.2, hueBase: 235, idle: 0.22 },
    { id: 'torch', label: 'Torch', magnitude: 1.2, lacunarity: 2.8, gain: 0.6, hue: 45, intensity: 12, width: 0.55, speed: 2.4, hueBase: 10, idle: 0.7 },
    { id: 'smoker', label: 'Smoker', magnitude: 2.4, lacunarity: 1.7, gain: 0.6, hue: 28, intensity: 7, width: 0.9, speed: 0.55, hueBase: 0, idle: 0.42 },
    { id: 'wildfire', label: 'Wildfire', magnitude: 3.2, lacunarity: 2.5, gain: 0.62, hue: 34, intensity: 13, width: 1.15, speed: 1.8, hueBase: 0, idle: 0.85 },
    { id: 'copper', label: 'Copper', magnitude: 1.4, lacunarity: 2.2, gain: 0.5, hue: 95, intensity: 11, width: 0.85, speed: 1.1, hueBase: 150, idle: 0.5 },
] as const;

export const SLIDERS: { key: keyof FlameSlot; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
    { key: 'magnitude', label: 'Turbulence', min: 0, max: 4, step: 0.1, fmt: v => v.toFixed(1) },
    { key: 'lacunarity', label: 'Detail', min: 1, max: 4, step: 0.1, fmt: v => v.toFixed(1) },
    { key: 'gain', label: 'Gain', min: 0.1, max: 0.9, step: 0.05, fmt: v => v.toFixed(2) },
    { key: 'hue', label: 'Tip Hue', min: 0, max: 360, step: 1, fmt: v => `${Math.round(v)}°` },
    { key: 'hueBase', label: 'Core Hue', min: 0, max: 360, step: 1, fmt: v => `${Math.round(v)}°` },
    { key: 'intensity', label: 'Intensity', min: 2, max: 18, step: 0.5, fmt: v => v.toFixed(1) },
    { key: 'width', label: 'Flame Width', min: 0.25, max: 1.8, step: 0.05, fmt: v => `${v.toFixed(2)}×` },
    { key: 'speed', label: 'Flame Speed', min: 0.2, max: 2.8, step: 0.1, fmt: v => `${v.toFixed(1)}×` },
    { key: 'idle', label: 'Height at 100%', min: 0.1, max: 2.0, step: 0.02, fmt: v => `${Math.round(v * 100)}%` },
    { key: 'emberRate', label: 'Ember Rate', min: 0, max: 6, step: 0.2, fmt: v => `${v.toFixed(1)}/s` },
    { key: 'emberLift', label: 'Ember Lift', min: 0.3, max: 2.2, step: 0.1, fmt: v => `${v.toFixed(1)}×` },
    { key: 'emberSize', label: 'Ember Size', min: 0.4, max: 2.0, step: 0.1, fmt: v => `${v.toFixed(1)}×` },
];

export const POSITION_SLIDERS: { key: 'posX' | 'posY' | 'scale'; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
    { key: 'posX', label: 'Position X', min: -3.5, max: 3.5, step: 0.05, fmt: v => `${Math.round((v / 3.5) * 100)}%` },
    { key: 'posY', label: 'Position Y', min: -2.0, max: 2.0, step: 0.05, fmt: v => `${Math.round((v / 2.0) * 100)}%` },
    { key: 'scale', label: 'Flame Size', min: 0.3, max: 2.5, step: 0.05, fmt: v => `${v.toFixed(2)}×` },
];

export const LOAD_SECONDS = 2.8; // 2.8s (2800ms) for the logo to burn in 0%->100%, then burn-out + page melt start immediately
export const ORBIT_COUNT = 16; // embers rising off the headline; kept sparse on purpose

export const IDLE_HEIGHT = 0.38;
export const EMBERS = 65;

/**
 * Evaluates the "gas thrown on a fire" explosive burst envelope:
 * - Explosive exponential jump (`1 - (1 - p)^3.8`) with a fireball overshoot (`1 + 0.26 * sin(p * PI)`)
 * - Brief peak hold
 * - Fast initial collapse as fuel vapor burns off (`(1 - d)^2.2`) settling down to end state
 */
export function evaluateFlare(msSinceStart: number, s: FlameSlot): { f: number; swell: number; riseProgress: number; dieProgress: number; active: boolean } {
    const delayedMs = msSinceStart - (s.flareDelay ?? 0) * 1000;
    if (delayedMs < 0 || !Number.isFinite(delayedMs)) {
        return { f: 0, swell: 0, riseProgress: 0, dieProgress: 0, active: false };
    }
    const t = delayedMs / 1000;
    const rise = Math.max(0.04, s.flareRise ?? 0.14);
    const hold = Math.max(0, s.flareHold ?? 0.04);
    const decay = Math.max(0.1, s.flareDecay ?? 0.90);
    const peakMult = s.flarePeakHeight ?? 1.28;
    const bellyMult = (s.flareBelly ?? 0.45) / 0.45;

    if (t < rise) {
        const p = t / rise;
        // Explosive accelerant jump: shoots up immediately and overshoots slightly like a gas fireball
        const fastJump = (1 - Math.pow(1 - p, 3.8)) * peakMult;
        const overshoot = Math.sin(p * Math.PI) * 0.18 * peakMult;
        return {
            f: fastJump + overshoot,
            swell: Math.sin(p * Math.PI * 0.85) * bellyMult,
            riseProgress: p,
            dieProgress: 0,
            active: true,
        };
    }
    if (t < rise + hold) {
        const hp = hold > 0 ? (t - rise) / hold : 1;
        return {
            f: peakMult * (1 + (1 - hp) * 0.08),
            swell: (1 - hp * 0.2) * bellyMult,
            riseProgress: 1,
            dieProgress: 0,
            active: true,
        };
    }
    const d = (t - rise - hold) / decay;
    if (d >= 1) {
        return { f: 0, swell: 0, riseProgress: 1, dieProgress: 1, active: false };
    }
    // Fuel vapor burns off fast at first, then settles down smoothly
    const collapse = Math.pow(1 - d, 2.15) * peakMult;
    const swellDie = Math.pow(1 - d, 2.8) * 0.8 * bellyMult;
    return { f: collapse, swell: swellDie, riseProgress: 1, dieProgress: d, active: true };
}

/* ───────────────────────── Component ───────────────────────── */

export const PRELOADER_STEPS = [
    { id: 1, num: '01', label: 'Black Curtain', timing: '0.0s (0%)', desc: 'Solid black overlay hides unstyled flash while all images, fonts, CSS backgrounds & maps load.' },
    { id: 2, num: '02', label: 'Logo Burn-In', timing: '0.0s → 3.2s', desc: 'Center Hofherr logo ignites left-to-right; holds at 92% until every image & asset is GPU-decoded.' },
    { id: 3, num: '03', label: '100% Flame Flare', timing: '100% (+0.0s)', desc: 'Logo hits 100%: bottom 3D WebGL flame flares up with rising embers.' },
    { id: 4, num: '04', label: 'Center Logo Burn-Out', timing: '+0.4s', desc: 'Center Hofherr logo burns away left-to-right on the dark stage.' },
    { id: 5, num: '05', label: 'Simultaneous Melt-In', timing: '+1.1s', desc: 'Nav logo, Navbar, and the page itself all melt into focus together (320ms).' },
    { id: 6, num: '06', label: 'Interactive Ready', timing: '+1.6s', desc: 'Preloader overlay unmounts; page, Navbar, and Nav logo are fully live.' },
] as const;

export interface FireTestClientProps {
    /** Run as the site preloader: no controls, fills its (fixed) parent, holds at 90% until the page has loaded. */
    preloader?: boolean;
    /** Optional step (1..6) to jump to immediately on mount. */
    initialStep?: number | null;
    /** Keep the 3D flame visible at all times (e.g. when editing flame settings). */
    alwaysShowFlameProp?: boolean;
    /** Start paused at initialStep. */
    initialPaused?: boolean;
    /** Allow interactive pointer dragging/orbiting of the flame (dev HUD edit mode only). */
    interactiveDrag?: boolean;
    /** Called when the big logo starts burning away (time to reveal the page). */
    onReveal?: () => void;
    /** Called once the navbar hand-off is finished (safe to unmount). */
    onDone?: () => void;
    /** Called when the active preloader step (1..6) changes. */
    onStepChange?: (step: number, pct: number) => void;
}

