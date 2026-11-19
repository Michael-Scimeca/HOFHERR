import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export interface SubscriptionPlanDef {
    id: string;
    name: string;
    description: string;
    amountCents: number;
    interval: 'week' | 'month';
    intervalCount: number;
}

const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanDef> = {
    'monthly-steakhouse-box': {
        id: 'monthly-steakhouse-box',
        name: 'Hofherr Monthly Steakhouse Box',
        description:
            '2× 45-Day Dry-Aged Prime Ribeyes, 2× Prime Filet Mignons, 2 lbs House-Marinated Skirt Steak & Beef Tallow — cut fresh for pickup on the first Friday of every month.',
        amountCents: 18900,
        interval: 'month',
        intervalCount: 1,
    },
    'biweekly-family-butcher-box': {
        id: 'biweekly-family-butcher-box',
        name: 'North Shore Family Butcher Box (Every 2 Weeks)',
        description:
            'Berkshire Pork Chops, Ground Sirloin, House Bratwurst, Amish Chicken Breasts & Seasonal Butcher’s Cut — curated bi-weekly.',
        amountCents: 13500,
        interval: 'week',
        intervalCount: 2,
    },
    'weekly-friday-rotisserie': {
        id: 'weekly-friday-rotisserie',
        name: 'Weekly Friday Rotisserie Club',
        description:
            'Guaranteed hot-off-the-spit herb-brined Rotisserie Chicken + choice of 2 house sides reserved every Friday at The Butcher Shop or The Depot.',
        amountCents: 2600,
        interval: 'week',
        intervalCount: 1,
    },
};

export async function POST(req: Request) {
    const origin = req.headers.get('origin') ?? '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    if (origin && !origin.startsWith(baseUrl) && !origin.startsWith('http://localhost')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return NextResponse.json(
            { error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable subscriptions.' },
            { status: 503 }
        );
    }

    try {
        const body = await req.json();
        const planId = typeof body?.planId === 'string' ? body.planId.trim() : '';
        const storeId = body?.storeId === 'depot' ? 'depot' : 'butcher';
        const plan = SUBSCRIPTION_PLANS[planId];

        if (!plan) {
            return NextResponse.json({ error: 'Unknown subscription plan.' }, { status: 400 });
        }

        const sessionAuth = await auth();
        const email = sessionAuth?.user?.email || (typeof body?.email === 'string' ? body.email.trim() : undefined);

        const stripe = new Stripe(stripeKey);
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            allow_promotion_codes: true,
            customer_email: email || undefined,
            phone_number_collection: { enabled: true },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: plan.amountCents,
                        recurring: {
                            interval: plan.interval,
                            interval_count: plan.intervalCount,
                        },
                        product_data: {
                            name: plan.name,
                            description: plan.description,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                plan_id: plan.id,
                store_id: storeId,
                subscription_type: 'hofherr_butcher_club',
            },
            success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&subscription=true`,
            cancel_url: `${baseUrl}/online-orders`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('[Subscriptions] Checkout error:', err);
        const message = err instanceof Error ? err.message : 'Unable to start subscription checkout.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

