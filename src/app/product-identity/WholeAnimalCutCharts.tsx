'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './WholeAnimalCutCharts.module.css';

export type PrimalCut = {
    name: string;
    anatomy: string;
    signatureCuts: string[];
    profile: string;
    cookingMethod: string;
    targetTemp?: string;
    butcherTip: string;
};

export type AnimalCutData = {
    id: string;
    slug: string;
    name: string;
    formalTitle: string;
    breedNote: string;
    iconSvg: string;
    chartSvg: string;
    downloadName: string;
    svgWidth: number;
    svgHeight: number;
    primals: PrimalCut[];
    butcherWisdom: string[];
};

export const ANIMAL_CUT_DATA: AnimalCutData[] = [
    {
        id: 'beef',
        slug: 'beef',
        name: 'Midwest Beef',
        formalTitle: 'The Steer · Primal & Retail Cut Anatomy',
        breedNote: 'USDA Prime & Choice · Midwest Family Farms · Grain-Finished & 100% Grass-Fed',
        iconSvg: '/icons/cow.svg',
        chartSvg: '/assets/identity/cut-charts/cut-chart-beef.svg',
        downloadName: 'hofherr-cut-chart-beef.svg',
        svgWidth: 1000,
        svgHeight: 1160,
        primals: [
            {
                name: 'Rib',
                anatomy: 'Dorsal spine between the 6th and 12th ribs',
                signatureCuts: ['USDA Prime Bone-In Ribeye', 'Boneless Delmonico', 'Tomahawk Ribeye', 'Standing Prime Rib Roast'],
                profile: 'Heaviest intramuscular marbling on the steer. The spinalis dorsi (ribeye cap) is universally regarded as the most flavorful muscle on beef.',
                cookingMethod: 'High-heat cast iron sear, reverse-sear, or hardwood oak grill',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: 'Always rest ribeyes 8–10 minutes on a warm cutting board before carving so the juices redistribute rather than pooling on the platter.',
            },
            {
                name: 'Short Loin & Tenderloin',
                anatomy: 'Directly behind the rib primal along the lumbar spine',
                signatureCuts: ['New York Strip', 'Porterhouse', 'T-Bone Steak', 'Filet Mignon (Tenderloin)', 'Chateaubriand'],
                profile: 'Supreme tender muscle with minimal connective tissue. A Porterhouse features a full tenderloin medallion at least 1.25" thick alongside the NY strip.',
                cookingMethod: 'Screaming-hot cast-iron pan or direct wood fire with butter basting',
                targetTemp: '125°F–130°F (Rare to Medium-Rare)',
                butcherTip: 'The tenderloin does virtually zero mechanical work on the animal, which is why it yields the butter-soft texture of Filet Mignon.',
            },
            {
                name: 'Chuck',
                anatomy: 'Front shoulder and neck complex (ribs 1–5)',
                signatureCuts: ['Bone-In Chuck Roast', 'Denver Steak (Serratus Ventralis)', 'Flat Iron (Infraspinatus)', 'Chuck Eye', '80/20 Ground Chuck'],
                profile: 'Immense beefy flavor with rich intermuscular collagen. When braised, collagen hydrolyzes into succulent gelatin.',
                cookingMethod: 'Slow Dutch oven braise at 275°F, smoking, or quick sear for Flat Iron',
                targetTemp: '203°F (Fork-Tender Braise)',
                butcherTip: 'The Flat Iron steak cut from the top blade is the second most tender muscle on the entire beef carcass, right behind the tenderloin.',
            },
            {
                name: 'Brisket',
                anatomy: 'Deep pectoral muscles supporting 60% of the standing weight',
                signatureCuts: ['Whole Packer Brisket', 'Flat Cut (Lean First Cut)', 'Point Cut (Rich Deckle / Burnt Ends)'],
                profile: 'Heavy coarse muscle fibers enveloped in a thick fat cap. The king of Central Texas barbecue.',
                cookingMethod: 'Low & slow wood smoke at 225°F for 12–16 hours with post-oak coals',
                targetTemp: '203°F (Internal Probe Feel Like Warm Butter)',
                butcherTip: 'Never trim the fat cap thinner than 1/4 inch. As the fat slowly renders downward through the meat, it preserves maximum moisture.',
            },
            {
                name: 'Sirloin',
                anatomy: 'Hip and lower pelvic area between short loin and round',
                signatureCuts: ['Top Sirloin Center-Cut', 'Tri-Tip Roast', 'Picanha (Coulotte with Fat Cap)', 'Sirloin Bavette'],
                profile: 'Firm, lean, deeply savory profile. Picanha features a thick protective fat blanket that crisps under high heat.',
                cookingMethod: 'Rotisserie over charcoal coals, reverse-sear, or Santa Maria open grill',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: 'Slice Tri-Tip across two different grain directions: split the roast where the grain turns before slicing thin ribbons.',
            },
            {
                name: 'Plate & Flank',
                anatomy: 'Lower belly, diaphragm, and abdominal wall',
                signatureCuts: ['Inside Skirt Steak', 'Outside Skirt (Carne Asada)', 'Flank Steak', 'English-Cut Short Ribs'],
                profile: 'Long, open grain fibers that hold marinades deeper than any other cut. Outstanding mineral finish when seared charred on the outside.',
                cookingMethod: 'Screaming-hot grill for 2–3 minutes per side; braise for short ribs',
                targetTemp: '130°F (Must slice strictly perpendicular to grain)',
                butcherTip: 'Always slice skirt and flank steak across the grain at a 45° angle. Cutting parallel makes it chewy; cutting across makes it melt-in-your-mouth.',
            },
            {
                name: 'Round & Shank',
                anatomy: 'Rear hind leg (Round) and lower fore/hind shanks',
                signatureCuts: ['Top Round (Chicago Italian Beef)', 'Eye of Round', 'Bottom Round Rump Roast', 'Cross-Cut Osso Buco Shank'],
                profile: 'Very lean, hard-working muscles with high gelatin in shanks and uniform grain in round cuts.',
                cookingMethod: 'Slow wet braising for shanks; slow roasting and deli-shaving for round',
                targetTemp: '135°F for rare roast beef; 205°F for braised shanks',
                butcherTip: 'Our butcher-shop Italian beef is slow-roasted whole from Midwest top round, seasoned with garlic, oregano, and sweet peppers, then micro-shaved thin.',
            },
        ],
        butcherWisdom: [
            'A ribeye comes from ribs 6 through 12 — exactly the same anatomical section as a standing prime rib roast.',
            'Every Porterhouse is a T-bone, but only T-bones with a tenderloin section measuring at least 1.25 inches across earn the Porterhouse name.',
            'Hanger steak is traditionally called "the butcher\'s steak" because there is only one per carcass, hanging from the diaphragm, and butchers used to take it home.',
            'Dry-aging in our Winnetka humidity-controlled vault for 30–45 days evaporates 15% moisture, concentrating beefy umami and naturally enzymatically tenderizing the fibers.',
        ],
    },
    {
        id: 'pork',
        slug: 'pork',
        name: 'Heritage Pork',
        formalTitle: 'The Heritage Hog · Primal & Charcuterie Anatomy',
        breedNote: '100% Purebred Berkshire & Duroc · Pasture-Raised · Uncured All-Natural Whole Hogs',
        iconSvg: '/icons/pig.svg',
        chartSvg: '/assets/identity/cut-charts/cut-chart-pork.svg',
        downloadName: 'hofherr-cut-chart-pork.svg',
        svgWidth: 1000,
        svgHeight: 1160,
        primals: [
            {
                name: 'Boston Butt (Upper Shoulder)',
                anatomy: 'Upper portion of the front shoulder above the picnic',
                signatureCuts: ['Bone-In Boston Butt Roast', 'Coppa Steak (Capicola muscle)', 'Pork Collar Steaks', 'Artisan Country Ribs'],
                profile: 'Intensely marbled with deep ruby-red meat, high intramuscular fat, and rich collagen. Holds the best fat-to-lean ratio on the hog.',
                cookingMethod: 'Smoked low and slow over applewood and hickory coals at 225°F for pulled pork',
                targetTemp: '200°F–205°F (Bone pulls clean with two fingers)',
                butcherTip: 'Despite the name, the Boston Butt has nothing to do with the rear of the pig; it was named after the colonial wooden barrels ("butts") used to transport salted shoulder cuts.',
            },
            {
                name: 'Loin (Back & Ribs)',
                anatomy: 'Runs along the spine from shoulder to hip',
                signatureCuts: ['Center-Cut Bone-In Chops', 'Thick-Cut Tomahawk Pork Chops', 'Baby Back Ribs', 'Whole Pork Tenderloin', 'Crown Roast of Pork'],
                profile: 'The most tender, mild, and delicate primal on the pig. Heritage Berkshire pork yields dark, pinkish-red loin with fine snow-white marbling.',
                cookingMethod: 'Sear in cast-iron and baste with butter, thyme, and garlic to 145°F',
                targetTemp: '145°F + 3-minute rest (USDA standard · slight blush pink is juicy & safe)',
                butcherTip: 'Overcooking pork chops to 165°F dries out the lean loin. Modern heritage pork is safely enjoyed at 145°F with a juicy pink interior.',
            },
            {
                name: 'Belly',
                anatomy: 'Underside of the pig between front and hind legs',
                signatureCuts: ['House Applewood Smoked Bacon', 'Fresh Skin-On Pork Belly', 'St. Louis Cut Spare Ribs', 'Italian Porchetta Roll'],
                profile: 'Alternating ribbons of succulent pork fat and savory muscle. The cornerstone of the world\'s finest cured meats and crackling roasts.',
                cookingMethod: 'Cured and cold-smoked for bacon, or scored and roasted at 450°F for blistered crackling',
                targetTemp: '200°F for smoked ribs; 150°F for bacon before chilling and slicing',
                butcherTip: 'Our house bacon is dry-cured for seven full days with brown sugar, sea salt, and cracked peppercorns before 12 hours of cool applewood smoke.',
            },
            {
                name: 'Picnic Shoulder (Lower Shoulder)',
                anatomy: 'Directly below the Boston Butt down to the knee shank',
                signatureCuts: ['Bone-In Picnic Roast', 'Authentic Pork Carnitas Chunks', 'Smoked Picnic Ham'],
                profile: 'Contains more connective tissue than the butt with dense, rich muscle. Covered by skin that crisps into glass-like chicharrón.',
                cookingMethod: 'Braised in pork lard with orange peel, Mexican oregano, and garlic for carnitas',
                targetTemp: '203°F (Pull-Apart Tender)',
                butcherTip: 'Score the diamond pattern on the picnic skin before roasting at high heat so the fat renders out and puffs the skin into brittle crackling.',
            },
            {
                name: 'Ham / Leg (Hindquarter)',
                anatomy: 'Upper hind leg and pelvic round',
                signatureCuts: ['Heritage Bone-In City Ham', 'Country Dry-Cured Ham', 'Fresh Green Ham Roast', 'Italian Prosciutto Primal'],
                profile: 'Massive single muscle group with low fat and gentle sweetness. Ideal for holiday table centerpieces and dry-cured charcuterie.',
                cookingMethod: 'Slow smoked over fruitwood with brown sugar and bourbon glaze, or dry-aged 18 months',
                targetTemp: '140°F (Reheat for smoked hams) or 150°F (Fresh ham roast)',
                butcherTip: 'Bone-in hams stay vastly juicier than boneless hams because the marrow bone conducts heat evenly through the core of the roast.',
            },
            {
                name: 'Jowl & Hocks (Head & Shins)',
                anatomy: 'Lower cheek (Jowl) and lower leg joints (Hocks)',
                signatureCuts: ['Italian Guanciale (Cured Jowl)', 'Smoked Pork Hocks for Broth & Beans', 'Pork Trottles (Gelatin)'],
                profile: 'Pure silky fat in the cheek; concentrated collagen and dense tendon around the bone in the hocks.',
                cookingMethod: 'Rendered in a pan for classic Carbonara, or simmered 6 hours in split pea soup',
                targetTemp: 'Simmer until tender',
                butcherTip: 'Guanciale made from pork jowl holds a higher melting point and richer flavor than pancetta or bacon, giving authentic pasta carbonara its velvety gloss.',
            },
        ],
        butcherWisdom: [
            'Berkshire pork is famously known in Japan as "Kurobuta" (black pig) due to its ruby coloring and intense marbling that rivals wagyu beef.',
            'Baby back ribs are cut from the high loin near the spine, while spare ribs come from lower down adjacent to the pork belly.',
            'Pork tenderloin is an isolated muscle inside the loin cavity — it is the leanest and most tender cut on the animal with less fat than skinless chicken breast.',
            'A whole hog barbecue feast cooks the entire animal across 18 hours over whole logs of split white oak for unrivaled depth of flavor.',
        ],
    },
    {
        id: 'chicken',
        slug: 'chicken',
        name: 'Pasture Poultry',
        formalTitle: 'The Roaster · Whole-Bird & Rotisserie Anatomy',
        breedNote: 'Ferndale Market & Midwest Pasture Farms · Air-Chilled · Hand-Trimmed Daily',
        iconSvg: '/icons/chicken.svg',
        chartSvg: '/assets/identity/cut-charts/cut-chart-chicken.svg',
        downloadName: 'hofherr-cut-chart-chicken.svg',
        svgWidth: 1000,
        svgHeight: 1160,
        primals: [
            {
                name: 'Air-Chilled Breast',
                anatomy: 'Front chest pectoral muscle complex',
                signatureCuts: ['Boneless Skinless Chicken Breast', 'Airline Breast (French-Cut with Wing Drumette)', 'Split Bone-In Chicken Breast'],
                profile: 'Lean, clean, protein-rich white meat. 100% air-chilled processing means zero added water weight, ensuring crisp skin and pure poultry flavor.',
                cookingMethod: 'Sear in cast iron with butter or roast on the bone at 400°F',
                targetTemp: '165°F (Pull at 160°F and carryover rest 5 minutes)',
                butcherTip: 'Standard supermarket chicken is chilled in chlorinated ice water baths, absorbing up to 12% water weight that steams in the pan. Our air-chilled birds sear golden brown immediately.',
            },
            {
                name: 'Thigh (Dark Meat)',
                anatomy: 'Upper leg joint connected directly to the pelvis',
                signatureCuts: ['Bone-In Skin-On Thighs', 'Boneless Skinless Thighs', 'Chicken Schnitzel Cutlet'],
                profile: 'Packed with rich myoglobin, collagen, and dark meat sweetness. Highly resilient to heat and practically impossible to dry out.',
                cookingMethod: 'Hard skin-side sear in cast-iron, oven braise, or smoke at 275°F',
                targetTemp: '175°F–185°F (Thighs taste far better cooked past 165°F as collagen melts)',
                butcherTip: 'While chicken breast dries out at 170°F, chicken thighs peak in tenderness between 175°F and 185°F where tough connective tissue melts into pure juice.',
            },
            {
                name: 'Whole 3-Part Wings',
                anatomy: 'Forelimb comprising drumette, wingette (flat), and tip',
                signatureCuts: ['Jumbo Party Wings', 'Smoked Whole Wings', 'Crispy Air-Fried Wings'],
                profile: 'Highest skin-to-meat ratio on the bird. Renders into brittle, crunchy skin while holding tender meat on bone.',
                cookingMethod: 'Smoked at 250°F then flash-fried or high-heat roasted at 425°F',
                targetTemp: '175°F–180°F',
                butcherTip: 'The flat (wingette) has two parallel bones. You can pinch and twist the smaller radius bone to cleanly slide it out for boneless crispy wings.',
            },
            {
                name: 'Drumstick (Lower Leg)',
                anatomy: 'Lower leg between thigh knee joint and foot claw',
                signatureCuts: ['Whole Drumsticks', 'Butcher Lollipop Drums', 'Buttermilk Fried Drumsticks'],
                profile: 'Juicy, portable, family favorite dark meat on a single sturdy bone. Perfect for grilling and smoking.',
                cookingMethod: 'Buttermilk brine, seasoned cornstarch dredge, and fried in pure tallow, or hickory wood smoke',
                targetTemp: '175°F',
                butcherTip: 'Cut cleanly around the ankle tendon and push the meat upward into a rounded lollipop ball for elegant barbecue presentation.',
            },
            {
                name: 'The Oysters & Back Frame',
                anatomy: 'Two small concave hollows along the dorsal spine above the thigh',
                signatureCuts: ['The Butcher\'s Oysters ("Sot-l\'y-laisse")', '24-Hour Golden Bone Broth Frame', 'Chicken Gizzards & Livers'],
                profile: 'The oysters are tender, dark, extraordinarily velvety medallions. French butchers call them "sot-l\'y-laisse" ("only a fool leaves it").',
                cookingMethod: 'Roasted whole with the bird, then plucked directly from the roasted underside carcass',
                targetTemp: 'Cooked whole with roaster',
                butcherTip: 'Flip your roasted chicken breast-down on the carving board. Look at the small hollows on the lower spine: two silver-dollar-sized medallions pop out easily with a knife tip.',
            },
        ],
        butcherWisdom: [
            'Our pasture-raised birds live on open green Midwest forage, giving the meat a distinct golden hue from natural beta-carotene in grass and clover.',
            'Never wash raw chicken in your sink — it aerosolizes bacteria across kitchen surfaces. Pat dry with paper towels to ensure crispy golden skin.',
            'Spatchcocking (removing the backbone with poultry shears and pressing the bird flat) allows a whole 4.5 lb roaster to cook in just 45 minutes with 100% crispy skin.',
            'Simmering roasted chicken back frames with leeks, carrots, and thyme for 24 hours yields rich, gelatinous stock that jiggles like jelly when chilled.',
        ],
    },
    {
        id: 'lamb',
        slug: 'lamb',
        name: 'Pasture Lamb',
        formalTitle: 'The Lamb · Heritage Pasture & French-Cut Anatomy',
        breedNote: 'Domestic Midwest & Colorado Pasture Lamb · 100% All-Natural · Hand-Frenched Racks',
        iconSvg: '/icons/lamb.svg',
        chartSvg: '/assets/identity/cut-charts/cut-chart-lamb.svg',
        downloadName: 'hofherr-cut-chart-lamb.svg',
        svgWidth: 1000,
        svgHeight: 1160,
        primals: [
            {
                name: 'Frenched Rack of Lamb',
                anatomy: 'Upper ribcage along the dorsal spine (8 ribs)',
                signatureCuts: ['8-Rib Hand-Frenched Lamb Rack', 'Double-Cut Lamb Rib Chops', 'Crown Roast of Lamb'],
                profile: 'The crown jewel of fine butcher tables. Silky, mild, grass-fed ribeye muscle flanked by bone scraped immaculately clean.',
                cookingMethod: 'Sear in cast-iron, crust with Dijon mustard, fresh rosemary and panko, and roast to 130°F',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: '"Frenched" means our butchers meticulously scrape every shred of intercostal meat and fat away from the top 2 inches of bone for immaculate presentation.',
            },
            {
                name: 'Loin (Miniature T-Bones)',
                anatomy: 'Lumbar region directly behind the rack before the leg',
                signatureCuts: ['Double Loin Chops ("Mini T-Bones")', 'Boneless Lamb Saddle', 'Lamb Tenderloin Medallions'],
                profile: 'Features the lamb strip loin on one side of the bone and the delicate lamb tenderloin on the other. Delicate, mild, and melt-in-the-mouth.',
                cookingMethod: 'Hot hardwood charcoal grill for 3–4 minutes per side with sea salt and garlic oil',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: 'Lamb loin chops resemble miniature 4-ounce porterhouse steaks. Grill them over searing-hot coals for a caramelized crust while keeping the center tender-red.',
            },
            {
                name: 'Shoulder (Forequarter)',
                anatomy: 'Front shoulder blade and neck',
                signatureCuts: ['Bone-In Shoulder Blade Chops', 'Boneless Rolled Lamb Shoulder', 'Diced Lamb Stew Meat'],
                profile: 'Higher fat content and robust herbal depth. Unsurpassed for Greek, Middle Eastern, and slow-cooked braises.',
                cookingMethod: 'Slow braise in red wine, crushed garlic, and plum tomatoes for 4 hours at 300°F',
                targetTemp: '200°F (Fork-Tender Braise)',
                butcherTip: 'Shoulder holds deeper, sweeter lamb flavor than the rack. When slow-roasted with lemon and oregano, it collapses into succulent shredded meat.',
            },
            {
                name: 'Leg of Lamb (Hindquarter)',
                anatomy: 'Full rear pelvic leg and hip',
                signatureCuts: ['Whole Bone-In Leg of Lamb', 'Butterflied Boneless Leg for the Grill', 'Center-Cut Lamb Steaks'],
                profile: 'Substantial, muscular, clean, lean meat. The historic centerpiece for spring holidays and celebration roasts.',
                cookingMethod: 'Butterflied flat and grilled over hot coals with rosemary and garlic, or slow-roasted whole',
                targetTemp: '135°F (Medium)',
                butcherTip: 'Ask our butcher to "butterfly" the leg of lamb: we remove the hip and femur bones and open the meat flat to a uniform 1.5" thickness for fast, even grilling.',
            },
            {
                name: 'Foreshanks & Breast',
                anatomy: 'Lower legs and lower rib breastplate',
                signatureCuts: ['Slow-Braised Lamb Shanks', 'Lamb Riblets', 'Housemade 80/20 Ground Lamb'],
                profile: 'Massive collagen content in the shanks that melts into velvety sauce; ground lamb makes world-class burgers and gyro kofta.',
                cookingMethod: 'Braise shanks in red wine and mirepoix for 3.5 hours until meat falls from bone',
                targetTemp: '205°F for shanks; 160°F for ground lamb burgers',
                butcherTip: 'Our house ground lamb is blended 80/20 from shoulder and breast trimmings, spiced with cumin, mint, and sea salt for signature counter patties.',
            },
        ],
        butcherWisdom: [
            'True lamb is always under one year of age; this gives the meat a mild, clean, sweet flavor that converts people who previously thought lamb was "gamey".',
            'Lamb fat has a higher melting point than beef or pork fat, which is why lamb must always be served piping hot on pre-warmed plates.',
            'Rosemary, garlic, lemon juice, and Dijon mustard are the four classic culinary partners that highlight the natural grass-fed sweetness of lamb.',
            'Every animal cut in our shop is sourced from local pasture farms with zero hormones, zero antibiotics, and stress-free transport.',
        ],
    },
    {
        id: 'duck',
        slug: 'duck',
        name: 'Specialty Duck',
        formalTitle: 'The Artisan Duck · Waterfowl & Charcuterie Anatomy',
        breedNote: 'Great Lakes & Midwest Pekin / Moulard · Hand-Selected · High-Fat Skin',
        iconSvg: '/icons/duck.svg',
        chartSvg: '/assets/identity/cut-charts/cut-chart-chicken.svg', // Uses poultry anatomical base
        downloadName: 'hofherr-specialty-duck-guide.svg',
        svgWidth: 1000,
        svgHeight: 1160,
        primals: [
            {
                name: 'Magret Breast',
                anatomy: 'Dense pectoral flight muscle with thick white fat layer',
                signatureCuts: ['Scored Boneless Duck Breast', 'Smoked Duck Breast Prosciutto'],
                profile: 'Rich, steak-like red meat with a deep burgundy hue and a thick protective blanket of sweet duck fat.',
                cookingMethod: 'Start in a cold dry cast-iron pan skin-side down; render fat for 12 minutes until skin is thin and crisp like glass, flip for 2 minutes to medium',
                targetTemp: '135°F (Medium with rosy pink center)',
                butcherTip: 'Score the duck skin in a fine 1/4" diamond crosshatch pattern without cutting into the red meat underneath. This allows the fat to render cleanly without curling.',
            },
            {
                name: 'Leg & Thigh (Confit)',
                anatomy: 'Whole leg quarter',
                signatureCuts: ['Whole Duck Legs', 'Slow-Simmered Duck Confit', 'Duck Rillettes Spread'],
                profile: 'Tough and sinewy if quick-cooked, but becomes tender and luxurious when cured in herbs and cooked submerged in pure rendered duck fat.',
                cookingMethod: 'Salt-cured 24 hours with thyme and garlic, then submerged in duck fat at 225°F for 3 hours',
                targetTemp: '200°F (Fall-Off-The-Bone)',
                butcherTip: 'After confit cooking, chill the legs in their fat. When ready to serve, roast in a hot oven for 15 minutes for shatteringly crisp skin and meltingly soft meat.',
            },
            {
                name: 'Rendered Duck Fat & Glace',
                anatomy: 'Subcutaneous fat cap and carcass frame',
                signatureCuts: ['100% Pure Rendered Duck Fat (Frozen Quarts)', 'Duck Stock & Demi-Glace Frame'],
                profile: 'Known as liquid culinary gold. High smoke point with unmatched savory depth for roast potatoes, seared steaks, and pastry crusts.',
                cookingMethod: 'Sautéing, confiting, and roasting potatoes',
                targetTemp: '375°F smoke point',
                butcherTip: 'Roasting Yukon Gold potatoes in hot duck fat with rosemary and sea salt produces the crispiest, crunchiest roast potatoes on earth.',
            },
        ],
        butcherWisdom: [
            'Unlike chicken or turkey, duck breast is red meat, not white meat, and should always be served medium-rare to medium (135°F) with a rosy center.',
            'Duck fat is high in monounsaturated fats (similar to olive oil), making it one of the healthiest and most delicious animal cooking fats.',
            'Duck skin holds 70% of the bird\'s total fat; rendering it slowly in a cold pan produces two cups of liquid cooking fat per pair of breasts.',
            'Our butchery cures whole duck breasts with sea salt and cracked coriander, hanging them in our vault for 30 days to make sliced duck prosciutto.',
        ],
    },
];

