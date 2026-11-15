import type { SiteSettings, StoreHourEntry } from '@/context/SiteSettingsContext';

export type LocationId = 'butcher' | 'depot';
export type RightRailMode = 'organization' | LocationId;
export type SnippetMode = 'enhanced' | 'legacy';
export type GbpTabId = 'overview' | 'reviews' | 'photos';

export type LocationReview = {
    id: string;
    author: string;
    initial: string;
    timeAgo: string;
    quote: string;
};

export type LocationPhoto = {
    src: string;
    alt: string;
};

export type SerpLocationConfig = {
    id: LocationId;
    letter: 'A' | 'B';
    schemaId: string;
    shortMapTitle: string;
    shortMapSub: string;
    serpTitle: string;
    gbpTitle: string;
    categoryLabel: string;
    distanceLabel: string;
    streetShort: string;
    fullAddress: string;
    directionsUrl: string;
    websitePath: string;
    rating: string;
    reviewCount: number;
    reviewerInitial: string;
    featuredQuote: string;
    weeklySummaryLabel: string;
    serviceOptions: string;
    editorialBlurb: string;
    heroPhotos: [LocationPhoto, LocationPhoto];
    galleryPhotos: LocationPhoto[];
    reviews: LocationReview[];
};

export type SerpSitelink = {
    title: string;
    href: string;
    snippet: string;
};

export type SchemaEntitySummary = {
    id: string;
    title: string;
    schemaType: string;
    description: string;
};

