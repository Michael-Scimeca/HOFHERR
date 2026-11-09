export type SlideTemplate =
    | 'specials'
    | 'howto-cover'
    | 'howto-steps'
    | 'chart'
    | 'guide'
    | 'fact'
    | 'trivia-q'
    | 'trivia-a'
    | 'tip'
    | 'recipe-cover'
    | 'recipe-ingredients';

export type Slide = {
    _key: string;
    template: SlideTemplate;
    kicker?: string;
    headline?: string;
    body?: string;
    items?: string[];
    iconId?: string;
    photo?: string;
    tone?: 'crimson' | 'cream' | 'charcoal' | 'amber';
};

export type Platform = 'instagram' | 'facebook' | 'x';

export type PublishResult = {
    _key: string;
    platform: Platform;
    ok: boolean;
    dryRun?: boolean;
    id?: string;
    url?: string;
    error?: string;
    at: string;
};

export type PostStatus = 'draft' | 'approved' | 'posted' | 'failed';

export type SocialPost = {
    _key: string;
    day: string;
    kind: 'specials' | 'howto' | 'cuts' | 'fact' | 'trivia' | 'tip' | 'recipe';
    label: string;
    contentIds: string[];
    slides: Slide[];
    caption: string;
    captionX?: string;
    hashtags: string;
    approved: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
    status?: PostStatus;
    scheduledFor?: string; // ISO datetime
    results?: PublishResult[];
    notifiedAt?: string;
    version: number;
};

export type SocialWeek = {
    _id: string;
    weekOf: string;
    generatedAt: string;
    posts: SocialPost[];
};

export type SocialContent = {
    _id: string;
    kind: 'howto' | 'cuts' | 'fact' | 'trivia' | 'tip' | 'recipe';
    title: string;
    body?: string;
    items?: string[];
    ingredients?: string[];
    photo?: string;
    animal?: string;
    iconId?: string;
    active?: boolean;
    lastUsed?: string | null;
    seedKey?: string;
};

export type SocialSettings = {
    frequency: 'daily' | 'alternate' | 'weekdays' | 'custom';
    customDays?: string[];
    postTime: string;
    platforms: Platform[];
    notifyEmails: string[];
    requireApproval: boolean;
    verificationCadence?: 'daily' | 'weekly' | 'monthly';
    defaultVerifier?: string;
    customWords: string[];
};

export const DEFAULT_SETTINGS: SocialSettings = {
    frequency: 'alternate',
    customDays: [],
    postTime: '11:00',
    platforms: ['instagram', 'facebook', 'x'],
    notifyEmails: [],
    requireApproval: true,
    verificationCadence: 'weekly',
    defaultVerifier: 'Sean Hofherr',
    customWords: [],
};
