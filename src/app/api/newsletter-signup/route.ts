import { NextResponse } from 'next/server';
import { syncMailchimpSubscription } from '@/lib/mailchimp';

/**
 * POST /api/newsletter-signup
 * Body: { email: string, name?: string }
 *
 * Called from the homepage Newsletter component's Email List tab.
 * Subscribes the address to the Mailchimp audience and optionally
 * sets the FNAME merge field.
 */
export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        // Use the shared Mailchimp helper — it gracefully warns if creds aren't set yet
        await syncMailchimpSubscription(email.trim().toLowerCase(), true, name?.trim() || undefined);

        // Send confirmation email (fire-and-forget)
        try {
            const { sendEmail } = await import('@/lib/email');
            const { buildNewsletterWelcomeEmail } = await import('@/lib/email-templates');
            const { subject, html, text } = buildNewsletterWelcomeEmail(email, name);
            sendEmail({ to: email.trim().toLowerCase(), subject, html, text })
                .then(r => console.log('[Newsletter] Confirmation email:', r.success ? 'sent' : 'skipped'))
                .catch(err => console.error('[Newsletter] Confirmation email error:', err));
        } catch (emailErr) {
            console.error('[Newsletter] Could not prepare confirmation email:', emailErr);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[newsletter-signup] Error:', error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
