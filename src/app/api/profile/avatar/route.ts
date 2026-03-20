import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { CUSTOMER_BY_EMAIL_QUERY } from '@/sanity/queries';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('avatar') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
        }

        // Find the customer
        const customer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email: session.user.email });

        if (!customer?._id) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Upload to Sanity
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await adminClient.assets.upload('image', buffer, {
            filename: `avatar-${customer._id}`,
            contentType: file.type,
        });

        // Save the URL on the customer document
        const avatarUrl = asset.url;
        await adminClient.patch(customer._id).set({ avatar: avatarUrl }).commit();

        return NextResponse.json({ success: true, avatarUrl });

    } catch (error: any) {
        console.error('Avatar upload error:', error);
        return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
    }
}
