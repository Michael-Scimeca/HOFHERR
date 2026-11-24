import type { ReactNode } from 'react';
import { SITE_CONTACT } from '@/lib/siteContact';

interface ContactLinkProps {
    kind: 'phone' | 'email' | 'jobs';
    subject?: string;
    className?: string;
    children?: ReactNode;
}

export default function ContactLink({ kind, subject, className, children }: ContactLinkProps) {
    let href: string;
    let defaultLabel: string;

    if (kind === 'phone') {
        href = SITE_CONTACT.phoneHref;
        defaultLabel = SITE_CONTACT.phoneDisplay;
    } else if (kind === 'jobs') {
        href = subject
            ? `${SITE_CONTACT.jobsEmailHref}?subject=${encodeURIComponent(subject)}`
            : SITE_CONTACT.jobsEmailHref;
        defaultLabel = SITE_CONTACT.jobsEmail;
    } else {
        href = subject
            ? `${SITE_CONTACT.emailHref}?subject=${encodeURIComponent(subject)}`
            : SITE_CONTACT.emailHref;
        defaultLabel = SITE_CONTACT.email;
    }

    return (
        <a href={href} className={className}>
            {children ?? defaultLabel}
        </a>
    );
}

