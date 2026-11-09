export const HANDLE = '@hofherrmeatco';

/* ── cooking content (how-to, trivia, tricks, temps) ─────────────── */

export type HowTo = { slug: string; kicker: string; title: string; steps: string[] };
export const HOW_TOS: HowTo[] = [
    {
        slug: 'perfect-steak',
        kicker: 'How to cook it',
        title: 'The perfect pan steak',
        steps: [
            'Pat dry. Salt generously 40 min ahead — or right before.',
            'Cast iron, smoking hot, a thin film of high-heat oil.',
            'Sear 2–3 min a side. Flip once, then again if you like.',
            'Last minute: butter, garlic, thyme. Spoon it over.',
            'Pull 5°F early. Rest 5–10 min. Slice against the grain.',
        ],
    },
    {
        slug: 'reverse-sear',
        kicker: 'How to cook it',
        title: 'Reverse sear a thick cut',
        steps: [
            'Season and set on a rack over a sheet pan.',
            'Oven at 250°F until 10–15°F under your target.',
            'Rest 10 min while the pan gets ripping hot.',
            'Sear 60–90 sec a side for the crust.',
            'Slice and serve — no second rest needed.',
        ],
    },
    {
        slug: 'smoked-brisket',
        kicker: 'How to smoke it',
        title: 'Backyard brisket',
        steps: [
            'Trim fat cap to ¼". Salt & coarse pepper, 50/50.',
            'Smoke at 250–275°F, fat side toward the heat.',
            'At ~165°F and a dark bark, wrap in butcher paper.',
            'Cook until probe-tender, around 200–205°F.',
            'Rest wrapped at least 1 hour. Slice the flat against the grain.',
        ],
    },
];

export type Trivia = { slug: string; q: string; a: string };
export const TRIVIA: Trivia[] = [
    { slug: 'pink-juice', q: 'Is the red juice in a steak blood?', a: 'Nope. It’s water and myoglobin — the protein that gives meat its color. The blood is drained long before it reaches our case.' },
    { slug: 'sear-myth', q: 'Does searing “seal in the juices”?', a: 'Myth. Searing builds flavor through the Maillard reaction — the browning that makes a crust taste like a crust. Resting is what keeps juice in.' },
    { slug: 'dry-aging', q: 'Why does dry-aged beef taste so different?', a: 'Natural enzymes tenderize the muscle while moisture evaporates, concentrating the flavor into something nutty and rich. It loses weight as it ages.' },
    { slug: 'brisket-two-muscles', q: 'How many muscles are in a brisket?', a: 'Two. The lean “flat” and the fatty “point” — which is where burnt ends come from.' },
];

export type Trick = { slug: string; title: string; body: string };
export const TRICKS: Trick[] = [
    { slug: 'freeze-to-slice', title: 'Slice it paper thin', body: 'Pop meat in the freezer for 20–30 minutes before slicing. Firm meat = thin, even cuts for stir-fry and cheesesteaks.' },
    { slug: 'cold-pan-bacon', title: 'Start bacon in a cold pan', body: 'Lay it in a cold skillet, then turn the heat to medium. The fat renders slowly and you get flat, evenly crisp strips.' },
    { slug: 'pat-dry', title: 'Dry meat browns. Wet meat steams.', body: 'Pat every cut dry with paper towels before it hits the pan. That’s the whole secret to a deep crust.' },
    { slug: 'against-grain', title: 'Find the grain, cut across it', body: 'Look for the lines running through the meat and slice across them. Flank, skirt and brisket go from chewy to tender.' },
];

/** Chef doneness targets (pull temps run ~5°F lower; temp rises while resting). */
export const DONENESS = [
    { label: 'Rare', temp: '120–125°F', color: '#B4141E' },
    { label: 'Medium rare', temp: '130–135°F', color: '#C8323A' },
    { label: 'Medium', temp: '135–145°F', color: '#D0605A' },
    { label: 'Medium well', temp: '145–155°F', color: '#B58060' },
    { label: 'Well done', temp: '155°F +', color: '#8A6A55' },
];

/* ── bios ─────────────────────────────────────────────────────────── */
export const BIOS: { title: string; text: string; limit?: number }[] = [
    { title: 'Instagram', limit: 150, text: '🔥 Neighborhood butcher · cut to order\n🥩 Dry-aged beef · heritage pork · BBQ\n📍 Northfield + The Depot, Winnetka\n👇 Order ahead' },
    { title: 'TikTok', limit: 80, text: 'Butchers in Northfield, IL 🔥 Cuts, tips & whole-hog BBQ' },
    { title: 'X / Twitter', limit: 160, text: 'Neighborhood butcher shop cutting to order since 2018. Dry-aged beef, heritage pork, rotisserie & whole-hog BBQ. Northfield + The Depot in Winnetka, IL.' },
    { title: 'Facebook — Intro', limit: 101, text: 'Full-service butcher shop & BBQ in Northfield and Winnetka, IL. Cut to order since 2018.' },
    {
        title: 'Google Business — Description',
        limit: 750,
        text:
            'Hofherr Meat Co. is a full-service neighborhood butcher shop in Northfield, Illinois, with a second counter at The Depot in Winnetka. ' +
            'Every cut is made to order by our butchers: dry-aged and prime beef, heritage pork, pasture-raised lamb, poultry and rotisserie chicken, fresh seafood, ' +
            'house-made sausages, bone broth and deli. We also run a full BBQ and catering kitchen for pig roasts, parties and events of any size. ' +
            'Call ahead for custom cuts, quarter and half beef shares, and holiday pre-orders.',
    },
    {
        title: 'LinkedIn — About',
        limit: 2000,
        text:
            "Hofherr Meat Co. is an independent butcher shop on Chicago's North Shore, with locations in Northfield and at The Depot in Winnetka. " +
            'We source from Midwest farms, break down whole animals in-house and cut to order, and run a catering and BBQ program for private and corporate events. ' +
            'We are always looking for people who want to learn the craft.',
    },
];

