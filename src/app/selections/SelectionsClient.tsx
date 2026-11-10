'use client';

import React from 'react';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
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
    systemImg: string;
    systemImgAlt: string;
    classicList: string;
    intro: string;
    cuts: CutDetail[];
};

const TRACEABILITY_PILLARS = [
    {
        title: '100% Directly Traceable to Family Farms',
        icon: '/assets/identity/stickers/sticker-cow.svg',
        body: 'Before opening Hofherr Meat Co., we visited family-run farms across Illinois, Wisconsin, Indiana, and Michigan to build a directly traceable supply of humanely raised animals.',
    },
    {
        title: 'Never Given Hormones, Steroids or Antibiotics',
        icon: '/assets/identity/stickers/sticker-pig.svg',
        body: 'Zero added growth hormones, zero steroids, and zero sub-therapeutic antibiotics — unlike pre-processed industrial factory meats.',
    },
    {
        title: 'Chef-Driven Custom Cuts & Hunter Processing',
        icon: '/assets/identity/stickers/sticker-lamb.svg',
        body: 'From USDA Prime steaks and specialty game to beef knuckles, chicken feet, duck fat, pure lard, marrow bones, and custom processing for field-dressed game.',
    },
    {
        title: 'Housemade Charcuterie, Rotisserie & Deli',
        icon: '/assets/identity/stickers/sticker-suage.svg',
        body: 'Hand-crafted sausages, hams, pâtés, floor-to-ceiling rotisserie chicken and ribs, plus scratch soups and stocks made fresh daily.',
    },
];

