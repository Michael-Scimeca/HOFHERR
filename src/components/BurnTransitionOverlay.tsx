'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    initBurnWebGL,
    renderWebGLBurnFrame,
    type BurnShaderParams,
    type BurnWebGLContext,
} from '@/lib/BurnWebGLEngine';
import styles from './BurnTransitionOverlay.module.css';

export const DEFAULT_SITE_BURN_MODE = 'vortex-24-smokehouse-draft' as const;
export const DEFAULT_SITE_BURN_DURATION_MS = 600;
export const DEFAULT_SITE_BURN_PARAMS: BurnShaderParams = {
    heatBoost: 0.30,
    bandScale: 0.50,
    smokeScale: 1.15,
    turbScale: 1.20,
    sparkScale: 0.00,
    flowSpeed: 0.30,
    reverse: false,
    transparentVoid: true,
};

export interface BurnOverlayHandle {
    renderFrame: (progress: number) => void;
    clear: () => void;
}

export const BurnTransitionOverlay = forwardRef<BurnOverlayHandle>(
    function BurnTransitionOverlay(_props, ref) {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);
        const glCtxRef = useRef<BurnWebGLContext | null>(null);
        const activeRef = useRef(false);
        const [active, setActive] = useState(false);

        useImperativeHandle(ref, () => ({
            renderFrame(progress: number) {
                const canvas = canvasRef.current;
                if (!canvas) return;

                if (!activeRef.current) {
                    activeRef.current = true;
                    setActive(true);
                }

                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const glW = Math.max(320, Math.round(window.innerWidth * dpr));
                const glH = Math.max(200, Math.round(window.innerHeight * dpr));

                if (canvas.width !== glW || canvas.height !== glH) {
                    canvas.width = glW;
                    canvas.height = glH;
                }

                if (!glCtxRef.current) {
                    glCtxRef.current = initBurnWebGL(canvas);
                }

                const ctx = glCtxRef.current;
                if (!ctx) return;

                renderWebGLBurnFrame(
                    ctx,
                    glW,
                    glH,
                    DEFAULT_SITE_BURN_MODE,
                    Math.min(1, Math.max(0, progress)),
                    performance.now() / 1000,
                    DEFAULT_SITE_BURN_PARAMS
                );
            },
            clear() {
                if (activeRef.current) {
                    activeRef.current = false;
                    setActive(false);
                }
                const ctx = glCtxRef.current;
                const canvas = canvasRef.current;
                if (ctx && canvas) {
                    ctx.gl.viewport(0, 0, canvas.width, canvas.height);
                    ctx.gl.clearColor(0, 0, 0, 0);
                    ctx.gl.clear(ctx.gl.COLOR_BUFFER_BIT);
                }
            },
        }), []);

        useEffect(() => {
            return () => {
                glCtxRef.current = null;
            };
        }, []);

        return (
            <canvas
                ref={canvasRef}
                className={`${styles.overlay} ${active ? styles.active : ''}`}
                aria-hidden="true"
            />
        );
    }
);

