/**
 * Migrate hardcoded FAQ and Cut Guide data to Sanity
 * Run: npx tsx scripts/migrate-content.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_WRITE_TOKEN!,
    apiVersion: '2024-01-01',
    useCdn: false,
});

/* ── FAQ Data ───────────────────────────────────────────────────────── */
const FAQS = [
    {
        category: 'ordering',
        items: [
            { q: 'Do I need to call ahead or can I just walk in?', a: 'Walk-ins are always welcome during our regular hours — Tue–Fri 10am–6pm, Sat 10am–5pm, Sun 10am–4pm. For large custom orders or whole/half animals, we recommend calling ahead at (847) 441-6328 so we can have everything ready for you.' },
            { q: 'Can I place an order online or by phone?', a: 'You can order through our online store for select items, or call us at (847) 441-6328. For custom cuts or catering, a phone call is always the best way to make sure we get every detail right.' },
            { q: 'Do you offer curbside pickup?', a: 'Yes! VIP Curbside Pickup is available. Give us a call or send a message when you arrive and we\'ll bring your order out to you.' },
            { q: 'Do you take credit cards?', a: 'Yes — we accept all major credit cards, debit cards, and cash.' },
        ],
    },
    {
        category: 'products',
        items: [
            { q: 'What\'s special about your Italian Beef?', a: 'Our Italian Beef was featured on America\'s Test Kitchen — it\'s our flagship product. Slow-roasted, hand-sliced thin, and served with housemade giardiniera. Available fresh in-store or as part of our online order.' },
            { q: 'When is Rotisserie Chicken available?', a: 'Rotisserie Chicken Dinners are available daily while supplies last. Each dinner comes with a whole rotisserie bird plus sides. We recommend calling ahead to reserve or arriving early — they sell out regularly.' },
            { q: 'Do you do Pig Roasts?', a: 'Yes! Pig roasts are one of our signature catering offerings. Sean and his team source, prep, cook, and serve the whole animal — a showstopping centerpiece for any event. We prefer 2–3 weeks notice minimum. Call us to discuss pricing and availability.' },
            { q: 'What seasonal specials do you offer?', a: 'We do themed specials around major holidays — including a full St. Patrick\'s Day menu featuring corned beef, cabbage, and Irish sausage. Sign up for our newsletter or follow us on social to get notified when seasonal items drop.' },
        ],
    },
    {
        category: 'catering',
        items: [
            { q: 'How much does BBQ catering cost?', a: 'For groups of 20+, pricing starts at $16/person for 1 meat + 1 side. Each additional meat is $4/person and each additional side is $2/person. A charcuterie platter can be added for $4/person. For under 20 people, the minimum order is $200 — contact us for a custom quote.' },
            { q: 'What meats and sides does the BBQ menu include?', a: 'Meats include Smoked Brisket, BBQ Pulled Pork, BBQ Pulled Chicken, Rib Tips & Hot Links, Ribs, and HMC Sausages. Sides include Pimento Mac & Cheese, HMCo.leslaw, Collard Greens, Three-Bean Salad, House Pasta Salad, and Butcher\'s Baked Beans.' },
            { q: 'Do you deliver BBQ catering?', a: 'Yes — drop-off delivery within 5 miles is available for $50, subject to availability. Pickup is always an option at no extra charge.' },
            { q: 'How much advance notice do you need for BBQ catering?', a: 'We require a minimum of 4 days notice for all BBQ catering orders, and recommend booking 2–3 weeks out for events over 50 guests. Summer and holiday weekends fill up fast.' },
        ],
    },
    {
        category: 'products',
        items: [
            { q: 'Can I request a specific cut or thickness?', a: 'Absolutely — that\'s what we\'re here for. Tell us exactly what you need and we\'ll cut it fresh. Whether it\'s a 2-inch thick ribeye, butterfly pork chops, or something you saw in a recipe, just ask.' },
            { q: 'Can I order a whole or half animal?', a: 'Yes. We can source and butcher whole and half hogs, beef sides, and more. These require advance notice (typically 1–2 weeks) and a deposit. Give us a call to discuss options and pricing.' },
            { q: 'Do you make your own sausages?', a: 'Yes! Our house-made sausages are a customer favorite. We produce a rotating selection of flavors in-house using traditional recipes and quality cuts. Ask at the counter for today\'s selection.' },
        ],
    },
    {
        category: 'general',
        items: [
            { q: 'Do you sell gift cards?', a: 'Yes — we offer both physical gift cards (mailed free) and instant eGift cards powered by Square. eGift cards are sent directly to the recipient\'s inbox. Physical cards can be mailed to you or the recipient, or picked up curbside.' },
            { q: 'Do gift cards expire?', a: 'Nope. Both physical and eGift cards never expire — they can be used whenever.' },
            { q: 'What amounts are available?', a: 'There\'s no minimum or maximum. Popular amounts are $25, $50, $100, and $200, but you can load any amount you choose.' },
            { q: 'How do I order a physical gift card?', a: 'Email us at butcher@hofherrmeatco.com with the amount you\'d like loaded and your contact info. We\'ll call to take payment over the phone, then mail the card free or arrange curbside pickup.' },
        ],
    },
    {
        category: 'products',
        items: [
            { q: 'Where does your meat come from?', a: 'We source from trusted family farms and quality suppliers who share our commitment to responsible, humane animal husbandry. Every product on our floor meets our personal quality standard — if we wouldn\'t serve it at home, it doesn\'t make the cut.' },
            { q: 'Do you carry grass-fed, pasture-raised, or organic options?', a: 'We carry a rotating selection of grass-fed beef, pasture-raised pork, and humanely raised chicken. Availability can vary — call or stop in to ask about what\'s on hand that day.' },
            { q: 'Do you carry anything besides meat?', a: 'Yes — we stock a curated selection of specialty dry rubs, sauces, marinades, and pantry staples that pair perfectly with our cuts.' },
        ],
    },
];

