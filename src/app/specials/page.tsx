import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, BBQ_MENU_QUERY, BBQ_PRICING_QUERY, ROTISSERIE_STATUS_QUERY } from '@/sanity/queries';
import NewsletterInline from '@/components/NewsletterInline';
import SignatureDishesSection, {
    FALLBACK_SIGNATURES,
    mergeSignatureFallbacks,
    type SignatureProduct,
    type RotisserieStatus,
} from '@/components/SignatureDishesSection';
import ParallaxMedia from '@/components/ParallaxMedia';
import ParallaxImg from '@/app/bbq/ParallaxImg';

import bbqStyles from '../bbq/page.module.css';
import styles from './page.module.css';

const getThumb = (name: string) => {
    const safeName = (name || '').toLowerCase();
    if (safeName.includes('brisket')) return '/images/bbq/brisket.jpg';
    if (safeName.includes('pulled pork')) return '/images/bbq/pulled_pork.jpg';
    if (safeName.includes('pulled chicken')) return '/images/bbq/pulled_chicken.jpg';
    if (safeName.includes('tips')) return '/images/bbq/rib_tips.jpg';
    if (safeName.includes('ribs') && !safeName.includes('tips')) return '/images/bbq/ribs.jpg';
    if (safeName.includes('sausage')) return '/images/bbq/sausage.jpg';
    if (safeName.includes('dates')) return '/images/bbq/chorizo_dates.jpg';
    if (safeName.includes('charcuterie')) return '/images/bbq/charcuterie.jpg';
    if (safeName.includes('pimento cheese') && !safeName.includes('mac')) return '/images/bbq/pimento_cheese.jpg';
    if (safeName.includes('mac and cheese') || safeName.includes('mac & cheese') || (safeName.includes('pimento') && safeName.includes('mac')) || safeName.includes('mac n cheese')) return '/images/bbq/mac_cheese.jpg';
    if (safeName.includes('slaw')) return '/images/bbq/coleslaw.jpg';
    if (safeName.includes('beans')) return '/images/bbq/baked_beans.jpg';
    if (safeName.includes('collard')) return '/images/bbq/collard_greens.jpg';
    if (safeName.includes('portobello')) return '/images/bbq/portobellos.jpg';
    if (safeName.includes('bean salad')) return '/images/bbq/bean_salad.jpg';
    if (safeName.includes('pasta salad')) return '/images/bbq/pasta_salad.jpg';
    if (safeName.includes('potato salad')) return '/images/bbq/potato_salad.jpg';
    if (safeName.includes('corn')) return '/images/bbq/corn.jpg';
    return null;
}

