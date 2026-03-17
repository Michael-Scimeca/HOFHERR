import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { ORDER_HISTORY_QUERY } from '@/sanity/queries';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }

        const orders = await adminClient.fetch(ORDER_HISTORY_QUERY, { customerId });

        return NextResponse.json({ orders });

    } catch (error: any) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
