'use client';

import React from 'react';
import { openCateringDrawer } from '@/components/CateringDrawer';
import styles from './page.module.css';

export default function CateringHeroButtons() {
    return (
        <div className={styles.heroBtns}>
            <button
                type="button"
                className="btn btn-primary"
                onClick={openCateringDrawer}
            >
                Quick Quote Drawer
            </button>
            <a href="#build-your-package" className="btn btn-secondary">
                Build Your Package
            </a>
            <a href="tel:8474416328" className="btn btn-secondary">
                📞 (847) 441-MEAT
            </a>
        </div>
    );
}
