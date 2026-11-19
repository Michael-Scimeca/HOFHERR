export type SeasonId = 'all' | 'winter' | 'spring' | 'summer' | 'fall';

export interface HolidaySocialPosts {
    bestPostWindow: string;
    facebook: string;
    instagram: string;
    story: string;
}

export interface HolidaySellingGuide {
    id: string;
    name: string;
    timing: string;
    season: Exclude<SeasonId, 'all'>;
    demandLevel: 'Peak Allocation' | 'High Demand' | 'Steady Counter Surge';
    leadTime: string;
    typicalGroup: string;
    image: string;
    imageAlt: string;
    heroOfferings: string[];
    sellingPoints: string[];
    butcherPitch: string;
    socialPosts: HolidaySocialPosts;
}

export interface OtherCateringOccasion {
    id: string;
    title: string;
    when: string;
    category: 'Social & Family' | 'Corporate & Community' | 'Seasonal & Sports';
    typicalGroup: string;
    leadTime: string;
    bestFitPackage: string;
    sellingPoints: string[];
    counterTip: string;
}

export interface PlanningMatrixRow {
    id: string;
    occasion: string;
    peakWindow: string;
    leadTime: string;
    topSeller: string;
    sellingAngle: string;
}

export const SEASON_TABS: { id: SeasonId; label: string }[] = [
    { id: 'all', label: 'All Holidays' },
    { id: 'winter', label: 'Winter' },
    { id: 'spring', label: 'Spring' },
    { id: 'summer', label: 'Summer' },
    { id: 'fall', label: 'Fall' },
];

