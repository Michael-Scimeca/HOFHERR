/* ─────────────────────────────────────────────────────────────
   Hofherr map theme — Snazzy Maps / Google Maps style JSON,
   colored from the design tokens in src/app/globals.css.
   Paste HOFHERR_MAP_STYLE into snazzymaps.com/editor to tweak.
   ───────────────────────────────────────────────────────────── */

/** Brand tokens (mirror of :root in globals.css) */
export const MAP_TOKENS = {
    red: '#CC0E1D',
    redDark: '#a00b17',
    gold: '#A8905F',
    goldDark: '#8a7349',
    goldLight: '#c4ae82',
    dark: '#000000',
    light: '#F2F2F2',
    text2: '#cccccc',
    text3: '#999999',
    textMuted: '#666666',
} as const;

const T = MAP_TOKENS;

export const HOFHERR_MAP_STYLE: google.maps.MapTypeStyle[] = [
    /* Base */
    { elementType: 'geometry', stylers: [{ color: '#0b0b0b' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: T.text3 }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: T.dark }, { weight: 3 }] },

    /* Administrative — gold hairlines, light town names */
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: T.goldDark }, { weight: 0.6 }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: T.light }] },
    { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: T.textMuted }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },

    /* Landscape */
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0b0b0b' }] },
    { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#101010' }] },

    /* Points of interest — quiet, parks get a warm gold-black */
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#121212' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: T.textMuted }] },
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#16130c' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: T.goldDark }] },

    /* Roads — charcoal streets, gold highways */
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e1e1e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: T.dark }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: T.textMuted }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: T.text2 }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: T.goldDark }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1a150c' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: T.goldLight }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: T.gold }] },

    /* Transit — rail in gold (the Depot sits on the Metra line) */
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: T.goldDark }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: T.goldLight }] },

    /* Water — brand red, pushed almost to black */
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#22060a' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: T.redDark }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: T.dark }] },
];