const BUTCHER_BOARDS: ButcherBoard[] = [
    {
        id: 'beef',
        title: 'Beef',
        promise: 'Halves & Quarters · USDA Prime & Dry-Aged · Custom Cut to Order',
        icon: '/assets/identity/stickers/sticker-cow.svg',
        systemImg: '/assets/cuts/beef-prime-cuts-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. USDA Prime Bone-In Ribeye Steaks & Standing Rib Roast with Branded Kraft Butcher Packaging',
        classicList:
            'Halves and Quarters, Brisket, Flank, Ground Chuck, Round and Sirloin, Loin, Short Plate, Rib, Ribeye, Shank, Sirloin, Skirt, N.Y. Strip, Ground Veal, Offal',
        intro: 'Broken down on our block daily from whole halves and quarters. Ask our butchers for any thickness, custom roast tying, or marrow bones.',
        cuts: [
            { name: 'Halves, Quarters & Custom Freezer Shares', note: 'Whole-animal butchery cut and vacuum-sealed to your family’s specs' },
            { name: 'Rib, Bone-In Ribeye & Standing Rib Roasts', note: 'USDA Prime & dry-aged reserve · rich spinalis cap and marbling' },
            { name: 'Loin, N.Y. Strip, Filet Mignon & Porterhouse', note: 'Thick steakhouse center cuts, boneless or on the bone' },
            { name: 'Flank, Skirt, Hanger & Short Plate', note: 'High-flavor butcher cuts for searing, fajitas & carne asada' },
            { name: 'Whole Packer Brisket, Shank & Short Ribs', note: 'Competition smoking briskets, osso buco shanks & braising ribs' },
            { name: 'Ground Chuck, Round, Sirloin, Ground Veal & Offal', note: 'Fresh-ground daily in-house plus beef knuckles, marrow bones & offal' },
        ],
    },
    {
        id: 'pork',
        title: 'Pork',
        promise: 'Whole Pig · Heritage Breeds · House-Cured Bacon & Hams',
        icon: '/assets/identity/stickers/sticker-pig.svg',
        systemImg: '/assets/cuts/pork-heritage-cuts-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. Heritage Bone-In Pork Chops, St. Louis Ribs & Slab Bacon with Branded Kraft Packaging',
        classicList:
            'Whole Pig, Pork Belly, Butt, Chops, Ham, Hocks, Loin, Ground Pork, Ribs, Shoulder, Tenderloin, Offal',
        intro: 'Midwest family-farm heritage pork with rich marbling — from whole roasting pigs to thick-cut chops, skin-on belly, and smoked hocks.',
        cuts: [
            { name: 'Whole Pig (Roaster & Pig Pickin’)', note: 'Available by special order for backyard roasts and smokehouse events' },
            { name: 'Thick-Cut Rib & Loin Chops, Crown Roasts & Tenderloin', note: 'Cut to your exact thickness · stuffed or herb-tied roasts available' },
            { name: 'Pork Belly, Butt & Picnic Shoulder', note: 'Skin-on or rindless belly, Boston butt for pulled pork & carnitas' },
            { name: 'St. Louis Ribs, Baby Back Ribs & Smoked Hocks', note: 'Meaty spare ribs, back ribs, ham hocks & pork neck bones' },
            { name: 'House-Cured Ham, Ground Pork, Pure Lard & Offal', note: 'Fresh unseasoned ground pork, rendered pure leaf lard & specialty offal' },
        ],
    },
    {
        id: 'lamb',
        title: 'Lamb',
        promise: 'Domestic Pasture-Raised Lamb · Rack, Leg, Chops & Shanks',
        icon: '/assets/identity/stickers/sticker-lamb.svg',
        systemImg: '/assets/cuts/lamb-pasture-cuts-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. Frenched Rack of Pasture Lamb, Loin Chops & Twine-Tied Kraft Parcel',
        classicList:
            'Bone-in Leg, BRT Leg, Loin Chops, Shoulder Chops, Ground Lamb, Kabob and Stew, Rack, Ribs, Shank, Offal',
        intro: 'Tender, mild domestic pasture-raised lamb trimmed to order — from Frenched racks and lollipop loin chops to boneless rolled-and-tied legs.',
        cuts: [
            { name: 'Frenched Rack of Lamb & Lamb Ribs', note: '8-rib Frenched racks & Denver lamb ribs for roasting or grilling' },
            { name: 'Bone-In Leg of Lamb & BRT (Boneless Rolled & Tied) Leg', note: 'Seasoned with rosemary & garlic on request for holiday roasting' },
            { name: 'Double Loin Chops & Blade Shoulder Chops', note: 'Thick-cut double T-bone loin chops & rich pan-searing shoulder chops' },
            { name: 'Braising Lamb Shanks, Kabob, Stew Meat, Ground Lamb & Offal', note: 'Hand-cubed leg kabobs, gyro/kofta grind & slow-braising hind shanks' },
        ],
    },
    {
        id: 'poultry',
        title: 'Poultry',
        promise: 'Whole & Quartered · Air-Chilled · Chicken, Turkey & Cornish Hens',
        icon: '/assets/identity/stickers/sticker-chicken.svg',
        systemImg: '/assets/cuts/poultry-pasture-cuts-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. Air-Chilled Pasture Chicken & Case-Ready Thighs with Branded Kraft Parcel',
        classicList:
            'Whole and Quartered Chicken, Breasts, Legs, Tenders, Tenderloin, Thighs, Ground Chicken and Turkey, Turkey, Cornish Hens',
        intro: 'Pasture-raised, antibiotic-free poultry plus hot-off-the-spit rotisserie chickens, rendered schmaltz, duck fat, and chicken feet for rich stock.',
        cuts: [
            { name: 'Whole & Quartered Pasture Chicken', note: 'Trussed for roasting, spatchcocked, or cut into 8-piece fryers' },
            { name: 'Breasts, Tenders, Tenderloin, Legs & Thighs', note: 'Boneless skinless or bone-in skin-on cuts plus chicken feet for stock' },
            { name: 'Fresh Ground Chicken & Ground Turkey', note: 'Ground fresh in-house from whole breast and thigh meat' },
            { name: 'Whole Turkeys, Turkey Breasts & Cornish Game Hens', note: 'Fresh holiday and year-round turkeys plus individual Cornish hens' },
        ],
    },
    {
        id: 'game',
        title: 'Game',
        promise: 'Upland Birds, Waterfowl, Rabbit & Venison · Seasonal & Special Order',
        icon: '/assets/identity/stickers/sticker-duck.svg',
        systemImg: '/assets/cuts/game-duck-venison-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. Pekin Duck Breasts, Whole Pheasant & Vacuum-Sealed Venison Steaks with Branded Labels',
        classicList:
            'Dove, Duck, Goose, Grouse, Partridge, Pheasant, Quail, Rabbit, Venison',
        intro: 'If the season calls for it, we have it — plus custom game processing for hunters (provided the animal is field-dressed).',
        cuts: [
            { name: 'Duck, Goose & Rendered Duck Fat', note: 'Whole Pekin ducks, magret breasts, duck confit & holiday geese' },
            { name: 'Pheasant, Quail, Partridge, Grouse & Dove', note: 'Upland game birds for roasting, braising, or wrapping in house bacon' },
            { name: 'Whole & Saddles of Rabbit', note: 'Tender domestic and wild-style rabbit for classic ragù, mustard braises & stews' },
            { name: 'Venison Loins, Osso Buco, Steaks & Custom Hunter Processing', note: 'Farm-raised venison cuts plus custom processing for field-dressed deer' },
        ],
    },
    {
        id: 'exotic-game',
        title: 'Exotic Game',
        promise: 'Adventurous & Hard-to-Find Proteins · Tracked Down on Request',
        icon: '/assets/identity/stickers/sticker-game.svg',
        systemImg: '/assets/cuts/exotic-bison-elk-packaged.jpg',
        systemImgAlt: 'Hofherr Meat Co. American Bison Ribeyes, Elk Medallions & Wild Boar Chops in Reserve Butcher Box',
        classicList:
            'Alligator, Bear, Boar, Buffalo, Elk, Goat, Kangaroo, Ostrich, Reindeer, Stag, Turtle',
        intro: 'Having a hard time finding a particular specialty protein? Give us a call and we will gladly track it down for your kitchen.',
        cuts: [
            { name: 'American Buffalo (Bison), Elk, Stag & Reindeer', note: 'Lean, deeply flavorful steaks, roasts, medallions & burger grinds' },
            { name: 'Wild Boar Shoulder, Chops, Ribs & Sausage', note: 'Sweet, nutty wild boar cuts for Tuscan pappardelle & smokehouse ribs' },
            { name: 'Goat (Cabrito / Chevon) & Pasture Stew Cuts', note: 'Bone-in and boneless goat cuts for curries, birria & slow roasting' },
            { name: 'Alligator, Bear, Kangaroo, Ostrich & Turtle', note: 'Specialty and exotic game sourced to order — call (847) 441-MEAT' },
        ],
    },
];

