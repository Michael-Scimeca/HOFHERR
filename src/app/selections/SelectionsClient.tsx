'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type CutDetail = {
    name: string;
    note: string;
};

type ButcherBoard = {
    id: string;
    title: string;
    promise: string;
    icon: string;
    intro: string;
    cuts: CutDetail[];
};

const TRACEABILITY_PILLARS = [
    {
        title: '100% Vegetarian-Fed & Pasture-Raised',
        icon: '/assets/identity/stickers/sticker-cow.svg',
        body: 'Raised on small family farms in Illinois, Wisconsin, Iowa, and Indiana with open pasture access and clean vegetarian grain & forage diets.',
    },
    {
        title: 'Never Given Hormones or Antibiotics',
        icon: '/assets/identity/stickers/sticker-pig.svg',
        body: 'Zero added growth hormones, zero sub-therapeutic antibiotics, and humane handling from birth to our Northfield butcher block.',
    },
    {
        title: 'USDA Prime & 45-Day Dry-Aged Reserve',
        icon: '/assets/identity/stickers/sticker-lamb.svg',
        body: 'We source the top 2% USDA Prime and upper-choice carcasses, dry-aged in-house for deep, nutty tenderness and custom-cut to your exact thickness.',
    },
    {
        title: '18+ Housemade Sausages & Small-Batch Smoke',
        icon: '/assets/identity/stickers/sticker-truck.svg',
        body: 'Every sausage link, bacon slab, pastrami brisket, and quart of 24-hour bone broth is ground, stuffed, cured, and smoked in-house.',
    },
];

