import {
    AnimalId,
    ANIMAL_IDS,
    CUT_MAP_DATA,
    PRODUCT_TO_CUT_LOOKUP,
    TOTAL_CUTS_COUNT,
} from '../data/cutMap';

export interface OrderItem {
    name: string;
    qty?: number;
    price?: number | string;
    note?: string;
}

export interface CustomerOrder {
    _id?: string;
    orderNumber?: string;
    status?: string;
    createdAt?: string;
    items?: OrderItem[];
}

export interface CutStats {
    count: number;
    lastOrderedDate: string | null;
    orderedProducts: string[];
}

export interface AnimalProgress {
    animalId: AnimalId;
    collectedCount: number;
    totalCount: number;
    percent: number;
    isComplete: boolean;
}

export interface CutCollectorProgress {
    totalCollected: number;
    totalPossible: number;
    overallPercent: number;
    collectedCutKeys: Set<string>; // "animalId:cutId"
    cutStats: Record<string, CutStats>; // "animalId:cutId" -> stats
    animals: Record<AnimalId, AnimalProgress>;
    qualifyingOrderCount: number;
}

export interface OrderCutPieceItem {
    orderedName: string;
    canonicalProduct: string;
    qty: number;
}

export interface OrderCutPiece {
    key: string; // "animalId:cutId"
    animalId: AnimalId;
    animalName: string;
    wholeTitle: string;
    cutId: string;
    cutName: string;
    totalAnimalCuts: number;
    cutOrderIndex: number;
    svgPath: string;
    labelX: number;
    labelY: number;
    viewBox: string;
    pieceViewBox: string;
    cleanChartImage: string;
    vintageChartImage: string;
    woodcutPath: string;
    matchedItems: OrderCutPieceItem[];
    totalQty: number;
}

