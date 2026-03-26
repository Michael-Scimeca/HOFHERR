'use client';

import styles from './TeamBentoGrid.module.css';
import ParallaxImg from '@/app/bbq/ParallaxImg';

interface TeamMember {
    name: string;
    role: string;
    photo?: string | null;
    bio?: string | null;
}

const ROLE_TAGS: Record<string, string> = {
    'Owner & Head Chef': 'Owner',
    'Manager':           'Manager',
    'Butcher':           'Butcher',
    'Head Chef':         'Head Chef',
    'Chef':              'Chef',
};

function TeamCard({
    member,
    className,
    size = 'sm',
}: {
    member: TeamMember;
    className?: string;
    size?: 'hero' | 'sm';
}) {
    const tag = ROLE_TAGS[member.role] ?? member.role;
    const photo = member.photo ?? '/team/placeholder.jpg';

    return (
        <div className={`${styles.card} ${className ?? ''} ${size === 'hero' ? styles.heroCard : ''}`}>
            {/* Photo */}
            <div className={styles.photoWrap}>
                <ParallaxImg
                    src={photo}
                    alt={member.name}
                    className={styles.photo}
                />
            </div>

            {/* Overlay */}
            <div className={styles.overlay}>
                <span className={styles.tag}>{tag}</span>

                <div className={styles.cardBottom}>
                    <h3 className={styles.name}>{member.name}</h3>
                </div>
            </div>
        </div>
    );
}

export default function TeamBentoGrid({ team }: { team: TeamMember[] }) {
    // Take up to 5 members
    const members = team.slice(0, 5);
    const [m1, m2, m3, m4, m5] = members;

    return (
        <div className={styles.bento}>
            {/* ── Top: hero left (2×2) + 2 stacked right ── */}
            <div className={styles.topGrid}>
                {m1 && <TeamCard member={m1} className={styles.heroSlot} size="hero" />}
                {m2 && <TeamCard member={m2} className={styles.stackSlot} />}
                {m3 && <TeamCard member={m3} className={styles.stackSlot} />}
            </div>

            {/* ── Bottom: 3 equal ── */}
            <div className={styles.bottomGrid}>
                {m4 && <TeamCard member={m4} />}
                {m5 && <TeamCard member={m5} />}
                
                {/* 6th Slot - Hiring CTA */}
                <div className={`${styles.card} ${styles.hiringCard}`}>
                    <div className={styles.hiringOverlay}>
                        <h3 className={styles.hiringTitle}>We&apos;re Hiring</h3>
                        <p className={styles.hiringSub}>Think you have what it takes to join the Hofherr crew?</p>
                        <a href="/jobs" className={`btn btn-secondary ${styles.hiringBtn}`}>
                            View Open Positions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
