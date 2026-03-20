import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { BBQ_MENU_QUERY, BBQ_PRICING_QUERY, BBQ_SERVICES_QUERY } from '@/sanity/queries';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'BBQ Catering Menu & Pricing | Hofherr Meat Co. — Northfield, IL',
    description: 'Chicago North Shore BBQ catering from Hofherr Meat Co. Smoked brisket, ribs, pulled pork, sausages & sides. 20–500+ guests. Pickup or drop-off. Northfield & Winnetka, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/bbq' },
    openGraph: {
        title: 'BBQ Catering Menu & Pricing | Hofherr Meat Co.',
        description: 'Authentic low-and-slow BBQ catering for any event. Brisket, pulled pork, ribs, and full sides. 20 to 500+ guests. Northfield, IL.',
        url: 'https://hofherrmeatco.com/bbq',
        images: [{ url: '/OG/og-bbq.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BBQ Catering | Hofherr Meat Co.',
        description: 'Smoked brisket, ribs, pulled pork & sides. 20–500+ guests. Chicago North Shore.',
    },
};

/* ── Fallback data (used if Sanity has no bbqMenuItem docs yet) ── */
const FALLBACK_MENU: { name: string; category: string }[] = [
    { name: "Butcher's Charcuterie Board", category: 'appetizer' },
    { name: 'Bacon Wrapped Chorizo Dates', category: 'appetizer' },
    { name: 'Pimento Cheese + Crackers', category: 'appetizer' },
    { name: 'Smoked Brisket', category: 'meat' },
    { name: 'BBQ Pulled Pork', category: 'meat' },
    { name: 'BBQ Pulled Chicken', category: 'meat' },
    { name: 'Rib Tips & Hot Links Combo', category: 'meat' },
    { name: 'Ribs', category: 'meat' },
    { name: 'Any HMC Sausages', category: 'meat' },
    { name: 'Pimento Mac and Cheese', category: 'side' },
    { name: 'HMCo.leslaw', category: 'side' },
    { name: 'Marinated & Grilled Portobellos', category: 'side' },
    { name: 'Corn', category: 'side' },
    { name: 'Collard Greens', category: 'side' },
    { name: 'Three-Bean Salad', category: 'side' },
    { name: 'House Pasta Salad', category: 'side' },
    { name: 'North Shore Baked Beans', category: 'side' },
];

const FALLBACK_PRICING = [
    {
        tier: 'under20',
        title: 'Under 20 Guests',
        subtitle: 'Minimum order $200',
        description: 'Includes buns, condiments, and sauce. Pricing is custom — email us with your headcount and menu selections.',
        isFeatured: false,
        priceLines: null,
    },
    {
        tier: 'over20',
        title: '20+ Guests — Pickup',
        subtitle: 'Includes paperware, cutlery, serving utensils, buns, condiments & sauce',
        description: null,
        isFeatured: true,
        priceLines: [
            { label: '1 Meat + 1 Side', price: '$16/person' },
            { label: 'Each Additional Meat', price: '+$4/person' },
            { label: 'Each Additional Side', price: '+$2/person' },
            { label: 'Add Charcuterie Platter', price: '+$4/person' },
            { label: 'Pimento Cheese Dip + Crackers', price: '$20/tray' },
            { label: 'Drop-Off Delivery (within 5 miles)', price: '+$50' },
        ],
    },
];

type MenuItem = { name: string; category: string };
type PriceLine = { label: string; price: string };
type PricingTier = {
    tier: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    isFeatured?: boolean;
    priceLines?: PriceLine[] | null;
};
type ServiceItem = { title: string; emoji?: string | null; description?: string | null; linkLabel?: string | null; linkUrl?: string | null };

const FALLBACK_SERVICES: ServiceItem[] = [
    { title: 'Whole-Pig Roasts', emoji: '🐷', description: 'Our signature backyard whole-pig roast — source to serve. We handle everything. Minimum 2 weeks notice.', linkLabel: 'Get a Quote', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Whole Pig Roast Inquiry' },
    { title: 'Concert Picnic Baskets', emoji: '🧺', description: 'Custom picnic baskets for Ravinia, Millennium Park, and any outdoor event. Charcuterie, sandwiches, and more — packed and ready to go.', linkLabel: 'Order Yours', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Picnic Basket Order' },
    { title: 'Game Day & Tailgate', emoji: '🏈', description: 'Specialized spreads for football Sundays, tailgates, and watch parties. Brisket, wings, sausages — everything your crew needs.', linkLabel: 'Plan Your Spread', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Game Day Catering' },
    { title: 'Business Buffets', emoji: '💼', description: 'Professional catering for meetings, offsites, and corporate events. Customized menus, reliable service, and food that impresses.', linkLabel: 'Get Started', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Corporate Catering' },
    { title: 'Wild Game Processing', emoji: '🦌', description: 'Bring us your harvest — we offer custom processing for hunters. Deer, elk, boar, and more. Must be properly field-dressed.', linkLabel: 'Call to Arrange', linkUrl: 'tel:8474416328' },
];

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
    appetizer: { emoji: '🧀', label: 'Appetizer Options' },
    meat: { emoji: '🔥', label: 'Meat Options' },
    side: { emoji: '🥗', label: 'Side Options' },
};

export default async function BBQPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let menuItems: MenuItem[] = [];
    let pricing: PricingTier[] = [];
    let services: ServiceItem[] = FALLBACK_SERVICES;

    try {
        const [rawMenu, rawPricing, rawServices] = await Promise.all([
            sanityClient.fetch(BBQ_MENU_QUERY),
            sanityClient.fetch(BBQ_PRICING_QUERY),
            sanityClient.fetch(BBQ_SERVICES_QUERY),
        ]);
        menuItems = rawMenu?.length ? rawMenu : FALLBACK_MENU;
        pricing = rawPricing?.length ? rawPricing : FALLBACK_PRICING;
        if (rawServices?.length) services = rawServices;
    } catch {
        menuItems = FALLBACK_MENU;
        pricing = FALLBACK_PRICING;
    }

    // Group by category
    const grouped = menuItems.reduce(
        (acc, item) => {
            const cat = item.category ?? 'meat';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item.name);
            return acc;
        },
        {} as Record<string, string[]>,
    );

    const categories = ['appetizer', 'meat', 'side'].filter((c) => grouped[c]?.length);

    return (
        <div>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">Catering · Min. 4 Days Notice</div>
                    <h1 className={styles.headline}>BBQ <em>Catering</em></h1>
                    <p className={styles.sub}>
                        Authentic low-and-slow BBQ from the same butchers who cut your steaks. We bring the smoke, the meat, and everything you need to feed a crowd.
                    </p>
                    <div className={styles.heroBadges}>
                        <span className={styles.badge}>🍖 20–500+ Guests</span>
                        <span className={styles.badge}>📦 Pickup or Delivery</span>
                        <span className={styles.badge}>⏱ Min. 4 Days Notice</span>
                    </div>
                </div>
            </section>

            {/* ── Menu ── */}
            <section className={`section ${styles.menuSection}`}>
                <div className="container">

                    <div className={styles.menuGrid}>
                        {categories.map((cat) => {
                            const meta = CATEGORY_META[cat];
                            return (
                                <div key={cat} className={styles.menuCategory}>
                                    <h2 className={styles.catTitle}>{meta.emoji} {meta.label}</h2>
                                    <ul className={styles.menuList}>
                                        {grouped[cat].map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section className={`section ${styles.pricingSection}`}>
                <div className="container">
                    <div className={styles.pricingHeader}>
                        <div className="section-label">Transparent Pricing</div>
                        <h2 className={styles.pricingTitle}>What&apos;s It Cost?</h2>
                        <p className={styles.pricingNote}>All prices exclude tax. Includes buns, condiments, and sauce.</p>
                    </div>

                    <div className={styles.pricingCols}>
                        {pricing.map((tier) => (
                            <div
                                key={tier.tier}
                                className={`${styles.pricingCard} ${tier.isFeatured ? styles.pricingCardFeatured : ''}`}
                            >
                                {tier.isFeatured && <div className={styles.pricingCardBadge}>Most Popular</div>}
                                <div className={styles.pricingCardTitle}>{tier.title}</div>
                                {tier.subtitle && <div className={styles.pricingCardSub}>{tier.subtitle}</div>}
                                {tier.description && (
                                    <p className={styles.pricingCardDesc}>{tier.description}</p>
                                )}
                                {!tier.isFeatured && tier.tier === 'under20' && (
                                    <a href="mailto:catering@hofherrmeatco.com?subject=BBQ Catering Under 20" className="btn btn-secondary">
                                        ✉️ Email for Pricing
                                    </a>
                                )}
                                {tier.priceLines && tier.priceLines.length > 0 && (
                                    <div className={styles.priceRows}>
                                        {tier.priceLines.map((line, i) => (
                                            <div
                                                key={i}
                                                className={styles.priceRow}
                                                style={i === tier.priceLines!.length - 1 ? { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '4px' } : undefined}
                                            >
                                                <span>{line.label}</span><strong>{line.price}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Beyond BBQ ── */}
            <section className={`section ${styles.servicesSection}`}>
                <div className="container">
                    <div className="section-label">More Than Catering</div>
                    <h2 className={styles.pricingTitle}>Beyond BBQ</h2>
                    <p className={styles.pricingNote}>We do more than just BBQ catering — from backyard pig roasts to concert picnic baskets.</p>

                    <div className={styles.servicesGrid}>
                        {services.map((svc, i) => (
                            <div key={i} className={styles.serviceCard}>
                                {svc.emoji && <div className={styles.serviceEmoji}>{svc.emoji}</div>}
                                <h3>{svc.title}</h3>
                                {svc.description && <p>{svc.description}</p>}
                                {svc.linkUrl && svc.linkLabel && (
                                    <a href={svc.linkUrl} className="btn btn-secondary">
                                        {svc.linkLabel.replace(/[\u2190-\u21FF]|[\u2700-\u27BF]|[\u2B00-\u2BFF]|\uFE0F/g, '').trim()}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Ready to Book?</h2>
                    <p className={styles.ctaSub}>
                        Email us your event date, estimated headcount, and preferred menu items — we&apos;ll get back to you within 24 hours.
                    </p>
                    <div className={styles.ctaBtns}>
                        <a href="mailto:catering@hofherrmeatco.com?subject=BBQ Catering Quote" className="btn btn-primary">
                            ✉️ catering@hofherrmeatco.com
                        </a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                    <p className={styles.ctaNote}>Minimum 4 days notice required. Subject to availability.</p>
                </div>
            </section>

        </div>
    );
}
