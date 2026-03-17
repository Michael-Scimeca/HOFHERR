import Link from 'next/link';
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
                    <a href="tel:8474416328" className="btn btn-secondary">📞 Call to Order</a>
                    <Link href="/online-orders" className="btn btn-primary">Order Online Now</Link>
                </div>
            </div>
        </div>
    );
}
