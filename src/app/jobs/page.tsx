import Link from 'next/link';
import ActionButton from '@/components/ActionButton';
import PageHero from '@/components/PageHero';
import { SITE_CONTACT } from '@/lib/siteContact';
import styles from './page.module.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Jobs & Careers | Hofherr Meat Co. — Northfield, IL',
    description:
        "Join the team at Hofherr Meat Co. — one of Chicago's North Shore premier butcher shops. Open positions in butchery, customer service, and kitchen. Health care, retirement savings & more.",
    alternates: { canonical: 'https://hofherrmeatco.com/jobs' },
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Jobs & Careers | Hofherr Meat Co.',
        description: 'Work with passionate craftspeople at Hofherr Meat Co. Open roles in Northfield, IL.',
        url: 'https://hofherrmeatco.com/jobs',
        images: [{ url: '/OG/og-image.jpg', width: 1200, height: 630, alt: 'Jobs — Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jobs & Careers | Hofherr Meat Co.',
        description: 'Join the Hofherr Meat Co. team in Northfield, IL. Health care, retirement & great perks.',
    },
};

const POSITIONS = [
    {
        title: 'Meat Cutter',
        department: 'Butcher Counter · Northfield',
        schedule: 'Full-Time / Part-Time',
        description: 'Master your craft with the finest cuts at our full-service butcher counter.',
    },
    {
        title: 'Cashier',
        department: 'Guest Service · Northfield & Winnetka Depot',
        schedule: 'Full-Time / Part-Time',
        description: 'Deliver exceptional service to our customers at the counter and register.',
    },
    {
        title: 'Dishwasher',
        department: 'Kitchen · Northfield',
        schedule: 'Full-Time / Part-Time',
        description: 'Keep the kitchen clean, organized, and running smoothly throughout daily service.',
    },
];

const PERKS = [
    'Health Care Plans',
    'Retirement Savings Accounts',
    'Other Great Perks',
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
                datePosted: '2026-11-09',
            },
        })),
    };

    return (
        <main className={styles.main}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema).replace(/</g, '\\u003c') }}
            />

            {/* ── Hero ── */}
            <PageHero
                title={
                    <>
                        WORK AT <em>HOFHERR MEAT CO.</em>
                    </>
                }
                lead="We are always looking to grow our team. We offer health care plans, retirement savings accounts, and other great perks!"
            >
                <ActionButton href={SITE_CONTACT.jobsEmailHref} variant="primary">
                    Email Us Your Resume
                </ActionButton>
                <ActionButton href={SITE_CONTACT.phoneHref} variant="secondary">
                    Call {SITE_CONTACT.phoneDisplay}
                </ActionButton>
            </PageHero>

            {/* ── Open Positions & Benefits Grid ── */}
            <section id="open-positions" aria-labelledby="open-positions-heading" className="section">
                <div className="container">
                    <div className={styles.jobsGrid}>
                        {/* Benefits & Shop Info Sidebar */}
                        <aside className={styles.sidebar} aria-label="Benefits and Shop Culture">
                            <div className={styles.perksPanel}>
                                <h2 className={styles.sidebarHeading}>TEAM BENEFITS &amp; PERKS</h2>
                                <ul className={styles.perksList}>
                                    {PERKS.map((perk) => (
                                        <li key={perk} className={styles.perkRow}>
                                            <span className={styles.perkDot} aria-hidden="true" />
                                            <strong className={styles.perkTitle}>{perk}</strong>
                                        </li>
                                    ))}
                                </ul>
                                <p className={styles.perksNote}>
                                    Eligibility and plan details are shared when you apply.
                                </p>
                            </div>

                            <div className={styles.locationsCard}>
                                <span className={styles.cardKicker}>TWO NORTH SHORE SHOPS</span>
                                <div className={styles.locBlock}>
                                    <strong>Northfield Butcher Shop</strong>
                                    <span>300 Happ Rd · Northfield, IL 60093</span>
                                </div>
                                <div className={styles.locBlock}>
                                    <strong>The Depot · Winnetka</strong>
                                    <span>754 Elm St · Winnetka, IL 60093</span>
                                </div>
                                <Link href="/our-story" className="btn btn-outline">
                                    Read Our Story
                                </Link>
                            </div>
                        </aside>

                        {/* Open Roles Column */}
                        <div className={styles.positionsColumn}>
                            <div className={styles.groupHeader}>
                                <h2 id="open-positions-heading" className={styles.sectionTitle}>
                                    OPEN POSITIONS
                                </h2>
                                <span className={styles.roleCount}>{POSITIONS.length} Active Roles</span>
                            </div>

                            <div className={styles.jobList}>
                                {POSITIONS.map((job) => (
                                    <article key={job.title} className={styles.jobCard}>
                                        <div className={styles.jobInfo}>
                                            <div className={styles.jobMetaRow}>
                                                <span className={styles.jobDept}>{job.department}</span>
                                                <span className={styles.jobSchedule}>{job.schedule}</span>
                                            </div>
                                            <h3 className={styles.jobTitle}>{job.title}</h3>
                                            <p className={styles.jobDesc}>{job.description}</p>
                                        </div>
                                        <div className={styles.jobAction}>
                                            <a
                                                href={`mailto:jobs@hofherrmeatco.com?subject=Applying for ${encodeURIComponent(job.title)} position`}
                                                className="btn-hit"
                                            >
                                                <span className="btn btn-gold">Apply Now</span>
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* General Application 60/40 Action Board */}
                            <div className={styles.generalAppBoard}>
                                <div className={styles.generalAppLeft}>
                                    <h3 className={styles.generalAppTitle}>DON&apos;T SEE YOUR ROLE?</h3>
                                    <p className={styles.generalAppDesc}>
                                        We&apos;re always looking for talented cutters, cooks, and counter pros. Send your
                                        resume or a quick note to <strong>jobs@hofherrmeatco.com</strong> and introduce
                                        yourself.
                                    </p>
                                </div>
                                <div className={styles.generalAppRight}>
                                    <span className={styles.dispatchKicker}>OPEN APPLICATION</span>
                                    <a
                                        href="mailto:jobs@hofherrmeatco.com?subject=General Application — Hofherr Meat Co."
                                        className="btn-hit"
                                    >
                                        <span className="btn btn-gold">General Application</span>
                                    </a>
                                    <a href="tel:8474416328" className="btn-hit">
                                        <span className="btn btn-secondary">Call (847) 441-MEAT</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
