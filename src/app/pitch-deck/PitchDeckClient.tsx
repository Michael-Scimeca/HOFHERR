'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const COMPETITIVE_SCORECARD = [
    { label: 'Meat Quality, Dry-Aging & Farm Provenance', hofherrPct: 98, rivalPct: 72, rivalName: 'Grand / Sunset (72%)' },
    { label: 'Hero Hot Sandwiches (Shabu Italian Beef)', hofherrPct: 97, rivalPct: 68, rivalName: 'Local Delis (68%)' },
    { label: 'House Sausages & Gourmet Freezer Meals', hofherrPct: 95, rivalPct: 88, rivalName: 'Paulina Market (88%)' },
    { label: 'Commuter Pickup Convenience (Metra Depot)', hofherrPct: 96, rivalPct: 45, rivalName: 'City Butchers (45%)' },
    { label: 'Digital Cut Guide, BBQ & Pig Roast Calculators', hofherrPct: 97, rivalPct: 60, rivalName: 'Local Butchers (60%)' },
    { label: 'Holiday Express & Subscription Value (With Fixes)', hofherrPct: 94, rivalPct: 82, rivalName: 'ButcherBox / SRF (82%)' },
];

type SlideData = {
    num: string;
    shortLabel: string;
    category: string;
    title: string;
    summary: string;
    leftColTitle: string;
    leftColTag: string;
    leftColType: 'pain' | 'fix';
    leftBullets: string[];
    rightColTitle: string;
    rightColTag: string;
    rightColType: 'pain' | 'fix';
    rightBullets: string[];
    bottomTakeaway: string;
};

type BusinessDepartment = {
    id: string;
    deptCode: string;
    name: string;
    role: string;
    margin: string;
    aov: string;
    currentStrength: string;
    currentBottleneck: string;
    competitorPlay: string;
    hofherrUpgrade: string;
    kpis: string[];
};

type CompetitorEntry = {
    name: string;
    tier: 'North Shore Local' | 'Chicago Heritage' | 'National DTC';
    locations: string;
    pricePositioning: string;
    whatTheyDoWell: string[];
    theirWeakness: string;
    whatWeStealOrBeat: string;
};

type GrowthEngine = {
    id: string;
    title: string;
    department: string;
    unitMath: string;
    annualRevenue: number;
    grossMarginPct: number;
    annualProfit: number;
};

type MatrixRow = {
    capability: string;
    hofherr: string;
    grandSunset: string;
    paulinaPqm: string;
    nationalDtc: string;
};

const GROWTH_ENGINES: GrowthEngine[] = [
    {
        id: 'butcher-club',
        title: '1. Hofherr Butcher Club Subscription ($149/mo)',
        department: 'Recurring DTC & Retention',
        unitMath: '100 local members × $149/mo × 12 mos (Prime cuts + sausages + priority holiday slot)',
        annualRevenue: 178800,
        grossMarginPct: 58,
        annualProfit: 103704,
    },
    {
        id: 'catering-bars',
        title: '2. Turnkey "Italian Beef Catering Bars" ($375 avg)',
        department: 'B2B, Events & Game Days',
        unitMath: '3.5 catering bars/week × $375 avg × 52 weeks (graduations, offices, Bears/Cubs parties)',
        annualRevenue: 68250,
        grossMarginPct: 66,
        annualProfit: 45045,
    },
    {
        id: 'freezer-pass',
        title: '3. "Stock Your Freezer" 5-for-$95 Meal Pass',
        department: 'Gourmet Freezer & Zero-Waste Yield',
        unitMath: '10 passes/week × $95 × 52 weeks (Chicken Pot Pie, Smoked Lamb Curry, 24-Hr Broth)',
        annualRevenue: 49400,
        grossMarginPct: 64,
        annualProfit: 31616,
    },
    {
        id: 'weeknight-bundles',
        title: '4. $54 Weeknight Family Dinner Bundles',
        department: 'Butcher Counter Merchandising',
        unitMath: '16 bundles/week × $54 avg × 52 weeks (wins Tuesday–Thursday share from Grand & Sunset)',
        annualRevenue: 44928,
        grossMarginPct: 52,
        annualProfit: 23362,
    },
    {
        id: 'monday-classes',
        title: '5. Monday Night "Butcher & Bourbon" Masterclasses',
        department: 'Dark-Hours Real Estate Monetization',
        unitMath: '2 Mondays/mo × 12 seats × $150/seat × 12 mos (monetizes Northfield when store is closed)',
        annualRevenue: 43200,
        grossMarginPct: 74,
        annualProfit: 31968,
    },
    {
        id: 'shabu-kits',
        title: '6. 4-Pack DIY "Shabu Italian Beef" Home Kits ($58)',
        department: 'Winnetka Depot & Northfield Cold Case',
        unitMath: '14 kits/week × $58 × 52 weeks (shifts 30-min hot lunch line into zero-wait cold kits)',
        annualRevenue: 42224,
        grossMarginPct: 65,
        annualProfit: 27445,
    },
    {
        id: 'cpg-jars',
        title: '7. Checkout CPG Wall (3-Yr Giardiniera, Jus, Tallow)',
        department: 'Retail Pantry & Packaging',
        unitMath: '40 jars/week × $14.50 avg × 52 weeks (high-margin impulse add-on at checkout)',
        annualRevenue: 30160,
        grossMarginPct: 72,
        annualProfit: 21715,
    },
    {
        id: 'corporate-gifting',
        title: '8. Q4 North Shore Corporate Client Gift Crates ($225)',
        department: 'B2B Corporate Gifting',
        unitMath: '140 Q4 gift crates × $225 avg (North Shore wealth, law & real estate firms)',
        annualRevenue: 31500,
        grossMarginPct: 62,
        annualProfit: 19530,
    },
];

const FEATURE_MATRIX: MatrixRow[] = [
    {
        capability: '45-Day Custom Dry-Aged & Cut-to-Order Steaks',
        hofherr: '✓ Core Flagship Moat (Northfield)',
        grandSunset: 'Limited pre-cut case',
        paulinaPqm: '✓ Yes (City drive required)',
        nationalDtc: 'Vacuum-frozen only',
    },
    {
        capability: 'Cult Hero Hot Sandwich (Shabu Italian Beef)',
        hofherr: '✓ Kevin Pang / ATK Collab + 3-Yr Giardiniera',
        grandSunset: 'Standard supermarket deli',
        paulinaPqm: '✓ PQM sandwiches (West Loop)',
        nationalDtc: '✕ None',
    },
    {
        capability: 'Metra Train Station Commuter Outpost',
        hofherr: '✓ Exclusive (Winnetka Elm St. Depot)',
        grandSunset: '✕ None',
        paulinaPqm: '✕ None',
        nationalDtc: '✕ None',
    },
    {
        capability: 'In-House Smoked Sausages & Gourmet Freezer',
        hofherr: '✓ "Best in Show" Links + Pot Pie / Lamb Curry',
        grandSunset: 'Mostly 3rd-party brands',
        paulinaPqm: '✓ Paulina 40+ links & freezer case',
        nationalDtc: 'Basic frozen add-ons',
    },
    {
        capability: 'Interactive Cut Guide & Pig Roast / BBQ Calculators',
        hofherr: '✓ Live on hofherrmeatco.com',
        grandSunset: 'Static PDF menus',
        paulinaPqm: 'Static web pages',
        nationalDtc: '✓ Porter Road Cut Guide',
    },
    {
        capability: 'One-Stop Weeknight Family Meal Bundles ($49–$65)',
        hofherr: '★ Launching (Phase 1 Fix)',
        grandSunset: '✓ Strong supermarket deli sides',
        paulinaPqm: '✓ Carnivore Oak Park dinner packs',
        nationalDtc: '✓ ButcherBox / SRF bundles',
    },
    {
        capability: 'Zero-Line Curbside & Dual-Hub Holiday Pickup',
        hofherr: '★ Launching (Happ Rd. Bays + Winnetka Hub)',
        grandSunset: 'Large supermarket parking lots',
        paulinaPqm: 'Crowded holiday ticket lines',
        nationalDtc: 'FedEx dry-ice box delivery',
    },
    {
        capability: 'Monthly Recurring Butcher Club Subscription',
        hofherr: '★ Launching ($149/mo — Zero Freight Waste)',
        grandSunset: '✕ None',
        paulinaPqm: '✕ None',
        nationalDtc: '✓ ButcherBox / Porter Road ($30 lost to shipping)',
    },
    {
        capability: 'Ticketed Evening Butcher & Bourbon Classes',
        hofherr: '★ Launching (Mon Dark-Hours @ $150/seat)',
        grandSunset: '✕ None',
        paulinaPqm: '✓ PQM West Loop classes',
        nationalDtc: '✕ None',
    },
    {
        capability: 'Bottled CPG Pantry Line (Aged Giardiniera / Tallow)',
        hofherr: '★ Launching (Checkout Impulse Wall)',
        grandSunset: 'Generic grocery shelves',
        paulinaPqm: '✓ Gene\'s & Paulina specialty jars',
        nationalDtc: 'Limited spice rubs',
    },
];

