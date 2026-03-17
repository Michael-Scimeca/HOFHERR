import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CATEGORIES_QUERY } from '@/sanity/queries';
import CustomOrdersPage from './OnlineOrdersClient';

export default async function OnlineOrdersPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let sanityButcher = [];
    let sanityDepot = [];

    try {
        [sanityButcher, sanityDepot] = await Promise.all([
            sanityClient.fetch(CATEGORIES_QUERY, { store: 'butcher' }),
            sanityClient.fetch(CATEGORIES_QUERY, { store: 'depot' }),
        ]);
    } catch (e) {
        console.warn('Sanity fetch failed, using fallback data:', e);
    }

    return (
        <Suspense fallback={null}>
            <CustomOrdersPage
                sanityButcher={sanityButcher}
                sanityDepot={sanityDepot}
            />
        </Suspense>
    );
}
