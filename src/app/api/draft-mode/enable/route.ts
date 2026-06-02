import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/draft-mode/enable?secret=xxx&redirect=/path
 *
 * Enables Next.js draft mode for Sanity live previews.
 * Requires a secret token to prevent unauthorized access to unpublished content.
 * Validates redirect target to prevent open-redirect attacks.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Require a preview secret to prevent unauthorized draft access
    if (!process.env.SANITY_PREVIEW_SECRET) {
        return NextResponse.json(
            { error: 'SANITY_PREVIEW_SECRET not configured' },
            { status: 503 }
        );
    }

    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const dm = await draftMode();
    dm.enable();

    // Validate redirect is same-origin to prevent open redirect
    const redirectTo = searchParams.get('redirect') || '/';
    const targetUrl = new URL(redirectTo, request.url);
    const requestUrl = new URL(request.url);

    if (targetUrl.origin !== requestUrl.origin) {
        return NextResponse.json({ error: 'Invalid redirect target' }, { status: 400 });
    }

    return NextResponse.redirect(targetUrl);
}
