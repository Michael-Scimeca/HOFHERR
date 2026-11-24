import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { adminClient } from '@/sanity/adminClient';
import { auth } from '@/auth';
import { DEFAULT_SETTINGS } from '@/context/SiteSettingsContext';

export const DEFAULT_SEO = {
    seoTitle: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
    seoDescription:
        'Craft butchery in Northfield & Winnetka, IL. Order hand-cut USDA Prime steaks, whole-hog roasts, Italian beef, and BBQ catering online.',
    ogTitle: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
    ogDescription: "Northfield's Premier Craft Butcher & BBQ Pitmasters",
    seoKeywords: [
        'Hofherr Meat Co',
        'butcher shop Northfield IL',
        'craft butcher North Shore',
        'USDA Prime steaks',
        'Winnetka Depot',
        'BBQ catering Chicago North Shore',
        'whole pig roast',
        'house-made sausages',
    ],
    shopName: DEFAULT_SETTINGS.shopName,
    phone: DEFAULT_SETTINGS.phone,
    email: DEFAULT_SETTINGS.email,
};

async function requireAdmin() {
    const session = await auth();
    const cookieStore = await cookies();
    const isGodMode =
        process.env.NODE_ENV !== 'production' &&
        cookieStore.get('hofherr_god_mode')?.value === 'true';

    if (!session?.user && !isGodMode) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
    if (!session?.user?.isAdmin && !isGodMode) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }
    return { error: null };
}

export async function GET() {
    const gate = await requireAdmin();
    if (gate.error) return gate.error;

    try {
        const doc = await adminClient.fetch<{
            _id?: string;
            seoTitle?: string;
            seoDescription?: string;
            ogTitle?: string;
            ogDescription?: string;
            seoKeywords?: string[];
            shopName?: string;
            phone?: string;
            email?: string;
        } | null>(
            `*[_type == "siteSettings"][0]{
                _id,
                seoTitle,
                seoDescription,
                ogTitle,
                ogDescription,
                seoKeywords,
                shopName,
                phone,
                email
            }`
        );

        return NextResponse.json({
            seoTitle: doc?.seoTitle || DEFAULT_SEO.seoTitle,
            seoDescription: doc?.seoDescription || DEFAULT_SEO.seoDescription,
            ogTitle: doc?.ogTitle || doc?.seoTitle || DEFAULT_SEO.ogTitle,
            ogDescription: doc?.ogDescription || doc?.seoDescription || DEFAULT_SEO.ogDescription,
            seoKeywords:
                Array.isArray(doc?.seoKeywords) && doc.seoKeywords.length > 0
                    ? doc.seoKeywords
                    : DEFAULT_SEO.seoKeywords,
            shopName: doc?.shopName || DEFAULT_SEO.shopName,
            phone: doc?.phone || DEFAULT_SEO.phone,
            email: doc?.email || DEFAULT_SEO.email,
        });
    } catch (err) {
        console.error('[GET /api/admin/seo] Error:', err);
        return NextResponse.json(DEFAULT_SEO);
    }
}

export async function PUT(request: Request) {
    const gate = await requireAdmin();
    if (gate.error) return gate.error;

    try {
        const body = (await request.json()) as {
            seoTitle?: string;
            seoDescription?: string;
            ogTitle?: string;
            ogDescription?: string;
            seoKeywords?: string[] | string;
            shopName?: string;
            phone?: string;
            email?: string;
        };

        const seoTitle = (body.seoTitle ?? '').trim().slice(0, 120) || DEFAULT_SEO.seoTitle;
        const seoDescription = (body.seoDescription ?? '').trim().slice(0, 320) || DEFAULT_SEO.seoDescription;
        const ogTitle = (body.ogTitle ?? '').trim().slice(0, 120) || seoTitle;
        const ogDescription = (body.ogDescription ?? '').trim().slice(0, 320) || seoDescription;
        const shopName = (body.shopName ?? '').trim().slice(0, 80) || DEFAULT_SEO.shopName;
        const phone = (body.phone ?? '').trim().slice(0, 40) || DEFAULT_SEO.phone;
        const email = (body.email ?? '').trim().slice(0, 120) || DEFAULT_SEO.email;
        const seoKeywords = Array.isArray(body.seoKeywords)
            ? body.seoKeywords.map((k) => k.trim()).filter(Boolean)
            : typeof body.seoKeywords === 'string'
              ? body.seoKeywords
                    .split(',')
                    .map((k) => k.trim())
                    .filter(Boolean)
              : DEFAULT_SEO.seoKeywords;

        const existing = await adminClient.fetch<{ _id: string } | null>(
            `*[_type == "siteSettings"][0]{ _id }`
        );

        const targetId = existing?._id ?? 'siteSettings';
        if (!existing?._id) {
            await adminClient.createIfNotExists({
                _id: targetId,
                _type: 'siteSettings',
            });
        }

        await adminClient
            .patch(targetId)
            .set({
                seoTitle,
                seoDescription,
                ogTitle,
                ogDescription,
                seoKeywords,
                shopName,
                phone,
                email,
            })
            .commit();

        revalidatePath('/', 'layout');

        return NextResponse.json({
            ok: true,
            seoTitle,
            seoDescription,
            ogTitle,
            ogDescription,
            seoKeywords,
            shopName,
            phone,
            email,
        });
    } catch (err) {
        console.error('[PUT /api/admin/seo] Error:', err);
        return NextResponse.json(
            { error: 'Failed to save Google SEO settings to Sanity.' },
            { status: 500 }
        );
    }
}
