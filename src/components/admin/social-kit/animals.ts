/**
 * "Know your cuts" series — one set per animal across all 7 Hofherr meat products.
 * Uses the Flint & Flame illustrated Butcher's Guide to Cuts charts.
 */

const CHART_STYLE =
    'Flint & Flame illustrated Butcher’s Guide to Cuts poster on warm Butcher Counter Cream (#F3EAD8) stock. ' +
    'Central anatomical animal diagram divided into bold crimson (#8B0A10) primal sections surrounded by full-color illustrated retail meat cuts with leader lines and flame-scroll crest reading "HOFHERR MEAT CO. · BUTCHER’S GUIDE TO CUTS".';

export type Animal = {
    slug: string;
    name: string;
    iconId: string; // FLAME_STICKERS id
    chartSrc: string;
    chartPrompt: string;
    primals: { name: string; where: string; bestFor: string }[];
    facts: string[];
};

export const ANIMALS: Animal[] = [
    {
        slug: 'beef',
        name: 'Beef',
        iconId: 'cow',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-beef.jpg',
        chartPrompt:
            'A steer facing left surrounded by illustrated meat products: RIBEYE STEAK, T-BONE STEAK, PORTERHOUSE STEAK, ROUND ROAST, FLANK, CHUCK FLAT, ROAST, and SIRLOIN with leader lines into HEAD, CHUCK, RIB, SHORT LOIN, SIRLOIN, ROUND, BRISKET, PLATE, FLANK, and SHANK. ' +
            CHART_STYLE,
        primals: [
            { name: 'Chuck', where: 'Shoulder', bestFor: 'Chuck flat, pot roast, braising, burgers' },
            { name: 'Rib', where: 'Ribs 6–12', bestFor: 'Ribeye steak, prime rib roast' },
            { name: 'Short loin', where: 'Behind the ribs', bestFor: 'T-bone, porterhouse, NY strip' },
            { name: 'Sirloin', where: 'Hip', bestFor: 'Top sirloin, tri-tip, picanha' },
            { name: 'Round', where: 'Back leg', bestFor: 'Round roast, Italian beef' },
            { name: 'Brisket · Plate · Flank', where: 'Underside', bestFor: 'Smoked brisket, skirt & flank steak' },
        ],
        facts: [
            'A ribeye comes from ribs six through twelve — the same section as a standing prime rib roast.',
            'The tenderloin is the most tender muscle because it does almost no work. That’s where filet mignon comes from.',
            'Every porterhouse is a T-bone, but not every T-bone is a porterhouse. A porterhouse needs a bigger slice of tenderloin on the bone.',
            'The hanger steak is called “the butcher’s steak.” There’s only one per animal — butchers used to keep it for themselves.',
        ],
    },
    {
        slug: 'pork',
        name: 'Pork',
        iconId: 'pig',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-pork.jpg',
        chartPrompt:
            'A heritage pig surrounded by illustrated meat products: PORK SHOULDER, PORK CHOP, TENDERLOIN, FRESH HAM, PORK BELLY, SPARE RIBS, HAM HOCK, and PORK JOWL with leader lines into each primal section. ' +
            CHART_STYLE,
        primals: [
            { name: 'Boston butt', where: 'Upper shoulder', bestFor: 'Pork shoulder, pulled pork, sausage' },
            { name: 'Loin', where: 'Along the back', bestFor: 'Pork chops, tenderloin, baby backs' },
            { name: 'Belly', where: 'Underside', bestFor: 'Pork belly, bacon, spare ribs' },
            { name: 'Leg', where: 'Back leg', bestFor: 'Fresh or smoked ham' },
            { name: 'Jowl & hock', where: 'Cheek & shins', bestFor: 'Guanciale, smoked ham hocks' },
        ],
        facts: [
            'Despite the name, a Boston butt comes from the pig’s shoulder — not the rear.',
            'Baby back ribs come from the loin, up by the spine. Spare ribs come from lower down, by the belly.',
            'American bacon comes from the belly. Canadian bacon is cut from the loin.',
            'Pork is safe at 145°F with a 3-minute rest — a rosy blush keeps heritage chops juicy.',
        ],
    },
    {
        slug: 'chicken',
        name: 'Chicken',
        iconId: 'chicken',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-chicken.jpg',
        chartPrompt:
            'A pasture chicken surrounded by illustrated meat products: CHICKEN BREAST, SPLIT CHICKEN, CHICKEN THIGH, DRUMSTICK, CHICKEN WINGS, CHICKEN BACK, and CHICKEN FEET with leader lines into each section. ' +
            CHART_STYLE,
        primals: [
            { name: 'Breast & split', where: 'Front of body', bestFor: 'Chicken breast, split grilling halves' },
            { name: 'Thigh', where: 'Upper leg', bestFor: 'Searing, braising — stays juicy to 180°F' },
            { name: 'Drumstick', where: 'Lower leg', bestFor: 'Roasting, frying, smoking' },
            { name: 'Wings', where: 'Drumette · flat · tip', bestFor: 'Smoking, crisping, stock' },
            { name: 'Back & feet', where: 'Frame', bestFor: '24-hour collagen bone broth' },
        ],
        facts: [
            'Dark meat is darker because leg muscles work harder and hold more myoglobin.',
            'Every chicken has two “oysters” — small, tender medallions tucked on the back by the thigh.',
            'A chicken wing has three parts: the drumette, the flat and the tip.',
            'Air-chilled pasture birds absorb zero ice-bath water, so skin crisps immediately in cast iron.',
        ],
    },
    {
        slug: 'lamb',
        name: 'Lamb',
        iconId: 'lamb',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-lamb.jpg',
        chartPrompt:
            'A pasture lamb surrounded by illustrated meat products: SHOULDER ROAST, RACK OF LAMB, LOIN CHOPS, LEG OF LAMB, LAMB RIBS, and LAMB SHANK with leader lines into each primal section. ' +
            CHART_STYLE,
        primals: [
            { name: 'Shoulder', where: 'Front', bestFor: 'Shoulder roast, braises, kebabs' },
            { name: 'Rack', where: 'Rib section', bestFor: 'Frenched rack of lamb, rib chops' },
            { name: 'Loin', where: 'Behind the rack', bestFor: 'Loin chops — “mini T-bones”' },
            { name: 'Leg', where: 'Back leg', bestFor: 'Leg of lamb, butterflied for the grill' },
            { name: 'Shank & ribs', where: 'Legs & breast', bestFor: 'Braised lamb shanks, crispy lamb ribs' },
        ],
        facts: [
            'A rack of lamb has eight ribs, hand-Frenched clean at our butcher block.',
            'Lamb is harvested under one year of age, giving it a mild, sweet pasture flavor.',
            'Lamb loin chops look like miniature T-bones — strip loin on one side, tenderloin on the other.',
        ],
    },
    {
        slug: 'veal',
        name: 'Veal',
        iconId: 'cow',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-veal.jpg',
        chartPrompt:
            'A calf surrounded by illustrated meat products: VEAL RIB CHOP, VEAL LOIN CHOP, VEAL SCALLOPINI, OSSO BUCO SHANK, VEAL STEW MEAT, and VEAL BONES with leader lines into SHOULDER, RIB, LOIN, LEG, and SHANK. ' +
            CHART_STYLE,
        primals: [
            { name: 'Rib & loin', where: 'Back spine', bestFor: 'Veal rib chops, Milanese, loin chops' },
            { name: 'Leg', where: 'Hindquarter', bestFor: 'Thin-pounded veal scallopini & piccata' },
            { name: 'Shank', where: 'Lower leg', bestFor: 'Cross-cut Osso Buco with marrow bone' },
            { name: 'Shoulder & bones', where: 'Forequarter', bestFor: 'Veal stew meat, French demi-glace' },
        ],
        facts: [
            '“Osso Buco” means “bone with a hole” in Italian — prized for the creamy marrow inside the shank.',
            'Veal knuckle bones contain the highest natural gelatin for classic restaurant demi-glace.',
        ],
    },
    {
        slug: 'turkey',
        name: 'Turkey',
        iconId: 'chicken',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-turkey.jpg',
        chartPrompt:
            'A pasture turkey surrounded by illustrated meat products: TURKEY BREAST, WHOLE TURKEY, TURKEY THIGH, SMOKED TURKEY, TURKEY LEG, and TURKEY WINGS with leader lines into BREAST, WING, THIGH, and LEG. ' +
            CHART_STYLE,
        primals: [
            { name: 'Whole & breast', where: 'Crown', bestFor: 'Whole pasture roaster, hotel breast' },
            { name: 'Smoked turkey', where: 'Smokehouse', bestFor: 'Applewood-smoked birds & deli breast' },
            { name: 'Thigh & leg', where: 'Hindquarter', bestFor: 'Braised thighs, smoked drumsticks' },
            { name: 'Wings', where: 'Forelimb', bestFor: 'Roasted ahead for rich holiday gravy' },
        ],
        facts: [
            'Dry-brining a pasture turkey 48 hours early seasons the breast deep inside while crisping the skin.',
            'Pull turkey breast at 160°F — carryover heat brings it safely to 165°F during a 25-minute rest.',
        ],
    },
    {
        slug: 'duck',
        name: 'Duck',
        iconId: 'duck',
        chartSrc: '/assets/identity/cut-charts/flint-flame-butcher-guide-duck.jpg',
        chartPrompt:
            'A specialty duck surrounded by illustrated meat products: DUCK BREAST, WHOLE DUCK, DUCK LEGS, DUCK CONFIT, SMOKED DUCK, DUCK RILLETTES, DUCK FAT, and DUCK STOCK with leader lines into BREAST and LEG. ' +
            CHART_STYLE,
        primals: [
            { name: 'Breast & whole', where: 'Chest', bestFor: 'Scored magret breast, whole roast duck' },
            { name: 'Legs & confit', where: 'Hindquarter', bestFor: 'Duck confit, whipped duck rillettes' },
            { name: 'Fat & stock', where: 'Renderings', bestFor: 'Crispy duck-fat potatoes & pan jus' },
        ],
        facts: [
            'Duck breast is culinary red meat — start it in a cold pan to render the skin crisp and serve at 135°F.',
            'Duck fat has a high 375°F smoke point and turns roast potatoes glass-crisp.',
        ],
    },
];
