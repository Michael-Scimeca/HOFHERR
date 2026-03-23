import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <div className={styles.tag}>404</div>
                <h1 className={styles.headline}>
                    This cut<br />doesn&apos;t exist.
                </h1>
                <p className={styles.sub}>
                    Looks like you wandered into the walk-in cooler. That page isn&apos;t on the board — but we&apos;ve got plenty of good stuff back at the counter.
                </p>
                <div className={styles.btns}>
                    <Link href="/" className="btn btn-primary">← Back to Home</Link>
                    <Link href="/online-orders" className="btn btn-primary">Order Online</Link>
                    <Link href="/specials" className="btn btn-secondary">See Specials</Link>
                </div>
                <div className={styles.hours}>
                    <span>Need help? Call us:</span>
                    <a href="tel:8474416328">(847) 441-MEAT</a>
                </div>
            </div>
            <div className={styles.bigNum} aria-hidden>404</div>
        </div>
    );
}
