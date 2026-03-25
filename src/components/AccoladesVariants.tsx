'use client';
import styles from './AccoladesVariants.module.css';

const ACCOLADES = [
    { icon: '🏆', text: 'North Shore Chili Cookoff', suffix: 'Winner',  type: 'win',   year: '2009', category: 'Competition Win' },
    { icon: '🏆', text: 'Lake Bluff Ribfest',         suffix: 'Winner',  type: 'win',   year: '2010', category: 'Competition Win' },
    { icon: '🥈', text: 'Northfield Ribfest',          suffix: 'Top 3',  type: 'top3',  year: '2008', category: 'Top 3 Finish' },
    { icon: '🥈', text: 'North Shore Chili Cookoff',   suffix: 'Top 3',  type: 'top3',  year: '2010', category: 'Top 3 Finish' },
    { icon: '🥈', text: 'Des Plaines Rib, Chicken & Sausage Winter Burn Off', suffix: 'Top 3', type: 'top3', year: '2011', category: 'Top 3 Finish' },
    { icon: '🔪', text: "Member, Butcher's Guild",     suffix: null,     type: 'guild', year: null,   category: 'Guild Member' },
    { icon: '🔥', text: 'Member, Illinois Barbecue Association', suffix: null, type: 'guild', year: null, category: 'Guild Member' },
    { icon: '🎙️', text: "As Featured on America's Test Kitchen \"Proof\" Podcast", suffix: null, type: 'media', year: null, category: 'Press Feature' },
];

const BIG_STATS = [
    { num: '5',   label: 'Competition Wins' },
    { num: '2',   label: 'Guild Memberships' },
    { num: '10+', label: 'Years Competing' },
    { num: '1',   label: 'National Feature' },
];

export default function AccoladesVariants({ accolades: _a }: { accolades?: string[] }) {
    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Recognition</span>
                    <h2 className={styles.title}>Awards &amp; <em>Affiliations</em></h2>
                </div>

                <div className={styles.splitLayout}>
                    {/* ── Left: stat wall ── */}
                    <div className={styles.statWall}>
                        <div className={styles.statWallCopy}>
                            <h3>Proven.<em>Recognized.</em></h3>
                            <p>Sean's culinary accolades span over a decade — from competition wins across Chicago's North Shore to national press features and active industry memberships.</p>
                        </div>
                        <div className={styles.bigStats}>
                            {BIG_STATS.map(s => (
                                <div key={s.label} className={styles.bigStat}>
                                    <span className={styles.bigStatNum}>{s.num}</span>
                                    <span className={styles.bigStatLabel}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: masonry ── */}
                    <div className={styles.right}>
                        <div className={styles.masonry}>
                            {ACCOLADES.map((a, i) => (
                                <div
                                    key={i}
                                    className={`${styles.masonryCard} ${a.type === 'win' ? `${styles.masonryWin} ${styles.masonryTall}` : ''}`}
                                >
                                    <span className={styles.masonryIcon}>{a.icon}</span>
                                    <span className={styles.masonryTag}>{a.category}{a.year ? ` · ${a.year}` : ''}</span>
                                    <div className={styles.masonryText}>
                                        {a.text}{a.suffix && <span className={styles.masonrySuffix}> — {a.suffix}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
