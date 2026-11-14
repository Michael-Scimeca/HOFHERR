'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import FireBorder from './FireBorder';
import s from './TestimonialWall.module.css';

/**
 * Tilted, staggered testimonial cards in two rows that drift in opposite directions as you scroll.
 * Pass real reviews via the `reviews` prop. The defaults are PLACEHOLDERS — replace before launch.
 */
export type Review = { quote: string; name: string; meta: string; rating?: number; href?: string };
export type RatingSummary = { rating: number; count: number; url?: string; source: string };

type CardSlot = {
    id: string;
    review: Review;
    tone: 'red' | 'light';
    tilt: number;
    offset: number;
    delay: number;
};

type WallDeck = {
    slots: CardSlot[];
    conveyorDelay: string;
};

function Stars({ value, className }: { value: number; className?: string }) {
    const full = Math.round(value);
    return (
        <span className={className} role="img" aria-label={`${value} out of 5 stars`}>
            {'★★★★★'.slice(0, full)}<span className={s.starsDim}>{'★★★★★'.slice(full)}</span>
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

function Card({
    cardKey,
    r,
    tone,
    tilt,
    offset,
    delay,
    selected,
    hidden,
}: {
    cardKey: string;
    r: Review;
    tone: 'red' | 'light';
    tilt: number;
    offset: number;
    delay: number;
    selected?: boolean;
    hidden?: boolean;
}) {
    return (
        <figure
            data-card-key={cardKey}
            className={`${s.card} ${tone === 'red' ? s.red : s.light} ${selected ? s.cardSelected : ''}`}
            style={{ '--tilt': `${tilt}deg`, '--offset': `${offset}px`, '--delay': `${delay}s` } as React.CSSProperties}
            aria-hidden={hidden || undefined}
        >
            <FireBorder active={true} />
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

function buildDeterministicDeck(reviews: Review[]): WallDeck {
    return {
        conveyorDelay: '0s',
        slots: reviews.map((review, i) => ({
            id: `${review.name}-${review.meta}-${review.quote.slice(0, 20)}-${i}`,
            review,
            tone: i % 2 ? 'light' : 'red',
            tilt: TILTS[i % TILTS.length],
            offset: i % 2 ? 118 : -118,
            delay: (i % 5) * -1.3,
        })),
    };
}

function buildRandomizedDeck(reviews: Review[]): WallDeck {
    const shuffled = reviews.map((review, origIdx) => ({
        review,
        id: `${review.name}-${review.meta}-${review.quote.slice(0, 20)}-${origIdx}`,
    }));
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
    }

    const toneParity = Math.random() < 0.5 ? 0 : 1;
    const laneParity = Math.random() < 0.5 ? 0 : 1;
    const tiltSignParity = Math.random() < 0.5 ? 1 : -1;

    const slots: CardSlot[] = shuffled.map(({ review, id }, i) => {
        const isLight = (i + toneParity) % 2 === 1;
        const isLowerLane = (i + laneParity) % 2 === 1;
        const magnitude = 86 + Math.round(Math.random() * 52); // 86px..138px
        const offset = isLowerLane ? magnitude : -magnitude;
        const tiltMag = Number((1.6 + Math.random() * 3.6).toFixed(2)); // 1.6deg..5.2deg
        const tiltDir = (i % 2 === 0 ? 1 : -1) * tiltSignParity * (Math.random() < 0.2 ? -1 : 1);
        const delay = Number((-Math.random() * 6.5).toFixed(2));

        return {
            id,
            review,
            tone: isLight ? 'light' : 'red',
            tilt: Number((tiltMag * tiltDir).toFixed(2)),
            offset,
            delay,
        };
    });

    return {
        slots,
        conveyorDelay: `${(-Math.random() * 70).toFixed(2)}s`,
    };
}

export default function TestimonialWall({ reviews = ALL, kicker = 'From the counter', title = 'What the neighborhood says', summary }: { reviews?: Review[]; kicker?: string; title?: string; summary?: RatingSummary | null }) {
    // Fewer than 6 reviews? Show each review once, still and centered, so nothing appears twice.
    const moving = reviews.length >= 6;
    const fallbackDeck = useMemo(() => buildDeterministicDeck(reviews), [reviews]);
    const [randomDeck, setRandomDeck] = useState<WallDeck | null>(null);
    const [pausedCardKey, setPausedCardKey] = useState<string | null>(null);
    const deck = randomDeck ?? fallbackDeck;
    const isHydratedRandom = randomDeck !== null;
    const isPaused = moving && pausedCardKey !== null;

    const section = useRef<HTMLElement>(null);
    const rowA = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = section.current;
        if (!el || !moving) return;

        const onWallClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('a')) return;
            const cardEl = target?.closest<HTMLElement>('[data-card-key]');
            const clickedKey = cardEl?.dataset.cardKey ?? '__wall__';
            setPausedCardKey((prev) => (prev !== null ? null : clickedKey));
        };

        el.addEventListener('click', onWallClick);
        return () => el.removeEventListener('click', onWallClick);
    }, [moving]);

    useEffect(() => {
        if (!isPaused) return;

        const onDocPointerDown = (e: PointerEvent) => {
            const el = section.current;
            if (el && !el.contains(e.target as Node)) {
                setPausedCardKey(null);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPausedCardKey(null);
        };

        document.addEventListener('pointerdown', onDocPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onDocPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isPaused]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setRandomDeck(buildRandomizedDeck(reviews));
        });
        return () => cancelAnimationFrame(frame);
    }, [reviews]);

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
            <section
                ref={section}
                className={`${s.wall} ${moving ? '' : s.still} ${isPaused ? s.wallPaused : ''}`}
                aria-label="Customer reviews"
            >
                {/* outer track: scroll-linked drift · inner row: endless marquee (list rendered twice for a seamless loop) */}
                <div ref={rowA} className={`${s.track} ${isHydratedRandom ? s.trackReady : s.trackInit}`}>
                    <div
                        className={s.row}
                        style={{ '--conveyor-delay': deck.conveyorDelay } as React.CSSProperties}
                    >
                        {(moving ? ['primary', 'clone'] : ['primary']).map((copyTag) =>
                            deck.slots.map((slot) => {
                                const cardKey = `${copyTag}-${slot.id}`;
                                return (
                                    <Card
                                        key={cardKey}
                                        cardKey={cardKey}
                                        r={slot.review}
                                        tone={slot.tone}
                                        tilt={slot.tilt}
                                        offset={slot.offset}
                                        delay={slot.delay}
                                        selected={pausedCardKey === cardKey}
                                        hidden={copyTag === 'clone'}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