export const HOLIDAY_SELLING_GUIDES: HolidaySellingGuide[] = [
    {
        id: 'super-bowl',
        name: 'Super Bowl Sunday',
        timing: 'Early February',
        season: 'winter',
        demandLevel: 'Peak Allocation',
        leadTime: '5–7 days ahead',
        typicalGroup: '12–40 guests',
        image: '/assets/holidays/super-bowl-bbq-spread.jpg',
        imageAlt: 'Super Bowl BBQ catering spread with sliced oak-smoked brisket, rib tips, hot links, Italian beef, and chorizo dates',
        heroOfferings: ['Smoked Brisket', 'Rib Tips & Hot Links', 'Italian Beef Trays', 'Bacon Wrapped Chorizo Dates'],
        sellingPoints: [
            'Beats chain pizza and grocery wings with real 14-hour oak-and-cherry smoked BBQ.',
            'Holds heat cleanly from kickoff through the 4th quarter with zero host babysitting.',
            'Easy per-pound Italian beef & hot link add-ons let hosts scale up at the last minute.',
        ],
        butcherPitch: 'Pair a brisket or pulled pork tray with Pimento Cheese + Crackers so guests graze before kickoff.',
        socialPosts: {
            bestPostWindow: 'Post 10–14 days before kickoff + final call 4 days out',
            facebook:
                "Skip the soggy delivery pizza this Super Bowl Sunday. We're smoking brisket over oak & cherry for 14 hours, glazing rib tips & hot links, and packing our world-famous Italian beef by the pound so you can actually watch the game. Order your spread for Northfield pickup at hofherrmeatco.com/catering or call (847) 441-MEAT.",
            instagram:
                'Four quarters deserve real smoke. 🔥 Oak-smoked brisket, rib tips & hot links, Chicago Italian beef, and bacon-wrapped chorizo dates — hot, ready, and zero kitchen cleanup. Link in bio to lock in your Super Bowl tray before slots fill. #HofherrMeatCo #NorthShoreEats #SuperBowlBBQ #ChicagoBBQ #NorthfieldIL',
            story: 'SUPER BOWL PRE-ORDERS ARE LIVE 🏈🔥 Brisket · Rib Tips · Italian Beef · Chorizo Dates. Tap to lock in your pickup time before we sell out.',
        },
    },
    {
        id: 'valentines-day',
        name: "Valentine's Day",
        timing: 'February 14',
        season: 'winter',
        demandLevel: 'High Demand',
        leadTime: '2–4 days ahead',
        typicalGroup: '2–6 guests',
        image: '/assets/holidays/valentines-day-prime-steaks.jpg',
        imageAlt: 'Two seared USDA Prime filet mignons and bone-in ribeye basted with brown butter and thyme beside charcuterie and red wine',
        heroOfferings: ['USDA Prime Filet Mignon', 'Dry-Aged Ribeye', 'Frenched Rack of Lamb', 'Butcher Charcuterie'],
        sellingPoints: [
            'Steakhouse-caliber dinner at home for half the restaurant tab — no rushed two-hour table turns.',
            'Hand-cut to exact thickness at the counter with step-by-step butter-basting instructions.',
            'Charcuterie and bacon-wrapped chorizo dates give couples a zero-cook first course.',
        ],
        butcherPitch: 'Suggest thick 1.5-inch center-cut filets or a shared bone-in ribeye for two with a small charcuterie board.',
        socialPosts: {
            bestPostWindow: 'Post Feb 5–11 (capture couples skipping crowded restaurant reservations)',
            facebook:
                "Why pay $250+ for a rushed Valentine's table turn when you can sear USDA Prime filet mignon or a dry-aged bone-in ribeye at home? Tell us how thick you want it cut, grab a ready-to-serve Butcher's Charcuterie Board for your first course, and we'll send you home with exact butter-basting tips. Reserve at hofherrmeatco.com/online-orders.",
            instagram:
                "Steakhouse night, zero reservations required. 🕯️🥩 Hand-cut USDA Prime filets, dry-aged ribeyes, and artisan charcuterie boards ready for your cast-iron skillet. Order ahead at the link in bio. #HofherrMeatCo #ValentinesDinner #PrimeSteak #NorthfieldIL #WinnetkaIL",
            story: "VALENTINE'S STEAKHOUSE AT HOME 🥩🕯️ Hand-cut Prime Filets + Charcuterie Boards. Skip the crowded dining room — tap to reserve.",
        },
    },
    {
        id: 'st-patricks-day',
        name: "St. Patrick's Day",
        timing: 'March 17',
        season: 'spring',
        demandLevel: 'High Demand',
        leadTime: '4–7 days ahead',
        typicalGroup: '8–30 guests',
        image: '/assets/holidays/st-patricks-day-corned-beef.jpg',
        imageAlt: 'Thick hand-carved slices of rosy house-cured corned beef brisket with charred cabbage, Dijon mustard, and seared Irish bangers',
        heroOfferings: ['House-Cured Corned Beef Brisket', 'Bangers & Mash Sausages', 'Cabbage & Sides'],
        sellingPoints: [
            'House-brined in small batches — far richer flavor and cleaner slice than supermarket cryovac.',
            'Available raw for home braising or cooked and sliced for effortless office and family lunches.',
            'HMC house sausages give non-corned-beef eaters an authentic pub-style option.',
        ],
        butcherPitch: 'Offer point-cut for extra marbling or flat-cut for clean sandwich slices — most shops never ask.',
        socialPosts: {
            bestPostWindow: 'Post March 5–13 (highlight point-cut vs. flat-cut pre-orders)',
            facebook:
                "There's grocery-store corned beef, and then there's Hofherr house-cured corned beef brisket. Brined in small batches right here in Northfield — choose point-cut for extra marbling or flat-cut for clean Reuben slices, plus house Irish bangers for the table. Reserve yours before St. Patrick's Day sells out: (847) 441-MEAT.",
            instagram:
                "House-cured, never cryovac. ☘️🥩 Our small-batch corned beef briskets are brining now — pick point-cut or flat-cut, raw or ready for your St. Patrick's Day table. Call or order online at the link in bio. #HofherrMeatCo #CornedBeef #StPatricksDay #CraftButcher #NorthShoreIL",
            story: "HOUSE-CURED CORNED BEEF IS IN THE BRINE ☘️ Point-cut or flat-cut — reserve your St. Patrick's Day brisket before it's gone!",
        },
    },
    {
        id: 'easter-passover',
        name: 'Easter & Passover',
        timing: 'March – April',
        season: 'spring',
        demandLevel: 'Peak Allocation',
        leadTime: '7–10 days ahead',
        typicalGroup: '10–30 guests',
        image: '/assets/holidays/easter-passover-lamb-brisket.jpg',
        imageAlt: 'Herb-crusted frenched rack of lamb and glazed slow-braised first-cut beef brisket with roasted spring carrots on dark walnut',
        heroOfferings: ['Frenched Rack of Lamb', 'Bone-In Leg of Lamb', 'First-Cut Beef Brisket', 'Heritage Glazed Ham'],
        sellingPoints: [
            'Custom-trimmed, frenched, and tied roasts eliminate the hardest hour of holiday prep.',
            'Exact pull-temperature guidance ensures an expensive centerpiece never gets overcooked.',
            'Accommodates multi-generational tables with both traditional brisket and spring lamb.',
        ],
        butcherPitch: 'Confirm oven size and serving time at pickup so we can butterflied-tie or trim to fit their roasting pan.',
        socialPosts: {
            bestPostWindow: 'Post 2–3 weeks before Easter & Passover',
            facebook:
                'Hosting Easter or Passover this spring? Let our butchers handle the hardest hour of prep. Pre-order frenched racks of lamb, tied bone-in leg of lamb, first-cut beef brisket, and heritage hams — trimmed to your exact guest count with pull-temp notes included. Reserve early at hofherrmeatco.com/online-orders or (847) 441-MEAT.',
            instagram:
                'The centerpiece your spring table deserves. 🌿 Frenched rack of lamb, first-cut brisket, and heritage hams — custom-trimmed and tied by our Northfield butchers so all you do is roast and carve. Pre-order at the link in bio. #HofherrMeatCo #EasterDinner #PassoverBrisket #RackOfLamb #NorthfieldIL',
            story: 'EASTER & PASSOVER PRE-ORDERS OPEN 🌿 Lamb Racks · First-Cut Brisket · Heritage Ham. Custom-trimmed to your guest count.',
        },
    },
    {
        id: 'mothers-day',
        name: "Mother's Day",
        timing: 'Mid-May',
        season: 'spring',
        demandLevel: 'High Demand',
        leadTime: '4–5 days ahead',
        typicalGroup: '8–25 guests',
        image: '/assets/holidays/mothers-day-tenderloin-charcuterie.jpg',
        imageAlt: 'Sliced roasted beef tenderloin, artisan charcuterie board with figs and honeycomb, and golden pasture-raised rotisserie chicken',
        heroOfferings: ['Beef Tenderloin Roast', "Butcher's Charcuterie Board", 'Pasture-Raised Rotisserie Chicken', 'Seasonal Pasta Salad'],
        sellingPoints: [
            'Lets the family host at home without Mom spending a single minute in the kitchen.',
            'Lighter spring-friendly options (rotisserie, tenderloin, charcuterie, salads) alongside classic BBQ.',
            'Predictable per-person pricing beats crowded, overpriced hotel brunch buffets.',
        ],
        butcherPitch: 'Lead with a ready-to-slice tenderloin roast plus a charcuterie board so brunch-to-dinner flows effortlessly.',
        socialPosts: {
            bestPostWindow: 'Post 10 days before Mother’s Day',
            facebook:
                "Skip the crowded hotel brunch buffet and host Mom at home without anyone stuck in the kitchen. Pair a custom-trimmed beef tenderloin roast or our pasture-raised rotisserie chickens with a ready-to-serve Butcher's Charcuterie Board and Seasonal Pasta Salad. Reserve your Mother's Day pickup at (847) 441-MEAT.",
            instagram:
                "Let Mom sit back and actually enjoy the day. 💐 Roasted beef tenderloin, artisan charcuterie boards, and pasture-raised rotisserie chickens ready for effortless hosting at home. Tap the link in bio to pre-order. #HofherrMeatCo #MothersDayDinner #NorthShoreLiving #CharcuterieBoard",
            story: "HOST MOM WITHOUT THE KITCHEN STRESS 💐 Tenderloin Roasts · Charcuterie Boards · Rotisserie Chickens. Pre-order now.",
        },
    },
    {
        id: 'memorial-day',
        name: 'Memorial Day Weekend',
        timing: 'Late May',
        season: 'summer',
        demandLevel: 'Peak Allocation',
        leadTime: '7–14 days (2+ wks for Pig Roast)',
        typicalGroup: '20–100+ guests',
        image: '/assets/holidays/memorial-day-bbq-spread.jpg',
        imageAlt: 'Backyard Memorial Day BBQ catering spread with baby back ribs, pulled pork, sliced brisket, sausages, mac and cheese, and slaw',
        heroOfferings: ['Whole-Pig Roast (50+)', 'Smoked Brisket & Pulled Pork', 'Baby Back Ribs', 'HMC Grill Sausages'],
        sellingPoints: [
            'Official North Shore kickoff to backyard season — hosts want to entertain, not stand over a grill for 6 hours.',
            'Whole-pig roasts with live carving turn a standard holiday weekend into a signature neighborhood tradition.',
            'Drop-off BBQ catering starts at $16/pp with house sides (Pimento Mac, HMCo.Slaw, Butchers Beans).',
        ],
        butcherPitch: 'Book pig roasts early — Memorial Day weekend slots fill weeks in advance.',
        socialPosts: {
            bestPostWindow: 'Post 3 weeks out for Pig Roasts, 10 days out for BBQ catering & grill packs',
            facebook:
                "Kick off summer the right way — without spending 6 hours babysitting a grill. Our Memorial Day BBQ catering starts at $16/person with oak-smoked brisket, pulled pork, baby back ribs, HMC sausages, and homemade sides (Pimento Mac n Cheese, HMCo.Slaw & Butchers Beans). Hosting 50+? Ask about our full-service Whole-Pig Roasts at hofherrmeatco.com/catering.",
            instagram:
                'Backyard season officially starts here. 🔥🍖 Smoked brisket, baby back ribs, pulled pork, craft sausages & Pimento Mac n Cheese — ready to drop off so you can enjoy the long weekend. Build your instant quote at the link in bio. #HofherrMeatCo #MemorialDayBBQ #NorthShoreCatering #ChicagoBBQ',
            story: 'MEMORIAL DAY BBQ & PIG ROASTS 🔥 From $16/pp · Brisket · Ribs · Pulled Pork · House Sides. Tap to build your quote!',
        },
    },
    {
        id: 'fathers-day',
        name: "Father's Day",
        timing: 'Mid-June',
        season: 'summer',
        demandLevel: 'High Demand',
        leadTime: '4–7 days ahead',
        typicalGroup: '6–30 guests',
        image: '/assets/holidays/fathers-day-tomahawk-grill.jpg',
        imageAlt: 'Thick-cut bone-in USDA Prime tomahawk ribeye steak with herb compound butter searing over glowing oak charcoal embers',
        heroOfferings: ['Bone-In Tomahawk & Ribeye', 'Smoked Brisket & Ribs', 'Rib Tips & Hot Links', 'Butchers Beans'],
        sellingPoints: [
            'Two easy angles: showstopper prime steaks if Dad loves to grill, or full smoked BBQ if Dad wants the day off.',
            'Craft butcher cuts feel like a genuine gift rather than a last-minute grocery run.',
            'Pairs naturally with Hofherr gift cards for dads who want to pick their own cuts later.',
        ],
        butcherPitch: 'Ask whether Dad wants to grill or relax — it immediately routes the sale to Prime steaks vs. hot BBQ trays.',
        socialPosts: {
            bestPostWindow: 'Post 10–14 days before Father’s Day (steaks + BBQ trays + gift cards)',
            facebook:
                "Does Dad love working the coals, or does he deserve the day off? Either way, we've got Father's Day covered: thick-cut USDA Prime Tomahawk & bone-in ribeyes for the grill, OR full smoked brisket & rib trays ready to serve. Add a Hofherr Gift Card and call it a win. Order at hofherrmeatco.com.",
            instagram:
                "Fire up a Prime Tomahawk — or let us handle the smoke so Dad can kick back. 🔥🥩 Thick-cut ribeyes, smoked brisket trays, and Hofherr gift cards ready for Father's Day. Link in bio to order ahead. #HofherrMeatCo #FathersDayGrill #TomahawkSteak #PrimeBeef #NorthfieldIL",
            story: "FATHER'S DAY AT THE BLOCK 🥩🔥 Prime Tomahawks if Dad grills · Hot BBQ Trays if Dad relaxes. Reserve today!",
        },
    },
    {
        id: 'fourth-of-july',
        name: 'Fourth of July',
        timing: 'July 4',
        season: 'summer',
        demandLevel: 'Peak Allocation',
        leadTime: '7–14 days (2+ wks for Pig Roast)',
        typicalGroup: '25–150+ guests',
        image: '/assets/holidays/fourth-of-july-pig-roast.jpg',
        imageAlt: 'Twilight Fourth of July whole-hog pig roast carving table with crisp roasted pork, pulled pork, grilled corn, mac and cheese, and slaw',
        heroOfferings: ['Whole-Pig Roast', 'BBQ Catering Packages', 'Pulled Pork & Chicken', 'Corn & Potato Salad'],
        sellingPoints: [
            'Built for all-day outdoor crowds — BBQ trays and cold sides stay crowd-pleasing from parade to fireworks.',
            'Scales seamlessly from 20-person backyard cookouts to 500-person neighborhood & club celebrations.',
            'Full-service carving or 5-mile North Shore drop-off removes all kitchen and cleanup stress.',
        ],
        butcherPitch: 'Recommend 2 meats + 2 sides ($22/pp) so both brisket lovers and kids eating pulled chicken & mac are covered.',
        socialPosts: {
            bestPostWindow: 'Post 3–4 weeks before July 4th (whole-pig roast slots book fast)',
            facebook:
                'From the morning parade to the fireworks, feed 20 to 500+ without breaking a sweat. Book a full-service Hofherr Whole-Pig Roast (our team arrives with a fully roasted hog and carves live!) or build a drop-off BBQ catering package with smoked brisket, pulled pork, grilled corn, and Pimento Mac n Cheese at hofherrmeatco.com/catering.',
            instagram:
                'Make your Fourth of July the party the whole block talks about. 🎆🐷 Full-service Whole-Pig Roasts & drop-off BBQ buffets for 20–500+ across the North Shore. Lock in your July 4th date at the link in bio. #HofherrMeatCo #PigRoast #FourthOfJulyBBQ #NorthShoreEvents',
            story: 'JULY 4TH PIG ROAST & BBQ SLOTS FILLING FAST 🎆🐷 Live hog carving (50+) or drop-off BBQ trays (20+). Tap to book!',
        },
    },
    {
        id: 'labor-day',
        name: 'Labor Day Weekend',
        timing: 'Early September',
        season: 'summer',
        demandLevel: 'High Demand',
        leadTime: '5–10 days ahead',
        typicalGroup: '15–75 guests',
        image: '/assets/holidays/labor-day-grill-feast.jpg',
        imageAlt: 'Labor Day backyard grill feast with charred craft sausages, prime cheddar burgers on brioche, smoked pulled pork, grilled corn, and pasta salad',
        heroOfferings: ['BBQ Catering Buffets', 'HMC Sausages & Burgers', 'Ravinia Picnic Baskets', 'Seasonal Pasta Salad'],
        sellingPoints: [
            'The last relaxed summer gathering before school and fall sports lock in every weekend.',
            'Low-effort drop-off buffets let parents enjoy the long weekend without a massive grocery trip.',
            'Great cross-sell for closing-week Ravinia lawn concerts and early college football watch parties.',
        ],
        butcherPitch: 'Bundle a pulled pork tray with mixed HMC sausages for an easy mix of ready-to-eat and quick-grill.',
        socialPosts: {
            bestPostWindow: 'Post 10–12 days before Labor Day Weekend',
            facebook:
                'One last summer blowout before school and fall sports take over every weekend. Grab our craft HMC sausages and prime burger packs for the grill, or let us drop off a complete smoked pulled pork & brisket buffet with Seasonal Pasta Salad and Butchers Beans. Reserve your Labor Day spread at hofherrmeatco.com/catering.',
            instagram:
                'Send summer off properly. 🍔🌭 Craft butcher sausages, prime cheddar burgers, oak-smoked pulled pork, and closing-week Ravinia picnic baskets — ready for your Labor Day weekend. Order at the link in bio. #HofherrMeatCo #LaborDayGrill #NorthfieldIL #RaviniaPicnic',
            story: 'ONE LAST SUMMER BLOWOUT 🔥 Craft Sausages · Prime Burgers · Smoked Pulled Pork Trays. Order for Labor Day!',
        },
    },
    {
        id: 'high-holidays',
        name: 'Rosh Hashanah & Yom Kippur',
        timing: 'September – October',
        season: 'fall',
        demandLevel: 'Peak Allocation',
        leadTime: '7–10 days ahead',
        typicalGroup: '12–35 guests',
        image: '/assets/holidays/high-holidays-brisket-chicken.jpg',
        imageAlt: 'Slow-braised first-cut beef brisket in rich caramelized onion gravy with roasted root vegetables and herb-roasted whole chicken',
        heroOfferings: ['First-Cut Beef Brisket', 'Whole Pasture-Raised Chickens', 'Custom-Trimmed Chuck & Shoulder Roasts'],
        sellingPoints: [
            'Consistent, evenly trimmed first-cut briskets braise tender and slice cleanly for large family tables.',
            'Portioned accurately by headcount so hosts never run short or waste hundreds on oversized roasts.',
            'Trusted North Shore counter relationship — families pre-order the same cut year after year.',
        ],
        butcherPitch: 'Calculate 1/2 to 3/4 lb raw brisket per guest so there is plenty for dinner plus next-day sandwiches.',
        socialPosts: {
            bestPostWindow: 'Post 2–3 weeks before Rosh Hashanah',
            facebook:
                "Preparing for Rosh Hashanah and Yom Kippur? Our butchers trim every first-cut beef brisket evenly so it braises fork-tender and slices cleanly for the whole family — plus fresh pasture-raised whole chickens sized to your exact table. Tell us your headcount and we'll handle the math. Pre-order at (847) 441-MEAT.",
            instagram:
                'Trimmed for tender slices and full family tables. 🕯️ First-cut beef briskets and fresh pasture-raised chickens pre-ordered to your exact headcount for the High Holidays. Call or reserve online at the link in bio. #HofherrMeatCo #RoshHashanah #HolidayBrisket #NorthShoreIL',
            story: 'HIGH HOLIDAY PRE-ORDERS OPEN 🕯️ Custom-trimmed First-Cut Briskets & Pasture-Raised Chickens. Call (847) 441-MEAT.',
        },
    },
    {
        id: 'thanksgiving',
        name: 'Thanksgiving & Friendsgiving',
        timing: 'Late November',
        season: 'fall',
        demandLevel: 'Peak Allocation',
        leadTime: '14–21 days ahead',
        typicalGroup: '10–30 guests',
        image: '/assets/holidays/thanksgiving-heritage-turkey.jpg',
        imageAlt: 'Golden crisp-skinned fresh pasture-raised heritage roast turkey on dark butcher block beside sliced smoked turkey breast and gravy',
        heroOfferings: ['Fresh Pasture-Raised Turkeys', 'Smoked Turkey Breast', 'Italian Beef (Day-After)', 'Charcuterie Boards'],
        sellingPoints: [
            'Fresh, never-frozen heritage birds deliver noticeably juicier breast meat and crispier skin.',
            'Spatchcocking and custom prep at the butcher block cut oven roast time by up to 30%.',
            'Friendsgiving hosts and day-after-Thanksgiving families love Italian beef and smoked brisket for variety.',
        ],
        butcherPitch: 'Always pitch a Friday Italian Beef pack alongside the turkey order — nobody wants turkey sandwiches for 4 days straight.',
        socialPosts: {
            bestPostWindow: 'Post Nov 1–12 (turkey allocation) + Nov 18 (Friendsgiving & Friday Italian Beef)',
            facebook:
                "Fresh, never-frozen pasture-raised heritage turkeys are now open for Thanksgiving pre-order! Want it spatchcocked to cut your oven time by 30%? Just ask at the block. Pro tip: add a pound or two of our famous Italian Beef for Friday — because nobody wants turkey sandwiches four days in a row. Reserve at hofherrmeatco.com/online-orders.",
            instagram:
                'Fresh, never frozen — and we can spatchcock it for you at the block. 🦃✨ Pasture-raised heritage turkeys, smoked turkey breast, and day-after Italian Beef packs are open for Thanksgiving pre-order. Link in bio before allocation fills. #HofherrMeatCo #ThanksgivingTurkey #NorthShoreFoodie #NorthfieldIL',
            story: 'THANKSGIVING TURKEY PRE-ORDERS ARE LIVE 🦃 Fresh Heritage Birds · Smoked Turkey Breast · Friday Italian Beef. Tap to reserve!',
        },
    },
    {
        id: 'december-holidays',
        name: "Hanukkah, Christmas & New Year's Eve",
        timing: 'December',
        season: 'winter',
        demandLevel: 'Peak Allocation',
        leadTime: '10–14 days ahead',
        typicalGroup: '10–60+ guests',
        image: '/assets/holidays/december-holidays-prime-rib.jpg',
        imageAlt: 'Standing bone-in USDA Prime rib roast tied with butcher twine beside sliced herb-roasted porchetta and dark slate charcuterie in candlelight',
        heroOfferings: ['Standing Prime Rib Roast', 'Whole Beef Tenderloin', 'Porchetta', 'Holiday Office Buffets'],
        sellingPoints: [
            'Standing rib roasts (cut off the bone and tied back on) make carving at the table effortless.',
            'Corporate holiday parties and neighborhood open houses drive peak December catering tray volume.',
            'Pre-ordering locks in USDA Prime grade allocation before the final-week rush sells out.',
        ],
        butcherPitch: 'Remind corporate clients in November to lock their December buffet date before mid-month slots close.',
        socialPosts: {
            bestPostWindow: 'Post late Nov for office buffets; Dec 1–14 for Prime Rib & Tenderloin pre-orders',
            facebook:
                "Lock in your December centerpiece before USDA Prime allocation sells out. We cut every Standing Prime Rib Roast off the bone and tie it back on so carving at the table is effortless — alongside whole beef tenderloins, herb-roasted porchetta, and turnkey holiday office party buffets. Reserve at hofherrmeatco.com or (847) 441-MEAT.",
            instagram:
                "Tied, seasoned, and ready to steal the show. ✨🥩 Standing USDA Prime Rib Roasts, herb-roasted porchetta, beef tenderloins, and holiday catering trays — pre-order now for Hanukkah, Christmas & New Year's Eve. Link in bio. #HofherrMeatCo #PrimeRib #HolidayCatering #ChristmasDinner #NorthShoreIL",
            story: 'DECEMBER CENTERPIECES & OFFICE BUFFETS ✨🥩 Standing Prime Rib · Porchetta · Tenderloin. Lock in your allocation now!',
        },
    },
];