const SLIDES: SlideData[] = [
    {
        num: '01',
        shortLabel: '01 · Review Audit',
        category: 'Yelp (~4.7★) & Facebook (~4.8★) Audit',
        title: 'Where Hofherr Stands Today',
        summary:
            'Across Yelp, Facebook, Google, and r/chicagofood, Hofherr Meat Co. already commands what 99% of food businesses struggle to build: world-class meat quality, cult-status hero items, and deep neighborhood trust. Every negative review is operational—not culinary.',
        leftColTitle: 'What Customers Love (Core Moats)',
        leftColTag: '4.8★ Strengths',
        leftColType: 'fix',
        leftBullets: [
            'Cut-to-Order Prime & Dry-Aged Steaks (ribeyes, NY strips, skirt steaks) from traceable Midwestern family farms.',
            'The "World\'s Greatest" Italian Beef (shabu-shabu style chuck eye + 3-year-aged house giardiniera).',
            '"Best in Show" House-Made Sausages (cheddar jalapeño, breakfast links, seasonal brats).',
            'Gourmet Take-and-Bake Freezer Meals (chicken pot pie, smoked lamb curry, 24-hour kettle soups).',
            'Personal Expertise from Sean, Arielle, and the butcher counter team.',
        ],
        rightColTitle: 'What Frustrates Customers (Review Pain Points)',
        rightColTag: 'Operational Friction',
        rightColType: 'pain',
        rightBullets: [
            'Holiday Pickup Chaos: Long lines out the door during Thanksgiving/Christmas & occasional missing pre-ordered sides.',
            '30–45 Min Lunch Waits & Sell-Outs: Made-to-order hot specials back up during peak lunch rushes.',
            'Price "Sticker Shock": Casual shoppers compare per-pound steak prices or $16+ sandwiches to corporate supermarkets.',
            'Parking & Compact Storefront: The 300 S. Happ Rd. lot and interior feel cramped during peak rushes.',
            'Northfield vs. Winnetka Depot Confusion: First-timers confuse which location serves hot lunches vs. custom butcher cuts.',
        ],
        bottomTakeaway:
            'Core Thesis: Fixing logistics and price framing unlocks +$488k/yr in incremental revenue without changing a single recipe.',
    },
    {
        num: '02',
        shortLabel: '02 · 8 Business Sides',
        category: '360° Business Architecture & Whole-Animal P&L',
        title: 'Every Side of the Business Working as One Flywheel',
        summary:
            'A craft butcher shop wins or loses on whole-carcass utilization, labor allocation, real estate hours, and basket-building. Here is how all 8 sides of Hofherr connect.',
        leftColTitle: 'Supply Chain, Counter & Kitchen Sides',
        leftColTag: 'Margin & Yield',
        leftColType: 'fix',
        leftBullets: [
            '1. Whole-Animal Yield & Trim Economics: Steaks sell at 38–45% margin; trim is converted into 65%-margin sausages, smashburgers, 24-hr marrow broth, jus, and smoked beef tallow (0% waste).',
            '2. Labor & Counter Specialization: Separate custom butchery consultations from 30-second pre-paid online pickups so master butchers aren\'t stuck bagging orders.',
            '3. Hot Line & Cold Case Synergy: When the hot Italian Beef line hits capacity, overflow converts into $58 4-Pack DIY Shabu Beef Home Kits from the cold case.',
        ],
        rightColTitle: 'Commercial, Real Estate & Digital Sides',
        rightColTag: 'Scale & Retention',
        rightColType: 'fix',
        rightBullets: [
            '4. Real Estate & Dark-Hours Monetization: Turn closed Mondays at Northfield into $1,800/night "Butcher & Bourbon" classes; use Winnetka Metra Depot as an evening commuter pickup bridge.',
            '5. Pricing Psychology & Basket Building: Reframe per-pound steak prices into $12.50/person Weeknight Family Bundles + $14 checkout CPG jars (Aged Giardiniera, Tallow, Rubs).',
            '6. B2B, Corporate Gifting & Subscriptions: Lock in $149/mo Butcher Club recurring revenue + Q4 North Shore law/wealth-management gift crates.',
        ],
        bottomTakeaway:
            'Blended Gross Margin Target: Shift company-wide gross margin from ~44% to 56%+ through Freezer, CPG, Catering, and Subscription mix.',
    },
    {
        num: '03',
        shortLabel: '03 · North Shore Rivals',
        category: 'Competitor Intelligence · Local North Shore Supermarkets',
        title: 'Beating Grand Food Center & Sunset Foods',
        summary:
            'Our closest geographic rivals in Winnetka, Glencoe, and Northbrook are upscale neighborhood supermarkets. They win on parking and 1-stop grocery convenience—we win on craft, provenance, and culinary authority.',
        leftColTitle: 'What Local Supermarkets Do Well',
        leftColTag: 'Grand Food & Sunset',
        leftColType: 'pain',
        leftBullets: [
            'The Grand Food Center (Winnetka / Glencoe): Full grocery convenience, in-house smokehouse, daily hot lunch plates, sushi/guacamole, and easy party trays.',
            'Sunset Foods (Northbrook / Highland Park): Massive parking lots, dedicated catering portal (entertaining.sunsetfoods.com), corporate box lunches, and Slagel Farms poultry.',
            'Why We Lose Casual Tuesday Shoppers: Families default to Grand or Sunset on weeknights because they want protein + sides in one fast stop.',
        ],
        rightColTitle: 'How Hofherr Wins Back Weeknight Share',
        rightColTag: 'Hofherr Counter-Play',
        rightColType: 'fix',
        rightBullets: [
            'Complete Meal Merchandising: Pair every steak/roast with grab-and-go compound butters, charro beans, and twice-baked potatoes so Hofherr is a 1-stop dinner solution.',
            'Unmatched Craft Moat: Neither Grand nor Sunset offers 45-day custom dry-aging, shabu-style Italian Beef with 3-year-aged giardiniera, or direct access to Master Butcher Sean Hofherr.',
            'Express Curbside & Train Pickup: Beat supermarket checkout lines with 5-minute Happ Rd. curbside runners and Winnetka Metra train pickup.',
        ],
        bottomTakeaway:
            'Don\'t let supermarkets own Tuesday–Thursday: bundle proteins + sides into $49–$65 Weeknight Dinner Kits.',
    },
    {
        num: '04',
        shortLabel: '04 · Chicago Legends',
        category: 'Competitor Intelligence · Chicago Butcher Icons',
        title: 'Learning from Paulina Market, PQM & Gene\'s',
        summary:
            'Chicago\'s top destination butcher shops—Paulina Meat Market, Publican Quality Meats (PQM), Gene\'s Sausage Shop, and Carnivore Oak Park—prove how specialty markets scale AOV and event revenue.',
        leftColTitle: 'What Chicago Icons Do Best',
        leftColTag: 'Chicago Benchmarks',
        leftColType: 'fix',
        leftBullets: [
            'Paulina Meat Market (Lakeview): 40+ smoked sausage varieties, massive frozen entree wall (stroganoff, pot pies), and regimented holiday pre-order portals.',
            'Publican Quality Meats / PQM (West Loop): Chef-driven café, artisan corporate box lunches, farm provenance storytelling, and ticketed evening butcher classes.',
            'Gene\'s Sausage & Carnivore Oak Park: High-margin European pantry cross-sells (mustards, rubs, pickled jars) and rapid commuter dinner bundles.',
        ],
        rightColTitle: 'What Hofherr Adapts & Improves',
        rightColTag: 'Our Advantage',
        rightColType: 'fix',
        rightBullets: [
            'The "Gourmet Freezer Wall" Play (from Paulina): Bundle 5 frozen entrees/soups for $95 so every weekend steak buyer stocks their freezer for the week.',
            'Dark-Hours Classes & Corporate Boxes (from PQM): Host $150/seat Monday night "Butcher & Bourbon" classes when the shop is closed + launch North Shore Executive Box Lunches.',
            'High-Margin Pantry Checkout Wall (from Gene\'s): Merchandise 3-Yr-Aged Giardiniera, Smoked Beef Tallow, and House Rubs right at the register (+$18 AOV).',
        ],
        bottomTakeaway:
            'Hofherr is the only shop bringing West Loop culinary pedigree (PQM) + old-world sausage craft (Paulina) directly to the North Shore.',
    },
    {
        num: '05',
        shortLabel: '05 · National DTC Giants',
        category: 'Competitor Intelligence · National DTC Leaders',
        title: 'Digital Playbooks from Porter Road, SRF & ButcherBox',
        summary:
            'National direct-to-consumer butchers spend millions optimizing digital conversion, subscription retention, and cut education. We bring their best digital tools to a hyper-local level.',
        leftColTitle: 'National DTC Conversion Playbooks',
        leftColTag: 'National Benchmarks',
        leftColType: 'fix',
        leftBullets: [
            'Porter Road & Flannery Beef: Interactive cut education, dry-aging weight-loss explainers, and recipe-to-cart cross-selling for lesser-known cuts (denver, flat iron, picanha).',
            'Snake River Farms (Club SRF): Tiered loyalty points, VIP holiday allocation access, and high-converting curated gift boxes.',
            'ButcherBox: Frictionless monthly recurring meat boxes ("skip, swap, or pause anytime") with member-only perks.',
        ],
        rightColTitle: 'Why Hofherr Beats National DTC Locally',
        rightColTag: 'Zero Shipping Waste',
        rightColType: 'fix',
        rightBullets: [
            'Zero Dry-Ice / Styrofoam Shipping Cost: National DTCs spend $25–$40 per box on overnight shipping and insulation. Hofherr delivers fresh (never deep-frozen in transit) across the North Shore.',
            'Hofherr Butcher Club ($149/mo): Local monthly curated box with 100% of the dollar going into USDA Prime & dry-aged meat rather than FedEx freight.',
            'Interactive Cut Guide + QR Video Tags: Already built on hofherrmeatco.com/cut-guide—now linked via QR stickers on every wrapped parcel.',
        ],
        bottomTakeaway:
            'National DTC convenience + fresh same-day Northfield/Winnetka pickup = unbeatable unit economics.',
    },
    {
        num: '06',
        shortLabel: '06 · Fix #1: Holidays',
        category: 'Operational Fix #1 · Holiday Fulfillment',
        title: 'Solving the Holiday Pickup Bottleneck',
        summary:
            'Thanksgiving (pre-carved chargrilled turkeys) and Christmas (prime ribs, briskets) are our biggest volume days—and our #1 source of review complaints. We eliminate sidewalk lines and packing errors.',
        leftColTitle: 'The Customer Pain Point',
        leftColTag: 'Review Critique',
        leftColType: 'pain',
        leftBullets: [
            'Hundreds of pre-ordered turkeys and roasts converge on the compact 300 S. Happ Rd. shop in narrow windows.',
            'Parking lot gridlock and sidewalk lines frustrate customers who already pre-ordered weeks in advance.',
            'Rushed single-person packing under pressure leads to occasional forgotten gravies, stuffings, or sides.',
        ],
        rightColTitle: 'The "Zero-Line" Holiday Protocol',
        rightColTag: 'Operational Fix',
        rightColType: 'fix',
        rightBullets: [
            'Curbside Express Zones: Dedicate 3 parking spots on Happ Rd. as 5-Minute Express Bays—customers text their bay number and a runner loads their trunk (keeps 60%+ of pickups out of the shop).',
            'Two-Signature Packing Slip: Every holiday box requires two staff initials (Packer + Runner) on a printed side-dish checklist before sealing.',
            'Dual-Hub Pickup (Winnetka Depot): Allow east-side customers to pick up pre-packed holiday boxes at The Depot, cutting Northfield traffic by 30–40%.',
        ],
        bottomTakeaway:
            'Target KPI: Cut holiday wait times under 5 minutes and reach 100.0% side-dish packing accuracy.',
    },
    {
        num: '07',
        shortLabel: '07 · Fix #2: Lunch Waits',
        category: 'Operational Fix #2 · Hot Food Throughput',
        title: 'Slashing 30–45 Min Waits on Italian Beef',
        summary:
            'Cooking chuck eye shabu-shabu style per sandwich is why our Italian Beef is legendary—but 30–45 minute peak lunch waits and unexpected sell-outs frustrate busy North Shore customers.',
        leftColTitle: 'The Customer Pain Point',
        leftColTag: 'Wait Friction',
        leftColType: 'pain',
        leftBullets: [
            'Made-to-order slicing and dipping creates a kitchen bottleneck between 11:45 AM and 1:15 PM.',
            'Walk-in customers aren\'t aware of a 30+ minute queue until they are already inside.',
            'Daily specials or weekend fried chicken & biscuits sell out early without live online notice.',
        ],
        rightColTitle: 'Pre-Order Throttling & Take-Home Kits',
        rightColTag: 'Throughput Fix',
        rightColType: 'fix',
        rightBullets: [
            'Timed 10-Minute Mobile Pickup Windows: Cap orders per 10-minute slot online; display live digital wait quotes for walk-ins.',
            'Live Daily Batch Counter: Show remaining daily Italian Beef count online & on Instagram Stories ("85 Beefs today—reserve by 11:15 AM"), turning scarcity into VIP urgency.',
            'DIY "Shabu Beef" Home Kits: Sell refrigerated 4-Pack Take-Home Kits (sliced chuck eye, quart of house jus, rolls, aged giardiniera) for $58 with zero wait.',
        ],
        bottomTakeaway:
            'Target KPI: Sub-10-minute pickup for mobile pre-orders + 30% of lunch demand shifted into $58 Take-Home Kits.',
    },
    {
        num: '08',
        shortLabel: '08 · Fix #3: Pricing',
        category: 'Operational Fix #3 · Merchandising & Pricing Psychology',
        title: 'Reframing Price Perception ("Sticker Shock")',
        summary:
            'We never compete on cheap supermarket meat. Instead, we reframe per-pound pricing into approachable weeknight meal bundles, farm-to-table transparency, and Good/Better/Best counter architecture.',
        leftColTitle: 'The Customer Pain Point',
        leftColTag: 'Price Perception',
        leftColType: 'pain',
        leftBullets: [
            'First-time shoppers experience sticker shock comparing Prime dry-aged per-pound prices to corporate grocery chains.',
            'Shoppers hesitate to spend $45+ on a single steak for a casual Tuesday–Thursday family dinner.',
            'Customers don\'t always realize dry-aging removes 20–25% water weight to concentrate flavor.',
        ],
        rightColTitle: 'Per-Person Meal Framing & Tiered Cuts',
        rightColTag: 'Merchandising Fix',
        rightColType: 'fix',
        rightBullets: [
            'Weeknight Family Dinner Bundles ($49–$65): Fixed-price meals for 4 (~$12–$15/person) like "Butcher\'s Smashburger Night" or "Marinated Skirt Steak Fiesta."',
            'Spotlight "Butcher\'s Secret" Value Cuts: Merchandise flat iron, hanger, denver, and teres major ($16–$24/lb) alongside $45+ dry-aged ribeyes.',
            '"Why Hofherr" Butcher Cards: Include a card in every bag explaining Midwestern farm lineage, dry-age moisture loss, and exact sear temps.',
        ],
        bottomTakeaway:
            'When framed at $12.50/person for a family of 4, Hofherr is cheaper than Chipotle or Panera—for Prime butcher quality.',
    },
    {
        num: '09',
        shortLabel: '09 · Fix #4: 2 Locations',
        category: 'Operational Fix #4 · Omnichannel & Commuter Bridge',
        title: 'Ending Northfield vs. Winnetka Depot Confusion',
        summary:
            'Turning two locations—300 S. Happ Rd. (Northfield) and The Depot (Winnetka Elm St. Metra Station)—from a point of first-time visitor confusion into a North Shore commuter superpower.',
        leftColTitle: 'The Customer Pain Point',
        leftColTag: 'Channel Confusion',
        leftColType: 'pain',
        leftBullets: [
            'First-time visitors arrive at Northfield expecting Winnetka Depot hot commuter items, or visit The Depot expecting the full custom butcher counter.',
            'Boutique hours (closed Mondays in Northfield; closes 4 PM Sun / 5 PM Sat / 6 PM weekdays) catch late commuters off guard.',
        ],
        rightColTitle: 'Unified Messaging & Metra Commuter Bridge',
        rightColTag: 'Omnichannel Fix',
        rightColType: 'fix',
        rightBullets: [
            'Clear Two-Location Badges on Yelp, FB & Web: Instantly distinguish Northfield Flagship (Full Butcher, Dry-Aged, Freezer, Catering) vs. Winnetka Depot (Hot Italian Beef, Coffee, Grab-and-Go).',
            '"Order from Northfield, Grab at the Train": Order custom steaks by 1:00 PM from Northfield and pick them up chilled at Winnetka Depot stepping off the evening Metra.',
            'After-Hours Smart Refrigerated Lockers: Pre-paid PIN pickup for post-6:00 PM commuters.',
        ],
        bottomTakeaway:
            'No other butcher shop on the North Shore owns a Metra train station outpost—make it our #1 commuter convenience hook.',
    },
    {
        num: '10',
        shortLabel: '10 · Fix #5: Space & Parking',
        category: 'Operational Fix #5 · Real Estate & Traffic Flow',
        title: 'Solving Compact Storefront & Happ Rd. Parking Friction',
        summary:
            'The Northfield Village Center strip lot gets tight on weekends and pre-holiday afternoons, and a compact counter area can feel crowded when walk-in browsers mix with pre-paid pickups.',
        leftColTitle: 'The Customer Pain Point',
        leftColTag: 'Physical Footprint',
        leftColType: 'pain',
        leftBullets: [
            'Pre-paid online order customers wait in the same line as customers asking for custom-cut steaks and cooking advice.',
            'Weekend peak hours (11:30 AM – 2:00 PM) congest the shared Happ Rd. parking lot.',
        ],
        rightColTitle: 'Express Counter Lane & Local Delivery',
        rightColTag: 'Traffic Flow Fix',
        rightColType: 'fix',
        rightBullets: [
            'Dedicated "Pre-Paid Express Shelf / Window": Pre-paid online orders skip the butcher counter queue completely—grab, verify name, and go in 30 seconds.',
            'Off-Peak Pickup Incentive: Offer a free 4oz jar of house steak rub or beef tallow for orders scheduled between 1:30 PM and 3:30 PM Tuesday–Thursday.',
            'North Shore Local Delivery Route ($125+ Orders): Afternoon insulated van drop-offs across Northfield, Winnetka, Wilmette, Kenilworth, and Glencoe.',
        ],
        bottomTakeaway:
            'Shifting 30% of pickups to Express/Off-Peak/Delivery doubles Northfield revenue capacity without expanding square footage.',
    },
    {
        num: '11',
        shortLabel: '11 · Growth #1: Italian Beef & CPG',
        category: 'Growth Engine #1 · High-Margin CPG & Viral Moat',
        title: 'Scaling the "World\'s Greatest" Italian Beef & Pantry Line',
        summary:
            'Our collaboration with Kevin Pang / America\'s Test Kitchen earned regional culinary fame that money cannot buy. Now we scale it into high-margin retail jars, catering bars, and nationwide boxes.',
        leftColTitle: 'Why It Is Our #1 Viral Asset',
        leftColTag: 'Core Strength',
        leftColType: 'fix',
        leftBullets: [
            'Heavily praised across Reddit (r/chicagofood), WTTW, and local press as a masterclass Chicago Italian Beef.',
            'Proprietary 3-year-aged house giardiniera and rich bone-broth jus cannot be replicated by fast-casual chains.',
        ],
        rightColTitle: 'How We Monetize It 4 Ways',
        rightColTag: '65–72% Margin Play',
        rightColType: 'fix',
        rightBullets: [
            '1. Retail CPG Jar Line: Bottle and merchandise 3-Year-Aged House Giardiniera ($14), Concentrated Jus ($16), Smoked Beef Tallow ($14), and Black Truffle Steak Butter ($12).',
            '2. Turnkey "Italian Beef Catering Bars" ($275–$550): Game-day, graduation, and office catering kits with warming trays—20x the ticket size with zero lunch-line congestion.',
            '3. Nationwide Goldbelly Shipping: Ship frozen 8-pack Italian Beef kits to Chicago expats nationwide.',
        ],
        bottomTakeaway:
            'Every steak customer should leave with a $14 jar of 3-Year-Aged Giardiniera or House Tallow.',
    },
    {
        num: '12',
        shortLabel: '12 · Growth #2: Sausages & Freezer',
        category: 'Growth Engine #2 · Repeat Visits & Zero-Waste Flywheel',
        title: 'Supercharging House Sausages & The Gourmet Freezer',
        summary:
            'Reviewers repeatedly call our in-house sausages "best in show" and rave about our Chicken Pot Pie, Smoked Lamb Curry, and 24-hour kettle soups.',
        leftColTitle: 'Why Customers Come Back Weekly',
        leftColTag: 'Core Strength',
        leftColType: 'fix',
        leftBullets: [
            'Cheddar jalapeño links, breakfast sausages, and seasonal brats have cult loyalty among local families.',
            'Prepared frozen meals (Chicken Pot Pie, Smoked Lamb Curry) solve the busy North Shore weeknight dinner problem.',
            'Converts trim from whole-animal butchery into 60%+ margin products with zero spoilage.',
        ],
        rightColTitle: 'How We Make It Even Better',
        rightColTag: '+30% AOV Play',
        rightColType: 'fix',
        rightBullets: [
            '"Sausage of the Month" SMS Drops: Limited Friday-morning drops (Maple-Bourbon Breakfast, Chorizo Verde, Oktoberfest Brat Flight) that drive immediate weekend traffic.',
            '"Stock Your Freezer" 5-for-$95 Pass: Bundle 5 gourmet frozen entrees/soups at checkout when customers buy weekend steaks—lifting Average Order Value (AOV) by +25% to +35%.',
            'Sampler Brat Flights: 6-link mixed packs for summer grilling so first-timers taste 3 varieties at once.',
        ],
        bottomTakeaway:
            'Our freezer wall is our secret weapon against Grand Food Center and Sunset Foods.',
    },
    {
        num: '13',
        shortLabel: '13 · Growth #3: B2B & Dark Hours',
        category: 'Growth Engine #3 · B2B Wholesale, Corporate & Experiential',
        title: 'B2B Accounts, Corporate Gifting & Monday Masterclasses',
        summary:
            'Reviews consistently praise Sean, Arielle, and the counter staff by name for custom cuts and cooking advice. We monetize that authority across B2B, corporate gifting, and dark store hours.',
        leftColTitle: 'Untapped High-Ticket Channels',
        leftColTag: 'New Revenue Streams',
        leftColType: 'fix',
        leftBullets: [
            'Northfield shop sits dark on Mondays and after 6:00 PM—fixed rent with zero evening revenue.',
            'North Shore wealth management, law, and real estate firms spend heavily on Q4 client gifts (currently buying from Omaha Steaks or Snake River Farms).',
        ],
        rightColTitle: 'How We Capture High-Ticket Demand',
        rightColTag: 'High-ROI Plays',
        rightColType: 'fix',
        rightBullets: [
            'Monday Night "Butcher & Bourbon" Masterclasses: 12-person ticketed evenings ($150/seat = $1,800/night) teaching steak cutting, sausage linking, and dry-aged tasting.',
            'Q4 Corporate Client Gift Concierge: Custom-stamped wooden crates with Dry-Aged Ribeyes + 3-Yr Giardiniera + Hofherr Steak Rub ($175–$350/box) for local North Shore firms.',
            'QR "Cook It Right" Butcher Paper Tags: 45-second video of Sean on every wrapped steak so customers never overcook a $50 cut at home.',
        ],
        bottomTakeaway:
            'Just two Monday classes/month + 140 Q4 corporate gift boxes adds $74,700+ in high-margin annual revenue.',
    },
    {
        num: '14',
        shortLabel: '14 · 90-Day Roadmap & ROI',
        category: 'Execution Plan & Financial Projections',
        title: '90-Day Rollout & Projected Business Impact',
        summary:
            'A sequenced 30/60/90-day implementation plan that leverages the existing Next.js + Sanity platform on hofherrmeatco.com with zero heavy capex.',
        leftColTitle: 'Phased Implementation Milestones',
        leftColTag: 'Days 1–90',
        leftColType: 'fix',
        leftBullets: [
            'Days 1–30 (Friction Removal): Launch Northfield vs. Winnetka badges; 2-signature holiday/catering packing slip; $54 Weeknight Family Bundles; QR cooking tags.',
            'Days 31–60 (Throughput & AOV): Roll out timed 10-min lunch slots + $58 DIY Italian Beef Home Kits; "Stock Your Freezer" 5-for-$95 pass; Friday SMS Sausage drops.',
            'Days 61–90 (Scale & Recurring): Launch Hofherr Butcher Club ($149/mo); Happ Rd. Curbside Express Bays + Winnetka Holiday Hub; Monday "Butcher & Bourbon" tickets.',
        ],
        rightColTitle: 'Target 12-Month Business Impact',
        rightColTag: 'Projected ROI',
        rightColType: 'fix',
        rightBullets: [
            '+$488,462 Incremental Annual Revenue across all 8 growth engines (+$304,385 Incremental Gross Profit).',
            '+25% to +35% Average Order Value (AOV) via Freezer Passes, Weeknight Bundles, and CPG Jar cross-sells.',
            '2x Holiday Pre-Order Capacity with sub-5-minute Curbside & Winnetka Depot pickup.',
            '4.9★+ Review Trajectory by eliminating holiday line complaints and lunch wait surprises.',
        ],
        bottomTakeaway:
            'Every digital component required for this rollout is already architected into the Hofherr Next.js platform.',
    },
];