export default function WholeAnimalCutCharts() {
    const [selectedAnimalId, setSelectedAnimalId] = useState<string>('beef');
    const [selectedPrimalIndex, setSelectedPrimalIndex] = useState<number>(0);
    const [displayMode, setDisplayMode] = useState<'poster' | 'cuts'>('poster');

    const activeAnimal = ANIMAL_CUT_DATA.find((a) => a.id === selectedAnimalId) || ANIMAL_CUT_DATA[0];
    const activePrimal = activeAnimal.primals[selectedPrimalIndex] || activeAnimal.primals[0];

    return (
        <section id="cut-charts" aria-labelledby="cut-charts-heading" className="section">
            <div id="cuts" />
            <div className={`container ${styles.sectionStack}`}>
                {/* ── Section Header ── */}
                <div className={styles.sectionHeader}>
                    <h2 id="cut-charts-heading" className={styles.sectionTitle}>
                        Whole-Animal Primal Cut Charts &amp; Anatomies
                    </h2>
                    <p className={styles.sectionDesc}>
                        Authentic vintage butcher engravings illustrating where every primal and retail cut originates
                        on cattle, heritage hogs, pasture poultry, lamb, and specialty waterfowl. Features negative-space
                        anatomical dividing lines, culinary profiles, target temperatures, and scalable <code>.SVG</code> print masters.
                    </p>
                </div>

                {/* ── Animal Selector Tabs ── */}
                <div className={styles.animalTabs} role="tablist" aria-label="Select Animal Anatomy">
                    {ANIMAL_CUT_DATA.map((animal) => {
                        const isActive = animal.id === selectedAnimalId;
                        return (
                            <button
                                key={animal.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`cut-chart-panel-${animal.id}`}
                                className={`${styles.animalTabBtn} ${isActive ? styles.animalTabBtnActive : ''}`}
                                onClick={() => {
                                    setSelectedAnimalId(animal.id);
                                    setSelectedPrimalIndex(0);
                                }}
                            >
                                <img
                                    src={animal.iconSvg}
                                    alt=""
                                    aria-hidden="true"
                                    className={styles.animalTabIcon}
                                />
                                <span className={styles.animalTabName}>{animal.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Active Animal Card & Stage ── */}
                <div id={`cut-chart-panel-${activeAnimal.id}`} className={styles.chartPanel} role="tabpanel">
                    <div className={styles.panelTopBar}>
                        <div className={styles.panelTitleBlock}>
                            <h3 className={styles.panelAnimalTitle}>{activeAnimal.formalTitle}</h3>
                            <p className={styles.panelBreedNote}>{activeAnimal.breedNote}</p>
                        </div>
                        <div className={styles.panelActions}>
                            <div className={styles.viewModeToggle} role="group" aria-label="View Mode">
                                <button
                                    type="button"
                                    className={`${styles.toggleBtn} ${displayMode === 'poster' ? styles.toggleBtnActive : ''}`}
                                    onClick={() => setDisplayMode('poster')}
                                    aria-pressed={displayMode === 'poster'}
                                >
                                    Full Woodcut Poster (.SVG)
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toggleBtn} ${displayMode === 'cuts' ? styles.toggleBtnActive : ''}`}
                                    onClick={() => setDisplayMode('cuts')}
                                    aria-pressed={displayMode === 'cuts'}
                                >
                                    Interactive Primal Explorer
                                </button>
                            </div>
                            <a
                                href={activeAnimal.chartSvg}
                                download={activeAnimal.downloadName}
                                className={styles.downloadSvgBtn}
                            >
                                ↓ Download Vector Master (.SVG)
                            </a>
                            <Link
                                href={`/product-identity/print?sheet=${activeAnimal.slug}-chart&autoprint=1`}
                                className={styles.printPosterBtn}
                            >
                                🖨 Print 1:1 Press Sheet
                            </Link>
                        </div>
                    </div>

                    {/* ── Visual Stage ── */}
                    <div className={styles.stageGrid}>
                        {/* ── Left: SVG Poster Stage ── */}
                        <div className={styles.posterStageWrap}>
                            <div className={styles.posterCanvas}>
                                <img
                                    src={activeAnimal.chartSvg}
                                    alt={`${activeAnimal.name} Butcher Cut Chart showing all primal cuts and divisions`}
                                    className={styles.chartImage}
                                />
                            </div>
                            <div className={styles.posterFooter}>
                                <span className={styles.posterMetaTag}>100% PURE VECTOR BÉZIER CURVES</span>
                                <span className={styles.posterMetaDetail}>
                                    Vintage Parchment (#F3EAD8) · Oxblood Crimson (#6B070B) · Smokehouse Amber (#F59B1A)
                                </span>
                            </div>
                        </div>

                        {/* ── Right: Primal Cut Explorer & Details ── */}
                        <div className={styles.primalExplorerCol}>
                            <div className={styles.primalExplorerHeader}>
                                <h4 className={styles.primalExplorerHeading}>
                                    Primal Cuts &amp; Butcher Breakdown
                                </h4>
                                <span className={styles.primalCountBadge}>
                                    {activeAnimal.primals.length} Primals Cataloged
                                </span>
                            </div>

                            {/* Primal Tabs / Pills */}
                            <div className={styles.primalPills}>
                                {activeAnimal.primals.map((primal, idx) => {
                                    const isSelected = idx === selectedPrimalIndex;
                                    return (
                                        <button
                                            key={primal.name}
                                            type="button"
                                            className={`${styles.primalPill} ${isSelected ? styles.primalPillActive : ''}`}
                                            onClick={() => setSelectedPrimalIndex(idx)}
                                            aria-pressed={isSelected}
                                        >
                                            {primal.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active Primal Detail Card */}
                            <div className={styles.primalDetailCard}>
                                <div className={styles.primalCardHead}>
                                    <span className={styles.primalAnatomyTag}>{activePrimal.anatomy}</span>
                                    <h5 className={styles.primalTitle}>{activePrimal.name} Primal</h5>
                                </div>

                                <div className={styles.primalDataGroup}>
                                    <span className={styles.dataLabel}>Signature Counter Cuts</span>
                                    <div className={styles.cutChips}>
                                        {activePrimal.signatureCuts.map((cut) => (
                                            <span key={cut} className={styles.cutChip}>
                                                {cut}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.primalDataGroup}>
                                    <span className={styles.dataLabel}>Texture &amp; Culinary Profile</span>
                                    <p className={styles.profileText}>{activePrimal.profile}</p>
                                </div>

                                <div className={styles.cookingRow}>
                                    <div className={styles.cookingCol}>
                                        <span className={styles.dataLabel}>Recommended Cooking</span>
                                        <span className={styles.cookingVal}>{activePrimal.cookingMethod}</span>
                                    </div>
                                    {activePrimal.targetTemp && (
                                        <div className={styles.cookingCol}>
                                            <span className={styles.dataLabel}>Target Temperature</span>
                                            <span className={styles.tempVal}>{activePrimal.targetTemp}</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.butcherTipBox}>
                                    <span className={styles.tipIcon} aria-hidden="true">💡</span>
                                    <div className={styles.tipBody}>
                                        <span className={styles.tipLabel}>Butcher&apos;s Pro Tip</span>
                                        <p className={styles.tipText}>{activePrimal.butcherTip}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Butcher Wisdom / Facts Accordion/List */}
                            <div className={styles.wisdomCard}>
                                <h5 className={styles.wisdomHeading}>Whole-Animal Butcher&apos;s Wisdom</h5>
                                <ul className={styles.wisdomList}>
                                    {activeAnimal.butcherWisdom.map((fact, fIdx) => (
                                        <li key={fIdx} className={styles.wisdomItem}>
                                            <span className={styles.bulletDot} aria-hidden="true">•</span>
                                            <span className={styles.wisdomText}>{fact}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
