'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './CutGuide.module.css';

type Animal = 'beef' | 'pork' | 'chicken' | 'lamb';

const CUTS: Record<Animal, { name: string; sub: string; best: string; cook: string; tip: string }[]> = {
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
};

const TABS: { id: Animal; label: string; emoji: string }[] = [
    { id: 'beef', label: 'Beef', emoji: '🐄' },
    { id: 'pork', label: 'Pork', emoji: '🐷' },
    { id: 'chicken', label: 'Chicken', emoji: '🐓' },
    { id: 'lamb', label: 'Lamb', emoji: '🐑' },
];

const COOK_COLORS: Record<string, string> = {
    'Grill': '#e8501a', 'Cast Iron': '#6b4226', 'Pan Sear': '#a0522d',
    'Roast': '#b8860b', 'Braise': '#2e7d6e', 'Smoke': '#444',
    'Slow Roast': '#5a6e3a', 'Sous Vide': '#2563eb', 'Broil': '#c0392b',
    'Pan': '#888', 'Oven': '#b8860b', 'Fry': '#d97706',
    'Poach': '#059669', 'Simmer': '#0891b2', 'Rotisserie': '#e8501a', 'Bake': '#7c3aed',
};

export default function CutGuide() {
    const [active, setActive] = useState<Animal>('beef');
    const cuts = CUTS[active];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">From the Butcher&apos;s Block</div>
                    <h2 className={styles.title}>The Cut Guide</h2>
                    <p className={styles.sub}>Every cut. What it&apos;s best for. How to cook it. Straight from Sean.</p>
                </div>

                <div className={styles.tabBar}>
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
                            onClick={() => setActive(t.id)}
                        >
                            <span>{t.emoji}</span> {t.label}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {cuts.map(cut => (
                        <div key={cut.name} className={styles.card}>
                            <div className={styles.cardHead}>
                                <div className={styles.cutName}>{cut.name}</div>
                                <div className={styles.cutSub}>{cut.sub}</div>
                            </div>
                            <p className={styles.cutBest}><strong>Best for:</strong> {cut.best}</p>
                            <div className={styles.cookMethods}>
                                {cut.cook.split('·').map(m => (
                                    <span
                                        key={m}
                                        className={styles.cookTag}
                                        style={{ '--tag': COOK_COLORS[m.trim()] ?? '#666' } as React.CSSProperties}
                                    >
                                        {m.trim()}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.tip}>
                                <span>💡</span>
                                <span>{cut.tip}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <p>Need a specific cut? We cut everything fresh to order.</p>
                    <div className={styles.ctaBtns}>
                        <a href="tel:8474416328" className="btn btn-primary">📞 Call Us</a>
                        <Link href="/online-orders" className="btn btn-secondary">Order Online</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
