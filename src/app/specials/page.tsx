import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, BBQ_MENU_QUERY, BBQ_PRICING_QUERY, CATERING_EVENTS_QUERY, CATERING_CALENDAR_PRICING_QUERY, ROTISSERIE_STATUS_QUERY } from '@/sanity/queries';
import NewsletterInline from '@/components/NewsletterInline';
import VideoCallout from '@/components/specials/VideoCalloutWrapper';
import CateringCalendar from '@/components/CateringCalendar';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: "Specials | Hofherr Meat Co.",
    description: "What we offer at Hofherr Meat Co.: world-famous Italian beef (as featured on America's Test Kitchen), daily rotisserie chicken dinners, BBQ catering, and whole-hog pig roasts. Northfield, IL.",
    alternates: { canonical: 'https://hofherrmeatco.com/specials' },
    openGraph: {
        title: "Specials | Hofherr Meat Co.",
        description: "Italian beef, rotisserie chicken, BBQ catering, and pig roasts — the best of Hofherr Meat Co.",
        url: 'https://hofherrmeatco.com/specials',
        images: [{ url: '/OG/og-specials.png', width: 1200, height: 630 }],
    },
};

/* ── Types ── */
type SignatureProduct = {
    _id: string;
    title: string;
    sectionLabel?: string | null;
    emoji?: string | null;
    description?: string | null;
    calloutTitle?: string | null;
    calloutSub?: string | null;
    calloutColor?: string | null;
    chips?: string[] | null;
    links?: { label: string; url: string; isPrimary?: boolean }[] | null;
    layout?: string | null;
    image?: string | null;
    video?: string | null;
};

type MenuItem = { name: string; category: string };
type PriceLine = { label: string; price: string };

/* ── Fallbacks ── */
const FALLBACK_SIGNATURES: SignatureProduct[] = [
    {
        _id: 'fb-1',
        title: "The World's Greatest Italian Beef",
        sectionLabel: 'Chicago Classic · Depot Exclusive',
        emoji: '🥩',
        image: '/assets/italian-beef.jpg',
        description: "In November 2022, America's Test Kitchen challenged us to make the best Italian Beef sandwich in the city. We accepted, worked in secret for a month, and in December 2022 served the greatest beef Chicagoland has ever tasted.\n\nOur story became the season finale of their podcast, Proof on PBS — a deep dive from concept to first service. It's what happens when a 120-year-old butcher shop refuses to play it safe.\n\nThe sandwich is served exclusively at The Depot — our counter inside the Winnetka Elm St. Metra Station — Mon–Fri from 10:30am until we sell out. There is no substitute and no pre-order.\n\n🏪 Can't make it to The Depot? Order our house-roasted Italian beef by the pound and build the perfect sandwich at home.",
        calloutTitle: 'As Featured On',
        calloutSub: "America's Test Kitchen\nPodcast: Proof\nPBS Weekends",
        calloutColor: 'var(--red)',
        chips: ["🎙 America's Test Kitchen", '📻 Podcast: Proof', '📺 PBS Weekends'],
        links: [
            { label: '🎙 Listen to the Podcast', url: 'http://bit.ly/3QTft4F', isPrimary: false },
            { label: 'Visit The Depot', url: '/visit#depot', isPrimary: false },
            { label: 'Order Beef by the Pound', url: '/online-orders', isPrimary: true },
        ],
        video: '/video-clips/Beef.jp4.mp4',
        layout: 'callout-left',
    },
    {
        _id: 'fb-2',
        title: 'Rotisserie Chicken Dinners',
        sectionLabel: 'Ready Daily · Tue–Sun',
        emoji: '🍗',
        image: '/assets/rotisserie-chicken.jpg',
        video: '/video-clips/chicken.mp4',
        description: "These tasty, pasture-raised chickens come hot and ready with roasted schmaltzy potatoes. Slow-roasted on our floor-to-ceiling rotisserie — simple seasoning, perfect every time.\n\nAvailable for curbside pickup Tuesday through Sunday. Call ahead — they sell out most days.\n\n🏪 Depot Location: We are serving up beefs from 10:30am until sold out, Monday–Friday, inside the Winnetka Elm St. Metra Station.",
        calloutTitle: 'Hot & Ready',
        calloutSub: 'Tue–Sun\nStarting at noon\nWhile supplies last',
        calloutColor: '',
        chips: ['🐔 Pasture-Raised', '🥔 Schmaltzy Potatoes Included', '🚗 Curbside Pickup'],
        links: [
            { label: '📞 Reserve at (847) 441-MEAT', url: 'tel:8474416328', isPrimary: true },
        ],
        layout: 'callout-right',
    },
];

