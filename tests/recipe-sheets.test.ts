import { describe, expect, it } from 'vitest';
import { buildQrSvgPath, encodeQrMatrix } from '../src/lib/qr-code';
import { RECIPES } from '../src/app/recipes/recipes';
import {
    PARCEL_OVEN_SAFETY_WARNING,
    PARCEL_SHEET_CONFIGS,
    SHEET_SERVINGS,
    SHEET_STYLE_CONCEPTS,
    SKIPPED_RECIPES,
    getAllCookingSheets,
    getSheetStyleConcept,
    hasCookingSheet,
    resolveCookingSheet,
} from '../src/app/recipes/sheets-data';

describe('Recipe on the Paper — Cooking Sheets Data & QR Encoder', () => {
    it('classifies every single recipe in RECIPES via parcelFriendly as either parcel-friendly or skipped without overlap', () => {
        const sheetSlugs = PARCEL_SHEET_CONFIGS.map(s => s.slug);
        const skippedSlugs = SKIPPED_RECIPES.map(s => s.slug);
        const allRecipeSlugs = RECIPES.map(r => r.slug);

        const trueSlugs = RECIPES.filter(r => r.parcelFriendly).map(r => r.slug);
        const falseSlugs = RECIPES.filter(r => !r.parcelFriendly).map(r => r.slug);

        expect(new Set(sheetSlugs)).toEqual(new Set(trueSlugs));
        expect(new Set(skippedSlugs)).toEqual(new Set(falseSlugs));
        expect(skippedSlugs.length).toBe(43);

        const combined = [...sheetSlugs, ...skippedSlugs];
        expect(combined.length).toBe(allRecipeSlugs.length);
        expect(new Set(combined)).toEqual(new Set(allRecipeSlugs));
    });

    it('resolves all parcel sheets to 2 servings with USDA safe temps, safety warning, and hofherrmeatco.com QR', () => {
        expect(PARCEL_OVEN_SAFETY_WARNING).toBe(
            'Oven only. Max 425°F. Keep away from the broiler, heating elements and open flame.'
        );
        const sheets = getAllCookingSheets();
        expect(sheets.length).toBe(5);

        for (const sheet of sheets) {
            expect(sheet.recipe.parcelFriendly).toBe(true);
            expect(sheet.servings).toBe(SHEET_SERVINGS);
            expect(hasCookingSheet(sheet.slug)).toBe(true);
            expect(sheet.onlineOrderQrUrl).toBe('https://hofherrmeatco.com/');
            expect(sheet.onlineOrderPath).toContain('/online-orders?q=');
            expect(sheet.zones.length).toBeGreaterThanOrEqual(5);
            for (const z of sheet.zones) {
                expect(z.label.trim().length).toBeGreaterThan(0);
                expect(z.widthIn).toBeGreaterThan(0);
                expect(z.heightIn).toBeGreaterThan(0);
            }
        }

        expect(resolveCookingSheet('salmon')).toBeNull();
        expect(hasCookingSheet('salmon')).toBe(false);
        expect(resolveCookingSheet('pork-tenderloin')).toBeNull();
        expect(hasCookingSheet('pork-tenderloin')).toBe(false);
        expect(resolveCookingSheet('brisket')).toBeNull();
        expect(hasCookingSheet('brisket')).toBe(false);
    });

    it('encodes valid ISO/IEC 18004 QR matrices with intact 7x7 finder patterns', () => {
        const url = 'https://hofherrmeatco.com/online-orders?q=Pork%20Chops';
        const matrix = encodeQrMatrix(url);
        expect(matrix.length).toBe(33); // Version 4 (33x33)

        // Top-left 7x7 finder outer ring + 3x3 center
        for (let i = 0; i < 7; i++) {
            expect(matrix[0][i]).toBe(true);
            expect(matrix[6][i]).toBe(true);
            expect(matrix[i][0]).toBe(true);
            expect(matrix[i][6]).toBe(true);
        }
        expect(matrix[3][3]).toBe(true);

        const svg = buildQrSvgPath(url, 2);
        expect(svg.viewSize).toBe(37);
        expect(svg.path.startsWith('M')).toBe(true);
    });

    it('defines all 30 Nano Banana 12x16 sheet style directions with unique kebab-case slugs and assets', () => {
        expect(SHEET_STYLE_CONCEPTS.length).toBe(30);
        const slugs = SHEET_STYLE_CONCEPTS.map(s => s.slug);
        const numbers = SHEET_STYLE_CONCEPTS.map(s => s.number);
        expect(new Set(slugs).size).toBe(30);
        expect(new Set(numbers).size).toBe(30);

        SHEET_STYLE_CONCEPTS.forEach((concept, index) => {
            expect(concept.number).toBe(String(index + 1).padStart(2, '0'));
            expect(concept.image).toMatch(/^\/assets\/recipes\/sheets\/styles\/[a-z0-9-]+\.jpg$/);
            expect(getSheetStyleConcept(concept.slug)?.title).toBe(concept.title);
        });
    });
});

