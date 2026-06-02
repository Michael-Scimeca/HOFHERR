/**
 * Online Orders loading skeleton — matches the split layout
 * (sidebar + product grid) so the transition feels instant.
 */
export default function OnlineOrdersLoading() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            background: 'var(--bg)',
            padding: '100px 24px 48px',
            maxWidth: 1200,
            margin: '0 auto',
        }}>
            {/* Header skeleton */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ ...shimmer, width: 220, height: 14, marginBottom: 12 }} />
                <div style={{ ...shimmer, width: 400, height: 36, marginBottom: 8 }} />
                <div style={{ ...shimmer, width: 300, height: 16 }} />
            </div>

            {/* Store toggle skeleton */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                <div style={{ ...shimmer, width: 160, height: 44, borderRadius: 8 }} />
                <div style={{ ...shimmer, width: 160, height: 44, borderRadius: 8 }} />
            </div>

            {/* Grid skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{
                        ...shimmer,
                        height: 120,
                        borderRadius: 10,
                        animationDelay: `${i * 0.08}s`,
                    }} />
                ))}
            </div>

            <style>{shimmerCSS}</style>
        </div>
    );
}

const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading-shimmer 1.5s ease-in-out infinite',
    borderRadius: 6,
};

const shimmerCSS = `
    @keyframes loading-shimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
    }
`;
