#!/usr/bin/env npx tsx
/**
 * One-time migration script: seeds Sanity with the hardcoded product data.
 *
 * Usage:
 *   1. Fill in NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   2. Run: npx sanity dataset export production --no-drafts (optional backup)
 *   3. Run: npx tsx scripts/migrate-to-sanity.ts
 *
 * You need a Sanity write token. Create one at:
 *   https://www.sanity.io/manage → Your Project → API → Tokens → Add token (Editor role)
 *
 * Set it as SANITY_API_WRITE_TOKEN in .env.local before running.
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === 'YOUR_PROJECT_ID') {
    console.error('❌ Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local first.');
    process.exit(1);
}
if (!token) {
    console.error('❌ Set SANITY_API_WRITE_TOKEN in .env.local first.');
    console.error('   Create a token at: https://www.sanity.io/manage → API → Tokens');
    process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

// ── Types ──
type Item = { name: string; desc?: string; price: string; inStock?: boolean };
type Category = { id: string; label: string; sub: string; emoji: string; icon?: string; items: Item[] };

// ── Hardcoded product data (copied from page.tsx) ──
// Rather than importing (page.tsx is a 'use client' component), we read & eval it.
// But the safest approach is to just paste the arrays here directly.

const MAIN_CATEGORIES: Category[] = [
    {
        id: 'beef', label: 'Beef', sub: 'Carefully Sourced from Midwest Farms', emoji: '🥩', icon: '/icons/cow.png',
        items: [
            { name: 'New York Strip', desc: 'Prime, dry-aged, cut to order. Standard cut is 1.25".', price: '$42.99/lb' },
            { name: 'Boneless Ribeye', desc: 'Standard 1.25" cut, approx. 1 lb.', price: '$40.99/lb' },
            { name: 'Bone-In Ribeye', desc: 'Prime, dry-aged. Tomahawk cut available frozen.', price: '$38.99/lb' },
            { name: 'Filet Mignon', desc: 'Standard Prime Filet is 8oz.', price: '$46.99/lb' },
            { name: 'T-Bone', desc: 'Prime, dry-aged, 1.25" cut.', price: '$36.99/lb' },
            { name: 'Porterhouse', desc: 'Standard 1.25" cut, approx. 2 lbs.', price: '$40.99/lb' },
            { name: 'Prime Rib', desc: 'Sold by the bone or rib. One rib feeds two people.', price: '$38.99/lb' },
            { name: 'Prime Beef Tenderloin', desc: 'Trimmed and tied, 3.5–5 lbs.', price: '$44.99/lb' },
            { name: 'Choice Tenderloin', price: '$34.99/lb', inStock: false },
            { name: 'Flat Iron Steak', desc: 'Second most tender cut, approx. 1 lb.', price: '$20.99/lb' },
            { name: 'Hanger Steak', desc: 'Packs between 1 and 2 lbs.', price: '$19.99/lb' },
            { name: 'Marinated Hanger Steak', price: '$21.99/lb' },
            { name: 'Skirt Steak', desc: 'All outer skirt, 1–1.5 lb packages.', price: '$28.99/lb' },
            { name: 'Center Cut Skirt Steak', desc: 'All outer skirt, 1–1.5 lb packages.', price: '$29.99/lb', inStock: false },
            { name: 'Marinated Skirt Steak', desc: 'Sesame Teriyaki marinade, approx. 1.5 lb.', price: '$30.99/lb' },
            { name: 'Marinated Center Cut Skirt Steak', price: '$31.99/lb', inStock: false },
            { name: 'Marinated Flank Steak', desc: 'Approx. 1.25–2 lbs.', price: '$22.99/lb' },
            { name: 'Flank Steak', desc: 'Approx. 1.25–2 lbs.', price: '$20.99/lb', inStock: false },
            { name: 'Kalbi', desc: 'Marinated, 1 lb ≈ 3–4 strips.', price: '$16.99/lb' },
            { name: 'Marinated Tri Tip', price: '$22.99/lb' },
            { name: 'Tri-Tip', desc: 'Also known as top sirloin roast, 1.5–2 lbs.', price: '$21.99/lb', inStock: false },
            { name: 'Picanha', desc: 'Approx. 2–3 lbs, great on the grill.', price: '$16.99/lb', inStock: false },
            { name: 'Sirloin Flap', desc: 'Each steak is about 3 lbs. Great for steak frites.', price: '$19.99/lb', inStock: false },
            { name: 'Sirloin Steak', desc: 'Standard 1.5" cut.', price: '$14.99/lb', inStock: false },
            { name: 'Kansas City Strip', desc: 'Bone-In NY Strip, 1.25" cut, sold frozen.', price: '$40.99/lb', inStock: false },
            { name: 'Butt Steak', price: '$15.99/lb', inStock: false },
            { name: 'Steak Kabob', desc: 'Pre-marinated and grill-ready.', price: '$19.99/lb', inStock: false },
            { name: 'Prime Strip Steak Kabob', price: '$24.99/lb', inStock: false },
            { name: 'Steak Fajita Mix', desc: 'Bell peppers, onions, and sauce. Ready to cook.', price: '$15.99/lb', inStock: false },
            { name: 'Steak Stir Fry Mix', desc: 'Frozen, 1.5 lbs beef + peppers + onions.', price: '$15.99/lb', inStock: false },
            { name: 'Bone In Short Ribs', desc: 'Specify braising or plate cut.', price: '$14.99/lb' },
            { name: 'Boneless Short Ribs', price: '$16.99/lb' },
            { name: 'Beef Back Ribs', desc: '7-rib slab, sold frozen.', price: '$9.99/lb', inStock: false },
            { name: 'Beef Stew Meat', desc: 'Chuck cubed for stew.', price: '$13.99/lb' },
            { name: 'Beef Shank', desc: 'Between 1.5–2 lbs each.', price: '$10.99/lb', inStock: false },
            { name: 'Beef Cheek', desc: 'Frozen 2 lb packages. Great in pasta sauce.', price: '$14.99/lb', inStock: false },
            { name: 'Whole Brisket', desc: 'For the smoker, 10–16 lbs.', price: '$10.99/lb' },
            { name: 'Brisket Deckle', desc: 'Great for smoking and burnt ends, approx. 5 lbs.', price: '$10.99/lb' },
        ],
    },
];

// NOTE: This is a STARTER with the beef category.
// The full migration needs ALL categories from the page.tsx.
// We'll extract them programmatically below.

async function migrate() {
    console.log('🥩 Hofherr Meat Co. — Sanity Migration');
    console.log(`   Project: ${projectId}`);
    console.log(`   Dataset: ${dataset}`);
    console.log('');

    // Read the actual page.tsx and extract ALL category data
    const fs = await import('fs');
    const pagePath = path.resolve(process.cwd(), 'src/app/online-orders/page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    // Extract MAIN_CATEGORIES and DEPOT_CATEGORIES using regex
    const mainMatch = pageContent.match(/const MAIN_CATEGORIES:\s*Category\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
    const depotMatch = pageContent.match(/const DEPOT_CATEGORIES:\s*Category\[\]\s*=\s*(\[[\s\S]*?\n\];)/);

    if (!mainMatch || !depotMatch) {
        console.error('❌ Could not extract category data from page.tsx');
        console.log('   Falling back to hardcoded starter data...');
    }

    // Parse the arrays using Function constructor (safe in this context — it's our own code)
    let mainCategories: Category[] = MAIN_CATEGORIES;
    let depotCategories: Category[] = [];

    try {
        if (mainMatch) {
            mainCategories = new Function(`return ${mainMatch[1]}`)() as Category[];
        }
        if (depotMatch) {
            depotCategories = new Function(`return ${depotMatch[1]}`)() as Category[];
        }
    } catch (e) {
        console.error('⚠️  Could not parse category arrays, using starter data.', e);
    }

    const allCategories = [
        ...mainCategories.map((c, i) => ({ ...c, store: 'butcher' as const, sortOrder: i })),
        ...depotCategories.map((c, i) => ({ ...c, store: 'depot' as const, sortOrder: i })),
    ];

    console.log(`📂 Found ${allCategories.length} categories`);
    console.log(`📦 Found ${allCategories.reduce((s, c) => s + c.items.length, 0)} total products`);
    console.log('');

    // Create a transaction
    let tx = client.transaction();
    let productCount = 0;

    for (const cat of allCategories) {
        const catId = `category-${cat.store}-${cat.id}`;
        console.log(`  📂 ${cat.emoji} ${cat.label} (${cat.store}) — ${cat.items.length} items`);

        tx = tx.createOrReplace({
            _id: catId,
            _type: 'category',
            id: cat.id,
            label: cat.label,
            sub: cat.sub,
            emoji: cat.emoji,
            store: cat.store,
            sortOrder: cat.sortOrder,
        });

        for (let i = 0; i < cat.items.length; i++) {
            const item = cat.items[i];
            const productId = `product-${cat.store}-${cat.id}-${i}`;

            tx = tx.createOrReplace({
                _id: productId,
                _type: 'product',
                name: item.name,
                description: item.desc || '',
                price: item.price,
                inStock: item.inStock !== false,
                sortOrder: i,
                category: { _type: 'reference', _ref: catId },
            });
            productCount++;
        }
    }

    console.log('');
    console.log(`⏳ Committing ${allCategories.length} categories + ${productCount} products…`);

    try {
        await tx.commit();
        console.log('✅ Migration complete!');
        console.log('');
        console.log('   Next steps:');
        console.log('   1. Visit http://localhost:3000/studio to see your data');
        console.log('   2. The online-orders page will now pull from Sanity');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
