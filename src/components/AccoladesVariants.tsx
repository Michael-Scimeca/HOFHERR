'use client';

import { useState } from 'react';
import styles from './AccoladesVariants.module.css';

type IconKind = 'trophy' | 'medal' | 'cleaver' | 'flame' | 'mic';
type AccoladeTier = 'win' | 'top3' | 'guild' | 'media';
type LayoutId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10';
type FilterMode = 'all' | LayoutId;

type AccoladeItem = {
    id: string;
    iconKind: IconKind;
    title: string;
    outcome: string | null;
    tier: AccoladeTier;
    year: string | null;
    stamp: string;
    category: string;
    detail: string;
};

type BigStat = {
    id: string;
    num: string;
    label: string;
};

type LayoutMeta = {
    id: LayoutId;
    name: string;
    note: string;
};

const BIG_STATS: BigStat[] = [
    { id: 'stat-wins', num: '5', label: 'Competition Wins' },
    { id: 'stat-guilds', num: '2', label: 'Guild Memberships' },
    { id: 'stat-years', num: '10+', label: 'Years Competing' },
    { id: 'stat-press', num: '1', label: 'National Feature' },
];

const ACCOLADES: AccoladeItem[] = [
    {
        id: 'chili-2009',
        iconKind: 'trophy',
        title: 'North Shore Chili Cookoff',
        outcome: 'Winner',
        tier: 'win',
        year: '2009',
        stamp: '2009',
        category: 'Competition Win',
        detail:
            'Sean took 1st-place championship honors across North Shore competitors with his slow-simmered prime chuck chili — still a cold-weather staple in the Northfield hot case.',
    },
    {
        id: 'ribfest-2010',
        iconKind: 'trophy',
        title: 'Lake Bluff Ribfest',
        outcome: 'Winner',
        tier: 'win',
        year: '2010',
        stamp: '2010',
        category: 'Competition Win',
        detail:
            '1st-place championship ribs smoked over seasoned hardwood, cementing Hofherr’s reputation on the North Shore barbecue circuit years before opening 300 Happ Rd.',
    },
    {
        id: 'northfield-2008',
        iconKind: 'medal',
        title: 'Northfield Ribfest',
        outcome: 'Top 3',
        tier: 'top3',
        year: '2008',
        stamp: '2008',
        category: 'Top 3 Finish',
        detail:
            'An early hometown podium finish in Northfield — the same neighborhood where Sean would open Hofherr Meat Co. six years later.',
    },
    {
        id: 'chili-2010',
        iconKind: 'medal',
        title: 'North Shore Chili Cookoff',
        outcome: 'Top 3',
        tier: 'top3',
        year: '2010',
        stamp: '2010',
        category: 'Top 3 Finish',
        detail:
            'Back-to-back podium placement defending the previous year’s North Shore Chili Cookoff title against a stacked regional field.',
    },
    {
        id: 'burnoff-2011',
        iconKind: 'medal',
        title: 'Des Plaines Rib, Chicken & Sausage Winter Burn Off',
        outcome: 'Top 3',
        tier: 'top3',
        year: '2011',
        stamp: '2011',
        category: 'Top 3 Finish',
        detail:
            'Multi-protein winter smokehouse competition testing spare ribs, whole poultry, and coarse-ground house link craft in sub-freezing conditions.',
    },
    {
        id: 'butchers-guild',
        iconKind: 'cleaver',
        title: "Member, Butcher's Guild",
        outcome: null,
        tier: 'guild',
        year: null,
        stamp: 'GUILD',
        category: 'Guild Member',
        detail:
            'Active standing in the national guild dedicated to whole-animal seam butchery, humane husbandry, and transparent family-farm sourcing.',
    },
    {
        id: 'iba-member',
        iconKind: 'flame',
        title: 'Member, Illinois Barbecue Association',
        outcome: null,
        tier: 'guild',
        year: null,
        stamp: 'IBA',
        category: 'Guild Member',
        detail:
            'Official member of Illinois’s pitmaster association connecting live-fire smokehouses, competition judges, and regional barbecue stewards.',
    },
    {
        id: 'atk-proof',
        iconKind: 'mic',
        title: 'As Featured on America\'s Test Kitchen "Proof" Podcast',
        outcome: null,
        tier: 'media',
        year: null,
        stamp: 'PRESS',
        category: 'Press Feature',
        detail:
            'Spotlighted nationally by America’s Test Kitchen’s flagship food-culture podcast for neighborhood craft butchery and culinary heritage.',
    },
];

