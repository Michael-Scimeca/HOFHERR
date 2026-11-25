'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    DEFAULT_TIMELINE_FLAME_TUNING,
    TimelineFlameRenderer,
    type PathSample,
} from './TimelineFlameEngine';
import styles from './InteractiveTimeline.module.css';

type TimelineEvent = {
    era: string;
    title: string;
    body?: string | null;
    video?: string | null;
    image?: string | null;
    imageAlt?: string | null;
    archival?: boolean;
};
type Props = { events: TimelineEvent[] };

type FallbackMedia = { image: string; imageAlt: string; archival?: boolean };

const DEFAULT_TIMELINE_MEDIA: FallbackMedia[] = [
    {
        image: '/assets/timeline/old-country-butcher.webp',
        imageAlt: 'Old-world village butcher working by lantern light with hanging cured cuts',
    },
    {
        image: '/assets/timeline/chicago-south-side-1900s.webp',
        imageAlt: 'Early 1900s Chicago South Side butcher in a flat cap and striped apron trimming beef on a maple block',
    },
    {
        image: '/assets/timeline/earning-his-stripes-knives.webp',
        imageAlt: 'Butcher drawing a hand-forged knife from a wooden roll beside an open fire',
    },
    {
        image: '/assets/timeline/northfield-shop-dusk.webp',
        imageAlt: 'Hofherr Meat Co. flagship butcher shop on Happ Road in Northfield at dusk',
    },
    {
        image: '/assets/timeline/the-depot-winnetka-dusk.webp',
        imageAlt: 'Sean Hofherr at The Depot red-awning window inside the historic Winnetka train station at dusk',
    },
];

function resolveEventMedia(event: TimelineEvent, index: number): FallbackMedia {
    if (event.image) {
        return {
            image: event.image,
            imageAlt: event.imageAlt || `${event.era} — ${event.title}`,
            archival: event.archival,
        };
    }
    const lower = `${event.era} ${event.title}`.toLowerCase();
    if (lower.includes('old country') || lower.includes('1800')) return DEFAULT_TIMELINE_MEDIA[0];
    if (lower.includes('south side') || lower.includes('1900')) return DEFAULT_TIMELINE_MEDIA[1];
    if (lower.includes('stripes') || lower.includes('2009')) return DEFAULT_TIMELINE_MEDIA[2];
    if (lower.includes('opens') && !lower.includes('depot')) return DEFAULT_TIMELINE_MEDIA[3];
    if (lower.includes('depot') || lower.includes('2025')) return DEFAULT_TIMELINE_MEDIA[4];
    return DEFAULT_TIMELINE_MEDIA[index % DEFAULT_TIMELINE_MEDIA.length];
}

/* ── Layout constants (SVG coordinate space) ── */
const SVG_W = 1000;
const STEP_H = 420;
const LEFT_X = 36;    // outer edge of left card column (3.6%)
const RIGHT_X = 964;  // outer edge of right card column (96.4%)

