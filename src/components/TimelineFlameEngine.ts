export type TimelineFlameStyle = 'none' | 'sparkler' | 'preloader' | 'trail' | 'smokehouse' | 'inferno';

export interface TimelineFlameTuning {
    style: TimelineFlameStyle;
    trailLen: number;
    spacing: number;
    widthScale: number;
    heightScale: number;
    speed: number;
    opacity: number;
    sparks: number;
    halo: number;
}

export const DEFAULT_TIMELINE_FLAME_TUNING: TimelineFlameTuning = {
    style: 'trail',
    trailLen: 100,
    spacing: 8,
    widthScale: 0.55,
    heightScale: 0.85,
    speed: 1.0,
    opacity: 0.65,
    sparks: 0,
    halo: 0.9,
};

export const TIMELINE_FLAME_OPTIONS: {
    id: TimelineFlameStyle;
    num: string;
    label: string;
    desc: string;
}[] = [
    { id: 'none', num: '00', label: 'Line Only', desc: 'Clean glowing SVG line with no canvas fire' },
    { id: 'preloader', num: '01', label: 'Flame Head', desc: 'Volumetric rising flame tongue at the burning fuse tip' },
    { id: 'trail', num: '02', label: 'Burning Trail', desc: 'Volumetric WebGL fire rising along the freshly lit line' },
    { id: 'sparkler', num: '03', label: 'Fuse Sparkler', desc: 'White-hot ignition tip spraying directional ember sparks' },
    { id: 'smokehouse', num: '04', label: 'Smokehouse', desc: 'Curling hickory smoke & slow-drifting oak embers along the path' },
    { id: 'inferno', num: '05', label: 'Inferno Comet', desc: 'Full volumetric flame head + fire trail + twin spark jets' },
];

export interface PathSample {
    x: number;
    y: number;
    len: number;
    tx: number;
    ty: number;
}

interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
    isSmoke?: boolean;
}

/* ── Shared WebGL1 Procedural Volumetric Flame Atlas (matches PressTickerFire / Hofherr Smokehouse Fire) ── */
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

/* Hofherr Smokehouse palette: Deep Char -> Oxblood #8B0A10 -> Crimson #CC0E1D -> Ember #E85222 -> Bright Gold #FFD278 */
vec4 fireRamp(float heat, float intensity) {
    float h = clamp(heat, 0.0, 1.0);
    vec3 c0 = vec3(0.14, 0.01, 0.02);
    vec3 c1 = vec3(0.55, 0.04, 0.06);
    vec3 c2 = vec3(0.80, 0.06, 0.11);
    vec3 c3 = vec3(0.95, 0.36, 0.12);
    vec3 c4 = vec3(1.00, 0.78, 0.34);

    vec3 col = mix(c0, c1, smoothstep(0.02, 0.25, h));
    col = mix(col, c2, smoothstep(0.24, 0.50, h));
    col = mix(col, c3, smoothstep(0.48, 0.76, h));
    col = mix(col, c4, smoothstep(0.74, 1.0, h));

    float a = smoothstep(0.03, 0.84, h) * intensity;
    return vec4(col * a, a);
}

