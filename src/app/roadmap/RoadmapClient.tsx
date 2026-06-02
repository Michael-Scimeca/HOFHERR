'use client';

import { useState } from 'react';
import styles from './page.module.css';

/* ────────────────────────────────────────────────────────────
   Feature Roadmap — internal dev-only planning dashboard
   ──────────────────────────────────────────────────────────── */

type Feature = {
    id: string;
    emoji: string;
    title: string;
    tagline: string;
    impact: string;
    effort: string;
    revenue: string;
    phase: number;
    usedBy: string[];
    why: string;
    examples: string[];
    techNotes: string[];
    route?: string;
};

const FEATURES: Feature[] = [
    /* ── Phase 1: Quick Wins ── */
    {
        id: 'butchers-pick',
        emoji: '🔪',
        title: "Butcher's Pick of the Week",
        tagline: 'Weekly staff recommendation to guide shoppers & move underperforming cuts',
        impact: '★★★★',
        effort: 'Very Low',
        revenue: 'Direct',
        phase: 1,
        usedBy: ['Porter Road', 'Crowd Cow', 'Carnivore Oak Park'],
        why: 'Adds personality and a human touch to the shop. Guides indecisive shoppers toward a specific cut with a personal story. Rotates weekly to keep content fresh and gives staff a voice on the website.',
        examples: [
            '"Sean\'s Pick" — featured item with staff photo + quote',
            'Badge/tag on the product card in ordering list',
            'Homepage hero callout linking to the featured item',
            'Sanity CMS field: pick of the week (product ref + staff name + quote)',
        ],
        techNotes: [
            '/api/butchers-pick — fetch current pick from Sanity',
            'Badge component on OnlineOrdersClient product cards',
            'Homepage section: ButchersPick.tsx',
            'Sanity schema: butchersPick (ref → product, staffName, quote, photo)',
        ],
        route: '/online-orders',
    },
    {
        id: 'portion-calc',
        emoji: '⚖️',
        title: 'Serving Size Calculator',
        tagline: '"Feeding 8? You need ~4 lbs of brisket" — reduce ordering anxiety',
        impact: '★★★',
        effort: 'Low',
        revenue: 'Indirect',
        phase: 1,
        usedBy: ['Pat LaFrieda', 'Snake River Farms'],
        why: 'Customers often don\'t know how much to order, especially for roasts, brisket, and catering. This eliminates the guesswork and prevents over/under-ordering — improving satisfaction and reducing food waste.',
        examples: [
            'Widget on product pages for roasts/large cuts',
            'Integrated into catering builder (auto-suggest weight by guest count)',
            'Dropdown: "How many guests?" → shows recommended lbs',
            'Per-cut multipliers: brisket = 0.5 lb/person, ribs = 0.75 lb/person',
        ],
        techNotes: [
            'Standalone component: PortionCalculator.tsx',
            'Data: portion multiplier per product category',
            'Embed in catering page guest count section',
            'Optional: add to individual product detail modals',
        ],
        route: '/catering',
    },
    {
        id: 'seasonal-pages',
        emoji: '🎄',
        title: 'Seasonal Landing Pages',
        tagline: 'Dedicated pages for Thanksgiving, Christmas, Super Bowl, July 4th, etc.',
        impact: '★★★★',
        effort: 'Low',
        revenue: 'Direct',
        phase: 1,
        usedBy: ['Paulina Meat Market', 'Pat LaFrieda', 'All premium butchers'],
        why: 'Holiday orders are the #1 revenue spike for butcher shops. A dedicated landing page with countdown timers, pre-order deadlines, and curated seasonal items creates urgency and streamlines the holiday rush.',
        examples: [
            '/thanksgiving — turkeys, sides, deadline countdown',
            '/christmas — prime rib roasts, ham, gift bundles',
            '/super-bowl — wings, ribs, brisket, game day packs',
            'Reusable template: hero + countdown + product grid + CTA',
        ],
        techNotes: [
            'Reusable SeasonalPage template component',
            'Sanity schema: seasonalPage (hero, deadline, products[], cta)',
            'Countdown timer component (client-side)',
            'Route: /seasonal/[slug] or dedicated /thanksgiving etc.',
        ],
    },
    {
        id: 'sms-notify',
        emoji: '📱',
        title: 'SMS Order Notifications',
        tagline: 'Text customers when their pickup order is ready',
        impact: '★★★',
        effort: 'Low',
        revenue: 'Indirect',
        phase: 1,
        usedBy: ['Various local shops', 'Toast POS', 'Square'],
        why: 'Reduces "is my order ready?" phone calls. Improves customer experience with real-time updates. Open rates for SMS are 98% vs 20% for email — ensuring customers actually see the notification.',
        examples: [
            '"Your Hofherr order is ready for pickup! 🥩"',
            'Order confirmed → preparing → ready for pickup',
            'Admin dashboard button: "Mark Ready" → sends SMS',
            'Optional: include pickup window and location',
        ],
        techNotes: [
            'Twilio or AWS SNS for SMS delivery',
            'Admin dashboard: order status toggle → triggers SMS',
            'Phone number collected at checkout (already captured)',
            'Rate limit: max 3 SMS per order',
        ],
    },

    /* ── Phase 2: Revenue Drivers ── */
    {
        id: 'bundles',
        emoji: '📦',
        title: 'Curated Bundles & Meal Kits',
        tagline: 'Pre-built product packs at a slight discount — boost AOV by 25-40%',
        impact: '★★★★★',
        effort: 'Medium',
        revenue: 'Direct',
        phase: 2,
        usedBy: ['Snake River Farms', 'Porter Road', 'ButcherBox', 'Pat LaFrieda'],
        why: 'Bundles increase average order value significantly by simplifying the decision process. Customers who are overwhelmed by choice default to curated packs. They\'re also perfect for gifting and seasonal promotions.',
        examples: [
            '🥩 "Weeknight Essentials" — 2 lbs ground, 4 chicken breasts, 1 lb sausage',
            '🔥 "Grillmaster Pack" — NY strip, ribeye, brats, burger patties',
            '🏈 "Game Day Bundle" — ribs, wings, pulled pork, brisket',
            '🎁 "Gift Box" — premium selection in branded packaging',
            '🎄 "Holiday Centerpiece" — prime rib roast + au jus + horseradish',
        ],
        techNotes: [
            'Sanity schema: bundle (name, products[], price, savings, photo)',
            'New category in OnlineOrdersClient: "Bundles & Kits"',
            'Bundle product card variant showing savings badge',
            'Cart logic: add all bundle items as a group',
            'Admin: bundle builder in Sanity Studio',
        ],
        route: '/online-orders',
    },
    {
        id: 'holiday-preorder',
        emoji: '🦃',
        title: 'Holiday Pre-Order System',
        tagline: 'Seasonal ordering portal with deadlines, size calculator, and pickup scheduling',
        impact: '★★★★★',
        effort: 'Medium',
        revenue: 'Direct',
        phase: 2,
        usedBy: ['Paulina Meat Market', 'Pat LaFrieda', 'Virtually all premium butchers'],
        why: 'Holiday orders are the #1 revenue event for butcher shops. Pre-orders help with inventory planning, reduce waste, and ensure customers get exactly what they need. The countdown creates urgency.',
        examples: [
            'Dedicated /holiday landing page per season',
            'Order-by deadline with countdown timer',
            'Size calculator: "How many lbs for X guests?"',
            'Pickup window scheduling (date + time slot)',
            'Deposit payment option for large orders',
        ],
        techNotes: [
            'Route: /holiday/[slug] (thanksgiving, christmas, easter)',
            'Sanity: holidayEvent (deadline, products, hero, pickupSlots[])',
            'Countdown component with auto-disable past deadline',
            'Pickup slot availability (prevent overbooking)',
            'Email confirmation with pickup details',
        ],
    },
    {
        id: 'recipes',
        emoji: '📖',
        title: 'Recipe & Cooking Guide Hub',
        tagline: 'Blog-style recipe section organized by cut — massive SEO win + cross-sell',
        impact: '★★★★★',
        effort: 'Medium',
        revenue: 'Indirect',
        phase: 2,
        usedBy: ['Porter Road', 'Crowd Cow', 'Pat LaFrieda', "Gene's Sausage"],
        why: 'Drives organic SEO traffic from people searching "how to cook brisket." Reduces customer intimidation with unfamiliar cuts. Cross-sells products directly from recipe pages. Establishes Hofherr as the local meat authority.',
        examples: [
            'Recipe cards with photo, difficulty, cook time, servings',
            'Filter by cut type (beef, pork, chicken)',
            'Filter by method (grill, smoke, oven, slow cook)',
            '"Shop this cut" CTA button on every recipe',
            'Video embeds for technique tutorials',
        ],
        techNotes: [
            'Route: /recipes and /recipes/[slug]',
            'Sanity schema: recipe (title, cut, difficulty, time, steps[], photo, relatedProducts[])',
            'RecipeCard component with structured data (Google rich results)',
            'Cross-link: product page → related recipes',
            'Cross-link: recipe → "Order this cut" button',
        ],
        route: '/recipes',
    },

    /* ── Phase 3: Retention ── */
    {
        id: 'reviews',
        emoji: '⭐',
        title: 'Product Reviews & Ratings',
        tagline: 'Social proof on individual products — 93% of consumers read reviews before buying',
        impact: '★★★★',
        effort: 'Medium',
        revenue: 'Indirect',
        phase: 3,
        usedBy: ['Snake River Farms', 'Crowd Cow', 'Pat LaFrieda'],
        why: 'Social proof is the #1 conversion driver for online purchases. User-generated reviews build trust, improve SEO, and create a community feel. Verified purchase badges add credibility.',
        examples: [
            'Star ratings (1-5) on product cards',
            'Written reviews with optional photo uploads',
            '"Verified Purchase" badge',
            'Cooking tips from real customers',
            'Sort by: most helpful, newest, highest rated',
        ],
        techNotes: [
            'Supabase table: reviews (productId, userId, rating, text, photo, verified)',
            'Review submission form (post-purchase email trigger)',
            'Aggregate rating displayed on product cards',
            'Moderation: admin approval before display',
            'Schema.org Review structured data for Google stars',
        ],
    },
    {
        id: 'loyalty',
        emoji: '👑',
        title: 'Loyalty & Rewards Program',
        tagline: 'Points-based system with tiers — increase repeat visits by 20-30%',
        impact: '★★★★',
        effort: 'High',
        revenue: 'Long-term',
        phase: 3,
        usedBy: ['Snake River Farms (Club SRF)', 'Stampme', 'Various local shops'],
        why: 'A loyalty program transforms one-time shoppers into regulars. Creates a competitive moat vs. grocery stores. Customer lifetime value increases significantly with even basic tier systems.',
        examples: [
            'Earn 1 point per $1 spent',
            'Tiers: Regular → Preferred (500 pts) → VIP (2000 pts)',
            'Rewards: $5 off, free sausage, early access to specials',
            'Birthday rewards (free item or discount)',
            'Referral bonuses: "Give $10, Get $10"',
        ],
        techNotes: [
            'Supabase tables: loyalty_points, loyalty_tiers, rewards',
            'Points calculation in checkout flow',
            'Dashboard: /dashboard/rewards showing points balance + tier',
            'Admin: manage tiers, rewards catalog, manual point adjustments',
            'Email: monthly points summary + "you\'re X points from next tier"',
        ],
        route: '/dashboard',
    },
    {
        id: 'referral',
        emoji: '🤝',
        title: 'Referral Program',
        tagline: '"Give $10, Get $10" — turn happy customers into brand ambassadors',
        impact: '★★★',
        effort: 'Medium',
        revenue: 'Direct',
        phase: 3,
        usedBy: ['Snake River Farms', 'ButcherBox', 'Crowd Cow'],
        why: 'Word-of-mouth is the most trusted form of advertising. A referral program formalizes this by giving existing customers a reason to share. The dual incentive (give + get) ensures both parties benefit.',
        examples: [
            'Unique referral code per customer',
            'Share via text, email, or social media',
            'Referrer gets $10 credit when friend orders',
            'Friend gets $10 off their first order',
            'Track referrals in customer dashboard',
        ],
        techNotes: [
            'Supabase: referral_codes (userId, code, uses, credits_earned)',
            'Apply at checkout: validate code → apply discount',
            'Credit referrer after friend\'s order completes',
            'Dashboard: /dashboard/referrals showing code + stats',
            'Fraud prevention: 1 referral per email, min order $25',
        ],
    },

    /* ── Phase 4: Scale ── */
    {
        id: 'subscriptions',
        emoji: '🔄',
        title: 'Subscription Boxes',
        tagline: 'Monthly recurring meat delivery — "The Hofherr Box"',
        impact: '★★★★',
        effort: 'High',
        revenue: 'Recurring',
        phase: 4,
        usedBy: ['ButcherBox', 'Porter Road', 'Snake River Farms', 'Crowd Cow'],
        why: 'Predictable recurring revenue is the holy grail. Subscriptions reduce customer acquisition costs, lock in loyalty, and provide steady cash flow. Customization options prevent "freezer fatigue."',
        examples: [
            '"The Hofherr Box" — curated monthly selection ($99/mo)',
            '"Steak Lovers" — premium cuts ($149/mo)',
            '"Family Pack" — everyday essentials ($79/mo)',
            'Customize: swap items, skip months, pause anytime',
            'Subscriber-only pricing (5-10% discount)',
        ],
        techNotes: [
            'Stripe Subscriptions for recurring billing',
            'Supabase: subscriptions (plan, frequency, customizations)',
            'Route: /subscribe — plan selection + signup flow',
            'Dashboard: /dashboard/subscription — manage plan',
            'Admin: view active subs, prepare monthly shipments',
            'Cron job: generate monthly orders from active subscriptions',
        ],
        route: '/subscribe',
    },
    {
        id: 'corporate',
        emoji: '🏢',
        title: 'Corporate & Office Ordering',
        tagline: 'B2B bulk ordering portal for restaurants, offices, and event planners',
        impact: '★★★',
        effort: 'High',
        revenue: 'Direct',
        phase: 4,
        usedBy: ['Pat LaFrieda', 'Gene\'s Sausage', 'Paulina Meat Market'],
        why: 'Corporate accounts provide large, consistent orders. Restaurants, offices, and event planners need a streamlined way to place bulk orders with net terms and invoicing.',
        examples: [
            'Dedicated B2B portal: /wholesale',
            'Bulk pricing tiers (10+ lbs, 25+ lbs, 50+ lbs)',
            'Net 30 payment terms for approved accounts',
            'Weekly standing orders (auto-repeat)',
            'Dedicated account manager contact',
        ],
        techNotes: [
            'Route: /wholesale — separate ordering flow',
            'Supabase: corporate_accounts (company, contact, terms, tier)',
            'Pricing engine: volume discount calculator',
            'Invoice generation (PDF) for net terms',
            'Admin: approve accounts, manage standing orders',
        ],
        route: '/wholesale',
    },
];

