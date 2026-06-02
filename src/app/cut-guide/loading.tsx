/**
 * Cut Guide loading skeleton.
 */
export default function CutGuideLoading() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            background: 'var(--bg)',
            padding: '100px 24px 48px',
            maxWidth: 1200,
            margin: '0 auto',
        }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ ...shimmer, width: 100, height: 12, margin: '0 auto 16px' }} />
                <div style={{ ...shimmer, width: 280, height: 36, margin: '0 auto 12px' }} />
                <div style={{ ...shimmer, width: 500, height: 16, margin: '0 auto' }} />
            </div>

            {/* Animal tabs skeleton */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ ...shimmer, width: 90, height: 36, borderRadius: 20 }} />
                ))}
            </div>

            {/* Cut cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{
                        ...shimmer,
                        height: 100,
                        borderRadius: 10,
                        animationDelay: `${i * 0.07}s`,
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
