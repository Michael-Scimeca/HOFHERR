import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FireTestClient from './FireTestClient';

/* ── Dev-only gate (same as /design-system, /roadmap, /showcase) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Fire Test | Hofherr Meat Co.',
    description: 'Volumetric fire + ember flare test.',
    robots: { index: false, follow: false },
};

export default function FireTestPage() {
    if (!IS_DEV) notFound();
    return <FireTestClient />;
}
