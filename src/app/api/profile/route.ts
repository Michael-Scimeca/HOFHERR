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
        const ALLOWED_STRING_FIELDS = ['name', 'phone', 'address', 'avatar', 'birthday', 'preferredPickupTime', 'bio', 'favoriteCut'] as const;
        const patch: Record<string, any> = {};
        for (const key of ALLOWED_STRING_FIELDS) {
            if (body[key] !== undefined) {
                patch[key] = String(body[key]).slice(0, 300);
            }
        }

        // Handle username update with validation and collision check
        if (body.username !== undefined) {
            const cleanUsername = String(body.username).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
            if (cleanUsername.length < 3) {
                return NextResponse.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
            }

            // Check if another customer already has this username
            const duplicate = await adminClient.fetch(
                `*[_type == "customer" && username == $username && _id != $customerId][0]`,
                { username: cleanUsername, customerId: customer._id }
            );

            if (duplicate) {
                return NextResponse.json({ error: 'This username is already taken. Please choose another.' }, { status: 400 });
            }

            patch.username = cleanUsername;
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
