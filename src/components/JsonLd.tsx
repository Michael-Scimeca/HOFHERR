/**
 * JsonLd — injects Local Business structured data (JSON-LD) into <head>.
 * Google uses this to power Knowledge Panels, Maps rich results, and more.
 * Two locations: The Butcher Shop (Northfield) + The Depot (Winnetka).
 */
export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            // ── Main Location: The Butcher Shop ───────────────────────────────
            {
                '@type': ['LocalBusiness', 'FoodEstablishment', 'GroceryStore'],
                '@id': 'https://hofherrmeatco.com/#business',
                name: 'Hofherr Meat Co.',
                alternateName: 'Hofherr Meat Company',
                description:
                    'Premium craft butcher shop in Northfield, IL. Family butchering heritage dating to Chicago\'s South Side. Custom cuts, dry-aged USDA prime beef, rotisserie chicken, pig roasts, Chicago Italian beef (as featured on America\'s Test Kitchen), and full-service BBQ catering.',
                url: 'https://hofherrmeatco.com',
                telephone: '+18474416328',
                email: 'butcher@hofherrmeatco.com',
                foundingDate: '2014',
                priceRange: '$$',
                servesCuisine: ['American', 'Butcher Shop', 'BBQ', 'Italian Beef'],
                image: 'https://hofherrmeatco.com/OG/og-image.png',
                logo: 'https://hofherrmeatco.com/assets/logo.png',

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

                hasMap: 'https://maps.google.com/?q=300+Happ+Rd+Northfield+IL',

                sameAs: [
                    'https://www.facebook.com/HofherrMeatCo',
                    'https://www.instagram.com/hofherrmeatco',
                    'https://www.yelp.com/biz/hofherr-meat-co-northfield',
                ],

                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Premium Meat & Butcher Services',
                    itemListElement: [
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Cuts & Steaks' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dry-Aged USDA Prime Beef' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rotisserie Chicken Dinners' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Whole Pig Roasts (50+ guests)' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'BBQ Catering (20–500+ guests)' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gift Cards' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Online Ordering & Curbside Pickup' } },
                    ],
                },
            },

            // ── Second Location: The Depot ────────────────────────────────────
            {
                '@type': ['LocalBusiness', 'FoodEstablishment'],
                '@id': 'https://hofherrmeatco.com/#depot',
                name: 'Hofherr Meat Co. — The Depot',
                alternateName: 'Hofherr The Depot Winnetka',
                description:
                    'The Depot — Hofherr Meat Co.\'s grab-and-go location inside the Winnetka Elm Street Metra Station. Famous for the World\'s Greatest Italian Beef sandwich, served Mon–Fri from 10:30am until sold out.',
                url: 'https://hofherrmeatco.com/visit',
                telephone: '+18474416328',
                email: 'butcher@hofherrmeatco.com',
                image: 'https://hofherrmeatco.com/OG/og-image.png',
                priceRange: '$$',
                servesCuisine: ['Italian Beef', 'American', 'Grab and Go'],
                parentOrganization: { '@id': 'https://hofherrmeatco.com/#business' },

                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '754 Elm St',
                    addressLocality: 'Winnetka',
                    addressRegion: 'IL',
                    postalCode: '60093',
                    addressCountry: 'US',
                },

                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 42.1081,
                    longitude: -87.7362,
                },

                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        opens: '10:30',
                        closes: '18:00',
                    },
                ],

                hasMap: 'https://maps.google.com/?q=754+Elm+St+Winnetka+IL',
            },

            // ── Catering Service ──────────────────────────────────────────────
            {
                '@type': 'Service',
                '@id': 'https://hofherrmeatco.com/#catering',
                name: 'Hofherr Meat Co. BBQ & Event Catering',
                description:
                    'Full-service catering from Hofherr Meat Co. — pig roasts, competition BBQ, rotisserie chicken packages. Serving 20 to 500+ guests across Northfield, Winnetka, and the greater Chicago North Shore.',
                provider: { '@id': 'https://hofherrmeatco.com/#business' },
                areaServed: {
                    '@type': 'GeoCircle',
                    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 42.1003, longitude: -87.7732 },
                    geoRadius: '80000',
                },
                serviceType: ['BBQ Catering', 'Pig Roast', 'Rotisserie Catering', 'Event Catering'],
                url: 'https://hofherrmeatco.com/catering',
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
