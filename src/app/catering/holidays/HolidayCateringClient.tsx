'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import {
    HOLIDAY_SELLING_GUIDES,
    OTHER_CATERING_OCCASIONS,
    PLANNING_MATRIX_ROWS,
    SEASON_TABS,
    type HolidaySellingGuide,
    type OtherCateringOccasion,
    type SeasonId,
} from './holidayCateringData';
import styles from './page.module.css';

type OccasionCategoryFilter = 'All' | OtherCateringOccasion['category'];
type SocialPlatform = 'facebook' | 'instagram' | 'story';

const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string }[] = [
    { id: 'facebook', label: 'Facebook Post' },
    { id: 'instagram', label: 'Instagram Feed' },
    { id: 'story', label: 'Story / Reel Hook' },
];

const OCCASION_FILTERS: OccasionCategoryFilter[] = [
    'All',
    'Social & Family',
    'Corporate & Community',
    'Seasonal & Sports',
];

function filterHolidaysByQuery(items: HolidaySellingGuide[], normalizedQuery: string): HolidaySellingGuide[] {
    if (!normalizedQuery) return items;
    return items.filter(item => {
        const haystack = [
            item.name,
            item.timing,
            item.demandLevel,
            item.leadTime,
            ...item.heroOfferings,
            ...item.sellingPoints,
            item.butcherPitch,
        ]
            .join(' ')
            .toLowerCase();
        return haystack.includes(normalizedQuery);
    });
}

