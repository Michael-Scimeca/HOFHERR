/**
 * Copy of src/app/fire-test/burner.ts (the preloader logo's burn engine), shared by the site's
 * burning modals (src/components/BurnModalShell.tsx) and the burn modal test page.
 * Only change: `build()` accepts an optional `scale`, so a large shape like a modal frame can
 * render at 1x or lower and stay cheap to redraw every frame.
 *
 * Per-pixel "burn in" renderer used by the fire test headline and logo.
 *
 * Paint any shape (text, an SVG logo) once into an ink mask, then call `draw()` every frame
 * with a burn-front position. A ragged, noise-driven front sweeps left to right: ink ahead of it
 * is charred and starts to glow as the front nears, ink at the front flares hot orange and cools
 * to the shape's final colour behind it, and flame tongues lick up off the shape along the front.
 */

type RGB = [number, number, number];

const NOISE = 128;
let sharedNoise: Float32Array | null = null;

/** Tileable value-noise fbm, shared by every burner (front edge + moving flames). */
function noiseField() {
    if (sharedNoise) return sharedNoise;
    const field = new Float32Array(NOISE * NOISE);
    const octave = (cells: number, amp: number) => {
        const lattice = Array.from({ length: cells * cells }, () => Math.random());
        const at = (x: number, y: number) => lattice[((y + cells) % cells) * cells + ((x + cells) % cells)];
        for (let y = 0; y < NOISE; y++) {
            for (let x = 0; x < NOISE; x++) {
                const fx = (x / NOISE) * cells;
                const fy = (y / NOISE) * cells;
                const x0 = Math.floor(fx);
                const y0 = Math.floor(fy);
                const sx = (fx - x0) * (fx - x0) * (3 - 2 * (fx - x0));
                const sy = (fy - y0) * (fy - y0) * (3 - 2 * (fy - y0));
                const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
                const bot = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
                field[y * NOISE + x] += (top + (bot - top) * sy) * amp;
            }
        }
    };
    octave(4, 0.5);
    octave(8, 0.3);
    octave(16, 0.2);
    sharedNoise = field;
    return field;
}

function sampleNoise(field: Float32Array, u: number, v: number) {
    const x = ((Math.floor(u * NOISE) % NOISE) + NOISE) % NOISE;
    const y = ((Math.floor(v * NOISE) % NOISE) + NOISE) % NOISE;
    return field[y * NOISE + x];
}

const HOT: RGB = [255, 80, 20];
const AMBER: RGB = [255, 165, 60];

export interface BuildOptions {
    /** Size of the shape itself, in CSS px. */
    width: number;
    height: number;
    /** Extra room around the shape for glow and flames, in CSS px. */
    padX: number;
    padTop: number;
    padBottom: number;
    /** Paints the shape in solid colour into the box (x, y, width, height), in CSS px. */
    paint: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
    /** Canvas pixels per CSS px. Defaults to the preloader's behaviour (sharper for small shapes). */
    scale?: number;
}

export interface BurnerDrawTuning {
    flameBoost?: number;
    flameHeight?: number;
    flameRadius?: number;
    flameFlickerSpeed?: number;
    edgeRaggedness?: number;
    direction?: 'left-to-right' | 'right-to-left';
}

export interface Burner {
    build: (opts: BuildOptions) => void;
    /** Front position (canvas fraction) for a 0–1 progress through the shape. */
    frontFor: (progress: number) => number;
    /** 0–1 position of a front across the shape itself. */
    across: (front: number) => number;
    /**
     * Draws a frame. Returns ink totals, or null before the first build.
     * mode 'in' lights the shape up; mode 'out' burns it away to nothing.
     */
    draw: (front: number, time: number, finished: boolean, mode?: 'in' | 'out', tuning?: BurnerDrawTuning) => { burnt: number; total: number } | null;
    /** Lets a settled (finished) burner draw again, e.g. when relighting. */
    wake: () => void;
}

