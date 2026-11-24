import Image from 'next/image';
import ActionButton from '@/components/ActionButton';
import styles from './HomeTeaserBento.module.css';

export default function HomeTeaserBento() {
    return (
        <section
            id="holiday-catering-cta"
            aria-labelledby="holiday-catering-cta-heading"
            className="section-sm"
        >
            <div className="container">
                <div className={styles.bento}>
                    {/* ── Top Full-Width Featured Banner: Holidays & Catering ── */}
                    <article className={`${styles.card} ${styles.cardHoliday}`}>
                        <Image
                            src="/assets/holidays/december-holidays-prime-rib.jpg"
                            alt=""
                            fill
                            sizes="(max-width: 1400px) 100vw, 1400px"
                            className={styles.bgImg}
                            aria-hidden="true"
                        />
                        <div className={styles.scrimHoliday} aria-hidden="true" />

                        <div className={styles.holidayBody}>
                            <div className={styles.holidayCopy}>
                                <h2 id="holiday-catering-cta-heading" className={styles.heading}>
                                    Hosting a <em>Holiday</em> or Big Gathering?
                                </h2>
                                <p className={styles.sub}>
                                    From fresh heritage Thanksgiving turkeys and tied Prime rib roasts to Fourth of
                                    July whole-pig roasts and Super Bowl brisket spreads — see every holiday
                                    centerpiece, lead time, and catering play before allocation fills.
                                </p>
                                <ul className={styles.highlights} aria-label="Holiday catering highlights">
                                    <li>12 Major Holidays Covered</li>
                                    <li>Custom Trimmed &amp; Tied</li>
                                    <li>Serves 20 to 500+ Guests</li>
                                </ul>
                            </div>

                            <div className={styles.holidayActions}>
                                <ActionButton href="/catering/holidays" variant="primary">
                                    Explore Holiday Guide →
                                </ActionButton>
                                <ActionButton href="/catering#build-your-package" variant="secondary" fire>
                                    Build a Package
                                </ActionButton>
                            </div>
                        </div>
                    </article>

                    {/* ── Bottom 2-Column Split: Recipes & Our Story ── */}
                    <div className={styles.splitRow}>
                        {/* Left: Recipes & Parcel Sheets */}
                        <article className={`${styles.card} ${styles.cardRecipes}`}>
                            <Image
                                src="/assets/recipes/herb-butter-roast-turkey.jpg"
                                alt=""
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                className={styles.bgImg}
                                aria-hidden="true"
                            />
                            <div className={styles.scrimRecipes} aria-hidden="true" />

                            <div className={styles.splitContent}>
                                <div className={styles.cardTop}>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Recipes &amp; 12×16&quot; Sheets</span>
                                        <span className={styles.metaChip}>18+ Guides</span>
                                    </div>
                                    <h3 className={styles.headingSub}>
                                        Cook It <em>Like We Do</em>
                                    </h3>
                                    <p className={styles.sub}>
                                        Recipes for every occasion and season, dinner bundles, and printable
                                        12×16&quot; parcel cooking sheets paired directly to your Hofherr cuts.
                                    </p>
                                </div>

                                <div className={styles.cardFoot}>
                                    <span className={styles.footTags}>Prime Rib · Brisket · Turkey</span>
                                    <ActionButton href="/recipes" variant="primary">
                                        Browse Recipes →
                                    </ActionButton>
                                </div>
                            </div>
                        </article>

                        {/* Right: 120-Year Family Story */}
                        <article className={`${styles.card} ${styles.cardStory}`}>
                            <Image
                                src="/images/visit/shop-interior.jpg"
                                alt=""
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                className={styles.bgImg}
                                aria-hidden="true"
                            />
                            <div className={styles.scrimStory} aria-hidden="true" />

                            <div className={styles.splitContent}>
                                <div className={styles.cardTop}>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Est. 1903 · 4 Generations</span>
                                        <span className={styles.metaChip}>1903 → 2025</span>
                                    </div>
                                    <h3 className={styles.headingSub}>
                                        Respect for the Past, <em>Eye to the Future</em>
                                    </h3>
                                    <p className={styles.sub}>
                                        A village butcher in Germany, a meat packing company on Chicago&apos;s South
                                        Side, and in 2014, Sean Hofherr bringing that family legacy back to the North
                                        Shore.
                                    </p>
                                </div>

                                <div className={styles.cardFoot}>
                                    <span className={styles.footTags}>Northfield &amp; Winnetka</span>
                                    <ActionButton href="/our-story" variant="primary">
                                        Read Our Story →
                                    </ActionButton>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}

