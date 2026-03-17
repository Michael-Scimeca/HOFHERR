import Link from 'next/link';
import styles from './SourcingStrip.module.css';

const FARMS = [
    {
        emoji: '🐄',
        name: 'Traceable Beef',
        farm: 'Named Family Farms',
        desc: 'Every cut is traceable to the family farm where it was raised. We know the farmers and vet their practices personally.',
    },
    {
        emoji: '🍗',
        name: 'Pasture-Raised Poultry',
        farm: 'Regional Farms',
        desc: 'The chickens you get off our rotisserie are pasture-raised — the same quality we\'d serve our own families.',
    },
    {
        emoji: '🐷',
        name: 'Heritage Pork',
        farm: 'Family Farms',
        desc: 'Pork sourced from family farms with high animal welfare standards. Hand-selected by Sean for quality and flavor.',
    },
    {
        emoji: '🔪',
        name: 'Cut to Order',
        farm: 'In-House Butchery',
        desc: 'Every item in our shop has been hand-selected. Cuts are made to order to ensure the freshest quality possible.',
    },
];

export default function SourcingStrip() {
    return (
        <section className={`section ${styles.section}`}>
            <div className={styles.bg} />
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <div className="section-label">Where It Comes From</div>
                        <h2 className={styles.title}>We Know the<br /><em>Farm. You Should Too.</em></h2>
                        <div className="divider divider-left" />
                        <p className={styles.sub}>
                            Every animal we sell is traceable to a named farm. We visit our partners,
                            vet their practices, and only carry what we'd serve our own families.
                        </p>
                        <Link href="/sourcing" className="btn btn-secondary" style={{ marginTop: '24px' }}>
                            Meet Our Farm Partners
                        </Link>
                    </div>
                    <div className={styles.standards}>
                        <div className={styles.standardsTitle}>Our Non-Negotiables</div>
                        {[
                            '✓  No antibiotics, ever',
                            '✓  No added hormones',
                            '✓  Humane animal welfare standards',
                            '✓  Harvested within 150 miles when possible',
                            '✓  We know the farmer by name',
                        ].map(s => (
                            <div key={s} className={styles.standard}>{s}</div>
                        ))}
                    </div>
                </div>

                <div className={styles.farms}>
                    {FARMS.map((f) => (
                        <div key={f.name} className={styles.farm}>
                            <div className={styles.farmEmoji}>{f.emoji}</div>
                            <div className={styles.farmInfo}>
                                <div className={styles.farmName}>{f.name}</div>
                                <div className={styles.farmOrigin}>{f.farm}</div>
                                <div className={styles.farmDesc}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
