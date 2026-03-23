'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function CursorThumbnail({ src, alt }: { src: string; alt: string }) {
    const [hover, setHover] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMove = (e: React.MouseEvent) => {
        setPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <>
            <img 
                src={src} 
                alt={alt} 
                className={styles.listThumb} 
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onMouseMove={handleMove}
            />
            {mounted && hover && (
                <div 
                    className={styles.cursorThumbWrap}
                    style={{ left: pos.x + 20, top: pos.y + 20 }}
                >
                    <img src={src} alt={alt} />
                </div>
            )}
        </>
    );
}
