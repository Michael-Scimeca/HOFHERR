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
                const match = PRODUCT_TO_CUT_LOOKUP[item.name.trim().toLowerCase()];
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
