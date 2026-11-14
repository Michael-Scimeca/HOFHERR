'use client';

import { useRef } from 'react';
import styles from './PressTicker.module.css';
import { PressCanvasStage } from './PressTickerFire';

/**
 * PressTicker — "As featured in" marquee in the same tilted, two-direction
 * style as the catering ticker, separated by Hofherr circular SVG emblem icons.
 * Butcher emblems ignite with <canvas> torch flames + sparks on hover; press
 * logos emit <canvas> embers behind them.
 */
type Outlet = {
    name: string;
    icon: string;
    logo?: string;
    /** Render the logo in solid white (for dark or single-colour marks). */
    mono?: boolean;
    /** Solid black backing plate for rectangular plaques with transparent cutout letters. */
    plaqueBackdrop?: boolean;
    /** Opaque rectangular/brushstroke plaque — emit behind-logo embers along its outer rim so they aren't hidden behind solid fill. */
    plaque?: boolean;
    /** Relative height multiplier so wide and stacked marks look balanced. */
    scale?: number;
};

const ROW_ONE: Outlet[] = [
    { name: 'WTTW', icon: '/icons/cow.svg', logo: '/press/wttw.svg', mono: true, scale: 0.7 },
    { name: 'NBC News', icon: '/icons/suage.svg', logo: '/press/nbc-news.svg', mono: true, scale: 1.5 },
    { name: 'The Record North Shore', icon: '/icons/chicken.svg', logo: '/assets/press/the-record-north-shore.svg', mono: true, scale: 1.3 },
    { name: 'Chicago Tribune', icon: '/icons/lamb.svg', logo: '/press/chicago-tribune-mono.svg', plaque: true, scale: 0.8 },
    {
        name: "America's Test Kitchen",
        icon: '/icons/game.svg',
        logo: '/press/americas-test-kitchen.svg',
        mono: true,
        plaqueBackdrop: true,
        plaque: true,
        scale: 1.15,
    },
];

const ROW_TWO: Outlet[] = [
    { name: 'Proof Podcast', icon: '/icons/pig.svg', logo: '/assets/press/proof-podcast-mono.svg', plaque: true, scale: 1.3 },
    { name: 'ABC News', icon: '/icons/turkey.svg', logo: '/press/abc-news.svg', mono: true, scale: 1.05 },
    { name: 'Nextdoor', icon: '/icons/veal.svg', logo: '/press/nextdoor.svg', mono: true, scale: 0.6 },
    { name: "Cook's Country", icon: '/icons/duck.svg', logo: '/press/cooks-country.svg', mono: true, scale: 0.8 },
    { name: 'Northfield Neighbors', icon: '/icons/grabgo.svg' },
    { name: 'Northfield Living', icon: '/icons/catering.svg', logo: '/assets/press/northfield-living.svg', scale: 1.25 },
];

const COPY_KEYS = ['copy-a', 'copy-b', 'copy-c', 'copy-d'] as const;

interface RowProps {
    outlets: Outlet[];
    direction: 'left' | 'right';
    rowIndex: number;
}

function Row({ outlets, direction, rowIndex }: RowProps) {
    const directionClass = direction === 'left' ? styles.rowLeft : styles.rowRight;

    return (
        <div className={styles.rowShell} data-press-row={direction}>
            <div className={`${styles.track} ${directionClass}`} data-press-track="true">
                {COPY_KEYS.map((copyKey, copyIdx) => (
                    <ul
                        key={copyKey}
                        className={styles.group}
                        data-press-group={copyIdx}
                        aria-hidden={copyIdx > 0}
                    >
                        {outlets.map((outlet, outletIdx) => {
                            const logoIdx = outletIdx * 2;
                            const iconIdx = outletIdx * 2 + 1;

                            return (
                                <li key={outlet.name} className={styles.item}>
                                    <span
                                        data-fire-kind="logo"
                                        data-fire-plaque={outlet.plaque ? 'true' : undefined}
                                        data-fire-id={`${copyIdx}:${rowIndex}:${logoIdx}:logo`}
                                        className={styles.logoHost}
                                    >
                                        {outlet.plaqueBackdrop && (
                                            <span className={styles.plaqueBackdrop} aria-hidden="true" />
                                        )}
                                        {outlet.logo ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                data-fire-visual="true"
                                                src={outlet.logo}
                                                alt={copyIdx === 0 ? outlet.name : ''}
                                                className={`${styles.logo} ${outlet.mono ? styles.mono : ''}`}
                                                style={{ ['--logo-scale' as string]: outlet.scale ?? 1 }}
                                                decoding="async"
                                            />
                                        ) : (
                                            <span data-fire-visual="true" className={styles.wordmark}>
                                                {outlet.name}
                                            </span>
                                        )}
                                    </span>

                                    <span
                                        data-fire-kind="icon"
                                        data-fire-id={`${copyIdx}:${rowIndex}:${iconIdx}:icon`}
                                        className={styles.bulletHost}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            data-fire-visual="true"
                                            src={outlet.icon}
                                            alt=""
                                            className={styles.bullet}
                                            decoding="async"
                                        />
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ))}
            </div>
        </div>
    );
}

export interface PressTickerProps {
    heading?: string | null;
}

export default function PressTicker({ heading = 'As Featured In' }: PressTickerProps) {
    const wrapRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="press-coverage"
            aria-labelledby={heading ? 'press-coverage-heading' : undefined}
            aria-label={heading ? undefined : 'Press coverage'}
            className={styles.section}
        >
            {heading && (
                <h2 id="press-coverage-heading" className={styles.heading}>
                    {heading}
                </h2>
            )}

            <div ref={wrapRef} className={styles.wrap}>
                <PressCanvasStage containerRef={wrapRef} />

                <div className={styles.crispLayer}>
                    <Row outlets={ROW_ONE} direction="left" rowIndex={0} />
                    <Row outlets={ROW_TWO} direction="right" rowIndex={1} />
                </div>
            </div>
        </section>
    );
}
