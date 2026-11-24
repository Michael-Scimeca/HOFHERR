import Image from 'next/image';
import ActionButton from '@/components/ActionButton';
import styles from './HolidayCateringTeaser.module.css';

export default function HolidayCateringTeaser() {
    return (
        <section
            id="holiday-catering-cta"
            aria-labelledby="holiday-catering-cta-heading"
            className="section-sm"
        >
            <div className="container">
                <div className={styles.banner}>
                    <Image
                        src="/assets/holidays/december-holidays-prime-rib.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 1400px) 100vw, 1400px"
                        className={styles.bgImg}
                        aria-hidden="true"
                    />
                    <div className={styles.scrim} aria-hidden="true" />

                    <div className={styles.copy}>
                        <h2 id="holiday-catering-cta-heading" className={styles.heading}>
                            Hosting a <em>Holiday</em> or Big Gathering?
                        </h2>
                        <p className={styles.sub}>
                            From fresh heritage Thanksgiving turkeys and tied Prime rib roasts to Fourth of July
                            whole-pig roasts and Super Bowl brisket spreads — see every holiday centerpiece,
                            lead time, and catering play before allocation fills.
                        </p>
                        <ul className={styles.highlights} aria-label="Holiday catering highlights">
                            <li>12 Major Holidays Covered</li>
                            <li>Custom Trimmed &amp; Tied</li>
                            <li>Serves 20 to 500+ Guests</li>
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <ActionButton href="/catering/holidays" variant="primary">
                            Explore Holiday Guide →
                        </ActionButton>
                        <ActionButton href="/catering#build-your-package" variant="secondary" fire>
                            Build a Package
                        </ActionButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
