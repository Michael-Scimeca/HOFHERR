'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Animal = 'beef' | 'pork' | 'chicken' | 'lamb' | 'game';
type CutEntry = { name: string; sub: string; best: string; cook: string; tip: string; image?: string | null };

type SanityCut = {
    _id: string;
    name: string;
    animal: string;
    subcut: string | null;
    bestFor: string | null;
    cookingMethod: string | null;
    tip: string | null;
    image: string | null;
};

interface Props {
    sanityCuts?: SanityCut[];
}

/* ── Hardcoded cut data (fallback) ── */
const DEFAULT_CUTS: Record<Animal, CutEntry[]> = {
    beef: [
        { name: 'Ribeye', sub: 'Rib section', best: 'Steakhouse-quality grilling', cook: 'Grill · Cast Iron', tip: 'Pull at 125°F for medium-rare. Let it rest 5 min.' },
        { name: 'Strip Steak', sub: 'Short loin', best: 'Bold, beefy flavor with a firm chew', cook: 'Grill · Pan Sear', tip: "Season with just salt & pepper — it doesn't need help." },
        { name: 'Tenderloin', sub: 'Short loin / Sirloin', best: 'Butter-soft texture, mild flavor', cook: 'Roast · Pan Sear · Grill', tip: "Don't overcook — 130°F is perfect." },
        { name: 'T-Bone', sub: 'Short loin', best: 'Two steaks in one — strip + tenderloin', cook: 'Grill', tip: 'Bring to room temp before grilling for even cook.' },
        { name: 'Chuck Roast', sub: 'Chuck', best: 'Braising, pot roast, slow BBQ', cook: 'Braise · Slow Roast · Sous Vide', tip: 'Low and slow — 12+ hours at 250°F unlocks buttery texture.' },
        { name: 'Brisket', sub: 'Chest / Brisket', best: 'BBQ. Full stop.', cook: 'Smoke · Braise', tip: 'Fat cap up, 225°F, 1–1.5 hrs per pound.' },
        { name: 'Short Ribs', sub: 'Chuck / Plate', best: 'Braised, Korean BBQ, slow-cooked', cook: 'Braise · Grill · Smoke', tip: 'Flanken-style for Korean BBQ, English-style for braise.' },
        { name: 'Flank Steak', sub: 'Flank', best: 'Fajitas, stir-fry, salads', cook: 'Grill · Broil', tip: 'Always slice against the grain at a 45° angle.' },
        { name: 'Skirt Steak', sub: 'Plate', best: 'Carne asada, tacos, quick sear', cook: 'Grill · Cast Iron', tip: 'High heat, fast cook — 2 min per side max.' },
        { name: 'Ground Beef', sub: 'Mixed trimmings', best: 'Burgers, meatballs, Bolognese', cook: 'Pan · Grill', tip: '80/20 fat ratio keeps burgers juicy.' },
    ],
    pork: [
        { name: 'Pork Chop', sub: 'Loin', best: 'Quick weeknight dinner', cook: 'Pan Sear · Grill', tip: 'Bone-in stays juicier. Pull at 145°F.' },
        { name: 'Pork Tenderloin', sub: 'Short loin', best: 'Lean, fast-cooking roast', cook: 'Roast · Grill', tip: 'Sear all sides first, then finish in the oven at 400°F.' },
        { name: 'Pork Shoulder', sub: 'Boston Butt / Picnic', best: 'Pulled pork, carnitas, low-and-slow BBQ', cook: 'Smoke · Braise · Roast', tip: '195–205°F internal — it needs to "push through the stall."' },
        { name: 'Baby Back Ribs', sub: 'Loin back', best: 'Classic BBQ ribs', cook: 'Smoke · Oven · Grill', tip: '3-2-1 method: 3 hrs smoke · 2 hrs foil · 1 hr sauce.' },
        { name: 'St. Louis Ribs', sub: 'Spare rib / Plate', best: 'Meatier, longer cook BBQ ribs', cook: 'Smoke · Oven', tip: 'Remove the membrane. Cook low, 225–250°F.' },
        { name: 'Pork Belly', sub: 'Belly', best: 'Bacon, braised dishes, ramen topping', cook: 'Braise · Roast · Smoke', tip: 'Score the fat before roasting for crispy crackling.' },
        { name: 'Ham', sub: 'Leg', best: 'Holiday centerpiece, sandwiches', cook: 'Roast · Smoke · Braise', tip: 'Fresh ham = full cook. Cured ham = just reheat & glaze.' },
        { name: 'Italian Sausage', sub: 'Mixed pork', best: 'Pasta, sandwiches, pizza topping', cook: 'Pan · Grill · Simmer', tip: 'Poke links before grilling to prevent blowouts.' },
    ],
    chicken: [
        { name: 'Whole Chicken', sub: 'Full bird', best: 'Roasting, spatchcocking, rotisserie', cook: 'Roast · Rotisserie · Grill', tip: 'Dry-brine overnight in the fridge for crispiest skin.' },
        { name: 'Chicken Breast', sub: 'Breast', best: 'Quick, lean protein', cook: 'Grill · Pan Sear · Poach', tip: 'Pound to even thickness for uniform cooking. Pull at 160°F.' },
        { name: 'Chicken Thigh', sub: 'Thigh', best: 'More flavor than breast — hard to dry out', cook: 'Grill · Braise · Bake', tip: 'Bone-in, skin-on = best results every time.' },
        { name: 'Chicken Drumstick', sub: 'Drumstick', best: 'Finger food, game-day cooking', cook: 'Bake · Grill · Fry', tip: 'Score the meat to help marinades penetrate.' },
        { name: 'Chicken Wings', sub: 'Wing', best: 'Game day, parties, appetizers', cook: 'Fry · Bake · Grill · Smoke', tip: 'Toss in baking powder + salt before baking = extra crispy.' },
        { name: 'Spatchcock Bird', sub: 'Whole flattened', best: 'Fastest way to roast a whole chicken', cook: 'Grill · Oven', tip: 'Removes the backbone to flatten — cuts cook time by 30%.' },
    ],
    lamb: [
        { name: 'Rack of Lamb', sub: 'Rib section', best: 'The showstopper dinner party cut', cook: 'Roast · Grill', tip: 'French the bones, herb crust, roast at 450°F. Simple perfection.' },
        { name: 'Lamb Chops', sub: 'Loin or rib', best: 'Quick-cooking, elegant weeknight steak', cook: 'Pan Sear · Grill', tip: 'Hot pan, 3 min per side, butter baste at the end.' },
        { name: 'Leg of Lamb', sub: 'Leg', best: 'Easter & holiday centerpiece', cook: 'Roast · Grill · Slow Roast', tip: 'Butterflied leg grills faster; bone-in roasts better.' },
        { name: 'Lamb Shoulder', sub: 'Chuck equivalent', best: 'Low-and-slow, kleftiko, pulled lamb', cook: 'Braise · Slow Roast', tip: 'Cook at 300°F for 4–5 hrs until it falls apart.' },
        { name: 'Ground Lamb', sub: 'Mixed trimmings', best: 'Burgers, kofta, Bolognese', cook: 'Grill · Pan', tip: 'Mix with garlic, cumin & fresh mint for kebabs.' },
    ],
    game: [
        { name: 'Venison Loin', sub: 'Deer — backstrap', best: 'The finest wild game steak', cook: 'Pan Sear · Grill', tip: 'Cook to 130°F max — venison dries out fast. Rest 5 min and slice thin.' },
        { name: 'Venison Shoulder', sub: 'Deer — chuck equivalent', best: 'Slow-cooked roasts, stews, chili', cook: 'Braise · Slow Roast', tip: 'Game shoulders are lean — add fat (bacon, lard) when braising.' },
        { name: 'Wild Boar Shoulder', sub: 'Feral pig — boston butt', best: 'Pulled "pork", ragu, slow BBQ', cook: 'Smoke · Braise · Slow Roast', tip: 'Richer and gamier than pork — pairs beautifully with juniper and rosemary.' },
        { name: 'Bison Ribeye', sub: 'American buffalo — rib', best: 'Leaner, more flavorful alternative to beef ribeye', cook: 'Grill · Cast Iron', tip: 'Cook one temperature lower than beef — bison runs hot faster.' },
        { name: 'Elk Roast', sub: 'Elk — round or loin', best: 'Holiday centerpiece, medallions', cook: 'Roast · Pan Sear', tip: 'Mild and sweet compared to deer. Marinate only if you want extra depth.' },
        { name: 'Duck Breast', sub: 'Mallard / Muscovy', best: 'Pan-seared showstopper — rich and medium-rare', cook: 'Pan Sear · Roast', tip: 'Score the fat cap in a crosshatch. Start skin-side down in a cold pan — render low and slow, then blast heat at the end.' },
        { name: 'Pheasant (Whole)', sub: 'Upland bird', best: 'Roasting, braising, stuffed preparations', cook: 'Roast · Braise', tip: 'Lean birds dry out quickly — bard with bacon or baste constantly.' },
        { name: 'Rabbit (Whole)', sub: 'Domestic or wild', best: 'Braises, stews, French-style fricassee', cook: 'Braise · Roast · Grill', tip: "Treat the saddle like a tenderloin — quick cook. The legs and shoulders need low-and-slow." },
        { name: 'Quail (Whole)', sub: 'Bobwhite / Coturnix', best: 'Elegant appetizer or plated entrée', cook: 'Grill · Roast · Pan Sear', tip: 'Spatchcock for even cooking. Stuff with herbs and wrap in prosciutto for a dinner party centerpiece.' },
    ],
};

