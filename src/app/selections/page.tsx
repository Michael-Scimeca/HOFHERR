import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CUT_GUIDE_QUERY } from '@/sanity/queries';
import CutGuideClient, { type SanityCut } from '../cut-guide/CutGuideClient';
import SelectionsClient from './SelectionsClient';

export const metadata: Metadata = {
    title: 'Our Selections & Butcher Boards — Hofherr Meat Co. | Northfield & Winnetka, IL',
    description:
        'Explore Hofherr Meat Co. selections: 100% vegetarian-fed, hormone- and antibiotic-free Midwest beef, heritage pork, pasture poultry, lamb, exotic game, 18+ housemade sausages, 6 signature sandwiches, 24-hour bone broths, prepared meals, and BBQ supplies.',
    alternates: { canonical: 'https://hofherrmeatco.com/selections' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Our Selections & Butcher Boards | Hofherr Meat Co.',
        description:
            'Custom-cut prime & dry-aged beef, heritage pork, pasture poultry, lamb, exotic game, house charcuterie, 6 signature sandwiches, and scratch soups.',
        url: 'https://hofherrmeatco.com/selections',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Selections — Hofherr Meat Co.' }],
    },
};

export default async function SelectionsPage() {
    const { isEnabled: preview } = await draftMode();
    let cuts: SanityCut[] = [];
    try {
        cuts = await getClient(preview).fetch(CUT_GUIDE_QUERY);
    } catch {
        // Falls back to hardcoded data in the client component
    }
    return <SelectionsClient cutGuide={<CutGuideClient sanityCuts={cuts} embedded />} />;
}

