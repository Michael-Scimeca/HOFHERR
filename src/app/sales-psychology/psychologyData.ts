export type PsychCategory = 'all' | 'pricing' | 'classics' | 'copy' | 'ux' | 'trust';

export interface PsychStudy {
    id: string;
    number: string;
    category: Exclude<PsychCategory, 'all'>;
    categoryLabel: string;
    principle: string;
    headlineStat: string;
    statLabel: string;
    studyTitle: string;
    researchers: string;
    publication: string;
    year: number;
    finding: string;
    hofherrPlay: string;
    siteStatus: 'live' | 'ready';
    siteNote: string;
}

export const PSYCH_CATEGORIES: { id: PsychCategory; label: string }[] = [
    { id: 'all', label: 'All 24 Studies' },
    { id: 'classics', label: 'Theaters, McDonald’s & Retail' },
    { id: 'pricing', label: 'Pricing & Value' },
    { id: 'copy', label: 'Menu Copy' },
    { id: 'ux', label: 'Choice & UX' },
    { id: 'trust', label: 'Trust & Urgency' },
];

export const PSYCH_STUDIES: PsychStudy[] = [
    {
        id: 'anchoring-decoy',
        number: '01',
        category: 'pricing',
        categoryLabel: 'Pricing & Value',
        principle: 'Price Anchoring & The Decoy Effect',
        headlineStat: '+30–43%',
        statLabel: 'Shift to higher-margin tier',
        studyTitle: 'Adding Asymmetrically Dominated Alternatives & Predictably Irrational Pricing',
        researchers: 'Huber, Payne & Puto (1982); Dan Ariely (MIT Sloan, 2008)',
        publication: 'Journal of Consumer Research / MIT Experiment',
        year: 2008,
        finding:
            'Buyers rarely judge prices in isolation—they evaluate them relative to the first number they see. Presenting a flagship high-anchor option makes the target mid-tier item feel like the smart, restrained choice rather than an indulgence.',
        hofherrPlay:
            'Lead the Beef section with a flagship 45-Day Dry-Aged Tomahawk ($125+) and frame $48.99/lb USDA Prime Ribeye next to a $68 North Shore steakhouse dinner (~$16/serving at home). Directly neutralizes supermarket "sticker shock."',
        siteStatus: 'live',
        siteNote: 'Per-serving & steakhouse comparison anchors are now live on /online-orders.',
    },
    {
        id: 'sensory-labels',
        number: '02',
        category: 'copy',
        categoryLabel: 'Menu Copy',
        principle: 'Descriptive Sensory & Origin Labeling',
        headlineStat: '+27%',
        statLabel: 'Increase in item sales',
        studyTitle: 'How Descriptive Food Names Bias Sensory Perceptions in Restaurants',
        researchers: 'Brian Wansink, James Painter & Koert Van Ittersum',
        publication: 'Food Quality and Preference (Cornell Food & Brand Lab)',
        year: 2005,
        finding:
            'Replacing plain commodity names ("Seafood Filet") with sensory, geographic, and heritage cues ("Succulent Italian Seafood Filet") boosted sales by 27% and increased post-meal taste & value scores—even though the food was 100% identical.',
        hofherrPlay:
            'Never list a bare commodity name when you can lead with craft: "45-Day Dry-Aged Midwest Prime Ribeye — Hand-Trimmed & Tied" or "House-Cured Cheddar Jalapeño Sausage (BaconFest Winner)."',
        siteStatus: 'live',
        siteNote: 'Active across Signature Dishes, Parcel Sheets, and Specials descriptions.',
    },
    {
        id: 'pain-of-paying',
        number: '03',
        category: 'pricing',
        categoryLabel: 'Pricing & Value',
        principle: 'Reducing the "Pain of Paying"',
        headlineStat: '+8.15%',
        statLabel: 'Higher spend per guest',
        studyTitle: 'Menu Price Formats & Neural Predictors of Purchases',
        researchers: 'Yang, Kimes & Sessarego (Cornell, 2009); Knutson et al. (Stanford, 2007)',
        publication: 'Cornell Center for Hospitality Research / Neuron',
        year: 2009,
        finding:
            'fMRI scans show high-salience price cues activate the brain’s insula (pain center). Menus that soften currency emphasis and avoid leader lines pulling the eye straight to a price column drove 8.15% higher average spend.',
        hofherrPlay:
            'Keep prices visually calm instead of giant red tags, anchor value on what the customer gets (serves 10+ adults, hand-trimmed zero water-weight loss), and offer 1-tap Apple Pay / Google Pay / Link at checkout.',
        siteStatus: 'live',
        siteNote: 'Express Checkout + clean typography are live; per-serving framing can be expanded.',
    },
    {
        id: 'paradox-of-choice',
        number: '04',
        category: 'ux',
        categoryLabel: 'Choice & UX',
        principle: 'The Paradox of Choice (Curated Bundles)',
        headlineStat: '10×',
        statLabel: 'Higher conversion (30% vs. 3%)',
        studyTitle: 'When Choice Is Demotivating: Can One Desire Too Much of a Good Thing?',
        researchers: 'Sheena Iyengar & Mark Lepper',
        publication: 'Journal of Personality and Social Psychology (Columbia / Stanford)',
        year: 2000,
        finding:
            'In the landmark "Jam Study," a tasting table with 24 jams attracted browsers, but only 3% bought. A curated table of 6 jams converted 30% of stoppers—a 10× lift from eliminating decision paralysis.',
        hofherrPlay:
            'Hofherr carries 403+ cuts online. Surface 3–5 curated "Butcher Bundles" (Date Night Steak Box, Grill Master Pack, Holiday Dinner Kit) at the top of /online-orders so first-timers have an effortless 1-click path.',
        siteStatus: 'live',
        siteNote: 'Curated Bundles & 1-Click Buy Again are live on /online-orders.',
    },
    {
        id: 'scarcity-loss-aversion',
        number: '05',
        category: 'trust',
        categoryLabel: 'Trust & Urgency',
        principle: 'Authentic Scarcity & Loss Aversion',
        headlineStat: '2×',
        statLabel: 'Losses outweigh equivalent gains',
        studyTitle: 'Effects of Supply and Demand on Ratings of Object Value / Prospect Theory',
        researchers: 'Worchel, Lee & Adewole (1975); Kahneman & Tversky (1979)',
        publication: 'Journal of Personality and Social Psychology / Econometrica',
        year: 1979,
        finding:
            'People value identical goods significantly higher when supply is genuinely limited (the "Cookie Jar Study"), and Prospect Theory proves the fear of missing out hurts roughly twice as much as an equivalent gain feels good.',
        hofherrPlay:
            'Use honest operational scarcity—never fake countdown timers: real 15-min holiday pickup slot caps, "Order by 1:30pm for Same-Day Depot Pickup," and "48-Hr Early Access to Holiday Roasts" for newsletter subscribers.',
        siteStatus: 'live',
        siteNote: 'Live per-slot pickup caps, Kitchen Load Throttle, and early-access newsletter copy.',
    },
    {
        id: 'social-proof-authority',
        number: '06',
        category: 'trust',
        categoryLabel: 'Trust & Urgency',
        principle: 'Localized Social Proof & Borrowed Authority',
        headlineStat: '+26–33%',
        statLabel: 'Compliance & conversion lift',
        studyTitle: 'A Room with a Viewpoint: Using Social Norms to Motivate Behavior',
        researchers: 'Goldstein, Cialdini & Griskevicius',
        publication: 'Journal of Consumer Research',
        year: 2008,
        finding:
            'Specific, locally relevant social proof ("Most guests in this neighborhood chose…") outperformed generic statements by 26%–33%. Third-party authority badges short-circuit skepticism for first-time buyers.',
        hofherrPlay:
            'Pair America’s Test Kitchen "Proof" Podcast authority + 4.7★ (200+ Google Reviews) + local Northfield/Winnetka proof ("North Shore’s favorite Italian Beef") directly alongside high-ticket items.',
        siteStatus: 'live',
        siteNote: 'ATK featured badge, Google Reviews link, and social proof tags are live.',
    },
    {
        id: 'reciprocity',
        number: '07',
        category: 'copy',
        categoryLabel: 'Menu Copy',
        principle: 'Reciprocity Through Free Micro-Value',
        headlineStat: '+14–23%',
        statLabel: 'Lift in tips & repeat spend',
        studyTitle: 'Sweetening the Till: The Use of Candy to Increase Restaurant Tipping',
        researchers: 'Strohmetz, Rind, Fisher & Lynn (2002); Dennis Regan (1971)',
        publication: 'Journal of Applied Social Psychology / JESP',
        year: 2002,
        finding:
            'Giving a small, unexpected, personalized gift triggers a deep human obligation to reciprocate—lifting voluntary generosity by 14% for a single mint and 23% when framed as a personal gesture.',
        hofherrPlay:
            'Turn free butcher craft into visible micro-gifts: complimentary custom trimming & Frenching, free printable Parcel Sheet cooking guides paired with cuts, and free Curbside Trunk Drop-Off at 300 Happ Rd.',
        siteStatus: 'live',
        siteNote: 'Parcel Sheet recipe pairings & free Curbside Trunk Drop-Off are live.',
    },
    {
        id: 'frictionless-defaults',
        number: '08',
        category: 'ux',
        categoryLabel: 'Choice & UX',
        principle: 'Friction Removal & Default Bias',
        headlineStat: '−18–26%',
        statLabel: 'Cart abandonment reduction',
        studyTitle: 'Do Defaults Save Lives? & E-Commerce Checkout Usability Benchmark',
        researchers: 'Eric Johnson & Daniel Goldstein (2003); Baymard Institute (2024)',
        publication: 'Science / Baymard UX Research',
        year: 2024,
        finding:
            'Every forced popup, extra form field, or hidden cart state introduces cognitive friction that causes shoppers to bail—especially on mobile. Making the desired action 1-tap with immediate visual feedback increases basket size.',
        hofherrPlay:
            'Instant 1-click inline Add to Cart (zero interrupting modal), inline − / + stepper, optional inline Butcher Note, and the fixed right-side Mini Cart Rail so shoppers always see their bag without extra clicks.',
        siteStatus: 'live',
        siteNote: 'Inline Add-to-Cart, fixed right-side Mini Cart Rail, and bag-remove motion are live.',
    },
    {
        id: 'theater-popcorn-decoy',
        number: '09',
        category: 'classics',
        categoryLabel: 'Movie Theater Pricing',
        principle: 'The Movie Theater Popcorn Decoy',
        headlineStat: '80%+',
        statLabel: 'Upgrade to Large when decoy is added',
        studyTitle: 'Asymmetric Dominance in Tiered Concession Pricing (National Geographic / Brain Games Replication)',
        researchers: 'Huber, Payne & Puto (1982); National Geographic Field Experiment',
        publication: 'Journal of Consumer Research / Field Replication',
        year: 2013,
        finding:
            'When a movie theater offered Small ($3.00) and Large ($7.00) popcorn, most customers chose Small. When they added a Medium decoy at $6.50, the Medium existed solely to make the Large look like an absurd bargain for just 50¢ more—flipping the majority of buyers straight to the $7.00 Large.',
        hofherrPlay:
            'Structure Holiday Roasts & BBQ Packages in 3 tiers where Tier 2 is priced close to Tier 3: e.g., Roast Only ($95), Roast + 2 Sides ($139), Full Holiday Feast with 3 Sides & House Gravy ($149—only $10 more).',
        siteStatus: 'ready',
        siteNote: 'Ideal upgrade for /catering packages and Holiday Dinner bundles.',
    },
    {
        id: 'mcdonalds-bundling',
        number: '10',
        category: 'classics',
        categoryLabel: 'McDonald’s Playbook',
        principle: 'McDonald’s Combo Bundling & Cross-Sell ("Fries With That?")',
        headlineStat: '+15–30%',
        statLabel: 'Average ticket lift via combos',
        studyTitle: 'Consumption Effects of Bundling: Consumer Perceptions, Firm Actions, and Public Policy',
        researchers: 'Kathryn Sharpe & Richard Staelin',
        publication: 'Journal of Marketing Research (Duke / Fuqua)',
        year: 2010,
        finding:
            'Combining a main item with high-margin add-ons (fries + drink) into one "Value Meal" compresses three painful buying decisions into a single payment event—increasing attachment of high-margin sides while making the customer feel they got a deal.',
        hofherrPlay:
            'At The Depot, bundle Italian Beef + House Giardiniera + Kettle Soup or Sparrow Coffee as a 1-click "Winnetka Commuter Combo." At Northfield, show 1-click "Complete the Plate" sides (Compound Butter, Beef Tallow, Uncle Dougie’s Rub) right inside the Mini Cart Rail.',
        siteStatus: 'live',
        siteNote: '1-tap "Complete the Plate" cross-sells are live inside the right Mini Cart Rail.',
    },
    {
        id: 'left-digit-vs-round',
        number: '11',
        category: 'classics',
        categoryLabel: 'Retail & Luxury Pricing',
        principle: 'Left-Digit Charm (.99) vs. Luxury Round Numbers ($100)',
        headlineStat: '2 Rules',
        statLabel: '.99 for value · Round for prestige',
        studyTitle: 'Penny Wise and Pound Foolish (2005) & This Number Just Feels Right (2015)',
        researchers: 'Manoj Thomas & Vicki Morwitz (NYU); Monica Wadhwa & Kuangjie Zhang (INSEAD)',
        publication: 'Journal of Consumer Research',
        year: 2015,
        finding:
            'Left-digit bias makes $11.99 register mentally as "11-something" rather than $12—boosting volume on everyday staples. Conversely, Wadhwa & Zhang proved clean round numbers ($100, $150, $250) feel more authentic, confident, and luxurious for splurge & gift purchases.',
        hofherrPlay:
            'Keep .99 pricing on everyday staples & Depot lunches ($11.99 Turkey Stock, $14.99 Italian Beef), and use clean round numbers ($100, $150, $250) on Holiday Hams, Dry-Aged Gift Boxes, and Catering Packages.',
        siteStatus: 'live',
        siteNote: 'Already partially matched ($11.99 stock vs. $100.00 Glazed Spiral Ham).',
    },
    {
        id: 'starbucks-compromise',
        number: '12',
        category: 'classics',
        categoryLabel: 'Starbucks & Goldilocks',
        principle: 'The Compromise Effect (Tall / Grande / Venti)',
        headlineStat: '~60%',
        statLabel: 'Cluster into the middle tier',
        studyTitle: 'Choice Based on Reasons: The Case of Attraction and Compromise Effects',
        researchers: 'Itamar Simonson (Stanford GSB) & Amos Tversky',
        publication: 'Journal of Consumer Research / JMR',
        year: 1992,
        finding:
            'Humans dislike feeling cheap (picking the smallest/cheapest option) and dislike feeling wasteful (picking the most expensive). Adding a third super-premium tier shifts the "safe, reasonable middle" upward—just as Starbucks’ Venti made Grande the default.',
        hofherrPlay:
            'Always display 3 tiers on Catering & Steak Boxes with the high-margin middle option highlighted as "Most Popular" so undecided hosts gravitate straight to it.',
        siteStatus: 'live',
        siteNote: '3-tier structure is active on /catering and subscription boxes.',
    },
    {
        id: 'williams-sonoma-anchor',
        number: '13',
        category: 'classics',
        categoryLabel: 'Retail Halo Anchor',
        principle: 'The Williams-Sonoma $429 Breadmaker Effect',
        headlineStat: '~2×',
        statLabel: 'Sales of the $275 model after anchor',
        studyTitle: 'Context-Dependent Preferences & Catalog Halo Anchoring',
        researchers: 'Itamar Simonson & Amos Tversky (documented in Priceless by W. Poundstone)',
        publication: 'Journal of Marketing Research / Priceless',
        year: 2010,
        finding:
            'Williams-Sonoma’s $275 breadmaker barely sold until they placed a deluxe $429 breadmaker right next to it in their catalog. Almost nobody bought the $429 unit—but sales of the $275 unit nearly doubled because it now looked like the smart value choice.',
        hofherrPlay:
            'Always keep an ultra-premium centerpiece visible at the top of Beef & Holidays (e.g., Japanese A5 Wagyu or Whole Prime Standing Rib Roast $350+). Even if only 5% buy it, it doubles comfort with $48.99/lb Prime Ribeyes.',
        siteStatus: 'live',
        siteNote: 'Top flagship in-stock Beef cut is automatically spotlighted as ★ Butcher’s Reserve with its exact existing price.',
    },
    {
        id: 'descending-price-order',
        number: '14',
        category: 'classics',
        categoryLabel: 'Restaurant Menu Engineering',
        principle: 'High-to-Low Menu Ordering (The Wine List Effect)',
        headlineStat: '+8–12%',
        statLabel: 'Higher average item price chosen',
        studyTitle: 'The Influence of Price Presentation Order on Consumer Choice',
        researchers: 'Kwanho Suk, Jihoon Lee & Donald Lichtenstein',
        publication: 'Journal of Consumer Research',
        year: 2012,
        finding:
            'In controlled restaurant beer and wine experiments, listing items from highest price to lowest price (descending) caused guests to pick significantly higher-priced options than listing cheapest-first, because the first price seen sets the mental reference point.',
        hofherrPlay:
            'Sort Beef & Specials sections with flagship Prime & Dry-Aged cuts at the top and lower-priced items (bones, trim, stocks) below—never sort a craft butcher menu "Price: Low to High" by default.',
        siteStatus: 'live',
        siteNote: 'Prime Tenderloin, Porterhouse & Filet Mignon lead the Beef category.',
    },
    {
        id: 'multi-unit-limits',
        number: '15',
        category: 'classics',
        categoryLabel: 'Supermarket & Costco',
        principle: 'Multiple-Unit Anchoring ("4 for $40") & Purchase Limits',
        headlineStat: '+32–100%',
        statLabel: 'Unit volume lift in grocery tests',
        studyTitle: 'An Anchoring and Adjustment Model of Purchase Quantity Decisions',
        researchers: 'Brian Wansink, Robert Kent & Stephen Hoch',
        publication: 'Journal of Marketing Research',
        year: 1998,
        finding:
            'Labeling cans "10 for $10" instead of "$1 each" boosted sales 32%–40% even when single units still cost $1. Adding an artificial cap ("Limit 12 per customer") doubled average purchase quantities because buyers treat the limit as a social cue for how many to grab.',
        hofherrPlay:
            'Offer multi-pack anchors on high-repeat cuts ("4 for $44 Prime Steakburgers" or "6-Pack House Sausages") and display honest holiday caps ("Limit 2 Prime Standing Rib Roasts per household") during Thanksgiving & Christmas pre-orders.',
        siteStatus: 'ready',
        siteNote: 'Ideal for /online-orders sausage/burger packs and Holiday Roast pre-orders.',
    },
    {
        id: 'price-quality-placebo',
        number: '16',
        category: 'pricing',
        categoryLabel: 'Pricing & Value',
        principle: 'The Price-Quality Placebo Effect (Expensive Tastes Better)',
        headlineStat: 'fMRI Proven',
        statLabel: 'Higher price activates pleasure center',
        studyTitle: 'Marketing Actions Can Modulate Neural Representations of Experienced Pleasantness',
        researchers: 'Hilke Plassmann, John O’Doherty, Baba Shiv & Antonio Rangel',
        publication: 'Proceedings of the National Academy of Sciences (Caltech / Stanford)',
        year: 2008,
        finding:
            'Volunteers tasted the exact same wine labeled $10 vs. $90 inside an fMRI scanner. Not only did they rate the $90 bottle higher—their medial orbitofrontal cortex (brain pleasure center) physically fired harder. Price itself shapes flavor perception.',
        hofherrPlay:
            'Never apologize for or slash prices on Dry-Aged Prime or Wagyu. Pair confident pricing with origin stories, dry-aging days, and chef craft—premium framing literally makes the steak taste better on the customer’s plate.',
        siteStatus: 'live',
        siteNote: 'Reinforced across Cut Guide, Dry-Aged copy, and Our Story provenance.',
    },
    {
        id: 'zero-price-effect',
        number: '17',
        category: 'pricing',
        categoryLabel: 'E-Commerce & Shipping',
        principle: 'The Zero-Price Effect ("FREE" Beats Cheaper Math)',
        headlineStat: '2–3×',
        statLabel: 'Preference jump when a fee hits $0',
        studyTitle: 'Zero as a Special Price: The True Value of Free Products',
        researchers: 'Kristina Shampanier, Nina Mazar & Dan Ariely',
        publication: 'Marketing Science (MIT / Duke)',
        year: 2007,
        finding:
            'People do not treat $0 as just one dollar less than $1—they experience an emotional surge because "Free" removes all risk of a bad deal. "$30 + Free Shipping" routinely outsells "$25 + $5 Shipping" despite identical math.',
        hofherrPlay:
            'Spotlight every $0 craft perk loudly ("Free Custom Trimming & Frenching", "Free Curbside Trunk Drop-Off") and add a dynamic Mini Cart Rail progress bar: "Add $18 more for Free House Compound Butter" (free gift threshold lifts AOV by 15%–25%).',
        siteStatus: 'live',
        siteNote: 'Free Curbside, trimming, and the dynamic Mini Cart free-gift progress bar are live.',
    },
    {
        id: 'rule-of-100',
        number: '18',
        category: 'copy',
        categoryLabel: 'Menu Copy',
        principle: 'The Rule of 100 (% Off vs. $ Off)',
        headlineStat: 'Rule of 100',
        statLabel: 'Under $100 use % · Over $100 use $',
        studyTitle: 'Contagious: Promotion Framing & Perceived Discount Magnitude',
        researchers: 'Jonah Berger (Wharton School, UPenn)',
        publication: 'Wharton Marketing Research / Contagious',
        year: 2013,
        finding:
            'Shoppers judge discount size by whichever raw number looks larger. On items under $100, percentages look bigger ("20% off $50" beats "$10 off"). On orders over $100, dollar amounts look bigger ("$50 off $250" beats "20% off").',
        hofherrPlay:
            'On Depot lunches, sausages, and weekly specials (<$100), frame promos as percentages ("15% off Sausage 4-Packs"). On Holiday Roasts, Butcher Boxes, and Catering (>$100), always frame in dollars ("Save $45 on the Full Feast Bundle").',
        siteStatus: 'ready',
        siteNote: 'Apply across /specials, /catering bundles, and newsletter promo banners.',
    },
    {
        id: 'ikea-effect',
        number: '19',
        category: 'ux',
        categoryLabel: 'Choice & UX',
        principle: 'The IKEA Effect (Co-Creation Lifts Willingness to Pay)',
        headlineStat: '+63%',
        statLabel: 'Higher valuation for self-built items',
        studyTitle: 'The IKEA Effect: When Labor Leads to Love',
        researchers: 'Michael Norton, Daniel Mochon & Dan Ariely',
        publication: 'Journal of Consumer Psychology (Harvard / Yale / Duke)',
        year: 2012,
        finding:
            'When customers invest even tiny amounts of effort into customizing or assembling an order, they feel psychological ownership and value the exact same product dramatically higher than a pre-made version.',
        hofherrPlay:
            'Let shoppers customize thickness, trim style, and tie notes inline on /online-orders, let hosts build custom menus in the interactive /catering calculator, and offer a "Build Your Own Butcher Box" flow.',
        siteStatus: 'live',
        siteNote: 'Inline Butcher Notes and interactive Catering Calculator are live.',
    },
    {
        id: 'peak-end-rule',
        number: '20',
        category: 'classics',
        categoryLabel: 'IKEA & Hospitality',
        principle: 'The Peak-End Rule (IKEA’s $1 Exit Hot Dog)',
        headlineStat: 'Peak + End',
        statLabel: 'Moments that define total memory',
        studyTitle: 'When More Pain Is Preferred to Less: Adding a Better End',
        researchers: 'Daniel Kahneman, Barbara Fredrickson, Charles Schreiber & Donald Redelmeier',
        publication: 'Psychological Science',
        year: 1993,
        finding:
            'People don’t remember the average of an experience—they remember the emotional peak and the final moment. IKEA puts $1 cones and $1.50 hot dogs past the register so shoppers leave feeling delighted even after spending $400.',
        hofherrPlay:
            'Engineer the final touchpoint: a warm order-confirmation screen with clear pickup directions, a printed Parcel Sheet sear card + occasional surprise seasoning sample in the bag, and effortless Curbside Trunk Drop-Off.',
        siteStatus: 'live',
        siteNote: 'Order confirmation UX, Parcel Sheets, and Curbside Drop-Off are live.',
    },
    {
        id: 'jcpenney-transaction-utility',
        number: '21',
        category: 'classics',
        categoryLabel: 'Retail & Luxury Pricing',
        principle: 'Transaction Utility (The JCPenney "Honest Pricing" Lesson)',
        headlineStat: '−25% Crash',
        statLabel: 'When JCPenney killed deal framing',
        studyTitle: 'Mental Accounting and Consumer Choice',
        researchers: 'Richard Thaler (University of Chicago, Nobel Laureate)',
        publication: 'Marketing Science',
        year: 1985,
        finding:
            'Buyers derive two values: Acquisition Utility (the product itself) and Transaction Utility (the thrill of getting a smart deal). When JCPenney banned sales for flat pricing in 2012, revenue plunged 25%—yet constant discounting also erodes luxury brands.',
        hofherrPlay:
            'Protect Hofherr’s craft reputation by never running cheap site-wide markdowns on Prime beef. Instead deliver Transaction Utility via value-add bonuses ("Free $14 House Jus & Herb Butter with any Holiday Roast") so buyers feel smart without cheapening the cut.',
        siteStatus: 'live',
        siteNote: 'Value-add bonuses & household limits are live on /specials and /gift-cards.',
    },
    {
        id: 'syllable-font-fluency',
        number: '22',
        category: 'copy',
        categoryLabel: 'Menu Copy',
        principle: 'Price Syllable Length & Visual Font Fluency',
        headlineStat: 'Fewer Syllables',
        statLabel: 'Literally feels like a smaller price',
        studyTitle: 'Small Numbers & Phonetic Length: Effects on Price Magnitude Perceptions',
        researchers: 'Keith Coulter, Pilsik Choi & Kent Monroe (2012); Coulter & Coulter (2005)',
        publication: 'Journal of Consumer Psychology / JCR',
        year: 2012,
        finding:
            'Even while reading silently, the brain sub-vocalizes prices. "$150" (3 syllables) feels significantly cheaper than "$150.00" (6 syllables). Likewise, rendering prices in a slightly smaller font than the item title reduces perceived cost.',
        hofherrPlay:
            'Strip trailing ".00" on whole-dollar packages and catering tiers ($150 instead of $150.00), omit commas where clean, and keep price typography lighter and smaller than the bold cut headline.',
        siteStatus: 'live',
        siteNote: 'formatDisplayPrice() strips trailing ".00" on whole-dollar items across /online-orders.',
    },
    {
        id: 'monopoly-money-gift-cards',
        number: '23',
        category: 'classics',
        categoryLabel: 'Casinos & Disney',
        principle: 'The "Monopoly Money" Effect (Gift Cards & Pre-Paid Credit)',
        headlineStat: '+20–40%',
        statLabel: 'Overspend above gift card value',
        studyTitle: 'Monopoly Money: The Effect of Payment Coupling and Form on Spending Behavior',
        researchers: 'Priya Raghubir & Joydeep Srivastava (NYU Stern / Maryland)',
        publication: 'Journal of Experimental Psychology: Applied',
        year: 2008,
        finding:
            'Tokens, casino chips, Disney wristbands, and gift cards decouple spending from real cash, numbing the pain of paying. Gift card recipients treat the balance like "free money" and routinely splurge on higher-margin cuts 20%–40% beyond the card total.',
        hofherrPlay:
            'Feature Hofherr Gift Cards prominently during holidays, Father’s Day, and checkout ("Give the gift of Dry-Aged Prime"), with pre-selected $100 / $150 / $250 denominations and a bonus-card promo ("Buy $150, get a $15 Depot Lunch card").',
        siteStatus: 'live',
        siteNote: 'Dedicated /gift-cards page is live; holiday bonus-card tier is ready to add.',
    },
    {
        id: 'pennies-a-day-framing',
        number: '24',
        category: 'pricing',
        categoryLabel: 'Pricing & Value',
        principle: 'Pennies-a-Day & Per-Guest Temporal Reframing',
        headlineStat: '+20–35%',
        statLabel: 'Higher acceptance on big-ticket totals',
        studyTitle: 'Pennies-a-Day: The Effect of Temporal Reframing on Transaction Evaluation',
        researchers: 'John T. Gourville (Harvard Business School)',
        publication: 'Journal of Consumer Research',
        year: 1998,
        finding:
            'Breaking a large aggregate price ($900 catering order or $365/yr subscription) into its smallest natural unit ($18/guest or $1/day) shifts the buyer’s mental comparison from a painful lump sum to everyday pocket change.',
        hofherrPlay:
            'Lead /catering and /bbq quotes with per-guest pricing ("$18/guest") before the event total, and show per-serving math ("~$16/steak") on multi-pound roasts and Butcher Boxes.',
        siteStatus: 'ready',
        siteNote: 'Lead with per-guest math in CateringCalculator and per-serving tags on boxes.',
    },
];

