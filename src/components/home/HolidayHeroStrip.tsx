'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveHolidayHero, type HolidayHeroConfig } from '@/lib/holidayHero';
import styles from './Hero.module.css';

export default function HolidayHeroStrip() {
    const [holiday, setHoliday] = useState<HolidayHeroConfig | null>(() => getActiveHolidayHero());

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const override = params.get('holiday');
        if (override) {
            setHoliday(getActiveHolidayHero(new Date(), override));
        }
    }, []);

    if (!holiday) return null;

    return (
        <div
            className={`${styles.holidayStrip} ${holiday.accent === 'red' ? styles.holidayStripRed : styles.holidayStripGold}`}
            aria-label={`Seasonal spotlight: ${holiday.guide.name}`}
        >
            <div className={styles.holidayThumb}>
                <Image
                    src={holiday.guide.image}
                    alt={holiday.guide.imageAlt}
                    width={84}
                    height={84}
                    className={styles.holidayThumbImg}
                />
            </div>
            <div className={styles.holidayCopy}>
                <div className={styles.holidayMeta}>
                    <span className={styles.holidaySeasonLabel}>
                        Now Booking · {holiday.guide.name}
                    </span>
                    <span className={styles.holidayLeadTime}>Order {holiday.guide.leadTime}</span>
                </div>
                <p className={styles.holidayOfferings}>
                    {holiday.guide.heroOfferings.join(' · ')}
                </p>
                <div className={styles.holidayActions}>
                    <Link href={holiday.ctaHref} className={styles.holidayCtaLink}>
                        {holiday.ctaLabel}
                    </Link>
                    <Link href="/catering/holidays" className={styles.holidayAllLink}>
                        All Holiday Menus →
                    </Link>
                </div>
            </div>
        </div>
    );
}

