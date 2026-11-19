import styles from './AccoladesSection.module.css';

type AccoladeTier = 'win' | 'top3' | 'guild' | 'media';

type AccoladeItem = {
    id: string;
    title: string;
    outcome: string | null;
    tier: AccoladeTier;
    stamp: string;
    category: string;
};

type BigStat = {
    id: string;
    num: string;
    label: string;
};

const BIG_STATS: BigStat[] = [
    { id: 'stat-wins', num: '6', label: 'Competition Wins' },
    { id: 'stat-guilds', num: '2', label: 'Guild Memberships' },
    { id: 'stat-years', num: '10+', label: 'Years Competing' },
    { id: 'stat-press', num: '1', label: 'National Feature' },
];

const ACCOLADES: AccoladeItem[] = [
    {
        id: 'baconfest-best-in-show',
        title: "Wagner Farms BaconFest — Cheeseburger Sausage",
        outcome: 'Best in Show',
        tier: 'win',
        stamp: 'WINNER',
        category: 'Competition Win',
    },
    {
        id: 'chili-2009',
        title: 'North Shore Chili Cookoff',
        outcome: 'Winner',
        tier: 'win',
        stamp: '2009',
        category: 'Competition Win',
    },
    {
        id: 'ribfest-2010',
        title: 'Lake Bluff Ribfest',
        outcome: 'Winner',
        tier: 'win',
        stamp: '2010',
        category: 'Competition Win',
    },
    {
        id: 'northfield-2008',
        title: 'Northfield Ribfest',
        outcome: 'Top 3',
        tier: 'top3',
        stamp: '2008',
        category: 'Top 3 Finish',
    },
    {
        id: 'chili-2010',
        title: 'North Shore Chili Cookoff',
        outcome: 'Top 3',
        tier: 'top3',
        stamp: '2010',
        category: 'Top 3 Finish',
    },
    {
        id: 'burnoff-2011',
        title: 'Des Plaines Rib, Chicken & Sausage Winter Burn Off',
        outcome: 'Top 3',
        tier: 'top3',
        stamp: '2011',
        category: 'Top 3 Finish',
    },
    {
        id: 'butchers-guild',
        title: "Member, Butcher's Guild",
        outcome: null,
        tier: 'guild',
        stamp: 'GUILD',
        category: 'Guild Member',
    },
    {
        id: 'iba-member',
        title: 'Member, Illinois Barbecue Association',
        outcome: null,
        tier: 'guild',
        stamp: 'IBA',
        category: 'Guild Member',
    },
    {
        id: 'atk-proof',
        title: 'As Featured on America\'s Test Kitchen "Proof" Podcast',
        outcome: null,
        tier: 'media',
        stamp: 'PRESS',
        category: 'Press Feature',
    },
];

export default function AccoladesSection() {
    return (
        <section id="accolades" aria-labelledby="accolades-heading" className="section">
            <div className="container">
                <div className={styles.sheet}>
                    <div className={styles.masthead}>
                        <h2 id="accolades-heading" className={styles.displayTitle}>
                            Awards &amp; <em>Affiliations</em>
                        </h2>

                        <div className={styles.tickerSummary}>
                            {BIG_STATS.map((stat) => (
                                <div key={stat.id} className={styles.tickerPair}>
                                    <span className={styles.tickerBig}>{stat.num}</span>
                                    <span className={styles.tickerWord}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ul className={styles.indexList}>
                        {ACCOLADES.map((item) => {
                            const isWin = item.tier === 'win';
                            return (
                                <li
                                    key={item.id}
                                    className={`${styles.indexRow} ${isWin ? styles.indexRowWin : ''}`}
                                >
                                    <span className={styles.indexName}>{item.title}</span>
                                    <span className={styles.leader} aria-hidden="true" />
                                    <div className={styles.indexRight}>
                                        <span className={styles.indexOutcome}>
                                            {item.outcome ?? item.category}
                                        </span>
                                        <span className={styles.indexYear}>{item.stamp}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

