export function toProductSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export interface CuratedBundle {
    id: string;
    title: string;
    badge: string;
    serves: string;
    description: string;
    items: { name: string; price: string; qty: number; note: string }[];
}

export const CURATED_BUNDLES: CuratedBundle[] = [
    {
        id: 'steakhouse-date-night',
        title: 'Steakhouse Date Night Kit',
        badge: "Butcher's Pick",
        serves: 'Serves 2',
        description: 'Two prime 1.5" ribeyes paired with rich beef tallow for a cast-iron crust that beats a downtown steakhouse.',
        items: [
            { name: 'Boneless Ribeye', price: '$40.99/lb', qty: 2, note: 'Cut 1.5" thick for cast-iron sear' },
            { name: 'Beef Tallow', price: '$6.99/lb', qty: 1, note: 'For steakhouse basting' },
        ],
    },
    {
        id: 'north-shore-grill-pack',
        title: 'North Shore Grill Pack',
        badge: 'Most Popular',
        serves: 'Serves 6–8',
        description: 'Our legendary house-marinated skirt steak, house bratwurst, and sirloin burgers — ready for the charcoal grill.',
        items: [
            { name: 'Marinated Skirt Steak', price: '$30.99/lb', qty: 2, note: 'House marinade' },
            { name: 'House Bratwurst', price: '$8.99/lb', qty: 2, note: 'Fresh links' },
            { name: 'Sirloin Burger', price: '$11.99/lb', qty: 4, note: 'Hand-pattied' },
        ],
    },
    {
        id: 'sunday-pitmaster-pack',
        title: 'Sunday Pitmaster Pack',
        badge: 'Low & Slow',
        serves: 'Serves 8–10',
        description: 'Full St. Louis ribs, Berkshire pork chops, and house-linked andouille sausage built for a weekend smoke.',
        items: [
            { name: 'St. Louis Style Ribs', price: '$10.99/lb', qty: 2, note: 'Membrane removed' },
            { name: 'Berkshire Bone-In Pork Chop', price: '$12.99/lb', qty: 2, note: 'Cut 1.25" thick' },
            { name: 'Andouille Sausage', price: '$8.99/lb', qty: 1, note: 'House-smoked links' },
        ],
    },
];

export interface RecipePairing {
    title: string;
    href: string;
    tip: string;
}

export const PARCEL_SHEET_PAIRINGS: Record<string, RecipePairing> = {
    'bone-in-ribeye': {
        title: 'Reverse-Seared Ribeye Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Pull at 122°F internal, rest 10 min, then sear 60 sec/side in screaming-hot cast iron.',
    },
    'boneless-ribeye': {
        title: 'Cast-Iron Ribeye Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Dry-brine uncovered overnight on a wire rack for a dark steakhouse crust.',
    },
    'dry-aged-ribeye': {
        title: 'Dry-Aged Steakhouse Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Keep seasoning simple — coarse kosher salt & cracked black pepper only.',
    },
    'new-york-strip': {
        title: 'Pan-Basted NY Strip Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Render the fat cap vertically for 90 seconds before laying flat.',
    },
    'filet-mignon': {
        title: 'Garlic-Thyme Filet Mignon Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Baste with butter, crushed garlic, and thyme; pull at 125°F for medium-rare.',
    },
    'skirt-steak': {
        title: 'Charcoal Skirt Steak Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Sear hot & fast (2–3 min/side) and always slice thin against the grain.',
    },
    'marinated-skirt-steak': {
        title: 'House-Marinated Skirt Steak Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Pat excess marinade lightly before hitting high heat for crisp charred edges.',
    },
    'berkshire-bone-in-pork-chop': {
        title: 'Heritage Pork Chop Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Pull at 140°F and rest 5 minutes for juicy, blushing Berkshire pork.',
    },
    'berkshire-pork-tenderloin': {
        title: 'Roasted Pork Tenderloin Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Sear all sides, finish at 400°F until 142°F internal.',
    },
    'house-bratwurst': {
        title: 'Sheboygan Beer Brats Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Simmer gently in pilsner & onions first, then kiss with direct charcoal heat.',
    },
    'whole-brisket': {
        title: 'Post-Oak Smoked Brisket Parcel Sheet',
        href: '/recipes/sheets',
        tip: 'Smoke at 250°F, wrap in butcher paper at 165°F, rest minimum 2 hours.',
    },
};

export interface CutSocialProof {
    badge: string;
    rating: string;
    weeklyOrders: number;
    quote: string;
    reviewer: string;
}

