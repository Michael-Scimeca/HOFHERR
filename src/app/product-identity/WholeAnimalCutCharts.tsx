'use client';

import React, { useState } from 'react';
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
    chartImg: string;
    chartSvg: string;
    downloadJpgName: string;
    downloadName: string;
    svgWidth: number;
    svgHeight: number;
    illustratedCuts: string[];
    primals: PrimalCut[];
    butcherWisdom: string[];
};

export const ANIMAL_CUT_DATA: AnimalCutData[] = [
    {
        id: 'beef',
        slug: 'beef',
        name: 'Midwest Beef',
        formalTitle: 'Butcher’s Guide to Cuts · Midwest Beef',
        breedNote: 'USDA Prime & Choice · Midwest Family Farms · Grain-Finished & 100% Grass-Fed',
        iconSvg: '/icons/cow.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-beef.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-beef.svg',
        downloadJpgName: 'hofherr-butcher-guide-beef.jpg',
        downloadName: 'hofherr-butcher-guide-beef.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Ribeye Steak',
            'T-Bone Steak',
            'Porterhouse Steak',
            'Round Roast',
            'Flank',
            'Chuck Flat',
            'Roast',
            'Sirloin',
        ],
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
                signatureCuts: ['New York Strip', 'Porterhouse Steak', 'T-Bone Steak', 'Filet Mignon (Tenderloin)', 'Chateaubriand'],
                profile: 'Supreme tender muscle with minimal connective tissue. A Porterhouse features a full tenderloin medallion at least 1.25" thick alongside the NY strip.',
                cookingMethod: 'Screaming-hot cast-iron pan or direct wood fire with butter basting',
                targetTemp: '125°F–130°F (Rare to Medium-Rare)',
                butcherTip: 'The tenderloin does virtually zero mechanical work on the animal, which is why it yields the butter-soft texture of Filet Mignon.',
            },
            {
                name: 'Chuck',
                anatomy: 'Front shoulder and neck complex (ribs 1–5)',
                signatureCuts: ['Chuck Flat', 'Bone-In Chuck Roast', 'Denver Steak', 'Flat Iron', '80/20 Ground Chuck'],
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
                signatureCuts: ['Flank Steak', 'Inside Skirt Steak', 'Outside Skirt (Carne Asada)', 'English-Cut Short Ribs'],
                profile: 'Long, open grain fibers that hold marinades deeper than any other cut. Outstanding mineral finish when seared charred on the outside.',
                cookingMethod: 'Screaming-hot grill for 2–3 minutes per side; braise for short ribs',
                targetTemp: '130°F (Must slice strictly perpendicular to grain)',
                butcherTip: 'Always slice skirt and flank steak across the grain at a 45° angle. Cutting parallel makes it chewy; cutting across makes it melt-in-your-mouth.',
            },
            {
                name: 'Round & Shank',
                anatomy: 'Rear hind leg (Round) and lower fore/hind shanks',
                signatureCuts: ['Round Roast', 'Top Round (Chicago Italian Beef)', 'Eye of Round', 'Cross-Cut Osso Buco Shank'],
                profile: 'Very lean, hard-working muscles with high gelatin in shanks and uniform grain in round cuts.',
                cookingMethod: 'Slow wet braising for shanks; slow roasting and deli-shaving for round',
                targetTemp: '135°F for rare roast beef; 205°F for braised shanks',
                butcherTip: 'Our butcher-shop Italian beef is slow-roasted whole from Midwest top round, seasoned with garlic, oregano, and sweet peppers, then micro-shaved thin.',
            },
        ],
        butcherWisdom: [
            'A ribeye comes from ribs 6 through 12 — the exact same anatomical section as a standing prime rib roast.',
            'Every Porterhouse is a T-bone, but only T-bones with a tenderloin section measuring at least 1.25 inches across earn the Porterhouse name.',
            'Hanger steak is traditionally called "the butcher’s steak" because there is only one per carcass, hanging from the diaphragm.',
            'Dry-aging in our humidity-controlled vault for 30–45 days evaporates 15% moisture, concentrating beefy umami and naturally tenderizing the fibers.',
        ],
    },
    {
        id: 'pork',
        slug: 'pork',
        name: 'Heritage Pork',
        formalTitle: 'Butcher’s Guide to Cuts · Heritage Pork',
        breedNote: '100% Purebred Berkshire & Duroc · Pasture-Raised · Uncured All-Natural Whole Hogs',
        iconSvg: '/icons/pig.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-pork.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-pork.svg',
        downloadJpgName: 'hofherr-butcher-guide-pork.jpg',
        downloadName: 'hofherr-butcher-guide-pork.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Pork Shoulder',
            'Pork Chop',
            'Tenderloin',
            'Fresh Ham',
            'Pork Belly',
            'Spare Ribs',
            'Ham Hock',
            'Pork Jowl',
        ],
        primals: [
            {
                name: 'Boston Butt (Upper Shoulder)',
                anatomy: 'Upper portion of the front shoulder above the picnic',
                signatureCuts: ['Pork Shoulder Roast', 'Bone-In Boston Butt', 'Coppa Steak', 'Artisan Country Ribs'],
                profile: 'Intensely marbled with deep ruby-red meat, high intramuscular fat, and rich collagen. Holds the best fat-to-lean ratio on the hog.',
                cookingMethod: 'Smoked low and slow over applewood and hickory coals at 225°F for pulled pork',
                targetTemp: '200°F–205°F (Bone pulls clean with two fingers)',
                butcherTip: 'Despite the name, the Boston Butt has nothing to do with the rear of the pig; it was named after colonial wooden barrels ("butts") used to ship shoulder cuts.',
            },
            {
                name: 'Loin & Tenderloin',
                anatomy: 'Runs along the spine from shoulder to hip',
                signatureCuts: ['Thick-Cut Bone-In Pork Chop', 'Whole Pork Tenderloin', 'Baby Back Ribs', 'Crown Roast of Pork'],
                profile: 'The most tender, mild, and delicate primal on the pig. Heritage Berkshire pork yields dark pinkish-red loin with snow-white marbling.',
                cookingMethod: 'Sear in cast-iron and baste with butter, thyme, and garlic to 145°F',
                targetTemp: '145°F + 3-minute rest (slight blush pink is juicy & safe)',
                butcherTip: 'Overcooking pork chops to 165°F dries out the lean loin. Modern heritage pork is safely enjoyed at 145°F with a juicy rosy interior.',
            },
            {
                name: 'Belly & Spare Ribs',
                anatomy: 'Underside of the pig between front and hind legs',
                signatureCuts: ['Fresh Skin-On Pork Belly', 'St. Louis Spare Ribs', 'House Applewood Smoked Bacon', 'Italian Porchetta'],
                profile: 'Alternating ribbons of succulent pork fat and savory muscle. The cornerstone of cured meats and crackling roasts.',
                cookingMethod: 'Cured and cold-smoked for bacon, or smoked 3-2-1 at 225°F for spare ribs',
                targetTemp: '200°F for smoked ribs; 150°F for bacon before chilling and slicing',
                butcherTip: 'Our house bacon is dry-cured for seven full days with brown sugar, sea salt, and cracked peppercorns before 12 hours of cool applewood smoke.',
            },
            {
                name: 'Fresh Ham (Hind Leg)',
                anatomy: 'Upper hind leg and pelvic round',
                signatureCuts: ['Fresh Green Ham Roast', 'Heritage Bone-In Smoked Ham', 'Country Dry-Cured Ham'],
                profile: 'Massive single muscle group with low fat and gentle sweetness. Ideal for holiday table centerpieces and dry-cured charcuterie.',
                cookingMethod: 'Slow smoked over fruitwood with brown sugar and bourbon glaze, or roasted fresh',
                targetTemp: '140°F (Reheat smoked ham) or 150°F (Fresh ham roast)',
                butcherTip: 'Bone-in hams stay vastly juicier than boneless hams because the marrow bone conducts heat evenly through the core of the roast.',
            },
            {
                name: 'Pork Jowl & Ham Hocks',
                anatomy: 'Lower cheek (Jowl) and lower leg joints (Hocks)',
                signatureCuts: ['Pork Jowl (Guanciale)', 'Smoked Ham Hocks', 'Braising Trotters'],
                profile: 'Pure silky fat in the cheek; concentrated collagen and dense tendon around the bone in the hocks.',
                cookingMethod: 'Rendered crisp for classic Carbonara, or simmered 4–6 hours in beans, greens, or split pea soup',
                targetTemp: 'Simmer until fork-tender',
                butcherTip: 'Guanciale made from pork jowl holds a higher melting point and deeper flavor than pancetta, giving authentic pasta carbonara its velvety gloss.',
            },
        ],
        butcherWisdom: [
            'Berkshire pork is known in Japan as "Kurobuta" due to its ruby coloring and intense marbling that rivals wagyu beef.',
            'Baby back ribs are cut from the high loin near the spine, while spare ribs come from lower down adjacent to the pork belly.',
            'Pork tenderloin is an isolated muscle inside the loin cavity — the leanest and most tender cut on the hog.',
            'Whole-hog barbecue cooks the entire heritage hog over split white oak logs for unrivaled depth across shoulder, loin, and belly.',
        ],
    },
    {
        id: 'chicken',
        slug: 'chicken',
        name: 'Pasture Poultry',
        formalTitle: 'Butcher’s Guide to Cuts · Pasture Chicken',
        breedNote: 'Midwest Pasture Farms · 100% Air-Chilled · Hand-Trimmed Daily',
        iconSvg: '/icons/chicken.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-chicken.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-chicken.svg',
        downloadJpgName: 'hofherr-butcher-guide-chicken.jpg',
        downloadName: 'hofherr-butcher-guide-chicken.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Chicken Breast',
            'Split Chicken',
            'Chicken Thigh',
            'Drumstick',
            'Chicken Wings',
            'Chicken Back',
            'Chicken Feet',
        ],
        primals: [
            {
                name: 'Air-Chilled Breast & Split Bird',
                anatomy: 'Front chest pectoral muscle complex & halved whole bird',
                signatureCuts: ['Chicken Breast', 'Split Chicken (Spatchcock Half)', 'Airline Breast with Wing Drumette'],
                profile: 'Lean, clean, protein-rich white meat. 100% air-chilled processing means zero added water weight, ensuring crisp skin and pure poultry flavor.',
                cookingMethod: 'Sear in cast iron with butter or roast split halves over hardwood coals at 400°F',
                targetTemp: '165°F (Pull at 160°F and carryover rest 5 minutes)',
                butcherTip: 'Supermarket chicken chilled in ice-water baths absorbs up to 12% water that steams in the pan. Air-chilled pasture birds sear golden brown immediately.',
            },
            {
                name: 'Chicken Thigh (Dark Meat)',
                anatomy: 'Upper leg joint connected directly to the pelvis',
                signatureCuts: ['Bone-In Skin-On Chicken Thigh', 'Boneless Skinless Thighs', 'Crispy Cast-Iron Thigh Cutlets'],
                profile: 'Packed with rich myoglobin, collagen, and dark meat sweetness. Highly resilient to heat and nearly impossible to dry out.',
                cookingMethod: 'Hard skin-side sear in cast-iron, oven braise, or smoke at 275°F',
                targetTemp: '175°F–185°F (Collagen melts into pure juice above 175°F)',
                butcherTip: 'While chicken breast dries out past 165°F, chicken thighs peak in tenderness between 175°F and 185°F.',
            },
            {
                name: 'Drumstick & 3-Part Wings',
                anatomy: 'Lower leg (Drumstick) and forelimb (Drumette, Flat & Tip)',
                signatureCuts: ['Whole Drumstick', 'Jumbo 3-Part Chicken Wings', 'Smoked Party Wings'],
                profile: 'Highest skin-to-meat ratio on the bird, rendering into brittle, crunchy skin with juicy meat on the bone.',
                cookingMethod: 'Smoked at 250°F then flash-crisped at 425°F, or buttermilk fried',
                targetTemp: '175°F–180°F',
                butcherTip: 'Cut cleanly around the drumstick ankle tendon and push the meat upward for an even, competition-style barbecue lollipop drum.',
            },
            {
                name: 'Chicken Back & Feet (Stock Gold)',
                anatomy: 'Dorsal rib/spine frame, oysters, and collagen-rich feet',
                signatureCuts: ['Chicken Back Broth Frame', 'Collagen Chicken Feet', 'Butcher’s Oysters'],
                profile: 'Loaded with natural cartilage, marrow, and gelatin that give house-simmered stock a rich, velvety body.',
                cookingMethod: 'Roast golden at 400°F with mirepoix, then simmer gently 12–24 hours for liquid-gold bone broth',
                targetTemp: 'Gentle bare simmer (195°F–205°F)',
                butcherTip: 'Adding just four blanched chicken feet to a pot of chicken backs doubles the natural gelatin so your chilled stock sets like culinary jelly.',
            },
        ],
        butcherWisdom: [
            'Pasture-raised birds forage on green Midwest clover and grass, giving the skin and fat a natural golden hue.',
            'Never rinse raw poultry in the sink — pat dry thoroughly with paper towels before salting for blistered, crackling skin.',
            'Spatchcocking or splitting a whole chicken lets white breast meat and dark leg quarters finish at the exact same moment.',
            'Flip a roasted chicken over to find two silver-dollar "oysters" tucked in the lower spine hollows — the chef’s prized bite.',
        ],
    },
    {
        id: 'lamb',
        slug: 'lamb',
        name: 'Pasture Lamb',
        formalTitle: 'Butcher’s Guide to Cuts · Pasture Lamb',
        breedNote: 'Domestic Midwest & Colorado Pasture Lamb · 100% All-Natural · Hand-Frenched Racks',
        iconSvg: '/icons/lamb.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-lamb.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-lamb.svg',
        downloadJpgName: 'hofherr-butcher-guide-lamb.jpg',
        downloadName: 'hofherr-butcher-guide-lamb.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Shoulder Roast',
            'Rack of Lamb',
            'Loin Chops',
            'Leg of Lamb',
            'Lamb Ribs',
            'Lamb Shank',
        ],
        primals: [
            {
                name: 'Rack of Lamb',
                anatomy: 'Upper ribcage along the dorsal spine (8 ribs)',
                signatureCuts: ['8-Rib Hand-Frenched Rack of Lamb', 'Double-Cut Lamb Rib Chops', 'Crown Roast of Lamb'],
                profile: 'The crown jewel of fine butcher tables. Silky, mild pasture-raised ribeye muscle flanked by rib bones scraped clean by hand.',
                cookingMethod: 'Sear in cast-iron, crust with Dijon mustard, fresh rosemary and garlic crumbs, roast to 130°F',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: '"Frenched" means our butchers scrape every shred of intercostal meat and membrane off the top 2 inches of rib bone for clean presentation.',
            },
            {
                name: 'Loin Chops',
                anatomy: 'Lumbar region directly behind the rack before the leg',
                signatureCuts: ['Double Lamb Loin Chops ("Mini T-Bones")', 'Boneless Lamb Saddle', 'Lamb Tenderloin'],
                profile: 'Features the lamb strip loin on one side of the T-bone and the tenderloin medallion on the other. Mild and melt-in-the-mouth.',
                cookingMethod: 'Hot hardwood charcoal grill for 3–4 minutes per side with flaky sea salt and rosemary oil',
                targetTemp: '130°F (Medium-Rare)',
                butcherTip: 'Lamb loin chops cook just like miniature 4-ounce porterhouse steaks — sear hard over hot coals while keeping the center rosy.',
            },
            {
                name: 'Shoulder Roast',
                anatomy: 'Front shoulder blade and forequarter',
                signatureCuts: ['Boneless Tied Shoulder Roast', 'Bone-In Blade Chops', 'Hand-Cubed Lamb Kebabs'],
                profile: 'Rich marbling and herbal depth that stays succulent across long roasts, braises, and open-fire spits.',
                cookingMethod: 'Slow roast with lemon, garlic, olive oil, and Greek oregano at 300°F for 3.5 hours',
                targetTemp: '195°F–200°F (Pull-Apart Braise) or 135°F (Sliced Roast)',
                butcherTip: 'Lamb shoulder carries richer marbling than the leg, making it forgiving on the smoker or slow-roasted in a Dutch oven.',
            },
            {
                name: 'Leg of Lamb',
                anatomy: 'Full rear pelvic leg and sirloin hip',
                signatureCuts: ['Whole Bone-In Leg of Lamb', 'Butterflied Boneless Leg for the Grill', 'Center-Cut Leg Steaks'],
                profile: 'Clean, lean, celebratory roast centerpiece with sweet pasture finish.',
                cookingMethod: 'Butterflied flat over charcoal coals or roasted whole on the bone with garlic cloves',
                targetTemp: '135°F (Medium-Rare to Medium)',
                butcherTip: 'Ask us to butterfly the leg flat to an even 1.5" thickness so it grills over direct wood fire in under 25 minutes.',
            },
            {
                name: 'Lamb Shank & Lamb Ribs',
                anatomy: 'Lower foreshanks/hindshanks and breastplate ribs',
                signatureCuts: ['Braising Lamb Shank', 'Denver-Style Lamb Ribs', 'House 80/20 Ground Lamb'],
                profile: 'Dense collagen in the shanks melts into glossy jus; lamb ribs crisp like rich, smoky pork belly on the bone.',
                cookingMethod: 'Braise shanks 3.5 hours in red wine; smoke or slow-roast lamb ribs until crisp',
                targetTemp: '203°F–205°F',
                butcherTip: 'Score the fat cap on lamb ribs before seasoning so excess lanolin renders away into shatteringly crisp bark.',
            },
        ],
        butcherWisdom: [
            'Domestic pasture lamb is harvested under one year of age, giving it a mild, sweet flavor completely free of harsh muttony notes.',
            'Lamb fat has a higher melting point than beef fat — always serve lamb chops and roasts piping hot on warmed plates.',
            'Rosemary, garlic, anchovy, lemon zest, and Dijon mustard naturally brighten the richness of pasture-raised lamb.',
            'Every rack and leg at Hofherr is hand-trimmed to order — bone-in, Frenched, or butterflied flat for your grill.',
        ],
    },
    {
        id: 'veal',
        slug: 'veal',
        name: 'Milk-Fed Veal',
        formalTitle: 'Butcher’s Guide to Cuts · Milk-Fed Veal',
        breedNote: 'Humanely Raised Midwest Group-Housed Veal · Delicate Rose-Pink Grain · Classic French & Italian Cuts',
        iconSvg: '/icons/veal.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-veal.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-veal.svg',
        downloadJpgName: 'hofherr-butcher-guide-veal.jpg',
        downloadName: 'hofherr-butcher-guide-veal.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Veal Rib Chop',
            'Veal Loin Chop',
            'Veal Scallopini',
            'Osso Buco Shank',
            'Veal Stew Meat',
            'Veal Bones',
        ],
        primals: [
            {
                name: 'Rib & Loin Chops',
                anatomy: 'Dorsal ribcage and lumbar loin spine',
                signatureCuts: ['Frenched Veal Rib Chop', 'Veal Milanese Bone-In Chop', 'Thick-Cut Veal Loin Chop'],
                profile: 'Velvety, fine-grained rose-pink muscle with delicate milky sweetness and virtually zero tough connective tissue.',
                cookingMethod: 'Pan-roast in clarified butter with sage, or pound thin on the bone for crispy Veal Parmigiana & Milanese',
                targetTemp: '135°F–140°F (Medium-Rare to Medium Blush)',
                butcherTip: 'Ask our butchers to butterfly and pound a bone-in veal rib chop flat while leaving the Frenched rib handle intact for true trattoria Costoletta alla Milanese.',
            },
            {
                name: 'Leg Cutlets (Scallopini)',
                anatomy: 'Top round and sirloin tip of the hind leg',
                signatureCuts: ['Hand-Pounded Veal Scallopini', 'Saltimbocca Cutlets', 'Veal Piccata Medallions'],
                profile: 'Ultra-lean, silky leg muscle sliced across the grain and pounded paper-thin between parchment sheets.',
                cookingMethod: 'Flash-sauté 60–90 seconds per side in butter and olive oil with lemon, capers, or Marsala wine',
                targetTemp: '140°F (Quick Pan Sear)',
                butcherTip: 'Because veal leg has very little intramuscular fat, cook scallopini hot and fast — overcooking by even a minute toughens delicate cutlets.',
            },
            {
                name: 'Osso Buco Shank',
                anatomy: 'Cross-cut center hindshank & foreshank with marrow bone',
                signatureCuts: ['Center-Cut Hindshank Osso Buco', 'Braising Foreshank Cross-Cuts'],
                profile: 'Silky, gelatin-packed shank muscle ringing a prize center bone filled with creamy, savory bone marrow.',
                cookingMethod: 'Tie circumference with butcher twine, sear golden, and braise gently in white wine, stock, and aromatics for 2.5 hours',
                targetTemp: '200°F–205°F (Fork-Tender)',
                butcherTip: 'Loop a piece of kitchen twine around the equator of each Osso Buco round before searing so the tender meat stays hugged around the marrow bone.',
            },
            {
                name: 'Shoulder Stew & Marrow Bones',
                anatomy: 'Forequarter chuck shoulder and knuckle/femur joints',
                signatureCuts: ['Hand-Trimmed Veal Stew Meat (Blanquette)', 'Knuckle Stock Veal Bones', '80/20 Meatball Blend Veal'],
                profile: 'Veal bones hold the highest natural collagen concentration in classic culinary arts — the foundation of French demi-glace.',
                cookingMethod: 'Simmer stew gently for Blanquette de Veau; roast veal bones with tomato paste before 16-hour stock reduction',
                targetTemp: '200°F braise / slow reduction',
                butcherTip: 'Combining equal parts ground beef, heritage pork, and milk-fed veal is the butcher’s secret to tender, cloud-soft Italian Sunday meatballs.',
            },
        ],
        butcherWisdom: [
            '"Osso Buco" literally translates from Italian as "bone with a hole" — referring to the prized marrow channel in the center-cut shank.',
            'Classic French restaurant demi-glace relies on young veal knuckle bones because their uncalcified cartilage melts into pure natural glace.',
            'Always serve Milanese Osso Buco with bright lemon-garlic-parsley gremolata to cut through the richness of the marrow.',
            'Freshly ground milk-fed veal gives gourmet meatloaf and bolognese ragù an unmistakably delicate, silky texture.',
        ],
    },
    {
        id: 'turkey',
        slug: 'turkey',
        name: 'Pasture Turkey',
        formalTitle: 'Butcher’s Guide to Cuts · Pasture Turkey',
        breedNote: 'Ferndale Market Free-Range Midwest Turkeys · Antibiotic-Free · Fresh Never Frozen & House-Smoked',
        iconSvg: '/icons/turkey.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-turkey.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-turkey.svg',
        downloadJpgName: 'hofherr-butcher-guide-turkey.jpg',
        downloadName: 'hofherr-butcher-guide-turkey.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Turkey Breast',
            'Whole Turkey',
            'Turkey Thigh',
            'Smoked Turkey',
            'Turkey Leg',
            'Turkey Wings',
        ],
        primals: [
            {
                name: 'Whole Pasture Bird & Crown Breast',
                anatomy: 'Whole free-range roaster & bone-in / boneless pectoral crown',
                signatureCuts: ['Fresh Whole Pasture Turkey', 'Bone-In Hotel-Style Turkey Breast', 'Boneless Rolled Roast Breast'],
                profile: 'Broad, juicy white meat with crisp golden skin from open-pasture foraging and air-chilled handling.',
                cookingMethod: 'Dry-brine 48 hours uncovered in fridge with kosher salt and herbs, then roast at 350°F or spatchcock at 425°F',
                targetTemp: '160°F in thickest breast (rises to 165°F during 25-minute rest)',
                butcherTip: 'Pull your turkey from the oven when the deepest part of the breast hits 158°F–160°F; carryover heat brings it safely to 165°F without drying out.',
            },
            {
                name: 'House-Smoked Turkey',
                anatomy: 'Whole bird or boneless breast cured & hardwood-smoked in-house',
                signatureCuts: ['Applewood Smoked Whole Turkey', 'Texas-Style Peppered Smoked Turkey Breast', 'Deli-Sliced Smoked Turkey'],
                profile: 'Sweet brine cure kissed with real fruitwood and post-oak smoke, yielding mahogany bark and drippingly moist white meat.',
                cookingMethod: 'Smoked at 250°F over applewood & oak with butter baste; gently warm whole smoked birds at 300°F wrapped in foil with stock',
                targetTemp: '160°F fresh smoke / 140°F gentle reheat',
                butcherTip: 'Central Texas barbecue pitmasters wrap peppered turkey breast in foil with salted butter at 145°F internal for the final 15 degrees of cooking.',
            },
            {
                name: 'Turkey Thigh, Leg & Wings',
                anatomy: 'Dark-meat hindquarter (Thigh & Drumstick) and jumbo 3-joint Wings',
                signatureCuts: ['Bone-In Turkey Thigh', 'Smoked Festival Turkey Leg', 'Jumbo Gravy Turkey Wings'],
                profile: 'Rich, deeply savory dark meat packed with myoglobin and natural gelatin.',
                cookingMethod: 'Braise thighs and legs at 325°F, smoke drumsticks over hickory, or roast wings dark brown to build holiday pan gravy',
                targetTemp: '175°F–185°F for melt-in-the-mouth dark meat',
                butcherTip: 'Buy an extra pair of jumbo turkey wings ahead of Thanksgiving — roasting them deeply browned lets you make rich, stress-free turkey gravy two days early.',
            },
        ],
        butcherWisdom: [
            'Dry-brining (salting under and over the skin 2 days early) seasons the meat to the bone without waterlogging the skin like wet brines.',
            'Separating the dark leg quarters from the white breast crown lets you pull the breast at 160°F while taking thighs to a silky 180°F.',
            'Rest a whole roasted turkey for a full 30 minutes tented loosely before carving — carving hot drains cups of juice onto the board.',
            'Ferndale Market turkeys roam open Minnesota pastures without antibiotics or growth promotants since 1939.',
        ],
    },
    {
        id: 'duck',
        slug: 'duck',
        name: 'Specialty Duck',
        formalTitle: 'Butcher’s Guide to Cuts · Specialty Duck',
        breedNote: 'Great Lakes & Midwest Pekin / Moulard · Hand-Selected · High-Fat Crispy Skin & Charcuterie',
        iconSvg: '/icons/duck.svg',
        chartImg: '/assets/identity/cut-charts/flint-flame-butcher-guide-duck.jpg',
        chartSvg: '/assets/identity/vector/flint-flame-butcher-guide-duck.svg',
        downloadJpgName: 'hofherr-butcher-guide-duck.jpg',
        downloadName: 'hofherr-butcher-guide-duck.svg',
        svgWidth: 1200,
        svgHeight: 896,
        illustratedCuts: [
            'Duck Breast',
            'Whole Duck',
            'Duck Legs',
            'Duck Confit',
            'Smoked Duck',
            'Duck Rillettes',
            'Duck Fat',
            'Duck Stock',
        ],
        primals: [
            {
                name: 'Magret Duck Breast & Whole Duck',
                anatomy: 'Dense pectoral flight muscle with thick white fat cap & whole Pekin roaster',
                signatureCuts: ['Scored Boneless Duck Breast', 'Whole Roasting Duck', 'House-Smoked Duck Breast'],
                profile: 'Rich, steak-like red meat with a deep burgundy hue and a thick protective blanket of sweet duck fat.',
                cookingMethod: 'Start duck breast skin-side down in a cold dry cast-iron pan; render 10–12 minutes until glass-crisp, flip 2 minutes to medium-rare',
                targetTemp: '130°F–135°F (Medium-Rare to Medium rosy center)',
                butcherTip: 'Score duck skin in a tight 1/4" diamond crosshatch without nicking the red meat underneath so fat renders cleanly and skin crisps flat.',
            },
            {
                name: 'Duck Legs, Confit & Rillettes',
                anatomy: 'Whole leg & thigh quarter cured and slow-poached in fat',
                signatureCuts: ['Fresh Duck Legs', 'Slow-Poached Duck Confit', 'Whipped Duck Rillettes'],
                profile: 'Hard-working leg muscles transform into silk when cured overnight with sea salt, garlic, and thyme then submerged in warm duck fat.',
                cookingMethod: 'Submerge salt-cured legs in pure duck fat at 225°F for 3 hours, then crisp skin in a 425°F oven before serving',
                targetTemp: '200°F (Fall-Off-The-Bone)',
                butcherTip: 'Shred warm confit leg meat with a fork and fold in warm rendered duck fat and black pepper to pot classic French duck rillettes.',
            },
            {
                name: 'Rendered Duck Fat & Duck Stock',
                anatomy: 'Subcutaneous fat trimmings and roasted waterfowl carcass frame',
                signatureCuts: ['Pure Rendered Duck Fat', 'Roasted Duck Stock & Glace'],
                profile: 'Known as liquid culinary gold. High 375°F smoke point with unmatched savory richness for potatoes, pastry, and pan sauces.',
                cookingMethod: 'Toss par-boiled potatoes in hot duck fat at 425°F; reduce roasted duck stock with orange peel or tart cherries for pan jus',
                targetTemp: '375°F smoke point',
                butcherTip: 'Strain and jar every spoonful of fat rendered in the skillet from two duck breasts — it keeps for months refrigerated for crispy roast potatoes.',
            },
        ],
        butcherWisdom: [
            'Unlike chicken or turkey, duck breast is anatomically red meat and shines at a steak-like 135°F medium-rare.',
            'Pricking whole duck skin gently with a paring knife tip (without piercing the meat) lets subcutaneous fat baste and crisp the bird.',
            'Duck fat is rich in heart-friendly monounsaturated oleic acid — prized by French bistros in place of butter or oil.',
            'Roasted duck frames simmered with aromatics create dark, velvety stock ideal for cassoulet, gumbo, and cherry-port reductions.',
        ],
    },
];

