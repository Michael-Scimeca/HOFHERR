import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin-dashboard',
                    '/admin-dashbaord',
                    '/studio',
                    '/dashboard',
                    '/api/',
                    '/login',
                    '/register',
                    '/reset-password',
                    '/verify-email',
                    '/checkout',
                    '/order/',
                    '/design-system',
                    '/fire-test',
                    '/order-tracker-test',
                    '/launch-checklist',
                ],
            },
        ],
        sitemap: 'https://hofherrmeatco.com/sitemap.xml',
        host: 'https://hofherrmeatco.com',
    };
}
