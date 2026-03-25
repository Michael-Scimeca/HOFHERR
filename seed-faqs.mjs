import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'a2p2fvte',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: 'skkAMMLNehuTzoLhkTtglIsj6Ub4cPJy7clLdw361NQMbgjwpTbYIzZGJL7R9IogrC0s4KplTo8i2nHBKWCkOrr1X0C4is8dD0S0Vl7MCw3YMhCvcjhVxGbTHaW2grwh6Bya3xBfAdUdtJ88zEgu58etnJixY1GRcBhh5ZTn4kr5XUZkDZlC',
    useCdn: false,
});

function block(text) {
    return [{
        _type: 'block',
        _key: Math.random().toString(36).slice(2),
        style: 'normal',
        children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text }],
        markDefs: [],
    }];
}

const faqs = [
    // ── Ordering ──────────────────────────────────────────────────────────
    { question: 'How do I place an online order?', faqCategory: 'ordering', sortOrder: 10,
      answer: block('Browse our online shop at hofherrmeatco.com/online-orders, add items to your cart, then click "Proceed to Checkout." Choose your pickup day and time, enter your contact info, and pay online or in-store at pickup.') },
    { question: 'Do I need an account to order?', faqCategory: 'ordering', sortOrder: 20,
      answer: block('No account required — you can check out as a guest. Creating a free account gives you order history, faster reorder, and loyalty perks tied to your profile.') },
    { question: 'Can I customize my cut?', faqCategory: 'ordering', sortOrder: 30,
      answer: block('Yes! Use the "Special Instructions" field at checkout to specify thickness, trim preference, bone-in/bone-out, or any other prep request. Our butchers review every order before it\'s packed.') },
    { question: 'What happens after I place my order?', faqCategory: 'ordering', sortOrder: 40,
      answer: block('You\'ll receive a confirmation and pickup time. Orders typically take 20–40 minutes to prepare. We\'ll reach out by phone or email if anything changes.') },
    { question: 'Can I add items or change my order after submitting?', faqCategory: 'ordering', sortOrder: 50,
      answer: block('Call us as soon as possible at (847) 441-MEAT. We can usually accommodate changes as long as the order hasn\'t been cut and packaged yet.') },

    // ── Delivery & Pickup ──────────────────────────────────────────────────
    { question: 'Do you offer delivery?', faqCategory: 'delivery', sortOrder: 10,
      answer: block('Not currently — we offer curbside pickup at both locations. The Butcher Shop is at 300 Happ Rd, Northfield, and The Depot is at 741 Green Bay Rd, Winnetka.') },
    { question: 'How does curbside pickup work?', faqCategory: 'delivery', sortOrder: 20,
      answer: block('Pull up to the front of the store at your chosen pickup time and call or text us. We\'ll bring your order right to your car — you don\'t even have to get out.') },
    { question: 'How far in advance should I order?', faqCategory: 'delivery', sortOrder: 30,
      answer: block('Most orders are ready in 20–40 minutes, so same-day ordering works for most cuts. For large catering orders, whole animals, or specialty items, we recommend 48–72 hours notice.') },
    { question: 'What are your pickup hours?', faqCategory: 'delivery', sortOrder: 40,
      answer: block('The Butcher Shop (Northfield): Tue–Fri 10am–6pm, Sat 10am–5pm, Sun 10am–4pm — closed Mondays. The Depot (Winnetka): Mon–Fri 10:30am–6pm — closed weekends.') },
    { question: 'What if I\'m running late for my pickup?', faqCategory: 'delivery', sortOrder: 50,
      answer: block('No problem — just call us at (847) 441-MEAT and we\'ll hold your order. If you need to reschedule, we\'re happy to find a new time that works.') },

    // ── Products ───────────────────────────────────────────────────────────
    { question: 'Where do your meats come from?', faqCategory: 'products', sortOrder: 10,
      answer: block('We source from trusted farms committed to quality and humane practices — our beef comes from Prime and Choice-graded cattle, pork from heritage breeds, and poultry from Ferndale Market and similar all-natural farms. We can walk you through any sourcing question in-store.') },
    { question: 'Do you carry USDA Prime beef?', faqCategory: 'products', sortOrder: 20,
      answer: block('Yes. We stock USDA Prime dry-aged cuts alongside Choice and Select options. Our dry-aging room produces some of the finest steaks in the North Shore at any given time.') },
    { question: 'How long is your beef dry-aged?', faqCategory: 'products', sortOrder: 30,
      answer: block('Our dry-aged program typically runs 28–45 days depending on the cut. The process concentrates flavor and tenderizes the meat — the result speaks for itself.') },
    { question: 'Do you carry specialty or hard-to-find cuts?', faqCategory: 'products', sortOrder: 40,
      answer: block('Often, yes — from wagyu to whole primal cuts to offal. If you\'re looking for something specific, call ahead or ask in-store. We love a challenge and can usually source what you need.') },
    { question: 'Can I get custom butchery for a special occasion?', faqCategory: 'products', sortOrder: 50,
      answer: block('Absolutely. Tomahawk steaks, bone-in roasts, crown pork, whole suckling pigs — just call or email us ahead of time so we can prepare. There\'s no extra charge for custom prep.') },

    // ── Catering ───────────────────────────────────────────────────────────
    { question: 'Do you offer BBQ catering?', faqCategory: 'catering', sortOrder: 10,
      answer: block('Yes — we offer full-service BBQ events including pig roasts, brisket service, and fully custom menus built around your guest count and budget. Visit /catering to learn more or request a quote.') },
    { question: 'What\'s the minimum guest count for catering?', faqCategory: 'catering', sortOrder: 20,
      answer: block('We typically cater events of 25 guests or more, though we\'re flexible. Reach out with your details and we\'ll find the right package for you.') },
    { question: 'Do you do whole pig roasts?', faqCategory: 'catering', sortOrder: 30,
      answer: block('It\'s literally our specialty. We\'ve been roasting whole pigs for decades — on-site at your venue or fully managed at ours. Contact us at least one week in advance to book.') },
    { question: 'Can I order large bulk quantities for an event?', faqCategory: 'catering', sortOrder: 40,
      answer: block('Yes. Whether it\'s 50 steaks for a corporate cookout or a custom sausage order for a wedding, we can accommodate bulk requests. Call us to discuss pricing and lead time.') },

    // ── General ────────────────────────────────────────────────────────────
    { question: 'Do you offer gift cards?', faqCategory: 'general', sortOrder: 10,
      answer: block('Yes! Digital gift cards are available at hofherrmeatco.com/gift-cards and can be used online or in-store at either location. They make an excellent gift.') },
    { question: 'Can I come in and browse without ordering online?', faqCategory: 'general', sortOrder: 20,
      answer: block('Of course — we have a full retail case in-store. Online ordering is a convenience, not a requirement. Walk-ins are always welcome during store hours.') },
    { question: 'Do you have parking?', faqCategory: 'general', sortOrder: 30,
      answer: block('Both locations have easy parking. The Butcher Shop is in Northfield Square with a large lot. The Depot on Green Bay Rd in Winnetka has street and lot parking nearby.') },
    { question: 'Are you hiring?', faqCategory: 'general', sortOrder: 40,
      answer: block('We\'re always interested in passionate people who love meat and hospitality. Check our open positions at hofherrmeatco.com/jobs.') },
];

// First, delete all existing FAQ documents
console.log('Fetching existing FAQs...');
const existing = await client.fetch('*[_type == "faq"]._id');
console.log(`Found ${existing.length} existing FAQs — deleting...`);

const transaction = client.transaction();
existing.forEach(id => transaction.delete(id));
await transaction.commit();
console.log('Deleted existing FAQs.');

// Create new ones
console.log('Creating new FAQs...');
for (const faq of faqs) {
    await client.create({ _type: 'faq', ...faq });
    process.stdout.write('.');
}
console.log(`\nDone! Created ${faqs.length} FAQs.`);
