import type { Metadata } from 'next';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'How Online & In-Store Ordering Works | Hofherr Meat Co.',
    description:
        'See how Hofherr Meat Co. connects online orders, capped 15-minute pickup slots, and walk-in counter purchases in Northfield & Winnetka under one phone-linked profile.',
    keywords: [
        'Hofherr Meat Co online ordering',
        'Northfield butcher pickup',
        'Winnetka Depot counter order',
        'curbside meat pickup North Shore',
        'phone-linked butcher profile',
    ],
    alternates: { canonical: 'https://hofherrmeatco.com/how-ordering-works' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'How Online & In-Store Ordering Works | Hofherr Meat Co.',
        description:
            'Online express pickup and walk-in counter purchases — all connected to one phone-linked Hofherr profile.',
        url: 'https://hofherrmeatco.com/how-ordering-works',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'How Ordering Works — Hofherr Meat Co.' }],
    },
};

const WORKFLOW_STEPS = [
    {
        num: '01',
        title: 'Reserve Your Cut & Slot',
        desc: 'Order online with Apple Pay, Google Pay, card, or pay at pickup. Every 15-minute window is capped so holiday and weekend rushes stay calm and predictable.',
    },
    {
        num: '02',
        title: 'Custom Cut & Pack-Checked',
        desc: 'Our butchers cut to your exact thickness and trim notes. Every single cut and pre-ordered side is checked off on our block checklist before your order is sealed.',
    },
    {
        num: '03',
        title: 'Wrapped & Ready Alert',
        desc: 'Your order is weighed, wrapped in kraft paper and butcher twine, and held cold. You get notified the moment it moves to the ready shelf.',
    },
    {
        num: '04',
        title: 'Synced to Your Profile',
        desc: 'Whether you ordered online or walked up to the counter, your cuts automatically appear in your Buy Again strip and unlock Cut Collector primal badges.',
    },
] as const;