const BUTCHER_BOARDS: ButcherBoard[] = [
    {
        id: 'beef',
        title: 'Prime & Dry-Aged Beef',
        promise: 'Midwest Family Farms · USDA Prime & Upper Choice · Custom Cut to Order',
        icon: '/assets/identity/stickers/sticker-cow.svg',
        intro: 'Broken down on our block daily. Ask our butchers for any thickness (1", 1.5", 2" cowboy cut), custom tying, or dry-aged reserve cuts.',
        cuts: [
            { name: '45-Day Dry-Aged Bone-In Ribeye', note: 'In-house dry-aged reserve · rich, nutty marbling & deep crust' },
            { name: 'USDA Prime Boneless Ribeye', note: 'Center-cut ribeye with generous spinalis cap · pan-sear or grill' },
            { name: 'New York Strip Steak', note: 'Bold beefy flavor · available boneless or bone-in Kansas City strip' },
            { name: 'Center-Cut Filet Mignon (Tenderloin)', note: 'Fork-tender barrel-cut filet · whole chateaubriand roasts available' },
            { name: 'Porterhouse & T-Bone Steaks', note: 'Thick-cut steakhouse two-in-one: strip + tenderloin on the bone' },
            { name: 'Hanger, Skirt & Flank Steaks', note: 'Butcher’s favorite cuts for high-heat searing, fajitas & chimichurri' },
            { name: 'Picanha (Top Sirloin Cap) & Tri-Tip', note: 'Fat-cap-on Brazilian picanha & Santa Maria style tri-tip roasts' },
            { name: 'Whole Packer Brisket, Short Ribs & Osso Buco', note: 'Prime smoking briskets, English- or flanken-cut short ribs & shanks' },
        ],
    },
    {
        id: 'pork',
        title: 'Heritage Breed Pork & House Sausages',
        promise: 'Berkshire & Duroc Heritage Breeds · Pasture-Raised · House-Cured Bacon',
        icon: '/assets/identity/stickers/sticker-pig.svg',
        intro: 'Old-world heritage genetics with ruby-red color and intramuscular marbling that never dries out on the grill or smoker.',
        cuts: [
            { name: 'Thick-Cut Bone-In Rib & Center Chops', note: 'Cut 1.25"–2" thick to order · double-bone crown roasts by request' },
            { name: 'St. Louis Spare Ribs & Baby Back Ribs', note: 'Hand-trimmed slabs with membrane removed on request' },
            { name: 'Boston Butt (Pork Shoulder) & Picnic Roast', note: 'Ideal for 14-hour smoked pulled pork, carnitas & slow braising' },
            { name: 'Pork Tenderloin & Stuffed Boneless Loin', note: 'Lean, tender medallions or herb-and-garlic tied roasts' },
            { name: 'House-Cured Hickory Bacon & Fresh Pork Belly', note: 'Thick-sliced slab bacon, pancetta, guanciale & skin-on belly' },
            { name: '18+ Rotating Housemade Sausages & Brats', note: 'Mild/Hot Italian, Sheboygan Brats, Jalapeño Cheddar, Chorizo, Andouille' },
        ],
    },
    {
        id: 'poultry',
        title: 'Amish & Pasture-Raised Poultry',
        promise: 'Air-Chilled · Antibiotic-Free · Daily Wood-Herb Rotisserie',
        icon: '/assets/identity/stickers/sticker-chicken.svg',
        intro: '100% air-chilled chickens, turkeys, and specialty ducks with crisp skin and clean, natural flavor — never injected with water or brine solutions.',
        cuts: [
            { name: 'Whole Pasture-Raised Chicken & Spatchcocked Birds', note: 'Plain or pre-marinated in lemon-herb, peri-peri, or smokehouse rub' },
            { name: 'Signature Rotisserie Chickens (Hot off the Spit)', note: 'Slow-spun daily with fresh rosemary, garlic, lemon & sea salt' },
            { name: 'Boneless Skinless & Airline Chicken Breasts', note: 'Hand-trimmed breasts, cutlets, chicken tenders & stuffed Kiev' },
            { name: 'Bone-In Thighs, Drumsticks & Party Wings', note: 'Split jumbo wings & meaty thighs for smoking, frying or grilling' },
            { name: 'Pekin Duck Breast, Whole Duck & Confit Legs', note: 'Scored magret duck breasts, rendered duck fat & holiday geese' },
            { name: 'Fresh Heritage & Amish Thanksgiving Turkeys', note: 'Never-frozen whole turkeys, bone-in turkey breasts & house brine kits' },
        ],
    },
    {
        id: 'lamb',
        title: 'Pasture Lamb, Veal & Exotic Game',
        promise: 'Domestic Pasture Lamb · Milk-Fed Veal · Bison, Venison, Elk & Wild Boar',
        icon: '/assets/identity/stickers/sticker-lamb.svg',
        intro: 'From Frenched racks of Colorado lamb to specialty game meats sourced for adventurous home cooks and dinner parties.',
        cuts: [
            { name: 'Frenched Rack of Lamb & Double Loin Chops', note: 'Hand-Frenched 8-rib racks & thick lollipop chops' },
            { name: 'Boneless & Bone-In Leg of Lamb', note: 'Butterflied & herb-tied for the grill or bone-in for roasting' },
            { name: 'Braising Lamb Shanks, Shoulder & Merguez', note: 'Rich winter braising shanks, ground lamb & North African merguez' },
            { name: 'Milk-Fed Veal Rib Chops, Cutlets & Osso Buco', note: 'Pounded veal Milanese cutlets & marrow-rich hind shanks' },
            { name: 'Grass-Fed Bison Ribeye, Strip & Ground Bison', note: 'Sweet, lean American bison steaks & burger grind' },
            { name: 'Venison, Elk, Wild Boar, Rabbit, Quail & Pheasant', note: 'Cervena venison tenderloin, elk medallions & game birds' },
        ],
    },
    {
        id: 'seafood',
        title: 'Fresh Catch & Shellfish Counter',
        promise: 'Sushi-Grade & Wild-Caught · Flown In Fresh · Never Treated',
        icon: '/assets/identity/stickers/sticker-seafood-lobster.svg',
        intro: 'Curated coastal fish fillets and cold-water shellfish selected to pair with our steakhouse cuts for surf-and-turf nights.',
        cuts: [
            { name: 'Faroe Island & Wild King Salmon Fillets', note: 'Center-cut skin-on portions, cedar-plank ready' },
            { name: 'Dry-Packed U-10 Sea Scallops', note: 'Chemical-free dry scallops that sear to a golden caramel crust' },
            { name: 'Cold-Water Lobster Tails & Colossal Shrimp', note: 'Maine & Canadian lobster tails, wild Gulf shrimp & cocktail platters' },
            { name: 'Halibut, Ahi Tuna, Swordfish & Lake Superior Whitefish', note: 'Seasonal wild fillets & house-smoked whitefish dip' },
        ],
    },
    {
        id: 'charcuterie',
        title: 'House Charcuterie, Deli & Artisanal Cheese',
        promise: 'Small-Batch Cured · Midwest Creameries · Custom Grazing Boards',
        icon: '/assets/identity/stickers/sticker-cheese.svg',
        intro: 'Old-world curing meets Wisconsin and Vermont cave-aged cheeses. Sliced to order by the quarter-pound or assembled into event platters.',
        cuts: [
            { name: 'House-Smoked Pastrami, Corned Beef & Roast Beef', note: 'Brined 10 days, spice-crusted, smoked & shaved thin to order' },
            { name: 'Country Pâté, Chicken Liver Mousse & Rillettes', note: 'French-style coarse pork pâté with pistachios & brandy mousse' },
            { name: 'Beef Jerky, Landjäger, Snack Sticks & Summer Sausage', note: 'Hardwood-smoked road snacks made from 100% whole muscle cuts' },
            { name: 'Artisanal Cave-Aged Cheeses & Accoutrements', note: 'aged cheddar, Gruyère, triple-cream brie, Castelvetrano olives & mustard' },
        ],
    },
];