const KEYWORD_CUT_FALLBACKS: Array<{ pattern: RegExp; animalId: AnimalId; cutId: string; productName: string }> = [
    { pattern: /ribeye|tomahawk|prime rib|back rib/i, animalId: 'beef', cutId: 'rib', productName: 'Bone-In Ribeye' },
    { pattern: /new york strip|ny strip|kansas city|t-bone|porterhouse|filet|tenderloin/i, animalId: 'beef', cutId: 'short-loin', productName: 'New York Strip' },
    { pattern: /brisket|corned beef|burnt end/i, animalId: 'beef', cutId: 'brisket', productName: 'Whole Brisket' },
    { pattern: /sirloin|tri-?tip|picanha|bavette/i, animalId: 'beef', cutId: 'sirloin', productName: 'Sirloin Steak' },
    { pattern: /flank/i, animalId: 'beef', cutId: 'flank', productName: 'Flank Steak' },
    { pattern: /skirt|hanger|short rib|kalbi/i, animalId: 'beef', cutId: 'plate', productName: 'Skirt Steak' },
    { pattern: /flat iron|pot roast|chuck|stew meat/i, animalId: 'beef', cutId: 'chuck', productName: 'Flat Iron Steak' },
    { pattern: /rump|eye of round|round roast/i, animalId: 'beef', cutId: 'round', productName: 'Rump Roast' },
    { pattern: /braised beef shank|beef osso buco|beef bone broth/i, animalId: 'beef', cutId: 'shank', productName: 'Red-Wine Braised Beef Shank Osso Buco (Prepared)' },
    { pattern: /beef shank|marrow bone|knuckle bone/i, animalId: 'beef', cutId: 'shank', productName: 'Beef Shank' },
    { pattern: /braised beef cheek|barbacoa|cabeza/i, animalId: 'beef', cutId: 'head', productName: 'Braised Beef Cheek Barbacoa (Prepared)' },
    { pattern: /beef cheek/i, animalId: 'beef', cutId: 'head', productName: 'Beef Cheek' },
    { pattern: /pork belly|bacon|pancetta|porchetta/i, animalId: 'pork', cutId: 'belly', productName: 'Pork Belly' },
    { pattern: /pork chop|baby back|pork tenderloin|pork roast|crown roast|lonza/i, animalId: 'pork', cutId: 'loin', productName: 'Pork Chops' },
    { pattern: /spare rib|st\.?\s*louis|rib tip/i, animalId: 'pork', cutId: 'spare-ribs', productName: 'St. Louis Ribs' },
    { pattern: /pork shoulder|boston butt|country style rib|tasso/i, animalId: 'pork', cutId: 'shoulder', productName: 'Bone-In Pork Shoulder' },
    { pattern: /spiral.*ham|fresh ham|tavern ham|prosciutto|serrano/i, animalId: 'pork', cutId: 'ham', productName: 'Fresh Ham' },
    { pattern: /braised pork shank|ham hock.*soup|schweinshaxe/i, animalId: 'pork', cutId: 'hock-trotter', productName: 'Hardwood-Smoked Braised Pork Shank (Prepared)' },
    { pattern: /ham hock|pork shank|trotter/i, animalId: 'pork', cutId: 'hock-trotter', productName: 'Smoked Ham Hock' },
    { pattern: /pork cheek|guanciale|jowl lardon/i, animalId: 'pork', cutId: 'head-jowl', productName: 'House-Cured Crispy Guanciale Lardons (Prepared)' },
    { pattern: /pork jowl|pig ear/i, animalId: 'pork', cutId: 'head-jowl', productName: 'Smoked Pork Jowl' },
    { pattern: /chicken breast|chicken kabob|chicken fajita/i, animalId: 'chicken', cutId: 'breast', productName: 'Boneless Skin-On Breasts' },
    { pattern: /chicken wing/i, animalId: 'chicken', cutId: 'wing', productName: 'Chicken Wings' },
    { pattern: /chicken thigh/i, animalId: 'chicken', cutId: 'thigh', productName: 'Bone-In Chicken Thighs' },
    { pattern: /chicken drumstick|chicken leg/i, animalId: 'chicken', cutId: 'drumstick', productName: 'Chicken Drumsticks' },
    { pattern: /collagen.*broth|chicken bone broth|braised.*chicken feet|phoenix claw/i, animalId: 'chicken', cutId: 'feet', productName: 'Golden Collagen Chicken Bone Broth (Prepared)' },
    { pattern: /chicken feet/i, animalId: 'chicken', cutId: 'feet', productName: 'Chicken Feet' },
    { pattern: /whole fryer|whole roaster|rotisserie chicken|split chicken|chicken stock/i, animalId: 'chicken', cutId: 'back', productName: 'Rotisserie Chicken' },
    { pattern: /rack of lamb|lamb rack/i, animalId: 'lamb', cutId: 'rack', productName: 'Rack of Lamb' },
    { pattern: /lamb chop/i, animalId: 'lamb', cutId: 'loin', productName: 'Lamb Chops' },
    { pattern: /leg of lamb|lamb leg/i, animalId: 'lamb', cutId: 'leg', productName: 'Bone-In Leg Of Lamb' },
    { pattern: /lamb shoulder|merguez|merquez|ground lamb/i, animalId: 'lamb', cutId: 'shoulder', productName: 'Lamb Shoulder Roast' },
    { pattern: /braised lamb shank/i, animalId: 'lamb', cutId: 'shank', productName: 'Rosemary & Barolo Braised Lamb Shank (Prepared)' },
    { pattern: /lamb shank/i, animalId: 'lamb', cutId: 'shank', productName: 'Lamb Shank' },
    { pattern: /lamb rib/i, animalId: 'lamb', cutId: 'breast', productName: 'Lamb Ribs' },
    { pattern: /veal rib chop/i, animalId: 'veal', cutId: 'rib', productName: 'Veal Rib Chop' },
    { pattern: /veal chop/i, animalId: 'veal', cutId: 'loin', productName: 'Veal Chop' },
    { pattern: /scallopini|veal cutlet/i, animalId: 'veal', cutId: 'leg', productName: 'Veal Scallopini' },
    { pattern: /braised veal|veal osso buco|veal demi-?glace/i, animalId: 'veal', cutId: 'shank', productName: 'Classic Braised Veal Osso Buco (Prepared)' },
    { pattern: /veal shank|osso buco/i, animalId: 'veal', cutId: 'shank', productName: 'Veal Shank' },
    { pattern: /turkey breast/i, animalId: 'turkey', cutId: 'breast', productName: 'Ferndale Bone-In Turkey Breast' },
    { pattern: /turkey wing/i, animalId: 'turkey', cutId: 'wing', productName: 'Turkey Wings' },
    { pattern: /turkey thigh/i, animalId: 'turkey', cutId: 'thigh', productName: 'Turkey Thighs' },
    { pattern: /turkey leg|turkey drumstick/i, animalId: 'turkey', cutId: 'drumstick', productName: 'Smoked Turkey Legs' },
    { pattern: /ferndale turkey|smoked turkey|whole.*turkey/i, animalId: 'turkey', cutId: 'back', productName: 'Ferndale Turkey' },
    { pattern: /duck breast/i, animalId: 'duck', cutId: 'breast', productName: 'Duck Breast' },
    { pattern: /duck leg|duck confit|duck rillette|duck fat/i, animalId: 'duck', cutId: 'leg', productName: 'Duck Confit' },
    { pattern: /whole duck|duck stock/i, animalId: 'duck', cutId: 'back', productName: 'Whole Duck' },
];

