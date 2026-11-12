/* Scaling helpers for /recipes-test: ingredient amounts, how much meat to order, and cost. */

import type { BuyItem } from './recipes';

const MEASURES = new Set(['tsp', 'tbsp', 'cup', 'cups', 'lb', 'oz']);
/** Measures that never change form ("2 lb", "3 tbsp"). */
const FIXED_MEASURES = new Set(['tsp', 'tbsp', 'lb', 'oz']);

const PLURALS: Record<string, string> = {
    cup: 'cups',
    onion: 'onions',
    carrot: 'carrots',
    stalk: 'stalks',
    clove: 'cloves',
    sprig: 'sprigs',
    can: 'cans',
    lemon: 'lemons',
    lime: 'limes',
    orange: 'oranges',
    leaf: 'leaves',
    jalapeño: 'jalapeños',
    scallion: 'scallions',
    tortilla: 'tortillas',
};
const SINGULARS: Record<string, string> = Object.fromEntries(Object.entries(PLURALS).map(([s, p]) => [p, s]));

const FRACTIONS: [number, string][] = [
    [0, ''],
    [0.25, '1/4'],
    [1 / 3, '1/3'],
    [0.5, '1/2'],
    [2 / 3, '2/3'],
    [0.75, '3/4'],
    [1, ''],
];

function parseAmount(raw: string): number {
    const [a, b] = raw.split('/');
    return b ? Number(a) / Number(b) : Number(a);
}

/** A measured amount as a kitchen fraction: 1.5 -> "1 1/2", 0.33 -> "1/3". */
function formatMeasure(value: number): { text: string; value: number } {
    let whole = Math.floor(value + 1e-9);
    const rest = value - whole;
    let best = FRACTIONS[0];
    for (const f of FRACTIONS) {
        if (Math.abs(f[0] - rest) < Math.abs(best[0] - rest)) best = f;
    }
    let label = best[1];
    if (best[0] === 1) whole += 1;
    if (whole === 0 && !label) label = '1/4';
    const rounded = whole + (best[0] === 1 ? 0 : best[0]) || 0.25;
    return { text: whole && label ? `${whole} ${label}` : whole ? String(whole) : label, value: rounded };
}

/** A counted item (cloves, onions): whole numbers, with a half allowed below one. */
function formatCount(value: number): { text: string; value: number } {
    if (value < 0.75) return { text: '1/2', value: 0.5 };
    const n = Math.round(value);
    return { text: String(n), value: n };
}

/** Pluralize or singularize the noun that follows a scaled number ("1 cup" -> "2 cups"). */
function fixNoun(after: string, value: number): string {
    const tokens = after.split(/(\s+)/);
    let seen = 0;
    for (let i = 0; i < tokens.length && seen < 3; i++) {
        const token = tokens[i];
        if (!token.trim()) continue;
        seen++;
        const match = token.match(/^([A-Za-zñ]+)(.*)$/);
        if (!match) break;
        const word = match[1].toLowerCase();
        if (FIXED_MEASURES.has(word)) break;
        const many = value > 1;
        if (many && PLURALS[word]) {
            tokens[i] = PLURALS[word] + match[2];
            break;
        }
        if (!many && SINGULARS[word]) {
            tokens[i] = SINGULARS[word] + match[2];
            break;
        }
        if (PLURALS[word] || SINGULARS[word]) break;
    }
    return tokens.join('');
}

/** Scale every {number} in an ingredient line by `factor`. */
export function scaleIngredient(line: string, factor: number): string {
    const parts = line.split(/\{([^}]+)\}/);
    let out = parts[0];
    for (let i = 1; i < parts.length; i += 2) {
        const raw = parts[i];
        let after = parts[i + 1] ?? '';
        if (factor === 1) {
            out += raw + after;
            continue;
        }
        const firstWord = (after.trim().split(/\s+/)[0] ?? '').toLowerCase().replace(/[^a-zñ]/g, '');
        const scaled = parseAmount(raw) * factor;
        const shown = MEASURES.has(firstWord) ? formatMeasure(scaled) : formatCount(scaled);
        after = fixNoun(after, shown.value);
        out += shown.text + after;
    }
    return out;
}

export type BuyPlan = {
    item: BuyItem;
    /** Number to put in the cart (pieces, packages, quarts). */
    qty: number;
    /** Total pounds needed, for by-the-pound items. */
    lb: number | null;
    cost: number;
    /** "1 roast, about 2.75 lb" or "1 quart". */
    label: string;
};

const plural = (word: string, n: number) => (n === 1 ? word : `${word}s`);
const trimNumber = (n: number) => String(Math.round(n * 100) / 100);

/** How much of one Hofherr product to order for a scaled recipe, and roughly what it costs. */
export function planBuy(item: BuyItem, factor: number): BuyPlan {
    if (item.unit === 'each') {
        const qty = Math.max(1, Math.ceil(item.baseAmount * factor - 0.01));
        return { item, qty, lb: null, cost: qty * item.unitPrice, label: `${qty} ${plural(item.pieceLabel, qty)}` };
    }
    const lb = Math.max(0.25, Math.round(item.baseAmount * factor * 4) / 4);
    const qty = item.single || !item.pieceLb ? 1 : Math.max(1, Math.ceil(lb / item.pieceLb - 0.15));
    return {
        item,
        qty,
        lb,
        cost: lb * item.unitPrice,
        label: `${qty} ${plural(item.pieceLabel, qty)}, about ${trimNumber(lb)} lb`,
    };
}

export const formatMoney = (amount: number) =>
    amount >= 100 ? `$${Math.round(amount)}` : `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;

/** Round an estimate to a friendly figure: $36.72 -> "$37". */
export const formatEstimate = (amount: number) => `$${Math.round(amount)}`;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The next Saturday pickup that still leaves `leadDays` of notice, and the day to order by.
 * `today` is a YYYY-MM-DD string so the server and the browser agree on the date.
 */
export function pickupWindow(today: string, leadDays: number): { orderBy: string; pickup: string; orderToday: boolean } {
    const [y, m, d] = today.split('-').map(Number);
    const start = new Date(y, m - 1, d);
    const pickup = new Date(start);
    pickup.setDate(pickup.getDate() + leadDays);
    while (pickup.getDay() !== 6) pickup.setDate(pickup.getDate() + 1);
    const orderBy = new Date(pickup);
    orderBy.setDate(orderBy.getDate() - leadDays);
    const fmt = (date: Date) => `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
    return { orderBy: fmt(orderBy), pickup: fmt(pickup), orderToday: orderBy.getTime() === start.getTime() };
}
