'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { renderCanvasBurnFrame, type CanvasBurnId } from './BurnCanvasEngine';
import {
    DEFAULT_BURN_PARAMS,
    initBurnWebGL,
    isWebGLBurnId,
    renderWebGLBurnFrame,
    type BurnShaderParams,
    type BurnWebGLContext,
} from './BurnWebGLEngine';
import { Toggle } from '@/components/Toggle';
import styles from './BurnTransitionsLab.module.css';

const TUNING_STORAGE_KEY = 'hofherr:burn-lab-tuning:v1';

type EngineKind = 'html' | 'canvas';
type FilterMode = 'smokehouse' | 'vortex' | 'all' | 'html' | 'canvas';

interface BurnVariant {
    num: string;
    id: string;
    name: string;
    engine: EngineKind;
    group?: 'vortex' | 'smokehouse';
    desc: string;
    htmlClass?: string;
    glowClass?: string;
    canvasId?: CanvasBurnId;
}

const BURN_VARIANTS: BurnVariant[] = [
    // 10 HTML / CSS / SVG versions
    {
        num: '01',
        id: 'html-01',
        name: 'Parchment Corner Catch',
        engine: 'html',
        desc: 'Ignites at the bottom-right corner with a diagonal char rim eating across the page.',
        htmlClass: styles.html01,
        glowClass: styles.glow01,
    },
    {
        num: '02',
        id: 'html-02',
        name: 'Center Ember Hole',
        engine: 'html',
        desc: 'Pinhole ignites dead-center and expands outward like a hot coal through butcher paper.',
        htmlClass: styles.html02,
        glowClass: styles.glow02,
    },
    {
        num: '03',
        id: 'html-03',
        name: 'Rising Hearth Curtain',
        engine: 'html',
        desc: 'Bottom-up flame line with SVG heat-shimmer turbulence consuming the viewport.',
        htmlClass: styles.html03,
        glowClass: styles.glow03,
    },
    {
        num: '04',
        id: 'html-04',
        name: 'Top-Down Scorch Drop',
        engine: 'html',
        desc: 'Fire catches the top edge and drops downward in a searing amber curtain.',
        htmlClass: styles.html04,
        glowClass: styles.glow04,
    },
    {
        num: '05',
        id: 'html-05',
        name: 'Heat-Warp Film Melt',
        engine: 'html',
        desc: 'SVG turbulence displacement melts typography like blistering film stock into char.',
        htmlClass: styles.html05,
        glowClass: styles.glow05,
    },
    {
        num: '06',
        id: 'html-06',
        name: 'Dual-Edge Pinch Burn',
        engine: 'html',
        desc: 'Left and right margins catch simultaneously and burn inward toward the center seam.',
        htmlClass: styles.html06,
        glowClass: styles.glow06,
    },
    {
        num: '07',
        id: 'html-07',
        name: "Butcher's Grill Sear Strips",
        engine: 'html',
        desc: 'Repeating horizontal grill-grate sear bands widen until the entire page chars away.',
        htmlClass: styles.html07,
        glowClass: styles.glow07,
    },
    {
        num: '08',
        id: 'html-08',
        name: 'Diagonal Torch Slash',
        engine: 'html',
        desc: 'High-heat diagonal blowtorch cut sweeping across with a white-gold plasma edge.',
        htmlClass: styles.html08,
        glowClass: styles.glow08,
    },
    {
        num: '09',
        id: 'html-09',
        name: 'Multi-Spot Spark Ignition',
        engine: 'html',
        desc: 'Five staggered ember holes ignite simultaneously and merge until nothing remains.',
        htmlClass: styles.html09,
        glowClass: styles.glow09,
    },
    {
        num: '10',
        id: 'html-10',
        name: 'Flashover Cinder Fade',
        engine: 'html',
        desc: 'Brief white-amber thermal flashover bloom followed by high-contrast cinder dissolve.',
        htmlClass: styles.html10,
        glowClass: styles.glow10,
    },
    // 10 Canvas Procedural versions
    {
        num: '11',
        id: 'canvas-11',
        name: 'Organic Noise Paper Burn',
        engine: 'canvas',
        desc: '2D fractal noise burn front with a 3-band edge (char → crimson coal → white-hot lip) + sparks.',
        canvasId: 'canvas-11-noise-burn',
    },
    {
        num: '12',
        id: 'canvas-12',
        name: 'Bottom-Up Flame Wall',
        engine: 'canvas',
        desc: 'Turbulent roaring flame front climbing from the bottom edge with flying oak embers.',
        canvasId: 'canvas-12-flame-wall',
    },
    {
        num: '13',
        id: 'canvas-13',
        name: 'Expanding Magma Crater',
        engine: 'canvas',
        desc: 'Jagged radial noise crater eating outward from center with molten rim & sparks.',
        canvasId: 'canvas-13-magma-crater',
    },
    {
        num: '14',
        id: 'canvas-14',
        name: 'Falling Ash Flakes',
        engine: 'canvas',
        desc: 'Page fractures into 216 burning ash tiles that glow orange on their edges and curl upward.',
        canvasId: 'canvas-14-ash-flakes',
    },
    {
        num: '15',
        id: 'canvas-15',
        name: 'Blowtorch Sweep',
        engine: 'canvas',
        desc: 'Focused white-hot torch jet sweeping left-to-right, scorching the page in its wake.',
        canvasId: 'canvas-15-blowtorch',
    },
    {
        num: '16',
        id: 'canvas-16',
        name: 'Cracking Charcoal Crust',
        engine: 'canvas',
        desc: 'Blackened crust fractures into glowing jagged lava veins that erupt with sparks.',
        canvasId: 'canvas-16-charcoal-cracks',
    },
    {
        num: '17',
        id: 'canvas-17',
        name: 'Ember Vortex Incineration',
        engine: 'canvas',
        desc: 'Spinning firestorm spiral pulls burning edges inward into a glowing crimson-gold core.',
        canvasId: 'canvas-17-ember-vortex',
    },
    {
        num: '18',
        id: 'canvas-18',
        name: 'Smoldering Match-Drop',
        engine: 'canvas',
        desc: 'Six staggered match-head drops ignite noisy organic holes that expand and fuse together.',
        canvasId: 'canvas-18-match-drops',
    },
    {
        num: '19',
        id: 'canvas-19',
        name: 'Smokehouse Ember Curtain',
        engine: 'canvas',
        desc: 'Rising wall of dark hickory smoke and hundreds of glowing embers wiping the page.',
        canvasId: 'canvas-19-smokehouse-curtain',
    },
    {
        num: '20',
        id: 'canvas-20',
        name: 'Twin-Pincer Flame Wave',
        engine: 'canvas',
        desc: 'Opposing jagged flame fronts roar inward from top and bottom and collide at center.',
        canvasId: 'canvas-20-twin-pincer',
    },
    // 10 Fire Vortex Variations (#17 evolved with real volumetric flame tongues)
    {
        num: '21',
        id: 'vortex-21',
        name: 'Crimson Firestorm Funnel',
        engine: 'canvas',
        group: 'vortex',
        desc: '3-arm roaring crimson & gold flame vortex spiraling inward with volumetric flame tongues.',
        canvasId: 'vortex-21-crimson-firestorm',
    },
    {
        num: '22',
        id: 'vortex-22',
        name: 'Twin-Helix Fire Cyclone',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Counter-rotating double-helix fire ribbons whipping inward into a glowing collision.',
        canvasId: 'vortex-22-twin-helix',
    },
    {
        num: '23',
        id: 'vortex-23',
        name: 'Outward Fire Ring Vortex',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Ignites dead-center as a spinning sun of flames and whirls outward to consume the page.',
        canvasId: 'vortex-23-outward-fire-ring',
    },
    {
        num: '24',
        id: 'vortex-24',
        name: 'Smokehouse Draft Swirl',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Deep hickory smoke halo & slow-orbiting oak embers swirling around oxblood-amber flames.',
        canvasId: 'vortex-24-smokehouse-draft',
    },
    {
        num: '25',
        id: 'vortex-25',
        name: 'Solar Flare Pinwheel',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Six razor-sharp plasma flame arms spinning rapidly like a pinwheel blowtorch.',
        canvasId: 'vortex-25-solar-pinwheel',
    },
    {
        num: '26',
        id: 'vortex-26',
        name: 'Black-Hole Hearth Collapse',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Inward gravitational fire ring with a blinding white-gold accretion halo and sparks.',
        canvasId: 'vortex-26-blackhole-hearth',
    },
    {
        num: '27',
        id: 'vortex-27',
        name: 'Bottom-Up Fire Tornado',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Spinning flame whirl anchored at bottom-center that climbs and widens up the page.',
        canvasId: 'vortex-27-fire-tornado',
    },
    {
        num: '28',
        id: 'vortex-28',
        name: 'Four-Corner Fire Maelstrom',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Four corner fire vortices ignite simultaneously and spiral together into one inferno.',
        canvasId: 'vortex-28-four-corner-maelstrom',
    },
    {
        num: '29',
        id: 'vortex-29',
        name: 'Molten Ribbon Spiral',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Continuous liquid-fire ribbon coiling inward in concentric loops with bright flame licks.',
        canvasId: 'vortex-29-molten-ribbon',
    },
    {
        num: '30',
        id: 'vortex-30',
        name: 'White-Hot Forge Supernova',
        engine: 'canvas',
        group: 'vortex',
        desc: 'Accelerating fire vortex that flashes white-amber at peak heat and incinerates the page.',
        canvasId: 'vortex-30-forge-supernova',
    },
    // 10 Smokehouse Draft Swirl Variations (#24 evolved with rich WebGL smoke + preloader fire)
    {
        num: '31',
        id: 'smoke-31',
        name: 'Slow Oxblood Coal Swirl',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Syrupy deep-oxblood coals swirling slowly inward behind a wide billowing smoke veil.',
        canvasId: 'smoke-31-oxblood-coal',
    },
    {
        num: '32',
        id: 'smoke-32',
        name: 'Hickory Chimney Updraft',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Curling hickory smoke & amber fire rising diagonally like an open smokehouse damper.',
        canvasId: 'smoke-32-chimney-updraft',
    },
    {
        num: '33',
        id: 'smoke-33',
        name: 'Reverse Smokehouse Bloom',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Starts as a dark smoldering ring dead-center and blooms outward in oxblood-gold curls.',
        canvasId: 'smoke-33-reverse-bloom',
    },
    {
        num: '34',
        id: 'smoke-34',
        name: 'Velvet Char & Ember Rim',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Ultra-wide soft charcoal smoke feathering with a razor-thin glowing gold-crimson thread.',
        canvasId: 'smoke-34-velvet-ember-rim',
    },
    {
        num: '35',
        id: 'smoke-35',
        name: 'Double-Damper Cross Draft',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Two opposing smokehouse eddies (left & right) curling inward into one dark velvet plume.',
        canvasId: 'smoke-35-double-damper',
    },
    {
        num: '36',
        id: 'smoke-36',
        name: 'Deep Pit Smolder',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Ultra-moody pitmaster smolder: velvety black smoke with subtle pulsing red coal veins.',
        canvasId: 'smoke-36-deep-pit-smolder',
    },
    {
        num: '37',
        id: 'smoke-37',
        name: 'White-Oak Spark Swirl',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Rich #24 smokehouse draft supercharged with orbiting bright GPU white-oak sparks.',
        canvasId: 'smoke-37-white-oak-sparks',
    },
    {
        num: '38',
        id: 'smoke-38',
        name: 'Butcher-Paper Singe Swirl',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Warm toasted sepia smoke halo leading a crisp fiery oxblood-amber spiral burn edge.',
        canvasId: 'smoke-38-butcher-paper-singe',
    },
    {
        num: '39',
        id: 'smoke-39',
        name: 'Barrel-Smoker Roll',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'Rolling barrel-smoker draft curling up from the bottom edge in horizontal amber eddies.',
        canvasId: 'smoke-39-barrel-smoke-roll',
    },
    {
        num: '40',
        id: 'smoke-40',
        name: 'Midnight Inferno Velvet',
        engine: 'canvas',
        group: 'smokehouse',
        desc: 'High-contrast velvet black smoke + vivid crimson-gold preloader flame ribbons & sparks.',
        canvasId: 'smoke-40-midnight-velvet',
    },
];

