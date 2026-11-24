'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import type { StoreHourEntry } from '@/context/SiteSettingsContext';
import {
    GOOGLE_POST_UPDATE,
    HOLIDAY_PICKUP_HOURS,
    KNOWLEDGE_PRODUCTS,
    SERP_LOCATIONS,
    type GbpTabId,
    type LiveHoursStatus,
    type LocationId,
    type RightRailMode,
} from './serpData';
import styles from './page.module.css';

type SerpRightRailProps = {
    mode: RightRailMode;
    shopName: string;
    displayPhone: string;
    email: string;
    instagramUrl: string;
    facebookUrl: string;
    yelpUrl: string;
    googleMapsUrl: string;
    butcherHours: StoreHourEntry[];
    depotHours: StoreHourEntry[];
    butcherStatus: LiveHoursStatus;
    depotStatus: LiveHoursStatus;
    onSelectLocation: (loc: LocationId) => void;
    onResetToOrg: () => void;
};

const GBP_TABS: ReadonlyArray<{ id: GbpTabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'photos', label: 'Photos' },
];

function ReviewSummaryBlock({
    rating,
    reviewCount,
}: {
    rating: string;
    reviewCount: number;
}) {
    return (
        <div className={styles.reviewSummaryBox}>
            <h4 className={styles.kpSectionHeading}>Google review summary</h4>
            <div className={styles.reviewSummaryGrid}>
                <div className={styles.reviewBars} aria-hidden="true">
                    <div className={styles.reviewBarRow}>
                        <span>5</span>
                        <div className={styles.reviewBarTrack}>
                            <div className={`${styles.reviewBarFill} ${styles.bar92}`} />
                        </div>
                    </div>
                    <div className={styles.reviewBarRow}>
                        <span>4</span>
                        <div className={styles.reviewBarTrack}>
                            <div className={`${styles.reviewBarFill} ${styles.bar6}`} />
                        </div>
                    </div>
                    <div className={styles.reviewBarRow}>
                        <span>3</span>
                        <div className={styles.reviewBarTrack}>
                            <div className={`${styles.reviewBarFill} ${styles.bar2}`} />
                        </div>
                    </div>
                    <div className={styles.reviewBarRow}>
                        <span>2</span>
                        <div className={styles.reviewBarTrack}>
                            <div className={`${styles.reviewBarFill} ${styles.bar0}`} />
                        </div>
                    </div>
                    <div className={styles.reviewBarRow}>
                        <span>1</span>
                        <div className={styles.reviewBarTrack}>
                            <div className={`${styles.reviewBarFill} ${styles.bar0}`} />
                        </div>
                    </div>
                </div>
                <div className={styles.reviewScoreBig}>
                    <span className={styles.reviewScoreNumber}>{rating}</span>
                    <span className={styles.kpStars} aria-hidden="true">
                        ★★★★★
                    </span>
                    <span className={styles.reviewScoreCount}>{reviewCount} reviews</span>
                </div>
            </div>
        </div>
    );
}

