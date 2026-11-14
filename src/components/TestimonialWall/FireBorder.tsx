'use client';

import React, { useEffect, useRef } from 'react';
import styles from './TestimonialWall.module.css';

interface FireBorderConfig {
    ramp: [string, string, string, string];
    height: number;
    rise: number;
    speed: number;
    flicker: number;
    thick: number;
    spread: number;
    intensity: number;
    tips: number;
    inner: number;
    fx: number;
    fy: number;
    embers: number;
    tileH: number;
    tileMode: 'dual' | 'seamless' | 'turbulence';
}

const SMOKER_EMBERS: FireBorderConfig = {
    ramp: ['#000000', '#1C1614', '#8B0A10', '#C8A47E'],
    height: 6,
    rise: 7,
    speed: 1,
    flicker: 0.4,
    thick: 1.25,
    spread: 2.5,
    intensity: 3,
    tips: 0.55,
    inner: 0.6,
    fx: 0.018,
    fy: 0.092,
    embers: 13,
    tileH: 200,
    tileMode: 'seamless',
};

const FIRE_BORDER_STORAGE_KEY = 'hofherr_fire_border_v2';

function loadFireBorderConfig(): FireBorderConfig {
    if (typeof window === 'undefined') return SMOKER_EMBERS;
    try {
        const raw = localStorage.getItem(FIRE_BORDER_STORAGE_KEY);
        if (!raw) return SMOKER_EMBERS;
        const parsed = JSON.parse(raw) as Partial<FireBorderConfig>;
        return {
            ...SMOKER_EMBERS,
            ...parsed,
            ramp: Array.isArray(parsed.ramp) && parsed.ramp.length === 4
                ? (parsed.ramp as [string, string, string, string])
                : SMOKER_EMBERS.ramp,
        };
    } catch {
        return SMOKER_EMBERS;
    }
}