const SIGNATURE_SANDWICHES = [
    {
        name: '01 · The Hofherr Italian Beef',
        tag: 'Daily Hot Counter',
        desc: 'Slow-roasted USDA Prime top round shaved paper-thin, steeped in our 24-hour roasted beef bone-broth au jus, topped with sweet bell peppers or fiery house Chicago giardiniera.',
        bread: 'Served on crusty Turano French bread — Dipped, Wet, or Dry',
    },
    {
        name: "02 · The Butcher's Smokehouse Reuben",
        tag: 'House-Cured Pastrami',
        desc: '10-day brined and hickory-smoked navel pastrami piled high with melted cave-aged Swiss, crisp barrel-fermented sauerkraut, and house tangy Russian dressing.',
        bread: 'Griddled thick-cut seeded marble rye',
    },
    {
        name: '03 · 14-Hour Pulled Pork Brioche',
        tag: 'Pitmaster Special',
        desc: 'Heritage Berkshire pork shoulder smoked 14 hours over post oak and applewood, hand-pulled and dressed with house Carolina gold or sweet-heat Kansas City sauce and crisp slaw.',
        bread: 'Toasted buttered brioche bun with house pickles',
    },
    {
        name: '04 · Steakhouse Chimichurri Roll',
        tag: 'Cut-to-Order Steak',
        desc: 'Seared prime hanger and skirt steak cooked medium-rare to order, sliced against the grain with bright parsley-garlic chimichurri, caramelized onions, wild arugula, and roasted garlic aioli.',
        bread: 'Crusty hearth-baked artisan baguette',
    },
    {
        name: '05 · Wood-Herb Rotisserie Chicken Club',
        tag: 'Fresh Off the Spit',
        desc: 'Warm rosemary-and-lemon rotisserie chicken breast, thick-cut house hickory bacon, ripe tomato, avocado, greens, and tarragon-Dijon aioli.',
        bread: 'Toasted country levain sourdough',
    },
    {
        name: "06 · The Butcher's Italian Sub",
        tag: 'Cold Deli Classic',
        desc: 'Imported prosciutto di Parma, spicy soppressata, pistachio mortadella, sharp provolone, shredded iceberg, tomato, red onion, and oregano red-wine vinaigrette.',
        bread: 'Sesame-crust Italian bastone',
    },
];

