import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

function verifyWebhookSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
    if (!signatureHeader || !secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const sigBuf = Buffer.from(signatureHeader);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
        return true;
    }
    const secretBuf = Buffer.from(secret);
    if (sigBuf.length === secretBuf.length && crypto.timingSafeEqual(sigBuf, secretBuf)) {
        return true;
    }
    return false;
}

/**
 * Sanity webhook endpoint for on-demand revalidation.
 * When content is published/unpublished in Sanity, this webhook
 * triggers Next.js to regenerate affected pages.
 *
 * Set up in Sanity:
 *  → Manage → API → Webhooks → Create
 *  → URL: https://yoursite.com/api/webhooks/sanity
 *  → Trigger: Create, Update, Delete
 *  → Secret: your SANITY_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
        const rawBody = await request.text();
        const webhookSecret = process.env.SANITY_WEBHOOK_SECRET || '';
        const signature = request.headers.get('sanity-webhook-signature') || request.headers.get('sanity-webhook-secret');

        if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let body: { _type?: string } | null = null;
        try {
            body = JSON.parse(rawBody);
        } catch {
            return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
        }

            if (!body) {
                return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
            }

            const type = body._type;

            // Revalidate based on document type
            switch (type) {
                case 'product':
                case 'category':
                    revalidatePath('/online-orders');
                    revalidatePath('/shop');
                    break;
                case 'faq':
                    revalidatePath('/faq');
                    break;
                case 'cutGuide':
                    revalidatePath('/cut-guide');
                    break;
                case 'special':
                    revalidatePath('/shop');
                    revalidatePath('/specials');
                    break;
                case 'cateringPackage':
                    revalidatePath('/bbq');
                    break;
                case 'siteSettings':
                    // Settings affect every page (navbar, footer)
                    revalidatePath('/', 'layout');
                    break;
                default:
                    revalidatePath('/');
            }

            return NextResponse.json({
                revalidated: true,
                type,
                now: Date.now(),
            });
        }