const CHARCUTERIE_CATEGORIES = [
    {
        title: 'Cured Meats',
        icon: '/assets/identity/stickers/sticker-cow.svg',
        img: '/assets/cuts/charcuterie-cured-meats-packaged.jpg',
        alt: 'Hofherr Meat Co. sliced prosciutto, bresaola, and coppa with branded kraft deli packaging',
        items: 'Bresaola (Air-dried, salted beef), Coppa (Cured Pork Shoulder), Jamón Serrano (Spanish Ham), Lonza (Cured Pork Loin), Pancetta, Pepperoni, Prosciutto',
    },
    {
        title: 'Cured Salamis',
        icon: '/assets/identity/stickers/sticker-suage.svg',
        img: '/assets/cuts/charcuterie-salamis-packaged.jpg',
        alt: 'Hofherr Meat Co. dry-cured Genoa salami, finocchiona, and chorizo with kraft-wrapped chubs',
        items: 'Casalingo, Chorizo, Dodge City, Felino, Finocchiona, Genoa, Rosette de Lyon, Saucisson Sec',
    },
    {
        title: 'Deli Meats',
        icon: '/assets/identity/stickers/sticker-hamcheese.svg',
        img: '/assets/cuts/charcuterie-deli-meats-packaged.jpg',
        alt: 'Hofherr Meat Co. shaved smoked pastrami, roasted turkey breast, and tavern ham with kraft deli parcel',
        items: 'Beerwurst, Bologna, Chicken Salad, Corned Beef, Ham, Head Cheese, Mortadella, Liverwurst, Pastrami, Roast Beef, Summer Sausage, Thuringer, Turkey Breast (Roasted and Smoked)',
    },
    {
        title: 'Sausages',
        icon: '/assets/identity/stickers/sticker-suage.svg',
        img: '/assets/cuts/charcuterie-sausages-packaged.jpg',
        alt: 'Hofherr Meat Co. housemade Sheboygan bratwurst, Italian sausage coils, and kielbasa with butcher tray label',
        items: "Andouille, Bavarian Knockwurst, Brats (Cheddar, Cheddar-Cherry, Sheboygan, White), Breakfast (Brown 'n Serve, Chicken, Maple-Sage, Turkey), Ćevapi, Chicago Hot Link, Chorizo (Mexican, Spanish), Hot Dogs (All-Beef, Chicken), Italian, Kabanosy, Kielbasa, Landjäger, Nashville Hot Chicken, Peking Duck, Polish (Dried, Fresh), Summer, Thuringer",
    },
    {
        title: 'Cheeses',
        icon: '/assets/identity/stickers/sticker-cheese.svg',
        img: '/assets/cuts/charcuterie-cheeses-packaged.jpg',
        alt: 'Hofherr Meat Co. aged Wisconsin cheddar, blue, and alpine cheese wedges with branded cheese paper',
        items: 'American, Bleu, Cheddar, Colby, Mozzarella, Muenster, Pepperjack, Provolone, Swiss',
    },
    {
        title: 'Chicken & Pork Specialties',
        icon: '/assets/identity/stickers/sticker-pig.svg',
        img: '/assets/cuts/charcuterie-pate-confit-bacon-packaged.jpg',
        alt: 'Hofherr Meat Co. country pâté terrine, duck confit, slab bacon, and rillettes jar with branded kraft labels',
        items: 'Bacon, Confit, Galantines, Pâtés, Rillettes, Schmaltz, Terrines, Trotters',
    },
];

