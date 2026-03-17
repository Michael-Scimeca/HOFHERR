import styles from './Reviews.module.css';

const REVIEWS = [
    { name: "Sarah M.", text: "Best butcher on the North Shore. The ribeyes are incredible — Sean always has something special.", date: "Feb 2026" },
    { name: "Mike T.", text: "The pastrami sandwich is unreal. Fair prices, great staff, and the rotating soup menu never disappoints.", date: "Jan 2026" },
    { name: "Jessica L.", text: "Catered our pig roast for 80 people. On time, perfectly cooked. Already booked again.", date: "Nov 2025" },
    { name: "Tom K.", text: "Three years of Christmas prime rib. Perfect every time. Wouldn't go anywhere else.", date: "Dec 2025" },
];

export default function Reviews() {
    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>What Our <em>Customers Say</em></h2>
                    <div className={styles.overall}>
                        <div className={styles.stars}>★★★★★</div>
                        <span className={styles.rating}>4.7 out of 5</span>
                        <span className={styles.count}>· 200+ Google reviews</span>
                    </div>
                </div>
                <div className={styles.grid}>
                    {REVIEWS.map((r) => (
                        <div key={r.name} className={`card ${styles.card}`}>
                            <p className={styles.text}>"{r.text}"</p>
                            <div className={styles.footer}>
                                <div className={styles.name}>{r.name}</div>
                                <div className={styles.date}>{r.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.cta}>
                    <a href="https://g.page/hofherrmeatco/review" target="_blank" rel="noreferrer" className="btn btn-secondary">
                        Leave a Review on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