const SORTED_LOOKUP_ENTRIES = Object.entries(PRODUCT_TO_CUT_LOOKUP).sort(
    (a, b) => b[0].length - a[0].length
);

/**
 * Matches an order line item name to its canonical Butcher Guide animal & primal cut.
 * Supports exact product matches, substring matches (e.g. "USDA Prime Bone-In Ribeye"),
 * and menu keyword fallbacks.
 */
export function matchProductToCut(
    rawName: string
): { animalId: AnimalId; cutId: string; productName: string } | null {
    const clean = rawName.trim().toLowerCase();
    if (!clean) return null;

    const exact = PRODUCT_TO_CUT_LOOKUP[clean];
    if (exact) return exact;

    for (const [key, val] of SORTED_LOOKUP_ENTRIES) {
        if (clean.includes(key)) {
            return val;
        }
    }

    for (const fb of KEYWORD_CUT_FALLBACKS) {
        if (fb.pattern.test(clean)) {
            return {
                animalId: fb.animalId,
                cutId: fb.cutId,
                productName: fb.productName,
            };
        }
    }

    return null;
}

function buildPieceZoomViewBox(labelX: number, labelY: number): string {
    const zoomW = 520;
    const zoomH = 388;
    const minX = Math.max(40, Math.min(1200 - zoomW - 40, Math.round(labelX - zoomW / 2)));
    const minY = Math.max(45, Math.min(896 - zoomH - 45, Math.round(labelY - zoomH / 2)));
    return `${minX} ${minY} ${zoomW} ${zoomH}`;
}

/**
 * Resolves an array of order items into their corresponding Butcher Guide to Cuts pieces.
 */