const STRENGTHS = [
    { emoji: '🏪', title: 'Dual-Location Ordering', desc: 'Butcher Shop + Depot toggle — no competitor has this' },
    { emoji: '📊', title: 'Live Stock Status', desc: 'Real-time in/out/low badges with restock requests' },
    { emoji: '📅', title: 'Interactive Catering Calendar', desc: 'Live availability calendar — most shops use static forms' },
    { emoji: '🥩', title: 'Visual Cut Guide', desc: 'Animal diagrams with cut details — only Porter Road comes close' },
    { emoji: '🟢', title: 'Real-Time Store Status', desc: 'Open/closed indicator in the navbar' },
    { emoji: '❤️', title: 'Favorites System', desc: 'Save products for quick reordering — uncommon for local shops' },
];

const COMPETITORS = [
    { name: 'Porter Road', type: 'National DTC', strength: 'Expert cut guidance, dry-aging info, subscription boxes' },
    { name: 'Snake River Farms', type: 'Premium Wagyu', strength: 'Loyalty rewards, proprietary grading, curated bundles' },
    { name: 'Crowd Cow', type: 'Marketplace', strength: 'Farm transparency, "shop by farm," sustainability' },
    { name: 'Pat LaFrieda', type: 'Premium DTC', strength: 'Signature blends, restaurant-quality branding' },
    { name: 'Flannery Beef', type: 'Boutique DTC', strength: 'Dry-aging expertise, curated selection, family story' },
    { name: 'Paulina Meat Market', type: 'Chicago Local', strength: 'Custom cutting, specialty groceries, 75-year heritage' },
    { name: "Gene's Sausage", type: 'Chicago Local', strength: '40+ sausage varieties, European deli, rooftop dining' },
    { name: 'Carnivore Oak Park', type: 'Chicago Local', strength: 'Farm-to-table sourcing, prepared lunch menu' },
];

