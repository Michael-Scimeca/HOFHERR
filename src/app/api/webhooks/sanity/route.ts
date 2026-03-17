import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

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
    const body = await request.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    // Verify webhook secret
    const secret = request.headers.get('sanity-webhook-secret');
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