const BUSINESS_DEPARTMENTS: BusinessDepartment[] = [
    {
        id: 'supply-chain',
        deptCode: 'SIDE 01 · SUPPLY CHAIN & YIELD',
        name: 'Whole-Animal Butchery & Zero-Waste Trim Economics',
        role: 'Gross Margin Foundation',
        margin: '38% → 58% Blended',
        aov: '$65 – $145',
        currentStrength: 'Direct sourcing from Midwestern family farms (Slagel Farms, heritage pork, grass-fed grain-finished beef) and 45-day dry-aging.',
        currentBottleneck: 'Selling primals (ribeye, strip, tenderloin) alone caps gross margin at ~40% if trim, fat, and bones aren\'t aggressively upcycled into branded CPG/freezer items.',
        competitorPlay: 'Publican Quality Meats (PQM) and Paulina Market turn 100% of trim/fat/bones into high-margin charcuterie, tallow, bone broth, and 40+ sausage varieties.',
        hofherrUpgrade: 'Convert every ounce of trim into $14 Smoked Beef Tallow jars, $16 24-Hr Marrow Bone Broth quarts, "Best in Show" sausages, and Prime Smashburger packs.',
        kpis: ['0% Carcass Trim Waste', '+12% Blended Gross Margin Lift', '$14–$16/jar Upcycled CPG Revenue'],
    },
    {
        id: 'store-ops',
        deptCode: 'SIDE 02 · STORE OPERATIONS & LABOR',
        name: 'Counter Workflow, Hot-Line Prep & Holiday Runners',
        role: 'Throughput & Labor Efficiency',
        margin: '28% Labor-to-Sales Target',
        aov: '30-Sec Express Pickup',
        currentStrength: 'Master Butcher Sean Hofherr and counter team deliver 5-star custom cutting and personal cooking advice.',
        currentBottleneck: 'High-skill butcher labor gets bottlenecked handing out pre-paid online orders or packing holiday sides while walk-in customers wait in the same line.',
        competitorPlay: 'Pat LaFrieda and Paulina separate custom counter ticket queues from pre-paid express pickup and use 2-person verification on holiday boxes.',
        hofherrUpgrade: 'Dedicated "Pre-Paid Express Shelf" at Happ Rd., 2-Signature Holiday Packing Slips (Packer + Runner), and 10-minute throttled tickets for hot Italian Beef.',
        kpis: ['< 5 Min Holiday Curbside Wait', '100.0% Side-Dish Order Accuracy', '< 10 Min Peak Hot Lunch Wait'],
    },
    {
        id: 'merchandising',
        deptCode: 'SIDE 03 · PRICING & MERCHANDISING',
        name: 'Price Framing, Case Architecture & Basket Building',
        role: 'Overcoming "Sticker Shock" & Lifting AOV',
        margin: '54% – 62% Bundle Margin',
        aov: '$54 – $115 (+30% Lift)',
        currentStrength: 'Unmatched USDA Prime & Dry-Aged quality that regulars gladly pay a premium for.',
        currentBottleneck: 'First-time shoppers see $36–$48/lb steak tags and compare them to corporate supermarkets rather than per-person restaurant meals.',
        competitorPlay: 'Porter Road champions "Butcher\'s Secret" cuts (flat iron, denver, hanger, picanha at $16–$24/lb); Grand Food Center & Sunset sell complete dinner trays.',
        hofherrUpgrade: 'Frame $54 Weeknight Family Bundles as "$13.50/person for a family of 4," spotlight value butcher cuts, and place a $95 5-Meal Freezer Pass at checkout.',
        kpis: ['+25–35% Average Order Value', '2x Tuesday–Thursday Foot Traffic', '+$18 Checkout Impulse Add-On'],
    },
    {
        id: 'omnichannel',
        deptCode: 'SIDE 04 · OMNICHANNEL & 2-STORE SYNC',
        name: 'Northfield Flagship ↔ Winnetka Metra Depot Bridge',
        role: 'Commuter Convenience Moat',
        margin: '62% – 68% Depot Margin',
        aov: '$22 – $85',
        currentStrength: 'Only butcher on the North Shore with both a full production butcher shop (300 S. Happ Rd.) and a Metra train station outpost (754 Elm St., Winnetka).',
        currentBottleneck: 'Reviewers occasionally confuse which location carries custom steaks vs. hot Italian Beef, or miss Northfield\'s 6:00 PM closing time.',
        competitorPlay: 'No local competitor has a train-station depot; national DTCs rely on expensive FedEx dry-ice shipping.',
        hofherrUpgrade: '"Order from Northfield Butcher by 1 PM → Grab Chilled at Winnetka Train at 5:30 PM," clear location badges on Yelp/FB, and Winnetka Holiday Pickup Hub.',
        kpis: ['35% Holiday Traffic Shifted to Winnetka', 'Zero Location-Confusion Reviews', 'Same-Day Commuter Order Cutoff @ 1 PM'],
    },
    {
        id: 'marketing-crm',
        deptCode: 'SIDE 05 · MARKETING, SEO & RETENTION',
        name: 'Local Search Dominance, SMS Drops & Butcher Club',
        role: 'Zero-CAC Repeat Revenue',
        margin: '58% Subscription Margin',
        aov: '$149/mo Recurring',
        currentStrength: '4.7★–4.8★ ratings on Yelp/Facebook/Google and organic press from Kevin Pang / America\'s Test Kitchen / WTTW.',
        currentBottleneck: 'No automated recurring membership box yet; weekend specials rely on passive social reach rather than direct SMS triggers.',
        competitorPlay: 'Snake River Farms (Club SRF) & ButcherBox lock in monthly recurring revenue; Gene\'s & Carnivore use weekly email/SMS drops.',
        hofherrUpgrade: 'Launch "Hofherr Butcher Club" ($149/mo with priority holiday slots), Friday 9 AM SMS "Sausage of the Month" drops, and QR review/recipe cards.',
        kpis: ['100+ Butcher Club Subscribers ($178k/yr)', '98% Open Rate on Friday SMS Drops', '4.9★+ Google & Yelp Rating'],
    },
    {
        id: 'b2b-catering',
        deptCode: 'SIDE 06 · B2B, CATERING & CORPORATE',
        name: 'Turnkey Event Catering, Country Clubs & Q4 Gifting',
        role: 'High-Ticket Volume Engine',
        margin: '58% – 66% Gross',
        aov: '$375 – $3,500+',
        currentStrength: 'Interactive BBQ & Pig Roast Calculators already built on hofherrmeatco.com; acclaimed smoked brisket and whole-hog roasts.',
        currentBottleneck: 'Sunset Foods (`entertaining.sunsetfoods.com`) and Omaha Steaks/SRF currently capture North Shore corporate office lunches and Q4 client gifting.',
        competitorPlay: 'Sunset Foods runs corporate box lunches & chafing dish packages; Snake River Farms sells $200+ Q4 corporate steak boxes.',
        hofherrUpgrade: 'Launch $375 Turnkey "Italian Beef Catering Bars" (warming trays + chuck eye + 3-yr giardiniera) and $225 Stamped Wood Q4 Corporate Gift Crates.',
        kpis: ['+$68k/yr from Italian Beef Catering Bars', '140+ Q4 Corporate Gift Crates ($31.5k)', 'Local Country Club Sausage/Burger Accounts'],
    },
    {
        id: 'cpg-packaging',
        deptCode: 'SIDE 07 · CPG RETAIL & PACKAGING',
        name: 'Bottled House Staples, Branded Wrap & Goldbelly',
        role: '70%+ Margin Brand Extension',
        margin: '68% – 75% Gross',
        aov: '$14 – $129',
        currentStrength: 'Custom woodcut-linocut butcher wrapping paper, 10 department flame stickers, rubber stamps, and 3-year-aged house giardiniera.',
        currentBottleneck: 'House giardiniera, concentrated jus, and tallow are mostly used as sandwich condiments rather than merchandised as a flagship CPG retail wall.',
        competitorPlay: 'Gene\'s Sausage Shop and PQM generate high-margin impulse sales from house-branded jars, rubs, and regional shipping.',
        hofherrUpgrade: 'Checkout CPG Wall ($14 3-Yr Giardiniera, $16 Jus Concentrate, $14 Smoked Beef Tallow, $12 Truffle Steak Butter) + 8-Pack Goldbelly Shipping Boxes.',
        kpis: ['40+ CPG Jars Sold/Week (+$30k/yr)', '72% Gross Margin on Jarred Goods', 'QR "Cook It Right" Tag on Every Parcel'],
    },
    {
        id: 'real-estate',
        deptCode: 'SIDE 08 · REAL ESTATE & DARK HOURS',
        name: 'Monetizing Closed Mondays & Evening Storefront Hours',
        role: 'Pure Profit on Fixed Rent',
        margin: '74% Event Margin',
        aov: '$150 / Ticket ($1,800/Night)',
        currentStrength: 'Warm, authentic neighborhood butcher shop atmosphere in Northfield where customers love interacting with Sean and Arielle.',
        currentBottleneck: 'Northfield is closed all day Monday and every evening after 6:00 PM—paying 100% of rent/overhead while the space sits dark ~65% of the week.',
        competitorPlay: 'Publican Quality Meats (PQM) hosts sold-out evening butcher classes, tastings, and private dining in their shop after counter hours.',
        hofherrUpgrade: 'Host twice-monthly Monday Night "Butcher & Bourbon" Masterclasses (12 guests × $150 = $1,800/night) + private corporate team-building cutting nights.',
        kpis: ['$43,200/yr from 24 Monday Classes', '74% Gross Margin on Ticketed Nights', 'Every Attendee Leaves with $50+ in Cuts'],
    },
];

