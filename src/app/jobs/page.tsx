import Link from 'next/link';
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
        department: 'Butcher Counter · Northfield Flagship',
        schedule: 'Full-Time · Competitive Pay + Benefits',
        description:
            'Master your craft breaking down whole-animal beef, heritage pork, lamb, and poultry. Cut steaks and roasts to custom counter specifications and assist North Shore guests with cooking guidance.',
    },
    {
        title: 'Cashier & Counter Associate',
        department: 'Guest Service · Northfield & Winnetka Depot',
        schedule: 'Full-Time / Part-Time · Flexible Shifts',
        description:
            'Deliver warm, knowledgeable hospitality at the butcher counter and register. Coordinate online order pickups, wrap custom parcels in kraft paper, and help guests navigate our daily cases.',
    },
    {
        title: 'Dishwasher & Kitchen Utility',
        department: 'Scratch Kitchen & Smokehouse · Northfield',
        schedule: 'Full-Time / Part-Time · Competitive Hourly',
        description:
            'Keep our scratch kitchen, rotisserie, and butcher block sanitized, organized, and running smoothly throughout daily prep and service.',
    },
];

const PERKS = [
    {
        title: 'Health Care Plans',
        detail: 'Comprehensive medical coverage options for full-time team members.',
    },
    {
        title: 'Retirement Savings',
        detail: 'Retirement savings accounts to help you build long-term financial security.',
    },
    {
        title: 'Craft Apprenticeship',
        detail: 'Hands-on training in whole-animal seam butchery, dry-aging, and smokehouse prep.',
    },
    {
        title: 'Shop Discounts & Meals',
        detail: 'Generous team discounts on custom cuts, scratch meals, and daily kitchen fare.',
    },
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
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <h1 className={styles.headline}>
                            WORK AT <em>HOFHERR MEAT CO.</em>
                        </h1>
                        <p className={styles.sub}>
                            We are always looking to grow our team of craftspeople, cooks, and counter hosts. We offer
                            health care plans, retirement savings accounts, and a true neighborhood butcher shop culture.
                        </p>
                        <div className={styles.heroActions}>
                            <a href="mailto:jobs@hofherrmeatco.com" className="btn-hit">
                                <span className="btn btn-gold">Email Us Your Resume</span>
                            </a>
                            <a href="tel:8474416328" className="btn-hit">
                                <span className="btn btn-secondary">Call (847) 441-MEAT</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Open Positions & Benefits Grid ── */}
            <section id="open-positions" aria-labelledby="open-positions-heading" className="section">
                <div className="container">
                    <div className={styles.jobsGrid}>
                        {/* Benefits & Shop Info Sidebar */}
                        <aside className={styles.sidebar} aria-label="Benefits and Shop Culture">
                            <div className={styles.perksPanel}>
                                <h2 className={styles.sidebarHeading}>TEAM BENEFITS &amp; PERKS</h2>
                                <div className={styles.perksList}>
                                    {PERKS.map((perk) => (
                                        <div key={perk.title} className={styles.perkItem}>
                                            <strong className={styles.perkTitle}>{perk.title}</strong>
                                            <p className={styles.perkDesc}>{perk.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.locationsCard}>
                                <span className={styles.cardKicker}>TWO NORTH SHORE SHOPS</span>
                                <div className={styles.locBlock}>
                                    <strong>Northfield Butcher Shop</strong>
                                    <span>300 Happ Rd · Northfield, IL 60093</span>
                                </div>
                                <div className={styles.locBlock}>
                                    <strong>The Depot · Winnetka</strong>
                                    <span>780 Elm St · Winnetka, IL 60093</span>
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