export const SERP_LOCATIONS: Record<LocationId, SerpLocationConfig> = {
    butcher: {
        id: 'butcher',
        letter: 'A',
        schemaId: 'https://hofherrmeatco.com/#business',
        shortMapTitle: 'Hofherr Meat Co.',
        shortMapSub: '300 Happ Rd · Butcher Shop',
        serpTitle: 'Hofherr Meat Co.',
        gbpTitle: 'Hofherr Meat Co.',
        categoryLabel: 'Butcher shop',
        distanceLabel: '0.4 mi',
        streetShort: '300 Happ Rd',
        fullAddress: '300 Happ Rd, Northfield, IL 60093',
        directionsUrl:
            'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd+Northfield+IL+60093',
        websitePath: '/visit#butcher',
        rating: '4.9',
        reviewCount: 186,
        reviewerInitial: 'M',
        featuredQuote:
            '"Best dry-aged prime ribeye, housemade sausages, and custom butcher counter on the North Shore."',
        weeklySummaryLabel: 'Tue–Fri 10 AM–6 PM · Sat 10 AM–5 PM · Sun 10 AM–4 PM · Closed Mon',
        serviceOptions: 'In-store shopping · Curbside pickup · Custom butcher cuts',
        editorialBlurb:
            'Whole-animal craft butcher shop cutting USDA Prime & dry-aged steaks, heritage pork, housemade sausages, Thursday rotisserie chicken, and BBQ catering.',
        heroPhotos: [
            {
                src: '/images/visit/northfield-butcher-shop-signage.jpg',
                alt: 'Hofherr Meat Co. Northfield butcher shop exterior signage on Happ Road',
            },
            {
                src: '/assets/press/arielle-hofherr-northfield-butcher-counter.webp',
                alt: 'Co-owner Arielle Hofherr behind the Northfield custom butcher counter',
            },
        ],
        galleryPhotos: [
            {
                src: '/images/visit/northfield-storefront-front.jpg',
                alt: 'Hofherr Meat Co. storefront at 300 Happ Rd in Northfield',
            },
            {
                src: '/assets/press/arielle-hofherr-northfield-butcher-counter.webp',
                alt: 'Fresh butcher case and specialty provisions in Northfield',
            },
            {
                src: '/assets/press/sean-and-arielle-hofherr-northfield-shop.webp',
                alt: 'Sean and Arielle Hofherr inside the Northfield butcher shop',
            },
            {
                src: '/assets/press/hofherr-stay-smoking-bbq-smoker.webp',
                alt: 'Hofherr Stay Smoking offset BBQ smoker outside the shop',
            },
        ],
        reviews: [
            {
                id: 'nf-1',
                author: 'Mark R.',
                initial: 'M',
                timeAgo: '2 weeks ago',
                quote: 'Best dry-aged prime ribeye and housemade sausages on the North Shore. Sean and the butchers trim everything to order.',
            },
            {
                id: 'nf-2',
                author: 'Claire W.',
                initial: 'C',
                timeAgo: '1 month ago',
                quote: 'Thursday rotisserie chickens and holiday standing rib roasts are unbeatable. Friendly neighborhood crew every single visit.',
            },
        ],
    },
    depot: {
        id: 'depot',
        letter: 'B',
        schemaId: 'https://hofherrmeatco.com/#depot',
        shortMapTitle: 'The Depot',
        shortMapSub: '754 Elm St · Winnetka Metra',
        serpTitle: 'Hofherr Meat Co. — The Depot',
        gbpTitle: 'Hofherr Meat Co. — The Depot',
        categoryLabel: 'Sandwich & hot lunch shop',
        distanceLabel: '2.1 mi',
        streetShort: '754 Elm St',
        fullAddress: '754 Elm St, Winnetka, IL 60093',
        directionsUrl:
            'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St+Winnetka+IL+60093',
        websitePath: '/visit#depot',
        rating: '4.9',
        reviewCount: 64,
        reviewerInitial: 'D',
        featuredQuote:
            '"Right inside the Winnetka Metra station — incredible dipped Italian beef and hot weekday lunches."',
        weeklySummaryLabel: 'Mon–Fri 10:30 AM–6 PM · Closed Sat–Sun',
        serviceOptions: 'Takeout · Commuter grab-and-go · Hot dipped Italian beef',
        editorialBlurb:
            'Hofherr Meat Co.’s weekday commuter counter inside the historic Winnetka UP-N Metra station serving slow-roasted Italian beef, butcher sandwiches, soups, and espresso.',
        heroPhotos: [
            {
                src: '/images/visit/winnetka-depot-red-awning.jpg',
                alt: 'Hofherr Meat Co. The Depot red awning at 754 Elm St Winnetka Metra station',
            },
            {
                src: '/assets/italian-beef.jpg',
                alt: 'Hot dipped Chicago Italian beef sandwich with giardiniera from The Depot',
            },
        ],
        galleryPhotos: [
            {
                src: '/images/visit/winnetka-depot-red-awning.jpg',
                alt: 'The Depot exterior at 754 Elm St in Winnetka',
            },
            {
                src: '/assets/italian-beef.jpg',
                alt: 'House-roasted Italian beef sandwich dipped in jus',
            },
            {
                src: '/assets/specials-bbq.jpg',
                alt: 'Smoked meats and hot daily specials prepared by Hofherr Meat Co.',
            },
            {
                src: '/assets/shop-interior.jpg',
                alt: 'Hofherr Meat Co. craft butcher & provisions counter',
            },
        ],
        reviews: [
            {
                id: 'dp-1',
                author: 'Dan K.',
                initial: 'D',
                timeAgo: '1 week ago',
                quote: 'Right inside the Winnetka Metra station — the dipped Italian beef with hot giardiniera rivals any beef stand in Chicago.',
            },
            {
                id: 'dp-2',
                author: 'Lauren S.',
                initial: 'L',
                timeAgo: '3 weeks ago',
                quote: 'Fast weekday lunch pickup right off Elm Street. Housemade soups and roast turkey sandwiches are always spot on.',
            },
        ],
    },
};

export const SERP_SITELINKS: SerpSitelink[] = [
    {
        title: 'Custom Cuts & Order Online',
        href: '/online-orders',
        snippet:
            'Reserve USDA Prime steaks, dry-aged beef, heritage pork, and holiday roasts for Northfield pickup.',
    },
    {
        title: 'Visit Northfield & Winnetka',
        href: '/visit',
        snippet:
            'Hours, directions, and menus for 300 Happ Rd (The Butcher Shop) and 754 Elm St (The Depot).',
    },
    {
        title: 'BBQ & Whole-Hog Catering',
        href: '/catering',
        snippet:
            'On-site offset smoker catering, whole-hog roasts, smoked brisket platters, and North Shore events.',
    },
    {
        title: 'Weekly Specials & Rotisserie',
        href: '/specials',
        snippet:
            'Thursday pasture-raised rotisserie chicken drops, seasonal butcher bundles, and hot sandwiches.',
    },
];

