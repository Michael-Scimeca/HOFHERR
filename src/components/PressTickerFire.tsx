'use client';

import { useEffect, useRef, type RefObject } from 'react';
import styles from './PressTicker.module.css';

/* ───────────────────────── Shared WebGL1 Procedural Flame Synthesizer ───────────────────────── */

const VERT_SRC = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;

uniform float uTime;

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

/* Moody dimmed Hofherr Smokehouse palette: Deep Char -> Oxblood #8B0A10 -> Crimson #CC0E1D -> Ember #E85222 -> Muted Amber #F59B1A */
vec4 fireRamp(float heat, float dimScale) {
    float h = clamp(heat, 0.0, 1.0);
    vec3 c0 = vec3(0.14, 0.01, 0.02);
    vec3 c1 = vec3(0.55, 0.04, 0.06);
    vec3 c2 = vec3(0.80, 0.06, 0.11);
    vec3 c3 = vec3(0.91, 0.32, 0.13);
    vec3 c4 = vec3(0.96, 0.62, 0.18);

    vec3 col = mix(c0, c1, smoothstep(0.02, 0.28, h));
    col = mix(col, c2, smoothstep(0.26, 0.55, h));
    col = mix(col, c3, smoothstep(0.52, 0.80, h));
    col = mix(col, c4, smoothstep(0.76, 1.0, h));

    float a = smoothstep(0.03, 0.86, h) * dimScale;
    return vec4(col * a, a);
}

