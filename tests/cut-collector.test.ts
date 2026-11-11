import { describe, it, expect } from 'vitest';
import {
    CUT_MAP_DATA,
    PRODUCT_TO_CUT_LOOKUP,
    TOTAL_CUTS_COUNT,
} from '@/data/cutMap';
import {
    calculateCutProgress,
    isPaidOrder,
    CustomerOrder,
} from '@/lib/cutCollector';

describe('Cut Map & Collection Data Model', () => {
    it('has all cuts across 7 animals', () => {
        expect(TOTAL_CUTS_COUNT).toBe(41);
        expect(CUT_MAP_DATA.beef.cuts.length).toBe(10);
        expect(CUT_MAP_DATA.pork.cuts.length).toBe(7);
        expect(CUT_MAP_DATA.chicken.cuts.length).toBe(6);
        expect(CUT_MAP_DATA.lamb.cuts.length).toBe(6);
        expect(CUT_MAP_DATA.veal.cuts.length).toBe(5);
        expect(CUT_MAP_DATA.turkey.cuts.length).toBe(4);
        expect(CUT_MAP_DATA.duck.cuts.length).toBe(3);
    });

    it('maps specified retail cuts to exact animals and cuts', () => {
        // Beef checks
        expect(PRODUCT_TO_CUT_LOOKUP['beef cheek']).toEqual({
            animalId: 'beef',
            cutId: 'head',
            productName: 'Beef Cheek',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['boneless ribeye']).toEqual({
            animalId: 'beef',
            cutId: 'rib',
            productName: 'Boneless Ribeye',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['new york strip']).toEqual({
            animalId: 'beef',
            cutId: 'short-loin',
            productName: 'New York Strip',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['filet mignon']).toEqual({
            animalId: 'beef',
            cutId: 'short-loin',
            productName: 'Filet Mignon',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['whole brisket']).toEqual({
            animalId: 'beef',
            cutId: 'brisket',
            productName: 'Whole Brisket',
        });

        // Pork checks
        expect(PRODUCT_TO_CUT_LOOKUP['bacon']).toEqual({
            animalId: 'pork',
            cutId: 'belly',
            productName: 'Bacon',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['pork chops']).toEqual({
            animalId: 'pork',
            cutId: 'loin',
            productName: 'Pork Chops',
        });

        // Poultry & waterfowl checks
        expect(PRODUCT_TO_CUT_LOOKUP['boneless skinless chicken breast']).toEqual({
            animalId: 'chicken',
            cutId: 'breast',
            productName: 'Boneless Skinless Chicken Breast',
        });
        expect(PRODUCT_TO_CUT_LOOKUP['duck breast']).toEqual({
            animalId: 'duck',
            cutId: 'breast',
            productName: 'Duck Breast',
        });
    });

    it('does NOT map unlisted products (sausage, deli, seafood, soups, burgers)', () => {
        expect(PRODUCT_TO_CUT_LOOKUP['italian sausage']).toBeUndefined();
        expect(PRODUCT_TO_CUT_LOOKUP['bratwurst']).toBeUndefined();
        expect(PRODUCT_TO_CUT_LOOKUP['salmon filet']).toBeUndefined();
        expect(PRODUCT_TO_CUT_LOOKUP['bone broth']).toBeUndefined();
        expect(PRODUCT_TO_CUT_LOOKUP['burger patty']).toBeUndefined();
        expect(PRODUCT_TO_CUT_LOOKUP['deli turkey breast']).toBeUndefined();
    });
});

describe('Cut Collector Progress Calculation', () => {
    it('correctly handles paid vs pending orders', () => {
        expect(isPaidOrder('Paid')).toBe(true);
        expect(isPaidOrder('ready_paid')).toBe(true);
        expect(isPaidOrder('Completed')).toBe(true);
        expect(isPaidOrder('pending')).toBe(false);
        expect(isPaidOrder('cancelled')).toBe(false);
    });

    it('returns empty progress when orders are empty or unpaid', () => {
        const pendingOrders: CustomerOrder[] = [
            {
                orderNumber: 'HM-100',
                status: 'pending',
                items: [{ name: 'Boneless Ribeye', qty: 2 }],
            },
        ];
        const res = calculateCutProgress(pendingOrders);
        expect(res.totalCollected).toBe(0);
        expect(res.overallPercent).toBe(0);
        expect(res.qualifyingOrderCount).toBe(0);
    });

    it('accurately calculates progress for completed orders', () => {
        const orders: CustomerOrder[] = [
            {
                orderNumber: 'HM-101',
                status: 'Completed',
                createdAt: '2026-11-01T12:00:00Z',
                items: [
                    { name: 'Boneless Ribeye', qty: 2 },
                    { name: 'Whole Brisket', qty: 1 },
                    { name: 'Italian Sausage', qty: 3 }, // Should not count
                ],
            },
            {
                orderNumber: 'HM-102',
                status: 'Ready_Paid',
                createdAt: '2026-11-05T14:30:00Z',
                items: [
                    { name: 'Bacon', qty: 1 },
                ],
            },
        ];

        const res = calculateCutProgress(orders);
        expect(res.qualifyingOrderCount).toBe(2);
        expect(res.totalCollected).toBe(3); // Rib, Brisket, Belly
        expect(res.collectedCutKeys.has('beef:rib')).toBe(true);
        expect(res.collectedCutKeys.has('beef:brisket')).toBe(true);
        expect(res.collectedCutKeys.has('pork:belly')).toBe(true);

        // Stats check
        expect(res.cutStats['beef:rib'].count).toBe(2);
        expect(res.cutStats['beef:rib'].lastOrderedDate).toBe('2026-11-01T12:00:00Z');
        expect(res.animals.beef.collectedCount).toBe(2);
        expect(res.animals.beef.totalCount).toBe(10);
        expect(res.animals.beef.isComplete).toBe(false);

        expect(res.animals.pork.collectedCount).toBe(1);
        expect(res.animals.pork.totalCount).toBe(7);
    });

    it('detects a completed animal when all cuts are ordered', () => {
        const duckOrder: CustomerOrder = {
            orderNumber: 'HM-999',
            status: 'paid',
            items: [
                { name: 'Duck Breast', qty: 2 },
                { name: 'Duck Legs', qty: 2 },
            ],
        };

        const res = calculateCutProgress([duckOrder]);
        expect(res.animals.duck.collectedCount).toBe(2);
        expect(res.animals.duck.totalCount).toBe(2);
        expect(res.animals.duck.isComplete).toBe(true);
        expect(res.animals.duck.percent).toBe(100);
    });
});
