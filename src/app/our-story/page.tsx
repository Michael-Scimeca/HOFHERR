import type { Metadata } from 'next';
import Image from 'next/image';
import HoverVideo from '@/components/HoverVideo';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient } from '@/sanity/client';
import { TEAM_MEMBERS_QUERY, TIMELINE_QUERY, ACCOLADES_QUERY } from '@/sanity/queries';
import InteractiveTimeline from '@/components/InteractiveTimeline';
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
    { era: 'March 2014', title: 'Hofherr Meat Co. Opens', body: '300 Happ Rd, Northfield. A new chapter — and a return to roots. Every cut made to order. Every animal traceable to a named family farm.', video: '/video-clips/stage-fire.mp4' },
    { era: '2024', title: 'The Depot Opens', body: 'Sean expands to a second location — The Depot, inside the historic Winnetka Elm Street Metra Train Station at 754 Elm St. A convenient pick-up spot bringing the same Hofherr quality to the North Shore commuter corridor.' },
];

const FALLBACK_TEAM = [
    {
        name: 'Sean Hofherr',
        role: 'Owner & Head Chef',
        photo: '/team/sean.jpg',
        bio: 'Sean carries on a legacy that began with a village butcher in Germany, brought to America by his immigrant great-grandfather who built the original Hofherr Meat Company on Chicago\'s South Side. After honing his craft at Keefer\'s Restaurant in River North, an apprenticeship at Zier\'s Prime Meats in Wilmette, and winning the 2009 North Shore Chili Cookoff, Sean opened Hofherr Meat Co. in 2014. He\'s an active member of the Butcher\'s Guild and the Illinois Barbecue Association.'
    },
    {
        name: 'Vincent Recaei',
        role: 'Manager',
        photo: '/team/vincent.jpg',
        bio: 'The guy behind the scenes who keeps the whole operation running. Vincent manages the day-to-day alongside Sean — from inventory and vendor relationships to making sure the cases are stocked and the shop floor stays spotless. He grew up in the neighborhood and started as a part-time hire before working his way into a leadership role. Vincent is the first one in and the last one out, and if you\'re a regular, he probably already knows your order.'
    },
    {
        name: 'Emily Cushing',
        role: 'Butcher',
        photo: '/team/emily.jpg',
        bio: 'Emily holds a degree in Meat Processing from the University of Wisconsin–Platteville — one of only a handful of programs like it in the country. She came to HMC because she wanted to work at a shop that values the craft the way she does. Whether she\'s breaking down a whole hog or helping a first-timer pick the right roast for Sunday dinner, Emily brings the same level of care and expertise. She\'s also the team\'s go-to for custom cuts and special requests.'
    },
    {
        name: 'Dan Blair',
        role: 'Butcher',
        photo: '/team/dan.jpg',
        bio: 'A Northfield native through and through, Dan spent years behind the meat counter at Mariano\'s before making the move to HMC. He brings decades of experience, a deep knowledge of every cut in the case, and the kind of old-school customer service that keeps people coming back. Dan is the guy who remembers what you bought last Thanksgiving and will talk you through the best way to cook it. His passion for quality and consistency is a big part of what makes HMC feel like a neighborhood institution.'
    },
    {
        name: 'Jamie Bisoulis',
        role: 'Head Chef',
        photo: '/team/jamie.jpg',
        bio: 'Jamie has been with the shop since the very beginning — she was one of Sean\'s first hires and helped build the prepared foods program from scratch. She runs the HMC kitchen with precision and heart, overseeing everything from the signature soups and sides to the sauces, marinades, and seasonal specials. Jamie\'s background is rooted in scratch cooking and home-style recipes made with real ingredients. If it\'s in the hot case or the grab-and-go cooler, chances are Jamie made it by hand that morning.'
    },
    {
        name: 'Steve Soler',
        role: 'Chef',
        photo: '/team/steve.jpg',
        bio: 'Steve met Sean at a charity event and they bonded over pork belly, sauerkraut, and a shared belief that food should be made the right way — no shortcuts. That conversation turned into a partnership, and Steve now plays a key role in developing new recipes, catering menus, and everything that comes out of the HMC kitchen alongside Jamie. With a background in both fine dining and comfort food, Steve brings a versatility that keeps the menu fresh and exciting. He\'s the creative force behind many of the shop\'s most popular seasonal dishes.'
    },
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
                <div className={styles.seanCard}>
                    <div className={styles.seanImagePart}>
                        <img
                            src="/team/sean.jpg"
                            alt="Sean Hofherr"
                            className={styles.avatarImg}
                        />
                    </div>
                    <div className={styles.seanContentPart}>
                        <span className={styles.teamRole}>Owner &amp; Head Chef</span>
                        <h2 className={styles.teamName}>Sean Hofherr</h2>
                        <div className={styles.teamDivider} />
                        <p className={styles.teamBio}>
                            Sean honed his culinary and food preparation skills in numerous kitchens and cooking competitions over the years, winning a host of accolades for his many signature dishes. He began his career in the food industry at renowned steakhouse Keefer&apos;s Restaurant in Chicago&apos;s River North. He continued to nurture his passion at the cutting board during an apprenticeship at Zier&apos;s Prime Meats in Wilmette. Most recently, Sean served as kitchen director at Stormy&apos;s Tavern in Northfield, where his culinary creations garnered widespread acclaim from locals and the press alike.
                        </p>
                        <p className={styles.teamBio} style={{ marginTop: '16px' }}>
                            In March 2014, he opened Hofherr Meat Co. at 300 Happ Rd, Northfield. The mission is simple: <strong>Quality meats. No compromise.</strong>
                        </p>
                        <p className={styles.teamBio} style={{ marginTop: '16px' }}>
                            In 2024, Sean expanded the Hofherr footprint with <strong>The Depot</strong> — a second location inside the historic Winnetka Elm Street Metra Train Station.
                        </p>
                        <Link href="/visit" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                            Come Visit Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Meet the Team ── */}
            <section className={styles.team}>
                <div className="container">
                    <div className={styles.teamHeader}>
                        <span className={styles.sectionLabelCentered}><span>—</span> The Crew <span>—</span></span>
                        <h2 className={styles.teamTitle}>Meet the Team</h2>
                        <p className={styles.teamSub}>
                            Every great butcher shop is built by its people. Here&apos;s the crew that makes HMC run.
                        </p>
                    </div>
                </div>
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
                                    <span className={styles.teamRole}>{member.role}</span>
                                    <h3 className={styles.teamName}>{member.name}</h3>
                                </div>
                                {member.bio && <p className={styles.teamBio}>{member.bio}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Timeline ── */}
            <InteractiveTimeline events={timeline} />

            {/* ── Accolades ── */}
            <section className={styles.accolades}>
                <div className="container">
                    <div className={styles.accoladesHeader}>
                        <span className={styles.sectionLabelCentered}><span>—</span> Recognition <span>—</span></span>
                        <h2 className={styles.accoladesTitle}>Awards &amp; Affiliations</h2>
                    </div>
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
