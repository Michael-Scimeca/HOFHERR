import Stripe from 'stripe';
import twilio from 'twilio';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { adminClient } from '@/sanity/adminClient';

// ── Disable body parsing — Stripe needs the raw body to verify signature ──────
export const config = { api: { bodyParser: false } };

function formatPhone(raw: string): string {
    // Normalize to E.164 if it looks like a 10-digit US number
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
    return raw; // return as-is and let Twilio validate
}

async function sendSMS(to: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !from) {
        console.log('[Webhook] Twilio not configured, SMS skipped. Body:', body);
        return;
    }

    const client = twilio(accountSid, authToken);
    try {
        await client.messages.create({ body, from, to });
        console.log(`[Webhook] SMS sent to ${to}`);
    } catch (err) {
        // Log but don't throw — don't let an SMS failure break the webhook response
        console.error(`[Webhook] SMS failed to ${to}:`, err);
    }
}

export async function POST(req: Request) {
    const rawBody = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.warn('[Webhook] STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const stripe = new Stripe(stripeKey);

    // ── Verify Stripe signature ───────────────────────────────────────────────
    let event: Stripe.Event;
    try {
        if (webhookSecret && sig) {
            event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        } else {
            // Dev mode without secret — parse but don't verify
            event = JSON.parse(rawBody) as Stripe.Event;
        }
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err);
        return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
    }

    // ── Only handle successful payments ──────────────────────────────────────
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
            try {
                await saveOrderToSanity(session);
            } catch (err) {
                console.error('[Webhook] Sanity sync failed:', err);
                // Continue so SMS still tries to send
            }
        }
    }

    if (event.type !== 'checkout.session.completed') {
        return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Only act on paid sessions
    if (session.payment_status !== 'paid') {
        return NextResponse.json({ received: true });
    }

    const meta = session.metadata ?? {};
    const customerName = meta.customer_name ?? 'Customer';
    const customerPhone = meta.customer_phone ?? '';
    const pickupTime = meta.pickup_time ?? 'Not specified';
    const orderNote = meta.order_note ?? '';
    const orderSummary = meta.order_summary ?? '';
    const customerEmail = session.customer_email ?? '';
    const amountPaid = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'TBD';
    const seanPhone = process.env.SEAN_PHONE_NUMBER ?? '';

    // ── 1. SMS → Customer ─────────────────────────────────────────────────────
    if (customerPhone) {
        const customerSMS = [
            `✅ Hi ${customerName}! Your order at Hofherr Meat Co. is confirmed.`,
            ``,
            `📋 Order: ${orderSummary.slice(0, 200)}${orderSummary.length > 200 ? '…' : ''}`,
            `📅 Pickup: ${pickupTime || 'We will confirm with you'}`,
            orderNote ? `📝 Note: ${orderNote}` : null,
            ``,
            'We will be in touch to confirm your pickup time.',
            `Questions? Call (847) 441-6328`,
            ``,
            `— Hofherr Meat Co.`,
        ].filter(s => s !== null).join('\n');

        await sendSMS(formatPhone(customerPhone), customerSMS);
    }

    // ── 2. SMS → Store (Sean) ─────────────────────────────────────────────────
    if (seanPhone) {
        const storeSMS = [
            `🛒 NEW ORDER — Hofherr Website`,
            ``,
            `👤 ${customerName}`,
            customerPhone ? `📞 ${customerPhone}` : null,
            customerEmail ? `✉️  ${customerEmail}` : null,
            ``,
            `📋 Items:`,
            // Break order summary into lines for readability
            ...orderSummary.split(',').map((i: string) => `  • ${i.trim()}`).slice(0, 15),
            ``,
            `📅 Pickup: ${pickupTime || 'Not specified'}`,
            orderNote ? `📝 Note: ${orderNote}` : null,
            ``,
            `💰 Charged: ${amountPaid} (est. — per-lb items finalized at pickup)`,
            `🔗 Stripe: ${session.id}`,
        ].filter(s => s !== null).join('\n');

        await sendSMS(seanPhone, storeSMS);
    }

    console.log(`[Webhook] Order processed: ${session.id} — ${customerName}`);
    return NextResponse.json({ received: true });
}

async function saveOrderToSanity(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};
    const customerId = metadata.customer_id;
    const orderSummary = metadata.order_summary || '';
    
    // Attempt to parse order summary for items, or fall back to raw string
    let items: any[] = [];
    try {
        // We might need to store items as JSON in metadata in checkout/route.ts
        // For now, let's assume we can parse it if we update checkout/route.ts
        // Actually, let's just save the summary as a string for now if it's not JSON
        items = [{ name: orderSummary, qty: 1, price: `$${(session.amount_total! / 100).toFixed(2)}` }];
    } catch (e) {
        items = [{ name: orderSummary, qty: 1, price: `$${(session.amount_total! / 100).toFixed(2)}` }];
    }

    const orderDoc: any = {
        _type: 'order',
        orderNumber: session.id.slice(-8).toUpperCase(),
        total: session.amount_total || 0,
        status: 'paid',
        items: items,
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
        couponCode: metadata.coupon_code || null,
    };

    if (customerId) {
        orderDoc.customer = {
            _type: 'reference',
            _ref: customerId,
        };
    }

    await adminClient.create(orderDoc);
    console.log('[Webhook] Order saved to Sanity:', orderDoc.orderNumber);
}
