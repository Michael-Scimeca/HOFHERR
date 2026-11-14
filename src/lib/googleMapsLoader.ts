/* Shared Google Maps JS loader — loads the script once for every themed map on the site. */
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

let loadPromise: Promise<void> | null = null;
let authFailed = false;
const authFailureSubs = new Set<() => void>();

export function loadGoogleMaps(): Promise<void> {
    if (!loadPromise) {
        if (typeof window !== 'undefined') {
            /* Google calls this global when the key is rejected (bad key, referrer not allowed, billing). */
            (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
                authFailed = true;
                authFailureSubs.forEach((fn) => fn());
            };
        }
        setOptions({ key: GOOGLE_MAPS_KEY, v: 'weekly' });
        loadPromise = importLibrary('maps').then(() => {});
    }
    return loadPromise;
}

/** Run `cb` if Google rejects the API key (now or later). Returns an unsubscribe function. */
export function onGoogleMapsAuthFailure(cb: () => void): () => void {
    if (authFailed) {
        cb();
        return () => {};
    }
    authFailureSubs.add(cb);
    return () => {
        authFailureSubs.delete(cb);
    };
}

export interface MapPinOverlayOptions {
    map: google.maps.Map;
    position: google.maps.LatLngLiteral;
    title: string;
    iconUrl: string;
    size: number;
    onClick?: () => void;
}

export interface MapPinOverlayHandle {
    update: (next: Partial<Omit<MapPinOverlayOptions, 'map'>>) => void;
    destroy: () => void;
}

/**
 * Renders a custom DOM pin anchored at bottom-center via `google.maps.OverlayView`.
 * Avoids the deprecated `google.maps.Marker` class while preserving inline JSON
 * `styles` on `google.maps.Map` (which `AdvancedMarkerElement` + `mapId` disables).
 */
export function createMapPinOverlay(initial: MapPinOverlayOptions): MapPinOverlayHandle {
    const state = {
        position: initial.position,
        title: initial.title,
        iconUrl: initial.iconUrl,
        size: initial.size,
        onClick: initial.onClick,
    };

    class CustomPinOverlay extends google.maps.OverlayView {
        private button: HTMLButtonElement | null = null;
        private img: HTMLImageElement | null = null;
        private handleClick = () => {
            state.onClick?.();
        };

        override onAdd(): void {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hofherr-map-pin';
            btn.title = state.title;
            btn.setAttribute('aria-label', state.title);
            btn.style.setProperty('--pin-size', `${state.size}px`);
            btn.addEventListener('click', this.handleClick);

            const image = document.createElement('img');
            image.className = 'hofherr-map-pin-img';
            image.src = state.iconUrl;
            image.alt = '';
            image.draggable = false;
            image.decoding = 'async';
            btn.appendChild(image);

            google.maps.OverlayView.preventMapHitsAndGesturesFrom(btn);
            this.getPanes()?.overlayMouseTarget.appendChild(btn);

            this.button = btn;
            this.img = image;
        }

        override draw(): void {
            if (!this.button) return;
            const projection = this.getProjection();
            if (!projection) return;
            const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(state.position));
            if (!point) return;
            this.button.style.setProperty('--pin-x', `${point.x}px`);
            this.button.style.setProperty('--pin-y', `${point.y}px`);
        }

        override onRemove(): void {
            if (this.button) {
                this.button.removeEventListener('click', this.handleClick);
                this.button.remove();
                this.button = null;
            }
            this.img = null;
        }

        syncDom(): void {
            if (this.button) {
                this.button.title = state.title;
                this.button.setAttribute('aria-label', state.title);
                this.button.style.setProperty('--pin-size', `${state.size}px`);
            }
            if (this.img && this.img.getAttribute('src') !== state.iconUrl) {
                this.img.src = state.iconUrl;
            }
            this.draw();
        }
    }

    const overlay = new CustomPinOverlay();
    overlay.setMap(initial.map);

    return {
        update(next) {
            if (next.position) state.position = next.position;
            if (next.title !== undefined) state.title = next.title;
            if (next.iconUrl !== undefined) state.iconUrl = next.iconUrl;
            if (next.size !== undefined) state.size = next.size;
            if ('onClick' in next) state.onClick = next.onClick;
            overlay.syncDom();
        },
        destroy() {
            overlay.setMap(null);
        },
    };
}
