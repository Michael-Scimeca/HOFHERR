import { DEFAULT_SETTINGS, type SiteSettings, type StoreHourEntry } from '@/context/SiteSettingsContext';

const KEYPAD_MAP: Record<string, string> = {
    A: '2', B: '2', C: '2',
    D: '3', E: '3', F: '3',
    G: '4', H: '4', I: '4',
    J: '5', K: '5', L: '5',
    M: '6', N: '6', O: '6',
    P: '7', Q: '7', R: '7', S: '7',
    T: '8', U: '8', V: '8',
    W: '9', X: '9', Y: '9', Z: '9',
};

function toE164Phone(raw?: string): string {
    const source = raw || '+1-847-441-6328';
    const digits = source
        .toUpperCase()
        .replace(/[A-Z]/g, (ch) => KEYPAD_MAP[ch] ?? '')
        .replace(/\D/g, '');

    if (digits.length === 10) {
        return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return '+1-847-441-6328';
}

function to24Hour(raw?: string): string | null {
    if (!raw) return null;
    const trimmed = raw.trim();
    const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (match12) {
        let hours = Number(match12[1]);
        const minutes = match12[2] ?? '00';
        const period = match12[3].toUpperCase();
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        return `${match24[1].padStart(2, '0')}:${match24[2]}`;
    }
    return null;
}

function buildOpeningHours(entries: StoreHourEntry[]) {
    const grouped = new Map<string, { days: string[]; opens: string; closes: string }>();

    for (const entry of entries) {
        if (entry.isClosed) continue;
        const opens = to24Hour(entry.open);
        const closes = to24Hour(entry.close);
        if (!opens || !closes || !entry.day) continue;

        const key = `${opens}-${closes}`;
        const existing = grouped.get(key);
        if (existing) {
            existing.days.push(entry.day);
        } else {
            grouped.set(key, { days: [entry.day], opens, closes });
        }
    }

    return Array.from(grouped.values()).map(({ days, opens, closes }) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.length === 1 ? days[0] : days,
        opens,
        closes,
    }));
}

type JsonLdProps = {
    settings?: SiteSettings;
};

/**
 * JsonLd — injects Organization, multi-location LocalBusiness, Catering Service,
 * and WebSite structured data (JSON-LD) synced with Sanity CMS settings.
 * Powers Google Search site name, Knowledge Panel entity facts, and Multi-Location rich results.
 */