export function resolveOrderCutPieces(items: OrderItem[] | undefined): OrderCutPiece[] {
    if (!Array.isArray(items) || items.length === 0) return [];

    const pieceMap = new Map<string, OrderCutPiece>();

    for (const item of items) {
        if (!item || !item.name) continue;
        const match = matchProductToCut(item.name);
        if (!match) continue;

        const animalDef = CUT_MAP_DATA[match.animalId];
        if (!animalDef) continue;
        const cutDef = animalDef.cuts.find((c) => c.id === match.cutId);
        if (!cutDef) continue;

        const key = `${animalDef.id}:${cutDef.id}`;
        const qty = item.qty && item.qty > 0 ? item.qty : 1;

        const existing = pieceMap.get(key);
        if (existing) {
            existing.totalQty += qty;
            const existingItem = existing.matchedItems.find(
                (m) => m.orderedName.toLowerCase() === item.name.trim().toLowerCase()
            );
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                existing.matchedItems.push({
                    orderedName: item.name.trim(),
                    canonicalProduct: match.productName,
                    qty,
                });
            }
        } else {
            pieceMap.set(key, {
                key,
                animalId: animalDef.id,
                animalName: animalDef.name,
                wholeTitle: animalDef.wholeTitle,
                cutId: cutDef.id,
                cutName: cutDef.name,
                totalAnimalCuts: animalDef.cuts.length,
                cutOrderIndex: cutDef.order,
                svgPath: cutDef.svgPath,
                labelX: cutDef.labelX,
                labelY: cutDef.labelY,
                viewBox: animalDef.viewBox,
                pieceViewBox: buildPieceZoomViewBox(cutDef.labelX, cutDef.labelY),
                cleanChartImage:
                    animalDef.cleanChartImage ??
                    '/assets/identity/cut-charts/flint-flame-butcher-guide-beef-clean.jpg',
                vintageChartImage:
                    animalDef.vintageChartImage ??
                    '/assets/identity/cut-charts/flint-flame-butcher-guide-beef.jpg',
                woodcutPath: animalDef.woodcutPath ?? '',
                matchedItems: [
                    {
                        orderedName: item.name.trim(),
                        canonicalProduct: match.productName,
                        qty,
                    },
                ],
                totalQty: qty,
            });
        }
    }

    return Array.from(pieceMap.values());
}

const PAID_STATUSES = new Set([
    'paid',
    'ready_paid',
    'ready-paid',
    'ready (paid)',
    'completed',
]);

/**
 * Checks whether an order status counts as a valid, paid/completed order.
 */
export function isPaidOrder(status: string | undefined): boolean {
    if (!status) return false;
    const clean = status.trim().toLowerCase();
    return PAID_STATUSES.has(clean);
}

/**
 * Calculates a customer's cut collector progress strictly from completed orders.
 */
export function calculateCutProgress(orders: CustomerOrder[] | undefined): CutCollectorProgress {
    const collectedCutKeys = new Set<string>();
    const cutStats: Record<string, CutStats> = {};
    let qualifyingOrderCount = 0;

    if (Array.isArray(orders)) {
        for (const order of orders) {
            if (!isPaidOrder(order.status)) continue;
            qualifyingOrderCount++;

            const orderDate = order.createdAt || null;
            if (!Array.isArray(order.items)) continue;

            for (const item of order.items) {
                if (!item || !item.name) continue;
                const match = matchProductToCut(item.name);
                if (!match) continue; // Unmapped product (sausage, deli, seafood, etc.) does not count

                const key = `${match.animalId}:${match.cutId}`;
                collectedCutKeys.add(key);

                const existing = cutStats[key] || {
                    count: 0,
                    lastOrderedDate: null,
                    orderedProducts: [],
                };

                existing.count += item.qty || 1;
                if (!existing.orderedProducts.includes(match.productName)) {
                    existing.orderedProducts.push(match.productName);
                }

                if (orderDate) {
                    if (!existing.lastOrderedDate || new Date(orderDate) > new Date(existing.lastOrderedDate)) {
                        existing.lastOrderedDate = orderDate;
                    }
                }

                cutStats[key] = existing;
            }
        }
    }

    const animals: Record<AnimalId, AnimalProgress> = {} as any;

    for (const animalId of ANIMAL_IDS) {
        const animalDef = CUT_MAP_DATA[animalId];
        const total = animalDef.cuts.length;
        let collected = 0;

        for (const cut of animalDef.cuts) {
            const key = `${animalId}:${cut.id}`;
            if (collectedCutKeys.has(key)) {
                collected++;
            }
        }

        const percent = total > 0 ? Math.round((collected / total) * 100) : 0;
        animals[animalId] = {
            animalId,
            collectedCount: collected,
            totalCount: total,
            percent,
            isComplete: collected === total,
        };
    }

    const totalCollected = collectedCutKeys.size;
    const overallPercent = Math.round((totalCollected / TOTAL_CUTS_COUNT) * 100);

    return {
        totalCollected,
        totalPossible: TOTAL_CUTS_COUNT,
        overallPercent,
        collectedCutKeys,
        cutStats,
        animals,
        qualifyingOrderCount,
    };
}

