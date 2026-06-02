import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * GET /api/admin/inventory
 * Returns all products with stock info + sales data from orders.
 */
export async function GET() {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const [products, settings, orders, categories] = await Promise.all([
            adminClient.fetch(`
                *[_type == "product"] | order(category->label asc, sortOrder asc, name asc) {
                    _id,
                    name,
                    price,
                    salePrice,
                    stockStatus,
                    stockQuantity,
                    isFeatured,
                    isNew,
                    hiddenFromShop,
                    adminNotes,
                    expiryDate,
                    "categoryName": category->label,
                    "categoryId": category->_id
                }
            `),
            adminClient.fetch(`
                *[_type == "siteSettings"][0] {
                    lowStockThreshold
                }
            `),
            // Fetch order items for sales data (last 90 days for velocity)
            adminClient.fetch(`
                *[_type == "order" && status != "cancelled"] | order(createdAt desc) {
                    _id,
                    orderNumber,
                    items[] { name, qty, price },
                    total,
                    status,
                    createdAt,
                    "customerName": customer->name,
                    "customerEmail": customer->email
                }
            `),
            // Fetch all categories for the add-product form
            adminClient.fetch(`
                *[_type == "category"] | order(store asc, sortOrder asc) {
                    _id,
                    label,
                    "id": id,
                    store
                }
            `),
        ]);

        // ── Build sales analytics per product ──
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Aggregate sales per product name
        const salesMap: Record<string, {
            totalSold: number;
            last30Days: number;
            last7Days: number;
            lastSoldDate: string | null;
            revenue: number;
        }> = {};

        for (const order of orders) {
            if (!Array.isArray(order.items)) continue;
            const orderDate = new Date(order.createdAt);

            for (const item of order.items) {
                const name = item.name;
                const qty = item.qty || 1;
                if (!name) continue;

                if (!salesMap[name]) {
                    salesMap[name] = { totalSold: 0, last30Days: 0, last7Days: 0, lastSoldDate: null, revenue: 0 };
                }

                salesMap[name].totalSold += qty;

                // Parse price for revenue estimate
                const priceMatch = (typeof item.price === 'string') ? item.price.match(/\$(\d+(?:\.\d+)?)/) : null;
                const itemPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
                salesMap[name].revenue += itemPrice * qty;

                if (orderDate >= thirtyDaysAgo) salesMap[name].last30Days += qty;
                if (orderDate >= sevenDaysAgo) salesMap[name].last7Days += qty;

                if (!salesMap[name].lastSoldDate || orderDate > new Date(salesMap[name].lastSoldDate!)) {
                    salesMap[name].lastSoldDate = order.createdAt;
                }
            }
        }

        // Merge sales data into products
        const enrichedProducts = products.map((p: any) => ({
            ...p,
            sales: salesMap[p.name] || { totalSold: 0, last30Days: 0, last7Days: 0, lastSoldDate: null, revenue: 0 },
        }));

        // Build activity log from recent orders
        const recentActivity = orders
            .filter((o: any) => new Date(o.createdAt) >= sevenDaysAgo)
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 20)
            .flatMap((o: any) =>
                (o.items || []).map((item: any) => ({
                    product: item.name,
                    qty: item.qty || 1,
                    date: o.createdAt,
                    status: o.status,
                }))
            );

        // Build purchase tracking log (all orders, most recent first)
        const purchases = orders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 50)
            .map((o: any) => ({
                _id: o._id,
                orderNumber: o.orderNumber || null,
                customerName: o.customerName || 'Guest',
                customerEmail: o.customerEmail || null,
                items: (o.items || []).map((item: any) => ({
                    name: item.name,
                    qty: item.qty || 1,
                    price: item.price || null,
                })),
                total: typeof o.total === 'number' ? o.total / 100 : 0,
                status: o.status,
                date: o.createdAt,
            }));

        return NextResponse.json({
            products: enrichedProducts,
            categories: categories || [],
            threshold: settings?.lowStockThreshold ?? 3,
            activity: recentActivity,
            purchases,
            summary: {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum: number, o: any) => sum + ((o.total || 0) / 100), 0),
                ordersLast7Days: orders.filter((o: any) => new Date(o.createdAt) >= sevenDaysAgo).length,
                ordersLast30Days: orders.filter((o: any) => new Date(o.createdAt) >= thirtyDaysAgo).length,
            },
        });
    } catch (error) {
        console.error('[Inventory] Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/inventory
 * Update a product's stockQuantity, stockStatus, and/or product toggles.
 *
 * Body: { productId, stockQuantity?, stockStatus?, isFeatured?, isNew?, salePrice? }
 */
export async function PATCH(req: Request) {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const { productId, stockQuantity, stockStatus, isFeatured, isNew, salePrice, hiddenFromShop, price, adminNotes } = body;

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }

        // Build the patch
        const patch: Record<string, any> = {};

        if (typeof stockQuantity === 'number') {
            patch.stockQuantity = Math.max(0, Math.min(99, stockQuantity));
        }

        if (typeof stockStatus === 'string') {
            const validStatuses = ['in-stock', 'low-stock', 'out-of-stock', 'pre-order', 'seasonal'];
            if (!validStatuses.includes(stockStatus)) {
                return NextResponse.json({ error: 'Invalid stockStatus' }, { status: 400 });
            }
            patch.stockStatus = stockStatus;
        }

        if (typeof isFeatured === 'boolean') {
            patch.isFeatured = isFeatured;
        }

        if (typeof isNew === 'boolean') {
            patch.isNew = isNew;
        }

        // salePrice: pass null or '' to remove, string to set
        if (salePrice !== undefined) {
            patch.salePrice = salePrice || null;
        }

        if (typeof hiddenFromShop === 'boolean') {
            patch.hiddenFromShop = hiddenFromShop;
        }

        if (typeof price === 'string' && price.trim()) {
            patch.price = price.trim();
        }

        if (adminNotes !== undefined) {
            patch.adminNotes = typeof adminNotes === 'string' ? adminNotes : null;
        }

        if (body.expiryDate !== undefined) {
            patch.expiryDate = body.expiryDate || null;
        }

        // Auto-derive status from quantity if only quantity was provided
        if (typeof stockQuantity === 'number' && typeof stockStatus !== 'string') {
            const settings = await adminClient.fetch(`*[_type == "siteSettings"][0] { lowStockThreshold }`);
            const threshold = settings?.lowStockThreshold ?? 3;
            const qty = patch.stockQuantity;
            if (qty === 0) {
                patch.stockStatus = 'out-of-stock';
            } else if (qty <= threshold) {
                patch.stockStatus = 'low-stock';
            } else {
                patch.stockStatus = 'in-stock';
            }
        }

        if (Object.keys(patch).length === 0) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        await adminClient.patch(productId).set(patch).commit();

        return NextResponse.json({
            ok: true,
            productId,
            ...patch,
        });
    } catch (error) {
        console.error('[Inventory] Update error:', error);
        return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
    }
}