const PANTRY_COLUMNS = [
    {
        title: '24-Hour Kettle Stocks & Scratch Soups',
        icon: '/assets/identity/stickers/sticker-soup.svg',
        items: [
            { name: '24-Hour Roasted Beef Bone Broth', sub: 'Simmered from marrow & knuckle bones · rich collagen glaze (Quarts)' },
            { name: 'Golden Pasture Chicken Stock', sub: 'Roasted frames, mirepoix, peppercorns & fresh thyme (Quarts)' },
            { name: 'Smoked Brisket & Three-Bean Chili', sub: 'Pit-smoked prime brisket point, ancho chilies & fire-roasted tomatoes' },
            { name: 'Rotating Weekly Scratch Soups', sub: 'Loaded Baked Potato w/ House Bacon, Split Pea & Ham Hock, Chicken Noodle' },
            { name: 'classic Demi-Glace & Pan Jus Reductions', sub: 'Steakhouse finishing reductions for quick pan sauces at home' },
        ],
    },
    {
        title: 'Prepared Heat-&-Eat Butcher Meals',
        icon: '/assets/identity/stickers/sticker-duck.svg',
        items: [
            { name: 'Individual & Family Beef Wellingtons', sub: 'Center-cut filet mignon, mushroom duxelles, prosciutto & puff pastry' },
            { name: 'Butcher’s Blend Meatloaf & Yukon Mash', sub: 'Prime beef, heritage pork & veal loaf with smoked tomato glaze' },
            { name: 'Rotisserie Chicken Pot Pies & Shepherd’s Pie', sub: 'Scratch pastry crust loaded with root vegetables & bone-broth gravy' },
            { name: 'Marinated Steak & Chicken Skewers / Kabobs', sub: 'Hand-threaded with bell peppers & red onion — grill-ready' },
            { name: 'Smokehouse Sides by the Pound', sub: 'Four-Cheese Mac, Pit Baked Beans, Twice-Baked Potatoes, Coleslaw' },
        ],
    },
    {
        title: 'Pitmaster Charcoal, Woods, Rubs & Fats',
        icon: '/assets/identity/stickers/sticker-truck.svg',
        items: [
            { name: 'Rockwood All-Natural Lump Charcoal (20 lb)', sub: '100% Missouri oak, hickory & maple hardwood lump — stacked out front' },
            { name: 'Kiln-Dried Smoking Wood Chunks & Splits', sub: 'Post Oak, Shagbark Hickory, Applewood & Cherrywood for smokers' },
            { name: 'Hofherr Signature Butcher Rubs & Sauces', sub: 'Northfield Steak Seasoning, Sweet-Heat Rib Rub, SPG & House BBQ Sauces' },
            { name: 'Rendered Wagyu Beef Tallow, Lard & Duck Fat', sub: 'Small-batch rendered cooking fats for searing steaks & roasting potatoes' },
            { name: 'Compound Steakhouse Herb & Truffle Butters', sub: 'Roasted garlic-rosemary, black truffle & blue cheese finishing rounds' },
        ],
    },
];

