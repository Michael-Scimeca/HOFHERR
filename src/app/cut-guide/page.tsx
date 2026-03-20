import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CUT_GUIDE_QUERY } from '@/sanity/queries';
import CutGuideClient from './CutGuideClient';

export const metadata = {
    title: 'Cut Guide — Hofherr Meat Co.',
    description: 'Every cut of beef, pork, chicken, and lamb — what it\'s best for, how to cook it, and pro tips from our butcher Sean.',
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