export const CUT_SOCIAL_PROOF: Record<string, CutSocialProof> = {
    'marinated-skirt-steak': {
        badge: 'Most Popular',
        rating: '5.0',
        weeklyOrders: 64,
        quote: 'The best house marinated skirt steaks I have had so far.',
        reviewer: 'Matt G. · Verified Buyer',
    },
    'bone-in-ribeye': {
        badge: "Butcher's Pick",
        rating: '4.9',
        weeklyOrders: 48,
        quote: 'Dry-aged marbling that beats any Chicago steakhouse.',
        reviewer: 'Joe D. · Verified Buyer',
    },
    'boneless-ribeye': {
        badge: 'Top Rated',
        rating: '4.9',
        weeklyOrders: 52,
        quote: 'Cut to order every time — unbeatable crust and tenderness.',
        reviewer: 'Jack S. · Verified Buyer',
    },
    'new-york-strip': {
        badge: 'Popular Cut',
        rating: '4.9',
        weeklyOrders: 41,
        quote: 'Prime, dry-aged, and trimmed cleanly right behind the counter.',
        reviewer: 'Dave C. · Verified Buyer',
    },
    'filet-mignon': {
        badge: 'Customer Favorite',
        rating: '5.0',
        weeklyOrders: 39,
        quote: 'Butter-tender Prime center-cut filet — zero waste.',
        reviewer: 'Barbara S. · Verified Buyer',
    },
    'berkshire-bone-in-pork-chop': {
        badge: "Butcher's Pick",
        rating: '5.0',
        weeklyOrders: 34,
        quote: 'Bone-in pork chop — BEYOND AMAZING.',
        reviewer: 'Marianne V. · Verified Buyer',
    },
    'house-bratwurst': {
        badge: 'Best in Show',
        rating: '5.0',
        weeklyOrders: 57,
        quote: 'Hofherr’s best-in-show sausages are 10/10 delicious.',
        reviewer: 'Kath H. · Verified Buyer',
    },
    'whole-brisket': {
        badge: 'Pitmaster Choice',
        rating: '4.9',
        weeklyOrders: 29,
        quote: 'Emily even wrote down smoking directions for my first brisket!',
        reviewer: 'Jonathan W. · Verified Buyer',
    },
};

export function getRecipePairing(name: string): RecipePairing | null {
    return PARCEL_SHEET_PAIRINGS[toProductSlug(name)] ?? null;
}

export function getSocialProof(name: string): CutSocialProof | null {
    return CUT_SOCIAL_PROOF[toProductSlug(name)] ?? null;
}

/**
 * Syllable-length & visual fluency cleanup (Coulter et al., 2012):
 * Drops trailing ".00" on whole-dollar prices ("$150.00" -> "$150", "$180.00/lb" -> "$180/lb")
 * while keeping charm prices like "$40.99/lb" untouched.
 */
export function formatDisplayPrice(price: string): string {
    return price.replace(/\$(\d[\d,]*)\.00\b/g, '$$$1');
}

/**
 * Per-serving & steakhouse price anchors (Ariely 2008; Gourville 1998)
 * keyed by product slug to neutralize supermarket sticker shock on flagship cuts.
 */
export const STEAKHOUSE_ANCHORS: Record<string, string> = {
    'prime-bone-in-ribeye': '~$17/serving vs. $68 steakhouse',
    'bone-in-ribeye': '~$17/serving vs. $68 steakhouse',
    'prime-boneless-ribeye': '~$16/serving vs. $68 steakhouse',
    'boneless-ribeye': '~$16/serving vs. $68 steakhouse',
    'dry-aged-ribeye': '~$18/serving vs. $74 steakhouse',
    'prime-beef-tenderloin': '~$16/serving · trimmed & tied free',
    'filet-mignon': '~$25 per 8oz filet vs. $64 steakhouse',
    'prime-porterhouse': '~$20/serving · feeds 2',
    'prime-t-bone': '~$19/serving vs. $62 steakhouse',
    'bone-in-prime-rib': '~$20/guest · 1 rib feeds 2',
    'wagyu-tomahawk-ribeye': 'Showstopper centerpiece · feeds 3–4',
    'prime-tomahawk-ribeye': 'Showstopper centerpiece · feeds 3–4',
    'a5-miyazaki-wagyu-new-york-strip': 'Authentic Japanese A5 · $190+/4oz in steakhouses',
    'glazed-spiral-sliced-ham': '~$10/guest · serves 10+ adults',
};

export function getSteakhouseAnchor(name: string): string | null {
    return STEAKHOUSE_ANCHORS[toProductSlug(name)] ?? null;
}

/**
 * Zero-Price Effect threshold (Shampanier, Mazar & Ariely, 2007)
 * & McDonald's "Complete the Plate" 1-tap Mini Cart Rail cross-sells.
 */
export const FREE_GIFT_THRESHOLD = 125;
export const FREE_GIFT_NAME = 'Free House Compound Butter';

export interface MiniCartUpsell {
    name: string;
    price: string;
    tag: string;
}

export const MINI_CART_UPSELLS: MiniCartUpsell[] = [
    { name: 'House Compound Butter', price: '$6.99', tag: 'Steak Finish' },
    { name: 'TALO Beef Tallow', price: '$14.99', tag: 'Cast-Iron Sear' },
    { name: "Uncle Dougie's Rub", price: '$8.99', tag: 'Pitmaster Rub' },
    { name: 'House Giardiniera', price: '$7.99', tag: 'Chicago Classic' },
];