void main() {
    // 6-slot procedural volumetric burner flame atlas (modeled on FireTestClient.tsx flame physics)
    float slot = floor(vUv.x * 6.0);
    float lx = fract(vUv.x * 6.0) * 2.0 - 1.0; // -1..1 across slot
    float h = clamp(1.0 - vUv.y, 0.0, 1.0);    // 0 at bottom -> 1 at top
    float seed = slot * 11.73 + 3.1;
    float speed = 1.45 + mod(slot, 3.0) * 0.22;
    float t = uTime * speed;

    // Gas-belly swell + lateral wind sway
    float belly = sin(h * 3.14159) * 0.22;
    float radius = 0.56 * (1.0 - h * 0.82) + 0.04 + belly;
    float sway = snoise(vec2(h * 1.9 + seed, t * 0.58)) * 0.22 * h;
    float r = abs(lx + sway) / max(0.04, radius);

    float n = turb(vec2((lx + sway) * 1.85 + seed, h * 2.55 - t * 1.15));
    float fDetail = fbm(vec2((lx - sway) * 3.4 - seed, h * 3.9 - t * 1.65));

    float turbWeight = smoothstep(0.06, 0.72, h);
    float d = 1.0 - r - n * (0.28 + 0.92 * turbWeight) + (1.0 - h) * 0.22;
    d *= 0.82 + 0.36 * fDetail;
    d = clamp(d, 0.0, 1.0) * smoothstep(0.0, 0.16, h) * (1.0 - smoothstep(0.62, 0.99, h));
    d *= 1.0 - smoothstep(0.72, 1.0, abs(lx));

    float heat = clamp(d * 1.48 * (1.12 - h * 0.52), 0.0, 1.0);
    gl_FragColor = fireRamp(heat, 0.62);
}
`;

interface SharedGlRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    uTime: WebGLUniformLocation | null;
}

const ATLAS_SLOTS = 6;
const ATLAS_SLOT_W = 128;
const ATLAS_W = ATLAS_SLOTS * ATLAS_SLOT_W;
const ATLAS_H = 176;

let sharedGl: SharedGlRenderer | null | false = null;
let flameAtlasCanvas: HTMLCanvasElement | null = null;
let lastAtlasKey = '';

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
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

function getSharedGl(): SharedGlRenderer | null {
    if (sharedGl !== null) return sharedGl === false ? null : sharedGl;
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = ATLAS_W;
    canvas.height = ATLAS_H;

    const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true,
    });
    if (!gl) {
        sharedGl = false;
        return null;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
        sharedGl = false;
        return null;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        sharedGl = false;
        return null;
    }

    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    sharedGl = {
        canvas,
        gl,
        program,
        uTime: gl.getUniformLocation(program, 'uTime'),
    };
    return sharedGl;
}

function renderVolumetricAtlas(simTime: number): HTMLCanvasElement | null {
    const glRenderer = getSharedGl();
    if (!glRenderer) return null;

    if (!flameAtlasCanvas) {
        flameAtlasCanvas = document.createElement('canvas');
        flameAtlasCanvas.width = ATLAS_W;
        flameAtlasCanvas.height = ATLAS_H;
    }

    const frameKey = simTime.toFixed(3);
    if (frameKey === lastAtlasKey) return flameAtlasCanvas;
    lastAtlasKey = frameKey;

    const { canvas: glCanvas, gl } = glRenderer;
    gl.viewport(0, 0, ATLAS_W, ATLAS_H);
    gl.useProgram(glRenderer.program);
    gl.uniform1f(glRenderer.uTime, simTime);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const ctx = flameAtlasCanvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, ATLAS_W, ATLAS_H);
        ctx.drawImage(glCanvas, 0, 0, ATLAS_W, ATLAS_H);
    }
    return flameAtlasCanvas;
}

/* ───────────────────────── 4-Shape Canvas Embers (matches EmbersBackground.tsx) ───────────────────────── */

const EMBER_PALETTE = [
    '#ff8c00',
    '#ffa500',
    '#ff6600',
    '#ffb347',
    '#ff5518',
    '#ffcc66',
    '#e01e2e',
    '#ffd27f',
] as const;

const FLARE_PALETTE = ['#fff5cc', '#ffe4a0', '#ffd27f'] as const;

interface CanvasEmber {
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    flicker: number;
    flickerSpeed: number;
    wobble: number;
    wobbleSpeed: number;
    wobbleAmp: number;
    shape: number; // 0=streak, 1=oval, 2=shard, 3=teardrop
    rotation: number;
    rotSpeed: number;
    scaleX: number;
    scaleY: number;
    sides: number;
    baseColor: string;
    peakAlpha: number;
    layer: 'back' | 'front';
}

function between(a: number, b: number): number {
    return a + Math.random() * (b - a);
}

function createEmber(
    x: number,
    y: number,
    boost = 1,
    mode: 'icon' | 'logo' = 'icon',
): CanvasEmber {
    const isLogo = mode === 'logo';
    const isFlare = isLogo && Math.random() < 0.1;
    const maxLife = isLogo ? between(1.4, 2.35) : between(1.25, 2.75);

    return {
        x,
        y,
        px: x,
        py: y,
        vx: (isLogo ? between(-0.34, 0.34) : between(-0.46, 0.46)) * boost,
        vy: (isLogo ? between(-0.34, -0.78) : between(-0.52, -1.42)) * boost,
        size: isFlare
            ? between(1.35, 1.9)
            : isLogo
              ? between(0.88, 1.68)
              : between(0.68, 1.68),
        life: 0,
        maxLife,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: between(0.06, 0.16),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: between(0.022, 0.055),
        wobbleAmp: isLogo ? between(0.14, 0.38) : between(0.18, 0.52),
        shape: Math.floor(Math.random() * 4),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        scaleX: between(0.52, 1.0),
        scaleY: between(0.72, 1.28),
        sides: Math.floor(between(3, 6)),
        baseColor: isFlare
            ? FLARE_PALETTE[Math.floor(Math.random() * FLARE_PALETTE.length)]
            : EMBER_PALETTE[Math.floor(Math.random() * EMBER_PALETTE.length)],
        peakAlpha: isLogo ? between(0.68, 0.9) : 0.52,
        layer: isLogo ? 'back' : 'front',
    };
}

function drawEmberShape(ctx: CanvasRenderingContext2D, e: CanvasEmber, alpha: number, color: string) {
    const dx = e.x - e.px;
    const dy = e.y - e.py;
    const len = Math.sqrt(dx * dx + dy * dy);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (e.shape === 0) {
        const maxTail = Math.max(1.6, e.size * 2.1);
        const dirLen = len > 0.05 ? len : 1;
        const ux = len > 0.05 ? dx / dirLen : 0;
        const uy = len > 0.05 ? dy / dirLen : -1;
        const tailLen = Math.min(maxTail, Math.max(e.size * 1.25, len * 2.0));
        ctx.strokeStyle = color;
        ctx.lineWidth = e.size * 0.92;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(e.x - ux * tailLen, e.y - uy * tailLen);
        ctx.lineTo(e.x + ux * tailLen * 0.25, e.y + uy * tailLen * 0.25);
        ctx.stroke();
    } else if (e.shape === 1) {
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);
        ctx.scale(e.scaleX, e.scaleY);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, e.size * 1.15, 0, Math.PI * 2);
        ctx.fill();
    } else if (e.shape === 2) {
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);
        ctx.fillStyle = color;
        ctx.beginPath();
        const r = e.size * 1.08;
        for (let i = 0; i < e.sides; i++) {
            const ang = (i / e.sides) * Math.PI * 2;
            const px2 = Math.cos(ang) * r * e.scaleX;
            const py2 = Math.sin(ang) * r * e.scaleY;
            if (i === 0) ctx.moveTo(px2, py2);
            else ctx.lineTo(px2, py2);
        }
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.translate(e.x, e.y);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -e.size * 1.8);
        ctx.bezierCurveTo(e.size * 0.72, -e.size * 0.45, e.size * 0.72, e.size * 0.72, 0, e.size * 0.92);
        ctx.bezierCurveTo(-e.size * 0.72, e.size * 0.72, -e.size * 0.72, -e.size * 0.45, 0, -e.size * 1.8);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

/* ───────────────────────── Torch-On-Hover Canvas Stage ───────────────────────── */

interface MeasuredMark {
    kind: 'logo' | 'icon';
    plaque: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    seed: number;
    baseKey: string;
}

interface MeasuredRow {
    trackEl: HTMLElement;
    groupWidth: number;
    marks: MeasuredMark[];
}

export interface PressCanvasStageProps {
    containerRef: RefObject<HTMLDivElement | null>;
}

export function PressCanvasStage({ containerRef }: PressCanvasStageProps) {
    const backCanvasRef = useRef<HTMLCanvasElement>(null);
    const frontCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const host = containerRef.current;
        const backCanvas = backCanvasRef.current;
        const frontCanvas = frontCanvasRef.current;
        if (!host || !backCanvas || !frontCanvas) return;

        const backCtx = backCanvas.getContext('2d');
        const frontCtx = frontCanvas.getContext('2d');
        if (!backCtx || !frontCtx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        let stageW = 1;
        let stageH = 1;
        let rows: MeasuredRow[] = [];
        let disposed = false;

        const hoveredKeys = new Set<string>();
        const hoverHeat = new Map<string, number>();
        const sparks: CanvasEmber[] = [];

        const measureLayout = () => {
            if (disposed) return;
            stageW = Math.max(320, host.offsetWidth);
            stageH = Math.max(160, host.offsetHeight);

            const bw = Math.round(stageW * dpr);
            const bh = Math.round(stageH * dpr);
            if (backCanvas.width !== bw || backCanvas.height !== bh) {
                backCanvas.width = bw;
                backCanvas.height = bh;
            }
            if (frontCanvas.width !== bw || frontCanvas.height !== bh) {
                frontCanvas.width = bw;
                frontCanvas.height = bh;
            }

            const rowShells = host.querySelectorAll<HTMLElement>('[data-press-row]');
            const nextRows: MeasuredRow[] = [];

            rowShells.forEach((shell, rIdx) => {
                const trackEl = shell.querySelector<HTMLElement>('[data-press-track]');
                const firstGroup = trackEl?.querySelector<HTMLElement>('[data-press-group="0"]');
                if (!trackEl || !firstGroup) return;

                const groupWidth = firstGroup.offsetWidth;
                if (groupWidth <= 0) return;

                let rowTop = 0;
                let cur: HTMLElement | null = shell;
                while (cur && cur !== host) {
                    rowTop += cur.offsetTop;
                    cur = cur.offsetParent as HTMLElement | null;
                }

                const markEls = firstGroup.querySelectorAll<HTMLElement>('[data-fire-kind]');
                const marks: MeasuredMark[] = [];

                markEls.forEach((el, mIdx) => {
                    const kind = el.dataset.fireKind === 'icon' ? 'icon' : 'logo';
                    const plaque = el.dataset.firePlaque === 'true';
                    const visualEl = el.querySelector<HTMLElement>('[data-fire-visual]') ?? el;

                    let relX = 0;
                    let relY = 0;
                    let node: HTMLElement | null = visualEl;
                    while (node && node !== shell && node !== firstGroup) {
                        relX += node.offsetLeft;
                        relY += node.offsetTop;
                        node = node.offsetParent as HTMLElement | null;
                    }
                    if (node === firstGroup) {
                        relY += firstGroup.offsetTop;
                    }

                    const w = visualEl.offsetWidth;
                    const h = visualEl.offsetHeight;
                    if (w <= 1 || h <= 1) return;

                    marks.push({
                        kind,
                        plaque,
                        x: relX,
                        y: rowTop + relY,
                        w,
                        h,
                        seed: rIdx * 37 + mIdx * 5,
                        baseKey: `${rIdx}:${mIdx}:${kind}`,
                    });
                });

                nextRows.push({ trackEl, groupWidth, marks });
            });

            rows = nextRows;
        };

        const domImgs = Array.from(host.querySelectorAll<HTMLImageElement>('img'));
        const pendingImgs = domImgs.filter(img => !img.complete);
        const onImgReady = () => measureLayout();
        pendingImgs.forEach(img => img.addEventListener('load', onImgReady, { once: true }));

        measureLayout();
        const lateMeasure = window.setTimeout(measureLayout, 180);

        const ro = new ResizeObserver(measureLayout);
        ro.observe(host);
        host.querySelectorAll<HTMLElement>('[data-press-group="0"]').forEach(groupEl => {
            ro.observe(groupEl);
        });

        let raf = 0;
        let lastNow = performance.now();
        let simTime = Math.random() * 40;

        const blitAtlasFlame = (
            ctx: CanvasRenderingContext2D,
            atlas: HTMLCanvasElement,
            slotIdx: number,
            cx: number,
            baseY: number,
            flameW: number,
            flameH: number,
            mirror: boolean,
            alpha: number,
        ) => {
            if (alpha <= 0.01) return;
            const slot = ((slotIdx % ATLAS_SLOTS) + ATLAS_SLOTS) % ATLAS_SLOTS;
            const sx = slot * ATLAS_SLOT_W;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(cx, baseY - flameH);
            if (mirror) ctx.scale(-1, 1);
            ctx.drawImage(atlas, sx, 0, ATLAS_SLOT_W, ATLAS_H, -flameW * 0.5, 0, flameW, flameH);
            ctx.restore();
        };

        const tick = (now: number) => {
            if (disposed) {
                raf = 0;
                return;
            }

            const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
            lastNow = now;
            if (!reduceMotion) {
                simTime += dt;
            }

            if (rows.length === 0) {
                measureLayout();
            }

            backCtx.setTransform(1, 0, 0, 1, 0, 0);
            backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
            frontCtx.setTransform(1, 0, 0, 1, 0, 0);
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            const hasActiveTargets = hoveredKeys.size > 0 || hoverHeat.size > 0;
            let needsIconAtlas = false;
            if (hasActiveTargets) {
                for (const key of hoveredKeys) {
                    if (key.endsWith(':icon')) {
                        needsIconAtlas = true;
                        break;
                    }
                }
                if (!needsIconAtlas) {
                    for (const key of hoverHeat.keys()) {
                        if (key.endsWith(':icon')) {
                            needsIconAtlas = true;
                            break;
                        }
                    }
                }
            }
            const atlas = needsIconAtlas ? renderVolumetricAtlas(simTime) : null;

            if (hasActiveTargets) {
                for (const row of rows) {
                    const halfTrack = row.trackEl.offsetWidth * 0.5 || row.groupWidth * 2;
                    const copyStep = halfTrack * 0.5 || row.groupWidth;
                    const tfm = window.getComputedStyle(row.trackEl).transform;
                    const translateX = tfm && tfm !== 'none' ? new DOMMatrixReadOnly(tfm).m41 : 0;

                    for (let copyIdx = 0; copyIdx < 4; copyIdx++) {
                        const offsetX = copyIdx * copyStep + translateX;
                        if (offsetX + copyStep < -140 || offsetX > stageW + 140) continue;

                        for (let mIdx = 0; mIdx < row.marks.length; mIdx++) {
                            const mark = row.marks[mIdx];
                            const instanceKey = `${copyIdx}:${mark.baseKey}`;
                            const isHovered = hoveredKeys.has(instanceKey);
                            let heatVal = hoverHeat.get(instanceKey) ?? 0;

                            if (!isHovered && heatVal <= 0.004) continue;

                            const mx = mark.x + offsetX;
                            if (isHovered) {
                                const prev = heatVal;
                                heatVal = Math.min(1, heatVal + dt * 8.4);

                                if (!reduceMotion) {
                                    if (mark.kind === 'logo') {
                                        const spawnBehindLogo = (boost: number) => {
                                            if (mark.plaque) {
                                                // Solid rectangular plaques occlude their interior; spawn just behind top & side rims so embers emerge cleanly
                                                const ember =
                                                    Math.random() < 0.78
                                                        ? createEmber(
                                                              mx + mark.w * (0.04 + Math.random() * 0.92),
                                                              mark.y + Math.min(8, mark.h * (0.02 + Math.random() * 0.1)),
                                                              boost * 1.12,
                                                              'logo',
                                                          )
                                                        : createEmber(
                                                              Math.random() < 0.5
                                                                  ? mx + between(-3, 2)
                                                                  : mx + mark.w + between(-2, 3),
                                                              mark.y + mark.h * (0.1 + Math.random() * 0.62),
                                                              boost * 1.1,
                                                              'logo',
                                                          );
                                                ember.size *= 1.18;
                                                ember.peakAlpha = Math.min(0.96, ember.peakAlpha * 1.12);
                                                return ember;
                                            }
                                            // Open cutout wordmarks: spawn behind the letterforms so embers drift through gaps & past the top edge
                                            return createEmber(
                                                mx + mark.w * (-0.02 + Math.random() * 1.04),
                                                mark.y + mark.h * (0.24 + Math.random() * 0.64),
                                                boost,
                                                'logo',
                                            );
                                        };

                                        if (prev < 0.2 && heatVal >= 0.2) {
                                            const burstCount = mark.plaque ? 5 : mark.w > 170 ? 4 : 3;
                                            for (let k = 0; k < burstCount; k++) {
                                                sparks.push(spawnBehindLogo(1.06));
                                            }
                                        } else {
                                            const baseRate = Math.min(6.4, Math.max(4.0, mark.w * 0.028));
                                            const rate = mark.plaque ? baseRate * 1.35 : baseRate;
                                            if (Math.random() < dt * rate) {
                                                sparks.push(spawnBehindLogo(1.0));
                                            }
                                        }
                                    } else {
                                        // Circular butcher icons keep full torch flame + spark burst/trickle
                                        if (prev < 0.2 && heatVal >= 0.2) {
                                            for (let k = 0; k < 6; k++) {
                                                sparks.push(
                                                    createEmber(
                                                        mx + mark.w * (0.18 + Math.random() * 0.64),
                                                        mark.y + mark.h * 0.34,
                                                        1.28,
                                                        'icon',
                                                    ),
                                                );
                                            }
                                        } else if (Math.random() < dt * 7.5) {
                                            sparks.push(
                                                createEmber(
                                                    mx + mark.w * (0.14 + Math.random() * 0.72),
                                                    mark.y + mark.h * 0.42,
                                                    1.05,
                                                    'icon',
                                                ),
                                            );
                                        }
                                    }

                                    if (sparks.length > 140) {
                                        sparks.splice(0, sparks.length - 140);
                                    }
                                }
                            } else {
                                heatVal = Math.max(
                                    0,
                                    heatVal - dt * (mark.kind === 'logo' ? 4.5 : 1.55),
                                );
                            }

                            if (heatVal > 0.004) {
                                hoverHeat.set(instanceKey, heatVal);
                            } else {
                                hoverHeat.delete(instanceKey);
                                continue;
                            }

                            // Torch flames render ONLY behind circular butcher icons — never behind press logos
                            if (
                                mark.kind === 'icon' &&
                                atlas &&
                                mx + mark.w >= -90 &&
                                mx <= stageW + 90
                            ) {
                                backCtx.save();
                                backCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                                backCtx.globalCompositeOperation = 'lighter';

                                const baseY = mark.y + mark.h * 0.92;
                                const flareScale = 0.46 + 0.72 * Math.pow(heatVal, 0.65);
                                const cx = mx + mark.w * 0.5;
                                const refSize = Math.max(mark.h, mark.w * 0.78);
                                const flameW = mark.w * 1.75;
                                const flameH = refSize * 1.78 * flareScale;

                                blitAtlasFlame(
                                    backCtx,
                                    atlas,
                                    mark.seed,
                                    cx,
                                    baseY,
                                    flameW,
                                    flameH,
                                    mark.seed % 2 === 1,
                                    0.86 * heatVal,
                                );

                                backCtx.restore();
                            }
                        }
                    }
                }
            }

            if (sparks.length > 0 && !reduceMotion) {
                const frameStep = dt * 60;
                backCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                frontCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

                for (let i = sparks.length - 1; i >= 0; i--) {
                    const e = sparks[i];
                    e.life += dt;
                    if (e.life >= e.maxLife || e.y < -8) {
                        sparks.splice(i, 1);
                        continue;
                    }

                    const lr = e.life / e.maxLife;
                    const fadeIn = Math.min(1, lr * 9);
                    const fadeOut = Math.pow(Math.max(0, 1 - lr), 1.25);
                    const decel = Math.max(0.28, 1 - lr * 0.48);

                    e.flicker += e.flickerSpeed * frameStep;
                    e.wobble += e.wobbleSpeed * frameStep;
                    e.px = e.x;
                    e.py = e.y;
                    e.x += (e.vx + Math.sin(e.wobble) * e.wobbleAmp) * decel * frameStep;
                    e.y += e.vy * decel * frameStep;
                    e.rotation += e.rotSpeed * frameStep;

                    const flickerGain = 0.74 + 0.26 * Math.sin(e.flicker);
                    const topEdgeFade = Math.min(1, Math.max(0, (e.y + 4) / 18));
                    const alpha = fadeIn * fadeOut * flickerGain * topEdgeFade * e.peakAlpha;

                    if (alpha > 0.015) {
                        const color = lr > 0.88 ? '#3d1c0c' : e.baseColor;
                        const targetCtx = e.layer === 'back' ? backCtx : frontCtx;
                        drawEmberShape(targetCtx, e, alpha, color);
                    }
                }
            }

            // Sleep cleanly at 0% CPU/GPU once all hovered targets & trailing embers finish cooling
            if (hoveredKeys.size > 0 || hoverHeat.size > 0 || sparks.length > 0) {
                raf = requestAnimationFrame(tick);
            } else {
                raf = 0;
            }
        };

        const ensureRunning = () => {
            if (!raf && !disposed) {
                lastNow = performance.now();
                raf = requestAnimationFrame(tick);
            }
        };

        const onPointerOver = (e: PointerEvent) => {
            const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-fire-id]');
            const id = target?.dataset.fireId;
            if (!id) return;
            hoveredKeys.add(id);
            ensureRunning();
        };

        const onPointerOut = (e: PointerEvent) => {
            const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-fire-id]');
            const id = target?.dataset.fireId;
            if (!id) return;
            const related = e.relatedTarget as Node | null;
            if (related && target.contains(related)) return;
            hoveredKeys.delete(id);
            ensureRunning();
        };

        const onPointerLeaveHost = () => {
            if (hoveredKeys.size > 0) {
                hoveredKeys.clear();
                ensureRunning();
            }
        };

        host.addEventListener('pointerover', onPointerOver);
        host.addEventListener('pointerout', onPointerOut);
        host.addEventListener('pointerleave', onPointerLeaveHost);

        return () => {
            disposed = true;
            pendingImgs.forEach(img => img.removeEventListener('load', onImgReady));
            host.removeEventListener('pointerover', onPointerOver);
            host.removeEventListener('pointerout', onPointerOut);
            host.removeEventListener('pointerleave', onPointerLeaveHost);
            window.clearTimeout(lateMeasure);
            if (raf) cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [containerRef]);

    return (
        <>
            <canvas ref={backCanvasRef} className={styles.fireBackCanvas} aria-hidden="true" />
            <canvas ref={frontCanvasRef} className={styles.fireFrontCanvas} aria-hidden="true" />
        </>
    );
}
