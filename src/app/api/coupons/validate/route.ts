import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { COUPON_BY_CODE_QUERY } from '@/sanity/queries';

export async function POST(req: Request) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const coupon = await adminClient.fetch(COUPON_BY_CODE_QUERY, { code: code.toUpperCase() });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 404 });
        }

        // Check expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
        }

        return NextResponse.json({ 
            valid: true, 
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        });

    } catch (error: any) {
        console.error('Coupon validation error:', error);
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
}
