import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './Hero.module.css';
import HeroBackdropVideo from './HeroBackdropVideo';
import HeroVideo from './HeroVideo';
import HolidayHeroStrip from './HolidayHeroStrip';

export default function Hero() {
    return (
        <section className={styles.hero} data-asset-editor-root="true">
            <div className={styles.bg} />

            {/* Hero background: video on desktop (>1024px), lightweight 26KB image on tablet & mobile */}
            <HeroBackdropVideo />

            <div className={`container ${styles.content}`}>


                {/* Two-column: text left, floating media right */}
                <div className={styles.heroGrid}>
                    <div className={styles.heroText}>
                        {/* Headline + bubble */}
                        <div className={styles.headlineWrap}>
                            <h1 className={styles.headline}>
                                <span>Quality Meats.</span>
                                <span className={styles.accent}>No Compromise.</span>
                            </h1>
                            <div className={styles.floatingMedia}>
                                <HeroVideo />
                            </div>
                        </div>

                        <p className={styles.sub}>
                            Craft butchery across two North Shore locations — every animal traceable to a named
                            family farm. Visit <strong>The Butcher Shop</strong> for custom cuts &amp; catering,
                            or stop by <strong>The Depot</strong> for hot lunch, coffee &amp; grab-and-go staples.
                        </p>

                        {/* Open two-location guide & direct routing */}
                        <div className={styles.locations} aria-label="Choose a Hofherr Meat Co. location">
                            <div className={`${styles.locationCol} ${styles.locationButcher}`}>
                                <div className={styles.locationHeader}>
                                    <span className={styles.locationName}>The Butcher Shop</span>
                                    <span className={styles.locationTown}>Northfield · 300 Happ Rd</span>
                                </div>
                                <p className={styles.locationDesc}>
                                    Full-service custom butcher block — hand-cut USDA Prime &amp; dry-aged steaks,
                                    whole roasts, house sausages &amp; BBQ catering.
                                </p>
                                <div className={styles.locationLinks}>
                                    <Link href="/online-orders?store=butcher" className={styles.locationAction}>
                                        Go to Butcher Shop →
                                    </Link>
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.locationMapLink}
                                    >
                                        Directions ↗
                                    </a>
                                </div>
                            </div>

                            <div className={`${styles.locationCol} ${styles.locationDepot}`}>
                                <div className={styles.locationHeader}>
                                    <span className={styles.locationName}>The Depot</span>
                                    <span className={styles.locationTown}>Winnetka · 754 Elm St (Metra)</span>
                                </div>
                                <p className={styles.locationDesc}>
                                    Commuter café &amp; butcher outpost — ATK-featured Italian Beef, rotisserie
                                    chicken, Sparrow Coffee, pastries &amp; grab-and-go cuts.
                                </p>
                                <div className={styles.locationLinks}>
                                    <Link href="/online-orders?store=depot" className={styles.locationActionDepot}>
                                        Go to The Depot →
                                    </Link>
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=754+Elm+St,+Winnetka,+IL+60093"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.locationMapLink}
                                    >
                                        Directions ↗
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Automatic Holiday-Aware Spotlight (switches by Chicago calendar date or ?holiday=<id>) */}
                        <HolidayHeroStrip />

                        {/* CTAs */}
                        <div className={styles.ctas}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">
                                    <FireBorder active={true} radius={6} />
                                    Order Online
                                </span>
                            </Link>
                            <Link href="/catering#build-your-package" className="btn-hit">
                                <span className="btn btn-secondary">
                                    <FireBorder active={true} radius={6} />
                                    Build a Catering Package
                                </span>
                            </Link>
                            <Link href="/newsletter" className={`btn-hit ${styles.subscribeHit}`}>
                                <span className={`btn ${styles.subscribeBtn}`}>✉️ Subscribe</span>
                            </Link>
                        </div>

                        <p className={styles.subscribeNote}>
                            <strong className={styles.subscribeNoteLead}>Why subscribe?</strong>{' '}
                            Tuesday first dibs on small-batch dry-aged drops, member-only weekly cut pricing &amp; 48-hr early access to holiday roasts — one email a week, zero spam.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statNum}>2</div>
                        <div className={styles.statLabel}>North Shore Shops</div>
                    </div>
                    <div className={styles.statDiv} />
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
                    <a href="https://g.page/hofherrmeatco/review" target="_blank" rel="noopener noreferrer" className={`${styles.stat} ${styles.statLink}`}>
                        <div className={styles.statNum}>4.7★</div>
                        <div className={styles.statLabel}>200+ Google Reviews</div>
                    </a>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <div className={styles.statNum}>ATK</div>
                        <div className={styles.statLabel}>Proof Podcast Featured</div>
                    </div>
                </div>
            </div>

        </section>
    );
}
