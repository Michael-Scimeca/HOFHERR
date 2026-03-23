import styles from '../legal.module.css';

export const metadata = {
    title: 'Privacy Policy — Hofherr Meat Co.',
    description: 'Learn how Hofherr Meat Co. collects, uses, and protects your personal information when you use our website and services.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.page}>
            <h1>Privacy Policy</h1>
            <span className={styles.effective}>Effective: March 12, 2026</span>

            <p>We take your privacy as seriously as we take our dry-aging process. Hofherr Meat Co. (&quot;we,&quot; &quot;us,&quot; or &quot;the folks behind the counter&quot;) operates hofherrmeatco.com. This Privacy Policy explains how we handle your information — no funny business.</p>

            <h2>1. Information We Collect</h2>
            <p>We only collect what we need to get your order right. No more, no less.</p>
            <h3>Information You Provide</h3>
            <ul>
                <li><strong>Order Information:</strong> Name, email, phone number, and preferred pickup time — so we know who&apos;s picking up that beautiful ribeye</li>
                <li><strong>Restock Requests:</strong> Name and contact info, so we can let you know when your favorites are back in the case</li>
                <li><strong>Newsletter:</strong> Email address, if you want the inside scoop on specials and seasonal items</li>
                <li><strong>Catering Inquiries:</strong> Contact details and event info for BBQ catering — we promise to only use it to plan your party</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
                <li><strong>Browser Storage:</strong> Your shopping cart, recent searches, and preferences are saved locally on your device. We never see this data — it&apos;s between you and your browser.</li>
                <li><strong>Usage Data:</strong> Standard server logs (IP address, browser type, pages visited). The boring technical stuff.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>Short version: to get you great meat, and nothing shady.</p>
            <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate order status and pickup details</li>
                <li>Respond to restock requests and catering inquiries</li>
                <li>Send newsletters and specials (only if you asked for them)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations (the un-fun but necessary part)</li>
            </ul>

            <h2>3. Payment Processing</h2>
            <p>We handle the meat. <strong>Stripe</strong> handles the money. We never see, store, or touch your credit card numbers. Stripe is PCI-DSS Level 1 compliant — that&apos;s the gold standard. Their privacy practices are governed by their <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>

            <h2>4. Data Sharing</h2>
            <p>We don&apos;t sell your data. Period. We&apos;re butchers, not data brokers. We only share information with:</p>
            <ul>
                <li><strong>Stripe:</strong> For payment processing</li>
                <li><strong>Email service providers:</strong> To send order confirmations and newsletters</li>
                <li><strong>Legal authorities:</strong> Only when required by law</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>We keep order records for accounting and tax purposes as required by Illinois law. Unlike our steaks, your data doesn&apos;t need to age. You can request deletion at any time by <a href="mailto:info@hofherrmeatco.com?subject=Data%20Deletion%20Request&body=Hi%20Hofherr%20Meat%20Co.%2C%0A%0AI%20would%20like%20to%20request%20deletion%20of%20my%20personal%20data.%0A%0AFull%20Name%3A%20%0AEmail%20on%20file%3A%20%0APhone%20on%20file%3A%20%0A%0AThank%20you.">requesting deletion here</a>.</p>

            <h2>6. Your Rights</h2>
            <p>You&apos;re the boss of your data. Depending on your location, you can:</p>
            <ul>
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Delete your personal data</li>
                <li>Opt out of marketing communications</li>
                <li>Object to data processing</li>
            </ul>
            <p><strong>California Residents (CCPA):</strong> You have the right to know what personal information we collect, request deletion, and opt out of &quot;sales&quot; of personal information. We do not sell personal information.</p>
            <p><strong>Illinois Residents:</strong> We comply with the Illinois Personal Information Protection Act (PIPA). We do not collect biometric data.</p>

            <h2>7. Security</h2>
            <p>We guard your data like we guard our dry-aging room. SSL/TLS encryption on every page, Stripe&apos;s 256-bit encryption for payments, and commercially reasonable security measures across the board.</p>

            <div className={styles.contact}>
                <h2 style={{ borderBottom: 'none', marginTop: 0 }}>Questions? We&apos;re an open book.</h2>
                <p><strong>Hofherr Meat Co.</strong></p>
                <p>📍 <a href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>300 Happ Rd, Northfield, IL 60093</a></p>
                <p>📞 <a href="tel:8474416328">(847) 441-6328</a></p>
                <p>✉️ <a href="mailto:info@hofherrmeatco.com">info@hofherrmeatco.com</a></p>
            </div>
        </div>
    );
}