export const SCHEMA_ENTITIES: SchemaEntitySummary[] = [
    {
        id: 'https://hofherrmeatco.com/#organization',
        title: 'Brand Organization',
        schemaType: 'Organization',
        description:
            'Parent brand entity linking Founders Sean & Arielle Hofherr, March 2014 founding date, social sameAs profiles, North Shore areaServed, press subjectOf, and subOrganization pointers.',
    },
    {
        id: 'https://hofherrmeatco.com/#business',
        title: 'The Butcher Shop (Pin A)',
        schemaType: 'ButcherShop + LocalBusiness',
        description:
            'Primary Northfield flagship at 300 Happ Rd (42.1042, -87.7715) with Tue–Sun hours, holiday specialOpeningHoursSpecification, Order/Reserve/Buy actions, and Product OfferCatalog.',
    },
    {
        id: 'https://hofherrmeatco.com/#depot',
        title: 'The Depot Winnetka (Pin B)',
        schemaType: 'FastFoodRestaurant + LocalBusiness',
        description:
            'Second physical location at 754 Elm St inside the Winnetka UP-N Metra station (42.1081, -87.7359) with Mon–Fri 10:30 AM–6:00 PM commuter lunch hours and holiday schedule.',
    },
    {
        id: 'https://hofherrmeatco.com/#catering',
        title: 'BBQ & Pig Roast Catering',
        schemaType: 'Service + FoodService',
        description:
            'Regional catering graph node covering Northfield, Winnetka, Wilmette, Kenilworth, Glencoe, Glenview, Evanston, Highland Park, Lake Forest, and Chicago.',
    },
    {
        id: 'https://hofherrmeatco.com/#website',
        title: 'Official WebSite Graph',
        schemaType: 'WebSite',
        description:
            'Connects canonical https://hofherrmeatco.com sitelinks, brand attribution, and publisher metadata back to #organization.',
    },
];

export type KnowledgeProductCard = {
    id: string;
    title: string;
    meta: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
};

export const KNOWLEDGE_PRODUCTS: KnowledgeProductCard[] = [
    {
        id: 'prime-steaks',
        title: 'USDA Prime & Dry-Aged Steaks',
        meta: 'Cut to order · Order pickup',
        href: '/online-orders',
        imageSrc: '/assets/cuts/beef-prime-cuts-packaged.jpg',
        imageAlt: 'Hand-trimmed USDA Prime and dry-aged steaks at Hofherr Meat Co.',
    },
    {
        id: 'italian-beef',
        title: 'Dipped Chicago Italian Beef',
        meta: 'Winnetka Depot & Hot Kits',
        href: '/visit#depot',
        imageSrc: '/assets/italian-beef.jpg',
        imageAlt: 'Dipped Chicago Italian beef sandwich from Hofherr Meat Co. The Depot',
    },
    {
        id: 'rotisserie-dinner',
        title: 'Thursday Rotisserie Chicken',
        meta: 'Pasture-raised · Pre-order',
        href: '/specials',
        imageSrc: '/assets/rotisserie-chickens.jpg',
        imageAlt: 'Spit-roasted pasture-raised rotisserie chickens at Hofherr Meat Co.',
    },
    {
        id: 'whole-hog-catering',
        title: 'Whole-Hog & BBQ Catering',
        meta: '20–500+ Guests · Get quote',
        href: '/catering',
        imageSrc: '/assets/pig-roast-spread.jpg',
        imageAlt: 'Whole-hog pig roast and offset smoker BBQ catering spread',
    },
];

export type HolidayHoursRow = {
    id: string;
    occasion: string;
    schedule: string;
    isClosed: boolean;
};

export const HOLIDAY_PICKUP_HOURS: HolidayHoursRow[] = [
    {
        id: 'july-3',
        occasion: 'July 3rd · Summer BBQ Pickup',
        schedule: '10:00 AM – 6:00 PM',
        isClosed: false,
    },
    {
        id: 'thanksgiving-eve',
        occasion: 'Thanksgiving Eve · Turkey Pickup',
        schedule: '9:00 AM – 5:00 PM',
        isClosed: false,
    },
    {
        id: 'thanksgiving-day',
        occasion: 'Thanksgiving Day',
        schedule: 'Closed',
        isClosed: true,
    },
    {
        id: 'christmas-eve',
        occasion: 'Christmas Eve · Standing Rib Roasts',
        schedule: '9:00 AM – 4:00 PM',
        isClosed: false,
    },
    {
        id: 'christmas-day',
        occasion: 'Christmas Day',
        schedule: 'Closed',
        isClosed: true,
    },
    {
        id: 'nye',
        occasion: 'New Year’s Eve · Prime Steaks',
        schedule: '10:00 AM – 4:00 PM',
        isClosed: false,
    },
];

