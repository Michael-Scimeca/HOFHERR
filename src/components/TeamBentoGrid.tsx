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
    // Ensure we have up to 6 members, pad with first if fewer
    const members = [...team];
    while (members.length < 6) members.push(members[0]);

    const [m1, m2, m3, m4, m5, m6] = members;

    return (
        <div className={styles.bento}>
            {/* ── Top: hero left (2×2) + 2 stacked right ── */}
            <div className={styles.topGrid}>
                <TeamCard member={m1} className={styles.heroSlot} size="hero" />
                <TeamCard member={m2} className={styles.stackSlot} />
                <TeamCard member={m3} className={styles.stackSlot} />
            </div>

            {/* ── Bottom: 3 equal ── */}
            <div className={styles.bottomGrid}>
                <TeamCard member={m4} />
                <TeamCard member={m5} />
                <TeamCard member={m6} />
            </div>
        </div>
    );
}
