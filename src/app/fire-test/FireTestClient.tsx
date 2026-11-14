'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from './page.module.css';
import { createBurner, type Burner } from './burner';
import { waitForPageAssets } from '@/lib/waitForPageAssets';

/* ───────────────────────── Shaders ───────────────────────── */

const FIRE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const FIRE_FRAG = /* glsl */ `
  uniform float uTime, uMagnitude, uLacunarity, uGain, uHue, uIntensity, uHeight, uWidth, uHueBase, uSwell, uSeed;
  varying vec2 vUv;

  // 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT) — exact match with PressTickerFire.tsx
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    float lac = max(1.2, uLacunarity * 0.76);
    float g = clamp(uGain, 0.25, 0.75);
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p = p * lac + vec2(13.1, -7.4);
      a *= g;
    }
    return v * 0.5 + 0.5;
  }

  float turb(vec2 p) {
    float v = 0.0;
    float a = 0.54;
    float lac = max(1.2, uLacunarity * 0.79);
    float g = clamp(uGain, 0.25, 0.75);
    for (int i = 0; i < 4; i++) {
      v += a * abs(snoise(p));
      p = p * lac + vec2(-9.2, 5.7);
      a *= g;
    }
    return v;
  }

  vec3 hsv2rgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
    return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
  }

  /* Moody dimmed Hofherr Smokehouse palette (from PressTickerFire.tsx):
     Deep Char -> Oxblood #8B0A10 -> Crimson #CC0E1D -> Ember #E85222 -> Muted Amber #F59B1A */
  vec4 fireRamp(float heat, float dimScale) {
    float h = clamp(heat, 0.0, 1.0);
    vec3 col;
    if (uHue > 70.0 || uHueBase > 70.0) {
      float hue = fract(mix(uHueBase, uHue, h) / 360.0);
      col = hsv2rgb(vec3(hue, 0.92 - h * 0.22, 0.16 + h * 0.78));
    } else {
      vec3 c0 = vec3(0.14, 0.01, 0.02);
      vec3 c1 = vec3(0.55, 0.04, 0.06);
      vec3 c2 = vec3(0.80, 0.06, 0.11);
      vec3 c3 = vec3(0.91, 0.32, 0.13);
      vec3 c4 = vec3(0.96, 0.62, 0.18);

      col = mix(c0, c1, smoothstep(0.02, 0.28, h));
      col = mix(col, c2, smoothstep(0.26, 0.55, h));
      col = mix(col, c3, smoothstep(0.52, 0.80, h));
      col = mix(col, c4, smoothstep(0.76, 1.0, h));
    }

    float a = smoothstep(0.03, 0.86, h) * dimScale;
    return vec4(col * a, a);
  }

  void main() {
    float h = vUv.y / max(0.05, uHeight);
    if (h <= 0.0 || h >= 1.0) discard;

    float lx = (vUv.x * 2.0 - 1.0) / max(0.25, uWidth);
    float t = uTime;

    // Gas-belly swell + lateral wind sway
    float belly = sin(h * 3.14159) * (0.22 + uSwell * 0.24);
    float radius = 0.56 * (1.0 - h * (0.82 - uSwell * 0.14)) + 0.04 + belly;
    float sway = snoise(vec2(h * 1.9 + uSeed, t * 0.58)) * 0.22 * h;
    float r = abs(lx + sway) / max(0.04, radius);

    float n = turb(vec2((lx + sway) * 1.85 + uSeed, h * 2.55 - t * 1.15));
    float fDetail = fbm(vec2((lx - sway) * 3.4 - uSeed, h * 3.9 - t * 1.65));

    float turbScale = clamp(uMagnitude / 2.8, 0.25, 1.65);
    float turbWeight = smoothstep(0.06, 0.72, h);
    float d = 1.0 - r - n * (0.28 + 0.92 * turbWeight) * turbScale + (1.0 - h) * 0.22;
    d *= 0.82 + 0.36 * fDetail;
    d = clamp(d, 0.0, 1.0) * smoothstep(0.0, 0.16, h) * (1.0 - smoothstep(0.62, 0.99, h));
    d *= 1.0 - smoothstep(0.72, 1.0, abs(lx));

    float heat = clamp(d * 1.48 * (1.12 - h * 0.52 + uSwell * 0.16), 0.0, 1.0);
    float dimScale = clamp(uIntensity / 16.5, 0.0, 0.92);
    gl_FragColor = fireRamp(heat, dimScale);
  }`;

/* Same palette as src/components/EmbersBackground.tsx / PressTickerFire.tsx */
const EMBER_COLORS = ['#ff8c00', '#ffa500', '#ff6600', '#ffb347', '#ff5518', '#ffcc66', '#e01e2e', '#ffd27f'];
const EMBER_FLARE_COLORS = ['#fff5cc', '#ffe4a0', '#ffd27f'];
const EMBER_DYING = '#1a1008';
/* Redder palette for the ring around the headline (no golds, so it stays in the red family) */
const HEADLINE_EMBER_COLORS = ['#ff4500', '#ff3a1a', '#e01e2e', '#ff5a36', '#cc0e1d', '#ff2a14'];
const HEADLINE_EMBER_FLARE_COLORS = ['#ff8a6a', '#ff6a4d'];

/* ───────────────────────── Settings ───────────────────────── */

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

export const FLAME_STORAGE_KEY = 'hofherr_flame_settings_v13';