void main() {
    float slot = floor(vUv.x * 6.0);
    float lx = fract(vUv.x * 6.0) * 2.0 - 1.0;
    float h = clamp(1.0 - vUv.y, 0.0, 1.0);
    float seed = slot * 11.73 + 3.1;
    float speed = 1.55 + mod(slot, 3.0) * 0.25;
    float t = uTime * speed;

    float belly = sin(h * 3.14159) * 0.22;
    float radius = 0.56 * (1.0 - h * 0.82) + 0.04 + belly;
    float sway = snoise(vec2(h * 1.9 + seed, t * 0.62)) * 0.24 * h;
    float r = abs(lx + sway) / max(0.04, radius);

    float n = turb(vec2((lx + sway) * 1.85 + seed, h * 2.55 - t * 1.25));
    float fDetail = fbm(vec2((lx - sway) * 3.4 - seed, h * 3.9 - t * 1.75));

    float turbWeight = smoothstep(0.06, 0.72, h);
    float d = 1.0 - r - n * (0.28 + 0.92 * turbWeight) + (1.0 - h) * 0.24;
    d *= 0.82 + 0.36 * fDetail;
    d = clamp(d, 0.0, 1.0) * smoothstep(0.0, 0.14, h) * (1.0 - smoothstep(0.62, 0.99, h));
    d *= 1.0 - smoothstep(0.72, 1.0, abs(lx));

    float heat = clamp(d * 1.55 * (1.14 - h * 0.5), 0.0, 1.0);
    gl_FragColor = fireRamp(heat, 0.86);
}
`;

const ATLAS_SLOTS = 6;
const ATLAS_SLOT_W = 128;
const ATLAS_W = ATLAS_SLOTS * ATLAS_SLOT_W;
const ATLAS_H = 176;

interface TimelineGlAtlas {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    uTime: WebGLUniformLocation | null;
}

let timelineGl: TimelineGlAtlas | null | false = null;
let timelineAtlas2d: HTMLCanvasElement | null = null;
let lastTimelineAtlasKey = '';

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

function getTimelineGl(): TimelineGlAtlas | null {
    if (timelineGl !== null) return timelineGl === false ? null : timelineGl;
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
        timelineGl = false;
        return null;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
        timelineGl = false;
        return null;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        timelineGl = false;
        return null;
    }

    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    timelineGl = {
        canvas,
        gl,
        program,
        uTime: gl.getUniformLocation(program, 'uTime'),
    };
    return timelineGl;
}

function renderVolumetricFlameAtlas(timeSec: number): HTMLCanvasElement | null {
    const glCtx = getTimelineGl();
    if (!glCtx) return null;

    if (!timelineAtlas2d) {
        timelineAtlas2d = document.createElement('canvas');
        timelineAtlas2d.width = ATLAS_W;
        timelineAtlas2d.height = ATLAS_H;
    }

    const key = timeSec.toFixed(3);
    if (key === lastTimelineAtlasKey) return timelineAtlas2d;
    lastTimelineAtlasKey = key;

    const { canvas: glCanvas, gl } = glCtx;
    gl.viewport(0, 0, ATLAS_W, ATLAS_H);
    gl.useProgram(glCtx.program);
    gl.uniform1f(glCtx.uTime, timeSec);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const out = timelineAtlas2d.getContext('2d');
    if (out) {
        out.clearRect(0, 0, ATLAS_W, ATLAS_H);
        out.drawImage(glCanvas, 0, 0);
    }
    return timelineAtlas2d;
}

export class TimelineFlameRenderer {
    private sparks: Spark[] = [];

    reset() {
        this.sparks = [];
    }

    private sampleAt(samples: PathSample[], targetLen: number): PathSample | null {
        if (samples.length === 0) return null;
        if (targetLen <= samples[0].len) return samples[0];
        const last = samples[samples.length - 1];
        if (targetLen >= last.len) return last;

        let lo = 0;
        let hi = samples.length - 1;
        while (lo < hi - 1) {
            const mid = (lo + hi) >> 1;
            if (samples[mid].len <= targetLen) lo = mid;
            else hi = mid;
        }
        const a = samples[lo];
        const b = samples[hi];
        const span = Math.max(0.001, b.len - a.len);
        const f = (targetLen - a.len) / span;
        return {
            x: a.x + (b.x - a.x) * f,
            y: a.y + (b.y - a.y) * f,
            len: targetLen,
            tx: a.tx + (b.tx - a.tx) * f,
            ty: a.ty + (b.ty - a.ty) * f,
        };
    }

    private drawFlameTongue(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        time: number,
        phase: number,
        alpha = 1,
        atlas: HTMLCanvasElement | null = null
    ) {
        if (atlas) {
            const slot = Math.abs(Math.floor(phase * 1.7)) % ATLAS_SLOTS;
            const drawW = w * 2.55;
            const drawH = h * 1.65;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
            ctx.drawImage(
                atlas,
                slot * ATLAS_SLOT_W,
                0,
                ATLAS_SLOT_W,
                ATLAS_H,
                x - drawW * 0.5,
                y - drawH + drawH * 0.14,
                drawW,
                drawH
            );
            ctx.restore();
            return;
        }

        const sway = Math.sin(time * 9.5 + phase) * w * 0.35 + Math.cos(time * 15.2 + phase * 1.7) * w * 0.18;
        const flickH = h * (0.85 + 0.25 * Math.sin(time * 12.4 + phase * 2.1));

        // Outer oxblood/crimson tongue
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;

        const outerGrad = ctx.createLinearGradient(x, y + w * 0.25, x + sway, y - flickH);
        outerGrad.addColorStop(0, 'rgba(180, 12, 22, 0.92)');
        outerGrad.addColorStop(0.38, 'rgba(232, 68, 12, 0.85)');
        outerGrad.addColorStop(0.75, 'rgba(255, 166, 36, 0.55)');
        outerGrad.addColorStop(1, 'rgba(255, 220, 120, 0)');

        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.55, y + w * 0.1);
        ctx.quadraticCurveTo(x - w * 0.65, y - flickH * 0.45, x + sway, y - flickH);
        ctx.quadraticCurveTo(x + w * 0.65, y - flickH * 0.42, x + w * 0.55, y + w * 0.1);
        ctx.quadraticCurveTo(x, y + w * 0.42, x - w * 0.55, y + w * 0.1);
        ctx.closePath();
        ctx.fill();

        // Inner incandescent gold-white core
        const innerH = flickH * 0.56;
        const innerW = w * 0.32;
        const coreGrad = ctx.createLinearGradient(x, y + 2, x + sway * 0.45, y - innerH);
        coreGrad.addColorStop(0, 'rgba(255, 250, 224, 0.96)');
        coreGrad.addColorStop(0.5, 'rgba(255, 198, 72, 0.85)');
        coreGrad.addColorStop(1, 'rgba(255, 120, 20, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.moveTo(x - innerW, y);
        ctx.quadraticCurveTo(x - innerW * 1.1, y - innerH * 0.48, x + sway * 0.45, y - innerH);
        ctx.quadraticCurveTo(x + innerW * 1.1, y - innerH * 0.45, x + innerW, y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    private drawHeatHalo(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255, 232, 165, ${0.75 * alpha})`);
        g.addColorStop(0.3, `rgba(255, 110, 22, ${0.42 * alpha})`);
        g.addColorStop(0.68, `rgba(180, 14, 24, ${0.18 * alpha})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    render(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        samples: PathSample[],
        drawnPx: number,
        tuningInput: TimelineFlameStyle | TimelineFlameTuning,
        timeSec: number
    ) {
        ctx.clearRect(0, 0, width, height);
        const tuning: TimelineFlameTuning =
            typeof tuningInput === 'string'
                ? { ...DEFAULT_TIMELINE_FLAME_TUNING, style: tuningInput }
                : tuningInput;
        const { style, trailLen: cfgTrailLen, spacing, widthScale, heightScale, speed, opacity, sparks: sparkMult, halo } = tuning;

        if (style === 'none' || samples.length < 2 || drawnPx < 3) return;

        const simTime = timeSec * speed;
        const tip = this.sampleAt(samples, drawnPx);
        if (!tip) return;

        // ── Spawn style-specific particles ──
        if (sparkMult > 0) {
            if (style === 'sparkler' || style === 'inferno') {
                const count = Math.round((style === 'inferno' ? 4 : 3) * sparkMult);
                for (let i = 0; i < count; i++) {
                    const spread = (Math.random() - 0.5) * 2.2;
                    const sp = 1.4 + Math.random() * 3.4;
                    const vx = -tip.tx * sp * (0.6 + Math.random() * 0.6) + spread * 1.4;
                    const vy = -tip.ty * sp * 0.45 - 0.8 - Math.random() * 2.2;
                    this.sparks.push({
                        x: tip.x + (Math.random() - 0.5) * 5,
                        y: tip.y + (Math.random() - 0.5) * 5,
                        vx,
                        vy,
                        life: 1,
                        maxLife: 18 + Math.random() * 26,
                        size: 1.2 + Math.random() * 2.2,
                        hue: 24 + Math.random() * 28,
                    });
                }
            } else if (style === 'preloader' || style === 'trail') {
                const prob = Math.min(1, 0.72 * sparkMult);
                const burst = sparkMult > 1.5 ? 2 : 1;
                for (let b = 0; b < burst; b++) {
                    if (Math.random() < prob) {
                        const spawnLen = style === 'trail' ? Math.max(0, drawnPx - Math.random() * cfgTrailLen) : drawnPx;
                        const pt = this.sampleAt(samples, spawnLen) ?? tip;
                        this.sparks.push({
                            x: pt.x + (Math.random() - 0.5) * 8,
                            y: pt.y + (Math.random() - 0.5) * 4,
                            vx: (Math.random() - 0.5) * 0.8,
                            vy: -1.1 - Math.random() * 1.9,
                            life: 1,
                            maxLife: 26 + Math.random() * 28,
                            size: 1.1 + Math.random() * 1.8,
                            hue: 22 + Math.random() * 26,
                        });
                    }
                }
            } else if (style === 'smokehouse') {
                if (Math.random() < 0.65) {
                    const spawnLen = Math.random() * drawnPx;
                    const pt = this.sampleAt(samples, spawnLen) ?? tip;
                    this.sparks.push({
                        x: pt.x + (Math.random() - 0.5) * 10,
                        y: pt.y,
                        vx: (Math.random() - 0.5) * 0.45,
                        vy: -0.45 - Math.random() * 0.7,
                        life: 1,
                        maxLife: 55 + Math.random() * 45,
                        size: 12 + Math.random() * 18,
                        hue: 16,
                        isSmoke: true,
                    });
                }
                if (Math.random() < Math.min(1, 0.75 * sparkMult)) {
                    const spawnLen = Math.max(0, drawnPx - Math.random() * Math.min(drawnPx, cfgTrailLen));
                    const pt = this.sampleAt(samples, spawnLen) ?? tip;
                    this.sparks.push({
                        x: pt.x + (Math.random() - 0.5) * 8,
                        y: pt.y,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: -0.65 - Math.random() * 1.25,
                        life: 1,
                        maxLife: 38 + Math.random() * 34,
                        size: 1.4 + Math.random() * 2.0,
                        hue: 28 + Math.random() * 22,
                    });
                }
            }
        }

        if (this.sparks.length > 220) {
            this.sparks.splice(0, this.sparks.length - 220);
        }

        // ── Draw smoke puffs first (behind flames) ──
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const p = this.sparks[i];
            p.x += p.vx;
            p.y += p.vy;
            if (!p.isSmoke) {
                p.vy += 0.025;
                p.vx *= 0.985;
            } else {
                p.size += 0.18;
            }
            p.life -= 1 / p.maxLife;
            if (p.life <= 0) {
                this.sparks.splice(i, 1);
                continue;
            }

            if (p.isSmoke) {
                ctx.save();
                const a = Math.sin(p.life * Math.PI) * 0.16 * opacity;
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                g.addColorStop(0, `rgba(95, 42, 20, ${a})`);
                g.addColorStop(0.55, `rgba(38, 18, 12, ${a * 0.55})`);
                g.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // ── Draw style-specific flame geometry (WebGL procedural volumetric flame atlas) ──
        const atlas = renderVolumetricFlameAtlas(simTime);
        const safeStep = Math.max(4, spacing);

        if (style === 'sparkler') {
            if (halo > 0) this.drawHeatHalo(ctx, tip.x, tip.y, 34 * widthScale, halo);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = Math.min(1, opacity);
            ctx.fillStyle = '#fff9e6';
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, (4.5 + Math.sin(simTime * 24) * 1.1) * widthScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (style === 'preloader') {
            if (halo > 0) this.drawHeatHalo(ctx, tip.x, tip.y - 6, 44 * widthScale, halo);
            this.drawFlameTongue(ctx, tip.x - 6 * widthScale, tip.y + 1, 16 * widthScale, 34 * heightScale, simTime, 1, 0.78 * opacity, atlas);
            this.drawFlameTongue(ctx, tip.x + 6 * widthScale, tip.y + 1, 15 * widthScale, 32 * heightScale, simTime, 3, 0.78 * opacity, atlas);
            this.drawFlameTongue(ctx, tip.x, tip.y + 2, 22 * widthScale, 48 * heightScale, simTime, 0, opacity, atlas);
        } else if (style === 'trail') {
            const trailLen = Math.min(drawnPx, cfgTrailLen);
            const steps = Math.max(4, Math.floor(trailLen / safeStep));
            for (let i = 0; i <= steps; i++) {
                const f = i / steps;
                const pt = this.sampleAt(samples, drawnPx - trailLen * (1 - f));
                if (!pt) continue;
                const scale = 0.38 + Math.pow(f, 0.85) * 0.92;
                this.drawFlameTongue(
                    ctx,
                    pt.x,
                    pt.y + 2,
                    16 * scale * widthScale,
                    36 * scale * heightScale,
                    simTime,
                    i,
                    (0.25 + f * 0.75) * opacity,
                    atlas
                );
            }
            if (halo > 0) this.drawHeatHalo(ctx, tip.x, tip.y - 4, 42 * widthScale, halo);
        } else if (style === 'smokehouse') {
            if (halo > 0) this.drawHeatHalo(ctx, tip.x, tip.y, 38 * widthScale, halo * 0.85);
            this.drawFlameTongue(ctx, tip.x, tip.y + 1, 16 * widthScale, 30 * heightScale, simTime, 2, 0.82 * opacity, atlas);
        } else if (style === 'inferno') {
            const trailLen = Math.min(drawnPx, cfgTrailLen);
            const steps = Math.max(4, Math.floor(trailLen / safeStep));
            for (let i = 0; i <= steps; i++) {
                const f = i / steps;
                const pt = this.sampleAt(samples, drawnPx - trailLen * (1 - f));
                if (!pt) continue;
                const scale = 0.42 + f * 0.95;
                this.drawFlameTongue(
                    ctx,
                    pt.x,
                    pt.y + 2,
                    18 * scale * widthScale,
                    42 * scale * heightScale,
                    simTime,
                    i,
                    (0.3 + f * 0.7) * opacity,
                    atlas
                );
            }
            if (halo > 0) this.drawHeatHalo(ctx, tip.x, tip.y - 8, 54 * widthScale, halo * 1.15);
            this.drawFlameTongue(ctx, tip.x, tip.y + 2, 24 * widthScale, 56 * heightScale, simTime, 0, opacity, atlas);
        }

        // ── Draw glowing ember sparks on top ──
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const p of this.sparks) {
            if (p.isSmoke) continue;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
            ctx.fillStyle = `hsl(${p.hue}, 100%, ${55 + p.life * 38}%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.4 + 0.6 * p.life), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