export default function JsonLd({ settings = DEFAULT_SETTINGS }: JsonLdProps) {
    const shopName = settings.shopName || DEFAULT_SETTINGS.shopName;
    const phoneE164 = toE164Phone(settings.phone);
    const email = settings.email || DEFAULT_SETTINGS.email;
    const addr = settings.address ?? DEFAULT_SETTINGS.address ?? {
        street: '300 Happ Rd',
        city: 'Northfield',
        state: 'IL',
        zip: '60093',
    };

    const sameAs = [
        settings.instagram || DEFAULT_SETTINGS.instagram,
        settings.facebook || DEFAULT_SETTINGS.facebook,
        settings.yelp || DEFAULT_SETTINGS.yelp,
    ].filter((url): url is string => Boolean(url && url.startsWith('http')));

    const butcherOpeningHours = buildOpeningHours(
        settings.butcherHours?.length ? settings.butcherHours : DEFAULT_SETTINGS.butcherHours
    );
    const depotOpeningHours = buildOpeningHours(
        settings.depotHours?.length ? settings.depotHours : DEFAULT_SETTINGS.depotHours
    );

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            // ── Parent Brand Entity (powers Knowledge Panel facts: Founder, Founded, HQ, Customer Service) ──
            {
                '@type': 'Organization',
                '@id': 'https://hofherrmeatco.com/#organization',
                name: shopName,
                legalName: 'Hofherr Meat Company',
                alternateName: ['Hofherr Meat Company', "Hofherr's Meats Co."],
                url: 'https://hofherrmeatco.com',
                description:
                    "North Shore Chicago's premier craft butcher shop and BBQ catering company, carrying forward a family butchering tradition rooted in early-1900s Chicago's South Side.",
                foundingDate: '2014-03',
                foundingLocation: {
                    '@type': 'Place',
                    name: 'Northfield, IL',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Northfield',
                        addressRegion: 'IL',
                        addressCountry: 'US',
                    },
                },
                founder: {
                    '@type': 'Person',
                    '@id': 'https://hofherrmeatco.com/#founder',
                    name: 'Sean Hofherr',
                    jobTitle: 'Founder & Master Butcher',
                    url: 'https://hofherrmeatco.com/our-story#founder',
                },
                logo: {
                    '@type': 'ImageObject',
                    '@id': 'https://hofherrmeatco.com/#logo',
                    url: 'https://hofherrmeatco.com/icon.png',
                    contentUrl: 'https://hofherrmeatco.com/icon.png',
                    width: 512,
                    height: 512,
                    caption: shopName,
                },
                image: [
                    'https://hofherrmeatco.com/images/visit/northfield-storefront-front.jpg',
                    'https://hofherrmeatco.com/assets/shop-interior.jpg',
                    'https://hofherrmeatco.com/OG/og-home.jpg',
                ],
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: addr.street,
                    addressLocality: addr.city,
                    addressRegion: addr.state,
                    postalCode: addr.zip,
                    addressCountry: 'US',
                },
                telephone: phoneE164,
                email,
                contactPoint: [
                    {
                        '@type': 'ContactPoint',
                        telephone: phoneE164,
                        email,
                        contactType: 'customer service',
                        areaServed: 'US',
                        availableLanguage: ['English'],
                    },
                    {
                        '@type': 'ContactPoint',
                        telephone: phoneE164,
                        email,
                        contactType: 'reservations',
                        url: 'https://hofherrmeatco.com/catering',
                        areaServed: 'US',
                        availableLanguage: ['English'],
                    },
                ],
                sameAs,
                subOrganization: [
                    { '@id': 'https://hofherrmeatco.com/#business' },
                    { '@id': 'https://hofherrmeatco.com/#depot' },
                ],
                department: [
                    { '@id': 'https://hofherrmeatco.com/#business' },
                    { '@id': 'https://hofherrmeatco.com/#depot' },
                ],
            },

            // ── Location A: The Butcher Shop (Northfield, IL) ──────────────────
            {
                '@type': ['LocalBusiness', 'FoodEstablishment', 'GroceryStore'],
                '@id': 'https://hofherrmeatco.com/#business',
                name: shopName,
                alternateName: 'Hofherr Meat Co. — The Butcher Shop',
                branchCode: 'northfield',
                parentOrganization: { '@id': 'https://hofherrmeatco.com/#organization' },
                description:
                    "Full-service craft butcher shop in Northfield, IL offering cut-to-order USDA Prime & dry-aged steaks, housemade sausages, pasture-raised rotisserie chicken, deli sandwiches, prepared foods, and full-service BBQ catering.",
                url: 'https://hofherrmeatco.com',
                telephone: phoneE164,
                email,
                priceRange: '$$',
                currenciesAccepted: 'USD',
                paymentAccepted: 'Cash, Credit Card, Debit Card, Apple Pay, Google Pay',
                servesCuisine: ['American', 'Barbecue', 'Butcher Shop', 'Italian Beef', 'Deli'],
                logo: { '@id': 'https://hofherrmeatco.com/#logo' },
                image: [
                    'https://hofherrmeatco.com/images/visit/northfield-storefront-front.jpg',
                    'https://hofherrmeatco.com/images/visit/northfield-butcher-shop-signage.jpg',
                    'https://hofherrmeatco.com/assets/shop-interior.jpg',
                    'https://hofherrmeatco.com/OG/og-home.jpg',
                ],
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: addr.street,
                    addressLocality: addr.city,
                    addressRegion: addr.state,
                    postalCode: addr.zip,
                    addressCountry: 'US',
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 42.1042,
                    longitude: -87.7715,
                },
                openingHoursSpecification: butcherOpeningHours,
                hasMap: 'https://www.google.com/maps/search/?api=1&query=Hofherr+Meat+Co.+300+Happ+Rd+Northfield+IL+60093',
                hasMenu: 'https://hofherrmeatco.com/online-orders?store=butcher',
                sameAs,
                amenityFeature: [
                    { '@type': 'LocationFeatureSpecification', name: 'In-store shopping', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'In-store pickup', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Curbside pickup', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
                ],
                potentialAction: {
                    '@type': 'OrderAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://hofherrmeatco.com/online-orders?store=butcher',
                        inLanguage: 'en-US',
                        actionPlatform: [
                            'http://schema.org/DesktopWebPlatform',
                            'http://schema.org/IOSPlatform',
                            'http://schema.org/AndroidPlatform',
                        ],
                    },
                    deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
                },
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Premium Meat & Butcher Services',
                    itemListElement: [
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Cuts & USDA Prime Steaks' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dry-Aged Beef & Housemade Sausages' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pasture-Raised Rotisserie Chicken Dinners' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Whole Pig Roasts (50+ guests)' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Full-Service BBQ Catering (20–500+ guests)' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gift Cards' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Online Ordering & Curbside Pickup' } },
                    ],
                },
            },

            // ── Location B: The Depot (Winnetka Elm St. Metra Station) ─────────
            {
                '@type': ['LocalBusiness', 'FoodEstablishment'],
                '@id': 'https://hofherrmeatco.com/#depot',
                name: 'Hofherr Meat Co. — The Depot',
                alternateName: 'Hofherr The Depot Winnetka',
                branchCode: 'winnetka-depot',
                parentOrganization: { '@id': 'https://hofherrmeatco.com/#organization' },
                description:
                    "Hofherr Meat Co.'s second location inside the historic Winnetka Elm Street Metra Station. Home of our acclaimed Chicago Italian Beef sandwich (featured on America's Test Kitchen's Proof podcast), hot lunch specials, and grab-and-go butcher cuts.",
                url: 'https://hofherrmeatco.com/visit#depot',
                telephone: phoneE164,
                email,
                priceRange: '$$',
                currenciesAccepted: 'USD',
                paymentAccepted: 'Credit Card, Debit Card, Apple Pay, Google Pay',
                servesCuisine: ['Italian Beef', 'Sandwiches', 'American', 'Grab and Go'],
                logo: { '@id': 'https://hofherrmeatco.com/#logo' },
                image: [
                    'https://hofherrmeatco.com/images/visit/winnetka-depot-red-awning.jpg',
                    'https://hofherrmeatco.com/shops/winnetka.png',
                    'https://hofherrmeatco.com/assets/italian-beef.jpg',
                ],
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
                    longitude: -87.7359,
                },
                openingHoursSpecification: depotOpeningHours,
                hasMap: 'https://www.google.com/maps/search/?api=1&query=Hofherr+Meat+Co.+The+Depot+754+Elm+St+Winnetka+IL+60093',
                hasMenu: 'https://hofherrmeatco.com/online-orders?store=depot',
                sameAs,
                amenityFeature: [
                    { '@type': 'LocationFeatureSpecification', name: 'In-store pickup', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Takeout', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Free street & Metra commuter parking', value: true },
                ],
                potentialAction: {
                    '@type': 'OrderAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://hofherrmeatco.com/online-orders?store=depot',
                        inLanguage: 'en-US',
                        actionPlatform: [
                            'http://schema.org/DesktopWebPlatform',
                            'http://schema.org/IOSPlatform',
                            'http://schema.org/AndroidPlatform',
                        ],
                    },
                    deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
                },
            },

            // ── Catering Service ───────────────────────────────────────────────
            {
                '@type': 'Service',
                '@id': 'https://hofherrmeatco.com/#catering',
                name: 'Hofherr Meat Co. BBQ & Event Catering',
                description:
                    'Full-service catering from Hofherr Meat Co. — whole-hog pig roasts, competition white-oak smoked BBQ, and rotisserie packages serving 20 to 500+ guests across Northfield, Winnetka, and Chicagoland.',
                provider: { '@id': 'https://hofherrmeatco.com/#organization' },
                areaServed: {
                    '@type': 'GeoCircle',
                    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 42.1042, longitude: -87.7715 },
                    geoRadius: '80000',
                },
                serviceType: ['BBQ Catering', 'Whole Pig Roast', 'Rotisserie Catering', 'Corporate & Private Event Catering'],
                url: 'https://hofherrmeatco.com/catering',
            },

            // ── WebSite (powers Google Search site name header) ────────────────
            {
                '@type': 'WebSite',
                '@id': 'https://hofherrmeatco.com/#website',
                url: 'https://hofherrmeatco.com',
                name: shopName,
                alternateName: 'Hofherr Meat Company',
                inLanguage: 'en-US',
                publisher: { '@id': 'https://hofherrmeatco.com/#organization' },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
    );
}
