'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

/* ── Customer Review Audit: Pain Points & Fixes ── */
const REVIEW_FIXES = [
    {
        emoji: '🦃',
        title: 'Fix #1: Holiday Pickup Chaos & Missing Sides',
        impact: 'Cuts Happ Rd. lines by 60% & eliminates packing errors',
        desc: 'Yelp & Facebook reviewers rave about our chargrilled turkeys and briskets, but cite long Thanksgiving/Christmas pickup lines and occasional forgotten sides under rush pressure.',
        bullets: [
            '5-Minute Curbside Express Bays on Happ Rd. via SMS runner',
            'Two-Signature Side Checklist (Packer + Runner) before sealing boxes',
            'Winnetka Depot satellite holiday pickup hub to split foot traffic',
        ],
        competitors: ['Yelp & FB Review Fix', 'Holiday Logistics'],
    },
    {
        emoji: '🥪',
        title: 'Fix #2: 30–45 Min Lunch Waits on Italian Beef',
        impact: 'Cuts walk-in wait under 10 mins + adds $58 kit AOV',
        desc: 'Cooking chuck eye shabu-shabu style per sandwich makes our Italian Beef legendary—but peak lunch waits (30–45 mins) and unexpected sell-outs frustrate busy customers.',
        bullets: [
            'Timed 10-minute online pickup slots + live walk-in wait quotes',
            'Live daily batch counter online ("85 Beefs today—reserve by 11:15 AM")',
            '4-Pack DIY "Shabu Beef" Take-Home Kits (sliced chuck eye, jus, rolls, giardiniera)',
        ],
        competitors: ['Yelp & FB Review Fix', 'Throughput'],
    },
    {
        emoji: '🥩',
        title: 'Fix #3: Reframing Price "Sticker Shock"',
        impact: 'Converts casual browsers into weekly family buyers',
        desc: 'Casual shoppers occasionally compare Prime dry-aged per-pound prices to corporate supermarkets. We reframe price into complete family meal value and farm transparency.',
        bullets: [
            '$49 Weeknight Family Dinner Bundles (~$12/person for 4)',
            '"Why Hofherr" farm-lineage & dry-age yield cards in every bag',
            'Hofherr Butcher Club ($149/mo) with priority holiday pickup slots',
        ],
        competitors: ['Yelp & FB Review Fix', 'Value Framing'],
    },
    {
        emoji: '🚆',
        title: 'Fix #4: Northfield vs. Winnetka Depot Clarity',
        impact: 'Turns 2 locations into a commuter superpower',
        desc: 'First-time visitors sometimes confuse which location has the full custom butcher counter (Northfield) vs. hot commuter lunches (Winnetka Metra Depot).',
        bullets: [
            'Clear two-location badges across Yelp, Facebook, Google & web',
            '"Order from Northfield Butcher by 1 PM, Grab at Winnetka Train" bridge',
            'After-hours smart refrigerated pickup lockers for late commuters',
        ],
        competitors: ['Yelp & FB Review Fix', 'Dual-Location'],
    },
    {
        emoji: '🔥',
        title: 'Strength Multiplier #1: Scale the Famous Italian Beef',
        impact: '20x ticket size via catering bars & retail jars',
        desc: 'Our Kevin Pang / America\'s Test Kitchen Italian Beef collaboration is a viral regional moat. We monetize it beyond single lunch sandwiches.',
        bullets: [
            'Bottle & retail our 3-Year-Aged House Giardiniera & Concentrated Jus',
            'Turnkey $275–$550 "Italian Beef Catering Bars" for events & game days',
            'Nationwide 8-pack frozen shipping boxes for Chicago expats',
        ],
        competitors: ['Core Strength Moat', 'High Margin'],
    },
    {
        emoji: '🌭',
        title: 'Strength Multiplier #2: Sausages, Freezer & QR Craft',
        impact: '+25–35% Average Order Value (AOV) lift',
        desc: 'Reviewers call our house sausages "best in show," love the Chicken Pot Pie & Smoked Lamb Curry, and praise Sean & Arielle\'s cooking advice by name.',
        bullets: [
            '"Sausage of the Month" Friday SMS drops to drive weekend foot traffic',
            '"Stock Your Freezer" 5-for-$95 entree/soup pass at steak checkout',
            'QR "Cook It Right" video tags on butcher paper + Monday "Butcher & Bourbon" classes',
        ],
        competitors: ['Core Strength Moat', 'Repeat Visits'],
    },
];

