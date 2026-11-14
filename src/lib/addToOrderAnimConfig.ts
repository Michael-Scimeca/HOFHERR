'use client';

export type FlyEasingPreset = 'smooth' | 'gravity-drop' | 'spring-snap' | 'linear' | 'ease-in-dip';
export type FlyDropStyle = 'plunge-top' | 'direct-center' | 'hover-sink' | 'slam-dunk';
export type BurnDirection = 'left-to-right' | 'right-to-left';
export type FlyImageMode = 'auto-product' | 'auto-photo' | 'custom-icon';

export interface AddToOrderAnimConfig {
    /* ── 1. Flying Item Image & Visuals ── */
    flyImageMode: FlyImageMode;
    flyImageSrc: string;
    flyIconSize: number;
    flyShowModalPreview: boolean;
    quickAddDirect: boolean;
    flyFlamesEnabled: boolean;
    flyFlameIntensity: number;
    flyFlameSize: number;
    flyShadowBlur: number;
    flyShadowOpacity: number;
    flyGlowColorHex: string;
    flyGlowRadius: number;
    flyEmberTrail: boolean;
    flyEmberCount: number;

    /* ── 2. Flight Trajectory & Scale ── */
    flyEnabled: boolean;
    flyDelayMs: number;
    flyMinMs: number;
    flyMaxMs: number;
    flyArcHeight: number;
    flyApexOffset: number;
    flyEasing: FlyEasingPreset;
    flyStartScale: number;
    flyPeakScale: number;
    flyEndScale: number;
    flyStartRotationDeg: number;
    flyMidRotationDeg: number;
    flyEndRotationDeg: number;
    flyStartOpacity: number;
    flyEndOpacity: number;

    /* ── 3. Cart Bag Drop & Catch Physics ── */
    flyDropStyle: FlyDropStyle;
    flyTargetOffsetX: number;
    flyTargetOffsetY: number;
    flyDropPlungePx: number;
    flyDropHoldMs: number;
    cartFlamesBurst: boolean;
    cartAnticipationScaleX: number;
    cartAnticipationScaleY: number;
    cartBounceScale: number;
    cartSquashScaleX: number;
    cartSquashScaleY: number;
    cartTiltDeg: number;
    cartBounceMs: number;
    cartFlashRing: boolean;
    cartBadgePopScale: number;

    /* ── 4. Modal Burn-In / Burn-Out Transition ── */
    burnFlamesEnabled: boolean;
    burnOutOnConfirm: boolean;
    burnInMs: number;
    burnOutMs: number;
    burnInDirection: BurnDirection;
    burnOutDirection: BurnDirection;
    burnMaskFeatherPct: number;
    overrun: number;
    flameBoost: number;
    flameHeight: number;
    flameRadius: number;
    flameFlickerSpeed: number;
    edgeRaggedness: number;
    borderWidth: number;
    borderColorHex: string;
    overlayFadeMs: number;
    overlayBlurPx: number;
}

export const PARCEL_IMAGE_OPTIONS: { label: string; src: string; badge: string }[] = [
    {
        label: 'Kraft Butcher Parcel',
        src: '/assets/item.png?v=2',
        badge: 'Parcel',
    },
    {
        label: 'Wax-Sealed Parcel',
        src: '/assets/process/craft-butcher-step-parcel.png',
        badge: 'Craft',
    },
    {
        label: 'Cleaver & Ribeye',
        src: '/assets/process/craft-butcher-step-cleaver.png',
        badge: 'Cut',
    },
    {
        label: 'Smokehouse Neon Cart',
        src: '/assets/process/icon-style-neon-cart.svg',
        badge: 'Neon',
    },
    {
        label: 'Cast-Iron Ribeye Cart',
        src: '/assets/process/icon-style-iron-cart.png',
        badge: 'Iron',
    },
    {
        label: 'Flint & Flame Cart',
        src: '/assets/process/flint-flame-step-cart.png',
        badge: 'Flame',
    },
    {
        label: 'Beef Medallion',
        src: '/icons/cow.svg',
        badge: 'Beef',
    },
    {
        label: 'Pork Medallion',
        src: '/icons/pig.svg',
        badge: 'Pork',
    },
    {
        label: 'Sausage Medallion',
        src: '/icons/suage.svg',
        badge: 'Links',
    },
    {
        label: 'Chicken Medallion',
        src: '/icons/chicken.svg',
        badge: 'Poultry',
    },
    {
        label: 'Lamb Medallion',
        src: '/icons/lamb.svg',
        badge: 'Lamb',
    },
    {
        label: 'Grill Tonight Sticker',
        src: '/icons/grilltonight.svg',
        badge: 'Sticker',
    },
    {
        label: 'Dry-Aged Sticker',
        src: '/icons/dryaged.svg',
        badge: 'Sticker',
    },
    {
        label: 'Bone-In Sticker',
        src: '/icons/bonein.svg',
        badge: 'Sticker',
    },
    {
        label: 'Crimson Wax Stamp',
        src: '/assets/identity/hofherr-stamp-circular-crimson.svg',
        badge: 'Seal',
    },
    {
        label: 'Safety Seal Stamp',
        src: '/assets/identity/stickers/sticker-safetyseal.png',
        badge: 'Badge',
    },
];

