/**
 * Mailchimp Marketing API v3 helper
 *
 * Env vars required (add to .env.local):
 *   MAILCHIMP_API_KEY  — from mailchimp.com → Account → Extras → API keys
 *                        Format: "abc123def456-us1"  (the suffix after "-" is the datacenter)
 *   MAILCHIMP_LIST_ID  — from Audience → All contacts → Settings → Audience name & defaults
 *                        It's the "Audience ID" shown in that settings panel
 */

import crypto from 'crypto';

const API_KEY  = process.env.MAILCHIMP_API_KEY  || '';
const LIST_ID  = process.env.MAILCHIMP_LIST_ID  || '';

/** Mailchimp uses MD5(lowercase email) as the member identifier */
function memberHash(email: string) {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

/** Extract datacenter prefix from API key, e.g. "abc123-us6" → "us6" */
function datacenter() {
    return API_KEY.split('-').pop() || 'us1';
}

function baseUrl() {
    return `https://${datacenter()}.api.mailchimp.com/3.0`;
}

function authHeader() {
    // Mailchimp uses HTTP Basic auth; username can be anything
    return 'Basic ' + Buffer.from(`anystring:${API_KEY}`).toString('base64');
}

/**
 * Subscribe or unsubscribe a contact from the configured Mailchimp audience.
 * Uses PUT so it's idempotent — safe to call even if the member already exists.
 *
 * @param email   The customer's email address
 * @param subscribe  true = subscribe, false = unsubscribe
 */
export async function syncMailchimpSubscription(email: string, subscribe: boolean, name?: string): Promise<void> {
    if (!API_KEY || !LIST_ID) {
        console.warn('[Mailchimp] MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID not set — skipping sync');
        return;
    }

    const url = `${baseUrl()}/lists/${LIST_ID}/members/${memberHash(email)}`;

    const body: Record<string, any> = {
        email_address: email,
        status_if_new: subscribe ? 'subscribed' : 'unsubscribed',
        status:         subscribe ? 'subscribed' : 'unsubscribed',
        merge_fields: name ? { FNAME: name } : {},
    };

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader(),
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('[Mailchimp] Sync failed:', res.status, data?.title, data?.detail);
    } else {
        console.log(`[Mailchimp] ${subscribe ? 'Subscribed' : 'Unsubscribed'} ${email}`);
    }
}