const COMPETITORS: CompetitorEntry[] = [
    {
        name: 'The Grand Food Center',
        tier: 'North Shore Local',
        locations: 'Winnetka (606 Green Bay Rd) & Glencoe',
        pricePositioning: '$$$ · Upscale Neighborhood Supermarket',
        whatTheyDoWell: [
            'One-stop upscale grocery convenience with dedicated parking lots',
            'In-house smokehouse (ribs, pulled pork, brisket) + full deli, sushi, salads & fresh guacamole',
            'High-volume game-day wings, sandwich platters, and holiday party trays',
        ],
        theirWeakness:
            'Supermarket meat counter—lacks 45-day custom dry-aging, whole-animal butcher authority, and a cult hero sandwich like Hofherr\'s Shabu Italian Beef.',
        whatWeStealOrBeat:
            'Add grab-and-go sides (charro beans, twice-baked potatoes, compound butters) to our $54 Weeknight Family Bundles so Winnetka/Northfield families don\'t default to Grand Food Center on Tuesday nights.',
    },
    {
        name: 'Sunset Foods',
        tier: 'North Shore Local',
        locations: 'Northbrook, Highland Park, Lake Forest, Libertyville',
        pricePositioning: '$$$ · Multi-Store North Shore Grocer (Est. 1937)',
        whatTheyDoWell: [
            'Dedicated catering website (entertaining.sunsetfoods.com) with corporate box lunches & chafing rentals',
            'Massive parking lots and full household grocery basket under one roof',
            'Strong local reputation ("freshness measured in hours") and Slagel Farms poultry',
        ],
        theirWeakness:
            'Big-store supermarket experience; cannot match Hofherr\'s small-batch cheddar jalapeño sausages, hand-cut dry-aged steaks, or personal owner access.',
        whatWeStealOrBeat:
            'Beat their catering portal with our interactive BBQ/Pig Roast Calculator + turnkey $375 "Italian Beef Catering Bars" and 5-minute Happ Rd. Curbside Express bays.',
    },
    {
        name: 'Paulina Meat Market',
        tier: 'Chicago Heritage',
        locations: 'Chicago — Lakeview (3501 N. Lincoln Ave · Est. 1949)',
        pricePositioning: '$$–$$$ · Legendary Old-World German Butcher',
        whatTheyDoWell: [
            '40+ varieties of house-made smoked sausages, brats, frankfurters, and bacons',
            'Enormous prepared frozen entree wall (beef stroganoff, chicken pot pies, smoked brisket)',
            'Highly regimented holiday pre-order system for hams, turkeys, and standing rib roasts',
        ],
        theirWeakness:
            '40–50 minute drive down to Lakeview for North Shore families; utilitarian website with no interactive cut guide or train-station pickup.',
        whatWeStealOrBeat:
            'Replicate Paulina\'s frozen entree volume on the North Shore via our "Stock Your Freezer" 5-for-$95 Pass and Friday SMS "Sausage of the Month" drops.',
    },
    {
        name: 'Publican Quality Meats (PQM)',
        tier: 'Chicago Heritage',
        locations: 'Chicago — Fulton Market / West Loop (825 W. Fulton Market)',
        pricePositioning: '$$$$ · Chef-Driven Butcher, Café & Bakery',
        whatTheyDoWell: [
            'Acclaimed chef-driven sandwich café + whole-animal butcher counter + Slagel Farms provenance',
            'Ticketed evening butcher classes, charcuterie workshops, and private dining events',
            'High-end artisan corporate box lunches and charcuterie platters',
        ],
        theirWeakness:
            'West Loop traffic and parking make it impossible for routine North Shore weeknight shopping.',
        whatWeStealOrBeat:
            'Monetize Northfield\'s closed Mondays with $150/seat "Butcher & Bourbon" Masterclasses and launch North Shore Executive Box Lunches.',
    },
    {
        name: "Gene's Sausage Shop & Delicatessen",
        tier: 'Chicago Heritage',
        locations: 'Chicago — Lincoln Square (4750 N. Lincoln Ave)',
        pricePositioning: '$$–$$$ · European Butcher, Gourmet Market & Rooftop',
        whatTheyDoWell: [
            'High-margin specialty pantry cross-sells (mustards, pickled jars, rubs, European imports) that double basket size',
            'Seasonal rooftop beer & bratwurst garden that turns the butcher brand into an experiential destination',
        ],
        theirWeakness:
            'Located in Lincoln Square; no North Shore footprint or commuter train depot.',
        whatWeStealOrBeat:
            'Build a high-margin CPG Checkout Wall (3-Yr-Aged Giardiniera, Concentrated Jus, Smoked Beef Tallow, Truffle Butter) to lift checkout AOV by +$18.',
    },
    {
        name: 'Carnivore Oak Park',
        tier: 'Chicago Heritage',
        locations: 'Oak Park, IL (1042 Pleasant St)',
        pricePositioning: '$$$ · Craft Whole-Animal Suburban Butcher',
        whatTheyDoWell: [
            'Strong suburban commuter dinner bundles, prepared lunch counter, and local farm storytelling',
            'Seasonal CSA/meat shares and approachable weeknight meal kits',
        ],
        theirWeakness:
            'Serves the western suburbs (Oak Park); single storefront without a secondary Metra depot.',
        whatWeStealOrBeat:
            'Adopt their commuter weeknight bundle cadence for our Winnetka Metra Depot ("Order by 1 PM, Grab at the Train at 5:30 PM").',
    },
    {
        name: 'Porter Road & Flannery Beef',
        tier: 'National DTC',
        locations: 'Nationwide Online DTC Shipping',
        pricePositioning: '$$$–$$$$ · Craft Online Butcher & Dry-Aged Specialist',
        whatTheyDoWell: [
            'Industry-leading digital cut guides and recipe-to-cart cross-selling',
            'Championing high-margin "butcher\'s secret" cuts (denver, flat iron, picanha, hanger, teres major)',
            'Clear education on why 45-day dry-aging loses 25% moisture weight to concentrate flavor',
        ],
        theirWeakness:
            '$25–$40 per box wasted on FedEx freight, dry ice, and insulation; cuts arrive vacuum-sealed days after cutting.',
        whatWeStealOrBeat:
            'Pair our live Cut Guide (/cut-guide) with QR "Cook It Right" video stickers on every parcel—giving customers fresh, hand-cut today quality with zero shipping markup.',
    },
    {
        name: 'Snake River Farms & ButcherBox',
        tier: 'National DTC',
        locations: 'Nationwide Subscription & Corporate Gifting',
        pricePositioning: '$$$–$$$$ · Subscription Box & Wagyu Gifting Giants',
        whatTheyDoWell: [
            'Predictable monthly recurring revenue via customizable subscription boxes ("skip, swap, or pause")',
            'Tiered loyalty points (Club SRF) and massive Q4 corporate holiday gifting catalogs',
        ],
        theirWeakness:
            'Rock-hard frozen warehouse fulfillment; zero local personal relationship or hot prepared foods.',
        whatWeStealOrBeat:
            'Launch "Hofherr Butcher Club" ($149/mo local pickup/delivery) with priority Thanksgiving/Christmas pickup slots + Q4 North Shore Corporate Gift Crates.',
    },
];

