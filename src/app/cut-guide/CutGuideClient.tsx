'use client';

import { useState, useMemo, useRef, useEffect, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import styles from './page.module.css';

export type Animal = 'beef' | 'pork' | 'chicken' | 'lamb' | 'game';

export type CutEntry = {
    name: string;
    sub: string;
    best: string;
    cook: string;
    tip: string;
    image?: string | null;
};

export type SanityCut = {
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
    /** Rendered inside another page (Shop): no <main>, H2 heading, no closing CTA. */
    embedded?: boolean;
}

type AnimalMeta = {
    id: Animal;
    label: string;
    emoji: string;
    heading: string;
    sourcingTag: string;
    description: string;
    bannerSrc: string;
    bannerAlt: string;
};

/* ── Hardcoded cut data (fallback when Sanity has no entries for a category) ── */
export const DEFAULT_CUTS: Record<Animal, CutEntry[]> = {
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
        { name: 'Rabbit (Whole)', sub: 'Domestic or wild', best: 'Braises, stews, French-style fricassee', cook: 'Braise · Roast · Grill', tip: 'Treat the saddle like a tenderloin — quick cook. The legs and shoulders need low-and-slow.' },
        { name: 'Quail (Whole)', sub: 'Bobwhite / Coturnix', best: 'Elegant appetizer or plated entrée', cook: 'Grill · Roast · Pan Sear', tip: 'Spatchcock for even cooking. Stuff with herbs and wrap in prosciutto for a dinner party centerpiece.' },
    ],
};

const ANIMALS: AnimalMeta[] = [
    {
        id: 'beef',
        label: 'Beef',
        emoji: '🐄',
        heading: 'USDA Prime & Dry-Aged Beef',
        sourcingTag: 'Midwest Family Farms · Custom Cut to Order',
        description:
            'From heavily marbled USDA Prime ribeyes and house dry-aged loins to smoker-ready whole packer briskets, every steak and roast is hand-trimmed on the block to your thickness.',
        bannerSrc: '/assets/cuts/beef-prime-cuts-packaged.jpg',
        bannerAlt: 'Hand-trimmed USDA Prime beef steaks and roasts from Hofherr Meat Co.',
    },
    {
        id: 'pork',
        label: 'Pork',
        emoji: '🐷',
        heading: 'Heritage Duroc & Berkshire Pork',
        sourcingTag: 'Pasture-Raised Heritage Breeds · House-Ground Sausage',
        description:
            'Richly marbled heritage pork chops, competition-trimmed ribs, whole Boston butts for the offset smoker, and coarse-ground sausages linked fresh in our Northfield kitchen.',
        bannerSrc: '/assets/cuts/pork-heritage-cuts-packaged.jpg',
        bannerAlt: 'Heritage pork chops, ribs, and house-made sausages at Hofherr Meat Co.',
    },
    {
        id: 'chicken',
        label: 'Poultry',
        emoji: '🐓',
        heading: 'Pasture-Raised Poultry',
        sourcingTag: 'Air-Chilled · Antibiotic & Hormone Free',
        description:
            'Air-chilled Amish and pasture-raised birds that roast up with shatter-crisp skin and deep, clean flavor — available whole, spatchcocked on request, or parted out for the grill.',
        bannerSrc: '/assets/cuts/poultry-pasture-cuts-packaged.jpg',
        bannerAlt: 'Pasture-raised whole chicken and poultry cuts prepared at Hofherr Meat Co.',
    },
    {
        id: 'lamb',
        label: 'Lamb',
        emoji: '🐑',
        heading: 'Domestic Pasture-Raised Lamb',
        sourcingTag: 'Frenched Racks · Boneless & Bone-In Roasts',
        description:
            'Sweet, mild domestic lamb Frenched cleanly for dinner-party racks, tied and seasoned for holiday legs, or cut thick from the shoulder for slow Mediterranean braises.',
        bannerSrc: '/assets/cuts/lamb-pasture-cuts-packaged.jpg',
        bannerAlt: 'Frenched rack of lamb, loin chops, and leg roasts from Hofherr Meat Co.',
    },
    {
        id: 'game',
        label: 'Game & Exotic',
        emoji: '🦌',
        heading: 'Specialty Game & Exotic Cuts',
        sourcingTag: 'Seasonal & Special Order · Venison, Bison, Elk & Duck',
        description:
            'Lean, deeply flavorful wild game and specialty proteins — from bison ribeyes and venison backstraps to Muscovy duck breasts and upland birds. Call ahead to reserve seasonal cuts.',
        bannerSrc: '/assets/cuts/exotic-bison-elk-packaged.jpg',
        bannerAlt: 'Specialty bison, elk, venison, and game cuts from Hofherr Meat Co.',
    },
];