const NS = 'http://www.w3.org/2000/svg';
const P = 40; // room around the card for flames
const TW = 400;
let uid = 0;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function FireBorder({
    active = true,
    radius = 6,
}: {
    active?: boolean;
    hoverOnly?: boolean;
    radius?: number;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const id = useRef(`fb${++uid}`);
    const isActive = Boolean(active);

    useEffect(() => {
        const svg = svgRef.current;
        const host = svg?.parentElement;
        if (!svg || !host || !isActive) return;
        const s = loadFireBorderConfig();
        const TH = Math.max(80, Math.round(s.tileH || 200));
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let W = host.offsetWidth + P * 2;
        let H = host.offsetHeight + P * 2;
        const cols = s.ramp.map(hex);
        const tv = (k: number) => cols.map((c) => c[k].toFixed(3)).join(' ');
        const tips = `0 ${(0.02 + 0.25 * s.tips).toFixed(2)} ${(0.9 - 0.5 * s.tips).toFixed(2)} 1 1`;
        const f = id.current;

        const buildSvg = () => {
            const hostW = host.offsetWidth;
            const hostH = host.offsetHeight;
            if (hostW <= 0 || hostH <= 0) return false;
            W = hostW + P * 2;
            H = hostH + P * 2;
            const innerW = Math.max(0, hostW - s.thick * 2);
            const innerH = Math.max(0, hostH - s.thick * 2);

            let noiseBlock = '';
            if (s.tileMode === 'dual') {
                noiseBlock = `<feTurbulence type="fractalNoise" baseFrequency="${s.fy} ${s.fx}" numOctaves="3" seed="17" stitchTiles="stitch" x="0" y="0" width="${TW}" height="${TH}" result="n"/>
<feOffset in="n" dy="0" x="0" y="0" width="${TW}" height="${TH}" result="a"/>
<feOffset in="n" dy="0" x="0" y="0" width="${TW}" height="${TH}" result="b2"/>
<feMerge x="0" y="0" width="${TW}" height="${TH}" result="m"><feMergeNode in="a"/><feMergeNode in="b2"/></feMerge>
<feTile in="m" result="noise"/>`;
            } else {
                // Seamless constant-burn mode: filter height = H + TH * 2 prevents outer SVG filter clipping
                // while feTile repeats the stitched turbulence across y = 0..H+TH*2 and feOffset scrolls smoothly.
                noiseBlock = `<feTurbulence type="fractalNoise" baseFrequency="${s.fy} ${s.fx}" numOctaves="3" seed="17" stitchTiles="stitch" x="0" y="0" width="${TW}" height="${TH}" result="n"/>
<feTile in="n" x="0" y="0" width="${W}" height="${H + TH * 2}" result="tiled"/>
<feOffset class="off-seamless" in="tiled" dx="0" dy="0" x="0" y="0" width="${W}" height="${H + TH * 2}" result="noise"/>`;
            }

            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
            svg.innerHTML = `<defs><filter id="${f}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H + TH * 2}" color-interpolation-filters="sRGB">
${noiseBlock}
<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 0 0 0 -.15" x="0" y="0" width="${W}" height="${H}" result="na"/>
<feGaussianBlur in="SourceGraphic" stdDeviation="${s.spread}" x="0" y="0" width="${W}" height="${H}" result="b"/>
<feComposite in="b" in2="na" operator="arithmetic" k1="${s.intensity}" k2="0" k3="0" k4="0" x="0" y="0" width="${W}" height="${H}" result="lick"/>
<feDisplacementMap in="lick" in2="noise" scale="${s.height}" xChannelSelector="R" yChannelSelector="G" x="0" y="0" width="${W}" height="${H}" result="d0"/>
<feOffset in="d0" dy="${-s.rise * 0.3}" x="0" y="0" width="${W}" height="${H}" result="d"/>
<feMerge x="0" y="0" width="${W}" height="${H}" result="fg"><feMergeNode in="d"/><feMergeNode in="d"/></feMerge>
<feColorMatrix in="fg" type="matrix" values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 0" x="0" y="0" width="${W}" height="${H}" result="lum"/>
<feComponentTransfer in="lum" x="0" y="0" width="${W}" height="${H}"><feFuncR type="table" tableValues="${tv(0)}"/><feFuncG type="table" tableValues="${tv(1)}"/><feFuncB type="table" tableValues="${tv(2)}"/><feFuncA type="table" tableValues="${tips}"/></feComponentTransfer>
<feComponentTransfer x="0" y="0" width="${W}" height="${H}"><feFuncA type="linear" slope="1" class="fl"/></feComponentTransfer>
</filter>
<mask id="${f}m" maskUnits="userSpaceOnUse"><rect width="${W}" height="${H}" fill="#fff"/><rect x="${P + s.thick}" y="${P + s.thick}" width="${innerW}" height="${innerH}" rx="${radius}" fill="#000" fill-opacity="${1 - s.inner}"/></mask></defs>
<rect x="${P}" y="${P}" width="${hostW}" height="${hostH}" rx="${radius}" fill="none" stroke="#fff" stroke-width="${s.thick}" filter="url(#${f})" mask="url(#${f}m)"/>
<g class="em"></g>`;
            return true;
        };

        buildSvg();
        let offsDual = svg.querySelectorAll('feOffset[result="a"], feOffset[result="b2"]');
        let offSeamless = svg.querySelector('.off-seamless');
        let fl = svg.querySelector('.fl');
        let em = svg.querySelector('.em');

        const spawn = (rand: boolean) => {
            const per = Math.max(1, 2 * (W + H - 4 * P)); let t = Math.random() * per, x: number, y: number;
            const w = Math.max(1, W - 2 * P), h = Math.max(1, H - 2 * P);
            if (t < w) { x = P + t; y = P; } else if ((t -= w) < h) { x = W - P; y = P + t; } else if ((t -= h) < w) { x = W - P - t; y = H - P; } else { x = P; y = H - P - (t - w); }
            return { x, y, vx: (Math.random() - 0.5) * 0.4, vy: -(0.3 + Math.random() * 0.9), life: rand ? Math.random() : 1, r: 0.8 + Math.random() * 1.6 };
        };
        const parts = Array.from({ length: s.embers }, () => spawn(true));
        let dots = em ? parts.map(() => { const c = document.createElementNS(NS, 'circle'); em!.appendChild(c); return c; }) : [];

        const ro = new ResizeObserver(() => {
            const hostW = host.offsetWidth;
            const hostH = host.offsetHeight;
            if (hostW <= 0 || hostH <= 0) return;
            const nextW = hostW + P * 2;
            const nextH = hostH + P * 2;
            if (Math.abs(nextW - W) > 1 || Math.abs(nextH - H) > 1) {
                if (buildSvg()) {
                    offsDual = svg.querySelectorAll('feOffset[result="a"], feOffset[result="b2"]');
                    offSeamless = svg.querySelector('.off-seamless');
                    fl = svg.querySelector('.fl');
                    em = svg.querySelector('.em');
                    if (em) {
                        dots = parts.map(() => { const c = document.createElementNS(NS, 'circle'); em!.appendChild(c); return c; });
                    }
                }
            }
        });
        ro.observe(host);

        let t = Math.random() * 1000, last = performance.now(), raf = 0;
        const tick = (now: number) => {
            const dt = Math.min(50, now - last); last = now;
            if (!reduce) t += dt * 0.06 * s.speed;
            const d = t % TH;
            if (s.tileMode === 'dual' && offsDual.length >= 2) {
                offsDual[0].setAttribute('dy', String(-d));
                offsDual[1].setAttribute('dy', String(TH - d));
            } else if (offSeamless) {
                offSeamless.setAttribute('dy', String(-d));
            }
            if (fl) {
                fl.setAttribute('slope', (1 - s.flicker * 0.5 * (1 + Math.sin(t * 0.21) * Math.sin(t * 0.077)) * 0.6).toFixed(3));
            }
            if (dots.length > 0) {
                parts.forEach((p, k) => {
                    if (!reduce) { p.x += p.vx + Math.sin(t * 0.05 + k) * 0.2; p.y += p.vy * s.speed; p.life -= 0.006 * s.speed; }
                    if (p.life <= 0) Object.assign(p, spawn(false));
                    const c = dots[k];
                    if (c) {
                        c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); c.setAttribute('r', String(p.r));
                        c.setAttribute('fill', p.life > 0.6 ? s.ramp[3] : s.ramp[2]); c.setAttribute('opacity', Math.max(0, p.life).toFixed(2));
                    }
                });
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [isActive, radius]);

    return (
        <svg
            ref={svgRef}
            aria-hidden="true"
            className={`${styles.fireBorderSvg} ${isActive ? styles.fireBorderActive : ''}`}
        />
    );
}