export const FIVE_FLAME_DEFAULTS: FlameSlot[] = [
    {
        enabled: true,
        presetId: 'smokehouse_torch',
        label: '01 Smokehouse Torch',
        posX: 0,
        posY: -1.61,
        scale: 0.72,
        magnitude: 2.8,
        lacunarity: 2.71,
        gain: 0.50,
        hue: 28,
        hueBase: 4,
        intensity: 9.8,
        width: 0.88,
        speed: 1.45,
        idle: 0.62,
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
        emberSize: 0.82,
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

const LOAD_SECONDS = 2.8; // 2.8s (2800ms) for the logo to burn in 0%->100%, then burn-out + page melt start immediately
const ORBIT_COUNT = 16; // embers rising off the headline; kept sparse on purpose

const IDLE_HEIGHT = 0.38;
const EMBERS = 65;

/**
 * Evaluates the "gas thrown on a fire" explosive burst envelope:
 * - Explosive exponential jump (`1 - (1 - p)^3.8`) with a fireball overshoot (`1 + 0.26 * sin(p * PI)`)
 * - Brief peak hold
 * - Fast initial collapse as fuel vapor burns off (`(1 - d)^2.2`) settling down to end state
 */
function evaluateFlare(msSinceStart: number, s: FlameSlot): { f: number; swell: number; riseProgress: number; dieProgress: number; active: boolean } {
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

interface FireTestClientProps {
    /** Run as the site preloader: no controls, fills its (fixed) parent, holds at 90% until the page has loaded. */
    preloader?: boolean;
    /** Optional step (1..6) to jump to immediately on mount. */
    initialStep?: number | null;
    /** Keep the 3D flame visible at all times (e.g. when editing flame settings). */
    alwaysShowFlameProp?: boolean;
    /** Start paused at initialStep. */
    initialPaused?: boolean;
    /** Called when the big logo starts burning away (time to reveal the page). */
    onReveal?: () => void;
    /** Called once the navbar hand-off is finished (safe to unmount). */
    onDone?: () => void;
    /** Called when the active preloader step (1..6) changes. */
    onStepChange?: (step: number, pct: number) => void;
}

export default function FireTestClient({
    preloader = false,
    initialStep = null,
    alwaysShowFlameProp = false,
    initialPaused = false,
    onReveal,
    onDone,
    onStepChange,
}: FireTestClientProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fpsRef = useRef<HTMLSpanElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);

    const [settings, setSettings] = useState<FlameSettings>(DEFAULT_FLAME_SETTINGS);
    const [preset, setPreset] = useState<string | null>('hearth');
    const [dragMode, setDragMode] = useState<'move' | 'orbit'>('move');
    const [activeStep, setActiveStep] = useState<number>(1);
    const [paused, setPaused] = useState<boolean>(initialPaused);
    const [alwaysShowFlame, setAlwaysShowFlame] = useState<boolean>(!preloader || alwaysShowFlameProp);
    const errorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const logoRef = useRef<HTMLSpanElement>(null);
    const logoImgRef = useRef<HTMLImageElement>(null);
    const logoBurnRef = useRef<HTMLCanvasElement>(null);
    const navBurnWrapRef = useRef<HTMLSpanElement>(null);
    const navBurnRef = useRef<HTMLCanvasElement>(null);
    const loadStartRef = useRef(0);
    const pausedRef = useRef(initialPaused);
    const alwaysShowFlameRef = useRef(!preloader || alwaysShowFlameProp);
    const stepJumpRef = useRef<number | null>(initialStep);

    // Values the render loop reads every frame (kept in refs so the loop never restarts)
    const settingsRef = useRef(settings);
    const dragModeRef = useRef(dragMode);
    const controlsRef = useRef<OrbitControls | null>(null);
    const flareStartRef = useRef(-Infinity);
    const burstRef = useRef(0);

    // Hydrate saved flame settings from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(FLAME_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<FlameSettings>;
                const validFlames = Array.isArray(parsed.flames) && parsed.flames.length === 5
                    ? parsed.flames
                    : FIVE_FLAME_DEFAULTS.map(f => ({ ...f }));
                const selIdx = typeof parsed.selectedIndex === 'number' ? parsed.selectedIndex : 0;
                const next: FlameSettings = {
                    ...DEFAULT_FLAME_SETTINGS,
                    ...parsed,
                    ...(validFlames[selIdx] ?? validFlames[0]),
                    selectedIndex: selIdx,
                    flames: validFlames,
                };
                settingsRef.current = next;
                setSettings(next);
            }
        } catch { /* ignore */ }
    }, []);

    // Persist flame settings & listen for external HUD flame edits
    useEffect(() => {
        settingsRef.current = settings;
        try {
            localStorage.setItem(FLAME_STORAGE_KEY, JSON.stringify(settings));
        } catch { /* ignore */ }
    }, [settings]);

    useEffect(() => {
        const onExternalFlame = (e: Event) => {
            const detail = (e as CustomEvent<{
                settings?: Partial<FlameSettings>;
                flare?: boolean;
                cancelFlare?: boolean;
                alwaysShow?: boolean;
                dragMode?: 'move' | 'orbit';
            }>).detail;
            if (detail?.settings) {
                const merged: FlameSettings = {
                    ...settingsRef.current,
                    ...detail.settings,
                };
                settingsRef.current = merged;
                setSettings(merged);
            }
            if (typeof detail?.alwaysShow === 'boolean') {
                setAlwaysShowFlame(detail.alwaysShow);
                alwaysShowFlameRef.current = detail.alwaysShow;
            }
            if (detail?.dragMode) {
                setDragMode(detail.dragMode);
                dragModeRef.current = detail.dragMode;
                if (controlsRef.current) {
                    controlsRef.current.enabled = detail.dragMode === 'orbit';
                }
            }
            if (detail?.cancelFlare && !settingsRef.current.autoLoopBurst) {
                flareStartRef.current = -Infinity;
            }
            if (detail?.flare) {
                flareStartRef.current = performance.now();
                burstRef.current += 16;
            }
        };
        window.addEventListener('flame-settings-external', onExternalFlame);
        return () => window.removeEventListener('flame-settings-external', onExternalFlame);
    }, []);

    useEffect(() => { pausedRef.current = paused; }, [paused]);
    useEffect(() => { alwaysShowFlameRef.current = alwaysShowFlame; }, [alwaysShowFlame]);
    const preloaderRef = useRef(preloader);
    const onRevealRef = useRef(onReveal);
    const onDoneRef = useRef(onDone);
    const onStepChangeRef = useRef(onStepChange);
    useEffect(() => {
        onRevealRef.current = onReveal;
        onDoneRef.current = onDone;
        onStepChangeRef.current = onStepChange;
    }, [onReveal, onDone, onStepChange]);
    useEffect(() => {
        dragModeRef.current = dragMode;
        if (controlsRef.current) {
            controlsRef.current.enabled = dragMode === 'orbit';
        }
    }, [dragMode]);

    // Replays the whole sequence: the word relights from 0%, and the flame flares when it hits 100%
    const fireItUp = useCallback(() => {
        setPaused(false);
        pausedRef.current = false;
        stepJumpRef.current = 1;
        loadStartRef.current = performance.now();
    }, []);

    const jumpToStep = useCallback((stepId: number) => {
        stepJumpRef.current = stepId;
        setActiveStep(stepId);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        } catch {
            if (errorRef.current) errorRef.current.hidden = false;
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0.4, 4.2);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.minDistance = 2.2;
        controls.maxDistance = 9;
        controls.target.set(0, 0.2, 0);
        controls.enabled = dragModeRef.current === 'orbit';
        controlsRef.current = controls;

        /* Direct canvas dragging for moving the active flame on the page (click near a flame to select & drag it) */
        let isDraggingFlame = false;
        let lastPointerX = 0;
        let lastPointerY = 0;

        const onPointerDown = (e: PointerEvent) => {
            if (dragModeRef.current !== 'move') return;
            isDraggingFlame = true;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;
            canvas.setPointerCapture(e.pointerId);

            // Auto-select the closest visible flame under the pointer when showAll5 is enabled
            const cur = settingsRef.current;
            if (cur.showAll5 && Array.isArray(cur.flames)) {
                const rect = canvas.getBoundingClientRect();
                const ndcX = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
                const dist = camera.position.length();
                const viewH = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
                const viewW = viewH * camera.aspect;
                const worldX = ndcX * (viewW / 2);
                let bestIdx = cur.selectedIndex ?? 0;
                let bestDist = Infinity;
                cur.flames.forEach((fl, idx) => {
                    if (!fl.enabled) return;
                    const d = Math.abs(fl.posX - worldX);
                    if (d < bestDist) {
                        bestDist = d;
                        bestIdx = idx;
                    }
                });
                if (bestIdx !== cur.selectedIndex) {
                    const picked = cur.flames[bestIdx];
                    const nextSettings: FlameSettings = { ...cur, ...picked, selectedIndex: bestIdx };
                    settingsRef.current = nextSettings;
                    setSettings(nextSettings);
                    window.dispatchEvent(new CustomEvent('flame-settings-from-canvas', { detail: nextSettings }));
                }
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDraggingFlame || dragModeRef.current !== 'move') return;
            const dx = e.clientX - lastPointerX;
            const dy = e.clientY - lastPointerY;
            lastPointerX = e.clientX;
            lastPointerY = e.clientY;

            const dist = camera.position.length();
            const viewH = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
            const viewW = viewH * camera.aspect;

            const cur = settingsRef.current;
            const selIdx = cur.selectedIndex ?? 0;
            const activeSlot = (cur.flames && cur.flames[selIdx]) ? cur.flames[selIdx] : cur;
            const nextX = Math.max(-3.5, Math.min(3.5, Number((activeSlot.posX + (dx / Math.max(1, canvas.clientWidth)) * viewW).toFixed(2))));
            const nextY = Math.max(-2.0, Math.min(2.0, Number((activeSlot.posY - (dy / Math.max(1, canvas.clientHeight)) * viewH).toFixed(2))));

            const nextFlames = (cur.flames ?? FIVE_FLAME_DEFAULTS).map((fl, idx) =>
                idx === selIdx ? { ...fl, posX: nextX, posY: nextY } : fl
            );
            const nextSettings: FlameSettings = { ...cur, posX: nextX, posY: nextY, flames: nextFlames };
            settingsRef.current = nextSettings;
            setSettings(nextSettings);
            window.dispatchEvent(new CustomEvent('flame-settings-from-canvas', { detail: nextSettings }));
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!isDraggingFlame) return;
            isDraggingFlame = false;
            if (canvas.hasPointerCapture(e.pointerId)) {
                canvas.releasePointerCapture(e.pointerId);
            }
        };

        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointercancel', onPointerUp);

        /* 5 Independent Smokehouse Flame Planes & Subtle Ember Glows */
        const fireGeo = new THREE.PlaneGeometry(1, 1);
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = glowCanvas.height = 128;
        const g = glowCanvas.getContext('2d')!;
        const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grd.addColorStop(0, 'rgba(140, 12, 18, 0.14)');
        grd.addColorStop(0.5, 'rgba(90, 6, 10, 0.04)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        const glowTex = new THREE.CanvasTexture(glowCanvas);
        const glowGeo = new THREE.PlaneGeometry(3.2, 3.2);

        const flameUnits = FIVE_FLAME_DEFAULTS.map((_, idx) => {
            const u = {
                uTime: { value: idx * 13.7 + 4.2 },
                uSeed: { value: 3.1 + idx * 11.73 },
                uMagnitude: { value: 2.8 },
                uLacunarity: { value: 2.71 },
                uGain: { value: 0.5 },
                uHue: { value: 28 },
                uIntensity: { value: 10.2 },
                uHeight: { value: IDLE_HEIGHT },
                uWidth: { value: 0.88 },
                uHueBase: { value: 4 },
                uSwell: { value: 0 },
                uCamLocal: { value: new THREE.Vector3() },
            };
            const fMat = new THREE.ShaderMaterial({
                vertexShader: FIRE_VERT,
                fragmentShader: FIRE_FRAG,
                uniforms: u,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.CustomBlending,
                blendSrc: THREE.OneFactor,
                blendDst: THREE.OneMinusSrcAlphaFactor,
            });
            const fMesh = new THREE.Mesh(fireGeo, fMat);
            fMesh.scale.set(1.45, 2.4, 1);
            fMesh.position.y = 0.6;
            scene.add(fMesh);

            const gMat = new THREE.MeshBasicMaterial({
                map: glowTex,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
            const gMesh = new THREE.Mesh(glowGeo, gMat);
            gMesh.rotation.x = -Math.PI / 2;
            gMesh.position.y = -0.62;
            scene.add(gMesh);

            return { uniforms: u, fireMat: fMat, fire: fMesh, glowMat: gMat, glow: gMesh };
        });

        /* Embers: simulated in 3D around all active flames, drawn on a 2D overlay */
        const overlay = overlayRef.current;
        const ctx2d = overlay?.getContext('2d') ?? null;
        type Ember = {
            pos: THREE.Vector3; prev: THREE.Vector3; vel: THREE.Vector3;
            life: number; maxLife: number; size: number; depth: number; color: string;
            flicker: number; flickerSpeed: number; shape: number; rotation: number; rotSpeed: number;
            scaleX: number; scaleY: number; sides: number; seed: number; alive: boolean;
        };
        const between = (a: number, b: number) => Math.random() * (b - a) + a;
        const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
        const pool: Ember[] = Array.from({ length: EMBERS }, () => ({
            pos: new THREE.Vector3(), prev: new THREE.Vector3(), vel: new THREE.Vector3(),
            life: 0, maxLife: 1, size: 1, depth: 0, color: EMBER_COLORS[0],
            flicker: 0, flickerSpeed: 0, shape: 0, rotation: 0, rotSpeed: 0,
            scaleX: 1, scaleY: 1, sides: 4, seed: 0, alive: false,
        }));

        let eCursor = 0;
        const spawnEmberForSlot = (slot: FlameSlot, power: number) => {
            const e = pool[eCursor];
            eCursor = (eCursor + 1) % EMBERS;
            e.pos.set(
                slot.posX + between(-0.48, 0.48) * slot.width * slot.scale,
                between(-0.52, 0.28) * slot.scale + slot.posY,
                between(-0.35, 0.35) * slot.width * slot.scale,
            );
            e.prev.copy(e.pos);
            const lift = (0.75 + 0.25 * Math.min(power, 1.4)) * slot.scale * (slot.emberLift ?? 1.0);
            e.vel.set(
                between(-0.08, 0.08) * slot.scale,
                between(0.2, 0.56) * lift,
                between(-0.08, 0.08) * slot.scale,
            );
            const isFlare = Math.random() < 0.06;
            e.depth = Math.random();
            const sizeMult = slot.emberSize ?? 1.0;
            e.size = (isFlare ? between(0.95, 1.45) : between(0.35, 0.9) + e.depth * 0.55) * sizeMult;
            e.color = isFlare ? pick(EMBER_FLARE_COLORS) : pick(EMBER_COLORS);
            e.maxLife = between(1.5, 3.6);
            e.life = e.maxLife;
            e.flicker = Math.random() * Math.PI * 2;
            e.flickerSpeed = between(0.04, 0.14) * 30;
            e.shape = Math.floor(Math.random() * 4);
            e.rotation = Math.random() * Math.PI * 2;
            e.rotSpeed = (Math.random() - 0.5) * 0.05 * 30;
            e.scaleX = between(0.5, 1.0);
            e.scaleY = between(0.7, 1.25);
            e.sides = Math.floor(between(3, 6));
            e.seed = Math.random() * 100;
            e.alive = true;
        };

        let idleAcc = 0;
        const updateEmbers = (dt: number, time: number) => {
            const cur = settingsRef.current;
            const slots = cur.flames ?? FIVE_FLAME_DEFAULTS;
            const selIdx = cur.selectedIndex ?? 0;
            const activeSlot = slots[selIdx] ?? cur;

            idleAcc += dt * (activeSlot.emberRate ?? 1.8);
            while (idleAcc > 1) {
                if (flameShown > 0.5) spawnEmberForSlot(activeSlot, 0.6);
                idleAcc -= 1;
            }

            if (burstRef.current > 0) {
                const n = Math.min(burstRef.current, Math.ceil(dt * 28));
                for (let k = 0; k < n; k++) {
                    spawnEmberForSlot(activeSlot, 0.95 + Math.random() * 0.35);
                }
                burstRef.current -= n;
            }
            const drag = Math.max(0, 1 - 1.35 * dt);
            for (const e of pool) {
                if (!e.alive) continue;
                e.life -= dt;
                if (e.life <= 0) { e.alive = false; continue; }
                e.flicker += e.flickerSpeed * dt;
                e.rotation += e.rotSpeed * dt;
                e.vel.y += (0.14 + 0.06 * Math.sin(time * 1.4 + e.seed)) * dt;
                const swayX = Math.sin(time * 1.8 + e.seed) * 0.38 + Math.cos(time * 0.75 + e.seed * 2.1) * 0.24;
                const swayZ = Math.cos(time * 1.6 + e.seed * 1.3) * 0.38 + Math.sin(time * 0.85 + e.seed * 1.9) * 0.24;
                e.vel.x = e.vel.x * drag + swayX * dt;
                e.vel.z = e.vel.z * drag + swayZ * dt;
                e.vel.y *= 1 - 0.38 * dt;
                e.prev.copy(e.pos);
                e.pos.addScaledVector(e.vel, dt);
            }
        };

        /* Ember shapes: soft micro-wisp, squashed oval, shard, soft ember speck.
           Shared by the fire's embers and the ring around the headline. */
        type EmberShape = { shape: number; rotation: number; scaleX: number; scaleY: number; sides: number };
        const drawShape = (
            c: CanvasRenderingContext2D, p: EmberShape,
            x: number, y: number, px: number, py: number,
            s: number, color: string, alpha: number,
        ) => {
            const dx = x - px;
            const dy = y - py;
            const len = Math.sqrt(dx * dx + dy * dy);
            c.save();
            c.globalAlpha = alpha;
            if (p.shape === 0) {
                // short soft ember wisp (clamped to never draw firework lines)
                const maxTail = Math.max(1.2, s * 1.5);
                const clamp = len > maxTail ? maxTail / len : 1;
                const tx = dx * clamp;
                const ty = dy * clamp;
                c.strokeStyle = color;
                c.lineWidth = s * 1.15;
                c.lineCap = 'round';
                c.beginPath();
                c.moveTo(x - tx, y - ty);
                c.lineTo(x + tx * 0.25, y + ty * 0.25);
                c.stroke();
            } else if (p.shape === 1) {
                // squashed oval
                c.translate(x, y);
                c.rotate(p.rotation);
                c.scale(p.scaleX, p.scaleY);
                c.fillStyle = color;
                c.beginPath();
                c.arc(0, 0, s * 1.15, 0, Math.PI * 2);
                c.fill();
            } else if (p.shape === 2) {
                // irregular shard
                c.translate(x, y);
                c.rotate(p.rotation);
                c.fillStyle = color;
                c.beginPath();
                const rr = s * 1.05;
                for (let i = 0; i < p.sides; i++) {
                    const ang = (i / p.sides) * Math.PI * 2;
                    const jitter = 0.78 + 0.25 * Math.sin(p.rotation + i * 2.1);
                    const sx = Math.cos(ang) * rr * jitter * p.scaleX;
                    const sy = Math.sin(ang) * rr * jitter * p.scaleY;
                    if (i === 0) c.moveTo(sx, sy); else c.lineTo(sx, sy);
                }
                c.closePath();
                c.fill();
            } else {
                // soft rising ember teardrop
                c.translate(x, y);
                c.rotate(Math.atan2(dy, dx) + Math.PI / 2);
                c.fillStyle = color;
                c.beginPath();
                c.moveTo(0, -s * 1.45);
                c.bezierCurveTo(s * 0.75, -s * 0.35, s * 0.75, s * 0.75, 0, s * 0.9);
                c.bezierCurveTo(-s * 0.75, s * 0.75, -s * 0.75, -s * 0.35, 0, -s * 1.45);
                c.closePath();
                c.fill();
            }
            c.restore();
        };

        const proj = new THREE.Vector3();
        const projPrev = new THREE.Vector3();
        const drawEmbers = () => {
            if (!ctx2d || !overlay) return;
            const w = overlay.clientWidth;
            const h = overlay.clientHeight;
            const dpr = renderer.getPixelRatio();
            ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx2d.clearRect(0, 0, w, h);
            for (const e of pool) {
                if (!e.alive) continue;
                proj.copy(e.pos).project(camera);
                if (proj.z > 1) continue;
                projPrev.copy(e.prev).project(camera);
                const x = (proj.x * 0.5 + 0.5) * w;
                const y = (-proj.y * 0.5 + 0.5) * h;
                const px = (projPrev.x * 0.5 + 0.5) * w;
                const py = (-projPrev.y * 0.5 + 0.5) * h;

                const lr = e.life / e.maxLife;
                const fadeIn = Math.min(1, (1 - lr) * 14);
                const fadeOut = Math.pow(lr, 0.55);
                const flick = 0.7 + 0.3 * Math.sin(e.flicker);
                const alpha = fadeIn * fadeOut * flick * (0.35 + e.depth * 0.65);
                const color = lr < 0.06 ? EMBER_DYING : e.color;
                // a touch of perspective: closer embers draw slightly larger
                const s = e.size * Math.min(1.8, Math.max(0.6, 4.2 / camera.position.distanceTo(e.pos)));

                drawShape(ctx2d, e, x, y, px, py, s, color, alpha);
            }
        };

        /* Headline embers: rise off the letters like real embers (heat lift, side drift,
           a lazy wobble), fade out as they climb, then respawn at the text.
           Offsets are relative to the text centre so they follow it anywhere on screen. */
        type Riser = EmberShape & {
            ox: number; oy: number; vx: number; vy: number;
            life: number; maxLife: number; size: number; depth: number; color: string;
            flicker: number; flickerSpeed: number; rotSpeed: number; wob: number; wobSpeed: number;
            lastX: number; lastY: number;
        };
        let loadProgress = 0;
        let currentLogoBurn = 0;
        let logoEmbersOn = true; // embers rising off the centre logo; off once it burns away
        let burnEdgeWord = 0; // burn front position across the word, 0..1 (set in updateLoader)
        let flameShown = 0.8; // starts visibly burning at the bottom as the logo begins burning in
        let textHalfW = 120;
        let textHalfH = 36;
        const resetRiser = (o: Riser, boost = 1) => {
            // start anywhere across the word, mostly from the lower half of the letters
            if (loadProgress < 1) {
                const edge = burnEdgeWord * 2 - 1; // burn front, -1..1 across the word
                o.ox = (edge + between(-0.1, 0.03)) * textHalfW;
            } else {
                o.ox = between(-1.05, 1.05) * textHalfW;
            }
            o.oy = between(-0.2, 1.0) * textHalfH;
            o.vx = between(-10, 10);
            o.vy = -between(18, 46) * boost; // px per second, upward
            o.maxLife = between(1.6, 3.4);
            o.life = o.maxLife;
            o.depth = Math.random();
            const isFlare = Math.random() < 0.06;
            o.size = isFlare ? between(1.0, 1.55) : between(0.35, 0.95) + o.depth * 0.6;
            o.color = isFlare ? pick(HEADLINE_EMBER_FLARE_COLORS) : pick(HEADLINE_EMBER_COLORS);
            o.flicker = Math.random() * Math.PI * 2;
            o.flickerSpeed = between(1.2, 4.2);
            o.shape = Math.floor(Math.random() * 4);
            o.rotation = Math.random() * Math.PI * 2;
            o.rotSpeed = (Math.random() - 0.5) * 1.4;
            o.scaleX = between(0.5, 1.0);
            o.scaleY = between(0.7, 1.25);
            o.sides = Math.floor(between(3, 6));
            o.wob = Math.random() * Math.PI * 2;
            o.wobSpeed = between(1.2, 3.0);
            o.lastX = NaN;
            o.lastY = NaN;
        };
        const risers: Riser[] = Array.from({ length: ORBIT_COUNT }, () => {
            const o = {} as Riser;
            resetRiser(o);
            o.life = o.maxLife * Math.random(); // stagger so they don't all start together
            return o;
        });

        let orbitClock = 0;
        let lastFlare = 0;
        const drawOrbit = (dt: number, flare: number) => {
            const text = textRef.current;
            if (!ctx2d || !overlay || !text) return;
            const oRect = overlay.getBoundingClientRect();
            const tRect = text.getBoundingClientRect();
            const cx = tRect.left + tRect.width / 2 - oRect.left;
            const cy = tRect.top + tRect.height / 2 - oRect.top;
            textHalfW = tRect.width / 2;
            textHalfH = tRect.height / 2;

            orbitClock += dt;
            const intro = Math.min(1, orbitClock / 1.2);
            // a flare kicks a fresh wave of rising embers off the letters
            const flareKick = flare > 0.9 && lastFlare <= 0.9;
            lastFlare = flare;
            let kicks = flareKick ? Math.floor(ORBIT_COUNT * 0.25) : 0;

            for (const o of risers) {
                // once the centre logo burns away its embers stop respawning and fade out fast
                o.life -= logoEmbersOn ? dt : dt * 3;
                if (!logoEmbersOn) {
                    if (o.life <= 0) continue;
                } else if (o.life <= 0 || kicks > 0 && o.life < o.maxLife * 0.5) {
                    const boosted = kicks > 0;
                    if (boosted) kicks--;
                    resetRiser(o, boosted ? 1.35 : 1 + flare * 0.3);
                }
                o.wob += o.wobSpeed * dt;
                o.flicker += o.flickerSpeed * dt;
                o.rotation += o.rotSpeed * dt;
                o.vy -= 11 * dt;                 // gentle heat lift
                o.vy *= 1 - 0.3 * dt;            // air drag
                o.vx += Math.sin(o.wob) * 26 * dt + (Math.random() - 0.5) * 14 * dt;
                o.vx *= 1 - 0.85 * dt;
                o.ox += o.vx * dt;
                o.oy += o.vy * dt;

                const x = cx + o.ox;
                const y = cy + o.oy;
                const px = Number.isNaN(o.lastX) ? x : o.lastX;
                const py = Number.isNaN(o.lastY) ? y : o.lastY;
                o.lastX = x;
                o.lastY = y;

                const lr = Math.max(0, o.life / o.maxLife);
                const fadeIn = Math.min(1, (1 - lr) * 8);
                const fadeOut = Math.pow(lr, 0.55);
                const alpha = intro * fadeIn * fadeOut * (0.7 + 0.3 * Math.sin(o.flicker)) * (0.35 + o.depth * 0.65);
                if (alpha <= 0.01) continue;
                const color = lr < 0.06 ? EMBER_DYING : o.color;
                drawShape(ctx2d, o, x, y, px, py, o.size * 1.3, color, alpha);
            }
        };

        /* Sizing */
        let rebuildBurn: () => void = () => { }; // assigned once the burn canvas is set up below
        const resize = () => {
            rebuildBurn();
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            renderer.setSize(w, h, false);
            if (overlay) {
                const dpr = renderer.getPixelRatio();
                overlay.width = Math.round(w * dpr);
                overlay.height = Math.round(h * dpr);
            }
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        /* Loop */
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        loadStartRef.current = performance.now();
        let flaredForLoad = -1; // loadStartRef value we've already flared for
        /* Burn-in progress: eased 0→1 with a couple of small stalls, like a real loader */
        const loadCurve = (sec: number) => {
            const p = Math.min(1, Math.max(0, sec / LOAD_SECONDS));
            const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            const stall = Math.sin(p * Math.PI * 5) * 0.025 * (1 - p); // stays monotonic
            return Math.min(1, Math.max(0, eased - stall));
        };
        /* ── Burning headline + logo ──
           Both are drawn per-pixel by a burner (see ./burner.ts) and burn in together: the
           headline settles to Hofherr red, the logo to white. The percent counts both. */
        const logoBurner: Burner | null = logoBurnRef.current ? createBurner(logoBurnRef.current, [255, 255, 255]) : null;
        const navLogoBurner: Burner | null = navBurnRef.current ? createBurner(navBurnRef.current, [255, 255, 255]) : null;

        const logoSvg = new window.Image();
        let logoSvgReady = false;
        const buildCenterLogoBurn = () => {
            const img = logoImgRef.current;
            if (logoBurner && img && logoSvgReady) {
                const rect = img.getBoundingClientRect();
                if (rect.width > 4 && rect.height > 4) {
                    logoBurner.build({
                        width: rect.width,
                        height: rect.height,
                        padX: Math.max(24, rect.height * 0.35),
                        padTop: rect.height * 0.7,
                        padBottom: Math.max(12, rect.height * 0.2),
                        paint: (c, x, y, w, h) => c.drawImage(logoSvg, x, y, w, h),
                    });
                }
            }
        };
        const buildNavLogoBurn = () => {
            const navEl = document.querySelector<HTMLImageElement>('header a[href="/"] img');
            const navWrap = navBurnWrapRef.current;
            if (navLogoBurner && navEl && navWrap && logoSvgReady) {
                const hdr = document.querySelector<HTMLElement>('header');
                const prevTransform = hdr ? hdr.style.transform : '';
                if (hdr && prevTransform) hdr.style.transform = '';
                const nRect = navEl.getBoundingClientRect();
                if (hdr && prevTransform) hdr.style.transform = prevTransform;
                if (nRect.width > 4 && nRect.height > 4) {
                    navWrap.style.setProperty('--nav-logo-x', `${nRect.left}px`);
                    navWrap.style.setProperty('--nav-logo-y', `${nRect.top}px`);
                    navWrap.style.setProperty('--nav-logo-w', `${nRect.width}px`);
                    navWrap.style.setProperty('--nav-logo-h', `${nRect.height}px`);
                    navLogoBurner.build({
                        width: nRect.width,
                        height: nRect.height,
                        padX: Math.max(18, nRect.height * 0.4),
                        padTop: Math.max(24, nRect.height * 0.8),
                        padBottom: Math.max(12, nRect.height * 0.25),
                        paint: (c, x, y, w, h) => c.drawImage(logoSvg, x, y, w, h),
                    });
                }
            }
        };
        const buildLogoBurn = () => {
            buildCenterLogoBurn();
            buildNavLogoBurn();
        };
        logoSvg.onload = () => { logoSvgReady = true; buildLogoBurn(); };
        logoSvg.src = '/assets/logo.svg';

        const buildBurn = () => { buildLogoBurn(); };
        rebuildBurn = buildBurn;
        buildBurn();
        document.fonts?.ready.then(buildBurn).catch(() => { });

        /* Logo hand-off: during the preloader the whole navbar is hidden and only the big burning
           logo shows. Once it is fully lit (at 2.8s), the big logo burns away while
           the navbar logo burns in, and once the logo is 2/3 burned through, the page melts in.
           Timeline, in seconds after 100% (2.8s): */
        const OUT_START = 0.05; // at 2.85s (50ms after 100%), center logo burn-out + nav logo burn-in start
        const OUT_DUR = 0.95; // 950ms burn-out duration
        const MELT_START = OUT_START + OUT_DUR * (2 / 3); // page starts melting in once the logo is 2/3 burned through
        const MELT_DUR = 0.55; // page melt-in duration from 0% -> 100% starting at the 2/3 mark
        const DONE_AT = Math.max(OUT_START + OUT_DUR, MELT_START + MELT_DUR) + 0.12; // burn-out, nav hand-off, and melt-in complete
        const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

        const navLogo = document.querySelector<HTMLImageElement>('header a[href="/"] img');
        const siteHeader = document.querySelector<HTMLElement>('header');
        // shows the navbar + nav logo with the exact same melt-in curve as PageTransition.tsx
        let headerMeltTimer: ReturnType<typeof setTimeout> | null = null;
        const setHeaderVisible = (visible: boolean, instant = false) => {
            if (!siteHeader) return;
            if (headerMeltTimer) { clearTimeout(headerMeltTimer); headerMeltTimer = null; }
            siteHeader.style.transition = 'none';
            siteHeader.style.pointerEvents = visible ? '' : 'none';
            if (visible && instant) {
                siteHeader.style.opacity = '1';
                siteHeader.style.filter = '';
                siteHeader.style.transform = '';
                siteHeader.style.animation = '';
            } else if (!visible) {
                siteHeader.style.opacity = '0';
                siteHeader.style.animation = '';
            }
        };
        const setNavLogoVisible = (visible: boolean) => {
            if (!navLogo) return;
            navLogo.style.transition = 'none';
            navLogo.style.opacity = visible ? '1' : '0';
        };

        let outWoken = false;
        let handedOff = false;
        const resetLogo = () => {
            if (alwaysShowFlameRef.current) {
                setNavLogoVisible(true);
                setHeaderVisible(true, true);
                if (navBurnWrapRef.current) navBurnWrapRef.current.hidden = true;
                handedOff = true;
                return;
            }
            setNavLogoVisible(false);
            setHeaderVisible(false, true);
            if (navBurnWrapRef.current) navBurnWrapRef.current.hidden = true;
            if (preloaderRef.current) {
                window.dispatchEvent(new CustomEvent('page-transition-waiting'));
            }
            outWoken = false;
            handedOff = false;
        };
        resetLogo();

        /** Runs the hand-off; returns true while the big logo is burning away (so it isn't redrawn lit). */
        const updateLogo = (since: number, time: number): boolean => {
            if (since < 0) {
                if (handedOff || outWoken) resetLogo();
                return false;
            }
            if (reduceMotion || alwaysShowFlameRef.current) {
                setNavLogoVisible(true);
                setHeaderVisible(true, true);
                if (logoRef.current) logoRef.current.hidden = true;
                if (navBurnWrapRef.current) navBurnWrapRef.current.hidden = true;
                handedOff = true;
                return true;
            }
            const TOP_HANDOFF_AT = Math.max(OUT_START + OUT_DUR + 0.08, MELT_START + MELT_DUR);
            if (since >= OUT_START) {
                // As the center preloader logo burns out ('out'), the top navbar logo burns in ('in') in 1:1 sync;
                // once the logo is 2/3 burned through (since >= MELT_START), the real page melts in from 0% -> 100%.
                if (!outWoken) {
                    if (navBurnWrapRef.current) navBurnWrapRef.current.hidden = false;
                    buildNavLogoBurn();
                    logoBurner?.wake();
                    navLogoBurner?.wake();
                    outWoken = true;
                }
                const p = clamp01((since - OUT_START) / OUT_DUR);
                const ep = easeInOut(p);
                if (since >= MELT_START && preloaderRef.current && !reduceMotion) {
                    const meltP = clamp01((since - MELT_START) / MELT_DUR);
                    window.dispatchEvent(new CustomEvent('page-transition-preloader-progress', { detail: { progress: meltP } }));
                }
                if (logoBurner) {
                    // Scale progress slightly (1.1x) so by p=1.0 the rightmost 'S' has completely crumbled away
                    const frontOut = logoBurner.frontFor(ep * 1.1);
                    logoBurner.draw(frontOut, time, p >= 1, 'out');
                }
                if (p >= 1 && logoRef.current) {
                    logoRef.current.hidden = true;
                }
                if (navLogoBurner && !handedOff) {
                    const frontIn = navLogoBurner.frontFor(ep * 1.1);
                    navLogoBurner.draw(frontIn, time, p >= 1, 'in');
                }
            }
            if (since >= MELT_START && siteHeader) {
                siteHeader.style.pointerEvents = '';
            }
            if (since >= TOP_HANDOFF_AT && !handedOff) {
                // Once the top navbar logo has finished burning in and cooled to crisp white, hand off in-place to the real <img>
                setNavLogoVisible(true);
                setHeaderVisible(true, true);
                if (navBurnWrapRef.current) navBurnWrapRef.current.hidden = true;
                handedOff = true;
            }
            return since >= OUT_START;
        };

        let completeAt = -1; // when the last of the word caught fire (performance.now), -1 while burning
        let lastLoaderNow = 0;
        let revealFired = false;
        let doneFired = false;
        let lastReportedStep = -1;
        let lastReportedPct = -1;
        let assetsReady = !preloaderRef.current;

        if (preloaderRef.current) {
            void waitForPageAssets(5000).then(() => {
                assetsReady = true;
            });
        }

        const onExternalStepEvent = (e: Event) => {
            const detail = (e as CustomEvent<{ step?: number; replay?: boolean; togglePause?: boolean }>).detail;
            if (detail?.replay) {
                setAlwaysShowFlame(false);
                alwaysShowFlameRef.current = false;
                setPaused(false);
                pausedRef.current = false;
                stepJumpRef.current = 1;
            } else if (typeof detail?.togglePause === 'boolean') {
                setPaused(detail.togglePause);
                pausedRef.current = detail.togglePause;
            } else if (typeof detail?.step === 'number') {
                stepJumpRef.current = detail.step;
            }
        };
        window.addEventListener('preloader-step-control', onExternalStepEvent);

        const updateLoader = (now: number) => {
            const text = textRef.current;
            if (!text) return;

            // Handle manual step jump from UI buttons
            if (stepJumpRef.current !== null) {
                const target = stepJumpRef.current;
                stepJumpRef.current = null;
                resetLogo();
                if (logoRef.current) logoRef.current.hidden = false;
                if (target === 1) {
                    loadStartRef.current = now - 50;
                    flaredForLoad = -1;
                    completeAt = -1;
                    revealFired = false;
                    doneFired = false;
                } else if (target === 2) {
                    loadStartRef.current = now - LOAD_SECONDS * 0.52 * 1000;
                    flaredForLoad = -1;
                    completeAt = -1;
                    revealFired = false;
                    doneFired = false;
                } else if (target === 3) {
                    loadStartRef.current = now - (LOAD_SECONDS + 1.0) * 1000;
                    flaredForLoad = loadStartRef.current;
                    completeAt = now - 40;
                    flareStartRef.current = now - 40;
                    burstRef.current += 16;
                    revealFired = false;
                    doneFired = false;
                } else if (target === 4) {
                    loadStartRef.current = now - (LOAD_SECONDS + 1.5) * 1000;
                    flaredForLoad = loadStartRef.current;
                    completeAt = now - (OUT_START + 0.25) * 1000;
                    flareStartRef.current = completeAt;
                    revealFired = false;
                    doneFired = false;
                } else if (target === 5) {
                    loadStartRef.current = now - (LOAD_SECONDS + 2.5) * 1000;
                    flaredForLoad = loadStartRef.current;
                    completeAt = now - (OUT_START + OUT_DUR * 0.6) * 1000;
                    flareStartRef.current = completeAt;
                    revealFired = false;
                    doneFired = false;
                } else if (target === 6) {
                    loadStartRef.current = now - (LOAD_SECONDS + 5.0) * 1000;
                    flaredForLoad = loadStartRef.current;
                    completeAt = now - (DONE_AT + 0.2) * 1000;
                    revealFired = true;
                    doneFired = false;
                    onRevealRef.current?.();
                    if (preloaderRef.current) {
                        window.dispatchEvent(new CustomEvent('page-transition-preloader-progress', { detail: { progress: 1 } }));
                    }
                }
            }

            if (pausedRef.current && lastLoaderNow > 0) {
                const delta = now - lastLoaderNow;
                loadStartRef.current += delta;
                if (flaredForLoad >= 0) flaredForLoad += delta;
                if (completeAt >= 0) completeAt += delta;
                if (flareStartRef.current > -Infinity) flareStartRef.current += delta;
            }

            if (flaredForLoad !== loadStartRef.current) {
                completeAt = -1; // relit: start over
                revealFired = false;
                doneFired = false;
                if (logoRef.current) logoRef.current.hidden = false;
            }
            // as the preloader, hold at ~92% until every image, CSS background, font, and asset on the page is loaded & decoded
            if (preloaderRef.current && (!assetsReady || document.readyState !== 'complete') && lastLoaderNow > 0
                && loadCurve((now - loadStartRef.current) / 1000) >= 0.92) {
                loadStartRef.current += now - lastLoaderNow;
            }
            lastLoaderNow = now;
            const sec = (now - loadStartRef.current) / 1000;
            loadProgress = reduceMotion ? 1 : loadCurve(sec);
            // once the timeline ends the fronts keep moving a little so the last of each shape cools down
            const extra = reduceMotion ? 10 : Math.max(0, sec - LOAD_SECONDS) * 0.35;
            const settle = reduceMotion || sec > LOAD_SECONDS + 0.9;
            if (loadProgress < 1) logoBurner?.wake();
            const time = now / 1000;
            const logoFront = logoBurner ? logoBurner.frontFor(loadProgress) + extra : 0;
            burnEdgeWord = logoBurner ? logoBurner.across(logoFront) : loadProgress;
            const burningAway = completeAt >= 0 && !reduceMotion && (now - completeAt) / 1000 >= OUT_START;
            logoEmbersOn = !burningAway && !(reduceMotion && completeAt >= 0);
            const lTotals = logoBurner && !burningAway ? logoBurner.draw(logoFront, time, settle) : null;

            // the percent is measured from the burn itself (headline + logo ink), so 100% is exactly
            // when the last pixel lights; falls back to the timeline before the canvases are ready
            const total = lTotals?.total ?? 0;
            const burnt = burningAway ? 1 : total > 0 ? (lTotals?.burnt ?? 0) / total : loadProgress;
            currentLogoBurn = Math.min(1, Math.max(loadProgress, burnt));
            const done = loadProgress >= 0.999 || burnt >= 0.999;

            // word fully lit: flare the flame and release rising embers, once per load
            if (done && flaredForLoad !== loadStartRef.current) {
                flaredForLoad = loadStartRef.current;
                completeAt = now;
                flareStartRef.current = now;
                burstRef.current += 16;
            }
            const since = completeAt < 0 ? -1 : (now - completeAt) / 1000;
            // percent fades out after completion; during loading (since < 0), the bottom flame is already actively burning
            // and rising in lockstep with the logo burn-in (0% -> 100%)
            const glow = since < 0 ? 1 : Math.max(0, 1 - since / 0.6);
            const curS = settingsRef.current;
            const flareEnv = evaluateFlare(now - flareStartRef.current, curS);
            const endRatio = Math.min(1, Math.max(0, (curS.flareEndHeight ?? 0) / Math.max(0.1, curS.idle)));
            const flameOutRemain = flareEnv.dieProgress === 0
                ? 1
                : Math.pow(Math.max(0, 1 - flareEnv.dieProgress), 1.75);
            const preloaderFade = since < 0
                ? Math.min(1, Math.pow(Math.max(0, currentLogoBurn), 0.45) * 1.35)
                : flameOutRemain;
            const meltCutoff = since > MELT_START
                ? Math.max(0, 1 - (since - MELT_START) / (DONE_AT - MELT_START - 0.08))
                : 1;
            // If user triggered a manual flare preview while editing, let it flare up and die down to flareEndHeight
            const manualFlareActive = flareStartRef.current > 0 && (now - flareStartRef.current) < (curS.flareRise + curS.flareHold + curS.flareDecay + 0.6) * 1000;
            flameShown = reduceMotion
                ? 1
                : alwaysShowFlameRef.current
                    ? (manualFlareActive
                        ? Math.max(endRatio, flareEnv.f + (1 - flareEnv.f) * (1 - flareEnv.dieProgress * (1 - endRatio)))
                        : 1)
                    : Math.max(0, preloaderFade * meltCutoff);
            text.style.setProperty('--edge', glow.toFixed(3));
            updateLogo(since, time);
            // Drop the black overlay curtain once the logo is 2/3 burned through (MELT_START) so the page melts in from 0%->100%
            if (!revealFired && since >= 0 && (reduceMotion || since >= MELT_START)) {
                revealFired = true;
                onRevealRef.current?.();
                if (preloaderRef.current && reduceMotion) {
                    window.dispatchEvent(new CustomEvent('page-transition-preloader-progress', { detail: { progress: 1 } }));
                }
            }
            if (!doneFired && since >= 0 && (reduceMotion || (handedOff && since >= DONE_AT))) {
                doneFired = true;
                onDoneRef.current?.();
            }

            const pct = done ? 100 : Math.min(99, Math.floor(burnt * 100));

            // Compute active UI step (1..6)
            let curStep = 1;
            if (!done) {
                curStep = pct < 5 ? 1 : 2;
            } else if (since < OUT_START) {
                curStep = 3;
            } else if (since < OUT_START + OUT_DUR * 0.55) {
                curStep = 4;
            } else if (since < DONE_AT) {
                curStep = 5;
            } else {
                curStep = 6;
            }

            if (curStep !== lastReportedStep || pct !== lastReportedPct) {
                if (curStep !== lastReportedStep) setActiveStep(curStep);
                lastReportedStep = curStep;
                lastReportedPct = pct;
                onStepChangeRef.current?.(curStep, pct);
            }
        };
        const inv = new THREE.Matrix4();
        const timer = new THREE.Timer();
        let frames = 0;
        let lastFps = performance.now();
        let raf = 0;

        const tick = () => {
            const now = performance.now();
            timer.update(now);
            const dt = Math.min(timer.getDelta(), 0.05);
            updateLoader(now);
            const s = settingsRef.current;
            const slots = s.flames ?? FIVE_FLAME_DEFAULTS;
            const selIdx = s.selectedIndex ?? 0;

            // When Auto-Loop Burst is enabled in the Flame Studio UI, automatically re-trigger the gas burst cycle
            if (alwaysShowFlameRef.current && s.autoLoopBurst) {
                const maxCycleMs = Math.max(
                    1200,
                    ...slots.map(sl => ((sl.flareDelay ?? 0) + sl.flareRise + sl.flareHold + sl.flareDecay + 0.42) * 1000)
                );
                if (flareStartRef.current <= 0 || (now - flareStartRef.current) >= maxCycleMs) {
                    flareStartRef.current = now;
                    burstRef.current += 16;
                }
            }

            const hasFlared = flareStartRef.current > -Infinity && (now >= flareStartRef.current);
            let maxFlareF = 0;

            flameUnits.forEach((unit, idx) => {
                const slot = slots[idx] ?? s;
                const isVisible = idx === selIdx;
                unit.fire.visible = isVisible;
                unit.glow.visible = isVisible;
                if (!isVisible) return;

                const flareEnv = evaluateFlare(now - flareStartRef.current, slot);
                const f = flareEnv.f;
                const swell = flareEnv.swell;
                if (f > maxFlareF) maxFlareF = f;

                const endH = slot.flareEndHeight ?? 0;
                const endRatio = Math.min(1, Math.max(0, endH / Math.max(0.1, slot.idle)));
                const slotFade = flareEnv.dieProgress === 0
                    ? Math.min(1, Math.max(0.75, f))
                    : Math.max(endRatio, (f / Math.max(0.8, slot.flarePeakHeight ?? 1.28)) + (1 - flareEnv.dieProgress) * endRatio);

                const slotBurstDurationMs = ((slot.flareDelay ?? 0) + slot.flareRise + slot.flareHold + slot.flareDecay) * 1000;
                const msSinceFlare = now - flareStartRef.current;
                const inManualBurst = hasFlared && msSinceFlare < slotBurstDurationMs + 320;

                // Exact uHeight where the flame tip touches 0px at the bottom edge of the viewport (worldY = -1.385)
                const BOTTOM_SCREEN_Y = -1.385;
                const baseScaleY = 2.4 * slot.scale;
                const boxCenterY = 0.6 * slot.scale + slot.posY;
                const edgeUHeight = Math.min(0.75, Math.max(0.05, 0.5 + (BOTTOM_SCREEN_Y - boxCenterY) / baseScaleY));
                const maxReach = Math.max(0.1, slot.idle); // User-controlled "Height at 100%" (10% to 200%)

                let unitShown: number;
                let effectiveReach: number;

                if (alwaysShowFlameRef.current) {
                    if (s.autoLoopBurst && hasFlared) {
                        unitShown = reduceMotion ? 1 : slotFade;
                        if (flareEnv.dieProgress === 0) {
                            effectiveReach = maxReach * f;
                        } else {
                            const remain = Math.pow(Math.max(0, 1 - flareEnv.dieProgress), 1.55);
                            effectiveReach = endH + (maxReach - endH) * remain;
                        }
                    } else if (inManualBurst) {
                        const relightBlend = msSinceFlare > slotBurstDurationMs
                            ? Math.min(1, (msSinceFlare - slotBurstDurationMs) / 320)
                            : 0;
                        const burstFade = Math.max(0.22, slotFade);
                        unitShown = reduceMotion ? 1 : burstFade + (1 - burstFade) * relightBlend;

                        const targetEnd = Math.max(endH, maxReach * 0.25);
                        const burstReach = flareEnv.dieProgress === 0
                            ? maxReach * f
                            : targetEnd + (maxReach - targetEnd) * Math.pow(Math.max(0, 1 - flareEnv.dieProgress), 1.55);
                        effectiveReach = burstReach + (maxReach - burstReach) * relightBlend;
                    } else {
                        // Live editor preview shows the exact height the flame reaches at 100%!
                        unitShown = 1;
                        effectiveReach = maxReach;
                    }
                } else {
                    unitShown = reduceMotion ? 1 : flameShown;
                    // Build smoothly from 0 at 0% (tip right at bottom edge, 0px visible) up to 1.0 * maxReach at 100%
                    const growth01 = Math.pow(Math.min(1, Math.max(0, currentLogoBurn)), 0.82);
                    if (hasFlared) {
                        if (flareEnv.dieProgress === 0) {
                            const crestBoost = 1 + Math.sin(flareEnv.riseProgress * Math.PI) * 0.05;
                            effectiveReach = maxReach * crestBoost;
                        } else {
                            const remain = Math.pow(Math.max(0, 1 - flareEnv.dieProgress), 1.55);
                            effectiveReach = maxReach * remain;
                        }
                    } else {
                        effectiveReach = growth01 * maxReach;
                    }
                }

                const currentHeight = Math.min(1.0, edgeUHeight + effectiveReach * (1 - edgeUHeight));
                const jumpOffsetY = -0.04 * (1 - Math.min(1, effectiveReach * 4)) * slot.scale;
                const extraScaleY = 1 + Math.max(0, effectiveReach - 1.0) * 0.45;

                const speedBoost = 1 + swell * (slot.flareSpeedBoost ?? 2.4);
                unit.uniforms.uTime.value += (reduceMotion ? dt * 0.25 : dt) * slot.speed * speedBoost;
                unit.uniforms.uWidth.value = slot.width * (1 + swell * 0.48);
                unit.uniforms.uSwell.value = swell;
                unit.uniforms.uHueBase.value = slot.hueBase;
                unit.uniforms.uLacunarity.value = slot.lacunarity;
                unit.uniforms.uGain.value = slot.gain;
                unit.uniforms.uHue.value = Math.min(360, slot.hue + swell * 16);
                unit.uniforms.uHeight.value = currentHeight;
                unit.uniforms.uMagnitude.value = slot.magnitude + swell * 0.85;
                unit.uniforms.uIntensity.value = slot.intensity * (1 + 1.15 * swell) * unitShown;

                const scaleX = 1.45 * slot.scale * (1 + swell * 0.24);
                const scaleY = 2.4 * slot.scale * extraScaleY * (1 + Math.max(0, f - 1) * 0.35);
                unit.fire.scale.set(scaleX, scaleY, 1);
                unit.fire.quaternion.copy(camera.quaternion);
                unit.fire.position.set(slot.posX, 0.6 * slot.scale + slot.posY + jumpOffsetY, 0);
                unit.glow.position.set(slot.posX, -0.62 * slot.scale + slot.posY, 0);
                unit.glow.scale.setScalar((0.65 + 0.55 * swell) * slot.scale);
                unit.glowMat.opacity = (0.35 + 0.35 * Math.min(1, f)) * unitShown;

                unit.fire.updateMatrixWorld();
                inv.copy(unit.fire.matrixWorld).invert();
                unit.uniforms.uCamLocal.value.copy(camera.position).applyMatrix4(inv);
            });

            const activeSlot = slots[selIdx] ?? s;
            controls.target.set(s.showAll5 ? 0 : activeSlot.posX, 0.2 * activeSlot.scale + activeSlot.posY, 0);

            updateEmbers(dt, now / 1000);

            if (controls.enabled) {
                controls.update();
            }
            renderer.render(scene, camera);
            drawEmbers();
            drawOrbit(dt, maxFlareF);

            frames++;
            if (now - lastFps > 500 && fpsRef.current) {
                fpsRef.current.textContent = `${Math.round((frames * 1000) / (now - lastFps))} fps`;
                frames = 0;
                lastFps = now;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('preloader-step-control', onExternalStepEvent);
            if (navLogo) { navLogo.style.opacity = ''; navLogo.style.transition = ''; }
            if (headerMeltTimer) clearTimeout(headerMeltTimer);
            if (siteHeader) { siteHeader.style.opacity = ''; siteHeader.style.transition = ''; siteHeader.style.pointerEvents = ''; siteHeader.style.animation = ''; }
            ro.disconnect();
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerup', onPointerUp);
            canvas.removeEventListener('pointercancel', onPointerUp);
            controls.dispose();
            controlsRef.current = null;
            fireGeo.dispose();
            glowGeo.dispose();
            glowTex.dispose();
            flameUnits.forEach(u => {
                u.fireMat.dispose();
                u.glowMat.dispose();
            });
            timer.dispose();
            renderer.dispose();
        };
    }, [preloader]);

    const updateActiveSlot = (patch: Partial<FlameSlot>) => {
        setSettings(prev => {
            const selIdx = prev.selectedIndex ?? 0;
            const curFlames = prev.flames ?? FIVE_FLAME_DEFAULTS;
            const nextFlames = curFlames.map((fl, idx) =>
                idx === selIdx ? { ...fl, ...patch } : fl
            );
            const active = nextFlames[selIdx];
            return { ...prev, ...active, flames: nextFlames };
        });
    };

    const applyPreset = (p: (typeof PRESETS)[number]) => {
        updateActiveSlot({
            presetId: p.id,
            magnitude: p.magnitude,
            lacunarity: p.lacunarity,
            gain: p.gain,
            hue: p.hue,
            intensity: p.intensity,
            width: p.width,
            speed: p.speed,
            hueBase: p.hueBase,
            idle: p.idle,
        });
        setPreset(p.id);
    };

    const resetPosition = () => {
        setSettings(prev => {
            const selIdx = prev.selectedIndex ?? 0;
            const nextFlames = FIVE_FLAME_DEFAULTS.map((def, idx) => ({
                ...(prev.flames?.[idx] ?? def),
                posX: def.posX,
                posY: def.posY,
                scale: def.scale,
            }));
            const active = nextFlames[selIdx];
            return { ...prev, ...active, flames: nextFlames };
        });
    };

    const RootTag = preloader ? 'div' : 'main';

    return (
        <RootTag className={preloader ? styles.preloaderRoot : styles.page}>
            <canvas
                ref={canvasRef}
                className={styles.stage}
                aria-label="Animated fire. Drag to move or rotate, scroll to zoom."
                data-lenis-prevent
            />
            <canvas ref={overlayRef} className={styles.embers} aria-hidden="true" />

            <p ref={textRef} className={styles.headline}>
                {/* the burning logo is the loader */}
                <span ref={logoRef} className={styles.logo}>
                    {/* invisible image sets the logo's size; the burning logo is drawn on the canvas */}
                    <img
                        src="/assets/logo.svg"
                        alt=""
                        aria-hidden="true"
                        width={170}
                        height={81}
                        className={styles.logoImg}
                        ref={logoImgRef}
                    />
                    <canvas ref={logoBurnRef} className={styles.burn} aria-hidden="true" />
                </span>
            </p>
            <span ref={navBurnWrapRef} className={styles.navBurnWrap} aria-hidden="true" hidden>
                <canvas ref={navBurnRef} className={styles.burn} aria-hidden="true" />
            </span>

            {!preloader && (<>
                <section id="fire-controls" aria-labelledby="fire-controls-heading" className={styles.panel}>
                    <h1 id="fire-controls-heading" className={styles.title}>5-Flame Lab</h1>

                    <div className={styles.presets} role="group" aria-label="Select one of the 5 flames">
                        {(settings.flames ?? FIVE_FLAME_DEFAULTS).map((slot, idx) => {
                            const isSel = (settings.selectedIndex ?? 0) === idx;
                            return (
                                <button
                                    key={slot.label}
                                    type="button"
                                    className={`${styles.preset} ${isSel ? styles.presetActive : ''}`}
                                    aria-pressed={isSel}
                                    onClick={() => {
                                        setSettings(prev => {
                                            const picked = (prev.flames ?? FIVE_FLAME_DEFAULTS)[idx];
                                            return { ...prev, ...picked, selectedIndex: idx };
                                        });
                                    }}
                                >
                                    {slot.enabled ? '🔥' : '🚫'} {slot.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.modeRow} role="group" aria-label="Multi-flame visibility">
                        <button
                            type="button"
                            className={`${styles.preset} ${settings.showAll5 ? styles.presetActive : ''}`}
                            aria-pressed={settings.showAll5}
                            onClick={() => setSettings(prev => ({ ...prev, showAll5: !prev.showAll5 }))}
                        >
                            {settings.showAll5 ? '👁 Showing All 5' : '1️⃣ Solo Selected'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.preset} ${settings.enabled ? styles.presetActive : ''}`}
                            aria-pressed={settings.enabled}
                            onClick={() => updateActiveSlot({ enabled: !settings.enabled })}
                        >
                            {settings.enabled ? '✅ Slot Enabled' : '🚫 Slot Muted'}
                        </button>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.presets} role="group" aria-label="Preset">
                        {PRESETS.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                className={`${styles.preset} ${preset === p.id ? styles.presetActive : ''}`}
                                aria-pressed={preset === p.id}
                                onClick={() => applyPreset(p)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {SLIDERS.map(sl => {
                        const numVal = Number(settings[sl.key] ?? 0);
                        return (
                            <div className={styles.ctl} key={sl.key}>
                                <label htmlFor={`fire-${sl.key}`}>
                                    {sl.label} <output>{sl.fmt(numVal)}</output>
                                </label>
                                <input
                                    id={`fire-${sl.key}`}
                                    type="range"
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    value={numVal}
                                    onChange={e => {
                                        updateActiveSlot({ [sl.key]: parseFloat(e.target.value) });
                                        setPreset(null);
                                    }}
                                />
                            </div>
                        );
                    })}

                    <div className={styles.divider} />

                    <div className={styles.presets} role="group" aria-label="Flare-up and die-down style">
                        {FLARE_PRESETS.map(fp => (
                            <button
                                key={fp.id}
                                type="button"
                                className={styles.preset}
                                title={fp.desc}
                                onClick={() => {
                                    updateActiveSlot({
                                        flareRise: fp.flareRise,
                                        flareHold: fp.flareHold,
                                        flareDecay: fp.flareDecay,
                                        flareEndHeight: fp.flareEndHeight,
                                        flarePeakHeight: fp.flarePeakHeight,
                                        flareBelly: fp.flareBelly,
                                        flareSpeedBoost: fp.flareSpeedBoost,
                                    });
                                    flareStartRef.current = performance.now();
                                    burstRef.current += 16;
                                }}
                            >
                                {fp.label}
                            </button>
                        ))}
                    </div>

                    {FLARE_SLIDERS.map(sl => {
                        const numVal = Number(settings[sl.key] ?? 0);
                        return (
                            <div className={styles.ctl} key={sl.key}>
                                <label htmlFor={`fire-${sl.key}`}>
                                    {sl.label} <output>{sl.fmt(numVal)}</output>
                                </label>
                                <input
                                    id={`fire-${sl.key}`}
                                    type="range"
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    value={numVal}
                                    onChange={e => {
                                        const val = parseFloat(e.target.value);
                                        updateActiveSlot({ [sl.key]: val });
                                        flareStartRef.current = performance.now();
                                        burstRef.current += 8;
                                    }}
                                />
                            </div>
                        );
                    })}

                    <div className={styles.divider} />

                    <div className={styles.modeRow} role="group" aria-label="Canvas drag mode">
                        <button
                            type="button"
                            className={`${styles.preset} ${dragMode === 'move' ? styles.presetActive : ''}`}
                            aria-pressed={dragMode === 'move'}
                            onClick={() => setDragMode('move')}
                        >
                            Drag Flame
                        </button>
                        <button
                            type="button"
                            className={`${styles.preset} ${dragMode === 'orbit' ? styles.presetActive : ''}`}
                            aria-pressed={dragMode === 'orbit'}
                            onClick={() => setDragMode('orbit')}
                        >
                            Rotate 3D
                        </button>
                    </div>

                    {POSITION_SLIDERS.map(sl => {
                        const numVal = Number(settings[sl.key] ?? 0);
                        return (
                            <div className={styles.ctl} key={sl.key}>
                                <label htmlFor={`fire-${sl.key}`}>
                                    {sl.label} <output>{sl.fmt(numVal)}</output>
                                </label>
                                <input
                                    id={`fire-${sl.key}`}
                                    type="range"
                                    min={sl.min}
                                    max={sl.max}
                                    step={sl.step}
                                    value={numVal}
                                    onChange={e => {
                                        const val = parseFloat(e.target.value);
                                        updateActiveSlot({ [sl.key]: val });
                                    }}
                                />
                            </div>
                        );
                    })}

                    <button type="button" className={styles.resetBtn} onClick={resetPosition}>
                        Center Flame (Reset)
                    </button>

                    <div className={styles.hint}>
                        <span>{dragMode === 'move' ? 'Drag flame to place' : 'Drag to rotate'}</span>
                        <span>Scroll to zoom</span>
                        <span ref={fpsRef}>— fps</span>
                    </div>
                </section>

                <section id="preloader-steps" aria-labelledby="preloader-steps-heading" className={styles.stepsPanel}>
                    <div className={styles.stepsHeader}>
                        <h2 id="preloader-steps-heading" className={styles.stepsTitle}>Preloader Steps</h2>
                        <div className={styles.stepsActions}>
                            <button
                                type="button"
                                className={`${styles.stepActionBtn} ${paused ? styles.stepActionActive : ''}`}
                                onClick={() => setPaused(p => !p)}
                            >
                                {paused ? '▶ Play' : '⏸ Pause'}
                            </button>
                            <button
                                type="button"
                                className={styles.stepActionBtn}
                                onClick={fireItUp}
                            >
                                ↻ Replay
                            </button>
                        </div>
                    </div>

                    <div className={styles.stepsList} role="group" aria-label="Jump to preloader step">
                        {PRELOADER_STEPS.map(step => {
                            const isCurrent = activeStep === step.id;
                            const isDone = activeStep > step.id;
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    className={`${styles.stepCard} ${isCurrent ? styles.stepCardActive : ''} ${isDone ? styles.stepCardDone : ''}`}
                                    aria-pressed={isCurrent}
                                    onClick={() => jumpToStep(step.id)}
                                >
                                    <div className={styles.stepTop}>
                                        <span className={styles.stepBadge}>{step.num}</span>
                                        <span className={styles.stepLabel}>{step.label}</span>
                                        <span className={styles.stepTiming}>{step.timing}</span>
                                    </div>
                                    <span className={styles.stepDesc}>{step.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <button type="button" className={styles.flare} onClick={fireItUp}>
                    Fire it up
                </button>
            </>)}

            <div ref={errorRef} className={styles.error} hidden>
                This browser couldn&apos;t start WebGL, so the fire can&apos;t render here.
            </div>
        </RootTag>
    );
}
