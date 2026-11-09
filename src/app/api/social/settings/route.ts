import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { isAuthorized } from '@/lib/social/auth';
import { getSettings } from '@/lib/social/plan';
import type { SocialSettings } from '@/lib/social/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const settings = await getSettings(adminClient);
    const connected = {
        instagram: Boolean(process.env.META_IG_USER_ID && process.env.META_PAGE_ACCESS_TOKEN),
        facebook: Boolean(process.env.META_PAGE_ID && process.env.META_PAGE_ACCESS_TOKEN),
        x: ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET'].every((k) => process.env[k]),
        email: Boolean(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY),
    };
    return NextResponse.json({ settings, connected });
}

/** PUT partial settings; { addWord } appends to the spell-check dictionary. */
export async function PUT(request: Request) {
    if (!(await isAuthorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = (await request.json()) as Partial<SocialSettings> & { addWord?: string };
    const current = await getSettings(adminClient);
    const next: SocialSettings = { ...current };
    if (body.addWord) next.customWords = Array.from(new Set([...current.customWords, body.addWord.trim()]));
    for (const k of ['frequency', 'customDays', 'postTime', 'platforms', 'notifyEmails', 'requireApproval', 'verificationCadence', 'defaultVerifier'] as const) {
        if (body[k] !== undefined) (next as Record<string, unknown>)[k] = body[k];
    }
    await adminClient.createOrReplace({ _id: 'socialSettings', _type: 'socialSettings', ...next });
    return NextResponse.json({ ok: true, settings: next });
}