export const TEST_SAMPLE_PRODUCTS: {
    name: string;
    price: string;
    desc: string;
    categoryIcon: string;
    imageSrc?: string;
}[] = [
    {
        name: 'Bone-In Ribeye',
        price: '$38.99/lb',
        desc: 'Prime, dry-aged. Standard 1.25" cut.',
        categoryIcon: '/icons/cow.svg',
    },
    {
        name: 'Red White And Blue Sausages',
        price: '$12.99/lb',
        desc: 'House-crafted links, ground fresh daily.',
        categoryIcon: '/icons/suage.svg',
    },
    {
        name: 'Bacon',
        price: '$14.99/lb',
        desc: 'Smoked in house. Specify thickness.',
        categoryIcon: '/icons/pig.svg',
    },
    {
        name: 'Pork Chops',
        price: '$13.99/lb',
        desc: 'Standard 1.25" cut.',
        categoryIcon: '/icons/pig.svg',
        imageSrc: 'https://cdn.sanity.io/images/a2p2fvte/production/a4eac5eec99b43f6809e061f2cde7a66a6b48ea8-360x296.jpg',
    },
    {
        name: 'Boneless Skinless Chicken Breast',
        price: '$9.99/lb',
        desc: 'Pasture raised, hand-trimmed.',
        categoryIcon: '/icons/chicken.svg',
    },
    {
        name: 'Lamb Chops',
        price: '$32.99/lb',
        desc: 'Pasture-raised loin or rib chops.',
        categoryIcon: '/icons/lamb.svg',
    },
    {
        name: 'Duck Confit',
        price: '$26.99/lb',
        desc: 'Housemade, ready to finish.',
        categoryIcon: '/icons/duck.svg',
    },
    {
        name: 'Shrimp and Tasso Ham Gumbo',
        price: '$18.99',
        desc: 'Housemade, frozen in quarts.',
        categoryIcon: '/icons/stocksoup.svg',
    },
    {
        name: 'Almond Croissant',
        price: '$7.00',
        desc: 'Fresh baked daily at The Depot.',
        categoryIcon: '/icons/pastries.svg',
    },
];

/**
 * Infers the best product/category icon for an item name when categoryIcon/imageSrc isn't explicitly supplied.
 */