const SIGNATURE_SANDWICHES = [
    {
        name: 'Good Afternoon, Vietnam',
        tag: 'House Pâté & Pork Banh Mi',
        desc: 'Country Pâté, Smoked Pork Shoulder, Tavern Ham, Kimchi, Cilantro, Cucumber, and Rooster Mayo.',
        bread: 'Crisp Artisan Baguette · Served with chips & a pickle wedge',
    },
    {
        name: 'The Mark Cuban',
        tag: 'Cubano Classic',
        desc: 'Tavern Ham, Organic Swiss Cheese, Chorizo Mustard, Cured Pork Lonza, and Crisp Deli Pickles.',
        bread: 'Pressed Artisan Baguette · Served with chips & a pickle wedge',
    },
    {
        name: 'Buffalo Bill',
        tag: 'Wing Sauce Turkey',
        desc: 'Oven-Roasted Turkey Breast, Melted Muenster Cheese, Tangy Wing Sauce Aioli, and Fresh Scallions.',
        bread: 'Crusty Artisan Baguette · Served with chips & a pickle wedge',
    },
    {
        name: 'The Beast',
        tag: 'Butcher Shop Favorite',
        desc: 'Generous stack of Oven-Roasted Turkey Breast, Muenster Cheese, Wing Sauce Aioli, and Scallions.',
        bread: 'Crusty Artisan Baguette · Served with chips & a pickle wedge',
    },
    {
        name: 'Usual Suspect',
        tag: 'Pastrami & Corned Beef Twin',
        desc: 'House-Smoked Beef Pastrami, Brined Corned Beef, Organic Swiss Cheese, and Classic Yellow Mustard.',
        bread: 'Sliced Seeded Rye Bread · Served with chips & a pickle wedge',
    },
    {
        name: 'Smoke Signal',
        tag: 'Smokehouse Club',
        desc: 'Smoked Turkey Breast, Smoking Bacon Cheddar Cheese, Scallion, Mayo, and Crisp Lettuce.',
        bread: 'Homestyle White Bread · Served with chips & a pickle wedge',
    },
];

const SOUPS_AND_STOCKS = {
    soups: [
        'Beef Stroganoff',
        'Chicken Noodle',
        'Chili',
        'French Onion',
        'Polish Bigos (Hunter’s Stew)',
        'Polish White Bean',
        'Smoked Duck & Tasso Ham Gumbo',
        'Split Pea',
        'Texas Chili',
        'Veggie Beef Barley',
        'White Bean & Ham',
        'Plus rotating weekly seasonal soups',
    ],
    stocks: ['Beef Stock', 'Chicken Stock', 'Duck Stock', 'Turkey Stock', 'Veal Stock', 'Vegetable Stock'],
};

const PREPARED_MEALS_CARDS = [
    {
        title: 'Heat-and-Eat Entrees',
        kicker: 'CASE-READY TRAYS · FOIL & SLEEVE SYSTEM',
        icon: '/assets/identity/stickers/sticker-prepared.svg',
        img: '/assets/cuts/prepared-heat-and-eat-entrees-packaged.jpg',
        imgAlt: 'Hofherr Meat Co. chicken pot pie, glazed meatloaf, and Italian meatballs alongside branded foil and case-ready tray sleeves',
        items: [
            'Chicken Pot Pie',
            'Italian Beef',
            'Italian Meatballs',
            'Meat Loaf',
            'Handmade Authentic Pierogis',
            'Pulled Pork',
            'Sloppy Joes',
            'Spaghetti Sauce',
            'Tamales',
        ],
    },
    {
        title: 'Portioned Ready-to-Cook Proteins',
        kicker: 'CRYOVAC VACUUM-SEALED · FRONT & BACK LABELS',
        icon: '/assets/identity/stickers/sticker-grabgo.svg',
        img: '/assets/cuts/prepared-ready-to-cook-proteins-packaged.jpg',
        imgAlt: 'Hofherr Meat Co. bacon-wrapped filet mignon, veal osso bucco, and herb-marinated salmon with Cryovac vacuum-sealed labels',
        items: [
            'Irish Bacon',
            'Beef Shanks',
            'Boneless Skinless Chicken Thighs',
            'Duck Confit',
            'Fajita Mix',
            'Bacon-Wrapped Filet Mignon',
            'Marinated Salmon',
            'Veal Osso Bucco',
        ],
    },
    {
        title: 'Scratch Side Dishes, Broths & Rubs',
        kicker: 'DELI QUART & PINT TUBS · TAMPER-EVIDENT LIDS',
        icon: '/assets/identity/stickers/sticker-pantry.svg',
        img: '/assets/cuts/prepared-sides-broths-rubs-packaged.jpg',
        imgAlt: 'Hofherr Meat Co. Northshore baked beans, twice-baked potatoes, and cole slaw alongside branded bone broth, rub tins, and BBQ sauce',
        items: [
            'Northshore Baked Beans',
            'Turkey Gravy',
            'Twice-Baked Potatoes',
            'Vinegar Cole Slaw',
            '24-Hour Bone Broths',
            'House Dry Rubs & Marinades',
        ],
    },
];

