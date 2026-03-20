import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/studio', '/dashboard', '/api/', '/reset-password'],
            },
        ],
        sitemap: 'https://hofherrmeatco.com/sitemap.xml',
        host: 'https://hofherrmeatco.com',
    };
}
