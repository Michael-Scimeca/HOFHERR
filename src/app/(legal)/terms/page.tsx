import styles from '../legal.module.css';

export const metadata = {
    title: 'Terms of Service — Hofherr Meat Co.',
    description: 'Terms and conditions governing your use of the Hofherr Meat Co. website and online ordering services.',
};

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <h1>Terms of Service</h1>
            <span className={styles.effective}>Effective: March 12, 2026</span>

            <p>Welcome to Hofherr Meat Co. — where the steaks are high and the terms are fair. By using our website or placing an order, you agree to these Terms. They&apos;re straightforward, we promise.</p>

            <h2>1. Ordering &amp; Pricing</h2>
            <ul>
                <li><strong>Price Estimates:</strong> Many of our products are priced per pound. Online prices are estimates based on standard cuts. Your final charge is determined by <strong>actual weight at the time of cutting</strong> — just like at the counter.</li>
                <li><strong>Custom Cuts:</strong> We love special requests (thickness, trim, quantity). We&apos;ll do our best, but some things depend on what the animal gives us.</li>
                <li><strong>Price Changes:</strong> Market prices fluctuate. We honor the price at the time your order is placed.</li>
                <li><strong>Availability:</strong> All items are subject to availability. If something runs out, we&apos;ll let you know — we won&apos;t just leave you hanging.</li>
            </ul>

            <h2>2. Orders &amp; Pickup</h2>
            <ul>
                <li>Orders are for <strong>in-store pickup only</strong>. We&apos;re old-school like that — come say hi.</li>
                <li>You&apos;ll get a confirmation with pickup details after ordering.</li>
                <li>Orders not picked up within the agreed timeframe may be restocked. Fresh meat waits for no one.</li>
                <li>A valid photo ID may be required at pickup.</li>
            </ul>

            <h2>3. Payment</h2>
            <ul>
                <li>All payments go through <strong>Stripe</strong> — secure, encrypted, the works.</li>
                <li>We accept all major cards, Apple Pay, Google Pay, and PayPal.</li>
                <li>Payment is collected at checkout. Weight adjustments may be processed after pickup.</li>
                <li>Illinois sales tax applies.</li>
            </ul>

            <h2>4. Food Safety &amp; Handling</h2>
            <p>We take pride in our product — here&apos;s how to keep it at its best:</p>
            <ul>
                <li>Refrigerate or freeze everything promptly after pickup. Treat it like the good stuff it is.</li>
                <li>Fresh meats should be consumed or frozen within <strong>3–5 days</strong>.</li>
                <li>Once it leaves our shop, proper handling is on you. We trust you.</li>
                <li>Got allergies? Our facility processes products with common allergens. <strong>Please call us</strong> before ordering if you have severe allergies — we&apos;d rather be safe.</li>
            </ul>

            <h2>5. The Legal Fine Print</h2>
            <p>Our website is provided &quot;as is.&quot; To the maximum extent permitted by Illinois law, we&apos;re not liable for indirect or consequential damages. Any disputes are governed by Illinois law and settled in Cook County courts.</p>

            <div className={styles.contact}>
                <h2 style={{ borderBottom: 'none', marginTop: 0 }}>Got questions? Just ask.</h2>
                <p><strong>Hofherr Meat Co.</strong></p>
                <p>📍 <a href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>300 Happ Rd, Northfield, IL 60093</a></p>
                <p>📞 <a href="tel:8474416328">(847) 441-6328</a></p>
                <p>✉️ <a href="mailto:info@hofherrmeatco.com">info@hofherrmeatco.com</a></p>
            </div>
        </div>
    );
}