const PAIN_VS_FIX_SUMMARY = [
    {
        pain: 'Holiday Pickup Chaos & Missing Sides',
        quote: 'Long lines & occasional missing sides during Thanksgiving/Christmas rushes.',
        fix: '5-Min Curbside Express Bays + Dual-Signature Packing Slip + Winnetka Depot Satellite Pickup.',
        impact: 'Cuts Northfield storefront lines by 60% & eliminates packing errors.',
    },
    {
        pain: '30–45 Min Lunch Waits & Sell-Outs',
        quote: 'Shabu-style Italian Beef and hot specials back up during peak lunch rushes.',
        fix: 'Timed 10-Min Online Slots + Live Daily Batch Counter + 4-Pack DIY Take-Home Beef Kits.',
        impact: 'Reduces walk-in wait friction under 10 mins & adds $58 take-home kit AOV.',
    },
    {
        pain: 'Price "Sticker Shock" for Casual Shoppers',
        quote: 'Higher price point than standard grocery stores for everyday shopping.',
        fix: '$54 Weeknight Family Dinner Bundles (~$13.50/person) + Butcher\'s Secret Value Cuts + Butcher Club.',
        impact: 'Converts casual browsers into weekly family dinner buyers.',
    },
    {
        pain: 'Northfield vs. Winnetka Depot Confusion',
        quote: 'Visitors confuse which location has the full butcher counter vs. hot commuter lunches.',
        fix: 'Clear Two-Location Channel Badges + "Order from Butcher, Pick Up at Metra Train" bridge.',
        impact: 'Turns two locations into a seamless commuter advantage.',
    },
    {
        pain: 'Compact Storefront & Happ Rd. Parking Congestion',
        quote: 'Tight shared lot on Happ Rd. and crowded counter during weekend peak hours.',
        fix: 'Pre-Paid Express Counter Shelf + Off-Peak Pickup Perks (1:30–3:30 PM) + Local Delivery ($125+).',
        impact: 'Doubles Northfield order throughput without expanding square footage.',
    },
    {
        pain: 'Untapped Dark Hours & Single-Item Checkout',
        quote: 'Northfield is closed Mondays/evenings; steak buyers don\'t always grab freezer or pantry items.',
        fix: 'Monday "Butcher & Bourbon" Classes ($150/seat) + "Stock Your Freezer" 5-for-$95 Pass + CPG Jars.',
        impact: 'Generates $1,800/night on closed Mondays & lifts checkout AOV by +25–35%.',
    },
];

const ROADMAP_PHASES = [
    {
        phase: 'Phase 1 · Friction Removal & Merchandising',
        timeline: 'Days 1–30',
        actions:
            '1) Add Northfield vs. Winnetka badges across Yelp/FB/Google/Web; 2) Implement 2-Signature Packing Slip for catering & holiday orders; 3) Launch $54 Weeknight Family Bundles & QR "Cook It Right" steak tags; 4) Set up Pre-Paid Express Pickup Shelf at 300 S. Happ Rd.',
        impact: 'Eliminates order mix-ups, location confusion & casual price objections immediately.',
    },
    {
        phase: 'Phase 2 · Throughput, Freezer & CPG Expansion',
        timeline: 'Days 31–60',
        actions:
            '1) Roll out timed 10-minute online lunch slots + live daily Italian Beef batch counter; 2) Launch $58 4-Pack DIY Shabu Beef Home Kits; 3) Introduce "Stock Your Freezer" 5-for-$95 Pass & Friday SMS Sausage-of-the-Month drops; 4) Merchandise bottled 3-Yr Giardiniera, Jus & Tallow at checkout.',
        impact: 'Cuts peak lunch wait under 10 mins; lifts Average Order Value (AOV) by +25–35%.',
    },
    {
        phase: 'Phase 3 · Recurring Revenue, B2B & Holiday Scale',
        timeline: 'Days 61–90',
        actions:
            '1) Launch Hofherr Butcher Club monthly subscription ($149/mo); 2) Deploy Happ Rd. Curbside Express Bays + Winnetka Depot Holiday Pickup Hub; 3) Launch $375 Italian Beef Catering Bars & $225 Q4 Corporate Gift Crates; 4) Host first Monday night "Butcher & Bourbon" Masterclass ($150/seat).',
        impact: '2x holiday order capacity with zero sidewalk bottlenecks + $488k/yr incremental revenue run-rate.',
    },
];

