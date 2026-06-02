import { adminClient } from '@/sanity/adminClient';

/**
 * Decrement stock quantities in Sanity after a successful order.
 *
 * For each ordered item, looks up the product by name, decreases its
 * stockQuantity by the ordered qty, and auto-updates stockStatus
 * (in-stock → low-stock → out-of-stock) based on the site threshold.
 *
 * Runs silently — logs warnings but never throws, so it won't break
 * the checkout or webhook flow if a product name doesn't match.
 */
export async function decrementStock(
    items: Array<{ name: string; qty: number }>
): Promise<{ updated: number; errors: string[] }> {
    let updated = 0;
    const errors: string[] = [];

    try {
        // Fetch the low-stock threshold from site settings
        const settings = await adminClient.fetch(
            `*[_type == "siteSettings"][0] { lowStockThreshold }`
        );
        const threshold = settings?.lowStockThreshold ?? 3;

        for (const item of items) {
            if (!item.name) continue;

            try {
                // Find the product by exact name match
                const product = await adminClient.fetch(
                    `*[_type == "product" && name == $name][0] { _id, stockQuantity, stockStatus }`,
                    { name: item.name }
                );

                if (!product) {
                    console.warn(`[Stock] Product not found: "${item.name}" — skipping decrement`);
                    errors.push(`Not found: ${item.name}`);
                    continue;
                }

                const currentQty = product.stockQuantity ?? 5;
                const newQty = Math.max(0, currentQty - (item.qty || 1));

                // Determine the correct status based on new quantity
                let newStatus = product.stockStatus;
                if (newQty === 0) {
                    newStatus = 'out-of-stock';
                } else if (newQty <= threshold) {
                    newStatus = 'low-stock';
                }
                // Don't override pre-order or seasonal statuses to in-stock
                // They were set intentionally by the admin

                await adminClient
                    .patch(product._id)
                    .set({
                        stockQuantity: newQty,
                        stockStatus: newStatus,
                    })
                    .commit();

                updated++;
                console.log(
                    `[Stock] ${item.name}: ${currentQty} → ${newQty} (ordered ${item.qty}) — status: ${newStatus}`
                );
            } catch (itemErr) {
                console.error(`[Stock] Failed to decrement "${item.name}":`, itemErr);
                errors.push(`Failed: ${item.name}`);
            }
        }
    } catch (err) {
        console.error('[Stock] Fatal error in decrementStock:', err);
        errors.push('Fatal: settings fetch failed');
    }

    return { updated, errors };
}