export interface AnimalCompletionPayoff {
    animalId: AnimalId;
    animalName: string;
    wholeTitle: string;
    discountLabel: string;
    discountCode: string;
    freeItemTitle: string;
    freeItemCode: string;
    tshirtMilestone: string;
    boardTitle: string;
}

export const ANIMAL_COMPLETION_PAYOFFS: Record<AnimalId, AnimalCompletionPayoff> = {
    beef: {
        animalId: 'beef',
        animalName: 'Beef',
        wholeTitle: 'Whole Steer (10/10 Cuts)',
        discountLabel: '15% Off Counter Steaks & Roasts',
        discountCode: 'STEER-15',
        freeItemTitle: 'Free 1 lb Dry-Aged Ground Chuck + Truffle Butter',
        freeItemCode: 'FREE-STEER-CUT',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    pork: {
        animalId: 'pork',
        animalName: 'Pork',
        wholeTitle: 'Whole Heritage Hog (7/7 Cuts)',
        discountLabel: '15% Off Smokehouse & Berkshire Cuts',
        discountCode: 'HOG-15',
        freeItemTitle: 'Free 1 lb House-Smoked Applewood Slab Bacon',
        freeItemCode: 'FREE-BACON-LB',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    chicken: {
        animalId: 'chicken',
        animalName: 'Chicken',
        wholeTitle: 'Whole Pasture Bird (5/5 Cuts)',
        discountLabel: '15% Off Poultry & Rotisserie Counter',
        discountCode: 'ROOST-15',
        freeItemTitle: 'Free Hot-Off-The-Spit Rotisserie Chicken',
        freeItemCode: 'FREE-ROTISSERIE',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    lamb: {
        animalId: 'lamb',
        animalName: 'Lamb',
        wholeTitle: 'Whole Pasture Lamb (6/6 Cuts)',
        discountLabel: '15% Off Rack & Pasture Lamb Cuts',
        discountCode: 'LAMB-15',
        freeItemTitle: 'Free 4-Pack Housemade Moroccan Merguez Sausage',
        freeItemCode: 'FREE-MERGUEZ',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    veal: {
        animalId: 'veal',
        animalName: 'Veal',
        wholeTitle: 'Whole Milk-Fed Calf (4/4 Cuts)',
        discountLabel: '15% Off Reserve Veal Chops & Shanks',
        discountCode: 'CALF-15',
        freeItemTitle: 'Free 1 Quart 24-Hour Roasted Veal Demi-Glace',
        freeItemCode: 'FREE-DEMIGLACE',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    turkey: {
        animalId: 'turkey',
        animalName: 'Turkey',
        wholeTitle: 'Whole Ferndale Tom (5/5 Cuts)',
        discountLabel: '15% Off Holiday & Smoked Turkey Cuts',
        discountCode: 'TOM-15',
        freeItemTitle: 'Free 2 State-Fair Smoked Turkey Drumsticks + Quart Gravy',
        freeItemCode: 'FREE-TURKEY-LEGS',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
    duck: {
        animalId: 'duck',
        animalName: 'Duck',
        wholeTitle: 'Whole Pekin Drake (3/3 Cuts)',
        discountLabel: '15% Off Duck Confit, Breasts & Charcuterie',
        discountCode: 'DRAKE-15',
        freeItemTitle: 'Free Housemade Duck Confit Leg + Pint Rendered Duck Fat',
        freeItemCode: 'FREE-DUCK-CONFIT',
        tshirtMilestone: 'Counts as 1 of 2 Animals for Official Butcher Guild Tee',
        boardTitle: 'Brass Plaque on Northfield "Master of the Block" Wall Board',
    },
};

export type TangibleRewardId = 'discount' | 'free_item' | 'tshirt' | 'shop_board';

export interface TangibleRewardStatus {
    id: TangibleRewardId;
    stepLabel: string;
    icon: string;
    category: string;
    title: string;
    requirementText: string;
    description: string;
    claimCode: string;
    redeemNote: string;
    unlocked: boolean;
    currentValue: number;
    targetValue: number;
    progressPct: number;
    remainingText: string;
}

/**
 * Evaluates the 4 tangible completion rewards ("A Reward for Finishing")
 * from a customer's CutCollectorProgress.
 */
export function evaluateTangibleRewards(progress: CutCollectorProgress): TangibleRewardStatus[] {
    const completedAnimals = ANIMAL_IDS.filter((id) => progress.animals[id]?.isComplete);
    const completedCount = completedAnimals.length;
    const totalCuts = progress.totalCollected;

    // Find the animal closest to completion for helpful remaining text
    let closestAnimalId: AnimalId = 'beef';
    let bestRatio = -1;
    for (const id of ANIMAL_IDS) {
        const a = progress.animals[id];
        if (!a.isComplete && a.totalCount > 0) {
            const ratio = a.collectedCount / a.totalCount;
            if (ratio > bestRatio) {
                bestRatio = ratio;
                closestAnimalId = id;
            }
        }
    }
    const closestAnimalProg = progress.animals[closestAnimalId];
    const closestAnimalDef = CUT_MAP_DATA[closestAnimalId];
    const closestRemainingCuts = closestAnimalProg.totalCount - closestAnimalProg.collectedCount;

    // 1. Discount Reward: Unlocks at 5 primal pieces collected across the image OR 50% of any animal
    const discountTarget = 5;
    const discountUnlocked = totalCuts >= discountTarget || bestRatio >= 0.5 || completedCount >= 1;
    const discountPct = discountUnlocked
        ? 100
        : Math.min(100, Math.round((totalCuts / discountTarget) * 100));

    // 2. Free Item Reward: Unlocks upon completing ANY 1 Full Animal Chart (100% of pieces on that image)
    const firstCompletedId = completedAnimals[0] || closestAnimalId;
    const firstPayoff = ANIMAL_COMPLETION_PAYOFFS[firstCompletedId];
    const freeItemUnlocked = completedCount >= 1;
    const freeItemPct = freeItemUnlocked ? 100 : closestAnimalProg.percent;

    // 3. Official Hofherr Butcher Guild T-Shirt: Unlocks at 2 Full Animals Completed OR 15 Primal Cuts Collected
    const tshirtCutTarget = 15;
    const tshirtUnlocked = completedCount >= 2 || totalCuts >= tshirtCutTarget;
    const tshirtPct = tshirtUnlocked
        ? 100
        : Math.max(
              Math.round((completedCount / 2) * 100),
              Math.min(100, Math.round((totalCuts / tshirtCutTarget) * 100))
          );

    // 4. Name on the Shop Board ("Master of the Block" Wall of Flame at 300 Happ Rd):
    // Unlocks when completing Beef (10/10), 3 Full Animals, or All 40/40 Cuts
    const beefComplete = progress.animals.beef?.isComplete ?? false;
    const boardUnlocked = beefComplete || completedCount >= 3 || totalCuts >= TOTAL_CUTS_COUNT;
    const boardPct = boardUnlocked
        ? 100
        : Math.max(
              progress.animals.beef?.percent ?? 0,
              Math.round((completedCount / 3) * 100),
              progress.overallPercent
          );

    return [
        {
            id: 'discount',
            stepLabel: 'PAYOFF 01 · REAL DISCOUNT',
            icon: '🏷️',
            category: 'Butcher Counter Discount',
            title: '15% Off Your Next Counter Cut',
            requirementText: 'Collect 5 Primal Pieces on the Chart',
            description:
                'Valid on any hand-cut USDA Prime steak, heritage roast, or smokehouse parcel online or at the Northfield counter.',
            claimCode: 'GUILD-15OFF',
            redeemNote: 'Auto-applies at checkout or show code at pickup',
            unlocked: discountUnlocked,
            currentValue: Math.min(totalCuts, discountTarget),
            targetValue: discountTarget,
            progressPct: discountPct,
            remainingText: discountUnlocked
                ? `Unlocked (${totalCuts} pieces collected)`
                : `${Math.max(1, discountTarget - totalCuts)} more cut pieces to unlock`,
        },
        {
            id: 'free_item',
            stepLabel: 'PAYOFF 02 · FREE BUTCHER ITEM',
            icon: '🥓',
            category: '1st Whole Animal Finished',
            title: firstPayoff.freeItemTitle,
            requirementText: 'Complete 100% of Any 1 Animal Image',
            description:
                'Finish every primal piece on any single animal chart to earn a free butcher item packed in your next twine-tied pickup parcel.',
            claimCode: firstPayoff.freeItemCode,
            redeemNote: 'Added free to your next Northfield or Depot pickup',
            unlocked: freeItemUnlocked,
            currentValue: freeItemUnlocked ? closestAnimalProg.totalCount : closestAnimalProg.collectedCount,
            targetValue: closestAnimalProg.totalCount,
            progressPct: freeItemPct,
            remainingText: freeItemUnlocked
                ? `Unlocked via ${ANIMAL_COMPLETION_PAYOFFS[completedAnimals[0]].animalName} Chart!`
                : `${closestRemainingCuts} piece${closestRemainingCuts === 1 ? '' : 's'} left on ${closestAnimalDef.name} (${closestAnimalProg.collectedCount}/${closestAnimalProg.totalCount})`,
        },
        {
            id: 'tshirt',
            stepLabel: 'PAYOFF 03 · SHOP APPAREL',
            icon: '👕',
            category: 'Official Guild Gear',
            title: 'Hofherr "Master of the Block" T-Shirt',
            requirementText: 'Complete 2 Animal Charts (or 15 Cut Pieces)',
            description:
                'Heavyweight vintage-ink crimson & cream butcher shop tee printed with the Flint & Flame steer seal. Pick up your size in-shop.',
            claimCode: 'TEE-MASTERBLOCK',
            redeemNote: 'Claim your size (S–3XL) at the Northfield counter',
            unlocked: tshirtUnlocked,
            currentValue: Math.min(totalCuts, tshirtCutTarget),
            targetValue: tshirtCutTarget,
            progressPct: tshirtPct,
            remainingText: tshirtUnlocked
                ? 'Unlocked — Ready for In-Shop Pickup!'
                : `${Math.max(1, 2 - completedCount)} more animal chart (${Math.max(1, tshirtCutTarget - totalCuts)} cuts) to claim tee`,
        },
        {
            id: 'shop_board',
            stepLabel: 'PAYOFF 04 · IN-SHOP HONOR BOARD',
            icon: '🏆',
            category: 'Permanent Shop Recognition',
            title: 'Your Name on the Shop "Wall of Flame" Board',
            requirementText: 'Complete the Beef Chart (10/10) or 3 Animals',
            description:
                'Your name is stamped onto a permanent brass butcher plate mounted on the wooden Master of the Block board inside 300 Happ Rd + 10% Lifetime Guild Patronage.',
            claimCode: 'PLAQUE-WALL-300',
            redeemNote: 'Mounted above the butcher block at 300 Happ Rd, Northfield',
            unlocked: boardUnlocked,
            currentValue: beefComplete ? 10 : progress.animals.beef?.collectedCount ?? 0,
            targetValue: 10,
            progressPct: boardPct,
            remainingText: boardUnlocked
                ? 'Nameplate Earned on the Northfield Shop Board!'
                : `${10 - (progress.animals.beef?.collectedCount ?? 0)} Beef pieces left (or ${Math.max(1, 3 - completedCount)} animals) for Shop Board`,
        },
    ];
}

