import cx from 'classnames';
import styles from './page.module.css';

export const metadata = {
    title: 'Jobs | Hofherr Meat Co.',
    description: 'Work at Hofherr Meat Co. We are always looking to grow our team.',
};

const POSITIONS = [
    { title: 'Dishwasher', description: 'Keep the kitchen running smoothly.' },
    { title: 'Meat Cutter', description: 'Master your craft with the finest cuts.' },
    { title: 'Cashier', description: 'Deliver exceptional service to our customers.' }
];

export default function JobsPage() {
    return (
        <main className={styles.main}>
            <section className={cx(styles.hero)} style={{ padding: '120px 0 100px' }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <div className="section-label">Join Our Team</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                        <h1 className="hero-title">Work at Hofherr Meat Co.</h1>
                        <p className="hero-desc">
                            We are always looking to grow our team. We offer health care plans, retirement savings accounts, and other great perks!
                        </p>
                        <a href="mailto:jobs@hofherrmeatco.com" className="btn btn-primary" style={{ padding: '22px 56px' }}>
                            Email Us Your Resume
                        </a>
                    </div>
                </div>
            </section>

            <section className={cx('section-sm', styles.positionsSection)}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className={styles.sectionTitle}>Open Positions</h2>
                    <div className={styles.jobList}>
                        {POSITIONS.map((job) => (
                            <div key={job.title} className={styles.jobCard}>
                                <div className={styles.jobInfo}>
                                    <h3 className={styles.jobTitle}>{job.title}</h3>
                                    <p className={styles.jobDesc}>{job.description}</p>
                                </div>
                                <a href={`mailto:jobs@hofherrmeatco.com?subject=Applying for ${job.title} position`} className="btn btn-secondary">
                                    Apply
                                </a>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.generalAppBox}>
                        <h3>Don't see your role?</h3>
                        <p>We're always looking for talented people. Send us your resume anyway!</p>
                        <a href="mailto:jobs@hofherrmeatco.com?subject=General Application" className="btn btn-outline">
                            General Application
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
