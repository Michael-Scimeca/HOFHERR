import { NextResponse } from 'next/server';
import { buildOrderConfirmationEmail, OrderConfirmationEmailPayload } from '@/lib/email-templates';

/**
 * Order Confirmation Email API
 * Sends a branded HTML confirmation email to the customer after order placement,
 * including the Butcher's Guide to Cuts pieces unlocked in the order.
 */

export async function POST(req: Request) {
    try {
        // Require authentication to prevent abuse (phishing via spoofed order emails)
        const { auth } = await import('@/auth');
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload: OrderConfirmationEmailPayload = await req.json();

        if (!payload.contact?.email) {
            return NextResponse.json({ error: 'No email provided' }, { status: 400 });
        }

        // Only allow sending to the authenticated user's own email (or admin can send to anyone)
        if (!session.user.isAdmin && payload.contact.email.toLowerCase() !== session.user.email?.toLowerCase()) {
            return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:2000';
        const { subject, html, text, cutPieces } = buildOrderConfirmationEmail({
            ...payload,
            baseUrl,
        });

        // Log the email for debugging
        console.log('[Order Confirmation] Email prepared for:', payload.contact.email);
        console.log('[Order Confirmation] Subject:', subject);
        console.log('[Order Confirmation] Butcher Guide Cuts Unlocked:', cutPieces.map((p) => p.key));

        // Send via shared email utility (supports Resend, SendGrid, fallback to console)
        const { sendEmail } = await import('@/lib/email');
        const result = await sendEmail({
            to: payload.contact.email,
            subject,
            html,
            text,
            from: undefined,
        });

        if (result.success) {
            console.log(`[Order Confirmation] Email sent via ${result.provider}`);
        } else {
            console.log('[Order Confirmation] Email not sent — no provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY in .env.local');
        }

        return NextResponse.json({ success: true, unlockedCuts: cutPieces.length });
    } catch (err) {
        console.error('[Order Confirmation] Error:', err);
        return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 });
    }
}
