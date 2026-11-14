/** Dev-only "border colours" overlay on/off state, shared across pages via localStorage. */
const KEY = 'hofherr_dev_border_colors_v1';
const EVENT = 'hofherr:border-colors';

export function subscribeBorderColors(onChange: () => void): () => void {
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
        window.removeEventListener(EVENT, onChange);
        window.removeEventListener('storage', onChange);
    };
}

export function getBorderColors(): boolean {
    try {
        return window.localStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
}

export function getBorderColorsServer(): boolean {
    return false;
}

export function toggleBorderColors(): void {
    try {
        window.localStorage.setItem(KEY, getBorderColors() ? '0' : '1');
    } catch {
        /* storage unavailable — overlay simply stays off */
    }
    window.dispatchEvent(new Event(EVENT));
}
