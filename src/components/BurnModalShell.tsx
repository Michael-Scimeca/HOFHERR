'use client';

import { useLayoutEffect, useRef, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react';
import { createBurner } from '@/lib/burner';
import { getAddToOrderAnimConfig, hexToRgbTuple } from '@/lib/addToOrderAnimConfig';
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
const BURN_OUT_MS = 820;
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
    /** When set to true, plays the burn-out exit animation and then calls onCloseComplete. */
    closing?: boolean;
    /** Fired once the burn-out exit animation finishes. */
    onCloseComplete?: () => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    children: ReactNode;
}

export function BurnPanel({
    className,
    style,
    zIndex = 1101,
    closing = false,
    onCloseComplete,
    onClick,
    children,
}: BurnPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const onCloseCompleteRef = useRef(onCloseComplete);
    useLayoutEffect(() => {
        onCloseCompleteRef.current = onCloseComplete;
    });

    // Layout effect: the panel must be hidden behind the burn front before its first paint,
    // and when `closing` flips to true, it burns out from left to right before unmounting.
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const cfg = getAddToOrderAnimConfig();
        const mode: 'in' | 'out' = closing ? 'out' : 'in';
        const direction = mode === 'out' ? cfg.burnOutDirection : cfg.burnInDirection;
        const durationMs = mode === 'out' ? cfg.burnOutMs : cfg.burnInMs;
        const overrun = cfg.overrun || OVERRUN;
        const cooledRgb = hexToRgbTuple(cfg.borderColorHex || '#CC0E1D');
        const flamesOn = cfg.burnFlamesEnabled !== false;
        const drawTuning = {
            flameBoost: !flamesOn ? 0 : mode === 'out' ? cfg.flameBoost : Math.max(0.5, cfg.flameBoost * 0.74),
            flameHeight: mode === 'out' ? cfg.flameHeight : Math.max(0.18, cfg.flameHeight * 0.76),
            flameRadius: mode === 'out' ? cfg.flameRadius : Math.max(0.015, cfg.flameRadius * 0.58),
            flameFlickerSpeed: cfg.flameFlickerSpeed ?? 1,
            edgeRaggedness: cfg.edgeRaggedness ?? 0.14,
            direction,
        };

        const finishIn = () => {
            panel.dataset.burn = 'done';
        };
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (mode === 'out') {
                onCloseCompleteRef.current?.();
            } else {
                finishIn();
            }
            return;
        }

        // Read the panel's real border and corners before the burn rule hides the border.
        const cs = getComputedStyle(panel);
        const px = (v: string) => parseFloat(v) || 0;
        const radii = [
            px(cs.borderTopLeftRadius),
            px(cs.borderTopRightRadius),
            px(cs.borderBottomRightRadius),
            px(cs.borderBottomLeftRadius),
        ];
        const lineWidth = Math.max(1, cfg.borderWidth || px(cs.borderTopWidth) || px(cs.borderLeftWidth) || 2);

        panel.style.setProperty('--burn-angle', direction === 'right-to-left' ? '270deg' : '90deg');
        panel.style.setProperty('--burn-feather', `${Math.max(1, cfg.burnMaskFeatherPct ?? 10)}%`);
        panel.style.setProperty('--burn-front', '-20%');
        panel.dataset.burn = mode;

        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.className = styles.canvas;
        canvas.style.zIndex = String(zIndex);
        document.body.appendChild(canvas);

        const burner = createBurner(canvas, cooledRgb);

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
                    c.roundRect(
                        x + lineWidth / 2,
                        y + lineWidth / 2,
                        bw - lineWidth,
                        bh - lineWidth,
                        radii
                    );
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
        const start = performance.now();
        let raf = 0;
        let fadeTimer = 0;

        // Paint the first frame synchronously before the browser paints [data-burn='out'] / [data-burn='in'],
        // so the red frame on the canvas immediately takes over from the CSS border without a single-frame blink.
        let lastFront = burner.frontFor(0);
        let lastTime = start / 1000;
        if (built) {
            const frontInBox0 = (lastFront * (boxW + padX * 2) - padX) / boxW;
            place();
            burner.draw(lastFront, lastTime, false, mode, drawTuning);
            panel.style.setProperty('--burn-front', `${frontInBox0 * 100}%`);
        }

        const ro = new ResizeObserver(() => {
            build();
            if (built) {
                burner.draw(lastFront, lastTime, false, mode, drawTuning);
            }
        });
        ro.observe(panel);

        const tick = (now: number) => {
            if (!built) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const p = Math.min(overrun, (now - start) / durationMs);
            const front = burner.frontFor(p);
            const frontInBox = (front * (boxW + padX * 2) - padX) / boxW;
            lastFront = front;
            lastTime = now / 1000;

            place();
            burner.draw(front, lastTime, false, mode, drawTuning);
            panel.style.setProperty('--burn-front', `${frontInBox * 100}%`);
        };

        const step = (now: number) => {
            if (!built) {
                raf = requestAnimationFrame(step);
                return;
            }
            const p = Math.min(overrun, (now - start) / durationMs);
            tick(now);

            if (p >= overrun) {
                ro.disconnect();
                canvas.style.opacity = '0';
                if (mode === 'out') {
                    panel.style.setProperty('--burn-front', '130%');
                    fadeTimer = window.setTimeout(() => {
                        canvas.remove();
                        onCloseCompleteRef.current?.();
                    }, 180);
                } else {
                    // Burn finished: hand over to the panel's own CSS border and drop the canvas.
                    finishIn();
                    fadeTimer = window.setTimeout(() => canvas.remove(), 260);
                }
                return;
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(fadeTimer);
            ro.disconnect();
            canvas.remove();
        };
    }, [zIndex, closing]);

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