export const GOOGLE_POST_UPDATE = {
    badge: 'Pinned update · From Hofherr Meat Co.',
    imageSrc: '/assets/rotisserie-chickens.jpg',
    imageAlt: 'Thursday pasture-raised rotisserie chicken dinners at Hofherr Meat Co.',
    body: 'Thursday Pasture-Raised Rotisserie Chicken Dinners & Holiday Roast Pre-Orders — Reserve custom-cut USDA Prime steaks for Northfield pickup or request a whole-hog BBQ catering quote.',
    ctaLabel: 'View Weekly Specials →',
    ctaHref: '/specials',
} as const;

const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

function parseMinutes(timeStr: string): number | null {
    const trimmed = timeStr.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = Number(match[1]);
    const mins = Number(match[2] ?? '0');
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
}

function compactTimeLabel(timeStr: string): string {
    return timeStr.replace(':00 ', ' ').trim();
}

export type LiveHoursStatus = {
    isOpen: boolean;
    badgeText: string;
    detailText: string;
    currentDay: string;
};

const CHICAGO_LIVE_FORMATTER = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
});

export function getChicagoLiveStatus(
    hours: StoreHourEntry[],
    minuteStamp: number,
): LiveHoursStatus {
    if (minuteStamp === 0 || hours.length === 0) {
        const firstOpen = hours.find((entry) => !entry.isClosed && entry.open && entry.close);
        return {
            isOpen: true,
            badgeText: 'Open',
            detailText: firstOpen ? `Closes ${compactTimeLabel(firstOpen.close)}` : 'See hours',
            currentDay: '',
        };
    }

    const now = new Date(minuteStamp * 60_000);
    const parts = CHICAGO_LIVE_FORMATTER.formatToParts(now);

    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Tuesday';
    const hourNum = Number(parts.find((p) => p.type === 'hour')?.value ?? '12') % 24;
    const minuteNum = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    const currentMinutes = hourNum * 60 + minuteNum;

    const todayEntry = hours.find((h) => h.day.toLowerCase() === weekday.toLowerCase());
    if (todayEntry && !todayEntry.isClosed) {
        const openMins = parseMinutes(todayEntry.open);
        const closeMins = parseMinutes(todayEntry.close);
        if (openMins !== null && closeMins !== null) {
            if (currentMinutes >= openMins && currentMinutes < closeMins) {
                return {
                    isOpen: true,
                    badgeText: 'Open',
                    detailText: `Closes ${compactTimeLabel(todayEntry.close)}`,
                    currentDay: weekday,
                };
            }
            if (currentMinutes < openMins) {
                return {
                    isOpen: false,
                    badgeText: 'Closed',
                    detailText: `Opens ${compactTimeLabel(todayEntry.open)}`,
                    currentDay: weekday,
                };
            }
        }
    }

    const todayIdx = Math.max(
        0,
        WEEKDAYS.findIndex((d) => d.toLowerCase() === weekday.toLowerCase()),
    );
    for (let offset = 1; offset <= 7; offset += 1) {
        const candidateDay = WEEKDAYS[(todayIdx + offset) % 7];
        const nextEntry = hours.find((h) => h.day.toLowerCase() === candidateDay.toLowerCase());
        if (nextEntry && !nextEntry.isClosed && nextEntry.open) {
            const shortDay = candidateDay.slice(0, 3);
            return {
                isOpen: false,
                badgeText: 'Closed',
                detailText:
                    offset === 1
                        ? `Opens ${compactTimeLabel(nextEntry.open)} ${shortDay}`
                        : `Opens ${shortDay} ${compactTimeLabel(nextEntry.open)}`,
                currentDay: weekday,
            };
        }
    }

    return {
        isOpen: false,
        badgeText: 'Closed',
        detailText: 'Temporarily closed',
        currentDay: weekday,
    };
}

function to24HourSpec(timeStr: string): string {
    const mins = parseMinutes(timeStr);
    if (mins === null) return '00:00';
    const hh = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    return `${hh}:${mm}`;
}

function mapSchemaHours(hours: StoreHourEntry[]) {
    return hours
        .filter((h) => !h.isClosed && h.open && h.close)
        .map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.day,
            opens: to24HourSpec(h.open),
            closes: to24HourSpec(h.close),
        }));
}

export function formatDisplayPhone(rawPhone: string): string {
    if (!rawPhone || rawPhone.toUpperCase().includes('MEAT')) {
        return '(847) 441-6328';
    }
    return rawPhone;
}

