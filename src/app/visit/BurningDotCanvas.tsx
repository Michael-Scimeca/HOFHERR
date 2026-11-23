'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

interface BurningDotCanvasProps {
    variant?: 'butcher' | 'depot';
}

interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

export default function BurningDotCanvas({ variant = 'butcher' }: BurningDotCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cssSize = 18;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = cssSize * dpr;
        canvas.height = cssSize * dpr;
        ctx.scale(dpr, dpr);

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sparks: Spark[] = [];
        let rafId = 0;
        let t = 0;

        const isDepot = variant === 'depot';
        const cx = cssSize / 2;
        const cy = cssSize * 0.62;

        const spawnSpark = () => {
            sparks.push({
                x: cx + (Math.random() - 0.5) * 4.5,
                y: cy - 1 + (Math.random() - 0.5) * 2,
                vx: (Math.random() - 0.5) * 0.25,
                vy: -(0.35 + Math.random() * 0.55),
                life: 0,
                maxLife: 14 + Math.random() * 14,
                size: 1 + Math.random() * 1.4,
            });
        };

        const renderFrame = () => {
            t += 0.12;
            ctx.clearRect(0, 0, cssSize, cssSize);

            const flicker = reducedMotion ? 1 : 0.9 + Math.sin(t * 2.1) * 0.08 + Math.cos(t * 3.7) * 0.06;
            const sway = reducedMotion ? 0 : Math.sin(t * 1.7) * 0.9;

            // Outer heat halo
            const halo = ctx.createRadialGradient(cx, cy, 0.5, cx, cy, 7.5 * flicker);
            if (isDepot) {
                halo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                halo.addColorStop(0.35, 'rgba(147, 197, 253, 0.85)');
                halo.addColorStop(0.7, 'rgba(59, 130, 246, 0.45)');
                halo.addColorStop(1, 'rgba(37, 99, 235, 0)');
            } else {
                halo.addColorStop(0, 'rgba(255, 255, 235, 0.98)');
                halo.addColorStop(0.38, 'rgba(255, 200, 65, 0.88)');
                halo.addColorStop(0.72, 'rgba(255, 102, 20, 0.48)');
                halo.addColorStop(1, 'rgba(204, 14, 29, 0)');
            }
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(cx, cy, 7.5 * flicker, 0, Math.PI * 2);
            ctx.fill();

            // Flickering flame tongue rising from the burning orb
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx - 3.6 * flicker, cy + 1.5);
            ctx.quadraticCurveTo(cx - 4.2, cy - 2.5, cx + sway, cy - 6.8 * flicker);
            ctx.quadraticCurveTo(cx + 4.2, cy - 2.5, cx + 3.6 * flicker, cy + 1.5);
            ctx.arc(cx, cy + 1.2, 3.6 * flicker, 0, Math.PI);
            ctx.closePath();

            const flameGrad = ctx.createLinearGradient(cx, cy - 6.8, cx, cy + 4);
            if (isDepot) {
                flameGrad.addColorStop(0, 'rgba(191, 219, 254, 0.9)');
                flameGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.98)');
                flameGrad.addColorStop(1, 'rgba(96, 165, 250, 0.95)');
            } else {
                flameGrad.addColorStop(0, 'rgba(255, 120, 20, 0.92)');
                flameGrad.addColorStop(0.45, 'rgba(255, 214, 70, 0.98)');
                flameGrad.addColorStop(1, 'rgba(255, 255, 240, 1)');
            }
            ctx.fillStyle = flameGrad;
            ctx.fill();
            ctx.restore();

            // Hot white core
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.beginPath();
            ctx.arc(cx + sway * 0.25, cy + 0.5, 2.1 * flicker, 0, Math.PI * 2);
            ctx.fill();

            // Rising micro-embers
            if (!reducedMotion) {
                if (Math.random() < 0.35 && sparks.length < 8) {
                    spawnSpark();
                }
                for (let i = sparks.length - 1; i >= 0; i -= 1) {
                    const sp = sparks[i];
                    sp.x += sp.vx + Math.sin(t + i) * 0.08;
                    sp.y += sp.vy;
                    sp.life += 1;
                    if (sp.life >= sp.maxLife) {
                        sparks.splice(i, 1);
                        continue;
                    }
                    const alpha = 1 - sp.life / sp.maxLife;
                    ctx.fillStyle = isDepot
                        ? `rgba(219, 234, 254, ${alpha.toFixed(2)})`
                        : `rgba(255, 224, 120, ${alpha.toFixed(2)})`;
                    ctx.beginPath();
                    ctx.arc(sp.x, sp.y, sp.size * alpha, 0, Math.PI * 2);
                    ctx.fill();
                }
                rafId = window.requestAnimationFrame(renderFrame);
            }
        };

        renderFrame();

        return () => {
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [variant]);

    return <canvas ref={canvasRef} className={styles.burningDotCanvas} aria-hidden="true" />;
}