function inferProductIconByName(itemName?: string): string {
    if (!itemName) return '/assets/item.png?v=2';
    const n = itemName.toLowerCase();

    if (/(brat|sausage|chorizo|kielbasa|andouille|boudin|hot link|hot dog|banger|loukonikos|boerwors|merquez|lanjager|thuringer|toulouse)/.test(n)) {
        return '/icons/suage.svg';
    }
    if (/(soup|stock|gumbo|chili|chowder|minestrone|ribolitta|posole|gazpacho|caldo|bigos|gravy)/.test(n)) {
        return '/icons/stocksoup.svg';
    }
    if (/(croissant|fritter|danish|muffin|kougn)/.test(n)) {
        return '/icons/pastries.svg';
    }
    if (/(bread|baguette|bun)/.test(n)) {
        return '/icons/bread.svg';
    }
    if (/(coffee|rare tea|hot chocolate)/.test(n)) {
        return '/icons/hotbeverage.svg';
    }
    if (/(soda|root beer|ginger ale|joe tea|coke|sprite|faygo|wisco|topo chico|water|gatorade|bloody mary)/.test(n)) {
        return '/icons/coldbeverage.svg';
    }
    if (/(hat|shirt|koozie|tote)/.test(n)) {
        return '/icons/swag.svg';
    }
    if (/(salmon|lobster|crab|oyster|shrimp|snapper|fish)/.test(n)) {
        return '/icons/fish.svg';
    }
    if (/(duck)/.test(n)) {
        return '/icons/duck.svg';
    }
    if (/(turkey)/.test(n)) {
        return '/icons/turkey.svg';
    }
    if (/(veal)/.test(n)) {
        return '/icons/veal.svg';
    }
    if (/(lamb)/.test(n)) {
        return '/icons/lamb.svg';
    }
    if (/(bison|elk|venison|boar|rabbit|game|alligator|kangaroo|ostrich|quail|pheasant|partridge|goose)/.test(n)) {
        return '/icons/game.svg';
    }
    if (/(chicken|fryer|roaster|wings|drumstick|schmaltz|vesuvio)/.test(n)) {
        return '/icons/chicken.svg';
    }
    if (/(pork|bacon|ribs|rib tip|porchetta|pancetta|lard|trotter|ham|salami|sopressata|prosciutto|lonza|mortadella)/.test(n)) {
        return '/icons/pig.svg';
    }
    if (/(cheese|cheddar|swiss|havarti|provolone|muenster|butter|milk|creme fraiche|egg)/.test(n)) {
        return '/icons/dairy.svg';
    }
    if (/(sandwich)/.test(n)) {
        return '/icons/hamcheese.svg';
    }
    if (/(tomato|arugula|shallot|garlic|herb|potato|mushroom|chile)/.test(n)) {
        return '/icons/produce.svg';
    }
    if (/(mayo|sauce|rub|seasoning|mustard|syrup|vinegar|oil|kimchi|pickle|chips|pretzel|charcoal|mojobrick|honey|jelly)/.test(n)) {
        return '/icons/pantry.svg';
    }
    if (/(ribeye|strip|filet|tenderloin|t-bone|porterhouse|prime rib|steak|hanger|skirt|flank|kalbi|tri-tip|tri tip|picanha|sirloin|brisket|chuck|shank|cheek|roast|wagyu|marrow|knuckle|ox tail|liver|tripe|burger|meatloaf|jerky|slim\s?jim|tallow|wellington|stroganoff|bourguignon|meatball|pastrami|corned beef|bresaola|braseola)/.test(n)) {
        return '/icons/cow.svg';
    }
    return '/assets/item.png?v=2';
}

/**
 * Infers a real Hofherr cut/dish photo for an item when flyImageMode === 'auto-photo'.
 */
function inferProductPhotoByName(itemName?: string, categoryIcon?: string): string {
    const n = (itemName || '').toLowerCase();
    const icon = (categoryIcon || '').toLowerCase();

    if (/ribeye/.test(n)) return '/assets/recipes/reverse-seared-bone-in-ribeye.jpg';
    if (/strip/.test(n)) return '/assets/recipes/cast-iron-new-york-strip.jpg';
    if (/prime rib/.test(n)) return '/assets/recipes/garlic-herb-prime-rib.jpg';
    if (/brisket/.test(n)) return '/assets/recipes/oven-braised-brisket.jpg';
    if (/skirt/.test(n)) return '/assets/recipes/skirt-steak-tacos.jpg';
    if (/flank/.test(n)) return '/assets/recipes/soy-ginger-flank-steak.jpg';
    if (/tri[- ]?tip/.test(n)) return '/assets/recipes/grilled-tri-tip-chimichurri.jpg';
    if (/shank/.test(n)) return '/assets/recipes/red-wine-braised-beef-shank.jpg';
    if (/cheek/.test(n)) return '/assets/recipes/braised-beef-cheek-ragu.jpg';
    if (/turkey/.test(n) || icon.includes('turkey')) return '/assets/recipes/herb-butter-roast-turkey.jpg';
    if (/lamb/.test(n) || icon.includes('lamb')) return '/assets/cuts/lamb-pasture-cuts-packaged.jpg';
    if (/(brat|sausage|chorizo|kielbasa|andouille|boudin|hot link|hot dog)/.test(n) || icon.includes('suage')) {
        return '/assets/cuts/charcuterie-sausages-packaged.jpg';
    }
    if (/(bacon|pate|confit)/.test(n)) return '/assets/cuts/charcuterie-pate-confit-bacon-packaged.jpg';
    if (/(pork|ribs|porchetta|ham)/.test(n) || icon.includes('pig')) return '/assets/cuts/pork-heritage-cuts-packaged.jpg';
    if (/(chicken|wings|roaster|fryer)/.test(n) || icon.includes('chicken')) return '/assets/cuts/poultry-pasture-cuts-packaged.jpg';
    if (/(duck|venison|rabbit)/.test(n) || icon.includes('duck') || icon.includes('game')) return '/assets/cuts/game-duck-venison-packaged.jpg';
    if (/(bison|elk)/.test(n)) return '/assets/cuts/exotic-bison-elk-packaged.jpg';
    if (/(soup|stock|gumbo|chili|chowder|broth)/.test(n) || icon.includes('stocksoup')) return '/assets/cuts/soups-kettle-stocks-packaged.jpg';
    if (/(sandwich)/.test(n)) return '/assets/cuts/sandwiches-butcher-counter-packaged.jpg';
    if (/(cheese|dairy)/.test(n) || icon.includes('dairy') || icon.includes('hamcheese')) return '/assets/cuts/charcuterie-cheeses-packaged.jpg';
    if (icon.includes('prepared') || icon.includes('grabgo')) return '/assets/cuts/prepared-heat-and-eat-entrees-packaged.jpg';
    if (icon.includes('pantry')) return '/assets/cuts/prepared-sides-broths-rubs-packaged.jpg';
    if (icon.includes('catering')) return '/assets/cuts/bbq-smokehouse-catering-packaged.jpg';
    if (icon.includes('cow')) return '/assets/cuts/beef-prime-cuts-packaged.jpg';

    const iconFallback = inferProductIconByName(itemName);
    if (iconFallback !== '/assets/item.png?v=2') return iconFallback;
    return '/assets/cuts/beef-prime-cuts-packaged.jpg';
}

