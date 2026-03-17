/**
 * Migrate existing products from inStock boolean → stockStatus string
 * Run: npx tsx scripts/migrate-stock-status.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_WRITE_TOKEN!,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function migrate() {
    console.log('🔄 Migrating inStock → stockStatus...\n');

    const products = await client.fetch('*[_type == "product"]{ _id, name, inStock }');
    console.log(`📦 Found ${products.length} products\n`);

    const tx = client.transaction();

    let inStockCount = 0;
    let outOfStockCount = 0;

    for (const product of products) {
        const status = product.inStock === false ? 'out-of-stock' : 'in-stock';
        if (status === 'out-of-stock') outOfStockCount++;
        else inStockCount++;

        tx.patch(product._id, (p: any) =>
            p.set({ stockStatus: status, stockQuantity: status === 'in-stock' ? 5 : 0 })
             .unset(['inStock'])
        );
    }

    console.log(`   ✅ In stock: ${inStockCount}`);
    console.log(`   🔴 Out of stock: ${outOfStockCount}\n`);
    console.log('⏳ Committing...');

    await tx.commit();
    console.log('✅ Migration complete!\n');
}

migrate().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
