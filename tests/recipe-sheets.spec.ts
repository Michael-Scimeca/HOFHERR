import { expect, test } from '@playwright/test';

const THREE_SHEETS = [
    { slug: 'salmon-parcel', expectedCut: 'Salmon' },
    { slug: 'pork-chops-parcel', expectedCut: 'Pork Chops' },
    { slug: 'chicken-thighs-parcel', expectedCut: 'Bone-In Chicken Thighs' },
];

test.describe('Printable 12x16 Recipe Cooking Sheets', () => {
    for (const { slug, expectedCut } of THREE_SHEETS) {
        test(`/recipes/${slug}/sheet renders at 12x16 in page size with no horizontal overflow`, async ({
            page,
            isMobile,
        }) => {
            const pageErrors: string[] = [];
            page.on('pageerror', err => pageErrors.push(err.message));

            await page.goto(`/recipes/${slug}/sheet`, { waitUntil: 'domcontentloaded' });

            const sheet = page.getByTestId('cooking-sheet-paper');
            await expect(sheet).toBeVisible();
            await expect(sheet).toContainText('Serves 2');
            await expect(sheet).toContainText('Quality Meats. No Compromise.');
            await expect(sheet).toContainText(
                'Oven only. Max 425°F. Keep away from the broiler, heating elements and open flame.'
            );
            await expect(sheet).toContainText(expectedCut);

            // Check no horizontal overflow in screen mode
            const screenMetrics = await page.evaluate(() => {
                const el = document.querySelector('[data-testid="cooking-sheet-paper"]') as HTMLElement | null;
                const rect = el ? el.getBoundingClientRect() : { width: 0, height: 0 };
                const maxScroll = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                return {
                    sheetWidth: rect.width,
                    sheetHeight: rect.height,
                    aspectRatio: rect.height > 0 ? rect.width / rect.height : 0,
                    maxScroll,
                    innerWidth: window.innerWidth,
                };
            });

            expect(
                screenMetrics.maxScroll <= screenMetrics.innerWidth + 1,
                `Horizontal overflow on /recipes/${slug}/sheet: scrollWidth=${screenMetrics.maxScroll} > innerWidth=${screenMetrics.innerWidth}`
            ).toBe(true);

            // 12 x 16 in ratio = 0.75; on desktop (>= 1216px) exact CSS pixel size is 1152 x 1536 px
            expect(screenMetrics.aspectRatio).toBeGreaterThan(0.74);
            expect(screenMetrics.aspectRatio).toBeLessThan(0.76);
            if (!isMobile && screenMetrics.innerWidth >= 1216) {
                expect(Math.round(screenMetrics.sheetWidth)).toBe(1152);
                expect(Math.round(screenMetrics.sheetHeight)).toBe(1536);
            }

            // Check print media: 11.5 x 15.5 in safe frame inside 12 x 16 in @page (0.25 in margin), site chrome hidden
            await page.emulateMedia({ media: 'print' });

            const printMetrics = await page.evaluate(() => {
                const el = document.querySelector('[data-testid="cooking-sheet-paper"]') as HTMLElement | null;
                const rect = el ? el.getBoundingClientRect() : { width: 0, height: 0 };
                const navHeader = document.querySelector('body > header') as HTMLElement | null;
                const toolbar = document.querySelector('[data-no-print]') as HTMLElement | null;
                return {
                    printWidth: rect.width,
                    printHeight: rect.height,
                    navDisplay: navHeader ? window.getComputedStyle(navHeader).display : 'none',
                    toolbarDisplay: toolbar ? window.getComputedStyle(toolbar).display : 'none',
                };
            });

            expect(printMetrics.navDisplay).toBe('none');
            expect(printMetrics.toolbarDisplay).toBe('none');
            expect(Math.round(printMetrics.printWidth)).toBe(1104); // 11.5 in * 96 px/in
            expect(Math.round(printMetrics.printHeight)).toBe(1488); // 15.5 in * 96 px/in
            expect(pageErrors).toHaveLength(0);
        });
    }

    test('/recipes/sheets index lists all 5 parcel sheets with thumbnails and zero horizontal overflow', async ({
        page,
    }) => {
        await page.goto('/recipes/sheets', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { level: 1 })).toContainText("Butcher's Parcel Liners");

        await expect(page.getByTestId('sheet-style-card-01')).toBeVisible();
        await expect(page.getByTestId('sheet-style-card-30')).toBeVisible();
        await expect(page.locator('[data-testid^="sheet-style-card-"]')).toHaveCount(30);

        for (const { slug } of THREE_SHEETS) {
            await expect(page.getByTestId(`sheet-index-card-${slug}`)).toBeVisible();
        }

        const overflow = await page.evaluate(() => ({
            maxScroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
            innerWidth: window.innerWidth,
        }));
        expect(overflow.maxScroll <= overflow.innerWidth + 1).toBe(true);
    });
});

