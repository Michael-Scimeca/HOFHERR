import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { BBQ_PRICING_QUERY, CATERING_EVENTS_QUERY, CATERING_QUERY } from '@/sanity/queries';
import CateringCalendar from '@/components/CateringCalendar';
import CateringHub from './CateringHub';
import styles from './page.module.css';
import { getMailtoLink } from '@/app/api/email/template';

// Email body generation moved to '@/app/api/email/template' module

export const metadata: Metadata = {
    title: 'Catering | Pig Roasts, BBQ & Events | Hofherr Meat Co. — Northfield, IL',
    description: 'Full-service event catering from Hofherr Meat Co. — whole pig roasts, competition BBQ, rotisserie chicken packages, and custom menus. Serving 20 to 500+ guests across Chicago\'s North Shore.',
    alternates: { canonical: 'https://hofherrmeatco.com/catering' },
    openGraph: {
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering, rotisserie packages & custom menus for any event. Northfield & Winnetka, IL.',
        url: 'https://hofherrmeatco.com/catering',
        images: [{ url: '/OG/og-catering.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catering | Hofherr Meat Co.',
        description: 'Pig roasts, BBQ catering & custom event menus. 20–500+ guests. Chicago North Shore.',
    },
};



const FALLBACK_PRICING = [
    { label: '1 Meat + 1 Side', price: '$16/person' },
    { label: 'Each Additional Meat', price: '+$4/person' },
    { label: 'Each Additional Side', price: '+$2/person' },
    { label: 'Add Charcuterie Platter', price: '+$4/person' },
    { label: 'Pimento Cheese Dip + Crackers', price: '$20/tray' },
    { label: 'Drop Off (within 5 miles)', price: '+$50' },
];

const PIG_PRICING = [
    { label: 'Just the Pig', price: '$30/person' },
    { label: 'Pig + 1 Side', price: '$32/person' },
    { label: 'Pig + 2 Sides', price: '$34/person' },
    { label: 'Pig + 3 Sides', price: '$36/person' },
    { label: '1 Add\'l Meat + 1 Side', price: '$36/person' },
    { label: '1 Add\'l Meat + 2 Sides', price: '$38/person' },
    { label: '1 Add\'l Meat + 3 Sides', price: '$40/person' },
];

type SanityPricing = {
    _id: string;
    tier: string;
    title: string;
    subtitle: string;
    description?: string;
    priceLines?: { label: string; price: string }[];
    isFeatured: boolean;
};

type CateringPackage = {
    _id: string;
    name: string;
    description?: string;
    servings?: string;
    price: string;
    items?: string[];
    image?: string;
    isPopular?: boolean;
};

const FALLBACK_PACKAGES: CateringPackage[] = [
    {
        _id: 'fb-1',
        name: 'Backyard BBQ',
        description: 'Our most popular package — everything you need for a killer backyard cookout.',
        servings: 'Serves 20–40',
        price: 'Starting at $16/person',
        items: ['Choice of 1 smoked meat', 'Choice of 1 side', 'Buns, sauces & napkins', 'Drop-off or pickup'],
        isPopular: false,
    },
    {
        _id: 'fb-2',
        name: 'BBQ Feast',
        description: 'More meat, more sides — the full spread for a serious gathering.',
        servings: 'Serves 40–100',
        price: 'Starting at $22/person',
        items: ['Choice of 2 smoked meats', 'Choice of 2 sides', 'Charcuterie platter', 'Full setup & serving'],
        isPopular: true,
    },
    {
        _id: 'fb-3',
        name: 'Whole Pig Roast',
        description: 'The showstopper. A whole hog roasted on-site — unforgettable for any event.',
        servings: 'Serves 50–150',
        price: 'Starting at $30/person',
        items: ['Whole hog roasted on-site', 'Choice of 2 sides', 'Carving & serving station', 'Full cleanup'],
        isPopular: false,
    },
];

export default async function CateringPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let bbqPricing = FALLBACK_PRICING;
    let packages: CateringPackage[] = FALLBACK_PACKAGES;
    try {
        const pricingData: SanityPricing[] = await sanityClient.fetch(BBQ_PRICING_QUERY);
        const featured = pricingData?.find(p => p.isFeatured && p.priceLines?.length);
        if (featured?.priceLines?.length) {
            bbqPricing = featured.priceLines;
        }
    } catch {
        // Use fallback
    }

    try {
        const rawPackages: CateringPackage[] = await sanityClient.fetch(CATERING_QUERY);
        if (rawPackages?.length) packages = rawPackages;
    } catch {
        // Use fallback packages
    }
    // DEBUG: output the mailto link for the first package so we can verify the email body
    if (packages.length > 0) {
      console.log('DEBUG mailto link for first package:', getMailtoLink(packages[0]));
    }
    // Catering events
    type CateringEventData = { _id: string; date: string; eventType: string; status: string };
    let cateringEvents: CateringEventData[] = [];
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        cateringEvents = await sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr });
    } catch {
        // No events to show
    }

    return (
        <div>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">Events &amp; Catering</div>
                    <h1 className={styles.headline}>
                        Feeding a <em>Crowd?</em>
                    </h1>
                    <p className={styles.sub}>
                        From backyard pig roasts to corporate BBQ spreads — Hofherr handles it all.
                        Custom menus, full-service setup, and food people actually talk about.
                    </p>
                    <div className={styles.heroBtns}>
                        <a href="mailto:catering@hofherrmeatco.com?subject=Catering%20Quote%20Request&body=Name:%20%0AEmail:%20%0APhone:%20%0AAddress:%20%0ADate%20%26%20Time:%20[Enter%20date%20and%20time]" className="btn btn-primary">Get a Free Quote</a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>


            {/* ── How It Works ── */}
            <section className={styles.processSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>How It Works</h2>
                    </div>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>1</div>
                            <h3>Tell Us About Your Event</h3>
                            <p>Email <a href="mailto:catering@hofherrmeatco.com" style={{color:'var(--gold)',textDecoration:'underline'}}>catering@hofherrmeatco.com</a> or call <a href="tel:8474416328" style={{color:'var(--gold)',textDecoration:'underline'}}>(847) 441-MEAT</a> with your date, guest count, and any dietary needs. We&apos;ll get back to you same day.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>2</div>
                            <h3>Custom Menu & Quote</h3>
                            <p>Sean puts together a tailored menu and transparent quote — no hidden fees, no surprises.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <h3>We Handle Everything</h3>
                            <p>Our team arrives with everything: food, setup, serving equipment, and cleanup. You just enjoy the party.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Catering Packages (Sanity) ── */}
            <section className={styles.packagesSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Packages</h2>
                        <p className={styles.sectionSub}>Pre-built packages for every event size. All customizable — just ask.</p>
                    </div>
                    <div className={styles.packagesGrid}>
                        {packages.map(pkg => (
                            <div key={pkg._id} className={`${styles.packageCard} ${pkg.isPopular ? styles.packagePopular : ''}`}>
                                {pkg.isPopular && <span className={styles.popularBadge}>Most Popular</span>}
                                {pkg.image && (
                                    <div className={styles.packageImgWrap}>
                                        <img src={pkg.image} alt={pkg.name} className={styles.packageImg} />
                                    </div>
                                )}
                                <div className={styles.packageBody}>
                                    {pkg.servings && <p className={styles.packageServings}>{pkg.servings}</p>}
                                    <h3 className={styles.packageName}>{pkg.name}</h3>
                                    <p className={styles.packagePrice}>{pkg.price}</p>
                                    {pkg.description && <p className={styles.packageDesc}>{pkg.description}</p>}
                                    {pkg.items && pkg.items.length > 0 && (
                                        <ul className={styles.packageItems}>
                                            {pkg.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <a
                                        href={getMailtoLink(pkg)}
                                        className={styles.packageCta}
                                    >
                                        Book This Package
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* Private Meat Sessions */}
                        <div className={styles.packageCard}>
                            <div className={styles.packageBody}>
                                <p className={styles.packageServings}>8–10 Guests</p>
                                <h3 className={styles.packageName}>🕯️ Private Meat Sessions</h3>
                                <p className={styles.packagePrice}>By Invitation</p>
                                <p className={styles.packageDesc}>After-hours, bespoke multi-course dining experiences hosted at the shop for groups of 8–10. A curated journey through our finest cuts — wine, fire, and no menu.</p>
                                <ul className={styles.packageItems}>
                                    <li>Multi-course tasting menu</li>
                                    <li>Premium & rare cuts</li>
                                    <li>Wine pairings</li>
                                    <li>Intimate shop setting</li>
                                </ul>
                                <a
                                      href={getMailtoLink({
                                        name: 'Private Meat Session',
                                        price: 'By Invitation',
                                        servings: '8–10 Guests',
                                        description: 'After-hours, bespoke multi-course dining experiences hosted at the shop for groups of 8–10. A curated journey through our finest cuts — wine, fire, and no menu.',
                                        items: [
                                          'Multi-course tasting menu',
                                          'Premium & rare cuts',
                                          'Wine pairings',
                                          'Intimate shop setting',
                                        ],
                                      })}
                                      className={styles.packageCta}
                                  >
                                      Inquire
                                  </a>
                            </div>
                        </div>

                        {/* Rotisserie Packages */}
                        <div className={styles.packageCard}>
                            <div className={styles.packageBody}>
                                <p className={styles.packageServings}>Minimum 6 Birds</p>
                                <h3 className={styles.packageName}>🍗 Rotisserie Packages</h3>
                                <p className={styles.packagePrice}>Custom Pricing</p>
                                <p className={styles.packageDesc}>Whole birds, roasted to order on our floor-to-ceiling rotisserie. Bulk packages for events, corporate lunches, and weekend parties.</p>
                                <ul className={styles.packageItems}>
                                    <li>Whole rotisserie chickens</li>
                                    <li>Bulk event pricing</li>
                                    <li>Corporate lunch packages</li>
                                    <li>Drop-off or full service</li>
                                </ul>
                                <a
                                    href={getMailtoLink({
                                      name: 'Rotisserie Package',
                                      price: 'Custom Pricing',
                                      servings: 'Varies',
                                      description: 'Whole birds, roasted to order on our floor-to-ceiling rotisserie. Bulk packages for events, corporate lunches, and weekend parties.',
                                      items: [
                                        'Whole rotisserie chickens',
                                        'Bulk event pricing',
                                        'Corporate lunch packages',
                                        'Drop-off or full service',
                                      ],
                                    })}
                                    className={styles.packageCta}
                                >
                                    View Packages
                                </a>
                            </div>
                        </div>

                        {/* Custom Meat Platters */}
                        <div className={styles.packageCard}>
                            <div className={styles.packageBody}>
                                <p className={styles.packageServings}>Any Size Group</p>
                                <h3 className={styles.packageName}>🥩 Custom Meat Platters</h3>
                                <p className={styles.packagePrice}>Custom Pricing</p>
                                <p className={styles.packageDesc}>Curated charcuterie boards, premium steak flights, and custom cut packages for dinner parties, holidays, and corporate entertaining.</p>
                                <ul className={styles.packageItems}>
                                    <li>Charcuterie boards</li>
                                    <li>Premium steak flights</li>
                                    <li>Custom cut packages</li>
                                    <li>Holiday & corporate platters</li>
                                </ul>
                                <a
                                      href={getMailtoLink({
                                        name: 'Custom Meat Platter',
                                        price: 'Custom Pricing',
                                        servings: 'Any Size Group',
                                        description: 'Curated charcuterie boards, premium steak flights, and custom cut packages for dinner parties, holidays, and corporate entertaining.',
                                        items: [
                                          'Charcuterie boards',
                                          'Premium steak flights',
                                          'Custom cut packages',
                                          'Holiday & corporate platters',
                                        ],
                                      })}
                                      className={styles.packageCta}
                                  >
                                      Shop Cuts
                                  </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Interactive Catering Calculator ── */}
            <section className={styles.pricingSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Build Your Package</h2>
                        <p className={styles.sectionSub}>Choose BBQ catering or a full pig roast, customize your options, and get an instant estimate.</p>
                    </div>
                    <CateringHub events={cateringEvents} calendarPricing={[]} />
                </div>
            </section>

            {/* ── Bottom Marquee Ticker ── */}
            <div className={styles.marqueeWrap}>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow1}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Pig Roasts <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> BBQ Catering <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Rotisserie <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Custom Platters <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow2}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Private Events <img src="/crowd-ticker/steak.png" alt="" className={styles.marqueeBullet} /> Corporate Dinners <img src="/crowd-ticker/steak.png" alt="" className={styles.marqueeBullet} /> Weddings <img src="/crowd-ticker/steak.png" alt="" className={styles.marqueeBullet} /> Backyard Parties <img src="/crowd-ticker/steak.png" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow3}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Smoked Brisket <img src="/crowd-ticker/chickeninticker.png" alt="" className={styles.marqueeBullet} /> Pulled Pork <img src="/crowd-ticker/chickeninticker.png" alt="" className={styles.marqueeBullet} /> Whole Hog <img src="/crowd-ticker/chickeninticker.png" alt="" className={styles.marqueeBullet} /> Charcuterie <img src="/crowd-ticker/chickeninticker.png" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
                <div className={`${styles.marqueeTrack} ${styles.marqueeRow4}`}>
                    {[0, 1].map(i => (
                        <span key={i} className={styles.marqueeText}>
                            Competition BBQ <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Farm to Fire <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Full Service <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} /> Custom Menus <img src="/crowd-ticker/pig.jpg" alt="" className={styles.marqueeBullet} />&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Ready to Plan Your Event?</h2>
                    <p className={styles.ctaSub}>Tell us about your event and Sean will put together a custom package — usually same day.</p>
                    <div className={styles.ctaBtns}>
                        <a href="mailto:catering@hofherrmeatco.com?subject=Catering Quote Request" className="btn btn-primary">Get a Free Quote</a>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
