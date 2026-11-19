import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/cart/abandoned
 * Triggered by cron (with Authorization: Bearer CRON_SECRET) or an authenticated admin
 * to email logged-in shoppers who left items in their synced cart for > 2 hours.
 */
export async function POST(req: Request) {
    try {
        const cronSecret = process.env.CRON_SECRET;
        const authHeader = req.headers.get('authorization');
        const isCronAuthed = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

        if (!isCronAuthed) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const candidates = await adminClient.fetch<
            {
                _id: string;
                name?: string;
                email?: string;
                savedCart?: { name: string; qty: number; price: string }[];
                savedCartUpdatedAt?: string;
                abandonedReminderSentAt?: string;
            }[]
        >(
            `*[_type == "customer"
                && defined(email)
                && count(savedCart) > 0
                && savedCartUpdatedAt < $twoHoursAgo
                && (!defined(abandonedReminderSentAt) || abandonedReminderSentAt < $oneDayAgo)
            ][0...25]{
                _id, name, email, savedCart, savedCartUpdatedAt, abandonedReminderSentAt
            }`,
            { twoHoursAgo, oneDayAgo }
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://hofherrmeatco.com';
        let sentCount = 0;

        for (const c of candidates) {
            if (!c.email || !c.savedCart?.length) continue;
            const itemRows = c.savedCart
                .map((it) => `<li style="margin:4px 0;color:#e5e5e5;"><strong>${it.qty}× ${it.name}</strong> (${it.price})</li>`)
                .join('');

            const textItems = c.savedCart
                .map((it) => `- ${it.qty}x ${it.name} (${it.price})`)
                .join('\n');

            const result = await sendEmail({
                to: c.email,
                subject: 'Your Hofherr Meat Co. cuts are still waiting in your cart',
                text: `We saved your Hofherr Meat Co. cart:\n${textItems}\n\nFinish your order: ${baseUrl}/online-orders?cart=open`,
                html: `
                    <div style="background:#0a0a0a;color:#f2f2f2;padding:32px;font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #262626;border-radius:12px;">
                        <h1 style="margin:0 0 12px;font-size:24px;color:#ffffff;">Still thinking about dinner${c.name ? `, ${c.name.split(' ')[0]}` : ''}?</h1>
                        <p style="color:#a3a3a3;line-height:1.6;">We saved the cuts you picked out so you can finish your order before cutoff:</p>
                        <ul style="padding-left:20px;margin:16px 0;">${itemRows}</ul>
                        <a href="${baseUrl}/online-orders?cart=open" style="display:inline-block;margin-top:12px;padding:12px 22px;background:#cc0e1d;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;">Return to Your Cart →</a>
                        <p style="margin-top:24px;font-size:12px;color:#737373;">Hofherr Meat Co. · 300 Happ Rd, Northfield &amp; 754 Elm St, Winnetka · (847) 441-MEAT</p>
                    </div>
                `,
            });

            if (result.success) {
                await adminClient
                    .patch(c._id)
                    .set({ abandonedReminderSentAt: new Date().toISOString() })
                    .commit();
                sentCount++;
            }
        }

        return NextResponse.json({ ok: true, checked: candidates.length, sent: sentCount });
    } catch (err) {
        console.error('[Abandoned Cart] Error:', err);
        return NextResponse.json({ error: 'Abandoned cart job failed.' }, { status: 500 });
    }
}
