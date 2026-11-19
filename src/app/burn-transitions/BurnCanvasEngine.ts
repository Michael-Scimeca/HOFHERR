export type CanvasBurnId =
    | 'canvas-11-noise-burn'
    | 'canvas-12-flame-wall'
    | 'canvas-13-magma-crater'
    | 'canvas-14-ash-flakes'
    | 'canvas-15-blowtorch'
    | 'canvas-16-charcoal-cracks'
    | 'canvas-17-ember-vortex'
    | 'canvas-18-match-drops'
    | 'canvas-19-smokehouse-curtain'
    | 'canvas-20-twin-pincer'
    | 'vortex-21-crimson-firestorm'
    | 'vortex-22-twin-helix'
    | 'vortex-23-outward-fire-ring'
    | 'vortex-24-smokehouse-draft'
    | 'vortex-25-solar-pinwheel'
    | 'vortex-26-blackhole-hearth'
    | 'vortex-27-fire-tornado'
    | 'vortex-28-four-corner-maelstrom'
    | 'vortex-29-molten-ribbon'
    | 'vortex-30-forge-supernova'
    | 'smoke-31-oxblood-coal'
    | 'smoke-32-chimney-updraft'
    | 'smoke-33-reverse-bloom'
    | 'smoke-34-velvet-ember-rim'
    | 'smoke-35-double-damper'
    | 'smoke-36-deep-pit-smolder'
    | 'smoke-37-white-oak-sparks'
    | 'smoke-38-butcher-paper-singe'
    | 'smoke-39-barrel-smoke-roll'
    | 'smoke-40-midnight-velvet';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    rot: number;
    vrot: number;
}

const EMBER_COLORS = ['#fff5cc', '#ffd27f', '#ff9e2c', '#ff5a14', '#cc0e1d', '#8b0a10'] as const;

function hash2d(ix: number, iy: number): number {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    return n - Math.floor(n);
}

