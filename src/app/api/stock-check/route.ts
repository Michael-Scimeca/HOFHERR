import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

type Product = {
    _id: string;
    name: string;
    stockQuantity: number | null;
    stockStatus: string;
    category: string | null;
};

type Settings = {
    lowStockThreshold: number;
    stockAlertEmail: string | null;
    stockAlertsEnabled: boolean;
};

/**
 * GET /api/stock-check
 *
 * Scans all products, compares stockQuantity against the
 * low-stock threshold from Site Settings, and:
 *  1. Auto-updates stockStatus to 'low-stock' or 'out-of-stock'
 *  2. Returns a list of products that are low or out of stock
 *  3. (Future) Can trigger email notifications
 *
 * Call this on a cron schedule (e.g. Vercel Cron) or manually.
 */
export async function GET() {
    try {
        // 1. Get settings
        const settings: Settings = await client.fetch(`
            *[_type == "siteSettings"][0] {
                lowStockThreshold,
                stockAlertEmail,
                stockAlertsEnabled
            }
        `);

        const threshold = settings?.lowStockThreshold ?? 3;

        // 2. Get all products with stock info
        const products: Product[] = await client.fetch(`
            *[_type == "product"] {
                _id,
                name,
                stockQuantity,
                stockStatus,
                "category": category->label
            }
        `);

        const lowStock: Product[] = [];
        const outOfStock: Product[] = [];
        const statusUpdates: { id: string; name: string; oldStatus: string; newStatus: string }[] = [];

        for (const product of products) {
            const qty = product.stockQuantity ?? 5; // default to 5 if not set

            // Determine correct status based on quantity
            let correctStatus = product.stockStatus;
            if (qty === 0) {
                correctStatus = 'out-of-stock';
            } else if (qty <= threshold) {
                correctStatus = 'low-stock';
            } else if (product.stockStatus === 'low-stock' || product.stockStatus === 'out-of-stock') {
                // Stock was replenished — set back to in-stock
                correctStatus = 'in-stock';
            }

            // Auto-update status if it changed
            if (correctStatus !== product.stockStatus) {
                await client
                    .patch(product._id)
                    .set({ stockStatus: correctStatus })
                    .commit();

                statusUpdates.push({
                    id: product._id,
                    name: product.name,
                    oldStatus: product.stockStatus,
                    newStatus: correctStatus,
                });
            }

            // Collect alerts
            if (qty === 0) {
                outOfStock.push(product);
            } else if (qty <= threshold) {
                lowStock.push(product);
            }
        }

        // 3. Build the alert summary
        const alertItems = [
            ...outOfStock.map((p) => `🔴 OUT: ${p.name} (${p.category ?? 'Uncategorized'}) — 0 units`),
            ...lowStock.map((p) => `🔥 LOW: ${p.name} (${p.category ?? 'Uncategorized'}) — ${p.stockQuantity} units`),
        ];

        // 4. If alerts enabled and there are low-stock items, log them
        //    (Email integration can be added here with SendGrid, Resend, etc.)
        if (settings?.stockAlertsEnabled && alertItems.length > 0 && settings?.stockAlertEmail) {
            // TODO: Integrate with an email service (SendGrid, Resend, Postmark)
            // For now, the alert data is returned in the API response
            // and can be consumed by Vercel Cron, Zapier, or any webhook
            console.log(`📧 Stock alert for ${settings.stockAlertEmail}:`);
            alertItems.forEach((item) => console.log(`   ${item}`));
        }

        return NextResponse.json({
            ok: true,
            threshold,
            totalProducts: products.length,
            lowStockCount: lowStock.length,
            outOfStockCount: outOfStock.length,
            statusUpdated: statusUpdates.length,
            alerts: alertItems,
            statusChanges: statusUpdates,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Stock check error:', error);
        return NextResponse.json(
            { ok: false, error: 'Failed to check stock levels' },
            { status: 500 },
        );
    }
}