export const metadata: Metadata = {
    title: "Italian Beef, Rotisserie Chicken, BBQ & Pig Roasts | Hofherr Meat Co. Specials",
    description: "Hofherr Meat Co.'s signature offerings: world-famous Italian beef (featured on America's Test Kitchen & PBS Proof), daily pasture-raised rotisserie chicken dinners, award-winning BBQ catering, and whole-hog pig roasts. Northfield & Winnetka, IL.",
    keywords: ['Italian beef Northfield IL', 'rotisserie chicken Northfield', 'BBQ catering North Shore', 'pig roast Chicago', "America's Test Kitchen Italian beef", 'PBS Proof Hofherr', 'Hofherr Meat Co specials'],
    alternates: { canonical: 'https://hofherrmeatco.com/specials' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: "Italian Beef, Rotisserie Chicken, BBQ & Pig Roasts | Hofherr Meat Co.",
        description: "Italian beef (as featured on America's Test Kitchen), daily rotisserie chicken dinners, BBQ catering, and whole-hog pig roasts — the best of Hofherr Meat Co. North Shore, IL.",
        url: 'https://hofherrmeatco.com/specials',
        images: [{ url: '/OG/og-specials.jpg', width: 1200, height: 630, alt: 'Specials — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Hofherr Meat Co. Specials — Italian Beef, Chicken, BBQ & Pig Roasts",
        description: "Featured on America's Test Kitchen. Italian beef, rotisserie chicken, BBQ catering & whole-hog roasts. Northfield & Winnetka, IL.",
    },
};

/* ── Types ── */
type MenuItem = { name: string; category: string };
type PriceLine = { label: string; price: string };

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
            signatures = mergeSignatureFallbacks(rawSigs);
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

    // Rotisserie live stock status
    let rotisserie: RotisserieStatus | null = null;
    try {
        const rawRotisserie = await sanityClient.fetch(ROTISSERIE_STATUS_QUERY);
        if (rawRotisserie?.status) rotisserie = rawRotisserie;
    } catch {
        // No status to show
    }

    const grouped = menuItems.reduce((acc, item) => {
        const cat = item.category ?? 'meat';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <main>

            {/* ── Hero ── */}
            <section id="specials-hero" aria-labelledby="specials-hero-heading" className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 id="specials-hero-heading" className={styles.headline}>
                        The Dishes That <em>Made Our Name</em>
                    </h1>
                    <p className={styles.sub}>
                        The dishes and services that define Hofherr Meat Co. — perfected over years and impossible to find anywhere else.
                    </p>
                </div>
            </section>

            {/* ── Specials (dynamic from Sanity) ── */}
            <SignatureDishesSection signatures={signatures} rotisserie={rotisserie} />

            <section id="pig-roasts" aria-labelledby="pig-roasts-heading" className={styles.bbqSection}>
                <div className={styles.bbqHero}>
                    <div className="container">
                        <span className={styles.bbqEyebrow}>🐷 Full Service · Min. 50 Guests</span>
                        <h2 id="pig-roasts-heading" className={styles.bbqHeadline}>Hofherr Pig Roasts</h2>
                        <p className={styles.bbqSub}>
                            Our team of butchers and BBQ experts arrive one hour before serving with a fully roasted whole hog. Guests watch the carving demonstration and sample as it&apos;s served.
                        </p>
                    </div>
                </div>
                <div className="container">

                    <div className={styles.sectionImageWrapper}>
                        <ParallaxMedia
                            src="/video-clips/PIG-GRIL.mp4"
                            type="video"
                            className={styles.sectionImage}
                        />
                    </div>



                    <div className={styles.pigMenuWrap}>
                        <div className={bbqStyles.menuBoard}>

                            {/* Left Column: Sides */}
                            <div className={`${bbqStyles.menuCategory} ${bbqStyles.sidesColumn}`}>
                                <h3 className={bbqStyles.catTitle}>🥗 Side Options</h3>
                                <p className={bbqStyles.catDesc}>Classic homemade sides designed to perfectly complement our low-and-slow BBQ.</p>
                                <ul className={bbqStyles.menuListDual}>
                                    {[
                                        "Pimento Mac n Cheese",
                                        "HMCo.leSlaw",
                                        "Potato Salad",
                                        "Marinated Grilled Portobellos",
                                        "Corn",
                                        "Three Bean Salad",
                                        "House Pasta Salad",
                                        "Collard Greens",
                                        "North Shore Baked Beans"
                                    ].map(item => {
                                        const img = getThumb(item);
                                        return (
                                            <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                                {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                                <span>{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Right Column: Meats and Appetizers */}
                            <div className={`${bbqStyles.menuCategory} ${bbqStyles.meatCategory}`}>

                                {/* Meats */}
                                <h3 className={bbqStyles.catTitle}>🔥 Add&apos;l Meats Options</h3>
                                <p className={bbqStyles.catDesc}>All meats are slow-smoked in-house over authentic oak and cherry wood for up to 14 hours.</p>
                                <ul className={bbqStyles.menuListDual}>
                                    {[
                                        "Burnt Ends Brisket",
                                        "BBQ Pulled Chicken",
                                        "Rib Tips + Hot Links Combo",
                                        "Smoked Ribs",
                                        "Any of our HMC Sausages"
                                    ].map(item => {
                                        const img = getThumb(item);
                                        return (
                                            <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                                {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                                <span>{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Appetizers */}
                                <h3 className={`${bbqStyles.catTitle} ${styles.appetizerTitleSpaced}`}>🧀 Appetizer Options</h3>
                                <ul className={`${bbqStyles.menuList} ${styles.appetizerBentoList}`}>
                                    {[
                                        "Butcher's Charcuterie Board",
                                        "Bacon Wrapped Chorizo Dates",
                                        "Pimento Cheese + Crackers (+$2/pp)"
                                    ].map(item => {
                                        const img = getThumb(item);
                                        return (
                                            <li key={item} className={img ? bbqStyles.hasThumb : ''}>
                                                {img && <ParallaxImg src={img} alt={item} className={bbqStyles.listThumb} />}
                                                <span>{item}</span>
                                            </li>
                                        );
                                    })}
                                    <li className={styles.pigRoastCtaItem}>
                                        <div className={styles.pigRoastCtaSurface}>
                                            <div className={styles.pigRoastCtaContent}>
                                                <div className={styles.pigRoastCtaCopy}>
                                                    <h4 className={styles.pigRoastCtaTitle}>Build Your Pig Roast Package</h4>
                                                    <p className={styles.pigRoastCtaSub}>
                                                        Use our interactive calculator to customize your menu, pick a date, and send an inquiry.
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/catering#build-your-package"
                                                    className={`btn ${styles.pigRoastCtaBtn}`}
                                                >
                                                    Start Building →
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ── Newsletter ── */}
            <section id="specials-newsletter" aria-labelledby="specials-newsletter-heading" className={styles.newsletter}>
                <div className={`container ${styles.newsletterInner}`}>
                    <div className={styles.nlLeft}>
                        <h2 id="specials-newsletter-heading" className={styles.nlTitle}>Never Miss a Special</h2>
                        <p className={styles.nlSub}>Get early access to seasonal offerings, holiday pre-orders, and new additions to our lineup every Tuesday morning.</p>
                    </div>
                    <div className={styles.nlRight}>
                        <NewsletterInline />
                    </div>
                </div>
            </section>

        </main>
    );
}
