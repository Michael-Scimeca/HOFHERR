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
        const { name, email, phone, avatar } = body;

        // Ensure we're only updating allowed fields
        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone;
        if (avatar !== undefined) updates.avatar = avatar;

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
