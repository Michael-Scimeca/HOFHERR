import type { Metadata } from 'next';
import GooglePreviewClient from './GooglePreviewClient';

export const metadata: Metadata = {
    title: 'Google Search & Local Pack Preview | Hofherr Meat Co.',
    description:
        'Interactive dark-mode Google Search SERP, Multi-Location Pack, Knowledge Panel, and Google Business Profile preview for Hofherr Meat Co.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function GooglePreviewPage() {
    return <GooglePreviewClient />;
}
