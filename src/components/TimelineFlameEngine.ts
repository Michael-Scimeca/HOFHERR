export type TimelineFlameStyle = 'sparkler' | 'preloader' | 'trail' | 'smokehouse' | 'inferno';

export const TIMELINE_FLAME_OPTIONS: {
    id: TimelineFlameStyle;
    num: string;
    label: string;
    desc: string;
}[] = [
    { id: 'preloader', num: '01', label: 'Flame Head', desc: 'Volumetric rising flame tongue at the burning fuse tip' },
    { id: 'trail', num: '02', label: 'Burning Trail', desc: 'Flickering fire licks rising all along the freshly lit line' },
    { id: 'sparkler', num: '03', label: 'Fuse Sparkler', desc: 'White-hot ignition tip spraying directional ember sparks' },
    { id: 'smokehouse', num: '04', label: 'Smokehouse Ribbon', desc: 'Curling hickory smoke & slow-drifting oak embers along the path' },
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
        alpha = 1
    ) {
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
        style: TimelineFlameStyle,
        timeSec: number
    ) {
        ctx.clearRect(0, 0, width, height);
        if (samples.length < 2 || drawnPx < 3) return;

        const tip = this.sampleAt(samples, drawnPx);
        if (!tip) return;

        // ── Spawn style-specific particles ──
        if (style === 'sparkler' || style === 'inferno') {
            const count = style === 'inferno' ? 4 : 3;
            for (let i = 0; i < count; i++) {
                const spread = (Math.random() - 0.5) * 2.2;
                const speed = 1.4 + Math.random() * 3.4;
                // Spray mostly backward along tangent + slight upward lift
                const vx = -tip.tx * speed * (0.6 + Math.random() * 0.6) + spread * 1.4;
                const vy = -tip.ty * speed * 0.45 - 0.8 - Math.random() * 2.2;
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
            if (Math.random() < 0.72) {
                const spawnLen = style === 'trail' ? Math.max(0, drawnPx - Math.random() * 220) : drawnPx;
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
        } else if (style === 'smokehouse') {
            // Smoke puffs + slow-drifting oak embers along lit path
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
            if (Math.random() < 0.75) {
                const spawnLen = Math.max(0, drawnPx - Math.random() * Math.min(drawnPx, 420));
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

        if (this.sparks.length > 160) {
            this.sparks.splice(0, this.sparks.length - 160);
        }

        // ── Draw smoke puffs first (behind flames) ──
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const p = this.sparks[i];
            p.x += p.vx;
            p.y += p.vy;
            if (!p.isSmoke) {
                p.vy += 0.025; // subtle gravity on embers
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
                const a = Math.sin(p.life * Math.PI) * 0.16;
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

        // ── Draw style-specific flame geometry ──
        if (style === 'sparkler') {
            this.drawHeatHalo(ctx, tip.x, tip.y, 34, 1.0);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = '#fff9e6';
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 4.5 + Math.sin(timeSec * 24) * 1.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (style === 'preloader') {
            this.drawHeatHalo(ctx, tip.x, tip.y - 6, 42, 0.95);
            this.drawFlameTongue(ctx, tip.x - 5, tip.y + 1, 14, 30, timeSec, 1.2, 0.72);
            this.drawFlameTongue(ctx, tip.x + 5, tip.y + 1, 13, 28, timeSec, 3.8, 0.72);
            this.drawFlameTongue(ctx, tip.x, tip.y + 2, 18, 44, timeSec, 0, 1.0);
        } else if (style === 'trail') {
            const trailLen = Math.min(drawnPx, 280);
            const steps = Math.max(4, Math.floor(trailLen / 22));
            for (let i = 0; i <= steps; i++) {
                const f = i / steps; // 0 = oldest tail, 1 = tip
                const pt = this.sampleAt(samples, drawnPx - trailLen * (1 - f));
                if (!pt) continue;
                const scale = 0.35 + f * 0.85;
                this.drawFlameTongue(ctx, pt.x, pt.y + 1, 13 * scale, 32 * scale, timeSec, i * 1.9, 0.35 + f * 0.65);
            }
            this.drawHeatHalo(ctx, tip.x, tip.y - 4, 36, 0.9);
        } else if (style === 'smokehouse') {
            this.drawHeatHalo(ctx, tip.x, tip.y, 38, 0.8);
            this.drawFlameTongue(ctx, tip.x, tip.y + 1, 14, 26, timeSec, 0.5, 0.78);
        } else if (style === 'inferno') {
            const trailLen = Math.min(drawnPx, 220);
            const steps = Math.max(4, Math.floor(trailLen / 24));
            for (let i = 0; i <= steps; i++) {
                const f = i / steps;
                const pt = this.sampleAt(samples, drawnPx - trailLen * (1 - f));
                if (!pt) continue;
                const scale = 0.4 + f * 0.9;
                this.drawFlameTongue(ctx, pt.x, pt.y + 1, 15 * scale, 38 * scale, timeSec, i * 2.3, 0.32 + f * 0.68);
            }
            this.drawHeatHalo(ctx, tip.x, tip.y - 8, 52, 1.15);
            this.drawFlameTongue(ctx, tip.x, tip.y + 2, 22, 54, timeSec, 0, 1.0);
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

