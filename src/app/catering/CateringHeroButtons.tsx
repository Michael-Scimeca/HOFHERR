'use client';

import ActionButton from '@/components/ActionButton';
import { SITE_CONTACT } from '@/lib/siteContact';
import styles from './page.module.css';

export default function CateringHeroButtons() {
    return (
        <div className={styles.heroBtns}>
            <ActionButton href="#build-your-package" variant="primary" fire>
                Build Your Package
            </ActionButton>
            <ActionButton href="#pig-roasts" variant="secondary">
                Pig Roasts
            </ActionButton>
            <ActionButton href={SITE_CONTACT.phoneHref} variant="secondary">
                📞 {SITE_CONTACT.phoneDisplay}
            </ActionButton>
        </div>
    );
}
