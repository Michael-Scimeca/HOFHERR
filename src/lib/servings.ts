/**
 * Serving-size & headcount estimation utilities for butcher cuts, BBQ, and sides.
 * Helps customers translate weights and quantities into "people fed".
 */

export interface ServingEstimate {
    min: number;
    max: number;
    label: string;
}

type ServingRule = {
    pattern: RegExp;
    /** Ounces per person [minOz, maxOz] */
    ozPerPerson: [number, number];
};

const SERVING_RULES: ServingRule[] = [
    // Bone-in cuts & ribs need more raw weight per person
    {
        pattern: /\b(ribs?|spare\s*ribs?|baby\s*back|bone-in|porterhouse|t-bone|tomahawk|osso\s*bucco|shank|chuck\s*roast|standing\s*rib)\b/i,
        ozPerPerson: [12, 16],
    },
    // Smoked / cooked BBQ meats
    {
        pattern: /\b(brisket|pulled\s*pork|smoked\s*turkey|burnt\s*ends|tri-tip|pastrami|bbq)\b/i,
        ozPerPerson: [6, 8],
    },
    // Sides, salads, beans, mac & cheese
    {
        pattern: /\b(mac|cheese|slaw|beans|potato\s*salad|cornbread|greens|chili|soup|sauce|gravy|dip)\b/i,
        ozPerPerson: [4, 6],
    },
    // Sausages, brats, links, hot dogs
    {
        pattern: /\b(sausage|brat|bratwurst|kielbasa|chorizo|hot\s*dog|link|andouille)\b/i,
        ozPerPerson: [6, 8],
    },
    // Ground meat, burgers, patties
    {
        pattern: /\b(ground|burger|patty|patties|meatball|meatloaf)\b/i,
        ozPerPerson: [6, 8],
    },
];

// Default boneless steak / roast / poultry rule: 8–10 oz per person
const DEFAULT_OZ_PER_PERSON: [number, number] = [8, 10];

/**
 * Extracts total weight in ounces from an item's name, price string, or description.
 * Returns null if no weight/tray/pack size can be inferred.
 */
function inferOuncesPerUnit(name: string, price = '', desc = ''): number | null {
    const text = `${name} ${price} ${desc}`.toLowerCase();

    // Explicit pounds: e.g. "2 lb", "2.5 lbs", "1.5lb", "/lb"
    const lbMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/);
    if (lbMatch) {
        return parseFloat(lbMatch[1]) * 16;
    }

    // Explicit ounces: e.g. "16 oz", "12oz"
    const ozMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:oz|ounces?)\b/);
    if (ozMatch) {
        return parseFloat(ozMatch[1]);
    }

    // Priced per pound ("/lb" or "per lb") -> 1 unit = 1 lb (16 oz)
    if (/\/\s*lb\b|\bper\s+lb\b/i.test(text)) {
        return 16;
    }

    // Catering / tray sizes
    if (/\bfull\s*tray\b/i.test(text)) return 160; // ~10 lbs
    if (/\bhalf\s*tray\b/i.test(text)) return 80;  // ~5 lbs

    // Count-based packs
    if (/\bdozen\b|\b12\s*(?:pk|pack|pc|pcs|pieces)\b/i.test(text)) return 48;
    const packMatch = text.match(/(\d+)\s*(?:pk|pack|pc|pcs|pieces|links|patties|steaks)\b/i);
    if (packMatch) {
        return parseInt(packMatch[1], 10) * 6;
    }

    return null;
}

/**
 * Estimates how many people a single item (multiplied by qty) will feed.
 * Returns null when the item doesn't have an inferable weight or pack size.
 */
export function estimateItemServings(item: {
    name: string;
    price?: string;
    desc?: string;
    qty?: number;
}): ServingEstimate | null {
    const ozPerUnit = inferOuncesPerUnit(item.name, item.price, item.desc);
    if (ozPerUnit === null || ozPerUnit <= 0) return null;

    const qty = Math.max(1, item.qty ?? 1);
    const totalOz = ozPerUnit * qty;

    const matchedRule = SERVING_RULES.find((r) => r.pattern.test(`${item.name} ${item.desc ?? ''}`));
    const [minOz, maxOz] = matchedRule ? matchedRule.ozPerPerson : DEFAULT_OZ_PER_PERSON;

    // More oz per person = fewer people fed; fewer oz per person = more people fed
    const minPeople = Math.max(1, Math.floor(totalOz / maxOz));
    const maxPeople = Math.max(minPeople, Math.round(totalOz / minOz));

    const label =
        minPeople === maxPeople
            ? `Serves ~${minPeople}`
            : `Serves ~${minPeople}–${maxPeople}`;

    return { min: minPeople, max: maxPeople, label };
}

/**
 * Sums estimated servings across all items in a cart.
 */
export function estimateCartServings(
    items: Array<{ name: string; price?: string; desc?: string; qty: number }>
): ServingEstimate | null {
    let totalMin = 0;
    let totalMax = 0;
    let hasEstimate = false;

    for (const item of items) {
        const est = estimateItemServings(item);
        if (est) {
            totalMin += est.min;
            totalMax += est.max;
            hasEstimate = true;
        }
    }

    if (!hasEstimate || totalMax <= 0) return null;

    const label =
        totalMin === totalMax
            ? `Feeds ~${totalMin} ${totalMin === 1 ? 'person' : 'people'}`
            : `Feeds ~${totalMin}–${totalMax} people`;

    return { min: totalMin, max: totalMax, label };
}
