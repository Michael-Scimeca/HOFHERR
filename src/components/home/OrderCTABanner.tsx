import ActionButton from '@/components/ActionButton';
import { SITE_CONTACT } from '@/lib/siteContact';
import styles from './OrderCTABanner.module.css';

export default function OrderCTABanner() {
    return (
        <div className={styles.banner}>
            <div className={styles.overlay} />
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <div className={styles.label}>Skip the line</div>
                    <div className={styles.text}>Order online. Pick up in-store or curbside.</div>
                </div>
                <div className={styles.right}>
                    <ActionButton href={SITE_CONTACT.phoneHref} variant="secondary">
                        📞 Call to Order
                    </ActionButton>
                    <ActionButton href="/online-orders" variant="primary" fire>
                        Order Online Now
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
