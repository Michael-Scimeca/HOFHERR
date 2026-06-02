import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { ORDER_HISTORY_QUERY } from '@/sanity/queries';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        // Require authentication to prevent unauthorized access to order data
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }

        // Verify the requesting user owns this customer ID (or is admin)
        if (session.user.id !== customerId && !session.user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const orders = await adminClient.fetch(ORDER_HISTORY_QUERY, { customerId });

        return NextResponse.json({ orders });

    } catch (error: any) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
