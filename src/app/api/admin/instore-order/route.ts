import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';
import { normalizePhone, formatPhoneDisplay } from '@/lib/phone';
import { decrementStock } from '@/lib/decrementStock';

const IS_DEV = process.env.NODE_ENV === 'development';

async function requireAdmin() {
    if (IS_DEV) return true;
    const session = await auth();
    return Boolean(session?.user?.isAdmin);
}

/**
 * GET /api/admin/instore-order?phone=8475550142
 * Instant counter lookup of an existing customer profile by phone number.
 */
export async function GET(req: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const normalized = normalizePhone(searchParams.get('phone') ?? '');
        if (normalized.length < 10) {
            return NextResponse.json({ customer: null });
        }

        // Match either stored phoneNormalized or raw phone digits
        const customers = await adminClient.fetch<
            { _id: string; name?: string; email?: string; phone?: string; phoneNormalized?: string }[]
        >(`*[_type == "customer" && (phoneNormalized == $normalized || defined(phone))]{ _id, name, email, phone, phoneNormalized }`, {
            normalized,
        });

        const match = (customers ?? []).find(
            (c) => c.phoneNormalized === normalized || normalizePhone(c.phone) === normalized
        );

        if (!match) {
            return NextResponse.json({ customer: null, phoneNormalized: normalized });
        }

        const orderCount = await adminClient.fetch<number>(
            `count(*[_type == "order" && customer._ref == $id])`,
            { id: match._id }
        );

        return NextResponse.json({
            customer: {
                _id: match._id,
                name: match.name || 'Hofherr Customer',
                email: match.email || '',
                phone: match.phone || formatPhoneDisplay(normalized),
                orderCount: typeof orderCount === 'number' ? orderCount : 0,
            },
            phoneNormalized: normalized,
        });
    } catch (err) {
        console.error('[InStore POS GET] Error:', err);
        return NextResponse.json({ customer: null }, { status: 500 });
    }
}

/**
 * POST /api/admin/instore-order
 * Logs an in-store counter purchase directly into Sanity and links it to the customer's profile by phone number.
 */
export async function POST(req: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const normalizedPhone = normalizePhone(body?.phone);
        const customerName = typeof body?.customerName === 'string' ? body.customerName.trim().slice(0, 120) : '';
        const storeId = body?.storeId === 'depot' ? 'depot' : 'butcher';
        const tender = body?.tender === 'cash' ? 'cash' : 'card';
        const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 300) : '';
        const rawItems = Array.isArray(body?.items) ? body.items : [];

        if (normalizedPhone.length < 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit customer phone number.' }, { status: 400 });
        }
        if (rawItems.length === 0) {
            return NextResponse.json({ error: 'Add at least one cut or item.' }, { status: 400 });
        }

        const items = rawItems.slice(0, 40).map((it: { name?: string; qty?: number; price?: string; note?: string }) => ({
            name: String(it?.name ?? '').trim().slice(0, 120),
            qty: Math.max(1, Math.min(50, Number(it?.qty) || 1)),
            price: String(it?.price ?? '$0.00').trim().slice(0, 32),
            note: String(it?.note ?? '').trim().slice(0, 200),
        })).filter((it: { name: string }) => Boolean(it.name));

        let totalCents = 0;
        for (const it of items) {
            const m = it.price.match(/(\d+(?:\.\d+)?)/);
            const unit = m ? Math.round(parseFloat(m[1]) * 100) : 0;
            totalCents += unit * it.qty;
        }

        // Find existing customer profile by normalized phone
        const customers = await adminClient.fetch<
            { _id: string; name?: string; email?: string; phone?: string; phoneNormalized?: string }[]
        >(`*[_type == "customer" && (phoneNormalized == $normalized || defined(phone))]{ _id, name, email, phone, phoneNormalized }`, {
            normalized: normalizedPhone,
        });

        const matchedCustomer = (customers ?? []).find(
            (c) => c.phoneNormalized === normalizedPhone || normalizePhone(c.phone) === normalizedPhone
        );

        const orderNumber = `POS-${Math.floor(100000 + Math.random() * 900000)}`;
        const resolvedName = matchedCustomer?.name || customerName || `Walk-In (${formatPhoneDisplay(normalizedPhone)})`;

        const orderDoc: Record<string, unknown> = {
            _type: 'order',
            orderNumber,
            total: totalCents,
            status: 'completed',
            source: 'instore_pos',
            customerPhoneNormalized: normalizedPhone,
            items,
            createdAt: new Date().toISOString(),
            pickedUpAt: new Date().toISOString(),
            metadata: {
                customer_name: resolvedName,
                customer_email: matchedCustomer?.email || '',
                customer_phone: formatPhoneDisplay(normalizedPhone),
                customer_phone_normalized: normalizedPhone,
                pickup_time: 'In-Store Counter',
                store_id: storeId,
                payment_tender: tender,
                order_note: note,
            },
        };

        if (matchedCustomer?._id) {
            orderDoc.customer = { _type: 'reference', _ref: matchedCustomer._id };
            // Backfill phoneNormalized on the customer doc if missing
            if (matchedCustomer.phoneNormalized !== normalizedPhone) {
                adminClient
                    .patch(matchedCustomer._id)
                    .set({ phoneNormalized: normalizedPhone })
                    .commit()
                    .catch(() => {});
            }
        }

        const created = await adminClient.create(orderDoc as { _type: string });

        decrementStock(items.map((i: { name: string; qty: number }) => ({ name: i.name, qty: i.qty })))
            .catch((err) => console.error('[InStore POS] Stock decrement error:', err));

        return NextResponse.json({
            ok: true,
            orderId: created._id,
            orderNumber,
            linkedToProfile: Boolean(matchedCustomer?._id),
            customerName: resolvedName,
            totalFormatted: `$${(totalCents / 100).toFixed(2)}`,
        });
    } catch (err) {
        console.error('[InStore POS POST] Error:', err);
        return NextResponse.json({ error: 'Failed to log in-store order.' }, { status: 500 });
    }
}
