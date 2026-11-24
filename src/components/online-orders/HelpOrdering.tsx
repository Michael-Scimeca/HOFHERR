'use client';

import ActionButton from '@/components/ActionButton';
import { SITE_CONTACT } from '@/lib/siteContact';
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
                    <ActionButton
                        href={SITE_CONTACT.phoneHref}
                        variant="primary"
                        fire
                        innerClassName={styles.btnPrimary}
                    >
                        <span>📞 Call {SITE_CONTACT.phoneDisplay}</span>
                    </ActionButton>
                    <ActionButton
                        href={SITE_CONTACT.emailHref}
                        variant="secondary"
                        innerClassName={styles.btnSecondary}
                    >
                        <span>✉️ Email Us</span>
                    </ActionButton>
                    <ActionButton
                        href="/catering#get-a-quote"
                        variant="secondary"
                        innerClassName={styles.btnSecondary}
                    >
                        <span>Custom &amp; Wholesale</span>
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}
