import Link from 'next/link';
import styles from './WeeklyPicks.module.css';

const PICKS = [
    {
        name: "Whole Rotisserie Chicken",
        cut: "Chicken · Whole Bird",
        origin: "Pasture-Raised",
        price: "Call to Reserve",
        emoji: "🍗",
        tag: "Ready Now",
        tagColor: "red",
        desc: "Hot off the rotisserie with roasted schmaltzy potatoes. Available Tue–Sun. Call 847-441-MEAT to reserve your bird.",
    },
    {
        name: "St. Patrick's Day Corned Beef",
        cut: "Beef · Brisket Cure",
        origin: "House-Cured",
        price: "Call for Pricing",
        emoji: "🍀",
        tag: "Seasonal",
        tagColor: "seasonal",
        desc: "House-cured corned beef and Irish pork available through St. Patrick's Day 2026. Pre-order now — they sell out every year.",
    },
    {
        name: "Chicago Italian Beef",
        cut: "Beef · Thin Sliced",
        origin: "Depot Location",
        price: "Depot Only",
        emoji: "🥪",
        tag: "ATK Featured",
        tagColor: "gold",
        desc: "As featured on America's Test Kitchen 'Proof' podcast. Served Mon–Fri from 10:30am at our Winnetka Metra Depot — until sold out.",
    },
    {
        name: "VIP Curbside Pickup",
        cut: "Any Order",
        origin: "300 S. Happ Rd.",
        price: "By Request",
        emoji: "🚗",
        tag: "Exclusive",
        tagColor: "green",
        desc: "VIP curbside pickup and local delivery available on request. Call ahead or order online and we'll have it ready when you arrive.",
    },
];


export default function WeeklyPicks() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <div className="section-label">Weekly Feature</div>
                        <h2 className={styles.title}>Butcher's<br /><em>Weekly Picks</em></h2>
                        <div className="divider divider-left" />
                        <p className={styles.sub}>
                            Sean's hand-selected cuts this week — what's freshest, what's at peak quality, what you should be cooking right now.
                        </p>
                    </div>
                    <div className={styles.meta}>
                        <div className={styles.week}>Week of March 7, 2026</div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {PICKS.map((pick) => (
                        <div key={pick.name} className={`card ${styles.card}`}>
                            <div className={styles.cardTop}>
                                <div className={styles.emoji}>{pick.emoji}</div>
                                <span className={`tag tag-${pick.tagColor}`}>{pick.tag}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cutLabel}>{pick.cut} · {pick.origin}</div>
                                <h3 className={styles.cutName}>{pick.name}</h3>
                                <p className={styles.desc}>{pick.desc}</p>
                            </div>
                            <div className={styles.cardFoot}>
                                <div className={styles.price}>{pick.price}</div>
                                <Link href="/online-orders" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '11px' }}>Order Now</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
