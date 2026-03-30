'use client';

import { useEffect, useRef } from 'react';
import styles from './InteractiveTimeline.module.css';

type TimelineEvent = { era: string; title: string; body?: string | null; video?: string | null };
type Props = { events: TimelineEvent[] };

/* ── Layout constants (SVG coordinate space) ── */
const SVG_W   = 1000;
const STEP_H  = 300;
const LEFT_X  = 80;    // outer edge of left card column
const RIGHT_X = 920;   // outer edge of right card column
const NODE_R  = 28;


export default function InteractiveTimeline({ events }: Props) {
    const sectionRef  = useRef<HTMLElement>(null);
    const canvasRef   = useRef<HTMLDivElement>(null);
    const pathRef     = useRef<SVGPathElement>(null);
    const dotPathRef  = useRef<SVGPathElement>(null);
    const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const nodeRefs    = useRef<(SVGGElement | null)[]>([]);
    const iconRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const videoRefs   = useRef<(HTMLVideoElement | null)[]>([]);


    const totalH = events.length * STEP_H + 60;

    /* ── Node positions ── */
    const nodes = events.map((_, i) => ({
        x: i % 2 === 0 ? LEFT_X : RIGHT_X,
        y: i * STEP_H + 50,  // 50px from the TOP of each step — not centered
        isLeft: i % 2 === 0,
    }));

    /* ── Serpentine cubic-bezier path ── */
    const pathD = nodes.reduce((d, n, i) => {
        if (i === 0) return `M ${n.x} ${n.y}`;
        const prev = nodes[i - 1];
        const dy   = n.y - prev.y;
        return d + ` C ${prev.x} ${prev.y + dy * 0.45}, ${n.x} ${n.y - dy * 0.45}, ${n.x} ${n.y}`;
    }, '');

    useEffect(() => {
        /* Dynamic import keeps GSAP out of the SSR bundle */
        let ctx: any;

        (async () => {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            if (!sectionRef.current || !pathRef.current) return;

            ctx = gsap.context(() => {
                const pathEl    = pathRef.current!;
                const totalLen  = pathEl.getTotalLength();

                /* ── 1. Draw the path — canvas as trigger (immune to page layout shifts) ── */
                const firstNodeY = nodes[0].y;
                const lastNodeY  = nodes[nodes.length - 1].y;

                gsap.fromTo(
                    pathEl,
                    { strokeDasharray: totalLen, strokeDashoffset: totalLen },
                    {
                        strokeDashoffset: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: canvasRef.current,
                            start: `top+=${firstNodeY}px 95%`,
                            end:   `top+=${lastNodeY}px 95%`,
                            scrub: 0.3,
                        },
                    }
                );

                /* ── 2. Reveal each node + card as the path reaches it ── */
                nodes.forEach((node, i) => {
                    const card   = cardRefs.current[i];
                    const nodeG  = nodeRefs.current[i];
                    const iconEl = iconRefs.current[i];

                    const stConfig: any = {
                        trigger: canvasRef.current,
                        start: `top+=${node.y}px 95%`,
                        toggleActions: 'play none none reverse',
                    };

                    if (nodeG) {
                        gsap.fromTo(nodeG,
                            { opacity: 0, scale: 0.3,  transformOrigin: 'center center' },
                            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)',
                              scrollTrigger: stConfig }
                        );
                    }

                    if (iconEl) {
                        gsap.fromTo(iconEl,
                            { opacity: 0, scale: 0.5 },
                            { opacity: 1, scale: 1, duration: 0.4, delay: 0.15, ease: 'back.out(2)',
                              scrollTrigger: stConfig }
                        );
                    }

                    if (card) {
                        const xFrom = node.isLeft ? -40 : 40;
                        gsap.fromTo(card,
                            { opacity: 0, x: xFrom, y: 10 },
                            { opacity: 1, x: 0, y: 0, duration: 0.55, delay: 0.1, ease: 'power3.out',
                              scrollTrigger: stConfig }
                        );
                    }

                    // Play video when node is reached
                    const videoEl = videoRefs.current[i];
                    if (videoEl) {
                        gsap.fromTo(videoEl,
                            { opacity: 0, scale: 0.4 },
                            {
                                opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)',
                                scrollTrigger: stConfig,
                                onStart: () => {
                                    videoEl.play().catch(() => {});
                                },
                            }
                        );
                    }
                });

            }, sectionRef);

            // Force recalculate after sticky-positioned elements above settle
            ScrollTrigger.refresh();
        })();

        return () => {
            ctx?.revert();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events.length]);

    return (
        <section className={styles.root} ref={sectionRef}>
            {/* ── Header ── */}
            <div className={styles.header}>
                <span className={styles.eyebrow}><span>—</span> Our History <span>—</span></span>
                <h2 className={styles.title}>A Century of Craft</h2>
            </div>

            {/* ── Canvas ── */}
            <div ref={canvasRef} className={styles.canvas} style={{ height: totalH, maxWidth: SVG_W }}>

                {/* Ambient glows */}
                <div className={styles.glowRed} />
                <div className={styles.glowGold} />

                {/* SVG — path + nodes */}
                <svg
                    className={styles.svg}
                    viewBox={`0 0 ${SVG_W} ${totalH}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="#cc0e1d" />
                            <stop offset="50%"  stopColor="#c5a255" />
                            <stop offset="100%" stopColor="#cc0e1d" />
                        </linearGradient>
                        <filter id="tlGlow" x="-50%" y="-50%" width="200%" height="200%">
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
                    />

                    {/* Animated glowing stroke */}
                    <path
                        ref={pathRef}
                        d={pathD}
                        fill="none"
                        stroke="url(#tlGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#tlGlow)"
                    />

                    {/* Node circles */}
                    {nodes.map((node, i) => (
                        <g
                            key={i}
                            ref={el => { nodeRefs.current[i] = el; }}
                            style={{ opacity: 0 }}
                        >
                            <circle
                                cx={node.x} cy={node.y} r={NODE_R + 14}
                                fill="rgba(204,14,29,0.08)"
                            />
                            <circle
                                cx={node.x} cy={node.y} r={NODE_R}
                                fill="#111"
                                stroke="#cc0e1d"
                                strokeWidth="2"
                                filter="url(#tlGlow)"
                            />
                        </g>
                    ))}
                </svg>

                {/* HTML cards — positioned at each node */}
                {nodes.map((node, i) => {
                    const topPct = (node.y / totalH) * 100;
                    return (
                        <div
                            key={i}
                            className={styles.row}
                            style={{ top: `${topPct}%` }}
                        >
                            {/* Left slot */}
                            <div className={styles.slotLeft}>
                                {node.isLeft && (
                                    <div
                                        ref={el => { cardRefs.current[i] = el; }}
                                        className={`${styles.card} ${styles.cardLeft}`}
                                        style={{ opacity: 0 }}
                                    >
                                        <div className={styles.cardEra}>{events[i].era}</div>
                                        <h3 className={styles.cardTitle}>{events[i].title}</h3>
                                        {events[i].body && <p className={styles.cardBody}>{events[i].body}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Center spacer */}
                            <div className={styles.nodeCenter} />

                            {/* Right slot */}
                            <div className={styles.slotRight}>
                                {!node.isLeft && (
                                    <div
                                        ref={el => { cardRefs.current[i] = el; }}
                                        className={`${styles.card} ${styles.cardRight}`}
                                        style={{ opacity: 0 }}
                                    >
                                        <div className={styles.cardEra}>{events[i].era}</div>
                                        <h3 className={styles.cardTitle}>{events[i].title}</h3>
                                        {events[i].body && <p className={styles.cardBody}>{events[i].body}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Fire videos — absolutely positioned at each SVG node's exact coordinates */}
                {nodes.map((node, i) => (
                    <div
                        key={`vid-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${(node.x / SVG_W) * 100}%`,
                            top: `${(node.y / totalH) * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 33,
                            pointerEvents: 'none',
                        }}
                    >
                        <video
                            ref={el => { videoRefs.current[i] = el; }}
                            src={events[i].video ?? '/video-clips/stage-fire.mp4'}
                            className={styles.nodeVideo}
                            muted
                            playsInline
                            loop
                            preload="none"
                            style={{ opacity: 0 }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
