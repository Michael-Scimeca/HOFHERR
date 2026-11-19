import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import {
    BBQ_MENU_QUERY,
    BBQ_SERVICES_QUERY,
    CATERING_EVENTS_QUERY,
    CATERING_CALENDAR_PRICING_QUERY,
} from '@/sanity/queries';
import CateringHub from './CateringHub';
import CateringHeroButtons from './CateringHeroButtons';
import ParallaxImg from '@/app/bbq/ParallaxImg';
import MosaicServices from '@/app/bbq/MosaicServices';
import CateringMarquee from '@/components/CateringMarquee';
import styles from './page.module.css';
import bbqStyles from '@/app/bbq/page.module.css';

export const metadata: Metadata = {
    title: 'BBQ & Catering | Pig Roasts, Smoked Brisket & Events | Hofherr Meat Co. — Northfield, IL',
    description:
        'Full-service BBQ catering, whole-pig roasts, Ravinia picnic baskets, game day spreads, corporate buffets, and custom event menus from Hofherr Meat Co. Smoked brisket, ribs, pulled pork & sides for 20–500+ guests across Chicago\'s North Shore.',
    keywords: [
        'BBQ catering Northfield IL',
        'pig roast Chicago',
        'whole hog roast North Shore',
        'event catering Winnetka',
        'Ravinia picnic baskets',
        'corporate catering Northfield',
        'tailgate catering Chicago',
        'smoked brisket catering',
        'wild game processing Illinois',
    ],
    alternates: { canonical: 'https://hofherrmeatco.com/catering' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'BBQ & Catering | Hofherr Meat Co.',
        description:
            'Authentic low-and-slow BBQ catering, whole-pig roasts, rotisserie packages & custom event menus for 20–500+ guests. Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/OG/og-catering.jpg', width: 1200, height: 630, alt: 'BBQ & Catering — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BBQ & Catering | Hofherr Meat Co.',
        description: 'Smoked brisket, ribs, pulled pork, whole-pig roasts & custom event menus. 20–500+ guests. Chicago North Shore.',
    },
};

type MenuItem = { name: string; category: string; image?: string };
type ServiceItem = {
    title: string;
    emoji?: string | null;
    description?: string | null;
    linkLabel?: string | null;
    linkUrl?: string | null;
};
type CateringEventData = { _id: string; date: string; eventType: string; status: string };
type CalendarPricingRow = { label: string; price: string };

const FALLBACK_MENU: MenuItem[] = [
    { name: "Butcher's Charcuterie Board", category: 'appetizer', image: '/images/bbq/charcuterie.jpg' },
    { name: 'Bacon Wrapped Chorizo Dates', category: 'appetizer', image: '/images/bbq/chorizo_dates.jpg' },
    { name: 'Pimento Cheese + Crackers', category: 'appetizer', image: '/images/bbq/pimento_cheese.jpg' },
    { name: 'Smoked Brisket', category: 'meat', image: '/images/bbq/brisket.jpg' },
    { name: 'BBQ Pulled Pork', category: 'meat', image: '/images/bbq/pulled_pork.jpg' },
    { name: 'BBQ Pulled Chicken', category: 'meat', image: '/images/bbq/pulled_chicken.jpg' },
    { name: 'Rib Tips & Hot Links Combo', category: 'meat', image: '/images/bbq/rib_tips.jpg' },
    { name: 'Ribs', category: 'meat', image: '/images/bbq/ribs.jpg' },
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

const FALLBACK_SERVICES: ServiceItem[] = [
    {
        title: 'Whole-Pig Roasts',
        emoji: '🐷',
        description: 'Our signature backyard whole-pig roast — source to serve. We handle everything. Minimum 2 weeks notice.',
        linkLabel: 'Get a Quote',
        linkUrl: '#build-your-package',
    },
    {
        title: 'Concert Picnic Baskets',
        emoji: '🧺',
        description: 'Custom picnic baskets for Ravinia, Millennium Park, and any outdoor event. Charcuterie, sandwiches, and more — packed and ready to go.',
        linkLabel: 'Order Yours',
        linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Picnic Basket Order',
    },
    {
        title: 'Game Day & Tailgate',
        emoji: '🏈',
        description: 'Specialized spreads for football Sundays, tailgates, and watch parties. Brisket, wings, sausages — everything your crew needs.',
        linkLabel: 'Plan Your Spread',
        linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Game Day Catering',
    },
    {
        title: 'Business Buffets',
        emoji: '💼',
        description: 'Professional catering for meetings, offsites, and corporate events. Customized menus, reliable service, and food that impresses.',
        linkLabel: 'Get Started',
        linkUrl: 'mailto:catering@hofherrmeatco.com?subject=Corporate Catering',
    },
    {
        title: 'Wild Game Processing',
        emoji: '🦌',
        description: 'Bring us your harvest — we offer custom processing for hunters. Deer, elk, boar, and more. Must be properly field-dressed.',
        linkLabel: 'Call to Arrange',
        linkUrl: 'tel:8474416328',
    },
    {
        title: 'Private Meat Sessions',
        emoji: '🕯️',
        description: 'After-hours, bespoke multi-course dining experiences hosted at the shop for groups of 8–10. A curated journey through our finest cuts.',
        linkLabel: 'Inquire',
        linkUrl: 'mailto:sean@hofherrmeatco.com?subject=Private Meat Session',
    },
];

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
    appetizer: { emoji: '🧀', label: 'Appetizer Options' },
    meat: { emoji: '🔥', label: 'Meat Options' },
    side: { emoji: '🥗', label: 'Side Options' },
};