export default function SelectionsClient() {
    const [activeDept, setActiveDept] = useState<string>('all');

    const visibleBoards =
        activeDept === 'all'
            ? BUTCHER_BOARDS
            : BUTCHER_BOARDS.filter((b) => b.id === activeDept);

    return (
        <main className={styles.page}>
            {/* ── Hero Header (No Content-Boxing, Single H1, No Pill Above H1) ── */}
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 className={styles.heroTitle}>
                        OUR SELECTIONS &amp; <span className={styles.heroTitleAccent}>BUTCHER BOARDS</span>
                    </h1>
                    <p className={styles.heroLead}>
                        Every cut in our Northfield butcher case and Winnetka Depot counter comes from Midwest family
                        farms — 100% vegetarian-fed, never given hormones or antibiotics, broken down by hand, and cut
                        to your exact specification. Explore our full custom-cut meat boards, 6 signature housemade
                        sandwiches, 24-hour bone broths, prepared heat-and-eat meals, and pitmaster supplies.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/online-orders" className="btn btn-primary">
                            Order Online for Pickup
                        </Link>
                        <Link href="/cut-guide" className="btn btn-outline">
                            Interactive Cut &amp; Cooking Guide
                        </Link>
                        <Link href="/specials" className="btn btn-outline">
                            This Week&apos;s Specials
                        </Link>
                    </div>
                    <nav className={styles.jumpNav} aria-label="Selections page sections">
                        <a href="#sourcing-standards" className={styles.jumpLink}>
                            01 · Farm Traceability
                        </a>
                        <a href="#butcher-boards" className={styles.jumpLink}>
                            02 · Beef, Pork, Poultry, Lamb &amp; Game Boards
                        </a>
                        <a href="#signature-sandwiches" className={styles.jumpLink}>
                            03 · 6 Signature Sandwiches
                        </a>
                        <a href="#soups-prepared-pantry" className={styles.jumpLink}>
                            04 · Bone Broths, Prepared Meals &amp; BBQ Woods
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Section 01: Farm Traceability & Sourcing Standards ── */}
            <section
                id="sourcing-standards"
                aria-labelledby="sourcing-standards-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="sourcing-standards-heading" className={styles.sectionTitle}>
                            01 / Midwest Farm Traceability &amp; Standards
                        </h2>
                        <p className={styles.sectionDesc}>
                            We work directly with small family farms across Illinois, Wisconsin, Iowa, and Indiana who
                            raise animals the right way — on open pasture without shortcuts.
                        </p>
                    </div>

                    <div className={styles.standardsGrid}>
                        {TRACEABILITY_PILLARS.map((pillar) => (
                            <article key={pillar.title} className={styles.standardCard}>
                                <div className={styles.standardTop}>
                                    <img
                                        src={pillar.icon}
                                        alt=""
                                        className={styles.standardIcon}
                                    />
                                    <h3 className={styles.standardTitle}>{pillar.title}</h3>
                                </div>
                                <p className={styles.standardBody}>{pillar.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 02: Custom-Cut Butcher Boards ── */}
            <section id="butcher-boards" aria-labelledby="butcher-boards-heading" className="section">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="butcher-boards-heading" className={styles.sectionTitle}>
                            02 / Custom-Cut Butcher Case Selections
                        </h2>
                        <p className={styles.sectionDesc}>
                            Don&apos;t see the exact thickness or roast weight you need? Every cut below is trimmed to
                            order at the block — call ahead at <strong>(847) 441-MEAT</strong> for special orders,
                            whole-animal shares, or custom aging.
                        </p>
                    </div>

                    <div className={styles.filterRow} role="tablist" aria-label="Filter butcher boards by department">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeDept === 'all'}
                            onClick={() => setActiveDept('all')}
                            className={`${styles.filterBtn} ${activeDept === 'all' ? styles.filterBtnActive : ''}`}
                        >
                            All 6 Butcher Departments
                        </button>
                        {BUTCHER_BOARDS.map((b) => (
                            <button
                                key={b.id}
                                type="button"
                                role="tab"
                                aria-selected={activeDept === b.id}
                                onClick={() => setActiveDept(b.id)}
                                className={`${styles.filterBtn} ${activeDept === b.id ? styles.filterBtnActive : ''}`}
                            >
                                <img src={b.icon} alt="" className={styles.filterIcon} />
                                {b.title}
                            </button>
                        ))}
                    </div>

                    <div className={styles.boardsGrid}>
                        {visibleBoards.map((board) => (
                            <article key={board.id} className={styles.boardCard}>
                                <div className={styles.boardHead}>
                                    <img
                                        src={board.icon}
                                        alt={`${board.title} emblem`}
                                        className={styles.boardEmblem}
                                    />
                                    <div className={styles.boardHeadText}>
                                        <h3 className={styles.boardTitle}>{board.title}</h3>
                                        <span className={styles.boardPromise}>{board.promise}</span>
                                    </div>
                                </div>
                                <p className={styles.boardIntro}>{board.intro}</p>
                                <div className={styles.cutsList}>
                                    {board.cuts.map((c) => (
                                        <div key={c.name} className={styles.cutItem}>
                                            <span className={styles.cutName}>{c.name}</span>
                                            <span className={styles.cutNote}>{c.note}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 03: 6 Signature Housemade Sandwiches ── */}
            <section
                id="signature-sandwiches"
                aria-labelledby="signature-sandwiches-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="signature-sandwiches-heading" className={styles.sectionTitle}>
                            03 / Signature Housemade Butcher Sandwiches
                        </h2>
                        <p className={styles.sectionDesc}>
                            Built to order from the same meats we cut and smoke in-house — wrapped in our signature
                            butcher paper for lunch at Northfield or afternoon pickup at Winnetka Depot.
                        </p>
                    </div>

                    <div className={styles.sandwichGrid}>
                        {SIGNATURE_SANDWICHES.map((item) => (
                            <article key={item.name} className={styles.sandwichCard}>
                                <div className={styles.sandwichTop}>
                                    <h3 className={styles.sandwichTitle}>{item.name}</h3>
                                    <span className={styles.sandwichTag}>{item.tag}</span>
                                </div>
                                <p className={styles.sandwichDesc}>{item.desc}</p>
                                <span className={styles.sandwichBread}>🥖 {item.bread}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 04: 24-Hour Bone Broths, Scratch Soups, Prepared Meals & BBQ Pantry ── */}
            <section
                id="soups-prepared-pantry"
                aria-labelledby="soups-prepared-pantry-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="soups-prepared-pantry-heading" className={styles.sectionTitle}>
                            04 / Scratch Soups, Prepared Meals &amp; Pitmaster Pantry
                        </h2>
                        <p className={styles.sectionDesc}>
                            Everything you need to finish dinner on the table — from slow-simmered marrow bone broths
                            and oven-ready Beef Wellingtons to 20 lb bags of Rockwood lump charcoal stacked out front.
                        </p>
                    </div>

                    <div className={styles.trioGrid}>
                        {PANTRY_COLUMNS.map((col) => (
                            <article key={col.title} className={styles.pantryCard}>
                                <div className={styles.pantryHead}>
                                    <img src={col.icon} alt="" className={styles.pantryIcon} />
                                    <h3 className={styles.pantryTitle}>{col.title}</h3>
                                </div>
                                <div className={styles.pantryList}>
                                    {col.items.map((it) => (
                                        <div key={it.name} className={styles.pantryRow}>
                                            <span className={styles.pantryItemName}>{it.name}</span>
                                            <span className={styles.pantryItemSub}>{it.sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 05: Butcher Wrapping Paper Theme Call to Action ── */}
            <section id="selections-cta" aria-labelledby="selections-cta-heading" className="section">
                <div className="container">
                    <div className={styles.ctaWrap}>
                        <h2 id="selections-cta-heading" className={styles.ctaHeading}>
                            READY FOR A CUSTOM CUT OR SPECIAL ORDER?
                        </h2>
                        <p className={styles.ctaSub}>
                            Order online for same-day pickup at <strong>300 Happ Rd in Northfield</strong> or commuter
                            pickup at <strong>The Depot in Winnetka</strong>, or call the butcher counter directly at{' '}
                            <strong>(847) 441-MEAT</strong>.
                        </p>
                        <div className={styles.ctaBtns}>
                            <Link href="/online-orders" className="btn btn-primary">
                                Order Online Now
                            </Link>
                            <a href="tel:8474416328" className="btn btn-outline">
                                Call (847) 441-MEAT
                            </a>
                            <Link href="/cut-guide" className="btn btn-outline">
                                View Interactive Cut Guide
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