function noise2d(x: number, y: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash2d(ix, iy);
    const b = hash2d(ix + 1, iy);
    const c = hash2d(ix, iy + 1);
    const d = hash2d(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number): number {
    return (
        0.55 * noise2d(x, y) +
        0.3 * noise2d(x * 2.1 + 7.3, y * 2.1 - 4.1) +
        0.15 * noise2d(x * 4.3 - 2.7, y * 4.3 + 9.2)
    );
}

/**
 * Draws a single frame of any of the 10 procedural Canvas burn-out transitions.
 * `progress` runs 0 (intact page) -> 1 (fully burned out to black/next page).
 * `maskCanvas` is painted black where burned, transparent where intact (so it overlays the live HTML stage cleanly).
 */
export function renderCanvasBurnFrame(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    id: CanvasBurnId,
    progress: number,
    timeSec: number,
    particles: Particle[],
) {
    ctx.clearRect(0, 0, w, h);
    const p = Math.max(0, Math.min(1, progress));
    if (p <= 0.002) {
        particles.length = 0;
        return;
    }

    const spawnSpark = (x: number, y: number, vx: number, vy: number, size?: number) => {
        if (particles.length > 260) return;
        particles.push({
            x,
            y,
            vx,
            vy,
            size: size ?? 1.4 + Math.random() * 2.8,
            alpha: 0.9 + Math.random() * 0.1,
            color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.18,
        });
    };

    // Helper: low-res grid noise burn field (fast 60fps on any screen)
    const drawFieldBurn = (evalField: (nx: number, ny: number, n: number) => number, bandWidth = 0.085) => {
        const cols = 72;
        const rows = Math.max(40, Math.round((h / w) * cols));
        const cw = w / cols;
        const ch = h / rows;

        for (let r = 0; r < rows; r++) {
            const ny = (r + 0.5) / rows;
            for (let c = 0; c < cols; c++) {
                const nx = (c + 0.5) / cols;
                const n = fbm(nx * 5.2, ny * 5.2 + timeSec * 0.18);
                const val = evalField(nx, ny, n);
                const diff = p * (1 + bandWidth * 2.4) - val;

                if (diff > bandWidth * 1.4) {
                    // Fully burned out (pure black char void)
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(c * cw - 0.5, r * ch - 0.5, cw + 1.2, ch + 1.2);
                } else if (diff > bandWidth * 0.85) {
                    // Dark charcoal crust
                    ctx.fillStyle = '#1b0704';
                    ctx.fillRect(c * cw - 0.5, r * ch - 0.5, cw + 1.2, ch + 1.2);
                } else if (diff > bandWidth * 0.42) {
                    // Deep crimson ember band
                    ctx.fillStyle = '#cc0e1d';
                    ctx.fillRect(c * cw - 0.5, r * ch - 0.5, cw + 1.2, ch + 1.2);
                    if (Math.random() < 0.035) {
                        spawnSpark(c * cw, r * ch, (Math.random() - 0.5) * 1.8, -1.5 - Math.random() * 2.5);
                    }
                } else if (diff > 0) {
                    // White-hot / bright amber ignition lip
                    ctx.fillStyle = diff > bandWidth * 0.2 ? '#ff7a18' : '#ffe49e';
                    ctx.fillRect(c * cw - 0.5, r * ch - 0.5, cw + 1.2, ch + 1.2);
                }
            }
        }
    };

    if (id === 'canvas-11-noise-burn') {
        drawFieldBurn((nx, ny, n) => 0.22 * (1 - ny) + 0.18 * (1 - nx) + 0.68 * n, 0.09);
    } else if (id === 'canvas-12-flame-wall') {
        drawFieldBurn((nx, ny, n) => {
            const wave = Math.sin(nx * 14 + timeSec * 5) * 0.04 + (n - 0.5) * 0.28;
            return 1 - ny + wave;
        }, 0.11);
    } else if (id === 'canvas-13-magma-crater') {
        drawFieldBurn((nx, ny, n) => {
            const dx = nx - 0.5;
            const dy = (ny - 0.5) * (h / w);
            const dist = Math.sqrt(dx * dx + dy * dy) * 1.45;
            return dist + (n - 0.5) * 0.34;
        }, 0.095);
    } else if (id === 'canvas-14-ash-flakes') {
        const cols = 18;
        const rows = 12;
        const cw = w / cols;
        const ch = h / rows;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const seed = hash2d(c * 3.1, r * 5.7);
                const delay = (1 - r / rows) * 0.5 + seed * 0.38;
                const local = Math.max(0, Math.min(1, (p - delay) / 0.34));
                if (local <= 0) continue;

                const bx = c * cw;
                const by = r * ch;
                // Black void behind lifted tile
                ctx.fillStyle = '#000';
                ctx.fillRect(bx - 0.5, by - 0.5, cw + 1, ch + 1);

                // Burning curling ash tile flying upward
                if (local < 0.95) {
                    const lift = local * local * h * 0.35;
                    const drift = (seed - 0.5) * local * 120;
                    const scale = 1 - local * 0.72;
                    ctx.save();
                    ctx.translate(bx + cw * 0.5 + drift, by + ch * 0.5 - lift);
                    ctx.rotate((seed - 0.5) * local * 3.2);
                    ctx.scale(scale, scale * (1 - local * 0.35));
                    ctx.fillStyle = local < 0.3 ? '#220905' : '#0c0807';
                    ctx.strokeStyle = local < 0.55 ? '#ff7a18' : '#cc0e1d';
                    ctx.lineWidth = 2.5;
                    ctx.fillRect(-cw * 0.5, -ch * 0.5, cw, ch);
                    ctx.strokeRect(-cw * 0.5, -ch * 0.5, cw, ch);
                    ctx.restore();
                }
            }
        }
    } else if (id === 'canvas-15-blowtorch') {
        drawFieldBurn((nx, ny, n) => {
            const beamY = Math.abs(ny - 0.5) * 0.28;
            return nx * 0.85 + beamY + (n - 0.5) * 0.16;
        }, 0.08);
        // Bright torch nozzle flare along leading X
        const tx = p * w * 1.05;
        if (p < 0.96) {
            const grad = ctx.createRadialGradient(tx, h * 0.5, 4, tx, h * 0.5, Math.min(w, h) * 0.32);
            grad.addColorStop(0, 'rgba(255, 245, 204, 0.95)');
            grad.addColorStop(0.28, 'rgba(255, 132, 24, 0.65)');
            grad.addColorStop(0.65, 'rgba(204, 14, 29, 0.25)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 6; i++) {
                spawnSpark(tx, h * (0.2 + Math.random() * 0.6), 2.5 + Math.random() * 5, (Math.random() - 0.5) * 4, 2.2);
            }
        }
    } else if (id === 'canvas-16-charcoal-cracks') {
        // Darken crust + glowing widening lava fissures
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, p * 1.15).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
        const cracks = 14;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < cracks; i++) {
            const ang = (i / cracks) * Math.PI * 2 + hash2d(i, 2) * 0.35;
            const reach = p * Math.max(w, h) * 0.95;
            ctx.beginPath();
            let cx = w * 0.5;
            let cy = h * 0.5;
            ctx.moveTo(cx, cy);
            const steps = 10;
            for (let s = 1; s <= steps; s++) {
                const frac = s / steps;
                const jitter = (hash2d(i * 11, s * 7) - 0.5) * 44;
                cx = w * 0.5 + Math.cos(ang) * reach * frac + Math.cos(ang + 1.57) * jitter;
                cy = h * 0.5 + Math.sin(ang) * reach * frac + Math.sin(ang + 1.57) * jitter;
                ctx.lineTo(cx, cy);
            }
            const glowW = Math.max(1, (1 - Math.abs(p - 0.55) * 1.8) * 18);
            ctx.strokeStyle = 'rgba(204, 14, 29, 0.75)';
            ctx.lineWidth = glowW * 1.6;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 210, 127, 0.95)';
            ctx.lineWidth = glowW * 0.45;
            ctx.stroke();
            if (Math.random() < 0.25 && p < 0.92) {
                spawnSpark(cx, cy, (Math.random() - 0.5) * 3, -1.5 - Math.random() * 2.5);
            }
        }
        ctx.restore();
    } else if (id === 'canvas-17-ember-vortex') {
        drawFieldBurn((nx, ny, n) => {
            const dx = nx - 0.5;
            const dy = ny - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const spiral = Math.sin(angle * 3 - dist * 12 + timeSec * 4) * 0.08;
            return 1 - Math.min(1, dist * 1.45 + spiral) + (n - 0.5) * 0.18;
        }, 0.1);
        for (let i = 0; i < 5 && p < 0.95; i++) {
            const a = Math.random() * Math.PI * 2;
            const rad = (1 - p) * Math.min(w, h) * 0.55;
            spawnSpark(w * 0.5 + Math.cos(a) * rad, h * 0.5 + Math.sin(a) * rad, -Math.sin(a) * 3.5, Math.cos(a) * 3.5);
        }
    } else if (id === 'canvas-18-match-drops') {
        const spots = [
            { x: 0.22, y: 0.28, d: 0.0 },
            { x: 0.76, y: 0.3, d: 0.07 },
            { x: 0.48, y: 0.54, d: 0.03 },
            { x: 0.18, y: 0.76, d: 0.12 },
            { x: 0.82, y: 0.74, d: 0.09 },
            { x: 0.5, y: 0.18, d: 0.14 },
        ];
        drawFieldBurn((nx, ny, n) => {
            let best = 2;
            for (const s of spots) {
                const dx = nx - s.x;
                const dy = (ny - s.y) * (h / w);
                const v = Math.sqrt(dx * dx + dy * dy) * 2.1 + s.d;
                if (v < best) best = v;
            }
            return best + (n - 0.5) * 0.24;
        }, 0.085);
    } else if (id === 'canvas-19-smokehouse-curtain') {
        const wallY = h * (1 - p * 1.15);
        // Opaque smoked black below wall
        ctx.fillStyle = '#000';
        ctx.fillRect(0, Math.max(0, wallY + 40), w, h);
        // Gradient smoke lip
        const sg = ctx.createLinearGradient(0, wallY - 120, 0, wallY + 60);
        sg.addColorStop(0, 'rgba(0,0,0,0)');
        sg.addColorStop(0.55, 'rgba(42, 12, 6, 0.78)');
        sg.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, wallY - 120, w, 180);
        // Heavy ember shower rising ahead of curtain
        if (p < 0.96) {
            for (let i = 0; i < 12; i++) {
                spawnSpark(
                    Math.random() * w,
                    wallY + (Math.random() - 0.5) * 70,
                    (Math.random() - 0.5) * 2.4,
                    -3.5 - Math.random() * 5.5,
                    1.5 + Math.random() * 3.2,
                );
            }
        }
    } else if (id === 'canvas-20-twin-pincer') {
        drawFieldBurn((nx, ny, n) => {
            const distFromEdge = Math.min(ny, 1 - ny) * 2;
            const wave = Math.sin(nx * 12 + timeSec * 4) * 0.04;
            return distFromEdge + wave + (n - 0.5) * 0.22;
        }, 0.095);
    } else if (id.startsWith('vortex-')) {
        // Helper: paint a volumetric licking flame tongue at (x, y) oriented along angle `ang`
        const drawFlameTongue = (x: number, y: number, ang: number, len: number, width: number, heat = 1) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(ang);
            ctx.globalCompositeOperation = 'lighter';

            // Outer crimson-orange plume
            const gOuter = ctx.createLinearGradient(0, 0, len, 0);
            gOuter.addColorStop(0, `rgba(255, 240, 185, ${(0.85 * heat).toFixed(3)})`);
            gOuter.addColorStop(0.28, `rgba(255, 130, 24, ${(0.72 * heat).toFixed(3)})`);
            gOuter.addColorStop(0.68, `rgba(204, 14, 29, ${(0.45 * heat).toFixed(3)})`);
            gOuter.addColorStop(1, 'rgba(90, 5, 8, 0)');
            ctx.fillStyle = gOuter;
            ctx.beginPath();
            ctx.moveTo(0, -width * 0.45);
            ctx.quadraticCurveTo(len * 0.45, -width * 0.9, len, 0);
            ctx.quadraticCurveTo(len * 0.45, width * 0.9, 0, width * 0.45);
            ctx.closePath();
            ctx.fill();

            // Inner white-gold core tongue
            const gCore = ctx.createLinearGradient(0, 0, len * 0.58, 0);
            gCore.addColorStop(0, `rgba(255, 255, 235, ${(0.9 * heat).toFixed(3)})`);
            gCore.addColorStop(0.55, `rgba(255, 195, 75, ${(0.55 * heat).toFixed(3)})`);
            gCore.addColorStop(1, 'rgba(255, 110, 20, 0)');
            ctx.fillStyle = gCore;
            ctx.beginPath();
            ctx.moveTo(0, -width * 0.22);
            ctx.quadraticCurveTo(len * 0.28, -width * 0.36, len * 0.58, 0);
            ctx.quadraticCurveTo(len * 0.28, width * 0.36, 0, width * 0.22);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        const cx = w * 0.5;
        const cy = h * 0.5;
        const maxR = Math.sqrt(cx * cx + cy * cy);
        const fadeTail = p < 0.94 ? Math.min(1, p * 5) * (1 - Math.max(0, (p - 0.85) * 6.6)) : 0;

        if (id === 'vortex-21-crimson-firestorm') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const spiral = Math.sin(ang * 3 - dist * 13 + timeSec * 5.5) * 0.1;
                return 1 - Math.min(1, dist * 1.48 + spiral) + (n - 0.5) * 0.18;
            }, 0.11);
            const ringR = Math.max(12, (1 - p) * maxR * 0.92);
            for (let i = 0; i < 24 && fadeTail > 0.02; i++) {
                const a = (i / 24) * Math.PI * 2 + timeSec * 2.8 + p * 5.2;
                const jitter = 0.85 + 0.3 * hash2d(i, Math.floor(timeSec * 12));
                const fx = cx + Math.cos(a) * ringR * jitter;
                const fy = cy + Math.sin(a) * ringR * jitter;
                drawFlameTongue(fx, fy, a + Math.PI * 0.62, 55 + 55 * jitter, 24 + 14 * jitter, fadeTail);
                if (Math.random() < 0.35) {
                    spawnSpark(fx, fy, -Math.sin(a) * 4.2, Math.cos(a) * 4.2 - 1.2, 2.2);
                }
            }
        } else if (id === 'vortex-22-twin-helix') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const armA = Math.sin(ang * 2 - dist * 14 + timeSec * 6) * 0.12;
                const armB = Math.sin(ang * 2 + dist * 10 - timeSec * 5) * 0.08;
                return 1 - Math.min(1, dist * 1.44 + armA + armB) + (n - 0.5) * 0.16;
            }, 0.1);
            const ringR = Math.max(10, (1 - p) * maxR * 0.95);
            for (let i = 0; i < 28 && fadeTail > 0.02; i++) {
                const dir = i % 2 === 0 ? 1 : -1;
                const a = (i / 28) * Math.PI * 2 + dir * (timeSec * 3.4 + p * 6);
                const fx = cx + Math.cos(a) * ringR;
                const fy = cy + Math.sin(a) * ringR;
                drawFlameTongue(fx, fy, a + dir * 1.35, 78, 28, fadeTail);
                if (Math.random() < 0.3) spawnSpark(fx, fy, -Math.sin(a) * 4.5 * dir, Math.cos(a) * 4.5 * dir);
            }
        } else if (id === 'vortex-23-outward-fire-ring') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const spiral = Math.sin(ang * 4 - dist * 11 + timeSec * 5) * 0.08;
                return dist * 1.48 + spiral + (n - 0.5) * 0.22;
            }, 0.11);
            const ringR = p * maxR * 1.05;
            for (let i = 0; i < 26 && fadeTail > 0.02; i++) {
                const a = (i / 26) * Math.PI * 2 + timeSec * 3.1 + p * 4.5;
                const fx = cx + Math.cos(a) * ringR;
                const fy = cy + Math.sin(a) * ringR;
                drawFlameTongue(fx, fy, a + 0.55, 68, 30, fadeTail);
                if (Math.random() < 0.35) spawnSpark(fx, fy, Math.cos(a) * 4.2, Math.sin(a) * 4.2);
            }
        } else if (id === 'vortex-24-smokehouse-draft') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const swirl = Math.sin(ang * 2 - dist * 9 + timeSec * 3) * 0.11;
                return 1 - Math.min(1, dist * 1.42 + swirl) + (n - 0.5) * 0.26;
            }, 0.13);
            const ringR = Math.max(16, (1 - p) * maxR * 0.88);
            // Dark hickory smoke halo + deep amber flames
            for (let i = 0; i < 18 && fadeTail > 0.02; i++) {
                const a = (i / 18) * Math.PI * 2 + timeSec * 1.8 + p * 3.6;
                const fx = cx + Math.cos(a) * ringR;
                const fy = cy + Math.sin(a) * ringR;
                const sg = ctx.createRadialGradient(fx, fy, 4, fx, fy, 78);
                sg.addColorStop(0, `rgba(48, 18, 8, ${(0.55 * fadeTail).toFixed(3)})`);
                sg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = sg;
                ctx.beginPath();
                ctx.arc(fx, fy, 78, 0, Math.PI * 2);
                ctx.fill();
                drawFlameTongue(fx, fy, a + 1.5, 62, 26, fadeTail * 0.85);
                if (Math.random() < 0.4) spawnSpark(fx, fy, -Math.sin(a) * 2.8, Math.cos(a) * 2.8 - 1.5, 3.0);
            }
        } else if (id === 'vortex-25-solar-pinwheel') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const blades = Math.sin(ang * 6 - dist * 16 + timeSec * 7) * 0.13;
                return 1 - Math.min(1, dist * 1.45 + blades) + (n - 0.5) * 0.14;
            }, 0.095);
            const ringR = Math.max(10, (1 - p) * maxR * 0.9);
            for (let arm = 0; arm < 6 && fadeTail > 0.02; arm++) {
                const baseA = (arm / 6) * Math.PI * 2 + timeSec * 4.2 + p * 7;
                for (let seg = 0; seg < 4; seg++) {
                    const rr = ringR + seg * 28;
                    const a = baseA + seg * 0.22;
                    const fx = cx + Math.cos(a) * rr;
                    const fy = cy + Math.sin(a) * rr;
                    drawFlameTongue(fx, fy, a + 1.42, 92 - seg * 12, 30 - seg * 4, fadeTail);
                }
                const tipX = cx + Math.cos(baseA) * ringR;
                const tipY = cy + Math.sin(baseA) * ringR;
                spawnSpark(tipX, tipY, -Math.sin(baseA) * 5.2, Math.cos(baseA) * 5.2, 2.4);
            }
        } else if (id === 'vortex-26-blackhole-hearth') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                return 1 - Math.min(1, dist * 1.45) + (n - 0.5) * 0.15;
            }, 0.085);
            const ringR = Math.max(8, (1 - p) * maxR * 0.88);
            if (fadeTail > 0.02) {
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                const halo = ctx.createRadialGradient(cx, cy, Math.max(1, ringR * 0.65), cx, cy, ringR + 55);
                halo.addColorStop(0, 'rgba(0,0,0,0)');
                halo.addColorStop(0.55, `rgba(255, 120, 20, ${(0.65 * fadeTail).toFixed(3)})`);
                halo.addColorStop(0.76, `rgba(255, 240, 190, ${(0.95 * fadeTail).toFixed(3)})`);
                halo.addColorStop(1, 'rgba(204, 14, 29, 0)');
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(cx, cy, ringR + 55, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                for (let i = 0; i < 20; i++) {
                    const a = (i / 20) * Math.PI * 2 + timeSec * 5 + p * 8;
                    const fx = cx + Math.cos(a) * ringR;
                    const fy = cy + Math.sin(a) * ringR;
                    drawFlameTongue(fx, fy, a + Math.PI * 0.72, 72, 20, fadeTail);
                    if (Math.random() < 0.45) {
                        spawnSpark(fx, fy, -Math.cos(a) * 3.8 - Math.sin(a) * 3.5, -Math.sin(a) * 3.8 + Math.cos(a) * 3.5, 2.0);
                    }
                }
            }
        } else if (id === 'vortex-27-fire-tornado') {
            drawFieldBurn((nx, ny, n) => {
                const sway = Math.sin(ny * 8 - timeSec * 6) * 0.14 * (1 - ny);
                const dx = Math.abs(nx - 0.5 + sway);
                const funnelW = 0.08 + (1 - ny) * 0.48;
                return (dx / funnelW) * 0.55 + (1 - ny) * 0.42 + (n - 0.5) * 0.2;
            }, 0.11);
            const topY = h * (1 - p * 1.05);
            for (let i = 0; i < 22 && fadeTail > 0.02; i++) {
                const frac = i / 22;
                const fy = h - frac * (h - topY);
                const spread = 24 + frac * w * 0.34;
                const phase = frac * 14 - timeSec * 8;
                const fx = cx + Math.sin(phase) * spread;
                drawFlameTongue(fx, fy, -Math.PI * 0.5 + Math.cos(phase) * 0.55, 65 + frac * 45, 26 + frac * 14, fadeTail);
                if (Math.random() < 0.45) spawnSpark(fx, fy, Math.cos(phase) * 3.5, -4.5 - Math.random() * 3.5, 2.4);
            }
        } else if (id === 'vortex-28-four-corner-maelstrom') {
            const corners = [
                { x: 0.14, y: 0.18 },
                { x: 0.86, y: 0.18 },
                { x: 0.14, y: 0.82 },
                { x: 0.86, y: 0.82 },
            ];
            drawFieldBurn((nx, ny, n) => {
                let best = 2;
                for (let k = 0; k < corners.length; k++) {
                    const dx = nx - corners[k].x;
                    const dy = (ny - corners[k].y) * (h / w);
                    const d = Math.sqrt(dx * dx + dy * dy);
                    const ang = Math.atan2(dy, dx);
                    const v = d * 1.45 + Math.sin(ang * 3 - d * 12 + timeSec * 5 + k) * 0.07;
                    if (v < best) best = v;
                }
                return best + (n - 0.5) * 0.2;
            }, 0.095);
            const rCorner = p * maxR * 0.72;
            for (let k = 0; k < corners.length && fadeTail > 0.02; k++) {
                const kx = corners[k].x * w;
                const ky = corners[k].y * h;
                for (let i = 0; i < 8; i++) {
                    const a = (i / 8) * Math.PI * 2 + timeSec * 3.6 + k;
                    const fx = kx + Math.cos(a) * rCorner;
                    const fy = ky + Math.sin(a) * rCorner;
                    drawFlameTongue(fx, fy, a + 1.2, 58, 22, fadeTail);
                    if (Math.random() < 0.25) spawnSpark(fx, fy, -Math.sin(a) * 3.5, Math.cos(a) * 3.5);
                }
            }
        } else if (id === 'vortex-29-molten-ribbon') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const coil = Math.sin(dist * 24 - ang * 2 + timeSec * 5) * 0.09;
                return 1 - Math.min(1, dist * 1.46 + coil) + (n - 0.5) * 0.14;
            }, 0.1);
            if (fadeTail > 0.02) {
                const turns = 3.2;
                const steps = 42;
                for (let s = 0; s < steps; s++) {
                    const frac = s / steps;
                    const rad = (1 - p * 0.85) * maxR * (0.25 + frac * 0.75);
                    const a = frac * Math.PI * 2 * turns + timeSec * 3.2;
                    const fx = cx + Math.cos(a) * rad;
                    const fy = cy + Math.sin(a) * rad;
                    drawFlameTongue(fx, fy, a + 1.5, 48, 18, fadeTail * 0.9);
                    if (Math.random() < 0.2) spawnSpark(fx, fy, -Math.sin(a) * 3.2, Math.cos(a) * 3.2);
                }
            }
        } else if (id === 'vortex-30-forge-supernova') {
            drawFieldBurn((nx, ny, n) => {
                const dx = nx - 0.5;
                const dy = (ny - 0.5) * (h / w);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ang = Math.atan2(dy, dx);
                const accel = p * p;
                const spiral = Math.sin(ang * 5 - dist * 14 + timeSec * (4 + accel * 8)) * 0.1;
                return 1 - Math.min(1, dist * 1.46 + spiral) + (n - 0.5) * 0.18;
            }, 0.11);
            const ringR = Math.max(6, (1 - p) * maxR * 0.9);
            for (let i = 0; i < 30 && fadeTail > 0.02; i++) {
                const a = (i / 30) * Math.PI * 2 + timeSec * 4.5 + p * p * 10;
                const fx = cx + Math.cos(a) * ringR;
                const fy = cy + Math.sin(a) * ringR;
                drawFlameTongue(fx, fy, a + 1.35, 84, 28, fadeTail);
                if (Math.random() < 0.4) spawnSpark(fx, fy, -Math.sin(a) * 5.5, Math.cos(a) * 5.5, 2.5);
            }
            // Peak-heat white-amber supernova flash around p = 0.78
            const flash = Math.max(0, 1 - Math.abs(p - 0.78) * 5.2);
            if (flash > 0.01) {
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                const fg = ctx.createRadialGradient(cx, cy, 4, cx, cy, maxR * 0.85);
                fg.addColorStop(0, `rgba(255, 252, 224, ${(flash * 0.92).toFixed(3)})`);
                fg.addColorStop(0.35, `rgba(255, 165, 42, ${(flash * 0.65).toFixed(3)})`);
                fg.addColorStop(0.7, `rgba(204, 14, 29, ${(flash * 0.3).toFixed(3)})`);
                fg.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = fg;
                ctx.fillRect(0, 0, w, h);
                ctx.restore();
            }
        }
    }

    // Update & render glowing sparks on top
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy -= 0.03;
        pt.alpha -= 0.024;
        pt.rot += pt.vrot;
        if (pt.alpha <= 0.02 || pt.y < -20) {
            particles.splice(i, 1);
            continue;
        }
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