export default function HolidayCateringClient() {
    const [activeSeason, setActiveSeason] = useState<SeasonId>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [occasionFilter, setOccasionFilter] = useState<OccasionCategoryFilter>('All');
    const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('facebook');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopyCaption = async (holidayId: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            const key = `${holidayId}-${socialPlatform}`;
            setCopiedKey(key);
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => setCopiedKey(null), 2000);
        } catch {
            // Clipboard unavailable in restricted context
        }
    };

    useEffect(() => {
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        };
    }, []);

    const tabRefs = useRef<Partial<Record<SeasonId, HTMLButtonElement | null>>>({});
    const panelRefs = useRef<Partial<Record<SeasonId, HTMLDivElement | null>>>({});

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const holidaysBySeason = useMemo(() => {
        const grouped: Record<SeasonId, HolidaySellingGuide[]> = {
            all: filterHolidaysByQuery(HOLIDAY_SELLING_GUIDES, normalizedQuery),
            winter: filterHolidaysByQuery(
                HOLIDAY_SELLING_GUIDES.filter(h => h.season === 'winter'),
                normalizedQuery,
            ),
            spring: filterHolidaysByQuery(
                HOLIDAY_SELLING_GUIDES.filter(h => h.season === 'spring'),
                normalizedQuery,
            ),
            summer: filterHolidaysByQuery(
                HOLIDAY_SELLING_GUIDES.filter(h => h.season === 'summer'),
                normalizedQuery,
            ),
            fall: filterHolidaysByQuery(
                HOLIDAY_SELLING_GUIDES.filter(h => h.season === 'fall'),
                normalizedQuery,
            ),
        };
        return grouped;
    }, [normalizedQuery]);

    const visibleOccasions = useMemo(() => {
        if (occasionFilter === 'All') return OTHER_CATERING_OCCASIONS;
        return OTHER_CATERING_OCCASIONS.filter(item => item.category === occasionFilter);
    }, [occasionFilter]);

    // Sync hidden="until-found" and listen for browser find-in-page beforematch events (per modern-web-guidance `tabs`)
    useEffect(() => {
        const cleanups: Array<() => void> = [];

        for (const tab of SEASON_TABS) {
            const panel = panelRefs.current[tab.id];
            if (!panel) continue;

            if (tab.id === activeSeason) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', 'until-found');
            }

            const onBeforeMatch = () => {
                setActiveSeason(tab.id);
            };
            panel.addEventListener('beforematch', onBeforeMatch);
            cleanups.push(() => panel.removeEventListener('beforematch', onBeforeMatch));
        }

        return () => {
            for (const cleanup of cleanups) cleanup();
        };
    }, [activeSeason]);

    const selectSeason = (nextSeason: SeasonId, moveFocus: boolean) => {
        setActiveSeason(nextSeason);
        const btn = tabRefs.current[nextSeason];
        if (btn) {
            if (moveFocus) btn.focus();
            btn.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
                ...({ container: 'nearest' } as Record<string, string>),
            });
        }
    };

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let nextIndex: number | null = null;
        if (event.key === 'ArrowRight') {
            nextIndex = (index + 1) % SEASON_TABS.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (index - 1 + SEASON_TABS.length) % SEASON_TABS.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = SEASON_TABS.length - 1;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            selectSeason(SEASON_TABS[nextIndex].id, true);
        }
    };

    return (
        <main className={styles.page}>
            {/* ── Open Hero Header (Matches /cut-guide) ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <h1 className={styles.headline}>
                            Holiday &amp; Event <em>Catering Guide</em>
                        </h1>
                        <p className={styles.sub}>
                            Selling points, signature cuts, and order lead times for every major holiday — plus the
                            year-round North Shore occasions that bring catering guests through the counter.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Section 1: Holiday Selling Points by Season ── */}
            <section id="holiday-selling-points" aria-labelledby="holiday-selling-points-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeader}>
                            <h2 id="holiday-selling-points-heading" className={styles.sectionHeading}>
                                Holiday Selling Points
                            </h2>
                            <p className={styles.sectionSub}>
                                Filter by season or search any holiday, cut, or selling angle to see what guests care
                                about most and how to position Hofherr&apos;s counter and catering packages.
                            </p>
                        </div>

                        <div className={styles.controlsSticky}>
                            <div className={styles.tablist} role="tablist" aria-label="Filter holidays by season">
                                {SEASON_TABS.map((tab, index) => {
                                    const isSelected = activeSeason === tab.id;
                                    const count = holidaysBySeason[tab.id].length;
                                    return (
                                        <button
                                            key={tab.id}
                                            ref={el => {
                                                tabRefs.current[tab.id] = el;
                                            }}
                                            type="button"
                                            role="tab"
                                            id={`season-tab-${tab.id}`}
                                            aria-selected={isSelected}
                                            tabIndex={isSelected ? 0 : -1}
                                            className={styles.tab}
                                            onClick={() => selectSeason(tab.id, false)}
                                            onKeyDown={e => handleTabKeyDown(e, index)}
                                        >
                                            <span>{tab.label}</span>
                                            <span className={styles.tabCount}>{count}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={styles.searchRegion}>
                                <label htmlFor="holiday-search-input" className={styles.srOnly}>
                                    Search holidays, cuts, or selling points
                                </label>
                                <div className={styles.searchField}>
                                    <span className={styles.searchIcon} aria-hidden="true">
                                        ⌕
                                    </span>
                                    <input
                                        id="holiday-search-input"
                                        type="search"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search brisket, lamb, pig roast…"
                                        className={styles.searchInput}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className={styles.searchClearBtn}
                                            onClick={() => setSearchQuery('')}
                                            aria-label="Clear holiday search"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.panelsGrid}>
                            {SEASON_TABS.map(tab => {
                                const isSelected = activeSeason === tab.id;
                                const items = holidaysBySeason[tab.id];
                                return (
                                    <div
                                        key={tab.id}
                                        ref={el => {
                                            panelRefs.current[tab.id] = el;
                                        }}
                                        role="tabpanel"
                                        aria-labelledby={`season-tab-${tab.id}`}
                                        hidden={!isSelected}
                                    >
                                        <div className={styles.panelInner}>
                                            {items.length > 0 ? (
                                                <div className={styles.cardsGrid}>
                                                    {items.map(holiday => (
                                                        <article key={holiday.id} className={styles.holidayCard}>
                                                            <div className={styles.holidayMediaWrap}>
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={holiday.image}
                                                                    alt={holiday.imageAlt}
                                                                    className={styles.holidayImg}
                                                                    loading="lazy"
                                                                />
                                                            </div>

                                                            <div className={styles.cardTopRow}>
                                                                <span className={styles.cardTiming}>{holiday.timing}</span>
                                                                <span
                                                                    className={
                                                                        holiday.demandLevel === 'Peak Allocation'
                                                                            ? `${styles.demandBadge} ${styles.demandBadgePeak}`
                                                                            : styles.demandBadge
                                                                    }
                                                                >
                                                                    {holiday.demandLevel}
                                                                </span>
                                                            </div>

                                                            <h3 className={styles.cardTitle}>{holiday.name}</h3>

                                                            <dl className={styles.metaStrip}>
                                                                <div className={styles.metaCell}>
                                                                    <dt>Lead Time</dt>
                                                                    <dd>{holiday.leadTime}</dd>
                                                                </div>
                                                                <div className={styles.metaCell}>
                                                                    <dt>Typical Group</dt>
                                                                    <dd>{holiday.typicalGroup}</dd>
                                                                </div>
                                                            </dl>

                                                            <div className={styles.blockGroup}>
                                                                <h4 className={styles.blockLabel}>Key Selling Points</h4>
                                                                <ul className={styles.pointsList}>
                                                                    {holiday.sellingPoints.map(point => (
                                                                        <li key={point}>{point}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className={styles.blockGroup}>
                                                                <h4 className={styles.blockLabel}>Hero Cuts &amp; Trays</h4>
                                                                <ul className={styles.tagList}>
                                                                    {holiday.heroOfferings.map(offering => (
                                                                        <li key={offering} className={styles.tag}>
                                                                            {offering}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className={styles.pitchBox}>
                                                                <span className={styles.pitchLabel}>Counter Pitch</span>
                                                                <p className={styles.pitchText}>{holiday.butcherPitch}</p>
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={styles.emptyState}>
                                                    <h3 className={styles.emptyTitle}>No matching holidays in {tab.label}</h3>
                                                    <p className={styles.emptySub}>
                                                        Try clearing your search filter or switching to All Holidays to see
                                                        every seasonal catering play.
                                                    </p>
                                                    <div className={styles.emptyActions}>
                                                        <button
                                                            type="button"
                                                            className={styles.resetBtn}
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                selectSeason('all', false);
                                                            }}
                                                        >
                                                            Show All Holidays
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Holiday Social Media Photo & Caption Kit ── */}
            <section id="holiday-social-assets" aria-labelledby="holiday-social-assets-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionHeader}>
                                <h2 id="holiday-social-assets-heading" className={styles.sectionHeading}>
                                    Social Media Photo &amp; Post Kit
                                </h2>
                                <p className={styles.sectionSub}>
                                    Download high-resolution 1200×900 holiday photos and copy ready-to-post captions
                                    tailored for Facebook, Instagram, and Stories — zero watermarks, ready to schedule.
                                </p>
                            </div>

                            <div className={styles.filterGroup} role="group" aria-label="Choose social media platform copy">
                                {SOCIAL_PLATFORMS.map(platform => {
                                    const active = socialPlatform === platform.id;
                                    return (
                                        <button
                                            key={platform.id}
                                            type="button"
                                            aria-pressed={active}
                                            className={
                                                active ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn
                                            }
                                            onClick={() => setSocialPlatform(platform.id)}
                                        >
                                            {platform.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.socialAssetsGrid}>
                            {HOLIDAY_SELLING_GUIDES.map(holiday => {
                                const caption = holiday.socialPosts[socialPlatform];
                                const key = `${holiday.id}-${socialPlatform}`;
                                const isCopied = copiedKey === key;
                                const downloadName = `hofherr-${holiday.id}-social.jpg`;
                                return (
                                    <article key={holiday.id} className={styles.socialAssetCard}>
                                        <div className={styles.socialMediaWrap}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={holiday.image}
                                                alt={holiday.imageAlt}
                                                className={styles.holidayImg}
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className={styles.cardTopRow}>
                                            <span className={styles.cardTiming}>{holiday.timing}</span>
                                            <span className={styles.categoryTag}>1200 × 900 JPG</span>
                                        </div>

                                        <h3 className={styles.cardTitle}>{holiday.name}</h3>

                                        <p className={styles.postWindowLine}>
                                            <strong>Best Time to Post:</strong> {holiday.socialPosts.bestPostWindow}
                                        </p>

                                        <div className={styles.captionBox}>
                                            <span className={styles.pitchLabel}>
                                                {SOCIAL_PLATFORMS.find(p => p.id === socialPlatform)?.label}
                                            </span>
                                            <p className={styles.captionText}>{caption}</p>
                                        </div>

                                        <div className={styles.socialActionRow}>
                                            <button
                                                type="button"
                                                className={styles.copyBtn}
                                                onClick={() => handleCopyCaption(holiday.id, caption)}
                                            >
                                                {isCopied ? 'Copied Caption ✓' : 'Copy Caption'}
                                            </button>
                                            <a
                                                href={holiday.image}
                                                download={downloadName}
                                                className={styles.downloadBtn}
                                            >
                                                Download Photo ↓
                                            </a>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Other Days People Come In for Catering ── */}
            <section id="other-catering-days" aria-labelledby="other-catering-days-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionHeader}>
                                <h2 id="other-catering-days-heading" className={styles.sectionHeading}>
                                    Other Days People Come In for Catering
                                </h2>
                                <p className={styles.sectionSub}>
                                    Holidays create spikes, but these 10 recurring North Shore occasions drive steady
                                    catering, whole-pig roasts, picnic baskets, and large counter orders all year long.
                                </p>
                            </div>

                            <div className={styles.filterGroup} role="group" aria-label="Filter catering occasions by category">
                                {OCCASION_FILTERS.map(cat => {
                                    const active = occasionFilter === cat;
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            aria-pressed={active}
                                            className={
                                                active ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn
                                            }
                                            onClick={() => setOccasionFilter(cat)}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.occasionsGrid}>
                            {visibleOccasions.map(occasion => (
                                <article key={occasion.id} className={styles.occasionCard}>
                                    <div className={styles.cardTopRow}>
                                        <span className={styles.cardTiming}>{occasion.when}</span>
                                        <span className={styles.categoryTag}>{occasion.category}</span>
                                    </div>

                                    <h3 className={styles.cardTitle}>{occasion.title}</h3>

                                    <p className={styles.packageLine}>
                                        <strong>Best Fit:</strong> {occasion.bestFitPackage}
                                    </p>

                                    <dl className={styles.metaStrip}>
                                        <div className={styles.metaCell}>
                                            <dt>Group Size</dt>
                                            <dd>{occasion.typicalGroup}</dd>
                                        </div>
                                        <div className={styles.metaCell}>
                                            <dt>Lead Time</dt>
                                            <dd>{occasion.leadTime}</dd>
                                        </div>
                                    </dl>

                                    <div className={styles.blockGroup}>
                                        <h4 className={styles.blockLabel}>Why They Order From Hofherr</h4>
                                        <ul className={styles.pointsList}>
                                            {occasion.sellingPoints.map(point => (
                                                <li key={point}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={styles.pitchBox}>
                                        <span className={styles.pitchLabel}>Catering Tip</span>
                                        <p className={styles.pitchText}>{occasion.counterTip}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Responsive Annual Planning Matrix Table ── */}
            <section id="catering-planning-matrix" aria-labelledby="catering-planning-matrix-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeader}>
                            <h2 id="catering-planning-matrix-heading" className={styles.sectionHeading}>
                                Annual Catering Calendar &amp; Lead-Time Matrix
                            </h2>
                            <p className={styles.sectionSub}>
                                A quick-scan reference of peak windows, booking lead times, top-selling packages, and
                                the core pitch that closes each order.
                            </p>
                        </div>

                        <div
                            tabIndex={0}
                            role="region"
                            aria-labelledby="catering-matrix-caption"
                            className={styles.tableWrapper}
                        >
                            <table className={styles.matrixTable}>
                                <caption id="catering-matrix-caption" className={styles.srOnly}>
                                    Annual holiday and event catering calendar with peak windows, lead times, top
                                    sellers, and selling angles
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Occasion / Window</th>
                                        <th scope="col">Peak Timing</th>
                                        <th scope="col">Lead Time</th>
                                        <th scope="col">Top Catering Seller</th>
                                        <th scope="col">Key Selling Angle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLANNING_MATRIX_ROWS.map(row => (
                                        <tr key={row.id}>
                                            <th scope="row">{row.occasion}</th>
                                            <td>{row.peakWindow}</td>
                                            <td>{row.leadTime}</td>
                                            <td>{row.topSeller}</td>
                                            <td>{row.sellingAngle}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 4: Bottom CTA ── */}
            <section id="book-holiday-catering" aria-labelledby="book-holiday-catering-heading" className="section-sm">
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2 id="book-holiday-catering-heading" className={styles.ctaHeading}>
                            Ready to Lock In Your Date?
                        </h2>
                        <p className={styles.ctaSub}>
                            Build an instant BBQ catering or whole-pig roast estimate online, pre-order holiday roasts
                            through the counter, or call our Northfield team for custom menus.
                        </p>
                        <div className={styles.ctaBtns}>
                            <Link href="/catering#build-your-package" className={styles.primaryBtn}>
                                Build a Catering Package →
                            </Link>
                            <Link href="/online-orders" className={styles.secondaryBtn}>
                                Order Cuts Online
                            </Link>
                            <a href="tel:8474416328" className={styles.secondaryBtn}>
                                Call (847) 441-MEAT
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
