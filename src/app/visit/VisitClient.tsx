'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import ActionButton from '@/components/ActionButton';
import { ThemedMap } from '@/components/FooterMap';
import BurningDotCanvas from './BurningDotCanvas';
import { onGoogleMapsAuthFailure, GOOGLE_MAPS_KEY } from '@/lib/googleMapsLoader';
import styles from './page.module.css';

const GOOGLE_MAPS_SANDBOX = 'allow-scripts allow-same-origin allow-popups';

/* ─── Location data ─── */
const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        short: 'Butcher Shop',
        name: 'The Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        pin: '/icons/butcher-pin.png',
        pinSize: 56,
        shortAddr: '300 Happ Rd · Northfield, IL 60093',
        phone: '(847) 441-MEAT',
        phoneTel: 'tel:8474416328',
        email: 'butcher@hofherrmeatco.com',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093&travelmode=driving',
        heroImage: '/images/visit/northfield-storefront-front.webp',
        heroAlt: 'Hofherr Meat Co. storefront in Northfield, IL',
        hours: [
            { day: 'Tuesday – Friday', time: '10am – 6pm', open: true },
            { day: 'Saturday', time: '10am – 5pm', open: true },
            { day: 'Sunday', time: '10am – 4pm', open: true },
            { day: 'Monday', time: 'Closed', open: false },
        ],
        curbside: true,
        parkingTip: 'The front Northfield Square lot fills fast during peak rushes. Use the south overflow row along Happ Rd or pull right up for Curbside Trunk Drop-Off.',
        quietWindows: 'Tue–Thu 10:00am–11:30am & 2:00pm–4:00pm',
        peakWindows: 'Fri 3:00pm–5:30pm · Sat 11:00am–2:00pm',
        curbsideStep: 'Order online, select Curbside at checkout, and call (847) 441-MEAT when you pull up — we bring it straight to your trunk.',
        directions: [
            {
                from: 'From the North',
                steps: 'Take the Edens Expressway to Exit 31 (Tower Rd). Turn left at the light. Follow Frontage Rd. as it becomes Happ Rd. Turn right into Northfield Square.',
            },
            {
                from: 'From the South',
                steps: 'Take the Edens Expressway to Exit 33A (Willow Rd. West). Turn left on Happ Rd. Turn right into Northfield Square.',
            },
        ],
        orderUrl: 'https://hofherrmeatco.smartonlineorder.com',
        iconType: 'butcher' as const,
    },
    {
        id: 'depot',
        label: 'The Depot',
        short: 'The Depot',
        name: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        pin: '/icons/depot-pin.png',
        pinSize: 72,
        shortAddr: '754 Elm St · Winnetka, IL 60093',
        phone: '(847) 441-MEAT',
        phoneTel: 'tel:8474416328',
        email: 'butcher@hofherrmeatco.com',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St,+Winnetka,+IL+60093&travelmode=driving',
        heroImage: '/shops/winnetka.webp',
        heroAlt: 'The Depot at Winnetka Elm Street Metra Station',
        hours: [
            { day: 'Monday – Friday', time: '10:30am – 6pm (Beef: 10:30–2 & 4–6)', open: true },
            { day: 'Saturday (Farmers Market)', time: '10:30am – 1pm', open: true },
            { day: 'Sunday', time: 'Closed', open: false },
        ],
        curbside: false,
        parkingTip: 'Free street parking along Elm St plus the adjacent Winnetka Metra commuter lot right outside the station doors.',
        quietWindows: 'Mon–Fri 10:30am–11:30am & 2:00pm–4:00pm',
        peakWindows: 'Mon–Fri 11:45am–1:15pm (Hot Lunch Rush)',
        curbsideStep: 'Order ahead online by 1:30pm for express counter grab-and-go pickup inside the Metra station — no line required.',
        directions: [
            {
                from: 'By Train',
                steps: 'Take the Metra Union Pacific North Line to the Winnetka (Elm Street) station. The Depot is located inside the station building.',
            },
            {
                from: 'By Car',
                steps: 'Head to Elm St in Winnetka. Free street parking is available along Elm St and in the adjacent Metra commuter lot.',
            },
        ],
        orderUrl: 'https://hofherrmeatcodepot.smartonlineorder.com',
        iconType: 'depot' as const,
    },
];

