'use client';

import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './HelpOrdering.module.css';

export default function HelpOrdering() {
    return (
        <section id="help-ordering" aria-labelledby="help-ordering-heading" className={styles.banner}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.textSide}>
                    <h2 id="help-ordering-heading" className={styles.title}>
                        Need Help Ordering?
                    </h2>
                    <p className={styles.desc}>
                        Can&apos;t find what you&apos;re looking for? Want to order a whole animal, custom cut,
                        or bulk quantity? Just reach out — Sean handles these personally.
                    </p>
                </div>
                <div className={styles.ctaSide}>
                    <a href="tel:8474416328" className="btn-hit">
                        <span className={`btn btn-primary ${styles.btnPrimary}`}>
                            <FireBorder active={true} radius={6} />
                            <span>📞 Call (847) 441-MEAT</span>
                        </span>
                    </a>
                    <a href="mailto:butcher@hofherrmeatco.com" className="btn-hit">
                        <span className={`btn btn-secondary ${styles.btnSecondary}`}>
                            <span>✉️ Email Us</span>
                        </span>
                    </a>
                    <Link href="/catering#get-a-quote" className="btn-hit">
                        <span className={`btn btn-secondary ${styles.btnSecondary}`}>
                            <span>Custom &amp; Wholesale</span>
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