const TABS: { id: Animal; label: string; emoji: string }[] = [
    { id: 'beef', label: 'Beef', emoji: '🐄' },
    { id: 'pork', label: 'Pork', emoji: '🐷' },
    { id: 'chicken', label: 'Chicken', emoji: '🐓' },
    { id: 'lamb', label: 'Lamb', emoji: '🐑' },
    { id: 'game', label: 'Game & Exotic', emoji: '🦌' },
];

const COOK_COLORS: Record<string, string> = {
    'Grill': '#e8501a', 'Cast Iron': '#6b4226', 'Pan Sear': '#a0522d',
    'Roast': '#b8860b', 'Braise': '#2e7d6e', 'Smoke': '#444',
    'Slow Roast': '#5a6e3a', 'Sous Vide': '#2563eb', 'Broil': '#c0392b',
    'Pan': '#888', 'Oven': '#b8860b', 'Fry': '#d97706',
    'Poach': '#059669', 'Simmer': '#0891b2', 'Rotisserie': '#e8501a', 'Bake': '#7c3aed',
};

export default function CutGuideClient({ sanityCuts = [] }: Props) {
    const [active, setActive] = useState<Animal>('beef');

    // Build cuts from Sanity data, falling back to hardcoded
    const cutsByAnimal = useMemo(() => {
        if (!sanityCuts.length) return DEFAULT_CUTS;

        const grouped: Record<string, CutEntry[]> = {};
        for (const sc of sanityCuts) {
            const animal = sc.animal || 'beef';
            if (!grouped[animal]) grouped[animal] = [];
            grouped[animal].push({
                name: sc.name,
                sub: sc.subcut || '',
                best: sc.bestFor || '',
                cook: sc.cookingMethod || '',
                tip: sc.tip || '',
                image: sc.image,
            });
        }
        // Fill any missing animals from fallback
        for (const a of Object.keys(DEFAULT_CUTS) as Animal[]) {
            if (!grouped[a]?.length) grouped[a] = DEFAULT_CUTS[a];
        }
        return grouped as Record<Animal, CutEntry[]>;
    }, [sanityCuts]);

    const cuts = cutsByAnimal[active] || [];

    return (
        <main>
            {/* ── Hero ── */}
            <section style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '80px 40px 64px', textAlign: 'center' }}>
                <p className="animate-fade-up" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--red)', marginBottom: 14 }}>
                    From the butcher&apos;s block
                </p>
                <h1 className="animate-fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--fg)', marginBottom: 16, animationDelay: '0.1s' }}>
                    The Cut Guide
                </h1>
                <p className="animate-fade-up" style={{ fontSize: '1rem', color: 'var(--fg-muted)', lineHeight: 1.7, animationDelay: '0.2s' }}>
                    Every cut. What it&apos;s best for. How to cook it. Straight from Sean.
                </p>
            </section>

            {/* ── Animal tabs ── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '28px 24px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky' as const, top: 72, zIndex: 10 }}>
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActive(t.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 22px', borderRadius: 100,
                            border: active === t.id ? '1.5px solid var(--red)' : '1.5px solid var(--border)',
                            background: active === t.id ? 'var(--red)' : 'none',
                            color: active === t.id ? '#fff' : 'var(--fg-muted)',
                            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.18s',
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{t.emoji}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* ── Cut cards ── */}
            <section style={{ padding: '56px 0 80px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                        {cuts.map((cut) => (
                            <div key={cut.name} style={{
                                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16,
                                padding: 28, display: 'flex', flexDirection: 'column' as const, gap: 14,
                            }}>
                                <div>
                                    <h2 style={{ fontFamily: "", fontSize: '1.25rem', color: 'var(--fg)', margin: '0 0 4px' }}>{cut.name}</h2>
                                    <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--fg-muted)', margin: 0 }}>{cut.sub}</p>
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>
                                    <strong style={{ color: 'var(--fg)' }}>Best for:</strong> {cut.best}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                                    {cut.cook.split('·').map((m) => {
                                        const method = m.trim();
                                        const color = COOK_COLORS[method] ?? '#666';
                                        return (
                                            <span key={method} style={{
                                                fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                                                background: `${color}1a`, color, border: `1px solid ${color}4d`, whiteSpace: 'nowrap' as const,
                                            }}>
                                                {method}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div style={{
                                    display: 'flex', gap: 10, alignItems: 'flex-start',
                                    background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10,
                                    padding: '12px 14px', marginTop: 'auto',
                                }}>
                                    <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1.6 }}>💡</span>
                                    <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{cut.tip}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '72px 24px', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontFamily: ", serif", fontSize: '2rem', color: 'var(--fg)', marginBottom: 10 }}>Need a specific cut?</h2>
                    <p style={{ fontSize: 15, color: 'var(--fg-muted)', marginBottom: 28 }}>We cut everything fresh to order. Just ask.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
                        <a href="tel:8474416328" className="btn btn-primary">📞 Call Us</a>
                        <Link href="/online-orders" className="btn btn-primary">Order Online</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
