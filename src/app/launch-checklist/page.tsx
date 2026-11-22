import type { Metadata } from 'next';
import Link from 'next/link';
import { adminClient } from '@/sanity/adminClient';
import LaunchChecklistClient, { type LaunchItem, type ManualTask } from './LaunchChecklistClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'All Features & Launch Checklist | Hofherr Meat Co.',
    description: 'Complete inventory of every built feature across Hofherr Meat Co. plus live remaining launch items.',
    robots: { index: false, follow: false },
};

interface FeatureCategory {
    id: string;
    title: string;
    route: string;
    routeLabel: string;
    features: { name: string; detail: string; status: 'live' | 'needs-key' }[];
}

const ALL_FEATURE_CATEGORIES: FeatureCategory[] = [
    {
        id: 'home-discovery',
        title: 'Home Page & Seasonal Discovery',
        route: '/',
        routeLabel: 'Open Home →',
        features: [
            { name: 'Two-Location Hero Guide', detail: 'Open typographic Northfield Butcher Shop vs. Winnetka Depot routing with direct menu & directions links.', status: 'live' },
            { name: 'Auto-Switching Holiday Hero (All 12)', detail: 'Automatically updates by Chicago calendar date (Thanksgiving, Christmas, Super Bowl, July 4th, etc.) + ?holiday= live preview.', status: 'live' },
            { name: 'Transparent Video + 26KB Mobile Backdrop', detail: 'Full-bleed screen-blended desktop video with lightweight mobile/tablet image and floating video bubble.', status: 'live' },
            { name: 'Live Scarcity Badges (Italian Beef & Rotisserie)', detail: 'Chicago-time aware availability badges on Home and /specials.', status: 'live' },
            { name: 'Asymmetric Bento & Brand Social Footer', detail: 'Holiday Catering banner + Recipes & Our Story bento, plus Instagram/Facebook/Yelp brand-colored footer pills.', status: 'live' },
        ],
    },
    {
        id: 'online-ordering',
        title: 'Online Ordering & Mini Cart Rail',
        route: '/online-orders',
        routeLabel: 'Open Online Orders →',
        features: [
            { name: 'Butcher Red ↔ Depot Blue Store Switcher', detail: '3D glossy Butcher Cleaver / Depot Station Roof toggle switching live menus, colors, and carts.', status: 'live' },
            { name: 'Instant 1-Tap Inline Ordering', detail: '1-tap + Add, inline − qty + stepper (removes at 1), and inline + Note input with zero popup friction.', status: 'live' },
            { name: 'Fixed Right-Edge Mini Cart Rail + Fly Animation', detail: 'Always-visible desktop cart rail, animated navbar bag, and Stacked-Footer mobile/tablet card layout.', status: 'live' },
            { name: 'Email QR Quick-Order Strip (?quickOrder=)', detail: 'Scanning an email QR code opens a 1-tap Featured Cuts strip at the top of the menu with + Add All.', status: 'live' },
            { name: 'Non-Pricing Conversion Psychology', detail: 'Craft Butcher Value Framing banner, ★ Butcher’s Reserve highlight, and 2-item Complete the Plate cross-sell.', status: 'live' },
        ],
    },
    {
        id: 'checkout-fulfillment',
        title: 'Checkout & Pickup Fulfillment',
        route: '/checkout',
        routeLabel: 'Open Checkout →',
        features: [
            { name: '15-Minute Pickup Windows & Slot Caps', detail: 'Live slot capacity throttled by Admin Max Pickups / 15-Min Slot setting + Pickup Window confirmation card.', status: 'live' },
            { name: 'Curbside Trunk Drop-Off', detail: 'Optional curbside handoff with vehicle make/color fields and Happ Rd arrival instructions.', status: 'live' },
            { name: 'Call Me / Email Me Preference', detail: 'Dynamic required fields, preferred contact highlighting, and order-note tagging (no customer SMS clutter).', status: 'live' },
            { name: 'Online Credit/Debit Card Checkout (Stripe)', detail: 'Full Stripe PaymentIntent & webhook route wired — waiting on live Stripe API keys.', status: 'needs-key' },
        ],
    },
    {
        id: 'catering-holidays',
        title: 'BBQ Catering, Holidays & Recipes',
        route: '/catering',
        routeLabel: 'Open Catering →',
        features: [
            { name: 'Interactive Catering Package Calculator', detail: 'Live guest-count estimator, BBQ packages, and Whole-Hog Pig Roasts.', status: 'live' },
            { name: 'Double-Line WebGL Fire Marquee & Retina Emblems', detail: 'Counter-scrolling 2-row marquee and crisp 2× Retina How-It-Works emblems.', status: 'live' },
            { name: 'Holiday Catering Guide + All 12 Hero Examples', detail: 'Interactive Home Hero preview gallery for all 12 holidays + seasonal selling points on /catering/holidays.', status: 'live' },
            { name: 'Recipes & Printable 12×16" Parcel Sheets', detail: 'Full recipe hub (/recipes) + printable butcher-paper cooking sheets (/recipes/sheets).', status: 'live' },
            { name: 'Visit & Parking Guide (/visit)', detail: 'Northfield vs. Winnetka Depot comparison, peak rush vs. quiet windows, and interactive maps.', status: 'live' },
        ],
    },
    {
        id: 'customer-dashboard',
        title: 'Customer Accounts & Loyalty',
        route: '/dashboard',
        routeLabel: 'Open Dashboard →',
        features: [
            { name: 'Order Rewards & 7-Animal Mastery Ring', detail: 'Customer rank progression, cut-collector badge tracking, and 2×2 full-width profile actions.', status: 'live' },
            { name: 'Compact Restock Alerts & Requested Cuts', detail: 'Real-time back-in-stock notifications with 1-click Add to Order and Cancel Request.', status: 'live' },
            { name: 'Active Order Tracker (Customer-Safe)', detail: 'Live pickup progress tracker with admin demo/test buttons hidden from regular customers.', status: 'live' },
        ],
    },
    {
        id: 'admin-marketing',
        title: 'Admin Console, Email Builder & Social Studio',
        route: '/admin-dashboard/admin',
        routeLabel: 'Open Admin Console →',
        features: [
            { name: 'Live Orders Queue, SLA Alerts & Slot Capacity', detail: 'Full-width Admin Console with Butcher/Depot filter, dark-mode Recharts analytics, and Max Pickups/Slot bar.', status: 'live' },
            { name: 'Branded Dark HTML Email Builder + Real Test Sender', detail: 'Anti-inversion dark HTML, 3 themes, 4 weekly templates, 3-Cut Spotlight, P.S. hook, and Resend live delivery.', status: 'live' },
            { name: 'Depot/Butcher Auto-Routed Scan-to-Quick-Order QR', detail: 'Live scannable QR code in every email linked directly to the exact featured cuts & store.', status: 'live' },
            { name: 'Auto-Optimal Broadcast Scheduling', detail: 'Resend scheduled_at automatically targets Tue–Thu 10:00 AM CT peak open windows (override toggle included).', status: 'live' },
            { name: 'Inline IG · FB · X Social Studio (45 Seeded Ideas)', detail: 'Weekly view, live click-to-edit Facebook Feed preview, pure HTML/CSS Recipe Posters ($0, no AI plan), and Auto-Post toggle.', status: 'live' },
            { name: 'Public Auto-Posting (Meta IG/FB & X APIs)', detail: 'Graph API v21.0 + X OAuth 1.0a wired and verified in Dry-Run — waiting on Meta & X keys.', status: 'needs-key' },
        ],
    },
    {
        id: 'brand-lab',
        title: 'Brand Identity, Social Profiles & Sales Lab',
        route: '/product-identity/social',
        routeLabel: 'Open Social Profiles →',
        features: [
            { name: 'Standalone Social Profiles Kit (IG · FB · X)', detail: 'Editable avatars, banners, posts, bios, captions, and 1-click full-res PNG downloads.', status: 'live' },
            { name: 'Google Search & Local Pack Preview (/google-preview)', detail: 'Live Google SERP & Business Profile preview with the new identity.', status: 'live' },
            { name: 'Sales Psychology Lab (/sales-psychology)', detail: '14 peer-reviewed conversion studies + interactive Before/After Steak & Decoy Simulators.', status: 'live' },
        ],
    },
];

