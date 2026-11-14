'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { SerpRightRail } from './SerpRightRail';
import {
    SCHEMA_ENTITIES,
    SERP_LOCATIONS,
    SERP_SITELINKS,
    buildPreviewJsonLdSnippet,
    formatDisplayPhone,
    getChicagoLiveStatus,
    type LocationId,
    type RightRailMode,
    type SnippetMode,
} from './serpData';
import styles from './page.module.css';

function subscribeMinuteTick(onStoreChange: () => void): () => void {
    const id = window.setInterval(onStoreChange, 60_000);
    return () => window.clearInterval(id);
}

function getClientMinuteStamp(): number {
    return Math.floor(Date.now() / 60_000);
}

function getServerMinuteStamp(): number {
    return 0;
}

export default function GooglePreviewClient() {
    const settings = useSiteSettings();
    const minuteStamp = useSyncExternalStore(
        subscribeMinuteTick,
        getClientMinuteStamp,
        getServerMinuteStamp,
    );

    const [rightRailMode, setRightRailMode] = useState<RightRailMode>('organization');
    const [snippetMode, setSnippetMode] = useState<SnippetMode>('enhanced');
    const [searchQuery, setSearchQuery] = useState<string>('hofherr meat co');

    const displayPhone = formatDisplayPhone(settings.phone);
    const butcherStatus = getChicagoLiveStatus(settings.butcherHours, minuteStamp);
    const depotStatus = getChicagoLiveStatus(settings.depotHours, minuteStamp);
    const jsonLdPreview = buildPreviewJsonLdSnippet(settings);

    const applyPreset = (nextRail: RightRailMode, nextSnippet: SnippetMode, nextQuery: string) => {
        setRightRailMode(nextRail);
        setSnippetMode(nextSnippet);
        setSearchQuery(nextQuery);
    };

    const handleSelectLocation = (loc: LocationId) => {
        setSnippetMode('enhanced');
        setRightRailMode(loc);
        setSearchQuery(
            loc === 'butcher' ? 'hofherr meat co northfield' : 'hofherr meat co winnetka depot',
        );
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const normalized = searchQuery.trim().toLowerCase();
        if (normalized.includes('winnetka') || normalized.includes('depot') || normalized.includes('elm')) {
            setSnippetMode('enhanced');
            setRightRailMode('depot');
            return;
        }
        if (normalized.includes('northfield') || normalized.includes('happ')) {
            setSnippetMode('enhanced');
            setRightRailMode('butcher');
            return;
        }
        setSnippetMode('enhanced');
        setRightRailMode('organization');
    };

    const isBrandPreset = snippetMode === 'enhanced' && rightRailMode === 'organization';
    const isButcherPreset = snippetMode === 'enhanced' && rightRailMode === 'butcher';
    const isDepotPreset = snippetMode === 'enhanced' && rightRailMode === 'depot';
    const isLegacyPreset = snippetMode === 'legacy';

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroStack}>
                        <div className={styles.heroTopRow}>
                            <div className={styles.heroTitleBlock}>
                                <h1 className={styles.heroTitle}>
                                    Google Search &amp;{' '}
                                    <span className={styles.heroAccent}>Local Pack Preview</span>
                                </h1>
                                <p className={styles.heroLead}>
                                    Live dark-mode Google desktop SERP simulator powered by Hofherr
                                    Meat Co.’s multi-location Schema.org <code>@graph</code>, real
                                    Northfield &amp; Winnetka hours, and storefront photography.
                                </p>
                            </div>
                        </div>

                        <div
                            className={styles.presetBar}
                            role="group"
                            aria-label="SERP preview presets"
                        >
                            <button
                                type="button"
                                className={`${styles.presetBtn} ${isBrandPreset ? styles.presetBtnActive : ''}`}
                                aria-pressed={isBrandPreset}
                                onClick={() =>
                                    applyPreset('organization', 'enhanced', 'hofherr meat co')
                                }
                            >
                                <span>✦ Brand + 2-Location Pack</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.presetBtn} ${isButcherPreset ? styles.presetBtnActive : ''}`}
                                aria-pressed={isButcherPreset}
                                onClick={() => handleSelectLocation('butcher')}
                            >
                                <span>📍 Pin A · Northfield Butcher Profile</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.presetBtn} ${isDepotPreset ? styles.presetBtnActive : ''}`}
                                aria-pressed={isDepotPreset}
                                onClick={() => handleSelectLocation('depot')}
                            >
                                <span>📍 Pin B · Winnetka Depot Profile</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.presetBtn} ${isLegacyPreset ? styles.presetBtnActive : ''}`}
                                aria-pressed={isLegacyPreset}
                                onClick={() =>
                                    applyPreset('organization', 'legacy', 'hofherr meat co')
                                }
                            >
                                <span>↺ Current Single Snippet (Before)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section
                id="serp-simulator"
                aria-labelledby="serp-simulator-heading"
                className="section-sm"
            >
                <div className="container">
                    <h2 id="serp-simulator-heading" className={styles.srOnly}>
                        Interactive Google Search Results Simulator
                    </h2>

                    <div className={styles.serpViewport}>
                        <div className={styles.googleChrome}>
                            <search className={styles.googleSearchRow}>
                                <span className={styles.googleWordmark} aria-hidden="true">
                                    <span className={styles.googleWordmarkG1}>G</span>
                                    <span className={styles.googleWordmarkO1}>o</span>
                                    <span className={styles.googleWordmarkO2}>o</span>
                                    <span className={styles.googleWordmarkG2}>g</span>
                                    <span className={styles.googleWordmarkL}>l</span>
                                    <span className={styles.googleWordmarkE}>e</span>
                                </span>

                                <form
                                    className={styles.googleSearchBox}
                                    onSubmit={handleSearchSubmit}
                                >
                                    <label htmlFor="google-serp-query" className={styles.srOnly}>
                                        Simulated Google search query
                                    </label>
                                    <input
                                        id="google-serp-query"
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search Hofherr Meat Co., Northfield, or Winnetka..."
                                        className={styles.googleSearchInput}
                                    />
                                    {searchQuery.length > 0 && (
                                        <button
                                            type="button"
                                            className={styles.googleSearchClear}
                                            aria-label="Clear search query"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className={styles.googleSearchClear}
                                        aria-label="Run simulated search"
                                    >
                                        <span className={styles.googleSearchIcon} aria-hidden="true">
                                            🔍
                                        </span>
                                    </button>
                                </form>
                            </search>

                            <div className={styles.googleFilterStrip} aria-hidden="true">
                                <span
                                    className={`${styles.googleFilterItem} ${styles.googleFilterActive}`}
                                >
                                    All
                                </span>
                                <span className={styles.googleFilterItem}>Maps</span>
                                <span className={styles.googleFilterItem}>Images</span>
                                <span className={styles.googleFilterItem}>Shopping</span>
                                <span className={styles.googleFilterItem}>News</span>
                            </div>
                        </div>

                        <div className={styles.serpBody}>
                            <div className={styles.serpLeftCol}>
                                <div className={styles.areaLine}>
                                    <span className={styles.areaBlueDot} aria-hidden="true" />
                                    <span className={styles.areaStrong}>Northfield, IL</span>
                                    <span aria-hidden="true">·</span>
                                    <span className={styles.areaLink}>
                                        Based on your North Shore area
                                    </span>
                                </div>

                                {snippetMode === 'enhanced' && (
                                    <div className={styles.locationsBlock}>
                                        <h3 className={styles.locationsHeading}>Locations</h3>

                                        <div className={styles.mapBanner}>
                                            <svg
                                                viewBox="0 0 652 208"
                                                preserveAspectRatio="xMidYMid slice"
                                                className={styles.mapSvg}
                                                aria-hidden="true"
                                            >
                                                <rect width="652" height="208" fill="#182334" />
                                                <polygon
                                                    points="560,0 652,0 652,208 612,208"
                                                    fill="#0f2f4a"
                                                />
                                                <path
                                                    d="M250,0 C268,48 276,96 292,152 C300,178 308,195 314,208 L280,208 C270,175 256,122 232,0 Z"
                                                    fill="#11384f"
                                                />
                                                <path
                                                    d="M0,126 L652,118 M0,68 L612,58 M188,0 L216,208 M404,0 L438,208 M332,0 L394,208"
                                                    stroke="#28384f"
                                                    strokeWidth="3"
                                                    fill="none"
                                                />
                                                <path
                                                    d="M154,0 C168,72 182,140 198,208"
                                                    stroke="#3f587c"
                                                    strokeWidth="6"
                                                    fill="none"
                                                />
                                                <rect
                                                    x="152"
                                                    y="22"
                                                    width="34"
                                                    height="18"
                                                    rx="6"
                                                    fill="#274673"
                                                    stroke="#669df6"
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    x="169"
                                                    y="35"
                                                    textAnchor="middle"
                                                    fill="#d2e3fc"
                                                    fontSize="10"
                                                    fontWeight="700"
                                                >
                                                    I-94
                                                </text>
                                                <text
                                                    x="76"
                                                    y="146"
                                                    fill="#9aa0a6"
                                                    fontSize="12"
                                                    fontWeight="600"
                                                >
                                                    Northfield
                                                </text>
                                                <text
                                                    x="472"
                                                    y="108"
                                                    fill="#9aa0a6"
                                                    fontSize="12"
                                                    fontWeight="600"
                                                >
                                                    Winnetka
                                                </text>
                                                <text
                                                    x="588"
                                                    y="42"
                                                    fill="#6998c2"
                                                    fontSize="11"
                                                >
                                                    Lake Michigan
                                                </text>
                                            </svg>

                                            <button
                                                type="button"
                                                className={`${styles.mapPinBtn} ${styles.mapPinButcher} ${rightRailMode === 'butcher' ? styles.mapPinBtnActive : ''}`}
                                                aria-pressed={rightRailMode === 'butcher'}
                                                onClick={() => handleSelectLocation('butcher')}
                                            >
                                                <span className={styles.mapPinBadge}>A</span>
                                                <span className={styles.mapPinLabel}>
                                                    <span className={styles.mapPinTitle}>
                                                        {SERP_LOCATIONS.butcher.shortMapTitle}
                                                    </span>
                                                    <span className={styles.mapPinSub}>
                                                        {SERP_LOCATIONS.butcher.shortMapSub}
                                                    </span>
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`${styles.mapPinBtn} ${styles.mapPinDepot} ${rightRailMode === 'depot' ? styles.mapPinBtnActive : ''}`}
                                                aria-pressed={rightRailMode === 'depot'}
                                                onClick={() => handleSelectLocation('depot')}
                                            >
                                                <span className={styles.mapPinBadge}>B</span>
                                                <span className={styles.mapPinLabel}>
                                                    <span className={styles.mapPinTitle}>
                                                        {SERP_LOCATIONS.depot.shortMapTitle}
                                                    </span>
                                                    <span className={styles.mapPinSub}>
                                                        {SERP_LOCATIONS.depot.shortMapSub}
                                                    </span>
                                                </span>
                                            </button>

                                            <a
                                                href="https://www.google.com/maps/search/Hofherr+Meat+Co+Northfield+Winnetka+IL"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.mapExpandPill}
                                                aria-label="Open both Hofherr Meat Co. locations in Google Maps"
                                            >
                                                ↗
                                            </a>

                                            <span className={styles.mapAttribution}>
                                                Map preview · Northfield &amp; Winnetka
                                            </span>
                                        </div>

                                        <div className={styles.locationList}>
                                            {(['butcher', 'depot'] as const).map((locKey) => {
                                                const loc = SERP_LOCATIONS[locKey];
                                                const status =
                                                    locKey === 'butcher'
                                                        ? butcherStatus
                                                        : depotStatus;
                                                const isSelected = rightRailMode === locKey;

                                                return (
                                                    <div
                                                        key={loc.id}
                                                        className={`${styles.locationRow} ${isSelected ? styles.locationRowSelected : ''}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={styles.locationSelectBtn}
                                                            onClick={() =>
                                                                handleSelectLocation(locKey)
                                                            }
                                                        >
                                                            <span className={styles.locationLetter}>
                                                                {loc.letter}
                                                            </span>
                                                            <span className={styles.locationDetails}>
                                                                <span
                                                                    className={styles.locationName}
                                                                >
                                                                    {loc.serpTitle}
                                                                </span>
                                                                <span
                                                                    className={styles.locationMeta}
                                                                >
                                                                    {loc.distanceLabel} ·{' '}
                                                                    {loc.streetShort} ·{' '}
                                                                    {displayPhone}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.locationHoursLine
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            status.isOpen
                                                                                ? styles.statusOpen
                                                                                : styles.statusClosed
                                                                        }
                                                                    >
                                                                        {status.badgeText}
                                                                    </span>{' '}
                                                                    · {status.detailText}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.locationReviewSnippet
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.reviewerDot
                                                                        }
                                                                        aria-hidden="true"
                                                                    >
                                                                        {loc.reviewerInitial}
                                                                    </span>
                                                                    <span>{loc.featuredQuote}</span>
                                                                </span>
                                                            </span>
                                                        </button>

                                                        <div className={styles.locationActions}>
                                                            <Link
                                                                href={loc.websitePath}
                                                                className={styles.circleActionLink}
                                                            >
                                                                <span
                                                                    className={
                                                                        styles.circleActionIcon
                                                                    }
                                                                    aria-hidden="true"
                                                                >
                                                                    🌐
                                                                </span>
                                                                <span>Website</span>
                                                            </Link>
                                                            <a
                                                                href={loc.directionsUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.circleActionLink}
                                                            >
                                                                <span
                                                                    className={
                                                                        styles.circleActionIcon
                                                                    }
                                                                    aria-hidden="true"
                                                                >
                                                                    ↱
                                                                </span>
                                                                <span>Directions</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <article className={styles.organicResult}>
                                    <div className={styles.organicMainRow}>
                                        <div className={styles.organicCopy}>
                                            <div className={styles.siteAttribution}>
                                                <span className={styles.faviconCircle}>
                                                    <img
                                                        src="/assets/identity/hofherr-app-icon.svg"
                                                        alt=""
                                                        width={24}
                                                        height={24}
                                                        className={styles.faviconImg}
                                                    />
                                                </span>
                                                <div className={styles.siteNameGroup}>
                                                    <span className={styles.siteNameTitle}>
                                                        {settings.shopName || 'Hofherr Meat Co.'}
                                                    </span>
                                                    <span className={styles.siteUrlRow}>
                                                        <span>https://hofherrmeatco.com</span>
                                                        <span aria-hidden="true">⋮</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={styles.visitOftenPill}>
                                                You visit often
                                            </span>

                                            <Link
                                                href="/"
                                                className={`${styles.organicTitleLink} ${snippetMode === 'legacy' ? styles.organicTitleVisited : ''}`}
                                            >
                                                {snippetMode === 'legacy'
                                                    ? 'Hofherr Meat Co. Butcher Shop and BBQ Catering'
                                                    : 'Hofherr Meat Co. | Northfield Craft Butcher, Winnetka Depot & BBQ Catering'}
                                            </Link>

                                            <p className={styles.organicDescription}>
                                                {snippetMode === 'legacy' ? (
                                                    <>
                                                        <strong>Full-service butcher shop</strong>{' '}
                                                        offering deli meats, cut-to-order prime,
                                                        dry-aged steaks, housemade sausages,
                                                        prepared foods and soups, and more.
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>
                                                            Whole-animal craft butcher shop
                                                        </strong>{' '}
                                                        at 300 Happ Rd in Northfield &amp;{' '}
                                                        <strong>The Depot</strong> weekday lunch
                                                        counter at 754 Elm St in Winnetka.
                                                        Cut-to-order USDA Prime &amp; dry-aged
                                                        steaks, housemade sausages, dipped Italian
                                                        beef, and whole-hog BBQ catering.
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                        <div className={styles.organicThumbWrap}>
                                            {snippetMode === 'legacy' ? (
                                                <img
                                                    src="/assets/identity/hofherr-app-icon.svg"
                                                    alt="Hofherr Meat Co. crest mark"
                                                    width={92}
                                                    height={92}
                                                    className={`${styles.organicThumbImg} ${styles.organicThumbContain}`}
                                                />
                                            ) : (
                                                <img
                                                    src="/images/visit/northfield-storefront-front.jpg"
                                                    alt="Hofherr Meat Co. Northfield storefront"
                                                    width={92}
                                                    height={92}
                                                    className={styles.organicThumbImg}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {snippetMode === 'enhanced' && (
                                        <div className={styles.sitelinksGrid}>
                                            {SERP_SITELINKS.map((item) => (
                                                <div key={item.href} className={styles.sitelinkItem}>
                                                    <Link
                                                        href={item.href}
                                                        className={styles.sitelinkAnchor}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p className={styles.sitelinkSnippet}>
                                                        {item.snippet}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            </div>

                            <div className={styles.serpRightCol}>
                                <SerpRightRail
                                    mode={rightRailMode}
                                    shopName={settings.shopName}
                                    displayPhone={displayPhone}
                                    butcherHours={settings.butcherHours}
                                    depotHours={settings.depotHours}
                                    butcherStatus={butcherStatus}
                                    depotStatus={depotStatus}
                                    onSelectLocation={handleSelectLocation}
                                    onResetToOrg={() => setRightRailMode('organization')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="serp-comparison"
                aria-labelledby="serp-comparison-heading"
                className="section-sm"
            >
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeader}>
                            <h2 id="serp-comparison-heading" className={styles.sectionHeading}>
                                Current Google Listing vs. Multi-Location Graph
                            </h2>
                            <p className={styles.sectionSub}>
                                Why commit <code>d8792da334ed</code> restructured{' '}
                                <code>src/components/JsonLd.tsx</code> into a parent{' '}
                                <code>Organization</code> with two distinct{' '}
                                <code>LocalBusiness</code> branches.
                            </p>
                        </div>

                        <div className={styles.compareGrid}>
                            <div className={styles.compareCard}>
                                <h3 className={styles.compareCardTitle}>
                                    Before · Single Generic Snippet
                                </h3>
                                <ul className={styles.compareBulletList}>
                                    <li>
                                        Only surfaced a single web snippet for{' '}
                                        <code>hofherrmeatco.com</code> with the black-and-white logo
                                        crest thumbnail.
                                    </li>
                                    <li>
                                        The Depot at <strong>754 Elm St, Winnetka</strong> had no
                                        separate <code>LocalBusiness</code> node, geo coordinates,
                                        or Mon–Fri commuter hours in structured data.
                                    </li>
                                    <li>
                                        Brand searches did not connect Founders, March 2014 founding
                                        date, and <code>subOrganization</code> locations into a
                                        unified Knowledge Panel.
                                    </li>
                                </ul>
                            </div>

                            <div className={`${styles.compareCard} ${styles.compareCardEnhanced}`}>
                                <h3 className={styles.compareCardTitle}>
                                    After · 2-Store Local Pack + Brand Graph
                                </h3>
                                <ul className={styles.compareBulletList}>
                                    <li>
                                        Links <strong>Pin A (300 Happ Rd, Northfield)</strong> and{' '}
                                        <strong>Pin B (754 Elm St, Winnetka Metra)</strong> under
                                        parent <code>#organization</code> via{' '}
                                        <code>subOrganization</code> and{' '}
                                        <code>parentOrganization</code>.
                                    </li>
                                    <li>
                                        Publishes distinct store schedules (Tue–Sun Butcher Shop vs.
                                        Mon–Fri Depot), exact latitude/longitude, and store-specific
                                        menus/amenities.
                                    </li>
                                    <li>
                                        Supports deep Sitelinks (<code>/online-orders</code>,{' '}
                                        <code>/visit</code>, <code>/catering</code>,{' '}
                                        <code>/specials</code>) and storefront photo thumbnails.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="jsonld-graph"
                aria-labelledby="jsonld-graph-heading"
                className="section"
            >
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHeader}>
                            <h2 id="jsonld-graph-heading" className={styles.sectionHeading}>
                                Live Schema.org @graph Nodes
                            </h2>
                            <p className={styles.sectionSub}>
                                These 5 linked structured-data entities are emitted on every page
                                load by <code>src/components/JsonLd.tsx</code> so Google Search and
                                Google Maps index both North Shore storefronts accurately.
                            </p>
                        </div>

                        <div className={styles.schemaGrid}>
                            {SCHEMA_ENTITIES.map((entity) => (
                                <article key={entity.id} className={styles.schemaEntityCard}>
                                    <div className={styles.schemaEntityHead}>
                                        <h3 className={styles.schemaEntityTitle}>{entity.title}</h3>
                                        <span className={styles.schemaTypeTag}>
                                            {entity.schemaType}
                                        </span>
                                    </div>
                                    <code className={styles.schemaIdCode}>{entity.id}</code>
                                    <p className={styles.schemaDesc}>{entity.description}</p>
                                </article>
                            ))}
                        </div>

                        <details className={styles.rawJsonDetails}>
                            <summary className={styles.rawJsonSummary}>
                                Inspect Live JSON-LD Graph Payload (Synced with SiteSettingsContext)
                            </summary>
                            <pre
                                role="region"
                                aria-label="Live JSON-LD structured data graph"
                                tabIndex={0}
                                className={styles.rawJsonPre}
                            >
                                <code>{jsonLdPreview}</code>
                            </pre>
                        </details>
                    </div>
                </div>
            </section>
        </main>
    );
}
