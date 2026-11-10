'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const WORTH_IT_REASONS = [
    {
        num: '01',
        title: 'First Dibs on Small-Batch & Dry-Age Vault Drops',
        badge: 'Beats the Weekend Sellout',
        desc: 'When we pull a 45-day dry-aged prime ribeye rack, American Wagyu zabuton, or butcher’s hanger steaks off the hook, there are only a handful of cuts per animal. Subscribers get the list Tuesday at 8:00 AM — before the Friday counter rush clears the case.',
    },
    {
        num: '02',
        title: 'Subscriber-Only Weekly Cut Pricing',
        badge: 'Save $15–$35 on Weekend Cooks',
        desc: 'Every Tuesday email includes exclusive insider pricing on our featured steaks, house-linked sausages, and family BBQ packs. Mention or order from the weekly dispatch to lock in the member cut price.',
    },
    {
        num: '03',
        title: '48-Hour Head Start on Holiday Roasts',
        badge: 'Never Miss a Holiday Centerpiece',
        desc: 'Our fresh Amish heritage turkeys for Thanksgiving, standing USDA Prime rib roasts for Christmas, and French-trimmed crown roasts sell out every single season. Subscribers get private pre-order access 48 hours before we open reservations to the public.',
    },
    {
        num: '04',
        title: 'Weekend Pitmaster & Rotisserie Schedule',
        badge: 'Know What’s Smoking',
        desc: 'Find out ahead of time which limited-run specials are hitting the oak smoker and rotisserie spit at Northfield and The Depot — from Texas-style brisket flats and pork belly burnt ends to duck-fat potatoes.',
    },
    {
        num: '05',
        title: 'Sean’s Exact Temps, Sear Times & Butcher Notes',
        badge: 'Cook Every Cut Like a Steakhouse',
        desc: 'No 2,000-word life stories — just exact internal pull temperatures, dry-brine timing, pan-basting ratios, and carving angles straight from the butcher’s block so you nail expensive cuts on the first try.',
    },
];

const SAMPLE_DISPATCH_ITEMS = [
    {
        kicker: 'THE VAULT DROP',
        title: '45-Day Dry-Aged Bone-In Ribeye (18 Cuts Available)',
        detail: 'Cut 1.75" thick to order · Subscriber price $34/lb (Reg. $39/lb) · Hold yours for Friday pickup with one click.',
    },
    {
        kicker: 'WEEKEND SMOKEHOUSE',
        title: 'Post-Oak Smoked Prime Brisket & St. Louis Ribs',
        detail: 'Coming off the smoker Friday at 3:00 PM · Includes house tallow & pit beans · Pre-reserve before 1:00 PM Friday.',
    },
    {
        kicker: 'SEAN’S 60-SECOND TIP',
        title: 'The 12-Hour Uncovered Fridge Dry-Brine',
        detail: 'Why salting your steak on a wire rack Thursday night gives you a crust that beats a 700°F restaurant broiler.',
    },
];

