/**
 * JsonLd — injects Local Business structured data (JSON-LD) into <head>.
 * Google uses this to power Knowledge Panels, Maps rich results, and more.
 */
export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            // ── Local Business ────────────────────────────────────────────────
            {
                '@type': ['LocalBusiness', 'FoodEstablishment', 'GroceryStore'],
                '@id': 'https://hofherrmeatco.com/#business',
                name: 'Hofherr Meat Co.',
                alternateName: 'Hofherr Meat Company',
                description:
                    'Premium craft butcher shop in Northfield, IL. Family butchering heritage dating to Chicago\'s South Side. Custom cuts, rotisserie chicken, pig roasts, Chicago Italian beef (as featured on America\'s Test Kitchen), and full-service BBQ catering.',
                url: 'https://hofherrmeatco.com',
                telephone: '+18474416328',
                email: 'butcher@hofherrmeatco.com',
                foundingDate: '2014',
                priceRange: '$$',
                servesCuisine: ['American', 'Butcher Shop'],
                image: 'https://hofherrmeatco.com/og-image.png',
                logo: 'https://hofherrmeatco.com/logo.png',

                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '300 Happ Rd',
                    addressLocality: 'Northfield',
                    addressRegion: 'IL',
                    postalCode: '60093',
                    addressCountry: 'US',
                },

                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 42.1003,
                    longitude: -87.7732,
                },

                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        opens: '10:00',
                        closes: '18:00',
                    },
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: 'Saturday',
                        opens: '10:00',
                        closes: '17:00',
                    },
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: 'Sunday',
                        opens: '10:00',
                        closes: '16:00',
                    },
                ],

                sameAs: [
                    'https://www.facebook.com/HofherrMeatCo',
                    'https://www.instagram.com/hofherrmeatco',
                    'https://twitter.com/HofherrMeatCo',
                    'https://www.yelp.com/biz/hofherr-meat-co-northfield',
                ],

                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Premium Meat & Butcher Services',
                    itemListElement: [
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Cuts & Steaks' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dry-Aged USDA Prime Beef' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rotisserie Chicken' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pig Roasts' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Chicago Italian Beef (Depot Location)' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Catering Services' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Online Ordering & Curbside Pickup' } },
                    ],
                },
            },

            // ── Website ───────────────────────────────────────────────────────
            {
                '@type': 'WebSite',
                '@id': 'https://hofherrmeatco.com/#website',
                url: 'https://hofherrmeatco.com',
                name: 'Hofherr Meat Co.',
                publisher: { '@id': 'https://hofherrmeatco.com/#business' },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://hofherrmeatco.com/?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                },
            },

            // ── Breadcrumb (home) ─────────────────────────────────────────────
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://hofherrmeatco.com/#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://hofherrmeatco.com',
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
    );
}
