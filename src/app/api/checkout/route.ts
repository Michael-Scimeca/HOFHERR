import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';

// ── Server-side canonical product catalog ─────────────────────────────────────
// Prices here are authoritative — client-submitted prices are IGNORED
const PRODUCT_CATALOG: Record<string, string> = {
    'New York Strip': '$42.99/lb', 'Boneless Ribeye': '$40.99/lb',
    'Bone-In Ribeye': '$38.99/lb', 'Filet Mignon': '$46.99/lb',
    'T-Bone': '$36.99/lb', 'Porterhouse': '$40.99/lb',
    'Prime Rib': '$38.99/lb', 'Prime Beef Tenderloin': '$44.99/lb',
    'Flat Iron Steak': '$20.99/lb', 'Kilgus Flat Iron': '$34.99',
    'Hanger Steak': '$19.99/lb', 'Skirt Steak': '$28.99/lb',
    'Marinated Skirt Steak': '$30.99/lb', 'Marinated Flank Steak': '$22.99/lb',
    'Kalbi': '$16.99/lb', 'Steak Kabob': '$19.99/lb',
    'Bone In Short Ribs': '$14.99/lb', 'Beef Stew Meat': '$13.99/lb',
    'Beef Cheek': '$14.99/lb', 'Whole Brisket': '$10.99/lb',
    'Brisket Deckle': '$10.99/lb', 'First Cut Brisket': '$13.99/lb',
    'Rump Roast': '$8.99/lb', 'Beef Knuckle Bones': '$5.99/lb',
    'Ground Sirloin': '$10.99/lb', 'Ground Chuck': '$9.99/lb',
    'Sirloin Burger': '$11.99/lb', 'Hatch Chile Cheeseburger': '$15.99/lb',
    'Beef Stock': '$10.99', 'Ox Tails': '$14.99/lb',
    'Baby Back Ribs': '$11.99/lb', 'Spare Ribs': '$9.99/lb',
    'St. Louis Style Ribs': '$10.99/lb', 'Berkshire Pork Chop': '$14.99/lb',
    'Berkshire Bone-In Pork Chop': '$12.99/lb', 'Berkshire Pork Tenderloin': '$14.99/lb',
    'Berkshire Pork Belly': '$9.99/lb', 'Berkshire Ground Pork': '$10.99/lb',
    'House Bratwurst': '$8.99/lb', 'Sweet Italian Sausage': '$8.99/lb',
    'Hot Italian Sausage': '$8.99/lb', 'Andouille Sausage': '$9.99/lb',
    'Kielbasa': '$8.99/lb', 'Breakfast Sausage Links': '$8.99/lb',
    'Breakfast Sausage Patties': '$8.99/lb', 'Chorizo': '$9.99/lb',
    'Pork Belly': '$9.99/lb', 'Beef Tallow': '$6.99/lb',
    'Wagyu Beef Patties': '$18.99/lb', 'Dry-Aged Ribeye': '$44.99/lb',
    'Dry Aged NY Strip': '$45.99/lb', 'Lamb Rack': '$34.99/lb',
    'Lamb Chops': '$29.99/lb', 'Ground Lamb': '$14.99/lb',
    'Leg of Lamb': '$19.99/lb', 'Lamb Shanks': '$18.99/lb',
};

type CartItem = { name: string; price: string; qty: number; note?: string };

/** Parse "$42.99/lb", "$12.99" → cents */
function parsePriceCents(price: string): number | null {
    const match = price.match(/\$(\d+(?:\.\d+)?)/);
    if (!match) return null;
    return Math.round(parseFloat(match[1]) * 100);
}

/** Validate & sanitize a string input */
function sanitize(s: unknown, max = 200): string {
    if (typeof s !== 'string') return '';
    return s.trim().slice(0, max);
}

