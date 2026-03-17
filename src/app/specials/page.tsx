import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, BBQ_MENU_QUERY, BBQ_PRICING_QUERY } from '@/sanity/queries';
import NewsletterInline from '@/components/NewsletterInline';
import VideoCallout from '@/components/specials/VideoCalloutWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: "Specials | Hofherr Meat Co.",
    description: "What we offer at Hofherr Meat Co.: world-famous Italian beef (as featured on America's Test Kitchen), daily rotisserie chicken dinners, BBQ catering, and whole-hog pig roasts. Northfield, IL.",
    alternates: { canonical: 'https://hofherrmeatco.com/specials' },
    openGraph: {
        title: "Specials | Hofherr Meat Co.",
        description: "Italian beef, rotisserie chicken, BBQ catering, and pig roasts — the best of Hofherr Meat Co.",
        url: 'https://hofherrmeatco.com/specials',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
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
        sectionLabel: 'Chicago Classic · Our Flagship',
        emoji: '🥩',
        image: '/italian-beef.jpg',
        description: "In November 2022, America's Test Kitchen challenged us to make the best Italian Beef sandwich in the city. We accepted, worked in secret for a month, and in December 2022 served the greatest beef Chicagoland has ever eaten.\n\nOur experience is the subject of the season finale of their podcast, Proof on PBS — listen as we go from concept to service.\n\n🏪 Depot Location: Served Mon–Fri starting at 10:30am until sold out, inside the Winnetka Elm St. Metra Station.",
        calloutTitle: 'As Featured On',
        calloutSub: "America's Test Kitchen\nPodcast: Proof\nPBS Weekends",
        calloutColor: 'var(--red)',
        chips: [],
        links: [
            { label: '🎙 Listen to the Podcast', url: 'http://bit.ly/3QTft4F', isPrimary: false },
            { label: 'Order Online', url: '/online-orders?store=depot', isPrimary: true },
        ],
        video: '/video-clips/Beef.jp4.mp4',
        layout: 'callout-left',
    },
    {
        _id: 'fb-2',
        title: 'Rotisserie Chicken Dinners',
        sectionLabel: 'Ready Daily · Tue–Sun',
        emoji: '🍗',
        image: '/rotisserie-chicken.jpg',
        video: '/video-clips/chicken.mp4',
        description: "These tasty, pasture-raised chickens come hot and ready with roasted schmaltzy potatoes. Slow-roasted on our floor-to-ceiling rotisserie — simple seasoning, perfect every time.\n\nAvailable for curbside pickup Tuesday through Sunday. Call ahead — they sell out most days.",
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

    try {
        const [rawSigs, rawMenu] = await Promise.all([
            sanityClient.fetch(SIGNATURE_PRODUCTS_QUERY),
            sanityClient.fetch(BBQ_MENU_QUERY),
        ]);
        if (rawSigs?.length) {
            signatures = rawSigs.map((sig: SignatureProduct) => {
                const fallback = FALLBACK_SIGNATURES.find(f => f.title === sig.title);
                return {
                    ...sig,
                    image: sig.image || fallback?.image,
                    video: sig.video || fallback?.video,
                };
            });
        }
        menuItems = rawMenu?.length ? rawMenu : FALLBACK_BBQ_MENU;
    } catch {
        menuItems = FALLBACK_BBQ_MENU;
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
                <section className={`section-sm ${styles.altSection}`}>
                    <div className="container">
                        <div className={styles.menuHeader}>
                            <div className="section-label">Catering · Min. 4 Days Notice</div>
                            <h2 className={styles.sectionTitle}>BBQ Catering Menu</h2>
                            <p className={styles.menuSub}>Subject to availability. Under 20 guests min. $200. Email <a href="mailto:catering@hofherrmeatco.com">catering@hofherrmeatco.com</a> for pricing.</p>
                        </div>

                        <div className={styles.menuGrid}>
                            {['appetizer', 'meat', 'side'].filter(c => grouped[c]?.length).map(cat => (
                                <div key={cat} className={styles.menuCategory}>
                                    <h3 className={styles.menuCatTitle}>{CATEGORY_META[cat]}</h3>
                                    <ul className={styles.menuList}>
                                        {grouped[cat].map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className={styles.pricingBox}>
                            <h3 className={styles.pricingTitle}>Pricing (20+ People · Pickup)</h3>
                            <p className={styles.pricingNote}>Includes paperware, cutlery, serving utensils, buns, condiments &amp; sauce. Price does not include tax.</p>
                            <div className={styles.pricingGrid}>
                                <div className={styles.priceRow}><span>1 Meat + 1 Side</span><strong>$16/person</strong></div>
                                <div className={styles.priceRow}><span>Each Additional Meat</span><strong>+$4/person</strong></div>
                                <div className={styles.priceRow}><span>Each Additional Side</span><strong>+$2/person</strong></div>
                                <div className={styles.priceRow}><span>Add Charcuterie Platter</span><strong>+$4/person</strong></div>
                                <div className={styles.priceRow}><span>Pimento Cheese Dip + Crackers</span><strong>$20/tray</strong></div>
                                <div className={styles.priceRow}><span>Drop Off (within 5 miles)</span><strong>+$50</strong></div>
                            </div>
                            <a href="mailto:catering@hofherrmeatco.com?subject=BBQ Catering Quote" className="btn btn-primary">Get a BBQ Quote</a>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Pig Roasts ── */}
            <section className={`section-sm ${styles.mainSection}`}>
                <div className="container">
                    <div className={styles.menuHeader}>
                        <div className="section-label">Full Service · Min. 50 Guests</div>
                        <h2 className={styles.sectionTitle}>🐷 Hofherr Pig Roasts</h2>
                        <p className={styles.menuSub}>Our team of butchers and BBQ experts arrive one hour before serving with a fully roasted whole hog. Guests watch the carving demonstration and sample as it&apos;s served.</p>
                    </div>

                    <div className={styles.sectionImageWrapper}>
                        <img src="/pig-roast-2.jpg" alt="Whole Pig Roast" className={styles.sectionImage} />
                    </div>

                    <div className={styles.sectionImageWrapper}>
                        <img src="/pig-roast-spread.jpg" alt="Pig Roast Catering Spread" className={styles.sectionImage} />
                    </div>

                    <div className={styles.pigIncludes}>
                        <h3 className={styles.menuCatTitle}>Menu Options</h3>
                        <div className={styles.menuGrid}>
                            <div className={styles.menuCategory}>
                                <h3 className={styles.menuCatTitle}>Appetizers (+$4/pp)</h3>
                                <ul className={styles.menuList}>
                                    <li>Butcher&apos;s Charcuterie Board</li>
                                    <li>Bacon Wrapped Chorizo Dates</li>
                                    <li>Pimento Cheese + Crackers (+$2/pp)</li>
                                </ul>
                            </div>
                            <div className={styles.menuCategory}>
                                <h3 className={styles.menuCatTitle}>Add&apos;l Meats</h3>
                                <ul className={styles.menuList}>
                                    <li>Burnt Ends Brisket</li>
                                    <li>BBQ Pulled Chicken</li>
                                    <li>Rib Tips + Hot Links Combo</li>
                                    <li>Smoked Ribs</li>
                                    <li>Any of our HMC Sausages</li>
                                </ul>
                            </div>
                            <div className={styles.menuCategory}>
                                <h3 className={styles.menuCatTitle}>Side Options</h3>
                                <ul className={styles.menuList}>
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

                    <div className={styles.pricingBox}>
                        <h3 className={styles.pricingTitle}>Pig Roast Pricing (Per Person · Pickup)</h3>
                        <p className={styles.pricingNote}>Includes paperware, cutlery, serving utensils, buns, condiments &amp; sauce. Price does not include tax.</p>
                        <div className={styles.pricingGrid}>
                            <div className={styles.priceRow}><span>Just the Pig</span><strong>$30/person</strong></div>
                            <div className={styles.priceRow}><span>Pig + 1 Side</span><strong>$32/person</strong></div>
                            <div className={styles.priceRow}><span>Pig + 2 Sides</span><strong>$34/person</strong></div>
                            <div className={styles.priceRow}><span>Pig + 3 Sides</span><strong>$36/person</strong></div>
                            <div className={styles.priceRow}><span>1 Add&apos;l Meat + 1 Side</span><strong>$36/person</strong></div>
                            <div className={styles.priceRow}><span>1 Add&apos;l Meat + 2 Sides</span><strong>$38/person</strong></div>
                            <div className={styles.priceRow}><span>1 Add&apos;l Meat + 3 Sides</span><strong>$40/person</strong></div>
                        </div>
                        <a href="mailto:catering@hofherrmeatco.com?subject=Pig Roast Inquiry" className="btn btn-primary">Reserve a Date</a>
                    </div>
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
