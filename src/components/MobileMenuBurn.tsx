'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { createBurner, type Burner } from '@/lib/burner';

/**
 * "Lit fuse" entrance for the mobile menu.
 *
 * A spark leaves the menu button and runs down a diagonal fuse; the page burns away from that line
 * on both sides to reveal the menu, then the menu links burn in with the site's own burn engine
 * (src/lib/burner.ts). Closing plays the same thing in reverse.
 *
 * The menu itself stays ordinary DOM. This component only:
 *   - paints the dark menu background on a canvas that sits directly under the menu, and
 *   - paints the link text while it is burning, into `textLayerRef` (an empty box inside the menu).
 * It reports progress through data attributes on the menu element, which Navbar.module.css styles:
 *   data-menu-burn="in"   links are being drawn by canvas (real link text is transparent)
 *   data-menu-burn="done" burn finished; real link text shows
 *   data-lit         the background has (nearly) arrived: show dividers and the bottom group
 *   data-closing     the menu is on its way out: ignore taps
 */

const SWEEP_MS = 600; // fuse + page burn
const TEXT_AT_MS = SWEEP_MS - 200; // links start flaming in as the page burn is finishing
const TEXT_MS = 450;
const TOTAL_MS = Math.max(SWEEP_MS, TEXT_AT_MS + TEXT_MS);
const LINE_MS = 250; // the divider lines fade in over this long, ending the moment the text flame ends
const CLOSE_SPEED = 1.7;
const FUSE_END_T = 0.6; // fraction of the sweep the spark takes to reach the end of the fuse
const FUSE_POWER = 2.6; // the spark starts slow and keeps speeding up (1 = steady speed)
const FIELD_W = 80; // the burn is computed on a small buffer and scaled up smooth

/** Same flame settings as the site's burning modals. */
const TEXT_FLAME = { flameHeight: 0.46, flameRadius: 0.056, flameFlickerSpeed: 1, edgeRaggedness: 0.14, direction: 'left-to-right' as const };
const TEXT_FLAME_BOOST = 1.5;

type Vec = [number, number];
type RGB = [number, number, number];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sstep = (a: number, b: number, x: number) => {
    const k = clamp((x - a) / (b - a));
    return k * k * (3 - 2 * k);
};
const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
};
const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number) =>
    vnoise(x, y) * 0.55 + vnoise(x * 2.1 + 7.3, y * 2.1 + 3.1) * 0.3 + vnoise(x * 4.3 + 1.7, y * 4.3 + 9.2) * 0.15;

/** heat 0–1 → menu black, dark red, Hofherr red, orange, white-hot */
const HEAT: RGB[] = [[0, 0, 0], [90, 10, 10], [204, 14, 29], [245, 155, 26], [255, 241, 184]];
const HOT = '#fff1b8';
const ORANGE = '#f59b1a';

function parseRgb(color: string, fallback: RGB): RGB {
    const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : fallback;
}