const CHAMPIONSHIP_WINS = ACCOLADES.filter((item) => item.tier === 'win');
const LEDGER_HONORS = ACCOLADES.filter((item) => item.tier !== 'win');
const PODIUM_FINISHES = ACCOLADES.filter((item) => item.tier === 'top3');
const COMPETITION_CIRCUIT = ACCOLADES.filter((item) => item.tier === 'win' || item.tier === 'top3');
const GUILD_ITEMS = ACCOLADES.filter((item) => item.tier === 'guild');
const PRESS_ITEM = ACCOLADES.find((item) => item.tier === 'media') ?? ACCOLADES[7];
const CREDENTIAL_ITEMS = ACCOLADES.filter((item) => item.tier === 'guild' || item.tier === 'media');

const CHRONOLOGICAL_STOPS: AccoladeItem[] = [
    ACCOLADES[2], // 2008 Northfield Ribfest
    ACCOLADES[0], // 2009 North Shore Chili Cookoff Winner
    ACCOLADES[1], // 2010 Lake Bluff Ribfest Winner
    ACCOLADES[3], // 2010 North Shore Chili Cookoff Top 3
    ACCOLADES[4], // 2011 Des Plaines Winter Burn Off Top 3
];

const RIBBON_TOP = ACCOLADES.slice(0, 4);
const RIBBON_BOTTOM = ACCOLADES.slice(4, 8);
const MARQUEE_PASSES = ['pass-primary', 'pass-duplicate'] as const;

const CATEGORY_BANDS = [
    {
        id: 'band-championships',
        title: '01 / Championships',
        subtitle: '1st-place circuit victories',
        items: CHAMPIONSHIP_WINS,
    },
    {
        id: 'band-podiums',
        title: '02 / Podium Finishes',
        subtitle: 'Regional Top-3 smoke & chili placements',
        items: PODIUM_FINISHES,
    },
    {
        id: 'band-guilds',
        title: '03 / Craft Guilds',
        subtitle: 'Active trade & pitmaster standing',
        items: GUILD_ITEMS,
    },
    {
        id: 'band-press',
        title: '04 / National Press',
        subtitle: 'Broadcast & editorial recognition',
        items: [PRESS_ITEM],
    },
];

const LAYOUT_META: LayoutMeta[] = [
    {
        id: '01',
        name: 'Podium + Ledger',
        note: 'Two brass championship plaques paired with a 6-row honor table and top stat bar.',
    },
    {
        id: '02',
        name: 'Balanced Split Monument',
        note: 'Fixes the split-column void by anchoring a 2×2 stat grid beneath the narrative beside an 8-row ghost-year chronicle.',
    },
    {
        id: '03',
        name: 'Three-Pillar Domains',
        note: 'Semantic 3-column grouping: Competition Circuit (05), Craft Guilds (02), and National Press spotlight (01).',
    },
    {
        id: '04',
        name: "Butcher's Bento Mosaic",
        note: 'Zero-gap 12-column architectural grid combining a 6-col hero block, twin 3-col winner plaques, and six 4-col honor tiles.',
    },
    {
        id: '05',
        name: 'Chronological Rail',
        note: 'Horizontal 2008–2011 competition track connected by a brass rule above a 3-seal affiliation bar.',
    },
    {
        id: '06',
        name: 'Broadsheet Honor Index',
        note: 'Zero-card typographic broadsheet with condensed display titles, dotted leaders, and tabular years.',
    },
    {
        id: '07',
        name: '2–3–3 Tiered Pyramid',
        note: 'Column count encodes rank: 2 championship plaques atop 3 podium finishes atop 3 standing credentials.',
    },
    {
        id: '08',
        name: 'Interactive Spotlight Stage',
        note: 'Master-detail selector on the left driving a monumental championship poster and backstory stage on the right.',
    },
    {
        id: '09',
        name: 'Stat Frieze + Kinetic Ribbon',
        note: 'Full-width 4-stat architectural frieze above dual counter-scrolling honor ribbons that pause on hover.',
    },
    {
        id: '10',
        name: 'Swiss Category Bands',
        note: 'Four horizontal chapter bands pairing a 280px category index column with structured 2-up honor entries.',
    },
];

