import type { CanvasBurnId } from './BurnCanvasEngine';

export interface BurnShaderParams {
    heatBoost: number;   // 0.3..2.2 (default 1.0)
    bandScale: number;   // 0.4..2.2 (default 1.0)
    smokeScale: number;  // 0.0..1.5 (default 1.0)
    turbScale: number;   // 0.2..2.5 (default 1.0)
    sparkScale: number;  // 0.0..1.5 (default 0.5)
    flowSpeed: number;   // 0.2..3.0 (default 1.0)
    reverse: boolean;    // flip inward <-> outward
    transparentVoid?: boolean; // when true, burned-out area stays transparent so background embers stay visible
}

export const DEFAULT_BURN_PARAMS: BurnShaderParams = {
    heatBoost: 1.0,
    bandScale: 1.0,
    smokeScale: 1.0,
    turbScale: 1.0,
    sparkScale: 0.4,
    flowSpeed: 1.0,
    reverse: false,
};

const VERT_SRC = /* glsl */ `
precision highp float;
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/* Exact Hofherr Preloader Simplex / FBM / Turbulence / Smokehouse Fire Ramp Shader */
const FRAG_SRC = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;

uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform int uMode;
uniform float uHeatBoost;
uniform float uBandScale;
uniform float uSmokeScale;
uniform float uTurbScale;
uniform float uSparkScale;
uniform float uFlowSpeed;
uniform float uReverse;
uniform float uTransparentVoid;

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
    for (int i = 0; i < 4; i++) {
        v += a * snoise(p);
        p = p * 2.06 + vec2(13.1, -7.4);
        a *= 0.5;
    }
    return v * 0.5 + 0.5;
}

float turb(vec2 p) {
    float v = 0.0;
    float a = 0.54;
    for (int i = 0; i < 4; i++) {
        v += a * abs(snoise(p));
        p = p * 2.15 + vec2(-9.2, 5.7);
        a *= 0.5;
    }
    return v;
}

/* Exact Hofherr Preloader Smokehouse palette:
   Deep Char -> Oxblood #8B0A10 -> Crimson #CC0E1D -> Ember #E85222 -> Muted Amber #F59B1A -> White-Gold Core */
vec3 preloaderFireColor(float heat) {
    float h = clamp(heat, 0.0, 1.0);
    vec3 c0 = vec3(0.14, 0.01, 0.02);
    vec3 c1 = vec3(0.55, 0.04, 0.06);
    vec3 c2 = vec3(0.80, 0.06, 0.11);
    vec3 c3 = vec3(0.91, 0.32, 0.13);
    vec3 c4 = vec3(0.96, 0.62, 0.18);
    vec3 c5 = vec3(1.00, 0.92, 0.72);

    vec3 col = mix(c0, c1, smoothstep(0.02, 0.24, h));
    col = mix(col, c2, smoothstep(0.22, 0.48, h));
    col = mix(col, c3, smoothstep(0.46, 0.72, h));
    col = mix(col, c4, smoothstep(0.70, 0.90, h));
    col = mix(col, c5, smoothstep(0.88, 1.0, h));
    return col;
}

void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    if (p <= 0.002) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec2 uv = vUv;
    vec2 centered = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    float dist = length(centered);
    float maxR = length(vec2(0.5 * uAspect, 0.5));
    float ndist = dist / maxR; // 0 at center -> 1 at corner
    float ang = atan(centered.y, centered.x);
    float t = uTime * uFlowSpeed;

    // Animated turbulent flame noise (exact preloader upward-licking motion)
    float flameTurb = turb(vec2(uv.x * 4.2 * uTurbScale, uv.y * 4.2 * uTurbScale + t * 1.15));
    float flameDetail = fbm(vec2(uv.x * 7.5 * uTurbScale - t * 0.35, uv.y * 7.5 * uTurbScale + t * 1.75));
    float swirlTurb = turb(vec2(ang * 2.2 - ndist * 4.5 * uTurbScale + t * 0.9, ndist * 5.2 * uTurbScale - t * 1.4));

    float field = 0.0;
    float band = 0.14;
    float flameBoost = 1.0;
    float smokeAmt = 0.0;
    float sparkAmt = 0.0;

    if (uMode == 0) {
        // 11: Organic Noise Paper Burn
        field = 0.22 * (1.0 - uv.y) + 0.18 * (1.0 - uv.x) + 0.58 * flameDetail + (flameTurb - 0.4) * 0.18;
        band = 0.14;
    } else if (uMode == 1) {
        // 12: Bottom-Up Flame Wall
        float wave = snoise(vec2(uv.x * 5.0, t * 1.4)) * 0.08;
        field = (1.0 - uv.y) + wave + (flameTurb - 0.5) * 0.28;
        band = 0.18;
    } else if (uMode == 2) {
        // 13: Expanding Magma Crater
        field = ndist + (flameTurb - 0.45) * 0.26;
        band = 0.16;
    } else if (uMode == 3) {
        // 15: Blowtorch Sweep
        float beamY = abs(uv.y - 0.5) * 0.32;
        field = uv.x * 0.85 + beamY + (flameTurb - 0.45) * 0.22;
        band = 0.16;
    } else if (uMode == 4) {
        // 17: Ember Vortex Incineration
        float spiral = sin(ang * 3.0 - ndist * 11.0 + t * 3.2) * 0.09;
        field = (1.0 - ndist) + spiral + (swirlTurb - 0.45) * 0.22;
        band = 0.17;
    } else if (uMode == 5) {
        // 18: Smoldering Match-Drop
        float d1 = length((uv - vec2(0.22, 0.28)) * vec2(uAspect, 1.0)) * 1.4;
        float d2 = length((uv - vec2(0.76, 0.30)) * vec2(uAspect, 1.0)) * 1.4 + 0.07;
        float d3 = length((uv - vec2(0.48, 0.54)) * vec2(uAspect, 1.0)) * 1.4 + 0.03;
        float d4 = length((uv - vec2(0.18, 0.76)) * vec2(uAspect, 1.0)) * 1.4 + 0.11;
        float d5 = length((uv - vec2(0.82, 0.74)) * vec2(uAspect, 1.0)) * 1.4 + 0.08;
        float d6 = length((uv - vec2(0.50, 0.18)) * vec2(uAspect, 1.0)) * 1.4 + 0.13;
        field = min(min(min(d1, d2), min(d3, d4)), min(d5, d6)) + (flameTurb - 0.45) * 0.22;
        band = 0.15;
    } else if (uMode == 6) {
        // 19: Smokehouse Ember Curtain
        field = (1.0 - uv.y) + (flameDetail - 0.5) * 0.22;
        band = 0.16;
    } else if (uMode == 7) {
        // 20: Twin-Pincer Flame Wave
        float edge = min(uv.y, 1.0 - uv.y) * 2.0;
        field = edge + (flameTurb - 0.45) * 0.24;
        band = 0.16;
    } else if (uMode == 8) {
        // 21: Crimson Firestorm Funnel (3-arm volumetric preloader fire vortex)
        float spiral = sin(ang * 3.0 - ndist * 10.5 + t * 3.8 + p * 4.5) * 0.11;
        float licks = turb(vec2(ang * 3.0 - ndist * 6.0 + t * 1.6, ndist * 6.0 - t * 2.2));
        field = (1.0 - ndist) + spiral + (licks - 0.45) * 0.28;
        band = 0.22;
        flameBoost = 1.25;
    } else if (uMode == 9) {
        // 22: Twin-Helix Fire Cyclone (counter-rotating double helix)
        float a1 = sin(ang * 2.0 - ndist * 13.0 + t * 4.2 + p * 5.0) * 0.12;
        float a2 = sin(ang * 2.0 + ndist * 9.0 - t * 3.4) * 0.08;
        field = (1.0 - ndist) + a1 + a2 + (swirlTurb - 0.45) * 0.26;
        band = 0.22;
        flameBoost = 1.25;
    } else if (uMode == 10) {
        // 23: Outward Fire Ring Vortex (spinning center sun expanding outward)
        float spiral = sin(ang * 4.0 - ndist * 10.0 + t * 4.0 + p * 4.0) * 0.09;
        field = ndist + spiral + (swirlTurb - 0.45) * 0.25;
        band = 0.22;
        flameBoost = 1.25;
    } else if (uMode == 11) {
        // 24: Smokehouse Draft Swirl (thick turbulent smoke + deep oxblood fire)
        float swirl = sin(ang * 2.0 - ndist * 8.0 + t * 2.4) * 0.12;
        field = (1.0 - ndist) + swirl + (flameTurb - 0.4) * 0.34;
        band = 0.26;
        flameBoost = 0.95;
    } else if (uMode == 12) {
        // 25: Solar Flare Pinwheel (6 razor plasma arms)
        float blades = sin(ang * 6.0 - ndist * 14.0 + t * 5.2 + p * 6.0) * 0.14;
        field = (1.0 - ndist) + blades + (swirlTurb - 0.45) * 0.22;
        band = 0.21;
        flameBoost = 1.35;
    } else if (uMode == 13) {
        // 26: Black-Hole Hearth Collapse (tight incandescent accretion fire ring)
        float acc = turb(vec2(ang * 4.0 + t * 2.5, ndist * 8.0 - t * 2.8));
        field = (1.0 - ndist) + (acc - 0.45) * 0.18;
        band = 0.19;
        flameBoost = 1.45;
    } else if (uMode == 14) {
        // 27: Bottom-Up Fire Tornado (hearth fire whirl climbing from bottom-center)
        float sway = sin(uv.y * 7.5 + t * 4.2) * 0.13 * (1.0 - uv.y);
        float dx = abs(uv.x - 0.5 + sway);
        float funnelW = 0.10 + (1.0 - uv.y) * 0.52;
        float whirl = turb(vec2((uv.x - 0.5) * 6.5 + sin(uv.y * 10.0 + t * 5.0), uv.y * 4.8 + t * 2.6));
        field = (dx / funnelW) * 0.52 + (1.0 - uv.y) * 0.42 + (whirl - 0.45) * 0.28;
        band = 0.23;
        flameBoost = 1.3;
    } else if (uMode == 15) {
        // 28: Four-Corner Fire Maelstrom (4 spinning vortices merging)
        vec2 c0 = (uv - vec2(0.12, 0.16)) * vec2(uAspect, 1.0);
        vec2 c1 = (uv - vec2(0.88, 0.16)) * vec2(uAspect, 1.0);
        vec2 c2 = (uv - vec2(0.12, 0.84)) * vec2(uAspect, 1.0);
        vec2 c3 = (uv - vec2(0.88, 0.84)) * vec2(uAspect, 1.0);
        float v0 = length(c0) * 1.15 + sin(atan(c0.y, c0.x) * 3.0 - length(c0) * 11.0 + t * 4.0) * 0.07;
        float v1 = length(c1) * 1.15 + sin(atan(c1.y, c1.x) * 3.0 - length(c1) * 11.0 + t * 4.0 + 1.0) * 0.07;
        float v2 = length(c2) * 1.15 + sin(atan(c2.y, c2.x) * 3.0 - length(c2) * 11.0 + t * 4.0 + 2.0) * 0.07;
        float v3 = length(c3) * 1.15 + sin(atan(c3.y, c3.x) * 3.0 - length(c3) * 11.0 + t * 4.0 + 3.0) * 0.07;
        field = min(min(v0, v1), min(v2, v3)) + (flameTurb - 0.45) * 0.22;
        band = 0.20;
        flameBoost = 1.25;
    } else if (uMode == 16) {
        // 29: Molten Ribbon Spiral (concentric coiling liquid fire)
        float coil = sin(ndist * 22.0 - ang * 2.0 + t * 4.2) * 0.10;
        field = (1.0 - ndist) + coil + (swirlTurb - 0.45) * 0.22;
        band = 0.21;
        flameBoost = 1.3;
    } else if (uMode == 17) {
        // 30: White-Hot Forge Supernova (accelerating vortex + supernova flash)
        float spiral = sin(ang * 5.0 - ndist * 13.0 + t * (4.0 + p * 6.0)) * 0.11;
        field = (1.0 - ndist) + spiral + (swirlTurb - 0.45) * 0.26;
        band = 0.23;
        flameBoost = 1.45;
    } else if (uMode == 18) {
        // 31: Slow Oxblood Coal Swirl (syrupy deep oxblood + wide billowing smoke veil)
        float swirl = sin(ang * 2.0 - ndist * 7.0 + t * 1.6) * 0.13;
        float billow = fbm(vec2(uv.x * 3.8 + t * 0.3, uv.y * 3.8 + t * 0.85));
        field = (1.0 - ndist) + swirl + (billow - 0.5) * 0.42;
        band = 0.30;
        flameBoost = 0.85;
        smokeAmt = 0.85;
    } else if (uMode == 19) {
        // 32: Hickory Chimney Updraft (diagonal bottom-left -> top-right curling smoke draft)
        float diag = (1.0 - uv.y) * 0.62 + uv.x * 0.38;
        float curl = sin((uv.x * 5.0 - uv.y * 4.0) + t * 2.2) * 0.09;
        field = diag + curl + (flameTurb - 0.45) * 0.34;
        band = 0.28;
        flameBoost = 0.92;
        smokeAmt = 0.80;
    } else if (uMode == 20) {
        // 33: Reverse Smokehouse Bloom (center smoke ring blooming outward in oxblood curls)
        float swirl = sin(ang * 2.0 - ndist * 8.5 + t * 2.4) * 0.11;
        field = ndist + swirl + (flameTurb - 0.45) * 0.32;
        band = 0.28;
        flameBoost = 0.98;
        smokeAmt = 0.78;
    } else if (uMode == 21) {
        // 34: Velvet Char & Ember Rim (ultra-wide soft smoke with thin glowing gold-crimson thread)
        float swirl = sin(ang * 2.0 - ndist * 7.5 + t * 2.0) * 0.11;
        field = (1.0 - ndist) + swirl + (flameDetail - 0.5) * 0.38;
        band = 0.32;
        flameBoost = 1.25;
        smokeAmt = 0.95;
    } else if (uMode == 22) {
        // 35: Double-Damper Cross Draft (two opposing left & right smoke eddies curling inward)
        vec2 cL = (uv - vec2(0.24, 0.52)) * vec2(uAspect, 1.0);
        vec2 cR = (uv - vec2(0.76, 0.48)) * vec2(uAspect, 1.0);
        float dL = length(cL) * 1.15 + sin(atan(cL.y, cL.x) * 2.0 - length(cL) * 9.0 + t * 2.4) * 0.09;
        float dR = length(cR) * 1.15 + sin(atan(cR.y, cR.x) * 2.0 + length(cR) * 9.0 - t * 2.4) * 0.09;
        field = (1.0 - min(dL, dR) * 0.88) + (flameTurb - 0.45) * 0.30;
        band = 0.27;
        flameBoost = 0.95;
        smokeAmt = 0.82;
    } else if (uMode == 23) {
        // 36: Deep Pit Smolder (moody dark velvet smoke with subtle pulsing red coal veins)
        float swirl = sin(ang * 2.0 - ndist * 6.5 + t * 1.4) * 0.12;
        field = (1.0 - ndist) + swirl + (flameTurb - 0.42) * 0.38;
        band = 0.34;
        flameBoost = 0.62;
        smokeAmt = 1.0;
    } else if (uMode == 24) {
        // 37: White-Oak Spark Swirl (rich #24 draft + swirling bright GPU oak sparks)
        float swirl = sin(ang * 2.0 - ndist * 8.5 + t * 2.8) * 0.12;
        field = (1.0 - ndist) + swirl + (flameTurb - 0.42) * 0.33;
        band = 0.27;
        flameBoost = 1.05;
        smokeAmt = 0.72;
        sparkAmt = 1.0;
    } else if (uMode == 25) {
        // 38: Spiral Butcher-Paper Singe (warm toasted brown smoke leading crisp oxblood fire)
        float swirl = sin(ang * 3.0 - ndist * 9.5 + t * 2.6) * 0.10;
        field = (1.0 - ndist) + swirl + (swirlTurb - 0.45) * 0.26;
        band = 0.24;
        flameBoost = 1.12;
        smokeAmt = 0.75;
    } else if (uMode == 26) {
        // 39: Barrel-Smoker Roll (rolling smoke eddies curling up from bottom edge)
        float eddy = sin(uv.x * 7.0 + sin(uv.y * 6.0 + t * 2.2) * 1.4) * 0.08;
        field = (1.0 - uv.y) + eddy + (flameTurb - 0.45) * 0.34;
        band = 0.30;
        flameBoost = 0.96;
        smokeAmt = 0.90;
    } else if (uMode == 27) {
        // 40: Midnight Inferno Velvet (high-contrast velvet smoke + vivid crimson-gold ribbons)
        float swirl = sin(ang * 3.0 - ndist * 9.0 + t * 3.0) * 0.13;
        field = (1.0 - ndist) + swirl + (flameTurb - 0.42) * 0.32;
        band = 0.26;
        flameBoost = 1.32;
        smokeAmt = 0.88;
        sparkAmt = 0.65;
    } else {
        // 41: Smokehouse Draft Left Sweep (exact #24 Smokehouse Draft look, linear right-to-left sweep — no radial swirl)
        float wave = sin(uv.y * 5.2 - uv.x * 3.5 + t * 2.2) * 0.055;
        field = (1.0 - uv.x) + wave + (flameTurb - 0.4) * 0.34;
        band = 0.26;
        flameBoost = 0.95;
    }

    // Apply user UI tuning overrides
    if (uReverse > 0.5) {
        field = 1.0 - field;
    }
    band *= uBandScale;
    flameBoost *= uHeatBoost;
    float effectiveSmoke = clamp(max(smokeAmt, 0.25) * uSmokeScale, 0.0, 1.5);
    float effectiveSpark = clamp(max(sparkAmt, uSparkScale > 0.01 ? uSparkScale : 0.0) * (sparkAmt > 0.01 ? uSparkScale : 1.0), 0.0, 1.5);

    // Smooth per-pixel burn front with volumetric preloader flame lip + optional smokehouse plume
    float edge = p * (1.0 + band * 2.2) - field;

    // 1. Burned void (opaque black where page is already consumed)
    float burnedMask = smoothstep(band * 0.72, band * 1.25, edge);

    // 2. Volumetric flame band straddling the burn rim (0..band)
    float flameEnv = smoothstep(0.0, band * 0.35, edge) * (1.0 - smoothstep(band * 0.55, band * 1.35, edge));
    if (uMode == 21) {
        // Velvet Char & Ember Rim: tighter, sharper glowing thread inside wide smoke
        flameEnv = smoothstep(band * 0.25, band * 0.42, edge) * (1.0 - smoothstep(band * 0.52, band * 0.72, edge));
    }
    float flameShape = flameEnv * (0.65 + 0.75 * flameTurb) * (0.78 + 0.42 * flameDetail) * flameBoost;

    // Fade flame out cleanly right at 100% completion
    float endFade = 1.0 - smoothstep(0.88, 1.0, p);
    flameShape *= endFade;

    vec3 fireCol = preloaderFireColor(clamp(flameShape * 1.15, 0.0, 1.0));

    // Optional rich hickory/velvet smoke halo ahead of the burn front
    float smokeAlpha = 0.0;
    vec3 smokeCol = vec3(0.09, 0.035, 0.018);
    if (effectiveSmoke > 0.01) {
        float smokeEnv = smoothstep(-band * 0.55, band * 0.35, edge) * (1.0 - smoothstep(band * 0.65, band * 1.55, edge));
        float smokeBillow = fbm(vec2(uv.x * 5.5 - t * 0.4, uv.y * 5.5 + t * 0.9));
        smokeAlpha = clamp(smokeEnv * smokeBillow * effectiveSmoke * 0.88 * endFade, 0.0, 0.92);
        if (uMode == 25) {
            // Toasted butcher-paper sepia smoke tint
            smokeCol = vec3(0.16, 0.075, 0.025);
        } else if (uMode == 23 || uMode == 27) {
            // Deep velvet charcoal smoke
            smokeCol = vec3(0.05, 0.015, 0.012);
        }
    }

    // Optional orbiting GPU white-oak sparks
    if (effectiveSpark > 0.01) {
        float spNoise = snoise(vec2(ang * 14.0 - ndist * 22.0 + t * 3.5, ndist * 26.0 - t * 4.5));
        float spMask = smoothstep(0.76, 0.94, spNoise) * smoothstep(-band * 0.3, band * 0.4, edge) * (1.0 - smoothstep(band * 0.8, band * 1.4, edge)) * endFade * effectiveSpark;
        fireCol += vec3(1.0, 0.86, 0.55) * spMask * 1.4;
        flameShape = max(flameShape, spMask);
    }

    // Peak supernova flash for mode 30
    if (uMode == 17) {
        float flash = max(0.0, 1.0 - abs(p - 0.76) * 5.0) * smoothstep(0.95, 0.0, ndist);
        fireCol += vec3(1.0, 0.85, 0.55) * flash * 0.9;
        flameShape = max(flameShape, flash * 0.85);
    }

    float flameAlpha = clamp(smoothstep(0.04, 0.78, flameShape), 0.0, 1.0);
    float voidAlpha = uTransparentVoid > 0.5 ? 0.0 : burnedMask;
    float outAlpha = max(max(voidAlpha, smokeAlpha), flameAlpha);
    vec3 baseCol = mix(smokeCol, vec3(0.0), voidAlpha);
    vec3 outColor = mix(baseCol, fireCol, clamp(flameAlpha * 1.25, 0.0, 1.0));

    gl_FragColor = vec4(outColor, outAlpha);
}
`;