/* ────────────────────────────────────────────────────────────
   Client Showcase — sales-pitch presentation page
   Shows what's built + what can be added next
   ──────────────────────────────────────────────────────────── */

/* ── Current Platform Features ── */
const CURRENT_FEATURES = [
    {
        icon: '🛒',
        title: 'Full Online Ordering System',
        desc: 'Complete e-commerce flow with real-time inventory, product search, favorites, and a polished cart & checkout experience — all custom-built.',
        tag: 'Live',
    },
    {
        icon: '🏪',
        title: 'Dual-Location Support',
        desc: 'Seamless toggle between The Butcher Shop (Northfield) and The Depot (Winnetka) — separate menus, hours, and stock managed from one system.',
        tag: 'Live',
    },
    {
        icon: '🍖',
        title: 'BBQ Catering Builder',
        desc: 'Interactive catering package builder with a live availability calendar, guest count calculator, and instant estimate — inquiries flow straight to your inbox.',
        tag: 'Live',
    },
    {
        icon: '🥩',
        title: 'Interactive Cut Guide',
        desc: 'Visual beef, pork, and chicken diagrams that educate customers on cuts — reduces "what should I get?" calls and builds confidence in ordering.',
        tag: 'Live',
    },
    {
        icon: '📊',
        title: 'Real-Time Stock Status',
        desc: 'Every product shows live availability — In Stock, Low Stock, or Out of Stock with "Request Restock" alerts. No more selling what you don\'t have.',
        tag: 'Live',
    },
    {
        icon: '🎁',
        title: 'Digital Gift Cards',
        desc: 'Custom-branded Hofherr gift cards with email delivery, balance tracking, and redemption at checkout. Perfect for holidays and gifting.',
        tag: 'Live',
    },
    {
        icon: '📰',
        title: 'Weekly Specials System',
        desc: 'Managed through your CMS — update specials in Sanity and they\'re live on the site instantly. No developer needed for content changes.',
        tag: 'Live',
    },
    {
        icon: '❓',
        title: 'FAQ with Google Rich Results',
        desc: 'Structured FAQ sections with smooth accordion animations and Schema.org markup — your answers appear directly in Google search results.',
        tag: 'Live',
    },
    {
        icon: '🔍',
        title: 'SEO & Local Search',
        desc: 'Optimized metadata, JSON-LD structured data, Google Business integration, and local SEO targeting for Northfield and Winnetka searches.',
        tag: 'Live',
    },
    {
        icon: '👤',
        title: 'Customer Accounts',
        desc: 'Sign up, sign in, email verification, and password reset — full auth system for order history, favorites, and personalized experience.',
        tag: 'Live',
    },
    {
        icon: '📱',
        title: 'Fully Responsive Design',
        desc: 'Every page is optimized for mobile, tablet, and desktop — with touch-friendly navigation, horizontal category scrolling, and adaptive layouts.',
        tag: 'Live',
    },
    {
        icon: '⚡',
        title: 'Performance & Speed',
        desc: 'Built on Next.js with server-side rendering, image optimization, and lazy loading — lightning-fast page loads that Google rewards with higher rankings.',
        tag: 'Live',
    },
];

