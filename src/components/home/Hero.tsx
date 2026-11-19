import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './Hero.module.css';
import HeroVideo from './HeroVideo';
import LazyTrophy from './LazyTrophy';

export default function Hero() {
    return (
        <section className={styles.hero} data-asset-editor-root="true">
            <div className={styles.bg} />


            {/* Hero background/column video */}
            <div className={styles.heroVideoCol}>
                <video
                    src="/assets/video/3.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={styles.heroVideoPlayer}
                />
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
                        {/* Headline + bubble */}
                        <div className={styles.headlineWrap}>
                            <h1 className={styles.headline}>
                                <span>Quality Meats.</span>
                                <span className={styles.accent}>No Compromise.</span>
                            </h1>
                            <div className={styles.floatingMedia}>
                                <HeroVideo />

                                <LazyTrophy className={styles.heroTrophy} />
                            </div>
                        </div>

                        <p className={styles.sub}>
                            Custom cuts, whole hog pig roasts, rotisserie chicken, and seasonal specials —
                            all from our family-run shop at 300 Happ Rd, Northfield.
                            Every animal traceable to a named family farm.
                        </p>

                        {/* CTAs */}
                        <div className={styles.ctas}>
                            <Link href="/online-orders" className="btn-hit">
                                <span className="btn btn-primary">
                                    <FireBorder active={true} radius={6} />
                                    Order Online
                                </span>
                            </Link>
                            <Link href="/catering#build-your-package" className="btn-hit">
                                <span className="btn btn-secondary">Build a Catering Package</span>
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
                        <div className={styles.statNum}>10+</div>
                        <div className={styles.statLabel}>Years Open</div>
                    </div>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <div className={styles.statNum}>100%</div>
                        <div className={styles.statLabel}>Traceable Sourcing</div>
                    </div>
                    <div className={styles.statDiv} />
                    <a href="https://g.page/hofherrmeatco/review" target="_blank" rel="noreferrer" className={`${styles.stat} ${styles.statLink}`}>
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
