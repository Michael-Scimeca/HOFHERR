import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';

/**
 * GET /api/auth/verify-email?token=xxx
 *
 * Called when the user clicks the verification link in their email.
 * Looks up the customer by token, checks expiry, marks emailVerified = true,
 * clears the token, and redirects to a success page.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/verify-email?status=invalid', req.url));
        }

        // Look up customer by verification token
        const customer = await adminClient.fetch(
            `*[_type == "customer" && verifyToken == $token][0]{ _id, email, name, emailVerified, verifyTokenExpiry }`,
            { token } as any
        );

        if (!customer) {
            return NextResponse.redirect(new URL('/verify-email?status=invalid', req.url));
        }

        // Check if already verified
        if (customer.emailVerified) {
            return NextResponse.redirect(new URL('/verify-email?status=already', req.url));
        }

        // Check expiry
        if (customer.verifyTokenExpiry && new Date(customer.verifyTokenExpiry) < new Date()) {
            return NextResponse.redirect(new URL('/verify-email?status=expired', req.url));
        }

        // Mark as verified & clear token
        await adminClient
            .patch(customer._id)
            .set({
                emailVerified: true,
                verifyToken: '',
                verifyTokenExpiry: '',
            })
            .commit();

        console.log(`[Verify Email] ✅ Verified: ${customer.email}`);

        // Now send the welcome email since verification is complete
        try {
            const { sendEmail } = await import('@/lib/email');
            const { buildWelcomeEmail } = await import('@/lib/email-templates');
            const { subject, html, text } = buildWelcomeEmail(customer.name || '', customer.email);
            sendEmail({ to: customer.email, subject, html, text })
                .then(r => console.log('[Verify Email] Welcome email:', r.success ? 'sent' : 'skipped'))
                .catch(err => console.error('[Verify Email] Welcome email error:', err));
        } catch (emailErr) {
            console.error('[Verify Email] Could not send welcome email:', emailErr);
        }

        return NextResponse.redirect(new URL('/verify-email?status=success', req.url));

    } catch (err) {
        console.error('[Verify Email] Error:', err);
        return NextResponse.redirect(new URL('/verify-email?status=error', req.url));
    }
}