/* ── captions ─────────────────────────────────────────────────────── */
export const CAPTIONS: { title: string; text: string }[] = [
    { title: 'Know your cuts (carousel)', text: 'Know your cuts: [animal] 🔪\n\nSave this for your next trip to the counter 📌 Swipe for where each cut comes from — and a few things most people don’t know 👉\n\nWhich cut should we cover next?' },
    { title: 'Did you know?', text: 'Did you know? 🧠\n\n[Fact]\n\nAsk us anything at the counter — we love this stuff.' },
    { title: 'How-to (carousel)', text: 'Save this for steak night 📌\n\n[Title] in 5 steps — swipe through 👉\n\nPick up your cut at the counter and we’ll tell you exactly how thick to go.\n\nQuestions? Drop them below and our butchers will answer.' },
    { title: 'Trivia', text: 'Butcher trivia 🧠\n\n[Question]\n\nThink you know? Comment your answer before you swipe 👉' },
    { title: 'Kitchen trick', text: 'Kitchen trick from behind the counter 🔪\n\n[Trick in one line.]\n\nTry it this week and tell us how it went.' },
    { title: 'Doneness chart', text: 'Screenshot this 📲\n\nPull your steak about 5°F before your target — it keeps climbing while it rests.\n\nFood-safety note: USDA recommends 145°F with a 3-minute rest for whole cuts of beef, pork and lamb, 160°F for ground meat and 165°F for poultry.' },
    { title: 'Weekly specials', text: "This week at the block 🔥\n\n[Cut] — $[price]/lb\n[Cut] — $[price]/lb\n[Cut] — $[price]\n\nThrough Sunday or while it lasts. Call ahead and we'll have it wrapped: (847) 441-MEAT\n\n📍 Northfield · The Depot, Winnetka" },
    { title: 'New cut / product', text: "New on the block: [cut name].\n\n[One line on what it is.] [One line on how to cook it.]\n\nAsk for it at the counter — we'll cut it as thick as you want." },
    { title: 'Catering / events', text: 'Planning a [grad party / pig roast / office lunch]? We bring the fire. 🔥🐖\n\nWhole hogs, brisket, pulled pork, rotisserie chicken and all the sides — delivered and set up.\n\nGet a quote: hofherrmeatco.com/catering' },
    { title: 'Holiday pre-order', text: '[Holiday] pre-orders are open 🎄\n\nPrime rib · turkeys · spiral hams · tenderloin\n\nReserve by [date], pick up [dates]. Order in store or call (847) 441-MEAT.' },
    { title: 'Behind the block (Reel)', text: 'From whole [animal] to your table. 🔪\n\nThis is [name] breaking down [cut] this morning. Every steak in our case starts like this.\n\n#behindtheblock' },
    { title: 'Customer review', text: 'Words like this keep the fire going 🔥 Thank you, [name]!\n\nTell us about your last cookout — tag us so we can share it.' },
    { title: 'Hours / closure notice', text: 'Heads up 📣 [Closed / Holiday hours] on [date].\n\n[Day]: [hours]\n[Day]: [hours]\n\nPlan ahead — call (847) 441-MEAT to reserve.' },
    { title: 'Now hiring', text: "We're hiring 🔪 [Butchers · counter staff · BBQ crew]\n\nLearn the trade from people who still break down whole animals. Full & part time in Northfield and Winnetka.\n\nApply: hofherrmeatco.com/jobs" },
];

export const HASHTAGS: { title: string; text: string }[] = [
    { title: 'Everyday (local)', text: '#hofherrmeatco #northfieldil #winnetka #northshorechicago #chicagofood #chicagoeats #shoplocal #localbutcher' },
    { title: 'Cooking & tips', text: '#howtocook #steaktips #cookingtips #kitchenhacks #reversesear #castironcooking #homecook #grillingtips' },
    { title: 'Butcher & cuts', text: '#butchershop #butcher #dryaged #steak #ribeye #meatlovers #nosetotail #butcherlife' },
    { title: 'BBQ & catering', text: '#bbq #pigroast #wholehog #brisket #smokedmeat #chicagobbq #eventcatering #northshorecatering' },
    { title: 'Seasonal', text: '#grillingseason #holidaydinner #primerib #thanksgivingturkey #tailgate #4thofjuly' },
];

export const CADENCE: { day: string; what: string; template: string }[] = [
    { day: 'Mon', what: 'Weekly specials go live', template: 'Post · Weekly specials / menu' },
    { day: 'Tue', what: 'How-to cook it', template: 'Cooking · How-to carousel' },
    { day: 'Wed', what: 'Know your cuts or trivia', template: 'Cuts carousel · Trivia' },
    { day: 'Thu', what: 'Kitchen trick + order deadline story', template: 'Cooking · Trick / Story · Deadline' },
    { day: 'Fri', what: 'New cut spotlight', template: 'Post · New cut' },
    { day: 'Sat', what: 'Doneness chart or behind the block', template: 'Cooking · Temps / Story' },
    { day: 'Sun', what: 'Customer review or catering recap', template: 'Post · Review / Event' },
];