/* ── Cut Guide Data ─────────────────────────────────────────────────── */
const CUTS: { animal: string; cuts: { name: string; sub: string; best: string; cook: string; tip: string }[] }[] = [
    {
        animal: 'beef',
        cuts: [
            { name: 'Ribeye', sub: 'Rib section', best: 'Steakhouse-quality grilling', cook: 'Grill · Cast Iron', tip: 'Pull at 125°F for medium-rare. Let it rest 5 min.' },
            { name: 'Strip Steak', sub: 'Short loin', best: 'Bold, beefy flavor with a firm chew', cook: 'Grill · Pan Sear', tip: 'Season with just salt & pepper — it doesn\'t need help.' },
            { name: 'Tenderloin', sub: 'Short loin / Sirloin', best: 'Butter-soft texture, mild flavor', cook: 'Roast · Pan Sear · Grill', tip: 'Don\'t overcook — 130°F is perfect.' },
            { name: 'T-Bone', sub: 'Short loin', best: 'Two steaks in one — strip + tenderloin', cook: 'Grill', tip: 'Bring to room temp before grilling for even cook.' },
            { name: 'Chuck Roast', sub: 'Chuck', best: 'Braising, pot roast, slow BBQ', cook: 'Braise · Slow Roast · Sous Vide', tip: 'Low and slow — 12+ hours at 250°F unlocks buttery texture.' },
            { name: 'Brisket', sub: 'Chest / Brisket', best: 'BBQ. Full stop.', cook: 'Smoke · Braise', tip: 'Fat cap up, 225°F, 1–1.5 hrs per pound.' },
            { name: 'Short Ribs', sub: 'Chuck / Plate', best: 'Braised, Korean BBQ, slow-cooked', cook: 'Braise · Grill · Smoke', tip: 'Flanken-style for Korean BBQ, English-style for braise.' },
            { name: 'Flank Steak', sub: 'Flank', best: 'Fajitas, stir-fry, salads', cook: 'Grill · Broil', tip: 'Always slice against the grain at a 45° angle.' },
            { name: 'Skirt Steak', sub: 'Plate', best: 'Carne asada, tacos, quick sear', cook: 'Grill · Cast Iron', tip: 'High heat, fast cook — 2 min per side max.' },
            { name: 'Ground Beef', sub: 'Mixed trimmings', best: 'Burgers, meatballs, Bolognese', cook: 'Pan · Grill', tip: '80/20 fat ratio keeps burgers juicy.' },
        ],
    },
    {
        animal: 'pork',
        cuts: [
            { name: 'Pork Chop', sub: 'Loin', best: 'Quick weeknight dinner', cook: 'Pan Sear · Grill', tip: 'Bone-in stays juicier. Pull at 145°F.' },
            { name: 'Pork Tenderloin', sub: 'Short loin', best: 'Lean, fast-cooking roast', cook: 'Roast · Grill', tip: 'Sear all sides first, then finish in the oven at 400°F.' },
            { name: 'Pork Shoulder', sub: 'Boston Butt / Picnic', best: 'Pulled pork, carnitas, low-and-slow BBQ', cook: 'Smoke · Braise · Roast', tip: '195–205°F internal — it needs to "push through the stall."' },
            { name: 'Baby Back Ribs', sub: 'Loin back', best: 'Classic BBQ ribs', cook: 'Smoke · Oven · Grill', tip: '3-2-1 method: 3 hrs smoke · 2 hrs foil · 1 hr sauce.' },
            { name: 'St. Louis Ribs', sub: 'Spare rib / Plate', best: 'Meatier, longer cook BBQ ribs', cook: 'Smoke · Oven', tip: 'Remove the membrane. Cook low, 225–250°F.' },
            { name: 'Pork Belly', sub: 'Belly', best: 'Bacon, braised dishes, ramen topping', cook: 'Braise · Roast · Smoke', tip: 'Score the fat before roasting for crispy crackling.' },
            { name: 'Ham', sub: 'Leg', best: 'Holiday centerpiece, sandwiches', cook: 'Roast · Smoke · Braise', tip: 'Fresh ham = full cook. Cured ham = just reheat & glaze.' },
            { name: 'Italian Sausage', sub: 'Mixed pork', best: 'Pasta, sandwiches, pizza topping', cook: 'Pan · Grill · Simmer', tip: 'Poke links before grilling to prevent blowouts.' },
        ],
    },
    {
        animal: 'chicken',
        cuts: [
            { name: 'Whole Chicken', sub: 'Full bird', best: 'Roasting, spatchcocking, rotisserie', cook: 'Roast · Rotisserie · Grill', tip: 'Dry-brine overnight in the fridge for crispiest skin.' },
            { name: 'Chicken Breast', sub: 'Breast', best: 'Quick, lean protein', cook: 'Grill · Pan Sear · Poach', tip: 'Pound to even thickness for uniform cooking. Pull at 160°F.' },
            { name: 'Chicken Thigh', sub: 'Thigh', best: 'More flavor than breast — hard to dry out', cook: 'Grill · Braise · Bake', tip: 'Bone-in, skin-on = best results every time.' },
            { name: 'Chicken Drumstick', sub: 'Drumstick', best: 'Finger food, game-day cooking', cook: 'Bake · Grill · Fry', tip: 'Score the meat to help marinades penetrate.' },
            { name: 'Chicken Wings', sub: 'Wing', best: 'Game day, parties, appetizers', cook: 'Fry · Bake · Grill · Smoke', tip: 'Toss in baking powder + salt before baking = extra crispy.' },
            { name: 'Spatchcock Bird', sub: 'Whole flattened', best: 'Fastest way to roast a whole chicken', cook: 'Grill · Oven', tip: 'Removes the backbone to flatten — cuts cook time by 30%.' },
        ],
    },
    {
        animal: 'lamb',
        cuts: [
            { name: 'Rack of Lamb', sub: 'Rib section', best: 'The showstopper dinner party cut', cook: 'Roast · Grill', tip: 'French the bones, herb crust, roast at 450°F. Simple perfection.' },
            { name: 'Lamb Chops', sub: 'Loin or rib', best: 'Quick-cooking, elegant weeknight steak', cook: 'Pan Sear · Grill', tip: 'Hot pan, 3 min per side, butter baste at the end.' },
            { name: 'Leg of Lamb', sub: 'Leg', best: 'Easter & holiday centerpiece', cook: 'Roast · Grill · Slow Roast', tip: 'Butterflied leg grills faster; bone-in roasts better.' },
            { name: 'Lamb Shoulder', sub: 'Chuck equivalent', best: 'Low-and-slow, kleftiko, pulled lamb', cook: 'Braise · Slow Roast', tip: 'Cook at 300°F for 4–5 hrs until it falls apart.' },
            { name: 'Ground Lamb', sub: 'Mixed trimmings', best: 'Burgers, kofta, Bolognese', cook: 'Grill · Pan', tip: 'Mix with garlic, cumin & fresh mint for kebabs.' },
        ],
    },
];

