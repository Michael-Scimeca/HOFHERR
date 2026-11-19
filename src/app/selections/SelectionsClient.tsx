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

export default function SelectionsClient({ cutGuide }: { cutGuide?: React.ReactNode }) {
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
                        <Link href="/online-orders" className="btn-hit">
                            <span className="btn btn-primary">
                                <FireBorder active={true} radius={6} />
                                Order Online for Pickup
                            </span>
                        </Link>
                        <a href="#cut-guide" className="btn-hit">
                            <span className="btn btn-primary">Interactive Cut &amp; Cooking Guide</span>
                        </a>
                        <Link href="/specials" className="btn-hit">
                            <span className="btn btn-primary">This Week&apos;s Specials</span>
                        </Link>
                    </div>
                    <nav className={styles.jumpNav} aria-label="Selections page sections">
                        <a href="#sourcing-standards" className={styles.jumpLink}>
                            Farm Traceability
                        </a>
                        <a href="#butcher-boards" className={styles.jumpLink}>
                            Quality Meats &amp; Game
                        </a>
                        <a href="#charcuterie-counter" className={styles.jumpLink}>
                            Charcuterie, Sausages &amp; Deli
                        </a>
                        <a href="#signature-sandwiches" className={styles.jumpLink}>
                            Soups &amp; Sandwiches
                        </a>
                        <a href="#prepared-and-bbq" className={styles.jumpLink}>
                            Wild Game &amp; Ready-to-Eat
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Farm Traceability & Design System Farm Source Board ── */}
            <section
                id="sourcing-standards"
                aria-labelledby="sourcing-standards-heading"
                className="section-sm"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="sourcing-standards-heading" className={styles.sectionTitle}>
                            Midwest Farm Traceability &amp; Standards
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

            {/* ── Quality Meats & 6 Design System Butcher Boards ── */}
            <section id="butcher-boards" aria-labelledby="butcher-boards-heading" className="section">
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="butcher-boards-heading" className={styles.sectionTitle}>
                            Quality Meats — Beef, Pork, Lamb, Poultry, Game &amp; Exotic Game
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

            {/* ── Charcuterie Case & 6 Design System Categories ── */}
            <section
                id="charcuterie-counter"
                aria-labelledby="charcuterie-counter-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="charcuterie-counter-heading" className={styles.sectionTitle}>
                            Hand-Crafted Charcuterie, Sausages, Deli &amp; Cheese
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

            {/* ── Soups, Stocks & 6 Named Housemade Sandwiches ── */}
            <section
                id="signature-sandwiches"
                aria-labelledby="signature-sandwiches-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="signature-sandwiches-heading" className={styles.sectionTitle}>
                            Housemade Soups, Stocks &amp; Signature Sandwiches
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

            {/* ── Wild game processing + ready-to-eat link across to Specials ── */}
            <section
                id="prepared-and-bbq"
                aria-labelledby="prepared-and-bbq-heading"
                className="section"
            >
                <div className={`container ${styles.sectionStack}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="prepared-and-bbq-heading" className={styles.sectionTitle}>
                            Wild Game Processing &amp; Ready-to-Eat
                        </h2>
                        <p className={styles.sectionDesc}>
                            Bring us your deer, elk or waterfowl and we&apos;ll process it to your cut sheet. Looking
                            for heat-and-eat meals, barbecue and sides? They live on our Specials page.
                        </p>
                    </div>
                    <div className={styles.bbqActions}>
                        <a href="mailto:sean@hofherrmeatco.com?subject=Wild%20game%20processing" className="btn-hit">
                            <span className="btn btn-primary">Ask About Wild Game Processing</span>
                        </a>
                        <Link href="/specials" className="btn btn-outline">
                            Prepared Meals &amp; BBQ on Specials
                        </Link>
                    </div>
                </div>
            </section>

            {cutGuide}

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
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">
                                    <FireBorder active={true} radius={6} />
                                    Order Online Now
                                </span>
                            </Link>
                            <a href="tel:8474416328" className="btn-hit">
                                <span className="btn btn-secondary">Call (847) 441-MEAT</span>
                            </a>
                            <a href="#cut-guide" className="btn btn-outline">
                                View Interactive Cut Guide
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