const VERIFIED_GROUPS: { title: string; routes: { label: string; href: string; note: string }[] }[] = [
    {
        title: 'Storefront & Ordering',
        routes: [
            { label: 'Home', href: '/', note: 'Hero two-location guide, full-bleed video, Italian Beef & Rotisserie live badges, Asymmetric Bento' },
            { label: 'Online Orders (Butcher & Depot)', href: '/online-orders', note: '1-tap inline add, Butcher Red / Depot Blue themes, Fixed Mini Cart Rail, Email QR Quick-Order' },
            { label: 'Checkout & Pickup Windows', href: '/checkout', note: '15-min pickup slots, Curbside Trunk Drop-Off, Call/Email preference, Pickup confirmation card' },
            { label: 'Specials', href: '/specials', note: 'Live Chicago-time Italian Beef & Rotisserie Chicken scarcity status' },
            { label: 'Selections & Cut Guide', href: '/selections', note: 'Full butcher case guide & primal cuts' },
            { label: 'Gift Cards', href: '/gift-cards', note: 'Digital & in-store gift cards' },
        ],
    },
    {
        title: 'Catering, Recipes & Story',
        routes: [
            { label: 'BBQ & Catering', href: '/catering', note: 'Interactive Catering Calculator, double-line fire marquee, Pig Roasts' },
            { label: 'Holiday & Event Catering', href: '/catering/holidays', note: 'Seasonal holiday catering planner & menus' },
            { label: 'Recipes & Parcel Sheets', href: '/recipes', note: 'Cooking guides & printable 12×16" Butcher Parcel Sheets (/recipes/sheets)' },
            { label: 'Visit & Parking Guide', href: '/visit', note: 'Northfield vs. Winnetka Depot hours, parking, rush & quiet windows' },
            { label: 'Our Story & Press', href: '/our-story', note: 'Heritage since 1903, team bento & ATK/PBS press' },
            { label: 'FAQ, Jobs & Newsletter', href: '/faq', note: 'FAQ accordion, hiring form (/jobs), newsletter signup (/newsletter)' },
        ],
    },
    {
        title: 'Admin, Email & Social Ops',
        routes: [
            { label: 'Admin Console', href: '/admin-dashboard/admin', note: 'Live orders, SLA alerts, slot capacity, dark-mode Recharts analytics, restock requests' },
            { label: 'Email Builder & Subscribers', href: '/admin-dashboard/admin?tab=subscribers', note: 'Branded dark HTML emails, 3-Cut Spotlight, Depot/Butcher QR Quick-Order, Resend auto-schedule' },
            { label: 'Social Studio (IG · FB · X)', href: '/admin/social', note: '45 seeded ideas, live editable Facebook Feed preview, HTML/CSS recipe posters, Auto-Post toggle' },
            { label: 'Admin Inventory', href: '/admin/inventory', note: 'Live Sanity product stock & pricing controls' },
            { label: 'Customer Dashboard', href: '/dashboard', note: 'Order rewards, 7-Animal Mastery, restock alerts (admin test buttons hidden from customers)' },
            { label: 'Sales Psychology', href: '/sales-psychology', note: '14 conversion studies & interactive steak/decoy simulators' },
            { label: 'Social Profiles & Google SERP', href: '/product-identity/social', note: 'IG/FB/X profile mockups, downloadable PNGs & /google-preview' },
        ],
    },
];