export default function PitchDeckClient({ embedded = false }: { embedded?: boolean }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [viewMode, setViewMode] = useState<'slides' | 'full'>('slides');
    const [compFilter, setCompFilter] = useState<'All' | 'North Shore Local' | 'Chicago Heritage' | 'National DTC'>('All');
    const [selectedEngines, setSelectedEngines] = useState<Set<string>>(
        () => new Set(GROWTH_ENGINES.map((e) => e.id))
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (viewMode !== 'slides') return;
            if (e.key === 'ArrowRight') {
                setActiveSlide((prev) => (prev + 1) % SLIDES.length);
            } else if (e.key === 'ArrowLeft') {
                setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode]);

    const toggleEngine = (id: string) => {
        setSelectedEngines((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const currentSlide = SLIDES[activeSlide];
    const filteredCompetitors =
        compFilter === 'All' ? COMPETITORS : COMPETITORS.filter((c) => c.tier === compFilter);

    const activeEnginesList = GROWTH_ENGINES.filter((e) => selectedEngines.has(e.id));
    const totalAnnualRev = activeEnginesList.reduce((sum, e) => sum + e.annualRevenue, 0);
    const totalAnnualProfit = activeEnginesList.reduce((sum, e) => sum + e.annualProfit, 0);
    const blendedMargin = totalAnnualRev > 0 ? Math.round((totalAnnualProfit / totalAnnualRev) * 100) : 0;

    const deckBody = (
        <>
            {/* ── Section 1: Interactive 14-Slide Strategy Deck ── */}
            <section id="pitch-deck" aria-labelledby="interactive-deck-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="interactive-deck-heading" className={styles.sectionTitle}>
                            {embedded
                                ? '13 / 360° Business, Competitor & Review Strategy Deck'
                                : 'Interactive 14-Slide Strategy Deck'}
                        </h2>
                        <p className={styles.sectionDesc}>
                            Covering every side of the business—whole-animal unit economics, North Shore &amp; Chicago
                            competitor playbooks, Yelp/Facebook operational fixes, CPG &amp; freezer expansion, B2B
                            catering, and dark-hours monetization.
                        </p>
                    </div>

                    <div className={styles.deckToolbar}>
                        <div className={styles.modeTabs}>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${viewMode === 'slides' ? styles.modeBtnActive : ''}`}
                                onClick={() => setViewMode('slides')}
                            >
                                Interactive Slide Player ({SLIDES.length} Slides)
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${viewMode === 'full' ? styles.modeBtnActive : ''}`}
                                onClick={() => setViewMode('full')}
                            >
                                View All {SLIDES.length} Slides Stacked
                            </button>
                        </div>

                        {viewMode === 'slides' && (
                            <div className={styles.slideControls}>
                                <span className={styles.slideCount}>
                                    Slide {activeSlide + 1} of {SLIDES.length}
                                </span>
                                <button
                                    type="button"
                                    className={styles.navBtn}
                                    onClick={() => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                                >
                                    ← Prev
                                </button>
                                <button
                                    type="button"
                                    className={styles.navBtn}
                                    onClick={() => setActiveSlide((prev) => (prev + 1) % SLIDES.length)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>

                    {viewMode === 'slides' ? (
                        <>
                            <div className={styles.slidePills}>
                                {SLIDES.map((s, idx) => (
                                    <button
                                        key={s.num}
                                        type="button"
                                        className={`${styles.slidePill} ${idx === activeSlide ? styles.slidePillActive : ''}`}
                                        onClick={() => setActiveSlide(idx)}
                                    >
                                        {s.shortLabel}
                                    </button>
                                ))}
                            </div>

                            <article className={styles.slideStage}>
                                <div className={styles.slideHeader}>
                                    <span className={styles.slideMeta}>
                                        Slide {currentSlide.num} · {currentSlide.category}
                                    </span>
                                    <h3 className={styles.slideTitle}>{currentSlide.title}</h3>
                                    <p className={styles.slideSummary}>{currentSlide.summary}</p>
                                </div>

                                <div className={styles.twoColGrid}>
                                    <div
                                        className={`${styles.card} ${
                                            currentSlide.leftColType === 'pain' ? styles.cardPain : styles.cardFix
                                        }`}
                                    >
                                        <div className={styles.cardHead}>
                                            <h4 className={styles.cardTitle}>{currentSlide.leftColTitle}</h4>
                                            <span
                                                className={`${styles.tag} ${
                                                    currentSlide.leftColType === 'pain'
                                                        ? styles.tagPain
                                                        : styles.tagGold
                                                }`}
                                            >
                                                {currentSlide.leftColTag}
                                            </span>
                                        </div>
                                        <ul className={styles.bulletList}>
                                            {currentSlide.leftBullets.map((item) => (
                                                <li key={item} className={styles.bulletItem}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div
                                        className={`${styles.card} ${
                                            currentSlide.rightColType === 'pain' ? styles.cardPain : styles.cardFix
                                        }`}
                                    >
                                        <div className={styles.cardHead}>
                                            <h4 className={styles.cardTitle}>{currentSlide.rightColTitle}</h4>
                                            <span
                                                className={`${styles.tag} ${
                                                    currentSlide.rightColType === 'pain'
                                                        ? styles.tagPain
                                                        : styles.tagGold
                                                }`}
                                            >
                                                {currentSlide.rightColTag}
                                            </span>
                                        </div>
                                        <ul className={styles.bulletList}>
                                            {currentSlide.rightBullets.map((item) => (
                                                <li key={item} className={styles.bulletItem}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className={styles.slideBottomCallout}>
                                    <p className={styles.calloutText}>
                                        <strong>Executive Takeaway:</strong> {currentSlide.bottomTakeaway}
                                    </p>
                                </div>
                            </article>
                        </>
                    ) : (
                        <div className={styles.sectionBlock}>
                            {SLIDES.map((slide) => (
                                <article key={slide.num} className={styles.slideStage}>
                                    <div className={styles.slideHeader}>
                                        <span className={styles.slideMeta}>
                                            Slide {slide.num} · {slide.category}
                                        </span>
                                        <h3 className={styles.slideTitle}>{slide.title}</h3>
                                        <p className={styles.slideSummary}>{slide.summary}</p>
                                    </div>

                                    <div className={styles.twoColGrid}>
                                        <div
                                            className={`${styles.card} ${
                                                slide.leftColType === 'pain' ? styles.cardPain : styles.cardFix
                                            }`}
                                        >
                                            <div className={styles.cardHead}>
                                                <h4 className={styles.cardTitle}>{slide.leftColTitle}</h4>
                                                <span
                                                    className={`${styles.tag} ${
                                                        slide.leftColType === 'pain' ? styles.tagPain : styles.tagGold
                                                    }`}
                                                >
                                                    {slide.leftColTag}
                                                </span>
                                            </div>
                                            <ul className={styles.bulletList}>
                                                {slide.leftBullets.map((item) => (
                                                    <li key={item} className={styles.bulletItem}>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div
                                            className={`${styles.card} ${
                                                slide.rightColType === 'pain' ? styles.cardPain : styles.cardFix
                                            }`}
                                        >
                                            <div className={styles.cardHead}>
                                                <h4 className={styles.cardTitle}>{slide.rightColTitle}</h4>
                                                <span
                                                    className={`${styles.tag} ${
                                                        slide.rightColType === 'pain' ? styles.tagPain : styles.tagGold
                                                    }`}
                                                >
                                                    {slide.rightColTag}
                                                </span>
                                            </div>
                                            <ul className={styles.bulletList}>
                                                {slide.rightBullets.map((item) => (
                                                    <li key={item} className={styles.bulletItem}>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={styles.slideBottomCallout}>
                                        <p className={styles.calloutText}>
                                            <strong>Executive Takeaway:</strong> {slide.bottomTakeaway}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Section 1B: Visual Analytics, Pie/Donut Charts & Infographics ── */}
            <section id="visual-charts" aria-labelledby="visual-charts-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="visual-charts-heading" className={styles.sectionTitle}>
                            Visual Data Analytics, Pie Charts &amp; Operational Curves
                        </h2>
                        <p className={styles.sectionDesc}>
                            Executive visual breakdown of Yelp &amp; Facebook review sentiment, root causes of the 5%
                            operational friction, whole-animal carcass yield vs. margin, and our peak wait-time
                            flattening curve.
                        </p>
                    </div>

                    <div className={styles.chartGrid}>
                        {/* ── Chart 1: Review Star Distribution Donut ── */}
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <span className={styles.cardSub}>Chart 01 · Yelp + Facebook + Google Audit</span>
                                    <h3 className={styles.chartTitle}>Overall Rating Sentiment Distribution</h3>
                                    <p className={styles.chartSub}>
                                        95% of all public reviews are 4★ or 5★. Zero complaints cite bad meat quality.
                                    </p>
                                </div>
                                <span className={`${styles.tag} ${styles.tagGold}`}>4.8★ Avg</span>
                            </div>

                            <div className={styles.donutWrap}>
                                <svg viewBox="0 0 120 120" className={styles.donutSvg} role="img" aria-label="Review star distribution donut chart">
                                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
                                    {/* 86% 5-Star (circumference = 289.02 -> 248.5) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#A8905F"
                                        strokeWidth="16"
                                        strokeDasharray="248.5 289.0"
                                        strokeDashoffset="0"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 9% 4-Star (26.0) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#c4ae82"
                                        strokeWidth="16"
                                        strokeDasharray="26.0 289.0"
                                        strokeDashoffset="-248.5"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 5% 1-3 Star Operational Friction (14.5) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#CC0E1D"
                                        strokeWidth="16"
                                        strokeDasharray="14.5 289.0"
                                        strokeDashoffset="-274.5"
                                        transform="rotate(-90 60 60)"
                                    />
                                    <text x="60" y="58" textAnchor="middle" className={styles.donutCenterNum}>
                                        95%
                                    </text>
                                    <text x="60" y="73" textAnchor="middle" className={styles.donutCenterSub}>
                                        4★ &amp; 5★ Reviews
                                    </text>
                                </svg>

                                <div className={styles.legendList}>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchGold} />
                                            <span className={styles.legendName}>5-Star Rave Reviews (Quality &amp; Staff)</span>
                                        </div>
                                        <span className={styles.legendVal}>86%</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchGoldLight} />
                                            <span className={styles.legendName}>4-Star Positive (Great Food, Busy Line)</span>
                                        </div>
                                        <span className={styles.legendVal}>9%</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchRed} />
                                            <span className={styles.legendName}>1–3 Star (100% Logistics / Wait / Price)</span>
                                        </div>
                                        <span className={styles.legendVal}>5%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Chart 2: Root Cause of Friction Donut ── */}
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <span className={styles.cardSub}>Chart 02 · Pain-Point Share Breakdown</span>
                                    <h3 className={styles.chartTitle}>What Drives Customer Friction Mentions</h3>
                                    <p className={styles.chartSub}>
                                        65% of all complaints come from just two bottlenecks: Holiday Pickups &amp; Peak Lunch Waits.
                                    </p>
                                </div>
                                <span className={`${styles.tag} ${styles.tagPain}`}>5 Fixes</span>
                            </div>

                            <div className={styles.donutWrap}>
                                <svg viewBox="0 0 120 120" className={styles.donutSvg} role="img" aria-label="Friction root cause pie chart">
                                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
                                    {/* 38% Holiday Lines & Missing Sides (109.8) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#CC0E1D"
                                        strokeWidth="16"
                                        strokeDasharray="109.8 289.0"
                                        strokeDashoffset="0"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 27% 30-45 Min Lunch Wait (78.0) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#e01e2e"
                                        strokeWidth="16"
                                        strokeDasharray="78.0 289.0"
                                        strokeDashoffset="-109.8"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 18% Price Sticker Shock (52.0) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#A8905F"
                                        strokeWidth="16"
                                        strokeDasharray="52.0 289.0"
                                        strokeDashoffset="-187.8"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 17% Parking + Location Confusion (49.2) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#999999"
                                        strokeWidth="16"
                                        strokeDasharray="49.2 289.0"
                                        strokeDashoffset="-239.8"
                                        transform="rotate(-90 60 60)"
                                    />
                                    <text x="60" y="58" textAnchor="middle" className={styles.donutCenterNum}>
                                        65%
                                    </text>
                                    <text x="60" y="73" textAnchor="middle" className={styles.donutCenterSub}>
                                        Queue &amp; Wait Issues
                                    </text>
                                </svg>

                                <div className={styles.legendList}>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchRed} />
                                            <span className={styles.legendName}>Holiday Pickup Lines &amp; Missing Sides</span>
                                        </div>
                                        <span className={styles.legendVal}>38%</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchRedLight} />
                                            <span className={styles.legendName}>30–45 Min Hot Lunch Waits / Sell-Outs</span>
                                        </div>
                                        <span className={styles.legendVal}>27%</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchGold} />
                                            <span className={styles.legendName}>Per-Pound Price &quot;Sticker Shock&quot;</span>
                                        </div>
                                        <span className={styles.legendVal}>18%</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchMuted} />
                                            <span className={styles.legendName}>Happ Rd. Parking &amp; 2-Store Confusion</span>
                                        </div>
                                        <span className={styles.legendVal}>17%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Chart 3: Whole-Animal Carcass Yield vs. Gross Margin Pie Chart ── */}
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <span className={styles.cardSub}>Chart 03 · Whole-Animal P&amp;L Flywheel</span>
                                    <h3 className={styles.chartTitle}>Carcass Weight Yield vs. Margin Contribution</h3>
                                    <p className={styles.chartSub}>
                                        Upcycling trim, chuck, fat, and bones into CPG jars, sausages &amp; freezer meals lifts blended margin from 40% to 58%.
                                    </p>
                                </div>
                                <span className={`${styles.tag} ${styles.tagGold}`}>0% Waste</span>
                            </div>

                            <div className={styles.donutWrap}>
                                <svg viewBox="0 0 120 120" className={styles.donutSvg} role="img" aria-label="Whole animal carcass yield donut chart">
                                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
                                    {/* 35% Middle-Meat Steaks (101.2) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#CC0E1D"
                                        strokeWidth="16"
                                        strokeDasharray="101.2 289.0"
                                        strokeDashoffset="0"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 25% Chuck & Brisket (72.2) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#e01e2e"
                                        strokeWidth="16"
                                        strokeDasharray="72.2 289.0"
                                        strokeDashoffset="-101.2"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 22% Sausages, Grind & Pot Pies (63.6) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#A8905F"
                                        strokeWidth="16"
                                        strokeDasharray="63.6 289.0"
                                        strokeDashoffset="-173.4"
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* 18% Broth, Jus & Tallow Jars (52.0) */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="46"
                                        fill="none"
                                        stroke="#c4ae82"
                                        strokeWidth="16"
                                        strokeDasharray="52.0 289.0"
                                        strokeDashoffset="-237.0"
                                        transform="rotate(-90 60 60)"
                                    />
                                    <text x="60" y="58" textAnchor="middle" className={styles.donutCenterNum}>
                                        58%
                                    </text>
                                    <text x="60" y="73" textAnchor="middle" className={styles.donutCenterSub}>
                                        Blended Margin
                                    </text>
                                </svg>

                                <div className={styles.legendList}>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchRed} />
                                            <span className={styles.legendName}>Prime Middle Steaks (35% Wt)</span>
                                        </div>
                                        <span className={styles.legendVal}>40% Margin</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchRedLight} />
                                            <span className={styles.legendName}>Chuck &amp; Brisket / Italian Beef (25% Wt)</span>
                                        </div>
                                        <span className={styles.legendVal}>62% Margin</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchGold} />
                                            <span className={styles.legendName}>Sausages, Burgers &amp; Freezer (22% Wt)</span>
                                        </div>
                                        <span className={styles.legendVal}>65% Margin</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={styles.legendLeft}>
                                            <span className={styles.swatchGoldLight} />
                                            <span className={styles.legendName}>24-Hr Broth, Jus &amp; Smoked Tallow (18% Wt)</span>
                                        </div>
                                        <span className={styles.legendVal}>74% Margin</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Chart 4: Peak Wait-Time Curve (Before vs. After SVG Line Graph) ── */}
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <span className={styles.cardSub}>Chart 04 · Queue &amp; Throughput Simulation</span>
                                    <h3 className={styles.chartTitle}>Peak Wait-Time Curve (Before vs. After Fixes)</h3>
                                    <p className={styles.chartSub}>
                                        10-Min Mobile Slots + Curbside Express Bays + Winnetka Hub flatten 45-min spikes under 8 mins.
                                    </p>
                                </div>
                                <span className={`${styles.tag} ${styles.tagGold}`}>-82% Wait</span>
                            </div>

                            <svg viewBox="0 0 460 195" className={styles.curveSvg} role="img" aria-label="Before and after wait time curve">
                                {/* Grid lines */}
                                <line x1="42" y1="25" x2="440" y2="25" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                                <line x1="42" y1="75" x2="440" y2="75" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                                <line x1="42" y1="125" x2="440" y2="125" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                                <line x1="42" y1="160" x2="440" y2="160" stroke="rgba(255,255,255,0.18)" />

                                {/* Y-axis labels */}
                                <text x="36" y="29" textAnchor="end" className={styles.curveAxisText}>45m</text>
                                <text x="36" y="79" textAnchor="end" className={styles.curveAxisText}>30m</text>
                                <text x="36" y="129" textAnchor="end" className={styles.curveAxisText}>15m</text>
                                <text x="36" y="163" textAnchor="end" className={styles.curveAxisText}>0m</text>

                                {/* X-axis labels */}
                                <text x="50" y="180" textAnchor="middle" className={styles.curveAxisText}>10 AM</text>
                                <text x="145" y="180" textAnchor="middle" className={styles.curveAxisText}>12 PM</text>
                                <text x="240" y="180" textAnchor="middle" className={styles.curveAxisText}>2 PM</text>
                                <text x="335" y="180" textAnchor="middle" className={styles.curveAxisText}>4 PM</text>
                                <text x="425" y="180" textAnchor="middle" className={styles.curveAxisText}>6 PM</text>

                                {/* BEFORE Red Curve (Spikes at 12:30 PM lunch & 4:30 PM holiday pickup) */}
                                <path
                                    d="M 50 145 Q 100 140, 145 32 Q 190 38, 240 128 Q 295 135, 345 24 Q 390 55, 425 130"
                                    fill="none"
                                    stroke="#CC0E1D"
                                    strokeWidth="3.5"
                                />
                                <circle cx="145" cy="32" r="4.5" fill="#CC0E1D" />
                                <circle cx="345" cy="24" r="4.5" fill="#CC0E1D" />
                                <text x="145" y="20" textAnchor="middle" className={styles.curveLabelRed}>
                                    42m Lunch Rush
                                </text>
                                <text x="345" y="15" textAnchor="middle" className={styles.curveLabelRed}>
                                    48m Holiday Peak
                                </text>

                                {/* AFTER Gold Curve (Flattened under 8 mins all day) */}
                                <path
                                    d="M 50 150 Q 145 136, 240 146 Q 345 134, 425 148"
                                    fill="none"
                                    stroke="#A8905F"
                                    strokeWidth="3.5"
                                />
                                <circle cx="145" cy="141" r="4" fill="#A8905F" />
                                <circle cx="345" cy="139" r="4" fill="#A8905F" />
                                <text x="245" y="120" textAnchor="middle" className={styles.curveLabelGold}>
                                    After Fixes: 5–8 Min Max Wait All Day
                                </text>
                            </svg>
                        </div>

                        {/* ── Chart 5: Competitive Benchmark Scorecard Bars (Full Width) ── */}
                        <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
                            <div className={styles.chartHeader}>
                                <div>
                                    <span className={styles.cardSub}>Chart 05 · 6-Axis Competitive Benchmark Scorecard</span>
                                    <h3 className={styles.chartTitle}>Hofherr Meat Co. (Gold) vs. Best Category Rival (Red)</h3>
                                    <p className={styles.chartSub}>
                                        Comparing Hofherr&apos;s post-rollout platform against the highest-scoring competitor in each category.
                                    </p>
                                </div>
                                <span className={`${styles.tag} ${styles.tagGold}`}>96 / 100 Score</span>
                            </div>

                            <div className={styles.twoColGrid}>
                                {COMPETITIVE_SCORECARD.map((item) => (
                                    <div key={item.label} className={styles.barChartList}>
                                        <div className={styles.barRow}>
                                            <div className={styles.barMeta}>
                                                <span className={styles.barLabel}>{item.label}</span>
                                                <span className={styles.barStats}>Hofherr: {item.hofherrPct}/100</span>
                                            </div>
                                            <div className={styles.barTrack}>
                                                <div
                                                    className={styles.barFillGold}
                                                    style={{ '--bar-w': `${item.hofherrPct}%` } as React.CSSProperties}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.barRow}>
                                            <div className={styles.barMeta}>
                                                <span className={styles.cellMuted}>Closest Rival: {item.rivalName}</span>
                                                <span className={styles.cellMuted}>{item.rivalPct}/100</span>
                                            </div>
                                            <div className={styles.barTrack}>
                                                <div
                                                    className={styles.barFillRed}
                                                    style={{ '--bar-w': `${item.rivalPct}%` } as React.CSSProperties}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Interactive Revenue & Profit Simulator ── */}
            <section id="roi-simulator" aria-labelledby="roi-simulator-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="roi-simulator-heading" className={styles.sectionTitle}>
                            Interactive Revenue &amp; Margin Model (8 Growth Plays)
                        </h2>
                        <p className={styles.sectionDesc}>
                            Click any of the 8 strategic initiatives below to toggle them on or off and model their
                            incremental annual revenue and gross profit contribution.
                        </p>
                    </div>

                    <div className={styles.roiSummaryBanner}>
                        <div className={styles.roiBannerLeft}>
                            <h3 className={styles.roiBannerTitle}>
                                Projected Incremental Impact ({activeEnginesList.length} of {GROWTH_ENGINES.length}{' '}
                                Plays Active)
                            </h3>
                            <p className={styles.roiBannerDesc}>
                                Conservative unit math across Northfield (300 S. Happ Rd.) and The Depot (Winnetka
                                Metra) with zero store expansion required.
                            </p>
                        </div>

                        <div className={styles.roiMetricsGroup}>
                            <div className={styles.roiMetricBox}>
                                <span className={styles.roiMetricNum}>
                                    +${totalAnnualRev.toLocaleString()}
                                </span>
                                <span className={styles.roiMetricLabel}>Incremental Annual Revenue</span>
                            </div>
                            <div className={styles.roiMetricBox}>
                                <span className={styles.roiMetricNum}>
                                    +${totalAnnualProfit.toLocaleString()}
                                </span>
                                <span className={styles.roiMetricLabel}>Incremental Gross Profit</span>
                            </div>
                            <div className={styles.roiMetricBox}>
                                <span className={styles.roiMetricNum}>{blendedMargin}%</span>
                                <span className={styles.roiMetricLabel}>Blended Gross Margin</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Revenue Contribution Bar Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div>
                                <span className={styles.cardSub}>Chart 06 · Live Revenue Waterfall Breakdown</span>
                                <h3 className={styles.chartTitle}>Annual Revenue Share by Growth Play</h3>
                            </div>
                            <span className={`${styles.tag} ${styles.tagGold}`}>
                                +${totalAnnualRev.toLocaleString()}/yr Total
                            </span>
                        </div>
                        <div className={styles.barChartList}>
                            {GROWTH_ENGINES.map((engine) => {
                                const isActive = selectedEngines.has(engine.id);
                                const pctOfMax = isActive ? Math.round((engine.annualRevenue / 178800) * 100) : 0;
                                const sharePct =
                                    isActive && totalAnnualRev > 0
                                        ? Math.round((engine.annualRevenue / totalAnnualRev) * 100)
                                        : 0;
                                return (
                                    <div key={engine.id} className={styles.barRow}>
                                        <div className={styles.barMeta}>
                                            <span className={styles.barLabel}>{engine.title}</span>
                                            <span className={styles.barStats}>
                                                {isActive
                                                    ? `+$${engine.annualRevenue.toLocaleString()}/yr (${sharePct}% of total · ${engine.grossMarginPct}% margin)`
                                                    : 'Excluded (Click card below to enable)'}
                                            </span>
                                        </div>
                                        <div className={styles.barTrack}>
                                            <div
                                                className={styles.barFillGold}
                                                style={{ '--bar-w': `${pctOfMax}%` } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.twoColGrid}>
                        {GROWTH_ENGINES.map((engine) => {
                            const isActive = selectedEngines.has(engine.id);
                            return (
                                <button
                                    key={engine.id}
                                    type="button"
                                    onClick={() => toggleEngine(engine.id)}
                                    className={`${styles.engineSelectCard} ${
                                        isActive ? styles.engineSelectCardActive : ''
                                    }`}
                                >
                                    <div className={styles.cardHead}>
                                        <div>
                                            <span className={styles.cardSub}>{engine.department}</span>
                                            <h3 className={styles.cardTitle}>{engine.title}</h3>
                                        </div>
                                        <span className={`${styles.tag} ${isActive ? styles.tagGold : styles.tagPain}`}>
                                            {isActive ? '✓ Included' : 'Excluded'}
                                        </span>
                                    </div>
                                    <p className={styles.cardBody}>{engine.unitMath}</p>
                                    <div className={styles.metricRow}>
                                        <div className={styles.metricPill}>
                                            <span className={styles.metricKey}>Annual Revenue</span>
                                            <span className={styles.metricVal}>
                                                +${engine.annualRevenue.toLocaleString()}/yr
                                            </span>
                                        </div>
                                        <div className={styles.metricPill}>
                                            <span className={styles.metricKey}>Gross Margin</span>
                                            <span className={styles.metricVal}>{engine.grossMarginPct}%</span>
                                        </div>
                                        <div className={styles.metricPill}>
                                            <span className={styles.metricKey}>Annual Gross Profit</span>
                                            <span className={styles.metricVal}>
                                                +${engine.annualProfit.toLocaleString()}/yr
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Section 3: All 8 Operational & Business Departments ── */}
            <section id="business-pillars" aria-labelledby="business-pillars-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="business-pillars-heading" className={styles.sectionTitle}>
                            All 8 Sides of the Business (Operational &amp; Financial Deep-Dive)
                        </h2>
                        <p className={styles.sectionDesc}>
                            A complete breakdown of how Supply Chain, Store Labor, Pricing Psychology, Omnichannel
                            Sync, Marketing/CRM, B2B Catering, CPG Packaging, and Real Estate Dark-Hours work together.
                        </p>
                    </div>

                    <div className={styles.twoColGrid}>
                        {BUSINESS_DEPARTMENTS.map((dept) => (
                            <div key={dept.id} className={`${styles.card} ${styles.cardFix}`}>
                                <div className={styles.cardHead}>
                                    <div>
                                        <span className={styles.cardSub}>{dept.deptCode}</span>
                                        <h3 className={styles.cardTitle}>{dept.name}</h3>
                                    </div>
                                    <span className={`${styles.tag} ${styles.tagGold}`}>{dept.margin}</span>
                                </div>

                                <p className={styles.cardBody}>
                                    <strong>Current Strength:</strong> {dept.currentStrength}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Current Friction / Bottleneck:</strong> {dept.currentBottleneck}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>What Competitors Do:</strong> {dept.competitorPlay}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Hofherr Strategic Upgrade:</strong> {dept.hofherrUpgrade}
                                </p>

                                <ul className={styles.bulletList}>
                                    {dept.kpis.map((kpi) => (
                                        <li key={kpi} className={styles.bulletItem}>
                                            <strong>Target KPI:</strong> {kpi}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 4: Competitor Intelligence & Feature Matrix ── */}
            <section id="competitors" aria-labelledby="competitors-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="competitors-heading" className={styles.sectionTitle}>
                            Competitor Teardowns &amp; 10-Capability Comparison Matrix
                        </h2>
                        <p className={styles.sectionDesc}>
                            How Hofherr Meat Co. stacks up against North Shore grocers (Grand Food Center, Sunset
                            Foods), Chicago butcher legends (Paulina Market, Publican Quality Meats, Gene&apos;s,
                            Carnivore), and National DTC giants (Porter Road, Snake River Farms, ButcherBox).
                        </p>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.roadmapTable}>
                            <thead>
                                <tr>
                                    <th>Capability / Business Line</th>
                                    <th>Hofherr Meat Co.</th>
                                    <th>Grand Food &amp; Sunset Foods</th>
                                    <th>Paulina Market &amp; PQM</th>
                                    <th>Porter Road / SRF / ButcherBox</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURE_MATRIX.map((row) => (
                                    <tr key={row.capability}>
                                        <td>
                                            <strong>{row.capability}</strong>
                                        </td>
                                        <td className={styles.cellWin}>{row.hofherr}</td>
                                        <td>{row.grandSunset}</td>
                                        <td>{row.paulinaPqm}</td>
                                        <td className={styles.cellMuted}>{row.nationalDtc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.modeTabs}>
                        {(['All', 'North Shore Local', 'Chicago Heritage', 'National DTC'] as const).map((tier) => (
                            <button
                                key={tier}
                                type="button"
                                className={`${styles.modeBtn} ${compFilter === tier ? styles.modeBtnActive : ''}`}
                                onClick={() => setCompFilter(tier)}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>

                    <div className={styles.twoColGrid}>
                        {filteredCompetitors.map((comp) => (
                            <div key={comp.name} className={`${styles.card} ${styles.cardFix}`}>
                                <div className={styles.cardHead}>
                                    <div>
                                        <span className={styles.cardSub}>{comp.locations}</span>
                                        <h3 className={styles.cardTitle}>{comp.name}</h3>
                                    </div>
                                    <span className={`${styles.tag} ${styles.tagGold}`}>{comp.tier}</span>
                                </div>

                                <p className={styles.cardBody}>
                                    <strong>Positioning:</strong> {comp.pricePositioning}
                                </p>

                                <ul className={styles.bulletList}>
                                    {comp.whatTheyDoWell.map((point) => (
                                        <li key={point} className={styles.bulletItem}>
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                <p className={styles.cardBody}>
                                    <strong>Their Blind Spot / Weakness:</strong> {comp.theirWeakness}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Hofherr Counter-Play:</strong> {comp.whatWeStealOrBeat}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 5: Pain Point to Solution Matrix ── */}
            <section id="pain-matrix" aria-labelledby="pain-matrix-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="pain-matrix-heading" className={styles.sectionTitle}>
                            Yelp &amp; Facebook Pain Points vs. Direct Fixes
                        </h2>
                        <p className={styles.sectionDesc}>
                            Every recurring critique from customer reviews mapped directly to an operational or digital
                            solution.
                        </p>
                    </div>

                    <div className={styles.twoColGrid}>
                        {PAIN_VS_FIX_SUMMARY.map((item) => (
                            <div key={item.pain} className={`${styles.card} ${styles.cardPain}`}>
                                <div className={styles.cardHead}>
                                    <h3 className={styles.cardTitle}>{item.pain}</h3>
                                    <span className={`${styles.tag} ${styles.tagPain}`}>Pain Point</span>
                                </div>
                                <p className={styles.cardBody}>
                                    <strong>What Reviewers Say:</strong> {item.quote}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>How We Fix It:</strong> {item.fix}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Expected Result:</strong> {item.impact}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 6: 90-Day Execution Roadmap ── */}
            <section id="rollout-plan" aria-labelledby="rollout-plan-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="rollout-plan-heading" className={styles.sectionTitle}>
                            90-Day Execution &amp; Revenue Plan
                        </h2>
                        <p className={styles.sectionDesc}>
                            Phased implementation designed to eliminate holiday and lunch-hour bottlenecks while scaling
                            recurring revenue, AOV, and B2B catering.
                        </p>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.roadmapTable}>
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>Timeline</th>
                                    <th>Key Actions Across All Business Sides</th>
                                    <th>Target Business Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROADMAP_PHASES.map((row) => (
                                    <tr key={row.phase}>
                                        <td>
                                            <strong>{row.phase}</strong>
                                        </td>
                                        <td>{row.timeline}</td>
                                        <td>{row.actions}</td>
                                        <td>{row.impact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );

    if (embedded) {
        return deckBody;
    }

    return (
        <main className={styles.page}>
            {/* ── Hero Header ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <h1 className={styles.title}>
                            360° Business, Competitor &amp; <span className={styles.titleAccent}>Review Pitch Deck</span>
                        </h1>
                        <p className={styles.subtitle}>
                            A complete strategic growth plan for Hofherr Meat Co. — synthesizing every Yelp and Facebook
                            review, tearing down 8 North Shore, Chicago, and National DTC competitors across 10
                            capabilities, and modeling +$488k/yr in incremental revenue across all 8 sides of the
                            business.
                        </p>
                        <div className={styles.heroStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>14 Slides</span>
                                <span className={styles.statLabel}>360° Strategy Deck</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>8 Sides</span>
                                <span className={styles.statLabel}>Business Departments Modeled</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>+$488k/yr</span>
                                <span className={styles.statLabel}>Incremental Revenue Model</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>+$304k/yr</span>
                                <span className={styles.statLabel}>Incremental Gross Profit (62%)</span>
                            </div>
                        </div>
                        <nav className={styles.quickJumpNav} aria-label="Pitch deck sections">
                            <a href="#pitch-deck" className={styles.jumpLink}>
                                01 · 14-Slide Interactive Deck
                            </a>
                            <a href="#visual-charts" className={styles.jumpLink}>
                                02 · Pie Charts &amp; Visual Analytics
                            </a>
                            <a href="#roi-simulator" className={styles.jumpLink}>
                                03 · Interactive Revenue Simulator
                            </a>
                            <a href="#business-pillars" className={styles.jumpLink}>
                                04 · All 8 Business Sides Deep-Dive
                            </a>
                            <a href="#competitors" className={styles.jumpLink}>
                                05 · Competitor Matrix &amp; Teardowns
                            </a>
                            <a href="#pain-matrix" className={styles.jumpLink}>
                                06 · Review Pain-Point Fixes
                            </a>
                            <a href="#rollout-plan" className={styles.jumpLink}>
                                07 · 90-Day Execution Plan
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
            {deckBody}
        </main>
    );
}