export default function InteractiveTimeline({ events }: Props) {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const flameCanvasRef = useRef<HTMLCanvasElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const firelightRefs = useRef<(HTMLDivElement | null)[]>([]);
    const mediaRefs = useRef<(HTMLElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const drawnPxRef = useRef(0);
    const pathSamplesRef = useRef<PathSample[]>([]);
    const flameRendererRef = useRef<TimelineFlameRenderer | null>(null);

    const totalH = Math.max(STEP_H, (events.length - 1) * STEP_H + 370);

    /* ── Node positions ── */
    const nodes = events.map((_, i) => ({
        x: i % 2 === 0 ? LEFT_X : RIGHT_X,
        y: i * STEP_H + 50, // 50px from the TOP of each step — not centered
        isLeft: i % 2 === 0,
    }));

    /* ── Serpentine cubic-bezier path ── */
    const pathD = nodes.reduce((d, n, i) => {
        if (i === 0) return `M ${n.x} ${n.y}`;
        const prev = nodes[i - 1];
        const dy = n.y - prev.y;
        return d + ` C ${prev.x} ${prev.y + dy * 0.45}, ${n.x} ${n.y - dy * 0.45}, ${n.x} ${n.y}`;
    }, '');

    useEffect(() => {
        let cancelled = false;
        let revertCtx: (() => void) | undefined;

        (async () => {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            if (cancelled || !sectionRef.current || !pathRef.current || nodes.length === 0) return;

            const gsapCtx = gsap.context(() => {
                const pathEl = pathRef.current;
                if (!pathEl) return;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (prefersReducedMotion) {
                    gsap.set(pathEl, { strokeDasharray: 'none', strokeDashoffset: 0 });
                    nodes.forEach((_, i) => {
                        const nodeEl = nodeRefs.current[i];
                        const card = cardRefs.current[i];
                        const glow = firelightRefs.current[i];
                        const media = mediaRefs.current[i];
                        if (nodeEl) {
                            gsap.set(nodeEl, { opacity: 1, scale: 1 });
                            nodeEl.classList.add(styles.nodeCircleLit);
                        }
                        if (card) {
                            gsap.set(card, { opacity: 1, x: 0, y: 0 });
                            card.classList.add(styles.cardFirelightLit);
                        }
                        if (glow) {
                            gsap.set(glow, { opacity: 1 });
                        }
                        if (media) {
                            gsap.set(media, { opacity: 1, x: 0, y: 0 });
                        }
                    });
                    return;
                }

                type PathMetrics = {
                    dashLen: number;
                    contactLengths: number[];
                };

                let metrics: PathMetrics = {
                    dashLen: 0,
                    contactLengths: nodes.map(() => 0),
                };
                const litStates = nodes.map(() => false);

                /**
                 * Because the <svg> uses preserveAspectRatio="none" and the <path> uses
                 * vectorEffect="non-scaling-stroke", browsers evaluate stroke-dasharray /
                 * stroke-dashoffset in rendered CSS pixels rather than viewBox units.
                 * Measure exact screen-space arc length and the exact pixel distance along
                 * the curve where the glowing line tip contacts each node's circular rim.
                 */
                const computePathMetrics = (): PathMetrics => {
                    const svgEl = svgRef.current;
                    const scaleX = (svgEl?.clientWidth || SVG_W) / SVG_W;
                    const scaleY = (svgEl?.clientHeight || totalH) / totalH;
                    const samplesPerSeg = 120;

                    const contactLengths = new Array<number>(nodes.length).fill(0);
                    contactLengths[0] = 2;

                    let cumLen = 0;
                    const samples: PathSample[] = [];
                    if (nodes.length > 0) {
                        samples.push({
                            x: nodes[0].x * scaleX,
                            y: nodes[0].y * scaleY,
                            len: 0,
                            tx: 0,
                            ty: 1,
                        });
                    }

                    for (let seg = 1; seg < nodes.length; seg++) {
                        const p0 = nodes[seg - 1];
                        const p3 = nodes[seg];
                        const dy = p3.y - p0.y;
                        const p1x = p0.x;
                        const p1y = p0.y + dy * 0.45;
                        const p2x = p3.x;
                        const p2y = p3.y - dy * 0.45;

                        const targetSx = p3.x * scaleX;
                        const targetSy = p3.y * scaleY;
                        const radiusPx = (nodeRefs.current[seg]?.offsetWidth || 80) * 0.5;

                        let prevSx = p0.x * scaleX;
                        let prevSy = p0.y * scaleY;
                        let foundContact = false;

                        for (let s = 1; s <= samplesPerSeg; s++) {
                            const t = s / samplesPerSeg;
                            const u = 1 - t;
                            const bx =
                                u * u * u * p0.x +
                                3 * u * u * t * p1x +
                                3 * u * t * t * p2x +
                                t * t * t * p3.x;
                            const by =
                                u * u * u * p0.y +
                                3 * u * u * t * p1y +
                                3 * u * t * t * p2y +
                                t * t * t * p3.y;

                            const sx = bx * scaleX;
                            const sy = by * scaleY;
                            const dx = sx - prevSx;
                            const dyy = sy - prevSy;
                            const stepLen = Math.hypot(dx, dyy);
                            cumLen += stepLen;
                            if (stepLen > 0.001) {
                                samples.push({
                                    x: sx,
                                    y: sy,
                                    len: cumLen,
                                    tx: dx / stepLen,
                                    ty: dyy / stepLen,
                                });
                            }
                            prevSx = sx;
                            prevSy = sy;

                            if (!foundContact && Math.hypot(sx - targetSx, sy - targetSy) <= radiusPx + 2) {
                                contactLengths[seg] = cumLen;
                                foundContact = true;
                            }
                        }

                        if (!foundContact) {
                            contactLengths[seg] = Math.max(2, cumLen - radiusPx);
                        }
                    }

                    const dashLen = Math.ceil(cumLen) + 4;
                    pathSamplesRef.current = samples;
                    metrics = { dashLen, contactLengths };
                    return metrics;
                };

                const syncLitNodes = (progress: number) => {
                    const drawnPx = progress * metrics.dashLen;
                    drawnPxRef.current = drawnPx;

                    for (let i = 0; i < nodes.length; i++) {
                        const contact = metrics.contactLengths[i];
                        const cardEl = cardRefs.current[i];
                        const glowEl = firelightRefs.current[i];
                        const mediaEl = mediaRefs.current[i];
                        const isLast = i === nodes.length - 1;
                        const firelight =
                            i === 0
                                ? Math.max(0, Math.min(1, (drawnPx - 120) / 280))
                                : isLast
                                  ? Math.max(0, Math.min(1, (drawnPx - (contact - 160)) / 180))
                                  : Math.max(0, Math.min(1, (drawnPx - contact) / 240));
                        const mediaOpacity =
                            i === 0
                                ? Math.max(0, Math.min(1, (drawnPx - 40) / 300))
                                : isLast
                                  ? Math.max(0, Math.min(1, (drawnPx - (contact - 200)) / 220))
                                  : Math.max(0, Math.min(1, (drawnPx - (contact - 60)) / 300));
                        if (glowEl) {
                            glowEl.style.opacity = firelight.toFixed(3);
                        }
                        if (mediaEl) {
                            mediaEl.style.opacity = mediaOpacity.toFixed(3);
                        }
                        if (cardEl) {
                            cardEl.classList.toggle(styles.cardFirelightLit, firelight > 0.3);
                        }

                        const shouldLight = drawnPx >= contact;
                        if (shouldLight === litStates[i]) continue;

                        litStates[i] = shouldLight;
                        const nodeEl = nodeRefs.current[i];
                        const videoEl = videoRefs.current[i];

                        if (shouldLight) {
                            nodeEl?.classList.add(styles.nodeCircleLit);
                            if (videoEl) {
                                videoEl.currentTime = 0;
                                videoEl.play().catch(() => {});
                            }
                        } else {
                            nodeEl?.classList.remove(styles.nodeCircleLit);
                            videoEl?.pause();
                        }
                    }
                };

                computePathMetrics();

                /* ── 1. Draw the path — keep top start unchanged, finish sooner at the last milestone ── */
                const firstNodeY = nodes[0].y;
                const lastNodeY = nodes[nodes.length - 1].y;
                const finishEndY = Math.max(firstNodeY + 200, lastNodeY - 80);
                const startOffset = firstNodeY - 300;
                const startTrigger =
                    startOffset >= 0 ? `top+=${startOffset}px 55%` : `top-=${Math.abs(startOffset)}px 55%`;

                let pathTween: ReturnType<typeof gsap.fromTo> | null = null;

                pathTween = gsap.fromTo(
                    pathEl,
                    {
                        strokeDasharray: () => metrics.dashLen,
                        strokeDashoffset: () => metrics.dashLen,
                    },
                    {
                        strokeDasharray: () => metrics.dashLen,
                        strokeDashoffset: 0,
                        ease: 'none',
                        onUpdate: () => {
                            if (pathTween) {
                                syncLitNodes(pathTween.progress());
                            }
                        },
                        scrollTrigger: {
                            trigger: canvasRef.current,
                            start: startTrigger,
                            end: `clamp(top+=${finishEndY}px 62%)`,
                            scrub: 0.85,
                            invalidateOnRefresh: true,
                            onRefreshInit: () => {
                                computePathMetrics();
                            },
                            onRefresh: (self) => {
                                syncLitNodes(self.animation ? self.animation.progress() : 0);
                            },
                            onScrubComplete: (self) => {
                                syncLitNodes(self.animation ? self.animation.progress() : 0);
                            },
                        },
                    }
                );

                /* ── 2. Reveal each unlit circular node ring + card on viewport entry ── */
                nodes.forEach((node, i) => {
                    const card = cardRefs.current[i];
                    const nodeEl = nodeRefs.current[i];

                    const stConfig = {
                        trigger: canvasRef.current,
                        start: `top+=${node.y}px 95%`,
                        toggleActions: 'play none none reverse',
                    };

                    if (nodeEl) {
                        gsap.fromTo(
                            nodeEl,
                            { opacity: 0, scale: 0.72 },
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.45,
                                ease: 'power2.out',
                                scrollTrigger: stConfig,
                            }
                        );
                    }

                    if (card) {
                        const xFrom = node.isLeft ? -40 : 40;
                        gsap.fromTo(
                            card,
                            { opacity: 0, x: xFrom, y: 10 },
                            {
                                opacity: 1,
                                x: 0,
                                y: 0,
                                duration: 0.55,
                                delay: 0.08,
                                ease: 'power3.out',
                                scrollTrigger: stConfig,
                            }
                        );
                    }
                });

                syncLitNodes(pathTween.progress());
            }, sectionRef);

            revertCtx = () => {
                gsapCtx.revert();
                nodeRefs.current.forEach((el) => el?.classList.remove(styles.nodeCircleLit));
                videoRefs.current.forEach((vid) => vid?.pause());
            };
            ScrollTrigger.refresh();
        })();

        return () => {
            cancelled = true;
            revertCtx?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events.length]);

    // 60fps Canvas flame overlay locked to the exact SVG path tip & lit ribbon
    useEffect(() => {
        const canvas = flameCanvasRef.current;
        const container = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !container || !section) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const renderer = new TimelineFlameRenderer();
        flameRendererRef.current = renderer;

        let raf = 0;
        let visible = true;

        const syncSize = () => {
            const w = Math.max(300, Math.round(container.clientWidth));
            const h = Math.max(300, Math.round(container.clientHeight));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        };
        syncSize();

        const sizeObserver = new ResizeObserver(syncSize);
        sizeObserver.observe(container);

        let lastPaint = 0;

        const loop = (now: number) => {
            if (!visible || document.hidden) {
                raf = 0;
                return;
            }
            const minInterval = window.innerWidth <= 768 ? 42 : 0; // ~24fps on mobile
            if (minInterval === 0 || now - lastPaint >= minInterval) {
                lastPaint = now;
                renderer.render(
                    ctx,
                    canvas.width,
                    canvas.height,
                    pathSamplesRef.current,
                    drawnPxRef.current,
                    DEFAULT_TIMELINE_FLAME_TUNING,
                    now / 1000
                );
            }
            raf = requestAnimationFrame(loop);
        };

        const ensureRunning = () => {
            if (!raf && visible && !document.hidden) {
                raf = requestAnimationFrame(loop);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                visible = Boolean(entries[0]?.isIntersecting);
                if (visible) {
                    ensureRunning();
                } else if (raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            },
            { rootMargin: '160px 0px' }
        );
        observer.observe(section);

        const onVisibility = () => {
            if (document.hidden) {
                if (raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            } else {
                ensureRunning();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            if (raf) cancelAnimationFrame(raf);
            sizeObserver.disconnect();
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            flameRendererRef.current = null;
        };
    }, []);

    return (
        <section id="timeline" aria-labelledby="timeline-heading" className={styles.root} ref={sectionRef}>
            <div className="container">
                {/* ── Header ── */}
                <div className={styles.header}>
                    <span className={styles.eyebrow}><span>—</span> Our History <span>—</span></span>
                    <h2 id="timeline-heading" className={styles.title}>A Century of Craft</h2>
                    <p className={styles.lead}>
                        Four generations of butchery — from a German village block to Chicago&apos;s South Side
                        stockyards, and on to our Northfield butcher counter and The Depot in Winnetka. Scroll to
                        follow the fire through more than 120 years of Hofherr family craft.
                    </p>
                </div>

                {/* ── Canvas ── */}
                <div
                    ref={canvasRef}
                    className={styles.canvas}
                    style={{ '--tl-h': `${totalH}px` } as React.CSSProperties}
                >
                    {/* Ambient glows */}
                    <div className={styles.glowRed} />
                    <div className={styles.glowGold} />

                    {/* SVG — serpentine path only (circles live in HTML so preserveAspectRatio="none" never distorts them) */}
                    <svg
                        ref={svgRef}
                        className={styles.svg}
                        viewBox={`0 0 ${SVG_W} ${totalH}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#cc0e1d" />
                                <stop offset="50%" stopColor="#c5a255" />
                                <stop offset="100%" stopColor="#cc0e1d" />
                            </linearGradient>
                            <filter
                                id="tlGlow"
                                filterUnits="userSpaceOnUse"
                                x="-100"
                                y="-100"
                                width={SVG_W + 200}
                                height={totalH + 200}
                            >
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Faint dotted guide */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="2"
                            strokeDasharray="6 12"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Animated glowing stroke */}
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none"
                            stroke="url(#tlGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            filter="url(#tlGlow)"
                        />
                    </svg>

                    {/* Real-time 60fps Canvas Flame Overlay locked to the burning line tip */}
                    <canvas ref={flameCanvasRef} className={styles.flameCanvas} aria-hidden="true" />

                    {/* HTML cards & paired archival/shop photographs — positioned at each node */}
                    {nodes.map((node, i) => {
                        const topPct = (node.y / totalH) * 100;
                        const media = resolveEventMedia(events[i], i);
                        const cardEl = (
                            <div
                                ref={el => { cardRefs.current[i] = el; }}
                                className={`${styles.card} ${node.isLeft ? styles.cardLeft : styles.cardRight} ${styles.cardFirelight}`}
                            >
                                <div
                                    ref={el => { firelightRefs.current[i] = el; }}
                                    className={styles.cardFirelightGlow}
                                    aria-hidden="true"
                                />
                                <div className={styles.cardEra}>{events[i].era}</div>
                                <h3 className={styles.cardTitle}>{events[i].title}</h3>
                                {events[i].body && <p className={styles.cardBody}>{events[i].body}</p>}
                            </div>
                        );
                        const mediaEl = (
                            <figure
                                ref={el => { mediaRefs.current[i] = el; }}
                                className={styles.mediaCard}
                            >
                                <div className={styles.mediaFrame}>
                                    <Image
                                        src={media.image}
                                        alt={media.imageAlt}
                                        fill
                                        sizes="(max-width: 700px) 90vw, 680px"
                                        className={styles.mediaImg}
                                    />
                                    <div className={styles.mediaVignette} aria-hidden="true" />
                                </div>
                                <figcaption className={styles.mediaCaption}>
                                    <span className={styles.mediaCaptionIndex}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{events[i].era}</span>
                                </figcaption>
                            </figure>
                        );
                        return (
                            <div
                                key={events[i].title}
                                className={styles.row}
                                style={{ '--row-top': `${topPct}%` } as React.CSSProperties}
                            >
                                {/* Left slot */}
                                <div className={`${styles.slotLeft} ${node.isLeft ? styles.slotCard : styles.slotMedia}`}>
                                    {node.isLeft ? cardEl : mediaEl}
                                </div>

                                {/* Center spacer */}
                                <div className={styles.nodeCenter} />

                                {/* Right slot */}
                                <div className={`${styles.slotRight} ${node.isLeft ? styles.slotMedia : styles.slotCard}`}>
                                    {node.isLeft ? mediaEl : cardEl}
                                </div>
                            </div>
                        );
                    })}

                    {/* Perfect circular border + flame video nodes positioned at each SVG node coordinate */}
                    {nodes.map((node, i) => (
                        <div
                            key={`vid-${events[i].title}`}
                            className={styles.nodeVideoWrap}
                            style={{
                                '--node-x': `${(node.x / SVG_W) * 100}%`,
                                '--node-y': `${(node.y / totalH) * 100}%`,
                            } as React.CSSProperties}
                        >
                            <div
                                ref={el => { nodeRefs.current[i] = el; }}
                                className={styles.nodeCircle}
                            >
                                <video
                                    ref={el => { videoRefs.current[i] = el; }}
                                    src={events[i].video ?? '/video-clips/stage-fire.mp4'}
                                    className={styles.nodeVideo}
                                    muted
                                    playsInline
                                    loop
                                    preload="auto"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
