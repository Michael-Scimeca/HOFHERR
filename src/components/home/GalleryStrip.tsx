import styles from './GalleryStrip.module.css';

// Placeholder tiles — swap with real Unsplash/shop photos
const TILES = [
    { label: 'The Counter', emoji: '🔪', bg: 'rgba(199,132,58,0.15)', wide: true },
    { label: 'Dry Aging Room', emoji: '🥩', bg: 'rgba(168,74,42,0.12)', wide: false },
    { label: 'Rotisserie', emoji: '🍗', bg: 'rgba(212,168,71,0.1)', wide: false },
    { label: 'Pig Roast', emoji: '🐷', bg: 'rgba(168,132,58,0.12)', wide: false },
    { label: 'In-Store', emoji: '🏪', bg: 'rgba(199,132,58,0.1)', wide: false },
];

export default function GalleryStrip() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className="section-label">Life at the Shop</div>
                    <h2 className={styles.title}>A Peek <em>Inside</em></h2>
                    <div className="divider" />
                </div>
                <div className={styles.grid}>
                    {TILES.map((t) => (
                        <div
                            key={t.label}
                            className={`${styles.tile} ${t.wide ? styles.tileWide : ''}`}
                            style={{ background: t.bg }}
                        >
                            <div className={styles.tileInner}>
                                <div className={styles.tileEmoji}>{t.emoji}</div>
                                <div className={styles.tileLabel}>{t.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.footer}>
                    <a
                        href="https://www.instagram.com/hofherrmeatco"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ margin: '0 auto' }}
                    >
                        📸 Follow @hofherrmeatco on Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