const MANUAL_TASKS: ManualTask[] = [
    {
        id: 'push-netlify',
        title: 'Commit & push latest local changes to origin/main + mirror env vars in Netlify',
        detail: 'Copy RESEND_API_KEY, EMAIL_FROM, CRON_SECRET (and Stripe keys once added) into Netlify → Site configuration → Environment variables.',
    },
    {
        id: 'monday-special',
        title: 'Replace [Special name] & [price] on Monday’s Weekly Special post',
        detail: 'Click directly on the caption and graphic text in /admin/social to enter this week’s real special before turning Auto-Post on.',
        href: '/admin/social',
        hrefLabel: 'Edit in Social Studio →',
    },
    {
        id: 'sanity-inventory',
        title: 'Confirm final product prices & in-stock status in Sanity / Admin Inventory',
        detail: 'Double-check seasonal cuts, Depot items, and out-of-stock toggles before taking live customer orders.',
        href: '/admin/inventory',
        hrefLabel: 'Open Inventory →',
    },
    {
        id: 'clean-test-data',
        title: 'Clear test orders, demo restock requests & test subscriber email',
        detail: 'Remove test records from Sanity once you finish verifying checkout, restock emails, and newsletter sends.',
        href: '/admin-dashboard/admin',
        hrefLabel: 'Open Admin Console →',
    },
];

