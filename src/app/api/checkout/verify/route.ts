import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId || !sessionId.startsWith('cs_')) {
        return NextResponse.json({ paid: false, error: 'Invalid session ID' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return NextResponse.json({ paid: false, error: 'Not configured' }, { status: 503 });
    }

    try {
        const stripe = new Stripe(stripeKey);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return NextResponse.json({
            paid: session.payment_status === 'paid',
            customerName: session.metadata?.customer_name ?? '',
            orderSummary: session.metadata?.order_summary ?? '',
            taxAmount: session.metadata?.tax_amount ?? '0.00',
            totalAmount: session.metadata?.total_amount ?? '0.00',
            storeId: session.metadata?.store_id ?? 'butcher',
            pickupTime: session.metadata?.pickup_time ?? '',
        });
    } catch (err) {
        console.error('Stripe verify error:', err);
        return NextResponse.json({ paid: false, error: 'Verification failed' }, { status: 500 });
    }
}