const MODE_MAP: Partial<Record<CanvasBurnId, number>> = {
    'canvas-11-noise-burn': 0,
    'canvas-12-flame-wall': 1,
    'canvas-13-magma-crater': 2,
    'canvas-15-blowtorch': 3,
    'canvas-17-ember-vortex': 4,
    'canvas-18-match-drops': 5,
    'canvas-19-smokehouse-curtain': 6,
    'canvas-20-twin-pincer': 7,
    'vortex-21-crimson-firestorm': 8,
    'vortex-22-twin-helix': 9,
    'vortex-23-outward-fire-ring': 10,
    'vortex-24-smokehouse-draft': 11,
    'vortex-25-solar-pinwheel': 12,
    'vortex-26-blackhole-hearth': 13,
    'vortex-27-fire-tornado': 14,
    'vortex-28-four-corner-maelstrom': 15,
    'vortex-29-molten-ribbon': 16,
    'vortex-30-forge-supernova': 17,
    'smoke-31-oxblood-coal': 18,
    'smoke-32-chimney-updraft': 19,
    'smoke-33-reverse-bloom': 20,
    'smoke-34-velvet-ember-rim': 21,
    'smoke-35-double-damper': 22,
    'smoke-36-deep-pit-smolder': 23,
    'smoke-37-white-oak-sparks': 24,
    'smoke-38-butcher-paper-singe': 25,
    'smoke-39-barrel-smoke-roll': 26,
    'smoke-40-midnight-velvet': 27,
    'smoke-41-left-sweep': 28,
};

