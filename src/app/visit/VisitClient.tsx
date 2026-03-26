'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import CustomMap from '@/components/shared/CustomMap';

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
        textLink: 'sms:8474416328&body=Hi%20Hofherr!%20I%20had%20a%20question%20about%20',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093&travelmode=driving',
        heroImage: '/assets/shop-exterior.jpg',
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
        textLink: null,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=780+Elm+St,+Winnetka,+IL+60093&travelmode=driving',
        heroImage: '/assets/store-depot.jpg',
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
            <section className={styles.hero} key={loc.id + '-hero'}>
                <Image
                    src={loc.heroImage}
                    alt={loc.heroAlt}
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                    sizes="100vw"
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>Visit Us</p>
                    <h1 className={styles.headline}>{loc.name}</h1>
                    <p className={styles.sub}>{loc.shortAddr}</p>

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
                                <CustomMap
                                    key={loc.id}
                                    lat={loc.lat}
                                    lng={loc.lng}
                                    label={loc.label}
                                    address={loc.address}
                                    height="100%"
                                    iconType={loc.iconType}
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
                                    {loc.textLink && <a href={loc.textLink}>💬 Text us</a>}
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
                        <div className={styles.galleryItemLarge}>
                            <Image src="/assets/shop-exterior.jpg" alt="Hofherr Meat Co. storefront" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 55vw" data-parallax="inset" />
                            <div className={styles.galleryCaption}>Our Northfield storefront</div>
                        </div>
                        <div className={styles.galleryItemSmallA}>
                            <Image src="/assets/shop-interior.jpg" alt="The butcher display case" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 42vw" data-parallax="inset" />
                            <div className={styles.galleryCaption}>Hand-selected cuts daily</div>
                        </div>
                        <div className={styles.galleryItemSmallB}>
                            <Image src="/assets/rotisserie-chickens.jpg" alt="Rotisserie chickens in the oven" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 42vw" data-parallax="inset" />
                            <div className={styles.galleryCaption}>Floor-to-ceiling rotisserie oven</div>
                        </div>
                        <div className={styles.galleryItemWide}>
                            <Image src="/assets/shop-interior.jpg" alt="Shop interior" fill style={{ objectFit: 'cover' }} sizes="100vw" data-parallax="inset" />
                            <div className={styles.galleryCaption}>A butcher shop that feels like home</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