/**
 * Returns true when a resolved fly image URL is a rectangular cut/product photograph
 * rather than a transparent icon/medallion/sticker.
 */
export function isPhotoFlyAsset(src: string): boolean {
    if (!src) return false;
    return (
        /^https?:\/\//i.test(src) ||
        /^\/assets\/(cuts|recipes)\//i.test(src) ||
        /\.(jpe?g|webp)(\?|$)/i.test(src)
    );
}

/**
 * Resolves the exact image URL to fly into the cart based on current AddToOrderAnimConfig.
 */
export function resolveProductFlyImage(
    source?: { itemName?: string; imageSrc?: string; categoryIcon?: string },
    cfg?: AddToOrderAnimConfig
): string {
    const activeCfg = cfg ?? getAddToOrderAnimConfig();
    if (activeCfg.flyImageMode === 'custom-icon') {
        return activeCfg.flyImageSrc || '/assets/item.png?v=2';
    }
    if (activeCfg.flyImageMode === 'auto-photo') {
        if (source?.imageSrc) return source.imageSrc;
        return inferProductPhotoByName(source?.itemName, source?.categoryIcon);
    }
    // 'auto-product': always resolve crisp vector medallion/icon (never raw Sanity rectangular JPG)
    if (source?.itemName && /(soup|stock|gumbo|chili|chowder)/.test(source.itemName.toLowerCase())) {
        return '/icons/stocksoup.svg';
    }
    if (source?.categoryIcon) {
        return source.categoryIcon.replace(/^\/icons\/([a-z0-9-]+)\.png$/i, '/icons/$1.svg');
    }
    if (source?.itemName) {
        return inferProductIconByName(source.itemName);
    }
    return activeCfg.flyImageSrc || '/assets/item.png?v=2';
}

const ADD_TO_ORDER_ANIM_STORAGE_KEY = 'hofherr_add_to_order_anim_v4';
const LEGACY_ANIM_STORAGE_KEY = 'hofherr_add_to_order_anim_v3';
const ADD_TO_ORDER_ANIM_EVENT = 'hofherr_add_to_order_anim_change';
export const TOGGLE_ANIM_STUDIO_EVENT = 'hofherr_toggle_add_to_order_studio';
export const OPEN_TEST_MODAL_EVENT = 'hofherr_open_test_add_modal';
export const SYNC_LIVE_PRODUCT_EVENT = 'hofherr_sync_live_fly_product';