export interface BurnWebGLContext {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    uTime: WebGLUniformLocation | null;
    uProgress: WebGLUniformLocation | null;
    uAspect: WebGLUniformLocation | null;
    uMode: WebGLUniformLocation | null;
    uHeatBoost: WebGLUniformLocation | null;
    uBandScale: WebGLUniformLocation | null;
    uSmokeScale: WebGLUniformLocation | null;
    uTurbScale: WebGLUniformLocation | null;
    uSparkScale: WebGLUniformLocation | null;
    uFlowSpeed: WebGLUniformLocation | null;
    uReverse: WebGLUniformLocation | null;
    uTransparentVoid: WebGLUniformLocation | null;
}

export function isWebGLBurnId(id: CanvasBurnId): boolean {
    return MODE_MAP[id] !== undefined;
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

export function initBurnWebGL(canvas: HTMLCanvasElement): BurnWebGLContext | null {
    const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        depth: false,
        stencil: false,
    });
    if (!gl) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return null;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    return {
        gl,
        program,
        uTime: gl.getUniformLocation(program, 'uTime'),
        uProgress: gl.getUniformLocation(program, 'uProgress'),
        uAspect: gl.getUniformLocation(program, 'uAspect'),
        uMode: gl.getUniformLocation(program, 'uMode'),
        uHeatBoost: gl.getUniformLocation(program, 'uHeatBoost'),
        uBandScale: gl.getUniformLocation(program, 'uBandScale'),
        uSmokeScale: gl.getUniformLocation(program, 'uSmokeScale'),
        uTurbScale: gl.getUniformLocation(program, 'uTurbScale'),
        uSparkScale: gl.getUniformLocation(program, 'uSparkScale'),
        uFlowSpeed: gl.getUniformLocation(program, 'uFlowSpeed'),
        uReverse: gl.getUniformLocation(program, 'uReverse'),
        uTransparentVoid: gl.getUniformLocation(program, 'uTransparentVoid'),
    };
}

