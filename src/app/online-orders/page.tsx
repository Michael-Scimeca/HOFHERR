import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CATEGORIES_QUERY } from '@/sanity/queries';
import CustomOrdersPage from './OnlineOrdersClient';

const DESIGN_SYSTEM_ICONS: Record<string, string> = {
    beef: '/icons/cow.svg',
    pork: '/icons/pig.svg',
    chicken: '/icons/chicken.svg',
    sausage: '/icons/suage.svg',
    deli: '/icons/hamcheese.svg',
    prepared: '/icons/prepared.svg',
    lamb: '/icons/lamb.svg',
    seafood: '/icons/fish.svg',
    veal: '/icons/veal.svg',
    turkey: '/icons/turkey.svg',
    duck: '/icons/duck.svg',
    game: '/icons/game.svg',
    soups: '/icons/stocksoup.svg',
    'soups-stocks': '/icons/stocksoup.svg',
    catering: '/icons/catering.svg',
    pastries: '/icons/pastries.svg',
    'hot-beverages': '/icons/hotbeverage.svg',
    'grab-go': '/icons/grabgo.svg',
    produce: '/icons/produce.svg',
    dairy: '/icons/dairy.svg',
    cheese: '/icons/cheese.svg',
    pantry: '/icons/pantry.svg',
    bread: '/icons/bread.svg',
    beverages: '/icons/coldbeverage.svg',
    swag: '/icons/swag.svg',
    festival: '/icons/festival.svg',
};

function applyDesignSystemIcons<T extends { id?: string; icon?: string }>(categories: T[]): T[] {
    return categories.map(cat => ({
        ...cat,
        icon: (cat.id && DESIGN_SYSTEM_ICONS[cat.id]) || cat.icon,
    }));
}

export default async function OnlineOrdersPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let sanityButcher = [];
    let sanityDepot = [];

    try {
        [sanityButcher, sanityDepot] = await Promise.all([
            sanityClient.fetch(CATEGORIES_QUERY, { store: 'butcher' }, preview ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['categories'] } }),
            sanityClient.fetch(CATEGORIES_QUERY, { store: 'depot' }, preview ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['categories'] } }),
        ]);
    } catch (e) {
        console.warn('Sanity fetch failed, using fallback data:', e);
    }

    return (
        <Suspense fallback={<div className="route-loading" aria-busy="true" />}>
            <CustomOrdersPage
                sanityButcher={applyDesignSystemIcons(sanityButcher)}
                sanityDepot={applyDesignSystemIcons(sanityDepot)}
            />
        </Suspense>
    );
}
