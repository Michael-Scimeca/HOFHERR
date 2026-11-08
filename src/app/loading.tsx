/**
 * Root loading.tsx — Shown during Next.js route transitions.
 * Intentionally blank (no skeleton boxes / spinner) so the page-transition
 * fade in PageTransition.tsx is the only visual between routes.
 */
export default function RootLoading() {
    return <div className="route-loading" aria-busy="true" />;
}