export default function HowOrderingWorksPage() {
    return (
        <main className={styles.page}>
            {/* ── Hero ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <h1 className={styles.headline}>
                            Online &amp; At The Counter. <em>One Connected Shop.</em>
                        </h1>
                        <p className={styles.sub}>
                            Whether you pre-order steaks from your phone before work or walk up to the butcher block in
                            Northfield or Winnetka, every purchase ties cleanly to your phone number — with zero
                            third-party ordering markups.
                        </p>
                        <div className={styles.heroActions}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">
                                    <FireBorder active={true} radius={6} />
                                    Order Online
                                </span>
                            </Link>
                            <Link href="/visit" className="btn-hit">
                                <span className="btn btn-secondary">Shop &amp; Depot Hours</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Online vs. In-Store Connected Channels ── */}
            <section id="two-channels" aria-labelledby="two-channels-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHead}>
                            <h2 id="two-channels-heading" className={styles.sectionTitle}>
                                Two Ways to Shop, One Profile
                            </h2>
                            <p className={styles.sectionSub}>
                                We run our own unified system across both locations — no third-party delivery apps, no
                                hidden platform fees, and full order history everywhere you shop.
                            </p>
                        </div>

                        <div className={styles.channelGrid}>
                            <article className={`${styles.channelCard} ${styles.channelCardAccent}`}>
                                <span className={styles.channelTag}>On the Site · 24/7 Pre-Order</span>
                                <h3 className={styles.channelTitle}>Online Storefront</h3>
                                <p className={styles.channelDesc}>
                                    Browse live inventory for both The Butcher Shop (300 Happ Rd, Northfield) and The
                                    Depot (754 Elm St, Winnetka), add cut thickness or trim instructions, and skip the
                                    line at pickup.
                                </p>
                                <ul className={styles.featureList}>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>Express 1-tap checkout with Apple Pay, Google Pay, Stripe Link, or Pay In-Store.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>Capped 15-minute pickup slots and live kitchen wait times prevent lunch &amp; holiday bottlenecks.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>1-click Buy Again remembers your usual cuts and saved butcher notes across phone and desktop.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>Redeem Hofherr Gift Cards online or subscribe to Monthly Butcher Boxes &amp; Friday Rotisserie Club.</span>
                                    </li>
                                </ul>
                            </article>

                            <article className={styles.channelCard}>
                                <span className={styles.channelTag}>At the Counter · Northfield &amp; Winnetka</span>
                                <h3 className={styles.channelTitle}>In-Store Purchases</h3>
                                <p className={styles.channelDesc}>
                                    Prefer picking your steaks face-to-face at the glass case? Just share your 10-digit
                                    phone number at checkout — our counter POS links the order straight to your Hofherr
                                    profile.
                                </p>
                                <ul className={styles.featureList}>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>Instant phone-number match links your in-store card or cash purchase directly to your dashboard.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>No web account yet? No problem — your walk-in orders attach automatically the day you sign up with that phone number.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>In-store cuts count toward your Cut Collector progress and appear in your online Buy Again strip.</span>
                                    </li>
                                    <li>
                                        <span className={styles.check}>✓</span>
                                        <span>Live inventory updates automatically so online shoppers see what is still in the case.</span>
                                    </li>
                                </ul>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4-Stage Workflow ── */}
            <section id="order-workflow" aria-labelledby="order-workflow-heading" className={`section ${styles.bandAlt}`}>
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHead}>
                            <h2 id="order-workflow-heading" className={styles.sectionTitle}>
                                From Ticket to Butcher Paper
                            </h2>
                            <p className={styles.sectionSub}>
                                Every online and holiday pre-order follows our 4-stage butcher block checklist so
                                nothing gets missed — even on Thanksgiving Eve.
                            </p>
                        </div>

                        <div className={styles.stepsGrid}>
                            {WORKFLOW_STEPS.map((step) => (
                                <div key={step.num} className={styles.stepCard}>
                                    <span className={styles.stepNum}>STEP {step.num}</span>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDesc}>{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing, Weights & Policies ── */}
            <section id="ordering-policies" aria-labelledby="ordering-policies-heading" className="section">
                <div className="container">
                    <div className={styles.sectionStack}>
                        <div className={styles.sectionHead}>
                            <h2 id="ordering-policies-heading" className={styles.sectionTitle}>
                                Good to Know Before You Order
                            </h2>
                        </div>

                        <div className={styles.policyGrid}>
                            <div className={styles.policyCard}>
                                <h3 className={styles.policyTitle}>Hand-Cut Scale Weights</h3>
                                <p className={styles.policyBody}>
                                    Because every steak and roast is cut to order by hand, online checkout shows an
                                    estimated total based on standard cut weight. Need an exact thickness or poundage?
                                    Drop it in the item&apos;s special instructions and we&apos;ll cut it right on the mark.
                                </p>
                            </div>
                            <div className={styles.policyCard}>
                                <h3 className={styles.policyTitle}>Live Kitchen &amp; Holiday Pacing</h3>
                                <p className={styles.policyBody}>
                                    During peak lunch rushes (Italian Beef &amp; Rotisserie) or holiday pickup weeks, our
                                    team adjusts live prep buffers and caps each 15-minute slot so your pickup time is
                                    honest and your bag is ready when you walk in.
                                </p>
                            </div>
                            <div className={styles.policyCard}>
                                <h3 className={styles.policyTitle}>Gift Cards &amp; Butcher Clubs</h3>
                                <p className={styles.policyBody}>
                                    Hofherr Gift Cards never expire and can be checked or redeemed online at checkout or
                                    at either counter. Recurring Butcher Box and Friday Rotisserie subscriptions can be
                                    paused, skipped, or canceled anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section id="ordering-cta" aria-labelledby="ordering-cta-heading" className="section-sm">
                <div className="container">
                    <div className={styles.ctaWrap}>
                        <h2 id="ordering-cta-heading" className={styles.ctaTitle}>
                            Ready for Tonight&apos;s Dinner?
                        </h2>
                        <p className={styles.ctaSub}>
                            Order online for Northfield or Winnetka Depot pickup, or stop by the block and give us your
                            phone number at checkout.
                        </p>
                        <div className={styles.ctaBtns}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">Start an Online Order →</span>
                            </Link>
                            <Link href="/catering" className="btn-hit">
                                <span className="btn btn-secondary">BBQ &amp; Catering</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
