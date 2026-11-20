let cachedWebGLSupport: boolean | null = null;

/**
 * Safely checks whether the current browser can create a WebGL context
 * without throwing or spamming THREE.WebGLRenderer errors in headless / no-GPU environments.
 */
export function isWebGLSupported(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (cachedWebGLSupport !== null) return cachedWebGLSupport;

    try {
        const canvas = document.createElement('canvas');
        const gl =
            canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
            canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
            canvas.getContext('experimental-webgl');

        if (!gl) {
            cachedWebGLSupport = false;
            return false;
        }

        // Release the probe context immediately so we don't consume a browser WebGL context slot
        const loseCtx = (gl as WebGLRenderingContext).getExtension?.('WEBGL_lose_context');
        loseCtx?.loseContext();

        cachedWebGLSupport = true;
        return true;
    } catch {
        cachedWebGLSupport = false;
        return false;
    }
}

