import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isRateLimited, getClientIp, escapeHtml } from '@/lib/security';
import { buildRestockFilledEmail } from '@/lib/email-templates';

// ─── Restock Request API ─────────────────────────────────────────────────────
// Supports:
// - GET: Fetch restock requests for the currently signed-in customer
// - POST: Create a new restock request (requires signed-in customer)
// - PATCH: Mark a restock request as 'notified' (filled) and send customer email
// - DELETE: Remove/dismiss a restock request

interface RestockPayload {
    name: string;
    contactType: 'phone' | 'email';
    contact: string;
    customerEmail?: string;
    item: string;
    qty: number;
    store: string;
}

export async function sendCustomerRestockFilledEmail(params: {
    toEmail: string;
    customerName: string;
    item: string;
    qty: number;
    store: string;
}): Promise<boolean> {
    const cleanEmail = (params.toEmail || '').trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
        console.log(`[Restock Filled] No valid email address for ${params.customerName} (${params.item}). Notification saved to profile page.`);
        return false;
    }

    const { subject, html, text } = buildRestockFilledEmail({
        customerName: params.customerName,
        item: params.item,
        qty: params.qty || 1,
        store: params.store || 'butcher',
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
        try {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass },
            });

            await transporter.sendMail({
                from: smtpUser,
                to: cleanEmail,
                subject,
                text,
                html,
            });
            console.log(`[Restock Filled] Sent customer email to ${cleanEmail} for "${params.item}"`);
            return true;
        } catch (err) {
            console.error('[Restock Filled Email Error]', err);
            return false;
        }
    } else {
        console.log(`[Restock Filled — dev mode] Sent email to ${cleanEmail}: "${subject}"`);
        return true;
    }
}

