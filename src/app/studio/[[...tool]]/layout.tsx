export const metadata = { title: 'Hofherr Meat Co. — Sanity Studio' };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <style>{`
                header:has(.logo), footer:has(a[href="/"]) { display: none !important; }
                main { padding: 0 !important; margin: 0 !important; }
                body { overflow: auto !important; }
            `}</style>
            {children}
        </>
    );
}