export default function WholeAnimalCutCharts() {
    const [selectedAnimalId, setSelectedAnimalId] = useState<string>('beef');
    const [selectedPrimalIndex, setSelectedPrimalIndex] = useState<number>(0);
    const [displayMode, setDisplayMode] = useState<'explorer' | 'grid'>('explorer');

    const activeAnimal = ANIMAL_CUT_DATA.find((a) => a.id === selectedAnimalId) || ANIMAL_CUT_DATA[0];
    const activePrimal = activeAnimal.primals[selectedPrimalIndex] || activeAnimal.primals[0];

    const handleSelectAnimal = (animalId: string) => {
        setSelectedAnimalId(animalId);
        setSelectedPrimalIndex(0);
    };

    return (
        <section id="cut-charts" aria-labelledby="cut-charts-heading" className="section">
            <div id="cuts" />
            <div className={`container ${styles.sectionStack}`}>
                {/* ── Section Header ── */}
                <div className={styles.sectionHeader}>
                    <h2 id="cut-charts-heading" className={styles.sectionTitle}>
                        Whole-Animal Butcher&apos;s Guides to Cuts (All 7 Meat Products)
                    </h2>
                    <p className={styles.sectionDesc}>
                        Illustrated Flint &amp; Flame butcher charts displaying every signature counter cut alongside its exact
                        anatomical primal section across all seven Hofherr meat departments — Midwest Beef, Heritage Pork,
                        Pasture Poultry, Pasture Lamb, Milk-Fed Veal, Pasture Turkey, and Specialty Duck — with print-ready{' '}
                        <code>.JPG</code> posters and scalable <code>.SVG</code> masters.
                    </p>
                </div>

                {/* ── 7-Animal Selector Tabs ── */}
                <div className={styles.animalTabs} role="tablist" aria-label="Select Meat Guide">
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
                                onClick={() => handleSelectAnimal(animal.id)}
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
                                    className={`${styles.toggleBtn} ${displayMode === 'explorer' ? styles.toggleBtnActive : ''}`}
                                    onClick={() => setDisplayMode('explorer')}
                                    aria-pressed={displayMode === 'explorer'}
                                >
                                    Active Cut Guide + Explorer
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toggleBtn} ${displayMode === 'grid' ? styles.toggleBtnActive : ''}`}
                                    onClick={() => setDisplayMode('grid')}
                                    aria-pressed={displayMode === 'grid'}
                                >
                                    All 7 Meat Guides First
                                </button>
                            </div>
                            <a
                                href={activeAnimal.chartImg}
                                download={activeAnimal.downloadJpgName}
                                className={styles.downloadJpgBtn}
                            >
                                ↓ Download Print Chart (.JPG)
                            </a>
                            <a
                                href={activeAnimal.chartSvg}
                                download={activeAnimal.downloadName}
                                className={styles.downloadSvgBtn}
                            >
                                ↓ Download Vector (.SVG)
                            </a>
                        </div>
                    </div>

                    {displayMode === 'explorer' && (
                        <div className={styles.stageGrid}>
                            {/* ── Left: Illustrated Butcher's Guide Poster Stage ── */}
                            <div className={styles.posterStageWrap}>
                                <div className={styles.posterCanvas}>
                                    <img
                                        src={activeAnimal.chartImg}
                                        alt={`${activeAnimal.name} Butcher's Guide to Cuts showing illustrated meat products: ${activeAnimal.illustratedCuts.join(', ')}`}
                                        width={activeAnimal.svgWidth}
                                        height={activeAnimal.svgHeight}
                                        className={styles.chartImage}
                                    />
                                </div>
                                <div className={styles.illustratedCutsBox}>
                                    <span className={styles.illustratedCutsLabel}>
                                        Illustrated Meat Products on This Chart ({activeAnimal.illustratedCuts.length})
                                    </span>
                                    <div className={styles.illustratedCutList}>
                                        {activeAnimal.illustratedCuts.map((cutName) => (
                                            <span key={cutName} className={styles.illustratedCutTag}>
                                                {cutName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.posterFooter}>
                                    <span className={styles.posterMetaTag}>FLINT &amp; FLAME ILLUSTRATED CUT GUIDE</span>
                                    <span className={styles.posterMetaDetail}>
                                        Butcher Counter Cream (#F3EAD8) · Oxblood Crimson (#8B0A10) · Smokehouse Amber (#F59B1A)
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

                                {/* Butcher Wisdom / Facts List */}
                                <div className={styles.wisdomCard}>
                                    <h5 className={styles.wisdomHeading}>Whole-Animal Butcher&apos;s Wisdom</h5>
                                    <ul className={styles.wisdomList}>
                                        {activeAnimal.butcherWisdom.map((fact) => (
                                            <li key={fact} className={styles.wisdomItem}>
                                                <span className={styles.bulletDot} aria-hidden="true">•</span>
                                                <span className={styles.wisdomText}>{fact}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Complete 7-Animal Illustrated Butcher's Guides Gallery ── */}
                <div className={styles.allGuidesBlock}>
                    <div className={styles.allGuidesHead}>
                        <h3 className={styles.allGuidesTitle}>
                            Complete Butcher&apos;s Guide Collection — All 7 Meat Products
                        </h3>
                        <span className={styles.allGuidesSub}>
                            Click any chart to inspect its primals, cooking temps &amp; downloads above
                        </span>
                    </div>
                    <div className={styles.allGuidesGrid}>
                        {ANIMAL_CUT_DATA.map((animal) => {
                            const isCurrent = animal.id === selectedAnimalId;
                            return (
                                <button
                                    key={animal.id}
                                    type="button"
                                    className={`${styles.guideCard} ${isCurrent ? styles.guideCardActive : ''}`}
                                    onClick={() => {
                                        handleSelectAnimal(animal.id);
                                        setDisplayMode('explorer');
                                    }}
                                    aria-pressed={isCurrent}
                                >
                                    <div className={styles.guideThumbWrap}>
                                        <img
                                            src={animal.chartImg}
                                            alt={`${animal.name} Butcher's Guide to Cuts`}
                                            width={animal.svgWidth}
                                            height={animal.svgHeight}
                                            loading="lazy"
                                            className={styles.guideThumbImg}
                                        />
                                    </div>
                                    <div className={styles.guideCardMeta}>
                                        <div className={styles.guideCardTitleWrap}>
                                            <img
                                                src={animal.iconSvg}
                                                alt=""
                                                aria-hidden="true"
                                                className={styles.guideCardIcon}
                                            />
                                            <h4 className={styles.guideCardTitle}>{animal.name}</h4>
                                        </div>
                                        <span className={styles.guideCardCount}>
                                            {animal.illustratedCuts.length} Cuts Shown
                                        </span>
                                    </div>
                                    <p className={styles.guideCardCuts}>
                                        {animal.illustratedCuts.join(' · ')}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
