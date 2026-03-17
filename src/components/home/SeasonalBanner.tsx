'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './SeasonalBanner.module.css';

const DEADLINE = new Date('2026-03-14T23:59:59');

function useCountdown(target: Date) {
    const calc = () => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            mins: Math.floor((diff % 3600000) / 60000),
            secs: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        setTime(calc());
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function SeasonalBanner() {
    const { days, hours, mins, secs } = useCountdown(DEADLINE);
    const expired = days === 0 && hours === 0 && mins === 0 && secs === 0;

    if (expired) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.overlay} />
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <div className={styles.season}>🍀 St. Patrick&apos;s Day</div>
                    <h2 className={styles.title}>Pot O&apos; Gold Dinners<br /><em>Pre-Orders Open</em></h2>
                    <p className={styles.sub}>HMCo. Boiled Corned Beef, Red Taters, Best Cabbage Ever, and more! Pre-orders open now — hot n ready to serve 4 adults.</p>
                    <div className={styles.actions}>
                        <Link href="/specials" className="btn btn-primary">Pre-Order Now</Link>
                        <Link href="/specials" className="btn btn-secondary">See Full Menu</Link>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.countdown}>
                        <div className={styles.countUnit}>
                            <span className={styles.countNum}>{pad(days)}</span>
                            <span className={styles.countLabel}>Days</span>
                        </div>
                        <div className={styles.countSep}>:</div>
                        <div className={styles.countUnit}>
                            <span className={styles.countNum}>{pad(hours)}</span>
                            <span className={styles.countLabel}>Hours</span>
                        </div>
                        <div className={styles.countSep}>:</div>
                        <div className={styles.countUnit}>
                            <span className={styles.countNum}>{pad(mins)}</span>
                            <span className={styles.countLabel}>Mins</span>
                        </div>
                        <div className={styles.countSep}>:</div>
                        <div className={styles.countUnit}>
                            <span className={styles.countNum}>{pad(secs)}</span>
                            <span className={styles.countLabel}>Secs</span>
                        </div>
                    </div>
                    <div className={styles.deadline}>Hot & Ready for 3/14, 3/15, and 3/17</div>
                </div>
            </div>
        </div>
    );
}
