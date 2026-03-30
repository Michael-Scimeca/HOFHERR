import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { SIGNATURE_PRODUCTS_QUERY, CATERING_EVENTS_QUERY } from '@/sanity/queries';
import NewsletterInline from '@/components/NewsletterInline';
import CateringCalendar from '@/components/CateringCalendar';
import Link from 'next/link';
import { auth } from '@/auth';
import { CUSTOMER_BY_EMAIL_QUERY, ORDER_HISTORY_QUERY } from '@/sanity/queries';
import FeaturedUserOrder from './FeaturedUserOrder';

export const metadata: Metadata = {
    title: 'Featured Capabilities | Hofherr Meat Co.',
    description: 'A showcase of our interactive capabilities including chat, email, catering setup, and CMS integrations.',
};

export default async function FeaturedPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);
    
    // Fetch data from Sanity CMS
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Auth and User data
    const session = await auth();
    let userOrder: any = null;
    let userName = 'Guest User';
    let userEmail = 'Not Logged In';

    let signatures = [];
    let cateringEvents = [];
    
    try {
        [signatures, cateringEvents] = await Promise.all([
            sanityClient.fetch(SIGNATURE_PRODUCTS_QUERY),
            sanityClient.fetch(CATERING_EVENTS_QUERY, { today: todayStr })
        ]);

        if (session?.user?.email) {
            userEmail = session.user.email;
            userName = session.user.name || 'Customer';
            const customerRecord = await sanityClient.fetch(CUSTOMER_BY_EMAIL_QUERY, { email: userEmail });
            if (customerRecord?._id) {
                const orderHistory = await sanityClient.fetch(ORDER_HISTORY_QUERY, { customerId: customerRecord._id });
                if (orderHistory && orderHistory.length > 0) {
                    userOrder = orderHistory[0];
                }
            }
        }
    } catch (err) {
        console.error("Error fetching Sanity CMS data on Featured Page:", err);
    }

    return (
        <main style={{ padding: '120px 24px 64px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '16px', color: 'var(--red)' }}>
                Featured Capabilities
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', marginBottom: '64px' }}>
                Showcasing the core interactive functionalities of the Hofherr Meat Co. platform.
            </p>

            <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>1. Interactive Chatbox</h2>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                    The ChatWidget is globally injected into the layout. You can trigger it programmatically or via hash links to pre-fill subjects, offering immediate connection to customers.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href="#chat" className="btn btn-primary">Open Chat (General)</Link>
                    <Link href="#chat?subject=Catering Inquiry" className="btn btn-secondary">Open Chat (Catering)</Link>
                </div>
            </section>

            <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>2. Email Newsletter Integration</h2>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                    Seamless email capture component that scales inside any parent container and integrates directly with our customer subscription system.
                </p>
                <div style={{ maxWidth: '400px' }}>
                    <NewsletterInline />
                </div>
            </section>

            <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>3. Setup Calculator & Calendar</h2>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                    Dynamic catering calendar component featuring minimum lead times, date availability checks, and integrated booking forms. Connected directly to CMS.
                </p>
                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #ffffff1a' }}>
                    <CateringCalendar events={cateringEvents || []} />
                </div>
            </section>

            <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>4. Sanity CMS Studio</h2>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                    Full embedded access to the Sanity Studio natively on this page. Edit your Signature Products, Site Settings, or Catering Packages right here.
                </p>
                <div style={{ height: '700px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ffffff1a' }}>
                    <iframe 
                        src="/studio" 
                        style={{ width: '100%', height: '100%', border: 'none' }} 
                        title="Sanity CMS Studio"
                    />
                </div>
            </section>

            <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '24px' }}>5. User Profile & Repurchase</h2>
                <p style={{ color: 'var(--fg-muted)', marginBottom: '24px' }}>
                    A demonstration of the authenticated user experience. We pull your latest order natively from the backend and allow a one-click repurchase to seamlessly populate the checkout cart.
                </p>
                <div style={{ maxWidth: '500px' }}>
                    {session ? (
                        <FeaturedUserOrder order={userOrder} userEmail={userEmail} userName={userName} />
                    ) : (
                        <div style={{ padding: '24px', background: '#000', borderRadius: '12px', border: '1px dashed var(--border)', color: 'var(--fg-muted)' }}>
                            <p style={{ margin: 0 }}>You are not logged in. Log in via the <Link href="/online-orders" style={{ color: 'var(--red)', textDecoration: 'none' }}>shop page</Link> to view your profile dashboard capability here.</p>
                        </div>
                    )}
                </div>
            </section>
        
            <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '48px', color: 'var(--red)' }}>Project Architecture & Documentation</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {/* ── CORE TECH STACK ── */}
                    <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--red)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            6. Core Tech Stack
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
                    <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--red)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            7. E-Commerce & Ordering System
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
                    <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--red)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            8. Native Interactive Components
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
                    <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--red)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            9. Specialized Layouts & Pages
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

                    {/* ── ADMIN / OWNER PORTAL ── */}
                    <section style={{ marginBottom: '80px', background: 'var(--bg-2)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'var(--font-yanone), sans-serif', fontSize: '2.5rem', color: 'var(--red)', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            10. Owner Portal & Admin Dashboard
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li>
                                <strong>Secure Admin Login:</strong> Protected route located at <code>/admin</code> providing secure authentication to Hofherr staff and owners to view sensitive business data.
                            </li>
                            <li>
                                <strong>Comprehensive Order Tracking:</strong> A live, filterable table detailing all user purchases, including lifetime customer spend, order history, and dynamic drop-downs to change order statuses.
                            </li>
                            <li>
                                <strong>Restock Request Management:</strong> A dedicated queue for out-of-stock item requests. Displays the requested item, quantity, selected store, and direct customer phone/email contact info with a one-click delete to resolve the queue quickly.
                            </li>
                            <li>
                                <strong>Sales Analytics Visuals:</strong> Dynamic charting to display the status distribution of current orders alongside revenue summaries to measure shop performance.
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
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>1. Vercel (Hosting)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>~$20/mo</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Hosts the Next.js application, serverless functions, and manages the domain routing. The "Pro" tier ($20/mo) is recommended for commercial performance and team access, though the Free/Hobby tier is technically possible for low traffic.
                                </p>
                            </li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>2. Sanity CMS (Database & Content)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / $15+</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Provides the admin studio where you edit products, timelines, and catering options. The free tier is extremely generous. You only pay if you exceed 10GB bandwidth/mo or need additional user seats ($15/user).
                                </p>
                            </li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>3. Stripe (Payments)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>2.9% + 30¢ / transaction</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Handles credit card processing securely. No monthly fee, but standard transaction processing fees apply per online order.
                                </p>
                            </li>
                            <li>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>4. Transactional Email API (Resend)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / $20+</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Required to send automated Order Confirmation emails to customers and notification emails directly to the shop/butchers. Free up to 3000 emails/mo.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>5. Mailchimp (Newsletter &amp; Marketing)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free / Tiered based on contacts</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Handles the "Meat Matrix" Newsletter signups located at the bottom of the pages. The free tier covers basic signup forms and small email blasts.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>6. Google Analytics (GA4)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Free</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Required for tracking website traffic, measuring online order conversion rates, and understanding visitor behavior. Completely free to use.
                                </p>
                            </li>
                            <li style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--red)' }}>7. Twilio (Chatbox SMS API)</strong>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Pay-as-you-go (~$1/mo)</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    Powers the floating chatbox. When a customer submits a question, Twilio instantly converts the web chat into a real SMS text message sent directly to Sean&apos;s phone, allowing him to text the customer back instantly.
                                </p>
                            </li>
                        </ul>
                    </section>
                </div>

                
        </main>
    );
}
