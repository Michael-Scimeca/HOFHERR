import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RoadmapClient from './RoadmapClient';

/* ── Dev-only gate (same pattern as /design-system) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Feature Roadmap | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function RoadmapPage() {
    if (!IS_DEV) notFound();

    return <RoadmapClient />;
}
