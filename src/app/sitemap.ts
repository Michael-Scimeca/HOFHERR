import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://hofherrmeatco.com';
    const now = new Date();

    return [
        {
            url: base,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${base}/online-orders`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: `${base}/specials`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${base}/bbq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${base}/catering`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.88,
        },
        {
            url: `${base}/visit`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
        {
            url: `${base}/cut-guide`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${base}/our-story`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.65,
        },
        {
            url: `${base}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.65,
        },
        {
            url: `${base}/gift-cards`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        {
            url: `${base}/newsletter`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${base}/jobs`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
    ];
}
