'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

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

type BusinessPillar = {
    name: string;
    role: string;
    margin: string;
    aov: string;
    currentStrength: string;
    currentBottleneck: string;
    competitorPlay: string;
    hofherrUpgrade: string;
};

type CompetitorEntry = {
    name: string;
    tier: 'North Shore Local' | 'Chicago Heritage' | 'National DTC';
    locations: string;
    whatTheyDoWell: string[];
    theirWeakness: string;
    whatWeStealOrBeat: string;
};

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
            'Core Thesis: Fixing logistics and price framing unlocks +25–35% higher throughput and AOV without changing a single recipe.',
    },
    {
        num: '02',
        shortLabel: '02 · 6 Business Pillars',
        category: '360° Business Architecture & Unit Economics',
        title: 'Optimizing All 6 Revenue Engines',
        summary:
            'Hofherr is not just a retail meat counter—it is a 6-engine culinary ecosystem where each business line feeds margins, eliminates trim waste, and lowers customer acquisition cost.',
        leftColTitle: 'Traffic & Acquisition Engines',
        leftColTag: 'Foot Traffic & Brand',
        leftColType: 'fix',
        leftBullets: [
            '1. Custom Butcher Counter (Northfield): 38–45% gross margin. Primary trust builder; whole-animal trim feeds sausages, burger blends, tallow, and bone broth (zero waste).',
            '2. Hot Lunch & The Depot (Winnetka Metra): 62–68% gross margin. High-frequency commuter touchpoint powered by the viral Italian Beef and coffee/grab-and-go.',
            '3. Holiday Pre-Order Spikes (Thanksgiving / Xmas / Super Bowl): Highest single-week cash-flow events of the year (chargrilled turkeys, prime ribs, briskets).',
        ],
        rightColTitle: 'High-Margin & Recurring Engines',
        rightColTag: '60–72% Gross Margin',
        rightColType: 'fix',
        rightBullets: [
            '4. House Sausages & Gourmet Freezer Wall: 58–68% gross margin. Zero spoilage; solves busy North Shore weeknight dinners (Pot Pie, Smoked Lamb Curry).',
            '5. BBQ, Event & Corporate Catering: $450–$3,500+ AOV. Whole-hog roasts, backyard BBQ packages, and turnkey Office Italian Beef Bars.',
            '6. Subscriptions, CPG Jars & Dark-Hours Classes: 65–75% margin. Hofherr Butcher Club ($149/mo), bottled 3-Yr Giardiniera, and Monday "Butcher & Bourbon" nights.',
        ],
        bottomTakeaway:
            'Whole-Animal Economics: Every pound of steak trim is converted into 65%-margin sausage, jus, tallow, or gourmet freezer entrees.',
    },
    {
        num: '03',
        shortLabel: '03 · North Shore Rivals',
        category: 'Competitor Intelligence · Local North Shore',
        title: 'Beating Grand Food Center & Sunset Foods',
        summary:
            'Our closest geographic rivals in Winnetka, Glencoe, and Northbrook are upscale neighborhood supermarkets. They win on parking and 1-stop grocery convenience—we win on craft, provenance, and culinary authority.',
        leftColTitle: 'What Local Supermarkets Do Well',
        leftColTag: 'Grand Food & Sunset',
        leftColType: 'pain',
        leftBullets: [
            'The Grand Food Center (Winnetka / Glencoe): Full grocery convenience, in-house smokehouse, daily hot lunch plates, sushi/guacamole, and easy party trays.',
            'Sunset Foods (Northbrook / Highland Park): Massive parking lots, dedicated catering portal (entertaining.sunsetfoods.com), corporate box lunches, and Slagel Farms poultry.',
            'Why We Lose Casual Tuesday Shoppers: Families default to Grand or Sunset on weeknights because they want a fast, complete dinner in one stop.',
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
            'Just two Monday classes/month + 100 Q4 corporate gift boxes adds $60,000+ in high-margin annual revenue.',
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
            'Days 1–30 (Friction Removal): Launch Northfield vs. Winnetka badges; 2-signature holiday/catering packing slip; $49 Weeknight Family Bundles; QR cooking tags.',
            'Days 31–60 (Throughput & AOV): Roll out timed 10-min lunch slots + $58 DIY Italian Beef Home Kits; "Stock Your Freezer" 5-for-$95 pass; Friday SMS Sausage drops.',
            'Days 61–90 (Scale & Recurring): Launch Hofherr Butcher Club ($149/mo); Happ Rd. Curbside Express Bays + Winnetka Holiday Hub; Monday "Butcher & Bourbon" tickets.',
        ],
        rightColTitle: 'Target 12-Month Business Impact',
        rightColTag: 'Projected ROI',
        rightColType: 'fix',
        rightBullets: [
            '+25% to +35% Average Order Value (AOV) via Freezer Passes, Weeknight Bundles, and CPG Jar cross-sells.',
            '2x Holiday Pre-Order Capacity with sub-5-minute Curbside & Winnetka Depot pickup.',
            '$18,000–$30,000/mo in predictable recurring revenue from 125–200 Hofherr Butcher Club members.',
            '4.9★+ Review Trajectory by eliminating holiday line complaints and lunch wait surprises.',
        ],
        bottomTakeaway:
            'Every digital component required for this rollout is already architected into the Hofherr Next.js platform.',
    },
];