export function renderWebGLBurnFrame(
    ctx: BurnWebGLContext,
    w: number,
    h: number,
    id: CanvasBurnId,
    progress: number,
    timeSec: number,
    params: BurnShaderParams = DEFAULT_BURN_PARAMS,
) {
    const { gl } = ctx;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const mode = MODE_MAP[id];
    if (mode === undefined || progress <= 0.002) return;

    gl.useProgram(ctx.program);
    gl.uniform1f(ctx.uTime, timeSec);
    gl.uniform1f(ctx.uProgress, progress);
    gl.uniform1f(ctx.uAspect, w / Math.max(1, h));
    gl.uniform1i(ctx.uMode, mode);
    gl.uniform1f(ctx.uHeatBoost, params.heatBoost);
    gl.uniform1f(ctx.uBandScale, params.bandScale);
    gl.uniform1f(ctx.uSmokeScale, params.smokeScale);
    gl.uniform1f(ctx.uTurbScale, params.turbScale);
    gl.uniform1f(ctx.uSparkScale, params.sparkScale);
    gl.uniform1f(ctx.uFlowSpeed, params.flowSpeed);
    gl.uniform1f(ctx.uReverse, params.reverse ? 1.0 : 0.0);
    gl.uniform1f(ctx.uTransparentVoid, params.transparentVoid ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

