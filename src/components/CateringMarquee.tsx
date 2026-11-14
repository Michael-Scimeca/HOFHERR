'use client';

import { useRef } from 'react';
import styles from './CateringMarquee.module.css';
import { PressCanvasStage } from './PressTickerFire';

type MarqueePhrase = {
    text: string;
    icon: string;
    accent?: boolean;
};

type MarqueeRow = {
    id: string;
    direction: 'left' | 'right';
    rowClass: string;
    phrases: MarqueePhrase[];
};

const MARQUEE_ROWS: MarqueeRow[] = [
    {
        id: 'row-1',
        direction: 'left',
        rowClass: styles.marqueeRow1,
        phrases: [
            { text: 'Pig Roasts', icon: '/icons/pig.svg', accent: true },
            { text: 'BBQ Catering', icon: '/icons/catering.svg' },
            { text: 'Rotisserie', icon: '/icons/chicken.svg', accent: true },
            { text: 'Custom Platters', icon: '/icons/prepared.svg' },
        ],
    },
    {
        id: 'row-2',
        direction: 'right',
        rowClass: styles.marqueeRow2,
        phrases: [
            { text: 'Private Events', icon: '/icons/festival.svg' },
            { text: 'Corporate Dinners', icon: '/icons/cow.svg', accent: true },
            { text: 'Backyard Parties', icon: '/icons/suage.svg' },
            { text: 'Weddings', icon: '/icons/lamb.svg', accent: true },
        ],
    },
    {
        id: 'row-3',
        direction: 'left',
        rowClass: styles.marqueeRow3,
        phrases: [
            { text: 'Smoked Brisket', icon: '/icons/cow.svg', accent: true },
            { text: 'Pulled Pork', icon: '/icons/pig.svg' },
            { text: 'Whole Hog', icon: '/icons/game.svg', accent: true },
            { text: 'Charcuterie', icon: '/icons/hamcheese.svg' },
        ],
    },
    {
        id: 'row-4',
        direction: 'right',
        rowClass: styles.marqueeRow4,
        phrases: [
            { text: 'Custom Menus', icon: '/icons/turkey.svg' },
            { text: 'Competition BBQ', icon: '/icons/duck.svg', accent: true },
            { text: 'Full Service', icon: '/icons/grabgo.svg' },
            { text: 'Farm to Fire', icon: '/icons/veal.svg', accent: true },
        ],
    },
];

/** Four copies match PressCanvasStage's 4-copy transform stride and cover ultrawide viewports seamlessly. */
const COPY_KEYS = ['copy-a', 'copy-b', 'copy-c', 'copy-d'] as const;

export default function CateringMarquee({ id = 'catering-marquee' }: { id?: string }) {
    const wrapRef = useRef<HTMLDivElement>(null);

    return (
        <section id={id} aria-label="BBQ and catering highlights" className="section-sm">
            <div className={styles.marqueeOuter}>
                <div ref={wrapRef} className={styles.marqueeWrap}>
                    <PressCanvasStage containerRef={wrapRef} />

                    <div className={styles.crispLayer}>
                        {MARQUEE_ROWS.map((row, rowIndex) => (
                            <div
                                key={row.id}
                                className={styles.rowShell}
                                data-press-row={row.direction}
                            >
                                <div
                                    className={`${styles.marqueeTrack} ${row.rowClass}`}
                                    data-press-track="true"
                                >
                                    {COPY_KEYS.map((copyKey, copyIdx) => (
                                        <div
                                            key={`${row.id}-${copyKey}`}
                                            className={styles.marqueePass}
                                            data-press-group={copyIdx}
                                            aria-hidden={copyIdx > 0 ? true : undefined}
                                        >
                                            {row.phrases.map((phrase, phraseIdx) => {
                                                const logoIdx = phraseIdx * 2;
                                                const iconIdx = phraseIdx * 2 + 1;

                                                return (
                                                    <span
                                                        key={`${row.id}-${copyKey}-${phrase.text}`}
                                                        className={styles.marqueeItem}
                                                    >
                                                        <span
                                                            data-fire-kind="logo"
                                                            data-fire-id={`${copyIdx}:${rowIndex}:${logoIdx}:logo`}
                                                            className={styles.phraseHost}
                                                        >
                                                            <span
                                                                data-fire-visual="true"
                                                                className={`${styles.marqueeText} ${phrase.accent ? styles.marqueeTextAccent : ''}`}
                                                            >
                                                                {phrase.text}
                                                            </span>
                                                        </span>

                                                        <span
                                                            data-fire-kind="icon"
                                                            data-fire-id={`${copyIdx}:${rowIndex}:${iconIdx}:icon`}
                                                            className={styles.bulletHost}
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                data-fire-visual="true"
                                                                src={phrase.icon}
                                                                alt=""
                                                                decoding="async"
                                                                className={styles.marqueeBullet}
                                                            />
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
