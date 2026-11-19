import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { CATEGORIES_QUERY } from '@/sanity/queries';
import CustomOrdersPage from './OnlineOrdersClient';
import { toProductSlug } from './storefrontData';

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

    const allCategories = [...(Array.isArray(sanityButcher) ? sanityButcher : []), ...(Array.isArray(sanityDepot) ? sanityDepot : [])];
    const productSchemaItems = allCategories.flatMap((cat: { items?: { name?: string; price?: string; desc?: string; stockStatus?: string }[] }) =>
        (cat.items ?? []).map((item) => {
            const priceMatch = typeof item.price === 'string' ? item.price.match(/(\d+(?:\.\d+)?)/) : null;
            const slug = item.name ? toProductSlug(item.name) : '';
            return {
                '@type': 'Product',
                name: item.name,
                description: item.desc || `${item.name} — cut to order at Hofherr Meat Co., Northfield IL.`,
                url: `https://hofherrmeatco.com/online-orders?item=${slug}`,
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    ...(priceMatch ? { price: priceMatch[1] } : {}),
                    availability:
                        item.stockStatus === 'out_of_stock'
                            ? 'https://schema.org/OutOfStock'
                            : 'https://schema.org/InStock',
                },
            };
        })
    ).slice(0, 80);

    const catalogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Hofherr Meat Co. Online Butcher & Depot Menu',
        itemListElement: productSchemaItems.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: product,
        })),
    };

    return (
        <>
            {productSchemaItems.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(catalogJsonLd).replace(/</g, '\\u003c'),
                    }}
                />
            )}
            <Suspense fallback={<div className="route-loading" aria-busy="true" />}>
                <CustomOrdersPage
                    sanityButcher={applyDesignSystemIcons(sanityButcher)}
                    sanityDepot={applyDesignSystemIcons(sanityDepot)}
                />
            </Suspense>
        </>
    );
}
