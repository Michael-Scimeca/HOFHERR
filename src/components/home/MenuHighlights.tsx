import Link from 'next/link';
import styles from './MenuHighlights.module.css';

const MENUS = [
    {
        emoji: '🍗',
        title: 'Rotisserie Chicken Dinners',
        desc: 'Pasture-raised whole chickens, hot off the rotisserie with roasted schmaltzy potatoes. Available Tue–Sun. Call ahead to reserve.',
        href: '/rotisserie',
        tag: 'Tue–Sun Fresh',
        bg: 'rgba(199,132,58,0.08)',
    },
    {
        emoji: '🥪',
        title: 'The World\'s Greatest Italian Beef',
        desc: 'As featured on America\'s Test Kitchen "Proof" podcast. Served at our Depot inside Winnetka Elm St. Metra Station, Mon–Fri from 10:30am until sold out.',
        href: '/italian-beef',
        tag: 'Depot Daily',
        bg: 'rgba(192,57,43,0.08)',
    },
    {
        emoji: '🔥',
        title: 'BBQ Catering',
        desc: 'Smoked brisket, pulled pork, ribs, rib tips & hot links, plus all the fixings. From 20 to 500+ guests. 4 days notice required.',
        href: '/bbq',
        tag: 'Events',
        bg: 'rgba(168,74,42,0.08)',
    },
    {
        emoji: '🐷',
        title: 'Whole Hog Pig Roasts',
        desc: 'We arrive, roast, carve, and serve the whole hog for your guests. Includes buffet setup, all paper goods, condiments, and event staff. Min. 50 people.',
        href: '/pig-roasts',
        tag: 'Book Now',
        bg: 'rgba(168,132,42,0.08)',
    },
];


export default function MenuHighlights() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">Our Offerings</div>
                    <h2 className={styles.title}>Menu <em>Highlights</em></h2>
                    <div className="divider" />
                    <p className={styles.sub}>From our rotisserie to our BBQ pit to our custom butcher counter — here's what we do best.</p>
                </div>
                <div className={styles.grid}>
                    {MENUS.map((m) => (
                        <Link key={m.title} href={m.href} className={`card ${styles.card}`} style={{ background: m.bg }}>
                            <div className={styles.emoji}>{m.emoji}</div>
                            <div className={styles.tag}>{m.tag}</div>
                            <h3 className={styles.name}>{m.title}</h3>
                            <p className={styles.desc}>{m.desc}</p>
                            <div className={styles.cta}>Learn More</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
