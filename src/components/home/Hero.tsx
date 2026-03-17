import Link from 'next/link';
import styles from './Hero.module.css';
import HeroVideo from './HeroVideo';

const SCHEDULE: Record<number, [number, number] | null> = {
    0: [600, 960],   // Sun 10am–4pm
    1: null,         // Mon closed
    2: [600, 1080],  // Tue 10am–6pm
    3: [600, 1080],
    4: [600, 1080],
    5: [600, 1080],
    6: [600, 1020],  // Sat 10am–5pm
};

function isOpen() {
    const now = new Date();
    const h = SCHEDULE[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    return h ? mins >= h[0] && mins < h[1] : false;
}

export default function Hero() {
    const open = isOpen();
    const responseText = open ? '· Responds within the hour' : '· Leave a message — we\'ll reply soon';
    return (
        <section className={styles.hero}>
            <div className={styles.bg}>
                <div className={styles.bgImage} />
                <div className={styles.bgOverlay} />
            </div>

            <div className={`container ${styles.content}`}>

                {/* Eyebrow */}
                <div className={styles.eyebrow}>
                    <span className={styles.dot} />
                    <span>Craft Butchery · Northfield, IL · Est. 2014</span>
                </div>

                {/* ATK Badge */}
                <div className={styles.badge}>
                    🏆 As Featured on America&apos;s Test Kitchen &ldquo;Proof&rdquo; Podcast
                </div>

                {/* Two-column: text left, video right */}
                <div className={styles.heroGrid}>
                    <div className={styles.heroText}>
                        {/* Headline */}
                        <h1 className={styles.headline}>
                            <span>Quality Meats.</span>
                            <span className={styles.accent}>No Compromise.</span>
                        </h1>

                        <p className={styles.sub}>
                            Custom cuts, whole hog pig roasts, rotisserie chicken, and seasonal specials —
                            all from our family-run shop at 300 Happ Rd, Northfield.
                            Every animal traceable to a named family farm.
                        </p>

                        {/* CTAs */}
                        <div className={styles.ctas}>
                            <Link href="/online-orders" className="btn btn-primary">Order Online</Link>
                            <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                        </div>

                        {/* SMS strip */}
                        <a
                            href="sms:8474416328&body=Hi%20Hofherr!%20I%20had%20a%20question%20about%20"
                            className={styles.smsStrip}
                        >
                            <span className={styles.smsBubble}>💬</span>
                            <span>Text us at (847) 441-6328</span>
                            <span className={styles.smsResponse}>{responseText}</span>
                        </a>
                    </div>

                    {/* Video */}
                    <HeroVideo />
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statNum}>10+</div>
                        <div className={styles.statLabel}>Years Open</div>
                    </div>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <div className={styles.statNum}>100%</div>
                        <div className={styles.statLabel}>Traceable Sourcing</div>
                    </div>
                    <div className={styles.statDiv} />
                    <a href="https://g.page/hofherrmeatco/review" target="_blank" rel="noreferrer" className={styles.stat} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        <div className={styles.statNum}>4.7★</div>
                        <div className={styles.statLabel}>200+ Google Reviews</div>
                    </a>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <div className={styles.statNum}>ATK</div>
                        <div className={styles.statLabel}>Featured</div>
                    </div>
                </div>
            </div>

        </section>
    );
}
