import { NextResponse } from 'next/server';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { adminClient } from '@/sanity/adminClient';

/**
 * DEV-ONLY one-time importer: copies product photos from the old Toast ordering page
 * (hofherrmeatco.com/order) onto matching products in Sanity.
 *
 *   POST (text/plain JSON [{name,url}]) — receive the list scraped from the Toast page
 *   GET  ?dry=1                          — preview matches
 *   GET  ?run=1[&overwrite=1]            — download, save to /public/images/products, upload to Sanity
 *
 * Returns 404 outside `next dev`. Safe to delete after the import.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIST = path.join(process.cwd(), 'design-originals', 'toast-images.json');
const OUT = path.join(process.cwd(), 'public', 'images', 'products');
const dev = process.env.NODE_ENV === 'development';

const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Private-Network': 'true',
};

type Item = { name: string; url: string };
type Product = { _id: string; name: string; hasImage: boolean; category?: string };

const norm = (s: string) =>
    s.toLowerCase()
        .replace(/[’']/g, '')
        .replace(/&/g, ' and ')
        .replace(/\bhmco\b\.?/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const slug = (s: string) => norm(s).replace(/ /g, '-').slice(0, 80);

function similarity(a: string, b: string) {
    const A = new Set(a.split(' ')), B = new Set(b.split(' '));
    const inter = [...A].filter((x) => B.has(x)).length;
    return inter / Math.max(A.size, B.size);
}

/** Hand-checked: Toast name → exact Sanity product name (null = don't use this photo). */
const OVERRIDES: Record<string, string | null> = {
    'Prime Boneless Ribeye': 'Boneless Ribeye',
    'Prime Bone-In Ribeye': 'Bone-In Ribeye',
    'Prime New York Strip': 'New York Strip',
    'Prime Porterhouse': 'Porterhouse',
    'Prime T-Bone': 'T-Bone',
    'Bone-In Prime Rib': 'Prime Rib',
    'Fresh Ferndale 12-14lb Turkey': 'Ferndale Turkey',
    'HMCo. Whole Smoked Turkey': 'HMC Smoked Turkey',
    'HMCo. Smoked Turkey Breast': 'HMC Smoked Turkey Breast',
    'Vienna Skinless Hot Dog': 'Hot Dog',
    'Vienna Natural Casing Hot Dog': 'Natural Casing Hot Dog',
    'Two Fat Guys Spicy Barbecue Sauce': 'Two Fat Guys BBQ Spicy',
    'Two Fat Guys Mustard Barbecue Sauce': 'Two Fat Guys Mustard',
    '17th St. Apple City Red BBQ Sauce': '17th Street Apple City Red',
    '17th Street Little Kick Barbecue Sauce': '17th St. Sauce Little Kick',
    'Dukes Real Mayonnaise': "Duke's Mayo 18oz",
    'Localfolks Foods Stoneground Mustard': 'Local Folks Stone Ground Mustard',
    "Mother In Law's Napa Cabbage Kimchi": 'Mother In Law Kimchi',
    'Big Fork Brands': 'Chicago Fire Sauce',
    'Great Lakes Original Potato Chips': 'Great Lakes Original Large',
    'Joe 5oz Sweet Potato Chips': 'Joe Chips Sweet Potato',
    'BLiS Barrel Aged Fish Sauce': 'Blis Fish Sauce',
    'Bacon Fat Dijonaisse': 'Bacon Fat Dijonnaise',
    'Pork Hatch Chili Verde': 'Pork Hatch Chili Verde',
    // wrong fuzzy matches — no equivalent product on the new site
    'JR Kelly Cocktail Sauce': null,
    'Filberts Pumpkin Root Beer': null,
    'Filberts Pumpkin Soda': null,
};

type Match = { toast: string; products: Product[]; score: number; url: string };

