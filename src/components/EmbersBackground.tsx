'use client';

import { useEffect, useRef } from 'react';
import styles from './EmbersBackground.module.css';

const TRANSITION_CONFIG = {
    burstCount: 75,
    speedMultiplier: 3.2,
    windGust: 0.8,
    sizeBoost: 1.5,
    brightness: 1.0,
    fadeOutMs: 500,
} as const;

const COLORS = ['#ff8c00', '#ffa500', '#ff6600', '#ffb347', '#ff7f00', '#ffcc66', '#ff4500', '#ffd27f'] as const;
const FLARE_COLORS = ['#ffffff', '#fff5cc', '#ffe4a0', '#ffd27f'] as const;

function between(a: number, b: number) {
    return Math.random() * (b - a) + a;
}

export default function EmberBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let ww = window.innerWidth;
        let wh = window.innerHeight;
        canvas.width = ww;
        canvas.height = wh;

        let windTime = 0;
        let windStrength = 0;
        let windTarget = (Math.random() - 0.5) * 0.08;
        let burstTimer = 0;
        let burstCooldown = between(40, 100);

        // Transition surge state: 0 = ambient idle, 1 = peak transition surge
        let surgeEnergy = 0;
        let surgeHolding = false;
        let surgeDecayStart = 0;
        let surgeDecayFrom = 0;

        interface P {
            px: number;
            py: number;
            x: number;
            y: number;
            vx: number;
            vy: number;
            g: number;
            life: number;
            maxLife: number;
            size: number;
            depth: number;
            color: string;
            baseColor: string;
            type: number;
            flicker: number;
            flickerSpeed: number;
            wobble: number;
            wobbleSpeed: number;
            wobbleAmp: number;
            shape: number;
            rotation: number;
            rotSpeed: number;
            scaleX: number;
            scaleY: number;
            sides: number;
            dead: boolean;
        }

        function make(isTransitionBurst = false): P {
            const depth = Math.random();
            const isFlare = Math.random() < (isTransitionBurst ? 0.16 : 0.06);
            const type = isTransitionBurst ? 2 : Math.random() < 0.6 ? 0 : Math.random() < 0.6 ? 1 : 2;
            const x = isTransitionBurst ? between(0, ww) : between(ww * 0.15, ww * 0.85);
            const y = isTransitionBurst ? between(wh * 0.55, wh + 24) : between(wh * 0.85, wh);
            const col = isFlare
                ? FLARE_COLORS[Math.floor(Math.random() * FLARE_COLORS.length)]
                : COLORS[Math.floor(Math.random() * COLORS.length)];

            let vx: number;
            let vy: number;
            let g: number;
            let life: number;

            if (type === 1) {
                vx = between(-1.2, 1.2);
                vy = between(-0.05, -0.25);
                g = -0.0002 * Math.random() * 3;
                life = between(wh * 0.55, wh * 1.1);
            } else if (type === 2) {
                vx = between(-0.45, 0.45);
                vy = between(-1.2, -2.0);
                g = -0.0015 * Math.random() * 10;
                life = between(wh * 0.45, wh * 0.85);
            } else {
                vx = between(-0.6, 0.6);
                vy = between(-0.4, -0.85) * (0.5 + depth * 0.6);
                g = -0.0008 * Math.random() * 10;
                life = between(wh * 0.4, wh * 0.85);
            }

            return {
                px: x,
                py: y,
                x,
                y,
                vx,
                vy,
                g,
                life,
                maxLife: life,
                size: isFlare ? between(1.2, 2.1) : between(0.4, 1.1) + depth * 0.8,
                depth,
                color: col,
                baseColor: col,
                type,
                flicker: Math.random() * Math.PI * 2,
                flickerSpeed: between(0.04, 0.16),
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: between(0.01, 0.04),
                wobbleAmp: between(0.05, 0.35),
                shape: Math.floor(Math.random() * 4),
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.06,
                scaleX: between(0.4, 1.0),
                scaleY: between(0.7, 1.4),
                sides: Math.floor(between(3, 6)),
                dead: false,
            };
        }

        const BASE_POOL = 80;
        const MAX_POOL = 200;
        const particles: P[] = Array.from({ length: BASE_POOL }, (_, i) => {
            const p = make(false);
            p.life = p.maxLife * (1 - i / BASE_POOL) * Math.random();
            return p;
        });

        const spawnTransitionBurst = () => {
            let remaining: number = TRANSITION_CONFIG.burstCount;
            for (const p of particles) {
                if (remaining <= 0) break;
                if (p.dead) {
                    Object.assign(p, make(true));
                    remaining--;
                }
            }
            while (remaining > 0 && particles.length < MAX_POOL) {
                particles.push(make(true));
                remaining--;
            }
        };

        const onExit = () => {
            surgeHolding = true;
            surgeEnergy = 1;
            spawnTransitionBurst();
        };

        const onWaiting = () => {
            surgeHolding = true;
            surgeEnergy = 1;
        };

        const onEnter = () => {
            if (!surgeHolding && surgeEnergy <= 0) return;
            surgeHolding = false;
            surgeDecayStart = performance.now();
            surgeDecayFrom = surgeEnergy;
        };

        window.addEventListener('page-transition-exit', onExit);
        window.addEventListener('page-transition-waiting', onWaiting);
        window.addEventListener('page-transition-enter', onEnter);
        window.addEventListener('page-transition-enter-done', onEnter);

        interface S {
            x: number;
            y: number;
            r: number;
            alpha: number;
            vy: number;
            vx: number;
            life: number;
        }
        function makeSmoke(): S {
            return {
                x: between(ww * 0.25, ww * 0.75),
                y: between(wh * 0.5, wh),
                r: between(8, 26),
                alpha: between(0.01, 0.032),
                vy: between(0.1, 0.3),
                vx: between(-0.1, 0.1),
                life: 1,
            };
        }
        const smokes: S[] = Array.from({ length: 12 }, makeSmoke);

        let lastDraw = 0;

        const draw = (now: number) => {
            // Run at 60fps during active transition surges, throttle idle ambient embers to 30fps
            const minInterval = surgeEnergy > 0.05 || surgeHolding ? 14 : 33;
            if (now - lastDraw < minInterval) {
                animationId = requestAnimationFrame(draw);
                return;
            }
            lastDraw = now;

            if (!surgeHolding && surgeEnergy > 0) {
                const elapsed = now - surgeDecayStart;
                const t = Math.min(1, elapsed / TRANSITION_CONFIG.fadeOutMs);
                surgeEnergy = surgeDecayFrom * Math.pow(1 - t, 1.6);
                if (surgeEnergy < 0.01) surgeEnergy = 0;
            }

            const speedMult = 1 + (TRANSITION_CONFIG.speedMultiplier - 1) * surgeEnergy;
            const sizeMult = 1 + (TRANSITION_CONFIG.sizeBoost - 1) * surgeEnergy;
            const brightMult = 1 + (TRANSITION_CONFIG.brightness - 1) * surgeEnergy;
            const gustX = TRANSITION_CONFIG.windGust * surgeEnergy;

            ctx.clearRect(0, 0, ww, wh);

            windTime += 0.006;
            windStrength += (windTarget - windStrength) * 0.008;
            if (Math.random() < 0.004) windTarget = (Math.random() - 0.5) * 0.08;
            const wind = Math.sin(windTime) * windStrength;

            for (const s of smokes) {
                s.x += s.vx + wind * 0.4 + gustX * 0.6;
                s.y -= s.vy * speedMult;
                s.r += 0.06;
                s.life -= 0.0014;
                if (s.life <= 0 || s.y < -60) Object.assign(s, makeSmoke());
                ctx.save();
                ctx.globalAlpha = s.life * s.alpha;
                const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
                sg.addColorStop(0, 'rgba(55,30,14,0.9)');
                sg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = sg;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            burstTimer++;
            if (burstTimer >= burstCooldown) {
                burstTimer = 0;
                burstCooldown = between(20, 60);
                let n = Math.floor(between(5, 12));
                for (let idx = 0; idx < Math.min(BASE_POOL, particles.length); idx++) {
                    const p = particles[idx];
                    if (p.dead && n-- > 0) Object.assign(p, make(false));
                }
            }

            for (const p of particles) {
                if (p.dead) continue;
                p.flicker += p.flickerSpeed;
                p.wobble += p.wobbleSpeed;
                p.vx += (Math.random() - 0.5) * 0.014;

                if (p.type === 1) {
                    p.vx += Math.sin(p.wobble) * p.wobbleAmp * 0.08;
                    if (p.vy > -0.6) p.vy -= 0.0008;
                }
                if (p.type === 2) {
                    p.vx += Math.sin(p.wobble) * p.wobbleAmp * 0.05;
                }

                p.vx += wind * (0.3 + p.depth * 0.7);
                p.px = p.x;
                p.py = p.y;
                p.vy += p.g;
                if (p.vy > 0) p.vy = 0;
                p.x += p.vx + gustX * (0.5 + p.depth * 0.8);
                p.y += p.vy * speedMult;
                p.life--;

                const lr = Math.max(0, p.life / p.maxLife);
                const fadeIn = Math.min(1, (1 - lr) * 14);
                const fadeOut = Math.pow(lr, 0.55);
                const flicker = 0.7 + 0.3 * Math.sin(p.flicker);
                const alpha = Math.min(1, fadeIn * fadeOut * flicker * (0.35 + p.depth * 0.65) * brightMult);

                p.color = p.life < 20 ? '#1a1008' : p.baseColor;
                p.rotation += p.rotSpeed;

                const dx = p.x - p.px;
                const dy = p.y - p.py;
                const len = Math.sqrt(dx * dx + dy * dy);
                const drawSize = p.size * sizeMult;

                ctx.save();
                ctx.globalAlpha = alpha;

                if (p.shape === 0) {
                    const stretch = len < 0.1 ? 1 : Math.min(4.5, 2.8 / len);
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = drawSize;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(p.px - dx * stretch, p.py - dy * stretch);
                    ctx.lineTo(p.x + dx * 0.5, p.y + dy * 0.5);
                    ctx.stroke();
                } else if (p.shape === 1) {
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.scale(p.scaleX, p.scaleY);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, drawSize * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.shape === 2) {
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    const r = drawSize * 1.1;
                    for (let i = 0; i < p.sides; i++) {
                        const ang = (i / p.sides) * Math.PI * 2;
                        const jitter = between(0.5, 1.3);
                        const px2 = Math.cos(ang) * r * jitter * p.scaleX;
                        const py2 = Math.sin(ang) * r * jitter * p.scaleY;
                        if (i === 0) ctx.moveTo(px2, py2);
                        else ctx.lineTo(px2, py2);
                    }
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.translate(p.x, p.y);
                    const angle = Math.atan2(dy, dx) + Math.PI / 2;
                    ctx.rotate(angle);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.moveTo(0, -drawSize * 2);
                    ctx.bezierCurveTo(drawSize * 0.8, -drawSize * 0.5, drawSize * 0.8, drawSize * 0.8, 0, drawSize);
                    ctx.bezierCurveTo(-drawSize * 0.8, drawSize * 0.8, -drawSize * 0.8, -drawSize * 0.5, 0, -drawSize * 2);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();

                if (p.life < 1 || p.y < -30 || p.x < -40 || p.x > ww + 40) p.dead = true;
            }
        };

        let animationId: number;
        let lastFrameTime = 0;
        const FRAME_INTERVAL = 1000 / 30;
        let paused = false;

        const loop = (now: number) => {
            animationId = requestAnimationFrame(loop);
            if (paused) return;
            if (now - lastFrameTime < FRAME_INTERVAL) return;
            lastFrameTime = now;
            draw(now);
        };
        animationId = requestAnimationFrame(loop);

        const onVisibility = () => {
            paused = document.hidden;
        };
        document.addEventListener('visibilitychange', onVisibility);

        const onResize = () => {
            ww = canvas.width = window.innerWidth;
            wh = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('page-transition-exit', onExit);
            window.removeEventListener('page-transition-waiting', onWaiting);
            window.removeEventListener('page-transition-enter', onEnter);
            window.removeEventListener('page-transition-enter-done', onEnter);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
