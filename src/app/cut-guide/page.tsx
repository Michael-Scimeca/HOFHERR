import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CUT_GUIDE_QUERY } from '@/sanity/queries';
import CutGuideClient from './CutGuideClient';

export const metadata = {
    title: 'Cut Guide — Hofherr Meat Co. | Beef, Pork, Chicken & Lamb Cuts',
    description: 'Every cut of beef, pork, chicken, and lamb — what it\'s best for, how to cook it, and pro tips from our butcher Sean.',
    alternates: { canonical: 'https://hofherrmeatco.com/cut-guide' },
    openGraph: {
        title: 'Cut Guide | Hofherr Meat Co.',
        description: 'Every cut explained — what it\'s best for, how to cook it, and pro tips from butcher Sean Hofherr.',
        url: 'https://hofherrmeatco.com/cut-guide',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Cut Guide — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cut Guide | Hofherr Meat Co.',
        description: 'Beef, pork, chicken & lamb — every cut explained with cooking tips from our butcher.',
    },
};

type SanityCut = {
    _id: string;
    name: string;
    animal: string;
    subcut: string | null;
    bestFor: string | null;
    cookingMethod: string | null;
    tip: string | null;
    image: string | null;
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
