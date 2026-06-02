/**
 * Catering page loading skeleton.
 */
export default function CateringLoading() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            background: 'var(--bg)',
            padding: '100px 24px 48px',
            maxWidth: 1200,
            margin: '0 auto',
        }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ ...shimmer, width: 120, height: 12, margin: '0 auto 16px' }} />
                <div style={{ ...shimmer, width: 360, height: 40, margin: '0 auto 12px' }} />
                <div style={{ ...shimmer, width: 500, height: 18, margin: '0 auto' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{
                        ...shimmer,
                        height: 220,
                        borderRadius: 10,
                        animationDelay: `${i * 0.1}s`,
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
