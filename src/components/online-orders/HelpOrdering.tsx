'use client';
import styles from './HelpOrdering.module.css';

export default function HelpOrdering() {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.textSide}>
                    <h2 className={styles.title}>Need Help Ordering?</h2>
                    <p className={styles.desc}>
                        Can&apos;t find what you&apos;re looking for? Want to order a whole animal, custom cut, 
                        or bulk quantity? Just reach out — Sean handles these personally.
                    </p>
                </div>
                <div className={styles.ctaSide}>
                    <a href="tel:8474416328" className={styles.btnPrimary}>
                        <span className={styles.icon}>📞</span> CALL (847) 441-MEAT
                    </a>
                    <a href="mailto:butcher@hofherrmeatco.com" className={styles.btnSecondary}>
                        <span className={styles.icon}>✉️</span> EMAIL US
                    </a>
                    <a href="/catering#get-a-quote" className={styles.btnSecondary}>
                        CUSTOM & WHOLESALE
                    </a>
                </div>
            </div>
        </section>
    );
}