function match(items: Item[], products: Product[]): Match[] {
    const byNorm = new Map<string, Product[]>();
    for (const p of products) {
        const k = norm(p.name);
        byNorm.set(k, [...(byNorm.get(k) ?? []), p]);
    }
    const out: Match[] = [];
    const seen = new Set<string>();
    for (const it of items) {
        const key = norm(it.name);
        if (seen.has(key)) continue;
        seen.add(key);
        if (it.name in OVERRIDES) {
            const target = OVERRIDES[it.name];
            out.push({ toast: it.name, products: target ? byNorm.get(norm(target)) ?? [] : [], score: 1, url: it.url });
            continue;
        }
        let best: string | undefined = byNorm.has(key) ? key : undefined;
        let score = best ? 1 : 0;
        if (!best) {
            for (const k of byNorm.keys()) {
                const sc = similarity(key, k);
                if (sc > score) { score = sc; best = k; }
            }
            if (score < 0.8) best = undefined;
        }
        out.push({ toast: it.name, products: best ? byNorm.get(best)! : [], score: Math.round(score * 100) / 100, url: it.url });
    }
    return out;
}

let cachedItemsPromise: Promise<Item[]> | null = null;
function loadToastItems(): Promise<Item[]> {
    if (!cachedItemsPromise) {
        cachedItemsPromise = readFile(LIST, 'utf8').then((txt) => JSON.parse(txt) as Item[]);
    }
    return cachedItemsPromise;
}

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: cors });
}

export async function POST(request: Request) {
    if (!dev) return new Response('Not found', { status: 404 });
    const items = JSON.parse(await request.text()) as Item[];
    await mkdir(path.dirname(LIST), { recursive: true });
    await writeFile(LIST, JSON.stringify(items, null, 1));
    cachedItemsPromise = Promise.resolve(items);
    return NextResponse.json({ ok: true, received: items.length }, { headers: cors });
}

    async function runImport(matches: Match[], overwrite: boolean) {
        await mkdir(OUT, { recursive: true });
        const done: string[] = [];
        const skipped: string[] = [];
        const failed: string[] = [];

        await Promise.all(
            matches.map(async (m) => {
                const targets = m.products.filter((p) => overwrite || !p.hasImage);
                const targetIds = new Set(targets.map((t) => t._id));
                skipped.push(...m.products.filter((p) => !targetIds.has(p._id)).map((p) => p.name));
                if (!targets.length) return;
                try {
                    const res = await fetch(m.url);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buf = Buffer.from(await res.arrayBuffer());
                    const file = `${slug(targets[0].name)}.jpg`;
                    await writeFile(path.join(OUT, file), buf);
                    const asset = await adminClient.assets.upload('image', buf, {
                        filename: file,
                        contentType: res.headers.get('content-type') ?? 'image/jpeg',
                    });
                    await Promise.all(
                        targets.map(async (p) => {
                            await adminClient
                                .patch(p._id)
                                .set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
                                .commit();
                            done.push(p.name);
                        })
                    );
                } catch (e) {
                    failed.push(`${m.toast}: ${(e as Error).message}`);
                }
            })
        );
        return { uploaded: done.length, skipped: skipped.length, failed, done };
    }

    export async function GET() {
        if (!dev) return new Response('Not found', { status: 404 });
        const [items, products] = await Promise.all([
            loadToastItems(),
            adminClient.fetch<Product[]>(
                `*[_type == "product"]{ _id, name, "hasImage": defined(image.asset), "category": category->label }`
            ),
        ]);
        const matches = match(items, products);

        return NextResponse.json({
            toastItems: items.length,
            sanityProducts: products.length,
            matchedCount: matches.filter((m) => m.products.length).length,
            productsGettingPhotos: matches.reduce((n, m) => n + m.products.length, 0),
            matched: matches.filter((m) => m.products.length).map((m) => `${m.toast} → ${m.products[0].name}${m.products.length > 1 ? ` ×${m.products.length}` : ''}${m.score < 1 ? ` (${m.score})` : ''}${m.products.some((p) => p.hasImage) ? ' [has image]' : ''}`),
            unmatched: matches.filter((m) => !m.products.length).map((m) => m.toast),
        });
    }

    export async function PUT(request: Request) {
        if (!dev) return new Response('Not found', { status: 404 });
        const url = new URL(request.url);
        const [items, products] = await Promise.all([
            loadToastItems(),
            adminClient.fetch<Product[]>(
                `*[_type == "product"]{ _id, name, "hasImage": defined(image.asset), "category": category->label }`
            ),
        ]);
        const matches = match(items, products);
        const overwrite = Boolean(url.searchParams.get('overwrite'));
        return NextResponse.json(await runImport(matches, overwrite));
    }
