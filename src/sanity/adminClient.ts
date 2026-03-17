import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_API_WRITE_TOKEN!;

/** 
 * Admin client used for server-side mutations (registration, order saving)
 * REQUIRES: SANITY_API_WRITE_TOKEN in .env.local
 */
export const adminClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false, // Must be false for mutations
    token,
});
