'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';



/* ─── Location data ─── */
const LOCATIONS = [
    {
        id: 'butcher',
        label: 'The Butcher Shop',
        name: 'The Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        lat: 42.1042,
        lng: -87.7715,
        shortAddr: '300 Happ Rd · Northfield, IL 60093',
        phone: '(847) 441-MEAT',
        phoneTel: 'tel:8474416328',
        email: 'butcher@hofherrmeatco.com',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093&travelmode=driving',
        heroImage: '/shops/butcher-shop.jpeg',
        heroAlt: 'Hofherr Meat Co. storefront in Northfield, IL',
        hours: [
            { day: 'Tuesday – Friday', time: '10am – 6pm', open: true },
            { day: 'Saturday', time: '10am – 5pm', open: true },
            { day: 'Sunday', time: '10am – 4pm', open: true },
            { day: 'Monday', time: 'Closed', open: false },
        ],
        curbside: true,
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
        name: 'The Depot',
        address: '780 Elm St, Winnetka, IL 60093',
        lat: 42.1081,
        lng: -87.7359,
        shortAddr: '780 Elm St · Winnetka, IL 60093',
        phone: '(847) 441-MEAT',
        phoneTel: 'tel:8474416328',
        email: 'butcher@hofherrmeatco.com',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=780+Elm+St,+Winnetka,+IL+60093&travelmode=driving',
        heroImage: '/shops/winnetka.png',
        heroAlt: 'The Depot at Winnetka Elm Street Metra Station',
        hours: [
            { day: 'Monday – Friday', time: '10:30am – 6pm', open: true },
            { day: 'Saturday', time: 'Closed', open: false },
            { day: 'Sunday', time: 'Closed', open: false },
        ],
        curbside: false,
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
    const loc = LOCATIONS[active];

    return (
        <main className={styles.page}>

            {/* ── Hero with toggle ── */}
            <section className={styles.hero}>
                <div className={styles.heroImgWrapper}>
                    <img
                        src={loc.heroImage}
                        alt={loc.heroAlt}
                        className={styles.heroImg}
                        data-parallax="inset"
                    />
                </div>



                <div className={styles.heroOverlay} />
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>Visit Us</p>
                    <h1 className={styles.headline}>{loc.name}</h1>
                    <p className={styles.sub}>{loc.shortAddr}</p>

                    {/* Controls row */}
                    <div className={styles.heroControls}>
                        {/* Toggle pills */}
                        <div className={styles.toggleBar}>
                            {LOCATIONS.map((l, i) => (
                                <button
                                    key={l.id}
                                    className={`${styles.toggleBtn} ${i === active ? styles.toggleActive : ''}`}
                                    onClick={() => setActive(i)}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href={`/online-orders?store=${loc.id}`}
                            className={`btn btn-primary ${styles.heroShopBtn}`}
                        >
                            Shop {loc.name}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Location detail ── */}
            <section className={styles.locationSection}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Map */}
                        <div className={styles.mapCol}>
                            <div className={styles.mapWrap}>
                                <iframe
                                    key={loc.id}
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: 12, filter: 'invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.8)' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Map of ${loc.label}`}
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className={styles.infoCol}>
                            <div className={styles.card}>
                                <h3 className={styles.cardTitle}>Store Hours</h3>
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
                                <h3 className={styles.cardTitle}>Contact</h3>
                                <div className={styles.contacts}>
                                    <a href={loc.phoneTel}>📞 {loc.phone}</a>
                                    <a href={`mailto:${loc.email}`}>✉️ {loc.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Photo Gallery ── */}
            <section className={styles.gallery}>
                <div className="container">
                    <span className={styles.galleryEyebrow}>Inside the Shops</span>
                    <h2 className={styles.galleryTitle}>See What Awaits You</h2>
                    <p className={styles.gallerySub}>Butcher shop, charcuterie counter, sandwich shop, event space, and a floor-to-ceiling rotisserie oven — all under one roof.</p>
                    <div className={styles.galleryGrid}>
                        {/* Row 1: Large left + 2 stacked right */}
                        <div className={styles.galleryItemLarge}>
                            <img src="/images/visit/shop-interior.jpg" alt="Inside Hofherr Meat Co." className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>Inside the Northfield butcher shop</div>
                        </div>
                        <div className={styles.galleryItemSmallA}>
                            <img src="/images/visit/sauces-shelf.jpg" alt="Uncle Dougie's BBQ sauces and rubs on the shelf" className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>Uncle Dougie&apos;s sauces &amp; house rubs</div>
                        </div>
                        <div className={styles.galleryItemSmallB}>
                            <img src="/images/visit/hanging-sausages.jpg" alt="House-made sausages hanging to cure" className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>House-cured links &amp; salumi</div>
                        </div>

                        {/* Row 2: Wide panorama */}
                        <div className={styles.galleryItemWide}>
                            <img src="/images/visit/shop-event.jpg" alt="Community tasting event at Hofherr Meat Co." className={styles.galleryImg} data-parallax="inset" style={{ objectPosition: 'center 15%' }} />
                            <div className={styles.galleryCaption}>Community events &amp; tastings at the shop</div>
                        </div>

                        {/* Row 3: 3-up grid */}
                        <div className={styles.galleryItemThird}>
                            <img src="/images/visit/sandwich.jpg" alt="Fresh-sliced roast beef sandwich on artisan bread" className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>Made-to-order deli sandwiches</div>
                        </div>
                        <div className={styles.galleryItemThird}>
                            <img src="/images/visit/rooster-art.jpg" alt="Vintage rooster artwork in the shop" className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>A shop full of character</div>
                        </div>
                        <div className={styles.galleryItemThird}>
                            <img src="/images/visit/steins.jpg" alt="Collectible steins and decor on display" className={styles.galleryImg} data-parallax="inset" />
                            <div className={styles.galleryCaption}>Curated decor &amp; collectibles</div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