export function buildPreviewJsonLdSnippet(settings: SiteSettings): string {
    const displayPhone = formatDisplayPhone(settings.phone);
    const sameAs = [
        settings.instagram,
        settings.facebook,
        settings.yelp,
        settings.googleMaps,
    ].filter(Boolean);
    const previewGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://hofherrmeatco.com/#organization',
                name: settings.shopName || 'Hofherr Meat Co.',
                url: 'https://hofherrmeatco.com',
                foundingDate: '2014-03',
                founder: [
                    { '@type': 'Person', name: 'Sean Hofherr', jobTitle: 'Founder & Master Butcher' },
                    { '@type': 'Person', name: 'Arielle Hofherr', jobTitle: 'Co-Owner & Operations Director' },
                ],
                telephone: '+1-847-441-6328',
                email: settings.email || 'butcher@hofherrmeatco.com',
                sameAs,
                areaServed: [
                    'Northfield, IL',
                    'Winnetka, IL',
                    'Wilmette, IL',
                    'Kenilworth, IL',
                    'Glencoe, IL',
                    'Glenview, IL',
                    'Evanston, IL',
                    'Highland Park, IL',
                    'Lake Forest, IL',
                    'Chicago, IL',
                ],
                subjectOf: [
                    {
                        '@type': 'PodcastEpisode',
                        name: "America's Test Kitchen Proof Podcast — Chicago Italian Beef Feature",
                        url: 'https://hofherrmeatco.com/press',
                    },
                ],
                subOrganization: [
                    { '@id': 'https://hofherrmeatco.com/#business' },
                    { '@id': 'https://hofherrmeatco.com/#depot' },
                ],
            },
            {
                '@type': ['ButcherShop', 'FoodEstablishment', 'LocalBusiness'],
                '@id': 'https://hofherrmeatco.com/#business',
                name: 'Hofherr Meat Co. — The Butcher Shop',
                branchCode: 'NORTHFIELD-BUTCHER',
                telephone: displayPhone,
                priceRange: '$$',
                paymentAccepted: 'Cash, Credit Card, Debit Card, Apple Pay, Google Pay',
                hasMenu: 'https://hofherrmeatco.com/cut-guide',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '300 Happ Rd',
                    addressLocality: 'Northfield',
                    addressRegion: 'IL',
                    postalCode: '60093',
                    addressCountry: 'US',
                },
                geo: { '@type': 'GeoCoordinates', latitude: 42.1042, longitude: -87.7715 },
                openingHoursSpecification: mapSchemaHours(settings.butcherHours),
                specialOpeningHoursSpecification: [
                    { validFrom: '2026-11-25', validThrough: '2026-11-25', opens: '09:00', closes: '17:00' },
                    { validFrom: '2026-11-26', validThrough: '2026-11-26', opens: '00:00', closes: '00:00' },
                    { validFrom: '2026-12-24', validThrough: '2026-12-24', opens: '09:00', closes: '16:00' },
                    { validFrom: '2026-12-25', validThrough: '2026-12-25', opens: '00:00', closes: '00:00' },
                ],
                potentialAction: [
                    { '@type': 'OrderAction', target: 'https://hofherrmeatco.com/online-orders?store=butcher' },
                    { '@type': 'ReserveAction', target: 'https://hofherrmeatco.com/catering' },
                    { '@type': 'BuyAction', target: 'https://hofherrmeatco.com/gift-cards' },
                ],
                parentOrganization: { '@id': 'https://hofherrmeatco.com/#organization' },
            },
            {
                '@type': ['FastFoodRestaurant', 'SandwichShop', 'LocalBusiness'],
                '@id': 'https://hofherrmeatco.com/#depot',
                name: 'Hofherr Meat Co. — The Depot',
                branchCode: 'WINNETKA-DEPOT',
                telephone: displayPhone,
                priceRange: '$$',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '754 Elm St',
                    addressLocality: 'Winnetka',
                    addressRegion: 'IL',
                    postalCode: '60093',
                    addressCountry: 'US',
                },
                geo: { '@type': 'GeoCoordinates', latitude: 42.1081, longitude: -87.7359 },
                openingHoursSpecification: mapSchemaHours(settings.depotHours),
                containedInPlace: {
                    '@type': 'TrainStation',
                    name: 'Winnetka Metra Station (UP-N)',
                },
                parentOrganization: { '@id': 'https://hofherrmeatco.com/#organization' },
            },
        ],
    };

    return JSON.stringify(previewGraph, null, 2);
}
