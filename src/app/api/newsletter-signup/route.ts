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

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[newsletter-signup] Error:', error);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
