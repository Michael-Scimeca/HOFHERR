'use client';

import { useLayoutEffect, useRef, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react';
import { createBurner } from '@/lib/burner';
import { getAddToOrderAnimConfig, hexToRgbTuple, type BurnDirection } from '@/lib/addToOrderAnimConfig';
import styles from './BurnModalShell.module.css';

/* ─────────────────────────────────────────────────────────────────────────
   Makes a panel burn in like the preloader logo — and burn out in exact
   reverse (`u = 1 - t`) when closing.

   The panel (a modal box, the cart drawer…) is rendered straight away at its
   final size and revealed behind a moving burn front, so nothing shifts as it
   appears or disappears. The burning frame and flames are drawn on a separate
   canvas attached to <body>, which keeps them out of any scroll area.

   <BurnPanel>       any element that should burn in/out where it already sits
   <BurnModalShell>  a centred modal box (adds the width/centring wrapper)

   Both enter and exit drive `[data-burn='in']` in globals.css (`0 → 1` on
   enter, `1 → 0` on exit) so exit is the exact pixel-for-pixel reverse of enter.
   ───────────────────────────────────────────────────────────────────────── */

const BURN_DURATION_MS = 780;
const P_START = -0.10;
/** Keep the front moving past the far edge so the last of the frame cools cleanly. */
const OVERRUN = 1.22;
/** Rough cap on canvas pixels, so tall panels still redraw smoothly. */
const PIXEL_BUDGET = 380_000;

interface BurnPanelProps {
    className?: string;
    style?: CSSProperties;
    /** Stacking order for the flame canvas; must sit above the panel's overlay. */
    zIndex?: number;
    /** Reveal direction on enter; exit automatically plays the exact reverse. */
    direction?: BurnDirection;
    /** When set to true, plays the exact reverse of the enter animation and calls onCloseComplete. */
    closing?: boolean;
    /** Fired once the reversed exit animation finishes. */
    onCloseComplete?: () => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    children: ReactNode;
}

export function BurnPanel({
    className,
    style,
    zIndex = 1101,
    direction: directionProp,
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

    // Layout effect: on enter (`closing = false`), sweeps normalized progress `u` from 0 → 1;
    // on exit (`closing = true`), sweeps `u` in exact reverse from 1 → 0 with identical tuning.
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const cfg = getAddToOrderAnimConfig();
        const enterDirection: BurnDirection = directionProp ?? cfg.burnInDirection;
        const durationMs = cfg.burnInMs || BURN_DURATION_MS;
        const pEnd = cfg.overrun || OVERRUN;
        const cooledRgb = hexToRgbTuple(cfg.borderColorHex || '#CC0E1D');
        const flamesOn = cfg.burnFlamesEnabled !== false;
        const baseFlameBoost = !flamesOn ? 0 : cfg.flameBoost;
        const baseTuning = {
            flameHeight: cfg.flameHeight,
            flameRadius: cfg.flameRadius,
            flameFlickerSpeed: cfg.flameFlickerSpeed ?? 1,
            edgeRaggedness: cfg.edgeRaggedness ?? 0.14,
            direction: enterDirection,
        };

        const overlayEl = panel.closest<HTMLElement>('[data-pt-portal]');
        if (overlayEl) {
            overlayEl.style.setProperty('--burn-ms', `${durationMs}ms`);
        }

        const finishIn = () => {
            panel.dataset.burn = 'done';
            delete panel.dataset.burnClosing;
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (closing) {
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

        panel.style.setProperty('--burn-angle', enterDirection === 'right-to-left' ? '270deg' : '90deg');
        panel.style.setProperty('--burn-feather', `${Math.max(1, cfg.burnMaskFeatherPct ?? 10)}%`);
        panel.dataset.burn = 'in';
        if (closing) {
            panel.dataset.burnClosing = 'true';
        } else {
            delete panel.dataset.burnClosing;
        }

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
        const place = () => {
            const rect = panel.getBoundingClientRect();
            canvas.style.transform = `translate(${rect.left - padX}px, ${rect.top - padTop}px)`;
        };

        const build = () => {
            const w = panel.offsetWidth;
            const h = panel.offsetHeight;
            if (w < 4 || h < 4) return;
            boxW = w;
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
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            place();
            built = true;
        };
        build();

        const start = performance.now();
        let raf = 0;
        let fadeTimer = 0;

        // Palindromic flame envelope: ramps 0 → 1 at ignition and 1 → 0 as the frame settles,
        // so flameEnv(1 - t) === flameEnv(t) — identical on enter and reversed exit.
        const renderAt = (u: number, timeSec: number) => {
            const p = P_START + (pEnd - P_START) * u;
            const front = burner.frontFor(p);
            const frontInBox = (front * (boxW + padX * 2) - padX) / boxW;
            const flameEnv = Math.min(1, u / 0.1) * Math.min(1, (1 - u) / 0.1);
            place();
            burner.draw(front, timeSec, false, 'in', {
                ...baseTuning,
                flameBoost: baseFlameBoost * flameEnv,
            });
            panel.style.setProperty('--burn-front', `${frontInBox * 100}%`);
        };

        let lastU = closing ? 1 : 0;
        let lastTime = start / 1000;
        if (built) {
            renderAt(lastU, lastTime);
        }

        const ro = new ResizeObserver(() => {
            build();
            if (built) {
                renderAt(lastU, lastTime);
            }
        });
        ro.observe(panel);

        const step = (now: number) => {
            if (!built) {
                raf = requestAnimationFrame(step);
                return;
            }
            const t = Math.min(1, (now - start) / durationMs);
            const u = closing ? 1 - t : t;
            lastU = u;
            lastTime = now / 1000;
            renderAt(u, lastTime);

            if (t >= 1) {
                ro.disconnect();
                if (closing) {
                    canvas.remove();
                    onCloseCompleteRef.current?.();
                } else {
                    finishIn();
                    canvas.style.opacity = '0';
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
    }, [zIndex, directionProp, closing]);

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
    const shellStyle = { '--shell-max-w': `${maxWidth}px` } as CSSProperties;
    return (
        <div className={styles.shell} style={shellStyle}>
            <BurnPanel {...panel} />
        </div>
    );
}