/** `cooled` is the colour the shape settles into once it has burnt (e.g. Hofherr red, white). */
export function createBurner(canvas: HTMLCanvasElement, cooled: RGB): Burner {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const field = noiseField();
    let bw = 0;
    let bh = 0;
    let mask = new Float32Array(0);
    let edgeNoise = new Float32Array(0);
    let inkTop = new Int32Array(0);
    let inkBottom = new Int32Array(0);
    let colWeight = new Float32Array(0); // 1 over ink columns, fading to 0 just past the shape's edges
    let image: ImageData | null = null;
    let settled = false;
    let lastTotals = { burnt: 0, total: 0 };
    let shapeStart = 0.1;
    let shapeEnd = 0.9;

    const heatColor = (h: number, out: number[]) => {
        if (h < 0.5) {
            const k = h / 0.5;
            out[0] = cooled[0] + (HOT[0] - cooled[0]) * k;
            out[1] = cooled[1] + (HOT[1] - cooled[1]) * k;
            out[2] = cooled[2] + (HOT[2] - cooled[2]) * k;
        } else {
            const k = (h - 0.5) / 0.5;
            out[0] = HOT[0] + (AMBER[0] - HOT[0]) * k;
            out[1] = HOT[1] + (AMBER[1] - HOT[1]) * k;
            out[2] = HOT[2] + (AMBER[2] - HOT[2]) * k;
        }
    };
    // flames always run red → orange → amber, whatever the shape cools to
    const flameColor = (h: number, out: number[]) => {
        if (h < 0.5) {
            const k = h / 0.5;
            out[0] = 204 + (HOT[0] - 204) * k; out[1] = 14 + (HOT[1] - 14) * k; out[2] = 29 + (HOT[2] - 29) * k;
        } else {
            heatColor(h, out);
        }
    };
    const heat = [0, 0, 0];
    const flame = [0, 0, 0];

    const build = (o: BuildOptions) => {
        if (!ctx || o.width < 2 || o.height < 2) return;
        const cssW = o.width + o.padX * 2;
        const cssH = o.height + o.padTop + o.padBottom;
        const scale = o.scale ?? (o.height < 80
            ? 1.75
            : Math.min(window.devicePixelRatio || 1, 1.5));
        bw = Math.round(cssW * scale);
        bh = Math.round(cssH * scale);
        canvas.width = bw;
        canvas.height = bh;
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
        canvas.style.left = `${-o.padX}px`;
        canvas.style.top = `${-o.padTop}px`;
        shapeStart = o.padX / cssW;
        shapeEnd = 1 - o.padX / cssW;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, bw, bh);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        o.paint(ctx, o.padX, o.padTop, o.width, o.height);
        const data = ctx.getImageData(0, 0, bw, bh).data;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, bw, bh);

        mask = new Float32Array(bw * bh);
        edgeNoise = new Float32Array(bw * bh);
        inkTop = new Int32Array(bw).fill(-1);
        inkBottom = new Int32Array(bw).fill(-1);
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const i = y * bw + x;
                const a = data[i * 4 + 3] / 255;
                mask[i] = a;
                if (a > 0.3) {
                    if (inkTop[x] === -1) inkTop[x] = y;
                    inkBottom[x] = y;
                }
                edgeNoise[i] = sampleNoise(field, (x / bw) * 2.2, (y / bh) * 1.4);
            }
        }
        // spread flames a little past the shape's left/right edges (and across gaps between letters)
        // so they fade out instead of stopping in a hard vertical line
        colWeight = new Float32Array(bw);
        const reach = Math.max(6, Math.round(bh * 0.12));
        const nearest = new Int32Array(bw).fill(-1);
        let last = -1;
        for (let x = 0; x < bw; x++) { if (inkTop[x] >= 0) last = x; nearest[x] = last; }
        last = -1;
        for (let x = bw - 1; x >= 0; x--) {
            if (inkTop[x] >= 0) last = x;
            const left = nearest[x];
            const pickCol = left < 0 ? last : last < 0 ? left : (x - left <= last - x ? left : last);
            if (pickCol < 0) continue;
            const d = Math.abs(x - pickCol);
            colWeight[x] = Math.max(0, 1 - d / reach);
            if (inkTop[x] < 0 && colWeight[x] > 0) {
                inkTop[x] = inkTop[pickCol];
                inkBottom[x] = inkBottom[pickCol];
            }
        }
        image = ctx.createImageData(bw, bh);
        settled = false;
    };

    const frontFor = (progress: number) => shapeStart - 0.08 + progress * (shapeEnd - shapeStart + 0.16);
    const across = (front: number) => Math.min(1, Math.max(0, (front - shapeStart) / (shapeEnd - shapeStart)));

    const draw = (front: number, time: number, finished: boolean, mode: 'in' | 'out' = 'in', tuning?: BurnerDrawTuning) => {
        if (!ctx || !image || bw === 0) return null;
        if (finished && settled) return lastTotals;
        const px = image.data;
        const speedMul = tuning?.flameFlickerSpeed ?? 1;
        const tScaled = time * speedMul;
        const flick = 0.85 + 0.15 * Math.sin(tScaled * 23) * Math.sin(tScaled * 7.3);
        const ragged = tuning?.edgeRaggedness ?? 0.14;
        const rtl = tuning?.direction === 'right-to-left';
        const feather = Math.max(4, Math.round(bh * 0.08));
        let total = 0;
        let burnt = 0;
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const i = y * bw + x;
                const o = i * 4;
                const a = mask[i];
                const xNorm = rtl ? (bw - 1 - x) / bw : x / bw;
                const u = xNorm + (edgeNoise[i] - 0.5) * ragged; // ragged front
                const s = front - u; // > 0 means this pixel has caught
                let r = 0, g = 0, b = 0, alpha = 0;

                if (a > 0 && mode === 'out') {
                    total += a;
                    if (s > 0) burnt += a;
                    if (s < 0) {
                        // still intact, heating up as the front approaches
                        const pre = Math.max(0, 1 + s / 0.06);
                        heatColor(pre * 0.9, heat);
                        r = heat[0]; g = heat[1]; b = heat[2];
                        alpha = a;
                    } else {
                        // flares, chars, then crumbles away
                        const k = s / 0.1;
                        if (k < 1) {
                            flameColor(Math.max(0, 1 - k) * flick, heat);
                            r = heat[0] + (42 - heat[0]) * k; g = heat[1] + (12 - heat[1]) * k; b = heat[2] + (10 - heat[2]) * k;
                            alpha = a * (1 - k) * (1 - k * 0.5);
                        }
                    }
                } else if (a > 0) {
                    total += a;
                    if (s > 0) burnt += a;
                    if (s < 0) {
                        // not lit yet: invisible until the front is about to reach it, then it chars
                        // into view and glows (so the shape only appears as it burns in)
                        const pre = Math.max(0, 1 + s / 0.07);
                        const p2 = pre * pre;
                        r = 42 + (150 - 42) * p2; g = 12 + (18 - 12) * p2; b = 10;
                        alpha = a * p2;
                    } else {
                        // flare at the front, cooling to the final colour behind it
                        const hot = Math.max(0, 1 - s / 0.12) * flick;
                        heatColor(hot, heat);
                        r = heat[0]; g = heat[1]; b = heat[2];
                        alpha = a;
                    }
                }

                // flame tongues rise from the shape upward, never hang below it
                const nearRadius = tuning?.flameRadius ?? (mode === 'out' ? 0.052 : 0.03);
                const near = Math.exp(-Math.abs(s) / nearRadius);
                if (near > 0.02 && inkTop[x] >= 0 && y <= inkBottom[x] && !finished) {
                    const heightSpan = tuning?.flameHeight ?? (mode === 'out' ? 0.42 : 0.32);
                    const above = Math.max(0, (inkTop[x] - y) / (bh * heightSpan));
                    const n = sampleNoise(field, (x / bw) * 5, (y / bh) * 2.2 + tScaled * 1.7);
                    const boost = tuning?.flameBoost ?? (mode === 'out' ? 1.35 : 1);
                    const fl = near * colWeight[x] * boost * Math.max(0, n * 1.7 - 0.42 - above * 1.25);
                    if (fl > 0) {
                        const f = Math.min(1, fl);
                        flameColor(Math.min(1, f * 1.2), flame);
                        r = r * alpha + flame[0] * f;
                        g = g * alpha + flame[1] * f;
                        b = b * alpha + flame[2] * f;
                        const outA = Math.min(1, alpha + f);
                        r /= Math.max(outA, 0.001); g /= Math.max(outA, 0.001); b /= Math.max(outA, 0.001);
                        alpha = outA;
                    }
                }

                // feather the canvas border so nothing ever ends in a hard edge
                const edgeFade = Math.min(1, x / feather, (bw - 1 - x) / feather, y / feather, (bh - 1 - y) / feather);
                px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = alpha * Math.max(0, edgeFade) * 255;
            }
        }
        ctx.putImageData(image, 0, 0);
        lastTotals = { burnt, total };
        if (finished) settled = true;
        return lastTotals;
    };

    return { build, frontFor, across, draw, wake: () => { settled = false; } };
}
