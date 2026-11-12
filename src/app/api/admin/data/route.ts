import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        const cookieStore = await cookies();
        const isGodMode =
            process.env.NODE_ENV !== 'production' &&
            cookieStore.get('hofherr_god_mode')?.value === 'true';

        if (!session?.user && !isGodMode) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Secure check: Must be an admin
        if (!session?.user?.isAdmin && !isGodMode) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [orders, categories, products, restocks] = await Promise.all([
            adminClient.fetch(`*[_type == "order"] | order(createdAt desc) {
                _id,
                orderNumber,
                customer->{name, email, phone},
                items,
                total,
                status,
                createdAt,
                pickupTime,
                couponCode,
                metadata
            }`),
            adminClient.fetch(`*[_type == "category"]`),
            adminClient.fetch(`*[_type == "product"] { _id, name, category->{name} }`),
            adminClient.fetch(`*[_type == "restockRequest"] | order(createdAt desc)`)
        ]);

        return NextResponse.json({ orders, categories, products, restocks });

    } catch (error: any) {
        console.error('Admin data fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
