import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MapTestClient from './MapTestClient';

/* ── Dev-only gate (same as /design-system, /roadmap, /fire-test) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Map Test | Hofherr Meat Co.',
    description: 'Brand-themed Google Map style test.',
    robots: { index: false, follow: false },
};

export default function MapTestPage() {
    if (!IS_DEV) notFound();
    return <MapTestClient />;
}