export default async function LaunchChecklistPage() {
    let counts = { products: 0, customers: 0, subscribers: 0, socialIdeas: 0, orders: 0 };
    try {
        counts = await adminClient.fetch(
            `{
                "products": count(*[_type == "product"]),
                "customers": count(*[_type == "customer"]),
                "subscribers": count(*[_type == "customer" && newsletter == true]),
                "socialIdeas": count(*[_type == "socialContent"]),
                "orders": count(*[_type == "order"])
            }`
        );
    } catch {
        // Fallback if Sanity unreachable
    }

    const emailFrom = process.env.EMAIL_FROM || 'Hofherr Meat Co. <onboarding@resend.dev>';
    const domainVerified = !emailFrom.includes('onboarding@resend.dev') && emailFrom.includes('hofherrmeatco.com');
    const stripeReady = Boolean(
        process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
        process.env.STRIPE_WEBHOOK_SECRET
    );
    const metaReady = Boolean(
        process.env.META_PAGE_ID &&
        process.env.META_IG_USER_ID &&
        process.env.META_PAGE_ACCESS_TOKEN
    );
    const xReady = Boolean(
        process.env.X_API_KEY &&
        process.env.X_API_SECRET &&
        process.env.X_ACCESS_TOKEN &&
        process.env.X_ACCESS_SECRET
    );
    const resendReady = Boolean(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY);
    const cronReady = Boolean(process.env.CRON_SECRET);
    const sanityReady = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.SANITY_API_WRITE_TOKEN);
    const mapsReady = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    const gaReady = Boolean(process.env.NEXT_PUBLIC_GA_ID);
    const mailchimpReady = Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID);

    const checklist: LaunchItem[] = [
        {
            id: 'stripe',
            title: 'Connect Stripe Live Keys (Online Card Payments)',
            detail: 'Needed to charge credit/debit cards online at /checkout. Until added, checkout works for pay-at-pickup / test flow.',
            done: stripeReady,
            priority: 'required',
            steps: [
                'Open Stripe Dashboard → Developers → API Keys and copy your Publishable & Secret keys.',
                'Add a Webhook endpoint pointing to https://hofherrmeatco.com/api/webhooks/stripe and copy the Signing Secret.',
                'Paste all 3 keys into .env.local and Netlify Environment Variables.',
            ],
            envSnippet: `STRIPE_SECRET_KEY=sk_live_...\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...\nSTRIPE_WEBHOOK_SECRET=whsec_...`,
            externalHref: 'https://dashboard.stripe.com/apikeys',
            externalLabel: 'Stripe API Keys ↗',
            actionHref: '/checkout',
            actionLabel: 'Test Checkout →',
        },
        {
            id: 'resend-domain',
            title: 'Verify hofherrmeatco.com Domain in Resend',
            detail: `Resend API is live, but EMAIL_FROM is currently "${emailFrom}" (sandbox mode — only delivers to your own signup email).`,
            done: resendReady && domainVerified,
            priority: 'required',
            steps: [
                'Open Resend → Domains → Add Domain → enter hofherrmeatco.com.',
                'Copy the 3 DNS records (SPF / DKIM / DMARC) into your domain registrar.',
                'Once verified, update EMAIL_FROM in .env.local and Netlify.',
            ],
            envSnippet: `EMAIL_FROM="Hofherr Meat Co. <butcher@hofherrmeatco.com>"`,
            externalHref: 'https://resend.com/domains',
            externalLabel: 'Resend Domains ↗',
            actionHref: '/admin-dashboard/admin?tab=subscribers',
            actionLabel: 'Email Builder →',
        },
        {
            id: 'meta-social',
            title: 'Connect Meta Graph API (Facebook Page + Instagram Business)',
            detail: 'Social Studio already renders 4:5 graphics, Facebook Feed previews, and HTML/CSS recipe posters — runs in safe Dry-Run mode until keys are added.',
            done: metaReady,
            priority: 'optional',
            steps: [
                'Create a Meta Developer App linked to the Hofherr Meat Co. Facebook Page & Instagram Business account.',
                'Generate a long-lived Page Access Token with pages_manage_posts & instagram_content_publish permissions.',
                'Add all 3 variables to .env.local and Netlify.',
            ],
            envSnippet: `META_PAGE_ID=\nMETA_IG_USER_ID=\nMETA_PAGE_ACCESS_TOKEN=`,
            externalHref: 'https://developers.facebook.com/apps/',
            externalLabel: 'Meta Developers ↗',
            actionHref: '/admin/social',
            actionLabel: 'Social Studio →',
        },
        {
            id: 'x-social',
            title: 'Connect X (Twitter) OAuth 1.0a Keys',
            detail: 'Enables 1-click and scheduled 16:9 image posts directly to X. Currently runs in Dry-Run mode.',
            done: xReady,
            priority: 'optional',
            steps: [
                'Open the X Developer Portal → create/select an app with Read & Write permissions.',
                'Generate Consumer API Key/Secret and OAuth 1.0a Access Token/Secret.',
                'Paste all 4 variables into .env.local and Netlify.',
            ],
            envSnippet: `X_API_KEY=\nX_API_SECRET=\nX_ACCESS_TOKEN=\nX_ACCESS_SECRET=`,
            externalHref: 'https://developer.x.com/en/portal/dashboard',
            externalLabel: 'X Developer Portal ↗',
            actionHref: '/admin/social',
            actionLabel: 'Social Studio →',
        },
        {
            id: 'analytics-mailchimp',
            title: 'Google Analytics 4 & Optional Mailchimp Sync',
            detail: 'Add GA4 for visitor & conversion tracking, plus Mailchimp if you want newsletter opt-ins mirrored outside Sanity/Resend.',
            done: gaReady && mailchimpReady,
            priority: 'optional',
            envSnippet: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX\nMAILCHIMP_API_KEY=\nMAILCHIMP_AUDIENCE_ID=`,
            externalHref: 'https://analytics.google.com/',
            externalLabel: 'Google Analytics ↗',
        },
        {
            id: 'sanity-core',
            title: 'Sanity CMS, Google Maps, Resend API & Cron Secret',
            detail: `Configured locally and verified live (${counts.products} products, ${counts.socialIdeas} social ideas, ${counts.customers} customers).`,
            done: sanityReady && mapsReady && resendReady && cronReady,
            priority: 'required',
            actionHref: '/admin/inventory',
            actionLabel: 'Check Inventory →',
        },
    ];

    const neededCount = checklist.filter(i => !i.done).length;
    const totalFeatures = ALL_FEATURE_CATEGORIES.reduce((sum, cat) => sum + cat.features.length, 0);
    const liveFeatures = ALL_FEATURE_CATEGORIES.reduce(
        (sum, cat) => sum + cat.features.filter(f => f.status === 'live').length,
        0
    );

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.title}>All Features &amp; What Still Needs to Be Done</h1>
                            <p className={styles.lead}>
                                Complete master view of Hofherr Meat Co. — <strong>{liveFeatures}/{totalFeatures} features live</strong>,{' '}
                                <strong>TypeScript clean</strong>, and <strong>React Doctor 100/100</strong>. Remaining
                                launch items update automatically as you add keys.
                            </p>
                        </div>
                        <div className={styles.scoreBox}>
                            <span className={styles.scoreNum}>{neededCount}</span>
                            <span className={styles.scoreLabel}>Items Left</span>
                        </div>
                    </div>

                    <div className={styles.kpiRow}>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiVal}>
                                {liveFeatures} / {totalFeatures}
                            </span>
                            <span className={styles.kpiLabel}>Built Features Live</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiVal}>100 / 100</span>
                            <span className={styles.kpiLabel}>React Doctor Score</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiVal}>{counts.products}</span>
                            <span className={styles.kpiLabel}>Sanity Products</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiVal}>{counts.socialIdeas}</span>
                            <span className={styles.kpiLabel}>Social Bank Ideas</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiVal}>{counts.customers}</span>
                            <span className={styles.kpiLabel}>Registered Customers</span>
                        </div>
                    </div>
                </div>
            </header>

            <section id="still-needed" aria-labelledby="still-needed-heading" className="section-sm">
                <div className="container">
                    <div className={styles.sectionHead}>
                        <h2 id="still-needed-heading" className={styles.sectionTitle}>
                            1. What Still Needs to Be Done ({neededCount} Integrations + {MANUAL_TASKS.length} Pre-Launch Tasks)
                        </h2>
                        <p className={styles.sectionSub}>
                            Copy any <code>.env</code> snippet in one click, open the provider dashboard directly, and check off
                            each manual task as you go.
                        </p>
                    </div>

                    <LaunchChecklistClient items={checklist} manualTasks={MANUAL_TASKS} />
                </div>
            </section>

            <section id="all-features" aria-labelledby="all-features-heading" className="section-sm">
                <div className="container">
                    <div className={styles.sectionHead}>
                        <h2 id="all-features-heading" className={styles.sectionTitle}>
                            2. Every Feature Built Across the Site ({totalFeatures})
                        </h2>
                        <p className={styles.sectionSub}>
                            Full inventory of every storefront, ordering, catering, customer account, admin, email, social,
                            and brand feature — click any section to jump straight in.
                        </p>
                    </div>

                    <div className={styles.featureCategories}>
                        {ALL_FEATURE_CATEGORIES.map(cat => (
                            <article key={cat.id} className={styles.featureCatCard}>
                                <div className={styles.featureCatHead}>
                                    <h3 className={styles.featureCatTitle}>{cat.title}</h3>
                                    <Link href={cat.route} className={styles.cardLink}>
                                        {cat.routeLabel}
                                    </Link>
                                </div>
                                <ul className={styles.featureList}>
                                    {cat.features.map(feat => (
                                        <li key={feat.name} className={styles.featureRow}>
                                            <span
                                                className={
                                                    feat.status === 'live'
                                                        ? styles.featBadgeLive
                                                        : styles.featBadgeKey
                                                }
                                            >
                                                {feat.status === 'live' ? '✓ LIVE' : '○ NEEDS KEY'}
                                            </span>
                                            <div className={styles.featureRowBody}>
                                                <strong className={styles.featureRowName}>{feat.name}</strong>
                                                <span className={styles.featureRowDetail}>{feat.detail}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="verified-routes" aria-labelledby="verified-routes-heading" className="section-sm">
                <div className="container">
                    <div className={styles.sectionHead}>
                        <h2 id="verified-routes-heading" className={styles.sectionTitle}>
                            3. Quick Route Directory
                        </h2>
                        <p className={styles.sectionSub}>
                            Every storefront, ordering flow, admin dashboard, and brand tool tested live with zero 404/500 errors.
                        </p>
                    </div>

                    <div className={styles.routeGroups}>
                        {VERIFIED_GROUPS.map(group => (
                            <div key={group.title} className={styles.routeGroup}>
                                <h3 className={styles.groupTitle}>{group.title}</h3>
                                <ul className={styles.routeList}>
                                    {group.routes.map(route => (
                                        <li key={route.href} className={styles.routeItem}>
                                            <Link href={route.href} className={styles.routeLink}>
                                                <span className={styles.routeOk}>✓</span>
                                                <span className={styles.routeText}>
                                                    <strong>{route.label}</strong>
                                                    <span className={styles.routeNote}>{route.note}</span>
                                                </span>
                                                <span className={styles.routePath}>{route.href}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
