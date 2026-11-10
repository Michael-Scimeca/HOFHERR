import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderTrackerClient from './OrderTrackerClient';

/* ── Dev-only gate (same as /fire-test, /design-system, /roadmap) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Order Tracker Test | Hofherr Meat Co.',
    description: 'Prototype of a live pickup-order tracker.',
    robots: { index: false, follow: false },
};

export default function OrderTrackerTestPage() {
    if (!IS_DEV) notFound();
    return <OrderTrackerClient />;
}
