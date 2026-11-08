import styles from './page.module.css';

export default function CateringHeroAndProcess() {
    return (
            <div className={styles.topCombinedWrap}>
                {/* ── Hero ── */}
                    <section className={styles.hero}>
                        <div className={`container ${styles.heroInner}`}>
                            <div className="section-label">Events &amp; Catering</div>
                            <h1 className={styles.headline}>
                                Feeding a <em>Crowd?</em>
                            </h1>
                            <p className={styles.sub}>
                                From backyard pig roasts to corporate BBQ spreads — Hofherr handles it all.
                                Custom menus, full-service setup, and food people actually talk about.
                            </p>
                            <div className={styles.heroBtns}>
                                <a href="#build-your-package" className="btn btn-primary">Build Your Package</a>
                                <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                            </div>
                        </div>
                    </section>

                    {/* ── How It Works ── */}
                        <section className={`${styles.processSection} ${styles.processWithBg}`}>
                            <div className={styles.sectionBgMedia} aria-hidden="true" />
                            <div className={`container ${styles.processContent}`}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>How It Works</h2>
                                </div>
                                <div className={styles.steps}>
                                    <div className={styles.step}>
                                        <div className={styles.stepNum}>1</div>
                                        <h3>Build Your Package</h3>
                                        <p>Choose your event type, pick your meats &amp; sides, and get an instant estimate — all right here on the page.</p>
                                    </div>
                                    <div className={styles.step}>
                                        <div className={styles.stepNum}>2</div>
                                        <h3>Pick a Date</h3>
                                        <p>Select your event date on our live availability calendar. We require a minimum of 4 days notice.</p>
                                    </div>
                                    <div className={styles.step}>
                                        <div className={styles.stepNum}>3</div>
                                        <h3>We Handle Everything</h3>
                                        <p>Submit your inquiry and Sean confirms within 24 hours. We arrive with food, setup, serving, and cleanup.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    );
}