export const OTHER_CATERING_OCCASIONS: OtherCateringOccasion[] = [
    {
        id: 'graduations',
        title: 'Graduation Parties & Open Houses',
        when: 'May – June (Weekends)',
        category: 'Social & Family',
        typicalGroup: '40–200+ guests',
        leadTime: '2–4 weeks ahead',
        bestFitPackage: 'BBQ Catering Buffet or Whole-Pig Roast',
        sellingPoints: [
            'Open-house guests arrive in waves over 4+ hours — smoked brisket, pulled pork, and pulled chicken hold quality far better than plated food.',
            'Zero stress for parents hosting New Trier, Loyola, Glenbrook North, or college grad celebrations.',
            'Scales effortlessly with buns, house sauces, Pimento Mac n Cheese, and HMCo.Slaw.',
        ],
        counterTip: 'Parents start inquiring right after spring break — feature grad packages in April newsletters.',
    },
    {
        id: 'ravinia-concerts',
        title: 'Ravinia Festival & Outdoor Concert Nights',
        when: 'June – September (Thu – Sun)',
        category: 'Seasonal & Sports',
        typicalGroup: '4–20 guests',
        leadTime: '24–48 hours ahead',
        bestFitPackage: 'Custom Concert Picnic Baskets',
        sellingPoints: [
            'North Shore ritual: grab a packed Hofherr basket on the way to Highland Park instead of scrambling at the grocery store.',
            'Charcuterie, artisan sandwiches, pimento cheese + crackers, and chilled salads travel cleanly on the lawn.',
            'High repeat frequency — the same groups attend 3–6 concerts every summer.',
        ],
        counterTip: 'Mention Winnetka Depot & Northfield pickup convenience for pre-concert traffic.',
    },
    {
        id: 'game-day-tailgates',
        title: 'Bears Sundays, March Madness & Big Ten Tailgates',
        when: 'September – March',
        category: 'Seasonal & Sports',
        typicalGroup: '12–40 guests',
        leadTime: '3–4 days ahead',
        bestFitPackage: 'Game Day & Tailgate Spread',
        sellingPoints: [
            'Brisket, pulled pork, rib tips, hot links, and Italian beef turn any living room or parking lot into a destination.',
            'Built for self-serve grazing during halftime with minimal utensils and fast cleanup.',
            'Recurring weekly habit across NFL, college football, and tournament weekends.',
        ],
        counterTip: 'Suggest a 2-meat + 1-appetizer combo (chorizo dates or pimento dip) for 15-person watch parties.',
    },
    {
        id: 'corporate-buffets',
        title: 'Corporate Lunches, Offsites & Client Appreciation',
        when: 'Tuesday – Thursday (Year-Round)',
        category: 'Corporate & Community',
        typicalGroup: '15–150 guests',
        leadTime: '4–7 days ahead',
        bestFitPackage: 'Business Buffets (From $16/pp)',
        sellingPoints: [
            'Instant upgrade over tired chain sandwich platters — clients and teams actually remember the meal.',
            'Fills midweek kitchen capacity (Tue–Thu) when weekend private events are quiet.',
            'Reliable North Shore drop-off within 5 miles (+$50) with clear, invoice-friendly per-person pricing.',
        ],
        counterTip: 'Include grilled Lion\'s Mane mushrooms and Seasonal Salad so vegetarian attendees feel genuinely cared for.',
    },
    {
        id: 'block-parties',
        title: 'Neighborhood Block Parties & Cul-de-Sac Cookouts',
        when: 'June – September (Saturdays)',
        category: 'Corporate & Community',
        typicalGroup: '50–150+ guests',
        leadTime: '2–3 weeks ahead',
        bestFitPackage: 'Full-Service Whole-Pig Roast (From $30/pp)',
        sellingPoints: [
            'The live whole-hog carving demonstration becomes the centerpiece entertainment of the entire block.',
            'Neighbors split the cost per household, making a $30/pp full-service roast surprisingly affordable.',
            'Creates huge word-of-mouth — dozens of local homeowners taste Hofherr in a single afternoon.',
        ],
        counterTip: 'Our team arrives 1 hour before serving with the hog fully roasted, carved, and sampled on site.',
    },
    {
        id: 'milestones-rehearsals',
        title: 'Milestone Birthdays, Anniversaries & Rehearsal Dinners',
        when: 'Friday – Sunday (Year-Round)',
        category: 'Social & Family',
        typicalGroup: '8–80 guests',
        leadTime: '1–3 weeks ahead',
        bestFitPackage: 'Custom BBQ Spread or Private Meat Session (8–10)',
        sellingPoints: [
            'For 25–80 guests, backyard BBQ & standing roasts deliver warmth and spectacle without banquet-hall stiffness.',
            'For intimate 8–10 guest milestones, after-hours Private Meat Sessions at the shop offer a one-of-a-kind multi-course tasting.',
            'Customizable menus accommodate everything from casual backyard to elevated chef-carved service.',
        ],
        counterTip: 'Pitch Private Meat Sessions to regulars celebrating 40th/50th birthdays or executive dinners.',
    },
    {
        id: 'showers-baptisms',
        title: 'Baby Showers, Bridal Showers & Baptisms',
        when: 'Year-Round (Saturday & Sunday Afternoons)',
        category: 'Social & Family',
        typicalGroup: '20–60 guests',
        leadTime: '5–7 days ahead',
        bestFitPackage: 'Charcuterie + Rotisserie / Pulled Chicken + Salads',
        sellingPoints: [
            'Crowd-pleasing, approachable menu that works for grandparents, parents, and kids alike.',
            'Butcher Charcuterie Boards, pulled chicken, rotisserie dinners, and house salads feel polished without being heavy.',
            'Drop-off trays let family hosts focus on guests and photos instead of kitchen timers.',
        ],
        counterTip: 'Highlight HMCo.Slaw, Seasonal Pasta Salad, and Potato Salad alongside pulled chicken or Italian beef.',
    },
    {
        id: 'bereavement-shiva',
        title: 'Bereavement, Shiva & Community Meal Trains',
        when: 'Year-Round (Short Notice)',
        category: 'Social & Family',
        typicalGroup: '15–60 guests',
        leadTime: '24–72 hours (priority accommodated)',
        bestFitPackage: 'Ready-to-Serve Comfort Trays (Italian Beef, Brisket, Rotisserie)',
        sellingPoints: [
            'Grieving families need warm, nourishing, zero-effort meals that reheat cleanly over several days.',
            'Friends and neighbors frequently pool together to order a complete spread from a trusted local butcher.',
            'Thoughtful, reliable service during a difficult week builds lifelong customer loyalty.',
        ],
        counterTip: 'Always pack clear reheating notes and extra jus/sauces on the side so nothing dries out.',
    },
    {
        id: 'golf-fundraisers',
        title: 'Golf Outings, Charity Fundraisers & School Boosters',
        when: 'May – October',
        category: 'Corporate & Community',
        typicalGroup: '50–500+ guests',
        leadTime: '2–4 weeks ahead',
        bestFitPackage: 'High-Volume BBQ Buffet or Pig Roast',
        sellingPoints: [
            'Transparent per-person pricing helps volunteer committees stay strictly on budget.',
            'Fast buffet-line throughput feeds 100+ golfers or booster families right after the final round.',
            'Local Northfield & Winnetka brand recognition adds immediate credibility to community events.',
        ],
        counterTip: 'Recommend 2 meats + 2 sides + cornbread/buns for quick plate assembly in large tented venues.',
    },
    {
        id: 'friday-hosting',
        title: 'Friday Night Dinners & "No-Cook" Hosting Weekends',
        when: 'Every Friday & Saturday',
        category: 'Social & Family',
        typicalGroup: '6–16 guests',
        leadTime: 'Same day – 48 hours',
        bestFitPackage: 'Italian Beef by the Lb + Rotisserie Chickens + Appetizer Trays',
        sellingPoints: [
            'Bridges the gap between everyday counter shopping and formal catering for smaller 6–16 person dinners.',
            'World-famous Italian beef (featured on America’s Test Kitchen) and daily pasture-raised rotisserie chickens are instant crowd winners.',
            'Pimento Cheese + Crackers ($20/tray) and chorizo dates add easy host-ready appetizers.',
        ],
        counterTip: 'Remind walk-in Friday shoppers that calling ahead reserves rotisserie birds before they sell out.',
    },
];

