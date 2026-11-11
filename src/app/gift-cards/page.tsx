import type { Metadata } from 'next';
import Image from 'next/image';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Gift Cards | Hofherr Meat Co. — The Perfect Gift for Meat Lovers',
    description: 'Give the gift of premium butcher-shop quality. Hofherr Meat Co. offers physical gift cards (mailed free) and instant eGift cards via Square. Northfield, IL.',
    alternates: { canonical: 'https://hofherrmeatco.com/gift-cards' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Gift Cards | Hofherr Meat Co.',
        description: 'Physical gift cards mailed free or instant eGift cards via Square. The perfect gift for the meat lover in your life.',
        url: 'https://hofherrmeatco.com/gift-cards',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Gift Cards — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gift Cards | Hofherr Meat Co.',
        description: 'Premium butcher shop gift cards — physical or instant eGift. Northfield, IL.',
    },
};

export default function GiftCardsPage() {
    return (
        <main className={styles.wrapper}>
            <div className={styles.splitLayout}>
                {/* Visual Pane */}
                <div className={styles.visualPane}>
                    <div className={styles.imageSticky}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/assets/gift-cards/gift-card-left-image.webp"
                                alt="Hofherr Meat Co. craft butcher selection and gift cards"
                                fill
                                priority
                                fetchPriority="high"
                                sizes="(max-width: 768px) 100vw, 45vw"
                                className={styles.heroImg}
                            />
                            <div className={styles.overlayText}>
                                <h2>The ultimate<br/>gift for the<br/>meat lover.</h2>
                                <p>Never expires. Always delicious.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Pane */}
                <div className={styles.contentPane}>
                    <div className={styles.contentInner}>
                        <h1 className={styles.headline}>The Gift of <em>Great Meat</em></h1>
                        <p className={styles.sub}>
                            Know a home cook, grill master, or someone who just appreciates quality?
                            A Hofherr Meat Co. gift card is the most useful thing you can give — and it never expires.
                        </p>

                        <div className={styles.cardsStack}>
                            {/* eGift Card */}
                            <div className={`${styles.card} ${styles.cardFeature}`}>
                                <FireBorder active radius={20} />
                                <div className={styles.cardHeader}>
                                    <div className={styles.brandSealGroup}>
                                        <div className={styles.iconCircle}>
                                            <Image
                                                src="/assets/identity/stickers/sticker-cow.svg"
                                                alt="Hofherr Flame Steer Emblem"
                                                width={40}
                                                height={40}
                                                className={styles.sealImg}
                                            />
                                        </div>
                                        <div className={styles.headerMeta}>
                                            <span className={styles.headerKicker}>Digital Edition · Square</span>
                                            <h2 className={styles.cardTitle}>Instant eGift Card</h2>
                                        </div>
                                    </div>
                                    <div className={styles.badge}>Instant Delivery</div>
                                </div>

                                {/* New Design System Dual-Card Showcase */}
                                <div className={styles.cardShowcase}>
                                    <div className={styles.cardMockupGrid}>
                                        <div className={styles.cr80CardWrap}>
                                            <Image
                                                src="/assets/gift-cards/gift-card-crimson.svg"
                                                alt="Hofherr Meat Co. Oxblood Crimson Gift Card"
                                                width={180}
                                                height={114}
                                                className={styles.cr80CardImg}
                                            />
                                            <div className={styles.swatchCaption}>
                                                <span className={`${styles.swatchDot} ${styles.swatchCrimson}`} />
                                                Oxblood Crimson · #8B0A10
                                            </div>
                                        </div>
                                        <div className={styles.cr80CardWrap}>
                                            <Image
                                                src="/assets/gift-cards/gift-card-amber.svg"
                                                alt="Hofherr Meat Co. Smokehouse Amber Gift Card"
                                                width={180}
                                                height={114}
                                                className={styles.cr80CardImg}
                                            />
                                            <div className={styles.swatchCaption}>
                                                <span className={`${styles.swatchDot} ${styles.swatchAmber}`} />
                                                Smokehouse Amber · #F59B1A
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className={styles.cardDesc}>
                                    Buy online in seconds and send it directly to the recipient&apos;s inbox. Powered by Square.
                                </p>
                                <ul className={styles.perks}>
                                    <li>✓ Sent instantly via email or text</li>
                                    <li>✓ Any custom amount you choose</li>
                                    <li>✓ Redeemable in-store &amp; online</li>
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
                                <FireBorder active radius={20} />
                                <div className={styles.cardHeader}>
                                    <div className={styles.brandSealGroup}>
                                        <div className={styles.iconCircle}>
                                            <Image
                                                src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                                                alt="Hofherr Meat Co. Northfield Provenance Seal"
                                                width={42}
                                                height={42}
                                                className={styles.sealImg}
                                            />
                                        </div>
                                        <div className={styles.headerMeta}>
                                            <span className={styles.headerKicker}>CR80 PVC Card · Mailed Free</span>
                                            <h2 className={styles.cardTitle}>Physical Gift Card</h2>
                                        </div>
                                    </div>
                                    <div className={styles.badgeKraft}>Mailed Free</div>
                                </div>

                                {/* Physical Card Front + Back Showcase */}
                                <div className={styles.cardShowcasePhysical}>
                                    <div className={styles.cardMockupGrid}>
                                        <div className={styles.cr80CardWrap}>
                                            <Image
                                                src="/assets/gift-cards/gift-card-crimson.svg"
                                                alt="Hofherr CR80 Physical Gift Card Front"
                                                width={180}
                                                height={114}
                                                className={styles.cr80CardImg}
                                            />
                                            <div className={styles.swatchCaption}>
                                                <span className={`${styles.swatchDot} ${styles.swatchCrimson}`} />
                                                CR80 Front
                                            </div>
                                        </div>
                                        <div className={styles.cr80CardWrap}>
                                            <Image
                                                src="/assets/gift-cards/gift-card-back.svg"
                                                alt="Hofherr CR80 Gift Card Back with Mag Stripe and Barcode"
                                                width={180}
                                                height={114}
                                                className={styles.cr80CardImg}
                                            />
                                            <div className={styles.swatchCaption}>
                                                <span className={`${styles.swatchDot} ${styles.swatchCream}`} />
                                                CR80 Back · Mag Stripe &amp; Barcode
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className={styles.cardDesc}>
                                    A tangible CR80 butcher-shop gift card they can pull out of their wallet. We load any amount, then mail it free — to you or straight to the recipient.
                                </p>
                                <div className={styles.howTo}>
                                    <div className={styles.howToTitle}>How to Order</div>
                                    <ul className={styles.steps}>
                                        <li><span>1</span>Email us the amount and the best number to reach you.</li>
                                        <li><span>2</span>We call to take payment over the phone.</li>
                                        <li><span>3</span>Free USPS mail delivery or curbside pickup at the shop.</li>
                                    </ul>
                                </div>
                                <a
                                    href="mailto:butcher@hofherrmeatco.com?subject=Gift Card Request"
                                    className={`btn btn-primary ${styles.btnFull}`}
                                >
                                    Email to Order
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
        </main>
    );
}