export async function GET(req: NextRequest) {
    try {
        const { auth } = await import('@/auth');
        const session = await auth();
        const url = new URL(req.url);
        const queryEmail = (url.searchParams.get('email') || session?.user?.email || '').trim();
        const queryName = (url.searchParams.get('name') || session?.user?.name || '').trim();

        if (!queryEmail && !queryName) {
            return NextResponse.json({ requests: [] });
        }

        const requests = await adminClient.fetch(
            `*[_type == "restockRequest" && (
                (defined(customerEmail) && lower(customerEmail) == lower($email)) ||
                (contactType == "email" && lower(contactValue) == lower($email)) ||
                (defined(customerName) && lower(customerName) == lower($name))
            )] | order(createdAt desc) {
                _id,
                customerName,
                customerEmail,
                contactType,
                contactValue,
                item,
                qty,
                store,
                status,
                createdAt,
                notifiedAt
            }`,
            {
                email: queryEmail || '__none__',
                name: queryName || '__none__',
            }
        );

        return NextResponse.json({ requests: Array.isArray(requests) ? requests : [] });
    } catch (err) {
        console.error('[Restock GET Error]', err);
        return NextResponse.json({ requests: [] });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Require authenticated user (or dev God Mode cookie) to request restock
        const { auth } = await import('@/auth');
        const session = await auth();
        const isGodMode =
            process.env.NODE_ENV !== 'production' &&
            req.cookies.get('hofherr_god_mode')?.value === 'true';

        if (!session?.user && !isGodMode) {
            return NextResponse.json({ error: 'Please sign in to request a restock.' }, { status: 401 });
        }

        // Rate limit: 5 requests per minute per IP
        const ip = getClientIp(req);
        if (isRateLimited('restock', ip, 5)) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const body: RestockPayload = await req.json();
        const { name, contactType, contact, customerEmail: bodyEmail, item, qty, store } = body;

        // Validate
        if (!name?.trim() || !item?.trim()) {
            return NextResponse.json(
                { error: 'Name and item are required.' },
                { status: 400 }
            );
        }

        const resolvedCustomerEmail = (
            session?.user?.email ||
            bodyEmail ||
            (contactType === 'email' ? contact : '') ||
            (isGodMode ? 'mikeyscimeca@gmail.com' : '')
        ).trim();

        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const subject = `🥩 Restock Request: ${item}`;
        const contactLabel = contactType === 'phone' ? 'Phone' : 'Email';

        const text = [
            `Restock Request from Hofherr Meat Co.`,
            ``,
            `Customer: ${name.trim()}`,
            `Email: ${resolvedCustomerEmail || 'Not provided'}`,
            `${contactLabel}: ${contact || 'Not provided'}`,
            `Item: ${item}`,
            `Quantity: ${qty}`,
            `Store: ${store === 'butcher' ? 'The Butcher Shop' : 'The Depot'}`,
            `Submitted: ${timestamp}`,
            ``,
            `— Sent automatically from hofherrmeat.com`,
        ].join('\n');

        let createdDocId: string | null = null;
        const createdAtIso = new Date().toISOString();

        // Save to Sanity
        try {
            const created = await adminClient.create({
                _type: 'restockRequest',
                customerName: name.trim(),
                customerEmail: resolvedCustomerEmail,
                customerId: session?.user?.id || '',
                contactType,
                contactValue: contact || resolvedCustomerEmail || '',
                item,
                qty,
                store,
                status: 'pending',
                createdAt: createdAtIso,
            });
            createdDocId = created._id;
            console.log(`[Restock] Saved request for ${item} to Sanity (${created._id}).`);
        } catch (sanityErr) {
            console.error('[Restock Error] Failed to save to Sanity:', sanityErr);
        }

        const html = `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #c0392b; margin: 0 0 16px;">🥩 Restock Request</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(name.trim())}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(resolvedCustomerEmail || 'Not provided')}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">${escapeHtml(contactLabel)}</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(contact || 'Not provided')}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Item</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(item)}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Quantity</td><td style="padding: 8px 0; font-weight: 600;">${qty}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Store</td><td style="padding: 8px 0; font-weight: 600;">${store === 'butcher' ? 'The Butcher Shop' : 'The Depot'}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Submitted</td><td style="padding: 8px 0;">${timestamp}</td></tr>
                </table>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #999;">Sent from hofherrmeat.com</p>
            </div>
        `;

        // Check for SMTP / email credentials
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const notifyEmail = process.env.RESTOCK_NOTIFY_EMAIL;

        if (smtpHost && smtpUser && smtpPass && notifyEmail) {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass },
            });

            await transporter.sendMail({
                from: smtpUser,
                to: notifyEmail,
                subject,
                text,
                html,
            });

            console.log(`[Restock] Email sent to ${notifyEmail} for "${item}" (qty: ${qty})`);
        } else {
            console.log(`[Restock — dev mode] ${name} (${resolvedCustomerEmail}) requested ${qty}x "${item}" (${store})`);
        }

        return NextResponse.json({
            success: true,
            id: createdDocId,
            createdAt: createdAtIso,
            customerEmail: resolvedCustomerEmail,
            message: 'Restock request received!',
        });
    } catch (err) {
        console.error('[Restock Error]', err);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { auth } = await import('@/auth');
        const session = await auth();
        const isDev = process.env.NODE_ENV === 'development';

        if (!session?.user && !isDev) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, item, customerEmail, customerName, qty, store } = body;

        const notifiedAt = new Date().toISOString();

        // If a Sanity document ID was provided, update it in Sanity
        if (id && !String(id).startsWith('local-')) {
            const doc = await adminClient.fetch(
                `*[_id == $id && _type == "restockRequest"][0]{
                    _id,
                    customerName,
                    customerEmail,
                    contactType,
                    contactValue,
                    item,
                    qty,
                    store
                }`,
                { id }
            );

            if (doc) {
                await adminClient
                    .patch(id)
                    .set({ status: 'notified', notifiedAt })
                    .commit();

                const targetEmail =
                    doc.customerEmail ||
                    (doc.contactType === 'email' ? doc.contactValue : '') ||
                    customerEmail ||
                    session?.user?.email ||
                    '';

                const emailSent = await sendCustomerRestockFilledEmail({
                    toEmail: targetEmail,
                    customerName: doc.customerName || customerName || 'Customer',
                    item: doc.item || item || 'Requested Cut',
                    qty: doc.qty || qty || 1,
                    store: doc.store || store || 'butcher',
                });

                return NextResponse.json({
                    success: true,
                    id,
                    status: 'notified',
                    notifiedAt,
                    emailSent,
                    emailedTo: targetEmail,
                });
            }
        }

        // Fallback when fulfilling a local/demo restock request or by item name
        const fallbackEmail = customerEmail || session?.user?.email || '';
        const emailSent = await sendCustomerRestockFilledEmail({
            toEmail: fallbackEmail,
            customerName: customerName || session?.user?.name || 'Customer',
            item: item || 'Requested Cut',
            qty: qty || 1,
            store: store || 'butcher',
        });

        return NextResponse.json({
            success: true,
            id: id || null,
            status: 'notified',
            notifiedAt,
            emailSent,
            emailedTo: fallbackEmail,
        });
    } catch (err) {
        console.error('[Restock PATCH Error]', err);
        return NextResponse.json({ error: 'Failed to update restock request' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { auth } = await import('@/auth');
        const session = await auth();
        const isDev = process.env.NODE_ENV === 'development';

        if (!session?.user && !isDev) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (id.startsWith('local-')) {
            return NextResponse.json({ success: true });
        }

        const doc = await adminClient.fetch(
            `*[_id == $id && _type == "restockRequest"][0]{ _id, customerEmail, contactValue }`,
            { id }
        );
        if (!doc) {
            return NextResponse.json({ error: 'Restock request not found' }, { status: 404 });
        }

        // Allow admin or the owner of the restock request to delete/dismiss it
        const userEmail = (session?.user?.email || '').toLowerCase();
        const isOwner =
            userEmail &&
            (String(doc.customerEmail || '').toLowerCase() === userEmail ||
                String(doc.contactValue || '').toLowerCase() === userEmail);

        if (!session?.user?.isAdmin && !isOwner && !isDev) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await adminClient.delete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[Restock Delete Error]', err);
        return NextResponse.json({ error: 'Failed to delete restock request' }, { status: 500 });
    }
}
