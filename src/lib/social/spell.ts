import { readFileSync } from 'node:fs';
import path from 'node:path';
import nspell from 'nspell';
import type { SocialPost } from './types';

/**
 * Spell check for every slide and caption before a post can be approved.
 * Uses the Hunspell en_US dictionary plus a brand / butchery word list.
 * Words added from the admin ("Add to dictionary") are stored on socialSettings.customWords.
 */

const BRAND_WORDS = [
    'Hofherr', "Hofherr's", 'Hofherrs', 'hofherrmeatco', 'Winnetka', 'Northfield', 'Happ', 'Depot', 'Metra',
    'ribeye', 'ribeyes', 'picanha', 'myoglobin', 'Maillard', 'tri-tip', 'tritip', 'porterhouse', 'tenderloin',
    'sirloin', 'brisket', 'chuck', 'Berkshire', 'Frenched', 'frenched', 'riblets', 'drumette', 'drumettes',
    'rumen', 'reticulum', 'omasum', 'abomasum', 'carnitas', 'porchetta', 'Wagyu', 'wagyu', 'cheesesteaks',
    'cheesesteak', 'BBQ', 'bbq', 'dry-aged', 'cast-iron', 'shortrib', 'shortribs', 'mignon', 'Emmental',
    'thru', 'IL', 'lb', 'lbs', 'oz', 'qt', 'reg', 'USDA', 'Instagram', 'Facebook', 'TikTok',
];

let speller: ReturnType<typeof nspell> | null = null;
function base() {
    if (speller) return speller;
    const dir = path.join(process.cwd(), 'node_modules', 'dictionary-en');
    speller = nspell({ aff: readFileSync(path.join(dir, 'index.aff')), dic: readFileSync(path.join(dir, 'index.dic')) });
    BRAND_WORDS.forEach((w) => speller!.add(w));
    return speller;
}

export type SpellIssue = { field: string; word: string; suggestions: string[] };

const WORD = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;

export function checkText(text: string, field: string, extra: Set<string>): SpellIssue[] {
    const sp = base();
    const issues: SpellIssue[] = [];
    const clean = text
        .replace(/https?:\/\/\S+/g, ' ')
        .replace(/[#@][\w-]+/g, ' ') // hashtags & handles
        .replace(/\[[^\]]*\]/g, ' '); // [placeholders] are flagged separately
    for (const raw of clean.match(WORD) ?? []) {
        const w = raw.replace(/’/g, "'").replace(/^'+|'+$/g, '');
        if (!w || extra.has(w.toLowerCase())) continue;
        const parts = w.includes('-') ? w.split('-') : [w];
        const ok = sp.correct(w) || sp.correct(w.toLowerCase()) || parts.every((p) => !p || sp.correct(p) || sp.correct(p.toLowerCase()) || extra.has(p.toLowerCase()));
        if (!ok && !issues.some((i) => i.word === w)) issues.push({ field, word: w, suggestions: sp.suggest(w).slice(0, 4) });
    }
    // Unfilled template placeholders are never allowed out the door.
    for (const m of text.match(/\[[^\]]+\]/g) ?? []) issues.push({ field, word: m, suggestions: ['Replace the placeholder'] });
    return issues;
}

export function checkPost(post: SocialPost, customWords: string[] = []): SpellIssue[] {
    const extra = new Set(customWords.map((w) => w.toLowerCase()));
    const issues: SpellIssue[] = [];
    post.slides.forEach((s, i) => {
        if (s.kicker) issues.push(...checkText(s.kicker, `Slide ${i + 1} label`, extra));
        if (s.headline) issues.push(...checkText(s.headline, `Slide ${i + 1} headline`, extra));
        if (s.body) issues.push(...checkText(s.body, `Slide ${i + 1} text`, extra));
        (s.items ?? []).forEach((it, j) => issues.push(...checkText(it, `Slide ${i + 1} line ${j + 1}`, extra)));
    });
    issues.push(...checkText(post.caption ?? '', 'Caption (Instagram/Facebook)', extra));
    issues.push(...checkText(post.captionX ?? '', 'Caption (X)', extra));
    return issues;
}
