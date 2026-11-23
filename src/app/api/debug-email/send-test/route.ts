import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import {
    buildWelcomeEmail,
    buildVerifyEmail,
    buildPasswordResetEmail,
    buildOrderConfirmationEmail,
    buildRestockFilledEmail,
    buildNewsletterWelcomeEmail,
} from '@/lib/email-templates';

export const runtime = 'nodejs';

function buildAllSampleTemplates(recipientEmail: string) {
    const orderEmail = buildOrderConfirmationEmail({
        orderNumber: 'A7F3BC21',
        items: [
            { name: 'Bone-In Ribeye (16 oz)', price: '$24.99', qty: 2, note: 'Cut 1.5" thick, extra marbled' },
            { name: 'Baby Back Ribs (Full Rack)', price: '$19.99', qty: 1 },
            { name: 'Hofherr Signature Burger Blend', price: '$8.99', qty: 3 },
            { name: 'Fresh Italian Sausage (1 lb)', price: '$7.49', qty: 2 },
        ],
        contact: {
            name: 'Sean Hofherr',
            email: recipientEmail,
            phone: '(847) 555-0100',
            pickup: 'Wed, Nov 25 at 3:00 PM',
        },
        storeId: 'butcher',
        tipAmount: 5,
        coupon: { code: 'SPRING10', type: 'percent', value: 10 },
        baseUrl: 'https://hofherrmeatco.com',
    });

    return {
        welcome: buildWelcomeEmail('Sean Hofherr', recipientEmail),
        verify: buildVerifyEmail(
            'Sean Hofherr',
            recipientEmail,
            'https://hofherrmeatco.com/verify-email?token=abc123def456',
        ),
        reset: buildPasswordResetEmail(
            recipientEmail,
            `https://hofherrmeatco.com/reset-password?token=reset987xyz&email=${encodeURIComponent(recipientEmail)}`,
        ),
        order: { subject: orderEmail.subject, html: orderEmail.html, text: orderEmail.text },
        restock: buildRestockFilledEmail({
            customerName: 'Sean Hofherr',
            item: '45-Day Dry-Aged Bone-In Ribeye',
            qty: 2,
            store: 'butcher',
            baseUrl: 'https://hofherrmeatco.com',
        }),
        newsletter: buildNewsletterWelcomeEmail(recipientEmail, 'Sean'),
    };
}

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        const { auth } = await import('@/auth');
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
        }
    }

    try {
        const body = (await req.json()) as { to?: string; template?: string };
        const to = (body.to || '').trim();
        if (!to || !to.includes('@')) {
            return NextResponse.json({ error: 'Valid recipient email is required.' }, { status: 400 });
        }

        const all = buildAllSampleTemplates(to);
        const requested = body.template || 'all';
        const keys =
            requested === 'all'
                ? (Object.keys(all) as (keyof typeof all)[])
                : requested in all
                  ? [requested as keyof typeof all]
                  : [];

        if (keys.length === 0) {
            return NextResponse.json({ error: `Unknown template "${requested}"` }, { status: 400 });
        }

        // Stagger requests by 650ms so Resend's 2 req/s limit is respected without sequential await-in-loop
        const results = await Promise.all(
            keys.map(async (key, idx) => {
                if (idx > 0) {
                    await new Promise(resolve => setTimeout(resolve, idx * 650));
                }
                const tpl = all[key];
                const res = await sendEmail({
                    to,
                    subject: `[TEST] ${tpl.subject}`,
                    html: tpl.html,
                    text: tpl.text,
                });
                return {
                    template: key,
                    subject: tpl.subject,
                    ok: res.success,
                    ...(res.error ? { error: res.error } : {}),
                };
            }),
        );

        const sentCount = results.filter(r => r.ok).length;
        return NextResponse.json({
            ok: sentCount === results.length,
            sentCount,
            total: results.length,
            results,
        });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Failed to send test emails' },
            { status: 500 },
        );
    }
}
