'use client';

import { useLayoutEffect, useRef, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react';
import { createBurner } from '@/lib/burner';
import styles from './BurnModalShell.module.css';

/* ─────────────────────────────────────────────────────────────────────────
   Makes a panel burn in like the preloader logo.

   The panel (a modal box, the cart drawer…) is rendered straight away at its
   final size and revealed from left to right behind a burn front, so nothing
   shifts as it appears. The burning frame and flames are drawn on a separate
   canvas attached to <body>, which keeps them out of any scroll area. When the
   burn finishes the canvas is removed and the panel is left exactly as styled.

   <BurnPanel>       any element that should burn in where it already sits
   <BurnModalShell>  a centred modal box (adds the width/centring wrapper)

   The reveal itself is the `[data-burn='in']` rule in globals.css.
   ───────────────────────────────────────────────────────────────────────── */

const BURN_IN_MS = 700;
/** Keep the front moving past the right edge so the last of the frame can cool before we stop. */
const OVERRUN = 1.22;
const HOFHERR_RED: [number, number, number] = [204, 14, 29];
/** Rough cap on canvas pixels, so tall panels still redraw smoothly. */
const PIXEL_BUDGET = 380_000;

interface BurnPanelProps {
    className?: string;
    style?: CSSProperties;
    /** Stacking order for the flame canvas; must sit above the panel's overlay. */
    zIndex?: number;
    onClick?: MouseEventHandler<HTMLDivElement>;
    children: ReactNode;
}

export function BurnPanel({ className, style, zIndex = 1101, onClick, children }: BurnPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Layout effect: the panel must be hidden behind the burn front before its first paint.
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const showPanel = () => {
            panel.dataset.burn = 'done';
        };
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            showPanel();
            return;
        }

        // Read the panel's real border and corners before the burn rule hides the border.
        const cs = getComputedStyle(panel);
        const px = (v: string) => parseFloat(v) || 0;
        const radii = [px(cs.borderTopLeftRadius), px(cs.borderTopRightRadius), px(cs.borderBottomRightRadius), px(cs.borderBottomLeftRadius)];
        const lineWidth = Math.max(2, px(cs.borderTopWidth), px(cs.borderLeftWidth));

        panel.style.setProperty('--burn-front', '-20%');
        panel.dataset.burn = 'in';

        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.className = styles.canvas;
        canvas.style.zIndex = String(zIndex);
        document.body.appendChild(canvas);

        const burner = createBurner(canvas, HOFHERR_RED);

        let boxW = 0;
        let padX = 56;
        let padTop = 96;
        let built = false;

        // The canvas lives on <body>, so pin it over the panel wherever the panel currently is.
        // It is moved with a transform (not left/top) so repositioning never counts as a layout shift.
        const place = () => {
            const rect = panel.getBoundingClientRect();
            canvas.style.transform = `translate(${rect.left - padX}px, ${rect.top - padTop}px)`;
        };

        const build = () => {
            const w = panel.offsetWidth;
            const h = panel.offsetHeight;
            if (w < 4 || h < 4) return;
            boxW = w;
            // Padding has to exceed the burner's edge feather (8% of the canvas height) so the
            // frame itself is never faded, and leave room above for the flames.
            padX = Math.max(56, Math.ceil(h * 0.1) + 20);
            padTop = Math.max(96, padX);
            const area = (w + padX * 2) * (h + padTop + padX);
            burner.build({
                width: w,
                height: h,
                padX,
                padTop,
                padBottom: padX,
                scale: Math.min(1, Math.sqrt(PIXEL_BUDGET / area)),
                paint: (c, x, y, bw, bh) => {
                    c.lineWidth = lineWidth;
                    c.strokeStyle = '#fff';
                    c.beginPath();
                    c.roundRect(x + lineWidth / 2, y + lineWidth / 2, bw - lineWidth, bh - lineWidth, radii);
                    c.stroke();
                },
            });
            burner.wake();
            // build() positions the canvas for an in-flow parent; override that for our fixed canvas.
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            place();
            built = true;
        };
        build();
        const ro = new ResizeObserver(build);
        ro.observe(panel);

        const start = performance.now();
        let raf = 0;
        let fadeTimer = 0;

        const tick = (now: number) => {
            if (!built) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const p = Math.min(OVERRUN, (now - start) / BURN_IN_MS);
            const front = burner.frontFor(p);
            const frontInBox = (front * (boxW + padX * 2) - padX) / boxW;

            place();
            burner.draw(front, now / 1000, false, 'in');
            panel.style.setProperty('--burn-front', `${frontInBox * 100}%`);

            if (p >= OVERRUN) {
                // Burn finished: hand over to the panel's own CSS border and drop the canvas.
                showPanel();
                ro.disconnect();
                canvas.style.opacity = '0';
                fadeTimer = window.setTimeout(() => canvas.remove(), 260);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(fadeTimer);
            ro.disconnect();
            canvas.remove();
        };
    }, [zIndex]);

    return (
        <div ref={panelRef} className={className} style={style} onClick={onClick}>
            {children}
        </div>
    );
}

interface BurnModalShellProps extends BurnPanelProps {
    /** Max width of the modal in px; should match the panel's own max-width. */
    maxWidth?: number;
}

export default function BurnModalShell({ maxWidth = 460, ...panel }: BurnModalShellProps) {
    return (
        <div className={styles.shell} style={{ maxWidth }}>
            <BurnPanel {...panel} />
        </div>
    );
}
