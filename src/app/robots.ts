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
                    '/inventory',
                    '/api/',
                    '/login',
                    '/register',
                    '/reset-password',
                    '/verify-email',
                    '/checkout',
                    '/order/',
                    '/debug-email',
                    '/design-system',
                    '/fire-test',
                    '/press-test',
                    '/map-test',
                    '/recipes-test',
                    '/order-tracker-test',
                    '/test-cut-collection',
                    '/greens-and-emblems',
                    '/modules',
                    '/showcase',
                    '/pitch-deck',
                    '/roadmap',
                    '/product-identity',
                ],
            },
        ],
        sitemap: 'https://hofherrmeatco.com/sitemap.xml',
        host: 'https://hofherrmeatco.com',
    };
}
