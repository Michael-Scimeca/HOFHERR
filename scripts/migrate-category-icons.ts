/**
 * Upload animal icon PNGs to Sanity and attach them to categories
 * Run: npx tsx scripts/migrate-category-icons.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_WRITE_TOKEN!,
    apiVersion: '2024-01-01',
    useCdn: false,
});

// Map category IDs to their icon filenames
const ICON_MAP: Record<string, string> = {
    beef: 'cow.png',
    pork: 'pig.png',
    chicken: 'chicken.png',
    sausage: 'suage.png',
    deli: 'hamcheese.png',
    prepared: 'prepared.png',
    lamb: 'lamb.png',
    seafood: 'fish.png',
    veal: 'veal.png',
    turkey: 'turkey.png',
    duck: 'duck.png',
    game: 'game.png',
    soups: 'stocksoup.png',
    catering: 'catering.png',
    pastries: 'pastries.png',
    'hot-beverages': 'hotbeverage.png',
    'grab-go': 'grabgo.png',
    'soups-stocks': 'stocksoup.png',
    produce: 'produce.png',
    dairy: 'dairy.png',
    pantry: 'pantry.png',
    bread: 'bread.png',
    beverages: 'coldbeverage.png',
    swag: 'swag.png',
    festival: 'festival.png',
};

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

async function migrate() {
    console.log('🖼️  Uploading animal icons to Sanity...\n');

    const categories = await client.fetch('*[_type == "category"]{ _id, id, label }');
    console.log(`📂 Found ${categories.length} categories\n`);

    let uploaded = 0;
    let skipped = 0;

    for (const cat of categories) {
        const iconFile = ICON_MAP[cat.id];
        if (!iconFile) {
            console.log(`   ⏭️  ${cat.label} — no icon mapping`);
            skipped++;
            continue;
        }

        const iconPath = path.join(ICONS_DIR, iconFile);
        if (!fs.existsSync(iconPath)) {
            console.log(`   ⚠️  ${cat.label} — icon not found: ${iconFile}`);
            skipped++;
            continue;
        }

        const imageBuffer = fs.readFileSync(iconPath);
        const asset = await client.assets.upload('image', imageBuffer, {
            filename: iconFile,
            contentType: 'image/png',
        });

        await client
            .patch(cat._id)
            .set({
                icon: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id },
                },
            })
            .commit();

        console.log(`   ✅ ${cat.label} → ${iconFile}`);
        uploaded++;
    }

    console.log(`\n🎉 Done! Uploaded: ${uploaded}, Skipped: ${skipped}`);
}

migrate().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
