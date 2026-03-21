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
        const t = setTimeout(() => {
            setVisible(true);
            
            // Check for hash link jump natively since Next.js often drops cross-page hashes
            setTimeout(() => {
                const rawHash = window.location.hash;
                if (!rawHash) return;
                
                const id = rawHash.replace('#', '');
                const el = document.getElementById(id);
                if (el) {
                    const style = window.getComputedStyle(el);
                    const paddingTop = parseFloat(style.paddingTop) || 0;
                    
                    // Push down past the element's top padding but clear the 88px navbar
                    const absoluteY = el.getBoundingClientRect().top + window.scrollY - 100 + paddingTop;
                    
                    window.scrollTo({
                        top: absoluteY,
                        behavior: 'smooth'
                    });
                }
            }, 100); // give the new page time to paint layout properly
            
        }, 60);
        return () => clearTimeout(t);
    }, [pathname]);

    // Handle standard hash links clicked mid-session on the same page
    useEffect(() => {
        const onHashChange = () => {
            const rawHash = window.location.hash;
            if (!rawHash) return;
            const id = rawHash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                const style = window.getComputedStyle(el);
                const paddingTop = parseFloat(style.paddingTop) || 0;
                const absoluteY = el.getBoundingClientRect().top + window.scrollY - 100 + paddingTop;
                window.scrollTo({ top: absoluteY, behavior: 'smooth' });
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

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