/* ── Page Previews ── */
const PAGE_PREVIEWS = [
    {
        name: 'Online Orders',
        route: '/online-orders',
        desc: 'Full product catalog with dual-location toggle',
        img: '/showcase/online-orders.png',
    },
    {
        name: 'BBQ Catering',
        route: '/catering',
        desc: 'Interactive package builder with live calendar',
        img: '/showcase/catering.png',
    },
    {
        name: 'Homepage',
        route: '/',
        desc: 'Brand landing with key CTAs and store status',
        img: '/showcase/homepage.png',
    },
    {
        name: 'Cut Guide',
        route: '/cut-guide',
        desc: 'Visual diagrams educating customers on cuts',
        img: '/showcase/cut-guide.png',
    },
];

/* ── Opportunities (new features to pitch) ── */
const OPPORTUNITIES = [
    {
        emoji: '📦',
        title: 'Curated Bundles & Meal Kits',
        impact: 'Boost avg order value by 25–40%',
        desc: 'Pre-built product bundles at slight discounts — "Weeknight Essentials," "Grillmaster Pack," "Game Day Bundle." Simplifies buying decisions and drives larger orders.',
        bullets: [
            'Curated by your butchers — seasonal rotations',
            'Gift-ready packaging for holidays',
            'Perfect "I don\'t know what to get" solution',
        ],
        competitors: ['Snake River Farms', 'Porter Road', 'ButcherBox'],
    },
    {
        emoji: '📖',
        title: 'Recipe & Cooking Guide Hub',
        impact: 'Drive organic SEO traffic',
        desc: 'Searchable recipe database organized by cut — each recipe links directly to the product for one-click ordering. Turns Google searches into customers.',
        bullets: [
            '"How to cook brisket" → lands on your site → orders brisket',
            'Filter by cut, method (grill, smoke, oven)',
            '"Shop this cut" CTA on every recipe page',
        ],
        competitors: ['Porter Road', 'Crowd Cow', 'Pat LaFrieda'],
    },
    {
        emoji: '🦃',
        title: 'Holiday Pre-Order System',
        impact: 'Capture #1 revenue event of the year',
        desc: 'Dedicated seasonal portals for Thanksgiving, Christmas, and Easter. Countdown timers create urgency, pickup scheduling prevents bottlenecks, and size calculators reduce anxiety.',
        bullets: [
            'Countdown: "Order by Nov 20 for Thanksgiving pickup"',
            '"How many lbs for 12 guests?" calculator',
            'Pickup window scheduling by day & time slot',
        ],
        competitors: ['Paulina Meat Market', 'Pat LaFrieda'],
    },
    {
        emoji: '👑',
        title: 'Loyalty & Rewards Program',
        impact: 'Increase repeat visits by 20–30%',
        desc: 'Points-based loyalty system with tiers — earn on every purchase, redeem for discounts or free items. Turns one-time buyers into regulars.',
        bullets: [
            'Tiers: Regular → Preferred → VIP',
            'Birthday rewards & exclusive early access',
            'Referral bonuses: "Give $10, Get $10"',
        ],
        competitors: ['Snake River Farms', 'Stampme'],
    },
    {
        emoji: '⭐',
        title: 'Customer Reviews & Ratings',
        impact: '93% read reviews before buying',
        desc: 'Star ratings and written reviews on every product — with "Verified Purchase" badges. Builds trust, improves SEO, and creates community-driven social proof.',
        bullets: [
            'Photo reviews from real customers',
            'Automated post-purchase review request emails',
            'Google rich results with aggregate star ratings',
        ],
        competitors: ['Snake River Farms', 'Crowd Cow'],
    },
    {
        emoji: '🔄',
        title: 'Monthly Subscription Boxes',
        impact: 'Recurring revenue on autopilot',
        desc: '"The Hofherr Box" — a curated monthly delivery of premium cuts. Customers choose a plan, customize, and pause anytime. Predictable income with built-in loyalty.',
        bullets: [
            '"Steak Lovers" / "Family Pack" / "Custom" tiers',
            'Skip, swap, or pause — zero friction',
            'Subscriber-only pricing (5–10% off)',
        ],
        competitors: ['ButcherBox', 'Porter Road', 'Crowd Cow'],
    },
];

