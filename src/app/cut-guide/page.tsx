import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CUT_GUIDE_QUERY } from '@/sanity/queries';
import CutGuideClient, { type SanityCut } from './CutGuideClient';

export const metadata: Metadata = {
    title: 'Cut Guide — Hofherr Meat Co. | Beef, Pork, Poultry, Lamb & Wild Game',
    description:
        "Every cut of beef, pork, poultry, lamb, and wild game — what it's best for, how to cook it, and pro tips straight from master butcher Sean Hofherr.",
    alternates: { canonical: 'https://hofherrmeatco.com/cut-guide' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'The Cut Guide | Hofherr Meat Co.',
        description:
            "Every cut explained — what it's best for, how to cook it, and pro tips straight from master butcher Sean Hofherr.",
        url: 'https://hofherrmeatco.com/cut-guide',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'The Cut Guide — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Cut Guide | Hofherr Meat Co.',
        description: 'Beef, pork, poultry, lamb & wild game — every cut explained with cooking tips from Sean Hofherr.',
    },
};

export default async function CutGuidePage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let cuts: SanityCut[] = [];
    try {
        cuts = await sanityClient.fetch(CUT_GUIDE_QUERY);
    } catch {
        // Falls back to hardcoded data in client component
    }

    return <CutGuideClient sanityCuts={cuts} />;
}
