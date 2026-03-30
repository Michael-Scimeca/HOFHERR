import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { BBQ_MENU_QUERY, BBQ_SERVICES_QUERY, CATERING_EVENTS_QUERY, CATERING_CALENDAR_PRICING_QUERY } from '@/sanity/queries';
import styles from './page.module.css';
import BBQHub from './BBQHub';
import ParallaxImg from './ParallaxImg';
import MosaicServices from './MosaicServices';

export const metadata: Metadata = {
    title: 'BBQ Catering, Pig Roasts & Event Services | Hofherr Meat Co. — Northfield, IL',
    description: 'Chicago North Shore BBQ catering, whole-pig roasts, Ravinia picnic baskets, game day & tailgate spreads, corporate buffets, and wild game processing. Smoked brisket, ribs, pulled pork & sides for 20–500+ guests. Hofherr Meat Co., Northfield, IL.',
    keywords: ['BBQ catering Northfield IL', 'pig roast Chicago', 'whole hog roast North Shore', 'Ravinia picnic baskets', 'corporate catering Northfield', 'tailgate catering Chicago', 'wild game processing Illinois', 'smoked brisket catering', 'BBQ catering Winnetka'],
    alternates: { canonical: 'https://hofherrmeatco.com/bbq' },
    openGraph: {
        title: 'BBQ Catering, Pig Roasts & Event Services | Hofherr Meat Co.',
        description: 'Authentic low-and-slow BBQ catering plus whole-pig roasts, Ravinia picnic baskets, tailgate spreads, corporate buffets & wild game processing. Brisket, ribs, pulled pork & full sides. Chicago North Shore.',
        url: 'https://hofherrmeatco.com/bbq',
        images: [{ url: '/OG/og-bbq.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BBQ Catering & Event Services | Hofherr Meat Co.',
        description: 'Smoked brisket, ribs, pulled pork, pig roasts, picnic baskets & more. 20–500+ guests. Chicago North Shore.',
    },
};

/* ── Fallback data (used if Sanity has no bbqMenuItem docs yet) ── */
const FALLBACK_MENU: { name: string; category: string; image?: string }[] = [
    { name: "Butcher's Charcuterie Board", category: 'appetizer', image: '/images/bbq/charcuterie.jpg' },
    { name: 'Bacon Wrapped Chorizo Dates', category: 'appetizer', image: '/images/bbq/chorizo_dates.jpg' },
    { name: 'Pimento Cheese + Crackers', category: 'appetizer', image: '/images/bbq/pimento_cheese.jpg' },
    { name: 'Smoked Brisket', category: 'meat', image: '/images/bbq/brisket.jpg' },
    { name: 'BBQ Pulled Pork', category: 'meat', image: '/images/bbq/pulled_pork.jpg' },
    { name: 'BBQ Pulled Chicken', category: 'meat', image: '/images/bbq/pulled_chicken.jpg' },
    { name: 'Rib Tips & Hot Links Combo', category: 'meat', image: '/images/bbq/rib_tips.jpg' },
    { name: 'Ribs', category: 'meat', image: '/images/bbq/ribs.jpg' },
    { name: 'Smoked Ribs', category: 'meat', image: '/images/bbq/ribs.jpg' },
    { name: 'Any of our HMC Sausages', category: 'meat', image: '/images/bbq/sausage.jpg' },
    { name: 'Pimento Mac n Cheese', category: 'side', image: '/images/bbq/mac_cheese.jpg' },
    { name: 'HMCo.leslaw', category: 'side', image: '/images/bbq/coleslaw.jpg' },
    { name: 'Marinated Grilled Portobellos', category: 'side', image: '/images/bbq/portobellos.jpg' },
    { name: 'Corn', category: 'side', image: '/images/bbq/corn.jpg' },
    { name: 'Collard Greens', category: 'side', image: '/images/bbq/collard_greens.jpg' },
    { name: 'Three Bean Salad', category: 'side', image: '/images/bbq/bean_salad.jpg' },
    { name: 'House Pasta Salad', category: 'side', image: '/images/bbq/pasta_salad.jpg' },
    { name: 'Potato Salad', category: 'side', image: '/images/bbq/potato_salad.jpg' },
    { name: 'North Shore Baked Beans', category: 'side', image: '/images/bbq/baked_beans.jpg' },
];



type MenuItem = { name: string; category: string; image?: string };

type ServiceItem = { title: string; emoji?: string | null; description?: string | null; linkLabel?: string | null; linkUrl?: string | null };

const FALLBACK_SERVICES: ServiceItem[] = [
    { title: 'Whole-Pig Roasts', emoji: '🐷', description: 'Our signature backyard whole-pig roast — source to serve. We handle everything. Minimum 2 weeks notice.', linkLabel: 'Get a Quote', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Whole Pig Roast Inquiry' },
    { title: 'Concert Picnic Baskets', emoji: '🧺', description: 'Custom picnic baskets for Ravinia, Millennium Park, and any outdoor event. Charcuterie, sandwiches, and more — packed and ready to go.', linkLabel: 'Order Yours', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Picnic Basket Order' },
    { title: 'Game Day & Tailgate', emoji: '🏈', description: 'Specialized spreads for football Sundays, tailgates, and watch parties. Brisket, wings, sausages — everything your crew needs.', linkLabel: 'Plan Your Spread', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Game Day Catering' },
    { title: 'Business Buffets', emoji: '💼', description: 'Professional catering for meetings, offsites, and corporate events. Customized menus, reliable service, and food that impresses.', linkLabel: 'Get Started', linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Corporate Catering' },
    { title: 'Wild Game Processing', emoji: '🦌', description: 'Bring us your harvest — we offer custom processing for hunters. Deer, elk, boar, and more. Must be properly field-dressed.', linkLabel: 'Call to Arrange', linkUrl: 'tel:8474416328' },
    { title: 'Private Meat Sessions', emoji: '🕯️', description: 'After-hours, bespoke multi-course dining experiences hosted at the shop for groups of 8–10. A curated journey through our finest cuts.', linkLabel: 'Inquire', linkUrl: 'mailto:sean@hofherrmeatco.com?subject=Private Meat Session' },
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

    let services: ServiceItem[] = FALLBACK_SERVICES;

    type CateringEventData = { _id: string; date: string; eventType: string; status: string };
    type CalendarPricingRow = { label: string; price: string };
    let cateringEvents: CateringEventData[] = [];
    let calendarPricing: CalendarPricingRow[] = [
        { label: 'Pig Roast (50+ guests)', price: 'From $30/pp' },
        { label: 'BBQ Catering (20+ guests)', price: 'From $16/pp' },
        { label: 'Ask us about custom options', price: 'Contact us' },
    ];

    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [rawMenu, rawServices, rawEvents, rawCalPricing] = await Promise.all([
            sanityClient.fetch(BBQ_MENU_QUERY),
            sanityClient.fetch(BBQ_SERVICES_QUERY),
            sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr }),
            sanityClient.fetch(CATERING_CALENDAR_PRICING_QUERY),
        ]);
        menuItems = rawMenu?.length ? rawMenu.map((m: MenuItem) => {
            const safeName = (m.name || '').toLowerCase();
            let matchedImage;
            
            if (safeName.includes('brisket')) matchedImage = '/images/bbq/brisket.jpg';
            else if (safeName.includes('pulled pork')) matchedImage = '/images/bbq/pulled_pork.jpg';
            else if (safeName.includes('pulled chicken')) matchedImage = '/images/bbq/pulled_chicken.jpg';
            else if (safeName.includes('rib tips')) matchedImage = '/images/bbq/rib_tips.jpg';
            else if (safeName.includes('ribs') && !safeName.includes('tips')) matchedImage = '/images/bbq/ribs.jpg';
            else if (safeName.includes('sausage')) matchedImage = '/images/bbq/sausage.jpg';
            else if (safeName.includes('dates')) matchedImage = '/images/bbq/chorizo_dates.jpg';
            else if (safeName.includes('charcuterie')) matchedImage = '/images/bbq/charcuterie.jpg';
            else if (safeName.includes('pimento cheese') && !safeName.includes('mac')) matchedImage = '/images/bbq/pimento_cheese.jpg';
            else if (safeName.includes('mac and cheese') || safeName.includes('mac & cheese') || (safeName.includes('pimento') && safeName.includes('mac'))) matchedImage = '/images/bbq/mac_cheese.jpg';
            else if (safeName.includes('slaw')) matchedImage = '/images/bbq/coleslaw.jpg';
            else if (safeName.includes('beans')) matchedImage = '/images/bbq/baked_beans.jpg';
            else if (safeName.includes('collard')) matchedImage = '/images/bbq/collard_greens.jpg';
            else if (safeName.includes('portobello')) matchedImage = '/images/bbq/portobellos.jpg';
            else if (safeName.includes('bean salad')) matchedImage = '/images/bbq/bean_salad.jpg';
            else if (safeName.includes('pasta salad')) matchedImage = '/images/bbq/pasta_salad.jpg';
            else if (safeName.includes('potato salad')) matchedImage = '/images/bbq/potato_salad.jpg';
            else if (safeName.includes('corn')) matchedImage = '/images/bbq/corn.jpg';

            if (matchedImage) {
                return { ...m, image: matchedImage };
            }
            return { ...m, image: undefined };
        }) : FALLBACK_MENU;

        if (rawServices?.length) services = rawServices;
        cateringEvents = rawEvents ?? [];
        if (rawCalPricing?.length) calendarPricing = rawCalPricing;
    } catch {
        menuItems = FALLBACK_MENU;
    }

    // Group by category
    const grouped = menuItems.reduce(
        (acc, item) => {
            const cat = item.category ?? 'meat';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, MenuItem[]>,
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

                    <div className={styles.menuHeader}>
                        <div className="section-label">Catering · Min. 4 Days Notice</div>
                        <h2 className={styles.menuTitle}>What&apos;s On The Menu</h2>
                        <p className={styles.menuSub}>All smoked low-and-slow in-house. Choose your meats, sides, and add-ons — we handle the rest.</p>
                    </div>

                    <div className={styles.menuBoard}>

                        {/* Meats */}
                        {(grouped['meat']?.length > 0) && (
                            <div className={`${styles.menuCategory} ${styles.meatCategory}`}>
                                <h2 className={styles.catTitle}>{CATEGORY_META['meat'].emoji} {CATEGORY_META['meat'].label}</h2>
                                <ul className={styles.menuList}>
                                    {grouped['meat'].map((item) => (
                                        <li key={item.name} className={item.image ? styles.hasThumb : ''}>
                                            {item.image && <ParallaxImg src={item.image} alt={item.name} className={styles.listThumb} />}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                    {/* Build Your Plate — fills empty bottom-right cells */}
                                    <li className={styles.buildYourPlate}>
                                        <div className={styles.buildHeader}>
                                            <span className={styles.buildTag}>— How It Works —</span>
                                            <h3 className={styles.buildTitle}>Build Your Plate</h3>
                                        </div>
                                        <div className={styles.buildSteps}>
                                            <div className={styles.buildStep}>
                                                <span className={styles.buildStepNum}>01</span>
                                                <div>
                                                    <div className={styles.buildStepTitle}>Choose Your Meat</div>
                                                    <div className={styles.buildStepDesc}>1 meat + 1 side — from $16/person</div>
                                                </div>
                                            </div>
                                            <div className={styles.buildStep}>
                                                <span className={styles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={styles.buildStepTitle}>Add More Proteins</div>
                                                    <div className={styles.buildStepDesc}>+$4/person per extra meat</div>
                                                </div>
                                            </div>
                                            <div className={styles.buildStep}>
                                                <span className={styles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={styles.buildStepTitle}>Stack Your Sides</div>
                                                    <div className={styles.buildStepDesc}>+$2/person per additional side</div>
                                                </div>
                                            </div>
                                            <div className={styles.buildStep}>
                                                <span className={styles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={styles.buildStepTitle}>Add Appetizers</div>
                                                    <div className={styles.buildStepDesc}>Charcuterie board +$4/person</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#quote" className={styles.buildCta}>See Full Pricing →</a>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Appetizers */}
                        {(grouped['appetizer']?.length > 0) && (
                            <div className={styles.menuCategory}>
                                <h2 className={styles.catTitle}>{CATEGORY_META['appetizer'].emoji} {CATEGORY_META['appetizer'].label}</h2>
                                <ul className={styles.menuListDual}>
                                    {grouped['appetizer'].map((item) => (
                                        <li key={item.name} className={item.image ? styles.hasThumb : ''}>
                                            {item.image && <ParallaxImg src={item.image} alt={item.name} className={styles.listThumb} />}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sides */}
                        {(grouped['side']?.length > 0) && (
                            <div className={styles.menuCategory}>
                                <h2 className={styles.catTitle}>{CATEGORY_META['side'].emoji} {CATEGORY_META['side'].label}</h2>
                                <ul className={styles.menuListDual}>
                                    {grouped['side'].map((item) => (
                                        <li key={item.name} className={item.image ? styles.hasThumb : ''}>
                                            {item.image && <ParallaxImg src={item.image} alt={item.name} className={styles.listThumb} />}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </section>


            {/* ── BBQ Calculator + Calendar ── */}
            <section id="quote" className={`section ${styles.pricingSection}`}>
                <div className="container">
                    <div id="bbq-hub">
                        <BBQHub events={cateringEvents} calendarPricing={calendarPricing} />
                    </div>
                </div>
            </section>

            {/* ── Beyond BBQ ── */}
            <section className={`section ${styles.servicesSection}`}>
                <div className="container">
                    <div className={styles.beyondBbqHeader}>
                        <div className="section-label">— Beyond BBQ —</div>
                        <h2 className={styles.beyondBbqTitle}>What Else We Do</h2>
                        <p className={styles.beyondBbqSub}>From backyard pig roasts to corporate buffets — we handle it all.</p>
                    </div>
                    <MosaicServices services={services} />
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