const BUSINESS_PILLARS: BusinessPillar[] = [
    {
        name: '1. Custom Butcher Counter (Northfield Flagship)',
        role: 'Brand Anchor & Whole-Animal Source',
        margin: '38% – 45% Gross',
        aov: '$65 – $140',
        currentStrength: 'Cut-to-order USDA Prime & 45-day dry-aged steaks, heritage pork, Slagel/Midwest family farms.',
        currentBottleneck: 'Per-pound "sticker shock" for casual shoppers; counter queue slows down pre-paid pickups.',
        competitorPlay: 'Porter Road spotlights underutilized value cuts (denver, flat iron); Sunset bundles meal sides.',
        hofherrUpgrade: 'Launch $49 Weeknight Family Bundles, QR "Cook It Right" video tags, and a Pre-Paid Express Counter Lane.',
    },
    {
        name: '2. Hot Prepared Foods & The Depot (Winnetka Metra)',
        role: 'High-Frequency Commuter Acquisition',
        margin: '62% – 68% Gross',
        aov: '$18 – $34',
        currentStrength: 'Cult-famous Shabu-Style Italian Beef (Kevin Pang collab), weekend fried chicken, commuter coffee.',
        currentBottleneck: '30–45 minute wait times during peak lunch rushes; early sell-outs; location confusion.',
        competitorPlay: 'PQM runs rapid pre-ordered box lunches; Grand Food Center has grab-and-go hot cases.',
        hofherrUpgrade: 'Timed 10-min online pickup windows, live daily batch counters, and $58 4-Pack DIY Shabu Beef Home Kits.',
    },
    {
        name: '3. House Sausages & Gourmet Freezer Wall',
        role: 'Zero-Spoilage Margin & Repeat-Visit Driver',
        margin: '58% – 68% Gross',
        aov: '$45 – $95',
        currentStrength: '"Best in Show" Cheddar Jalapeño & breakfast sausages, Chicken Pot Pie, Smoked Lamb Curry, 24-hr broth.',
        currentBottleneck: 'Purchased as single impulse items rather than multi-meal weeknight bundles.',
        competitorPlay: 'Paulina Meat Market drives massive volume with 40+ sausage varieties & bulk freezer packs.',
        hofherrUpgrade: '"Stock Your Freezer" 5-for-$95 Pass at steak checkout + Friday SMS "Sausage of the Month" limited drops.',
    },
    {
        name: '4. Holiday Pre-Orders (Thanksgiving / Xmas / Super Bowl)',
        role: '#1 Annual Cash-Flow Spikes',
        margin: '48% – 55% Gross',
        aov: '$165 – $380',
        currentStrength: 'Rave-reviewed chargrilled pre-carved Thanksgiving turkeys, holiday briskets, and standing rib roasts.',
        currentBottleneck: 'Long sidewalk lines at 300 S. Happ Rd., tight parking, and occasional missing side dishes under pressure.',
        competitorPlay: 'Paulina & Pat LaFrieda use strict time-slot caps and multi-zone fulfillment.',
        hofherrUpgrade: '3 Happ Rd. Curbside Express Bays (SMS runner) + Two-Signature Packing Slip + Winnetka Depot Pickup Hub.',
    },
    {
        name: '5. BBQ, Whole-Hog & Corporate Catering',
        role: 'High-Ticket Volume Engine',
        margin: '55% – 64% Gross',
        aov: '$450 – $3,500+',
        currentStrength: 'White-oak smoked brisket, pig roasts, and custom backyard/event catering.',
        currentBottleneck: 'Under-penetrated in weekday North Shore corporate office lunches & turnkey graduation/game-day bars.',
        competitorPlay: 'Sunset Foods (entertaining.sunsetfoods.com) & PQM dominate corporate box lunches and buffet trays.',
        hofherrUpgrade: 'Launch turnkey $275–$550 "Italian Beef Catering Bars" + North Shore Executive Box Lunches.',
    },
    {
        name: '6. Subscriptions, CPG Pantry Jars & Dark-Hours Events',
        role: 'Recurring Revenue & 70%+ Margin Expansion',
        margin: '65% – 75% Gross',
        aov: '$149 – $300',
        currentStrength: 'High customer trust in Sean & Arielle; proprietary 3-year-aged giardiniera, jus, and tallow.',
        currentBottleneck: 'Northfield shop sits dark on Mondays/evenings; no recurring monthly membership box yet.',
        competitorPlay: 'ButcherBox & Snake River Farms lock in monthly recurring revenue; PQM hosts ticketed butcher classes.',
        hofherrUpgrade: 'Hofherr Butcher Club ($149/mo), bottled CPG jar wall, Q4 Corporate Gift Crates, and Monday "Butcher & Bourbon" classes.',
    },
];

