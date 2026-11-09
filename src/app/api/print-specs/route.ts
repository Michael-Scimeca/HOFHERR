import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { DEFAULT_SPECS, type PrintSpec } from '@/app/product-identity/sizes/specs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOC_ID = 'printSpecs';

/** Saved specs merged over the defaults (new default items appear automatically). */
async function load(): Promise<PrintSpec[]> {
    const doc = await adminClient.fetch<{ items?: (PrintSpec & { _key?: string })[] } | null>(`*[_id == $id][0]{ items }`, { id: DOC_ID });
    const saved = new Map((doc?.items ?? []).map((i) => [i.key, i]));
    const merged = DEFAULT_SPECS.map((d) => ({ ...d, ...(saved.get(d.key) ?? {}) }));
    const custom = (doc?.items ?? []).filter((i) => !DEFAULT_SPECS.some((d) => d.key === i.key));
    return [...merged, ...custom].map(({ _key, ...rest }) => rest as PrintSpec);
}

export async function GET() {
    return NextResponse.json({ items: await load() });
}

/** PUT { items } — saves the whole list. Allowed for admins, or anyone on the local dev server. */
export async function PUT(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        const { auth } = await import('@/auth');
        const session = await auth();
        if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Sign in as an admin to save sizes.' }, { status: 401 });
    }
    const { items } = (await request.json()) as { items: PrintSpec[] };
    const clean = items.map((i) => ({
        _key: i.key,
        key: i.key,
        group: String(i.group ?? 'Custom'),
        name: String(i.name),
        w: Math.max(0.1, Number(i.w)),
        h: Math.max(0.1, Number(i.h)),
        bleed: Math.max(0, Number(i.bleed) || 0),
        shape: i.shape,
        art: i.art || undefined,
        note: i.note || undefined,
    }));
    await adminClient.createOrReplace({ _id: DOC_ID, _type: 'printSpecs', items: clean, updatedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, items: await load() });
}
