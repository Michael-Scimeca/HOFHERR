import cx from 'classnames';
import styles from './page.module.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Jobs & Careers | Hofherr Meat Co. — Northfield, IL',
    description: 'Join the team at Hofherr Meat Co. — one of Chicago\'s North Shore premier butcher shops. Open positions in butchery, customer service, and kitchen. Health care, retirement savings & more.',
    alternates: { canonical: 'https://hofherrmeatco.com/jobs' },
    openGraph: {
        title: 'Jobs & Careers | Hofherr Meat Co.',
        description: 'Work with passionate craftspeople at Hofherr Meat Co. Open roles in Northfield, IL.',
        url: 'https://hofherrmeatco.com/jobs',
        images: [{ url: '/OG/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jobs & Careers | Hofherr Meat Co.',
        description: 'Join the Hofherr Meat Co. team in Northfield, IL. Health care, retirement & great perks.',
    },
};

const POSITIONS = [
    { title: 'Dishwasher', description: 'Keep the kitchen running smoothly.' },
    { title: 'Meat Cutter', description: 'Master your craft with the finest cuts.' },
    { title: 'Cashier', description: 'Deliver exceptional service to our customers.' }
];

export default function JobsPage() {
    const jobSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: POSITIONS.map((job, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'JobPosting',
                title: job.title,
                description: job.description,
                hiringOrganization: {
                    '@type': 'Organization',
                    name: 'Hofherr Meat Co.',
                    sameAs: 'https://hofherrmeatco.com',
                },
                jobLocation: {
                    '@type': 'Place',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '300 Happ Rd',
                        addressLocality: 'Northfield',
                        addressRegion: 'IL',
                        postalCode: '60093',
                        addressCountry: 'US',
                    },
                },
                employmentType: 'FULL_TIME',
                datePosted: new Date().toISOString().split('T')[0],
            },
        })),
    };

    return (
        <main className={styles.main}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
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
