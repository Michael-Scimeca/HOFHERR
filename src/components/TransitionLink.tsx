'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { usePageTransition } from './PageTransition';

/**
 * Drop-in replacement for Next.js <Link> that triggers the melt
 * page transition before navigating. Falls back to normal Link
 * for external URLs, hash links, and modifier-key clicks.
 */
const TransitionLink = forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link> & { onClick?: React.MouseEventHandler }>(
    function TransitionLink({ href, children, className, style, onClick, ...props }, ref) {
        const { navigateTo } = usePageTransition();

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            const url = typeof href === 'string' ? href : href.pathname || '';
            const isExternal = url.startsWith('http') || url.startsWith('mailto') || url.startsWith('tel') || url.startsWith('sms');
            const isHash = url.startsWith('#');
            const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

            if (isExternal || isHash || hasModifier) {
                onClick?.(e);
                return;
            }

            e.preventDefault();
            onClick?.(e);
            navigateTo(url);
        };

        return (
            <Link href={href} ref={ref} className={className} style={style} onClick={handleClick} {...props}>
                {children}
            </Link>
        );
    }
);

export default TransitionLink;
