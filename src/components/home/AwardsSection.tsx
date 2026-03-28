import styles from './AwardsSection.module.css';
import ModelViewer from '../ModelViewer';

const AWARDS = [
    {
        num: '01',
        title: "America's Test Kitchen",
        desc: "Featured globally on the official 'Proof' podcast highlighting elite regional craft butchers.",
        model: 'trophy.glb'
    },
    {
        num: '02',
        title: "Chicago Ribfest",
        desc: "Multi-year Grand Champions for our signature dry-rub smoked baby back ribs and craft sauces.",
        model: 'Meshy_AI_Golden_Rib_Trophy_0326175031_texture.glb',
    },
    {
        num: '03',
        title: "North Shore Magazine",
        desc: "Voted 'Best Butcher Shop' consecutively by local residents for uncompromising quality and sourcing.",
        model: 'Meshy_AI_beef_0326194052_texture.glb',
    },
    {
        num: '04',
        title: "200+ Five Star Reviews",
        desc: "A flawless 4.7★ Google rating driven by our obsessive attention to detail and personalized service.",
        model: 'Meshy_AI_200_0326202748_texture.glb'
    }
];

export default function AwardsSection() {
    return (
        <section className={styles.awards}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Award-Winning <em>Excellence</em>
                    </h2>
                    <p className={styles.subtitle}>
                        We don’t compromise on quality, sourcing, or technique. The proof is in the hardware.
                    </p>
                </div>

                <div className={styles.list}>
                    {AWARDS.map((award, index) => (
                        <div key={award.num} className={styles.item} style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className={styles.number}>{award.num}</div>
                            <div className={styles.content}>
                                <h3 className={styles.awardTitle}>{award.title}</h3>
                                <p className={styles.awardDesc}>{award.desc}</p>
                                {award.model && (
                                    <div className={styles.modelContainer} style={{ width: '200px', height: '200px', marginTop: '1rem' }}>
                                        <ModelViewer modelPath={`/3D/${award.model}`} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