export default function VisitClient() {
    const [active, setActive] = useState(0);
    const [loadedMaps, setLoadedMaps] = useState<Record<string, boolean>>({});
    const [mapsVisible, setMapsVisible] = useState(false);
    const [useThemedMap, setUseThemedMap] = useState(Boolean(GOOGLE_MAPS_KEY));
    const mapReadyDispatched = useRef(false);
    const mapColRef = useRef<HTMLDivElement>(null);
    const loc = LOCATIONS[active];

    const markMapReady = useCallback(() => {
        if (!mapReadyDispatched.current && typeof window !== 'undefined') {
            mapReadyDispatched.current = true;
            (window as unknown as { __hofherrMapReady?: boolean }).__hofherrMapReady = true;
            window.dispatchEvent(new CustomEvent('visit-map-ready'));
        }
    }, []);

    useEffect(() => onGoogleMapsAuthFailure(() => setUseThemedMap(false)), []);

    useEffect(() => {
        const syncLocationFromUrl = () => {
            const hash = window.location.hash.toLowerCase();
            const storeParam = new URLSearchParams(window.location.search).get('store')?.toLowerCase();
            if (hash === '#depot' || storeParam === 'depot') {
                setActive(1);
            } else if (hash === '#butcher' || storeParam === 'butcher') {
                setActive(0);
            }
        };

        syncLocationFromUrl();
        window.addEventListener('hashchange', syncLocationFromUrl);
        return () => window.removeEventListener('hashchange', syncLocationFromUrl);
    }, []);

    const handleMapLoad = useCallback(
        (locationId: string, isFirst: boolean) => {
            setLoadedMaps((prev) => (prev[locationId] ? prev : { ...prev, [locationId]: true }));
            if (isFirst) {
                markMapReady();
            }
        },
        [markMapReady]
    );

    useEffect(() => {
        // Reveal /visit immediately without blocking page transition on Google Maps network load
        markMapReady();
    }, [markMapReady]);

    useEffect(() => {
        if (mapsVisible) return;
        const el = mapColRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setMapsVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setMapsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [mapsVisible]);

    return (
        <main className={styles.page}>

            {/* ── Hero with toggle ── */}
                <section id="visit-hero" aria-labelledby="visit-hero-heading" className={styles.hero}>
                    <div className={styles.heroImgWrapper}>
                        <div
                            className={`${styles.heroSlideLayer} ${styles.heroSlideBase} ${active === 1 ? styles.heroSlideBaseSwapped : ''}`}
                            aria-hidden={active !== 0}
                        >
                            <img
                                src={LOCATIONS[0].heroImage}
                                alt={active === 0 ? LOCATIONS[0].heroAlt : ''}
                                width={1376}
                                height={768}
                                fetchPriority="high"
                                loading="eager"
                                decoding="sync"
                                className={styles.heroImg}
                                data-parallax="inset"
                            />
                        </div>
                        <div
                            className={`${styles.heroSlideLayer} ${styles.heroSlideHover} ${active === 1 ? styles.heroSlideHoverSwapped : ''}`}
                            aria-hidden={active !== 1}
                        >
                            <img
                                src={LOCATIONS[1].heroImage}
                                alt={active === 1 ? LOCATIONS[1].heroAlt : ''}
                                width={1376}
                                height={768}
                                loading="eager"
                                decoding="sync"
                                className={styles.heroImg}
                                data-parallax="inset"
                            />
                        </div>
                    </div>



                    <div className={styles.heroOverlay} />
                    <div className={`container ${styles.heroInner}`}>
                        <h1 id="visit-hero-heading" className={styles.headline}>{loc.name}</h1>
                        <p className={styles.sub}>{loc.shortAddr}</p>

                        {/* Controls row */}
                        <div id="butcher" />
                        <div id="depot" />
                        <div className={styles.heroControls}>
                            {/* Toggle pills */}
                            <div className={styles.toggleBar}>
                                {LOCATIONS.map((l, i) => {
                                    const isDepot = l.id === 'depot';
                                    const isActive = i === active;
                                    return (
                                        <button
                                            key={l.id}
                                            type="button"
                                            aria-pressed={isActive}
                                            className={`${styles.toggleBtn} ${isDepot ? styles.toggleBtnDepot : ''} ${isActive ? (isDepot ? styles.toggleActiveDepot : styles.toggleActive) : ''}`}
                                            onClick={() => {
                                                setActive(i);
                                                window.history.replaceState(null, '', `#${l.id}`);
                                            }}
                                        >
                                            {isActive && <BurningDotCanvas variant={isDepot ? 'depot' : 'butcher'} />}
                                            {l.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* CTA */}
                            <ActionButton
                                href={`/online-orders?store=${loc.id}`}
                                variant={loc.id === 'depot' ? 'depot' : 'primary'}
                                className={styles.heroShopBtn}
                            >
                                Shop {loc.name}
                            </ActionButton>
                        </div>
                    </div>
                </section>

                {/* ── Location detail ── */}
                    <section id="location-details" aria-labelledby="location-details-heading" className={`${styles.locationSection} ${styles.locationOverlap}`}>
                        <div className="container">
                            <div className={styles.grid}>
                                {/* Map — lazy-mounted when approaching viewport, only for active/already-loaded location */}
                                <div ref={mapColRef} className={styles.mapCol}>
                                    <div className={styles.mapWrap}>
                                        {mapsVisible && LOCATIONS.map((item, idx) => {
                                            const isActive = idx === active;
                                            const isLoaded = Boolean(loadedMaps[item.id]);
                                            if (!isActive && !isLoaded) return null;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`${styles.mapLayer} ${isActive ? styles.mapLayerActive : styles.mapLayerHidden}`}
                                                >
                                                    {useThemedMap ? (
                                                        <ThemedMap
                                                            lat={item.lat}
                                                            lng={item.lng}
                                                            label={item.label}
                                                            pin={item.pin}
                                                            pinSize={item.pinSize}
                                                            directionsUrl={item.directionsUrl}
                                                            className={`${styles.mapThemed} ${isLoaded ? styles.mapIframeLoaded : styles.mapIframeLoading}`}
                                                            onReady={() => handleMapLoad(item.id, idx === 0)}
                                                            onFail={() => setUseThemedMap(false)}
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={`https://www.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`}
                                                            className={`${styles.mapIframe} ${isLoaded ? styles.mapIframeLoaded : styles.mapIframeLoading}`}
                                                            allowFullScreen
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            sandbox={GOOGLE_MAPS_SANDBOX}
                                                            title={`Map of ${item.label}`}
                                                            onLoad={() => handleMapLoad(item.id, idx === 0)}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <a
                                            href={loc.directionsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.directionsBtn}
                                        >
                                            📍 Get Directions to {loc.short}
                                        </a>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className={styles.infoCol}>
                                    <div className={styles.card}>
                                        <h2 id="location-details-heading" className={styles.cardTitle}>Store Hours</h2>
                                        <ul className={styles.hoursList}>
                                            {loc.hours.map(h => (
                                                <li key={h.day} className={styles.hoursRow}>
                                                    <span className={styles.hoursDay}>{h.day}</span>
                                                    <span className={`${styles.hoursTime} ${!h.open ? styles.closed : ''}`}>{h.time}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {loc.curbside && (
                                            <p className={styles.curbside}>VIP Curbside Pickup &amp; Delivery available on request.</p>
                                        )}
                                    </div>

                                    <div className={styles.card}>
                                        <h2 className={styles.cardTitle}>Parking, Peak Rush &amp; Curbside</h2>
                                        <p className={styles.parkingText}>{loc.parkingTip}</p>
                                        <div className={styles.rushGrid}>
                                            <div className={styles.rushRowQuiet}>
                                                <span className={styles.rushLabel}>Best Quiet Windows</span>
                                                <span className={styles.rushValue}>{loc.quietWindows}</span>
                                            </div>
                                            <div className={styles.rushRowPeak}>
                                                <span className={styles.rushLabel}>Peak Rush (Tighter Lot)</span>
                                                <span className={styles.rushValue}>{loc.peakWindows}</span>
                                            </div>
                                        </div>
                                        <p className={styles.curbsideGuide}>{loc.curbsideStep}</p>
                                        <ul className={styles.directionsList}>
                                            {loc.directions.map(d => (
                                                <li key={d.from} className={styles.directionItem}>
                                                    <strong className={styles.directionFrom}>{d.from}:</strong> {d.steps}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={styles.card}>
                                        <h2 className={styles.cardTitle}>Contact</h2>
                                        <div className={styles.contacts}>
                                            <a href={loc.phoneTel}>📞 {loc.phone}</a>
                                            <a href={`mailto:${loc.email}`}>✉️ {loc.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Which Location Do I Need? (Northfield vs. Winnetka Depot) ── */}
                    <section id="which-location" aria-labelledby="which-location-heading" className={styles.compareSection}>
                        <div className="container">
                            <div className={styles.compareHeader}>
                                <h2 id="which-location-heading" className={styles.compareTitle}>
                                    Northfield Butcher Shop vs. Winnetka Depot
                                </h2>
                                <p className={styles.compareSub}>
                                    First time visiting? Both shops share the same Midwest farms and family standards,
                                    but each location is built for a different kind of stop.
                                </p>
                            </div>

                            <div className={styles.compareGrid}>
                                <article className={`${styles.compareCard} ${styles.compareCardButcher}`}>
                                    <div className={styles.compareCardTop}>
                                        <span className={styles.compareTagButcher}>Full-Service Butcher Block</span>
                                        <h3 className={styles.compareCardName}>The Butcher Shop</h3>
                                        <p className={styles.compareCardAddr}>300 Happ Rd · Northfield, IL · Tue–Sun</p>
                                    </div>
                                    <ul className={styles.compareList}>
                                        <li><strong>Custom hand-cut steaks:</strong> USDA Prime, dry-aged ribeyes, strips, tenderloins &amp; bone-in chops cut to your exact thickness.</li>
                                        <li><strong>Whole roasts &amp; holiday centerpieces:</strong> Standing rib roasts, heritage turkeys, crown roasts &amp; brisket.</li>
                                        <li><strong>House sausages, charcuterie &amp; catering:</strong> 400+ cuts, whole pig roasts &amp; full-service BBQ catering.</li>
                                        <li><strong>Skip the cramped lot:</strong> Select <strong>Curbside Trunk Drop-Off</strong> at checkout and we bring it right to your car.</li>
                                    </ul>
                                    <div className={styles.compareActions}>
                                        <Link href="/online-orders?store=butcher" className="btn-hit">
                                            <span className="btn btn-primary">Shop Butcher Shop →</span>
                                        </Link>
                                        <Link href="/catering" className={styles.compareSecondaryLink}>
                                            BBQ &amp; Catering →
                                        </Link>
                                    </div>
                                </article>

                                <article className={`${styles.compareCard} ${styles.compareCardDepot}`}>
                                    <div className={styles.compareCardTop}>
                                        <span className={styles.compareTagDepot}>Hot Lunch &amp; Commuter Market</span>
                                        <h3 className={styles.compareCardName}>The Depot</h3>
                                        <p className={styles.compareCardAddr}>754 Elm St · Winnetka Metra Station · Mon–Fri + Sat Market</p>
                                    </div>
                                    <ul className={styles.compareList}>
                                        <li><strong>Hot lunches &amp; daily specials:</strong> America&apos;s Test Kitchen–featured Italian Beef (10:30–2 &amp; 4–6), rotisserie chicken &amp; house soups.</li>
                                        <li><strong>Morning coffee &amp; bakery:</strong> Chicago-roasted Sparrow Coffee, Rare Tea Cellar &amp; fresh pastries right at the Metra platform.</li>
                                        <li><strong>Grab-and-go dinner staples:</strong> Pre-packed Prime steaks, sausages, stocks &amp; sides cut fresh from our Northfield block.</li>
                                        <li><strong>Fastest in-and-out:</strong> Elm St street parking &amp; Metra lot steps from the door — zero butcher-counter wait.</li>
                                    </ul>
                                    <div className={styles.compareActions}>
                                        <Link href="/online-orders?store=depot" className="btn-hit">
                                            <span className="btn btn-depot">Shop The Depot →</span>
                                        </Link>
                                        <Link href="/specials" className={styles.compareSecondaryLink}>
                                            Daily Specials →
                                        </Link>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    {/* ── Photo Gallery ── */}
                        <section id="visit-gallery" aria-labelledby="visit-gallery-heading" className={styles.gallery}>
                            <div className="container">
                                <span className={styles.galleryEyebrow}>Inside the Shops</span>
                                <h2 id="visit-gallery-heading" className={styles.galleryTitle}>See What Awaits You</h2>
                                <p className={styles.gallerySub}>Butcher shop, charcuterie counter, sandwich shop, event space, and a floor-to-ceiling rotisserie oven — all under one roof.</p>
                                <div className={styles.galleryGrid}>
                                    {/* Row 1: Large left + 2 stacked right */}
                                    <div className={styles.galleryItemLarge}>
                                        <img src="/images/visit/shop-interior.webp" alt="Inside Hofherr Meat Co." className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>Inside the Northfield butcher shop</div>
                                    </div>
                                    <div className={styles.galleryItemSmallA}>
                                        <img src="/images/visit/sauces-shelf.webp" alt="Uncle Dougie's BBQ sauces and rubs on the shelf" className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>Uncle Dougie&apos;s sauces &amp; house rubs</div>
                                    </div>
                                    <div className={styles.galleryItemSmallB}>
                                        <img src="/images/visit/hanging-sausages.webp" alt="House-made sausages hanging to cure" className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>House-cured links &amp; salumi</div>
                                    </div>

                                    {/* Row 2: Wide panorama */}
                                    <div className={styles.galleryItemWide}>
                                        <img src="/images/visit/shop-event.webp" alt="Community tasting event at Hofherr Meat Co." className={`${styles.galleryImg} ${styles.galleryImgTop}`} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>Community events &amp; tastings at the shop</div>
                                    </div>

                                    {/* Row 3: 3-up grid */}
                                    <div className={styles.galleryItemThird}>
                                        <img src="/images/visit/sandwich.webp" alt="Fresh-sliced roast beef sandwich on artisan bread" className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>Made-to-order deli sandwiches</div>
                                    </div>
                                    <div className={styles.galleryItemThird}>
                                        <img src="/images/visit/rooster-art.webp" alt="Vintage rooster artwork in the shop" className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>A shop full of character</div>
                                    </div>
                                    <div className={styles.galleryItemThird}>
                                        <img src="/images/visit/steins.webp" alt="Collectible steins and decor on display" className={styles.galleryImg} data-parallax="inset" />
                                        <div className={styles.galleryCaption}>Curated decor &amp; collectibles</div>
                                    </div>
                                </div>

                                <p className={styles.storyLink}>
                                    Curious about the family behind the counter?{' '}
                                    <Link href="/our-story">Read Our Story →</Link>
                                </p>
                            </div>
                        </section>
                    </main>
                    );
}
