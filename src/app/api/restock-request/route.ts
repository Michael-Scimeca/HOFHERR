import { NextRequest, NextResponse } from 'next/server';

// ─── Restock Request API ─────────────────────────────────────────────────────
// Accepts { name, item, qty, store } and sends an email notification.
// When SMTP credentials are configured, it sends via nodemailer.
// Otherwise, it logs to console (dev mode) so the UI still works.

interface RestockPayload {
    name: string;
    contactType: 'phone' | 'email';
    contact: string;
    item: string;
    qty: number;
    store: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: RestockPayload = await req.json();
        const { name, contactType, contact, item, qty, store } = body;

        // Validate
        if (!name?.trim() || !item?.trim()) {
            return NextResponse.json(
                { error: 'Name and item are required.' },
                { status: 400 }
            );
        }

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
            `${contactLabel}: ${contact || 'Not provided'}`,
            `Item: ${item}`,
            `Quantity: ${qty}`,
            `Store: ${store === 'butcher' ? 'The Butcher Shop' : 'The Depot'}`,
            `Submitted: ${timestamp}`,
            ``,
            `— Sent automatically from hofherrmeat.com`,
        ].join('\n');

        const html = `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #c0392b; margin: 0 0 16px;">🥩 Restock Request</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; font-weight: 600;">${name.trim()}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">${contactLabel}</td><td style="padding: 8px 0; font-weight: 600;">${contact || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Item</td><td style="padding: 8px 0; font-weight: 600;">${item}</td></tr>
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
            // Send real email via nodemailer
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
            // Dev mode — just log
            console.log(`[Restock — dev mode] ${name} requested ${qty}x "${item}" (${store})`);
            console.log(`  To enable email, set SMTP_HOST, SMTP_USER, SMTP_PASS, RESTOCK_NOTIFY_EMAIL in .env.local`);
        }

        return NextResponse.json({
            success: true,
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