const CATEGORY_META: Record<string, string> = {
    appetizer: '🧀 Appetizers',
    meat: '🔥 Meats',
    side: '🥗 Sides',
};

const FALLBACK_BBQ_MENU: MenuItem[] = [
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
    { name: 'Three Bean Salad', category: 'side' },
    { name: 'House Pasta Salad', category: 'side' },
    { name: 'Collard Greens', category: 'side' },
    { name: 'North Shore Baked Beans', category: 'side' },
    { name: "Butcher's Charcuterie Board", category: 'appetizer' },
    { name: 'Bacon Wrapped Chorizo Dates', category: 'appetizer' },
    { name: 'Pimento Cheese + Crackers', category: 'appetizer' },
];

export default async function SpecialsPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let signatures: SignatureProduct[] = FALLBACK_SIGNATURES;
    let menuItems: MenuItem[] = [];
    let bbqPricing: { label: string; price: string }[] = [
        { label: '1 Meat + 1 Side', price: '$16/person' },
        { label: 'Each Additional Meat', price: '+$4/person' },
        { label: 'Each Additional Side', price: '+$2/person' },
        { label: 'Add Charcuterie Platter', price: '+$4/person' },
        { label: 'Pimento Cheese Dip + Crackers', price: '$20/tray' },
        { label: 'Drop Off (within 5 miles)', price: '+$50' },
    ];

    try {
        const [rawSigs, rawMenu, rawPricing] = await Promise.all([
            sanityClient.fetch(SIGNATURE_PRODUCTS_QUERY),
            sanityClient.fetch(BBQ_MENU_QUERY),
            sanityClient.fetch(BBQ_PRICING_QUERY),
        ]);
        if (rawSigs?.length) {
            const normalize = (s: string) => s.replace(/[\u2018\u2019\u201C\u201D]/g, (c) => 
                c === '\u2018' || c === '\u2019' ? "'" : '"'
            );
            signatures = rawSigs.map((sig: SignatureProduct) => {
                const fallback = FALLBACK_SIGNATURES.find(f => normalize(f.title) === normalize(sig.title));
                return {
                    ...sig,
                    image: sig.image || fallback?.image,
                    video: sig.video || fallback?.video,
                };
            });
        }
        menuItems = rawMenu?.length ? rawMenu : FALLBACK_BBQ_MENU;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const featured = rawPricing?.find((p: any) => p.isFeatured && p.priceLines?.length);
        if (featured?.priceLines?.length) {
            bbqPricing = featured.priceLines;
        }
    } catch {
        menuItems = FALLBACK_BBQ_MENU;
    }

    // Catering events + calendar pricing
    type CateringEventData = { _id: string; date: string; eventType: string; status: string };
    type CalendarPricingRow = { label: string; price: string };
    let cateringEvents: CateringEventData[] = [];
    let calendarPricing: CalendarPricingRow[] = [
        { label: 'Pig Roast (50+ guests)', price: 'From $30/pp' },
        { label: 'BBQ Catering (20+ guests)', price: 'From $16/pp' },
        { label: 'Ask us about custom options', price: 'Contact us' },
    ];
    // Rotisserie live stock status
    type RotisserieStatus = { status: string; birdsLeft?: number | null; nextAvailable?: string | null; note?: string | null; lastUpdated?: string | null };
    let rotisserie: RotisserieStatus | null = null;
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [rawEvents, rawCalPricing, rawRotisserie] = await Promise.all([
            sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr }),
            sanityClient.fetch(CATERING_CALENDAR_PRICING_QUERY),
            sanityClient.fetch(ROTISSERIE_STATUS_QUERY),
        ]);
        cateringEvents = rawEvents ?? [];
        if (rawCalPricing?.length) calendarPricing = rawCalPricing;
        if (rawRotisserie?.status) rotisserie = rawRotisserie;
    } catch {
        // No events to show
    }

    const grouped = menuItems.reduce((acc, item) => {
        const cat = item.category ?? 'meat';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">What We Offer</div>
                    <h1 className={styles.headline}>
                        Our <em>Specials</em>
                    </h1>
                    <p className={styles.sub}>
                        The dishes and services that define Hofherr Meat Co. — perfected over years and impossible to find anywhere else.
                    </p>
                </div>
            </section>

            {/* ── Specials (dynamic from Sanity) ── */}
            {signatures.map((product, idx) => {
                const isAlt = product.layout === 'callout-right';
                const calloutStyle = product.calloutColor
                    ? { background: product.calloutColor, color: '#fff' }
                    : {};
                const calloutTitleStyle = product.calloutColor ? { color: '#fff' } : {};
                const calloutSubStyle = product.calloutColor ? { color: 'rgba(255,255,255,0.8)' } : {};

                const callout = product.video && product.image ? (
                    <VideoCallout 
                        image={product.image} 
                        video={product.video} 
                        alt={product.title} 
                        title={product.calloutTitle}
                        sub={product.calloutSub}
                    />
                ) : product.image ? (
                    <div className={styles.imageCallout}>
                        <img src={product.image} alt={product.title} />
                    </div>
                ) : (
                    <div className={styles.featureCallout} style={calloutStyle}>
                        {product.emoji && <div className={styles.calloutEmoji}>{product.emoji}</div>}
                        {product.calloutTitle && <div className={styles.calloutTitle} style={calloutTitleStyle}>{product.calloutTitle}</div>}
                        {product.calloutSub && (
                            <div className={styles.calloutSub} style={calloutSubStyle}>
                                {product.calloutSub.split('\n').map((line, i) => (
                                    <span key={i}>{line}<br /></span>
                                ))}
                            </div>
                        )}
                    </div>
                );

                const isChicken = product._id === 'fb-2' || product.title?.toLowerCase().includes('rotisserie');
                const rStatus = isChicken ? rotisserie : null;
                const stockBadgeColor =
                    rStatus?.status === 'available' ? { bg: '#16a34a', border: '#15803d' }
                    : rStatus?.status === 'low' ? { bg: '#d97706', border: '#b45309' }
                    : rStatus?.status === 'sold_out' ? { bg: '#dc2626', border: '#b91c1c' }
                    : { bg: '#475569', border: '#334155' };

                const stockMessage =
                    rStatus?.note ? rStatus.note
                    : rStatus?.status === 'available'
                        ? rStatus.birdsLeft ? `${rStatus.birdsLeft} bird${rStatus.birdsLeft !== 1 ? 's' : ''} left today — call to reserve!`
                        : 'Available today — call to reserve your bird'
                    : rStatus?.status === 'low'
                        ? rStatus.birdsLeft ? `Only ${rStatus.birdsLeft} left — call now!`
                        : 'Almost sold out — call now!'
                    : rStatus?.status === 'sold_out'
                        ? `Sold out today${rStatus.nextAvailable ? ` · ${rStatus.nextAvailable}` : ''}`
                    : rStatus?.status === 'unavailable'
                        ? `Not available today${rStatus.nextAvailable ? ` · ${rStatus.nextAvailable}` : ''}`
                    : null;

                const text = (
                    <div className={styles.featureText}>
                        {product.sectionLabel && <div className="section-label">{product.sectionLabel}</div>}
                        <h2 className={styles.sectionTitle}>{product.title}</h2>
                        {product.description && product.description.split('\n\n').map((para, i) => (
                            <p key={i} className={para.startsWith('🏪') ? styles.depotNote : undefined}>{para}</p>
                        ))}
                        {product.chips && product.chips.length > 0 && (
                            <div className={styles.chipRow}>
                                {product.chips.map((chip) => (
                                    <span key={chip} className={styles.chip}>{chip}</span>
                                ))}
                            </div>
                        )}
                        {/* Live rotisserie stock badge */}
                        {rStatus && stockMessage && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: stockBadgeColor.bg,
                                border: `1px solid ${stockBadgeColor.border}`,
                                borderRadius: '8px',
                                padding: '10px 16px',
                                marginTop: '4px',
                                marginBottom: '8px',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                color: '#fff',
                                lineHeight: 1.3,
                            }}>
                                <span style={{ fontSize: '18px' }}>
                                    {rStatus.status === 'available' ? '🟢'
                                    : rStatus.status === 'low' ? '🟡'
                                    : '🔴'}
                                </span>
                                <span>{stockMessage}</span>
                            </div>
                        )}
                        {product.links && product.links.length > 0 && (
                            <div className={styles.btnRow}>
                                {[...product.links]
                                    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                                    .map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target={link.url.startsWith('http') ? '_blank' : undefined}
                                            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className={`btn ${link.isPrimary ? 'btn-primary' : 'btn-secondary'}`}
                                        >
                                            {link.label.replace(/[\u2190-\u21FF]|[\u2700-\u27BF]|[\u2B00-\u2BFF]|\uFE0F/g, '').trim()}
                                        </a>
                                    ))}
                            </div>
                        )}

                    </div>
                );

                return (
                    <section
                        key={product._id}
                        id={product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                        className={`section-sm ${idx % 2 === 0 ? styles.mainSection : styles.altSection}`}
                    >
                        <div className="container">
                            <div className={styles.featureGrid}>
                                {isAlt ? <>{text}{callout}</> : <>{callout}{text}</>}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* ── BBQ Menu (from Sanity) ── */}
            {menuItems.length > 0 && (
                <section id="bbq-catering" className={styles.bbqSection}>
                    {/* Dark hero banner */}
                    <div className={styles.bbqHero}>
                        <div className="container">
                            <span className={styles.bbqEyebrow}>🔥 Catering · Min. 4 Days Notice</span>
                            <h2 className={styles.bbqHeadline}>BBQ Catering Menu</h2>
                            <p className={styles.bbqSub}>
                                Subject to availability. Under 20 guests min. $200. Email{' '}
                                <a href="mailto:catering@hofherrmeatco.com">catering@hofherrmeatco.com</a>{' '}
                                for pricing.
                            </p>
                        </div>
                    </div>

                    {/* Menu categories */}
                    <div className="container">
                        <div className={styles.bbqMenuGrid}>
                            {['appetizer', 'meat', 'side'].filter(c => grouped[c]?.length).map(cat => (
                                <div key={cat} className={`${styles.bbqCard} ${styles[`bbqCard_${cat}`]}`}>
                                    <div className={styles.bbqCardHeader}>
                                        <h3 className={styles.bbqCardTitle}>{CATEGORY_META[cat]}</h3>
                                        <span className={styles.bbqCardCount}>{grouped[cat].length} items</span>
                                    </div>
                                    <ul className={styles.bbqList}>
                                        {grouped[cat].map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className={styles.sectionImageWrapper}>
                            <img src="/assets/pig-roast-spread.jpg" alt="BBQ Catering Spread" className={styles.sectionImage} />
                        </div>

                        {/* Pricing */}
                        <div className={styles.bbqPricing}>
                            <div className={styles.bbqPricingHeader}>
                                <h3 className={styles.bbqPricingTitle}>Pricing</h3>
                                <span className={styles.bbqPricingBadge}>20+ People · Pickup</span>
                            </div>
                            <p className={styles.bbqPricingNote}>
                                Includes paperware, cutlery, serving utensils, buns, condiments &amp; sauce. Price does not include tax.
                            </p>
                            <div className={styles.bbqPricingGrid}>
                                {bbqPricing.map(p => (
                                    <div key={p.label} className={styles.bbqPriceRow}><span>{p.label}</span><strong>{p.price}</strong></div>
                                ))}
                            </div>
                            <a href="mailto:catering@hofherrmeatco.com?subject=BBQ Catering Quote" className="btn btn-primary" style={{ marginTop: '8px', alignSelf: 'center' }}>Get a BBQ Quote</a>
                        </div>
                    </div>
                </section>
            )}

            <section id="pig-roasts" className={styles.bbqSection}>
                <div className={styles.bbqHero}>
                    <div className="container">
                        <span className={styles.bbqEyebrow}>🐷 Full Service · Min. 50 Guests</span>
                        <h2 className={styles.bbqHeadline}>Hofherr Pig Roasts</h2>
                        <p className={styles.bbqSub}>
                            Our team of butchers and BBQ experts arrive one hour before serving with a fully roasted whole hog. Guests watch the carving demonstration and sample as it&apos;s served.
                        </p>
                    </div>
                </div>
                <div className="container">

                    <div className={styles.sectionImageWrapper}>
                        <img src="/assets/pig-roast-2.jpg" alt="Whole Pig Roast" className={styles.sectionImage} />
                    </div>



                    <div style={{ marginBottom: '32px' }}>
                        <h3 className={styles.bbqCardTitle} style={{ marginBottom: '20px' }}>Menu Options</h3>
                        <div className={styles.bbqMenuGrid}>
                            <div className={`${styles.bbqCard} ${styles.bbqCard_appetizer}`}>
                                <div className={styles.bbqCardHeader}>
                                    <h3 className={styles.bbqCardTitle}>Appetizers (+$4/pp)</h3>
                                </div>
                                <ul className={styles.bbqList}>
                                    <li>Butcher&apos;s Charcuterie Board</li>
                                    <li>Bacon Wrapped Chorizo Dates</li>
                                    <li>Pimento Cheese + Crackers (+$2/pp)</li>
                                </ul>
                            </div>
                            <div className={`${styles.bbqCard} ${styles.bbqCard_meat}`}>
                                <div className={styles.bbqCardHeader}>
                                    <h3 className={styles.bbqCardTitle}>Add&apos;l Meats</h3>
                                </div>
                                <ul className={styles.bbqList}>
                                    <li>Burnt Ends Brisket</li>
                                    <li>BBQ Pulled Chicken</li>
                                    <li>Rib Tips + Hot Links Combo</li>
                                    <li>Smoked Ribs</li>
                                    <li>Any of our HMC Sausages</li>
                                </ul>
                            </div>
                            <div className={`${styles.bbqCard} ${styles.bbqCard_side}`}>
                                <div className={styles.bbqCardHeader}>
                                    <h3 className={styles.bbqCardTitle}>Side Options</h3>
                                </div>
                                <ul className={styles.bbqList}>
                                    <li>Pimento Mac n Cheese</li>
                                    <li>HMCo.leSlaw</li>
                                    <li>Potato Salad</li>
                                    <li>Marinated Grilled Portobellos</li>
                                    <li>Corn</li>
                                    <li>Three Bean Salad</li>
                                    <li>House Pasta Salad</li>
                                    <li>Collard Greens</li>
                                    <li>North Shore Baked Beans</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={styles.bbqPricing}>
                        <div className={styles.bbqPricingHeader}>
                            <h3 className={styles.bbqPricingTitle}>Pig Roast Pricing</h3>
                            <span className={styles.bbqPricingBadge}>Per Person · Pickup</span>
                        </div>
                        <p className={styles.bbqPricingNote}>Includes paperware, cutlery, serving utensils, buns, condiments &amp; sauce. Price does not include tax.</p>
                        <div className={styles.bbqPricingGrid}>
                            <div className={styles.bbqPriceRow}><span>Just the Pig</span><strong>$30/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>Pig + 1 Side</span><strong>$32/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>Pig + 2 Sides</span><strong>$34/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>Pig + 3 Sides</span><strong>$36/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>1 Add&apos;l Meat + 1 Side</span><strong>$36/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>1 Add&apos;l Meat + 2 Sides</span><strong>$38/person</strong></div>
                            <div className={styles.bbqPriceRow}><span>1 Add&apos;l Meat + 3 Sides</span><strong>$40/person</strong></div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                            <a href="mailto:catering@hofherrmeatco.com?subject=Pig Roast Inquiry" className="btn btn-primary">Reserve a Date →</a>
                            <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                        </div>
                    </div>

                    {/* Availability Calendar */}
                    <CateringCalendar events={cateringEvents} defaultPricing={calendarPricing} />
                </div>
            </section>



            {/* ── Newsletter ── */}
            <section className={styles.newsletter}>
                <div className={`container ${styles.newsletterInner}`}>
                    <div className={styles.nlLeft}>
                        <div className="section-label">Stay in the Loop</div>
                        <h2 className={styles.nlTitle}>Never Miss a Special</h2>
                        <p className={styles.nlSub}>Get early access to seasonal offerings, holiday pre-orders, and new additions to our lineup every Tuesday morning.</p>
                    </div>
                    <div className={styles.nlRight}>
                        <NewsletterInline />
                    </div>
                </div>
            </section>

        </div>
    );
}
