import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: 'https://hofherrmeatco.com/sitemap.xml',
        host: 'https://hofherrmeatco.com',
    };
}