export default function ShowcaseClient() {
    return (
        <main className={styles.page}>

            {/* ════════════════════════════════════════════
                HERO
               ════════════════════════════════════════════ */}
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot} />
                        Platform Overview
                    </div>
                    <h1 className={styles.heroTitle}>
                        Your Digital<br />
                        <span className={styles.heroTitleAccent}>Butcher Shop</span>
                    </h1>
                    <p className={styles.heroSub}>
                        A complete, custom-built platform that brings the Hofherr experience
                        online — from ordering and catering to education and engagement.
                    </p>
                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>12+</div>
                            <div className={styles.heroStatLabel}>Live Features</div>
                        </div>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>2</div>
                            <div className={styles.heroStatLabel}>Locations</div>
                        </div>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>100%</div>
                            <div className={styles.heroStatLabel}>Custom Built</div>
                        </div>
                    </div>
                </div>
                <div className={styles.heroScroll}>
                    Scroll to explore
                    <div className={styles.heroScrollLine} />
                </div>
            </section>

            {/* ════════════════════════════════════════════
                WHAT'S BUILT — Current Features
               ════════════════════════════════════════════ */}
            <div className={styles.divider}><div className={styles.dividerLine} /></div>

            <section className={`${styles.sectionWrap} ${styles.sectionWrapAlt}`}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionEyebrow}>
                        What&apos;s Built
                        <span className={styles.sectionEyebrowLine} />
                    </div>
                    <h2 className={styles.sectionTitle}>Your Platform Today</h2>
                    <p className={styles.sectionSub}>
                        Every feature below is live on hofherrmeatco.com right now — fully
                        functional, mobile-optimized, and managed through your CMS.
                    </p>

                    <div className={styles.showcaseGrid}>
                        {CURRENT_FEATURES.map(f => (
                            <div key={f.title} className={styles.showcaseCard}>
                                <div className={styles.showcaseIcon}>{f.icon}</div>
                                <h3 className={styles.showcaseCardTitle}>{f.title}</h3>
                                <p className={styles.showcaseCardDesc}>{f.desc}</p>
                                <span className={`${styles.showcaseTag} ${styles.showcaseTagLive}`}>
                                    ● {f.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                LIVE PREVIEWS — Screenshots
               ════════════════════════════════════════════ */}
            <div className={styles.divider}><div className={styles.dividerLine} /></div>

            <section className={styles.sectionWrap}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionEyebrow}>
                        Live Preview
                        <span className={styles.sectionEyebrowLine} />
                    </div>
                    <h2 className={styles.sectionTitle}>See It in Action</h2>
                    <p className={styles.sectionSub}>
                        Real screenshots from the live platform — every page built from scratch
                        with Hofherr&apos;s brand identity at the core.
                    </p>

                    <div className={styles.previewGrid}>
                        {PAGE_PREVIEWS.map(p => (
                            <div key={p.name} className={styles.previewCard}>
                                <div className={styles.previewBar}>
                                    <span className={`${styles.previewDot} ${styles.previewDotR}`} />
                                    <span className={`${styles.previewDot} ${styles.previewDotY}`} />
                                    <span className={`${styles.previewDot} ${styles.previewDotG}`} />
                                    <span className={styles.previewUrl}>hofherrmeatco.com{p.route}</span>
                                </div>
                                <Image
                                    src={p.img}
                                    alt={p.name}
                                    width={960}
                                    height={540}
                                    className={styles.previewImg}
                                    quality={90}
                                />
                                <div className={styles.previewLabel}>
                                    <div>
                                        <div className={styles.previewName}>{p.name}</div>
                                        <div className={styles.previewDesc}>{p.desc}</div>
                                    </div>
                                    <span className={`${styles.showcaseTag} ${styles.showcaseTagLive}`}>
                                        ● Live
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                OPPORTUNITIES — New Features to Add
               ════════════════════════════════════════════ */}
            <div className={styles.divider}><div className={styles.dividerLine} /></div>

            <section className={`${styles.sectionWrap} ${styles.sectionWrapAlt}`}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionEyebrow}>
                        Growth Opportunities
                        <span className={styles.sectionEyebrowLine} />
                    </div>
                    <h2 className={styles.sectionTitle}>What&apos;s Next</h2>
                    <p className={styles.sectionSub}>
                        Features used by top butcher shops nationwide — from Porter Road to
                        Snake River Farms — that would take Hofherr to the next level.
                    </p>

                    <div className={styles.oppGrid}>
                        {OPPORTUNITIES.map(opp => (
                            <div key={opp.title} className={styles.oppCard}>
                                <span className={styles.oppNewBadge}>Proposed</span>
                                <div className={styles.oppHeader}>
                                    <div className={styles.oppEmoji}>{opp.emoji}</div>
                                    <div>
                                        <h3 className={styles.oppTitle}>{opp.title}</h3>
                                        <div className={styles.oppImpact}>▲ {opp.impact}</div>
                                    </div>
                                </div>
                                <p className={styles.oppDesc}>{opp.desc}</p>
                                <ul className={styles.oppBullets}>
                                    {
                                            opp.bullets.map((b) => (
                                                <li key={b}>{b}</li>
                                            ))
                                        }
                                </ul>
                                <div className={styles.compContext}>
                                    <span className={styles.compContextLabel}>Used by</span>
                                    {opp.competitors.map(c => (
                                        <span key={c} className={styles.compContextTag}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                REVIEW AUDIT & PITCH DECK
               ════════════════════════════════════════════ */}
            <div className={styles.divider}><div className={styles.dividerLine} /></div>

            <section className={styles.sectionWrap}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionEyebrow}>
                        Yelp &amp; Facebook Review Audit
                        <span className={styles.sectionEyebrowLine} />
                    </div>
                    <h2 className={styles.sectionTitle}>Fixing Every Pain Point &amp; Scaling Our Strengths</h2>
                    <p className={styles.sectionSub}>
                        Hofherr holds a ~4.8★ reputation with zero culinary complaints. Every friction point in
                        customer reviews is operational—and each one maps directly to a high-ROI fix.
                    </p>

                    <div className={styles.oppGrid}>
                        {REVIEW_FIXES.map(item => (
                            <div key={item.title} className={styles.oppCard}>
                                <span className={styles.oppNewBadge}>Pitch Deck</span>
                                <div className={styles.oppHeader}>
                                    <div className={styles.oppEmoji}>{item.emoji}</div>
                                    <div>
                                        <h3 className={styles.oppTitle}>{item.title}</h3>
                                        <div className={styles.oppImpact}>▲ {item.impact}</div>
                                    </div>
                                </div>
                                <p className={styles.oppDesc}>{item.desc}</p>
                                <ul className={styles.oppBullets}>
                                    {item.bullets.map(b => (
                                        <li key={b}>{b}</li>
                                    ))}
                                </ul>
                                <div className={styles.compContext}>
                                    <span className={styles.compContextLabel}>Focus Area</span>
                                    {item.competitors.map(c => (
                                        <span key={c} className={styles.compContextTag}>{c}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                CTA
               ════════════════════════════════════════════ */}
            <div className={styles.divider}><div className={styles.dividerLine} /></div>

            <section className={styles.cta}>
                <div className={styles.ctaGlow} />
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>
                        Ready to Build<br />
                        <span className={styles.heroTitleAccent}>What&apos;s Next?</span>
                    </h2>
                    <p className={styles.ctaSub}>
                        Every feature above has been researched against the best butcher shops
                        in the country and is ready for implementation. Open the interactive
                        slide deck or let&apos;s talk about priorities and timeline.
                    </p>
                    <Link href="/pitch-deck" className={styles.ctaBtn}>
                        Open Interactive Pitch Deck →
                    </Link>
                </div>
            </section>

        </main>
    );
}