/**
 * POST /api/admin/inventory
 * Bulk update: set all products in a category to a specific stockStatus.
 *
 * Body: { categoryId, stockStatus, stockQuantity? }
 */
export async function POST(req: Request) {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const { categoryId, stockStatus, stockQuantity } = body;

        if (!categoryId || !stockStatus) {
            return NextResponse.json({ error: 'Missing categoryId or stockStatus' }, { status: 400 });
        }

        // Get all products in this category
        const products = await adminClient.fetch(
            `*[_type == "product" && category._ref == $catId]{ _id }`,
            { catId: categoryId }
        );

        const patch: Record<string, any> = { stockStatus };
        if (typeof stockQuantity === 'number') {
            patch.stockQuantity = Math.max(0, Math.min(99, stockQuantity));
        }

        // Patch each product
        const transaction = adminClient.transaction();
        for (const product of products) {
            transaction.patch(product._id, (p: any) => p.set(patch));
        }
        await transaction.commit();

        return NextResponse.json({
            ok: true,
            updated: products.length,
            categoryId,
            stockStatus,
        });
    } catch (error) {
        console.error('[Inventory] Bulk update error:', error);
        return NextResponse.json({ error: 'Failed to bulk update' }, { status: 500 });
    }
}

/**
 * PUT /api/admin/inventory
 * Create a new product.
 *
 * Body: { name, price, categoryId, description?, stockQuantity?, stockStatus? }
 */
export async function PUT(req: Request) {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const { name, price, categoryId, description, stockQuantity, stockStatus } = body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }
        if (!price || typeof price !== 'string' || !price.trim()) {
            return NextResponse.json({ error: 'Price is required' }, { status: 400 });
        }
        if (!categoryId || typeof categoryId !== 'string') {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        const doc: Record<string, any> = {
            _type: 'product',
            name: name.trim(),
            price: price.trim(),
            category: { _type: 'reference', _ref: categoryId },
            stockStatus: stockStatus || 'in-stock',
            stockQuantity: typeof stockQuantity === 'number' ? Math.max(0, Math.min(99, stockQuantity)) : 5,
            isFeatured: false,
            isNew: false,
            hiddenFromShop: false,
            sortOrder: 0,
        };

        if (description && typeof description === 'string' && description.trim()) {
            doc.description = description.trim();
        }

        const created = await adminClient.create(doc);

        return NextResponse.json({
            ok: true,
            product: {
                _id: created._id,
                name: doc.name,
                price: doc.price,
                stockStatus: doc.stockStatus,
                stockQuantity: doc.stockQuantity,
            },
        });
    } catch (error) {
        console.error('[Inventory] Create product error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/inventory
 * Delete a product by ID.
 *
 * Body: { productId }
 */
export async function DELETE(req: Request) {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        }

        await adminClient.delete(productId);

        return NextResponse.json({ ok: true, deleted: productId });
    } catch (error) {
        console.error('[Inventory] Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
