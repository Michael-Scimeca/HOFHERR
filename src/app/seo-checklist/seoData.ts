export interface SeoLink {
    label: string;
    href: string;
    external?: boolean;
}

export interface SeoTask {
    id: string;
    title: string;
    detail: string;
    links?: SeoLink[];
}

export interface SeoGroup {
    id: string;
    title: string;
    tag: string;
    where: 'Off-site' | 'On-site';
    intro: string;
    tasks: SeoTask[];
}

/* Technical basics already handled in the earlier SEO pass */
export const DONE_BASICS: string[] = [
    'Canonical URLs',
    'Open Graph & Twitter share tags',
    'Structured data (JSON-LD)',
    'Sitemap entries',
    'Noindex on admin & internal pages',
    'Correctly sized share images',
];

export const SEO_GROUPS: SeoGroup[] = [
    {
        id: 'gbp',
        title: 'Google Business Profile',
        tag: 'Biggest lever for local search',
        where: 'Off-site',
        intro: 'The map pack is where most "butcher near me" searches end. Each location needs its own complete, active profile.',
        tasks: [
            {
                id: 'gbp-claim',
                title: 'Claim or verify a separate profile for each location',
                detail: 'One for The Butcher Shop (300 Happ Rd, Northfield) and one for The Depot (754 Elm St, Winnetka). Each gets its own hours, phone, photos, and categories, with "Butcher shop" as the primary category.',
                links: [{ label: 'Google Business Profile', href: 'https://business.google.com', external: true }],
            },
            {
                id: 'gbp-link',
                title: 'Link each profile to its own page on the site',
                detail: 'Point each profile at that location\'s page instead of the homepage, so Google ties the listing to the right address and hours.',
                links: [{ label: 'Visit page', href: '/visit' }],
            },
            {
                id: 'gbp-posts',
                title: 'Post regularly and list products and services',
                detail: 'Post holiday pre-orders and specials. Add products, and add catering as a service on both profiles.',
                links: [{ label: 'Specials', href: '/specials' }, { label: 'Catering', href: '/catering' }],
            },
            {
                id: 'gbp-reviews',
                title: 'Ask customers for reviews and reply to every one',
                detail: 'Review volume and recency heavily affect map rankings. A short link or QR code at the counter and in order-ready messages makes asking easy.',
            },
        ],
    },
    {
        id: 'listings',
        title: 'Consistent Listings',
        tag: 'Name, address, phone',
        where: 'Off-site',
        intro: 'Google cross-checks business details across the web. Mismatches weaken trust in the listing.',
        tasks: [
            {
                id: 'nap-match',
                title: 'Make the name, address, and phone identical everywhere',
                detail: 'Yelp, Apple Business Connect, Bing Places, Facebook, Instagram, and local chamber directories should all match the site character for character.',
                links: [
                    { label: 'Apple Business Connect', href: 'https://businessconnect.apple.com', external: true },
                    { label: 'Bing Places', href: 'https://www.bingplaces.com', external: true },
                ],
            },
            {
                id: 'nap-780',
                title: 'Hunt down any listing still showing 780 Elm St',
                detail: 'The Depot is at 754 Elm St. Any directory still carrying the old 780 address hurts local ranking and sends people to the wrong door.',
            },
        ],
    },
    {
        id: 'gsc',
        title: 'Search Console',
        tag: 'Measure what Google sees',
        where: 'Off-site',
        intro: 'Free reporting from Google on indexing and the searches that already lead to the site.',
        tasks: [
            {
                id: 'gsc-verify',
                title: 'Verify the live domain, submit the sitemap, check indexing',
                detail: 'Verify hofherrmeatco.com, submit /sitemap.xml, then confirm which pages are indexed and fix any that are excluded by mistake.',
                links: [
                    { label: 'Search Console', href: 'https://search.google.com/search-console', external: true },
                    { label: 'Sitemap page', href: '/sitemap-page' },
                ],
            },
            {
                id: 'gsc-queries',
                title: 'Review the query report after a few weeks',
                detail: 'See what people already find the shop for, then build pages and posts around those searches.',
            },
        ],
    },
    {
        id: 'onsite',
        title: 'On-Site Additions',
        tag: 'Pages and markup to build',
        where: 'On-site',
        intro: 'The remaining work inside the codebase. Each of these gives Google a clearer page to rank.',
        tasks: [
            {
                id: 'on-locations',
                title: 'A dedicated page per location',
                detail: 'Each with its own LocalBusiness structured data (hours, geo coordinates, phone), an embedded map, and parking or pickup details.',
                links: [{ label: 'Visit page', href: '/visit' }, { label: 'Google preview', href: '/google-preview' }],
            },
            {
                id: 'on-search-pages',
                title: 'Pages targeting what people search',
                detail: '"Butcher near Winnetka," "catering Northfield," "Thanksgiving turkey order," "dry-aged beef North Shore." One clear topic per page.',
            },
            {
                id: 'on-product-schema',
                title: 'Product structured data on online-order items',
                detail: 'Include price and availability so items can show in rich results.',
                links: [{ label: 'Online orders', href: '/online-orders' }],
            },
            {
                id: 'on-alt',
                title: 'Descriptive alt text and file names on product photos',
                detail: 'Image search matters for food. Describe the cut and preparation, not just "product photo".',
            },
            {
                id: 'on-content',
                title: 'Useful content only Hofherr can write',
                detail: 'Cut guides, cooking temperatures, how to order a whole or half animal. The 1903 heritage story is strong material for the About page.',
                links: [{ label: 'Cut guide', href: '/cut-guide' }, { label: 'Our story', href: '/our-story' }],
            },
        ],
    },
    {
        id: 'links',
        title: 'Links & Mentions',
        tag: 'Authority from other sites',
        where: 'Off-site',
        intro: 'Links from real local and press sites tell Google the shop is established and trusted.',
        tasks: [
            {
                id: 'links-press',
                title: 'Turn press mentions into links',
                detail: 'For each outlet in the press logo ticker, check whether the article links to the site and request a link where it doesn\'t.',
                links: [{ label: 'Press page', href: '/press' }],
            },
            {
                id: 'links-local',
                title: 'Earn local links',
                detail: 'Suppliers, farms, schools or events the shop sponsors, and neighboring businesses all carry weight for local ranking.',
            },
        ],
    },
];
