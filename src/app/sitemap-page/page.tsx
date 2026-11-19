import type { Metadata } from 'next';
import SiteMapClient from './SiteMapClient';

export const metadata: Metadata = {
    title: 'Visual Site Map | Hofherr Meat Co.',
    description:
        'Interactive visual site map of Hofherr Meat Co. with live page thumbnails, hierarchy tree, page-by-page link cards, link graph, and site audit.',
    robots: { index: false, follow: false },
};

export default function SitemapPage() {
    return <SiteMapClient />;
}
