import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();

        // Whitelist allowed fields to prevent privilege escalation
        const ALLOWED_FIELDS = ['name', 'email', 'phone', 'avatar'] as const;
        const updates: Record<string, string> = {};
        for (const key of ALLOWED_FIELDS) {
            if (body[key] !== undefined) {
                updates[key] = String(body[key]).slice(0, 200);
            }
        }

        if (Object.keys(updates).length > 0) {
            await adminClient
                .patch(session.user.id)
                .set(updates)
                .commit();
        }

        return NextResponse.json({ success: true, user: updates });
    } catch (error) {
        console.error('Error updating profile:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