function matchMenuImage(name: string): string | undefined {
    const safeName = name.toLowerCase();
    if (safeName.includes('brisket')) return '/images/bbq/brisket.jpg';
    if (safeName.includes('pulled pork')) return '/images/bbq/pulled_pork.jpg';
    if (safeName.includes('pulled chicken')) return '/images/bbq/pulled_chicken.jpg';
    if (safeName.includes('rib tips')) return '/images/bbq/rib_tips.jpg';
    if (safeName.includes('ribs') && !safeName.includes('tips')) return '/images/bbq/ribs.jpg';
    if (safeName.includes('sausage')) return '/images/bbq/sausage.jpg';
    if (safeName.includes('dates')) return '/images/bbq/chorizo_dates.jpg';
    if (safeName.includes('charcuterie')) return '/images/bbq/charcuterie.jpg';
    if (safeName.includes('pimento cheese') && !safeName.includes('mac')) return '/images/bbq/pimento_cheese.jpg';
    if (
        safeName.includes('mac and cheese') ||
        safeName.includes('mac & cheese') ||
        (safeName.includes('pimento') && safeName.includes('mac'))
    ) {
        return '/images/bbq/mac_cheese.jpg';
    }
    if (safeName.includes('slaw')) return '/images/bbq/coleslaw.jpg';
    if (safeName.includes('beans')) return '/images/bbq/baked_beans.jpg';
    if (safeName.includes('collard')) return '/images/bbq/collard_greens.jpg';
    if (safeName.includes('portobello')) return '/images/bbq/portobellos.jpg';
    if (safeName.includes('bean salad')) return '/images/bbq/bean_salad.jpg';
    if (safeName.includes('pasta salad')) return '/images/bbq/pasta_salad.jpg';
    if (safeName.includes('potato salad')) return '/images/bbq/potato_salad.jpg';
    if (safeName.includes('corn')) return '/images/bbq/corn.jpg';
    return undefined;
}

