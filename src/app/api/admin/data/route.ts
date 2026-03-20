import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Secure check: Must be an admin
        if (!session.user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [orders, categories, products] = await Promise.all([
            adminClient.fetch(`*[_type == "order"] | order(createdAt desc) {
                _id,
                orderNumber,
                customer->{name, email},
                items,
                total,
                status,
                createdAt,
                pickupTime,
                couponCode,
                metadata
            }`),
            adminClient.fetch(`*[_type == "category"]`),
            adminClient.fetch(`*[_type == "product"] { _id, name, category->{name} }`)
        ]);

        return NextResponse.json({ orders, categories, products });

    } catch (error: any) {
        console.error('Admin data fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
