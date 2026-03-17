import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = '2024-01-01';

/** Standard client — used for published data */
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
});

/**
 * Draft-aware client with stega encoding.
 * When draft mode is active, this client embeds invisible source-map data
 * into string fields — enabling Sanity's click-to-edit overlay.
 */
export function getClient(preview = false) {
    if (preview) {
        return createClient({
            projectId,
            dataset,
            apiVersion,
            useCdn: false,
            // Stega encodes source maps into string values for Visual Editing
            stega: {
                enabled: true,
                studioUrl: '/studio',
            },
            token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
            perspective: 'previewDrafts',
        });
    }
    return client;
}
