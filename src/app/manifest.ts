import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Hofherr Meat Co.',
        short_name: 'Hofherr',
        description: 'Premium craft butcher shop in Northfield & Winnetka, IL. Custom cuts, online ordering, and BBQ catering.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            { src: '/icon.png', sizes: '512x512', type: 'image/png' },
            { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    };
}