/* ── Helper: plain text to Sanity block content ─────────────────────── */
function textToBlocks(text: string) {
    return [
        {
            _type: 'block',
            _key: Math.random().toString(36).slice(2, 10),
            style: 'normal',
            markDefs: [],
            children: [
                {
                    _type: 'span',
                    _key: Math.random().toString(36).slice(2, 10),
                    text,
                    marks: [],
                },
            ],
        },
    ];
}

async function migrate() {
    console.log('📝 Migrating FAQs and Cut Guide to Sanity...\n');

    /* ── FAQs ── */
    let faqCount = 0;
    let sortOrder = 0;
    for (const group of FAQS) {
        for (const item of group.items) {
            const doc = {
                _type: 'faq' as const,
                _id: `faq-${faqCount}`,
                question: item.q,
                answer: textToBlocks(item.a),
                faqCategory: group.category,
                sortOrder: sortOrder++,
            };
            await client.createOrReplace(doc);
            console.log(`   ✅ FAQ: ${item.q.slice(0, 50)}...`);
            faqCount++;
        }
    }
    console.log(`\n📋 ${faqCount} FAQs migrated\n`);

    /* ── Cut Guide ── */
    let cutCount = 0;
    sortOrder = 0;
    for (const group of CUTS) {
        for (const cut of group.cuts) {
            const doc = {
                _type: 'cutGuide' as const,
                _id: `cut-${group.animal}-${cut.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`,
                name: cut.name,
                animal: group.animal,
                subcut: cut.sub,
                bestFor: cut.best,
                cookingMethod: cut.cook,
                tip: cut.tip,
                sortOrder: sortOrder++,
            };
            await client.createOrReplace(doc);
            console.log(`   ✅ Cut: ${group.animal} → ${cut.name}`);
            cutCount++;
        }
    }
    console.log(`\n🔪 ${cutCount} Cut Guide entries migrated\n`);

    console.log('🎉 Done!');
}

migrate().catch((err) => {
    console.error('❌ Failed:', err.message);
    process.exit(1);
});
