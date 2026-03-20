import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY } from '@/sanity/queries';

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
        const ALLOWED_FIELDS = ['name', 'phone', 'address', 'avatar'] as const;
        const patch: Record<string, string> = {};
        for (const key of ALLOWED_FIELDS) {
            if (body[key] !== undefined) {
                patch[key] = String(body[key]).slice(0, 200);
            }
        }

        // Update customer in Sanity
        await adminClient.patch(customer._id).set(patch).commit();

        return NextResponse.json({ success: true, updated: patch });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
