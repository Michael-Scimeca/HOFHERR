'use client';

import { useState } from 'react';
import ActionButton from '@/components/ActionButton';
import ContactLink from '@/components/ContactLink';
import FilterPills, { type FilterPillOption } from '@/components/FilterPills';
import SectionHeader from '@/components/SectionHeader';
import Toggle from '@/components/Toggle';
import BurningDotCanvas from '@/app/visit/BurningDotCanvas';
import styles from './page.module.css';

type DemoFilter = 'all' | 'beef' | 'pork' | 'poultry';

const DEMO_PILLS: readonly FilterPillOption<DemoFilter>[] = [
    { value: 'all', label: 'All Cuts', count: 42 },
    { value: 'beef', label: 'Dry-Aged Beef', count: 18 },
    { value: 'pork', label: 'Heritage Pork', count: 14 },
    { value: 'poultry', label: 'Pasture Poultry', count: 10 },
];

export default function SharedPrimitivesDemo() {
    const [pill, setPill] = useState<DemoFilter>('all');
    const [toggleMd, setToggleMd] = useState(true);
    const [toggleSm, setToggleSm] = useState(false);

    return (
        <div className={styles.primitivesStack}>
            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>ActionButton (src/components/ActionButton.tsx)</h3>
                <div className={styles.componentRow}>
                    <ActionButton href="/online-orders" variant="primary" fire>
                        Order Online (Fire)
                    </ActionButton>
                    <ActionButton href="/specials" variant="primary">
                        Primary CTA
                    </ActionButton>
                    <ActionButton href="/visit" variant="depot">
                        Shop The Depot
                    </ActionButton>
                    <ActionButton href="/catering" variant="gold">
                        Gold CTA
                    </ActionButton>
                    <ActionButton href="/recipes" variant="secondary">
                        Secondary CTA
                    </ActionButton>
                    <ActionButton href="/our-story" variant="ghost">
                        Ghost Link →
                    </ActionButton>
                </div>
            </div>

            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>FilterPills (src/components/FilterPills.tsx)</h3>
                <FilterPills
                    options={DEMO_PILLS}
                    value={pill}
                    onChange={setPill}
                    ariaLabel="Demo cut filter pills"
                />
            </div>

            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Toggle (src/components/Toggle.tsx) &amp; BurningDotCanvas</h3>
                <div className={styles.componentRow}>
                    <Toggle
                        checked={toggleMd}
                        onChange={setToggleMd}
                        label="Weekly Specials Dispatch (md)"
                        size="md"
                    />
                    <Toggle
                        checked={toggleSm}
                        onChange={setToggleSm}
                        label="Compact Admin Switch (sm)"
                        size="sm"
                    />
                    <div className={styles.flamePillRow}>
                        <span className={styles.flameDemoButcher}>
                            <BurningDotCanvas variant="butcher" />
                            The Butcher Shop
                        </span>
                        <span className={styles.flameDemoDepot}>
                            <BurningDotCanvas variant="depot" />
                            The Depot
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>ContactLink &amp; SITE_CONTACT (src/components/ContactLink.tsx)</h3>
                <div className={styles.componentRow}>
                    <div className={styles.componentDemo}>
                        <ContactLink kind="phone" className={styles.inlineLink} />
                        <code>&lt;ContactLink kind=&quot;phone&quot; /&gt;</code>
                    </div>
                    <div className={styles.componentDemo}>
                        <ContactLink kind="email" className={styles.inlineLink} />
                        <code>&lt;ContactLink kind=&quot;email&quot; /&gt;</code>
                    </div>
                    <div className={styles.componentDemo}>
                        <ContactLink kind="jobs" className={styles.inlineLink} />
                        <code>&lt;ContactLink kind=&quot;jobs&quot; /&gt;</code>
                    </div>
                </div>
            </div>

            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>SectionHeader (src/components/SectionHeader.tsx)</h3>
                <div className={styles.sectionHeaderPreview}>
                    <SectionHeader
                        align="left"
                        title={
                            <>
                                Dry-Aged <em>Butcher&apos;s Block</em>
                            </>
                        }
                        subtitle="Reusable h2 + italic crimson accent + constrained lede paragraph built on site typography and spacing tokens."
                    />
                </div>
            </div>
        </div>
    );
}
