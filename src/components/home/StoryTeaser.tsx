import Link from 'next/link';
import styles from './StoryTeaser.module.css';

export default function StoryTeaser() {
    return (
        <section className={`section ${styles.section}`}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.image}>
                    <div className={styles.imgFrame}>
                        <div className={styles.imgPlaceholder}>🥩</div>
                    </div>
                    <div className={styles.badge}>Est. 2014 · Northfield, IL</div>
                </div>
                <div className={styles.content}>
                    <div className="section-label">Our Story</div>
                    <h2 className={styles.title}>Respect for the Past, <em>Eye to the Future</em></h2>
                    <div className="divider divider-left" />
                    <p className={styles.body}>
                        Sean Hofherr comes from a long line of butchers — beginning with a great-great-grandfather who was a village butcher in Germany, through to his immigrant great-grandfather who built a successful meat packing company on <strong>Chicago's South Side</strong>: the original Hofherr Meat Company.
                    </p>
                    <p className={styles.body}>
                        After honing his skills at Keefer's Restaurant in River North, an apprenticeship at Zier's Prime Meats in Wilmette, and winning the 2009 North Shore Chili Cookoff, Sean opened Hofherr Meat Co. in 2014 to bring that family legacy back to Chicago's North Shore. He's an active member of the Butcher's Guild and the Illinois Barbecue Association.
                    </p>
                    <Link href="/our-story" className="btn btn-primary" style={{ marginTop: '28px' }}>
                        Read Our Story
                    </Link>
                </div>
            </div>
        </section>
    );
}

