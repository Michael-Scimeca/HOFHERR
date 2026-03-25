import Link from 'next/link';
import styles from './RecipeTeasers.module.css';

const RECIPES = [
    {
        emoji: '🍗',
        title: 'Rotisserie Chicken with Schmaltzy Potatoes',
        time: 'Ready Tue–Sun',
        difficulty: 'Easy',
        method: 'Rotisserie',
        desc: 'Pasture-raised whole chickens roasted low and slow, served hot with roasted potatoes cooked in the drippings. Call ahead to reserve yours.',
        tag: 'Special',
        tagColor: '#c7843a',
        href: '/rotisserie',
    },
    {
        emoji: '🥪',
        title: 'Chicago Italian Beef',
        time: 'Mon–Fri · 10:30am',
        difficulty: 'Easy',
        method: 'Braised & Sliced',
        desc: 'As featured on America\'s Test Kitchen "Proof" podcast. Served at the Depot in the Winnetka Metra Station — until sold out. Don\'t sleep on it.',
        tag: 'ATK Featured',
        tagColor: '#a84a3a',
        href: '/italian-beef',
    },
    {
        emoji: '🍀',
        title: 'St. Patrick\'s Day Corned Beef',
        time: 'Limited Season',
        difficulty: 'Easy',
        method: 'Braised',
        desc: 'House-cured corned beef and Irish pork, available now through St. Patrick\'s Day. Pre-order to guarantee yours — these go fast every year.',
        tag: 'St. Pat\'s 2026',
        tagColor: '#3a7a3a',
        href: '/specials',
    },
];


export default function RecipeTeasers() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <div className="section-label">From Our Kitchen</div>
                        <h2 className={styles.title}>Recipes &amp; <em>Cooking Guides</em></h2>
                        <div className="divider divider-left" />
                        <p className={styles.sub}>
                            The cut is half the battle. Here's how to actually cook it.
                            Sean's tested recipes — built around what we stock every week.
                        </p>
                    </div>
                    <Link href="/specials" className="btn btn-primary" style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
                        Browse All Recipes
                    </Link>
                </div>

                <div className={styles.grid}>
                    {RECIPES.map((r) => (
                        <Link key={r.title} href={r.href} className={`card ${styles.card}`}>
                            <div className={styles.cardTop}>
                                <div className={styles.emoji}>{r.emoji}</div>
                                <div className={styles.cardMeta}>
                                    <span className={styles.tag} style={{ borderColor: r.tagColor + '44', color: r.tagColor, background: r.tagColor + '18' }}>{r.tag}</span>
                                    <span className={styles.method}>{r.method}</span>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.recipeName}>{r.title}</h3>
                                <p className={styles.recipeDesc}>{r.desc}</p>
                            </div>
                            <div className={styles.cardFoot}>
                                <div className={styles.stat}><span>⏱</span> {r.time}</div>
                                <div className={styles.stat}><span>📊</span> {r.difficulty}</div>
                                <div className={styles.readMore}>Read Recipe</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerText}>🔍 Looking for a specific cut? <Link href="/cut-guide">Browse our Cut Guide</Link> to learn what method works best.</div>
                </div>
            </div>
        </section>
    );
}