export default function BurnTransitionsLab() {
    const [filter, setFilter] = useState<FilterMode>('smokehouse');
    const [selectedId, setSelectedId] = useState<string>('smoke-31');
    const [progress, setProgress] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(false);
    const [durationMs, setDurationMs] = useState<number>(1100);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [perVariantParams, setPerVariantParams] = useState<Record<string, BurnShaderParams>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const glCanvasRef = useRef<HTMLCanvasElement>(null);
    const glCtxRef = useRef<BurnWebGLContext | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Parameters<typeof renderCanvasBurnFrame>[6]>([]);

    const active = BURN_VARIANTS.find((v) => v.id === selectedId) ?? BURN_VARIANTS[0];
    const activeParams: BurnShaderParams = perVariantParams[active.id] ?? DEFAULT_BURN_PARAMS;

    // Hydrate saved per-variant tuning on mount
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(TUNING_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as Record<string, BurnShaderParams>;
            if (parsed && typeof parsed === 'object') {
                setPerVariantParams(parsed);
            }
        } catch {
            // Ignore malformed storage
        }
    }, []);

    const updateActiveParam = (patch: Partial<BurnShaderParams>) => {
        const nextForActive: BurnShaderParams = { ...activeParams, ...patch };
        const nextAll = { ...perVariantParams, [active.id]: nextForActive };
        setPerVariantParams(nextAll);
        try {
            window.localStorage.setItem(TUNING_STORAGE_KEY, JSON.stringify(nextAll));
        } catch {
            // Ignore quota errors
        }
        // If resting at 0% or 100%, nudge to 52% so the user immediately sees their slider tweak live!
        if (!playing && (progress <= 0.02 || progress >= 0.98)) {
            setProgress(0.52);
        }
    };

    const resetActiveParams = () => {
        const nextAll = { ...perVariantParams };
        delete nextAll[active.id];
        setPerVariantParams(nextAll);
        try {
            window.localStorage.setItem(TUNING_STORAGE_KEY, JSON.stringify(nextAll));
        } catch {
            // Ignore quota errors
        }
    };

    const copyActiveConfig = () => {
        const payload = JSON.stringify(
            { variant: `#${active.num} ${active.name}`, id: active.id, durationMs, ...activeParams },
            null,
            2,
        );
        void navigator.clipboard?.writeText(payload);
        setCopiedId(active.id);
        window.setTimeout(() => setCopiedId((prev) => (prev === active.id ? null : prev)), 1800);
    };
    const visibleVariants =
        filter === 'all'
            ? BURN_VARIANTS
            : filter === 'smokehouse'
                ? BURN_VARIANTS.filter((v) => v.group === 'smokehouse' || v.id === 'vortex-24')
                : filter === 'vortex'
                    ? BURN_VARIANTS.filter((v) => v.group === 'vortex' || v.id === 'canvas-17')
                    : BURN_VARIANTS.filter((v) => v.engine === filter);

    const triggerBurn = (variantId?: string) => {
        if (variantId) setSelectedId(variantId);
        particlesRef.current = [];
        setProgress(0);
        setPlaying(true);
    };

    // Animation playback loop (works for both HTML & Canvas versions)
    useEffect(() => {
        if (!playing) return;
        let raf = 0;
        let start = performance.now();

        const step = (now: number) => {
            const elapsed = now - start;
            const next = Math.min(1, elapsed / durationMs);
            setProgress(next);

            if (next < 1) {
                raf = requestAnimationFrame(step);
            } else if (loop) {
                start = performance.now() + 450;
                particlesRef.current = [];
                raf = requestAnimationFrame((t) => {
                    if (t < start) {
                        raf = requestAnimationFrame(step);
                    } else {
                        start = t;
                        raf = requestAnimationFrame(step);
                    }
                });
            } else {
                setPlaying(false);
            }
        };

        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [playing, loop, durationMs, selectedId]);

    // WebGL Preloader-Fire renderer + 2D spark/vector renderer for all Canvas & Fire Vortex versions
    useEffect(() => {
        const glCanvas = glCanvasRef.current;
        const canvas = canvasRef.current;
        const stage = stageRef.current;
        if (!glCanvas || !canvas || !stage) return;

        const rect = stage.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(320, Math.round(rect.width));
        const h = Math.max(200, Math.round(rect.height));
        const glW = Math.round(w * dpr);
        const glH = Math.round(h * dpr);

        if (glCanvas.width !== glW || glCanvas.height !== glH) {
            glCanvas.width = glW;
            glCanvas.height = glH;
        }
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        const ctx2d = canvas.getContext('2d');
        if (!glCtxRef.current) {
            glCtxRef.current = initBurnWebGL(glCanvas);
        }

        const nowSec = performance.now() / 1000;

        if (active.engine !== 'canvas' || !active.canvasId) {
            if (glCtxRef.current) {
                const { gl } = glCtxRef.current;
                gl.viewport(0, 0, glW, glH);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            ctx2d?.clearRect(0, 0, w, h);
            return;
        }

        if (isWebGLBurnId(active.canvasId) && glCtxRef.current) {
            // Silky-smooth full-resolution WebGL preloader fire shader (zero pixelation)
            renderWebGLBurnFrame(glCtxRef.current, glW, glH, active.canvasId, progress, nowSec, activeParams);
            ctx2d?.clearRect(0, 0, w, h);
        } else {
            // Vector 2D canvas modes (#14 Ash Flakes, #16 Cracking Crust) or WebGL fallback
            if (glCtxRef.current) {
                const { gl } = glCtxRef.current;
                gl.viewport(0, 0, glW, glH);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            if (ctx2d) {
                renderCanvasBurnFrame(ctx2d, w, h, active.canvasId, progress, nowSec, particlesRef.current);
            }
        }
    }, [active, activeParams, progress, fullScreen]);

    const burnStyle = { '--burn': progress } as React.CSSProperties;

    return (
        <main className={styles.page}>
            {/* Hidden SVG filter defs for HTML/SVG turbulence burn variants */}
            <svg className={styles.srSvg} aria-hidden="true">
                <defs>
                    <filter id="hofherr-heat-shimmer">
                        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves={2} result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={progress * 18} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <filter id="hofherr-film-melt">
                        <feTurbulence type="turbulence" baseFrequency="0.015 0.03" numOctaves={3} result="meltNoise" />
                        <feDisplacementMap in="SourceGraphic" in2="meltNoise" scale={progress * 72} xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                </defs>
            </svg>

            <div className={`container ${styles.layout}`}>
                <header className={styles.header}>
                    <div className={styles.headerCopy}>
                        <h1 className={styles.title}>
                            40 Page <em>Burn-Out</em> Transitions
                        </h1>
                        <p className={styles.sub}>
                            11 Smokehouse Draft Swirl variations (#24 + #31–40 with full-res WebGL preloader fire &amp;
                            velvet smoke), 11 Fire Vortex variations, and 10 HTML/CSS/SVG burns.
                        </p>
                    </div>

                    <div className={styles.filterRow} role="tablist" aria-label="Filter transition engine">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={filter === 'smokehouse'}
                            className={`${styles.filterBtn} ${filter === 'smokehouse' ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter('smokehouse')}
                        >
                            💨 Smokehouse Swirl (11)
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={filter === 'vortex'}
                            className={`${styles.filterBtn} ${filter === 'vortex' ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter('vortex')}
                        >
                            🔥 Fire Vortex (11)
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={filter === 'all'}
                            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All 40
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={filter === 'html'}
                            className={`${styles.filterBtn} ${filter === 'html' ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter('html')}
                        >
                            HTML / CSS (10)
                        </button>
                    </div>
                </header>

                {/* ── Live Interactive Stage ── */}
                <section id="burn-stage" aria-labelledby="burn-stage-heading" className={styles.stagePanel}>
                    <div className={styles.stageTopBar}>
                        <div className={styles.activeMeta}>
                            <span className={styles.activeNum}>#{active.num}</span>
                            <h2 id="burn-stage-heading" className={styles.activeName}>
                                {active.name}
                            </h2>
                            <span className={styles.engineBadge}>
                                {active.engine === 'html' ? 'HTML / CSS / SVG' : 'Canvas 2D Procedural'}
                            </span>
                        </div>

                        <div className={styles.stageActions}>
                            <button type="button" className={styles.playBtn} onClick={() => triggerBurn()}>
                                🔥 Burn Page Out
                            </button>
                            <button
                                type="button"
                                className={styles.ghostBtn}
                                onClick={() => {
                                    setPlaying(false);
                                    particlesRef.current = [];
                                    setProgress(0);
                                }}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className={`${styles.ghostBtn} ${loop ? styles.ghostBtnActive : ''}`}
                                aria-pressed={loop}
                                onClick={() => setLoop((v) => !v)}
                            >
                                {loop ? 'Loop: ON' : 'Loop: OFF'}
                            </button>
                            <button
                                type="button"
                                className={styles.ghostBtn}
                                onClick={() => {
                                    setFullScreen(true);
                                    triggerBurn();
                                }}
                            >
                                ⛶ Full Screen
                            </button>
                        </div>
                    </div>

                    <div className={styles.scrubberRow}>
                        <label htmlFor="burn-scrub" className={styles.scrubberLabel}>
                            Burn: {Math.round(progress * 100)}%
                        </label>
                        <input
                            id="burn-scrub"
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={progress}
                            className={styles.scrubberRange}
                            onChange={(e) => {
                                setPlaying(false);
                                setProgress(parseFloat(e.target.value));
                            }}
                        />
                        <label htmlFor="burn-speed" className={styles.scrubberLabel}>
                            Speed: {durationMs}ms
                        </label>
                        <input
                            id="burn-speed"
                            type="range"
                            min={400}
                            max={2400}
                            step={100}
                            value={durationMs}
                            className={styles.scrubberRange}
                            onChange={(e) => setDurationMs(parseInt(e.target.value, 10))}
                        />
                    </div>

                    {/* ── Per-Variant Live UI Tuning Controls ── */}
                    <div className={styles.tuningPanel}>
                        <div className={styles.tuningHeader}>
                            <span className={styles.tuningTitle}>
                                Live Controls for #{active.num} · {active.name}
                            </span>
                            <div className={styles.tuningHeaderActions}>
                                <Toggle
                                    checked={activeParams.reverse}
                                    onChange={(val) => updateActiveParam({ reverse: val })}
                                    label="Reverse Direction"
                                    size="sm"
                                />
                                <button type="button" className={styles.ghostBtn} onClick={copyActiveConfig}>
                                    {copiedId === active.id ? '✓ Copied JSON' : 'Copy Config'}
                                </button>
                                <button type="button" className={styles.ghostBtn} onClick={resetActiveParams}>
                                    Reset #{active.num}
                                </button>
                            </div>
                        </div>

                        <div className={styles.tuningGrid}>
                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-heat" className={styles.tuningLabel}>
                                    <span>Flame Intensity</span>
                                    <output className={styles.tuningVal}>{activeParams.heatBoost.toFixed(2)}×</output>
                                </label>
                                <input
                                    id="tune-heat"
                                    type="range"
                                    min={0.3}
                                    max={2.2}
                                    step={0.05}
                                    value={activeParams.heatBoost}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ heatBoost: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-band" className={styles.tuningLabel}>
                                    <span>Burn Edge Width</span>
                                    <output className={styles.tuningVal}>{activeParams.bandScale.toFixed(2)}×</output>
                                </label>
                                <input
                                    id="tune-band"
                                    type="range"
                                    min={0.4}
                                    max={2.2}
                                    step={0.05}
                                    value={activeParams.bandScale}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ bandScale: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-smoke" className={styles.tuningLabel}>
                                    <span>Smoke Density</span>
                                    <output className={styles.tuningVal}>{Math.round(activeParams.smokeScale * 100)}%</output>
                                </label>
                                <input
                                    id="tune-smoke"
                                    type="range"
                                    min={0}
                                    max={1.5}
                                    step={0.05}
                                    value={activeParams.smokeScale}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ smokeScale: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-turb" className={styles.tuningLabel}>
                                    <span>Swirl / Turbulence</span>
                                    <output className={styles.tuningVal}>{activeParams.turbScale.toFixed(2)}×</output>
                                </label>
                                <input
                                    id="tune-turb"
                                    type="range"
                                    min={0.2}
                                    max={2.5}
                                    step={0.05}
                                    value={activeParams.turbScale}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ turbScale: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-sparks" className={styles.tuningLabel}>
                                    <span>Spark Shower</span>
                                    <output className={styles.tuningVal}>{Math.round(activeParams.sparkScale * 100)}%</output>
                                </label>
                                <input
                                    id="tune-sparks"
                                    type="range"
                                    min={0}
                                    max={1.5}
                                    step={0.05}
                                    value={activeParams.sparkScale}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ sparkScale: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className={styles.tuningRow}>
                                <label htmlFor="tune-flow" className={styles.tuningLabel}>
                                    <span>Spin / Flow Speed</span>
                                    <output className={styles.tuningVal}>{activeParams.flowSpeed.toFixed(2)}×</output>
                                </label>
                                <input
                                    id="tune-flow"
                                    type="range"
                                    min={0.2}
                                    max={3}
                                    step={0.05}
                                    value={activeParams.flowSpeed}
                                    className={styles.tuningRange}
                                    onChange={(e) => updateActiveParam({ flowSpeed: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        ref={stageRef}
                        className={`${styles.stageViewport} ${fullScreen ? styles.stageViewportFull : ''}`}
                    >
                        {fullScreen && (
                            <button
                                type="button"
                                className={styles.fullCloseBtn}
                                onClick={() => setFullScreen(false)}
                            >
                                ✕ Exit Full Screen
                            </button>
                        )}

                        {/* Revealed next page underneath */}
                        <div className={styles.nextPageLayer}>
                            <h3 className={styles.nextPageTitle}>
                                Quality Meats. <em>No Compromise.</em>
                            </h3>
                            <p className={styles.nextPageSub}>Next page revealed after burn-out completes</p>
                        </div>

                        {/* Current page burning out */}
                        <div
                            className={`${styles.burnPageLayer} ${active.engine === 'html' && active.htmlClass ? active.htmlClass : ''}`}
                            style={burnStyle}
                        >
                            <div className={styles.mockNav}>
                                <span className={styles.mockBrand}>HOFHERR MEAT CO.</span>
                                <span>Specials · BBQ &amp; Catering · Selections · Recipes · Our Story</span>
                            </div>

                            <div className={styles.mockHero}>
                                <div className={styles.mockH1}>
                                    Big Guest List? <em>Bring It.</em>
                                </div>
                                <p className={styles.mockSub}>
                                    Authentic low-and-slow BBQ, backyard pig roasts, and full-service catering from the
                                    same butchers who cut your steaks.
                                </p>
                                <div className={styles.mockBtns}>
                                    <span className={styles.mockBtnPrimary}>Build Your Package</span>
                                    <span className={styles.mockBtnGhost}>See the Menu</span>
                                </div>
                            </div>

                            <div className={styles.mockSteps}>
                                <div className={styles.mockStep}>
                                    <span className={styles.mockStepNum}>1</span>
                                    <span className={styles.mockStepTitle}>Build Your Package</span>
                                    <span className={styles.mockStepDesc}>Pick meats, sides &amp; instant estimate</span>
                                </div>
                                <div className={styles.mockStep}>
                                    <span className={styles.mockStepNum}>2</span>
                                    <span className={styles.mockStepTitle}>Pick a Date</span>
                                    <span className={styles.mockStepDesc}>Live availability calendar</span>
                                </div>
                                <div className={styles.mockStep}>
                                    <span className={styles.mockStepNum}>3</span>
                                    <span className={styles.mockStepTitle}>We Handle Everything</span>
                                    <span className={styles.mockStepDesc}>Food, setup, serving &amp; cleanup</span>
                                </div>
                            </div>
                        </div>

                        {/* HTML fire-rim glow overlay */}
                        {active.engine === 'html' && active.glowClass && (
                            <div
                                className={`${styles.htmlGlowOverlay} ${active.glowClass}`}
                                style={burnStyle}
                                aria-hidden="true"
                            />
                        )}

                        {/* Full-resolution WebGL Preloader Fire Shader overlay */}
                        <canvas ref={glCanvasRef} className={styles.burnCanvas} aria-hidden="true" />

                        {/* 2D Canvas overlay for vector ash flakes & crust cracks */}
                        <canvas ref={canvasRef} className={styles.burnCanvas} aria-hidden="true" />
                    </div>
                </section>

                {/* ── 20-Card Picker Grid ── */}
                <section id="burn-gallery" aria-labelledby="burn-gallery-heading">
                    <h2 id="burn-gallery-heading" className={styles.activeName}>
                        Pick a Burn Transition ({visibleVariants.length})
                    </h2>
                    <div className={styles.cardsGrid}>
                        {visibleVariants.map((variant) => {
                            const isSelected = variant.id === active.id;
                            return (
                                <button
                                    key={variant.id}
                                    type="button"
                                    className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}
                                    aria-pressed={isSelected}
                                    onClick={() => triggerBurn(variant.id)}
                                >
                                    <div className={styles.cardTop}>
                                        <span className={styles.cardNum}>{variant.num}</span>
                                        <span
                                            className={`${styles.cardTag} ${variant.engine === 'canvas' ? styles.cardTagCanvas : ''}`}
                                        >
                                            {variant.engine === 'canvas' ? 'Canvas' : 'HTML / CSS'}
                                        </span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{variant.name}</h3>
                                    <p className={styles.cardDesc}>{variant.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}