export default function NewsletterPage() {
    const [step, setStep] = useState<'form' | 'done'>('form');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (email) setStep('done');
    }

    return (
        <main>
            {/* ── Hero ── */}
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <h1 className={styles.headline}>
                        The Hofherr <em>Weekly</em>
                    </h1>
                    <p className={styles.sub}>
                        Why subscribe? Because the best cuts in a real whole-animal butcher shop don&apos;t sit in a
                        warehouse — they sell out. Every Tuesday morning, we send one concise dispatch giving you first
                        claim on dry-aged vault releases, subscriber-only weekly steak pricing, and 48-hour early
                        access to holiday roast reservations.
                    </p>
                    <div className={styles.worthMetricsRow}>
                        <div className={styles.worthMetricItem}>
                            <span className={styles.worthMetricValue}>Every Tuesday · 8 AM</span>
                            <span className={styles.worthMetricLabel}>Before the Weekend Counter Rush</span>
                        </div>
                        <div className={styles.worthMetricItem}>
                            <span className={styles.worthMetricValue}>48-Hr Head Start</span>
                            <span className={styles.worthMetricLabel}>On Thanksgiving &amp; Christmas Roasts</span>
                        </div>
                        <div className={styles.worthMetricItem}>
                            <span className={styles.worthMetricValue}>Insider Pricing</span>
                            <span className={styles.worthMetricLabel}>Weekly Member-Only Cut Specials</span>
                        </div>
                        <div className={styles.worthMetricItem}>
                            <span className={styles.worthMetricValue}>Zero Fluff</span>
                            <span className={styles.worthMetricLabel}>1 Email a Week · 1-Click Unsubscribe</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Sign-Up Card & Why It's Worth It ── */}
            <section className={`section ${styles.formSection}`} aria-labelledby="why-worth-it-heading">
                <div className={`container ${styles.formWrap}`}>
                    {step === 'done' ? (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>🥩</div>
                            <h2 className={styles.successTitle}>
                                You&apos;re on the list, {firstName || 'friend'}!
                            </h2>
                            <p className={styles.successSub}>
                                Look for this Tuesday&apos;s butcher dispatch in your inbox. You can unsubscribe any
                                time from the link in any email.
                            </p>
                            <div className={styles.successLinks}>
                                <Link href="/specials" className="btn btn-primary">
                                    See This Week&apos;s Specials
                                </Link>
                                <Link href="/online-orders" className="btn btn-primary">
                                    Order Online
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.card}>
                            <div className={styles.cardLeft}>
                                <div className={styles.cardLeftHeader}>
                                    <h2 id="why-worth-it-heading" className={styles.cardTitle}>
                                        Why It&apos;s Worth Opening Every Tuesday
                                    </h2>
                                    <p className={styles.cardLead}>
                                        Most store newsletters are filler. Ours is written from behind the butcher block
                                        in Northfield so you get the best cuts before they&apos;re gone:
                                    </p>
                                </div>
                                <ul className={styles.perks}>
                                    {WORTH_IT_REASONS.map(reason => (
                                        <li key={reason.num} className={styles.perkItem}>
                                            <span className={styles.perkNum}>{reason.num}</span>
                                            <div className={styles.perkBody}>
                                                <div className={styles.perkTitleRow}>
                                                    <strong>{reason.title}</strong>
                                                    <span className={styles.perkBadge}>{reason.badge}</span>
                                                </div>
                                                <p>{reason.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.cardRight}>
                                <div className={styles.stickyFormBox}>
                                    <h2 className={styles.formTitle}>Join the Butcher&apos;s List</h2>
                                    <p className={styles.formSub}>
                                        Free forever. One email every Tuesday morning. Never shared, never sold, and
                                        unsubscribe in one click anytime.
                                    </p>
                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <div className={styles.field}>
                                            <label htmlFor="nl-first">First Name</label>
                                            <input
                                                id="nl-first"
                                                type="text"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label htmlFor="nl-last">
                                                Last Name <span className={styles.optional}>(optional)</span>
                                            </label>
                                            <input id="nl-last" type="text" placeholder="Smith" />
                                        </div>
                                        <div className={styles.field}>
                                            <label htmlFor="nl-email">
                                                Email Address <span className={styles.required}>*</span>
                                            </label>
                                            <input
                                                id="nl-email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className={`btn btn-primary ${styles.submit}`}>
                                            Subscribe — It&apos;s Free
                                        </button>
                                        <p className={styles.legal}>
                                            By subscribing you agree to receive our weekly Tuesday dispatch from Hofherr
                                            Meat Co. We never sell your data. Unsubscribe anytime with one click.
                                        </p>
                                    </form>

                                    <div className={styles.sampleBox}>
                                        <div className={styles.sampleHeader}>
                                            <span className={styles.sampleHeading}>
                                                📬 Preview: What a Typical Tuesday Email Looks Like
                                            </span>
                                            <span className={styles.sampleReadTime}>45-sec read</span>
                                        </div>
                                        <div className={styles.sampleList}>
                                            {SAMPLE_DISPATCH_ITEMS.map(item => (
                                                <div key={item.kicker} className={styles.sampleRow}>
                                                    <span className={styles.sampleKicker}>{item.kicker}</span>
                                                    <div className={styles.sampleTitle}>{item.title}</div>
                                                    <p className={styles.sampleDetail}>{item.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
