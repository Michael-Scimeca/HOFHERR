import Link from 'next/link';
import ContactLink from '@/components/ContactLink';
import PageHero from '@/components/PageHero';
import styles from '../legal.module.css';

export const metadata = {
    title: 'Terms of Service — Hofherr Meat Co.',
    description: 'Terms and conditions governing your use of the Hofherr Meat Co. website and online ordering services.',
    alternates: { canonical: 'https://hofherrmeatco.com/terms' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Terms of Service | Hofherr Meat Co.',
        description: 'Terms and conditions for the Hofherr Meat Co. website and online ordering.',
        url: 'https://hofherrmeatco.com/terms',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Terms of Service | Hofherr Meat Co.' }],
    },
};

const TOC_ITEMS = [
    { id: 'ordering-pricing', index: '1.', label: 'Ordering & Pricing' },
    { id: 'orders-pickup', index: '2.', label: 'Orders & Pickup' },
    { id: 'payment', index: '3.', label: 'Payment' },
    { id: 'food-safety', index: '4.', label: 'Food Safety & Handling' },
    { id: 'legal-fine-print', index: '5.', label: 'The Legal Fine Print' },
    { id: 'questions-contact', index: '6.', label: 'Questions & Contact' },
];

export default function TermsPage() {
    return (
        <main className={styles.pageWrap}>
            <PageHero
                title={
                    <>
                        Terms of <em>Service</em>
                    </>
                }
                lead="Welcome to Hofherr Meat Co. — where the steaks are high and the terms are fair. By using our website or placing an order, you agree to these Terms. They're straightforward, we promise."
            >
                <p className={styles.effective}>
                    Effective: <time dateTime="2026-03-12">March 12, 2026</time>
                </p>
            </PageHero>

            <section id="terms-content" aria-labelledby="terms-content-heading" className="section">
                <div className="container">
                    <div className={styles.legalGrid}>
                        <aside className={styles.sidebar} aria-label="Document navigation">
                            <nav className={styles.sidebarPanel} aria-label="Terms sections">
                                <h2 className={styles.sidebarHeading}>On This Page</h2>
                                <ol className={styles.tocList}>
                                    {TOC_ITEMS.map(item => (
                                        <li key={item.id}>
                                            <a href={`#${item.id}`} className={styles.tocLink}>
                                                <span className={styles.tocIndex}>{item.index}</span>
                                                <span>{item.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <nav className={styles.sidebarPanel} aria-label="Legal policies">
                                <h2 className={styles.sidebarHeading}>Legal Policies</h2>
                                <ul className={styles.policyList}>
                                    <li>
                                        <Link
                                            href="/terms"
                                            aria-current="page"
                                            className={`${styles.policyLink} ${styles.policyLinkActive}`}
                                        >
                                            <span>Terms of Service</span>
                                            <span className={styles.policyBadge}>Current</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className={styles.policyLink}>
                                            <span>Privacy Policy</span>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <article className={styles.documentSurface} aria-labelledby="terms-content-heading">
                            <div className={styles.docHeader}>
                                <h2 id="terms-content-heading" className={styles.docHeading}>
                                    Store &amp; Online Ordering Agreement
                                </h2>
                                <span className={styles.docMeta}>Northfield, IL &middot; In-Store Pickup</span>
                            </div>

                            <div className={styles.clauseListWrap}>
                                <div id="ordering-pricing" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>1. Ordering &amp; Pricing</h3>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            <strong>Price Estimates:</strong> Many of our products are priced per pound.
                                            Online prices are estimates based on standard cuts. Your final charge is
                                            determined by <strong>actual weight at the time of cutting</strong> — just
                                            like at the counter.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Custom Cuts:</strong> We love special requests (thickness, trim,
                                            quantity). We&apos;ll do our best, but some things depend on what the animal
                                            gives us.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Price Changes:</strong> Market prices fluctuate. We honor the price
                                            at the time your order is placed.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Availability:</strong> All items are subject to availability. If
                                            something runs out, we&apos;ll let you know — we won&apos;t just leave you
                                            hanging.
                                        </li>
                                    </ul>
                                </div>

                                <div id="orders-pickup" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>2. Orders &amp; Pickup</h3>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            Orders are for <strong>in-store pickup only</strong>. We&apos;re old-school
                                            like that — come say hi.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            You&apos;ll get a confirmation with pickup details after ordering.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Orders not picked up within the agreed timeframe may be restocked. Fresh
                                            meat waits for no one.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            A valid photo ID may be required at pickup.
                                        </li>
                                    </ul>
                                </div>

                                <div id="payment" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>3. Payment</h3>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            All payments go through <strong>Stripe</strong> — secure, encrypted, the
                                            works.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            We accept all major cards, Apple Pay, Google Pay, and PayPal.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Payment is collected at checkout. Weight adjustments may be processed after
                                            pickup.
                                        </li>
                                        <li className={styles.clauseItem}>Illinois sales tax applies.</li>
                                    </ul>
                                </div>

                                <div id="food-safety" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>4. Food Safety &amp; Handling</h3>
                                    <p className={styles.clauseProse}>
                                        We take pride in our product — here&apos;s how to keep it at its best:
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            Refrigerate or freeze everything promptly after pickup. Treat it like the
                                            good stuff it is.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Fresh meats should be consumed or frozen within <strong>3–5 days</strong>.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Once it leaves our shop, proper handling is on you. We trust you.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Got allergies? Our facility processes products with common allergens.{' '}
                                            <strong>Please call us</strong> before ordering if you have severe allergies
                                            — we&apos;d rather be safe.
                                        </li>
                                    </ul>
                                </div>

                                <div id="legal-fine-print" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>5. The Legal Fine Print</h3>
                                    <p className={styles.clauseProse}>
                                        Our website is provided &quot;as is.&quot; To the maximum extent permitted by
                                        Illinois law, we&apos;re not liable for indirect or consequential damages. Any
                                        disputes are governed by Illinois law and settled in Cook County courts.
                                    </p>
                                </div>
                            </div>

                            <div id="questions-contact" className={styles.contactBlock}>
                                <h3 className={styles.contactTitle}>Got questions? Just ask.</h3>
                                <p className={styles.contactLead}>Hofherr Meat Co.</p>
                                <div className={styles.contactDetails}>
                                    <div className={styles.contactRow}>
                                        <span className={styles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </span>
                                        <a
                                            href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.contactLink}
                                        >
                                            300 Happ Rd, Northfield, IL 60093
                                        </a>
                                    </div>

                                    <div className={styles.contactRow}>
                                        <span className={styles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </span>
                                        <ContactLink kind="phone" className={styles.contactLink}>
                                            (847) 441-6328
                                        </ContactLink>
                                    </div>

                                    <div className={styles.contactRow}>
                                        <span className={styles.contactIcon} aria-hidden="true">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </span>
                                        <ContactLink kind="email" className={styles.contactLink} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}
