import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Gift Cards | Hofherr Meat Co. — The Perfect Gift for Meat Lovers',
    description: 'Give the gift of premium butcher-shop quality. Hofherr Meat Co. offers physical gift cards (mailed free) and instant eGift cards via Square. Northfield, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/gift-cards' },
    openGraph: {
        title: 'Gift Cards | Hofherr Meat Co.',
        description: 'Physical and eGift cards available. The perfect gift for any meat lover on your list.',
        url: 'https://hofherrmeatco.com/gift-cards',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function GiftCardsPage() {
    return (
        <div>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className="section-label">For Every Occasion</div>
                    <h1 className={styles.headline}>The Gift of <em>Great Meat</em></h1>
                    <p className={styles.sub}>
                        Know a home cook, grill master, or someone who just appreciates quality?
                        A Hofherr Meat Co. gift card is the most useful thing you can give — and it never expires.
                    </p>
                </div>
            </section>

            {/* ── Options ── */}
            <section className={`section ${styles.optionsSection}`}>
                <div className="container">
                    <div className={styles.grid}>

                        {/* eGift Card */}
                        <div className={`${styles.card} ${styles.cardFeature}`}>
                            <div className={styles.cardBadge}>Instant Delivery</div>
                            <div className={styles.cardEmoji}>📲</div>
                            <h2 className={styles.cardTitle}>eGift Card</h2>
                            <p className={styles.cardDesc}>
                                Buy online in seconds and send it directly to the recipient&apos;s inbox. Powered by Square — secure, instant, and redeemable in-store.
                            </p>
                            <ul className={styles.perks}>
                                <li>✓ Sent instantly via email</li>
                                <li>✓ Any amount you choose</li>
                                <li>✓ Redeemable in-store</li>
                                <li>✓ Never expires</li>
                            </ul>
                            <a
                                href="https://squareup.com/gift/D4T9XAQSCNMKT/order"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                Buy eGift Card ↗
                            </a>
                        </div>

                        {/* Giftly — The Depot */}
                        <div className={styles.card}>
                            <div className={styles.cardEmoji}>🎁</div>
                            <h2 className={styles.cardTitle}>Giftly Gift Card</h2>
                            <p className={styles.cardDesc}>
                                Purchase a Giftly gift card for The Depot at our Winnetka location. Flexible and easy to give — delivered digitally and redeemable in-store.
                            </p>
                            <ul className={styles.perks}>
                                <li>✓ Digital delivery</li>
                                <li>✓ For The Depot — Winnetka</li>
                                <li>✓ Any amount you choose</li>
                                <li>✓ Powered by Giftly</li>
                            </ul>
                            <a
                                href="https://www.giftly.com/gift-card/hofherr-meat-co-depot-winnetka-2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                Buy on Giftly ↗
                            </a>
                        </div>

                        {/* Physical Gift Card */}
                        <div className={styles.card}>
                            <div className={styles.cardEmoji}>🪪</div>
                            <h2 className={styles.cardTitle}>Physical Gift Card</h2>
                            <p className={styles.cardDesc}>
                                A real, tangible gift card they can pull out of their wallet. We load any amount, then mail it free — to you or straight to the recipient.
                            </p>
                            <ul className={styles.perks}>
                                <li>✓ Any dollar amount</li>
                                <li>✓ Mailed free of charge</li>
                                <li>✓ Curbside pickup available</li>
                                <li>✓ Never expires</li>
                            </ul>
                            <div className={styles.howTo}>
                                <div className={styles.howToTitle}>How to Order</div>
                                <ol className={styles.steps}>
                                    <li>
                                        <span className={styles.stepNum}>1</span>
                                        Email us the amount you&apos;d like loaded and the best number to reach you.
                                    </li>
                                    <li>
                                        <span className={styles.stepNum}>2</span>
                                        We&apos;ll call to take payment over the phone.
                                    </li>
                                    <li>
                                        <span className={styles.stepNum}>3</span>
                                        Choose free mail delivery or curbside pickup at the shop.
                                    </li>
                                </ol>
                            </div>
                            <a
                                href="mailto:butcher@hofherrmeatco.com?subject=Gift Card Request"
                                className="btn btn-secondary"
                            >
                                ✉️ Email to Order
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className={`section ${styles.faqSection}`}>
                <div className={`container ${styles.faqInner}`}>
                    <h2 className={styles.faqTitle}>Common Questions</h2>
                    <div className={styles.faqs}>
                        {[
                            { q: 'Do gift cards expire?', a: 'Nope. Physical and eGift cards never expire — use them whenever.' },
                            { q: 'Can I use a gift card for online orders?', a: 'Physical cards are redeemable in-store. eGift cards through Square can be applied at checkout online.' },
                            { q: 'How long does mailing take?', a: 'Usually 3–5 business days via USPS. If you need it faster, let us know and we\'ll arrange curbside pickup.' },
                            { q: 'Can I load any amount?', a: 'Yes — there\'s no minimum or maximum. Popular amounts are $25, $50, $100, and $200.' },
                        ].map(({ q, a }) => (
                            <div key={q} className={styles.faqItem}>
                                <div className={styles.faqQ}>{q}</div>
                                <div className={styles.faqA}>{a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}