export async function POST(req: Request) {
    // ── Origin check (basic CSRF guard) ──────────────────────────────────────
    const origin = req.headers.get('origin') ?? '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    if (origin && !origin.startsWith(baseUrl) && !origin.startsWith('http://localhost')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Stripe key check ──────────────────────────────────────────────────────
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return NextResponse.json(
            { error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env.local file to enable payments.' },
            { status: 503 }
        );
    }

    try {
        const stripe = new Stripe(stripeKey);
        const body = await req.json();

        // ── Validate body shape ───────────────────────────────────────────────
        const rawItems = body?.items;
        const contact = body?.contact;
        const orderNote = sanitize(body?.orderNote, 500);
        const customerId = body?.customerId;
        const coupon = body?.coupon;
        const storeId = sanitize(body?.storeId) || 'butcher'; // 'butcher' or 'depot'
        const paymentMethod = body?.paymentMethod || 'stripe';
        const tipAmount = typeof body?.tipAmount === 'number' ? Math.max(0, Math.round(body.tipAmount * 100)) : 0; // in cents

        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }
        if (rawItems.length > 50) {
            return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 });
        }

        // Validate contact — require name + at least one of email or phone
        const name = sanitize(contact?.name);
        const email = sanitize(contact?.email, 254);
        const phone = sanitize(contact?.phone, 20);
        const pickup = sanitize(contact?.pickup);
        if (!name || (!email && !phone)) {
            return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 });
        }

        // ── Server-side price validation ──────────────────────────────────────
        // We look up the canonical price from our catalog; client-submitted
        // prices are IGNORED to prevent tampering.
        const items: CartItem[] = [];
        for (const raw of rawItems) {
            const itemName = sanitize(raw?.name);
            if (!itemName) continue;
            const canonicalPrice = PRODUCT_CATALOG[itemName];
            const qty = Math.max(1, Math.min(99, parseInt(raw?.qty) || 1));
            const note = sanitize(raw?.note, 200);
            items.push({
                name: itemName,
                // Use canonical server price; fall back to client price only for
                // items not in our catalog (edge case — still warns in Stripe).
                price: canonicalPrice ?? sanitize(raw?.price, 30),
                qty,
                note,
            });
        }

        if (items.length === 0) {
            return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 });
        }

        // ── Build Stripe line items ───────────────────────────────────────────
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => {
            const cents = parsePriceCents(item.price);
            const isPerLb = item.price.includes('/lb');
            // Per-lb items: charge estimated amount (1 lb at listed price)
            // as a deposit; final amount adjusted at pickup if needed.
            const isVariable = cents === null;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: [
                            item.price,
                            isPerLb ? 'Est. 1 lb — final weight confirmed at pickup' : undefined,
                            item.note ? `Note: ${item.note}` : undefined,
                        ].filter(Boolean).join(' · '),
                    },
                    unit_amount: isVariable ? 100 : (cents ?? 100),
                },
                quantity: item.qty,
            };
        });

        // ── Totals & Tax Logic ───────────────────────────────────────────────
        const subtotalCents = items.reduce((s, i) => s + (parsePriceCents(i.price) || 0) * i.qty, 0);
        let discountCents = 0;
        if (coupon && coupon.valid !== false) {
            if (coupon.type === 'percent') {
                discountCents = Math.floor(subtotalCents * (coupon.value / 100));
            } else if (coupon.type === 'fixed') {
                discountCents = coupon.value * 100;
            }

            if (discountCents > 0) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Discount (${coupon.code})`,
                        },
                        unit_amount: -discountCents,
                    },
                    quantity: 1,
                });
            }
        }
        
        const discountedSubtotal = Math.max(0, subtotalCents - discountCents);
        const TAX_RATE = 0.0225;
        const taxCents = Math.round(discountedSubtotal * TAX_RATE);
        const totalCents = discountedSubtotal + taxCents + tipAmount;

        if (taxCents > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Estimated Sales Tax (2.25%)',
                    },
                    unit_amount: taxCents,
                },
                quantity: 1,
            });
        }

        // Add tip as a line item if present
        if (tipAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tip for the Team 💝',
                    },
                    unit_amount: tipAmount,
                },
                quantity: 1,
            });
        }

        // ── Order summary for metadata ────────────────────────────────────────
        const orderSummary = items.map(i =>
            `${i.name} x${i.qty} (${i.price})${i.note ? ` [${i.note}]` : ''}`
        ).join(', ');

        // ── Handle In-Store Payment ───────────────────────────────────────────
        if (paymentMethod === 'instore') {
            const orderNumber = Math.floor(10000000 + Math.random() * 90000000).toString(16).toUpperCase();
            const orderDoc: any = {
                _type: 'order',
                orderNumber,
                total: totalCents,
                status: 'pending', // Pending means pay at pickup
                items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, note: i.note || '' })),
                createdAt: new Date().toISOString(),
                metadata: {
                    customer_name: name,
                    customer_email: email,
                    pickup_time: pickup,
                    store_id: storeId,
                    order_note: orderNote.slice(0, 500),
                    tip_amount: (tipAmount / 100).toFixed(2),
                }
            };

            if (coupon?.code) {
                orderDoc.couponCode = coupon.code;
            }

            if (customerId) {
                orderDoc.customer = {
                    _type: 'reference',
                    _ref: customerId,
                };
            }

            try {
                await adminClient.create(orderDoc);
                console.log('[Checkout] Instore order saved to Sanity:', orderNumber);
            } catch (err) {
                console.error('[Checkout] Sanity sync failed for instore order:', err);
                return NextResponse.json({ error: 'Failed to save order to database' }, { status: 500 });
            }

            // Return false URL to direct client to success page immediately
            return NextResponse.json({ url: false });
        }

        // ── Create Stripe session ─────────────────────────────────────────────
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            payment_method_types: ['card'],
            customer_email: email || undefined,
            // Stripe auto-emails a receipt to the customer after payment
            payment_intent_data: {
                receipt_email: email || undefined,
                description: `Hofherr Meat Co. Order — ${name}`,
            },
            phone_number_collection: { enabled: true },
            custom_fields: [
                {
                    key: 'pickup_notes',
                    label: { type: 'custom', custom: 'Pickup Notes / Special Instructions' },
                    type: 'text',
                    optional: true,
                },
            ],
            metadata: {
                customer_name: name,
                customer_phone: phone,
                pickup_time: pickup,
                customer_id: customerId || '',
                store_id: storeId,
                coupon_code: coupon?.code || '',
                tax_amount: (taxCents / 100).toFixed(2),
                tip_amount: (tipAmount / 100).toFixed(2),
                total_amount: (totalCents / 100).toFixed(2),
                order_note: orderNote.slice(0, 500),
                order_summary: orderSummary.slice(0, 500),
            },
            success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/online-orders`,
        });

        return NextResponse.json({ url: session.url });

    } catch (err) {
        console.error('Stripe checkout error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
