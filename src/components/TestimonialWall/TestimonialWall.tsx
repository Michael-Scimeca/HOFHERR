'use client';

import React, { useEffect, useRef, useState } from 'react';
import FireBorder from './FireBorder';
import s from './TestimonialWall.module.css';

/**
 * Tilted, staggered testimonial cards in two rows that drift in opposite directions as you scroll.
 * Pass real reviews via the `reviews` prop. The defaults are PLACEHOLDERS — replace before launch.
 */
export type Review = { quote: string; name: string; meta: string; rating?: number; href?: string };
export type RatingSummary = { rating: number; count: number; url?: string; source: string };

function Stars({ value, className }: { value: number; className?: string }) {
    const full = Math.round(value);
    return (
        <span className={className} role="img" aria-label={`${value} out of 5 stars`}>
            {'★★★★★'.slice(0, full)}<span style={{ opacity: 0.3 }}>{'★★★★★'.slice(full)}</span>
        </span>
    );
}

const ROW_A: Review[] = [
    { quote: 'Sample review — the dry-aged ribeye was the best steak we have cooked at home. The butcher told us exactly how long to rest it.', name: '[Customer name]', meta: 'Google review · placeholder' },
    { quote: 'Sample review — they catered our graduation party with a whole hog and every guest asked where the food came from.', name: '[Customer name]', meta: 'Catering client · placeholder' },
    { quote: 'Sample review — my Saturday stop. Great brats, better people, and they always remember my order.', name: '[Customer name]', meta: 'Northfield regular · placeholder' },
    { quote: 'Sample review — we order the Thanksgiving turkey here every year. Brined, ready, and never dry.', name: '[Customer name]', meta: 'Google review · placeholder' },
];

const ROW_B: Review[] = [
    { quote: 'Sample review — the Depot is the easiest dinner on the way home from the train. Rotisserie chicken is a weeknight hero.', name: '[Customer name]', meta: 'Winnetka Depot · placeholder' },
    { quote: 'Sample review — asked for a custom cut and they had it ready in an hour, trimmed perfectly.', name: '[Customer name]', meta: 'Google review · placeholder' },
    { quote: 'Sample review — the bone broth and the chili are always in my freezer. Real food, made in house.', name: '[Customer name]', meta: 'Customer · placeholder' },
    { quote: 'Sample review — a proper neighborhood butcher. You can taste the difference in everything.', name: '[Customer name]', meta: 'Google review · placeholder' },
];

// Interleave both lists (red up, cream down) and repeat so the row always runs past both screen edges.
const ALL: Review[] = Array.from({ length: 8 }, (_, i) => (i % 2 ? ROW_B : ROW_A)[Math.floor(i / 2) % 4]);
const TILTS = [-3.5, 2.5, 4, -2, -4.5, 3, 2, -3, -2.5, 4.5, 3.5, -2, 3, -4];

function Card({ r, tone, tilt, offset, delay, hidden }: { r: Review; tone: 'red' | 'light'; tilt: number; offset: number; delay: number; hidden?: boolean }) {
    const [hot, setHot] = useState(false);
    return (
        <figure
            className={`${s.card} ${tone === 'red' ? s.red : s.light}`}
            style={{ '--tilt': `${tilt}deg`, '--offset': `${offset}px`, '--delay': `${delay}s` } as React.CSSProperties}
            aria-hidden={hidden || undefined}
            onMouseEnter={() => setHot(true)}
            onMouseLeave={() => setHot(false)}
            onFocus={() => setHot(true)}
            onBlur={() => setHot(false)}
        >
            <FireBorder active={hot} />
            <span className={`${s.mark} ${s.markTop}`} aria-hidden="true">”</span>
            {r.rating ? <Stars value={r.rating} className={s.stars} /> : null}
            <blockquote className={s.quote}>{r.quote}</blockquote>
            <figcaption className={s.who}>
                <b>{r.href ? <a href={r.href} target="_blank" rel="noreferrer" className={s.nameLink}>{r.name}</a> : r.name}</b>
                <span>{r.meta}</span>
            </figcaption>
            <span className={`${s.mark} ${s.markBottom}`} aria-hidden="true">“</span>
        </figure>
    );
}

export default function TestimonialWall({ reviews = ALL, kicker = 'From the counter', title = 'What the neighborhood says', summary }: { reviews?: Review[]; kicker?: string; title?: string; summary?: RatingSummary | null }) {
    // Fewer than 8 reviews? Cycle them so the moving row always runs past both screen edges.
    // Only run the endless conveyor when there are enough different reviews to fill the screen —
    // otherwise show each review once, still and centered, so nothing appears twice.
    const moving = reviews.length >= 6;
    const list = reviews;
    const section = useRef<HTMLElement>(null);
    const rowA = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const el = section.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            // -1 → 1 as the section travels through the viewport
            const p = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
            rowA.current?.style.setProperty('--drift', `${p * -160}px`);
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
    }, []);

    return (
        <div className={s.block}>
            <header className={s.intro}>
                <p className={s.kicker}>{kicker}</p>
                <h2 className={s.title}>{title}</h2>
                {summary && summary.count > 0 && (
                    <a className={s.summary} href={summary.url} target="_blank" rel="noreferrer">
                        <b>{summary.rating.toFixed(1)}</b> <Stars value={summary.rating} className={s.summaryStars} /> <span>{summary.count.toLocaleString()} {summary.source} reviews</span>
                    </a>
                )}
            </header>
            <section ref={section} className={`${s.wall} ${moving ? '' : s.still}`} aria-label="Customer reviews">
                {/* outer track: scroll-linked drift · inner row: endless marquee (list rendered twice for a seamless loop) */}
                <div ref={rowA} className={s.track}>
                    <div className={s.row}>
                        {(moving ? [0, 1] : [0]).map((copy) =>
                            list.map((r, i) => (
                                <Card key={`${copy}-${i}`} r={r} tone={i % 2 ? 'light' : 'red'} tilt={TILTS[i % TILTS.length]} offset={i % 2 ? 118 : -118} delay={(i % 5) * -1.3} hidden={copy === 1} />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
