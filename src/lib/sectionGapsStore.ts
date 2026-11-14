/** Dev-only "section gaps" overlay on/off state, shared across pages via localStorage. */
const KEY = 'hofherr_dev_section_gaps_v1';
const EVENT = 'hofherr:section-gaps';
/** On by default while developing locally; never on by default in production. */
const DEFAULT_ON = process.env.NODE_ENV === 'development';

export function subscribeSectionGaps(onChange: () => void): () => void {
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
        window.removeEventListener(EVENT, onChange);
        window.removeEventListener('storage', onChange);
    };
}

export function getSectionGaps(): boolean {
    try {
        const stored = window.localStorage.getItem(KEY);
        return stored === null ? DEFAULT_ON : stored === '1';
    } catch {
        return DEFAULT_ON;
    }
}

export function getSectionGapsServer(): boolean {
    return false;
}

export function toggleSectionGaps(): void {
    try {
        window.localStorage.setItem(KEY, getSectionGaps() ? '0' : '1');
    } catch {
        /* storage unavailable — overlay simply stays off */
    }
    window.dispatchEvent(new Event(EVENT));
}