export default function SelectionsClient() {
    return (
        <main className={styles.page}>
            {/* ── Hero Header (No Content-Boxing, Single H1, No Pill Above H1) ── */}
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 className={styles.heroTitle}>
                        OUR SELECTIONS &amp; <span className={styles.heroTitleAccent}>BUTCHER BOARDS</span>
                    </h1>
                    <p className={styles.heroLead}>
                        We&apos;re dedicated to buying and selling meats that are directly traceable to the original
                        production source. Before opening the doors to Hofherr Meat Co., we went to great lengths to
                        seek out and visit family-run farms throughout the Midwest in Illinois, Wisconsin, Indiana, and
                        Michigan — devising a carefully orchestrated supply of humanely raised animals without
                        compromise or exception.
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
                            02 · Quality Meats &amp; Game
                        </a>
                        <a href="#charcuterie-counter" className={styles.jumpLink}>
                            03 · Charcuterie, Sausages &amp; Deli
                        </a>
                        <a href="#signature-sandwiches" className={styles.jumpLink}>
                            04 · Soups &amp; Sandwiches
                        </a>
                        <a href="#prepared-and-bbq" className={styles.jumpLink}>
                            05 · Prepared Meals &amp; Barbeque
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Section 01: Farm Traceability & Design System Farm Source Board ── */}
            <section
                id="sourcing-standards"
                aria-labelledby="sourcing-standards-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.dualPhotoGrid}>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/identity/signage/farm-source-sign.svg"
                                alt="Hofherr Meat Co. Midwest Farm Source & 10-Department Story Sign Printable Vector Master"
                                className={`${styles.featureBannerImg} ${styles.featureBannerVector}`}
                            />
                            <figcaption className={styles.featureBannerCapRow}>
                                <span>
                                    Directly Traceable Midwest Family Farms — Illinois · Wisconsin · Indiana · Iowa · Michigan
                                </span>
                                <div className={styles.featureBannerActions}>
                                    <a
                                        href="/assets/identity/signage/farm-source-sign.svg"
                                        download="hofherr-farm-source-sign-48x27.svg"
                                        className={styles.vectorBadgeBtn}
                                    >
                                        ⬇ Vector (.SVG)
                                    </a>
                                    <Link
                                        href="/product-identity/print?master=farm-source-sign&w=7.5&h=4.18&autoprint=1"
                                        target="_blank"
                                        className={styles.vectorBadgeBtn}
                                    >
                                        🖨 Print Master
                                    </Link>
                                </div>
                            </figcaption>
                        </figure>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/identity/butcher-complete-packaging-suite-10-icons.jpg"
                                alt="Hofherr Meat Co. Complete Butcher Packaging Suite with Kraft Paper & Provenance Seals"
                                className={styles.featureBannerImg}
                            />
                            <figcaption className={styles.featureBannerCap}>
                                Custom-Cut to Order · Wrapped in Unbleached Kraft Paper &amp; Butcher Twine
                            </figcaption>
                        </figure>
                    </div>

                    <div className={styles.sectionHeader}>
                        <h2 id="sourcing-standards-heading" className={styles.sectionTitle}>
                            01 / Midwest Farm Traceability &amp; Standards
                        </h2>
                        <p className={styles.sectionDesc}>
                            Many grocery stores use pre-processed meats from industrialized factories where it&apos;s
                            hard to get a straight answer on hormones, steroids, or antibiotics. At Hofherr Meat Co.,
                            every cut is traceable to family farms we know by name.
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

            {/* ── Section 02: Quality Meats & 6 Design System Butcher Boards ── */}
            <section id="butcher-boards" aria-labelledby="butcher-boards-heading" className="section">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="butcher-boards-heading" className={styles.sectionTitle}>
                            02 / Quality Meats — Beef, Pork, Lamb, Poultry, Game &amp; Exotic Game
                        </h2>
                        <p className={styles.sectionDesc}>
                            Because Sean began his career as a chef, his vision for Hofherr Meat Co. focuses on helping
                            customers create restaurant-quality meals in their own homes — from raw steaks, chops, and
                            poultry to venison, buffalo, rabbit, marrow bones, duck fat, pure lard, smoked salmon, and
                            custom processing for hunters.
                        </p>
                    </div>

                    <div className={styles.boardsGrid}>
                        {BUTCHER_BOARDS.map((board) => (
                            <article key={board.id} className={styles.boardCard}>
                                <div className={styles.systemBoardBanner}>
                                    <img
                                        src={board.systemImg}
                                        alt={board.systemImgAlt}
                                        className={styles.systemBoardImg}
                                    />
                                    <div className={styles.engravingBadge}>
                                        <img
                                            src={board.icon}
                                            alt=""
                                            className={styles.boardEmblem}
                                        />
                                    </div>
                                </div>
                                <div className={styles.boardHeadText}>
                                    <h3 className={styles.boardTitle}>{board.title}</h3>
                                    <span className={styles.boardPromise}>{board.promise}</span>
                                </div>
                                <p className={styles.classicRoster}>
                                    <strong>Classic Case Roster:</strong> <em>{board.classicList}</em>
                                </p>
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

            {/* ── Section 03: Charcuterie Case & 6 Design System Categories ── */}
            <section
                id="charcuterie-counter"
                aria-labelledby="charcuterie-counter-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="charcuterie-counter-heading" className={styles.sectionTitle}>
                            03 / Hand-Crafted Charcuterie, Sausages, Deli &amp; Cheese
                        </h2>
                        <p className={styles.sectionDesc}>
                            We take immense pride in our hand-crafted charcuterie. At any given time, one of our team
                            is carefully preparing sausage, ham, pâté, and cured offerings alongside our traditional
                            deli counter and floor-to-ceiling rotisserie oven for chicken and ribs.
                        </p>
                    </div>

                    <div className={styles.dualPhotoGrid}>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/cuts/charcuterie-case-display-packaged.jpg"
                                alt="Hofherr Meat Co. Charcuterie, Sausage & Traditional Deli Case Display with Branded Pin Tags"
                                className={styles.featureBannerImg}
                            />
                            <figcaption className={styles.featureBannerCap}>
                                The Hofherr Northfield Charcuterie, Sausage &amp; Traditional Deli Case Tag System
                            </figcaption>
                        </figure>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/cuts/charcuterie-board-deli-parcels-packaged.jpg"
                                alt="Hofherr Meat Co. Hand-Crafted Charcuterie Platter & Wrapped Deli Parcels with Woodcut Flame Seals"
                                className={styles.featureBannerImg}
                            />
                            <figcaption className={styles.featureBannerCap}>
                                Official 10-Department Woodcut Flame Deli &amp; Butcher Paper Seals
                            </figcaption>
                        </figure>
                    </div>

                    <div className={styles.charcuterieGrid}>
                        {CHARCUTERIE_CATEGORIES.map((cat) => (
                            <article key={cat.title} className={styles.charcuterieCard}>
                                <div className={styles.charcuterieThumbWrap}>
                                    <img
                                        src={cat.img}
                                        alt={cat.alt}
                                        className={styles.charcuterieThumb}
                                    />
                                    <div className={styles.charcuterieCornerBadge}>
                                        <img src={cat.icon} alt="" className={styles.charcuterieBadgeIcon} />
                                    </div>
                                </div>
                                <div className={styles.charcuterieBody}>
                                    <h3 className={styles.charcuterieTitle}>{cat.title}</h3>
                                    <p className={styles.charcuterieItems}>{cat.items}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 04: Soups, Stocks & 6 Named Housemade Sandwiches ── */}
            <section
                id="signature-sandwiches"
                aria-labelledby="signature-sandwiches-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="signature-sandwiches-heading" className={styles.sectionTitle}>
                            04 / Housemade Soups, Stocks &amp; Signature Sandwiches
                        </h2>
                        <p className={styles.sectionDesc}>
                            All of our soups are made fresh daily to carry out with special recipes every week. All of
                            our deli meats are cured, smoked, and made daily in-house, accompanied by your choice of
                            chips and a pickle wedge. Choose from our 6 chef-crafted sandwiches or build your own!
                        </p>
                    </div>

                    <div className={styles.dualPhotoGrid}>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/cuts/sandwiches-butcher-counter-packaged.jpg"
                                alt="Hofherr Meat Co. Housemade Banh Mi, Cubano & Pastrami Sandwiches on Branded Butcher Paper"
                                className={styles.featureBannerImg}
                            />
                            <figcaption className={styles.featureBannerCap}>
                                Daily Butcher Counter Sandwiches &amp; Weekly Rotating Specials
                            </figcaption>
                        </figure>
                        <figure className={styles.featureBanner}>
                            <img
                                src="/assets/cuts/soups-kettle-stocks-packaged.jpg"
                                alt="Hofherr Meat Co. Scratch Chicken Noodle & French Onion Soups with 24-Hour Simmered Bone Stock Deli Tubs"
                                className={styles.featureBannerImg}
                            />
                            <figcaption className={styles.featureBannerCap}>
                                Scratch Daily Kettle Soups &amp; 24-Hour Simmered Butcher Bone Stocks
                            </figcaption>
                        </figure>
                    </div>

                    <div className={styles.sandwichGrid}>
                        {SIGNATURE_SANDWICHES.map((item) => (
                            <article key={item.name} className={styles.sandwichCard}>
                                <div className={styles.sandwichTop}>
                                    <h3 className={styles.sandwichTitle}>{item.name}</h3>
                                    <span className={styles.sandwichTag}>{item.tag}</span>
                                </div>
                                <p className={styles.sandwichDesc}>{item.desc}</p>
                                <span className={styles.sandwichBread}>
                                    <img
                                        src="/assets/identity/stickers/sticker-bread.svg"
                                        alt=""
                                        className={styles.breadIcon}
                                    />
                                    {item.bread}
                                </span>
                            </article>
                        ))}
                    </div>

                    <div className={styles.soupsStocksGrid}>
                        <article className={styles.pantryCard}>
                            <div className={styles.pantryHead}>
                                <img
                                    src="/assets/identity/stickers/sticker-soup.svg"
                                    alt=""
                                    className={styles.pantryIcon}
                                />
                                <h3 className={styles.pantryTitle}>Housemade Daily Soups</h3>
                            </div>
                            <div className={styles.tagCloud}>
                                {SOUPS_AND_STOCKS.soups.map((soup) => (
                                    <span key={soup} className={styles.rosterPill}>
                                        {soup}
                                    </span>
                                ))}
                            </div>
                        </article>

                        <article className={styles.pantryCard}>
                            <div className={styles.pantryHead}>
                                <img
                                    src="/assets/identity/stickers/sticker-stocksoup.svg"
                                    alt=""
                                    className={styles.pantryIcon}
                                />
                                <h3 className={styles.pantryTitle}>Housemade Kettle Stocks</h3>
                            </div>
                            <div className={styles.tagCloud}>
                                {SOUPS_AND_STOCKS.stocks.map((stock) => (
                                    <span key={stock} className={styles.rosterPill}>
                                        {stock}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── Section 05: Prepared Meals & Barbeque Headquarters (Design System Images) ── */}
            <section
                id="prepared-and-bbq"
                aria-labelledby="prepared-and-bbq-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="prepared-and-bbq-heading" className={styles.sectionTitle}>
                            05 / Scratch Prepared Meals &amp; Barbeque Headquarters
                        </h2>
                        <p className={styles.sectionDesc}>
                            All of our prepared meals are made from scratch — choose from heat-and-eat entrees, classic
                            Northshore sides, or ready-to-cook portioned proteins, plus our year-round supply of
                            hard-to-find lump charcoal, smoking wood chunks, competition rubs, and sauces.
                        </p>
                    </div>

                    <div className={styles.trioGrid}>
                        {PREPARED_MEALS_CARDS.map((card) => (
                            <article key={card.title} className={styles.pantryCard}>
                                <div className={styles.pantryBannerWrap}>
                                    <img
                                        src={card.img}
                                        alt={card.imgAlt}
                                        className={styles.pantryBannerImg}
                                    />
                                    <div className={styles.pantryBannerBadge}>
                                        <img
                                            src={card.icon}
                                            alt=""
                                            className={styles.pantryIcon}
                                        />
                                    </div>
                                </div>
                                <div className={styles.pantryHeadMeta}>
                                    <span className={styles.pantryKicker}>{card.kicker}</span>
                                    <h3 className={styles.pantryTitle}>{card.title}</h3>
                                </div>
                                <div className={styles.tagCloud}>
                                    {card.items.map((item) => (
                                        <span key={item} className={styles.rosterPill}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className={styles.bbqFeatureCard}>
                        <div className={styles.bbqVisualStack}>
                            <div className={styles.bbqPhotoWrap}>
                                <img
                                    src="/assets/cuts/bbq-smokehouse-catering-packaged.jpg"
                                    alt="Hofherr Meat Co. Smoked Beef Brisket, St. Louis Ribs & Pulled Pork with Kraft Catering Box"
                                    className={styles.bbqPhoto}
                                />
                            </div>
                            <div className={styles.bbqSubGrid}>
                                <div className={styles.bbqMiniCard}>
                                    <img
                                        src="/assets/cuts/bbq-reserve-pitmaster-box-packaged.jpg"
                                        alt="Hofherr Meat Co. Reserve Pitmaster Box with Prime Steaks, Ribs & Sausages"
                                        className={styles.bbqMiniImg}
                                    />
                                    <span className={styles.bbqMiniCap}>Reserve Pitmaster Box</span>
                                </div>
                                <div className={styles.bbqMiniCard}>
                                    <img
                                        src="/assets/cuts/bbq-insulated-butcher-tote-packaged.jpg"
                                        alt="Hofherr Meat Co. Insulated Cold-Chain Butcher Tote Packed with Wrapped Butcher Parcels & Steaks"
                                        className={styles.bbqMiniImg}
                                    />
                                    <span className={styles.bbqMiniCap}>Insulated Cold-Chain Tote</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.bbqContent}>
                            <div className={styles.bbqBadgeRow}>
                                <img
                                    src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                                    alt="Hofherr Meat Co. Northfield Provenance Seal"
                                    className={styles.cleaverBadge}
                                />
                                <img
                                    src="/assets/identity/stickers/sticker-catering.svg"
                                    alt="Hofherr Smokehouse & Catering Truck Emblem"
                                    className={styles.cleaverBadge}
                                />
                                <div>
                                    <span className={styles.pantryKicker}>NORTHFIELD &amp; WINNETKA DEPOT · SMOKEHOUSE</span>
                                    <h3 className={styles.bbqTitle}>BARBEQUE — YEAR-ROUND PITMASTER SUPPLY</h3>
                                </div>
                            </div>
                            <p className={styles.bbqText}>
                                Our passion for barbecue borders on zealotry. Regardless of the season, we carry an
                                impressive selection of hard-to-find lump charcoal, smoking wood chips and chunks,
                                competition rubs, and regional sauces.
                            </p>
                            <p className={styles.bbqText}>
                                We have relationships with the best suppliers in the barbecue business — from legendary
                                hotbeds throughout the South to local artisans who share our dedication to quality and
                                authenticity. We&apos;re a one-stop shop for advice on competition-level techniques,
                                serving size recommendations, and grilling recipes.
                            </p>
                            <div className={styles.bbqActions}>
                                <Link href="/bbq" className="btn btn-primary">
                                    Explore BBQ &amp; Smokehouse
                                </Link>
                                <a href="mailto:sean@hofherrmeatco.com" className="btn btn-outline">
                                    Email Sean Your BBQ Questions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 06: Custom Cut & Counter Dispatch CTA ── */}
            <section id="selections-cta" aria-labelledby="selections-cta-heading" className="section">
                <div className="container">
                    <div className={styles.ctaStyle4}>
                        <FireBorder active radius={20} />
                        <div className={styles.ctaStyle4Left}>
                            <div className={styles.ctaStyle4Medallions}>
                                <img src="/assets/identity/stickers/sticker-cow.svg" alt="" className={styles.ctaMiniSticker} />
                                <img src="/assets/identity/stickers/sticker-pig.svg" alt="" className={styles.ctaMiniSticker} />
                                <img src="/assets/identity/stickers/sticker-lamb.svg" alt="" className={styles.ctaMiniSticker} />
                                <img src="/assets/identity/stickers/sticker-chicken.svg" alt="" className={styles.ctaMiniSticker} />
                                <img src="/assets/identity/stickers/sticker-game.svg" alt="" className={styles.ctaMiniSticker} />
                            </div>
                            <h2 id="selections-cta-heading" className={styles.ctaHeadingCream}>
                                READY FOR A CUSTOM CUT OR SPECIAL ORDER?
                            </h2>
                            <p className={styles.ctaSubCream}>
                                Order online for same-day pickup at <strong>300 Happ Rd in Northfield</strong> or commuter pickup at <strong>The Depot in Winnetka</strong>, or call the butcher counter directly at <strong>(847) 441-MEAT</strong>.
                            </p>
                        </div>
                        <div className={styles.ctaStyle4Right}>
                            <span className={styles.ctaKickerGold}>DIRECT COUNTER DISPATCH</span>
                            <Link href="/online-orders" className="btn btn-primary">
                                Order Online Now
                            </Link>
                            <a href="tel:8474416328" className="btn btn-secondary">
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
