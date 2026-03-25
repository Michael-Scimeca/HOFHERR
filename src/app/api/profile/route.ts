import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY } from '@/sanity/queries';
import { syncMailchimpSubscription } from '@/lib/mailchimp';

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Find the customer by email
        const customer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email: session.user.email });

        if (!customer?._id) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Whitelist allowed fields to prevent privilege escalation
        const ALLOWED_STRING_FIELDS = ['name', 'phone', 'address', 'avatar', 'birthday', 'preferredPickupTime'] as const;
        const patch: Record<string, any> = {};
        for (const key of ALLOWED_STRING_FIELDS) {
            if (body[key] !== undefined) {
                patch[key] = String(body[key]).slice(0, 200);
            }
        }
        // Boolean field
        if (body.newsletter !== undefined) {
            patch.newsletter = Boolean(body.newsletter);
        }

        // Update customer in Sanity
        await adminClient.patch(customer._id).set(patch).commit();

        // Sync newsletter preference to Mailchimp (fire-and-forget — won't break profile save)
        if (patch.newsletter !== undefined) {
            syncMailchimpSubscription(session.user.email, patch.newsletter as boolean)
                .catch(err => console.error('[Mailchimp] Unexpected error:', err));
        }

        return NextResponse.json({ success: true, updated: patch });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