const COMPETITORS: CompetitorEntry[] = [
    {
        name: 'The Grand Food Center',
        tier: 'North Shore Local',
        locations: 'Winnetka & Glencoe (Direct Local Rival)',
        whatTheyDoWell: [
            'One-stop upscale grocery convenience with easy parking',
            'In-house smokehouse (ribs, brisket) + full deli, sushi, salads & guacamole',
            'High-volume game-day and holiday party trays',
        ],
        theirWeakness: 'Supermarket meat counter—lacks whole-animal dry-aging, master butcher authority, and cult hero sandwiches.',
        whatWeStealOrBeat:
            'Add grab-and-go sides/salads/potatoes to our $49 Weeknight Bundles so families don\'t default to Grand Food Center on Tuesday nights.',
    },
    {
        name: 'Sunset Foods',
        tier: 'North Shore Local',
        locations: 'Northbrook, Highland Park, Lake Forest',
        whatTheyDoWell: [
            'Dedicated catering portal (entertaining.sunsetfoods.com) with corporate box lunches & equipment rentals',
            'Large parking lots and full grocery basket convenience',
            'Strong local farm poultry & custom counter reputation',
        ],
        theirWeakness: 'Corporate supermarket feel; cannot match Hofherr\'s small-batch sausages, 45-day dry-aged program, or Shabu Italian Beef.',
        whatWeStealOrBeat:
            'Beat their catering portal with our interactive BBQ & Pig Roast Calculator + turnkey $275–$550 Italian Beef Catering Bars.',
    },
    {
        name: 'Paulina Meat Market',
        tier: 'Chicago Heritage',
        locations: 'Chicago (Lakeview — 75+ Year Icon)',
        whatTheyDoWell: [
            '40+ house-made smoked sausages, brats, and bacons',
            'Massive prepared frozen entree case (stroganoff, pot pies, smoked meats)',
            'Regimented holiday pre-order system',
        ],
        theirWeakness: '40–50 minute drive down to Lincoln Ave for North Shore residents; older web experience.',
        whatWeStealOrBeat:
            'Replicate Paulina\'s frozen entree volume on the North Shore with our "Stock Your Freezer" 5-for-$95 Pass and monthly sausage drops.',
    },
    {
        name: 'Publican Quality Meats (PQM)',
        tier: 'Chicago Heritage',
        locations: 'Chicago (West Loop / Fulton Market)',
        whatTheyDoWell: [
            'Chef-driven butcher + café hybrid with acclaimed sandwiches and charcuterie',
            'Ticketed evening butcher classes, dinners, and whole-animal education',
            'High-end artisan catering & box lunches',
        ],
        theirWeakness: 'West Loop congestion; not accessible for daily North Shore family shopping.',
        whatWeStealOrBeat:
            'Monetize Northfield\'s closed Mondays with $150/seat "Butcher & Bourbon" masterclasses and launch North Shore Executive Box Lunches.',
    },
    {
        name: "Gene's Sausage Shop & Carnivore",
        tier: 'Chicago Heritage',
        locations: 'Lincoln Square & Oak Park',
        whatTheyDoWell: [
            'High-margin specialty pantry cross-sells (mustards, jars, rubs, imported goods)',
            'Prepared lunch counters and seasonal rooftop/event activations',
        ],
        theirWeakness: 'Geographic distance from Northfield/Winnetka.',
        whatWeStealOrBeat:
            'Build a high-margin CPG checkout wall (3-Yr-Aged Giardiniera, Concentrated Jus, Smoked Beef Tallow, Compound Butters) to lift AOV by +$18.',
    },
    {
        name: 'Porter Road & Flannery Beef',
        tier: 'National DTC',
        locations: 'Nationwide Online Shipping',
        whatTheyDoWell: [
            'Best-in-class digital cut education and recipe-to-cart merchandising',
            'Championing high-margin "butcher\'s secret" cuts (denver, flat iron, picanha, hanger)',
            'Transparent dry-aging moisture-loss education',
        ],
        theirWeakness: '$25–$40 shipping/dry-ice overhead per box; meat arrives vacuum-packed from out of state rather than hand-cut today.',
        whatWeStealOrBeat:
            'Pair our live Cut Guide (/cut-guide) with QR "Cook It Right" video stickers on every wrapped parcel.',
    },
    {
        name: 'Snake River Farms & ButcherBox',
        tier: 'National DTC',
        locations: 'Nationwide Subscription & Gifting',
        whatTheyDoWell: [
            'Recurring monthly subscription boxes ("skip, swap, or pause anytime")',
            'Tiered loyalty points (Club SRF) and high-ticket Q4 corporate gifting crates',
        ],
        theirWeakness: 'Mass-market frozen fulfillment; impersonal customer service; high packaging waste.',
        whatWeStealOrBeat:
            'Launch "Hofherr Butcher Club" ($149/mo local pickup/delivery) with priority holiday pickup slots + Q4 North Shore Corporate Gift Crates.',
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
        fix: '$49 Weeknight Family Dinner Bundles (~$12/person) + Butcher\'s Secret Value Cuts + Butcher Club.',
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
            '1) Add Northfield vs. Winnetka badges across Yelp/FB/Google/Web; 2) Implement 2-Signature Packing Slip for catering & holiday orders; 3) Launch $49 Weeknight Family Bundles & QR "Cook It Right" steak tags; 4) Set up Pre-Paid Express Pickup Shelf at 300 S. Happ Rd.',
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
            '1) Launch Hofherr Butcher Club monthly subscription ($149/mo); 2) Deploy Happ Rd. Curbside Express Bays + Winnetka Depot Holiday Pickup Hub; 3) Launch $275–$550 Italian Beef Catering Bars & Q4 Corporate Gift Crates; 4) Host first Monday night "Butcher & Bourbon" Masterclass ($150/seat).',
        impact: '2x holiday order capacity with zero sidewalk bottlenecks + $20k–$30k/mo recurring revenue.',
    },
];

