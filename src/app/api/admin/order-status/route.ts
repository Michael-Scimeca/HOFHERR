import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.isAdmin && process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Order ID and Status required' }, { status: 400 });
        }

        const updatedOrder = await adminClient
            .patch(orderId)
            .set({ status })
            .commit();

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: any) {
        console.error('Update status error:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
