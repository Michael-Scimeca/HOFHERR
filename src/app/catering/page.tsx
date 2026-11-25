import type { Metadata } from 'next';
import Image from 'next/image';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import {
    BBQ_SERVICES_QUERY,
    CATERING_EVENTS_QUERY,
    CATERING_CALENDAR_PRICING_QUERY,
} from '@/sanity/queries';
import CateringHub from './CateringHub';
import CateringHeroButtons from './CateringHeroButtons';
import PigRoastsSection from './PigRoastsSection';
import MosaicServices from '@/app/bbq/MosaicServices';
import CateringMarquee from '@/components/CateringMarquee';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';
import bbqStyles from '@/app/bbq/page.module.css';

export const metadata: Metadata = {
    title: 'BBQ & Catering | Pig Roasts, Smoked Brisket & Events | Hofherr Meat Co. — Northfield, IL',
    description:
        'Full-service BBQ catering, whole-pig roasts, Ravinia picnic baskets, game day spreads, corporate buffets, and custom event menus from Hofherr Meat Co. Smoked brisket, ribs, pulled pork & sides for up to 500+ guests across Chicago\'s North Shore.',
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
            'Authentic low-and-slow BBQ catering, whole-pig roasts, rotisserie packages & custom event menus for up to 500+ guests. Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/OG/og-catering.jpg', width: 1200, height: 630, alt: 'BBQ & Catering — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BBQ & Catering | Hofherr Meat Co.',
        description: 'Smoked brisket, ribs, pulled pork, whole-pig roasts & custom event menus. Up to 500+ guests. Chicago North Shore.',
    },
};

type ServiceItem = {
    title: string;
    emoji?: string | null;
    description?: string | null;
    linkLabel?: string | null;
    linkUrl?: string | null;
};
type CateringEventData = { _id: string; date: string; eventType: string; status: string };
type CalendarPricingRow = { label: string; price: string };

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

export default async function CateringPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let services: ServiceItem[] = FALLBACK_SERVICES;
    let cateringEvents: CateringEventData[] = [];
    let calendarPricing: CalendarPricingRow[] = [
        { label: 'Pig Roast (50+ guests)', price: 'From $30/pp' },
        { label: 'BBQ Catering', price: 'From $16/pp' },
        { label: 'Ask us about custom options', price: 'Contact us' },
    ];

    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [rawServices, rawEvents, rawCalPricing] = await Promise.all([
            sanityClient.fetch(BBQ_SERVICES_QUERY),
            sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr }),
            sanityClient.fetch(CATERING_CALENDAR_PRICING_QUERY),
        ]);

        if (rawServices?.length) services = rawServices;
        cateringEvents = rawEvents ?? [];
        if (rawCalPricing?.length) calendarPricing = rawCalPricing;
    } catch {
        // Fallback to static defaults above
    }

    // Wild game processing lives on /selections, and pig roasts have their own section above.
    const isMovedElsewhere = (svc: ServiceItem) => /wild game|pig roast/i.test(svc.title);
    const mergedServices: ServiceItem[] = [];
    const seenTitles = new Set<string>();
    const addUnique = (svc: ServiceItem) => {
        if (isMovedElsewhere(svc)) return;
        const key = svc.title.trim().toLowerCase();
        if (seenTitles.has(key)) return;
        seenTitles.add(key);
        mergedServices.push(svc);
    };
    services.forEach(addUnique);
    FALLBACK_SERVICES.forEach(addUnique);
    addUnique({
        title: 'Holiday & Event Roasts',
        emoji: '🎄',
        description: 'Standing prime rib roasts, heritage turkeys, crown pork roasts, and full holiday spreads for Thanksgiving, Christmas & Easter.',
        linkLabel: 'See Holiday Menus',
        linkUrl: '/catering/holidays',
    });
    const mosaicServices = mergedServices.slice(0, 5);
    const smallLinks: ServiceItem[] = [];

    return (
        <main>
            {/* ── Hero ── */}
            <PageHero
                id="catering-hero"
                headingId="catering-hero-heading"
                title={
                    <>
                        Big Guest List? <em>Bring It.</em>
                    </>
                }
                lead="Authentic low-and-slow BBQ, backyard pig roasts, and full-service catering from the same butchers who cut your steaks. Custom menus, full setup, and food people actually talk about."
            >
                <CateringHeroButtons />
            </PageHero>

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
                            <div className={styles.stepMediaWrap}>
                                <div className={styles.stepMedia}>
                                    <Image
                                        src="/assets/catering/how-it-works-build-package.jpg"
                                        alt="Illustrated BBQ catering platter with ribs, brisket, sausages, sides, crossed cleaver and fork, and rising flames"
                                        fill
                                        sizes="512px"
                                        quality={95}
                                        className={styles.stepImg}
                                    />
                                </div>
                                <div className={styles.stepNum}>1</div>
                            </div>
                            <h3>Build Your Package</h3>
                            <p>
                                Choose your event type, pick your meats &amp; sides, and get an instant estimate — all
                                right here on the page.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepMediaWrap}>
                                <div className={styles.stepMedia}>
                                    <Image
                                        src="/assets/catering/how-it-works-pick-date.jpg"
                                        alt="Illustrated flaming calendar with a checked event date square"
                                        fill
                                        sizes="512px"
                                        quality={95}
                                        className={styles.stepImg}
                                    />
                                </div>
                                <div className={styles.stepNum}>2</div>
                            </div>
                            <h3>Pick a Date</h3>
                            <p>
                                Select your event date on our live availability calendar. We require a minimum of 4 days
                                notice.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepMediaWrap}>
                                <div className={styles.stepMedia}>
                                    <Image
                                        src="/assets/catering/how-it-works-full-service.jpg"
                                        alt="Illustrated full-service banquet cloche lifted over curling smoke, rising flames, and crossed carving knife and fork"
                                        fill
                                        sizes="512px"
                                        quality={95}
                                        className={styles.stepImg}
                                    />
                                </div>
                                <div className={styles.stepNum}>3</div>
                            </div>
                            <h3>We Handle Everything</h3>
                            <p>
                                Submit your inquiry and Sean confirms within 24 hours. We arrive with food, setup,
                                serving, and cleanup.
                            </p>
                        </div>
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

            {/* ── Pig Roasts (moved from /specials) ── */}
            <PigRoastsSection />

            {/* ── Marquee Ticker ── */}
            <CateringMarquee id="catering-marquee" rows={2} />

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
                    <MosaicServices services={mosaicServices} />
                    {smallLinks.length > 0 && (
                        <ul className={styles.moreLinks} aria-label="More catering options">
                            {smallLinks.map((svc) => (
                                <li key={svc.title}>
                                    <a href={svc.linkUrl ?? 'tel:8474416328'}>
                                        {svc.emoji} {svc.title} →
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}