export default async function CateringPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let menuItems: MenuItem[] = FALLBACK_MENU;
    let services: ServiceItem[] = FALLBACK_SERVICES;
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

        if (rawMenu?.length) {
            menuItems = rawMenu.map((m: MenuItem) => ({
                ...m,
                image: matchMenuImage(m.name || ''),
            }));
        }
        if (rawServices?.length) services = rawServices;
        cateringEvents = rawEvents ?? [];
        if (rawCalPricing?.length) calendarPricing = rawCalPricing;
    } catch {
        // Fallback to static defaults above
    }

    const grouped = menuItems.reduce(
        (acc, item) => {
            const cat = item.category ?? 'meat';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, MenuItem[]>,
    );

    return (
        <main>
            {/* ── Hero ── */}
            <section id="catering-hero" aria-labelledby="catering-hero-heading" className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 id="catering-hero-heading" className={styles.headline}>
                        Big Guest List? <em>Bring It.</em>
                    </h1>
                    <p className={styles.sub}>
                        Authentic low-and-slow BBQ, backyard pig roasts, and full-service catering from the same
                        butchers who cut your steaks. Custom menus, full setup, and food people actually talk about.
                    </p>
                    <CateringHeroButtons />
                </div>
            </section>

            {/* ── How It Works ── */}
            <section
                id="how-it-works"
                aria-labelledby="how-it-works-heading"
                className={`${styles.processSection} ${styles.processWithBg}`}
            >
                <div className={styles.sectionBgMedia} aria-hidden="true" />
                <div className={`container ${styles.processContent}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="how-it-works-heading" className={styles.sectionTitle}>
                            How It Works
                        </h2>
                    </div>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>1</div>
                            <h3>Build Your Package</h3>
                            <p>
                                Choose your event type, pick your meats &amp; sides, and get an instant estimate — all
                                right here on the page.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>2</div>
                            <h3>Pick a Date</h3>
                            <p>
                                Select your event date on our live availability calendar. We require a minimum of 4 days
                                notice.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <h3>We Handle Everything</h3>
                            <p>
                                Submit your inquiry and Sean confirms within 24 hours. We arrive with food, setup,
                                serving, and cleanup.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BBQ & Catering Menu ── */}
            <section id="bbq-menu" aria-labelledby="bbq-menu-heading" className={`section ${bbqStyles.menuSection}`}>
                <div className="container">
                    <div className={bbqStyles.menuHeader}>
                        <div className="section-label">BBQ &amp; Catering · Min. 4 Days Notice</div>
                        <h2 id="bbq-menu-heading" className={bbqStyles.menuTitle}>
                            What&apos;s On The Menu
                        </h2>
                        <p className={bbqStyles.menuSub}>
                            All smoked low-and-slow in-house. Choose your meats, sides, and add-ons — we handle the
                            rest.
                        </p>
                    </div>

                    <div className={bbqStyles.menuBoard}>
                        {grouped['meat']?.length > 0 && (
                            <div className={`${bbqStyles.menuCategory} ${bbqStyles.meatCategory}`}>
                                <h3 className={bbqStyles.catTitle}>
                                    {CATEGORY_META['meat'].emoji} {CATEGORY_META['meat'].label}
                                </h3>
                                <ul className={bbqStyles.menuList}>
                                    {grouped['meat'].map((item) => (
                                        <li key={item.name} className={item.image ? bbqStyles.hasThumb : ''}>
                                            {item.image && (
                                                <ParallaxImg
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={bbqStyles.listThumb}
                                                />
                                            )}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                    <li className={bbqStyles.buildYourPlate}>
                                        <div className={bbqStyles.buildHeader}>
                                            <span className={bbqStyles.buildTag}>— How It Works —</span>
                                            <h4 className={bbqStyles.buildTitle}>Build Your Plate</h4>
                                        </div>
                                        <div className={bbqStyles.buildSteps}>
                                            <div className={bbqStyles.buildStep}>
                                                <span className={bbqStyles.buildStepNum}>01</span>
                                                <div>
                                                    <div className={bbqStyles.buildStepTitle}>Choose Your Meat</div>
                                                    <div className={bbqStyles.buildStepDesc}>
                                                        1 meat + 1 side — from $16/person
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={bbqStyles.buildStep}>
                                                <span className={bbqStyles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={bbqStyles.buildStepTitle}>Add More Proteins</div>
                                                    <div className={bbqStyles.buildStepDesc}>
                                                        +$4/person per extra meat
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={bbqStyles.buildStep}>
                                                <span className={bbqStyles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={bbqStyles.buildStepTitle}>Stack Your Sides</div>
                                                    <div className={bbqStyles.buildStepDesc}>
                                                        +$2/person per additional side
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={bbqStyles.buildStep}>
                                                <span className={bbqStyles.buildStepNum}>+</span>
                                                <div>
                                                    <div className={bbqStyles.buildStepTitle}>Add Appetizers</div>
                                                    <div className={bbqStyles.buildStepDesc}>
                                                        Charcuterie board +$4/person
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#build-your-package" className={bbqStyles.buildCta}>
                                            See Full Pricing →
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {grouped['appetizer']?.length > 0 && (
                            <div className={bbqStyles.menuCategory}>
                                <h3 className={bbqStyles.catTitle}>
                                    {CATEGORY_META['appetizer'].emoji} {CATEGORY_META['appetizer'].label}
                                </h3>
                                <ul className={bbqStyles.menuListDual}>
                                    {grouped['appetizer'].map((item) => (
                                        <li key={item.name} className={item.image ? bbqStyles.hasThumb : ''}>
                                            {item.image && (
                                                <ParallaxImg
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={bbqStyles.listThumb}
                                                />
                                            )}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {grouped['side']?.length > 0 && (
                            <div className={bbqStyles.menuCategory}>
                                <h3 className={bbqStyles.catTitle}>
                                    {CATEGORY_META['side'].emoji} {CATEGORY_META['side'].label}
                                </h3>
                                <ul className={bbqStyles.menuListDual}>
                                    {grouped['side'].map((item) => (
                                        <li key={item.name} className={item.image ? bbqStyles.hasThumb : ''}>
                                            {item.image && (
                                                <ParallaxImg
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={bbqStyles.listThumb}
                                                />
                                            )}
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Interactive Catering Calculator & Inquiry ── */}
            <section
                id="build-your-package"
                aria-labelledby="build-your-package-heading"
                className={styles.pricingSection}
            >
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 id="build-your-package-heading" className={styles.sectionTitle}>
                            Build Your Package
                        </h2>
                        <p className={styles.sectionSub}>
                            Choose BBQ catering or a full pig roast, customize your options, and get an instant
                            estimate.
                        </p>
                    </div>
                    <CateringHub events={cateringEvents} calendarPricing={calendarPricing} />
                </div>
            </section>

            {/* ── Marquee Ticker ── */}
            <CateringMarquee id="catering-marquee" />

            {/* ── Beyond BBQ ── */}
            <section id="beyond-bbq" aria-labelledby="beyond-bbq-heading" className={`section ${bbqStyles.servicesSection}`}>
                <div className="container">
                    <div className={bbqStyles.beyondBbqHeader}>
                        <div className="section-label">— Beyond BBQ —</div>
                        <h2 id="beyond-bbq-heading" className={bbqStyles.beyondBbqTitle}>
                            What Else We Do
                        </h2>
                        <p className={bbqStyles.beyondBbqSub}>
                            From backyard pig roasts to corporate buffets — we handle it all.
                        </p>
                    </div>
                    <MosaicServices services={services} />
                </div>
            </section>
        </main>
    );
}
