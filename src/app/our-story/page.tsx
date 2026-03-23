import type { Metadata } from 'next';
import Image from 'next/image';
import HoverVideo from '@/components/HoverVideo';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { TEAM_MEMBERS_QUERY, TIMELINE_QUERY, ACCOLADES_QUERY } from '@/sanity/queries';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Our Story | Hofherr Meat Co. — 120+ Years of Craft Butchery',
    description: 'From a village butcher in Germany to Chicago\'s South Side to Northfield and Winnetka — the Hofherr family has been perfecting the craft for over 120 years. Meet Sean Hofherr, owner, head butcher, and winner of the North Shore Chili Cookoff.',
    alternates: { canonical: 'https://hofherrmeatco.com/our-story' },
    openGraph: {
        title: 'Our Story | Hofherr Meat Co.',
        description: 'Over 120 years of butchering heritage. Chicago South Side roots, now serving Northfield & Winnetka with the same uncompromising quality.',
        url: 'https://hofherrmeatco.com/our-story',
        images: [{ url: '/OG/og-our-story.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Story | Hofherr Meat Co.',
        description: '120+ years of craft butchery. Family heritage from Chicago\'s South Side to the North Shore.',
    },
};

/* ── Fallbacks ── */
const FALLBACK_TIMELINE = [
    { era: 'Late 1800s', title: 'The Old Country', body: 'A Hofherr great-great-grandfather plies his trade as a village butcher in Germany — a craft handed down and carried across the Atlantic.' },
    { era: 'Early 1900s', title: 'Chicago\'s South Side', body: 'His son, an immigrant, establishes the original Hofherr Meat Company on Chicago\'s storied South Side, building a name among the city\'s legendary stockyard community.' },
    { era: '2009 – 2013', title: 'Earning His Stripes', body: 'Sean sharpens his craft at Keefer\'s Restaurant in River North, then apprentices at Zier\'s Prime Meats in Wilmette. He wins the 2009 North Shore Chili Cookoff and the 2010 Lake Bluff Ribfest before directing the kitchen at Stormy\'s Tavern in Northfield.' },
    { era: 'March 2014', title: 'Hofherr Meat Co. Opens', body: '300 Happ Rd, Northfield. A new chapter — and a return to roots. Every cut made to order. Every animal traceable to a named family farm.' },
    { era: '2024', title: 'The Depot Opens', body: 'Sean expands to a second location — The Depot, inside the historic Winnetka Elm Street Metra Train Station at 754 Elm St. A convenient pick-up spot bringing the same Hofherr quality to the North Shore commuter corridor.' },
];

const FALLBACK_TEAM = [
    { name: 'Vincent Recaei', role: 'Manager', photo: '/team/vincent.jpg', bio: 'The guy behind the scenes. Vincent manages the day-to-day operations alongside Sean, keeping everything running smoothly so the team can focus on craft.' },
    { name: 'Emily Cushing', role: 'Butcher', photo: '/team/emily.jpg', bio: 'Emily holds a degree in Meat Processing from the University of Wisconsin–Platteville. Her expertise and passion for the craft ensures every customer gets knowledgeable, personal service.' },
    { name: 'Dan Blair', role: 'Butcher', photo: '/team/dan.jpg', bio: 'A Northfield native, Dan came to HMC from the meat counter at Mariano\'s. He brings years of experience and a deep knowledge of cuts and customer care.' },
    { name: 'Jamie Bisoulis', role: 'Head Chef', photo: '/team/jamie.jpg', bio: 'Jamie has been with the shop since the very beginning. She runs the kitchen — ensuring the highest quality in every soup, side, sauce, and prepared dish that leaves the counter.' },
    { name: 'Steve Soler', role: 'Chef', photo: '/team/steve.jpg', bio: 'Steve met Sean at a charity event and they bonded over pork belly and sauerkraut. That conversation turned into a partnership that elevates everything coming out of the HMC kitchen.' },
];

const FALLBACK_ACCOLADES = [
    '🏆 2009 North Shore Chili Cookoff — Winner',
    '🏆 2010 Lake Bluff Ribfest — Winner',
    '🥈 2008 Northfield Ribfest — Top 3',
    '🥈 2010 North Shore Chili Cookoff — Top 3',
    '🥈 2011 Des Plaines Rib, Chicken & Sausage Winter Burn Off — Top 3',
    '🔪 Member, Butcher\'s Guild',
    '🔥 Member, Illinois Barbecue Association',
    '🎙️ As Featured on America\'s Test Kitchen "Proof" Podcast',
];

type TeamMember = { name: string; role: string; photo?: string | null; bio?: string | null };
type TimelineItem = { era: string; title: string; body?: string | null };
type Accolade = { text: string };

export default async function OurStoryPage() {
    const { isEnabled: preview } = await draftMode();
    const sanityClient = getClient(preview);

    let team: TeamMember[] = FALLBACK_TEAM;
    let timeline: TimelineItem[] = FALLBACK_TIMELINE;
    let accolades: string[] = FALLBACK_ACCOLADES;

    try {
        const [rawTeam, rawTimeline, rawAccolades] = await Promise.all([
            sanityClient.fetch(TEAM_MEMBERS_QUERY),
            sanityClient.fetch(TIMELINE_QUERY),
            sanityClient.fetch(ACCOLADES_QUERY),
        ]);
        if (rawTeam?.length) {
            /* Merge local fallback photos for members missing a Sanity photo */
            const fallbackMap = new Map(FALLBACK_TEAM.map((m) => [m.name.toLowerCase(), m.photo]));
            team = rawTeam.map((m: TeamMember) => ({
                ...m,
                photo: m.photo || fallbackMap.get(m.name.toLowerCase()) || '/team/placeholder.jpg',
            }));
        }
        if (rawTimeline?.length) timeline = rawTimeline;
        if (rawAccolades?.length) accolades = rawAccolades.map((a: Accolade) => a.text);

        /* Always ensure The Depot entry exists in the timeline */
        const hasDepot = timeline.some((t) => /depot/i.test(t.title));
        if (!hasDepot) {
            timeline = [...timeline, FALLBACK_TIMELINE[FALLBACK_TIMELINE.length - 1]];
        }
    } catch {
        // fallback to hardcoded
    }

    return (
        <main className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>Est. 2014 · Northfield & Winnetka, IL</p>
                    <h1 className={styles.headline}>
                        Respect For the Past.<br />
                        <em>With An Eye To The Future.</em>
                    </h1>
                    <p className={styles.sub}>
                        Sean Hofherr carries on a legacy that began with a village butcher in Germany, carried across the ocean by his immigrant great-grandfather who built the original Hofherr Meat Company on Chicago's South Side. Now Sean is bringing that name — and that heritage — back to Chicago's stockyard history.
                    </p>
                </div>
            </section>

            {/* ── Heritage Gallery ── */}
            <section className={styles.heritage}>
                <div className="container">
                    <div className={styles.heritageGrid}>
                        <HoverVideo src="/video-clips/storykeeper.mp4" caption="The original Hofherr Wholesale Meats storefront" />

                        <HoverVideo src="/video-clips/storykeeper.mp4" caption="The Hofherr crew — a family tradition" />
                        <HoverVideo src="/video-clips/inside.mp4" poster="/history/shop-interior.png" caption="Inside the original shop — Chicago's South Side" />
                        <HoverVideo src="/video-clips/truck.mp4" caption="Hofherr Meat Co. — on the road" />
                    </div>
                </div>
            </section>
            {/* ── The Man ── */}
            <section className={styles.bio}>
                <div className="container">
                    <div className={styles.bioGrid}>
                        <div className={styles.bioText}>
                            <span className={styles.sectionLabel}>The Butcher</span>
                            <h2>Sean Hofherr</h2>
                            <p>
                                Sean honed his culinary and food preparation skills in numerous kitchens and cooking competitions over the years, winning a host of accolades for his many signature dishes. He began his career in the food industry at renowned steakhouse Keefer&apos;s Restaurant in Chicago&apos;s River North. He continued to nurture his passion at the cutting board during an apprenticeship at Zier&apos;s Prime Meats in Wilmette. Most recently, Sean served as kitchen director at Stormy&apos;s Tavern in Northfield, where his culinary creations garnered widespread acclaim from locals and the press alike.
                            </p>
                            <p>
                                In March 2014, he opened Hofherr Meat Co. at 300 Happ Rd, Northfield. The mission is simple: <strong>Quality meats. No compromise.</strong>
                            </p>
                            <p>
                                In 2024, Sean expanded the Hofherr footprint with <strong>The Depot</strong> — a second location inside the historic Winnetka Elm Street Metra Train Station, bringing the same premium cuts and personal service to commuters and residents across the North Shore.
                            </p>
                            <p>
                                Sean is an active member of the Butcher&apos;s Guild and the Illinois Barbecue Association.
                            </p>
                            <Link href="/visit" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                                Come Visit Us
                            </Link>
                        </div>
                        <div className={styles.avatarWrap}>
                            <div className={styles.avatarImg} />
                            <div className={styles.avatarCaption}>Sean Hofherr, Owner &amp; Head Butcher</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Meet the Team ── */}
            <section className={styles.team}>
                <div className="container">
                    <span className={styles.sectionLabel}>The Crew</span>
                    <h2 className={styles.teamTitle}>Meet the Team</h2>
                    <p className={styles.teamSub}>
                        Every great butcher shop is built by its people. Here&apos;s the crew that makes HMC run.
                    </p>
                    <div className={styles.teamGrid}>
                        {team.map((member, i) => (
                            <div key={i} className={styles.teamCard}>
                                <div className={styles.teamImagePart}>
                                    <img
                                        src={member.photo ?? '/team/placeholder.jpg'}
                                        alt={member.name}
                                        className={styles.teamImage}
                                    />
                                </div>
                                <div className={styles.teamContentPart}>
                                    <div className={styles.teamHeader}>
                                        <h3 className={styles.teamName}>{member.name}</h3>
                                        <span className={styles.teamRole}>{member.role}</span>
                                    </div>
                                    <div className={styles.teamDivider} />
                                    {member.bio && <p className={styles.teamBio}>{member.bio}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Timeline ── */}
            <section className={styles.timeline}>
                <div className="container">
                    <span className={styles.sectionLabel}>Our History</span>
                    <h2 className={styles.timelineTitle}>A Century of Craft</h2>
                    <div className={styles.timelineList}>
                        {timeline.map((item, i) => (
                            <div key={i} className={styles.timelineItem}>
                                <div className={styles.timelineEra}>{item.era}</div>
                                <div className={styles.timelineDot} />
                                <div className={styles.timelineBody}>
                                    <h3>{item.title}</h3>
                                    {item.body && <p>{item.body}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Accolades ── */}
            <section className={styles.accolades}>
                <div className="container">
                    <span className={styles.sectionLabel}>Recognition</span>
                    <h2>Awards &amp; Affiliations</h2>
                    <ul className={styles.accoladeList}>
                        {accolades.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className="container">
                    <h2>Come see what a real butcher shop looks like.</h2>
                    <p>🥩 The Butcher Shop — 300 Happ Rd, Northfield &nbsp;·&nbsp; 🏪 The Depot — 754 Elm St, Winnetka</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/online-orders" className="btn btn-primary">Order Online</Link>
                        <a href="tel:8474416328" className="btn btn-secondary">📞 (847) 441-MEAT</a>
                    </div>
                </div>
            </section>

        </main>
    );
}
