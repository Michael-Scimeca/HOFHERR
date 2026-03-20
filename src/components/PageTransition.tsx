'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);

    // Fade in on first load
    useEffect(() => {
        setVisible(true);
    }, []);

    // Flash out + back in on route changes
    useEffect(() => {
        setVisible(false);
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, [pathname]);

    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'page-transition-style';
        style.textContent = `
            body {
                transition: opacity 0.35s ease;
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    useEffect(() => {
        document.body.style.opacity = visible ? '1' : '0';
    }, [visible]);

    return null;
}
