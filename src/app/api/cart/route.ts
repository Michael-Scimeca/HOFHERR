import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';

interface SyncedCartItem {
    name: string;
    price: string;
    qty: number;
    note: string;
    desc?: string;
}

/**
 * GET /api/cart — Returns the logged-in customer's cloud-synced cart for cross-device continuity.
 */
export async function GET() {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (!email) {
            return NextResponse.json({ items: [], updatedAt: null }, { status: 200 });
        }

        const customer = await adminClient.fetch<{
            _id: string;
            savedCart?: SyncedCartItem[];
            savedCartUpdatedAt?: string;
        } | null>(
            `*[_type == "customer" && lower(email) == $email][0]{ _id, savedCart, savedCartUpdatedAt }`,
            { email: email.toLowerCase() }
        );

        return NextResponse.json({
            items: Array.isArray(customer?.savedCart) ? customer.savedCart : [],
            updatedAt: customer?.savedCartUpdatedAt ?? null,
        });
    } catch (err) {
        console.error('[Cart Sync GET] Error:', err);
        return NextResponse.json({ items: [], updatedAt: null }, { status: 500 });
    }
}

/**
 * PUT /api/cart — Persists the logged-in customer's cart to Sanity for cross-device sync & abandoned cart recovery.
 */
export async function PUT(req: Request) {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (!email) {
            return NextResponse.json({ synced: false }, { status: 200 });
        }

        const body = await req.json();
        const rawItems = Array.isArray(body?.items) ? body.items : [];
        const sanitized: SyncedCartItem[] = rawItems.slice(0, 50).map((it: Partial<SyncedCartItem>) => ({
            name: String(it?.name ?? '').slice(0, 120),
            price: String(it?.price ?? '').slice(0, 32),
            qty: Math.max(1, Math.min(20, Number(it?.qty) || 1)),
            note: String(it?.note ?? '').slice(0, 250),
            ...(it?.desc ? { desc: String(it.desc).slice(0, 240) } : {}),
        })).filter((it: SyncedCartItem) => Boolean(it.name));

        const customer = await adminClient.fetch<{ _id: string } | null>(
            `*[_type == "customer" && lower(email) == $email][0]{ _id }`,
            { email: email.toLowerCase() }
        );

        if (!customer?._id) {
            return NextResponse.json({ synced: false }, { status: 200 });
        }

        const nowIso = new Date().toISOString();
        await adminClient
            .patch(customer._id)
            .set({
                savedCart: sanitized,
                savedCartUpdatedAt: nowIso,
                ...(sanitized.length === 0 ? { abandonedReminderSentAt: null } : {}),
            })
            .commit();

        return NextResponse.json({ synced: true, count: sanitized.length, updatedAt: nowIso });
    } catch (err) {
        console.error('[Cart Sync PUT] Error:', err);
        return NextResponse.json({ synced: false, error: 'Failed to sync cart' }, { status: 500 });
    }
}