const INTRO_COPY =
    "Sean's culinary accolades span over a decade — from 1st-place competition wins across Chicago's North Shore to national editorial features and active guild memberships.";

function AccoladeIcon({ kind, className }: { kind: IconKind; className: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {kind === 'trophy' && (
                <>
                    <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
                    <path d="M6 6H3.5a2 2 0 0 0 0 4H6" />
                    <path d="M18 6h2.5a2 2 0 0 1 0 4H18" />
                    <path d="M12 14v4" />
                    <path d="M8 21h8" />
                    <path d="M9 18h6" />
                </>
            )}
            {kind === 'medal' && (
                <>
                    <circle cx="12" cy="14" r="5.5" />
                    <path d="M8.5 3.5 10.5 9" />
                    <path d="M15.5 3.5 13.5 9" />
                    <path d="M6 3.5h12" />
                    <path d="M12 11.5v5" />
                </>
            )}
            {kind === 'cleaver' && (
                <>
                    <path d="M4 5h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4V5Z" />
                    <circle cx="7.2" cy="8.2" r="1" />
                    <path d="M18 11h3a1 1 0 0 1 0 2h-3" />
                    <path d="M4 14v4" />
                </>
            )}
            {kind === 'flame' && (
                <>
                    <path d="M12 2.5c2.2 3.2 5.5 5.8 5.5 10.2a5.5 5.5 0 1 1-11 0c0-2.6 1.3-4.7 2.8-6.4.4 1.6 1.5 2.4 2.7 2.7-.4-2.3.3-4.6 0-6.5Z" />
                    <path d="M12 15.2a2.3 2.3 0 0 0 2.2-2.4c0-1.4-1.2-2.4-2.2-3.5-1 1.1-2.2 2.1-2.2 3.5a2.3 2.3 0 0 0 2.2 2.4Z" />
                </>
            )}
            {kind === 'mic' && (
                <>
                    <rect x="9" y="3" width="6" height="10" rx="3" />
                    <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0" />
                    <path d="M12 17v4" />
                    <path d="M8.5 21h7" />
                </>
            )}
        </svg>
    );
}

