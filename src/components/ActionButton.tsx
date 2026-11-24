import type { MouseEventHandler, ReactNode } from 'react';
import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';

export type ActionButtonVariant = 'primary' | 'secondary' | 'depot' | 'gold' | 'ghost';

interface ActionButtonProps {
    children: ReactNode;
    variant?: ActionButtonVariant;
    fire?: boolean;
    href?: string;
    external?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
    className?: string;
    innerClassName?: string;
    ariaLabel?: string;
}

const VARIANT_CLASS: Record<ActionButtonVariant, string> = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    depot: 'btn btn-depot',
    gold: 'btn btn-gold',
    ghost: 'btn btn-ghost',
};

function isExternalOrProtocol(href: string): boolean {
    return (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
    );
}

/**
 * Shared Hofherr CTA button/link built on the global `.btn-hit > .btn`
 * stationary hit-target system so hover lifts never jitter the cursor box.
 */
export default function ActionButton({
    children,
    variant = 'primary',
    fire = false,
    href,
    external = false,
    type = 'button',
    disabled = false,
    onClick,
    className,
    innerClassName,
    ariaLabel,
}: ActionButtonProps) {
    const outerClass = className ? `btn-hit ${className}` : 'btn-hit';
    const spanClass = innerClassName ? `${VARIANT_CLASS[variant]} ${innerClassName}` : VARIANT_CLASS[variant];
    const inner = (
        <span className={spanClass}>
            {fire && <FireBorder active radius={6} />}
            {children}
        </span>
    );

    if (href) {
        if (external || isExternalOrProtocol(href)) {
            return (
                <a
                    href={href}
                    className={outerClass}
                    onClick={onClick}
                    aria-label={ariaLabel}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                >
                    {inner}
                </a>
            );
        }

        return (
            <Link href={href} className={outerClass} onClick={onClick} aria-label={ariaLabel}>
                {inner}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            className={outerClass}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {inner}
        </button>
    );
}