const FIRE_METHODS = new Set(['Grill', 'Smoke', 'Rotisserie', 'Cast Iron', 'Broil']);
const EMPTY_SANITY_CUTS: SanityCut[] = [];

function matchesQuery(cut: CutEntry, normalizedQuery: string): boolean {
    if (!normalizedQuery) return true;
    const haystack = `${cut.name} ${cut.sub} ${cut.best} ${cut.cook} ${cut.tip}`.toLowerCase();
    return haystack.includes(normalizedQuery);
}

export default function CutGuideClient({ sanityCuts = EMPTY_SANITY_CUTS, embedded = false }: Props) {
    const [active, setActive] = useState<Animal>('beef');
    const [query, setQuery] = useState('');
    const settings = useSiteSettings();

    const tabRefs = useRef<Record<Animal, HTMLButtonElement | null>>({
        beef: null,
        pork: null,
        chicken: null,
        lamb: null,
        game: null,
    });

    const panelRefs = useRef<Record<Animal, HTMLDivElement | null>>({
        beef: null,
        pork: null,
        chicken: null,
        lamb: null,
        game: null,
    });

    const cutsByAnimal = useMemo(() => {
        if (!sanityCuts.length) return DEFAULT_CUTS;

        const grouped: Partial<Record<Animal, CutEntry[]>> = {};
        for (const sc of sanityCuts) {
            const rawAnimal = sc.animal as Animal;
            const animal: Animal = rawAnimal in DEFAULT_CUTS ? rawAnimal : 'beef';
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

        for (const meta of ANIMALS) {
            if (!grouped[meta.id]?.length) {
                grouped[meta.id] = DEFAULT_CUTS[meta.id];
            }
        }
        return grouped as Record<Animal, CutEntry[]>;
    }, [sanityCuts]);

    const normalizedQuery = query.trim().toLowerCase();

    const filteredByAnimal = useMemo(() => {
        const next = {} as Record<Animal, CutEntry[]>;
        for (const meta of ANIMALS) {
            const list = cutsByAnimal[meta.id] || [];
            next[meta.id] = normalizedQuery
                ? list.filter((cut) => matchesQuery(cut, normalizedQuery))
                : list;
        }
        return next;
    }, [cutsByAnimal, normalizedQuery]);

    // Upgrade inactive panels to hidden="until-found" so browser Find-in-Page can surface cuts in any tab
    useEffect(() => {
        const cleanups: Array<() => void> = [];

        for (const meta of ANIMALS) {
            const panel = panelRefs.current[meta.id];
            if (!panel) continue;

            if (meta.id === active) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', 'until-found');
                const handleBeforeMatch = () => {
                    setActive(meta.id);
                    tabRefs.current[meta.id]?.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                        ...({ container: 'nearest' } as Record<string, string>),
                    });
                };
                panel.addEventListener('beforematch', handleBeforeMatch);
                cleanups.push(() => panel.removeEventListener('beforematch', handleBeforeMatch));
            }
        }

        return () => {
            for (const cleanup of cleanups) cleanup();
        };
    }, [active]);

    const selectAnimal = (nextAnimal: Animal, moveFocus: boolean) => {
        setActive(nextAnimal);
        const btn = tabRefs.current[nextAnimal];
        if (btn) {
            if (moveFocus) btn.focus();
            btn.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
                ...({ container: 'nearest' } as Record<string, string>),
            });
        }
    };

    const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let nextIndex: number | null = null;
        if (event.key === 'ArrowRight') {
            nextIndex = (index + 1) % ANIMALS.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (index - 1 + ANIMALS.length) % ANIMALS.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = ANIMALS.length - 1;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            selectAnimal(ANIMALS[nextIndex].id, true);
        }
    };

    const displayPhone = settings.phone || '(847) 441-MEAT';
    const rawDigits = displayPhone.replace(/[^0-9]/g, '');
    const telHref = rawDigits.length === 10 ? `tel:${rawDigits}` : 'tel:8474416328';

    const otherMatchingAnimals = normalizedQuery
        ? ANIMALS.filter((m) => m.id !== active && filteredByAnimal[m.id].length > 0)
        : [];

    const Shell = embedded ? 'div' : 'main';
    const Heading = embedded ? 'h2' : 'h1';

    return (
        <Shell id={embedded ? 'cut-guide' : undefined} className={styles.page}>
            {/* ── Open Hero Header ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <Heading className={styles.headline}>
                            The <em>Cut Guide</em>
                        </Heading>
                        <p className={styles.sub}>
                            Every cut of beef, pork, poultry, lamb, and wild game — what it&apos;s best for, how to cook
                            it, and pro tips straight from master butcher Sean Hofherr.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Categorized Butcher Cuts ── */}
            <section id="butcher-cuts" aria-labelledby="butcher-cuts-heading" className="section">
                <div className="container">
                    <div className={styles.guideStack}>
                        <h2 id="butcher-cuts-heading" className={styles.srOnly}>
                            Butcher Cuts by Protein
                        </h2>

                        {/* Sticky Tablist + Instant Cut Search */}
                        <div className={styles.controlsSticky}>
                            <div className={styles.tablist} role="tablist" aria-label="Meat categories">
                                {ANIMALS.map((animal, index) => {
                                    const isSelected = active === animal.id;
                                    const count = filteredByAnimal[animal.id].length;
                                    return (
                                        <button
                                            key={animal.id}
                                            ref={(el) => {
                                                tabRefs.current[animal.id] = el;
                                            }}
                                            type="button"
                                            role="tab"
                                            id={`cut-tab-${animal.id}`}
                                            aria-selected={isSelected}
                                            tabIndex={isSelected ? 0 : -1}
                                            className={styles.tab}
                                            onClick={() => selectAnimal(animal.id, false)}
                                            onKeyDown={(e) => handleTabKeyDown(e, index)}
                                        >
                                            <span className={styles.tabEmoji} aria-hidden="true">
                                                {animal.emoji}
                                            </span>
                                            <span>{animal.label}</span>
                                            <span className={styles.tabCount}>{count}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <search className={styles.searchRegion}>
                                <div className={styles.searchField}>
                                    <label htmlFor="cut-guide-search" className={styles.srOnly}>
                                        Filter cuts by name, cooking method, or dish
                                    </label>
                                    <span className={styles.searchIcon} aria-hidden="true">
                                        ⌕
                                    </span>
                                    <input
                                        id="cut-guide-search"
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Filter cuts, Grill, Braise, tacos…"
                                        className={styles.searchInput}
                                    />
                                    {query ? (
                                        <button
                                            type="button"
                                            onClick={() => setQuery('')}
                                            className={styles.searchClearBtn}
                                            aria-label="Clear cut filter"
                                        >
                                            ✕
                                        </button>
                                    ) : null}
                                </div>
                            </search>
                        </div>

                        {/* Stacked Tab Panels */}
                        <div className={styles.panelsGrid}>
                            {ANIMALS.map((animal) => {
                                const isSelected = active === animal.id;
                                const cuts = filteredByAnimal[animal.id];

                                return (
                                    <div
                                        key={animal.id}
                                        ref={(el) => {
                                            panelRefs.current[animal.id] = el;
                                        }}
                                        role="tabpanel"
                                        aria-labelledby={`cut-tab-${animal.id}`}
                                        tabIndex={isSelected ? 0 : undefined}
                                        hidden={!isSelected}
                                    >
                                        <div className={styles.panelInner}>
                                            {/* Protein Category Intro Banner */}
                                            <div className={styles.animalBanner}>
                                                <div className={styles.animalMediaWrap}>
                                                    <Image
                                                        src={animal.bannerSrc}
                                                        alt={animal.bannerAlt}
                                                        width={560}
                                                        height={350}
                                                        sizes="(max-width: 900px) 100vw, 280px"
                                                        priority={animal.id === 'beef'}
                                                        className={styles.animalBannerImg}
                                                    />
                                                </div>
                                                <div className={styles.animalBannerCopy}>
                                                    <span className={styles.animalMetaLine}>{animal.sourcingTag}</span>
                                                    <h3 className={styles.animalHeading}>{animal.heading}</h3>
                                                    <p className={styles.animalDesc}>{animal.description}</p>
                                                </div>
                                            </div>

                                            {/* Cut Cards Grid or Empty Filter State */}
                                            {cuts.length > 0 ? (
                                                <div className={styles.cards}>
                                                    {cuts.map((cut) => {
                                                        const methods = cut.cook
                                                            .split('·')
                                                            .map((m) => m.trim())
                                                            .filter(Boolean);

                                                        return (
                                                            <article key={cut.name} className={styles.card}>
                                                                {cut.image ? (
                                                                    <Image
                                                                        src={cut.image}
                                                                        alt={cut.name}
                                                                        width={480}
                                                                        height={270}
                                                                        sizes="(max-width: 640px) 100vw, 380px"
                                                                        unoptimized={!cut.image.startsWith('/')}
                                                                        className={styles.cardImg}
                                                                    />
                                                                ) : null}

                                                                <header className={styles.cardHeader}>
                                                                    {cut.sub ? (
                                                                        <p className={styles.cutSub}>{cut.sub}</p>
                                                                    ) : null}
                                                                    <h4 className={styles.cutName}>{cut.name}</h4>
                                                                </header>

                                                                <div className={styles.cardBody}>
                                                                    <p className={styles.cutBest}>
                                                                        <strong>Best for:</strong> {cut.best}
                                                                    </p>

                                                                    {methods.length > 0 ? (
                                                                        <ul
                                                                            className={styles.cookMethods}
                                                                            aria-label="Recommended cooking methods"
                                                                        >
                                                                            {methods.map((method) => (
                                                                                <li
                                                                                    key={method}
                                                                                    className={`${styles.cookTag} ${
                                                                                        FIRE_METHODS.has(method)
                                                                                            ? styles.cookTagFire
                                                                                            : ''
                                                                                    }`}
                                                                                >
                                                                                    {method}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : null}

                                                                    {cut.tip ? (
                                                                        <div className={styles.tip}>
                                                                            <span className={styles.tipLabel}>
                                                                                Sean&apos;s Butcher Tip
                                                                            </span>
                                                                            <p className={styles.tipText}>{cut.tip}</p>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </article>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className={styles.emptyState}>
                                                    <h4 className={styles.emptyTitle}>
                                                        No {animal.label} cuts match &ldquo;{query.trim()}&rdquo;
                                                    </h4>
                                                    <p className={styles.emptySub}>
                                                        {otherMatchingAnimals.length > 0
                                                            ? 'Found matching cuts in other protein categories:'
                                                            : 'Try searching for a cut name (like Ribeye or Brisket) or a cooking method (like Smoke, Grill, or Braise).'}
                                                    </p>
                                                    <div className={styles.emptyActions}>
                                                        {otherMatchingAnimals.map((match) => (
                                                            <button
                                                                key={match.id}
                                                                type="button"
                                                                onClick={() => selectAnimal(match.id, false)}
                                                                className="btn btn-secondary"
                                                            >
                                                                {match.emoji} {match.label} (
                                                                {filteredByAnimal[match.id].length})
                                                            </button>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => setQuery('')}
                                                            className="btn btn-primary"
                                                        >
                                                            Clear Filter
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Custom Butcher Order CTA ── */}
            {!embedded && (
            <section id="custom-butcher-cta" aria-labelledby="custom-butcher-cta-heading" className="section-sm">
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2 id="custom-butcher-cta-heading" className={styles.ctaHeading}>
                            Need a Custom Thickness or Special Roast?
                        </h2>
                        <p className={styles.ctaSub}>
                            We hand-cut steaks to your exact thickness, French racks, tie holiday roasts, and grind
                            custom blends fresh to order at our Northfield butcher counter.
                        </p>
                        <div className={styles.ctaBtns}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">
                                    <FireBorder active={true} radius={6} />
                                    Order Custom Cuts Online
                                </span>
                            </Link>
                            <a href={telHref} className="btn-hit">
                                <span className="btn btn-secondary">Call {displayPhone}</span>
                            </a>
                            <Link href="/visit" className="btn-hit">
                                <span className="btn btn-secondary">Visit Our Shops</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            )}
        </Shell>
    );
}