export interface BlueprintAction {
    id: string;
    route: string;
    routeLabel: string;
    pageName: string;
    impact: 'high' | 'medium';
    status: 'live' | 'ready';
    tactic: string;
    studyRefs: string;
    detail: string;
}

export const SITE_BLUEPRINT: BlueprintAction[] = [
    {
        id: 'bp-orders-anchors',
        route: '/online-orders',
        routeLabel: 'Open Online Orders',
        pageName: 'Online Orders & Storefront',
        impact: 'high',
        status: 'live',
        tactic: 'Per-Serving & Steakhouse Anchors + High-to-Low Hero Cuts',
        studyRefs: '#01 Anchoring · #13 Williams-Sonoma · #14 High-to-Low · #24 Pennies-a-Day',
        detail:
            'Flagship Dry-Aged / Prime hero cuts lead Beef, "~$16/serving vs. $68 steakhouse" callouts sit on Prime cuts, and trailing ".00" is stripped on whole-dollar prices.',
    },
    {
        id: 'bp-minicart-upsell',
        route: '/online-orders',
        routeLabel: 'Open Mini Cart Flow',
        pageName: 'Mini Cart Rail (Right Sidebar)',
        impact: 'high',
        status: 'live',
        tactic: 'McDonald’s "Complete the Plate" Cross-Sell + Free-Gift Progress Bar',
        studyRefs: '#10 McDonald’s Bundling · #17 Zero-Price Free · #08 Frictionless 1-Tap',
        detail:
            '1-tap upsell row inside the fixed right Mini Cart Rail (Compound Butter, Beef Tallow, Uncle Dougie’s Rub, Giardiniera) plus a dynamic "Add $X more for Free House Compound Butter" bar.',
    },
    {
        id: 'bp-orders-live',
        route: '/online-orders',
        routeLabel: 'View Live Bundles',
        pageName: 'Online Orders (Already Live)',
        impact: 'high',
        status: 'live',
        tactic: 'Curated Butcher Bundles + 1-Tap Inline Cart + Butcher Notes',
        studyRefs: '#04 Paradox of Choice · #08 Friction Removal · #19 IKEA Effect',
        detail:
            'Curated bundles solve 403-item choice overload, zero-modal 1-tap adds cut checkout friction, and inline Butcher Notes create co-creation ownership.',
    },
    {
        id: 'bp-catering-decoy',
        route: '/catering',
        routeLabel: 'Open Catering',
        pageName: 'Catering & Event Packages',
        impact: 'high',
        status: 'ready',
        tactic: '3-Tier Theater Decoy + Per-Guest Framing + Rule of 100 ($ Off)',
        studyRefs: '#09 Popcorn Decoy · #12 Compromise Effect · #18 Rule of 100 · #24 Per-Guest',
        detail:
            'Price Tier 2 close to Tier 3 so the Full Feast feels like an obvious upgrade, lead every package with "$/guest" before total cost, and highlight "Most Popular" on the highest-margin tier.',
    },
    {
        id: 'bp-bbq-combos',
        route: '/bbq',
        routeLabel: 'Open BBQ & Depot',
        pageName: 'BBQ & The Depot (Winnetka)',
        impact: 'high',
        status: 'ready',
        tactic: 'Commuter Combos + Multi-Pack Anchors + Value-Add Bonuses',
        studyRefs: '#10 McDonald’s Combos · #11 .99 Value Pricing · #15 Multi-Unit Anchors',
        detail:
            'Pair Italian Beef / Smoked Brisket with House Giardiniera + Kettle Soup or Sparrow Coffee as a 1-tap combo, and frame multi-packs ("4 for $44") on repeat favorites.',
    },
    {
        id: 'bp-specials-scarcity',
        route: '/specials',
        routeLabel: 'Open Specials',
        pageName: 'Weekly Specials & Holiday Pre-Orders',
        impact: 'medium',
        status: 'live',
        tactic: 'Honest Household Limits + Value-Add Bonuses (No Cheap Markdowns)',
        studyRefs: '#05 Honest Scarcity · #15 Purchase Limits · #21 JCPenney Lesson',
        detail:
            'Real operational caps ("Limit 2 Prime Rib Roasts per household") and free butcher bonuses ("Free $14 House Jus & Herb Butter included") protect Prime reference prices.',
    },
    {
        id: 'bp-giftcards-monopoly',
        route: '/gift-cards',
        routeLabel: 'Open Gift Cards',
        pageName: 'Gift Cards & Holiday Gifting',
        impact: 'medium',
        status: 'live',
        tactic: 'Round Prestige Denominations ($100 / $150 / $250) + Monopoly Money Lift',
        studyRefs: '#11 Luxury Round Numbers · #23 Monopoly Money Effect',
        detail:
            'Clean round denominations signal prestige; add a seasonal "Buy $150 Gift Card, Get a $15 Depot Lunch Card" bonus to drive 20%–40% recipient overspend.',
    },
    {
        id: 'bp-checkout-peakend',
        route: '/checkout',
        routeLabel: 'Open Checkout',
        pageName: 'Checkout & Pickup Experience',
        impact: 'high',
        status: 'live',
        tactic: '1-Tap Express Pay + Free Curbside Trunk Drop-Off + Peak-End Delight',
        studyRefs: '#03 Pain of Paying · #07 Reciprocity · #20 Peak-End Rule',
        detail:
            'Apple Pay / Google Pay / Link reduce payment pain, real 15-min pickup slot caps reinforce honest scarcity, and free Parcel Sheet sear cards + Curbside Drop-Off nail the final memory.',
    },
];

