import Link from 'next/link';
import styles from '../legal.module.css';

export const metadata = {
    title: 'Privacy Policy — Hofherr Meat Co.',
    description: 'Learn how Hofherr Meat Co. collects, uses, and protects your personal information when you use our website and services.',
    alternates: { canonical: 'https://hofherrmeatco.com/privacy' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Privacy Policy | Hofherr Meat Co.',
        description: 'How Hofherr Meat Co. collects, uses, and protects your personal information.',
        url: 'https://hofherrmeatco.com/privacy',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Privacy Policy | Hofherr Meat Co.' }],
    },
};

const TOC_ITEMS = [
    { id: 'information-we-collect', index: '1.', label: 'Information We Collect' },
    { id: 'how-we-use', index: '2.', label: 'How We Use Your Info' },
    { id: 'payment-processing', index: '3.', label: 'Payment Processing' },
    { id: 'data-sharing', index: '4.', label: 'Data Sharing' },
    { id: 'data-retention', index: '5.', label: 'Data Retention' },
    { id: 'your-rights', index: '6.', label: 'Your Rights' },
    { id: 'security', index: '7.', label: 'Security' },
    { id: 'questions-contact', index: '8.', label: 'Questions & Contact' },
];

export default function PrivacyPolicyPage() {
    return (
        <main className={styles.pageWrap}>
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <h1 className={styles.title}>
                        Privacy <em>Policy</em>
                    </h1>
                    <p className={styles.heroLead}>
                        We take your privacy as seriously as we take our dry-aging process. Hofherr Meat Co.
                        (&quot;we,&quot; &quot;us,&quot; or &quot;the folks behind the counter&quot;) operates
                        hofherrmeatco.com. This Privacy Policy explains how we handle your information — no funny
                        business.
                    </p>
                    <p className={styles.effective}>
                        Effective: <time dateTime="2026-03-12">March 12, 2026</time>
                    </p>
                </div>
            </header>

            <section id="privacy-content" aria-labelledby="privacy-content-heading" className="section">
                <div className="container">
                    <div className={styles.legalGrid}>
                        <aside className={styles.sidebar} aria-label="Document navigation">
                            <nav className={styles.sidebarPanel} aria-label="Privacy policy sections">
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
                                        <Link href="/terms" className={styles.policyLink}>
                                            <span>Terms of Service</span>
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
                                    <li>
                                        <Link
                                            href="/privacy"
                                            aria-current="page"
                                            className={`${styles.policyLink} ${styles.policyLinkActive}`}
                                        >
                                            <span>Privacy Policy</span>
                                            <span className={styles.policyBadge}>Current</span>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        <article className={styles.documentSurface} aria-labelledby="privacy-content-heading">
                            <div className={styles.docHeader}>
                                <h2 id="privacy-content-heading" className={styles.docHeading}>
                                    Customer Privacy &amp; Data Protection Policy
                                </h2>
                                <span className={styles.docMeta}>Northfield &amp; Winnetka, IL</span>
                            </div>

                            <div className={styles.clauseListWrap}>
                                <div id="information-we-collect" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>1. Information We Collect</h3>
                                    <p className={styles.clauseProse}>
                                        We only collect what we need to get your order right. No more, no less.
                                    </p>
                                    <p className={styles.clauseProse}>
                                        <strong>Information You Provide</strong>
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            <strong>Order Information:</strong> Name, email, phone number, and preferred
                                            pickup time — so we know who&apos;s picking up that beautiful ribeye.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Restock Requests:</strong> Name and contact info, so we can let you
                                            know when your favorites are back in the case.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Newsletter:</strong> Email address, if you want the inside scoop on
                                            specials and seasonal items.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Catering Inquiries:</strong> Contact details and event info for BBQ
                                            catering — we promise to only use it to plan your party.
                                        </li>
                                    </ul>
                                    <p className={styles.clauseProse}>
                                        <strong>Information Collected Automatically</strong>
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            <strong>Browser Storage:</strong> Your shopping cart, recent searches, and
                                            preferences are saved locally on your device. We never see this data —
                                            it&apos;s between you and your browser.
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Usage Data:</strong> Standard server logs (IP address, browser type,
                                            pages visited). The boring technical stuff.
                                        </li>
                                    </ul>
                                </div>

                                <div id="how-we-use" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>2. How We Use Your Information</h3>
                                    <p className={styles.clauseProse}>
                                        Short version: to get you great meat, and nothing shady.
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>Process and fulfill your orders</li>
                                        <li className={styles.clauseItem}>
                                            Communicate order status and pickup details
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Respond to restock requests and catering inquiries
                                        </li>
                                        <li className={styles.clauseItem}>
                                            Send newsletters and specials (only if you asked for them)
                                        </li>
                                        <li className={styles.clauseItem}>Improve our website and services</li>
                                        <li className={styles.clauseItem}>
                                            Comply with legal obligations (the un-fun but necessary part)
                                        </li>
                                    </ul>
                                </div>

                                <div id="payment-processing" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>3. Payment Processing</h3>
                                    <p className={styles.clauseProse}>
                                        We handle the meat. <strong>Stripe</strong> handles the money. We never see,
                                        store, or touch your credit card numbers. Stripe is PCI-DSS Level 1 compliant —
                                        that&apos;s the gold standard. Their privacy practices are governed by their{' '}
                                        <a
                                            href="https://stripe.com/privacy"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.contactLink}
                                        >
                                            Privacy Policy
                                        </a>
                                        .
                                    </p>
                                </div>

                                <div id="data-sharing" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>4. Data Sharing</h3>
                                    <p className={styles.clauseProse}>
                                        We don&apos;t sell your data. Period. We&apos;re butchers, not data brokers. We
                                        only share information with:
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            <strong>Stripe:</strong> For payment processing
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Email service providers:</strong> To send order confirmations and
                                            newsletters
                                        </li>
                                        <li className={styles.clauseItem}>
                                            <strong>Legal authorities:</strong> Only when required by law
                                        </li>
                                    </ul>
                                </div>

                                <div id="data-retention" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>5. Data Retention</h3>
                                    <p className={styles.clauseProse}>
                                        We keep order records for accounting and tax purposes as required by Illinois
                                        law. Unlike our steaks, your data doesn&apos;t need to age. You can request
                                        deletion at any time by{' '}
                                        <a
                                            href="mailto:info@hofherrmeatco.com?subject=Data%20Deletion%20Request&body=Hi%20Hofherr%20Meat%20Co.%2C%0A%0AI%20would%20like%20to%20request%20deletion%20of%20my%20personal%20data.%0A%0AFull%20Name%3A%20%0AEmail%20on%20file%3A%20%0APhone%20on%20file%3A%20%0A%0AThank%20you."
                                            className={styles.contactLink}
                                        >
                                            requesting deletion here
                                        </a>
                                        .
                                    </p>
                                </div>

                                <div id="your-rights" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>6. Your Rights</h3>
                                    <p className={styles.clauseProse}>
                                        You&apos;re the boss of your data. Depending on your location, you can:
                                    </p>
                                    <ul className={styles.clauseItems}>
                                        <li className={styles.clauseItem}>
                                            Access the personal data we hold about you
                                        </li>
                                        <li className={styles.clauseItem}>Correct inaccurate data</li>
                                        <li className={styles.clauseItem}>Delete your personal data</li>
                                        <li className={styles.clauseItem}>Opt out of marketing communications</li>
                                        <li className={styles.clauseItem}>Object to data processing</li>
                                    </ul>
                                    <p className={styles.clauseProse}>
                                        <strong>California Residents (CCPA):</strong> You have the right to know what
                                        personal information we collect, request deletion, and opt out of
                                        &quot;sales&quot; of personal information. We do not sell personal information.
                                    </p>
                                    <p className={styles.clauseProse}>
                                        <strong>Illinois Residents:</strong> We comply with the Illinois Personal
                                        Information Protection Act (PIPA). We do not collect biometric data.
                                    </p>
                                </div>

                                <div id="security" className={styles.clause}>
                                    <h3 className={styles.clauseHeading}>7. Security</h3>
                                    <p className={styles.clauseProse}>
                                        We guard your data like we guard our dry-aging room. SSL/TLS encryption on every
                                        page, Stripe&apos;s 256-bit encryption for payments, and commercially reasonable
                                        security measures across the board.
                                    </p>
                                </div>
                            </div>

                            <div id="questions-contact" className={styles.contactBlock}>
                                <h3 className={styles.contactTitle}>Questions? We&apos;re an open book.</h3>
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
                                        <a href="tel:8474416328" className={styles.contactLink}>
                                            (847) 441-6328
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
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </span>
                                        <a href="mailto:butcher@hofherrmeatco.com" className={styles.contactLink}>
                                            butcher@hofherrmeatco.com
                                        </a>
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
