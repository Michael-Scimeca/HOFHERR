import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';

/**
 * POST /api/gift-cards/validate
 * Looks up a Hofherr Meat Co. gift card code in Sanity and returns its remaining balance.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const rawCode = typeof body?.code === 'string' ? body.code : '';
        const code = rawCode.trim().toUpperCase();

        if (!code || code.length < 4 || code.length > 40) {
            return NextResponse.json(
                { valid: false, error: 'Please enter a valid gift card code.' },
                { status: 400 }
            );
        }

        const card = await adminClient.fetch<{
            _id: string;
            code: string;
            balanceCents?: number;
            balance?: number;
            active?: boolean;
            expiresAt?: string;
        } | null>(
            `*[_type == "giftCard" && upper(code) == $code][0]{
                _id,
                code,
                balanceCents,
                balance,
                active,
                expiresAt
            }`,
            { code }
        );

        if (!card) {
            return NextResponse.json(
                { valid: false, error: 'Gift card code not found. Double-check the code or call (847) 441-MEAT.' },
                { status: 404 }
            );
        }

        if (card.active === false) {
            return NextResponse.json(
                { valid: false, error: 'This gift card is inactive.' },
                { status: 400 }
            );
        }

        if (card.expiresAt && new Date(card.expiresAt).getTime() < Date.now()) {
            return NextResponse.json(
                { valid: false, error: 'This gift card has expired.' },
                { status: 400 }
            );
        }

        const balanceCents =
            typeof card.balanceCents === 'number'
                ? Math.max(0, Math.round(card.balanceCents))
                : typeof card.balance === 'number'
                  ? Math.max(0, Math.round(card.balance * 100))
                  : 0;

        if (balanceCents <= 0) {
            return NextResponse.json(
                { valid: false, balanceCents: 0, error: 'This gift card has a $0.00 remaining balance.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            valid: true,
            code: card.code || code,
            balanceCents,
            balanceFormatted: `$${(balanceCents / 100).toFixed(2)}`,
            expiresAt: card.expiresAt ?? null,
        });
    } catch (err) {
        console.error('[GiftCard Validate] Error:', err);
        return NextResponse.json(
            { valid: false, error: 'Unable to check gift card balance right now.' },
            { status: 500 }
        );
    }
}

