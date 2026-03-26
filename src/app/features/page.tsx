import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Project Features & Documentation | Hofherr Meat Co.',
    robots: 'noindex, nofollow', // Keep it out of search engines
};

export default function FeaturesDocPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <Link href="/" style={{ color: 'var(--gold, #c7843a)', textDecoration: 'none', fontWeight: 600 }}>&larr; Back to Home</Link>
                </div>
                
                <h1 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '4rem', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
                    Project Features &amp; Architecture
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '64px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px' }}>
                    A high-level overview of the capabilities, workflows, and integrations built into the Hofherr Meat Co. web platform.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {/* ── CORE TECH STACK ── */}
                    <section>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--gold, #c7843a)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            1. Core Tech Stack
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li>
                                <strong>Next.js (App Router):</strong> Leverages React Server Components for ultra-fast initial page loads and superior SEO, while using Client Components only where interactivity is needed (like maps, timelines, and carts).
                            </li>
                            <li>
                                <strong>Sanity CMS (Headless):</strong> A fully customized backend studio that allows non-technical staff to update global site banners, catering packages, team members, history timelines, and product inventories in real-time.
                            </li>
                            <li>
                                <strong>GSAP &amp; Framer Motion:</strong> Powers the "Dark Luxury" aesthetic with buttery-smooth parallax effects, scroll-triggered reveals, and the highly interactive "Our Story" timeline.
                            </li>
                        </ul>
                    </section>

                    {/* ── E-COMMERCE & ORDERS ── */}
                    <section>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--gold, #c7843a)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            2. E-Commerce &amp; Ordering System
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li>
                                <strong>Multi-Store Support:</strong> Distinct order flows for "The Butcher Shop" (Northfield) and "The Depot" (Winnetka) ensuring the correct inventory, store hours, and pickup locators are shown based on the user's selection.
                            </li>
                            <li>
                                <strong>Stripe Integration:</strong> Completely handles checkout sessions, credit card securely capturing, and verifying payment state via server-side API routes.
                            </li>
                            <li>
                                <strong>Persistent Cart:</strong> Zustand/Local-storage backed shopping cart so users don't lose their selected cuts if they navigate away or refresh the page.
                            </li>
                            <li>
                                <strong>Smart Pricing:</strong> Mixed inventory capabilities (flat rate items alongside per-pound estimations that get finalized at pickup).
                            </li>
                        </ul>
                    </section>

                    {/* ── INTERACTIVE FEATURES ── */}
                    <section>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--gold, #c7843a)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            3. Native Interactive Components
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li>
                                <strong>Persistent Chat Widget:</strong> A floating chat interface to capture customer inquiries, answer FAQs instantly, and route complex questions to the butcher.
                            </li>
                            <li>
                                <strong>Custom Maps Integration:</strong> Fully styled map instances using Leaflet, color-matched to the brand's dark aesthetic, plotting distinct marker pins for both locations.
                            </li>
                            <li>
                                <strong>Dynamic Marquees &amp; Carousels:</strong> Ultra-smooth infinite scrolling tickers and service carousels that work seamlessly across desktop and mobile.
                            </li>
                        </ul>
                    </section>

                    {/* ── DESIGN & CONTENT ── */}
                    <section>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--gold, #c7843a)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            4. Specialized Layouts &amp; Pages
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li>
                                <strong>Interactive Cut Guide:</strong> An anatomical explorer mapping the animal with detailed descriptions, cooking methods, and direct purchase links for each cut.
                            </li>
                            <li>
                                <strong>Catering Planner:</strong> A multi-tiered pricing page with interactive calculators, scalable "What We Offer" grids, and hardcoded VIP "Private Meat Session" invitations.
                            </li>
                            <li>
                                <strong>Our Story (Heritage Timeline):</strong> A highly complex GSAP-powered timeline with scrolling bezier paths, revealing team members, and audio-reactive historical video clips.
                            </li>
                        </ul>
                    </section>
                    {/* ── ACCOUNTS & CHECKLIST ── */}
                    <section style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: '#fff', textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1 }}>
                            Pre-Launch Accounts Checklist
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
                            You will need admin access and/or active billing on the following third-party services to launch and run this platform:
                        </p>
                        
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>1. Vercel (Hosting)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>~$20/mo</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Hosts the Next.js application, serverless functions, and manages the domain routing. The "Pro" tier ($20/mo) is recommended for commercial performance and team access, though the Free/Hobby tier is technically possible for low traffic.
                                </p>
                            </li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>2. Sanity CMS (Database & Content)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / $15+</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Provides the admin studio where you edit products, timelines, and catering options. The free tier is extremely generous. You only pay if you exceed 10GB bandwidth/mo or need additional user seats ($15/user).
                                </p>
                            </li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>3. Stripe (Payments)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>2.9% + 30¢ / transaction</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Handles credit card processing securely. No monthly fee, but standard transaction processing fees apply per online order.
                                </p>
                            </li>
                            <li>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>4. Transactional Email API (Resend)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / $20+</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Required to send automated Order Confirmation emails to customers and notification emails directly to the shop/butchers. Free up to 3000 emails/mo.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>5. Mailchimp (Newsletter &amp; Marketing)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / Tiered based on contacts</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Handles the "Meat Matrix" Newsletter signups located at the bottom of the pages. The free tier covers basic signup forms and small email blasts.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>6. Google Analytics (GA4)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Required for tracking website traffic, measuring online order conversion rates, and understanding visitor behavior. Completely free to use.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold, #c7843a)' }}>7. Twilio (Chatbox SMS API)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Pay-as-you-go (~$1/mo)</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Powers the floating chatbox. When a customer submits a question, Twilio instantly converts the web chat into a real SMS text message sent directly to Sean&apos;s phone, allowing him to text the customer back instantly.
                                </p>
                            </li>
                        </ul>
                    </section>
                </div>

                <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>This URL (`/features`) is unlisted and blocked from search engines via robots tags.</p>
                </div>
            </div>
        </main>
    );
}
