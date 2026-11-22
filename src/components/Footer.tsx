'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import FooterMap from './FooterMap';

function phoneHref(phone: string) {
    return 'tel:' + phone.replace(/[^\d]/g, '');
}

export default function Footer() {
    const s = useSiteSettings();
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

    return (
        <footer className={styles.footer} data-site-footer="true">
            <div className="line-accent" />

            {/* Interactive map with location toggle */}
            {!isAdmin && <FooterMap />}

            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Image
                            src="/assets/logo.svg"
                            alt={s.shopName}
                            height={64}
                            width={134}
                            className={styles.logoImg}
                            loading="eager"
                        />
                    </div>
                    <p className={styles.tagline}>Premium, traceable meats. Custom cuts, rotisserie chicken, seasonal specials, and world-class catering — all from our shop in Northfield, IL.</p>
                    <div className={styles.socials}>
                        <a href={s.instagram} target="_blank" rel="noreferrer" className={`${styles.social} ${styles.socialInstagram}`}>Instagram</a>
                        <a href={s.facebook} target="_blank" rel="noreferrer" className={`${styles.social} ${styles.socialFacebook}`}>Facebook</a>
                        <a href={s.yelp} target="_blank" rel="noreferrer" className={`${styles.social} ${styles.socialYelp}`}>Yelp</a>
                    </div>
                </div>

                <div className={styles.cols}>
                    <div className={styles.col}>
                        <div className={styles.colTitle}>Order</div>
                        <Link href="/online-orders">Order Online</Link>
                        <Link href="/specials">Specials</Link>
                        <Link href="/online-orders">Custom Orders</Link>
                        <Link href="/catering#build-your-package">Holiday Pre-Orders</Link>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.colTitle}>BBQ &amp; Catering</div>
                        <Link href="/catering">Overview</Link>
                        <Link href="/catering#build-your-package">BBQ Menu</Link>
                        <Link href="/catering#build-your-package">Pricing &amp; Quote</Link>
                        <Link href="/catering#beyond-bbq" className={styles.link}>Pig Roasts &amp; Events</Link>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.colTitle}>Discover</div>
                        <Link href="/selections">Our Selections</Link>
                        <Link href="/selections#cut-guide">Cut Guide</Link>
                        <Link href="/recipes">Recipes</Link>
                        <Link href="/faq">FAQ</Link>
                        <Link href="/our-story">Our Story</Link>
                        <Link href="/our-story#press">Press</Link>
                        <Link href="/jobs">Jobs</Link>
                        <Link href="/gift-cards">Gift Cards</Link>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.colTitle}>Legal</div>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>


            <div className={styles.bottom}>
                <div className={`container ${styles.bottomInner}`}>
                    <div className={styles.contact}>
                        <span>📞 <a href={phoneHref(s.phone)}>{s.phone}</a></span>
                        <span className={styles.emailWrap}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.emailIcon}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
                            <a href="mailto:butcher@hofherrmeatco.com">butcher@hofherrmeatco.com</a>
                        </span>
                    </div>
                    <div className={styles.locations}>
                        <div className={styles.location}>
                            <Link href="/online-orders?store=butcher" className={styles.locationTitle}>The Butcher Shop</Link>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093" target="_blank" rel="noopener noreferrer" className={styles.locationAddr}>📍 300 Happ Rd, Northfield, IL 60093</a>
                            <div className={styles.hours}>
                                {s.butcherHours?.map((h) => (
                                    h.isClosed ? (
                                        <span key={h.day} className={styles.hoursClosed}><strong>{h.day.slice(0, 3)}</strong> Closed</span>
                                    ) : (
                                        <span key={h.day}><strong>{h.day.slice(0, 3)}</strong> {h.open}–{h.close}</span>
                                    )
                                ))}
                            </div>
                        </div>
                        <div className={styles.location}>
                            <Link href="/online-orders?store=depot" className={styles.locationTitle}>The Depot</Link>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=754+Elm+St,+Winnetka,+IL+60093" target="_blank" rel="noopener noreferrer" className={styles.locationAddr}>📍 754 Elm St, Winnetka, IL 60093</a>
                            <div className={styles.hours}>
                                {s.depotHours?.map((h) => (
                                    h.isClosed ? (
                                        <span key={h.day} className={styles.hoursClosed}><strong>{h.day.slice(0, 3)}</strong> Closed</span>
                                    ) : (
                                        <span key={h.day}><strong>{h.day.slice(0, 3)}</strong> {h.open}–{h.close}</span>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copy}>
                <p>© {new Date().getFullYear()} {s.shopName} All rights reserved.</p>
                <div className={styles.legalLinks}>
                    <Link href="/privacy">Privacy Policy</Link>
                    <span> · </span>
                    <Link href="/terms">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