export const DEFAULT_ADD_TO_ORDER_ANIM_CONFIG: AddToOrderAnimConfig = {
    /* 1. Image & Visuals */
    flyImageMode: 'custom-icon',
    flyImageSrc: '/assets/item.png?v=2',
    flyIconSize: 84,
    flyShowModalPreview: true,
    quickAddDirect: false,
    flyFlamesEnabled: false,
    flyFlameIntensity: 0.3,
    flyFlameSize: 0.7,
    flyShadowBlur: 12,
    flyShadowOpacity: 0.45,
    flyGlowColorHex: '#FF5014',
    flyGlowRadius: 5,
    flyEmberTrail: true,
    flyEmberCount: 10,

    /* 2. Trajectory & Scale */
    flyEnabled: true,
    flyDelayMs: 0,
    flyMinMs: 700,
    flyMaxMs: 1650,
    flyArcHeight: 170,
    flyApexOffset: 0.42,
    flyEasing: 'gravity-drop',
    flyStartScale: 1.15,
    flyPeakScale: 1.7,
    flyEndScale: 0.34,
    flyStartRotationDeg: -6,
    flyMidRotationDeg: 8,
    flyEndRotationDeg: 18,
    flyStartOpacity: 1,
    flyEndOpacity: 0.85,

    /* 3. Cart Bag Drop & Catch */
    flyDropStyle: 'plunge-top',
    flyTargetOffsetX: 0,
    flyTargetOffsetY: -4,
    flyDropPlungePx: 22,
    flyDropHoldMs: 110,
    cartFlamesBurst: true,
    cartAnticipationScaleX: 1.14,
    cartAnticipationScaleY: 0.9,
    cartBounceScale: 1.5,
    cartSquashScaleX: 1.24,
    cartSquashScaleY: 0.82,
    cartTiltDeg: 8,
    cartBounceMs: 440,
    cartFlashRing: true,
    cartBadgePopScale: 1.45,

    /* 4. Modal Burn-In / Burn-Out */
    burnFlamesEnabled: true,
    burnOutOnConfirm: false,
    burnInMs: 700,
    burnOutMs: 820,
    burnInDirection: 'left-to-right',
    burnOutDirection: 'left-to-right',
    burnMaskFeatherPct: 10,
    overrun: 1.22,
    flameBoost: 1.5,
    flameHeight: 0.46,
    flameRadius: 0.056,
    flameFlickerSpeed: 1,
    edgeRaggedness: 0.14,
    borderWidth: 2,
    borderColorHex: '#CC0E1D',
    overlayFadeMs: 320,
    overlayBlurPx: 6,
};

let cachedRaw: string | null = null;
let cachedConfig: AddToOrderAnimConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;

export function getAddToOrderAnimConfig(): AddToOrderAnimConfig {
    if (typeof window === 'undefined') return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
    try {
        const raw = window.localStorage.getItem(ADD_TO_ORDER_ANIM_STORAGE_KEY);
        if (!raw) {
            cachedRaw = null;
            cachedConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
            return cachedConfig;
        }
        if (raw === cachedRaw) return cachedConfig;
        const parsed = JSON.parse(raw) as Partial<AddToOrderAnimConfig>;
        cachedRaw = raw;
        cachedConfig = { ...DEFAULT_ADD_TO_ORDER_ANIM_CONFIG, ...parsed };
        return cachedConfig;
    } catch {
        return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
    }
}

export function saveAddToOrderAnimConfig(next: AddToOrderAnimConfig): void {
    if (typeof window === 'undefined') return;
    try {
        const raw = JSON.stringify(next);
        window.localStorage.setItem(ADD_TO_ORDER_ANIM_STORAGE_KEY, raw);
        window.localStorage.removeItem(LEGACY_ANIM_STORAGE_KEY);
        cachedRaw = raw;
        cachedConfig = next;
        window.dispatchEvent(new CustomEvent(ADD_TO_ORDER_ANIM_EVENT, { detail: next }));
    } catch {
        // ignore storage quota errors
    }
}

export function resetAddToOrderAnimConfig(): AddToOrderAnimConfig {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(ADD_TO_ORDER_ANIM_STORAGE_KEY);
            window.localStorage.removeItem(LEGACY_ANIM_STORAGE_KEY);
            cachedRaw = null;
            cachedConfig = DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
            window.dispatchEvent(
                new CustomEvent(ADD_TO_ORDER_ANIM_EVENT, { detail: DEFAULT_ADD_TO_ORDER_ANIM_CONFIG })
            );
        } catch {
            // ignore
        }
    }
    return DEFAULT_ADD_TO_ORDER_ANIM_CONFIG;
}

export function subscribeAddToOrderAnimConfig(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(ADD_TO_ORDER_ANIM_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
        window.removeEventListener(ADD_TO_ORDER_ANIM_EVENT, handler);
        window.removeEventListener('storage', handler);
    };
}

export function hexToRgbTuple(hex: string): [number, number, number] {
    const clean = hex.replace('#', '').trim();
    if (clean.length === 6) {
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
            return [r, g, b];
        }
    }
    return [204, 14, 29];
}

export function getFlyEasingString(preset: FlyEasingPreset): string {
    switch (preset) {
        case 'gravity-drop':
            return 'cubic-bezier(0.32, 0.04, 0.68, 0.98)';
        case 'spring-snap':
            return 'cubic-bezier(0.22, 1.18, 0.36, 1)';
        case 'ease-in-dip':
            return 'cubic-bezier(0.5, -0.15, 0.7, 0.95)';
        case 'linear':
            return 'linear';
        case 'smooth':
        default:
            return 'cubic-bezier(0.4, 0, 0.2, 1)';
    }
}
