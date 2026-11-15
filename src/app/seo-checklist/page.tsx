import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoChecklistClient from './SeoChecklistClient';

/* ── Dev-only gate (same pattern as /roadmap and /design-system) ── */
const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'SEO & Google Checklist | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

export default function SeoChecklistPage() {
    if (!IS_DEV) notFound();

    return <SeoChecklistClient />;
}
