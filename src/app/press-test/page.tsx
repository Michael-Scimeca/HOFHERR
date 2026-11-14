import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PressTicker from '@/components/PressTicker';
import styles from './page.module.css';

/* ── Dev-only gate (same as /design-system, /roadmap, /fire-test, /map-test) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Press Ticker | Hofherr Meat Co.',
    description: 'Press coverage ticker with Torch-on-Hover canvas flames.',
    robots: { index: false, follow: false },
};

export default function PressTestPage() {
    if (!IS_DEV) notFound();
    return (
        <main className={styles.page}>
            <header className={styles.srOnly}>
                <h1>Press Coverage — Hofherr Meat Co.</h1>
            </header>
            <PressTicker />
        </main>
    );
}
