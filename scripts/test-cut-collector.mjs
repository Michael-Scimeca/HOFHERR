import assert from 'node:assert';
import {
    CUT_MAP_DATA,
    PRODUCT_TO_CUT_LOOKUP,
    TOTAL_CUTS_COUNT,
} from '../src/data/cutMap.ts';
import {
    calculateCutProgress,
    isPaidOrder,
} from '../src/lib/cutCollector.ts';

console.log('--- Testing Cut Map & Collection Data Model ---');
assert.strictEqual(TOTAL_CUTS_COUNT, 40, 'Must have exactly 40 cuts');
assert.strictEqual(CUT_MAP_DATA.beef.cuts.length, 10, 'Beef has 10 cuts');
assert.strictEqual(CUT_MAP_DATA.pork.cuts.length, 7, 'Pork has 7 cuts');
assert.strictEqual(CUT_MAP_DATA.chicken.cuts.length, 6, 'Chicken has 6 cuts');
assert.strictEqual(CUT_MAP_DATA.lamb.cuts.length, 6, 'Lamb has 6 cuts');
assert.strictEqual(CUT_MAP_DATA.veal.cuts.length, 5, 'Veal has 5 cuts');
assert.strictEqual(CUT_MAP_DATA.turkey.cuts.length, 4, 'Turkey has 4 cuts');
assert.strictEqual(CUT_MAP_DATA.duck.cuts.length, 2, 'Duck has 2 cuts');
console.log('✔ All 40 cuts correctly distributed across 7 animals');

// Beef cuts checks
assert.deepStrictEqual(PRODUCT_TO_CUT_LOOKUP['beef cheek'], {
    animalId: 'beef', cutId: 'head', productName: 'Beef Cheek'
});
assert.deepStrictEqual(PRODUCT_TO_CUT_LOOKUP['boneless ribeye'], {
    animalId: 'beef', cutId: 'rib', productName: 'Boneless Ribeye'
});
assert.deepStrictEqual(PRODUCT_TO_CUT_LOOKUP['whole brisket'], {
    animalId: 'beef', cutId: 'brisket', productName: 'Whole Brisket'
});
// Unmapped checks
assert.strictEqual(PRODUCT_TO_CUT_LOOKUP['italian sausage'], undefined);
assert.strictEqual(PRODUCT_TO_CUT_LOOKUP['bone broth'], undefined);
console.log('✔ Product mapping accurate & unmapped items ignored');

// Progress calculation
assert.strictEqual(isPaidOrder('Paid'), true);
assert.strictEqual(isPaidOrder('ready_paid'), true);
assert.strictEqual(isPaidOrder('Completed'), true);
assert.strictEqual(isPaidOrder('pending'), false);

const testOrders = [
    {
        orderNumber: 'HM-1',
        status: 'Completed',
        createdAt: '2026-11-01T12:00:00Z',
        items: [
            { name: 'Boneless Ribeye', qty: 2 },
            { name: 'Whole Brisket', qty: 1 },
            { name: 'Italian Sausage', qty: 3 }, // unmapped
        ],
    },
    {
        orderNumber: 'HM-2',
        status: 'pending', // unpaid
        items: [{ name: 'Beef Cheek', qty: 1 }],
    },
    {
        orderNumber: 'HM-3',
        status: 'Ready_Paid',
        createdAt: '2026-11-04T12:00:00Z',
        items: [{ name: 'Bacon', qty: 2 }],
    },
];

const progress = calculateCutProgress(testOrders);
assert.strictEqual(progress.qualifyingOrderCount, 2);
assert.strictEqual(progress.totalCollected, 3);
assert.strictEqual(progress.collectedCutKeys.has('beef:rib'), true);
assert.strictEqual(progress.collectedCutKeys.has('beef:brisket'), true);
assert.strictEqual(progress.collectedCutKeys.has('pork:belly'), true);
assert.strictEqual(progress.collectedCutKeys.has('beef:head'), false); // pending order was ignored
console.log('✔ Cut progress accurately calculated from orders');

// Animal completion check
const duckOrders = [
    {
        orderNumber: 'HM-DUCK',
        status: 'paid',
        items: [
            { name: 'Duck Breast', qty: 2 },
            { name: 'Duck Legs', qty: 2 },
        ],
    },
];
const duckProgress = calculateCutProgress(duckOrders);
assert.strictEqual(duckProgress.animals.duck.isComplete, true);
assert.strictEqual(duckProgress.animals.duck.percent, 100);
console.log('✔ Whole animal stamp completion confirmed');

console.log('\n🎉 ALL CUT COLLECTOR ASSERTIONS PASSED!');
