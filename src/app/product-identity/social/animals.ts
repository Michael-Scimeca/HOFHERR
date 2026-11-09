/**
 * "Know your cuts" series — one set per animal.
 * Chart images: generate with Gemini Nano Banana using `chartPrompt`, save to `chartSrc`.
 * Facts are written to be accurate; double-check any edits before posting.
 */

const CHART_STYLE =
    'Vintage butcher shop cut chart poster. Side-profile engraving-style illustration in black ink with fine crosshatching on warm cream paper (#F3EAD8). ' +
    'Bold dashed lines divide the primal cuts; each primal name in bold condensed uppercase sans-serif centred inside its section. ' +
    'Small italic serif callouts with thin amber (#F59B1A) leader lines. Title "HOFHERR MEAT CO. · KNOW YOUR CUTS" across the top in crimson (#8B0A10). ' +
    'Plain cream background, no other text, no watermark. Every label spelled exactly as written and placed exactly as described. Aspect ratio 4:5.';

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
        chartSrc: '/assets/social/cut-chart-beef.svg',
        chartPrompt:
            'A steer facing left. Primal sections from head to tail along the top: CHUCK, RIB, SHORT LOIN, SIRLOIN, ROUND. Along the bottom from front to back: BRISKET, PLATE, FLANK. ' +
            'Front leg labelled SHANK. Callouts: "Ribeye" points into the RIB section; "NY Strip" and "Porterhouse" both point into the SHORT LOIN; ' +
            '"Filet Mignon" points to a dashed tenderloin shape drawn INSIDE the short loin and sirloin just below the spine (not on the outline); ' +
            '"Tri-Tip" and "Picanha" point to the lower sirloin; "Skirt Steak" points into the PLATE; "Flank Steak" points into the FLANK; ' +
            '"Short Ribs" points into the PLATE; "Brisket" points into the BRISKET. ' + CHART_STYLE,
        primals: [
            { name: 'Chuck', where: 'Shoulder', bestFor: 'Pot roast, braising, burgers' },
            { name: 'Rib', where: 'Ribs 6–12', bestFor: 'Ribeye, prime rib' },
            { name: 'Short loin', where: 'Behind the ribs', bestFor: 'NY strip, T-bone, porterhouse' },
            { name: 'Sirloin', where: 'Hip', bestFor: 'Top sirloin, tri-tip, picanha' },
            { name: 'Round', where: 'Back leg', bestFor: 'Roast beef, jerky, Italian beef' },
            { name: 'Brisket · Plate · Flank', where: 'Underside', bestFor: 'Smoking, skirt & flank steak' },
        ],
        facts: [
            'A ribeye comes from ribs six through twelve — the same section as a standing prime rib roast.',
            'The tenderloin is the most tender muscle because it does almost no work. That’s where filet mignon comes from.',
            'Every porterhouse is a T-bone, but not every T-bone is a porterhouse. A porterhouse needs a bigger slice of tenderloin on the bone.',
            'The hanger steak is called “the butcher’s steak.” There’s only one per animal — butchers used to keep it for themselves.',
            'Cattle have one stomach with four compartments: the rumen, reticulum, omasum and abomasum.',
        ],
    },
    {
        slug: 'pork',
        name: 'Pork',
        iconId: 'pig',
        chartSrc: '/assets/social/cut-chart-pork.svg',
        chartPrompt:
            'A pig facing left. Primal sections: SHOULDER at the front split into BOSTON BUTT (upper) and PICNIC (lower), LOIN along the back, BELLY along the underside, LEG (HAM) at the rear. ' +
            'Callouts: "Pork Chops" and "Baby Back Ribs" point into the LOIN; "Tenderloin" points to a dashed shape inside the rear of the loin; ' +
            '"Bacon" and "Spare Ribs" point into the BELLY; "Pulled Pork" points into the BOSTON BUTT; "Ham" points into the LEG; "Jowl" points to the cheek. ' + CHART_STYLE,
        primals: [
            { name: 'Boston butt', where: 'Upper shoulder', bestFor: 'Pulled pork, sausage' },
            { name: 'Picnic', where: 'Lower shoulder', bestFor: 'Roasts, carnitas' },
            { name: 'Loin', where: 'Along the back', bestFor: 'Chops, baby backs, tenderloin' },
            { name: 'Belly', where: 'Underside', bestFor: 'Bacon, spare ribs, porchetta' },
            { name: 'Leg', where: 'Back leg', bestFor: 'Fresh or cured ham' },
        ],
        facts: [
            'Despite the name, a Boston butt comes from the pig’s shoulder — not the rear.',
            'Baby back ribs come from the loin, up by the spine. Spare ribs come from lower down, by the belly.',
            'American bacon comes from the belly. Canadian bacon is cut from the loin.',
            'Pork is safe at 145°F with a 3-minute rest — USDA lowered it from 160°F in 2011. A little pink is fine.',
        ],
    },
    {
        slug: 'lamb',
        name: 'Lamb',
        iconId: 'lamb',
        chartSrc: '/assets/social/cut-chart-lamb.svg',
        chartPrompt:
            'A lamb facing left. Primal sections from head to tail: SHOULDER, RACK, LOIN, LEG; underside BREAST; front leg FORESHANK. ' +
            'Callouts: "Rack of Lamb" points into the RACK; "Loin Chops" points into the LOIN; "Leg of Lamb" points into the LEG; "Shoulder Chops" points into the SHOULDER; ' +
            '"Lamb Shank" points into the FORESHANK; "Riblets" points into the BREAST. ' + CHART_STYLE,
        primals: [
            { name: 'Shoulder', where: 'Front', bestFor: 'Braises, stews, kebabs' },
            { name: 'Rack', where: 'Rib section', bestFor: 'Rack of lamb, rib chops' },
            { name: 'Loin', where: 'Behind the rack', bestFor: 'Loin chops — “mini T-bones”' },
            { name: 'Leg', where: 'Back leg', bestFor: 'Roast leg, butterflied for the grill' },
            { name: 'Shank & breast', where: 'Legs & underside', bestFor: 'Slow-braised shanks, riblets' },
        ],
        facts: [
            'A rack of lamb usually has seven or eight ribs, cut from the rib section along the back.',
            '“Frenched” means the meat is scraped clean from the ends of the bones. We do it by hand.',
            'Lamb is generally from an animal under a year old. Older sheep is sold as mutton and has a stronger flavor.',
            'Lamb loin chops look like tiny T-bones — loin on one side, tenderloin on the other.',
        ],
    },
    {
        slug: 'chicken',
        name: 'Chicken',
        iconId: 'chicken',
        chartSrc: '/assets/social/cut-chart-chicken.svg',
        chartPrompt:
            'A whole chicken standing, facing left. Sections: BREAST on the front of the body, WING, THIGH, DRUMSTICK, BACK. ' +
            'Callouts: "Tenderloin" points to a dashed strip under the breast; "Drumette", "Flat" and "Tip" label the three parts of the WING; ' +
            '"Oysters" points to two small spots on the BACK near the top of the thigh. ' + CHART_STYLE,
        primals: [
            { name: 'Breast', where: 'Front of body', bestFor: 'Grilling, cutlets, roasting' },
            { name: 'Thigh', where: 'Upper leg', bestFor: 'Grilling, braising — hard to overcook' },
            { name: 'Drumstick', where: 'Lower leg', bestFor: 'Roasting, frying, smoking' },
            { name: 'Wing', where: 'Drumette · flat · tip', bestFor: 'Frying, smoking, stock (tips)' },
            { name: 'Back & frame', where: 'Carcass', bestFor: 'Stock and bone broth' },
        ],
        facts: [
            'Dark meat is darker because leg muscles work harder and hold more myoglobin, the protein that stores oxygen.',
            'Every chicken has two “oysters” — small, tender pieces on the back by the thigh. Cooks often save them for themselves.',
            'A chicken wing has three parts: the drumette, the flat and the tip. Tips are perfect for stock.',
            'Poultry is safe at 165°F. Thighs taste even better taken a little higher — they stay juicy.',
        ],
    },
];
