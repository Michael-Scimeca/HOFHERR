/**
 * Root loading.tsx — Shown during Next.js route transitions.
 * Renders a minimal skeleton that matches the site's dark theme
 * with a subtle shimmer animation to signal loading progress.
 */
export default function RootLoading() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                animation: 'fadeIn 0.3s ease both',
            }}>
                {/* Pulsing logo mark */}
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '3px solid var(--border)',
                    borderTopColor: 'var(--red)',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--fg-muted)',
                }}>
                    Loading
                </span>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}