function HolidayPickupHoursBlock() {
    return (
        <details className={styles.kpHoursDetails} open>
            <summary className={styles.kpHoursSummary}>
                <span className={styles.kpHoursHeaderLeft}>
                    <span className={styles.kpHoursStoreLabel}>
                        🗓️ Holiday &amp; Special Pickup Hours
                    </span>
                    <span className={styles.kpHoursStatusLine}>
                        Confirmed holiday schedules via{' '}
                        <code>specialOpeningHoursSpecification</code>
                    </span>
                </span>
                <span aria-hidden="true">⌄</span>
            </summary>
            <div className={styles.kpHoursTable}>
                {HOLIDAY_PICKUP_HOURS.map((item) => (
                    <div key={item.id} className={styles.gbpHoursDayRow}>
                        <span>{item.occasion}</span>
                        <span className={styles.kpHolidayRowRight}>
                            <span>{item.schedule}</span>
                            <span
                                className={
                                    item.isClosed
                                        ? styles.kpHolidayTagClosed
                                        : styles.kpHolidayTagConfirmed
                                }
                            >
                                {item.isClosed ? 'Closed' : 'Confirmed'}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </details>
    );
}

function ProductsShowcaseBlock() {
    return (
        <div className={styles.kpSectionBlock}>
            <h4 className={styles.kpSectionHeading}>Products &amp; Butcher Case</h4>
            <div className={styles.kpProductsGrid}>
                {KNOWLEDGE_PRODUCTS.map((product) => (
                    <Link key={product.id} href={product.href} className={styles.kpProductCard}>
                        <img
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            width={180}
                            height={96}
                            loading="lazy"
                            className={styles.kpProductImg}
                        />
                        <span className={styles.kpProductBody}>
                            <span className={styles.kpProductTitle}>{product.title}</span>
                            <span className={styles.kpProductMeta}>{product.meta}</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SocialProfilesBlock({
    instagramUrl,
    facebookUrl,
    yelpUrl,
    googleMapsUrl,
}: {
    instagramUrl: string;
    facebookUrl: string;
    yelpUrl: string;
    googleMapsUrl: string;
}) {
    return (
        <div className={styles.kpSectionBlock}>
            <h4 className={styles.kpSectionHeading}>Profiles</h4>
            <div className={styles.kpProfilesRow}>
                <a
                    href={instagramUrl || 'https://www.instagram.com/hofherrmeatco'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.kpProfileBadge}
                >
                    <span className={styles.kpProfileCircle} aria-hidden="true">
                        IG
                    </span>
                    <span>Instagram</span>
                </a>
                <a
                    href={facebookUrl || 'https://www.facebook.com/HofherrMeatCo'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.kpProfileBadge}
                >
                    <span className={styles.kpProfileCircle} aria-hidden="true">
                        FB
                    </span>
                    <span>Facebook</span>
                </a>
                <a
                    href={yelpUrl || 'https://www.yelp.com/biz/hofherr-meat-co-northfield'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.kpProfileBadge}
                >
                    <span className={styles.kpProfileCircle} aria-hidden="true">
                        ★
                    </span>
                    <span>Yelp</span>
                </a>
                <a
                    href={googleMapsUrl || 'https://g.page/hofherrmeatco'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.kpProfileBadge}
                >
                    <span className={styles.kpProfileCircle} aria-hidden="true">
                        📍
                    </span>
                    <span>Maps</span>
                </a>
            </div>
        </div>
    );
}

function GooglePostUpdateBlock({ shopName }: { shopName: string }) {
    return (
        <div className={styles.kpSectionBlock}>
            <h4 className={styles.kpSectionHeading}>From {shopName || 'Hofherr Meat Co.'}</h4>
            <div className={styles.kpUpdateCard}>
                <div className={styles.kpUpdateTop}>
                    <span className={styles.kpUpdateAuthor}>
                        <span aria-hidden="true">📢</span>
                        <span>{GOOGLE_POST_UPDATE.badge}</span>
                    </span>
                </div>
                <div className={styles.kpUpdateMediaRow}>
                    <img
                        src={GOOGLE_POST_UPDATE.imageSrc}
                        alt={GOOGLE_POST_UPDATE.imageAlt}
                        width={80}
                        height={80}
                        loading="lazy"
                        className={styles.kpUpdateThumb}
                    />
                    <p className={styles.kpUpdateCopy}>{GOOGLE_POST_UPDATE.body}</p>
                </div>
                <Link href={GOOGLE_POST_UPDATE.ctaHref} className={styles.kpUpdateCta}>
                    {GOOGLE_POST_UPDATE.ctaLabel}
                </Link>
            </div>
        </div>
    );
}

export function SerpRightRail({
    mode,
    shopName,
    displayPhone,
    email,
    instagramUrl,
    facebookUrl,
    yelpUrl,
    googleMapsUrl,
    butcherHours,
    depotHours,
    butcherStatus,
    depotStatus,
    onSelectLocation,
    onResetToOrg,
}: SerpRightRailProps) {
    const [activeTab, setActiveTab] = useState<GbpTabId>('overview');

    const tabRefs = useRef<Record<GbpTabId, HTMLButtonElement | null>>({
        overview: null,
        reviews: null,
        photos: null,
    });
    const overviewPanelRef = useRef<HTMLDivElement | null>(null);
    const reviewsPanelRef = useRef<HTMLDivElement | null>(null);
    const photosPanelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mode === 'organization') return undefined;

        const entries: Array<[HTMLDivElement | null, GbpTabId]> = [
            [overviewPanelRef.current, 'overview'],
            [reviewsPanelRef.current, 'reviews'],
            [photosPanelRef.current, 'photos'],
        ];

        const cleanups: Array<() => void> = [];
        for (const [panel, tabId] of entries) {
            if (!panel) continue;
            if (tabId === activeTab) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', 'until-found');
            }
            const handleBeforeMatch = () => {
                setActiveTab(tabId);
            };
            panel.addEventListener('beforematch', handleBeforeMatch);
            cleanups.push(() => panel.removeEventListener('beforematch', handleBeforeMatch));
        }

        return () => {
            for (const cleanup of cleanups) cleanup();
        };
    }, [mode, activeTab]);

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        let nextIndex: number | null = null;
        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % GBP_TABS.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + GBP_TABS.length) % GBP_TABS.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = GBP_TABS.length - 1;
        }

        if (nextIndex === null) return;
        event.preventDefault();
        const nextTab = GBP_TABS[nextIndex];
        setActiveTab(nextTab.id);
        const targetBtn = tabRefs.current[nextTab.id];
        targetBtn?.focus();
        targetBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };

    if (mode === 'organization') {
        return (
            <aside className={styles.knowledgeCard} aria-label="Google Brand Knowledge Panel">
                <div className={styles.kpSparkleRow}>
                    <span className={styles.kpSparkleLeft}>
                        <span aria-hidden="true">✦</span>
                        <span>Knowledge Graph · Organization</span>
                    </span>
                    <button
                        type="button"
                        className={styles.kpSwitchGhostBtn}
                        onClick={() => onSelectLocation('butcher')}
                    >
                        Inspect Pin A Profile →
                    </button>
                </div>

                <div className={styles.kpHeaderBlock}>
                    <h3 className={styles.kpTitle}>{shopName || 'Hofherr Meat Co.'}</h3>
                    <p className={styles.kpSubtitle}>
                        Craft butcher shop &amp; BBQ catering company · $$
                    </p>
                </div>

                <div className={styles.kpMosaic}>
                    <div className={styles.kpMosaicMain}>
                        <img
                            src="/images/visit/northfield-storefront-front.jpg"
                            alt="Hofherr Meat Co. storefront at 300 Happ Rd in Northfield"
                            width={320}
                            height={188}
                            className={styles.kpMosaicImg}
                        />
                    </div>
                    <div className={styles.kpMosaicSide}>
                        <img
                            src="/assets/press/sean-and-arielle-hofherr-northfield-shop.webp"
                            alt="Sean and Arielle Hofherr inside the Northfield butcher shop"
                            width={220}
                            height={92}
                            className={styles.kpMosaicImg}
                        />
                    </div>
                    <div className={styles.kpMosaicSide}>
                        <img
                            src="/assets/press/hofherr-stay-smoking-bbq-smoker.webp"
                            alt="Hofherr Stay Smoking offset BBQ smoker"
                            width={220}
                            height={92}
                            className={styles.kpMosaicImg}
                        />
                        <span className={styles.kpPhotoBadge} aria-hidden="true">
                            ▣
                        </span>
                    </div>
                </div>

                <Link href="/" className={styles.kpPrimaryPill}>
                    <span aria-hidden="true">🌐</span>
                    <span>hofherrmeatco.com</span>
                </Link>

                <div className={styles.kpQuickActionsGrid}>
                    <Link href="/online-orders" className={styles.kpSecondaryPill}>
                        <span aria-hidden="true">🥩</span>
                        <span>Order Cuts</span>
                    </Link>
                    <Link href="/cut-guide" className={styles.kpSecondaryPill}>
                        <span aria-hidden="true">📋</span>
                        <span>Cut Menu</span>
                    </Link>
                    <Link href="/catering" className={styles.kpSecondaryPill}>
                        <span aria-hidden="true">🔥</span>
                        <span>Catering Quote</span>
                    </Link>
                    <Link href="/gift-cards" className={styles.kpSecondaryPill}>
                        <span aria-hidden="true">🎁</span>
                        <span>Gift Cards</span>
                    </Link>
                </div>

                <p className={styles.kpBlurb}>
                    Hofherr Meat Co. is an{' '}
                    <span className={styles.kpHighlight}>
                        independent whole-animal craft butcher shop and BBQ catering house
                    </span>{' '}
                    serving Chicago’s North Shore since March 2014, operating its flagship butcher
                    counter in Northfield alongside The Depot weekday sandwich shop at the Winnetka
                    Metra station.
                </p>

                <div className={styles.kpHoursGroup}>
                    <details className={styles.kpHoursDetails} open>
                        <summary className={styles.kpHoursSummary}>
                            <span className={styles.kpHoursHeaderLeft}>
                                <span className={styles.kpHoursStoreLabel}>
                                    🕒 Hours · The Butcher Shop (300 Happ Rd, Northfield)
                                </span>
                                <span className={styles.kpHoursStatusLine}>
                                    <span
                                        className={
                                            butcherStatus.isOpen
                                                ? styles.statusOpen
                                                : styles.statusClosed
                                        }
                                    >
                                        {butcherStatus.badgeText}
                                    </span>{' '}
                                    · {butcherStatus.detailText}
                                </span>
                            </span>
                            <span aria-hidden="true">⌄</span>
                        </summary>
                        <div className={styles.kpHoursTable}>
                            {butcherHours.map((entry) => {
                                const isToday =
                                    butcherStatus.currentDay.toLowerCase() ===
                                    entry.day.toLowerCase();
                                return (
                                    <div
                                        key={entry.day}
                                        className={`${styles.gbpHoursDayRow} ${isToday ? styles.gbpHoursDayToday : ''}`}
                                    >
                                        <span>{entry.day}</span>
                                        <span>
                                            {entry.isClosed
                                                ? 'Closed'
                                                : `${entry.open} – ${entry.close}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </details>

                    <details className={styles.kpHoursDetails} open>
                        <summary className={styles.kpHoursSummary}>
                            <span className={styles.kpHoursHeaderLeft}>
                                <span className={styles.kpHoursStoreLabel}>
                                    🕒 Hours · The Depot (754 Elm St, Winnetka Metra)
                                </span>
                                <span className={styles.kpHoursStatusLine}>
                                    <span
                                        className={
                                            depotStatus.isOpen
                                                ? styles.statusOpen
                                                : styles.statusClosed
                                        }
                                    >
                                        {depotStatus.badgeText}
                                    </span>{' '}
                                    · {depotStatus.detailText}
                                </span>
                            </span>
                            <span aria-hidden="true">⌄</span>
                        </summary>
                        <div className={styles.kpHoursTable}>
                            {depotHours.map((entry) => {
                                const isToday =
                                    depotStatus.currentDay.toLowerCase() ===
                                    entry.day.toLowerCase();
                                return (
                                    <div
                                        key={entry.day}
                                        className={`${styles.gbpHoursDayRow} ${isToday ? styles.gbpHoursDayToday : ''}`}
                                    >
                                        <span>{entry.day}</span>
                                        <span>
                                            {entry.isClosed
                                                ? 'Closed'
                                                : `${entry.open} – ${entry.close}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </details>

                    <HolidayPickupHoursBlock />
                </div>

                <ProductsShowcaseBlock />

                <dl className={styles.kpFactsList}>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Customer service</dt>
                        <dd className={styles.kpFactValue}>
                            <span className={styles.kpFactDotted}>{displayPhone}</span> ·{' '}
                            {email || 'butcher@hofherrmeatco.com'}
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Founders</dt>
                        <dd className={styles.kpFactValue}>
                            <Link href="/our-story" className={styles.kpFactLink}>
                                Sean Hofherr
                            </Link>{' '}
                            &amp;{' '}
                            <Link href="/our-story" className={styles.kpFactLink}>
                                Arielle Hofherr
                            </Link>
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Founded</dt>
                        <dd className={styles.kpFactValue}>March 2014, Northfield, IL</dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Headquarters</dt>
                        <dd className={styles.kpFactValue}>
                            <span className={styles.kpFactDotted}>
                                300 Happ Rd, Northfield, IL 60093
                            </span>
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Locations</dt>
                        <dd className={styles.kpFactValue}>
                            Northfield Butcher Shop · Winnetka Depot (UP-N Metra)
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Price &amp; pay</dt>
                        <dd className={styles.kpFactValue}>
                            $$ · Apple Pay, Google Pay, Credit/Debit, Cash
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Service area</dt>
                        <dd className={styles.kpFactValue}>
                            Northfield, Winnetka, Wilmette, Kenilworth, Glencoe, Glenview,
                            Northbrook, Evanston, Highland Park, Lake Forest &amp; Chicago
                        </dd>
                    </div>
                    <div className={styles.kpFactRow}>
                        <dt className={styles.kpFactTerm}>Featured in</dt>
                        <dd className={styles.kpFactValue}>
                            <Link href="/our-story#press" className={styles.kpFactLink}>
                                America’s Test Kitchen (Proof Podcast) · WGN &amp; North Shore Press
                            </Link>
                        </dd>
                    </div>
                </dl>

                <SocialProfilesBlock
                    instagramUrl={instagramUrl}
                    facebookUrl={facebookUrl}
                    yelpUrl={yelpUrl}
                    googleMapsUrl={googleMapsUrl}
                />

                <GooglePostUpdateBlock shopName={shopName} />
            </aside>
        );
    }

    const location = SERP_LOCATIONS[mode];
    const hoursList = mode === 'butcher' ? butcherHours : depotHours;
    const liveStatus = mode === 'butcher' ? butcherStatus : depotStatus;
    const otherLocation: LocationId = mode === 'butcher' ? 'depot' : 'butcher';
    const cleanTelHref = `tel:${displayPhone.replace(/[^+\d]/g, '')}`;

    return (
        <aside
            className={styles.knowledgeCard}
            aria-label={`${location.gbpTitle} Google Business Profile`}
        >
            <div className={styles.kpSparkleRow}>
                <span className={styles.kpSparkleLeft}>
                    <span>
                        Pin {location.letter} ·{' '}
                        {mode === 'butcher' ? 'Northfield Flagship' : 'Winnetka UP-N Station'}
                    </span>
                </span>
                <button
                    type="button"
                    className={styles.kpSwitchGhostBtn}
                    onClick={onResetToOrg}
                >
                    ← Brand Graph
                </button>
            </div>

            <div className={styles.kpHeaderBlock}>
                <h3 className={styles.kpTitle}>{location.gbpTitle}</h3>
                <div className={styles.kpRatingRow}>
                    <span>{location.rating}</span>
                    <span className={styles.kpStars} aria-hidden="true">
                        ★★★★★
                    </span>
                    <span>({location.reviewCount})</span>
                    <span aria-hidden="true">·</span>
                    <span>$$</span>
                    <span aria-hidden="true">·</span>
                    <span>{location.categoryLabel}</span>
                </div>
            </div>

            <div
                className={styles.gbpTablist}
                role="tablist"
                aria-label={`${location.gbpTitle} sections`}
            >
                {GBP_TABS.map((tab, index) => {
                    const isSelected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            ref={(el) => {
                                tabRefs.current[tab.id] = el;
                            }}
                            type="button"
                            role="tab"
                            id={`gbp-tab-${tab.id}`}
                            className={styles.gbpTab}
                            aria-selected={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => setActiveTab(tab.id)}
                            onKeyDown={(e) => handleTabKeyDown(e, index)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className={styles.gbpPanelsStack}>
                <div
                    ref={overviewPanelRef}
                    role="tabpanel"
                    aria-labelledby="gbp-tab-overview"
                    hidden={activeTab !== 'overview'}
                >
                    <div className={styles.gbpTabPanelInner}>
                        <div className={styles.gbpPhotoPair}>
                            <img
                                src={location.heroPhotos[0].src}
                                alt={location.heroPhotos[0].alt}
                                width={220}
                                height={184}
                                className={styles.kpMosaicImg}
                            />
                            <img
                                src={location.heroPhotos[1].src}
                                alt={location.heroPhotos[1].alt}
                                width={176}
                                height={184}
                                className={styles.kpMosaicImg}
                            />
                        </div>

                        <div className={styles.gbpActionsWrap}>
                            <Link href={location.websitePath} className={styles.gbpActionChip}>
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    🌐
                                </span>
                                <span>Website</span>
                            </Link>
                            <a
                                href={location.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.gbpActionChip}
                            >
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    ↱
                                </span>
                                <span>Directions</span>
                            </a>
                            <Link href="/online-orders" className={styles.gbpActionChip}>
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    🥩
                                </span>
                                <span>Order</span>
                            </Link>
                            <Link href="/catering" className={styles.gbpActionChip}>
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    🔥
                                </span>
                                <span>Catering</span>
                            </Link>
                            <Link href="/gift-cards" className={styles.gbpActionChip}>
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    🎁
                                </span>
                                <span>Gift Cards</span>
                            </Link>
                            <a href={cleanTelHref} className={styles.gbpActionChip}>
                                <span className={styles.gbpActionIconBlue} aria-hidden="true">
                                    📞
                                </span>
                                <span>Call</span>
                            </a>
                        </div>

                        <div className={styles.gbpInfoList}>
                            <div className={styles.gbpInfoRow}>
                                <div className={styles.gbpInfoLeft}>
                                    <span className={styles.gbpIconBadge} aria-hidden="true">
                                        ✓
                                    </span>
                                    <span>{location.serviceOptions}</span>
                                </div>
                            </div>

                            <details className={styles.gbpHoursDetails} open>
                                <summary className={styles.gbpHoursSummary}>
                                    <span className={styles.gbpInfoLeft}>
                                        <span className={styles.gbpIconBadge} aria-hidden="true">
                                            🕒
                                        </span>
                                        <span>
                                            <span
                                                className={
                                                    liveStatus.isOpen
                                                        ? styles.statusOpen
                                                        : styles.statusClosed
                                                }
                                            >
                                                {liveStatus.badgeText}
                                            </span>{' '}
                                            · {liveStatus.detailText}
                                        </span>
                                    </span>
                                    <span aria-hidden="true">⌄</span>
                                </summary>
                                <div className={styles.gbpHoursTable}>
                                    {hoursList.map((entry) => {
                                        const isToday =
                                            liveStatus.currentDay.toLowerCase() ===
                                            entry.day.toLowerCase();
                                        return (
                                            <div
                                                key={entry.day}
                                                className={`${styles.gbpHoursDayRow} ${isToday ? styles.gbpHoursDayToday : ''}`}
                                            >
                                                <span>{entry.day}</span>
                                                <span>
                                                    {entry.isClosed
                                                        ? 'Closed'
                                                        : `${entry.open} – ${entry.close}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>

                            <HolidayPickupHoursBlock />

                            <div className={styles.gbpInfoRow}>
                                <div className={styles.gbpInfoLeft}>
                                    <span className={styles.gbpIconBadge} aria-hidden="true">
                                        📍
                                    </span>
                                    <span>{location.fullAddress}</span>
                                </div>
                                <div className={styles.gbpAddressThumb} aria-hidden="true">
                                    <svg viewBox="0 0 72 56" className={styles.mapSvg}>
                                        <rect width="72" height="56" fill="#1b2b42" />
                                        <path
                                            d="M0 36 L72 22 M24 0 L38 56"
                                            stroke="#344c6e"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="38"
                                            cy="26"
                                            r="9"
                                            fill="#ea4335"
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.gbpInfoRow}>
                                <div className={styles.gbpInfoLeft}>
                                    <span className={styles.gbpIconBadge} aria-hidden="true">
                                        📞
                                    </span>
                                    <span>{displayPhone}</span>
                                </div>
                                <button
                                    type="button"
                                    className={styles.kpSwitchGhostBtn}
                                    onClick={() => onSelectLocation(otherLocation)}
                                >
                                    Switch to Pin {SERP_LOCATIONS[otherLocation].letter}
                                </button>
                            </div>
                        </div>

                        <p className={styles.kpBlurb}>{location.editorialBlurb}</p>

                        <ProductsShowcaseBlock />

                        <ReviewSummaryBlock
                            rating={location.rating}
                            reviewCount={location.reviewCount}
                        />

                        <SocialProfilesBlock
                            instagramUrl={instagramUrl}
                            facebookUrl={facebookUrl}
                            yelpUrl={yelpUrl}
                            googleMapsUrl={googleMapsUrl}
                        />

                        <GooglePostUpdateBlock shopName={shopName} />
                    </div>
                </div>

                <div
                    ref={reviewsPanelRef}
                    role="tabpanel"
                    aria-labelledby="gbp-tab-reviews"
                    hidden={activeTab !== 'reviews'}
                >
                    <div className={styles.gbpTabPanelInner}>
                        <ReviewSummaryBlock
                            rating={location.rating}
                            reviewCount={location.reviewCount}
                        />
                        {location.reviews.map((rev) => (
                            <div key={rev.id} className={styles.locationRow}>
                                <div className={styles.locationDetails}>
                                    <div className={styles.locationReviewSnippet}>
                                        <span className={styles.reviewerDot} aria-hidden="true">
                                            {rev.initial}
                                        </span>
                                        <strong>{rev.author}</strong>
                                        <span className={styles.locationMeta}>· {rev.timeAgo}</span>
                                    </div>
                                    <span className={styles.kpStars} aria-hidden="true">
                                        ★★★★★
                                    </span>
                                    <p className={styles.kpBlurb}>{rev.quote}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    ref={photosPanelRef}
                    role="tabpanel"
                    aria-labelledby="gbp-tab-photos"
                    hidden={activeTab !== 'photos'}
                >
                    <div className={styles.gbpTabPanelInner}>
                        <div className={styles.gbpPhotoGalleryGrid}>
                            {location.galleryPhotos.map((photo) => (
                                <img
                                    key={photo.src}
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={184}
                                    height={112}
                                    loading="lazy"
                                    className={styles.gbpGalleryImg}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
