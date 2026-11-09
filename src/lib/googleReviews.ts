/**
 * Google reviews for the testimonial wall (Places API "New").
 *
 * Setup (Google Cloud): enable "Places API (New)", create a server key, then set
 *   GOOGLE_PLACES_API_KEY = …            (falls back to NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
 *   GOOGLE_PLACE_ID       = …            (optional — looked up from the address if missing)
 *
 * Google returns the listing's rating + up to 5 reviews. Results are cached for 24h.
 * Google's terms require showing the reviewer's name and attributing the content to Google.
 */
import type { Review } from '@/components/TestimonialWall';

const KEY = () => process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const QUERY = 'Hofherr Meat Co, 300 Happ Rd, Northfield, IL 60093';

type GoogleReview = {
    rating: number;
    relativePublishTimeDescription?: string;
    text?: { text: string };
    originalText?: { text: string };
    authorAttribution?: { displayName: string; uri?: string };
    googleMapsUri?: string;
};

export type GoogleSummary = { rating: number; count: number; url?: string; reviews: Review[] };

async function placeId(key: string): Promise<string | null> {
    if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id' },
        body: JSON.stringify({ textQuery: QUERY }),
        next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.places?.[0]?.id ?? null;
}

/** Returns null when Google isn't configured or the request fails — callers fall back gracefully. */
export async function getGoogleReviews({ minRating = 5 } = {}): Promise<GoogleSummary | null> {
    const key = KEY();
    if (!key) return null;
    try {
        const id = await placeId(key);
        if (!id) return null;
        const res = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
            headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
            next: { revalidate: 86400 },
        });
        if (!res.ok) return null;
        const p = await res.json();
        const reviews: Review[] = ((p.reviews ?? []) as GoogleReview[])
            .filter((r) => r.rating >= minRating && (r.text?.text || r.originalText?.text))
            .map((r) => ({
                quote: (r.text?.text || r.originalText?.text || '').trim(),
                name: r.authorAttribution?.displayName ?? 'Google reviewer',
                meta: `Google review${r.relativePublishTimeDescription ? ` · ${r.relativePublishTimeDescription}` : ''}`,
                rating: r.rating,
                href: r.authorAttribution?.uri ?? r.googleMapsUri,
            }));
        return { rating: p.rating ?? 0, count: p.userRatingCount ?? 0, url: p.googleMapsUri, reviews };
    } catch {
        return null;
    }
}
