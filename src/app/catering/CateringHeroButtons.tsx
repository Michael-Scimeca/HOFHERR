'use client';

import React from 'react';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

export default function CateringHeroButtons() {
    return (
        <div className={styles.heroBtns}>
            <a href="#build-your-package" className="btn-hit">
                <span className="btn btn-primary">
                    <FireBorder active={true} radius={6} />
                    Build Your Package
                </span>
            </a>
            <a href="#pig-roasts" className="btn-hit">
                <span className="btn btn-secondary">Pig Roasts</span>
            </a>
            <a href="tel:8474416328" className="btn-hit">
                <span className="btn btn-secondary">📞 (847) 441-MEAT</span>
            </a>
        </div>
    );
}