/* ── 01: Podium + Ledger ── */
function Layout01PodiumLedger({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l1Wrap}>
            <div className={styles.l1TopBar}>
                <div className={styles.l1Intro}>
                    <h2 id={headingId} className={styles.displayTitle}>
                        Awards &amp; <em>Affiliations</em>
                    </h2>
                    <p className={styles.leadCopy}>{INTRO_COPY}</p>
                </div>

                <div className={styles.l1StatStrip}>
                    {BIG_STATS.map((stat) => (
                        <div key={stat.id} className={styles.l1StatCell}>
                            <span className={styles.l1StatVal}>{stat.num}</span>
                            <span className={styles.l1StatKey}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.l1PodiumGrid}>
                {CHAMPIONSHIP_WINS.map((win) => (
                    <div key={win.id} className={styles.l1ChampPlaque}>
                        <div className={styles.l1ChampLeft}>
                            <div className={styles.l1ChampSeal}>
                                <AccoladeIcon kind={win.iconKind} className={styles.iconSvgGold} />
                            </div>
                            <div className={styles.l1ChampBody}>
                                <h3 className={styles.l1ChampTitle}>{win.title}</h3>
                                <span className={styles.l1ChampMeta}>
                                    1st Place Winner &middot; {win.category}
                                </span>
                            </div>
                        </div>
                        <span className={styles.l1ChampYear}>{win.year}</span>
                    </div>
                ))}
            </div>

            <div className={styles.l1Ledger}>
                {LEDGER_HONORS.map((item) => (
                    <div key={item.id} className={styles.l1LedgerRow}>
                        <span className={styles.l1RowYear}>{item.year ?? item.stamp}</span>
                        <AccoladeIcon
                            kind={item.iconKind}
                            className={item.tier === 'top3' ? styles.iconSvgRed : styles.iconSvg}
                        />
                        <span className={styles.l1RowTitle}>{item.title}</span>
                        <span
                            className={`${styles.l1RowBadge} ${item.tier === 'top3' ? styles.l1RowBadgeRed : ''}`}
                        >
                            {item.outcome ?? item.category}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 02: Balanced Split Monument ── */
function Layout02BalancedSplit({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l2Split}>
            <div className={styles.l2Left}>
                <div className={styles.l2LeftCopy}>
                    <h2 id={headingId} className={styles.displayTitle}>
                        Proven. <em>Recognized.</em>
                    </h2>
                    <p className={styles.leadCopy}>{INTRO_COPY}</p>
                </div>

                <div className={styles.l2StatGrid}>
                    {BIG_STATS.map((stat) => (
                        <div key={stat.id} className={styles.l2StatBox}>
                            <span className={styles.l2StatNum}>{stat.num}</span>
                            <span className={styles.l2StatLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.l2Right}>
                {ACCOLADES.map((item) => {
                    const isWin = item.tier === 'win';
                    return (
                        <div
                            key={item.id}
                            className={`${styles.l2Row} ${isWin ? styles.l2RowChamp : ''}`}
                        >
                            <AccoladeIcon
                                kind={item.iconKind}
                                className={
                                    isWin
                                        ? styles.iconSvgGold
                                        : item.tier === 'top3'
                                          ? styles.iconSvgRed
                                          : styles.iconSvg
                                }
                            />
                            <div className={styles.l2RowBody}>
                                <span className={styles.l2RowName}>{item.title}</span>
                                <span
                                    className={`${styles.l2RowSub} ${isWin ? styles.l2RowSubGold : ''}`}
                                >
                                    {item.outcome ? `${item.category} — ${item.outcome}` : item.category}
                                </span>
                            </div>
                            <span className={styles.l2GhostYear}>{item.stamp}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── 03: Three-Pillar Domains ── */
function Layout03ThreePillars({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l3Wrap}>
            <div className={styles.l3Header}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Awards &amp; <em>Affiliations</em>
                </h2>
                <p className={styles.leadCopy}>{INTRO_COPY}</p>
            </div>

            <div className={styles.l3Columns}>
                <div className={styles.l3Pillar}>
                    <div className={styles.l3PillarHead}>
                        <h3 className={styles.subHeading}>
                            Competition <em>Circuit</em>
                        </h3>
                        <span className={styles.l3PillarCount}>05</span>
                    </div>
                    <div className={styles.l3List}>
                        {COMPETITION_CIRCUIT.map((item) => (
                            <div
                                key={item.id}
                                className={`${styles.l3Item} ${item.tier === 'win' ? styles.l3ItemWin : ''}`}
                            >
                                <AccoladeIcon
                                    kind={item.iconKind}
                                    className={item.tier === 'win' ? styles.iconSvgGold : styles.iconSvgRed}
                                />
                                <div className={styles.l3ItemContent}>
                                    <span className={styles.l3ItemTitle}>{item.title}</span>
                                    <span className={styles.l3ItemMeta}>
                                        {item.year} &middot; {item.outcome}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.l3Pillar}>
                    <div className={styles.l3PillarHead}>
                        <h3 className={styles.subHeading}>
                            Craft <em>Guilds</em>
                        </h3>
                        <span className={styles.l3PillarCount}>02</span>
                    </div>
                    <div className={styles.l3List}>
                        {GUILD_ITEMS.map((item) => (
                            <div key={item.id} className={styles.l3Item}>
                                <AccoladeIcon kind={item.iconKind} className={styles.iconSvgGold} />
                                <div className={styles.l3ItemContent}>
                                    <span className={styles.l3ItemTitle}>{item.title}</span>
                                    <span className={styles.l3ItemMeta}>{item.detail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.l3Pillar}>
                    <div className={styles.l3PillarHead}>
                        <h3 className={styles.subHeading}>
                            National <em>Press</em>
                        </h3>
                        <span className={styles.l3PillarCount}>01</span>
                    </div>
                    <div className={styles.l3PressFeature}>
                        <AccoladeIcon kind={PRESS_ITEM.iconKind} className={styles.iconSvgRed} />
                        <div className={styles.l3ItemContent}>
                            <p className={styles.l3PressTitle}>{PRESS_ITEM.title}</p>
                            <p className={styles.l3PressDesc}>{PRESS_ITEM.detail}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── 04: Butcher's 12-Column Bento Mosaic ── */
function Layout04BentoMosaic({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l4Bento}>
            <div className={styles.l4HeroTile}>
                <div className={styles.l1Intro}>
                    <h2 id={headingId} className={styles.displayTitle}>
                        Awards &amp; <em>Affiliations</em>
                    </h2>
                    <p className={styles.leadCopy}>{INTRO_COPY}</p>
                </div>

                <div className={styles.l4HeroStats}>
                    {BIG_STATS.map((stat) => (
                        <div key={stat.id} className={styles.l4MiniStat}>
                            <span className={styles.l4MiniStatVal}>{stat.num}</span>
                            <span className={styles.l4MiniStatLbl}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {CHAMPIONSHIP_WINS.map((win) => (
                <div key={win.id} className={styles.l4WinTile}>
                    <div className={styles.l4WinTop}>
                        <AccoladeIcon kind={win.iconKind} className={styles.iconSvgGold} />
                        <span className={styles.l4WinYear}>{win.year}</span>
                    </div>
                    <div className={styles.l1ChampBody}>
                        <h3 className={styles.l4WinName}>{win.title}</h3>
                        <span className={styles.l4WinRank}>1st Place Winner</span>
                    </div>
                </div>
            ))}

            {LEDGER_HONORS.map((item) => (
                <div key={item.id} className={styles.l4SubTile}>
                    <div className={styles.l4TileRow}>
                        <AccoladeIcon
                            kind={item.iconKind}
                            className={item.tier === 'top3' ? styles.iconSvgRed : styles.iconSvg}
                        />
                        <span className={styles.l4TileTag}>
                            {item.year ? `${item.category} · ${item.year}` : item.category}
                        </span>
                    </div>
                    <p className={styles.l4TileName}>
                        {item.title}
                        {item.outcome ? ` — ${item.outcome}` : ''}
                    </p>
                </div>
            ))}
        </div>
    );
}

/* ── 05: Chronological Competition Rail ── */
function Layout05ChronologicalRail({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l5Wrap}>
            <div className={styles.l5HeadRow}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Competition <em>Chronicle</em>
                </h2>
                <p className={styles.leadCopy}>{INTRO_COPY}</p>
            </div>

            <div className={styles.l5Rail}>
                {CHRONOLOGICAL_STOPS.map((stop) => {
                    const isWin = stop.tier === 'win';
                    return (
                        <div key={stop.id} className={styles.l5Stop}>
                            <div className={styles.l5NodeRow}>
                                <span className={`${styles.l5Dot} ${isWin ? styles.l5DotWin : ''}`}>
                                    <AccoladeIcon
                                        kind={stop.iconKind}
                                        className={isWin ? styles.iconSvgGold : styles.iconSvgRed}
                                    />
                                </span>
                                <span className={styles.l5StopYear}>{stop.year}</span>
                            </div>

                            <div
                                className={`${styles.l5StopCard} ${isWin ? styles.l5StopCardWin : ''}`}
                            >
                                <p className={styles.l5StopTitle}>{stop.title}</p>
                                <span className={styles.l5StopOutcome}>
                                    {isWin ? '1st Place Winner' : 'Top 3 Podium'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.l5CredBar}>
                {CREDENTIAL_ITEMS.map((cred) => (
                    <div key={cred.id} className={styles.l5CredItem}>
                        <AccoladeIcon
                            kind={cred.iconKind}
                            className={cred.tier === 'media' ? styles.iconSvgRed : styles.iconSvgGold}
                        />
                        <div className={styles.l5CredText}>
                            <span className={styles.l5CredTitle}>{cred.title}</span>
                            <span className={styles.l5CredSub}>{cred.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 06: Broadsheet Typographic Honor Roll ── */
function Layout06BroadsheetIndex({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l6Sheet}>
            <div className={styles.l6Masthead}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Awards &amp; <em>Affiliations</em>
                </h2>

                <div className={styles.l6TickerSummary}>
                    {BIG_STATS.map((stat) => (
                        <div key={stat.id} className={styles.l6TickerPair}>
                            <span className={styles.l6TickerBig}>{stat.num}</span>
                            <span className={styles.l6TickerWord}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.l6IndexList}>
                {ACCOLADES.map((item) => {
                    const isWin = item.tier === 'win';
                    return (
                        <div
                            key={item.id}
                            className={`${styles.l6IndexRow} ${isWin ? styles.l6IndexRowWin : ''}`}
                        >
                            <span className={styles.l6IndexName}>{item.title}</span>
                            <span className={styles.l6Leader} aria-hidden="true" />
                            <div className={styles.l6IndexRight}>
                                <span className={styles.l6IndexOutcome}>
                                    {item.outcome ?? item.category}
                                </span>
                                <span className={styles.l6IndexYear}>{item.stamp}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── 07: 2–3–3 Tiered Championship Pyramid ── */
function Layout07TieredPyramid({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l7Pyramid}>
            <div className={styles.l7CenterHead}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Awards &amp; <em>Affiliations</em>
                </h2>
                <p className={styles.leadCopy}>{INTRO_COPY}</p>
            </div>

            <div className={styles.l7RowTwo}>
                {CHAMPIONSHIP_WINS.map((win) => (
                    <div key={win.id} className={styles.l7PlaqueWin}>
                        <AccoladeIcon kind={win.iconKind} className={styles.iconSvgGold} />
                        <h3 className={styles.l7PlaqueTitleLg}>{win.title}</h3>
                        <span className={styles.l7PlaqueMetaGold}>
                            1st Place Winner &middot; {win.year}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.l7RowThree}>
                {PODIUM_FINISHES.map((item) => (
                    <div key={item.id} className={styles.l7PlaqueMid}>
                        <AccoladeIcon kind={item.iconKind} className={styles.iconSvgRed} />
                        <h3 className={styles.l7PlaqueTitleSm}>{item.title}</h3>
                        <span className={styles.l7PlaqueMeta}>
                            Top 3 Finish &middot; {item.year}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.l7RowThree}>
                {CREDENTIAL_ITEMS.map((cred) => (
                    <div key={cred.id} className={styles.l7PlaqueBase}>
                        <AccoladeIcon kind={cred.iconKind} className={styles.iconSvg} />
                        <h3 className={styles.l7PlaqueTitleSm}>{cred.title}</h3>
                        <span className={styles.l7PlaqueMeta}>{cred.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 08: Interactive Master-Detail Spotlight Stage ── */
function Layout08SpotlightStage({
    headingId,
    selectedId,
    onSelect,
}: {
    headingId?: string;
    selectedId: string;
    onSelect: (id: string) => void;
}) {
    const selected = ACCOLADES.find((item) => item.id === selectedId) ?? ACCOLADES[0];
    const isWin = selected.tier === 'win';

    return (
        <div className={styles.l8StageWrap}>
            <div className={styles.l8SelectorCol}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Honor <em>Spotlight</em>
                </h2>

                <div className={styles.l8ButtonList}>
                    {ACCOLADES.map((item) => {
                        const active = item.id === selected.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSelect(item.id)}
                                onMouseEnter={() => onSelect(item.id)}
                                className={`${styles.l8SelectBtn} ${active ? styles.l8SelectBtnActive : ''}`}
                            >
                                <AccoladeIcon
                                    kind={item.iconKind}
                                    className={
                                        item.tier === 'win'
                                            ? styles.iconSvgGold
                                            : item.tier === 'top3'
                                              ? styles.iconSvgRed
                                              : styles.iconSvg
                                    }
                                />
                                <span className={styles.l8BtnName}>{item.title}</span>
                                <span className={styles.l8BtnYear}>{item.stamp}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.l8Poster}>
                <div className={styles.l8PosterTop}>
                    <AccoladeIcon
                        kind={selected.iconKind}
                        className={isWin ? styles.iconSvgGold : styles.iconSvgRed}
                    />
                    <span className={styles.l8PosterStamp}>{selected.stamp}</span>
                </div>

                <div className={styles.l8PosterMain}>
                    <h3 className={styles.l8PosterTitle}>{selected.title}</h3>
                    <span
                        className={`${styles.l8PosterOutcome} ${isWin ? styles.l8PosterOutcomeGold : ''}`}
                    >
                        {selected.outcome
                            ? `${selected.category} — ${selected.outcome}`
                            : selected.category}
                    </span>
                    <p className={styles.l8PosterDesc}>{selected.detail}</p>
                </div>

                <div className={styles.l8PosterFooter}>
                    {BIG_STATS.map((stat) => (
                        <div key={stat.id} className={styles.l4MiniStat}>
                            <span className={styles.l4MiniStatVal}>{stat.num}</span>
                            <span className={styles.l4MiniStatLbl}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── 09: Monumental Stat Frieze + Counter-Scrolling Ribbons ── */
function Layout09KineticFrieze({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l9Wrap}>
            <div className={styles.l5HeadRow}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Awards &amp; <em>Affiliations</em>
                </h2>
                <p className={styles.leadCopy}>{INTRO_COPY}</p>
            </div>

            <div className={styles.l9Frieze}>
                {BIG_STATS.map((stat, idx) => (
                    <div key={stat.id} className={styles.l9FriezeCell}>
                        <span
                            className={`${styles.l9FriezeBig} ${idx === 0 ? styles.l9FriezeBigAccent : ''}`}
                        >
                            {stat.num}
                        </span>
                        <span className={styles.l9FriezeLabel}>{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className={styles.l9MarqueeViewport}>
                <div className={styles.l9TrackLeft}>
                    {MARQUEE_PASSES.map((passId, passIdx) =>
                        RIBBON_TOP.map((item) => (
                            <div
                                key={`${passId}-${item.id}`}
                                aria-hidden={passIdx === 1 ? true : undefined}
                                className={`${styles.l9PillCard} ${item.tier === 'win' ? styles.l9PillCardWin : ''}`}
                            >
                                <AccoladeIcon
                                    kind={item.iconKind}
                                    className={
                                        item.tier === 'win' ? styles.iconSvgGold : styles.iconSvgRed
                                    }
                                />
                                <span className={styles.l9PillTitle}>{item.title}</span>
                                <span className={styles.l9PillMeta}>
                                    {item.outcome ? `${item.outcome} · ${item.year}` : item.category}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.l9TrackRight}>
                    {MARQUEE_PASSES.map((passId, passIdx) =>
                        RIBBON_BOTTOM.map((item) => (
                            <div
                                key={`${passId}-${item.id}`}
                                aria-hidden={passIdx === 1 ? true : undefined}
                                className={styles.l9PillCard}
                            >
                                <AccoladeIcon
                                    kind={item.iconKind}
                                    className={
                                        item.tier === 'top3' ? styles.iconSvgRed : styles.iconSvgGold
                                    }
                                />
                                <span className={styles.l9PillTitle}>{item.title}</span>
                                <span className={styles.l9PillMeta}>
                                    {item.outcome ? `${item.outcome} · ${item.year}` : item.category}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── 10: Swiss Architectural Category Bands ── */
function Layout10SwissBands({ headingId }: { headingId?: string }) {
    return (
        <div className={styles.l10Wrap}>
            <div className={styles.l5HeadRow}>
                <h2 id={headingId} className={styles.displayTitle}>
                    Awards &amp; <em>Affiliations</em>
                </h2>
                <p className={styles.leadCopy}>{INTRO_COPY}</p>
            </div>

            <div className={styles.l10Bands}>
                {CATEGORY_BANDS.map((band) => (
                    <div key={band.id} className={styles.l10Band}>
                        <div className={styles.l10BandHead}>
                            <h3 className={styles.l10BandTitle}>{band.title}</h3>
                            <span className={styles.l10BandSub}>{band.subtitle}</span>
                        </div>

                        <div className={styles.l10BandItems}>
                            {band.items.map((item) => {
                                const isWin = item.tier === 'win';
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.l10Entry} ${isWin ? styles.l10EntryWin : ''}`}
                                    >
                                        <AccoladeIcon
                                            kind={item.iconKind}
                                            className={
                                                isWin
                                                    ? styles.iconSvgGold
                                                    : item.tier === 'top3'
                                                      ? styles.iconSvgRed
                                                      : styles.iconSvg
                                            }
                                        />
                                        <div className={styles.l10EntryBody}>
                                            <span className={styles.l10EntryName}>
                                                {item.title}
                                            </span>
                                            <span className={styles.l10EntryMeta}>
                                                {item.outcome
                                                    ? `${item.outcome} · ${item.year}`
                                                    : item.category}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AccoladesVariants(_props: { accolades?: string[] }) {
    const [mode, setMode] = useState<FilterMode>('all');
    const [activeSpotlightId, setActiveSpotlightId] = useState<string>(ACCOLADES[0].id);

    const visibleLayouts =
        mode === 'all' ? LAYOUT_META : LAYOUT_META.filter((layout) => layout.id === mode);

    return (
        <section id="accolades" aria-labelledby="accolades-heading" className="section">
            <div className={`container ${styles.showcaseRoot}`}>
                <div className={styles.explorerWrap}>
                    <div className={styles.explorerBar} role="toolbar" aria-label="Accolades layout explorer">
                        <div className={styles.explorerMeta}>
                            <span className={styles.explorerLabel}>Accolades — 10 Layouts</span>
                        </div>

                        <div className={styles.explorerPills}>
                            <button
                                type="button"
                                aria-pressed={mode === 'all'}
                                onClick={() => setMode('all')}
                                className={`${styles.explorerBtn} ${mode === 'all' ? styles.explorerBtnActive : ''}`}
                            >
                                All 10
                            </button>
                            {LAYOUT_META.map((layout) => {
                                const isActive = mode === layout.id;
                                return (
                                    <button
                                        key={layout.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setMode(layout.id)}
                                        className={`${styles.explorerBtn} ${isActive ? styles.explorerBtnActive : ''}`}
                                    >
                                        {layout.id} &middot; {layout.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.variantStack}>
                    {visibleLayouts.map((layout, idx) => {
                        const headingId = idx === 0 ? 'accolades-heading' : undefined;

                        return (
                            <div key={layout.id} className={styles.variantStage}>
                                <div className={styles.variantBanner}>
                                    <span className={styles.variantIndex}>
                                        Layout {layout.id} — {layout.name}
                                    </span>
                                    <span className={styles.variantNote}>{layout.note}</span>
                                </div>

                                {layout.id === '01' && <Layout01PodiumLedger headingId={headingId} />}
                                {layout.id === '02' && <Layout02BalancedSplit headingId={headingId} />}
                                {layout.id === '03' && <Layout03ThreePillars headingId={headingId} />}
                                {layout.id === '04' && <Layout04BentoMosaic headingId={headingId} />}
                                {layout.id === '05' && <Layout05ChronologicalRail headingId={headingId} />}
                                {layout.id === '06' && <Layout06BroadsheetIndex headingId={headingId} />}
                                {layout.id === '07' && <Layout07TieredPyramid headingId={headingId} />}
                                {layout.id === '08' && (
                                    <Layout08SpotlightStage
                                        headingId={headingId}
                                        selectedId={activeSpotlightId}
                                        onSelect={setActiveSpotlightId}
                                    />
                                )}
                                {layout.id === '09' && <Layout09KineticFrieze headingId={headingId} />}
                                {layout.id === '10' && <Layout10SwissBands headingId={headingId} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
