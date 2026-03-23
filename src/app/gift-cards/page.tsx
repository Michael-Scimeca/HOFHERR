import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Gift Cards | Hofherr Meat Co. — The Perfect Gift for Meat Lovers',
    description: 'Give the gift of premium butcher-shop quality. Hofherr Meat Co. offers physical gift cards (mailed free) and instant eGift cards via Square. Northfield, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/gift-cards' },
};

export default function GiftCardsPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.splitLayout}>
                {/* Visual Pane */}
                <div className={styles.visualPane}>
                    <div className={styles.imageWrapper}>
                         <div className={styles.overlayText}>
                             <h2>The ultimate<br/>gift for the<br/>meat lover.</h2>
                             <p>Never expires. Always delicious.</p>
                         </div>
                    </div>
                </div>

                {/* Content Pane */}
                <div className={styles.contentPane}>
                    <div className={styles.contentInner}>
                        <div className="section-label">For Every Occasion</div>
                        <h1 className={styles.headline}>The Gift of <em>Great Meat</em></h1>
                        <p className={styles.sub}>
                            Know a home cook, grill master, or someone who just appreciates quality?
                            A Hofherr Meat Co. gift card is the most useful thing you can give — and it never expires.
                        </p>

                        <div className={styles.cardsStack}>
                            {/* eGift Card */}
                            <div className={`${styles.card} ${styles.cardFeature}`}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}>📲</div>
                                    <div className={styles.badge}>Instant Delivery</div>
                                </div>
                                <h2 className={styles.cardTitle}>Instant eGift Card</h2>
                                <p className={styles.cardDesc}>
                                    Buy online in seconds and send it directly to the recipient&apos;s inbox. Powered by Square.
                                </p>
                                <ul className={styles.perks}>
                                    <li>✓ Sent instantly via email</li>
                                    <li>✓ Any amount you choose</li>
                                    <li>✓ Redeemable in-store</li>
                                </ul>
                                <a
                                    href="https://squareup.com/gift/D4T9XAQSCNMKT/order"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn btn-primary ${styles.btnFull}`}
                                >
                                    Buy eGift Card
                                </a>
                            </div>

                            {/* Physical Gift Card */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconCircle}>🪪</div>
                                </div>
                                <h2 className={styles.cardTitle}>Physical Gift Card</h2>
                                <p className={styles.cardDesc}>
                                    A tangible gift card they can pull out of their wallet. We load any amount, then mail it free — to you or straight to the recipient.
                                </p>
                                <div className={styles.howTo}>
                                    <div className={styles.howToTitle}>How to Order</div>
                                    <ul className={styles.steps}>
                                        <li><span>1</span>Email us the amount and the best number to reach you.</li>
                                        <li><span>2</span>We call to take payment over the phone.</li>
                                        <li><span>3</span>Free mail delivery or curbside pickup at the shop.</li>
                                    </ul>
                                </div>
                                <a
                                    href="mailto:butcher@hofherrmeatco.com?subject=Gift Card Request"
                                    className={`btn btn-secondary ${styles.btnFull}`}
                                >
                                    ✉️ Email to Order
                                </a>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className={styles.faqSection}>
                            <h2 className={styles.faqTitle}>Common Questions</h2>
                            <div className={styles.faqs}>
                                {[
                                    { q: 'Do gift cards expire?', a: 'Nope. Physical and eGift cards never expire — use them whenever.' },
                                    { q: 'Can I use a gift card for online orders?', a: 'Physical cards are redeemable in-store. eGift cards through Square can be applied at checkout online.' },
                                    { q: 'How long does mailing take?', a: 'Usually 3–5 business days via USPS. If you need it faster, let us know and we\'ll arrange curbside pickup.' },
                                ].map(({ q, a }) => (
                                    <div key={q} className={styles.faqItem}>
                                        <div className={styles.faqQ}>{q}</div>
                                        <div className={styles.faqA}>{a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
