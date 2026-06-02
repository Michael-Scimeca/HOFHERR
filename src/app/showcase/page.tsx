import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShowcaseClient from './ShowcaseClient';

/* ── Dev-only gate (same as /design-system and /roadmap) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Platform Showcase | Hofherr Meat Co.',
    description: 'A complete overview of the Hofherr Meat Co. digital platform — current features and growth opportunities.',
    robots: { index: false, follow: false },
};

export default function ShowcasePage() {
    if (!IS_DEV) notFound();

    return <ShowcaseClient />;
}
