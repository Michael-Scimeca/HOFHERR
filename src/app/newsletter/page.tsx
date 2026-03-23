'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function NewsletterPage() {
    const [step, setStep] = useState<'form' | 'done'>('form');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (email) setStep('done');
    }

    return (
        <div>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">Stay in the Loop</div>
                    <h1 className={styles.headline}>
                        The Hofherr <em>Weekly</em>
                    </h1>
                    <p className={styles.sub}>
                        Every Tuesday morning: this week&apos;s featured cuts, butcher&apos;s picks, seasonal arrivals,
                        and first dibs on holiday pre-orders. One email. No spam. Just meat.
                    </p>
                </div>
            </section>

            {/* ── Sign-Up Card ── */}
            <section className={`section ${styles.formSection}`}>
                <div className={`container ${styles.formWrap}`}>
                    {step === 'done' ? (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>🥩</div>
                            <h2 className={styles.successTitle}>You&apos;re on the list, {firstName || 'friend'}!</h2>
                            <p className={styles.successSub}>
                                Look for this Tuesday&apos;s specials in your inbox. You can unsubscribe any time from the link in any email.
                            </p>
                            <div className={styles.successLinks}>
                                <Link href="/specials" className="btn btn-primary">See This Week&apos;s Specials</Link>
                                <Link href="/online-orders" className="btn btn-primary">Order Online</Link>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.card}>
                            <div className={styles.cardLeft}>
                                <h2 className={styles.cardTitle}>What you&apos;ll get</h2>
                                <ul className={styles.perks}>
                                    <li>
                                        <span className={styles.perkIcon}>📅</span>
                                        <div>
                                            <strong>Every Tuesday</strong>
                                            <p>Specials drop the same time every week so you can plan your weekend cooking.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.perkIcon}>🔪</span>
                                        <div>
                                            <strong>Butcher&apos;s Picks</strong>
                                            <p>Sean&apos;s personal recommendations — what he&apos;s excited about this week.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.perkIcon}>🗓️</span>
                                        <div>
                                            <strong>Holiday Early Access</strong>
                                            <p>Pre-order windows for Thanksgiving, Christmas, Easter, and St. Patrick&apos;s Day before they sell out.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={styles.perkIcon}>🔥</span>
                                        <div>
                                            <strong>Recipes &amp; Tips</strong>
                                            <p>Occasional cook guides — how to reverse sear, smoke a brisket, or carve a rack of lamb.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.cardRight}>
                                <h2 className={styles.formTitle}>Subscribe</h2>
                                <p className={styles.formSub}>Free. One email per week. Unsubscribe anytime.</p>
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
                                        <label htmlFor="nl-last">Last Name <span className={styles.optional}>(optional)</span></label>
                                        <input id="nl-last" type="text" placeholder="Smith" />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="nl-email">Email Address <span className={styles.required}>*</span></label>
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
                                        By subscribing you agree to receive weekly emails from Hofherr Meat Co.
                                        We never sell your data. Unsubscribe via link in any email.
                                    </p>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