const PHASES = [
    { label: 'All Features', num: 0 },
    { label: 'Quick Wins', num: 1 },
    { label: 'Revenue Drivers', num: 2 },
    { label: 'Retention', num: 3 },
    { label: 'Scale', num: 4 },
];

export default function RoadmapClient() {
    const [activePhase, setActivePhase] = useState(0);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filtered = activePhase === 0 ? FEATURES : FEATURES.filter(f => f.phase === activePhase);

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* ── Header ── */}
                <header className={styles.header}>
                    <p className={styles.eyebrow}>
                        <span className={styles.eyebrowDot} />
                        Internal — Dev Only
                    </p>
                    <h1 className={styles.title}>Feature Roadmap</h1>
                    <p className={styles.subtitle}>
                        Competitive analysis of top butcher shop websites and a prioritized feature roadmap
                        for Hofherr Meat Co. Based on research from Porter Road, Snake River Farms,
                        Crowd Cow, Pat LaFrieda, and Chicago-area competitors.
                    </p>
                </header>

                {/* ── Competitors ── */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNum}>01</span>
                        <h2 className={styles.sectionTitle}>Competitors Analyzed</h2>
                    </div>
                    <p className={styles.sectionSub}>
                        National DTC brands, premium boutiques, and Chicago-area local shops studied for feature benchmarking.
                    </p>
                    <table className={styles.compTable}>
                        <thead>
                            <tr>
                                <th>Shop</th>
                                <th>Type</th>
                                <th>Key Strength</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPETITORS.map(c => (
                                <tr key={c.name}>
                                    <td><strong>{c.name}</strong></td>
                                    <td><span className={styles.compType}>{c.type}</span></td>
                                    <td>{c.strength}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* ── Hofherr Strengths ── */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNum}>02</span>
                        <h2 className={styles.sectionTitle}>Current Advantages</h2>
                    </div>
                    <p className={styles.sectionSub}>
                        Features Hofherr already has that competitors don&apos;t. Lean into these.
                    </p>
                    <div className={styles.strengthGrid}>
                        {STRENGTHS.map(s => (
                            <div key={s.title} className={styles.strengthCard}>
                                <span className={styles.strengthEmoji}>{s.emoji}</span>
                                <div>
                                    <p className={styles.strengthTitle}>{s.title}</p>
                                    <p className={styles.strengthDesc}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Feature Roadmap ── */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNum}>03</span>
                        <h2 className={styles.sectionTitle}>Feature Roadmap</h2>
                    </div>
                    <p className={styles.sectionSub}>
                        Prioritized by impact vs. effort. Click any feature to expand full details including
                        technical implementation notes.
                    </p>

                    {/* Phase filter */}
                    <nav className={styles.phaseNav}>
                        {PHASES.map(p => (
                            <button
                                key={p.num}
                                className={`${styles.phaseBtn} ${activePhase === p.num ? styles.phaseBtnActive : ''}`}
                                onClick={() => setActivePhase(p.num)}
                            >
                                {p.label}
                                <span className={styles.phaseCount}>
                                    {p.num === 0 ? FEATURES.length : FEATURES.filter(f => f.phase === p.num).length}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* Feature cards */}
                    {filtered.map(feature => {
                        const isExpanded = expandedIds.has(feature.id);
                        return (
                            <div key={feature.id} className={styles.featureCard}>
                                <div
                                    className={styles.featureTop}
                                    onClick={() => toggleExpand(feature.id)}
                                    style={{ cursor: 'pointer' }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && toggleExpand(feature.id)}
                                >
                                    <div className={styles.featureLeft}>
                                        <div className={styles.featureEmoji}>{feature.emoji}</div>
                                        <div>
                                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                                            <p className={styles.featureTagline}>{feature.tagline}</p>
                                        </div>
                                    </div>
                                    <div className={styles.featureRight}>
                                        <span className={`${styles.badge} ${styles.badgeImpact}`}>
                                            Impact {feature.impact}
                                        </span>
                                        <span className={`${styles.badge} ${styles.badgeEffort}`}>
                                            {feature.effort}
                                        </span>
                                        <span className={`${styles.badge} ${styles.badgeRevenue}`}>
                                            {feature.revenue}
                                        </span>
                                        <svg
                                            width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            style={{
                                                color: 'var(--fg-muted)',
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.25s ease',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className={styles.featureBody}>
                                        <div className={styles.detailGrid}>
                                            <div className={styles.detailBlock}>
                                                <h4>Why Build This</h4>
                                                <p>{feature.why}</p>
                                            </div>
                                            <div className={styles.detailBlock}>
                                                <h4>Examples & Ideas</h4>
                                                <ul>
                                                    {feature.examples.map((ex, i) => (
                                                        <li key={i}>{ex}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className={styles.detailBlock}>
                                            <h4>Used By</h4>
                                            <div className={styles.usedBy}>
                                                {feature.usedBy.map(name => (
                                                    <span key={name} className={styles.usedByTag}>{name}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.techSpec}>
                                            <h4>🛠 Technical Implementation</h4>
                                            {feature.techNotes.map((note, i) => (
                                                <code key={i}>{note}</code>
                                            ))}
                                            {feature.route && (
                                                <p style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
                                                    Target route: <code>{feature.route}</code>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

            </div>
        </main>
    );
}