function glow(c: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,241,184,${a})`);
    g.addColorStop(0.3, `rgba(245,155,26,${0.85 * a})`);
    g.addColorStop(0.65, `rgba(204,14,29,${0.45 * a})`);
    g.addColorStop(1, 'rgba(204,14,29,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
}

interface Props {
    /** true while the menu should be open; set false to play the exit */
    open: boolean;
    /** called once the exit has finished, so the parent can unmount the menu */
    onExited: () => void;
    menuRef: RefObject<HTMLDivElement | null>;
    buttonRef: RefObject<HTMLButtonElement | null>;
    /** empty, absolutely-positioned box inside the menu that the burning link text is drawn into */
    textLayerRef: RefObject<HTMLDivElement | null>;
    /** CSS selector, inside the menu, for the links whose text should burn in */
    linkSelector: string;
    /** class for the background canvas (fixed, same box as the menu, just under it) */
    className?: string;
}

export default function MobileMenuBurn({ open, onExited, menuRef, buttonRef, textLayerRef, linkSelector, className }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparkRef = useRef<HTMLCanvasElement>(null);
    const openRef = useRef(open);
    const exitedRef = useRef(onExited);
    const kickRef = useRef<() => void>(() => {});

    useLayoutEffect(() => {
        openRef.current = open;
        exitedRef.current = onExited;
        const menu = menuRef.current;
        if (menu) {
            if (open) menu.removeAttribute('data-closing');
            else menu.setAttribute('data-closing', '');
        }
        kickRef.current();
    }, [open, onExited, menuRef]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const menu = menuRef.current;
        const layer = textLayerRef.current;
        const ctx = canvas?.getContext('2d') ?? null;
        // The spark is drawn on its own full-screen canvas above the navbar, so it is seen leaving the menu button.
        const sparkCanvas = sparkRef.current;
        const sctx = sparkCanvas?.getContext('2d') ?? null;
        if (!canvas || !menu || !ctx || !sparkCanvas || !sctx) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let m = reduce ? TOTAL_MS : 0; // position on the timeline, in ms
        let raf = 0;
        let last = 0;
        let disposed = false;
        let failed = false;
        let w = 0, h = 0, dpr = 1;
        let offX = 0, offY = 0, sw = 0, sh = 0; // where the background canvas sits inside the full-screen spark canvas
        let fuseFrom: Vec = [0, 0];
        let fuseTo: Vec = [0, 0];
        let burners: Burner[] = [];
        let textReady = false;
        let textPending = !reduce; // link burners are built once the heading font has loaded

        const buf = document.createElement('canvas');
        const bctx = buf.getContext('2d');
        let img: ImageData | null = null;

        menu.setAttribute('data-menu-burn', reduce ? 'done' : 'in');

        const measure = () => {
            const r = canvas.getBoundingClientRect();
            // The burn is soft and scaled up from a small buffer, so a 1x canvas looks the same and keeps the per-frame blur cheap on phones.
            dpr = 1;
            w = r.width;
            h = r.height;
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            const sr = sparkCanvas.getBoundingClientRect();
            offX = r.left - sr.left;
            offY = r.top - sr.top;
            sw = sr.width;
            sh = sr.height;
            sparkCanvas.width = Math.max(1, Math.round(sw));
            sparkCanvas.height = Math.max(1, Math.round(sh));
            const b = buttonRef.current?.getBoundingClientRect();
            fuseFrom = b ? [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top] : [w - 27, -26];
            fuseTo = [w * 0.06, h * 0.8];
            buf.width = FIELD_W;
            buf.height = Math.max(1, Math.round((FIELD_W * h) / Math.max(1, w)));
            img = bctx ? bctx.createImageData(buf.width, buf.height) : null;
        };

        /** One burner per link, painted with that link's own font and colour so the hand-off to real text is seamless. */
        const buildText = () => {
            burners = [];
            textReady = false;
            if (!layer) return;
            layer.replaceChildren();
            // The links are transparent while burning; un-hide them for this (synchronous) pass so we read their real colours.
            const state = menu.getAttribute('data-menu-burn');
            menu.setAttribute('data-menu-burn', 'done');
            const lr = layer.getBoundingClientRect();
            menu.querySelectorAll<HTMLElement>(linkSelector).forEach(link => {
                const range = document.createRange();
                range.selectNodeContents(link);
                const tr = range.getBoundingClientRect();
                if (tr.width < 2 || tr.height < 2) return;
                const cs = getComputedStyle(link);
                const raw = link.textContent ?? '';
                const text = cs.textTransform === 'uppercase' ? raw.toUpperCase() : raw;
                const holder = document.createElement('div');
                holder.style.cssText = `position:absolute;left:${tr.left - lr.left}px;top:${tr.top - lr.top}px;width:${tr.width}px;height:${tr.height}px`;
                const cv = document.createElement('canvas');
                cv.style.position = 'absolute';
                holder.appendChild(cv);
                layer.appendChild(holder);
                const burner = createBurner(cv, parseRgb(cs.color, [242, 242, 242]));
                burner.build({
                    width: tr.width,
                    height: tr.height,
                    padX: 14,
                    padTop: 22,
                    padBottom: 6,
                    scale: 1.3,
                    paint: (c, x, y, ...size) => {
                        const bh = size[1];
                        c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                        if (cs.letterSpacing !== 'normal' && 'letterSpacing' in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
                        const mt = c.measureText(text);
                        const asc = mt.fontBoundingBoxAscent ?? mt.actualBoundingBoxAscent;
                        const desc = mt.fontBoundingBoxDescent ?? mt.actualBoundingBoxDescent;
                        c.textBaseline = 'alphabetic';
                        c.fillStyle = '#fff';
                        c.fillText(text, x, y + (bh - (asc + desc)) / 2 + asc);
                    },
                });
                burners.push(burner);
            });
            if (state) menu.setAttribute('data-menu-burn', state);
            textReady = burners.length > 0;
        };

        const drawText = (tt: number, time: number) => {
            burners.forEach(b => {
                const env = Math.min(1, tt / 0.1) * Math.min(1, (1 - tt) / 0.1);
                b.wake();
                b.draw(b.frontFor(-0.16 + 1.4 * tt), time, false, 'in', { ...TEXT_FLAME, flameBoost: TEXT_FLAME_BOOST * env });
            });
        };

        /** The page burning away from the fuse line. */
        const drawBurn = (t: number, time: number) => {
            if (!img || !bctx) return;
            const bw = buf.width, bh = buf.height, px = img.data, asp = h / Math.max(1, w), diag = Math.hypot(w, h);
            const dx = fuseTo[0] - fuseFrom[0], dy = fuseTo[1] - fuseFrom[1], len2 = dx * dx + dy * dy || 1;
            for (let y = 0; y < bh; y++) {
                for (let x = 0; x < bw; x++) {
                    const u = (x + 0.5) / bw, v = (y + 0.5) / bh, X = u * w, Y = v * h;
                    // when does the burn reach this pixel: when the spark passed the nearest point of the fuse, plus the time to spread out to here
                    const s = clamp(((X - fuseFrom[0]) * dx + (Y - fuseFrom[1]) * dy) / len2);
                    const dist = Math.hypot(X - fuseFrom[0] - dx * s, Y - fuseFrom[1] - dy * s);
                    // the spark passes s later the further along it is (it is speeding up), and the burn spreads sideways faster toward the end
                    const d = (t - FUSE_END_T * Math.pow(s, 1 / FUSE_POWER) - (dist / diag) * (1.5 - s) - fbm(u * 6, v * 6 * asp) * 0.12) * 1.7;
                    const cover = sstep(0.03, 0.1, d);
                    const heat = d > 0 && d < 0.15 ? (d < 0.03 ? d / 0.03 : 1 - (d - 0.03) / 0.12) * (0.82 + 0.18 * Math.sin(time * 21 + u * 40)) : 0;
                    const hs = clamp(heat) * 4, k = Math.min(3, Math.floor(hs)), f = hs - k, A = HEAT[k], B = HEAT[k + 1], i = (y * bw + x) * 4;
                    px[i] = A[0] + (B[0] - A[0]) * f;
                    px[i + 1] = A[1] + (B[1] - A[1]) * f;
                    px[i + 2] = A[2] + (B[2] - A[2]) * f;
                    px[i + 3] = Math.max(cover, clamp(heat * 2.2)) * 255;
                }
            }
            bctx.putImageData(img, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(buf, 0, 0, w, h);
            // soft glow over the top (browsers without canvas filters just skip the blur)
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.6;
            if ('filter' in ctx) ctx.filter = 'blur(8px)';
            ctx.drawImage(buf, 0, 0, w, h);
            ctx.restore();
        };

        /** The spark running along the fuse, shedding sparks. It simply dies out at the end: no burst. */
        const drawSpark = (t: number, timeMs: number) => {
            const k = Math.pow(clamp(t / FUSE_END_T), FUSE_POWER);
            const grow = 1 + k * 1.1; // the spark gets bigger as it speeds up
            const dx = fuseTo[0] - fuseFrom[0], dy = fuseTo[1] - fuseFrom[1];
            const at = (q: number): Vec => [fuseFrom[0] + dx * q, fuseFrom[1] + dy * q];
            if (k > 0 && k < 1) {
                const a = clamp((1 - k) * 14) * clamp(k * 14);
                const flick = (i: number) => 0.8 + 0.2 * Math.sin(timeMs * 0.031 + i * 2.1) * Math.sin(timeMs * 0.013 + i);
                sctx.globalCompositeOperation = 'lighter';
                for (let s = 14; s >= 1; s--) {
                    const q = s / 14, p = at(Math.max(0, k - q * (0.08 + k * 0.22)));
                    glow(sctx, p[0], p[1], (13 * (1 - q) + 3) * grow * flick(s), a * (1 - q) * 0.55);
                }
                const head = at(k);
                glow(sctx, head[0], head[1], 17.5 * grow * flick(0), a);
                sctx.globalCompositeOperation = 'source-over';
                sctx.fillStyle = HOT;
                sctx.globalAlpha = a;
                sctx.beginPath();
                sctx.arc(head[0], head[1], 2.4, 0, Math.PI * 2);
                sctx.fill();
                for (let j = 0; j < 26; j++) {
                    const ke = j / 26;
                    if (ke >= k) break;
                    const age = (k - ke) * 1.6;
                    if (age > 0.55) continue;
                    const e = at(ke), an = hash(0, j) * Math.PI * 2, sp = 30 + hash(j, 9) * 90, z = 1.5 + hash(3, j) * 2;
                    sctx.globalAlpha = (1 - age / 0.55) * a;
                    sctx.fillStyle = hash(j, 0) > 0.5 ? HOT : ORANGE;
                    sctx.fillRect(e[0] + Math.cos(an) * sp * age - z / 2, e[1] + Math.sin(an) * sp * age - 20 * age + 260 * age * age - z / 2, z, z);
                }
                sctx.globalAlpha = 1;
            }
        };

        const render = (now: number) => {
            const t = clamp(m / SWEEP_MS);
            const tt = clamp((m - TEXT_AT_MS) / TEXT_MS);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            sctx.setTransform(1, 0, 0, 1, 0, 0);
            sctx.clearRect(0, 0, sw, sh);
            sctx.translate(offX, offY);
            if (t >= 1) {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, w, h);
            } else if (t > 0) {
                drawBurn(t, now / 1000);
                drawSpark(t, now);
                if (t > 0.92) {
                    // guarantee a fully dark menu at the end whatever the noise did
                    ctx.globalAlpha = (t - 0.92) / 0.08;
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1;
                }
            }
            const done = m >= TOTAL_MS;
            if (textReady && !done) drawText(tt, now / 1000);
            const plain = !textReady && !textPending; // no burners to draw with: just show the real links
            if (layer) layer.style.visibility = done || !textReady ? 'hidden' : 'visible';
            menu.setAttribute('data-menu-burn', done || plain ? 'done' : 'in');
            if (t > 0.86 || plain) menu.setAttribute('data-lit', '');
            else menu.removeAttribute('data-lit');
            // the divider lines (full width throughout) take LINE_MS to fade in and are fully visible the moment the text flame finishes
            const line = clamp((m - (TEXT_AT_MS + TEXT_MS - LINE_MS)) / LINE_MS);
            menu.style.setProperty('--menu-line', plain ? '1' : line.toFixed(3));
        };

        /** If anything in the drawing throws, fall back to a plain, fully visible menu. */
        const bail = () => {
            failed = true;
            menu.setAttribute('data-menu-burn', 'done');
            menu.setAttribute('data-lit', '');
            menu.setAttribute('data-menu-burn-failed', '');
            menu.style.setProperty('--menu-line', '1');
            if (layer) layer.style.visibility = 'hidden';
        };

        const frame = (now: number) => {
            raf = 0;
            if (disposed || failed) return;
            // real elapsed time, so the burn takes the same time on a slow phone; capped so a stalled tab doesn't jump
            const dt = last ? Math.min(120, now - last) : 16;
            last = now;
            const goal = openRef.current ? TOTAL_MS : 0;
            if (reduce) m = goal;
            else if (m < goal) m = Math.min(goal, m + dt);
            else if (m > goal) m = Math.max(goal, m - dt * CLOSE_SPEED);
            try {
                render(now);
            } catch {
                bail();
                if (!openRef.current) exitedRef.current();
                return;
            }
            if (m !== goal) raf = requestAnimationFrame(frame);
            else {
                last = 0;
                if (!openRef.current) exitedRef.current();
            }
        };
        const kick = () => {
            if (failed) {
                if (!openRef.current) exitedRef.current();
                return;
            }
            if (!raf && !disposed) raf = requestAnimationFrame(frame);
        };
        kickRef.current = kick;

        const setup = () => {
            if (disposed) return;
            try {
                measure();
                buildText();
            } catch {
                bail();
            }
            textPending = false;
            last = 0;
            if (!raf && !disposed && !failed) raf = requestAnimationFrame(frame); // redraw even when idle (resize, late font)
        };
        measure();
        kick();
        // link text is painted with the site's heading font, so wait for it before building
        if (document.fonts?.ready) document.fonts.ready.then(setup, setup);
        else setup();

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(setup, 150);
        };
        window.addEventListener('resize', onResize);

        return () => {
            disposed = true;
            kickRef.current = () => {};
            cancelAnimationFrame(raf);
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            layer?.replaceChildren();
        };
    }, [menuRef, buttonRef, textLayerRef, linkSelector]);

    return (
        <>
            <canvas ref={canvasRef} className={className} aria-hidden="true" />
            <canvas
                ref={sparkRef}
                aria-hidden="true"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100dvh', zIndex: 1001, pointerEvents: 'none', display: 'block' }}
            />
        </>
    );
}