export const PLANNING_MATRIX_ROWS: PlanningMatrixRow[] = [
    {
        id: 'jan-feb',
        occasion: "Super Bowl & Valentine's Day",
        peakWindow: 'Early – Mid Feb',
        leadTime: '4–7 days',
        topSeller: 'Smoked Brisket, Rib Tips, Prime Filet',
        sellingAngle: 'Effortless 4-quarter spread; steakhouse quality at home',
    },
    {
        id: 'mar-apr',
        occasion: "St. Patrick's, Easter & Passover",
        peakWindow: 'Mid Mar – Apr',
        leadTime: '7–10 days',
        topSeller: 'House Corned Beef, Rack/Leg of Lamb, Brisket',
        sellingAngle: 'Small-batch cure & custom-trimmed, tied centerpieces',
    },
    {
        id: 'may-jun',
        occasion: "Mother's Day, Memorial Day, Grads & Father's Day",
        peakWindow: 'May – June',
        leadTime: '1–3 weeks',
        topSeller: 'BBQ Buffets, Whole-Pig Roasts, Prime Steaks',
        sellingAngle: 'Open-house grazing crowds & zero-grill-stress hosting',
    },
    {
        id: 'jul-aug',
        occasion: 'July 4th, Ravinia & Block Parties',
        peakWindow: 'July – Aug',
        leadTime: '48 hrs – 3 weeks',
        topSeller: 'Whole-Pig Roasts, Concert Picnic Baskets, BBQ',
        sellingAngle: 'Live hog carving spectacle & grab-and-go lawn baskets',
    },
    {
        id: 'sep-oct',
        occasion: 'Labor Day, High Holidays & Football Tailgates',
        peakWindow: 'Sept – Oct',
        leadTime: '4–10 days',
        topSeller: 'First-Cut Brisket, Tailgate Spreads, Sausages',
        sellingAngle: 'Exact headcount portioning & recurring game-day spreads',
    },
    {
        id: 'nov',
        occasion: 'Thanksgiving & Friendsgiving',
        peakWindow: 'Late Nov',
        leadTime: '2–3 weeks',
        topSeller: 'Fresh Heritage Turkeys, Smoked Breast, Italian Beef',
        sellingAngle: 'Never-frozen birds, spatchcock prep & day-after beef trays',
    },
    {
        id: 'dec',
        occasion: "Hanukkah, Christmas, NYE & Office Parties",
        peakWindow: 'December',
        leadTime: '10–14 days',
        topSeller: 'Standing Prime Rib, Tenderloin, Corporate Buffets',
        sellingAngle: 'Guaranteed Prime allocation & turnkey holiday party trays',
    },
    {
        id: 'year-round',
        occasion: 'Corporate Lunches, Showers, Shiva & Fri Hosting',
        peakWindow: 'Year-Round',
        leadTime: '24 hrs – 7 days',
        topSeller: 'Business Buffets ($16+/pp), Rotisserie, Charcuterie',
        sellingAngle: 'Midweek B2B reliability & compassionate, ready-to-serve trays',
    },
];
