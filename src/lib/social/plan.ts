import type { SanityClient } from 'next-sanity';
import { HOW_TOS, TRIVIA, TRICKS, HASHTAGS } from '@/app/product-identity/social/copy';
import { ANIMALS } from '@/app/product-identity/social/animals';
import { RECIPES } from './recipes';
import { DEFAULT_SETTINGS, type SocialContent, type SocialPost, type SocialSettings, type SocialWeek, type Slide } from './types';

const PHOTOS = [
    '/assets/specials-bbq.jpg',
    '/assets/Store-butcher.jpg',
    '/assets/shop-interior.jpg',
    '/assets/specials-italian-beef.jpg',
    '/assets/specials-rotisserie.jpg',
    '/assets/specials-pig-roast.jpg',
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const TZ = 'America/Chicago';
const CHICAGO_YMD_FMT = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

const tags = (title: string) => HASHTAGS.find((h) => h.title.startsWith(title))?.text ?? '';
const LOCAL = tags('Everyday');
const key = () => Math.random().toString(36).slice(2, 10);

/* ── dates ─────────────────────────────────────────────── */
/** Monday (YYYY-MM-DD) of the week containing `d`, in Chicago time. */
export function mondayOf(d = new Date()): string {
    const ymd = CHICAGO_YMD_FMT.format(d);
    const local = new Date(`${ymd}T12:00:00Z`);
    local.setUTCDate(local.getUTCDate() - ((local.getUTCDay() + 6) % 7));
    return local.toISOString().slice(0, 10);
}

/** Convert a Chicago wall-clock date + time to a UTC ISO string (handles DST). */
export function chicagoToUtc(ymd: string, hhmm: string): string {
    const [h, m] = hhmm.split(':').map(Number);
    const guess = new Date(`${ymd}T${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00Z`);
    const asLocal = new Date(guess.toLocaleString('en-US', { timeZone: TZ }));
    const offset = guess.getTime() - asLocal.getTime();
    return new Date(guess.getTime() + offset).toISOString();
}

export const weekDocId = (weekOf: string) => `socialWeek-${weekOf}`;

export function postingDays(s: SocialSettings): string[] {
    switch (s.frequency) {
        case 'daily': return [...DAYS];
        case 'weekdays': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        case 'custom': return DAYS.filter((d) => s.customDays?.includes(d));
        case 'alternate':
        default: return ['Mon', 'Wed', 'Fri', 'Sun'];
    }
}

export async function getSettings(client: SanityClient): Promise<SocialSettings> {
    const doc = await client.fetch(`*[_id == "socialSettings"][0]`);
    return { ...DEFAULT_SETTINGS, ...(doc ?? {}), customWords: doc?.customWords ?? [], notifyEmails: doc?.notifyEmails ?? [] };
}

/* ── seed ──────────────────────────────────────────────── */
export function seedDocs(): Omit<SocialContent, '_id'>[] {
    const docs: Omit<SocialContent, '_id'>[] = [];
    RECIPES.forEach((r) => docs.push({ kind: 'recipe', title: r.title, body: r.meta, ingredients: r.ingredients, items: r.steps, photo: r.photo, animal: r.iconId === 'cow' ? 'beef' : r.iconId === 'pig' ? 'pork' : r.iconId, iconId: r.iconId, active: true, seedKey: `recipe-${r.slug}` }));
    HOW_TOS.forEach((h) => docs.push({ kind: 'howto', title: h.title, body: h.kicker, items: h.steps, animal: 'beef', iconId: 'cow', active: true, seedKey: `howto-${h.slug}` }));
    TRIVIA.forEach((t) => docs.push({ kind: 'trivia', title: t.q, body: t.a, animal: 'general', iconId: 'cow', active: true, seedKey: `trivia-${t.slug}` }));
    TRICKS.forEach((t) => docs.push({ kind: 'tip', title: t.title, body: t.body, animal: 'general', iconId: 'cow', active: true, seedKey: `tip-${t.slug}` }));
    ANIMALS.forEach((a) => {
        docs.push({ kind: 'cuts', title: a.name, items: a.primals.map((p) => `${p.name} | ${p.where} | ${p.bestFor}`), animal: a.slug, iconId: a.iconId, active: true, seedKey: `cuts-${a.slug}` });
        a.facts.forEach((f, i) =>
            docs.push({ kind: 'fact', title: `${a.name} fact ${i + 1}`, body: f, animal: a.slug, iconId: a.iconId, active: true, seedKey: `fact-${a.slug}-${i + 1}` })
        );
    });
    return docs;
}

/* ── X caption: ≤ 280 chars incl. two hashtags ─────────── */
function xCaption(text: string, hashtags = '#hofherrmeatco #shoplocal') {
    const oneLine = text.replace(/\n{2,}/g, '\n').replace(/📍[\s\S]*$/, '').trim();
    const room = 280 - hashtags.length - 2;
    const body = oneLine.length > room ? `${oneLine.slice(0, room - 1).replace(/\s+\S*$/, '')}…` : oneLine;
    return `${body}\n\n${hashtags}`;
}

/* ── weekly plan ───────────────────────────────────────── */
type Special = { title?: string; description?: string; salePrice?: string; regularPrice?: string; img?: string } | null;
type Draft = Omit<SocialPost, '_key' | 'approved' | 'version' | 'day' | 'status' | 'scheduledFor'>;

export async function buildWeek(client: SanityClient, weekOf = mondayOf()): Promise<SocialWeek> {
    const [settings, bank, special] = await Promise.all([
        getSettings(client),
        client.fetch<SocialContent[]>(
            `*[_type == "socialContent" && active != false] | order(coalesce(lastUsed, "0000-00-00") asc, _createdAt asc)`
        ),
        client.fetch<Special>(
            `*[_type == "special" && isActive == true] | order(sortOrder asc)[0]{ title, description, salePrice, regularPrice, "img": image.asset->url }`
        ),
    ]);
    if (!bank.length) throw new Error('Content bank is empty — load the starter content first.');

    const weekNum = Math.floor(new Date(weekOf).getTime() / (7 * 864e5));
    const photo = (n: number) => PHOTOS[(weekNum + n) % PHOTOS.length];
    const used = new Set<string>();
    const pick = (kind: SocialContent['kind'], filter?: (c: SocialContent) => boolean) => {
        const c = bank.find((b) => b.kind === kind && !used.has(b._id) && (!filter || filter(b)));
        if (c) used.add(c._id);
        return c;
    };
    let lastAnimal: string | undefined;

    const builders: Record<string, () => Draft | null> = {
        specials: () => {
            const caption = `This week at the block 🔥\n\n${special?.title ?? '[Special]'} — ${special?.salePrice ?? '[price]'}\n${special?.description ?? ''}\n\nThrough Sunday or while it lasts. Call ahead and we'll have it wrapped: (847) 441-MEAT\n\n📍 Northfield · The Depot, Winnetka`.replace(/\n{3,}/g, '\n\n');
            return {
                kind: 'specials',
                label: 'Weekly special',
                contentIds: [],
                slides: [{
                    _key: key(), template: 'specials', kicker: 'This week at the block',
                    headline: special?.title ?? '[Special name]',
                    body: special?.salePrice ? `${special.salePrice}${special.regularPrice ? ` · reg. ${special.regularPrice}` : ''}` : '[price] · thru Sunday',
                    photo: special?.img ?? photo(0), iconId: 'cow',
                }],
                caption, captionX: xCaption(caption), hashtags: `${LOCAL} ${tags('Butcher')}`,
            };
        },
        howto: () => {
            const h = pick('howto');
            if (!h) return null;
            const caption = `Save this for steak night 📌\n\n${h.title} in ${h.items?.length ?? 5} steps — swipe through 👉\n\nPick up your cut at the counter and we'll tell you exactly how thick to go. Questions? Drop them below.`;
            return {
                kind: 'howto', label: `How-to: ${h.title}`, contentIds: [h._id],
                slides: [
                    { _key: key(), template: 'howto-cover', kicker: h.body || 'How to cook it', headline: h.title, body: `${h.items?.length ?? 0} steps · swipe →`, photo: photo(1), iconId: h.iconId },
                    { _key: key(), template: 'howto-steps', headline: h.title, items: h.items ?? [], iconId: h.iconId },
                ],
                caption, captionX: xCaption(`${h.title} — ${h.items?.length ?? 5} steps from our butchers 👇 Save it for steak night.`), hashtags: `${LOCAL} ${tags('Cooking')}`,
            };
        },
        recipe: () => {
            const r = pick('recipe');
            if (!r) return null;
            const caption = `Tonight's dinner, sorted 🍽️\n\n${r.title} (${r.body ?? ''})\n\nSwipe for the ingredients and method 👉 Grab everything you need at the counter — we'll cut it to order.\n\nMake it? Tag us so we can see!`;
            return {
                kind: 'recipe', label: `Recipe: ${r.title}`, contentIds: [r._id],
                slides: [
                    { _key: key(), template: 'recipe-cover', kicker: 'Recipe', headline: r.title, body: r.body ?? '', photo: r.photo || photo(2), iconId: r.iconId },
                    { _key: key(), template: 'recipe-ingredients', kicker: 'You will need', headline: r.title, items: r.ingredients ?? [], iconId: r.iconId },
                    { _key: key(), template: 'howto-steps', headline: 'Method', items: r.items ?? [], iconId: r.iconId },
                ],
                caption, captionX: xCaption(`Recipe: ${r.title} (${r.body ?? ''}). Ingredients and method in the photos — we'll cut the meat to order.`), hashtags: `${LOCAL} ${tags('Cooking')}`,
            };
        },
        cuts: () => {
            const c = pick('cuts');
            if (!c) return null;
            lastAnimal = c.animal;
            const slug = c.animal || 'beef';
            const facts = [pick('fact', (f) => f.animal === c.animal), pick('fact', (f) => f.animal === c.animal)].filter(Boolean) as SocialContent[];
            const caption = `Know your cuts: ${c.title.toLowerCase()} 🔪\n\nSave this for your next trip to the counter 📌 Swipe for the butcher cut chart, primal breakdown, and facts most people don't know 👉\n\nWhich cut should we cover next?`;
            return {
                kind: 'cuts', label: `Know your cuts: ${c.title}`, contentIds: [c._id, ...facts.map((f) => f._id)],
                slides: [
                    { _key: key(), template: 'chart', kicker: 'Know your cuts', headline: `${c.title} Cut Chart`, photo: `/assets/social/cut-chart-${slug}.svg`, iconId: c.iconId },
                    { _key: key(), template: 'guide', kicker: 'Know your cuts', headline: c.title, items: c.items ?? [], iconId: c.iconId },
                    ...facts.map((f, i): Slide => ({ _key: key(), template: 'fact', kicker: 'Did you know?', headline: `${c.title} fact ${i + 1} / ${facts.length}`, body: f.body, iconId: f.iconId, tone: i % 2 ? 'cream' : 'crimson' })),
                ],
                caption, captionX: xCaption(`Know your cuts: ${c.title.toLowerCase()} 🔪 Where every cut comes from — and what to do with it.`), hashtags: `${LOCAL} ${tags('Butcher')}`,
            };
        },
        tip: () => {
            const t = pick('tip');
            if (!t) return null;
            const caption = `Kitchen trick from behind the counter 🔪\n\n${t.body}\n\nTry it this week and tell us how it went.`;
            return {
                kind: 'tip', label: `Trick: ${t.title}`, contentIds: [t._id],
                slides: [{ _key: key(), template: 'tip', kicker: 'Kitchen trick', headline: t.title, body: t.body, iconId: t.iconId }],
                caption, captionX: xCaption(`Kitchen trick 🔪 ${t.title}. ${t.body}`), hashtags: `${LOCAL} ${tags('Cooking')}`,
            };
        },
        trivia: () => {
            const t = pick('trivia');
            if (!t) return null;
            const caption = `Butcher trivia 🧠\n\n${t.title}\n\nThink you know? Comment your answer before you swipe 👉`;
            return {
                kind: 'trivia', label: `Trivia: ${t.title}`, contentIds: [t._id],
                slides: [
                    { _key: key(), template: 'trivia-q', kicker: 'Butcher trivia', headline: t.title, body: 'Comment your answer · swipe to find out →', iconId: t.iconId },
                    { _key: key(), template: 'trivia-a', kicker: 'The answer', body: t.body, iconId: t.iconId },
                ],
                caption, captionX: xCaption(`Butcher trivia 🧠 ${t.title} Reply with your answer 👇`), hashtags: `${LOCAL} ${tags('Cooking')}`,
            };
        },
        fact: () => {
            const f = pick('fact', (x) => x.animal !== lastAnimal) ?? pick('fact');
            if (!f) return null;
            const animal = f.animal && f.animal !== 'general' ? f.animal[0].toUpperCase() + f.animal.slice(1) : 'Butcher';
            const caption = `Did you know? 🧠\n\n${f.body}\n\nAsk us anything at the counter — we love this stuff.`;
            return {
                kind: 'fact', label: `Did you know: ${animal}`, contentIds: [f._id],
                slides: [{ _key: key(), template: 'fact', kicker: 'Did you know?', headline: `${animal} fact`, body: f.body, iconId: f.iconId, tone: 'crimson' }],
                caption, captionX: xCaption(`Did you know? 🧠 ${f.body}`), hashtags: `${LOCAL} ${tags('Butcher')}`,
            };
        },
    };

    // Priority order — fewer posting days keeps the strongest formats.
    // Recipes twice a week when posting daily; every other day still gets one.
    const order = ['specials', 'recipe', 'cuts', 'trivia', 'recipe', 'howto', 'tip'];
    const days = postingDays(settings);
    const posts: SocialPost[] = [];
    days.forEach((day, i) => {
        const draft = builders[order[i % order.length]]?.() ?? builders.fact() ?? builders.tip();
        if (!draft) return;
        const ymd = new Date(`${weekOf}T12:00:00Z`);
        ymd.setUTCDate(ymd.getUTCDate() + DAYS.indexOf(day as (typeof DAYS)[number]));
        posts.push({
            ...draft,
            _key: key(),
            day,
            approved: !settings.requireApproval,
            status: settings.requireApproval ? 'draft' : 'approved',
            scheduledFor: chicagoToUtc(ymd.toISOString().slice(0, 10), settings.postTime || '11:00'),
            version: 1,
        });
    });

    return { _id: weekDocId(weekOf), weekOf, generatedAt: new Date().toISOString(), posts };
}

/** Save the week and stamp lastUsed on every content item it used. */
export async function saveWeek(client: SanityClient, week: SocialWeek) {
    const ids = week.posts.flatMap((p) => p.contentIds);
    const tx = client.transaction().createOrReplace({ _type: 'socialWeek', ...week });
    ids.forEach((id) => tx.patch(id, (p) => p.set({ lastUsed: week.weekOf })));
    await tx.commit();
    return week;
}

/**
 * Pure synchronous builder for a full 4-week (1-month) starter schedule using
 * ANIMALS, HOW_TOS, TRIVIA, TRICKS, and RECIPES so Day, Weekly, and Monthly
 * verification & editing work immediately out of the box.
 */
export function buildStarterWeeks(settings: SocialSettings = DEFAULT_SETTINGS, numWeeks = 4, startMonday = mondayOf()): SocialWeek[] {
    const bank: SocialContent[] = seedDocs().map((d, idx) => ({ ...d, _id: `seed-${d.seedKey ?? idx}` }));
    const specialsSample = [
        { title: 'Dry-Aged Prime Ribeye', salePrice: '$29.99/lb', regularPrice: '$34.99/lb', description: '28-day dry-aged Midwest Prime beef, hand-trimmed to order.', img: PHOTOS[0] },
        { title: 'Heritage Berkshire Pork Chops', salePrice: '$12.99/lb', regularPrice: '$15.99/lb', description: 'Thick-cut bone-in heritage chops from Illinois family farms.', img: PHOTOS[5] },
        { title: 'Amish Rotisserie Chickens', salePrice: '$14.99 ea', regularPrice: '$17.99 ea', description: 'Brined 24 hours and slow-spun over hardwood.', img: PHOTOS[4] },
        { title: 'House Italian Beef & Giardiniera', salePrice: '$13.50', regularPrice: '$15.50', description: 'Slow-roasted sirloin shaved thin in 24-hour bone jus.', img: PHOTOS[3] },
    ];

    const used = new Set<string>();
    const pick = (kind: SocialContent['kind'], filter?: (c: SocialContent) => boolean) => {
        let c = bank.find((b) => b.kind === kind && !used.has(b._id) && (!filter || filter(b)));
        if (!c) {
            // Reset used for this kind so 4-week schedule never runs dry
            bank.filter((b) => b.kind === kind).forEach((b) => used.delete(b._id));
            c = bank.find((b) => b.kind === kind && (!filter || filter(b)));
        }
        if (c) used.add(c._id);
        return c;
    };

    const weeks: SocialWeek[] = [];
    const days = postingDays(settings.frequency === 'daily' ? settings : { ...settings, frequency: 'daily' });

    for (let w = 0; w < numWeeks; w++) {
        const monDate = new Date(`${startMonday}T12:00:00Z`);
        monDate.setUTCDate(monDate.getUTCDate() + w * 7);
        const weekOf = monDate.toISOString().slice(0, 10);
        const sp = specialsSample[w % specialsSample.length];
        const animal = ANIMALS[w % ANIMALS.length];

        const order = ['cuts', 'specials', 'recipe', 'howto', 'trivia', 'tip', 'fact'] as const;
        const posts: SocialPost[] = [];

        days.forEach((day, i) => {
            const slot = order[i % order.length];
            const ymd = new Date(`${weekOf}T12:00:00Z`);
            ymd.setUTCDate(ymd.getUTCDate() + DAYS.indexOf(day as (typeof DAYS)[number]));
            const sched = chicagoToUtc(ymd.toISOString().slice(0, 10), settings.postTime || '11:00');
            let draft: Draft | null = null;

            if (slot === 'cuts') {
                draft = {
                    kind: 'cuts',
                    label: `Know your cuts: ${animal.name}`,
                    contentIds: [`seed-cuts-${animal.slug}`],
                    slides: [
                        { _key: key(), template: 'chart', kicker: 'Know your cuts', headline: `${animal.name} Cut Chart`, photo: animal.chartSrc, iconId: animal.iconId },
                        { _key: key(), template: 'guide', kicker: 'Know your cuts', headline: animal.name, items: animal.primals.map((p) => `${p.name} | ${p.where} | ${p.bestFor}`), iconId: animal.iconId },
                        ...animal.facts.slice(0, 2).map((f, fi): Slide => ({
                            _key: key(),
                            template: 'fact',
                            kicker: 'Did you know?',
                            headline: `${animal.name} fact ${fi + 1} / 2`,
                            body: f,
                            iconId: animal.iconId,
                            tone: fi % 2 ? 'cream' : 'crimson',
                        })),
                    ],
                    caption: `Know your cuts: ${animal.name.toLowerCase()} 🔪\n\nSave this for your next trip to the counter 📌 Swipe for the butcher cut chart, primal breakdown, and facts most people don't know 👉\n\nWhich cut should we cover next?`,
                    captionX: xCaption(`Know your cuts: ${animal.name.toLowerCase()} 🔪 Where every cut comes from — and what to do with it.`),
                    hashtags: `${LOCAL} ${tags('Butcher')}`,
                };
            } else if (slot === 'specials') {
                const caption = `This week at the block 🔥\n\n${sp.title} — ${sp.salePrice}\n${sp.description}\n\nThrough Sunday or while it lasts. Call ahead and we'll have it wrapped: (847) 441-MEAT\n\n📍 Northfield · The Depot, Winnetka`;
                draft = {
                    kind: 'specials',
                    label: `Weekly special: ${sp.title}`,
                    contentIds: [],
                    slides: [{
                        _key: key(), template: 'specials', kicker: 'This week at the block',
                        headline: sp.title, body: `${sp.salePrice} · reg. ${sp.regularPrice}`,
                        photo: sp.img, iconId: 'cow',
                    }],
                    caption, captionX: xCaption(caption), hashtags: `${LOCAL} ${tags('Butcher')}`,
                };
            } else if (slot === 'recipe') {
                const r = pick('recipe');
                if (r) {
                    const caption = `Tonight's dinner, sorted 🍽️\n\n${r.title} (${r.body ?? ''})\n\nSwipe for the ingredients and method 👉 Grab everything you need at the counter — we'll cut it to order.`;
                    draft = {
                        kind: 'recipe', label: `Recipe: ${r.title}`, contentIds: [r._id],
                        slides: [
                            { _key: key(), template: 'recipe-cover', kicker: 'Recipe', headline: r.title, body: r.body ?? '', photo: r.photo || PHOTOS[2], iconId: r.iconId },
                            { _key: key(), template: 'recipe-ingredients', kicker: 'You will need', headline: r.title, items: r.ingredients ?? [], iconId: r.iconId },
                            { _key: key(), template: 'howto-steps', headline: 'Method', items: r.items ?? [], iconId: r.iconId },
                        ],
                        caption, captionX: xCaption(`Recipe: ${r.title} (${r.body ?? ''}). Ingredients and method in the photos.`), hashtags: `${LOCAL} ${tags('Cooking')}`,
                    };
                }
            } else if (slot === 'howto') {
                const h = pick('howto');
                if (h) {
                    const caption = `Save this for steak night 📌\n\n${h.title} in ${h.items?.length ?? 5} steps — swipe through 👉\n\nPick up your cut at the counter and we'll tell you exactly how thick to go.`;
                    draft = {
                        kind: 'howto', label: `How-to: ${h.title}`, contentIds: [h._id],
                        slides: [
                            { _key: key(), template: 'howto-cover', kicker: h.body || 'How to cook it', headline: h.title, body: `${h.items?.length ?? 0} steps · swipe →`, photo: PHOTOS[1], iconId: h.iconId },
                            { _key: key(), template: 'howto-steps', headline: h.title, items: h.items ?? [], iconId: h.iconId },
                        ],
                        caption, captionX: xCaption(`${h.title} — ${h.items?.length ?? 5} steps from our butchers 👇`), hashtags: `${LOCAL} ${tags('Cooking')}`,
                    };
                }
            } else if (slot === 'trivia') {
                const t = pick('trivia');
                if (t) {
                    const caption = `Butcher trivia 🧠\n\n${t.title}\n\nThink you know? Comment your answer before you swipe 👉`;
                    draft = {
                        kind: 'trivia', label: `Trivia: ${t.title}`, contentIds: [t._id],
                        slides: [
                            { _key: key(), template: 'trivia-q', kicker: 'Butcher trivia', headline: t.title, body: 'Comment your answer · swipe to find out →', iconId: t.iconId },
                            { _key: key(), template: 'trivia-a', kicker: 'The answer', body: t.body, iconId: t.iconId },
                        ],
                        caption, captionX: xCaption(`Butcher trivia 🧠 ${t.title} Reply with your answer 👇`), hashtags: `${LOCAL} ${tags('Cooking')}`,
                    };
                }
            } else if (slot === 'tip') {
                const t = pick('tip');
                if (t) {
                    const caption = `Kitchen trick from behind the counter 🔪\n\n${t.body}\n\nTry it this week and tell us how it went.`;
                    draft = {
                        kind: 'tip', label: `Trick: ${t.title}`, contentIds: [t._id],
                        slides: [{ _key: key(), template: 'tip', kicker: 'Kitchen trick', headline: t.title, body: t.body, iconId: t.iconId }],
                        caption, captionX: xCaption(`Kitchen trick 🔪 ${t.title}. ${t.body}`), hashtags: `${LOCAL} ${tags('Cooking')}`,
                    };
                }
            } else {
                const f = pick('fact');
                if (f) {
                    const aLabel = f.animal && f.animal !== 'general' ? f.animal[0].toUpperCase() + f.animal.slice(1) : 'Butcher';
                    const caption = `Did you know? 🧠\n\n${f.body}\n\nAsk us anything at the counter — we love this stuff.`;
                    draft = {
                        kind: 'fact', label: `Did you know: ${aLabel}`, contentIds: [f._id],
                        slides: [{ _key: key(), template: 'fact', kicker: 'Did you know?', headline: `${aLabel} fact`, body: f.body, iconId: f.iconId, tone: 'crimson' }],
                        caption, captionX: xCaption(`Did you know? 🧠 ${f.body}`), hashtags: `${LOCAL} ${tags('Butcher')}`,
                    };
                }
            }

            if (draft) {
                posts.push({
                    ...draft,
                    _key: `${weekOf}-${day.toLowerCase()}`,
                    day,
                    approved: false,
                    status: 'draft',
                    scheduledFor: sched,
                    version: 1,
                });
            }
        });

        weeks.push({
            _id: weekDocId(weekOf),
            weekOf,
            generatedAt: new Date().toISOString(),
            posts,
        });
    }
    return weeks;
}