export default function PitchDeckClient({ embedded = false }: { embedded?: boolean }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [viewMode, setViewMode] = useState<'slides' | 'full'>('slides');
    const [compFilter, setCompFilter] = useState<'All' | 'North Shore Local' | 'Chicago Heritage' | 'National DTC'>('All');

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

    const currentSlide = SLIDES[activeSlide];
    const filteredCompetitors =
        compFilter === 'All' ? COMPETITORS : COMPETITORS.filter((c) => c.tier === compFilter);

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
                            Covering every side of the business—unit economics, North Shore &amp; Chicago competitor
                            playbooks, Yelp/Facebook operational fixes, CPG &amp; freezer expansion, B2B catering, and
                            dark-hours monetization.
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

            {/* ── Section 2: All 6 Business Sides & Unit Economics ── */}
            <section id="business-pillars" aria-labelledby="business-pillars-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="business-pillars-heading" className={styles.sectionTitle}>
                            All 6 Sides of the Business (Unit Economics &amp; Upgrades)
                        </h2>
                        <p className={styles.sectionDesc}>
                            How every revenue stream at Hofherr Meat Co. works together—from whole-animal butcher yield
                            and commuter lunch traffic to high-margin freezer passes, holiday spikes, B2B catering, and
                            dark-hours masterclasses.
                        </p>
                    </div>

                    <div className={styles.twoColGrid}>
                        {BUSINESS_PILLARS.map((pillar) => (
                            <div key={pillar.name} className={`${styles.card} ${styles.cardFix}`}>
                                <div className={styles.cardHead}>
                                    <div>
                                        <span className={styles.cardSub}>{pillar.role}</span>
                                        <h3 className={styles.cardTitle}>{pillar.name}</h3>
                                    </div>
                                    <span className={`${styles.tag} ${styles.tagGold}`}>{pillar.margin}</span>
                                </div>

                                <p className={styles.cardBody}>
                                    <strong>Current Strength:</strong> {pillar.currentStrength}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Current Friction / Bottleneck:</strong> {pillar.currentBottleneck}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>What Competitors Do:</strong> {pillar.competitorPlay}
                                </p>
                                <p className={styles.cardBody}>
                                    <strong>Strategic Upgrade:</strong> {pillar.hofherrUpgrade}
                                </p>

                                <div className={styles.metricRow}>
                                    <div className={styles.metricPill}>
                                        <span className={styles.metricKey}>Target Gross Margin</span>
                                        <span className={styles.metricVal}>{pillar.margin}</span>
                                    </div>
                                    <div className={styles.metricPill}>
                                        <span className={styles.metricKey}>Target Ticket / AOV</span>
                                        <span className={styles.metricVal}>{pillar.aov}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 3: Competitor Intelligence Matrix ── */}
            <section id="competitors" aria-labelledby="competitors-heading" className="section">
                <div className={`container ${styles.sectionBlock}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="competitors-heading" className={styles.sectionTitle}>
                            What Competitors Are Doing (And How Hofherr Wins)
                        </h2>
                        <p className={styles.sectionDesc}>
                            Benchmarking direct North Shore grocers (Grand Food Center, Sunset Foods), Chicago butcher
                            legends (Paulina Market, Publican Quality Meats, Gene&apos;s), and National DTC leaders
                            (Porter Road, Snake River Farms, ButcherBox).
                        </p>
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

            {/* ── Section 4: Pain Point to Solution Matrix ── */}
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

            {/* ── Section 5: 90-Day Execution Roadmap ── */}
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
                            review, analyzing North Shore, Chicago, and National DTC competitors, and optimizing all 6
                            revenue engines across Northfield (300 S. Happ Rd.) and The Depot (Winnetka Metra).
                        </p>
                        <div className={styles.heroStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>14 Slides</span>
                                <span className={styles.statLabel}>360° Strategy Deck</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>6 Engines</span>
                                <span className={styles.statLabel}>Business Pillars Analyzed</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>8 Rivals</span>
                                <span className={styles.statLabel}>Local &amp; National Benchmarks</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>+30% AOV</span>
                                <span className={styles.statLabel}>Target Revenue &amp; Margin Lift</span>
                            </div>
                        </div>
                        <nav className={styles.quickJumpNav} aria-label="Pitch deck sections">
                            <a href="#pitch-deck" className={styles.jumpLink}>
                                01 · 14-Slide Interactive Deck
                            </a>
                            <a href="#business-pillars" className={styles.jumpLink}>
                                02 · All 6 Business Sides &amp; Margins
                            </a>
                            <a href="#competitors" className={styles.jumpLink}>
                                03 · Competitor Intelligence
                            </a>
                            <a href="#pain-matrix" className={styles.jumpLink}>
                                04 · Review Pain-Point Fixes
                            </a>
                            <a href="#rollout-plan" className={styles.jumpLink}>
                                05 · 90-Day Execution Plan
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
            {deckBody}
        </main>
    );
}
